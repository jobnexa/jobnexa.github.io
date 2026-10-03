import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { getPublicationState } from '../../src/lib/content/policy.ts';
import { validateJobsDirectory } from '../../src/lib/content/validation.ts';

const root = path.resolve(import.meta.dirname, '../fixtures/jobs');
const today = '2026-10-03';
const byFile = <T extends { file: string }>(items: T[]): Map<string, T> => new Map(items.map((item) => [path.basename(item.file), item]));

test('the eight fixtures validate as sample-only development data', async () => {
  const report = await validateJobsDirectory(path.join(root, 'valid'), { today });
  assert.deepEqual(report.errors, []);
  assert.equal(report.jobs.length, 8);
  assert.deepEqual(report.warnings, []);
  assert.ok(report.jobs.every((job) => job.data.sample === true));
  assert.ok(report.jobs.every((job) => /SAMPLE\s*\/\s*DEVELOPMENT DATA/i.test(job.body)));
  assert.match(report.jobs.find((job) => job.id === 'sample-salary-markdown')!.body, /## Responsibilities/);
});

test('sample visibility follows the shared publication policy', async () => {
  const { jobs, errors } = await validateJobsDirectory(path.join(root, 'valid'), { today });
  assert.deepEqual(errors, []);
  const previewStates = new Map([
    ['sample-active-remote-featured', 'active'],
    ['sample-hybrid', 'active'],
    ['sample-onsite', 'active'],
    ['sample-no-salary', 'active'],
    ['sample-salary-markdown', 'active'],
    ['sample-draft', 'hidden'],
    ['sample-expired', 'expired'],
    ['sample-archived', 'hidden'],
  ]);
  for (const job of jobs) {
    assert.equal(getPublicationState(job, today), 'hidden', `${job.id} must be hidden by default`);
    assert.equal(getPublicationState(job, today, { allowSamples: true }), previewStates.get(job.id), job.id);
  }
});

test('expiration boundaries include the expiration day and leave jobs without dates active', async () => {
  const { jobs, errors } = await validateJobsDirectory(path.join(root, 'valid'), { today });
  assert.deepEqual(errors, []);
  const active = jobs.find((job) => job.id === 'sample-no-salary')!;
  assert.equal(getPublicationState({ data: { ...active.data, expirationDate: today } }, today, { allowSamples: true }), 'active');
  assert.equal(getPublicationState({ data: { ...active.data, expirationDate: today } }, '2026-10-04', { allowSamples: true }), 'expired');
  assert.equal(getPublicationState({ data: { ...active.data, expirationDate: undefined } }, today, { allowSamples: true }), 'active');
  assert.equal(getPublicationState({ data: { ...active.data, status: 'expired' } }, today, { allowSamples: true }), 'expired');
});

test('invalid fixtures remain isolated and public validation reports their errors', async () => {
  const report = await validateJobsDirectory(path.join(root, 'invalid'), { today });
  assert.equal(report.jobs.length, 0);
  const errors = byFile(report.errors);
  const expected = new Map([
    ['bad-yaml.md', 'YAML'], ['empty-body.md', 'body'], ['unknown-field.md', 'remtoe'],
    ['wrong-work-type.md', 'workType'], ['string-boolean.md', 'draft'],
    ['invalid-date-format.md', 'publishedDate'], ['impossible-calendar-date.md', 'publishedDate'],
    ['expiration-before-publication.md', 'expirationDate'], ['future-published-not-draft.md', 'publishedDate'],
    ['unsafe-apply-url.md', 'applyUrl'], ['credentials-in-url.md', 'sourceUrl'], ['malformed-url.md', 'applyUrl'],
    ['malformed-absolute-url-no-slash.md', 'applyUrl'], ['malformed-absolute-url-one-slash.md', 'applyUrl'],
    ['negative-salary.md', 'salaryMin'], ['nan-salary.md', 'salaryMin'], ['salary-min-over-max.md', 'salaryMax'],
    ['salary-missing-currency.md', 'currency'], ['salary-missing-period.md', 'salaryPeriod'],
    ['raw-html-body.md', 'body'], ['unsafe-markdown-link.md', 'body'],
  ]);
  for (const [name, field] of expected) {
    assert.equal(errors.get(name)?.field, field, `${name} should report ${field}`);
  }
});

test('each required field, including the safety draft flag, rejects a missing value', async () => {
  const report = await validateJobsDirectory(path.join(root, 'invalid'), { today });
  const errors = byFile(report.errors);
  const fields = ['title', 'company', 'location', 'employmentType', 'category', 'sourceName', 'sourceUrl', 'applyUrl', 'publishedDate', 'draft'];
  for (const field of fields) {
    assert.equal(errors.get(`missing-${field}.md`)?.field, field, `${field} missing fixture must identify the field`);
  }
});

test('duplicate application URLs produce a warning while valid sample records remain accepted', async (t) => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'jobs-duplicate-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const content = await readFile(path.join(root, 'valid', 'sample-no-salary.md'), 'utf8');
  const shared = 'https://example.com/apply/shared-sample';
  await writeFile(path.join(temp, 'one.md'), content.replace(/^title:.*$/m, 'title: "SAMPLE — Fixture One"').replace(/applyUrl: ".*"/, `applyUrl: "${shared}"`));
  await writeFile(path.join(temp, 'two.md'), content.replace(/^title:.*$/m, 'title: "SAMPLE — Fixture Two"').replace(/applyUrl: ".*"/, `applyUrl: "${shared}"`));
  const report = await validateJobsDirectory(temp, { today });
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((warning) => warning.field === 'applyUrl'));
});

test('template is Vietnamese, owner-editable, starts as draft, and stays outside the collection', async () => {
  const templatePath = path.resolve(import.meta.dirname, '../../templates/job-template.md');
  const template = await readFile(templatePath, 'utf8');
  assert.match(template, /draft:\s*true/);
  assert.match(template, /sample:\s*false/);
  assert.match(template, /title:\s*""/);
  assert.match(template, /applyUrl:\s*""/);
  assert.match(template, /Bắt buộc/);
  assert.match(template, /Thay dòng này bằng mô tả công việc mà bạn đã viết hoặc xác minh/);
  assert.equal(path.dirname(templatePath), path.resolve(import.meta.dirname, '../../templates'));
});

