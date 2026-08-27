/**
 * Aegis-Beacon Wiki -- RF Design page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      The RF subsystem uses the Semtech SX1262 transceiver inside the Ebyte E22-400M30S module, operating at 410-525 MHz with up to +30 dBm PA output.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Link Budget</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[400px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Parameter</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Value</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">TX Power (max)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">+30 dBm (1W)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">E22-400M30S PA (RadioLib limits to +22)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">RX Sensitivity</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">-130 dBm (SF12/BW125)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Best sensitivity at lowest data rate</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Antenna Gain</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">+2 dBi (typical)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Quarter-wave whip, rubber duck</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Cable Loss</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">~0.5 dB</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Short SMA pigtail</td></tr>
            <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Total Link Budget</td><td class="py-2 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">161.5 dB</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">30 + 130 + 2 - 0.5</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Estimated Range</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Line of Sight (LOS)</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">15-25 km depending on terrain and antenna height. Mountain-to-valley scenarios achieve maximum range.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Urban / Forest</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">2-5 km typical. Foliage attenuation ~0.1 dB/m at 433 MHz. Building penetration loss 10-20 dB.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Underground / Indoor</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">500m-1km. Concrete attenuation ~10-15 dB per floor. Useful for mine/shaft rescue.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Emergency Mode (+22 dBm)</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Continuous TX at max power. Reduces range by ~8 dB vs +30 dBm but ensures maximum penetration.</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Modulation Parameters</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 space-y-1">
      <div><span class="text-orange-400">Mode</span>: <span class="text-emerald-400">FSK + CW Keying (transmitDirect)</span></div>
      <div><span class="text-orange-400">Data rate</span>: <span class="text-emerald-400">0.6 kbps (CW equivalent)</span></div>
      <div><span class="text-orange-400">Spreading factor</span>: <span class="text-emerald-400">SF12 (for LoRa mode scanning)</span></div>
      <div><span class="text-orange-400">Bandwidth</span>: <span class="text-emerald-400">125 kHz (for LoRa mode scanning)</span></div>
      <div><span class="text-orange-400">Coding rate</span>: <span class="text-emerald-400">4/5 (default)</span></div>
      <div><span class="text-orange-400">Sync word</span>: <span class="text-emerald-400">0x1424 (SX1262 default)</span></div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Frequency Stability</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      Crystal accuracy: +/- 10 ppm (SX1262 TCXO). Frequency drift over temperature: +/- 3 ppm typical. The SX1262 supports automatic frequency correction (AFC) for improved reception.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">EMC Considerations</h2>
    <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
      <li>TX spurious emissions must comply with ETSI EN 300 220 or FCC Part 15.247</li>
      <li>Harmonic suppression: >= 40 dBc for 2nd and 3rd harmonics</li>
      <li>TX rise/fall time: 2 ms (configurable via RadioLib)</li>
      <li>Duty cycle: 1% (configurable, default 100% for emergency)</li>
      <li>Conducted emissions: < -36 dBm (ETSI) / < -13 dBm (FCC)</li>
    </ul>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">SX1262 Register Map Highlights</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[400px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Register</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Address</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Purpose</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">RegOpMode</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">0x08</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Operating mode selection</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">RegFrf</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">0x06-08</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Frequency setting (24-bit)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">RegPaConfig</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">0x95</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">PA configuration (power/boost)</td></tr>
            <tr><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">RegDioMapping</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">0x09</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">DIO0/DIO1 interrupt mapping</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderRfDesignPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'rf-design',
    title: 'RF Design & Link Budget',
    file: 'DATASHEET.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
