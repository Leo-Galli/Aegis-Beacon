/**
 * Aegis-Beacon — shared page layout, rendered entirely by Node.
 *
 * This module is the single source of truth for the HTML shell shared by the
 * manual (wiki) page and the firmware demo page: document head (SEO metadata,
 * Open Graph, Twitter cards, JSON-LD), top bar, tab navigation, footer and the
 * language-aware translation bootstrap (`window.AEGIS_I18N`).
 *
 * No static `.html` files exist in the repository — every page is assembled
 * here at request time from data structures.
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
 * Render the <head> block. `jsonLd` is an optional raw JSON-LD string;
 * `withIconLinks` toggles the favicon / PWA manifest links.
 */
export function renderHead({ title, description, canonical, jsonLd = '', withIconLinks = false } = {}) {
  return `<!-- 1. STRUCTURAL SEO METADATA -->
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="Aegis-Beacon, radio locator, LoRa SAR, firmware ESP32, SX1262, emergency beacon construction, beacon software updates, beacon wiring diagram, ESP32 programming, alpine radio location">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${canonical}">

<!-- SEO multi-language: hreflang alternate links to index all 4 languages -->
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
<link rel="alternate" hreflang="en" href="${SITE_URL}/" />
<link rel="alternate" hreflang="fr" href="${SITE_URL}/" />
<link rel="alternate" hreflang="it" href="${SITE_URL}/" />
<link rel="alternate" hreflang="es" href="${SITE_URL}/" />

<!-- 2. PREFETCH & PRECONNECT DIRECTIVES -->
<link rel="preconnect" href="https://github.com">
<link rel="dns-prefetch" href="https://github.com">

<!-- 3. OPEN GRAPH / FACEBOOK / LINKEDIN -->
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:locale:alternate" content="fr_FR">
<meta property="og:locale:alternate" content="es_ES">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image:secure_url" content="${SITE_URL}/banner.png">
<meta property="og:image" content="${SITE_URL}/banner.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Aegis-Beacon v5.4 — technical manual and build wiki for the SX1262 emergency beacon">
<meta property="og:image:type" content="image/png">
<meta property="og:site_name" content="Aegis-Beacon Open Source Project">
<meta property="og:determiner" content="the">

<!-- 4a. TWITTER CARDS -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${SITE_URL}/banner.png">
<meta name="twitter:image:alt" content="Aegis-Beacon v5.4 — Technical SAR beacon overview with SX1262">

<!-- 4b. MOBILE / PWA / PREVIEW -->
<meta name="theme-color" content="#ea580c">
<meta name="apple-mobile-web-app-title" content="Aegis-Beacon">
<meta name="application-name" content="Aegis-Beacon v5.4">
<meta name="msapplication-TileColor" content="#ea580c">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- 4c. EXTRA SEO / SHARING METADATA -->
<meta name="rating" content="general">
<meta name="distribution" content="global">
<meta name="revisit-after" content="7 days">
<meta name="copyright" content="MIT License — Leonardo Galli © 2026">
<meta name="author" content="Leonardo Galli">
<meta name="pagename" content="Aegis-Beacon v5.4 Technical Manual">
<meta name="category" content="Technology / Open Source Hardware / Search and Rescue">

${withIconLinks ? `<!-- 5. ICONS AND FAVICON -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">` : ''}

${jsonLd ? `<!-- 6. INTEGRATED RELATIONAL JSON-LD SCHEMA -->
<script type="application/ld+json">${jsonLd}</script>` : ''}

<!-- Tailwind CSS (CDN) -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="/js/tailwind.config.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${FONTS_HREF}" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">`;
}

const THEME_TOGGLE = `<button id="theme-toggle" class="theme-switch" role="switch" aria-checked="false" aria-label="Toggle color scheme" title="Toggle color scheme">
  <span class="theme-switch-knob">
    <svg class="theme-switch-sun" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2a1 1 0 01.664.253l.707.707a1 1 0 01-1.414 1.414l-.707-.707A1 1 0 0114 4zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm11.364-1.364a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM16 11a1 1 0 100-2h-1a1 1 0 100 2h1zM4.636 15.364a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707zM10 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM6.253 14.243a1 1 0 01.253.664v.707a1 1 0 11-2 0v-.707a1 1 0 011.747-.664z" /></svg>
    <svg class="theme-switch-moon" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
  </span>
</button>`;

/**
 * Top bar. `logoHref` makes the logo a link (demo page links back to the
 * manual); `action` is the secondary control (Demo link on the manual page,
 * Manual link on the demo page); `subtitle` customizes the header tagline.
 */
export function renderHeader({ logoHref = null, action = 'Demo', actionHref = '/demo.html', subtitle = 'Tech and Build Wiki v5.4' } = {}) {
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
      <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="text-[11px] font-mono bg-slate-900 dark:bg-orange-600 text-white px-2.5 py-1.5 rounded hover:bg-slate-800 dark:hover:bg-orange-500 transition">Repo ↗</a>
    </div>
  </div>
</header>`;
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

const LANG_LINKS = ['en', 'fr', 'it', 'es']
  .map((l) => `<a class="language-link" href="?lang=${l}" data-lang="${l}">${l.toUpperCase()}</a>`)
  .join('');

/** Footer. `languageSelector` renders the language links (manual page only —
 * the demo bundle does not load i18n.js, so it must not offer the selector). */
export function renderFooter({ tagline, legalNote = '', languageSelector = true } = {}) {
  const selector = languageSelector
    ? `<div class="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
    <span class="text-[9px] uppercase tracking-widest notranslate">Language:</span>
    <div class="inline-flex items-center gap-2">${LANG_LINKS}</div>
  </div>`
    : '';
  return `<footer class="border-t border-slate-200 dark:border-slate-800 pt-4 px-2 text-[10px] font-mono text-slate-400 dark:text-slate-600 space-y-3">
  <p class="text-center">${tagline}</p>
  ${legalNote ? `<p class="text-center">${legalNote}</p>` : ''}
  ${selector}
</footer>`;
}

/**
 * Assemble a full HTML document. `content` is everything inside <main>;
 * `footer` is rendered inside <main> after it, matching the original layout.
 */
export function renderPage({
  lang,
  dict,
  title,
  description,
  canonical,
  jsonLd = '',
  header = {},
  tabs = true,
  content,
  footer = {},
  scriptSrc,
  withIconLinks = false
}) {
  const dictJson = JSON.stringify(dict).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
${renderHead({ title, description, canonical, jsonLd, withIconLinks })}
<script>window.AEGIS_I18N = ${dictJson};</script>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-[#090d16] dark:text-slate-200 font-sans antialiased">
${renderHeader(header)}
${tabs ? renderTabs() : ''}
<main class="max-w-7xl mx-auto px-4 py-6 space-y-6 sm:space-y-8">
${content}
${renderFooter(footer)}
</main>
<script type="module" src="${scriptSrc}"></script>
</body>
</html>`;
}
