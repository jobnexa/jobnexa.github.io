import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const checks = [];
for (const base of ['http://127.0.0.1:4325/', 'http://127.0.0.1:4323/ten-repo/']) {
  const paths = ['', 'jobs/', 'about/', 'disclaimer/', '404.html', 'robots.txt', 'sitemap.xml', 'search-index.json'];
  if (base.includes('ten-repo')) paths.push('jobs/owner-test/', 'jobs/expired-test/');
  const assets = new Set();
  for (const route of paths) {
    const url = new URL(route, base).href;
    const res = await fetch(url);
    assert.ok(res.status === 200 || route === '404.html' && res.status === 404, `${url}: ${res.status}`);
    const text = await res.text();
    assert.ok(text.length > 0);
    if (res.headers.get('content-type')?.includes('text/html')) {
      assert.match(text, /lang="en"/);
      assert.match(text, /<h1/);
      for (const match of text.matchAll(/(?:src|href)="([^" ]+)"/g)) {
        const u = new URL(match[1].replace(/&amp;/g, '&'), url);
        if (u.origin === new URL(base).origin && (u.pathname.includes('/_astro/') || u.pathname.endsWith('.svg'))) assets.add(u.href);
      }
    }
    if (route === 'search-index.json' && !base.includes('ten-repo')) assert.deepEqual(JSON.parse(text), []);
    checks.push({ url, status: res.status, pass: true });
  }
  for (const url of assets) {
    const res = await fetch(url);
    assert.equal(res.status, 200, `asset missing: ${url}`);
    checks.push({ url, status: res.status, pass: true });
  }
}
await writeFile(new URL('../../qa/routes.json', import.meta.url), JSON.stringify({ checkedAt: new Date().toISOString(), status: 'PASS', checks }, null, 2));
console.log(`${checks.length} route and asset checks PASS`);
