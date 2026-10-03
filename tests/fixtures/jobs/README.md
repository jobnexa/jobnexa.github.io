# Content test data

Every Markdown file in `valid/` is `SAMPLE / DEVELOPMENT DATA`, uses `sample: true`, and exists only to exercise the content contract. The files use fictitious names and `example.com`; they are not real vacancies and must never be copied into the production collection.

The `invalid/` folder contains intentionally broken YAML or metadata. These fixtures must stay outside `src/content/jobs/`; a test should copy one into an isolated temporary jobs directory when exercising a failing build/validator case.

The valid set covers active featured Remote, Hybrid, On-site, no salary, salary with Markdown, draft (including a future publication date), date-expired, and archived. The invalid set covers each required field missing, malformed YAML, empty body, unknown field, bad work type, string boolean, malformed/impossible dates, expiration before publication, future non-draft publication, unsafe/credentialed URLs, and salary constraints.
