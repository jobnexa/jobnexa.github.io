import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { createJobSchema, type Job } from './schema';
import { validateMarkdown } from './markdown';

export interface Diagnostic { file: string; field: string; message: string; }
export interface ValidationReport { jobs: Job[]; errors: Diagnostic[]; warnings: Diagnostic[]; }
export interface ValidationOptions { today?: string; }
const display = (file: string) => path.relative(process.cwd(), file).split(path.sep).join('/') || file;

export async function parseJobFile(file: string, options: ValidationOptions = {}): Promise<ValidationReport> {
  const result: ValidationReport = { jobs: [], errors: [], warnings: [] };
  const error = (field: string, message: string) => result.errors.push({ file: display(file), field, message });
  const id = path.basename(file, path.extname(file));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || path.extname(file) !== '.md') error('filename', 'tên file cần chữ thường ASCII, số, gạch ngang và đuôi .md');
  try {
    const source = await readFile(file, 'utf8');
    if (!/^\uFEFF?---\r?\n/.test(source)) error('frontmatter', 'cần frontmatter YAML giữa hai dòng ---');
    const parsed = matter(source.replace(/^\uFEFF/, ''));
    const metadata = createJobSchema(options.today).safeParse(parsed.data);
    if (!metadata.success) {
      for (const issue of metadata.error.issues) {
        if (issue.code === 'unrecognized_keys') {
          for (const key of issue.keys) error(key, 'trường không được nhận diện; kiểm tra lỗi gõ nhầm');
        } else error(issue.path.map(String).join('.') || 'frontmatter', issue.message);
      }
    }
    for (const message of validateMarkdown(parsed.content)) error('body', message);
    if (metadata.success && !result.errors.length) result.jobs.push({ id, data: metadata.data, body: parsed.content });
  } catch (cause) { error('YAML', cause instanceof Error ? cause.message : String(cause)); }
  return result;
}

export async function validateJobsDirectory(directory: string, options: ValidationOptions = {}): Promise<ValidationReport> {
  const report: ValidationReport = { jobs: [], errors: [], warnings: [] };
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (cause) {
    report.errors.push({ file: display(directory), field: 'directory', message: `không đọc được thư mục: ${String(cause)}` });
    return report;
  }
  const ids = new Map<string, string>();
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory() || !/\.md$/i.test(entry.name)) {
      report.errors.push({ file: display(file), field: 'filename', message: 'collection chỉ hỗ trợ file .md trực tiếp, không thư mục con hoặc MDX' });
      continue;
    }
    const id = entry.name.slice(0, -3).toLowerCase();
    if (ids.has(id)) report.errors.push({ file: display(file), field: 'filename', message: `trùng slug (không phân biệt hoa thường) với ${ids.get(id)}` });
    else ids.set(id, display(file));
    const parsed = await parseJobFile(file, options);
    report.jobs.push(...parsed.jobs);
    report.errors.push(...parsed.errors);
  }
  const urls = new Map<string, string>();
  const positions = new Map<string, string>();
  for (const job of report.jobs) {
    const file = display(path.join(directory, `${job.id}.md`));
    const key = new URL(job.data.applyUrl).href;
    if (urls.has(key)) report.warnings.push({ file, field: 'applyUrl', message: `cùng URL với ${urls.get(key)}; đối chiếu để tránh đăng trùng` });
    else urls.set(key, file);
    const position = [job.data.title, job.data.company, job.data.location].map(v => v.normalize('NFKC').toLocaleLowerCase('vi').trim()).join('|');
    if (positions.has(position)) report.warnings.push({ file, field: 'title/company/location', message: `cùng vị trí với ${positions.get(position)}` });
    else positions.set(position, file);
  }
  return report;
}

export function formatDiagnostic(issue: Diagnostic): string {
  return `${issue.file} → ${issue.field} → ${issue.message}`;
}
