/**
 * Aegis-Beacon -- Landing page with animations and stunning design.
 *
 * Hero with animated gradient background, glass-morphism feature cards,
 * proper stats bar, and call-to-action. All animations via CSS classes.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Data ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '$23-28', label: 'Total BOM Cost' },
  { value: '410-525', label: 'MHz Frequency Range' },
  { value: '65h', label: 'BEACON Runtime' },
  { value: '15 km', label: 'Max Range (LOS)' },
  { value: '10 uA', label: 'Deep Sleep Current' },
  { value: '4', label: 'Operating Modes' }
];

const FEATURES = [
  { tag: 'LORA RF', title: 'Long-Range Communication', desc: 'SX1262-based transceiver with +30 dBm PA for emergency beacon transmissions up to 15 km line-of-sight at 410-525 MHz.', color: 'orange' },
  { tag: 'EFFICIENCY', title: 'Ultra-Low Power', desc: 'Deep sleep at 10 microamps with 30-second hardware watchdog. WiFi/BT disabled in beacon mode to save 120 mA continuous draw.', color: 'emerald' },
  { tag: 'INFRASTRUCTURE', title: 'Zero Infrastructure', desc: 'No GSM, WiFi, or commercial satellite requirements. Direct peer-to-peer radio communication at 410-525 MHz.', color: 'sky' },
  { tag: 'OPEN SOURCE', title: 'MIT Licensed', desc: 'Full source code, hardware schematics, and BOM under MIT license. Community-driven development with PlatformIO.', color: 'violet' },
  { tag: 'SAFETY', title: 'Emergency Certified', desc: 'CW Morse beacon with GPS coordinates for SAR operations. Compliant with PMR446 and GMRS wilderness protocols.', color: 'rose' },
  { tag: 'CONFIGURATION', title: 'WiFi Config Portal', desc: 'Captive portal at 192.168.4.1 for field configuration. Adjust frequencies, WPM, power output, and GPS settings.', color: 'amber' }
];

const MODES = [
  { name: 'BEACON', desc: 'Transmits Morse SOS + GPS on all configured frequencies, then enters deep sleep. Red LED active.', power: '+17 dBm', color: 'orange' },
  { name: 'SEARCH', desc: 'Scans all frequencies sequentially, measuring RSSI on each. Audio alert on detection. Blue LED active.', power: 'Rx only', color: 'emerald' },
  { name: 'CONFIG', desc: 'WiFi AP mode with captive portal dashboard. Adjust all settings via browser without reflashing.', power: 'WiFi AP', color: 'sky' },
  { name: 'EMERGENCY', desc: 'Maximum power continuous TX with full payload. No deep sleep. 1760 Hz audible tone. Critical situations only.', power: '+22 dBm', color: 'rose' }
];

/* ── Renderers ────────────────────────────────────────────────────── */

function renderHero() {
  const statBar = STATS.map((s, i) => `
    <div class="text-center animate-fade-in-up" style="animation-delay: ${0.6 + i * 0.1}s; opacity: 0;">
      <div class="text-xl sm:text-2xl font-bold font-mono stat-value">${s.value}</div>
      <div class="text-[9px] sm:text-[10px] font-mono text-orange-200/70 uppercase tracking-widest mt-1">${s.label}</div>
    </div>`).join('');

  return `<section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-[1px] animate-pulse-glow">
    <div class="relative rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      <!-- Animated background orbs -->
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>

      <div class="relative z-10 px-6 sm:px-12 py-16 sm:py-20 text-center space-y-8">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm animate-fade-in-up" style="animation-delay: 0.1s; opacity: 0;">
          <span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
          <span class="text-[11px] font-mono font-bold text-orange-300 uppercase tracking-wider" data-key="hero-badge">Open Source Emergency Radio System</span>
        </div>

        <!-- Title -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-fade-in-up" style="animation-delay: 0.2s; opacity: 0;">
          <span class="notranslate">Aegis</span><span class="gradient-text">-</span><span class="notranslate">Beacon</span>
          <span class="block text-3xl sm:text-4xl lg:text-5xl font-mono text-orange-400/80 mt-3">v5.4</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.3s; opacity: 0;" data-key="hero-desc">
          Low-cost emergency radio-location system based on LoRa. Designed for mountain rescue, land operations, and critical civilian scenarios when cellular infrastructure is unavailable.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap justify-center gap-4 pt-2 animate-fade-in-up" style="animation-delay: 0.4s; opacity: 0;">
          <a href="/wiki" class="group inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-mono text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40 hover:scale-105">
            Explore Wiki
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
          <a href="/builder" class="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105">
            BOM Builder
          </a>
          <a href="/demo" class="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Live Demo
          </a>
          <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 font-mono text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>

        <!-- Stats bar -->
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-8 border-t border-white/10">
          ${statBar}
        </div>
      </div>
    </div>
  </section>`;
}

function renderFeatures() {
  const colorMap = {
    orange: { accent: 'bg-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    emerald: { accent: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    sky: { accent: 'bg-sky-500', text: 'text-sky-400', glow: 'shadow-sky-500/20' },
    violet: { accent: 'bg-violet-500', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
    rose: { accent: 'bg-rose-500', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
    amber: { accent: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/20' }
  };
  const cards = FEATURES.map((f, i) => {
    const c = colorMap[f.color];
    return `
    <div class="group relative bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-orange-500/40 hover:shadow-xl hover:${c.glow} transition-all duration-300 hover-lift animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.1}s; opacity: 0;">
      <div class="w-10 h-10 rounded-xl ${c.accent}/10 flex items-center justify-center">
        <div class="w-2.5 h-2.5 rounded-full ${c.accent} animate-pulse"></div>
      </div>
      <span class="text-[9px] font-mono font-bold ${c.text} uppercase tracking-wider">${f.tag}</span>
      <h3 class="text-base font-bold text-slate-900 dark:text-white">${f.title}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${f.desc}</p>
    </div>`;
  }).join('');

  return `<section class="space-y-10">
    <div class="text-center space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest animate-fade-in">// CORE CAPABILITIES</span>
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white animate-fade-in-up" style="animation-delay: 0.1s; opacity: 0;" data-key="features-title">Built for Critical Missions</h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s; opacity: 0;" data-key="feat-subtitle">Every component selected for reliability when lives depend on it.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">${cards}</div>
  </section>`;
}

function renderModes() {
  const colorMap = {
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-900/40', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950/20', border: 'border-sky-200 dark:border-sky-900/40', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-900/40', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' }
  };
  const cards = MODES.map((m, i) => {
    const c = colorMap[m.color];
    return `
    <div class="border ${c.border} ${c.bg} rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.1}s; opacity: 0;">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full ${c.dot} animate-pulse"></span>
          <span class="font-mono text-sm font-bold ${c.text}">${m.name}</span>
        </div>
        <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">${m.power}</span>
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${m.desc}</p>
    </div>`;
  }).join('');

  return `<section class="space-y-10">
    <div class="text-center space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest animate-fade-in">// OPERATING MODES</span>
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white animate-fade-in-up" style="animation-delay: 0.1s; opacity: 0;" data-key="modes-title">Four Modes for Every Scenario</h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s; opacity: 0;" data-key="modes-subtitle">From passive beacon to emergency high-power output.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">${cards}</div>
  </section>`;
}

function renderHardware() {
  const COMPONENTS = [
    { name: 'ESP32 DevKit V1', role: 'Dual-core 240 MHz MCU, WiFi/BT, GPIO, ADC', price: '~$3' },
    { name: 'Ebyte E22-400M30S', role: 'SX1262 LoRa transceiver, +30 dBm PA, 410-525 MHz', price: '~$5.50' },
    { name: 'SSD1309 OLED', role: '2.42" 128x64 display, SW SPI via U8g2', price: '~$3.50' },
    { name: 'NEO-6M GPS', role: 'UART2 NMEA coordinates, optional module', price: '~$4.50' },
    { name: 'TP4056 + 18650', role: 'USB-C Li-ion charging, 3.7V 3000mAh cell', price: '~$2' },
    { name: 'Passives + Enclosure', role: 'SMD components, Hammond 1593L, SMA, headers', price: '~$7' }
  ];

  const rows = COMPONENTS.map((c) => `
    <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div class="min-w-0 flex-1">
        <span class="text-sm font-bold text-slate-900 dark:text-white">${c.name}</span>
        <span class="text-xs text-slate-500 dark:text-slate-400 ml-3 hidden sm:inline">${c.role}</span>
      </div>
      <span class="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 shrink-0 ml-4">${c.price}</span>
    </div>`).join('');

  return `<section class="space-y-10">
    <div class="text-center space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest animate-fade-in">// HARDWARE</span>
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white animate-fade-in-up" style="animation-delay: 0.1s; opacity: 0;" data-key="bom-title">Bill of Materials</h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s; opacity: 0;" data-key="bom-subtitle">Every component listed with sourcing links and pricing.</p>
    </div>
    <div class="max-w-3xl mx-auto bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-fade-in-up" style="animation-delay: 0.3s; opacity: 0;">
      ${rows}
      <div class="flex items-center justify-between pt-4 mt-2 border-t-2 border-orange-200 dark:border-orange-900/40">
        <span class="text-sm font-bold text-slate-900 dark:text-white">Estimated Total</span>
        <span class="text-lg font-mono font-bold stat-value">~$23-28 USD</span>
      </div>
      <div class="mt-4">
        <a href="/builder" class="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-400/30 hover:scale-105">
          Open BOM Builder
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
      </div>
    </div>
  </section>`;
}

function renderCTA() {
  return `<section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-[1px] animate-fade-in-up" style="animation-delay: 0.2s; opacity: 0;">
    <div class="relative rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-10 sm:p-14 text-center space-y-6">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-[80px] animate-float"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] animate-float" style="animation-delay: 2s"></div>
      </div>
      <div class="relative z-10 space-y-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white" data-key="cta-title">Ready to Build Your Own?</h2>
        <p class="text-slate-300 max-w-xl mx-auto" data-key="cta-desc">Complete documentation, step-by-step assembly guide, interactive firmware demo, and BOM calculator. Everything you need.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="/wiki" class="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-mono text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40 hover:scale-105">
            <span data-key="cta-btn-wiki">Full Build Wiki</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </a>
          <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all hover:scale-105">
            <span data-key="cta-btn-github">Source Code on GitHub</span>
          </a>
        </div>
      </div>
    </div>
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
    renderHero(),
    renderFeatures(),
    renderModes(),
    renderHardware(),
    renderCTA()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | Open Source Emergency Radio System',
    description: 'Low-cost emergency radio-location system based on LoRa for mountain rescue and SAR operations.',
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
