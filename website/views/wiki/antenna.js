/**
 * Aegis-Beacon Wiki -- Antenna Design page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <h2 class="text-lg font-bold text-slate-900 dark:text-white">Quarter-Wave Whip</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">For 433 MHz: length = 300 / (4 * 433) = 17.3 cm. Use rigid copper wire or telescopic antenna. SMA male connector.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Frequency-Specific Lengths</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[300px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Frequency</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Length</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">433 MHz (ISM)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">17.3 cm</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">446 MHz (PMR)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">16.8 cm</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">462 MHz (GMRS)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">16.2 cm</td></tr>
        <tr><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">477 MHz (UHF CB)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">15.7 cm</td></tr>
        </tbody></table>
      </div>
    </div>
    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Formula: L(cm) = 7500 / f(MHz)</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Impedance Matching</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">50-ohm output. Never transmit without matched load. Mismatched loads damage the PA stage.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Ground Plane</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">PCB ground plane acts as counterpoise. Mount antenna vertically for omnidirectional coverage.</p>
  `;
}

export function renderAntennaPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'antenna', title: 'Antenna Design', file: 'DATASHEET.md', content: renderContent(), lang, dict, currentPath });
}
