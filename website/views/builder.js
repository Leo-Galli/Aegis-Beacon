/**
 * Aegis-Beacon -- BOM Builder page with budget slider.
 *
 * Interactive bill of materials calculator with component sourcing,
 * budget slider, build site links, and device function breakdown.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Component database ───────────────────────────────────────────── */
const COMPONENTS = [
  {
    id: 'esp32', name: 'ESP32 DevKit V1', category: 'MCU', price: 3.00,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-esp32-devkit-v1.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-esp32-devkit-v1.html', 'https://www.amazon.com/s?k=esp32+devkit+v1'],
    qty: 1, required: true,
    functions: ['Dual-core 240 MHz processing', 'WiFi/BT radio (disabled in beacon)', 'GPIO control for all peripherals', 'Deep sleep at 10 uA', 'ADC for battery monitoring'],
    specs: 'Dual-core Xtensa LX6, 520 KB SRAM, 4 MB Flash, 30-pin DIP'
  },
  {
    id: 'sx1262', name: 'Ebyte E22-400M30S', category: 'RF Module', price: 5.50,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-e22-400m30s.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-e22-400m30s.html', 'https://www.mouser.com/search/refine?keyword=ebyte+e22'],
    qty: 1, required: true,
    functions: ['LoRa transceiver at 410-525 MHz', '+30 dBm power amplifier', 'SPI interface to ESP32', 'Integrated SMA connector', '-130 dBm receive sensitivity'],
    specs: 'SX1262-based, +30 dBm PA, 410-525 MHz, SPI, 16-pin header'
  },
  {
    id: 'oled', name: 'SSD1309 OLED 2.42"', category: 'Display', price: 3.50,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-ssd1309-oled-2-42.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-ssd1309-oled-2-42.html', 'https://www.amazon.com/s?k=ssd1309+oled+2.42'],
    qty: 1, required: true,
    functions: ['128x64 monochrome display', 'Shows mode, frequency, status', 'Battery voltage display', 'GPS coordinate display', 'Real-time operational feedback'],
    specs: '128x64 pixels, SW SPI via U8g2, 7-pin header'
  },
  {
    id: 'gps', name: 'NEO-6M GPS Module', category: 'Navigation', price: 4.50,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-neo-6m-gps.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-neo-6m-gps.html', 'https://www.amazon.com/s?k=neo-6m+gps'],
    qty: 1, required: false,
    functions: ['Real-time GPS coordinate acquisition', 'NMEA 0183 sentence parsing', 'Embeds coordinates in Morse payload', 'Cold start: 5-15 minutes', 'UART2 at 9600 baud'],
    specs: 'UART2, 9600 baud, NMEA 0183, 4-pin header, optional'
  },
  {
    id: 'tp4056', name: 'TP4056 Charger Module', category: 'Power', price: 0.50,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-tp4056-usb-c.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-tp4056-usb-c.html', 'https://www.amazon.com/s?k=tp4056+usb-c'],
    qty: 1, required: true,
    functions: ['USB-C Li-ion charging', '1A maximum charge current', 'Over-discharge protection', 'Charge status LED indicators', 'Battery voltage monitoring'],
    specs: 'SOT-23-8, USB-C input, 4.2V charge voltage'
  },
  {
    id: 'battery', name: '18650 Li-ion Cell', category: 'Power', price: 1.50,
    source: 'Amazon', url: 'https://www.amazon.com/s?k=18650+3000mah',
    buildSites: ['https://www.amazon.com/s?k=18650+3000mah', 'https://www.aliexpress.com/w/wholesale-18650-battery-3000mah.html'],
    qty: 1, required: true,
    functions: ['3.7V nominal voltage', '3000 mAh capacity', '~65 hours beacon runtime', 'Spring contact mounting', 'Single cell design'],
    specs: '3.7V, 2600-3500 mAh, 18650 form factor'
  },
  {
    id: 'passives', name: 'Passive Components', category: 'Passives', price: 1.00,
    source: 'Mouser', url: 'https://www.mouser.com/',
    buildSites: ['https://www.mouser.com/', 'https://www.digikey.com/', 'https://www.aliexpress.com/w/wholesale-0805-resistor-kit.html'],
    qty: 1, required: true,
    functions: ['100 ohm audio resistor', '10 uF coupling capacitor', 'Voltage divider for ADC', 'Decoupling capacitors', 'Pull-up/pull-down resistors'],
    specs: '0805/0603 SMD, mixed values'
  },
  {
    id: 'enclosure', name: 'Hammond 1593L', category: 'Enclosure', price: 4.00,
    source: 'Mouser', url: 'https://www.mouser.com/ProductDetail/Hammond-Mfg/1593L',
    buildSites: ['https://www.mouser.com/ProductDetail/Hammond-Mfg/1593L', 'https://www.amazon.com/s?k=hammond+1593l'],
    qty: 1, required: true,
    functions: ['100x60x25mm aluminum enclosure', 'Splash-resistant design', 'PCB mounting bosses', 'Cutouts for SMA/USB/OLED', 'Protects against EMI'],
    specs: '100 x 60 x 25 mm, aluminum, paintable'
  },
  {
    id: 'conn_sma', name: 'SMA Connector', category: 'Connectors', price: 0.30,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-sma-connector-pcb.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-sma-connector-pcb.html', 'https://www.mouser.com/search/refine?keyword=sma+pcb'],
    qty: 1, required: true,
    functions: ['50 ohm antenna interface', 'Standard SMA female PCB mount', 'Soldered for mechanical strength', 'Connects to E22 module', 'Antenna swap capability'],
    specs: 'SMA female, PCB mount, 50 ohm'
  },
  {
    id: 'conn_header', name: 'Pin Headers', category: 'Connectors', price: 0.20,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-pin-headers-2-54mm.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-pin-headers-2-54mm.html', 'https://www.amazon.com/s?k=pin+headers+2.54mm'],
    qty: 5, required: true,
    functions: ['ESP32 module socket', 'OLED display connection', 'GPS module connection', 'SX1262 module interface', 'Debug/programming header'],
    specs: '2.54mm pitch, male/female, various counts'
  },
  {
    id: 'antenna', name: '433 MHz Antenna', category: 'Antenna', price: 1.50,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-433mhz-antenna-sma.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-433mhz-antenna-sma.html', 'https://www.amazon.com/s?k=433mhz+antenna+sma'],
    qty: 1, required: true,
    functions: ['Quarter-wave whip (17.3 cm at 433 MHz)', '50 ohm impedance matched', 'SMA male connector', 'Optimal for 433 MHz ISM band', 'Swappable for other frequencies'],
    specs: '17.3 cm, 433 MHz, SMA male, rubber duck'
  },
  {
    id: 'led', name: 'Status LEDs', category: 'Indicators', price: 0.10,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-smd-led-0805.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-smd-led-0805.html', 'https://www.mouser.com/search/refine?keyword=led+0805'],
    qty: 2, required: true,
    functions: ['Red LED: BEACON mode indicator', 'Blue LED: SEARCH mode indicator', 'Visual operational feedback', 'Low-power current draw', 'GPIO 2 and GPIO 4 driven'],
    specs: '0805 SMD, Red + Blue, 20 mA max'
  },
  {
    id: 'jack', name: '3.5mm Audio Jack', category: 'Audio', price: 0.30,
    source: 'AliExpress', url: 'https://www.aliexpress.com/w/wholesale-3-5mm-jack-pcb.html',
    buildSites: ['https://www.aliexpress.com/w/wholesale-3-5mm-jack-pcb.html', 'https://www.mouser.com/search/refine?keyword=3.5mm+jack+pcb'],
    qty: 1, required: false,
    functions: ['Audio output for Morse tone', 'Connects to external speakers', '600 Hz CW tone output', 'Headphone monitoring', 'Optional audio feedback'],
    specs: '3.5mm TRS, PCB mount, stereo'
  }
];

const BUILD_SITES = [
  { name: 'AliExpress', url: 'https://www.aliexpress.com', desc: 'Best prices, 2-4 week shipping', icon: 'A' },
  { name: 'Amazon', url: 'https://www.amazon.com', desc: 'Fast shipping, higher prices', icon: 'Z' },
  { name: 'Mouser', url: 'https://www.mouser.com', desc: 'Professional parts, datasheets', icon: 'M' },
  { name: 'DigiKey', url: 'https://www.digikey.com', desc: 'Professional parts, fast shipping', icon: 'D' }
];

/* ── Renderers ────────────────────────────────────────────────────── */

function renderBuilderHeader() {
  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// BOM BUILDER</span>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Bill of Materials Calculator</h1>
      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
        Configure your build, see real-time pricing, and get links to source every component. Use the budget slider to filter parts by price range.
      </p>
    </div>
  </section>`;
}

function renderBudgetSlider() {
  return `<section class="space-y-4">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">Budget Slider</span>
        <span id="budget-display" class="text-lg font-mono font-bold text-orange-600 dark:text-orange-400">$28.00</span>
      </div>
      <input type="range" id="budget-slider" min="0" max="30" step="0.5" value="28"
        class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        oninput="updateBudget(this.value)">
      <div class="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
        <span>$0</span>
        <span>$5</span>
        <span>$10</span>
        <span>$15</span>
        <span>$20</span>
        <span>$25</span>
        <span>$30</span>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <button onclick="applyBudgetTier('essential')" class="tier-btn px-3 py-1.5 text-[11px] font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-500 transition-all">Essential (~$23)</button>
        <button onclick="applyBudgetTier('standard')" class="tier-btn px-3 py-1.5 text-[11px] font-mono font-bold rounded-lg border border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 transition-all">Standard (~$27)</button>
        <button onclick="applyBudgetTier('premium')" class="tier-btn px-3 py-1.5 text-[11px] font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-500 transition-all">Premium (~$29)</button>
      </div>
    </div>
  </section>`;
}

function renderBuildSites() {
  const cards = BUILD_SITES.map((s) => `
    <a href="${s.url}" target="_blank" rel="noopener" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-orange-500/50 transition-all group">
      <span class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 font-mono text-xs font-bold">${s.icon}</span>
      <div class="min-w-0">
        <span class="text-xs font-bold text-slate-900 dark:text-white">${s.name}</span>
        <p class="text-[10px] text-slate-500">${s.desc}</p>
      </div>
      <svg class="w-3 h-3 text-slate-400 group-hover:text-orange-500 shrink-0 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
    </a>`).join('');

  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// BUILD SITES</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Where to Buy Components</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">${cards}</div>
  </section>`;
}

function renderComponentTable() {
  const rows = COMPONENTS.map((c) => {
    const requiredBadge = c.required
      ? '<span class="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[9px] font-mono font-bold">REQUIRED</span>'
      : '<span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-mono">OPTIONAL</span>';
    const checkedAttr = c.required ? 'checked' : '';

    return `
    <tr class="border-b border-slate-100 dark:border-slate-800 comp-row" data-id="${c.id}" data-price="${c.price}">
      <td class="py-3 px-4">
        <div class="flex items-center gap-2">
          <input type="checkbox" class="comp-check accent-orange-500 w-3.5 h-3.5" data-id="${c.id}" data-price="${c.price}" ${checkedAttr} onchange="recalculate()">
          <div>
            <span class="text-xs font-bold text-slate-900 dark:text-white">${c.name}</span>
            <span class="ml-2">${requiredBadge}</span>
          </div>
        </div>
      </td>
      <td class="py-3 px-4 text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase">${c.category}</td>
      <td class="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs hidden sm:table-cell">${c.specs}</td>
      <td class="py-3 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">$${c.price.toFixed(2)}</td>
      <td class="py-3 px-4">
        <div class="flex flex-wrap gap-1">
          ${c.buildSites.slice(0, 2).map((url) => {
            const name = new URL(url).hostname.replace('www.', '').split('.')[0];
            return `<a href="${url}" target="_blank" rel="noopener" class="text-[9px] font-mono text-orange-600 dark:text-orange-400 hover:underline capitalize">${name}</a>`;
          }).join(' ')}
        </div>
      </td>
    </tr>`;
  }).join('');

  return `<section class="space-y-4">
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div class="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span class="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">Component List</span>
        <span id="selected-count" class="text-[10px] font-mono text-orange-600 dark:text-orange-400">-- components selected</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Component</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Category</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase hidden sm:table-cell">Specs</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Price</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Buy</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function renderBudgetSummary() {
  return `<section class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-2">
        <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Estimated Total</span>
        <div id="total-price" class="text-3xl font-bold font-mono text-orange-600 dark:text-orange-400">$0.00</div>
        <span class="text-[10px] font-mono text-slate-400">USD (approximate)</span>
      </div>
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-2">
        <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Components</span>
        <div id="comp-count" class="text-3xl font-bold font-mono text-slate-900 dark:text-white">0</div>
        <span class="text-[10px] font-mono text-slate-400">selected</span>
      </div>
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-2">
        <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Build Difficulty</span>
        <div id="difficulty" class="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">--</div>
        <span class="text-[10px] font-mono text-slate-400">SMD soldering required</span>
      </div>
    </div>
  </section>`;
}

function renderFunctionBreakdown() {
  const functions = [
    { mode: 'BEACON', desc: 'Transmits Morse SOS + GPS on all frequencies, then enters deep sleep', components: ['esp32', 'sx1262', 'battery', 'led', 'antenna'], power: '+17 dBm', color: 'orange' },
    { mode: 'SEARCH', desc: 'Scans all frequencies sequentially, measuring RSSI on each', components: ['esp32', 'sx1262', 'oled', 'led', 'antenna'], power: 'Rx only', color: 'emerald' },
    { mode: 'CONFIG', desc: 'WiFi captive portal for field configuration without reflashing', components: ['esp32', 'oled', 'tp4056', 'battery'], power: 'WiFi AP', color: 'sky' },
    { mode: 'EMERGENCY', desc: 'Maximum power continuous TX with full payload, no sleep', components: ['esp32', 'sx1262', 'led', 'antenna'], power: '+22 dBm', color: 'rose' }
  ];

  const colorMap = {
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-900/40', text: 'text-orange-600 dark:text-orange-400' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950/20', border: 'border-sky-200 dark:border-sky-900/40', text: 'text-sky-600 dark:text-sky-400' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-900/40', text: 'text-rose-600 dark:text-rose-400' }
  };

  const cards = functions.map((f) => {
    const c = colorMap[f.color];
    const compNames = f.components.map((id) => {
      const comp = COMPONENTS.find((x) => x.id === id);
      return comp ? comp.name.split(' ')[0] : id;
    });
    return `
    <div class="border ${c.border} ${c.bg} rounded-xl p-5 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs font-bold ${c.text}">${f.mode}</span>
        <span class="text-[10px] font-mono text-slate-500">${f.power}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.desc}</p>
      <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <span class="text-[9px] font-mono text-slate-500 uppercase">Components used:</span>
        <div class="flex flex-wrap gap-1 mt-1">
          ${compNames.map((n) => `<span class="px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/20 text-[9px] font-mono text-slate-600 dark:text-slate-400">${n}</span>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');

  return `<section class="space-y-6">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// DEVICE FUNCTIONS</span>
      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">What Each Mode Needs</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">See which components are used in each operating mode.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>
  </section>`;
}

function renderBuilderScript() {
  return `<script>
const COMPONENTS_DATA = ${JSON.stringify(COMPONENTS)};

function recalculate() {
  const checks = document.querySelectorAll('.comp-check');
  let total = 0;
  let count = 0;
  checks.forEach((cb) => {
    const comp = COMPONENTS_DATA.find((c) => c.id === cb.dataset.id);
    const row = document.querySelector('.comp-row[data-id="' + cb.dataset.id + '"]');
    if (cb.checked && comp) {
      total += comp.price * comp.qty;
      count++;
      if (row) row.style.opacity = '1';
    } else if (row) {
      row.style.opacity = '0.4';
    }
  });
  document.getElementById('total-price').textContent = '$' + total.toFixed(2);
  document.getElementById('comp-count').textContent = count;
  document.getElementById('selected-count').textContent = count + ' components selected';
  const diff = count <= 8 ? 'Easy' : count <= 11 ? 'Moderate' : 'Advanced';
  const diffEl = document.getElementById('difficulty');
  diffEl.textContent = diff;
  diffEl.className = 'text-xl font-bold font-mono ' + (diff === 'Easy' ? 'text-emerald-600 dark:text-emerald-400' : diff === 'Moderate' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400');
}

function updateBudget(value) {
  document.getElementById('budget-display').textContent = '$' + parseFloat(value).toFixed(2);
  document.querySelectorAll('.comp-check').forEach((cb) => {
    const price = parseFloat(cb.dataset.price);
    cb.checked = price <= parseFloat(value);
  });
  recalculate();
}

function applyBudgetTier(name) {
  const tiers = {
    'essential': { budget: 23, ids: ['esp32', 'sx1262', 'oled', 'tp4056', 'battery', 'passives', 'enclosure', 'conn_sma', 'conn_header', 'antenna', 'led'] },
    'standard': { budget: 27, ids: ['esp32', 'sx1262', 'oled', 'gps', 'tp4056', 'battery', 'passives', 'enclosure', 'conn_sma', 'conn_header', 'antenna', 'led'] },
    'premium': { budget: 30, ids: COMPONENTS_DATA.map((c) => c.id) }
  };
  const tier = tiers[name] || tiers['standard'];
  document.getElementById('budget-slider').value = tier.budget;
  document.getElementById('budget-display').textContent = '$' + tier.budget.toFixed(2);
  document.querySelectorAll('.comp-check').forEach((cb) => {
    cb.checked = tier.ids.includes(cb.dataset.id);
  });
  recalculate();
}

document.addEventListener('DOMContentLoaded', recalculate);
</script>`;
}

const JSON_LD = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Aegis-Beacon BOM Builder",
  "description": "Interactive bill of materials calculator for the Aegis-Beacon emergency radio system.",
  "url": "https://aegis-beacon.vercel.app/builder"
}`;

export function renderBuilderPage() {
  const content = [
    renderBuilderHeader(),
    renderBudgetSlider(),
    renderBuildSites(),
    renderBudgetSummary(),
    renderComponentTable(),
    renderFunctionBreakdown()
  ].join('\n\n');

  return renderPage({
    
    
    title: 'Aegis-Beacon v5.4 | BOM Builder',
    description: 'Interactive bill of materials calculator for the Aegis-Beacon emergency radio. Calculate costs, source components, and plan your build.',
    canonical: `${SITE_URL}/builder`,
    jsonLd: JSON_LD,
    header: { logoHref: '/', action: 'Wiki', actionHref: '/wiki', subtitle: 'BOM Builder v5.4' },
    tabs: false,
    content,
    scriptSrc: null,
    withIconLinks: true,
    
    extraScripts: renderBuilderScript()
  });
}
