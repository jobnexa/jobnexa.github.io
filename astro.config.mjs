import { defineConfig } from 'astro/config';

const includeSamples = process.env.INCLUDE_SAMPLES && !['0', 'false'].includes(process.env.INCLUDE_SAMPLES);
if (includeSamples && !process.argv.includes('dev')) {
  throw new Error('INCLUDE_SAMPLES chỉ được phép trong npm run dev:samples. Production build luôn loại dữ liệu mẫu.');
}

const site = process.env.SITE_URL || 'http://localhost:4321';
const origin = new URL(site);
if (!['https:', 'http:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('SITE_URL cần origin HTTP(S), ví dụ https://ten.github.io, không có subpath. Dùng BASE_PATH cho subpath.');
}
const baseInput = process.env.BASE_PATH || '/';
if (baseInput !== '/' && (!/^\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*\/?$/.test(baseInput) || baseInput.split('/').some(p => ['.', '..'].includes(p)))) {
  throw new Error('BASE_PATH phải là / hoặc /ten-repo/.');
}
const base = baseInput === '/' ? '/' : `${baseInput.replace(/\/$/, '')}/`;

export default defineConfig({
  site: origin.origin,
  base,
  output: 'static',
  // Isolated build copies may share dependencies, but must never share content caches.
  cacheDir: './.astro/cache',
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false },
  vite: {
    cacheDir: '.astro/vite',
    // QA copies contain their own Astro config/cache; don't restart the live app for them.
    server: { watch: { ignored: ['**/qa/tmp/**', '**/qa/build-logs/**'] } },
    define: { 'import.meta.env.SITE_URL': JSON.stringify(origin.origin) },
  },
});
