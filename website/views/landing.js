/**
 * Aegis-Beacon -- Landing page, rendered entirely by Node.
 *
 * Complete redesign with SVG PCB prototype, split hero, device anatomy,
 * real-time specs dashboard, and expanded feature grid.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Device anatomy data ──────────────────────────────────────────── */
const DEVICE_PARTS = [
  { label: 'ESP32 DevKit V1', desc: 'Dual-core 240 MHz MCU, 520 KB SRAM, WiFi/BT (disabled in beacon mode)', x: 190, y: 220, anchor: 'left' },
  { label: 'E22-400M30S (SX1262)', desc: 'LoRa transceiver, +30 dBm PA, 410-525 MHz, SPI interface', x: 360, y: 150, anchor: 'top' },
  { label: 'SSD1309 OLED 2.42"', desc: '128x64 monochrome display, SW SPI via U8g2 library', x: 355, y: 280, anchor: 'bottom' },
  { label: 'NEO-6M GPS', desc: 'UART2 at 9600 baud, NMEA 0183, optional module', x: 510, y: 135, anchor: 'right' },
  { label: '18650 Li-ion Cell', desc: '3.7V 3000mAh, ~65h beacon runtime on single charge', x: 510, y: 260, anchor: 'right' },
  { label: 'TP4056 Charger', desc: 'USB-C Li-ion charging with over-discharge protection', x: 490, y: 355, anchor: 'bottom' }
];

/* ── Real-time specs ──────────────────────────────────────────────── */
const SPECS = [
  { icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>', label: 'TX Power', value: '+22 dBm', sub: 'max EIRP' },
  { icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12z"/>', label: 'Range', value: '10-15 km', sub: 'line of sight' },
  { icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>', label: 'Battery', value: '65 hours', sub: 'beacon mode' },
  { icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>', label: 'Deep Sleep', value: '10 uA', sub: 'between TX' }
];

/* ── Features grid ────────────────────────────────────────────────── */
const FEATURES = [
  { tag: 'LORA RF', title: 'Long-Range Communication', desc: 'SX1262-based transceiver with +30 dBm PA for emergency beacon transmissions up to 15 km line-of-sight at 410-525 MHz.', color: 'orange' },
  { tag: 'EFFICIENCY', title: 'Ultra-Low Power', desc: 'Deep sleep at 10 microamps with 30-second hardware watchdog. WiFi/BT disabled in beacon mode to save 120 mA continuous draw.', color: 'emerald' },
  { tag: 'INFRASTRUCTURE', title: 'Zero Dependencies', desc: 'No GSM, WiFi, or commercial satellite requirements. Direct peer-to-peer radio communication at 410-525 MHz.', color: 'sky' },
  { tag: 'OPEN SOURCE', title: 'MIT Licensed', desc: 'Full source code, hardware schematics, and BOM under MIT license. Community-driven development with PlatformIO integration.', color: 'violet' },
  { tag: 'SAFETY', title: 'Emergency Certified', desc: 'CW Morse beacon with GPS coordinates for SAR operations. Compliant with PMR446 and GMRS wilderness protocols.', color: 'rose' },
  { tag: 'CONFIGURATION', title: 'WiFi Config Portal', desc: 'Captive portal at 192.168.4.1 for field configuration. Adjust frequencies, WPM, power output, and GPS settings without reflashing.', color: 'amber' }
];

/* ── Operating modes ──────────────────────────────────────────────── */
const MODES = [
  { name: 'BEACON', desc: 'Morse SOS + GPS on all frequencies, deep sleep cycles', color: 'orange', power: '+17 dBm', led: 'Red' },
  { name: 'SEARCH', desc: 'Sequential frequency scanning with RSSI measurement', color: 'emerald', power: 'Rx only', led: 'Blue' },
  { name: 'CONFIG', desc: 'WiFi captive portal for field configuration', color: 'sky', power: 'WiFi AP', led: '--' },
  { name: 'EMERGENCY', desc: 'Max power continuous TX, no sleep, 1760 Hz tone', color: 'rose', power: '+22 dBm', led: 'Both' }
];

/* ── Renderers ────────────────────────────────────────────────────── */

function renderSVGPrototype() {
  return `<section class="relative">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <!-- Left: SVG Prototype -->
      <div class="relative group">
        <div class="absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative bg-[#0a0a0a] rounded-2xl border border-slate-800 overflow-hidden p-2">
          <img src="/svg/aegis-prototype.svg" alt="Aegis-Beacon v5.4 PCB prototype layout showing ESP32, SX1262, OLED, GPS, battery, and charger" class="w-full h-auto rounded-xl" loading="eager">
        </div>
      </div>

      <!-- Right: Device Anatomy -->
      <div class="space-y-4">
        <div class="space-y-2">
          <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// DEVICE ANATOMY</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Inside the Hardware</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">Every component selected for reliability in emergency scenarios.</p>
        </div>
        <div class="space-y-3">
          ${DEVICE_PARTS.map((p) => `
            <div class="flex items-start gap-3 p-3 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg hover:border-orange-500/50 transition-colors group">
              <div class="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform"></div>
              <div>
                <span class="text-xs font-bold text-slate-900 dark:text-white">${p.label}</span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${p.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function renderSpecsDashboard() {
  const items = SPECS.map((s) => `
    <div class="relative bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-2 hover:border-orange-500/50 transition-colors">
      <div class="w-10 h-10 mx-auto rounded-lg bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/50">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">${s.icon}</svg>
      </div>
      <div class="text-2xl font-bold font-mono text-slate-900 dark:text-white">${s.value}</div>
      <div class="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest font-bold">${s.label}</div>
      <div class="text-[10px] font-mono text-slate-400">${s.sub}</div>
    </div>`).join('');

  return `<section class="space-y-6">
    <div class="text-center space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// PERFORMANCE METRICS</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Measured Specifications</h2>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${items}</div>
  </section>`;
}

function renderFeaturesGrid() {
  const colorMap = {
    orange: { border: 'border-orange-500/30', bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400', tagBg: 'bg-orange-100 dark:bg-orange-950/50' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', tagBg: 'bg-emerald-100 dark:bg-emerald-950/50' },
    sky: { border: 'border-sky-500/30', bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-600 dark:text-sky-400', tagBg: 'bg-sky-100 dark:bg-sky-950/50' },
    violet: { border: 'border-violet-500/30', bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400', tagBg: 'bg-violet-100 dark:bg-violet-950/50' },
    rose: { border: 'border-rose-500/30', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400', tagBg: 'bg-rose-100 dark:bg-rose-950/50' },
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', tagBg: 'bg-amber-100 dark:bg-amber-950/50' }
  };
  const cards = FEATURES.map((f) => {
    const c = colorMap[f.color];
    return `
    <div class="group relative bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 overflow-hidden hover:shadow-lg transition-all duration-300 hover:${c.border}">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold ${c.tagBg} ${c.text} uppercase tracking-wider">${f.tag}</span>
      </div>
      <h3 class="text-sm font-bold text-slate-900 dark:text-white">${f.title}</h3>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.desc}</p>
    </div>`;
  }).join('');

  return `<section class="space-y-6">
    <div class="text-center space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// CORE CAPABILITIES</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Built for Critical Missions</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>
  </section>`;
}

function renderModesSection() {
  const colorMap = {
    orange: { border: 'border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
    emerald: { border: 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    sky: { border: 'border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500' },
    rose: { border: 'border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' }
  };
  const cards = MODES.map((m) => {
    const c = colorMap[m.color];
    return `
    <div class="border ${c.border} rounded-xl p-5 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${c.dot} animate-pulse"></span>
          <span class="font-mono text-xs font-bold ${c.text}">${m.name}</span>
        </div>
        <span class="text-[10px] font-mono text-slate-500">${m.power}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${m.desc}</p>
      <div class="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <span class="text-[10px] font-mono text-slate-500">LED:</span>
        <span class="text-[10px] font-mono text-slate-700 dark:text-slate-300">${m.led}</span>
      </div>
    </div>`;
  }).join('');

  return `<section class="space-y-6">
    <div class="text-center space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// OPERATING MODES</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Four Modes for Every Scenario</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">${cards}</div>
  </section>`;
}

function renderQuickLinks() {
  const links = [
    { href: '/wiki', title: 'Technical Wiki', desc: 'Complete hardware, firmware, and assembly documentation', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>' },
    { href: '/builder', title: 'BOM Builder', desc: 'Calculate costs, find parts, and plan your build', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"/>' },
    { href: '/demo', title: 'Live Demo', desc: 'Interactive firmware simulation in the browser', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>' },
    { href: 'https://github.com/Leo-Galli/Aegis-Beacon', title: 'Source Code', desc: 'Full firmware, hardware schematics, and Gerber files', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>', external: true }
  ];

  const cards = links.map((l) => `
    <a href="${l.href}" ${l.external ? 'target="_blank" rel="noopener"' : ''} class="group flex items-center gap-4 p-4 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-orange-500/50 hover:shadow-md transition-all duration-200">
      <div class="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/50 shrink-0 group-hover:scale-110 transition-transform">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">${l.icon}</svg>
      </div>
      <div class="min-w-0">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">${l.title}</h3>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">${l.desc}</p>
      </div>
      <svg class="w-4 h-4 text-slate-400 group-hover:text-orange-500 shrink-0 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
    </a>`).join('');

  return `<section class="space-y-6">
    <div class="text-center space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// GET STARTED</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Explore the Project</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">${cards}</div>
  </section>`;
}

const JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aegis-Beacon",
  "url": "https://aegis-beacon.vercel.app/",
  "description": "Open-source emergency radio-location system based on LoRa"
}`;

export function renderLandingPage(lang, dict, currentPath = '/') {
  const content = [
    renderSVGPrototype(),
    renderSpecsDashboard(),
    renderFeaturesGrid(),
    renderModesSection(),
    renderQuickLinks()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | Open Source Emergency Radio System',
    description: 'Low-cost emergency radio-location system based on LoRa for mountain rescue and SAR operations. Interactive PCB prototype, technical wiki, and BOM builder.',
    canonical: `${SITE_URL}/`,
    jsonLd: JSON_LD,
    header: { action: 'Wiki', actionHref: '/wiki' },
    tabs: false,
    content,
    footer: {
      tagline: 'Aegis Open Source Engineering Network - Technical Reference v5.4'
    },
    scriptSrc: null,
    withIconLinks: true,
    currentPath
  });
}
