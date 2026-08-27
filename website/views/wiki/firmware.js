/**
 * Aegis-Beacon Wiki -- Firmware page.
 */
import { renderWikiPageLayout } from './layout.js';

const MODES = [
  { name: 'BEACON', desc: 'Transmits Morse SOS + name + GPS on all configured frequencies, then enters deep sleep. Red LED active.', sleep: '10s default', power: '+17 dBm' },
  { name: 'SEARCH', desc: 'Scans all frequencies sequentially, measuring RSSI on each. Audio alert with rising pitch on detection. Blue LED active.', sleep: 'None (active)', power: 'Rx only' },
  { name: 'CONFIG', desc: 'WiFi AP mode (192.168.4.1) with captive portal dashboard. Adjust frequencies, WPM, power, GPS settings via browser.', sleep: 'None', power: 'WiFi AP' },
  { name: 'EMERGENCY', desc: 'Maximum power continuous TX with full payload. No deep sleep. 1760 Hz audible tone. For critical situations only.', sleep: 'None', power: '+22 dBm' }
];

function renderContent() {
  const modeCards = MODES.map((m) => `<div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2"><div class="flex items-center justify-between"><span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${m.name}</span><span class="text-[10px] font-mono text-slate-500">${m.power}</span></div><p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${m.desc}</p><div class="text-[10px] font-mono text-slate-500">Sleep: ${m.sleep}</div></div>`).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Written in C++ (Arduino/PlatformIO), the firmware implements four distinct operating modes. WiFi/BT stack is disabled in BEACON/SEARCH to save ~120 mA.</p>

    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
      <div><span class="text-orange-400">#include</span> <span class="text-emerald-300">&lt;RadioLib.h&gt;</span>      <span class="text-slate-500">// SX1262 driver</span></div>
      <div><span class="text-orange-400">#include</span> <span class="text-emerald-300">&lt;U8g2lib.h&gt;</span>      <span class="text-slate-500">// OLED display</span></div>
      <div><span class="text-orange-400">#include</span> <span class="text-emerald-300">&lt;TinyGPS++.h&gt;</span>    <span class="text-slate-500">// GPS parser</span></div>
      <div><span class="text-orange-400">#include</span> <span class="text-emerald-300">&lt;WiFi.h&gt;</span>          <span class="text-slate-500">// Config portal</span></div>
      <div><span class="text-orange-400">#include</span> <span class="text-emerald-300">&lt;ArduinoJson.h&gt;</span>  <span class="text-slate-500">// JSON config</span></div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Operating Modes</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${modeCards}</div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Morse Code Engine</h2>
    <p class="text-xs text-slate-600 dot-slate-400 leading-relaxed">PARIS standard timing. Dot = 1200/WPM ms. Dash = 3x dot. Inter-character = 3x dot. Inter-word = 7x dot. Default 13 WPM.</p>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300">
      <span class="text-orange-400">SOS</span> <span class="text-slate-500">DE</span> <span class="text-emerald-400">FIRST LAST</span> <span class="text-slate-500">PSN</span> <span class="text-cyan-400">N4553 E01230</span>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">GPS Integration</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Optional NEO-6M via UART2 at 9600 baud. TinyGPS++ parses GPRMC/GPGGA sentences. Coordinates encoded in compact DDM (~185m precision).</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Configuration Reference</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
      <div><span class="text-orange-400">#define</span> DEFAULT_FREQ_MHZ <span class="text-emerald-300">433.500f</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_WPM <span class="text-emerald-300">13</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_POWER_DBM <span class="text-emerald-300">17</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_SLEEP_SEC <span class="text-emerald-300">10</span></div>
      <div><span class="text-orange-400">#define</span> DEFAULT_AUDIO_VOL <span class="text-emerald-300">180</span></div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">WiFi Config Portal</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">SSID: "AEGIS-BEACON", no password. Portal at 192.168.4.1. Configure name, frequencies (up to 10), WPM, power, GPS, sleep interval, audio volume.</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">OLED Display</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">SSD1309 2.42" 128x64 via SW SPI (U8g2). Shows mode, frequency, operator name, GPS status, battery. Updates every 1s in active modes.</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Library Dependencies</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">RadioLib >= 6.x, U8g2 >= 2.34, TinyGPS++ >= 1.0.3, ArduinoJson >= 7.x. All managed via PlatformIO lib_deps.</p>
  `;
}

export function renderFirmwarePage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'firmware', title: 'Firmware', file: 'wiki/firmware.md', content: renderContent(), lang, dict, currentPath });
}
