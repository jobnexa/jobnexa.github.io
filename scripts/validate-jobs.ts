import { resolve } from 'node:path';
import { validateJobsDirectory, formatDiagnostic } from '../src/lib/content/validation';

if (process.env.INCLUDE_SAMPLES && process.env.INCLUDE_SAMPLES !== '0' && process.env.INCLUDE_SAMPLES !== 'false') {
  console.error('INCLUDE_SAMPLES chỉ được bật qua npm run dev:samples; không cho phép production build.');
  process.exitCode = 1;
} else {
  const directory = resolve(process.argv[2] || 'src/content/jobs');
  const report = await validateJobsDirectory(directory);
  for (const issue of report.errors) console.error(formatDiagnostic(issue));
  for (const issue of report.warnings) console.warn(`CẢNH BÁO: ${formatDiagnostic(issue)}`);
  console.log(`Đã kiểm tra ${report.jobs.length} file hợp lệ; ${report.errors.length} lỗi; ${report.warnings.length} cảnh báo.`);
  if (report.errors.length) process.exitCode = 1;
}
