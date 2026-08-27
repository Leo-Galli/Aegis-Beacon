/**
 * Aegis-Beacon Wiki -- Security & Legal page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      Security considerations, legal requirements, and responsible use guidelines for the Aegis-Beacon system.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">RF Safety</h2>
    <div class="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg space-y-2">
      <p class="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        <strong>Warning:</strong> Never transmit without a properly matched antenna or 50-ohm dummy load. Mismatched loads cause reflected power that can damage the SX1262 PA stage permanently.
      </p>
      <ul class="text-xs text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
        <li>Maximum conducted output: +30 dBm (1W) at 433 MHz</li>
        <li>SAR exposure limit (ICNIRP): 0.08 W/kg averaged over 6 minutes</li>
        <li>Maintain 20 cm minimum distance from body during TX</li>
        <li>Disable TX when not in use for field deployment</li>
      </ul>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Legal Compliance</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[500px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Region</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Regulation</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Limit</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">EU (ETSI)</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">EN 300 220</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">+14 dBm (25 mW)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">LPD band 433 MHz, 1% duty cycle</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">US (FCC)</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">Part 15.247</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">+30 dBm (1W)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">ISM band 433 MHz, FHSS or digital modulation</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Australia</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">ACMA LIPD-2015</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">+14 dBm (25 mW)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">LIPD class licence, 433 MHz ISM</td></tr>
            <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Italy (PMR)</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">PMR446</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">+10 dBm (10 mW)</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">446 MHz, licence-free, 8 channels</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Emergency Use Only</h2>
    <div class="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-lg space-y-2">
      <p class="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
        <strong>Critical:</strong> Unauthorized continuous-wave (CW) transmissions outside permitted public radio allocations may violate local regulations and interfere with licensed services.
      </p>
      <ul class="text-xs text-rose-800 dark:text-rose-300 space-y-1 list-disc list-inside">
        <li>Use only in genuine emergency situations or authorized testing</li>
        <li>Do not transmit on frequencies allocated to emergency services</li>
        <li>Coordinate with local SAR teams before field deployment</li>
        <li>Keep transmission time minimal to reduce interference</li>
      </ul>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Security Considerations</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">WiFi Portal Security</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">WPA2-protected AP. Change default password (aegis123) before deployment. Portal accessible only when in CONFIG mode.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Firmware Integrity</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Open-source firmware can be audited. Verify checksums before flashing. PlatformIO builds are reproducible.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Physical Security</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Enclosure provides basic tamper resistance. No encryption on Morse transmissions (by design -- SAR teams need to decode).</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Data Privacy</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">GPS coordinates are transmitted openly in Morse. No cloud storage. No telemetry logging. Location data is ephemeral.</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">License</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      This project is distributed under the MIT License. Source code, hardware schematics, and documentation are freely available. Commercial use is permitted with attribution. The authors assume no liability for misuse or regulatory violations.
    </p>
  `;
}

export function renderSecurityPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'security',
    title: 'Security & Legal',
    file: 'wiki/security.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
