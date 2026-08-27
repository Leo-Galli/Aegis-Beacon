/**
 * Aegis-Beacon Wiki -- Assembly page.
 */
import { renderWikiPageLayout } from './layout.js';

const STEPS = [
  { n: 1, title: 'SMD Component Preparation', desc: 'Gather all 0805/0603 passive components. Apply flux to pads. Use solder paste for reflow if available.' },
  { n: 2, title: 'Passive Component Soldering', desc: 'Solder resistors and capacitors first. Use hot-air station at 350C for lead-free paste. Verify no bridges.', warn: 'Check polarity on electrolytic capacitors before soldering.' },
  { n: 3, title: 'IC Placement', desc: 'Position ESP32, SX1262 module, and TP4056. Tack corners first, then reflow all pads. Verify alignment.', warn: 'ESD protection required when handling ICs.' },
  { n: 4, title: 'Connector Assembly', desc: 'Solder SMA antenna connector, USB-C port, battery terminals, and display header.', warn: 'Never power on without antenna connected.' },
  { n: 5, title: 'Display and GPS', desc: 'Connect SSD1309 OLED via SPI header. Attach NEO-6M GPS module to UART2 pins. Route antenna wire away from RF section.' },
  { n: 6, title: 'Initial Power-Up', desc: 'Connect battery or USB power. Verify 3.3V and 5V rails. Check for excessive current draw (>50 mA indicates short).', warn: 'Monitor temperature during first power-up.' },
  { n: 7, title: 'Firmware Flash', desc: 'Pull GPIO0 LOW, press reset. Upload firmware via PlatformIO. Verify boot on serial monitor at 115200 baud.' },
  { n: 8, title: 'Functional Test', desc: 'Test each mode: BEACON (verify Morse output), SEARCH (verify scanning), CONFIG (connect to WiFi), EMERGENCY (verify max power).', warn: 'Use dummy load for RF power testing.' },
  { n: 9, title: 'Enclosure Assembly', desc: 'Mount PCB in Hammond 1593L enclosure. Cut outs for SMA, USB-C, OLED display, and audio jack. Secure with M3 screws.' },
  { n: 10, title: 'Final Calibration', desc: 'Verify frequency accuracy with SDR or spectrum analyzer. Calibrate battery voltage divider reading. Test GPS fix acquisition.' }
];

function renderContent() {
  const steps = STEPS.map((s) => {
    const warnHtml = s.warn ? `<div class="mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded text-[10px] font-mono text-amber-700 dark:text-amber-400"><strong>WARNING:</strong> ${s.warn}</div>` : '';
    return `<div class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg"><span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold border border-orange-200 dark:border-orange-900/50 shrink-0">${s.n}</span><div class="space-y-1 min-w-0"><h4 class="text-sm font-bold text-slate-900 dark:text-white">${s.title}</h4><p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${s.desc}</p>${warnHtml}</div></div>`;
  }).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Complete assembly guide from bare PCB to functional device. Requires basic SMD soldering skills. Estimated build time: 3-4 hours.</p>
    <div class="space-y-3">${steps}</div>
  `;
}

export function renderAssemblyPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'assembly', title: 'Assembly Guide', file: 'README.md', content: renderContent(), lang, dict, currentPath });
}
