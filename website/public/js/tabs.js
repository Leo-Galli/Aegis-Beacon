/**
 * Tab manager — switches between the manual sections (OVERVIEW, HARDWARE,
 * FIRMWARE, WIKI: SOFTWARE, BUILD WIKI). Buttons carry a `data-tab` attribute
 * and are bound here; no inline `onclick` handlers remain in the HTML.
 */

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.className = 'tab-btn px-3 py-1.5 text-[10px] sm:text-xs font-mono font-medium rounded border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400 whitespace-nowrap';
  });

  const panel = document.getElementById('tab-' + tabId);
  if (panel) panel.classList.add('active');
  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) {
    activeBtn.className = 'tab-btn px-3 py-1.5 text-[10px] sm:text-xs font-mono font-bold rounded border border-orange-600 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 whitespace-nowrap';
    // Scroll the active button into view on mobile displays.
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

export function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  for (const btn of buttons) {
    const tabId = btn.getAttribute('data-tab');
    if (tabId) {
      btn.addEventListener('click', () => switchTab(tabId));
    }
  }
}
