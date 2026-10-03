import { todayInVietnam } from './policy';

export interface SkillSource { skills?: readonly string[]; tags?: readonly string[]; }
export interface RecommendableJob extends SkillSource {
  id: string;
  publishedDate: string;
  expirationDate?: string;
}
export interface Recommendation<T> {
  job: T;
  matchedSkills: string[];
  matchedCount: number;
  totalSkills: number;
  coverage: number;
}

/** Skill identity is exact after Unicode/whitespace normalization and case folding.
 *  No fuzzy matches, guessed synonyms, profile inference, or network calls.
 */
export function skillKey(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function normalizeSkills(values: readonly string[]): string[] {
  const unique = new Map<string, string>();
  for (const raw of values) {
    const value = raw.normalize('NFKC').trim().replace(/\s+/g, ' ');
    const key = skillKey(value);
    if (key && !unique.has(key)) unique.set(key, value);
  }
  return [...unique.values()];
}

/** Dedicated skills win; legacy Markdown without skills can continue using tags. */
export function getJobSkills(job: SkillSource): string[] {
  const skills = normalizeSkills(job.skills ?? []);
  return skills.length ? skills : normalizeSkills(job.tags ?? []);
}

/** Input must already be public active jobs. Expiry is checked again for live pages. */
export function rankRecommendedJobs<T extends RecommendableJob>(
  jobs: readonly T[],
  selectedSkills: readonly string[],
  today = todayInVietnam(),
): Recommendation<T>[] {
  const selected = new Set(normalizeSkills(selectedSkills).map(skillKey));
  if (!selected.size) return [];
  const matches: Recommendation<T>[] = [];
  for (const job of jobs) {
    if (job.expirationDate && job.expirationDate < today) continue;
    const required = getJobSkills(job);
    const matchedSkills = required.filter(skill => selected.has(skillKey(skill)));
    if (!matchedSkills.length) continue;
    matches.push({
      job,
      matchedSkills,
      matchedCount: matchedSkills.length,
      totalSkills: required.length,
      coverage: matchedSkills.length / required.length,
    });
  }
  return matches.sort((a, b) =>
    b.matchedCount - a.matchedCount ||
    // Cross multiplication avoids rounding when comparing skill coverage.
    b.matchedCount * a.totalSkills - a.matchedCount * b.totalSkills ||
    (a.job.publishedDate === b.job.publishedDate ? 0 : a.job.publishedDate > b.job.publishedDate ? -1 : 1) ||
    (a.job.id === b.job.id ? 0 : a.job.id < b.job.id ? -1 : 1),
  );
}
