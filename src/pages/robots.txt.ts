import type { APIRoute } from 'astro';
import { canonicalUrl, withBase } from '../lib/urls';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    `Allow: ${withBase('/')}`,
    `Sitemap: ${canonicalUrl('/sitemap.xml')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

// On GitHub Pages project sites this file is served under BASE_PATH.
// Crawlers normally request /robots.txt at the domain root; the sitemap link
// remains usable even when a project cannot control that root file.
