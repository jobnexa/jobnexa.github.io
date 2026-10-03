import { getCollection, type CollectionEntry } from 'astro:content';
import { getPublicationState, todayInVietnam } from './policy';
import type { Job } from './schema';

export const sampleMode = import.meta.env.DEV && process.env.INCLUDE_SAMPLES === '1';

export function entryToJob(entry: CollectionEntry<'jobs'>): Job {
  return { id: entry.id, data: entry.data, body: entry.body ?? '' };
}

export async function getPublicEntries() {
  const today = todayInVietnam();
  return (await getCollection('jobs'))
    .filter(entry => getPublicationState(entry, today, { allowSamples: sampleMode }) !== 'hidden')
    .sort((a, b) => b.data.publishedDate.localeCompare(a.data.publishedDate) || a.id.localeCompare(b.id));
}

export async function getPublicJobs(): Promise<Job[]> {
  return (await getPublicEntries()).map(entryToJob);
}

export async function getActiveJobs(): Promise<Job[]> {
  const today = todayInVietnam();
  return (await getPublicJobs()).filter(job => getPublicationState(job, today, { allowSamples: sampleMode }) === 'active');
}
