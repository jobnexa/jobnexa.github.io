import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { Loader } from 'astro/loaders';
import { validateJobsDirectory, formatDiagnostic } from './validation';

/** Local files only. The CLI and Content Collection run this same directory validator. */
export function jobsLoader(includeSamples = false): Loader {
  return {
    name: 'validated-local-markdown-jobs',
    async load(context) {
      const directory = fileURLToPath(new URL(includeSamples ? './tests/fixtures/jobs/valid/' : './src/content/jobs/', context.config.root));
      const sync = async () => {
        const report = await validateJobsDirectory(directory);
        for (const warning of report.warnings) context.logger.warn(formatDiagnostic(warning));
        if (report.errors.length) throw new Error(`Nội dung tuyển dụng không hợp lệ:\n${report.errors.map(formatDiagnostic).join('\n')}`);
        // Clear every sync, including empty collections: deleted/draft records must never survive in cache.
        context.store.clear();
        for (const job of report.jobs) {
          const file = path.join(directory, `${job.id}.md`);
          const data = await context.parseData({ id: job.id, data: job.data, filePath: file });
          const rendered = await context.renderMarkdown(job.body, { fileURL: pathToFileURL(file) });
          context.store.set({ id: job.id, data, body: job.body, rendered, digest: context.generateDigest(JSON.stringify(job)), filePath: file });
        }
      };
      await sync();
      if (context.watcher) {
        context.watcher.add(directory);
        const update = (changed: string) => {
          if (path.dirname(changed) === directory.replace(/[\\/]$/, '')) {
            void sync().catch(error => { context.logger.error(String(error)); context.store.clear(); });
          }
        };
        context.watcher.on('add', update).on('change', update).on('unlink', update);
      }
    },
  };
}
