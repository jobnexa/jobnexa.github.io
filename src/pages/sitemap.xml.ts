import type { APIRoute } from 'astro';
import { getActiveJobs } from '../lib/content/collection';
import { canonicalUrl } from '../lib/urls';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);

export const GET: APIRoute = async () => {
  const jobs = await getActiveJobs();
  const staticPaths = ['/', '/jobs/', '/about/', '/disclaimer/'];
  const paths = [...staticPaths, ...jobs.map((job) => `/jobs/${job.id}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
