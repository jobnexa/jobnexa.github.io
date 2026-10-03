const selector = document.querySelector<HTMLSelectElement>('[data-theme-select]');
if (selector) {
  try {
    const saved = localStorage.getItem('theme');
    selector.value = saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    selector.value = 'system';
  }
  selector.addEventListener('change', () => {
    const value = selector.value;
    if (value === 'light' || value === 'dark') {
      document.documentElement.dataset.theme = value;
      try { localStorage.setItem('theme', value); } catch { /* storage may be disabled */ }
    } else {
      delete document.documentElement.dataset.theme;
      try { localStorage.removeItem('theme'); } catch { /* storage may be disabled */ }
    }
  });
}
