/**
 * Aegis-Beacon Wiki -- OLED Display page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      The 2.42" SSD1309 OLED display (128x64 pixels) provides real-time operational feedback using software SPI via the U8g2 library.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Display Interface</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[400px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">OLED Pin</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">ESP32 GPIO</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Function</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">GND</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GND</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Ground</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">VCC</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3V3</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">3.3V power</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">D0 (SCK)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 15</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Software SPI clock</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">D1 (SDA)</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 13</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Software SPI data</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">RES</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 4</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Hardware reset (active LOW)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">DC</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 16</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Data/Command select</td></tr>
            <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">CS</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPIO 17</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Software SPI chip select</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Display Pages</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Status Page (Home)</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Shows current mode, frequency, battery voltage, WPM, and GPS status. Updated every 500ms.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">GPS Wait Screen</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Displayed during cold start. Shows satellite count and fix status. Press MODE to skip.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">WiFi Portal Info</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Shows AP SSID and IP address when CONFIG mode is active. Includes connection status.</p>
      </div>
      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">Scanning Progress</h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">SEARCH mode displays frequency, RSSI bar, and signal strength in real-time.</p>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">U8g2 Library Setup</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 space-y-1">
      <div><span class="text-orange-400">// Software SPI constructor</span></div>
      <div><span class="text-cyan-400">U8G2_SSD1309_128X64_NONAME_F_SW_SPI</span> <span class="text-slate-500">u8g2(</span></div>
      <div class="pl-4"><span class="text-slate-500">U8G2_R0, SCK, SDA, CS, DC, RESET</span></div>
      <div><span class="text-slate-500">);</span></div>
    </div>
    <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Software SPI is used instead of hardware SPI to avoid conflicts with the SX1262 (VSPI bus).</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Display Power</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      The OLED draws approximately 20 mA when active and 0.01 mA in sleep mode. The display is automatically powered down during deep sleep to conserve battery. Wakeup re-initializes the display driver.
    </p>
  `;
}

export function renderDisplayPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'display',
    title: 'OLED Display',
    file: 'wiki/display.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
