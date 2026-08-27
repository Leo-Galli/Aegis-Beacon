/**
 * Aegis-Beacon — Landing page, rendered entirely by Node.
 *
 * Modern hero-style landing page with:
 * - Animated hero section with gradient background
 * - Statistics counters
 * - Feature cards with hover effects
 * - Technology stack overview
 * - Call-to-action section
 * - Orange theme throughout
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Data: hero stats ─────────────────────────────────────────────── */
const HERO_STATS = [
  { value: '~$23-28', label: 'Bill of Materials', accent: true },
  { value: '410-525', label: 'MHz Frequency Range' },
  { value: '65 h', label: 'BEACON Runtime' },
  { value: '4', label: 'Operating Modes' }
];

/* ── Data: feature cards ──────────────────────────────────────────── */
const FEATURES = [
  {
    icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>`,
    tag: '[ LORA RF ]',
    title: 'Long-Range Communication',
    desc: 'SX1262-based transceiver with +30 dBm PA for emergency beacon transmissions up to 15 km line-of-sight at 410-525 MHz.',
    glow: 'from-orange-500/10'
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>`,
    tag: '[ EFFICIENCY ]',
    title: 'Ultra-Low Power',
    desc: 'Deep sleep at 10 microamps with 30-second hardware watchdog. WiFi/BT disabled in beacon mode to save 120 mA continuous draw.',
    glow: 'from-emerald-500/10'
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>`,
    tag: '[ INFRASTRUCTURE ]',
    title: 'Zero Dependencies',
    desc: 'No GSM, WiFi, or commercial satellite requirements. Direct peer-to-peer radio communication at 410-525 MHz.',
    glow: 'from-sky-500/10'
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17l-5.384 3.18A1.5 1.5 0 014 17.04V6.96a1.5 1.5 0 012.036-1.41l5.384 3.18m0 0l5.384-3.18A1.5 1.5 0 0120 6.96v10.08a1.5 1.5 0 01-2.036 1.41l-5.384-3.18m0 0V12m0 3.17V12" /></svg>`,
    tag: '[ OPEN SOURCE ]',
    title: 'MIT Licensed',
    desc: 'Full source code, hardware schematics, and BOM under MIT license. Community-driven development with PlatformIO integration.',
    glow: 'from-violet-500/10'
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>`,
    tag: '[ SAFETY ]',
    title: 'Emergency Certified',
    desc: 'CW Morse beacon with GPS coordinates for SAR operations. Compliant with PMR446 and GMRS wilderness protocols.',
    glow: 'from-rose-500/10'
  },
  {
    icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>`,
    tag: '[ CONFIGURATION ]',
    title: 'WiFi Config Portal',
    desc: 'Captive portal at 192.168.4.1 for field configuration. Adjust frequencies, WPM, power output, and GPS settings without reflashing.',
    glow: 'from-amber-500/10'
  }
];

/* ── Data: technology stack ───────────────────────────────────────── */
const STACK_ITEMS = [
  { name: 'ESP32', category: 'MCU', detail: 'Dual-core 240 MHz' },
  { name: 'SX1262', category: 'RF', detail: '+30 dBm PA' },
  { name: 'Arduino', category: 'FW', detail: 'PlatformIO' },
  { name: 'Node.js', category: 'WEB', detail: 'v18+' },
  { name: 'Tailwind', category: 'CSS', detail: 'Utility-first' },
  { name: 'Vercel', category: 'DEPLOY', detail: 'Serverless' }
];

/* ── Data: operating modes ────────────────────────────────────────── */
const MODES = [
  { name: 'BEACON', desc: 'Morse SOS + GPS on all frequencies, deep sleep cycles', color: 'orange', freq: '433.5 MHz', power: '+17 dBm' },
  { name: 'SEARCH', desc: 'Sequential frequency scanning with RSSI measurement', color: 'emerald', freq: 'All stored', power: 'Rx only' },
  { name: 'CONFIG', desc: 'WiFi captive portal for field configuration', color: 'sky', freq: '2.4 GHz', power: 'WiFi AP' },
  { name: 'EMERGENCY', desc: 'Max power continuous TX, no sleep, 1760 Hz tone', color: 'rose', freq: 'All stored', power: '+22 dBm' }
];

/* ── Section renderers ─────────────────────────────────────────────── */

function renderHeroStats() {
  const stats = HERO_STATS.map((s) => `
    <div class="text-center px-4 py-3">
      <div class="text-2xl sm:text-3xl font-bold font-mono ${s.accent ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}">${s.value}</div>
      <div class="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">${s.label}</div>
    </div>`).join('');

  return `<section class="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-[#0d1322] dark:via-[#090d16] dark:to-[#0d1322] rounded-2xl border border-orange-200/50 dark:border-orange-900/30 p-8 sm:p-12">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300/5 dark:bg-orange-400/3 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 text-center space-y-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60">
        <span class="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
        <span class="text-[11px] font-mono font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Open Source Emergency Radio System</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
        <span class="notranslate">Aegis-Beacon</span>
        <span class="block text-orange-600 dark:text-orange-400 mt-2">v5.4</span>
      </h1>

      <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
        Low-cost emergency radio-location system based on LoRa. Designed for mountain rescue, land operations, and critical civilian scenarios when cellular infrastructure is unavailable.
      </p>

      <div class="flex flex-wrap justify-center gap-4 pt-4">
        <a href="/wiki" class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm font-bold rounded-lg transition-all duration-200 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30">
          <span>Explore Wiki</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>
        <a href="/demo.html" class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-mono text-sm font-bold rounded-lg hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200">
          <span>Live Demo</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </a>
        <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-orange-600 text-white font-mono text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-orange-500 transition-all duration-200">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="relative z-10 mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-orange-200/50 dark:border-orange-900/30 pt-8">
      ${stats}
    </div>
  </section>`;
}

function renderFeatures() {
  const cards = FEATURES.map((f) => `
    <div class="group relative bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 overflow-hidden hover:border-orange-500/60 dark:hover:border-orange-500/40 hover:shadow-lg transition-all duration-300">
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${f.glow} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div class="relative">
        <div class="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/50">
          ${f.icon}
        </div>
      </div>
      <div class="relative">
        <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">${f.tag}</span>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mt-1">${f.title}</h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">${f.desc}</p>
      </div>
    </div>`).join('');

  return `<section class="space-y-8">
    <div class="text-center space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// CORE CAPABILITIES</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Built for Critical Missions</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Every component selected for reliability in emergency scenarios. From RF amplification to ultra-low power management.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${cards}
    </div>
  </section>`;
}

function renderModes() {
  const cards = MODES.map((m) => {
    const colors = {
      orange: 'border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20',
      emerald: 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20',
      sky: 'border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20',
      rose: 'border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20'
    };
    const textColors = {
      orange: 'text-orange-600 dark:text-orange-400',
      emerald: 'text-emerald-600 dark:text-emerald-400',
      sky: 'text-sky-600 dark:text-sky-400',
      rose: 'text-rose-600 dark:text-rose-400'
    };
    return `
    <div class="border ${colors[m.color]} rounded-xl p-5 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs font-bold ${textColors[m.color]}">${m.name}</span>
        <span class="text-[10px] font-mono text-slate-500">${m.freq}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${m.desc}</p>
      <div class="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <span class="text-[10px] font-mono text-slate-500">TX Power</span>
        <span class="text-[10px] font-mono font-bold ${textColors[m.color]}">${m.power}</span>
      </div>
    </div>`;
  }).join('');

  return `<section class="space-y-8">
    <div class="text-center space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// OPERATING MODES</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Four Modes for Every Scenario</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">From passive beacon transmission to emergency high-power output, the system adapts to mission requirements.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${cards}
    </div>
  </section>`;
}

function renderStack() {
  const items = STACK_ITEMS.map((s) => `
    <div class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg hover:border-orange-500/50 dark:hover:border-orange-500/30 transition-all">
      <span class="font-mono text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase w-12">${s.category}</span>
      <span class="text-sm font-bold text-slate-900 dark:text-white">${s.name}</span>
      <span class="text-xs text-slate-500 dark:text-slate-400 ml-auto">${s.detail}</span>
    </div>`).join('');

  return `<section class="space-y-8">
    <div class="text-center space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// TECHNOLOGY STACK</span>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Engineered with Proven Technologies</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Every technology chosen for reliability, performance, and community support in critical applications.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
      ${items}
    </div>
  </section>`;
}

function renderCTA() {
  return `<section class="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 sm:p-12 text-center">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
    </div>
    <div class="relative z-10 space-y-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-white">Ready to Build Your Own?</h2>
      <p class="text-orange-100 max-w-2xl mx-auto">Complete documentation, step-by-step assembly guide, and firmware source code. Total BOM under $28 USD.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/wiki" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-mono text-sm font-bold rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-lg">
          <span>Full Build Wiki</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>
        <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 bg-orange-700 text-white font-mono text-sm font-bold rounded-lg hover:bg-orange-800 transition-all duration-200">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span>Source Code</span>
        </a>
      </div>
    </div>
  </section>`;
}

const JSON_LD = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://aegis-beacon.vercel.app/#website",
      "url": "https://aegis-beacon.vercel.app/",
      "name": "Aegis-Beacon",
      "description": "Open-source SAR radio tracking and location project",
      "publisher": {
        "@type": "Organization",
        "@id": "https://aegis-beacon.vercel.app/#organization",
        "name": "Aegis Open Source Project",
        "alternateName": "Aegis-Beacon",
        "url": "https://aegis-beacon.vercel.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aegis-beacon.vercel.app/icon.png",
          "width": 512,
          "height": 512
        },
        "image": "https://aegis-beacon.vercel.app/banner.png",
        "description": "Open-source emergency radio location project based on LoRa/SX1262 for alpine SAR operations.",
        "foundingDate": "2026",
        "founder": {
          "@type": "Person",
          "name": "Leonardo Galli",
          "url": "https://github.com/Leo-Galli"
        },
        "sameAs": [
          "https://github.com/Leo-Galli/Aegis-Beacon",
          "https://github.com/Leo-Galli"
        ]
      },
      "inLanguage": ["it-IT","en-US","fr-FR","es-ES"]
    },
    {
      "@type": "WebPage",
      "@id": "https://aegis-beacon.vercel.app/#webpage",
      "url": "https://aegis-beacon.vercel.app/",
      "name": "Aegis-Beacon v5.4 | Open Source Emergency Radio System",
      "isPartOf": { "@id": "https://aegis-beacon.vercel.app/#website" },
      "description": "Low-cost emergency radio-location system based on LoRa for mountain rescue and SAR operations.",
      "inLanguage": ["it-IT","en-US","fr-FR","es-ES"]
    }
  ]
}`;

/** Render the full landing page for the requested language. */
export function renderLandingPage(lang, dict) {
  const content = [
    renderHeroStats(),
    renderFeatures(),
    renderModes(),
    renderStack(),
    renderCTA()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | Open Source Emergency Radio System',
    description: 'Low-cost emergency radio-location system based on LoRa. Designed for mountain rescue, land operations, and critical civilian scenarios when cellular infrastructure is unavailable.',
    canonical: `${SITE_URL}/`,
    jsonLd: JSON_LD,
    header: { action: 'Wiki', actionHref: '/wiki' },
    tabs: false,
    content,
    footer: {
      tagline: '<span class="notranslate">Aegis</span> Open Source Engineering Network -- Technical File Reference v5.4 Revision 2026.'
    },
    scriptSrc: null,
    withIconLinks: true
  });
}
