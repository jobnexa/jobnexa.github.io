import assert from 'node:assert/strict';
import test from 'node:test';
import { createJobSchema } from '../../src/lib/content/schema.ts';
import { getPublicationState } from '../../src/lib/content/policy.ts';
import { getJobSkills, normalizeSkills, rankRecommendedJobs, type RecommendableJob } from '../../src/lib/content/recommendations.ts';

const today = '2026-10-03';
const job = (id: string, skills: string[], publishedDate = '2026-10-01'): RecommendableJob => ({ id, skills, publishedDate });
const metadata = {
  title: 'SAMPLE — Data Analyst', company: 'SAMPLE — Example', location: 'Remote',
  workType: 'Remote', employmentType: 'Full-time', category: 'Data', sourceName: 'SAMPLE source',
  sourceUrl: 'https://example.com/source', applyUrl: 'https://example.com/apply',
  publishedDate: '2026-10-01', draft: false,
};

test('skill identities deduplicate case, compatibility characters, and whitespace without fuzzy matching', () => {
  assert.deepEqual(normalizeSkills([' SQL ', 'sql', 'ＳＱＬ', 'Data   Analysis', 'data analysis', '', '  ']), ['SQL', 'Data Analysis']);
  assert.deepEqual(getJobSkills({ skills: ['React'], tags: ['SQL'] }), ['React']);
  assert.deepEqual(getJobSkills({ skills: [], tags: ['SQL', 'sql', ' Python '] }), ['SQL', 'Python']);
  assert.deepEqual(getJobSkills({ tags: ['Excel'] }), ['Excel']);
  assert.equal(rankRecommendedJobs([job('javascript', ['JavaScript'])], ['Java'], today).length, 0);
});

test('empty selections, no-match selections, empty jobs and empty skill lists produce no recommendations', () => {
  assert.deepEqual(rankRecommendedJobs([job('one', ['SQL'])], [], today), []);
  assert.deepEqual(rankRecommendedJobs([job('one', ['SQL'])], ['Figma'], today), []);
  assert.deepEqual(rankRecommendedJobs([], ['SQL'], today), []);
  assert.deepEqual(rankRecommendedJobs([job('empty', [])], ['SQL'], today), []);
});

test('partial and full matches expose exact skill counts and canonical listing names', () => {
  const records = [job('partial', ['SQL', 'Python', 'Data Analysis']), job('full', ['SQL', 'Python']), job('none', ['Figma'])];
  const ranked = rankRecommendedJobs(records, ['python', 'SQL', 'sql', ' Python '], today);
  assert.deepEqual(ranked.map(item => item.job.id), ['full', 'partial']);
  assert.deepEqual(ranked[0].matchedSkills, ['SQL', 'Python']);
  assert.equal(ranked[0].matchedCount, 2);
  assert.equal(ranked[0].totalSkills, 2);
  assert.equal(ranked[0].coverage, 1);
  assert.equal(ranked[1].matchedCount, 2);
  assert.equal(ranked[1].totalSkills, 3);
  assert.equal(ranked[1].coverage, 2 / 3);
});

test('repeated listing skills cannot inflate matching counts or denominator', () => {
  const [match] = rankRecommendedJobs([job('repeat', ['SQL', 'sql', ' Python ', 'python'])], ['SQL', 'sql', 'Python'], today);
  assert.equal(match.matchedCount, 2);
  assert.equal(match.totalSkills, 2);
  assert.deepEqual(match.matchedSkills, ['SQL', 'Python']);
});

test('match count ranks first, then coverage, newest date, and stable id independent of input order', () => {
  const records = [
    job('z-last', ['SQL'], '2026-10-03'),
    job('a-first', ['SQL'], '2026-10-03'),
    job('old-full', ['SQL'], '2026-09-01'),
    job('new-partial', ['SQL', 'Excel'], '2026-10-03'),
    job('two-matches', ['SQL', 'Python', 'Excel', 'Figma'], '2026-09-01'),
  ];
  const expected = ['two-matches', 'a-first', 'z-last', 'old-full', 'new-partial'];
  assert.deepEqual(rankRecommendedJobs(records, ['SQL', 'Python'], today).map(item => item.job.id), expected);
  assert.deepEqual(rankRecommendedJobs([...records].reverse(), ['SQL', 'Python'], today).map(item => item.job.id), expected);
});

test('legacy tags work only when no dedicated skills are supplied', () => {
  const legacy = { id: 'legacy', tags: ['SQL', 'Python'], publishedDate: '2026-10-01' };
  const explicit = { id: 'explicit', skills: ['Figma'], tags: ['SQL'], publishedDate: '2026-10-01' };
  assert.deepEqual(rankRecommendedJobs([legacy, explicit], ['SQL'], today).map(item => item.job.id), ['legacy']);
});

test('recommendations recheck expiration and keep the expiration day inclusive', () => {
  const records = [
    { ...job('past', ['SQL']), expirationDate: '2026-10-02' },
    { ...job('today', ['SQL']), expirationDate: today },
    { ...job('future', ['SQL']), expirationDate: '2026-10-04' },
    job('undated', ['SQL']),
  ];
  assert.deepEqual(new Set(rankRecommendedJobs(records, ['SQL'], today).map(item => item.job.id)), new Set(['today', 'future', 'undated']));
  assert.deepEqual(new Set(rankRecommendedJobs(records, ['SQL'], '2026-10-04').map(item => item.job.id)), new Set(['future', 'undated']));
});

test('active publication policy must filter draft, archive, sample and expired before recommendation ranking', () => {
  const schema = createJobSchema(today);
  const entries = [
    { id: 'active', data: schema.parse({ ...metadata, skills: ['SQL'] }), body: 'SAMPLE DATA' },
    { id: 'draft', data: schema.parse({ ...metadata, draft: true, skills: ['SQL'] }), body: 'SAMPLE DATA' },
    { id: 'archived', data: schema.parse({ ...metadata, status: 'archived', skills: ['SQL'] }), body: 'SAMPLE DATA' },
    { id: 'sample', data: schema.parse({ ...metadata, sample: true, skills: ['SQL'] }), body: 'SAMPLE DATA' },
    { id: 'expired', data: schema.parse({ ...metadata, status: 'expired', skills: ['SQL'] }), body: 'SAMPLE DATA' },
  ];
  const active = entries.filter(entry => getPublicationState(entry, today) === 'active');
  const projected = active.map(entry => ({ id: entry.id, ...entry.data }));
  assert.deepEqual(rankRecommendedJobs(projected, ['SQL'], today).map(item => item.job.id), ['active']);
});

test('new metadata remains optional for legacy Markdown and openings require a positive safe integer', () => {
  const schema = createJobSchema(today);
  const legacy = schema.parse(metadata);
  assert.deepEqual(legacy.skills, []);
  assert.equal(legacy.openings, undefined);
  assert.equal(schema.parse({ ...metadata, openings: null }).openings, undefined);
  assert.equal(schema.parse({ ...metadata, openings: 3, skills: ['Python', 'SQL'] }).openings, 3);
  for (const openings of [0, -1, 1.5, '3', true, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(schema.safeParse({ ...metadata, openings }).success, false, String(openings));
  }
  for (const skills of ['Python', [''], [false]]) {
    assert.equal(schema.safeParse({ ...metadata, skills }).success, false);
  }
});
