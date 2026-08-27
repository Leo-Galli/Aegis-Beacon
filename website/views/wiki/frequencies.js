/**
 * Aegis-Beacon Wiki -- Frequencies page.
 */
import { renderWikiPageLayout } from './layout.js';

const FREQS = [
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

function renderContent() {
  const rows = FREQS.map((f) => {
    const cls = f.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
    const txt = f.ok ? 'COMPATIBLE' : 'INCOMPATIBLE';
    return `<tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">${f.freq}</td><td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400">${f.ch}</td><td class="py-2 px-4 text-[10px] font-mono text-slate-500">${f.region}</td><td class="py-2 px-4 text-[10px] font-mono font-bold ${cls}">${txt}</td><td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400">${f.note}</td></tr>`;
  }).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The E22-400M30S module supports 410-525 MHz. All values are hardware limits.</p>
    <div class="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">HARDWARE LIMIT: 410-525 MHz</div>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[600px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Frequency</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Channel</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Region</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody></table>
      </div>
    </div>
  `;
}

export function renderFrequenciesPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'frequencies', title: 'Frequency Compatibility', file: 'FREQUENCIES.md', content: renderContent(), lang, dict, currentPath });
}
