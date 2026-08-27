/**
 * Aegis-Beacon -- BOM Builder page, rendered entirely by Node.
 *
 * Interactive bill of materials calculator with component sourcing,
 * budget estimation, and device function breakdown.
 */

import { renderPage, SITE_URL } from './layout.js';

/* ── Component database ───────────────────────────────────────────── */
const COMPONENTS = [
  {
    id: 'esp32',
    name: 'ESP32 DevKit V1',
    category: 'MCU',
    price: 3.00,
    source: 'AliExpress / Amazon',
    url: 'https://www.aliexpress.com/w/wholesale-esp32-devkit-v1.html',
    qty: 1,
    required: true,
    functions: ['Dual-core 240 MHz processing', 'WiFi/BT radio (disabled in beacon)', 'GPIO control for all peripherals', 'Deep sleep at 10 uA', 'ADC for battery monitoring'],
    specs: 'Dual-core Xtensa LX6, 520 KB SRAM, 4 MB Flash, 30-pin DIP'
  },
  {
    id: 'sx1262',
    name: 'Ebyte E22-400M30S',
    category: 'RF Module',
    price: 5.50,
    source: 'AliExpress / Mouser',
    url: 'https://www.aliexpress.com/w/wholesale-e22-400m30s.html',
    qty: 1,
    required: true,
    functions: ['LoRa transceiver at 410-525 MHz', '+30 dBm power amplifier', 'SPI interface to ESP32', 'Integrated SMA connector', '-130 dBm receive sensitivity'],
    specs: 'SX1262-based, +30 dBm PA, 410-525 MHz, SPI, 16-pin header'
  },
  {
    id: 'oled',
    name: 'SSD1309 OLED 2.42"',
    category: 'Display',
    price: 3.50,
    source: 'AliExpress / Amazon',
    url: 'https://www.aliexpress.com/w/wholesale-ssd1309-oled-2-42.html',
    qty: 1,
    required: true,
    functions: ['128x64 monochrome display', 'Shows mode, frequency, status', 'Battery voltage display', 'GPS coordinate display', 'Real-time operational feedback'],
    specs: '128x64 pixels, SW SPI via U8g2, 7-pin header'
  },
  {
    id: 'gps',
    name: 'NEO-6M GPS Module',
    category: 'Navigation',
    price: 4.50,
    source: 'AliExpress / Banggood',
    url: 'https://www.aliexpress.com/w/wholesale-neo-6m-gps.html',
    qty: 1,
    required: false,
    functions: ['Real-time GPS coordinate acquisition', 'NMEA 0183 sentence parsing', 'Embeds coordinates in Morse payload', 'Cold start: 5-15 minutes', 'UART2 at 9600 baud'],
    specs: 'UART2, 9600 baud, NMEA 0183, 4-pin header, optional'
  },
  {
    id: 'tp4056',
    name: 'TP4056 Charger Module',
    category: 'Power',
    price: 0.50,
    source: 'AliExpress / Amazon',
    url: 'https://www.aliexpress.com/w/wholesale-tp4056-usb-c.html',
    qty: 1,
    required: true,
    functions: ['USB-C Li-ion charging', '1A maximum charge current', 'Over-discharge protection', 'Charge status LED indicators', 'Battery voltage monitoring'],
    specs: 'SOT-23-8, USB-C input, 4.2V charge voltage'
  },
  {
    id: 'battery',
    name: '18650 Li-ion Cell',
    category: 'Power',
    price: 1.50,
    source: 'Amazon / Local electronics',
    url: 'https://www.amazon.com/s?k=18650+3000mah',
    qty: 1,
    required: true,
    functions: ['3.7V nominal voltage', '3000 mAh capacity', '~65 hours beacon runtime', 'Spring contact mounting', 'Single cell design'],
    specs: '3.7V, 2600-3500 mAh, 18650 form factor'
  },
  {
    id: 'passives',
    name: 'Passive Components',
    category: 'Passives',
    price: 1.00,
    source: 'Mouser / Digikey / AliExpress',
    url: 'https://www.mouser.com/',
    qty: 1,
    required: true,
    functions: ['100 ohm audio resistor', '10 uF coupling capacitor', 'Voltage divider for ADC', 'Decoupling capacitors', 'Pull-up/pull-down resistors'],
    specs: '0805/0603 SMD, mixed values'
  },
  {
    id: 'enclosure',
    name: 'Hammond 1593L',
    category: 'Enclosure',
    price: 4.00,
    source: 'Mouser / Amazon',
    url: 'https://www.mouser.com/ProductDetail/Hammond-Mfg/1593L?qs=sGAEpiMZZMv0NwlthflBi3Nv63lQnlkR',
    qty: 1,
    required: true,
    functions: ['100x60x25mm aluminum enclosure', 'Splash-resistant design', 'PCB mounting bosses', 'Cutouts for SMA/USB/OLED', 'Protects against EMI'],
    specs: '100 x 60 x 25 mm, aluminum, paintable'
  },
  {
    id: 'conn_sma',
    name: 'SMA Connector',
    category: 'Connectors',
    price: 0.30,
    source: 'AliExpress / Mouser',
    url: 'https://www.aliexpress.com/w/wholesale-sma-connector-pcb.html',
    qty: 1,
    required: true,
    functions: ['50 ohm antenna interface', 'Standard SMA female PCB mount', 'Soldered for mechanical strength', 'Connects to E22 module', 'Antenna swap capability'],
    specs: 'SMA female, PCB mount, 50 ohm'
  },
  {
    id: 'conn_header',
    name: 'Pin Headers',
    category: 'Connectors',
    price: 0.20,
    source: 'AliExpress / Amazon',
    url: 'https://www.aliexpress.com/w/wholesale-pin-headers-2-54mm.html',
    qty: 5,
    required: true,
    functions: ['ESP32 module socket', 'OLED display connection', 'GPS module connection', 'SX1262 module interface', 'Debug/programming header'],
    specs: '2.54mm pitch, male/female, various counts'
  },
  {
    id: 'antenna',
    name: '433 MHz Antenna',
    category: 'Antenna',
    price: 1.50,
    source: 'AliExpress / Amazon',
    url: 'https://www.aliexpress.com/w/wholesale-433mhz-antenna-sma.html',
    qty: 1,
    required: true,
    functions: ['Quarter-wave whip (17.3 cm at 433 MHz)', '50 ohm impedance matched', 'SMA male connector', 'Optimal for 433 MHz ISM band', 'Swappable for other frequencies'],
    specs: '17.3 cm, 433 MHz, SMA male, rubber duck'
  },
  {
    id: 'led',
    name: 'Status LEDs',
    category: 'Indicators',
    price: 0.10,
    source: 'AliExpress / Mouser',
    url: 'https://www.aliexpress.com/w/wholesale-smd-led-0805.html',
    qty: 2,
    required: true,
    functions: ['Red LED: BEACON mode indicator', 'Blue LED: SEARCH mode indicator', 'Visual operational feedback', 'Low-power current draw', 'GPIO 2 and GPIO 4 driven'],
    specs: '0805 SMD, Red + Blue, 20 mA max'
  },
  {
    id: 'jack',
    name: '3.5mm Audio Jack',
    category: 'Audio',
    price: 0.30,
    source: 'AliExpress / Mouser',
    url: 'https://www.aliexpress.com/w/wholesale-3-5mm-jack-pcb.html',
    qty: 1,
    required: false,
    functions: ['Audio output for Morse tone', 'Connects to external speakers', '600 Hz CW tone output', 'Headphone monitoring', 'Optional audio feedback'],
    specs: '3.5mm TRS, PCB mount, stereo'
  }
];

const BUDGET_TIERS = [
  { name: 'Essential', desc: 'Core components only (no GPS, no audio)', filter: (c) => c.required && c.id !== 'gps' && c.id !== 'jack' },
  { name: 'Standard', desc: 'Full build with GPS (recommended)', filter: (c) => c.required },
  { name: 'Premium', desc: 'Full build + spare components', filter: (c) => true }
];

/* ── Renderers ────────────────────────────────────────────────────── */

function renderBuilderHeader() {
  return `<section class="space-y-4">
    <div class="space-y-2">
      <span class="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">// BOM BUILDER</span>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Bill of Materials Calculator</h1>
      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
        Configure your build, see real-time pricing, and get links to source every component. Toggle optional parts to match your budget.
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      ${BUDGET_TIERS.map((t, i) => `
        <button onclick="applyTier('${t.name}')" class="tier-btn px-3 py-1.5 text-[11px] font-mono font-bold rounded-lg border transition-all ${i === 1 ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-orange-500'}">${t.name}</button>
      `).join('')}
    </div>
  </section>`;
}

function renderComponentTable() {
  const rows = COMPONENTS.map((c) => {
    const requiredBadge = c.required
      ? '<span class="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[9px] font-mono font-bold">REQUIRED</span>'
      : '<span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-mono">OPTIONAL</span>';
    const checkedAttr = c.required ? 'checked' : '';
    const rowClass = c.required ? '' : 'opacity-75';

    return `
    <tr class="border-b border-slate-100 dark:border-slate-800 ${rowClass} comp-row" data-id="${c.id}" data-required="${c.required}" data-price="${c.price}">
      <td class="py-3 px-4">
        <div class="flex items-center gap-2">
          <input type="checkbox" class="comp-check accent-orange-500 w-3.5 h-3.5" data-id="${c.id}" ${checkedAttr} onchange="recalculate()">
          <div>
            <span class="text-xs font-bold text-slate-900 dark:text-white">${c.name}</span>
            <span class="ml-2">${requiredBadge}</span>
          </div>
        </div>
      </td>
      <td class="py-3 px-4 text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase">${c.category}</td>
      <td class="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs">${c.specs}</td>
      <td class="py-3 px-4 font-mono text-xs font-bold text-slate-900 dark:text-white">$${c.price.toFixed(2)}</td>
      <td class="py-3 px-4 text-[10px] text-slate-500">${c.qty > 1 ? 'x' + c.qty : ''}</td>
      <td class="py-3 px-4">
        <a href="${c.url}" target="_blank" rel="noopener" class="text-[10px] font-mono text-orange-600 dark:text-orange-400 hover:underline">${c.source}</a>
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
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Specifications</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Price</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Qty</th>
              <th class="py-2.5 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Source</th>
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
    { mode: 'BEACON', desc: 'Transmits Morse SOS + GPS on all frequencies, then enters deep sleep', components: ['esp32', 'sx1262', 'battery', 'led', 'antenna'], power: '+17 dBm' },
    { mode: 'SEARCH', desc: 'Scans all frequencies sequentially, measuring RSSI on each', components: ['esp32', 'sx1262', 'oled', 'led', 'antenna'], power: 'Rx only' },
    { mode: 'CONFIG', desc: 'WiFi captive portal for field configuration without reflashing', components: ['esp32', 'oled', 'tp4056', 'battery'], power: 'WiFi AP' },
    { mode: 'EMERGENCY', desc: 'Maximum power continuous TX with full payload, no sleep', components: ['esp32', 'sx1262', 'led', 'antenna'], power: '+22 dBm' }
  ];

  const cards = functions.map((f) => {
    const compNames = f.components.map((id) => {
      const c = COMPONENTS.find((x) => x.id === id);
      return c ? c.name.split(' ')[0] : id;
    });
    return `
    <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">${f.mode}</span>
        <span class="text-[10px] font-mono text-slate-500">${f.power}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.desc}</p>
      <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <span class="text-[9px] font-mono text-slate-500 uppercase">Components used:</span>
        <div class="flex flex-wrap gap-1 mt-1">
          ${compNames.map((n) => `<span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-mono text-slate-600 dark:text-slate-400">${n}</span>`).join('')}
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

function applyTier(name) {
  const tiers = {
    'Essential': ['esp32', 'sx1262', 'oled', 'tp4056', 'battery', 'passives', 'enclosure', 'conn_sma', 'conn_header', 'antenna', 'led'],
    'Standard': ['esp32', 'sx1262', 'oled', 'gps', 'tp4056', 'battery', 'passives', 'enclosure', 'conn_sma', 'conn_header', 'antenna', 'led'],
    'Premium': COMPONENTS_DATA.map((c) => c.id)
  };
  const ids = tiers[name] || tiers['Standard'];
  document.querySelectorAll('.comp-check').forEach((cb) => {
    cb.checked = ids.includes(cb.dataset.id);
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

export function renderBuilderPage(lang, dict, currentPath = '/') {
  const content = [
    renderBuilderHeader(),
    renderBudgetSummary(),
    renderComponentTable(),
    renderFunctionBreakdown()
  ].join('\n\n');

  return renderPage({
    lang,
    dict,
    title: 'Aegis-Beacon v5.4 | BOM Builder',
    description: 'Interactive bill of materials calculator for the Aegis-Beacon emergency radio. Calculate costs, source components, and plan your build.',
    canonical: `${SITE_URL}/builder`,
    jsonLd: JSON_LD,
    header: { logoHref: '/', action: 'Wiki', actionHref: '/wiki', subtitle: 'BOM Builder v5.4' },
    tabs: false,
    content,
    footer: {
      tagline: 'Aegis Open Source Engineering Network -- BOM Builder v5.4'
    },
    scriptSrc: null,
    withIconLinks: true,
    currentPath,
    extraScripts: renderBuilderScript()
  });
}
