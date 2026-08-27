/**
 * Aegis-Beacon -- Project Status page, rendered entirely by Node.
 *
 * Shows CI/CD pipeline status, security audit results, build health,
 * and project metrics. Data is static but designed to be updated
 * by GitHub Actions workflow artifacts.
 */

import { renderPage, SITE_URL } from './layout.js';

const GITHUB_REPO = 'https://github.com/Leo-Galli/Aegis-Beacon';

const WORKFLOWS = [
  { name: 'Firmware CI', file: 'firmware-ci.yml', desc: 'PlatformIO build, static analysis, .ino structure validation', icon: 'Cpu' },
  { name: 'Website CI', file: 'website-ci.yml', desc: 'Node.js syntax check, route verification, i18n validation, security audit', icon: 'Globe' },
  { name: 'PR Quality Checks', file: 'pr-checks.yml', desc: 'PR validation, code quality scan, AI co-author detection, auto-reviewer assignment', icon: 'Shield' }
];

const CHECKS = [
  { category: 'Firmware', items: [
    { name: 'PlatformIO Build', desc: 'Compiles .ino for ESP32 target', status: 'pass' },
    { name: 'Size Report', desc: 'Firmware binary size analysis', status: 'pass' },
    { name: 'Include Validation', desc: 'Checks RadioLib, U8g2, TinyGPS++ dependencies', status: 'pass' },
    { name: 'Serial Output', desc: 'Verifies Serial.begin() present', status: 'pass' },
    { name: 'Deep Sleep', desc: 'Verifies esp_deep_sleep_start() present', status: 'pass' },
    { name: 'Watchdog', desc: 'Checks watchdog or yield() calls', status: 'pass' }
  ]},
  { category: 'Website', items: [
    { name: 'Syntax Check', desc: 'node --check on all .js files', status: 'pass' },
    { name: 'i18n Parity', desc: 'All languages have matching dictionary keys', status: 'pass' },
    { name: 'Route Verification', desc: 'All pages return HTTP 200', status: 'pass' },
    { name: '.html Reference Check', desc: 'No internal .html references in routes', status: 'pass' },
    { name: 'Path Traversal', desc: 'Static file serving has path normalization', status: 'pass' },
    { name: 'Hardcoded URLs', desc: 'No hardcoded localhost in views', status: 'pass' }
  ]},
  { category: 'Security', items: [
    { name: 'npm audit', desc: 'Dependency vulnerability scan', status: 'pass' },
    { name: 'Credential Scan', desc: 'No hardcoded passwords/tokens/keys', status: 'pass' },
    { name: 'Sensitive Files', desc: 'No .env or secret files in repo', status: 'pass' },
    { name: 'Path Normalization', desc: 'Static file paths normalized against traversal', status: 'pass' }
  ]},
  { category: 'Code Quality', items: [
    { name: 'TODO/FIXME Scan', desc: 'Untracked technical debt markers', status: 'warn' },
    { name: 'console.log Check', desc: 'No console.log in view templates', status: 'pass' },
    { name: 'Documentation', desc: 'README.md, DATASHEET.md, FREQUENCIES.md present', status: 'pass' },
    { name: 'AI Co-author Check', desc: 'No AI references in commits or PRs', status: 'pass' }
  ]}
];

const METRICS = [
  { label: 'Wiki Sections', value: '22', trend: 'up' },
  { label: 'Translation Keys', value: '40+', trend: 'stable' },
  { label: 'Supported Languages', value: '4', trend: 'stable' },
  { label: 'CI Workflows', value: '3', trend: 'up' },
  { label: 'Code Quality Checks', value: '20+', trend: 'up' },
  { label: 'Hardware GPIO Pins', value: '14', trend: 'stable' }
];

/* ── Renderers ────────────────────────────────────────────────────── */

function renderWorkflows() {
  const cards = WORKFLOWS.map((w) => `
    <a href="${GITHUB_REPO}/actions/workflows/${w.file}" target="_blank" rel="noopener"
       class="group flex items-start gap-4 p-5 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-md transition-all">
      <div class="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-900/50">
        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">${w.name}</h3>
          <span class="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-bold">ACTIVE</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${w.desc}</p>
      </div>
      <svg class="w-4 h-4 text-slate-400 group-hover:text-orange-500 shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
      </svg>
    </a>`).join('');

  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// CI/CD PIPELINES</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Automated Workflows</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400">All workflows run on every push and pull request to main.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${cards}</div>
  </section>`;
}

function renderCheckResults() {
  const sections = CHECKS.map((cat) => {
    const items = cat.items.map((c) => {
      const statusColor = c.status === 'pass' ? 'bg-emerald-500' : c.status === 'warn' ? 'bg-amber-500' : 'bg-rose-500';
      const statusLabel = c.status === 'pass' ? 'PASS' : c.status === 'warn' ? 'WARN' : 'FAIL';
      return `
        <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
          <div class="min-w-0 flex-1">
            <span class="text-xs font-bold text-slate-900 dark:text-white">${c.name}</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 ml-2">${c.desc}</span>
          </div>
          <span class="flex items-center gap-1.5 shrink-0 ml-3">
            <span class="w-2 h-2 rounded-full ${statusColor}"></span>
            <span class="text-[10px] font-mono font-bold ${c.status === 'pass' ? 'text-emerald-600 dark:text-emerald-400' : c.status === 'warn' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}">${statusLabel}</span>
          </span>
        </div>`;
    }).join('');

    return `
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div class="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">${cat.category}</h3>
        </div>
        <div class="px-5 divide-y divide-slate-100 dark:divide-slate-800">${items}</div>
      </div>`;
  }).join('');

  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// CHECK RESULTS</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Quality Gate</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400">Automated checks run on every commit and pull request.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${sections}</div>
  </section>`;
}

function renderMetrics() {
  const items = METRICS.map((m) => `
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
      <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">${m.value}</div>
      <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">${m.label}</div>
    </div>`).join('');

  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// PROJECT METRICS</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">At a Glance</h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">${items}</div>
  </section>`;
}

function renderSecurityInfo() {
  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// SECURITY</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Security Posture</h2>
    </div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg">
          <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          <div>
            <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">Path Traversal Protected</span>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Static file serving uses path normalization and prefix checking</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg">
          <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          <div>
            <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">No Hardcoded Secrets</span>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">CI scans for passwords, tokens, API keys, and credentials</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg">
          <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          <div>
            <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">Dependency Audit</span>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">npm audit runs on every CI pipeline with moderate+ threshold</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg">
          <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          <div>
            <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">AI Co-author Detection</span>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">PR checks reject commits with AI co-author references</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

const JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Aegis-Beacon Project Status",
  "description": "CI/CD pipeline status, security audit results, and project health for Aegis-Beacon.",
  "url": "https://aegis-beacon.vercel.app/status"
}`;

export function renderStatusPage(lang, dict, currentPath = '/') {
  const content = [
    renderWorkflows(),
    renderCheckResults(),
    renderMetrics(),
    renderSecurityInfo()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | Project Status',
    description: 'CI/CD pipeline status, automated quality checks, security audit results, and project health metrics for Aegis-Beacon.',
    canonical: `${SITE_URL}/status`,
    jsonLd: JSON_LD,
    header: { logoHref: '/', action: 'Wiki', actionHref: '/wiki', subtitle: 'Project Status' },
    tabs: false,
    content,
    footer: {
      tagline: 'Aegis Open Source Engineering Network -- Project Status v5.4'
    },
    scriptSrc: null,
    withIconLinks: true,
    currentPath
  });
}
