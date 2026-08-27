/**
 * Aegis-Beacon Wiki -- Pin Mapping page.
 */
import { renderWikiPageLayout } from './layout.js';

const PINS = [
  { pin: 'GPIO 2', fn: 'SX1262 DIO1', dir: 'Input', notes: 'TX/RX done + timeout IRQ' },
  { pin: 'GPIO 4', fn: 'OLED RESET', dir: 'Output', notes: 'Hardware reset for SSD1309' },
  { pin: 'GPIO 5', fn: 'SX1262 NSS/CS', dir: 'Output', notes: 'VSPI chip select, active LOW' },
  { pin: 'GPIO 12', fn: 'GPS TX out', dir: 'Output', notes: 'Serial2 TX to NEO-6M RX' },
  { pin: 'GPIO 13', fn: 'OLED SDA (D1)', dir: 'Output', notes: 'Software SPI data' },
  { pin: 'GPIO 14', fn: 'SX1262 RESET', dir: 'Output', notes: 'Active LOW hardware reset' },
  { pin: 'GPIO 15', fn: 'OLED SCK (D0)', dir: 'Output', notes: 'Software SPI clock' },
  { pin: 'GPIO 16', fn: 'OLED DC', dir: 'Output', notes: 'Data/Command select' },
  { pin: 'GPIO 17', fn: 'OLED CS', dir: 'Output', notes: 'Software SPI chip select' },
  { pin: 'GPIO 18', fn: 'VSPI SCK', dir: 'Output', notes: 'Hardware SPI clock to SX1262' },
  { pin: 'GPIO 19', fn: 'VSPI MISO', dir: 'Input', notes: 'Hardware SPI data from SX1262' },
  { pin: 'GPIO 21', fn: 'SX1262 BUSY', dir: 'Input', notes: 'MANDATORY - RadioLib polls this' },
  { pin: 'GPIO 22', fn: 'GPS RX in', dir: 'Input', notes: 'Serial2 RX from NEO-6M TX' },
  { pin: 'GPIO 23', fn: 'VSPI MOSI', dir: 'Output', notes: 'Hardware SPI data to SX1262' },
  { pin: 'GPIO 25', fn: 'DAC1 Audio', dir: 'Output', notes: 'Morse tone via 100R + 10uF' },
  { pin: 'GPIO 26', fn: 'LED Blue', dir: 'Output', notes: 'SEARCH mode indicator' },
  { pin: 'GPIO 27', fn: 'LED Red', dir: 'Output', notes: 'BEACON mode indicator' },
  { pin: 'GPIO 32', fn: 'SW_SEL', dir: 'Input', notes: 'Short=VOL/WPM, Long=config' },
  { pin: 'GPIO 33', fn: 'SW_MODE', dir: 'Input', notes: 'Short=toggle, Long=emergency' },
  { pin: 'GPIO 34', fn: 'SW_DN', dir: 'Input', notes: 'Input-only, ext pullup needed' },
  { pin: 'GPIO 35', fn: 'SW_UP', dir: 'Input', notes: 'Input-only, ext pullup needed' },
  { pin: 'GPIO 36', fn: 'ADC Battery', dir: 'Input', notes: 'ADC1_CH0 SVP, input-only' },
  { pin: 'GPIO 39', fn: 'TP4056 STDBY', dir: 'Input', notes: 'SVN, input-only, optional' }
];

function renderContent() {
  const rows = PINS.map((p) => `<tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 pr-4 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${p.pin}</td><td class="py-2 pr-4 text-xs text-slate-900 dark:text-white font-medium">${p.fn}</td><td class="py-2 pr-4 text-[10px] font-mono text-slate-500">${p.dir}</td><td class="py-2 text-xs text-slate-600 dark:text-slate-400">${p.notes}</td></tr>`).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Complete GPIO pin assignment for the ESP32 DevKit V1 (v5.4). All pins are active-low unless noted.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">GPIO Assignment Table</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[500px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">GPIO</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Function</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Dir</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody></table>
      </div>
    </div>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Important Notes</h2>
    <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
      <li>GPIO 34, 35, 36, 39 are input-only with no internal pull-up</li>
      <li>GPIO 21 (BUSY) is mandatory - firmware will hang without it</li>
      <li>Software SPI used for OLED to avoid VSPI bus conflicts</li>
      <li>GPIO 25 has native 8-bit DAC for audio output</li>
    </ul>
  `;
}

export function renderPinmapPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'pinmap', title: 'GPIO Pin Mapping', file: 'DATASHEET.md', content: renderContent(), lang, dict, currentPath });
}
