/**
 * Aegis-Beacon -- Wiki index page.
 * Redirects to the overview page or serves as a simple index.
 */

import { renderPage, SITE_URL } from './layout.js';

const GITHUB_REPO = 'https://github.com/Leo-Galli/Aegis-Beacon';

export function renderWikiPage(lang, dict, currentPath = '/') {
  const content = `
  <div class="text-center py-16 space-y-6">
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20">
      <span class="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Documentation</span>
    </div>
    <h1 class="text-4xl font-bold text-slate-900 dark:text-white">Aegis-Beacon Wiki</h1>
    <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
      Comprehensive technical documentation for the Aegis-Beacon emergency radio system.
      22 pages covering hardware, firmware, assembly, and operation.
    </p>
    <div class="flex flex-wrap justify-center gap-3 pt-4">
      <a href="/wiki/overview" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-mono text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40 hover:scale-[1.03]">
        Start Reading
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
      </a>
      <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-600 dark:text-slate-300 font-mono text-sm font-bold rounded-xl transition-all hover:scale-[1.03]">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        View on GitHub
      </a>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8 max-w-4xl mx-auto text-left">
      <a href="/wiki/overview" class="p-4 bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-lg transition-all">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Getting Started</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">Project Overview</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Introduction, features, and quick start guide.</p>
      </a>
      <a href="/wiki/hardware" class="p-4 bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-lg transition-all">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Hardware</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">Components & Wiring</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">BOM, GPIO pinout, and circuit description.</p>
      </a>
      <a href="/wiki/firmware" class="p-4 bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-lg transition-all">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Firmware</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">Code & Build</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Dependencies, build process, and debug output.</p>
      </a>
      <a href="/wiki/assembly" class="p-4 bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-lg transition-all">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Build</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">Assembly Guide</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Step-by-step hardware assembly instructions.</p>
      </a>
      <a href="/wiki/operating-modes" class="p-4 bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-lg transition-all">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Operation</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">Operating Modes</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">BEACON, SEARCH, CONFIG, and EMERGENCY modes.</p>
      </a>
      <a href="/wiki/troubleshooting" class="p-4 bg-white dark:bg-[var(--surface-alt)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-lg transition-all">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Help</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">Troubleshooting & FAQ</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Common issues and solutions.</p>
      </a>
    </div>
  </div>`;

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon Wiki | Documentation',
    description: 'Comprehensive technical documentation for the Aegis-Beacon emergency radio system.',
    canonical: `${SITE_URL}/wiki`,
    header: { logoHref: '/', action: 'Builder', actionHref: '/builder', subtitle: 'Documentation' },
    tabs: false,
    content,
    footer: { tagline: 'Aegis Open Source Engineering Network -- Technical Wiki v5.4' },
    scriptSrc: null,
    withIconLinks: true,
    currentPath
  });
}
