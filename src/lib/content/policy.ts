import type { Job } from './schema';

export type PublicationState = 'hidden' | 'active' | 'expired';

export function todayInVietnam(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (name: string) => parts.find(p => p.type === name)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function getPublicationState(
  job: Pick<Job, 'data'>,
  today = todayInVietnam(),
  { allowSamples = false }: { allowSamples?: boolean } = {},
): PublicationState {
  const d = job.data;
  if (d.draft || d.status === 'archived' || (d.sample && !allowSamples) || d.publishedDate > today) return 'hidden';
  if (d.status === 'expired' || (d.expirationDate && d.expirationDate < today)) return 'expired';
  return 'active';
}
