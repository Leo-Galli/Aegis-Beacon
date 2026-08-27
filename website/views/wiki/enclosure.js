/**
 * Aegis-Beacon Wiki -- Enclosure page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      The Aegis-Beacon is housed in a Hammond 1593L aluminum enclosure providing EMI shielding, splash resistance, and rugged field durability.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Enclosure Specifications</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[400px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Parameter</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Value</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Model</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">Hammond 1593L</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Dimensions</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">100 x 60 x 25 mm</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Material</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Extruded aluminum, anodized</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">IP Rating</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">IP54 (splash resistant with gaskets)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Weight</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">~85g (empty), ~130g (assembled)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Color</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Natural aluminum (paintable)</td></tr>
            <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Price</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">~$4.00</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Required Cutouts</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">SMA Connector</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">6mm hole on short side. Panel-mount SMA female with lock nut. Drill from inside.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">USB-C (Charging)</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">8x3mm slot on short side. Align with TP4056 module USB port. File to fit.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">OLED Window</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">30x12mm rectangle on front face. Use Dremel or CNC. Deburr edges.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Switch Holes (x4)</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">6mm holes for tactile buttons. Front or side face. Space 15mm apart.</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Internal Layout</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 space-y-1 overflow-x-auto">
      <div class="text-orange-400">+------------------+</div>
      <div>|  [OLED]   [SMA]  |  <span class="text-slate-500">-- Front face</span></div>
      <div>|                  |</div>
      <div>|  [ESP32]  [SX1262]|  <span class="text-slate-500">-- Main PCB</span></div>
      <div>|                  |</div>
      <div>|  [GPS] [BATTERY] |  <span class="text-slate-500">-- Lower layer</span></div>
      <div>|  [TP4056]        |</div>
      <div class="text-orange-400">+------------------+</div>
      <div>  <span class="text-slate-500">[USB] [SW1][SW2][SW3][SW4]</span>  <span class="text-slate-500">-- Side face</span></div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Assembly Tips</h2>
    <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
      <li>Mount PCB on standoffs or double-sided tape (3M VHB recommended)</li>
      <li>Use rubber grommets on switch holes for weather resistance</li>
      <li>Apply clear silicone sealant around SMA and USB cutouts</li>
      <li>Thermal pad between ESP32 and aluminum case for heat dissipation</li>
      <li>18650 cell secured with foam padding to prevent vibration damage</li>
      <li>Add foam tape around OLED to prevent rattling</li>
    </ul>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Environmental Ratings</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg text-center">
        <div class="text-lg font-bold text-orange-600 dark:text-orange-400">-20 to +60</div>
        <div class="text-[10px] text-slate-500 uppercase">Operating Temperature (C)</div>
      </div>
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg text-center">
        <div class="text-lg font-bold text-orange-600 dark:text-orange-400">IP54</div>
        <div class="text-[10px] text-slate-500 uppercase">Ingress Protection</div>
      </div>
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg text-center">
        <div class="text-lg font-bold text-orange-600 dark:text-orange-400">1.5m</div>
        <div class="text-[10px] text-slate-500 uppercase">Drop Test (concrete)</div>
      </div>
    </div>
  `;
}

export function renderEnclosurePage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'enclosure',
    title: 'Enclosure & Mechanical',
    file: 'DATASHEET.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
