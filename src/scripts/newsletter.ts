export {};

const dialog = document.querySelector<HTMLDialogElement>('#newsletter-dialog');
const form = document.querySelector<HTMLFormElement>('#newsletter-form');
const email = document.querySelector<HTMLInputElement>('#newsletter-email');
const status = document.querySelector<HTMLElement>('#newsletter-status');

if (dialog && form && email && typeof dialog.showModal === 'function') {
  const modal = dialog;
  const signupForm = form;
  const emailInput = email;
  const sessionKey = 'jobnexa.email-invitation-seen';
  let previousFocus: HTMLElement | null = null;

  function openSignup() {
    if (modal.open) return;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.showModal();
    document.documentElement.classList.add('newsletter-open');
    emailInput.focus({ preventScroll: true });
    // Store only that the invitation appeared. Email addresses never enter browser storage.
    try { sessionStorage.setItem(sessionKey, '1'); } catch { /* Signup also works with blocked storage. */ }
  }

  for (const trigger of document.querySelectorAll<HTMLButtonElement>('[data-newsletter-open]')) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', modal.id);
    trigger.addEventListener('click', openSignup);
  }
  for (const closer of modal.querySelectorAll<HTMLButtonElement>('[data-newsletter-close]')) {
    closer.addEventListener('click', () => modal.close());
  }
  modal.addEventListener('click', event => {
    const bounds = modal.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (event.target === modal && outside) modal.close();
  });
  modal.addEventListener('close', () => {
    document.documentElement.classList.remove('newsletter-open');
    signupForm.reset();
    if (status) { status.hidden = true; status.textContent = ''; }
    if (previousFocus?.isConnected && previousFocus.matches('button, input, select, textarea, a[href], [tabindex]') && !previousFocus.closest('[hidden]')) previousFocus.focus({ preventScroll: true });
    else document.querySelector<HTMLElement>('#skills-edit, [data-newsletter-open]')?.focus({ preventScroll: true });
  });
  signupForm.addEventListener('submit', event => {
    if (modal.dataset.connected !== 'true') { event.preventDefault(); return; }
    if (status) {
      status.textContent = 'A registration page has opened. Complete any confirmation there to finish signing up.';
      status.hidden = false;
    }
  });

  let seen = false;
  try { seen = sessionStorage.getItem(sessionKey) === '1'; } catch { /* No persistence is required. */ }
  // Let existing skill-selection initialization finish before the welcome dialog takes focus.
  if (!seen) requestAnimationFrame(openSignup);
}
