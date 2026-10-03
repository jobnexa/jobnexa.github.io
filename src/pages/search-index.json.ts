import type { APIRoute } from 'astro';
import { getActiveJobs } from '../lib/content/collection';
import { toSearchRecord } from '../lib/content/search';
export const GET: APIRoute = async () => new Response(JSON.stringify((await getActiveJobs()).map(toSearchRecord)), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
