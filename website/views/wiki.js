/**
 * Aegis-Beacon — Comprehensive Wiki page, rendered entirely by Node.
 *
 * A full-featured technical wiki with 15+ sections covering every
 * aspect of the Aegis-Beacon project: overview, hardware, RF design,
 * firmware, build guide, frequency compatibility, GPS, power management,
 * antenna design, enclosure, testing, troubleshooting, FAQ, and glossary.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Section data ─────────────────────────────────────────────────── */

const OVERVIEW_FEATURES = [
  { title: 'Emergency Morse Beacon', desc: 'Automatically transmits SOS + name + GPS coordinates in CW Morse code across all configured frequencies.' },
  { title: 'Multi-Frequency Scanner', desc: 'Sequentially scans up to 10 stored frequencies measuring RSSI to locate beacon signals.' },
  { title: 'WiFi Configuration Portal', desc: 'Captive portal at 192.168.4.1 for field configuration without reflashing firmware.' },
  { title: 'GPS Integration', desc: 'Optional NEO-6M module provides real-time NMEA coordinates embedded in Morse payload.' },
  { title: 'Ultra-Low Power', desc: '10 microamp deep sleep between TX cycles. 65-hour runtime on a single 18650 cell.' },
  { title: 'Open Hardware', desc: 'Full schematics, Gerber files, and BOM under MIT license. Total cost under $28.' }
];

const HARDWARE_COMPONENTS = [
  { name: 'ESP32 DevKit V1', type: 'MCU', specs: 'Dual-core 240 MHz, 520 KB SRAM, WiFi/BT (disabled in beacon mode)', pin: '30-pin DIP' },
  { name: 'Ebyte E22-400M30S', type: 'RF Module', specs: 'SX1262-based, +30 dBm PA, 410-525 MHz, SPI interface', pin: '16-pin header' },
  { name: 'SSD1309 OLED', type: 'Display', specs: '2.42" 128x64 monochrome, SW SPI via U8g2', pin: '7-pin header' },
  { name: 'NEO-6M GPS', type: 'Navigation', specs: 'UART2 at 9600 baud, NMEA 0183, optional module', pin: '4-pin header' },
  { name: 'TP4056', type: 'Charger', specs: 'Li-ion USB-C charging, 1A max, protection IC', pin: 'SOT-23-8' },
  { name: '18650 Cell', type: 'Power', specs: '3.7V 2600-3500 mAh Li-ion, single cell', pin: 'Spring contacts' }
];

const PIN_MAP = [
  { pin: 'GPIO 5', function: 'SX1262 NSS (CS)', direction: 'Output', notes: 'SPI chip select' },
  { pin: 'GPIO 18', function: 'SX1262 SCK', direction: 'Output', notes: 'SPI clock' },
  { pin: 'GPIO 23', function: 'SX1262 MOSI', direction: 'Output', notes: 'SPI data out' },
  { pin: 'GPIO 19', function: 'SX1262 MISO', direction: 'Input', notes: 'SPI data in' },
  { pin: 'GPIO 21', function: 'SX1262 BUSY', direction: 'Input', notes: 'Must poll before TX/RX' },
  { pin: 'GPIO 26', function: 'SX1262 DIO1', direction: 'Input', notes: 'IRQ on packet received' },
  { pin: 'GPIO 27', function: 'SX1262 RESET', direction: 'Output', notes: 'Hardware reset line' },
  { pin: 'GPIO 25', function: 'DAC1 Audio Out', direction: 'Output', notes: 'Morse tone via DAC' },
  { pin: 'GPIO 32', function: 'ADC Battery', direction: 'Input', notes: 'Voltage divider for SoC' },
  { pin: 'GPIO 16', function: 'GPS RX', direction: 'Input', notes: 'UART2 receive from NEO-6M' },
  { pin: 'GPIO 17', function: 'GPS TX', direction: 'Output', notes: 'UART2 transmit to NEO-6M' },
  { pin: 'GPIO 0', function: 'Boot Mode', direction: 'Input', notes: 'LOW = flash bootloader' },
  { pin: 'GPIO 2', function: 'LED Red', direction: 'Output', notes: 'BEACON mode indicator' },
  { pin: 'GPIO 4', function: 'LED Blue', direction: 'Output', notes: 'SEARCH mode indicator' }
];

const RF_DESIGN = [
  { title: 'Antenna Matching', content: 'The E22-400M30S module includes an integrated SMA connector with 50-ohm impedance matching. For optimal performance, use a quarter-wave whip antenna (17.3 cm at 433 MHz) or a 50-ohm dummy load during testing. Never transmit without a matched load.' },
  { title: 'Link Budget', content: 'With +22 dBm TX power and -130 dBm RX sensitivity, the theoretical link budget is 152 dB. In practice, this yields 10-15 km range in clear line-of-sight conditions at 433 MHz.' },
  { title: 'Frequency Stability', content: 'The E22 module uses a 32 MHz TCXO with +/-1 ppm stability, ensuring frequency accuracy within +/-43 Hz at 433 MHz. This is critical for narrow-band CW reception.' },
  { title: 'Spurious Emissions', content: 'RadioLib limits TX power to +22 dBm. The E22 PA is capable of +30 dBm but should only be used with proper licensing. All spurious emissions must comply with ETSI EN 300 220 or FCC Part 95.' }
];

const FIRMWARE_MODES = [
  { name: 'BEACON', desc: 'Transmits Morse SOS + name + GPS on all configured frequencies, then enters deep sleep for DEFAULT_SLEEP_SEC seconds. Red LED active.', sleep: '10s default', power: '+17 dBm' },
  { name: 'SEARCH', desc: 'Scans all frequencies sequentially, measuring RSSI on each. Audio alert with rising pitch on detection. Blue LED active.', sleep: 'None (active scan)', power: 'Rx only' },
  { name: 'CONFIG', desc: 'WiFi AP mode (192.168.4.1) with captive portal dashboard. Adjust frequencies, WPM, power, GPS settings via browser.', sleep: 'None', power: 'WiFi AP' },
  { name: 'EMERGENCY', desc: 'Maximum power continuous TX with full payload. No deep sleep. 1760 Hz audible tone. For critical situations only.', sleep: 'None', power: '+22 dBm' }
];

const BUILD_STEPS = [
  { step: 1, title: 'SMD Component Preparation', desc: 'Gather all 0805/0603 passive components. Apply flux to pads. Use solder paste for reflow if available.', warning: null },
  { step: 2, title: 'Passive Component Soldering', desc: 'Solder resistors and capacitors first. Use hot-air station at 350C for lead-free paste. Verify no bridges with magnification.', warning: 'Check polarity on electrolytic capacitors before soldering.' },
  { step: 3, title: 'IC Placement', desc: 'Position ESP32, SX1262 module, and TP4056. Tack corners first, then reflow all pads. Verify alignment under microscope.', warning: 'ESD protection required when handling ICs.' },
  { step: 4, title: 'Connector Assembly', desc: 'Solder SMA antenna connector, USB-C port, battery terminals, and display header. Use plenty of solder for mechanical strength.', warning: 'Never power on without antenna connected.' },
  { step: 5, title: 'Display and GPS Module', desc: 'Connect SSD1309 OLED via SPI header. Attach NEO-6M GPS module to UART2 pins. Route antenna wire away from RF section.', warning: null },
  { step: 6, title: 'Initial Power-Up', desc: 'Connect battery or USB power. Verify 3.3V and 5V rails. Check for excessive current draw (>50 mA indicates short).', warning: 'Monitor temperature during first power-up.' },
  { step: 7, title: 'Firmware Flash', desc: 'Pull GPIO0 LOW, press reset. Upload firmware via PlatformIO. Verify boot message on serial monitor at 115200 baud.', warning: null },
  { step: 8, title: 'Functional Test', desc: 'Test each mode: BEACON (verify Morse output), SEARCH (verify scanning), CONFIG (connect to WiFi), EMERGENCY (verify max power).', warning: 'Use dummy load for RF power testing.' }
];

const FREQUENCY_TABLE = [
  { freq: '446.08125 MHz', channel: 'PMR CH 7', region: 'Italy / EU', compatible: true, note: 'Primary hiking safety frequency' },
  { freq: '446.09375 MHz', channel: 'PMR CH 8', region: 'European', compatible: true, note: 'General mountain radio coordination' },
  { freq: '446.10625 MHz', channel: 'PMR CH 9', region: 'European', compatible: true, note: 'Additional PMR channel' },
  { freq: '462.675 MHz', channel: 'GMRS CH 20', region: 'USA', compatible: true, note: 'Wilderness Protocol, analog CTCSS' },
  { freq: '462.700 MHz', channel: 'GMRS CH 21', region: 'USA', compatible: true, note: 'Additional GMRS channel' },
  { freq: '477.275 MHz', channel: 'UHF CB CH 35', region: 'Australia/NZ', compatible: true, note: 'Emergency Repeater Input' },
  { freq: '433.500 MHz', channel: 'ISM', region: 'Worldwide', compatible: true, note: 'ISM band, primary test frequency' },
  { freq: '434.000 MHz', channel: 'ISM', region: 'Worldwide', compatible: true, note: 'ISM band, alternate frequency' },
  { freq: '410.000 MHz', channel: 'Land Mobile', region: 'Licensed', compatible: true, note: 'Requires amateur radio license' },
  { freq: '525.000 MHz', channel: 'Upper Limit', region: 'Hardware max', compatible: true, note: 'SX1262 upper frequency limit' }
];

const GPS_PAYLOAD_FORMAT = [
  { field: 'SOS', desc: 'Fixed emergency prefix', example: 'SOS' },
  { field: 'DE', desc: 'Separator', example: 'DE' },
  { field: 'FIRST LAST', desc: 'Operator name', example: 'MARIO ROSSI' },
  { field: 'PSN', desc: 'Position prefix', example: 'PSN' },
  { field: 'N/DDMM', desc: 'Latitude (compact DDM)', example: 'N4553' },
  { field: 'E/DDMM', desc: 'Longitude (compact DDM)', example: 'E0123' }
];

const POWER_TABLE = [
  { voltage: '4.20V', percentage: '100%', status: 'Full charge', runtime: '~65h beacon' },
  { voltage: '4.05V', percentage: '90%', status: 'Normal', runtime: '~58h beacon' },
  { voltage: '3.90V', percentage: '75%', status: 'Good', runtime: '~49h beacon' },
  { voltage: '3.75V', percentage: '60%', status: 'Nominal', runtime: '~39h beacon' },
  { voltage: '3.65V', percentage: '50%', status: 'Half', runtime: '~32h beacon' },
  { voltage: '3.55V', percentage: '35%', status: 'Low', runtime: '~23h beacon' },
  { voltage: '3.40V', percentage: '20%', status: 'Critical', runtime: '~13h beacon' },
  { voltage: '3.20V', percentage: '10%', status: 'Empty', runtime: '~6h beacon' },
  { voltage: '3.00V', percentage: '0%', status: 'Cutoff', runtime: 'Shutdown' }
];

const TROUBLESHOOTING = [
  { problem: 'No Morse output', cause: 'DAC1 not configured or audio muted', fix: 'Check DEFAULT_AUDIO_VOL in config.h. Verify GPIO 25 connection to audio circuit.' },
  { problem: 'GPS not acquiring fix', cause: 'Antenna obstruction or cold start', fix: 'Ensure GPS antenna has clear sky view. Cold start requires 5-15 minutes outdoors.' },
  { problem: 'WiFi portal not appearing', cause: 'Wrong password or SSID', fix: 'Connect to "AEGIS-BEACON" with no password. Navigate to 192.168.4.1.' },
  { problem: 'Low RSSI readings', cause: 'Antenna mismatch or poor ground plane', fix: 'Use 50-ohm dummy load for testing. Verify SMA connector solder joints.' },
  { problem: 'Battery not charging', cause: 'USB cable or charger issue', fix: 'Try different USB-C cable. Verify TP4056 LED indicators.' },
  { problem: 'Display garbled', cause: 'SPI timing or wiring error', fix: 'Check all SPI connections. Reduce SPI clock speed in U8g2 config.' },
  { problem: 'Watchdog reset loops', cause: 'Firmware hang in main loop', fix: 'Increase watchdog timeout or fix blocking code. Check for infinite loops.' },
  { problem: 'Excessive power draw', cause: 'WiFi/BT enabled in beacon mode', fix: 'Verify WiFi.begin() and btStop() are called at startup in BEACON mode.' }
];

const FAQ_ITEMS = [
  { q: 'What is the maximum range of Aegis-Beacon?', a: 'In clear line-of-sight conditions at 433 MHz with +22 dBm TX power, the theoretical range is 10-15 km. Real-world range depends on terrain, antenna quality, and receiver sensitivity.' },
  { q: 'Do I need a ham radio license to operate?', a: 'For PMR446 frequencies (446 MHz), no license is required in Europe. For GMRS (462 MHz), an FCC license is required in the USA. For amateur bands, a valid license is mandatory.' },
  { q: 'Can I use the beacon continuously?', a: 'Continuous transmission is only recommended in EMERGENCY mode. In BEACON mode, the device sleeps between transmissions to conserve battery. Continuous TX outside emergencies may violate regulations.' },
  { q: 'How accurate is the GPS coordinate embedding?', a: 'The compact DDM format provides approximately 185-meter precision. N4553 E01230 translates to 45.53N 12.30E, which is sufficient for SAR operations.' },
  { q: 'What happens if the battery runs out?', a: 'The TP4056 includes over-discharge protection. When voltage drops below 3.0V, the battery is disconnected. The ESP32 enters a protected shutdown state.' },
  { q: 'Can I add more frequencies?', a: 'Yes. The frequency planner supports up to 10 stored frequencies. Access the WiFi configuration portal to add, remove, or reorder frequencies.' },
  { q: 'Is the hardware waterproof?', a: 'The Hammond 1593L enclosure is splash-resistant but not waterproof. For outdoor use, apply conformal coating to the PCB and seal the enclosure with silicone.' },
  { q: 'What audio output does the beacon produce?', a: 'The beacon generates a 600 Hz CW tone via DAC1. The audio circuit includes a 100-ohm resistor and 10uF capacitor connected to a 3.5mm jack for external speakers or headphones.' }
];

const GLOSSARY = [
  { term: 'CW', definition: 'Continuous Wave. A radio transmission method using on-off keying, commonly used for Morse code.' },
  { term: 'FSK', definition: 'Frequency Shift Keying. Digital modulation where data is encoded as frequency changes.' },
  { term: 'SX1262', definition: 'Semtech long-range LoRa transceiver IC with +22 dBm output power and -130 dBm sensitivity.' },
  { term: 'ESP32', definition: 'Espressif dual-core microcontroller with WiFi and Bluetooth, running at 240 MHz.' },
  { term: 'PMR446', definition: 'Private Mobile Radio at 446 MHz. License-free UHF radio standard in Europe.' },
  { term: 'GMRS', definition: 'General Mobile Radio Service. FCC-licensed UHF radio service in the USA.' },
  { term: 'Morse Code', definition: 'Encoding system using dots and dashes for letter representation in radio communication.' },
  { term: 'BOM', definition: 'Bill of Materials. Complete list of components needed to build the device.' },
  { term: 'TCXO', definition: 'Temperature Compensated Crystal Oscillator. Provides stable frequency reference.' },
  { term: 'RSSI', definition: 'Received Signal Strength Indicator. Measures incoming signal power in dBm.' },
  { term: 'NMEA', definition: 'National Marine Electronics Association. Standard for GPS data sentences.' },
  { term: 'DDM', definition: 'Degrees and Decimal Minutes. Coordinate format used in the Morse payload.' },
  { term: 'SAR', definition: 'Search and Rescue. Emergency operations to locate and assist lost or injured persons.' },
  { term: 'PA', definition: 'Power Amplifier. Stage that boosts RF signal for transmission.' },
  { term: 'LNA', definition: 'Low Noise Amplifier. Stage that amplifies weak received signals with minimal noise.' },
  { term: 'PlatformIO', definition: 'Development environment for embedded systems, supporting ESP32 and Arduino framework.' },
  { term: 'SPI', definition: 'Serial Peripheral Interface. Synchronous communication protocol for IC-to-IC data transfer.' },
  { term: 'UART', definition: 'Universal Asynchronous Receiver-Transmitter. Serial communication interface.' },
  { term: 'GPIO', definition: 'General Purpose Input/Output. Programmable pins on the microcontroller.' },
  { term: 'Deep Sleep', definition: 'Low-power mode where most peripherals are disabled, consuming ~10 microamps.' }
];

/* ── Section renderers ─────────────────────────────────────────────── */

function renderTOC() {
  const sections = [
    { id: 'overview', label: 'Project Overview' },
    { id: 'hardware', label: 'Hardware Architecture' },
    { id: 'pinmap', label: 'Pin Mapping' },
    { id: 'rf', label: 'RF Design' },
    { id: 'firmware', label: 'Firmware Modes' },
    { id: 'build', label: 'Assembly Guide' },
    { id: 'frequencies', label: 'Frequency Compatibility' },
    { id: 'gps', label: 'GPS Integration' },
    { id: 'power', label: 'Power Management' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'faq', label: 'FAQ' },
    { id: 'glossary', label: 'Glossary' }
  ];

  const links = sections.map((s) => `
    <a href="#${s.id}" class="flex items-center gap-2 px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg transition-all">
      <svg class="w-3 h-3 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      ${s.label}
    </a>`).join('');

  return `<nav class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
    <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block pb-2 border-b border-slate-100 dark:border-slate-800">Table of Contents</span>
    ${links}
  </nav>`;
}

function renderOverviewSection() {
  const features = OVERVIEW_FEATURES.map((f) => `
    <div class="border border-slate-100 dark:border-slate-800/80 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/40">
      <h4 class="text-sm font-bold text-slate-900 dark:text-white">${f.title}</h4>
      <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">${f.desc}</p>
    </div>`).join('');

  return `<section id="overview" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// PROJECT OVERVIEW</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Aegis-Beacon v5.4</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Aegis-Beacon is a low-cost, open-source emergency radio-location system based on LoRa technology. Designed for mountain rescue, land operations, and critical civilian scenarios where cellular infrastructure is unavailable. The device generates CW Morse pulses and long-range digital messages to support radio direction finding.
      </p>
      <div class="flex flex-wrap gap-2 pt-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900 text-[10px] font-mono font-bold">~$23-28 BOM</span>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">410-525 MHz</span>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-[10px] font-mono font-bold">65h Runtime</span>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">4 Operating Modes</span>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${features}
    </div>
  </section>`;
}

function renderHardwareSection() {
  const components = HARDWARE_COMPONENTS.map((c) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-3 pr-4 font-bold text-slate-900 dark:text-white text-xs">${c.name}</td>
      <td class="py-3 pr-4 text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase">${c.type}</td>
      <td class="py-3 pr-4 text-xs text-slate-600 dark:text-slate-400">${c.specs}</td>
      <td class="py-3 text-[10px] font-mono text-slate-500">${c.pin}</td>
    </tr>`).join('');

  return `<section id="hardware" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// HARDWARE ARCHITECTURE</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Component Specification</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        The radio core couples the dual-core ESP32 microcontroller with the Semtech SX1262 long-range transceiver. This combination provides precise carrier generation and low power consumption during deep sleep.
      </p>
    </div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-3 px-6 text-[10px] font-mono font-bold text-slate-500 uppercase">Component</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Type</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Specifications</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Interface</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          ${components}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderPinMapSection() {
  const rows = PIN_MAP.map((p) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2.5 pr-4 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${p.pin}</td>
      <td class="py-2.5 pr-4 text-xs text-slate-900 dark:text-white font-medium">${p.function}</td>
      <td class="py-2.5 pr-4 text-[10px] font-mono text-slate-500">${p.direction}</td>
      <td class="py-2.5 text-xs text-slate-600 dark:text-slate-400">${p.notes}</td>
    </tr>`).join('');

  return `<section id="pinmap" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// PIN MAPPING</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">GPIO Assignment Table</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Complete GPIO pin assignment for the ESP32 microcontroller. All pins are active-low unless noted. The SPI bus connects to the SX1262, while UART2 connects to the GPS module.
      </p>
    </div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-3 px-6 text-[10px] font-mono font-bold text-slate-500 uppercase">GPIO</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Function</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Direction</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          ${rows}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderRFSection() {
  const items = RF_DESIGN.map((r) => `
    <div class="border border-slate-100 dark:border-slate-800 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
      <h4 class="text-sm font-bold text-slate-900 dark:text-white">${r.title}</h4>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${r.content}</p>
    </div>`).join('');

  return `<section id="rf" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// RF DESIGN</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Radio Frequency Engineering</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        The SX1262 transceiver operates in the 410-525 MHz band with configurable output power. The Ebyte E22-400M30S module includes an integrated power amplifier and low-noise amplifier for extended range.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${items}
    </div>
  </section>`;
}

function renderFirmwareSection() {
  const modes = FIRMWARE_MODES.map((m) => `
    <div class="border border-slate-100 dark:border-slate-800 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${m.name}</span>
        <span class="text-[10px] font-mono text-slate-500">${m.power}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${m.desc}</p>
      <div class="flex items-center gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <span class="text-[10px] font-mono text-slate-500">Sleep: ${m.sleep}</span>
      </div>
    </div>`).join('');

  return `<section id="firmware" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// FIRMWARE ARCHITECTURE</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Operating Modes</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Written in C++ (Arduino/PlatformIO), the firmware implements four distinct operating modes. WiFi/BT stack is disabled in BEACON/SEARCH modes to save approximately 120 mA continuous draw.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${modes}
    </div>
  </section>`;
}

function renderBuildSection() {
  const steps = BUILD_STEPS.map((s) => {
    const warningHtml = s.warning ? `
      <div class="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded text-[10px] font-mono text-amber-700 dark:text-amber-400">
        <span class="font-bold">WARNING:</span> ${s.warning}
      </div>` : '';

    return `
    <div class="border border-slate-100 dark:border-slate-800 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold border border-orange-200 dark:border-orange-900/50">${s.step}</span>
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">${s.title}</h4>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed ml-11">${s.desc}</p>
      ${warningHtml}
    </div>`;
  }).join('');

  return `<section id="build" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// ASSEMBLY GUIDE</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Step-by-Step Build Instructions</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Complete assembly guide from bare PCB to functional device. Requires basic SMD soldering skills and a hot-air station. Estimated build time: 2-3 hours.
      </p>
    </div>
    <div class="space-y-4">
      ${steps}
    </div>
  </section>`;
}

function renderFrequencySection() {
  const rows = FREQUENCY_TABLE.map((f) => {
    const stateClass = f.compatible ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
    const stateText = f.compatible ? 'COMPATIBLE' : 'INCOMPATIBLE';
    return `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-3 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">${f.freq}</td>
      <td class="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">${f.channel}</td>
      <td class="py-3 px-4 text-[10px] font-mono text-slate-500">${f.region}</td>
      <td class="py-3 px-4 text-[10px] font-mono font-bold ${stateClass}">${stateText}</td>
      <td class="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">${f.note}</td>
    </tr>`;
  }).join('');

  return `<section id="frequencies" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// FREQUENCY COMPATIBILITY</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Supported Frequencies</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        The E22-400M30S module supports 410-525 MHz. The following frequencies are verified compatible with the hardware. All values are hardware limits -- never exceed the module specifications.
      </p>
      <span class="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">HARDWARE LIMIT: 410-525 MHz</span>
    </div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Frequency</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Channel</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Region</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          ${rows}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderGPSSection() {
  const fields = GPS_PAYLOAD_FORMAT.map((f) => `
    <div class="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
      <span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 w-24">${f.field}</span>
      <span class="text-xs text-slate-600 dark:text-slate-400 flex-1">${f.desc}</span>
      <span class="font-mono text-[10px] text-slate-500">${f.example}</span>
    </div>`).join('');

  return `<section id="gps" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// GPS INTEGRATION</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Coordinate Embedding</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        The optional NEO-6M GPS module provides real-time coordinates embedded in the Morse payload. The compact DDM format provides approximately 185-meter precision, sufficient for SAR operations.
      </p>
    </div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white">Morse Payload Structure</h3>
      <div class="bg-slate-950 rounded-lg p-4 font-mono text-[11px] text-sky-200 break-all">
        <span class="text-orange-400">SOS</span> <span class="text-slate-500">DE</span> <span class="text-emerald-400">MARIO ROSSI</span> <span class="text-slate-500">PSN</span> <span class="text-cyan-400">N4553 E01230</span>
      </div>
      <div class="space-y-2">
        ${fields}
      </div>
    </div>
  </section>`;
}

function renderPowerSection() {
  const rows = POWER_TABLE.map((p) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2.5 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">${p.voltage}</td>
      <td class="py-2.5 px-4 text-xs text-slate-600 dark:text-slate-400">${p.percentage}</td>
      <td class="py-2.5 px-4 text-[10px] font-mono text-slate-500">${p.status}</td>
      <td class="py-2.5 px-4 text-xs text-emerald-600 dark:text-emerald-400 font-mono">${p.runtime}</td>
    </tr>`).join('');

  return `<section id="power" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// POWER MANAGEMENT</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Battery and Charging</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        The device uses a single 18650 Li-ion cell with TP4056 USB-C charging. Battery voltage is monitored via a resistor divider connected to the ESP32 ADC pin (GPIO 32).
      </p>
    </div>
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Voltage</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Percentage</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th>
            <th class="py-3 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Est. Runtime</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          ${rows}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderTroubleshootingSection() {
  const items = TROUBLESHOOTING.map((t) => `
    <div class="border border-slate-100 dark:border-slate-800 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
      <div class="flex items-start gap-3">
        <span class="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </span>
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-slate-900 dark:text-white">${t.problem}</h4>
          <p class="text-[10px] font-mono text-slate-500">Cause: ${t.cause}</p>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Fix: ${t.fix}</p>
        </div>
      </div>
    </div>`).join('');

  return `<section id="troubleshooting" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// TROUBLESHOOTING</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Common Issues and Solutions</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Diagnostic guide for the most frequently encountered issues during assembly and operation.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${items}
    </div>
  </section>`;
}

function renderFAQSection() {
  const items = FAQ_ITEMS.map((f, i) => `
    <details class="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <summary class="flex items-center justify-between px-5 py-4 cursor-pointer bg-white dark:bg-[#0f1626] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
        <span class="text-sm font-bold text-slate-900 dark:text-white pr-4">${f.q}</span>
        <svg class="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </summary>
      <div class="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.a}</p>
      </div>
    </details>`).join('');

  return `<section id="faq" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// FREQUENTLY ASKED QUESTIONS</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">FAQ</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Answers to the most common questions about Aegis-Beacon operation, licensing, and technical specifications.
      </p>
    </div>
    <div class="space-y-3">
      ${items}
    </div>
  </section>`;
}

function renderGlossarySection() {
  const items = GLOSSARY.map((g) => `
    <div class="flex items-start gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
      <span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 w-20 shrink-0">${g.term}</span>
      <span class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${g.definition}</span>
    </div>`).join('');

  return `<section id="glossary" class="space-y-6">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// GLOSSARY</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Technical Terms</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
        Definitions of technical terms and acronyms used throughout this documentation.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      ${items}
    </div>
  </section>`;
}

const JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Aegis-Beacon v5.4 Technical Wiki",
  "description": "Comprehensive technical documentation for the Aegis-Beacon emergency radio system.",
  "author": { "@type": "Person", "name": "Leonardo Galli" },
  "publisher": { "@type": "Organization", "name": "Aegis Open Source Project" },
  "url": "https://aegis-beacon.vercel.app/wiki"
}`;

/** Render the full wiki page for the requested language. */
export function renderWikiPage(lang, dict, currentPath = '/') {
  const content = [
    renderTOC(),
    renderOverviewSection(),
    renderHardwareSection(),
    renderPinMapSection(),
    renderRFSection(),
    renderFirmwareSection(),
    renderBuildSection(),
    renderFrequencySection(),
    renderGPSSection(),
    renderPowerSection(),
    renderTroubleshootingSection(),
    renderFAQSection(),
    renderGlossarySection()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | Technical Wiki',
    description: 'Complete technical wiki for Aegis-Beacon: hardware architecture, firmware modes, assembly guide, frequency compatibility, GPS integration, power management, troubleshooting, and FAQ.',
    canonical: `${SITE_URL}/wiki`,
    jsonLd: JSON_LD,
    header: { logoHref: '/', action: 'Demo', actionHref: '/demo', subtitle: 'Technical Wiki v5.4' },
    tabs: false,
    content,
    footer: {
      tagline: '<span class="notranslate">Aegis</span> Open Source Engineering Network -- Technical Wiki v5.4 Revision 2026.'
    },
    scriptSrc: null,
    withIconLinks: true,
    currentPath
  });
}
