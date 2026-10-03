import { z } from 'zod';
import { todayInVietnam } from './policy';

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function isHttpUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value) || value !== value.trim() || /[\u0000-\u0020\u007f\\]/.test(value)) return false;
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

const text = z.string({ error: 'cần chuỗi ký tự' }).trim().min(1, 'không được để trống');
const date = z.string({ error: 'cần chuỗi ngày có dấu nháy YYYY-MM-DD' }).refine(isCalendarDate, 'cần ngày lịch thực theo YYYY-MM-DD');
const url = z.string().refine(isHttpUrl, 'cần URL HTTP(S) tuyệt đối, có hostname, không credentials');
const blank = (value: unknown) => value === null || value === '' ? undefined : value;
const optional = <T extends z.ZodType>(schema: T) => z.preprocess(blank, schema.optional());
const supportedCurrencies = new Set(Intl.supportedValuesOf('currency'));

export function createJobSchema(today = todayInVietnam()) {
  return z.object({
    title: text,
    company: text,
    location: text,
    workType: z.enum(['Remote', 'Hybrid', 'On-site']),
    employmentType: text,
    salaryMin: optional(z.number().nonnegative()),
    salaryMax: optional(z.number().nonnegative()),
    currency: optional(z.string().refine(v => supportedCurrencies.has(v), 'cần mã tiền tệ ISO 4217 được hỗ trợ, ví dụ VND hoặc USD')),
    salaryPeriod: optional(z.enum(['hour', 'day', 'month', 'year', 'project'])),
    category: text,
    sourceName: text,
    sourceUrl: url,
    applyUrl: url,
    publishedDate: date,
    expirationDate: optional(date),
    tags: z.array(text).default([]),
    skills: z.array(text).default([]),
    openings: optional(z.number().int().positive()),
    featured: z.boolean().default(false),
    sponsored: z.boolean().default(false),
    draft: z.boolean({ error: 'draft phải là boolean true hoặc false và bắt buộc khai báo' }),
    status: z.enum(['active', 'expired', 'archived']).default('active'),
    sample: z.boolean().default(false),
    summary: optional(text),
  }).strict().superRefine((job, ctx) => {
    const error = (field: string, message: string) => ctx.addIssue({ code: 'custom', path: [field], message });
    if (job.expirationDate && job.expirationDate < job.publishedDate) error('expirationDate', 'không được trước publishedDate');
    if (!job.draft && job.publishedDate > today) error('publishedDate', 'ngày tương lai chỉ được phép trong draft');
    if (job.salaryMin !== undefined && job.salaryMax !== undefined && job.salaryMin > job.salaryMax) error('salaryMax', 'phải lớn hơn hoặc bằng salaryMin');
    if (job.salaryMin !== undefined || job.salaryMax !== undefined) {
      if (!job.currency) error('currency', 'bắt buộc khi có lương');
      if (!job.salaryPeriod) error('salaryPeriod', 'bắt buộc khi có lương');
    }
  });
}

export const jobSchema = createJobSchema();
export type JobData = z.infer<typeof jobSchema>;
export interface Job { id: string; data: JobData; body: string; }
