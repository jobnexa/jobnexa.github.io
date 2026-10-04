export {};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
const backToTop = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
const orbit = document.querySelector<HTMLElement>('.hero-orbit');
const briefcase = document.querySelector<HTMLElement>('.hero-briefcase');
const siteHeader = document.querySelector<HTMLElement>('.site-header');
function measureHeader() {
  if (siteHeader) document.documentElement.style.setProperty('--site-header-height', `${siteHeader.getBoundingClientRect().height}px`);
}
measureHeader();
if (siteHeader && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(siteHeader);
for (const link of document.querySelectorAll<HTMLAnchorElement>('.landing-browse, .hero-scroll-cue')) {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
    // The native hash link handles scrolling and history, including without JavaScript.
    document.querySelector<HTMLElement>('#opportunities')?.focus({ preventScroll: true });
  });
}
const revealTargets = [...document.querySelectorAll<HTMLElement>([
  '.skills-chooser', '.dashboard-tabs', '.dashboard-toolbar', '.filters-drawer',
  '.job-card', '.empty-state', '.footer-grid > div', '.footer-bottom',
  '.detail-head', '.detail-prose > *', '.detail-skills', '.detail-sidebar',
  '.information-page > *',
].join(','))];
let revealObserver: IntersectionObserver | undefined;

function reveal(element: HTMLElement) {
  element.classList.add('is-visible');
  revealObserver?.unobserve(element);
}

function configureReveals() {
  revealObserver?.disconnect();
  document.documentElement.removeAttribute('data-motion-ready');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    for (const element of revealTargets) reveal(element);
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  for (const element of revealTargets) {
    element.classList.add('motion-reveal');
    if (element.matches('.job-card')) {
      const siblings = [...(element.parentElement?.children ?? [])];
      element.style.setProperty('--reveal-delay', `${(siblings.indexOf(element) % 3) * 65}ms`);
    }
    const bounds = element.getBoundingClientRect();
    // The first screen and focusable content remain immediately available.
    if (bounds.height > 0 && bounds.top < window.innerHeight && bounds.bottom > 0) reveal(element);
    else if (!element.classList.contains('is-visible')) revealObserver.observe(element);
  }
  document.documentElement.setAttribute('data-motion-ready', '');
}

// A keyboard user can focus an item before it intersects the viewport.
document.addEventListener('focusin', event => {
  if (!(event.target instanceof Element)) return;
  const element = event.target.closest<HTMLElement>('.motion-reveal');
  if (element) reveal(element);
});

let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progress?.style.setProperty('--scroll-progress', String(fraction));
  const showBackToTop = window.scrollY > 320;
  backToTop?.classList.toggle('is-visible', showBackToTop);
  if (backToTop) backToTop.tabIndex = showBackToTop ? 0 : -1;
  // Move only the decorative artwork, never the page or its text.
  orbit?.style.setProperty('--orbit-scroll', reducedMotion.matches ? '0px' : `${Math.min(window.scrollY * .06, 28)}px`);
  briefcase?.style.setProperty('--briefcase-scroll', reducedMotion.matches ? '0px' : `${Math.min(window.scrollY * .08, 40)}px`);
}
function scheduleScroll() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', () => { measureHeader(); scheduleScroll(); }, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.body);
progress?.removeAttribute('hidden');
backToTop?.removeAttribute('hidden');
backToTop?.addEventListener('click', () => {
  document.querySelector<HTMLElement>('.site-header .brand')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});

const clickTargets = '.button, .header-signup, .footer-signup, .newsletter-close, .newsletter-skip, .newsletter-submit, .dashboard-tabs button, .job-card-apply, .filters-drawer > summary, .skills-overflow > summary, .skill-option, .back-to-top, .nav-links a';
document.addEventListener('click', event => {
  if (reducedMotion.matches || !(event.target instanceof Element)) return;
  const control = event.target.closest<HTMLElement>(clickTargets);
  if (!control || control.matches(':disabled, [aria-disabled="true"]') || control.closest('[hidden]')) return;
  if (getComputedStyle(control).position === 'static') control.classList.add('ripple-relative');
  control.classList.add('has-click-ripple', 'is-pressing');
  const bounds = control.getBoundingClientRect();
  const x = event.detail ? event.clientX - bounds.left : bounds.width / 2;
  const y = event.detail ? event.clientY - bounds.top : bounds.height / 2;
  const ripple = document.createElement('i');
  ripple.className = 'click-ripple';
  const rippleContainer = document.createElement('i');
  rippleContainer.className = 'click-ripple-container';
  rippleContainer.setAttribute('aria-hidden', 'true');
  ripple.style.setProperty('--ripple-x', `${x}px`);
  ripple.style.setProperty('--ripple-y', `${y}px`);
  ripple.style.setProperty('--ripple-size', `${Math.hypot(bounds.width, bounds.height) * 2}px`);
  // Bound transient nodes even during repeated clicks.
  control.querySelector('.click-ripple-container')?.remove();
  rippleContainer.append(ripple);
  control.append(rippleContainer);
  window.setTimeout(() => control.classList.remove('is-pressing'), 180);
  window.setTimeout(() => {
    rippleContainer.remove();
    if (!control.querySelector('.click-ripple-container')) control.classList.remove('has-click-ripple', 'ripple-relative');
  }, 650);
});

reducedMotion.addEventListener('change', () => {
  configureReveals();
  document.querySelectorAll('.click-ripple-container').forEach(ripple => ripple.remove());
  document.querySelectorAll('.is-pressing').forEach(control => control.classList.remove('is-pressing'));
  document.querySelectorAll('.has-click-ripple').forEach(control => control.classList.remove('has-click-ripple', 'ripple-relative'));
  scheduleScroll();
});
configureReveals();
updateScroll();
