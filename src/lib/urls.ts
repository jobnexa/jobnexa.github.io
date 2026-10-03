export function normalizeBase(base: string): string {
  if (!base || base === '/') return '/';
  if (!/^\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*\/?$/.test(base) || base.split('/').some(p => p === '.' || p === '..')) {
    throw new Error('BASE_PATH phải là / hoặc đường dẫn như /ten-repo/, không query hoặc URL.');
  }
  return `${base.replace(/\/$/, '')}/`;
}

export function withBase(path: string, base?: string): string {
  const configured = base ?? import.meta.env?.BASE_URL ?? (typeof process !== 'undefined' ? process.env.BASE_PATH : undefined) ?? '/';
  return `${normalizeBase(configured)}${path.replace(/^\/+/, '')}`;
}

export function canonicalUrl(path: string, site?: string, base?: string): string {
  const origin = site ?? import.meta.env?.SITE_URL ?? (typeof process !== 'undefined' ? process.env.SITE_URL : undefined) ?? 'http://localhost:4321';
  return new URL(withBase(path, base), origin).href;
}
