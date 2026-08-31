/**
 * Aegis-Beacon -- shared page layout, rendered entirely by Node.
 *
 * Single source of truth for the HTML shell: document head (SEO metadata,
 * Open Graph, Twitter cards, JSON-LD), top bar with language switcher,
 * tab navigation, footer, and the language-aware translation bootstrap.
 */

export const SITE_URL = 'https://aegis-beacon.vercel.app';

/** Navigation tabs shared by the manual page. */
export const TABS = [
  { id: 'panoramica', label: '[ 01 // OVERVIEW ]' },
  { id: 'hardware', label: '[ 02 // HARDWARE ]' },
  { id: 'firmware', label: '[ 03 // FIRMWARE ]' },
  { id: 'compilazione', label: '[ 04 // WIKI: SOFTWARE ]' },
  { id: 'costruzione', label: '[ 05 // BUILD WIKI ]' },
  { id: 'techstack', label: '[ 06 // TECH STACK ]' }
];

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';

/**
 * Render the <head> block.
 */
export function renderHead({ title, description, canonical, jsonLd = '', withIconLinks = false } = {}) {
  return `<title>${title}</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
<meta name="description" content="${description}">
<meta name="keywords" content="Aegis-Beacon, radio locator, LoRa SAR, firmware ESP32, SX1262, emergency beacon, alpine radio location">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${canonical}">



<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/banner.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Aegis-Beacon">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${SITE_URL}/banner.png">

<meta name="theme-color" content="#ea580c">
<meta name="apple-mobile-web-app-title" content="Aegis-Beacon">
<meta name="application-name" content="Aegis-Beacon v5.4">
<meta name="msapplication-TileColor" content="#ea580c">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="author" content="Leonardo Galli">
<meta name="copyright" content="MIT License - Leonardo Galli 2026">

${withIconLinks ? `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">` : ''}

${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}

<script src="https://cdn.tailwindcss.com"></script>
<script src="/js/tailwind.config.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${FONTS_HREF}" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">`;
}

const THEME_TOGGLE = `<button id="theme-toggle" class="theme-switch" role="switch" aria-checked="false" aria-label="Toggle color scheme" title="Toggle color scheme">
  <span class="theme-switch-knob">
    <svg class="theme-switch-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    <svg class="theme-switch-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
  </span>
</button>`;



/**
 * Top bar with navigation.
 */
export function renderHeader({ logoHref = null, action = 'Demo', actionHref = '/demo', subtitle = 'Tech and Build Wiki v5.4', currentPath = '/' } = {}) {
  const logo = logoHref
    ? `<a href="${logoHref}" class="flex items-center gap-2.5 min-w-0 group">
        <div class="w-2.5 h-2.5 bg-orange-600 rounded-full shrink-0 group-hover:scale-125 transition-transform"></div>
        <div class="flex flex-col min-w-0">
          <span class="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-white uppercase truncate notranslate" translate="no">Aegis-Beacon</span>
          <span class="font-mono text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-0.5 truncate">${subtitle}</span>
        </div>
      </a>`
    : `<div class="flex items-center gap-2.5 min-w-0">
        <div class="w-2.5 h-2.5 bg-orange-600 rounded-full shrink-0"></div>
        <div class="flex flex-col min-w-0">
          <span class="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-white uppercase truncate notranslate">Aegis-Beacon</span>
          <span class="font-mono text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-0.5 truncate">${subtitle}</span>
        </div>
      </div>`;

  return `<header class="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1322] sticky top-0 z-50 px-4 sm:px-6">
  <div class="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
    ${logo}
    <div class="flex items-center gap-2 shrink-0">
      ${THEME_TOGGLE}
      <a href="${actionHref}" class="text-[11px] font-mono border border-orange-600 text-orange-600 dark:text-orange-400 px-2.5 py-1.5 rounded hover:bg-orange-50 dark:hover:bg-orange-950/20 transition">${action}</a>
      <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="text-[11px] font-mono bg-slate-900 dark:bg-orange-600 text-white px-2.5 py-1.5 rounded hover:bg-slate-800 dark:hover:bg-orange-500 transition hidden sm:block">GitHub</a>
    </div>
  </div>
</header>

<script>
document.addEventListener('DOMContentLoaded', () => {
  /* Theme toggle */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    var isDark = document.documentElement.classList.contains('dark');
    themeBtn.setAttribute('aria-checked', String(isDark));
    themeBtn.addEventListener('click', () => {
      var dark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch(e) {}
      themeBtn.setAttribute('aria-checked', String(dark));
    });
  }
});
</script>`;
}

/** Sticky tab navigation for the manual page. */
export function renderTabs() {
  const buttons = TABS.map((tab, i) => {
    const active = i === 0
      ? 'tab-btn px-3 py-1.5 text-[10px] sm:text-xs font-mono font-bold rounded border border-orange-600 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 whitespace-nowrap'
      : 'tab-btn px-3 py-1.5 text-[10px] sm:text-xs font-mono font-medium rounded border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400 whitespace-nowrap';
    return `<button data-tab="${tab.id}" id="btn-${tab.id}" class="${active}">${tab.label}</button>`;
  }).join('\n');

  return `<div class="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b101c] sticky top-16 z-40">
  <div class="max-w-7xl mx-auto px-4">
    <nav class="flex gap-1.5 py-3 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Manual navigation">
      ${buttons}
    </nav>
  </div>
</div>`;
}

/** Global footer with links and copyright. */
export function renderFooter() {
  return `<footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1322]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-2.5 h-2.5 bg-orange-600 rounded-full"></div>
          <span class="font-mono font-bold text-xs tracking-wider text-slate-900 dark:text-white uppercase notranslate">Aegis-Beacon</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-500 leading-relaxed max-w-xs">
          Open Source Emergency Rescue Beacon. Built for alpine search-and-rescue operations.
        </p>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="font-mono font-bold text-[10px] uppercase tracking-wider text-slate-900 dark:text-white mb-3">Quick Links</h4>
        <ul class="space-y-2">
          <li><a href="/" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Home</a></li>
          <li><a href="/wiki" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Documentation</a></li>
          <li><a href="/demo" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Demo</a></li>
          <li><a href="/builder" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Builder</a></li>
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h4 class="font-mono font-bold text-[10px] uppercase tracking-wider text-slate-900 dark:text-white mb-3">Resources</h4>
        <ul class="space-y-2">
          <li><a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">GitHub Repository</a></li>
          <li><a href="https://github.com/Leo-Galli/Aegis-Beacon/blob/main/LICENSE" target="_blank" rel="noopener" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">MIT License</a></li>
          <li><a href="/wiki/faq" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">FAQ</a></li>
          <li><a href="/status" class="text-xs text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Project Status</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-600">
          &copy; AEGIS-BEACON - Open Source Emergency Rescue Beacon
        </p>
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-600">
          MIT License &middot; Leonardo Galli 2026
        </p>
      </div>
      <p class="text-[9px] font-mono text-slate-400 dark:text-slate-700 text-center mt-3">
        This project is provided as-is for educational and emergency preparedness purposes. Always verify local radio regulations before operation.
      </p>
    </div>
  </div>
</footer>`;
}

/**
 * Assemble a full HTML document.
 */
export function renderPage({
  title,
  description,
  canonical,
  jsonLd = '',
  header = {},
  tabs = true,
  content,
  scriptSrc,
  withIconLinks = false,
  extraScripts = ''
}) {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
<script>
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
</script>
${renderHead({ title, description, canonical, jsonLd, withIconLinks })}
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-[#090d16] dark:text-slate-200 font-sans antialiased">
${renderHeader(header)}
${tabs ? renderTabs() : ''}
<main class="max-w-7xl mx-auto px-4 py-6 space-y-6 sm:space-y-8">
${content}
${renderFooter()}
</main>
${scriptSrc ? `<script type="module" src="${scriptSrc}"></script>` : ''}
${extraScripts}
</body>
</html>`;
}
