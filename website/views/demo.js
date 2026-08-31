/**
 * Aegis-Beacon — firmware demo page, rendered entirely by Node.
 *
 * The complete interactive demo (SSD1309 OLED, virtual keypad, Morse engine,
 * frequency planner, GPS payload builder, RSSI scan, battery monitor and
 * serial console) is generated here. Interactive element ids consumed by
 * /js/demo.js (`oled-body`, `key-mode`, `bat-slider`, `morse-input`,
 * `serial`, ...) are preserved verbatim.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Data: hero badges ─────────────────────────────────────────────── */
const DEMO_BADGES = [
  { className: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900', dot: true, text: '4 Modes' },
  { className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', text: 'Morse 5-40 WPM' },
  { className: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900', text: 'SOS + Name + GPS' },
  { className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', text: '10 Frequencies' },
  { className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', text: 'SSD1309 OLED' }
];

/* ── Data: status rows ─────────────────────────────────────────────── */
const STATUS_ROWS = [
  { label: 'Mode', id: 'st-mode', value: 'BEACON', accent: 'text-orange-600 dark:text-orange-400' },
  { label: 'Frequency', id: 'st-freq', value: '433.500 MHz' },
  { label: 'Adjust target', id: 'st-adj', value: 'VOL' },
  { label: 'Volume', id: 'st-vol', value: '180 / 255' },
  { label: 'WPM', id: 'st-wpm', value: '13' },
  { label: 'RSSI (SEARCH)', id: 'st-rssi', value: '-112 dBm' },
  { label: 'Battery', id: 'st-bat', value: '87% · 4100 mV', accent: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'TX power', id: 'st-pwr', value: '+17 dBm', last: true }
];

/* ── Data: operating mode cards ────────────────────────────────────── */
const MODE_CARDS = [
  { mode: 'beacon', tag: 'MODE 01', tagClass: 'text-orange-600 dark:text-orange-400', hover: 'hover:border-orange-500/60', title: 'BEACON', desc: 'Morse SOS + name + GPS on every configured frequency, then deep sleep.' },
  { mode: 'search', tag: 'MODE 02', tagClass: 'text-emerald-600 dark:text-emerald-400', hover: 'hover:border-emerald-500/60', title: 'SEARCH', desc: 'Scans all frequencies, measures RSSI, rising-pitch audio alert.' },
  { mode: 'config', tag: 'MODE 03', tagClass: 'text-sky-600 dark:text-sky-400', hover: 'hover:border-sky-500/60', title: 'CONFIG', desc: 'WiFi captive-portal dashboard at 192.168.4.1 for field configuration.' },
  { mode: 'emergency', tag: 'MODE 04', tagClass: 'text-rose-600 dark:text-rose-400', hover: 'hover:border-rose-500/60', title: 'EMERGENCY', desc: 'Max power, continuous TX with full payload, no deep sleep, 1760 Hz tone.' }
];

/* ── Data: battery curve rows ──────────────────────────────────────── */
const BATTERY_CURVE = [
  ['4.20 V → 100%', '3.65 V → 50%'],
  ['4.05 V → 90%', '3.55 V → 35%'],
  ['3.90 V → 75%', '3.40 V → 20%'],
  ['3.75 V → 60%', '3.20 V → 10% · 3.00 V → 0%']
];

/* ── Data: serial console actions ──────────────────────────────────── */
const SERIAL_ACTIONS = [
  { sim: 'boot', label: 'BOOT' },
  { sim: 'tx', label: 'TX SOS' },
  { sim: 'scan', label: 'SCAN HIT' },
  { sim: 'gps', label: 'GPS FIX' },
  { sim: 'sleep', label: 'DEEP SLEEP' },
  { sim: 'clear', label: 'CLEAR', danger: true }
];

function renderDemoBadges() {
  return DEMO_BADGES.map((b) => {
    const dot = b.dot ? '<span class="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></span>' : '';
    return `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${b.className} text-[10px] font-mono font-medium border">${dot}${b.text}</span>`;
  }).join('\n');
}

function renderStatusRows() {
  return STATUS_ROWS.map((r) => `
          <div class="flex justify-between${r.last ? '' : ' border-b border-slate-100 dark:border-slate-800 pb-2'}"><dt class="text-slate-500 dark:text-slate-400">${r.label}</dt><dd id="${r.id}" class="${r.accent || 'text-slate-900 dark:text-white'} font-bold">${r.value}</dd></div>`).join('');
}

function renderModeCards() {
  return MODE_CARDS.map((m) => `
        <button data-set-mode="${m.mode}" class="mode-card text-left bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-1.5 ${m.hover} hover:shadow-md transition-all">
          <span class="font-mono text-[9px] ${m.tagClass} font-bold">${m.tag}</span>
          <span class="block text-xs font-bold text-slate-900 dark:text-white font-mono">${m.title}</span>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">${m.desc}</p>
        </button>`).join('');
}

function renderBatteryCurve() {
  return BATTERY_CURVE.map(([left, right]) =>
    `<tr><td class="py-1">${left}</td><td class="py-1 text-right">${right}</td></tr>`
  ).join('\n            ');
}

function renderSerialActions() {
  return SERIAL_ACTIONS.map((a) => {
    const cls = a.danger
      ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-[10px] font-mono px-2.5 py-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 transition'
      : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono px-2.5 py-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition';
    return `<button data-sim="${a.sim}" class="${cls}">${a.label}</button>`;
  }).join('\n          ');
}

/** Render the full demo page for the requested language. */
export function renderDemoPage() {
  const content = `
    <!-- HERO -->
    <section class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-3">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider">// INTERACTIVE FIRMWARE SIMULATION</span>
      <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Aegis-Beacon v5.4 — Complete Live Demo</h1>
      <div class="flex flex-wrap gap-1.5">
${renderDemoBadges()}
      </div>
      <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-4xl">
        This page simulates the complete <span class="notranslate" translate="no">Aegis-Beacon</span> firmware (<code class="text-orange-600 dark:text-orange-400">AegisBeacon.ino</code>) in the browser. Use the virtual buttons to switch modes, adjust WPM and volume, and watch the OLED, LEDs and serial console react exactly like the real ESP32 device.
      </p>
    </section>

    <!-- DEVICE SIMULATOR -->
    <section id="simulator" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 space-y-4">
        <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">SSD1309 128×64 OLED</h2>
            <div class="flex items-center gap-3 font-mono text-[10px]">
              <span class="flex items-center gap-1.5"><span id="led-red" class="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-700"></span>RED (BEACON)</span>
              <span class="flex items-center gap-1.5"><span id="led-blue" class="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-700"></span>BLUE (SEARCH)</span>
            </div>
          </div>

          <div class="oled-screen rounded aspect-[2/1] p-3 sm:p-4 text-[11px] sm:text-xs text-sky-200 leading-relaxed">
            <div id="oled-header" class="flex justify-between items-center oled-invert px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold tracking-wider">
              <span id="oled-mode-label">TX BEACON</span>
              <span id="oled-cycle">cycle #1</span>
              <span id="oled-battery">[████] 87%</span>
            </div>
            <div id="oled-body" class="mt-3 space-y-1.5"></div>
          </div>

          <div class="grid grid-cols-4 gap-2 pt-1">
            <button id="key-mode" class="key-btn bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 rounded-lg py-3 font-mono text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition">MODE</button>
            <button id="key-sel" class="key-btn bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-3 font-mono text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">SEL</button>
            <button id="key-up" class="key-btn bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-3 font-mono text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">UP ▲</button>
            <button id="key-dn" class="key-btn bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-3 font-mono text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition">DN ▼</button>
          </div>
          <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Hints: MODE short = BEACON↔SEARCH · MODE hold 2 s = EMERGENCY · SEL short = VOL/WPM target · SEL hold 3 s = CONFIG · UP/DN adjust selected parameter.</p>
        </div>
      </div>

      <div class="lg:col-span-5 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Device Status</h2>
        <dl class="font-mono text-xs space-y-2.5">
${renderStatusRows()}
        </dl>
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div class="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400"><span>Battery level</span><span id="bat-slider-val">87%</span></div>
          <input id="bat-slider" type="range" min="0" max="100" value="87" class="w-full accent-orange-600">
        </div>
      </div>
    </section>

    <!-- MODE CARDS -->
    <section class="space-y-3">
      <h2 class="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Operating Modes</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
${renderModeCards()}
      </div>
    </section>

    <!-- MORSE ENGINE -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Morse Engine — PARIS Standard</h2>
          <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold">dot = 1200 / WPM</span>
        </div>
        <div>
          <label class="text-[10px] font-mono text-slate-500 dark:text-slate-400">Message (A-Z, 0-9, space)</label>
          <input id="morse-input" type="text" value="SOS DE MARIO ROSSI PSN N4553 E1230" class="w-full mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500">
        </div>
        <div>
          <div class="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1"><span>WPM: <span id="morse-wpm-val" class="text-orange-600 dark:text-orange-400 font-bold">13</span></span><span id="morse-timing">dot 92 ms · dash 277 ms</span></div>
          <input id="morse-wpm" type="range" min="5" max="40" value="13" class="w-full accent-orange-600">
        </div>
        <div id="morse-output" class="bg-slate-950 rounded p-3 font-mono text-[11px] leading-loose min-h-[3.5rem] break-all text-sky-200"></div>
        <div id="morse-meta" class="text-[10px] font-mono text-slate-400 dark:text-slate-500"></div>
      </div>

      <div class="lg:col-span-5 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Timing Table</h2>
        <table class="w-full font-mono text-[11px] text-slate-600 dark:text-slate-400">
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr><td class="py-2">Dot</td><td class="py-2 text-right" id="t-dot">92 ms</td></tr>
            <tr><td class="py-2">Dash</td><td class="py-2 text-right" id="t-dash">277 ms</td></tr>
            <tr><td class="py-2">Intra-character gap</td><td class="py-2 text-right" id="t-intra">92 ms</td></tr>
            <tr><td class="py-2">Inter-character gap</td><td class="py-2 text-right" id="t-inter">277 ms</td></tr>
            <tr><td class="py-2">Word gap</td><td class="py-2 text-right" id="t-word">646 ms</td></tr>
          </tbody>
        </table>
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500 leading-relaxed">PARIS word = exactly 50 units. Payload duration estimate shown under the encoder above.</p>
      </div>
    </section>

    <!-- FREQUENCY PLANNER -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-6 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Frequency Planner <span class="text-slate-400 dark:text-slate-500 font-medium">(max 10)</span></h2>
        <div class="flex gap-2">
          <input id="freq-input" type="number" step="0.00001" value="434.500" class="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500">
          <button id="freq-add" class="bg-slate-900 dark:bg-orange-600 text-white rounded px-4 font-mono text-xs font-bold hover:bg-slate-800 dark:hover:bg-orange-500 transition">ADD</button>
        </div>
        <ul id="freq-list" class="space-y-1.5 font-mono text-xs"></ul>
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500">BEACON cycles through all frequencies; SEARCH scans them sequentially with configurable dwell time.</p>
      </div>

      <div class="lg:col-span-6 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">GPS Payload Builder</h2>
        <div class="grid grid-cols-2 gap-2">
          <input id="gps-first" type="text" placeholder="First name" value="MARIO" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500">
          <input id="gps-last" type="text" placeholder="Last name" value="ROSSI" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500">
          <input id="gps-lat" type="text" placeholder="Lat 45.8850" value="45.8850" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500">
          <input id="gps-lon" type="text" placeholder="Lon 12.5000" value="12.5000" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500">
        </div>
        <div class="bg-slate-950 rounded p-3 font-mono text-[11px] text-sky-200 break-all" id="gps-payload">SOS DE MARIO ROSSI PSN N4553 E1230</div>
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500">DDM encoding: N4553 = 45°53' N · E1230 = 12°30' E · ~185 m precision. Demo truncates minutes like the firmware (minutes × 10).</p>
      </div>
    </section>

    <!-- RSSI SCAN + BATTERY -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-6 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">SEARCH — RSSI Scan &amp; Audio Pitch</h2>
        <div class="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400"><span>RSSI: <span id="rssi-val" class="text-orange-600 dark:text-orange-400 font-bold">-87 dBm</span></span><span id="rssi-class" class="text-emerald-600 dark:text-emerald-400 font-bold">MEDIUM</span></div>
        <input id="rssi-slider" type="range" min="-120" max="-40" value="-87" class="w-full accent-orange-600">
        <div class="flex items-end h-24 gap-[3px] rounded border border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-900/40">
          <div id="rssi-fill" class="w-full rounded-sm bg-gradient-to-t from-orange-600 to-emerald-400 transition-all duration-150" style="height:40%"></div>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500">Pitch rises 440 → 2200 Hz with signal strength. <span id="pitch-val" class="text-slate-600 dark:text-slate-300">~880 Hz</span></p>
          <div class="flex gap-2">
            <button id="audio-on" class="bg-emerald-600 text-white text-[10px] font-mono px-2.5 py-1 rounded hover:bg-emerald-500 transition">PLAY TONE</button>
            <button id="audio-off" class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono px-2.5 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition">STOP</button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-6 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Battery Monitor — Piecewise Li-ion Curve</h2>
        <div class="flex items-center gap-4">
          <div class="relative w-24 h-12 border-2 border-slate-300 dark:border-slate-600 rounded-sm">
            <div id="bat-fill" class="absolute left-0 bottom-0 bg-emerald-500 transition-all duration-300" style="width:100%;height:87%"></div>
            <div class="absolute -right-[7px] top-1/2 -translate-y-1/2 w-[5px] h-5 bg-slate-300 dark:bg-slate-600 rounded-r-sm"></div>
          </div>
          <div class="font-mono text-xs space-y-1">
            <div class="text-slate-900 dark:text-white font-bold" id="bat-label">87% · 4100 mV</div>
            <div class="text-slate-500 dark:text-slate-400">Divider: BAT+ → 100k → GPIO36 → 100k → GND</div>
          </div>
        </div>
        <table class="w-full font-mono text-[10px] text-slate-500 dark:text-slate-400">
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
${renderBatteryCurve()}
          </tbody>
        </table>
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500">32-sample ADC averaging · critical blink ≤10% · CHG when TP4056 STDBY low.</p>
      </div>
    </section>

    <!-- SERIAL CONSOLE -->
    <section class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Serial Debug Console <span class="text-slate-400 dark:text-slate-500 font-medium">115200 baud</span></h2>
        <div class="flex flex-wrap gap-2">
${renderSerialActions()}
        </div>
      </div>
      <pre id="serial" class="bg-slate-950 text-slate-300 font-mono text-[10px] sm:text-[11px] rounded p-3 h-56 overflow-y-auto leading-relaxed"></pre>
    </section>`;

  return renderPage({
    
    
    title: 'Aegis-Beacon v5.4 — Live Firmware Demo',
    description: 'Interactive demonstration of the Aegis-Beacon v5.4 firmware: BEACON / SEARCH / CONFIG / EMERGENCY modes, Morse engine, frequency planner, GPS payload builder, battery monitor, RSSI scan and serial console.',
    canonical: `${SITE_URL}/demo`,
    header: { logoHref: '/', action: 'Manual', actionHref: '/manual', subtitle: 'Live Firmware Demo v5.4' },
    tabs: false,
    content,
    footer: {},
    scriptSrc: '/js/demo.js',
    currentPath
  });
}
