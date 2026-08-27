/**
 * Aegis-Beacon Wiki -- Hardware page.
 */
import { renderWikiPageLayout } from './layout.js';

const COMPONENTS = [
  { name: 'ESP32 DevKit V1', type: 'MCU', specs: 'Dual-core 240 MHz, 520 KB SRAM, WiFi/BT', interface: '30-pin DIP' },
  { name: 'Ebyte E22-400M30S', type: 'RF Module', specs: 'SX1262-based, +30 dBm PA, 410-525 MHz', interface: 'SPI (16-pin)' },
  { name: 'SSD1309 OLED', type: 'Display', specs: '2.42" 128x64 monochrome, SW SPI', interface: '7-pin header' },
  { name: 'NEO-6M GPS', type: 'Navigation', specs: 'UART2 at 9600 baud, NMEA 0183, optional', interface: '4-pin header' },
  { name: 'TP4056', type: 'Charger', specs: 'Li-ion USB-C charging, 1A max', interface: 'SOT-23-8' },
  { name: '18650 Cell', type: 'Power', specs: '3.7V 2600-3500 mAh Li-ion', interface: 'Spring contacts' }
];

const PINS = [
  { pin: 'GPIO 5', fn: 'SX1262 NSS (CS)', dir: 'Output', notes: 'SPI chip select' },
  { pin: 'GPIO 18', fn: 'SX1262 SCK', dir: 'Output', notes: 'SPI clock' },
  { pin: 'GPIO 23', fn: 'SX1262 MOSI', dir: 'Output', notes: 'SPI data out' },
  { pin: 'GPIO 19', fn: 'SX1262 MISO', dir: 'Input', notes: 'SPI data in' },
  { pin: 'GPIO 21', fn: 'SX1262 BUSY', dir: 'Input', notes: 'Must poll before TX/RX' },
  { pin: 'GPIO 26', fn: 'SX1262 DIO1', dir: 'Input', notes: 'IRQ on packet received' },
  { pin: 'GPIO 27', fn: 'SX1262 RESET', dir: 'Output', notes: 'Hardware reset line' },
  { pin: 'GPIO 25', fn: 'DAC1 Audio Out', dir: 'Output', notes: 'Morse tone via DAC' },
  { pin: 'GPIO 32', fn: 'ADC Battery', dir: 'Input', notes: 'Voltage divider for SoC' },
  { pin: 'GPIO 16', fn: 'GPS RX', dir: 'Input', notes: 'UART2 receive from NEO-6M' },
  { pin: 'GPIO 17', fn: 'GPS TX', dir: 'Output', notes: 'UART2 transmit to NEO-6M' },
  { pin: 'GPIO 0', fn: 'Boot Mode', dir: 'Input', notes: 'LOW = flash bootloader' },
  { pin: 'GPIO 2', fn: 'LED Red', dir: 'Output', notes: 'BEACON mode indicator' },
  { pin: 'GPIO 4', fn: 'LED Blue', dir: 'Output', notes: 'SEARCH mode indicator' }
];

function renderContent() {
  const compRows = COMPONENTS.map((c) => `<tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2.5 pr-4 font-bold text-slate-900 dark:text-white text-xs">${c.name}</td><td class="py-2.5 pr-4 text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase">${c.type}</td><td class="py-2.5 pr-4 text-xs text-slate-600 dark:text-slate-400">${c.specs}</td><td class="py-2.5 text-[10px] font-mono text-slate-500">${c.interface}</td></tr>`).join('');
  const pinRows = PINS.map((p) => `<tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 pr-4 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${p.pin}</td><td class="py-2 pr-4 text-xs text-slate-900 dark:text-white font-medium">${p.fn}</td><td class="py-2 pr-4 text-[10px] font-mono text-slate-500">${p.dir}</td><td class="py-2 text-xs text-slate-600 dark:text-slate-400">${p.notes}</td></tr>`).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The radio core couples the dual-core ESP32 microcontroller with the Semtech SX1262 long-range transceiver.</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Component List</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[500px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Component</th><th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Type</th><th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Specs</th><th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Interface</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${compRows}</tbody></table>
      </div>
    </div>

    <div class="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-800 dark:text-amber-400"><strong>Warning:</strong> RadioLib limits TX power to +22 dBm. The E22 PA reaches +30 dBm but requires proper licensing.</div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">GPIO Pin Mapping</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[500px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">GPIO</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Function</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Dir</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${pinRows}</tbody></table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Circuit Description</h2>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">SPI Bus (SX1262)</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">GPIO 5 (NSS), GPIO 18 (SCK), GPIO 23 (MOSI), GPIO 19 (MISO) form the SPI bus. GPIO 21 (BUSY) must be polled before any SPI transaction.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">UART2 (GPS)</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">GPIO 16 (RX) and GPIO 17 (TX) connect to NEO-6M at 9600 baud. NMEA 0183 sentences parsed via TinyGPS++.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Audio Circuit</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">GPIO 25 (DAC1) outputs 600 Hz Morse tone through 100-ohm resistor and 10uF coupling capacitor to 3.5mm jack.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Battery Monitoring</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">GPIO 32 (ADC1) reads battery voltage through 100K/100K resistor divider. 12-bit ADC resolution.</p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">RF Design</h2>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Link Budget</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">With +22 dBm TX and -130 dBm RX sensitivity, theoretical link budget is 152 dB. Practical range: 10-15 km LOS at 433 MHz.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Frequency Stability</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">32 MHz TCXO with +/-1 ppm stability. Accuracy within +/-43 Hz at 433 MHz. Critical for narrow-band CW reception.</p>
    <h3 class="text-sm font-bold text-slate-900 dark:text-white">Antenna</h3>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Quarter-wave whip: 17.3 cm at 433 MHz. 50-ohm SMA connector. Never transmit without matched load.</p>
  `;
}

export function renderHardwarePage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'hardware', title: 'Hardware', file: 'DATASHEET.md', content: renderContent(), lang, dict, currentPath });
}
