import type { Job } from './schema';
import { markdownPlainText } from './markdown';
import { withBase } from '../urls';
import { getJobSkills } from './recommendations';

export interface SearchRecord {
  id: string; title: string; company: string; location: string;
  workType: Job['data']['workType']; employmentType: string; category: string;
  tags: string[]; skills: string[]; openings?: number; description: string; publishedDate: string; expirationDate?: string;
  url: string; featured: boolean;
}

export function toSearchRecord(job: Job): SearchRecord {
  const d = job.data;
  return {
    id: job.id, title: d.title, company: d.company, location: d.location,
    workType: d.workType, employmentType: d.employmentType, category: d.category,
    tags: d.tags, skills: getJobSkills(d), openings: d.openings,
    description: markdownPlainText(job.body), publishedDate: d.publishedDate,
    expirationDate: d.expirationDate, url: withBase(`/jobs/${job.id}/`), featured: d.featured,
  };
}
