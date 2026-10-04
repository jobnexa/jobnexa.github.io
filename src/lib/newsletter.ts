/** Only a public form endpoint belongs in the static site; never use an API key. */
export function newsletterFormAction(value: string | undefined): string {
  const input = value?.trim();
  if (!input) return '';
  if (!/^https:\/\//i.test(input) || /[\\\u0000-\u001f\u007f]/.test(input)) {
    throw new Error('PUBLIC_NEWSLETTER_FORM_URL must be a complete public HTTPS form URL.');
  }
  let url: URL;
  try { url = new URL(input); } catch { throw new Error('PUBLIC_NEWSLETTER_FORM_URL must be a complete public HTTPS form URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
    throw new Error('PUBLIC_NEWSLETTER_FORM_URL must use HTTPS without credentials or a fragment.');
  }
  return url.href;
}
