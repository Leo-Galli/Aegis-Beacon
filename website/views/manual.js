/**
 * Aegis-Beacon — manual (wiki) page, rendered entirely by Node.
 *
 * Every section of the technical manual (OVERVIEW, HARDWARE, FIRMWARE,
 * WIKI: SOFTWARE, BUILD WIKI, TECH STACK, frequency compatibility table and
 * the terminal diagnostics) is generated here from data structures.
 * Elements that must be translated client-side carry the `data-key` attribute
 * consumed by /js/i18n.js; interactive ids (`terminal-body`, `clock-display`,
 * `btn-toggle-sys`, ...) are consumed by /js/terminal.js.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Data: overview badges ─────────────────────────────────────────── */
const HERO_BADGES = [
  { className: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900', dot: true, text: '~$23-28 BOM', notranslate: true },
  { className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', text: '410–525 MHz', notranslate: true },
  { className: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900', text: '65 h BEACON · 44 h SEARCH', notranslate: true },
  { className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', key: 'hero-badges-modes', text: '4 Modes' }
];

/* ── Data: overview scenario cards ─────────────────────────────────── */
const SCENARIO_CARDS = [
  {
    glow: 'from-orange-500/10', keyT: 'sc-1-t', keyD: 'sc-1-d',
    tag: '[ SCOPE ]', title: 'Alpine and Backcountry Rescue',
    desc: 'Enables missing persons to transmit a stable Morse trace (CW 600 Hz) that can be located by SAR teams with PMR446 receivers, AM scanners, or SDRs. Antenna: 17.3 cm quarter-wave at 433 MHz.'
  },
  {
    glow: 'from-emerald-500/10', keyT: 'sc-2-t', keyD: 'sc-2-d',
    tag: '[ TECHNOLOGY ]', title: 'FSK / CW Keying (SX1262)',
    desc: 'Continuous 0.6 kbps FSK carrier with CW keying through transmitDirect(), indistinguishable from OOK during reception. TX −9…+22 dBm via RadioLib (up to +30 dBm with the onboard E22 PA).'
  },
  {
    glow: 'from-sky-500/10', keyT: 'sc-3-t', keyD: 'sc-3-d',
    tag: '[ INDEPENDENCE ]', title: 'Zero Infrastructure',
    desc: 'No dependency on GSM, Wi-Fi, or commercial satellites. Direct peer-to-peer communication at 410–525 MHz. CONFIG mode is used only for setup (WiFi AP 192.168.4.1).'
  }
];

/* ── Data: physical characteristics table ──────────────────────────── */
const PHYSICAL_ROWS = [
  { key: 'hw-row-ant', label: 'Antenna Connector', value: '50-ohm female SMA' },
  { key: 'hw-row-mcu', label: 'System Clock', value: 'XTAL 32 MHz (TCXO ±1 ppm)' },
  { key: 'hw-row-bat', label: 'Deep-Sleep Current', value: '~10 µA', accent: 'text-orange-600 dark:text-orange-400' },
  { key: 'hw-row-dim', label: 'Enclosure', value: 'Hammond 1593L (100×60×25)' },
  { key: 'hw-row-batlife', label: 'BEACON Runtime', value: '~65 h (no GPS)', accent: 'text-emerald-600 dark:text-emerald-400' }
];

/* ── Data: firmware mini-stats ─────────────────────────────────────── */
const FW_MINI_STATS = [
  { label: 'Deep Sleep', value: '~10 µA' },
  { label: 'Watchdog', value: '30 s' },
  { label: 'TX Output', value: '+22 dBm' }
];

/* ── Data: config.h reference block ────────────────────────────────── */
const CONFIG_LINES = [
  { comment: '// ── Default radio payload ─────────────────', code: [
    ['#define DEFAULT_FREQ_MHZ', '433.500f', '// ISM band — primary slot'],
    ['#define DEFAULT_MESSAGE', '"SOS"', '// Payload Morse base'],
    ['#define DEFAULT_WPM', '13', '// PARIS standard'],
    ['#define DEFAULT_POWER_DBM', '17', '// −9…+22 dBm RadioLib']
  ] },
  { comment: '// ── Sleep + scan ──────────────────────────', code: [
    ['#define DEFAULT_SLEEP_SEC', '10', '// Deep sleep between TX cycles'],
    ['#define DEFAULT_SCAN_DWELL_MS', '400', '// Listen time per frequency (ms)'],
    ['#define DEFAULT_RSSI_THRESH', '-90', '// Detection threshold (dBm)']
  ] },
  { comment: '// ── Audio + output ────────────────────────', code: [
    ['#define DEFAULT_AUDIO_VOL', '180', '// DAC1 0-255 (≈ 70%)'],
    ['#define AUDIO_TONE_MORSE', '600', '// Hz — click TX'],
    ['#define AUDIO_FREQ_HZ', '40000', '// PWM carrier (ultrasonic)']
  ] }
];

/* ── Data: wiki software update steps ──────────────────────────────── */
const UPDATE_STEPS = [
  {
    tag: 'STEP 01 // PREPARATION', key: 'wiki-up-s1',
    desc: 'Download and install Visual Studio Code with the PlatformIO IDE package. Clone the development Git repository in the local terminal.',
    code: 'git clone <span class="notranslate">https://github.com/Leo-Galli/Aegis-Beacon</span>.git'
  },
  {
    tag: 'STEP 02 // UART CONNECTION', key: 'wiki-up-s2',
    desc: 'Connect the beacon to the computer through a USB-TTL converter (CP2102 or FTDI). Connect RX to TX, TX to RX, and share GND. Pull GPIO0 to ground at startup to enable flash bootloader mode.',
    code: null
  },
  {
    tag: 'STEP 03 // BUILD AND FLASH', key: 'wiki-up-s3',
    desc: 'Open the project folder in VS Code, verify the parameters in platformio.ini, and run the combined build and hardware upload command.',
    code: 'pio run --target upload'
  }
];

/* ── Data: BOM list (prices preserved verbatim — do not edit) ──────── */
const BOM_ITEMS = [
  { label: 'MCU:', value: 'ESP32 DevKit V1 30-pin (Espressif, ~$3)' },
  { label: 'RF:', value: 'Ebyte E22-400M30S (SX1262, +30 dBm PA, ~$5.50)' },
  { label: 'Display:', value: 'SSD1309 2.42" OLED 128×64 (SW SPI, ~$3.50)' },
  { label: 'GPS (opt):', value: 'NEO-6M UART2 9600 baud (~$4.50)' },
  { label: 'Audio:', value: 'DAC1 GPIO25 → 100Ω → 10µF → jack 3.5mm' },
  { label: 'Power:', value: 'TP4056 USB-C + 18650 Li-ion (~$0.50+1.50)' },
  { label: 'TCXO:', value: 'onboard 32 MHz ±1 ppm via E22' }
];

/* ── Data: build guide steps ───────────────────────────────────────── */
const BUILD_STEPS = [
  { title: '1. Passive Component Soldering', key: 'wiki-const-p1', desc: 'Solder the 0805 or 0603 SMD resistors and capacitors first, preferably using high-conductivity solder paste and a hot-air station.' },
  { title: '2. Aligning the Integrated Modules', key: 'wiki-const-p2', desc: 'Position the ESP32 and SX1262 chip accurately on their respective footprints. Tack the corners before reflowing the contacts.' },
  { title: '3. Antenna Connection and RF Test', key: 'wiki-const-p3', desc: 'Solder the SMA connector. Warning: never power the unit without first connecting a suitable antenna or 50-ohm dummy load, otherwise the power amplifier stage may fail immediately.' }
];

/* ── Data: technology stack cards ──────────────────────────────────── */
const STACK_CARDS = [
  { hover: 'hover:border-orange-500/60 dark:hover:border-orange-500/40', tagClass: 'text-orange-600 dark:text-orange-400', tag: '[ C++ / ESP32 ]', keyT: 'ts-fw-t', keyD: 'ts-fw-d', title: 'Firmware', desc: 'C++ (Arduino/PlatformIO) on a dual-core ESP32. RadioLib 6.x drives the SX1262 front end, U8g2 2.34 renders the SSD1309 OLED, TinyGPS++ 1.0.3 parses NMEA sentences, ArduinoJson 7.x serves the configuration dashboard.' },
  { hover: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/40', tagClass: 'text-emerald-600 dark:text-emerald-400', tag: '[ BOM ]', keyT: 'ts-hw-t', keyD: 'ts-hw-d', title: 'Hardware', desc: 'ESP32 DevKit V1, Ebyte E22-400M30S (SX1262/LLCC68), SSD1309 2.42" OLED, NEO-6M GPS, TP4056 charger, 18650 Li-ion cell. Approximate BOM $23-28 USD.' },
  { hover: 'hover:border-sky-500/60 dark:hover:border-sky-500/40', tagClass: 'text-sky-600 dark:text-sky-400', tag: '[ NODE.JS / VERCEL ]', keyT: 'ts-web-t', keyD: 'ts-web-d', title: 'Website', desc: 'Node.js 18+ with zero runtime dependencies, ES modules, language-aware rendering (EN/IT/FR/ES), Tailwind CSS, WebAudio demo, deployed as a Vercel serverless function.' },
  { hover: 'hover:border-violet-500/60 dark:hover:border-violet-500/40', tagClass: 'text-violet-600 dark:text-violet-400', tag: '[ CI / DEPLOY ]', keyT: 'ts-tools-t', keyD: 'ts-tools-d', title: 'Tooling and Deployment', desc: 'PlatformIO and Arduino IDE for flashing, Vercel CLI and Git integration for hosting (Root Directory website), npm run check validates dictionary parity.' }
];

/* ── Data: documentation links ─────────────────────────────────────── */
const DOC_LINKS = [
  { file: 'README.md', primary: false },
  { file: 'DATASHEET.md', primary: false },
  { file: 'FREQUENCIES.md', primary: false },
  { file: 'TECHNOLOGIES.md', primary: true }
];

/* ── Data: frequency compatibility table (single source of truth) ──── */
const FREQ_ROWS = [
  {
    freq: '446.08125 MHz', channel: 'PMR CH 7 (Tone 7)', scope: 'Italy / Mountain Network',
    compatible: true, noteKey: 'n-1',
    cardChannel: 'PMR CH 7', cardScope: 'Italy / Mountain Network',
    note: 'National hiking safety frequency. Primary monitoring and test channel.'
  },
  {
    freq: '446.09375 MHz', channel: 'PMR CH 8', scope: 'European Standard',
    compatible: true, noteKey: 'n-2', zebra: true,
    cardChannel: 'PMR CH 8', cardScope: 'European Standard',
    note: 'General mountain radio coordination channel for continental use.'
  },
  {
    freq: '161.300 MHz', channel: 'Canal E (Emergency)', scope: 'Switzerland / REGA',
    compatible: false, noteKey: 'n-3',
    cardChannel: 'Canal E (REGA)', cardScope: 'VHF', dim: true,
    note: 'VHF band outside the E22/SX1262 module filter (410–525 MHz).'
  },
  {
    freq: '462.675 MHz', channel: 'GMRS CH 20', scope: 'USA / Wilderness Protocol',
    compatible: true, noteKey: 'n-4', zebra: true,
    cardChannel: 'GMRS CH 20', cardScope: 'Wilderness Protocol',
    note: 'Analog 141.3 Hz CTCSS; CW beacon can be decoded by AM scanners or SDRs.'
  },
  {
    freq: '477.275 MHz', channel: 'UHF CB CH 35', scope: 'Australia / New Zealand',
    compatible: true, noteKey: 'n-5',
    cardChannel: 'UHF CB CH 35', cardScope: 'Oceania',
    note: 'Emergency Repeater Input (duplex, paired with CH 5 / 476.525 MHz). ACMA class licence.'
  }
];

/* ── Section renderers ─────────────────────────────────────────────── */

function renderHeroBadges() {
  return HERO_BADGES.map((b) => {
    const dot = b.dot ? '<span class="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></span>' : '';
    const keyAttr = b.key ? ` data-key="${b.key}"` : '';
    const nt = b.notranslate ? 'notranslate' : '';
    const tr = b.notranslate ? ' translate="no"' : '';
    return `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${b.className} text-[10px] font-mono font-${b.dot ? 'bold' : 'medium'} border">
      ${dot}<span class="${nt}"${tr}${keyAttr}>${b.text}</span>
    </span>`;
  }).join('\n');
}

function renderOverviewTab() {
  const cards = SCENARIO_CARDS.map((c) => `
        <div class="group relative bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-2 flex flex-col justify-between overflow-hidden hover:border-orange-500/60 dark:hover:border-orange-500/40 hover:shadow-md transition-all duration-200">
          <div aria-hidden="true" class="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${c.glow} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div class="relative">
            <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold">${c.tag}</span>
            <h2 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase font-mono mt-1" data-key="${c.keyT}">${c.title}</h2>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 relative" data-key="${c.keyD}">${c.desc}</p>
        </div>`).join('');

  return `<section id="tab-panoramica" class="tab-content active space-y-6">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider" data-key="sys-doc-title">REFERENCE DOCUMENTATION</span>
        <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white" data-key="main-title">Ecosystem <span class="notranslate">Aegis-Beacon</span> v5.4</h1>
        <div class="flex flex-wrap gap-1.5 pt-0.5">
          ${renderHeroBadges()}
        </div>
        <p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-4xl pt-1" data-key="main-desc">
          A low-cost emergency radio-location system based on LoRa, designed for mountain rescue, land operations, and critical civilian scenarios. The beacon generates CW pulses and long-range digital messages to support radio direction finding when cellular infrastructure is unavailable.
        </p>
        <img src="/banner.png" alt="Aegis-Beacon v5.4 technical manual and build wiki banner" width="1376" height="768" class="w-full h-auto rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <p class="text-[10px] font-mono text-slate-400 dark:text-slate-500 italic">Banner artwork generated with Google Gemini (AI).</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">${cards}
      </div>
    </section>`;
}

function renderHardwareTab() {
  const rows = PHYSICAL_ROWS.map((r) => `
              <tr>
                <td class="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200 w-1/2 align-top" data-key="${r.key}">${r.label}</td>
                <td class="py-2.5 text-right ${r.accent || ''} align-top">${r.value}</td>
              </tr>`).join('');

  return `<section id="tab-hardware" class="tab-content space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-4">
            <h2 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase font-mono border-b border-slate-100 dark:border-slate-800 pb-2" data-key="hw-spec-t">RF Unit Hardware Architecture</h2>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="hw-spec-d">
              The radio core couples the dual-core ESP32 microcontroller with the Semtech SX1262 long-range transceiver. This combination provides precise carrier generation and low power consumption during deep sleep.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="border border-slate-100 dark:border-slate-800/80 p-3 rounded bg-slate-50/50 dark:bg-slate-900/40">
                <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase">[ RF Amplifier Stage ]</span>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1" data-key="hw-p-1">
                  The Ebyte E22-400M30S is based on SX1262. It integrates a power amplifier (PA) and a low-noise receive amplifier (LNA) to extend the link budget beyond 15 km in clear line of sight.
                </p>
              </div>
              <div class="border border-slate-100 dark:border-slate-800/80 p-3 rounded bg-slate-50/50 dark:bg-slate-900/40">
                <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase">[ Power System ]</span>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-1" data-key="hw-p-2">
                  Integrated TP4056 Li-ion charging circuit with voltage monitoring through a resistor divider connected to the ESP32 ADC pin for discharge telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
          <h2 class="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono border-b border-slate-100 dark:border-slate-800 pb-2" data-key="hw-aside-t">Physical Characteristics</h2>
          <table class="w-full text-left font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">${rows}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
}

function renderConfigBlock() {
  const blocks = CONFIG_LINES.map((b) => {
    const lines = b.code.map(([def, val, comment]) =>
      `<span class="text-orange-400">${def}</span>      <span class="text-emerald-300">${val}</span>   <span class="text-slate-500">${comment}</span>`
    ).join('\n');
    return `<span class="text-slate-500">${b.comment}</span>\n${lines}`;
  }).join('\n<span class="text-slate-500">// ─────────────────────────────────</span>\n');

  return `<pre class="bg-slate-950 text-slate-300 font-mono text-[10px] sm:text-xs p-3 rounded border border-slate-900 overflow-x-auto mt-2 leading-relaxed">${blocks}</pre>`;
}

function renderFirmwareTab() {
  const stats = FW_MINI_STATS.map((s) => `
              <div class="border border-slate-100 dark:border-slate-800 rounded p-2 text-center bg-slate-50/60 dark:bg-slate-900/40">
                <div class="text-[8px] font-mono text-slate-400 uppercase tracking-widest">${s.label}</div>
                <div class="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">${s.value}</div>
              </div>`).join('');

  return `<section id="tab-firmware" class="tab-content space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div class="lg:col-span-6 space-y-6">
          <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-4">
            <h2 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase font-mono border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2" data-key="fw-title">
              <span class="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse shrink-0"></span>
              Firmware Infrastructure
            </h2>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="fw-desc-1">
              Written in C++ (Arduino/PlatformIO), based on RadioLib ≥ 6.x for the SX1262 front end, U8g2 ≥ 2.34 for the SSD1309 display, and TinyGPS++ ≥ 1.0.3 for NMEA coordinates. The WiFi/BT stack is disabled in BEACON/SEARCH to save ~120 mA.
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="fw-desc-2">
              Four modes (BEACON / SEARCH / CONFIG / EMERGENCY) with ~10 µA deep sleep, a 30 s hardware watchdog, IRQ-driven DIO1, and mandatory polling of SX1262 BUSY GPIO 21.
            </p>
            <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] sm:text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1.5">
              <div class="text-slate-900 dark:text-white font-bold">// MORSE PAYLOAD STRUCTURE</div>
              <div class="break-all leading-relaxed">
                <span class="text-orange-400">SOS</span>
                <span class="text-slate-500">  </span>
                <span class="text-slate-400">[ DE FIRST LAST ]</span>
                <span class="text-slate-500">  </span>
                <span class="text-cyan-400">[ PSN N4553 E01230 ]</span>
              </div>
              <div class="text-[9px] text-slate-500 italic pt-0.5" data-key="fw-fmt-note">
                Coordinate format: compact DDM · N4553 = 45°53′ N · approximately 185 m precision.
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 pt-1">${stats}
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 class="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">// config.h</h2>
              <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold tracking-widest" data-key="fw-live-src">AEGIS-BEACON.ino</span>
            </div>
            ${renderConfigBlock()}
          </div>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono italic" data-key="fw-warn">Warning: RadioLib limits transmit power to +22 dBm (the E22-400M30S PA reaches +30 dBm). Follow local radio regulations before transmitting.</span>
        </div>
      </div>
    </section>`;
}

function renderSoftwareWikiTab() {
  const steps = UPDATE_STEPS.map((s) => `
          <div class="border border-slate-100 dark:border-slate-800 p-4 rounded bg-slate-50/50 dark:bg-slate-900/40 space-y-2 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400">${s.tag}</span>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1" data-key="${s.key}">${s.desc}</p>
            </div>
            ${s.code ? `<pre class="bg-slate-950 text-slate-400 font-mono text-[10px] p-2 rounded border border-slate-900 overflow-x-auto mt-2">\n${s.code}\n            </pre>` : ''}
          </div>`).join('');

  return `<section id="tab-compilazione" class="tab-content space-y-6">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-6">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase">[ SOFTWARE BUILD PROCEDURE ]</span>
          <h2 class="text-md sm:text-lg font-bold text-slate-900 dark:text-white mt-1" data-key="wiki-up-title">Firmware Update and Flashing with PlatformIO</h2>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="wiki-up-desc">
          The <span class="notranslate">Aegis-Beacon</span>  firmware is compiled to machine code and executed directly on the ESP32 chip. Follow the tool sequence to upload corrective software patches or calibrate operating frequencies.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">${steps}
        </div>
      </div>
    </section>`;
}

function renderBuildWikiTab() {
  const bomItems = BOM_ITEMS.map((b) =>
    `<li><span class="text-slate-900 dark:text-white font-bold">${b.label}</span> ${b.value}</li>`
  ).join('\n              ');

  const buildSteps = BUILD_STEPS.map((s) => `
              <div>
                <span class="block text-[11px] font-bold text-slate-900 dark:text-white">${s.title}</span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5" data-key="${s.key}">${s.desc}</p>
              </div>`).join('');

  return `<section id="tab-costruzione" class="tab-content space-y-6">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-6">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span class="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase">[ STRUCTURAL ASSEMBLY PROCEDURE ]</span>
          <h2 class="text-md sm:text-lg font-bold text-slate-900 dark:text-white mt-1" data-key="wiki-const-title">PCB Soldering and Physical Construction Manual</h2>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="wiki-const-desc">
          Assembly of the <span class="notranslate">Aegis-Beacon</span>  unit requires precision and basic SMD (Surface Mount Device) soldering skills. Follow the component assembly plan carefully to avoid shorts or thermal damage to sensitive RF sections.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono" data-key="wiki-const-h1">Bill of Materials (BOM) Specifications</h3>
            <ul class="space-y-2 font-mono text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
              ${bomItems}
              <li class="pt-1 border-t border-slate-100 dark:border-slate-800"><span class="text-orange-600 dark:text-orange-400 font-bold" data-key="wiki-const-bom-tot">Estimated total BOM: ~$23-28 USD</span></li>
            </ul>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono" data-key="wiki-const-h2">Step-by-Step Operating Guide</h3>
            <div class="border-l-2 border-orange-600 dark:border-orange-500 pl-4 space-y-4">${buildSteps}
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

function renderTechStackTab() {
  const cards = STACK_CARDS.map((c) => `
        <div class="group relative bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-2 overflow-hidden ${c.hover} hover:shadow-md transition-all duration-200">
          <span class="font-mono text-[9px] ${c.tagClass} font-bold">${c.tag}</span>
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase font-mono mt-1" data-key="${c.keyT}">${c.title}</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2" data-key="${c.keyD}">${c.desc}</p>
        </div>`).join('');

  const links = DOC_LINKS.map((d) => {
    const cls = d.primary
      ? 'text-[10px] font-mono border border-orange-600 text-orange-600 dark:text-orange-400 px-2.5 py-1.5 rounded hover:bg-orange-50 dark:hover:bg-orange-950/20 transition notranslate'
      : 'text-[10px] font-mono border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition notranslate';
    return `<a href="https://github.com/Leo-Galli/Aegis-Beacon/blob/main/${d.file}" target="_blank" rel="noopener" class="${cls}">${d.file}</a>`;
  }).join('\n          ');

  return `<section id="tab-techstack" class="tab-content space-y-6">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-3">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider">// DOCUMENTATION &amp; STACK</span>
        <h2 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase font-mono" data-key="ts-title">Technology Stack</h2>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl" data-key="ts-subtitle">Complete picture of the technologies, libraries and tooling used across the firmware, hardware and website.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">${cards}
      </div>

      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-3">
        <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase font-mono border-b border-slate-100 dark:border-slate-800 pb-2" data-key="ts-docs-t">Documentation</h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="ts-docs-d">README.md, DATASHEET.md, FREQUENCIES.md and TECHNOLOGIES.md cover the whole project; the live site mirrors them with a language selector and an interactive firmware demo.</p>
        <div class="flex flex-wrap gap-2 pt-1">
          ${links}
        </div>
      </div>
    </section>`;
}

function renderFreqCards() {
  return FREQ_ROWS.map((r) => {
    const stateColor = r.compatible ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
    const freqClass = r.dim ? 'text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-white';
    const noteClass = r.dim ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400';
    return `          <div class="p-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold ${freqClass}">${r.freq}</span>
              <span class="${stateColor} font-bold" data-key="${r.compatible ? 'v-ok' : 'v-no'}">${r.compatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}</span>
            </div>
            <div class="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
              <div>Channel: ${r.cardChannel}</div>
              <div>Scope: ${r.cardScope}</div>
            </div>
            <p class="text-[11px] ${noteClass} pt-1 border-t border-slate-100 dark:border-slate-900" data-key="${r.noteKey}">${r.note}</p>
          </div>`;
  }).join('\n');
}

function renderFreqTable() {
  const rows = FREQ_ROWS.map((r) => {
    const stateCell = r.compatible
      ? '<td class="p-3.5 text-center text-emerald-600 dark:text-emerald-400 font-bold" data-key="v-ok">COMPATIBLE</td>'
      : '<td class="p-3.5 text-center text-rose-600 dark:text-rose-400 font-bold" data-key="v-no">INCOMPATIBLE</td>';
    const freqClass = r.dim ? 'p-3.5 font-bold text-slate-400 dark:text-slate-600' : 'p-3.5 font-bold text-slate-900 dark:text-white';
    const noteClass = r.dim ? 'p-3.5 text-slate-400 dark:text-slate-500' : 'p-3.5';
    return `              <tr${r.zebra ? ' class="bg-slate-50/40 dark:bg-slate-900/10"' : ''}>
                <td class="${freqClass}">${r.freq}</td>
                <td class="p-3.5">${r.channel}</td>
                <td class="p-3.5">${r.scope}</td>
                ${stateCell}
                <td class="${noteClass}" data-key="${r.noteKey}">${r.note}</td>
              </tr>`;
  }).join('\n');

  return `<section class="space-y-6">
      <div class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1626] rounded-lg overflow-hidden shadow-sm">
        <div class="p-4 bg-slate-50 dark:bg-[#131b2e] border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider" data-key="t-title">Emergency Frequency and Spectrum Compatibility Plan</h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5" data-key="t-subtitle">Radio allocation database for international monitoring and land rescue.</p>
          </div>
          <span class="self-start md:self-center font-mono text-[9px] bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 px-2.5 py-1 rounded font-bold whitespace-nowrap" data-key="t-warn">HARDWARE LIMIT INCLUDED: 410–525 MHz</span>
        </div>

        <div class="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
${renderFreqCards()}
        </div>

        <div class="hidden md:block overflow-x-auto w-full">
          <table class="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <th class="p-3.5 font-semibold w-1/5">Frequency</th>
                <th class="p-3.5 font-semibold w-1/5" data-key="th-ch">Channel</th>
                <th class="p-3.5 font-semibold w-1/5" data-key="th-area">Usage Scope</th>
                <th class="p-3.5 font-semibold text-center w-1/6" data-key="th-state">Hardware Status</th>
                <th class="p-3.5 font-semibold w-3/12" data-key="th-note">Operational Reception Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
${rows}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
}

function renderDiagnosticsSection() {
  return `<section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      <div class="lg:col-span-5 space-y-2">
        <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider" data-key="sim-tag">// INSTRUMENT DIAGNOSTICS //</span>
        <h3 class="text-base font-bold text-slate-900 dark:text-white" data-key="sim-title">Operational Loop Verification</h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed" data-key="sim-desc">
          Test console for firmware simulation. It shows the sequential output sent through the serial (UART) port while the device changes logical states.
        </p>
      </div>

      <div class="lg:col-span-7 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 space-y-3 w-full">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
          <span data-key="sim-status">CORE LOGICAL STATUS</span>
          <span id="state-indicator" class="self-start sm:self-auto text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded">SYS_STATUS: STANDBY_RX</span>
        </div>

        <div id="terminal-screen" class="bg-slate-950 rounded p-3 h-40 sm:h-36 border border-slate-900 flex flex-col justify-between font-mono text-[10px] sm:text-[11px] text-slate-300 shadow-inner overflow-y-auto">
          <div class="flex justify-between text-[9px] text-slate-600 border-b border-slate-900 pb-1.5 shrink-0">
            <span>CORE: COMPILING_OK</span>
            <span id="clock-display">00:00:00</span>
          </div>
          <div class="my-auto space-y-1.5 py-2 font-mono text-[10px] sm:text-[11px]" id="terminal-body">
            <p id="init-line" class="leading-tight"><span class="text-slate-500">[ 12400][GPS  ]</span> <span class="text-cyan-400">Fix acquired: 45.53124  12.30456 sats=6</span></p>
            <p id="freq-line" class="leading-tight"><span class="text-slate-500">[   139][INFO ]</span> <span class="text-emerald-400">SX1262 CW TX ready: 433.500 MHz @ +17 dBm</span></p>
            <p id="volt-line" class="leading-tight"><span class="text-slate-500">[   140][INFO ]</span> <span class="text-slate-300">TX: &quot;SOS DE MARIO ROSSI PSN N4553 E01230&quot; (31 chars) @ 13WPM</span></p>
            <p id="gps-line" class="leading-tight hidden"><span class="text-slate-500">[   142][OK   ]</span> <span class="text-emerald-400">RSSI scan: 433.500=-87dBm *** HIT ***</span></p>
          </div>
          <div class="text-[9px] text-slate-700 text-right shrink-0">
            Hardware Watchdog Cleared
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button id="btn-toggle-sys" class="bg-slate-900 dark:bg-orange-600 text-white hover:bg-slate-800 dark:hover:bg-orange-500 text-xs font-mono py-3 sm:py-2.5 rounded font-medium transition w-full" data-key="sb-btn-tx">
            Switch to Transmit (TX)
          </button>
          <button id="btn-trigger-gps" class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-mono py-3 sm:py-2.5 rounded font-medium transition w-full" data-key="sb-btn-gps">
            Inject GPS String
          </button>
        </div>
      </div>
    </section>`;
}

function renderLegalFootnotes() {
  const footnotes = [
    { keyT: 'f1-t', title: '01 / DEPLOYMENT', keyD: 'f1-d', desc: 'The PCB Gerber files and bill of materials (BOM) are ready for automated SMT production and assembly processes.' },
    { keyT: 'f2-t', title: '02 / LEGAL LIMITS', keyD: 'f2-d', desc: 'Unauthorized continuous-wave (CW) transmissions outside permitted public radio allocations (LPD/PMR), without a genuine emergency, may violate local regulations.' },
    { keyT: 'f3-t', title: '03 / MIT LICENSE', keyD: 'f3-d', span: 'sm:col-span-2 lg:col-span-1', desc: 'The source code and physical hardware architecture schematics are distributed under the MIT open license, allowing structural modifications with attribution required.' }
  ].map((f) => `
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded p-4 space-y-1${f.span ? ' ' + f.span : ''}">
        <span class="font-bold text-slate-900 dark:text-white block uppercase text-xs" data-key="${f.keyT}">${f.title}</span>
        <p class="leading-relaxed" data-key="${f.keyD}">${f.desc}</p>
      </div>`).join('');

  return `<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">${footnotes}
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
      "publisher": {      "@type": "Organization",
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
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "technical support",
            "url": "https://github.com/Leo-Galli/Aegis-Beacon/issues",
            "availableLanguage": ["en-US", "it-IT", "fr-FR", "es-ES"] }
      },
      "inLanguage": ["it-IT","en-US","fr-FR","es-ES"],
    },
    {
      "@type": "WebPage",
      "@id": "https://aegis-beacon.vercel.app/#webpage",
      "url": "https://aegis-beacon.vercel.app/",
      "name": "Aegis-Beacon v5.4 | Technical Manual and Build Wiki",
      "isPartOf": {
        "@id": "https://aegis-beacon.vercel.app/#website"
      },
      "description": "Technical specifications for hardware development, firmware architecture, and radio reception channels for SAR systems.",
      "inLanguage": ["it-IT","en-US","fr-FR","es-ES"],
    },
    {
      "@type": "TechArticle",
      "@id": "https://aegis-beacon.vercel.app/#article",
      "isPartOf": {
        "@id": "https://aegis-beacon.vercel.app/#webpage"
      },
      "headline": "Aegis-Beacon v5.4 | Technical Reference Manual and Build Wiki",
      "description": "Advanced engineering instructions for SMD assembly of the SX1262 radio module and firmware compilation on the ESP32 microcontroller.",
      "inLanguage": ["it-IT","en-US","fr-FR","es-ES"],
      "url": "https://aegis-beacon.vercel.app/",
      "mainEntityOfPage": "https://aegis-beacon.vercel.app/",
      "image": "https://aegis-beacon.vercel.app/banner.png",
      "datePublished": "2024-10-15T08:00:00+02:00",
      "dateModified": "2026-07-15T12:00:00+02:00",
      "author": {
        "@id": "https://aegis-beacon.vercel.app/#organization"
      },
      "publisher": {
        "@id": "https://aegis-beacon.vercel.app/#organization"
      },
      "about": [
        { "@type": "Thing", "name": "LoRa" },
        { "@type": "Thing", "name": "ESP32" },
        { "@type": "Thing", "name": "Search and Rescue" }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://aegis-beacon.vercel.app/#software",
      "name": "Aegis-Beacon Firmware",
      "operatingSystem": "Embedded (ESP32)",
      "applicationCategory": "UtilitiesApplication",
      "releaseNotes": "https://github.com/Leo-Galli/Aegis-Beacon/releases",
      "downloadUrl": "https://github.com/Leo-Galli/Aegis-Beacon",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "EUR"
      }
    },
    {
      "@type": "HowTo",
      "@id": "https://aegis-beacon.vercel.app/#howto-update",
      "isPartOf": {
        "@id": "https://aegis-beacon.vercel.app/#webpage"
      },
      "name": "How to update Aegis-Beacon software",
      "description": "Guided procedure for compiling and uploading firmware to the ESP32 microcontroller with PlatformIO.",
      "inLanguage": ["it-IT","en-US","fr-FR","es-ES"],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Install tools",
          "text": "Download and install Visual Studio Code, then add the official PlatformIO IDE extension from the marketplace.",
          "url": "https://aegis-beacon.vercel.app/#tab-compilazione"
        },
        {
          "@type": "HowToStep",
          "name": "Connect hardware",
          "text": "Connect the Aegis-Beacon board to the computer with a USB cable and a compatible USB-to-UART interface.",
          "url": "https://aegis-beacon.vercel.app/#tab-compilazione"
        },
        {
          "@type": "HowToStep",
          "name": "Flash firmware",
          "text": "Open the project in VS Code, run the build target, and click Upload to write the code to the ESP32 chip.",
          "url": "https://aegis-beacon.vercel.app/#tab-compilazione"
        }
      ]
    }
  ]
}`;

/** Render the full manual (wiki) page for the requested language. */
export function renderManualPage(lang, dict, currentPath = '/') {
  const content = [
    renderOverviewTab(),
    renderHardwareTab(),
    renderFirmwareTab(),
    renderSoftwareWikiTab(),
    renderBuildWikiTab(),
    renderTechStackTab(),
    renderFreqTable(),
    renderDiagnosticsSection(),
    renderLegalFootnotes()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4: Technical Manual and SAR Build Wiki',
    description: 'Official Aegis-Beacon v5.4 manual. Step-by-step guide to SMD hardware assembly, ESP32 firmware flashing with PlatformIO, and SAR radio frequency management.',
    canonical: `${SITE_URL}/`,
    jsonLd: JSON_LD,
    header: { action: 'Demo', actionHref: '/demo' },
    tabs: true,
    content,
    footer: {
      tagline: '<span class="notranslate">Aegis</span> Open Source Engineering Network -- Technical File Reference v5.4 Revision 2026.'
    },
    scriptSrc: '/js/main.js',
    withIconLinks: true,
    currentPath
  });
}
