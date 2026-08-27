/**
 * Aegis-Beacon Wiki -- Power page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  const rows = [
    { v: '4.20V', pct: '100%', status: 'Full', rt: '~65h' },
    { v: '4.05V', pct: '90%', status: 'Normal', rt: '~58h' },
    { v: '3.90V', pct: '75%', status: 'Good', rt: '~49h' },
    { v: '3.75V', pct: '60%', status: 'Nominal', rt: '~39h' },
    { v: '3.65V', pct: '50%', status: 'Half', rt: '~32h' },
    { v: '3.55V', pct: '35%', status: 'Low', rt: '~23h' },
    { v: '3.40V', pct: '20%', status: 'Critical', rt: '~13h' },
    { v: '3.20V', pct: '10%', status: 'Empty', rt: '~6h' },
    { v: '3.00V', pct: '0%', status: 'Cutoff', rt: 'Shutdown' }
  ].map((r) => `<tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">${r.v}</td><td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400">${r.pct}</td><td class="py-2 px-4 text-[10px] font-mono text-slate-500">${r.status}</td><td class="py-2 px-4 text-xs text-emerald-600 dark:text-emerald-400 font-mono">${r.rt}</td></tr>`).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Single 18650 Li-ion cell with TP4056 USB-C charging. Battery voltage monitored via resistor divider on GPIO 32.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Battery Voltage vs Runtime</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[400px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Voltage</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Capacity</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Est. Runtime</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody></table>
      </div>
    </div>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Charging</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">TP4056 USB-C charger with 1A max current. Over-discharge protection at 3.0V cutoff. Red LED = charging, Blue LED = full.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Power Consumption by Mode</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">BEACON: ~15 mA average (duty-cycled). SEARCH: ~80 mA continuous. CONFIG: ~120 mA (WiFi). EMERGENCY: ~200 mA continuous.</p>
  `;
}

export function renderPowerPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'power', title: 'Power Management', file: 'DATASHEET.md', content: renderContent(), lang, dict, currentPath });
}
