/**
 * Aegis-Beacon Wiki -- Support page.
 */
import { renderWikiPageLayout } from './layout.js';

const TROUBLESHOOTING = [
  { problem: 'No Morse output', cause: 'DAC1 not configured or audio muted', fix: 'Check DEFAULT_AUDIO_VOL in config.h. Verify GPIO 25 connection.' },
  { problem: 'GPS not acquiring fix', cause: 'Antenna obstruction or cold start', fix: 'Ensure GPS antenna has clear sky view. Cold start: 5-15 min outdoors.' },
  { problem: 'WiFi portal not appearing', cause: 'Wrong password or SSID', fix: 'Connect to "AEGIS-BEACON" with no password. Open 192.168.4.1.' },
  { problem: 'Low RSSI readings', cause: 'Antenna mismatch or poor ground plane', fix: 'Use 50-ohm dummy load for testing. Verify SMA connector.' },
  { problem: 'Battery not charging', cause: 'USB cable or charger issue', fix: 'Try different USB-C cable. Verify TP4056 LED indicators.' },
  { problem: 'Display garbled', cause: 'SPI timing or wiring error', fix: 'Check all SPI connections. Reduce SPI clock speed in U8g2 config.' },
  { problem: 'Watchdog reset loops', cause: 'Firmware hang in main loop', fix: 'Increase watchdog timeout or fix blocking code.' },
  { problem: 'Excessive power draw', cause: 'WiFi/BT enabled in beacon mode', fix: 'Verify WiFi.begin() and btStop() called at startup.' },
  { problem: 'SX1262 not responding', cause: 'SPI bus conflict or BUSY pin stuck', fix: 'Check GPIO 21 (BUSY) not stuck HIGH. Verify CS on GPIO 5.' },
  { problem: 'Wrong frequency output', cause: 'TCXO calibration drift', fix: 'Recalibrate using SDR. Check E22 factory calibration.' }
];

const FAQ = [
  { q: 'What is the maximum range?', a: '10-15 km LOS at 433 MHz with +22 dBm TX. Mountain environments: 5-10 km.' },
  { q: 'Do I need a ham radio license?', a: 'PMR446 (446 MHz): no license in Europe. GMRS (462 MHz): FCC license in USA. ISM (433 MHz): license-free worldwide.' },
  { q: 'Can I use the beacon continuously?', a: 'Only in EMERGENCY mode. BEACON sleeps between TX. Continuous TX may violate regulations.' },
  { q: 'How accurate is GPS embedding?', a: 'DDM format: ~185m precision. N4553 E01230 = 45.53N 12.30E.' },
  { q: 'What happens if battery runs out?', a: 'TP4056 over-discharge protection at 3.0V. Device resumes when recharged.' },
  { q: 'Can I add more frequencies?', a: 'Yes. Up to 10 via WiFi portal at 192.168.4.1.' },
  { q: 'Is the hardware waterproof?', a: 'Hammond 1593L is splash-resistant. Apply conformal coating for outdoor use.' },
  { q: 'What audio output?', a: '600 Hz CW tone via DAC1 through 100-ohm resistor to 3.5mm jack.' },
  { q: 'How do I update firmware?', a: 'USB, GPIO0 LOW, reset, PlatformIO upload. Serial at 115200 baud.' },
  { q: 'Can I use different batteries?', a: 'Single 18650 Li-ion recommended. Do not exceed 4.2V charge voltage.' }
];

const GLOSSARY = [
  { term: 'CW', def: 'Continuous Wave. On-off keying for Morse code.' },
  { term: 'FSK', def: 'Frequency Shift Keying. Digital modulation via frequency changes.' },
  { term: 'SX1262', def: 'Semtech LoRa transceiver IC, +22 dBm output, -130 dBm sensitivity.' },
  { term: 'ESP32', def: 'Espressif dual-core MCU, 240 MHz, WiFi/BT, 520 KB SRAM.' },
  { term: 'PMR446', def: 'Private Mobile Radio at 446 MHz. License-free UHF in Europe.' },
  { term: 'GMRS', def: 'General Mobile Radio Service. FCC-licensed UHF in USA.' },
  { term: 'ISM', def: 'Industrial, Scientific, Medical. License-free radio bands.' },
  { term: 'BOM', def: 'Bill of Materials. Complete component list with pricing.' },
  { term: 'TCXO', def: 'Temperature Compensated Crystal Oscillator.' },
  { term: 'RSSI', def: 'Received Signal Strength Indicator. Signal power in dBm.' },
  { term: 'NMEA', def: 'National Marine Electronics Association. GPS data standard.' },
  { term: 'DDM', def: 'Degrees and Decimal Minutes. Coordinate format.' },
  { term: 'SAR', def: 'Search and Rescue. Emergency location operations.' },
  { term: 'PA', def: 'Power Amplifier. Boosts RF signal for transmission.' },
  { term: 'LNA', def: 'Low Noise Amplifier. Amplifies weak received signals.' },
  { term: 'SPI', def: 'Serial Peripheral Interface. Synchronous IC-to-IC protocol.' },
  { term: 'UART', def: 'Universal Asynchronous Receiver-Transmitter. Serial interface.' },
  { term: 'GPIO', def: 'General Purpose Input/Output. Programmable MCU pins.' },
  { term: 'Deep Sleep', def: 'Low-power mode, ~10 uA, most peripherals disabled.' },
  { term: 'ADC', def: 'Analog-to-Digital Converter. Reads voltage levels.' },
  { term: 'DAC', def: 'Digital-to-Analog Converter. Generates analog signals.' },
  { term: 'Watchdog', def: 'Hardware timer that resets MCU if not cleared.' },
  { term: 'PlatformIO', def: 'Development environment for embedded systems.' },
  { term: 'CTCSS', def: 'Continuous Tone-Coded Squelch System. Sub-audible tone.' },
  { term: 'EIRP', def: 'Effective Isotropic Radiated Power. Total TX power.' }
];

function renderContent() {
  const troubleItems = TROUBLESHOOTING.map((t) => `<div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1"><h4 class="text-sm font-bold text-slate-900 dark:text-white">${t.problem}</h4><p class="text-[10px] font-mono text-slate-500">Cause: ${t.cause}</p><p class="text-xs text-slate-600 dark:text-slate-400">Fix: ${t.fix}</p></div>`).join('');

  const faqItems = FAQ.map((f) => `<details class="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"><summary class="flex items-center justify-between px-4 py-3 cursor-pointer bg-white dark:bg-[#0f1626] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-bold text-slate-900 dark:text-white">${f.q}<svg class="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.a}</div></details>`).join('');

  const glossaryItems = GLOSSARY.map((g) => `<div class="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"><span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 w-24 shrink-0">${g.term}</span><span class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${g.def}</span></div>`).join('');

  return `
    <h2 class="text-lg font-bold text-slate-900 dark:text-white">Troubleshooting</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${troubleItems}</div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-6">FAQ</h2>
    <div class="space-y-2">${faqItems}</div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-6">Glossary</h2>
    <div>${glossaryItems}</div>
  `;
}

export function renderSupportPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'support', title: 'Support', file: 'wiki/support.md', content: renderContent(), lang, dict, currentPath });
}
