/**
 * Aegis-Beacon Wiki -- Overview page.
 */

import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      <strong>Aegis-Beacon</strong> is a low-cost, open-source emergency radio-location system based on LoRa technology. Designed for mountain rescue, land operations, and critical civilian scenarios where cellular infrastructure is unavailable.
    </p>

    <div class="flex flex-wrap gap-2">
      <span class="px-2.5 py-1 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900 text-[10px] font-mono font-bold">~$23-28 BOM</span>
      <span class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">410-525 MHz</span>
      <span class="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-[10px] font-mono font-bold">65h Runtime</span>
      <span class="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">4 Modes</span>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Key Features</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Emergency Morse Beacon</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Automatically transmits SOS + name + GPS coordinates in CW Morse code across all configured frequencies.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Multi-Frequency Scanner</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Sequentially scans up to 10 stored frequencies measuring RSSI to locate beacon signals.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">WiFi Configuration Portal</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Captive portal at 192.168.4.1 for field configuration without reflashing firmware.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">GPS Integration</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Optional NEO-6M module provides real-time NMEA coordinates embedded in Morse payload.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Ultra-Low Power</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">10 microamp deep sleep between TX cycles. 65-hour runtime on a single 18650 cell.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Open Hardware</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Full schematics, Gerber files, and BOM under MIT license. Total cost under $28.</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Quick Start</h2>
    <div class="space-y-3">
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">1</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Purchase Components</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Use the <a href="/builder" class="text-orange-600 dark:text-orange-400 hover:underline">BOM Builder</a> for sourcing links. Essential build: ~$23-28.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">2</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Assemble PCB</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Follow the 10-step assembly guide. Requires SMD soldering skills. ~3-4 hours.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">3</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Flash Firmware</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Install PlatformIO, clone repo, run <code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">pio run --target upload</code>.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">4</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Configure via WiFi</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Connect to "AEGIS-BEACON", open 192.168.4.1, set name and frequencies.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">5</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Deploy</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mount in enclosure, attach antenna, insert battery, switch to BEACON mode.</p></div>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">System Architecture</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
      <div><span class="text-orange-400">ESP32</span> <span class="text-slate-500">--SPI--</span> <span class="text-cyan-400">SX1262 (RF)</span></div>
      <div><span class="text-orange-400">ESP32</span> <span class="text-slate-500">--UART2--</span> <span class="text-cyan-400">NEO-6M (GPS)</span></div>
      <div><span class="text-orange-400">ESP32</span> <span class="text-slate-500">--SW SPI--</span> <span class="text-cyan-400">SSD1309 (OLED)</span></div>
      <div><span class="text-orange-400">ESP32</span> <span class="text-slate-500">--DAC1--</span> <span class="text-cyan-400">Audio Circuit</span></div>
      <div><span class="text-orange-400">ESP32</span> <span class="text-slate-500">--ADC--</span> <span class="text-cyan-400">Battery Monitor</span></div>
      <div><span class="text-orange-400">TP4056</span> <span class="text-slate-500">--</span> <span class="text-cyan-400">18650 Li-ion Cell</span></div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Morse Payload Format</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 break-all">
      <span class="text-orange-400">SOS</span> <span class="text-slate-500">DE</span> <span class="text-emerald-400">FIRST LAST</span> <span class="text-slate-500">PSN</span> <span class="text-cyan-400">N4553 E01230</span>
    </div>
    <p class="text-[10px] text-slate-500 dark:text-slate-400">DDM encoding: N4553 = 45 degrees 53 minutes North. E01230 = 12 degrees 30 minutes East. ~185m precision.</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">License</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">This project is distributed under the MIT License. Source code, hardware schematics, and documentation are freely available.</p>
  `;
}

export function renderOverviewPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'overview',
    title: 'Project Overview',
    file: 'README.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
