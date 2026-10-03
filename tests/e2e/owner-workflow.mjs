import { mkdir, cp, readFile, writeFile, readdir, symlink, unlink } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

// Build-only integration test. All simulated public jobs stay in an isolated copy.
const root = path.resolve(import.meta.dirname, '../..');
const npmCli = process.env.npm_execpath || (process.platform === 'win32' ? path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js') : '');
if (!npmCli) throw new Error('Chạy qua npm run test:owner để xác định npm CLI.');
const scratch = path.join(root, 'qa/tmp', `owner-${Date.now()}`);
const logs = path.join(root, 'qa/build-logs');
await mkdir(scratch, { recursive: true });
await mkdir(logs, { recursive: true });
for (const file of ['src', 'scripts', 'templates', 'tests/fixtures', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json', 'public']) {
  await cp(path.join(root, file), path.join(scratch, file), { recursive: true });
}
await symlink(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
const jobs = path.join(scratch, 'src/content/jobs');
const dist = path.join(scratch, 'dist');
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const previous = new Date(`${today}T00:00:00Z`); previous.setUTCDate(previous.getUTCDate() - 1);
const yesterday = previous.toISOString().slice(0, 10);
const template = await readFile(path.join(scratch, 'templates/job-template.md'), 'utf8');
const target = path.join(jobs, 'owner-test.md');
const report = { startedAt: new Date().toISOString(), scratch, fixtureNotice: 'SAMPLE DEVELOPMENT DATA, isolated only, never deployed', steps: [] };
let serial = 0;
let base = '/';
async function hashSources(folder) {
  const hashes = {};
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const p = path.join(folder, entry.name);
    if (entry.isDirectory()) Object.assign(hashes, await hashSources(p));
    else hashes[path.relative(scratch, p)] = createHash('sha256').update(await readFile(p)).digest('hex');
  }
  return hashes;
}
const sourceBefore = await hashSources(path.join(scratch, 'src'));
const html = async (p) => readFile(path.join(dist, p), 'utf8');
const detailPath = 'jobs/owner-test/index.html';
async function missing(p) { await assert.rejects(readFile(path.join(dist, p)), { code: 'ENOENT' }); }
async function build(label, expected = 0, extraEnv = {}) {
  const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', INCLUDE_SAMPLES: '', SITE_URL: 'https://qa.example', BASE_PATH: base, ...extraEnv };
  const proc = spawnSync(process.execPath, [npmCli, 'run', 'build'], { cwd: scratch, env, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
  const filename = `${String(++serial).padStart(2, '0')}-${label}.log`;
  await writeFile(path.join(logs, filename), `${proc.stdout ?? ''}\n${proc.stderr ?? ''}`);
  assert.equal(proc.status, expected, `${label}: unexpected exit ${proc.status}; see ${filename}`);
  report.steps.push({ label, exitCode: proc.status, log: `qa/build-logs/${filename}` });
  console.log(`PASS build ${serial}: ${label}`);
}
function fill(overrides = {}) {
  const values = { title: 'SAMPLE — Kỹ sư dữ liệu', company: 'SAMPLE — Công ty Một', location: 'Đà Nẵng', category: 'Dữ liệu', sourceName: 'SAMPLE — Nguồn kiểm thử', sourceUrl: 'https://example.com/source/owner', applyUrl: 'https://example.com/apply/old', publishedDate: '2026-01-01', skills: ['Python', 'SQL'], openings: 3, draft: false, sample: false, ...overrides };
  let content = template;
  for (const [field, value] of Object.entries(values)) content = content.replace(new RegExp(`^${field}:.*$`, 'm'), `${field}: ${JSON.stringify(value)}`);
  content = content.slice(0, content.indexOf('\n---', 4) + 4);
  return `${content}\n\nSAMPLE / DEVELOPMENT DATA. Chỉ dùng trong bản sao kiểm thử.\n\n## Yêu cầu\n\n- Phân tích dữ liệu\n- Giao tiếp\n\n**Nội dung kiểm thử Markdown**\n\n[Đọc nguồn](https://example.com/source/owner)\n`;
}
async function save(values = {}) { await writeFile(target, fill(values)); }
async function assertHidden() {
  await missing(detailPath);
  for (const p of ['index.html', 'jobs/index.html', 'search-index.json', 'sitemap.xml']) assert.ok(!(await html(p)).includes('owner-test'), `leaked owner-test in ${p}`);
}
async function assertExpired() {
  const detail = await html(detailPath);
  assert.match(detail, /expired/i);
  assert.match(detail, /noindex/);
  assert.ok(!detail.includes('data-apply-cta'));
  for (const p of ['index.html', 'jobs/index.html', 'search-index.json', 'sitemap.xml']) assert.ok(!(await html(p)).includes('owner-test'), `expired leaked in ${p}`);
}

try {
  await save(); await build('add-from-template');
  assert.match(await html('jobs/index.html'), /Kỹ sư dữ liệu/);
  assert.match(await html(detailPath), /href="https:\/\/example.com\/apply\/old"/);
  assert.match(await html(detailPath), /<h2[^>]*>Yêu cầu<\/h2>/);
  assert.match(await html(detailPath), /<strong>Nội dung kiểm thử Markdown<\/strong>/);
  assert.match(await html('search-index.json'), /Dữ liệu/);
  const firstIndex = JSON.parse(await html('search-index.json'));
  assert.deepEqual(firstIndex.find(job => job.id === 'owner-test')?.skills, ['Python', 'SQL']);
  assert.match(await html('jobs/index.html'), /3 openings/);
  await save({ applyUrl: 'https://example.com/apply/new' }); await build('change-apply-url');
  assert.match(await html(detailPath), /https:\/\/example.com\/apply\/new/);
  assert.ok(!(await html(detailPath)).includes('https://example.com/apply/old'));
  await save({ draft: true }); await build('draft-hidden'); await assertHidden();
  await save(); await build('restore-active'); assert.match(await html(detailPath), /data-apply-cta/);
  await save({ status: 'expired' }); await build('explicit-expired'); await assertExpired();
  await save({ expirationDate: yesterday }); await build('date-expired'); await assertExpired();
  await save({ expirationDate: today }); await build('expiry-today-active'); assert.match(await html(detailPath), /data-apply-cta/);
  await save({ status: 'archived' }); await build('archived-hidden'); await assertHidden();
  await unlink(target); await build('delete-hidden'); await assertHidden();
  await save({ sample: true }); await build('sample-excluded'); await assertHidden();
  await save({ applyUrl: 'javascript:alert(1)' }); await build('invalid-content-blocked', 1);
  await save(); await build('sample-flag-production-blocked', 1, { INCLUDE_SAMPLES: '1' });
  await save({ publishedDate: today });
  await writeFile(path.join(jobs, 'second-test.md'), fill({ title: 'SAMPLE — Thiết kế giao diện', company: 'SAMPLE — Công ty Hai', location: 'Hà Nội', category: 'Thiết kế', workType: 'Hybrid', publishedDate: yesterday, applyUrl: 'https://example.com/second' }));
  await writeFile(path.join(jobs, 'expired-test.md'), fill({ title: 'SAMPLE — Tin hết hạn', status: 'expired', applyUrl: 'https://example.com/expired' }));
  for (const [id, overrides] of [['hidden-draft', { draft: true }], ['hidden-archive', { status: 'archived' }], ['hidden-sample', { sample: true }]]) {
    await writeFile(path.join(jobs, `${id}.md`), fill({ title: `SAMPLE — ${id}`, ...overrides }));
  }
  base = '/ten-repo/'; await build('subpath-public-artifact');
  for (const p of ['index.html', 'jobs/index.html', detailPath, 'about/index.html', 'disclaimer/index.html', '404.html']) {
    const content = await html(p);
    for (const match of content.matchAll(/(?:href|src)="(\/[^" ]*)"/g)) assert.ok(match[1].startsWith(base), `${p}: non-base path ${match[1]}`);
  }
  assert.match(await html(detailPath), /https:\/\/qa.example\/ten-repo\/jobs\/owner-test\//);
  assert.match(await html('robots.txt'), /https:\/\/qa.example\/ten-repo\/sitemap.xml/);
  for (const id of ['hidden-draft', 'hidden-archive', 'hidden-sample']) {
    await missing(`jobs/${id}/index.html`);
    for (const p of ['index.html', 'jobs/index.html', 'search-index.json', 'sitemap.xml']) assert.ok(!(await html(p)).includes(id), `${id} leak in ${p}`);
  }
  assert.ok(!(await html('sitemap.xml')).includes('expired-test'));
  assert.match(await html('jobs/expired-test/index.html'), /noindex/);
  const sourceAfter = await hashSources(path.join(scratch, 'src'));
  for (const [key, hash] of Object.entries(sourceBefore)) if (!key.includes(`content${path.sep}jobs`)) assert.equal(sourceAfter[key], hash, `source unexpectedly changed: ${key}`);
  report.finishedAt = new Date().toISOString(); report.status = 'PASS'; report.today = today; report.base = base;
} catch (error) {
  report.status = 'FAIL'; report.error = String(error); process.exitCode = 1;
} finally {
  await writeFile(path.join(root, 'qa/owner-workflow.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
