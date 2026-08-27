/**
 * Aegis-Beacon Wiki -- Glossary page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  const terms = [
    { term: 'Aegis-Beacon', def: 'The complete emergency radio-location system comprising ESP32, SX1262, OLED, GPS, and supporting circuitry for CW Morse beacon transmission.' },
    { term: 'BEACON Mode', def: 'Primary operating mode. Transmits SOS + callsign + GPS on all configured frequencies, then enters deep sleep for TX_INTERVAL seconds.' },
    { term: 'BOM', def: 'Bill of Materials. Complete list of components required to build the device. Estimated total: $23-28 USD.' },
    { term: 'CW', def: 'Continuous Wave. Unmodulated carrier used for Morse code. Generated via FSK with transmitDirect() on the SX1262.' },
    { term: 'DAC', def: 'Digital-to-Analog Converter. ESP32 internal 8-bit DAC on GPIO 25 used to generate 600 Hz audio tones.' },
    { term: 'DDM', def: 'Degrees and Decimal Minutes. Coordinate format used in Morse payload. Example: N4553 = 45 degrees 53 minutes North.' },
    { term: 'Deep Sleep', def: 'ESP32 ultra-low power mode (~10 uA). RTC domain active, all other peripherals powered down. Wake on timer interrupt.' },
    { term: 'DIO1', def: 'Digital I/O pin 1 on SX1262. Configured as IRQ source for TX-done and timeout events. Connected to GPIO 2.' },
    { term: 'E22-400M30S', def: 'Ebyte LoRa module based on SX1262 with +30 dBm PA. 410-525 MHz. SPI interface. 16-pin header.' },
    { term: 'FSK', def: 'Frequency Shift Keying. Modulation used by SX1262 for CW keying. Provides OOK-compatible signal detectable by AM scanners.' },
    { term: 'GPIO', def: 'General Purpose Input/Output. ESP32 pins configured for specific functions (SPI, UART, ADC, LED, buttons).' },
    { term: 'GPS', def: 'Global Positioning System. Optional NEO-6M module provides NMEA coordinates embedded in Morse payload.' },
    { term: 'Link Budget', def: 'Total power available for communication: TX power + antenna gain - path loss - RX sensitivity. System budget: 161.5 dB.' },
    { term: 'LoRa', def: 'Long Range radio technology by Semtech. Chirp spread spectrum modulation. SX1262 supports SF5-SF12, BW125-500 kHz.' },
    { term: 'NMEA', def: 'National Marine Electronics Association. Standard sentence format for GPS data. Parsed by TinyGPS++ library.' },
    { term: 'NVS', def: 'Non-Volatile Storage. ESP32 flash-based key-value store used to persist frequency settings and configuration.' },
    { term: 'OLED', def: 'Organic Light-Emitting Diode display. SSD1309 2.42-inch 128x64 monochrome. Software SPI via U8g2 library.' },
    { term: 'PA', def: 'Power Amplifier. SX1262 internal PA provides up to +22 dBm. E22 module external PA extends to +30 dBm.' },
    { term: 'PARIS', def: 'Standard calibration word for Morse timing. 50 dot-lengths per word. Used to calculate dot duration from WPM.' },
    { term: 'PlatformIO', def: 'Professional collaborative platform for embedded development. Used to compile and flash Aegis-Beacon firmware.' },
    { term: 'RadioLib', def: 'Universal wireless communication library (v6.x). Drives SX1262 for LoRa/FSK/CW modes. Supports transmitDirect().' },
    { term: 'RSSI', def: 'Received Signal Strength Indicator. Measured in dBm. SEARCH mode scans frequencies and reports RSSI for each.' },
    { term: 'SAR', def: 'Search and Rescue. Primary use case for Aegis-Beacon. CW beacon enables radio direction finding by rescue teams.' },
    { term: 'SMA', def: 'SubMiniature version A. Coaxial RF connector. 50-ohm impedance. Used for antenna connection to E22 module.' },
    { term: 'SPI', def: 'Serial Peripheral Interface. 4-wire synchronous bus (SCK, MISO, MOSI, CS). VSPI used for SX1262 at 10 MHz.' },
    { term: 'TCXO', def: 'Temperature Compensated Crystal Oscillator. SX1262 internal reference for frequency stability (+/- 10 ppm).' },
    { term: 'TP4056', def: 'Linear Li-ion charge controller IC. USB-C input, 4.2V output, 1A charge current. Over-discharge protection included.' },
    { term: 'UART', def: 'Universal Asynchronous Receiver/Transmitter. Serial2 at 9600 baud used for GPS NMEA data reception.' },
    { term: 'U8g2', def: 'Monochrome graphics library for embedded systems. Drives SSD1309 OLED. Supports software and hardware SPI.' },
    { term: 'VSPI', def: 'Virtual SPI. ESP32 hardware SPI bus 2. Pins: GPIO 18 (SCK), 19 (MISO), 23 (MOSI), 5 (CS). 10 MHz clock.' },
    { term: 'WDT', def: 'Watchdog Timer. 30-second hardware timer. Resets ESP32 if firmware hangs. Mandatory for field reliability.' },
    { term: 'WPM', def: 'Words Per Minute. Morse code speed. Default: 15 WPM. Dot duration = 1200/WPM ms. Range: 5-30 WPM.' }
  ];

  const rows = terms.map((t) => `
    <tr class="border-b border-slate-100 dark:border-slate-800">
      <td class="py-2 px-4 font-mono text-xs font-bold text-orange-600 dark:text-orange-400 align-top whitespace-nowrap">${t.term}</td>
      <td class="py-2 px-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${t.def}</td>
    </tr>`).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      Technical glossary covering all acronyms, protocols, and component references used throughout the Aegis-Beacon documentation.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Terms</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[500px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Term</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Definition</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderGlossaryPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'glossary',
    title: 'Glossary',
    file: 'README.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
