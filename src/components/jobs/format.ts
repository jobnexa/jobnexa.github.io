import type { JobData } from '../../lib/content/schema';

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words.slice(0, 2).map((word) => word[0]).join('') : words[0]?.slice(0, 2) ?? '?';
  return letters.toLocaleUpperCase('en');
}

export function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function formatSalary(data: JobData): string | undefined {
  const { salaryMin, salaryMax, currency, salaryPeriod } = data;
  if (salaryMin === undefined && salaryMax === undefined) return undefined;
  const money = (amount: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount);
  const amount = salaryMin !== undefined && salaryMax !== undefined
    ? `${money(salaryMin)}–${money(salaryMax)}`
    : salaryMin !== undefined ? `From ${money(salaryMin)}` : `Up to ${money(salaryMax!)}`;
  const period: Record<string, string> = { hour: 'hour', day: 'day', month: 'month', year: 'year', project: 'project' };
  return `${amount} ${currency ?? ''} / ${period[salaryPeriod ?? ''] ?? salaryPeriod ?? ''}`.trim();
}

export function outboundHost(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return ''; }
}
