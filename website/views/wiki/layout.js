/**
 * Aegis-Beacon -- Shared wiki page layout (20 pages).
 *
 * Provides consistent navigation, sidebar, and page structure for all
 * wiki sub-pages. Fully responsive with mobile hamburger menu.
 */

import { renderPage, SITE_URL } from '../layout.js';

const GITHUB_REPO = 'https://github.com/Leo-Galli/Aegis-Beacon';
const GITHUB_EDIT = `${GITHUB_REPO}/edit/main`;

export const WIKI_PAGES = [
  { id: 'overview', title: 'Overview', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { id: 'hardware', title: 'Hardware', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
  { id: 'pinmap', title: 'GPIO Pin Map', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5' },
  { id: 'rf-design', title: 'RF Design', icon: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12z' },
  { id: 'antenna', title: 'Antenna Design', icon: 'M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 5.75a1.125 1.125 0 011.75-.75l.3.3a.809.809 0 001.086 0l.603-.302' },
  { id: 'firmware', title: 'Firmware', icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
  { id: 'morse', title: 'Morse Engine', icon: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z' },
  { id: 'config', title: 'Configuration', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' },
  { id: 'display', title: 'OLED Display', icon: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' },
  { id: 'gps', title: 'GPS Integration', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'power', title: 'Power Management', icon: 'M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z' },
  { id: 'assembly', title: 'Assembly Guide', icon: 'M11.42 15.17l-5.384 3.18A1.5 1.5 0 014 17.04V6.96a1.5 1.5 0 012.036-1.41l5.384 3.18m0 0l5.384-3.18A1.5 1.5 0 0120 6.96v10.08a1.5 1.5 0 01-2.036 1.41l-5.384-3.18m0 0V12m0 3.17V12' },
  { id: 'frequencies', title: 'Frequency Table', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5' },
  { id: 'enclosure', title: 'Enclosure', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
  { id: 'testing', title: 'Testing & QC', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'security', title: 'Security & Legal', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { id: 'faq', title: 'FAQ', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
  { id: 'glossary', title: 'Glossary', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' }
];

/**
 * Render wiki sidebar navigation.
 */
export function renderWikiSidebar(currentPage) {
  const links = WIKI_PAGES.map((p) => {
    const active = p.id === currentPage;
    return `
    <a href="/wiki/${p.id}" class="flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-lg transition-all ${active ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900/50' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}">
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${p.icon}"/></svg>
      <span>${p.title}</span>
    </a>`;
  }).join('');

  return `
  <!-- Desktop sidebar -->
  <aside class="hidden lg:block w-56 shrink-0 sticky top-20 h-fit">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <span class="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0f1626]">Wiki</span>
      ${links}
    </div>
  </aside>

  <!-- Mobile navigation -->
  <div class="lg:hidden sticky top-16 z-30 bg-white dark:bg-[#0d1322] border-b border-slate-200 dark:border-slate-800 px-4 py-2">
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
      ${WIKI_PAGES.map((p) => {
        const active = p.id === currentPage;
        return `<a href="/wiki/${p.id}" class="shrink-0 px-3 py-1.5 text-[10px] font-mono font-bold rounded-full border transition-all ${active ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700'}">${p.title}</a>`;
      }).join('')}
    </div>
  </div>`;
}

/**
 * Render wiki page header with edit button.
 */
export function renderWikiHeader(id, title, file) {
  const editLink = file
    ? `<a href="${GITHUB_EDIT}/${file}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
        Edit on GitHub
      </a>`
    : '';

  return `<div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
    <div>
      <span class="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// ${title.toUpperCase()}</span>
      <h1 id="${id}" class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">${title}</h1>
    </div>
    ${editLink}
  </div>`;
}

/**
 * Render wiki page navigation (prev/next).
 */
export function renderWikiNav(currentPage) {
  const idx = WIKI_PAGES.findIndex((p) => p.id === currentPage);
  const prev = idx > 0 ? WIKI_PAGES[idx - 1] : null;
  const next = idx < WIKI_PAGES.length - 1 ? WIKI_PAGES[idx + 1] : null;

  const prevLink = prev
    ? `<a href="/wiki/${prev.id}" class="flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 transition-all flex-1 min-w-0">
        <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
        <div class="min-w-0"><div class="text-[9px] font-mono text-slate-500 uppercase">Previous</div><div class="text-xs font-bold text-slate-900 dark:text-white truncate">${prev.title}</div></div>
      </a>`
    : '<div class="flex-1"></div>';

  const nextLink = next
    ? `<a href="/wiki/${next.id}" class="flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 transition-all flex-1 min-w-0 text-right justify-end">
        <div class="min-w-0"><div class="text-[9px] font-mono text-slate-500 uppercase">Next</div><div class="text-xs font-bold text-slate-900 dark:text-white truncate">${next.title}</div></div>
        <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
      </a>`
    : '<div class="flex-1"></div>';

  return `<div class="flex flex-col sm:flex-row gap-3 pt-8 border-t border-slate-200 dark:border-slate-800">${prevLink}${nextLink}</div>`;
}

/**
 * Render a full wiki page.
 */
export function renderWikiPageLayout({ pageId, title, file, content, lang, dict, currentPath = '/' }) {
  const body = `<div class="flex gap-0 lg:gap-8">
    ${renderWikiSidebar(pageId)}
    <div class="flex-1 min-w-0">
      ${renderWikiHeader(pageId, title, file)}
      <div class="wiki-content space-y-6">${content}</div>
      ${renderWikiNav(pageId)}
    </div>
  </div>`;

  return renderPage({
    lang,
    dict,
    title: `Aegis-Beacon | ${title}`,
    description: `Technical documentation: ${title} for the Aegis-Beacon emergency radio system.`,
    canonical: `${SITE_URL}/wiki/${pageId}`,
    header: { logoHref: '/', action: 'Builder', actionHref: '/builder', subtitle: `Wiki: ${title}` },
    tabs: false,
    content: body,
    footer: { tagline: 'Aegis Open Source Engineering Network -- Technical Wiki v5.4' },
    scriptSrc: null,
    withIconLinks: true,
    currentPath
  });
}
