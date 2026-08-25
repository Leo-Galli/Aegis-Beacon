/**
 * Theme manager — light by default.
 *
 * The site loads in LIGHT mode unless the user explicitly saved the `dark`
 * preference. No system-preference auto-detection is applied, so first
 * visitors always see the clear light theme.
 */

const THEME_KEY = 'theme';

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch (_) {
    return 'light';
  }
}

export function applyTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-checked', String(dark));
}

export function initTheme() {
  applyTheme(readTheme());
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (_) { /* storage unavailable */ }
    btn.setAttribute('aria-checked', String(dark));
  });
}
