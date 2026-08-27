/**
 * Aegis-Beacon -- Classic documentation wiki, rendered entirely by Node.
 *
 * Styled like a proper technical documentation site: sidebar table of
 * contents, markdown-style sections with edit-on-GitHub buttons, clean
 * typography, and deep technical content.
 */

import { renderPage, SITE_URL } from './layout.js';

const GITHUB_REPO = 'https://github.com/Leo-Galli/Aegis-Beacon';
const GITHUB_EDIT = `${GITHUB_REPO}/edit/main`;

/* ── Section metadata ─────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'overview', title: 'Project Overview', file: 'README.md' },
  { id: 'hardware', title: 'Hardware Architecture', file: 'DATASHEET.md' },
  { id: 'pinmap', title: 'GPIO Pin Mapping', file: 'DATASHEET.md#pin-mapping' },
  { id: 'rf', title: 'RF Design & Link Budget', file: 'DATASHEET.md#rf-design' },
  { id: 'firmware', title: 'Firmware Architecture', file: 'AegisBeacon.ino' },
  { id: 'modes', title: 'Operating Modes', file: 'AegisBeacon.ino#modes' },
  { id: 'config', title: 'Configuration Reference', file: 'AegisBeacon.ino#config' },
  { id: 'assembly', title: 'Assembly Guide', file: 'README.md#assembly' },
  { id: 'frequencies', title: 'Frequency Compatibility', file: 'FREQUENCIES.md' },
  { id: 'gps', title: 'GPS Integration', file: 'AegisBeacon.ino#gps' },
  { id: 'power', title: 'Power Management', file: 'DATASHEET.md#power' },
  { id: 'antenna', title: 'Antenna Design', file: 'DATASHEET.md#antenna' },
  { id: 'troubleshooting', title: 'Troubleshooting', file: 'README.md#troubleshooting' },
  { id: 'faq', title: 'FAQ', file: 'README.md#faq' },
  { id: 'glossary', title: 'Glossary', file: null }
];

/* ── Component data ───────────────────────────────────────────────── */
const HW_COMPONENTS = [
  { name: 'ESP32 DevKit V1', type: 'MCU', specs: 'Dual-core 240 MHz, 520 KB SRAM, WiFi/BT (disabled in beacon)', interface: '30-pin DIP' },
  { name: 'Ebyte E22-400M30S', type: 'RF Module', specs: 'SX1262-based, +30 dBm PA, 410-525 MHz', interface: 'SPI (16-pin)' },
  { name: 'SSD1309 OLED', type: 'Display', specs: '2.42" 128x64 monochrome, SW SPI', interface: '7-pin header' },
  { name: 'NEO-6M GPS', type: 'Navigation', specs: 'UART2 at 9600 baud, NMEA 0183, optional', interface: '4-pin header' },
  { name: 'TP4056', type: 'Charger', specs: 'Li-ion USB-C charging, 1A max', interface: 'SOT-23-8' },
  { name: '18650 Cell', type: 'Power', specs: '3.7V 2600-3500 mAh Li-ion', interface: 'Spring contacts' }
];

const PIN_MAP = [
  { pin: 'GPIO 5', fn: 'SX1262 NSS (CS)', dir: 'Output', notes: 'SPI chip select' },
  { pin: 'GPIO 18', fn: 'SX1262 SCK', dir: 'Output', notes: 'SPI clock' },
  { pin: 'GPIO 23', fn: 'SX1262 MOSI', dir: 'Output', notes: 'SPI data out' },
  { pin: 'GPIO 19', fn: 'SX1262 MISO', dir: 'Input', notes: 'SPI data in' },
  { pin: 'GPIO 21', fn: 'SX1262 BUSY', dir: 'Input', notes: 'Must poll before TX/RX' },
  { pin: 'GPIO 26', fn: 'SX1262 DIO1', dir: 'Input', notes: 'IRQ on packet received' },
  { pin: 'GPIO 27', fn: 'SX1262 RESET', dir: 'Output', notes: 'Hardware reset line' },
  { pin: 'GPIO 25', fn: 'DAC1 Audio Out', dir: 'Output', notes: 'Morse tone via DAC' },
  { pin: 'GPIO 32', fn: 'ADC Battery', dir: 'Input', notes: 'Voltage divider for SoC' },
  { pin: 'GPIO 16', fn: 'GPS RX', dir: 'Input', notes: 'UART2 receive from NEO-6M' },
  { pin: 'GPIO 17', fn: 'GPS TX', dir: 'Output', notes: 'UART2 transmit to NEO-6M' },
  { pin: 'GPIO 0', fn: 'Boot Mode', dir: 'Input', notes: 'LOW = flash bootloader' },
  { pin: 'GPIO 2', fn: 'LED Red', dir: 'Output', notes: 'BEACON mode indicator' },
  { pin: 'GPIO 4', fn: 'LED Blue', dir: 'Output', notes: 'SEARCH mode indicator' }
];

const FREQUENCIES = [
  { freq: '446.08125 MHz', ch: 'PMR CH 7', region: 'Italy / EU', ok: true, note: 'Primary hiking safety frequency' },
  { freq: '446.09375 MHz', ch: 'PMR CH 8', region: 'European', ok: true, note: 'General mountain radio coordination' },
  { freq: '446.10625 MHz', ch: 'PMR CH 9', region: 'European', ok: true, note: 'Additional PMR channel' },
  { freq: '462.675 MHz', ch: 'GMRS CH 20', region: 'USA', ok: true, note: 'Wilderness Protocol, analog CTCSS' },
  { freq: '462.700 MHz', ch: 'GMRS CH 21', region: 'USA', ok: true, note: 'Additional GMRS channel' },
  { freq: '477.275 MHz', ch: 'UHF CB CH 35', region: 'Australia/NZ', ok: true, note: 'Emergency Repeater Input' },
  { freq: '433.500 MHz', ch: 'ISM', region: 'Worldwide', ok: true, note: 'ISM band, primary test frequency' },
  { freq: '434.000 MHz', ch: 'ISM', region: 'Worldwide', ok: true, note: 'ISM band, alternate frequency' },
  { freq: '410.000 MHz', ch: 'Land Mobile', region: 'Licensed', ok: true, note: 'Requires amateur radio license' },
  { freq: '525.000 MHz', ch: 'Upper Limit', region: 'Hardware max', ok: true, note: 'SX1262 upper frequency limit' }
];

const FIRMWARE_MODES = [
  { name: 'BEACON', desc: 'Transmits Morse SOS + name + GPS on all configured frequencies, then enters deep sleep for DEFAULT_SLEEP_SEC seconds. Red LED active.', sleep: '10s default', power: '+17 dBm' },
  { name: 'SEARCH', desc: 'Scans all frequencies sequentially, measuring RSSI on each. Audio alert with rising pitch on detection. Blue LED active.', sleep: 'None (active)', power: 'Rx only' },
  { name: 'CONFIG', desc: 'WiFi AP mode (192.168.4.1) with captive portal dashboard. Adjust frequencies, WPM, power, GPS settings via browser.', sleep: 'None', power: 'WiFi AP' },
  { name: 'EMERGENCY', desc: 'Maximum power continuous TX with full payload. No deep sleep. 1760 Hz audible tone. For critical situations only.', sleep: 'None', power: '+22 dBm' }
];

const BUILD_STEPS = [
  { n: 1, title: 'SMD Component Preparation', desc: 'Gather all 0805/0603 passive components. Apply flux to pads. Use solder paste for reflow if available.' },
  { n: 2, title: 'Passive Component Soldering', desc: 'Solder resistors and capacitors first. Use hot-air station at 350C for lead-free paste. Verify no bridges.', warn: 'Check polarity on electrolytic capacitors before soldering.' },
  { n: 3, title: 'IC Placement', desc: 'Position ESP32, SX1262 module, and TP4056. Tack corners first, then reflow all pads. Verify alignment.', warn: 'ESD protection required when handling ICs.' },
  { n: 4, title: 'Connector Assembly', desc: 'Solder SMA antenna connector, USB-C port, battery terminals, and display header.', warn: 'Never power on without antenna connected.' },
  { n: 5, title: 'Display and GPS', desc: 'Connect SSD1309 OLED via SPI header. Attach NEO-6M GPS module to UART2 pins.' },
  { n: 6, title: 'Initial Power-Up', desc: 'Connect battery or USB power. Verify 3.3V and 5V rails. Check for excessive current draw.', warn: 'Monitor temperature during first power-up.' },
  { n: 7, title: 'Firmware Flash', desc: 'Pull GPIO0 LOW, press reset. Upload firmware via PlatformIO. Verify boot on serial monitor at 115200 baud.' },
  { n: 8, title: 'Functional Test', desc: 'Test each mode: BEACON, SEARCH, CONFIG, EMERGENCY. Verify Morse output and scanning.', warn: 'Use dummy load for RF power testing.' }
];

const TROUBLESHOOTING = [
  { problem: 'No Morse output', cause: 'DAC1 not configured or audio muted', fix: 'Check DEFAULT_AUDIO_VOL in config.h. Verify GPIO 25 connection.' },
  { problem: 'GPS not acquiring fix', cause: 'Antenna obstruction or cold start', fix: 'Ensure GPS antenna has clear sky view. Cold start requires 5-15 min outdoors.' },
  { problem: 'WiFi portal not appearing', cause: 'Wrong password or SSID', fix: 'Connect to "AEGIS-BEACON" with no password. Navigate to 192.168.4.1.' },
  { problem: 'Low RSSI readings', cause: 'Antenna mismatch or poor ground plane', fix: 'Use 50-ohm dummy load for testing. Verify SMA connector solder joints.' },
  { problem: 'Battery not charging', cause: 'USB cable or charger issue', fix: 'Try different USB-C cable. Verify TP4056 LED indicators.' },
  { problem: 'Display garbled', cause: 'SPI timing or wiring error', fix: 'Check all SPI connections. Reduce SPI clock speed in U8g2 config.' },
  { problem: 'Watchdog reset loops', cause: 'Firmware hang in main loop', fix: 'Increase watchdog timeout or fix blocking code.' },
  { problem: 'Excessive power draw', cause: 'WiFi/BT enabled in beacon mode', fix: 'Verify WiFi.begin() and btStop() are called at startup.' }
];

const FAQ = [
  { q: 'What is the maximum range?', a: 'In clear line-of-sight at 433 MHz with +22 dBm TX, theoretical range is 10-15 km. Real-world depends on terrain and antenna quality.' },
  { q: 'Do I need a ham radio license?', a: 'For PMR446 (446 MHz), no license in Europe. For GMRS (462 MHz), FCC license required in USA. For amateur bands, valid license mandatory.' },
  { q: 'Can I use the beacon continuously?', a: 'Only recommended in EMERGENCY mode. BEACON mode sleeps between TX to conserve battery. Continuous TX outside emergencies may violate regulations.' },
  { q: 'How accurate is GPS embedding?', a: 'Compact DDM format provides ~185-meter precision. N4553 E01230 = 45.53N 12.30E, sufficient for SAR operations.' },
  { q: 'What happens if battery runs out?', a: 'TP4056 includes over-discharge protection. Below 3.0V, battery is disconnected. ESP32 enters protected shutdown.' },
  { q: 'Can I add more frequencies?', a: 'Yes. Up to 10 stored frequencies via WiFi configuration portal.' },
  { q: 'Is the hardware waterproof?', a: 'Hammond 1593L is splash-resistant. For outdoor use, apply conformal coating and seal with silicone.' },
  { q: 'What audio output does it produce?', a: '600 Hz CW tone via DAC1 through 100-ohm resistor and 10uF capacitor to 3.5mm jack.' }
];

const GLOSSARY = [
  { term: 'CW', def: 'Continuous Wave. On-off keying for Morse code.' },
  { term: 'FSK', def: 'Frequency Shift Keying. Digital modulation via frequency changes.' },
  { term: 'SX1262', def: 'Semtech LoRa transceiver IC, +22 dBm output, -130 dBm sensitivity.' },
  { term: 'ESP32', def: 'Espressif dual-core MCU, 240 MHz, WiFi/BT.' },
  { term: 'PMR446', def: 'Private Mobile Radio at 446 MHz. License-free UHF in Europe.' },
  { term: 'GMRS', def: 'General Mobile Radio Service. FCC-licensed UHF in USA.' },
  { term: 'BOM', def: 'Bill of Materials. Complete component list.' },
  { term: 'TCXO', def: 'Temperature Compensated Crystal Oscillator. Stable frequency reference.' },
  { term: 'RSSI', def: 'Received Signal Strength Indicator. Signal power in dBm.' },
  { term: 'NMEA', def: 'National Marine Electronics Association. GPS data standard.' },
  { term: 'DDM', def: 'Degrees and Decimal Minutes. Coordinate format in Morse payload.' },
  { term: 'SAR', def: 'Search and Rescue. Emergency location operations.' },
  { term: 'PA', def: 'Power Amplifier. Boosts RF signal for transmission.' },
  { term: 'LNA', def: 'Low Noise Amplifier. Amplifies weak received signals.' },
  { term: 'SPI', def: 'Serial Peripheral Interface. Synchronous IC-to-IC protocol.' },
  { term: 'UART', def: 'Universal Asynchronous Receiver-Transmitter. Serial interface.' },
  { term: 'GPIO', def: 'General Purpose Input/Output. Programmable MCU pins.' },
  { term: 'Deep Sleep', def: 'Low-power mode, ~10 uA, most peripherals disabled.' }
];

/* ── Section renderers ────────────────────────────────────────────── */

function renderSidebar() {
  const links = SECTIONS.map((s) => `
    <a href="#${s.id}" class="block px-3 py-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded transition-colors leading-tight">${s.title}</a>`).join('');

  return `<aside class="hidden lg:block w-56 shrink-0 sticky top-20 h-fit space-y-1">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-0.5">
      <span class="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">Contents</span>
      ${links}
    </div>
  </aside>`;
}

function sectionHeader(id, title, file) {
  const editLink = file
    ? `<a href="${GITHUB_EDIT}/${file}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
        Edit on GitHub
      </a>`
    : '';

  return `<div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
    <div>
      <span class="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// ${title.toUpperCase()}</span>
      <h2 id="${id}" class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 scroll-mt-24">${title}</h2>
    </div>
    ${editLink}
  </div>`;
}

function renderOverviewSection() {
  const features = [
    { title: 'Emergency Morse Beacon', desc: 'Automatically transmits SOS + name + GPS coordinates in CW Morse code across all configured frequencies.' },
    { title: 'Multi-Frequency Scanner', desc: 'Sequentially scans up to 10 stored frequencies measuring RSSI to locate beacon signals.' },
    { title: 'WiFi Configuration Portal', desc: 'Captive portal at 192.168.4.1 for field configuration without reflashing firmware.' },
    { title: 'GPS Integration', desc: 'Optional NEO-6M module provides real-time NMEA coordinates embedded in Morse payload.' },
    { title: 'Ultra-Low Power', desc: '10 microamp deep sleep between TX cycles. 65-hour runtime on a single 18650 cell.' },
    { title: 'Open Hardware', desc: 'Full schematics, Gerber files, and BOM under MIT license. Total cost under $28.' }
  ];

  const featureCards = features.map((f) => `
    <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
      <h4 class="text-sm font-bold text-slate-900 dark:text-white">${f.title}</h4>
      <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">${f.desc}</p>
    </div>`).join('');

  return `
  ${sectionHeader('overview', 'Project Overview', 'README.md')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      <strong>Aegis-Beacon</strong> is a low-cost, open-source emergency radio-location system based on LoRa technology. Designed for mountain rescue, land operations, and critical civilian scenarios where cellular infrastructure is unavailable.
    </p>
    <div class="flex flex-wrap gap-2">
      <span class="px-2.5 py-1 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900 text-[10px] font-mono font-bold">~$23-28 BOM</span>
      <span class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">410-525 MHz</span>
      <span class="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-[10px] font-mono font-bold">65h Runtime</span>
      <span class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">4 Modes</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">${featureCards}</div>
  </div>`;
}

function renderHardwareSection() {
  const rows = HW_COMPONENTS.map((c) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2.5 pr-4 font-bold text-slate-900 dark:text-white text-xs">${c.name}</td>
      <td class="py-2.5 pr-4 text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase">${c.type}</td>
      <td class="py-2.5 pr-4 text-xs text-slate-600 dark:text-slate-400">${c.specs}</td>
      <td class="py-2.5 text-[10px] font-mono text-slate-500">${c.interface}</td>
    </tr>`).join('');

  return `
  ${sectionHeader('hardware', 'Hardware Architecture', 'DATASHEET.md')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      The radio core couples the dual-core ESP32 microcontroller with the Semtech SX1262 long-range transceiver. This combination provides precise carrier generation and low power consumption during deep sleep.
    </p>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Component</th>
            <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Type</th>
            <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Specifications</th>
            <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Interface</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody>
      </table>
    </div>
    <div class="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-800 dark:text-amber-400">
      <strong>Warning:</strong> RadioLib limits transmit power to +22 dBm. The E22-400M30S PA reaches +30 dBm but should only be used with proper licensing.
    </div>
  </div>`;
}

function renderPinMapSection() {
  const rows = PIN_MAP.map((p) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2 pr-4 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${p.pin}</td>
      <td class="py-2 pr-4 text-xs text-slate-900 dark:text-white font-medium">${p.fn}</td>
      <td class="py-2 pr-4 text-[10px] font-mono text-slate-500">${p.dir}</td>
      <td class="py-2 text-xs text-slate-600 dark:text-slate-400">${p.notes}</td>
    </tr>`).join('');

  return `
  ${sectionHeader('pinmap', 'GPIO Pin Mapping', 'DATASHEET.md#pin-mapping')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      Complete GPIO pin assignment for the ESP32 microcontroller. The SPI bus connects to the SX1262, while UART2 connects to the GPS module.
    </p>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">GPIO</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Function</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Direction</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function renderRFSection() {
  return `
  ${sectionHeader('rf', 'RF Design & Link Budget', 'DATASHEET.md#rf-design')}
  <div class="markdown-content space-y-4">
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Antenna Matching</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">The E22-400M30S module includes an integrated SMA connector with 50-ohm impedance matching. Use a quarter-wave whip antenna (17.3 cm at 433 MHz) or a 50-ohm dummy load during testing. Never transmit without a matched load.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Link Budget</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">With +22 dBm TX power and -130 dBm RX sensitivity, the theoretical link budget is 152 dB. In practice, this yields 10-15 km range in clear line-of-sight conditions at 433 MHz.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Frequency Stability</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">The E22 module uses a 32 MHz TCXO with +/-1 ppm stability, ensuring frequency accuracy within +/-43 Hz at 433 MHz. This is critical for narrow-band CW reception.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Spurious Emissions</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">RadioLib limits TX power to +22 dBm. All spurious emissions must comply with ETSI EN 300 220 or FCC Part 95.</p>
  </div>`;
}

function renderFirmwareSection() {
  return `
  ${sectionHeader('firmware', 'Firmware Architecture', 'AegisBeacon.ino')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      Written in C++ (Arduino/PlatformIO), the firmware implements four distinct operating modes. WiFi/BT stack is disabled in BEACON/SEARCH to save approximately 120 mA continuous draw.
    </p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
      <div><span class="text-orange-400">#define</span> DEFAULT_FREQ_MHZ <span class="text-emerald-300">433.500f</span>  <span class="text-slate-500">// ISM band</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_WPM <span class="text-emerald-300">13</span>              <span class="text-slate-500">// PARIS standard</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_POWER_DBM <span class="text-emerald-300">17</span>        <span class="text-slate-500">// -9...+22 dBm</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_SLEEP_SEC <span class="text-emerald-300">10</span>         <span class="text-slate-500">// Deep sleep cycle</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_AUDIO_VOL <span class="text-emerald-300">180</span>        <span class="text-slate-500">// DAC1 0-255</span></div>
    </div>
    <div class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-mono text-slate-600 dark:text-slate-400">
      <div class="text-slate-900 dark:text-white font-bold mb-1">MORSE PAYLOAD STRUCTURE</div>
      <div class="break-all"><span class="text-orange-400">SOS</span> <span class="text-slate-500">DE</span> <span class="text-emerald-400">FIRST LAST</span> <span class="text-slate-500">PSN</span> <span class="text-cyan-400">N4553 E01230</span></div>
      <div class="mt-1 text-slate-500">Coordinate format: compact DDM, ~185m precision</div>
    </div>
  </div>`;
}

function renderModesSection() {
  const cards = FIRMWARE_MODES.map((m) => `
    <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${m.name}</span>
        <span class="text-[10px] font-mono text-slate-500">${m.power}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${m.desc}</p>
      <div class="text-[10px] font-mono text-slate-500">Sleep: ${m.sleep}</div>
    </div>`).join('');

  return `
  ${sectionHeader('modes', 'Operating Modes', 'AegisBeacon.ino#modes')}
  <div class="markdown-content space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
  </div>`;
}

function renderAssemblySection() {
  const steps = BUILD_STEPS.map((s) => {
    const warnHtml = s.warn ? `<div class="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded text-[10px] font-mono text-amber-700 dark:text-amber-400"><strong>WARNING:</strong> ${s.warn}</div>` : '';
    return `
    <div class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
      <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold border border-orange-200 dark:border-orange-900/50 shrink-0">${s.n}</div>
      <div class="space-y-1">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">${s.title}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${s.desc}</p>
        ${warnHtml}
      </div>
    </div>`;
  }).join('');

  return `
  ${sectionHeader('assembly', 'Assembly Guide', 'README.md#assembly')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Complete assembly guide from bare PCB to functional device. Requires basic SMD soldering skills. Estimated build time: 2-3 hours.</p>
    <div class="space-y-3">${steps}</div>
  </div>`;
}

function renderFrequenciesSection() {
  const rows = FREQUENCIES.map((f) => {
    const cls = f.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
    const txt = f.ok ? 'COMPATIBLE' : 'INCOMPATIBLE';
    return `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">${f.freq}</td>
      <td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400">${f.ch}</td>
      <td class="py-2 px-4 text-[10px] font-mono text-slate-500">${f.region}</td>
      <td class="py-2 px-4 text-[10px] font-mono font-bold ${cls}">${txt}</td>
      <td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400">${f.note}</td>
    </tr>`;
  }).join('');

  return `
  ${sectionHeader('frequencies', 'Frequency Compatibility', 'FREQUENCIES.md')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The E22-400M30S module supports 410-525 MHz. All values are hardware limits.</p>
    <div class="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">HARDWARE LIMIT: 410-525 MHz</div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Frequency</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Channel</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Region</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function renderGPSSection() {
  return `
  ${sectionHeader('gps', 'GPS Integration', 'AegisBeacon.ino#gps')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The optional NEO-6M GPS module provides real-time coordinates embedded in the Morse payload using compact DDM format (~185m precision).</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300">
      <span class="text-orange-400">SOS</span> <span class="text-slate-500">DE</span> <span class="text-emerald-400">MARIO ROSSI</span> <span class="text-slate-500">PSN</span> <span class="text-cyan-400">N4553 E01230</span>
    </div>
    <p class="text-xs text-slate-500 dark:text-slate-400">N4553 = 45 degrees 53 minutes North. E01230 = 12 degrees 30 minutes East.</p>
  </div>`;
}

function renderPowerSection() {
  const rows = [
    { v: '4.20V', pct: '100%', status: 'Full', rt: '~65h' },
    { v: '3.90V', pct: '75%', status: 'Good', rt: '~49h' },
    { v: '3.65V', pct: '50%', status: 'Half', rt: '~32h' },
    { v: '3.40V', pct: '20%', status: 'Critical', rt: '~13h' },
    { v: '3.00V', pct: '0%', status: 'Cutoff', rt: 'Shutdown' }
  ].map((r) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">${r.v}</td>
      <td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400">${r.pct}</td>
      <td class="py-2 px-4 text-[10px] font-mono text-slate-500">${r.status}</td>
      <td class="py-2 px-4 text-xs text-emerald-600 dark:text-emerald-400 font-mono">${r.rt}</td>
    </tr>`).join('');

  return `
  ${sectionHeader('power', 'Power Management', 'DATASHEET.md#power')}
  <div class="markdown-content space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Single 18650 Li-ion cell with TP4056 USB-C charging. Battery voltage monitored via resistor divider on GPIO 32.</p>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Voltage</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Capacity</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Est. Runtime</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function renderAntennaSection() {
  return `
  ${sectionHeader('antenna', 'Antenna Design', 'DATASHEET.md#antenna')}
  <div class="markdown-content space-y-4">
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Quarter-Wave Whip</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">For 433 MHz: length = 300 / (4 * 433) = 17.3 cm. Use rigid copper wire or telescopic antenna. SMA male connector matches the E22 module.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Impedance Matching</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">The E22 module output is matched to 50 ohms. Always use a 50-ohm load or matched antenna. Mismatched loads damage the PA stage.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Ground Plane</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">For portable use, the PCB ground plane acts as a counterpoise. Mount the antenna vertically for best omnidirectional coverage.</p>
  </div>`;
}

function renderTroubleshootingSection() {
  const items = TROUBLESHOOTING.map((t) => `
    <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1">
      <h4 class="text-sm font-bold text-slate-900 dark:text-white">${t.problem}</h4>
      <p class="text-[10px] font-mono text-slate-500">Cause: ${t.cause}</p>
      <p class="text-xs text-slate-600 dark:text-slate-400">Fix: ${t.fix}</p>
    </div>`).join('');

  return `
  ${sectionHeader('troubleshooting', 'Troubleshooting', 'README.md#troubleshooting')}
  <div class="markdown-content space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${items}</div>
  </div>`;
}

function renderFAQSection() {
  const items = FAQ.map((f) => `
    <details class="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <summary class="flex items-center justify-between px-4 py-3 cursor-pointer bg-white dark:bg-[#0f1626] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-bold text-slate-900 dark:text-white">
        ${f.q}
        <svg class="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <div class="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.a}</div>
    </details>`).join('');

  return `
  ${sectionHeader('faq', 'FAQ', 'README.md#faq')}
  <div class="markdown-content space-y-3">${items}</div>`;
}

function renderGlossarySection() {
  const items = GLOSSARY.map((g) => `
    <div class="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 w-24 shrink-0">${g.term}</span>
      <span class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${g.def}</span>
    </div>`).join('');

  return `
  ${sectionHeader('glossary', 'Glossary', null)}
  <div class="markdown-content">${items}</div>`;
}

const JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Aegis-Beacon v5.4 Technical Wiki",
  "description": "Complete technical documentation for the Aegis-Beacon emergency radio system.",
  "author": { "@type": "Person", "name": "Leonardo Galli" },
  "publisher": { "@type": "Organization", "name": "Aegis Open Source Project" },
  "url": "https://aegis-beacon.vercel.app/wiki"
}`;

export function renderWikiPage(lang, dict, currentPath = '/') {
  const content = `<div class="flex gap-8">
    ${renderSidebar()}
    <div class="flex-1 min-w-0 space-y-12">
      ${renderOverviewSection()}
      ${renderHardwareSection()}
      ${renderPinMapSection()}
      ${renderRFSection()}
      ${renderFirmwareSection()}
      ${renderModesSection()}
      ${renderAssemblySection()}
      ${renderFrequenciesSection()}
      ${renderGPSSection()}
      ${renderPowerSection()}
      ${renderAntennaSection()}
      ${renderTroubleshootingSection()}
      ${renderFAQSection()}
      ${renderGlossarySection()}
    </div>
  </div>`;

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | Technical Wiki',
    description: 'Complete technical wiki for Aegis-Beacon: hardware architecture, firmware modes, GPIO mapping, RF design, assembly guide, frequency compatibility, GPS integration, power management, and troubleshooting.',
    canonical: `${SITE_URL}/wiki`,
    jsonLd: JSON_LD,
    header: { logoHref: '/', action: 'Builder', actionHref: '/builder', subtitle: 'Technical Wiki v5.4' },
    tabs: false,
    content,
    footer: {
      tagline: 'Aegis Open Source Engineering Network -- Technical Wiki v5.4 Revision 2026.'
    },
    scriptSrc: null,
    withIconLinks: true,
    currentPath
  });
}
