/**
 * Aegis-Beacon Wiki -- GPS Integration page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Optional NEO-6M GPS module provides real-time coordinates embedded in the Morse payload.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Hardware Connection</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[300px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">GPS Pin</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">ESP32 GPIO</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">VCC</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3V3</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">3.3V (most accept 3.3-5V)</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">GND</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GND</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Common ground</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">TX</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 22</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">GPS TX to ESP32 RX</td></tr>
        <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">RX</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 12</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">GPS RX from ESP32 TX</td></tr>
        </tbody></table>
      </div>
    </div>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Coordinate Encoding</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Compact DDM format: N4553 = 45 degrees 53 minutes North. E01230 = 12 degrees 30 minutes East. ~185m precision.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Boot Behavior</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">GPS wait screen with satellite count. Press MODE to skip. Timeout after 60s transmits without coordinates.</p>
  `;
}

export function renderGpsPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'gps', title: 'GPS Integration', file: 'wiki/gps.md', content: renderContent(), lang, dict, currentPath });
}
