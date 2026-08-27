/**
 * Aegis-Beacon Wiki -- Testing & Calibration page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      Comprehensive testing procedures to verify hardware assembly, firmware correctness, and RF performance before field deployment.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Pre-Flight Checklist</h2>
    <div class="space-y-3">
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">1</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Visual Inspection</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Check for solder bridges, cold joints, and component orientation. Verify all ICs are correctly seated.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">2</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">Power Rail Verification</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Measure 3.3V, 5V rails with multimeter. Check for shorts on VCC/GND. Max current draw in TX: ~400 mA.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">3</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">SPI Bus Test</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Flash test firmware that reads SX1262 chip ID. Expected: 0x1262. If 0x00 or 0xFF, check wiring.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">4</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">OLED Display Test</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Run U8g2 test sketch. Display should show test pattern. Check contrast and orientation.</p></div>
      </div>
      <div class="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold shrink-0">5</span>
        <div><span class="text-sm font-bold text-slate-900 dark:text-white">GPS Fix Test</span><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Connect GPS module, wait for satellite lock (LED blink). Verify NMEA output on Serial2 at 9600 baud.</p></div>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">RF Performance Test</h2>
    <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2">
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Use a 50-ohm dummy load for conducted measurements. For over-the-air tests, use a calibrated receiver or SDR.
      </p>
      <ul class="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
        <li>TX power at 433 MHz: should read +17 dBm (default) to +22 dBm (max)</li>
        <li>Frequency accuracy: within +/- 10 kHz of target</li>
        <li>Spurious emissions: -40 dBc or better at harmonic frequencies</li>
        <li>CW tone frequency: 600 Hz +/- 5 Hz (measure with frequency counter)</li>
        <li>Audio output: sine wave at DAC pin, no clipping at max volume</li>
      </ul>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Battery Calibration</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 space-y-1">
      <div><span class="text-orange-400">// Calibrate ADC reading:</span></div>
      <div><span class="text-cyan-400">1. Charge battery to 4.20V (full)</span></div>
      <div><span class="text-cyan-400">2. Read ADC value (should be ~3300)</span></div>
      <div><span class="text-cyan-400">3. Discharge to 3.30V (low)</span></div>
      <div><span class="text-cyan-400">4. Read ADC value (should be ~2400)</span></div>
      <div><span class="text-cyan-400">5. Update ADC_MIN/ADC_MAX in config.h</span></div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Morse Timing Verification</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      Use an oscilloscope or logic analyzer on GPIO 25 (DAC). Verify dot duration = 1200/WPM ms. At 15 WPM: dot = 80ms, dash = 240ms, inter-character gap = 80ms.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Deep Sleep Current</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[300px]">
        <table class="w-full text-left">
          <thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">State</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Current</th>
            <th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Notes</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Deep Sleep</td><td class="py-2 px-4 font-mono text-emerald-600 dark:text-emerald-400">~10 uA</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">RTC domain only</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Idle (WiFi off)</td><td class="py-2 px-4 font-mono text-amber-600 dark:text-amber-400">~15 mA</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">CPU running, radio off</td></tr>
            <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">TX (beacon)</td><td class="py-2 px-4 font-mono text-rose-600 dark:text-rose-400">~350 mA</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">PA active at +17 dBm</td></tr>
            <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">TX (emergency)</td><td class="py-2 px-4 font-mono text-rose-600 dark:text-rose-400">~450 mA</td><td class="py-2 px-4 text-slate-600 dark:text-slate-400">Max power +22 dBm</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Common Test Failures</h2>
    <div class="space-y-2">
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="text-xs font-bold text-rose-600 dark:text-rose-400">SX1262 not responding</span>
        <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Check SPI wiring (GPIO 5, 18, 19, 23). Verify BUSY (GPIO 21) and RESET (GPIO 14). Ensure 3.3V power.</p>
      </div>
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="text-xs font-bold text-rose-600 dark:text-rose-400">OLED blank screen</span>
        <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Check SW SPI pins (GPIO 4, 13, 15, 16, 17). Verify contrast in U8g2 constructor. Try hardware reset.</p>
      </div>
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="text-xs font-bold text-rose-600 dark:text-rose-400">GPS no fix</span>
        <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Ensure outdoor view of sky. Check TX/RX swap (GPIO 12/22). Verify 3.3V power to GPS module.</p>
      </div>
      <div class="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span class="text-xs font-bold text-rose-600 dark:text-rose-400">No audio output</span>
        <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Check DAC1 (GPIO 25) connection. Verify 100R resistor and 10uF coupling cap. Test with oscilloscope.</p>
      </div>
    </div>
  `;
}

export function renderTestingPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'testing',
    title: 'Testing & Calibration',
    file: 'AegisBeacon.ino',
    content: renderContent(),
    lang, dict, currentPath
  });
}
