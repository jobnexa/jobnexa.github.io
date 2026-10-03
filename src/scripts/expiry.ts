import { todayInVietnam } from '../lib/content/policy';

function refreshExpiry() {
  const today = todayInVietnam();
  document.querySelectorAll<HTMLElement>('[data-expiration-date]').forEach((card) => {
    const expiry = card.dataset.expirationDate;
    card.hidden = !!expiry && expiry < today;
  });
  document.querySelectorAll<HTMLElement>('[data-detail-expiration]').forEach((detail) => {
    const expiry = detail.dataset.detailExpiration;
    if (!expiry || expiry >= today) return;
    detail.querySelector<HTMLElement>('[data-expired-notice]')?.removeAttribute('hidden');
    detail.querySelector<HTMLElement>('[data-apply-cta]')?.remove();
    detail.querySelector<HTMLElement>('[data-apply-host]')?.remove();
    detail.querySelector<HTMLElement>('[data-expired-source-note]')?.removeAttribute('hidden');
  });
  document.dispatchEvent(new CustomEvent('jobs:expiry-refresh'));
}

refreshExpiry();
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshExpiry(); });
window.addEventListener('focus', refreshExpiry);
window.setInterval(refreshExpiry, 60 * 1000);
