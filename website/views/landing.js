/**
 * Aegis-Beacon -- Landing Page
 *
 * Clean, professional landing with clear hierarchy.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Data ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '$23-28', label: 'Total BOM Cost' },
  { value: '410-525', label: 'MHz Frequency' },
  { value: '65h+', label: 'Beacon Runtime' },
  { value: '15 km', label: 'Maximum Range' },
  { value: '10 uA', label: 'Deep Sleep' },
  { value: '4', label: 'Operating Modes' }
];

const FEATURES = [
  {
    title: 'Long-Range Emergency Radio',
    desc: 'SX1262 transceiver with +30 dBm PA delivers emergency beacon transmissions up to 15 km line-of-sight across the 410-525 MHz band.',
  },
  {
    title: 'Ultra-Low Power Design',
    desc: 'Deep sleep at 10 microamps with 30-second hardware watchdog. WiFi and Bluetooth disabled in beacon mode for maximum battery life.',
  },
  {
    title: 'No Infrastructure Required',
    desc: 'No GSM, WiFi, or commercial satellite needed. Direct peer-to-peer radio communication works anywhere in the wilderness.',
  },
  {
    title: 'MIT Licensed Open Source',
    desc: 'Full source code, hardware schematics, and BOM under MIT license. Community-driven development with PlatformIO support.',
  },
  {
    title: 'CW Morse Beacon with GPS',
    desc: 'Continuous-wave beacon transmitting SOS and GPS coordinates for search-and-rescue operations. Compliant with PMR446 protocols.',
  },
  {
    title: 'WiFi Config Portal',
    desc: 'Captive portal at 192.168.4.1 for field configuration. Adjust frequencies, WPM, power output, and GPS settings without reflashing.',
  }
];

const MODES = [
  { name: 'BEACON', tag: '01', desc: 'Transmits Morse SOS with GPS coordinates on all configured frequencies, then enters deep sleep cycle for maximum runtime.', power: '+17 dBm', led: 'Red' },
  { name: 'SEARCH', tag: '02', desc: 'Scans all frequencies sequentially, measuring RSSI on each. Rising-pitch audio alert when signal is detected.', power: 'Rx only', led: 'Blue' },
  { name: 'CONFIG', tag: '03', desc: 'WiFi AP mode with captive portal dashboard. Adjust all settings via browser without reflashing the firmware.', power: 'WiFi AP', led: 'Both' },
  { name: 'EMERGENCY', tag: '04', desc: 'Maximum power continuous TX with full payload. No deep sleep. 1760 Hz audible tone for critical rescue situations.', power: '+22 dBm', led: 'Red fast' }
];

/* ── Section Renderers ────────────────────────────────────────────── */

function renderHero() {
  const statBar = STATS.map((s) => {
    return `
    <div class="text-center">
      <div class="text-2xl sm:text-3xl font-bold font-mono stat-value">${s.value}</div>
      <div class="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">${s.label}</div>
    </div>`;
  }).join('');

  return `
  <section class="bg-slate-900 dark:bg-[#0a0f1a] rounded-2xl overflow-hidden animate-scale-in">
    <div class="relative px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6 animate-fade-in-up" style="animation-delay: 0.1s">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span class="text-[11px] font-mono font-bold text-orange-300 uppercase tracking-wider">Open Source Emergency Radio</span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-4 animate-fade-in-up" style="animation-delay: 0.2s">
          <span class="notranslate" translate="no">Aegis-Beacon</span>
        </h1>
        <p class="text-xl sm:text-2xl font-mono font-medium text-orange-400/70 mb-6 animate-fade-in-up" style="animation-delay: 0.25s">v5.4 // LoRa Emergency System</p>

        <!-- Subtitle -->
        <p class="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
          Low-cost emergency radio-location system based on LoRa. Designed for mountain rescue, land operations, and critical civilian scenarios when cellular infrastructure is unavailable.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style="animation-delay: 0.4s">
          <a href="/wiki" class="group inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-mono text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40">
            Explore Wiki
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
          <a href="/demo" class="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all duration-300">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Live Demo
          </a>
          <a href="/builder" class="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all duration-300">
            BOM Builder
          </a>
        </div>

        <!-- Stats Bar -->
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 pt-8 border-t border-white/[0.06]">
          ${statBar}
        </div>
      </div>
    </div>
  </section>`;
}

function renderFeatures() {
  const cards = FEATURES.map((f, i) => {
    return `
    <div class="bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-5 space-y-3 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.06}s">
      <h3 class="text-base font-bold text-[var(--text-primary)] leading-snug">${f.title}</h3>
      <p class="text-sm text-[var(--text-secondary)] leading-relaxed">${f.desc}</p>
    </div>`;
  }).join('');

  return `
  <section class="space-y-8">
    <div class="text-center space-y-3">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Core Capabilities</h2>
      <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base">Every component selected for reliability when lives depend on it.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>
  </section>`;
}

function renderModes() {
  const cards = MODES.map((m, i) => {
    return `
    <div class="border border-[var(--border)] bg-[var(--surface-alt)] rounded-xl p-5 space-y-3 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.06}s">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span class="font-mono text-sm font-bold text-[var(--text-primary)]">${m.name}</span>
        </div>
        <span class="text-[9px] font-mono text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">${m.tag}</span>
      </div>
      <p class="text-sm text-[var(--text-secondary)] leading-relaxed">${m.desc}</p>
      <div class="flex items-center gap-4 pt-2 border-t border-[var(--border-subtle)]">
        <span class="text-[10px] font-mono text-[var(--text-muted)]">TX: <strong class="text-[var(--text-primary)]">${m.power}</strong></span>
        <span class="text-[10px] font-mono text-[var(--text-muted)]">LED: <strong class="text-[var(--text-primary)]">${m.led}</strong></span>
      </div>
    </div>`;
  }).join('');

  return `
  <section class="space-y-8">
    <div class="text-center space-y-3">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Operating Modes</h2>
      <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base">From passive beacon to emergency high-power output.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">${cards}</div>
  </section>`;
}

function renderTechStack() {
  const items = [
    { label: 'ESP32', sub: 'Dual-Core MCU' },
    { label: 'SX1262', sub: 'LoRa Transceiver' },
    { label: 'SSD1309', sub: 'OLED Display' },
    { label: 'NEO-6M', sub: 'GPS Module' },
    { label: 'RadioLib', sub: 'RF Library' },
    { label: 'PlatformIO', sub: 'Build System' }
  ];
  const chips = items.map((item) => `
    <div class="flex items-center gap-3 px-4 py-3 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl">
      <div>
        <span class="text-sm font-bold font-mono text-[var(--text-primary)]">${item.label}</span>
        <span class="text-[10px] font-mono text-[var(--text-muted)] ml-2">${item.sub}</span>
      </div>
    </div>
  `).join('');

  return `
  <section class="space-y-6">
    <div class="text-center space-y-3">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Technology Stack</h2>
      <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base">Powered by industry-standard components and open-source tools.</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">${chips}</div>
  </section>`;
}

function renderCTA() {
  return `
  <section class="bg-orange-500 rounded-2xl overflow-hidden">
    <div class="px-6 sm:px-10 py-12 sm:py-16 text-center text-white">
      <h2 class="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Build Your Own?</h2>
      <p class="text-orange-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
        Complete documentation, step-by-step assembly guide, interactive firmware demo, and BOM calculator.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/wiki" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-mono font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-lg">
          Full Build Wiki
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
        <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold rounded-xl transition-all duration-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Source Code
        </a>
        <a href="/builder" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold rounded-xl transition-all duration-300">
          BOM Calculator
        </a>
      </div>
    </div>
  </section>`;
}

/* ── Export ────────────────────────────────────────────────────────── */

export function renderLandingPage() {
  const content = [
    renderHero(),
    renderFeatures(),
    renderModes(),
    renderTechStack(),
    renderCTA()
  ].join('\n\n');

  return renderPage({
    title: 'Aegis-Beacon v5.4 | Open Source Emergency Radio System',
    description: 'Low-cost emergency radio-location system based on LoRa for mountain rescue and SAR operations. ESP32 + SX1262 + GPS.',
    canonical: `${SITE_URL}/`,
    header: { action: 'Wiki', actionHref: '/wiki' },
    tabs: false,
    content,
    scriptSrc: null,
    withIconLinks: true,
  });
}
