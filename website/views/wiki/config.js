/**
 * Aegis-Beacon Wiki -- Configuration Reference page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      All configurable parameters in <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">config.h</code> and runtime settings accessible through the WiFi portal.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Compile-Time Settings (config.h)</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[500px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Parameter</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Default</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Range</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Description</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">DEFAULT_FREQ</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">433.0</td><td class="py-2 px-4 font-mono text-slate-500">410-525 MHz</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Default transmission frequency</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">DEFAULT_WPM</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">15</td><td class="py-2 px-4 font-mono text-slate-500">5-30</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Default Morse speed (words per minute)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">DEFAULT_TX_POWER</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">17</td><td class="py-2 px-4 font-mono text-slate-500">-9 to +22 dBm</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Default TX power in dBm (PA max +30)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">DEFAULT_AUDIO_VOL</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">180</td><td class="py-2 px-4 font-mono text-slate-500">0-255</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">DAC audio volume (0=silent, 255=max)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">DEFAULT_AUDIO_HZ</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">600</td><td class="py-2 px-4 font-mono text-slate-500">200-2000</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Morse tone frequency in Hz</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">DEFAULT_SOS_TEXT</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">AEGIS BEACON</td><td class="py-2 px-4 font-mono text-slate-500">1-20 chars</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Callsign / name in Morse payload</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">GPS_ENABLED</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">true</td><td class="py-2 px-4 font-mono text-slate-500">true/false</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Enable GPS module (NEO-6M)</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">TX_INTERVAL_SEC</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">30</td><td class="py-2 px-4 font-mono text-slate-500">10-300</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Seconds between TX cycles in BEACON mode</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">WIFI_AP_SSID</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">AEGIS-BEACON</td><td class="py-2 px-4 font-mono text-slate-500">1-32 chars</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">WiFi AP hotspot name</td></tr>
            <tr><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">WIFI_AP_PASS</td><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">aegis123</td><td class="py-2 px-4 font-mono text-slate-500">8-63 chars</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">WiFi AP password (WPA2)</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Runtime Configuration (WiFi Portal)</h2>
    <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2">
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Connect to <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">AEGIS-BEACON</code> WiFi and navigate to <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">http://192.168.4.1</code>. The captive portal provides:
      </p>
      <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
        <li>Frequency selection (410-525 MHz, 0.1 MHz steps)</li>
        <li>WPM speed adjustment (5-30 WPM)</li>
        <li>TX power control (-9 to +22 dBm)</li>
        <li>Callsign / name editing (up to 20 characters)</li>
        <li>Audio volume and tone frequency</li>
        <li>GPS enable/disable toggle</li>
        <li>TX interval adjustment</li>
        <li>WiFi AP credentials change</li>
        <li>Factory reset option</li>
      </ul>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Frequency Storage</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      Up to 10 frequencies stored in ESP32 NVS (non-volatile storage). Each entry is a float (MHz) with a 1-byte enable flag. Frequencies persist across power cycles and firmware updates. The BEACON mode transmits sequentially on all enabled frequencies.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Battery Calibration</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[300px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">ADC Value</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Voltage</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Percentage</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Status</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">3300</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">4.20V</td><td class="py-2 px-4 font-mono text-emerald-600 dark:text-emerald-400">100%</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Fully charged</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">2800</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3.70V</td><td class="py-2 px-4 font-mono text-emerald-600 dark:text-emerald-400">50%</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Nominal</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">2400</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3.30V</td><td class="py-2 px-4 font-mono text-amber-600 dark:text-amber-400">20%</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Low warning</td></tr>
            <tr><td class="py-2 px-4 font-mono text-slate-900 dark:text-white">2100</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3.00V</td><td class="py-2 px-4 font-mono text-rose-600 dark:text-rose-400">0%</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Critical -- deep sleep</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-2">ADC divider: 2x (100K/100K). Calibrate with multimeter for accurate readings.</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Deep Sleep Configuration</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 space-y-1">
      <div><span class="text-orange-400">Wakeup source</span>: <span class="text-emerald-400">Timer (ESP_TIMER)</span></div>
      <div><span class="text-orange-400">Sleep duration</span>: <span class="text-emerald-400">TX_INTERVAL_SEC seconds</span></div>
      <div><span class="text-orange-400">GPIO hold</span>: <span class="text-emerald-400">All outputs retained during sleep</span></div>
      <div><span class="text-orange-400">Watchdog</span>: <span class="text-emerald-400">30s hardware WDT (TWDT)</span></div>
      <div><span class="text-orange-400">Current draw</span>: <span class="text-emerald-400">~10 uA (RTC domain only)</span></div>
    </div>
  `;
}

export function renderConfigPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'config',
    title: 'Configuration Reference',
    file: 'wiki/config.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
