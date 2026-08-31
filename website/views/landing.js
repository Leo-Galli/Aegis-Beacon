/**
 * Aegis-Beacon -- Landing Page
 *
 * Professional, modern landing with impressive visual design.
 * Features: animated hero with device visualization, feature grid,
 * operating modes, stats bar, and strong CTA section.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Data ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '$23-28', label: 'Total BOM Cost', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
  { value: '410-525', label: 'MHz Frequency Range', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5' },
  { value: '65h+', label: 'Beacon Runtime', icon: 'M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z' },
  { value: '15 km', label: 'Maximum Range', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
  { value: '10 uA', label: 'Deep Sleep', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { value: '4', label: 'Operating Modes', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' }
];

const FEATURES = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-7 h-7"><path d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'Long-Range Emergency Radio',
    desc: 'SX1262 transceiver with +30 dBm PA delivers emergency beacon transmissions up to 15 km line-of-sight across the 410-525 MHz band.',
    color: 'orange'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-7 h-7"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'Ultra-Low Power Design',
    desc: 'Deep sleep at 10 microamps with 30-second hardware watchdog. WiFi and Bluetooth disabled in beacon mode for maximum battery life.',
    color: 'emerald'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-7 h-7"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'No Infrastructure Required',
    desc: 'No GSM, WiFi, or commercial satellite needed. Direct peer-to-peer radio communication works anywhere in the wilderness.',
    color: 'sky'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-7 h-7"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'MIT Licensed Open Source',
    desc: 'Full source code, hardware schematics, and BOM under MIT license. Community-driven development with PlatformIO support.',
    color: 'violet'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-7 h-7"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'CW Morse Beacon with GPS',
    desc: 'Continuous-wave beacon transmitting SOS and GPS coordinates for search-and-rescue operations. Compliant with PMR446 protocols.',
    color: 'rose'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-7 h-7"><path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'WiFi Config Portal',
    desc: 'Captive portal at 192.168.4.1 for field configuration. Adjust frequencies, WPM, power output, and GPS settings without reflashing.',
    color: 'amber'
  }
];

const MODES = [
  { name: 'BEACON', tag: '01', desc: 'Transmits Morse SOS with GPS coordinates on all configured frequencies, then enters deep sleep cycle for maximum runtime.', power: '+17 dBm', led: 'Red', color: 'orange' },
  { name: 'SEARCH', tag: '02', desc: 'Scans all frequencies sequentially, measuring RSSI on each. Rising-pitch audio alert when signal is detected.', power: 'Rx only', led: 'Blue', color: 'emerald' },
  { name: 'CONFIG', tag: '03', desc: 'WiFi AP mode with captive portal dashboard. Adjust all settings via browser without reflashing the firmware.', power: 'WiFi AP', led: 'Both', color: 'sky' },
  { name: 'EMERGENCY', tag: '04', desc: 'Maximum power continuous TX with full payload. No deep sleep. 1760 Hz audible tone for critical rescue situations.', power: '+22 dBm', led: 'Red fast', color: 'rose' }
];

/* ── Device SVG Illustration ──────────────────────────────────────── */
function renderDeviceIllustration() {
  return `
  <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-md mx-auto animate-float" aria-label="Aegis-Beacon device illustration">
    <!-- Antenna -->
    <line x1="200" y1="30" x2="200" y2="10" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
    <circle cx="200" cy="8" r="3" fill="#f97316"/>
    <line x1="200" y1="30" x2="200" y2="65" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    
    <!-- PCB Board -->
    <rect x="100" y="65" width="200" height="140" rx="8" fill="#1a1a2e" stroke="#f97316" stroke-width="1.5" opacity="0.9"/>
    <rect x="105" y="70" width="190" height="130" rx="5" fill="#16213e"/>
    
    <!-- ESP32 Chip -->
    <rect x="130" y="90" width="50" height="35" rx="3" fill="#0f3460" stroke="#64748b" stroke-width="0.8"/>
    <text x="155" y="111" font-family="JetBrains Mono, monospace" font-size="7" fill="#94a3b8" text-anchor="middle">ESP32</text>
    
    <!-- SX1262 Module -->
    <rect x="200" y="85" width="60" height="25" rx="3" fill="#0f3460" stroke="#f97316" stroke-width="1"/>
    <text x="230" y="101" font-family="JetBrains Mono, monospace" font-size="6" fill="#f97316" text-anchor="middle">SX1262</text>
    
    <!-- OLED Display -->
    <rect x="125" y="135" width="70" height="35" rx="3" fill="#030712" stroke="#1e293b" stroke-width="1"/>
    <rect x="128" y="138" width="64" height="29" rx="2" fill="#0a0a0a"/>
    <text x="160" y="151" font-family="JetBrains Mono, monospace" font-size="5" fill="#22c55e">SOS -- --- ...</text>
    <text x="160" y="159" font-family="JetBrains Mono, monospace" font-size="4" fill="#22c55e" opacity="0.7">N45 53.12 E09 12.45</text>
    <text x="160" y="165" font-family="JetBrains Mono, monospace" font-size="4" fill="#f97316">433.500 MHz</text>
    
    <!-- GPS Module -->
    <rect x="210" y="120" width="40" height="30" rx="3" fill="#0f3460" stroke="#64748b" stroke-width="0.8"/>
    <text x="230" y="139" font-family="JetBrains Mono, monospace" font-size="5" fill="#94a3b8" text-anchor="middle">GPS</text>
    
    <!-- Battery -->
    <rect x="210" y="158" width="55" height="20" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="0.8"/>
    <rect x="213" y="161" width="40" height="14" rx="2" fill="#10b981" opacity="0.3"/>
    <text x="237" y="172" font-family="JetBrains Mono, monospace" font-size="5" fill="#10b981" text-anchor="middle">18650</text>
    
    <!-- SMA Connector -->
    <rect x="175" y="60" width="50" height="8" rx="2" fill="#71717a" stroke="#a1a1aa" stroke-width="0.5"/>
    <text x="200" y="56" font-family="JetBrains Mono, monospace" font-size="4" fill="#64748b" text-anchor="middle">SMA</text>
    
    <!-- TP4056 Charger -->
    <rect x="115" y="135" width="8" height="20" rx="1" fill="#1e293b" stroke="#f97316" stroke-width="0.5"/>
    
    <!-- LED indicator -->
    <circle cx="118" cy="128" r="2.5" fill="#ef4444" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Signal waves -->
    <g opacity="0.4">
      <path d="M200 25 Q210 15 220 25" stroke="#f97316" stroke-width="1" fill="none" stroke-linecap="round">
        <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M195 20 Q200 8 205 20" stroke="#f97316" stroke-width="1" fill="none" stroke-linecap="round">
        <animate attributeName="opacity" values="0;0.4;0" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </path>
    </g>
    
    <!-- Component labels -->
    <text x="200" y="230" font-family="JetBrains Mono, monospace" font-size="6" fill="#64748b" text-anchor="middle">Aegis-Beacon v5.4 | ESP32 + SX1262 + GPS</text>
  </svg>`;
}

/* ── Section Renderers ────────────────────────────────────────────── */

function renderHero() {
  const statBar = STATS.map((s, i) => {
    const iconSvg = `<svg class="w-5 h-5 text-orange-500/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${s.icon}"/></svg>`;
    return `
    <div class="text-center animate-fade-in-up" style="animation-delay: ${0.6 + i * 0.08}s">
      <div class="flex items-center justify-center gap-2 mb-1">
        ${iconSvg}
        <div class="text-2xl sm:text-3xl font-bold font-mono stat-value">${s.value}</div>
      </div>
      <div class="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">${s.label}</div>
    </div>`;
  }).join('');

  return `
  <section class="relative rounded-2xl sm:rounded-3xl overflow-hidden animate-scale-in">
    <!-- Gradient border -->
    <div class="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-400 to-orange-600 rounded-2xl sm:rounded-3xl p-[1.5px]">
      <div class="w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--surface-alt)] to-[var(--surface)]"></div>
    </div>
    <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#0a0f1a] dark:via-[#0d1424] dark:to-[#0a0f1a]">
      <!-- Animated orbs -->
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>
      
      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"></div>

      <div class="relative z-10 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <!-- Left: Text content -->
          <div class="text-center lg:text-left">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm mb-6 animate-fade-in-up" style="animation-delay: 0.1s">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span class="text-[11px] font-mono font-bold text-orange-300 uppercase tracking-wider">Open Source Emergency Radio</span>
            </div>

            <!-- Title -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-4 animate-fade-in-up" style="animation-delay: 0.2s">
              <span class="notranslate" translate="no">Aegis-Beacon</span>
              <span class="block text-xl sm:text-2xl font-mono font-medium text-orange-400/70 mt-2 tracking-normal">v5.4 // LoRa Emergency System</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed mb-8 animate-fade-in-up" style="animation-delay: 0.3s">
              Low-cost emergency radio-location system based on LoRa. Designed for mountain rescue, land operations, and critical civilian scenarios when cellular infrastructure is unavailable.
            </p>

            <!-- CTAs -->
            <div class="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 animate-fade-in-up" style="animation-delay: 0.4s">
              <a href="/wiki" class="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-mono text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40 hover:scale-[1.03]">
                Explore Wiki
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </a>
              <a href="/demo" class="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.03]">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Live Demo
              </a>
              <a href="/builder" class="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-mono text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.03]">
                BOM Builder
              </a>
            </div>
          </div>

          <!-- Right: Device illustration -->
          <div class="flex justify-center lg:justify-end animate-fade-in-up" style="animation-delay: 0.5s">
            ${renderDeviceIllustration()}
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 mt-12 pt-8 border-t border-white/[0.06]">
          ${statBar}
        </div>
      </div>
    </div>
  </section>`;
}

function renderFeatures() {
  const colorClasses = {
    orange: { iconBg: 'bg-orange-500/10', iconText: 'text-orange-500', borderHover: 'hover:border-orange-500/40', shadow: 'hover:shadow-orange-500/10' },
    emerald: { iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-500', borderHover: 'hover:border-emerald-500/40', shadow: 'hover:shadow-emerald-500/10' },
    sky: { iconBg: 'bg-sky-500/10', iconText: 'text-sky-500', borderHover: 'hover:border-sky-500/40', shadow: 'hover:shadow-sky-500/10' },
    violet: { iconBg: 'bg-violet-500/10', iconText: 'text-violet-500', borderHover: 'hover:border-violet-500/40', shadow: 'hover:shadow-violet-500/10' },
    rose: { iconBg: 'bg-rose-500/10', iconText: 'text-rose-500', borderHover: 'hover:border-rose-500/40', shadow: 'hover:shadow-rose-500/10' },
    amber: { iconBg: 'bg-amber-500/10', iconText: 'text-amber-500', borderHover: 'hover:border-amber-500/40', shadow: 'hover:shadow-amber-500/10' }
  };
  const cards = FEATURES.map((f, i) => {
    const c = colorClasses[f.color];
    return `
    <div class="group relative bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl p-6 sm:p-7 space-y-4 ${c.borderHover} ${c.shadow} hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.08}s">
      <div class="w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center ${c.iconText} group-hover:scale-110 transition-transform duration-300">
        ${f.icon}
      </div>
      <h3 class="text-lg font-bold text-[var(--text-primary)] leading-snug">${f.title}</h3>
      <p class="text-sm text-[var(--text-secondary)] leading-relaxed">${f.desc}</p>
      <div class="flex items-center gap-1.5 pt-1 text-orange-500 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="text-[11px] font-mono font-bold uppercase tracking-wider">Learn more</span>
        <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
      </div>
    </div>`;
  }).join('');

  return `
  <section class="space-y-10">
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2">
        <div class="w-8 h-[1px] bg-orange-500"></div>
        <span class="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">Core Capabilities</span>
        <div class="w-8 h-[1px] bg-orange-500"></div>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Built for Critical Missions</h2>
      <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base">Every component selected for reliability when lives depend on it.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">${cards}</div>
  </section>`;
}

function renderModes() {
  const colorClasses = {
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-900/30', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500', tagBg: 'bg-orange-100 dark:bg-orange-900/30' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', tagBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950/20', border: 'border-sky-200 dark:border-sky-900/30', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500', tagBg: 'bg-sky-100 dark:bg-sky-900/30' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-900/30', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500', tagBg: 'bg-rose-100 dark:bg-rose-900/30' }
  };
  const cards = MODES.map((m, i) => {
    const c = colorClasses[m.color];
    return `
    <div class="border ${c.border} ${c.bg} rounded-2xl p-5 sm:p-6 space-y-3 hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.08}s">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-40"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${c.dot}"></span>
          </span>
          <span class="font-mono text-sm font-bold ${c.text}">${m.name}</span>
        </div>
        <span class="text-[9px] font-mono ${c.text} ${c.tagBg} px-2 py-0.5 rounded-full font-bold">${m.tag}</span>
      </div>
      <p class="text-sm text-[var(--text-secondary)] leading-relaxed">${m.desc}</p>
      <div class="flex items-center gap-3 pt-2 border-t ${c.border}">
        <div class="flex items-center gap-1.5">
          <span class="text-[9px] font-mono text-[var(--text-muted)] uppercase">TX:</span>
          <span class="text-[10px] font-mono font-bold ${c.text}">${m.power}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[9px] font-mono text-[var(--text-muted)] uppercase">LED:</span>
          <span class="text-[10px] font-mono text-[var(--text-secondary)]">${m.led}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <section class="space-y-10">
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2">
        <div class="w-8 h-[1px] bg-orange-500"></div>
        <span class="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">Operating Modes</span>
        <div class="w-8 h-[1px] bg-orange-500"></div>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Four Modes for Every Scenario</h2>
      <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base">From passive beacon to emergency high-power output.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">${cards}</div>
  </section>`;
}

function renderTechStack() {
  const items = [
    { label: 'ESP32', sub: 'Dual-Core MCU', color: 'text-sky-600 dark:text-sky-400' },
    { label: 'SX1262', sub: 'LoRa Transceiver', color: 'text-orange-600 dark:text-orange-400' },
    { label: 'SSD1309', sub: 'OLED Display', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'NEO-6M', sub: 'GPS Module', color: 'text-violet-600 dark:text-violet-400' },
    { label: 'RadioLib', sub: 'RF Library', color: 'text-rose-600 dark:text-rose-400' },
    { label: 'PlatformIO', sub: 'Build System', color: 'text-amber-600 dark:text-amber-400' }
  ];
  const chips = items.map((item, i) => `
    <div class="flex items-center gap-3 px-4 py-3 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl hover-lift animate-fade-in-up" style="animation-delay: ${0.1 + i * 0.06}s">
      <div class="w-2 h-2 rounded-full ${item.color} bg-current shrink-0"></div>
      <div>
        <span class="text-sm font-bold font-mono text-[var(--text-primary)]">${item.label}</span>
        <span class="text-[10px] font-mono text-[var(--text-muted)] ml-2">${item.sub}</span>
      </div>
    </div>
  `).join('');

  return `
  <section class="space-y-6">
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2">
        <div class="w-8 h-[1px] bg-orange-500"></div>
        <span class="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">Technology Stack</span>
        <div class="w-8 h-[1px] bg-orange-500"></div>
      </div>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Hardware and Software</h2>
      <p class="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base">Powered by industry-standard components and open-source tools.</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">${chips}</div>
  </section>`;
}

function renderCTA() {
  return `
  <section class="relative overflow-hidden rounded-2xl sm:rounded-3xl">
    <div class="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500"></div>
    <div class="absolute inset-0 opacity-10" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E&quot;);"></div>
    <div class="relative z-10 px-6 sm:px-10 py-12 sm:py-16 text-center text-white">
      <h2 class="text-3xl sm:text-4xl font-extrabold mb-4 animate-fade-in-up">Ready to Build Your Own?</h2>
      <p class="text-orange-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg animate-fade-in-up" style="animation-delay: 0.1s">
        Complete documentation, step-by-step assembly guide, interactive firmware demo, and BOM calculator.
      </p>
      <div class="flex flex-wrap justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.2s">
        <a href="/wiki" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-mono font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-[1.03] shadow-lg">
          Full Build Wiki
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
        <a href="https://github.com/Leo-Galli/Aegis-Beacon" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold rounded-xl transition-all duration-300 hover:scale-[1.03]">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Source Code
        </a>
        <a href="/builder" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold rounded-xl transition-all duration-300 hover:scale-[1.03]">
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
