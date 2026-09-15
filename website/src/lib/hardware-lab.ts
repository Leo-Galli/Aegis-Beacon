export type LabPartId =
  | 'esp32'
  | 'e22'
  | 'oled'
  | 'gps'
  | 'tp4056'
  | 'battery'
  | 'switches'
  | 'antenna'
  | 'buzzer'
  | 'power-switch'

export type LabLinkKind = 'power' | 'data' | 'rf'

export interface LabPart {
  id: LabPartId
  name: string
  subtitle: string
  category: 'mcu' | 'radio' | 'power' | 'ui' | 'gps'
  zone: string
  detail: string
  pins: string
  x: number
  y: number
  w: number
  h: number
}

export interface LabLink {
  from: LabPartId
  to: LabPartId
  label: string
  kind: LabLinkKind
  fromAnchor: [number, number]
  toAnchor: [number, number]
}

export const LAB_PARTS: LabPart[] = [
  {
    id: 'esp32',
    name: 'ESP32 DevKit V1',
    subtitle: 'Dual-core MCU + WiFi/BT',
    category: 'mcu',
    zone: 'MCU island',
    detail: 'Runs Aegis firmware v6: Morse engine, mode state machine, CONFIG captive portal and USB serial bridge.',
    pins: 'SPI → radio/OLED · UART2 → GPS · GPIO → keys/buzzer',
    x: 108,
    y: 268,
    w: 118,
    h: 72,
  },
  {
    id: 'e22',
    name: 'E22-400M30S',
    subtitle: 'SX1262 LoRa +30 dBm PA',
    category: 'radio',
    zone: 'RF front-end',
    detail: 'Sub-GHz transceiver with external PA. Controlled over SPI; DIO1 for RX/TX events.',
    pins: 'NSS 5 · MOSI 23 · MISO 19 · SCK 18 · BUSY 4 · DIO1 26',
    x: 268,
    y: 108,
    w: 92,
    h: 58,
  },
  {
    id: 'oled',
    name: 'SSD1309 OLED',
    subtitle: '2.42 in SPI 128×64',
    category: 'ui',
    zone: 'Operator display',
    detail: 'White-on-black tactical UI: mode screens, RSSI strip, CONFIG hints and LISTEN decode line.',
    pins: 'Shared SPI · DC 16 · RST 17 · CS display 15',
    x: 108,
    y: 72,
    w: 118,
    h: 52,
  },
  {
    id: 'gps',
    name: 'NEO-6M GPS',
    subtitle: 'UART fix + optional PPS',
    category: 'gps',
    zone: 'Navigation',
    detail: 'Optional module for coordinates in SOS payload. Hot-start assist stored in ESP32 RTC RAM.',
    pins: 'RX 27 · TX 14 · 3V3 · EN (optional)',
    x: 392,
    y: 88,
    w: 88,
    h: 58,
  },
  {
    id: 'tp4056',
    name: 'TP4056 charger',
    subtitle: 'USB-C Li-ion charge',
    category: 'power',
    zone: 'Power management',
    detail: 'Charges the 18650 from USB-C while the ESP32 can remain assembled on the bench.',
    pins: 'B+ / B− to cell · OUT+ to 3V3 LDO / 5V path',
    x: 512,
    y: 288,
    w: 78,
    h: 52,
  },
  {
    id: 'battery',
    name: '18650 cell',
    subtitle: '3.7 V protected pack',
    category: 'power',
    zone: 'Energy store',
    detail: '3000 mAh typical. Firmware reads divider on GPIO 36 for fuel gauge on OLED.',
    pins: 'Through slide switch to TP4056 B+/B−',
    x: 512,
    y: 388,
    w: 96,
    h: 44,
  },
  {
    id: 'switches',
    name: 'Tactile keypad',
    subtitle: 'MODE · SEL · UP · DN',
    category: 'ui',
    zone: 'Front panel',
    detail: 'MODE short toggles BEACON/SEARCH; hold 2 s SOS. SEL adjusts WPM/VOL; hold 3 s CONFIG.',
    pins: 'GPIO 32 · 33 · 25 · 13 (with pull-ups)',
    x: 268,
    y: 368,
    w: 108,
    h: 48,
  },
  {
    id: 'antenna',
    name: '433 MHz whip',
    subtitle: 'SMA quarter-wave',
    category: 'radio',
    zone: 'Antenna port',
    detail: 'Never transmit without a load. Quarter-wave stub tuned for beacon band.',
    pins: 'SMA from E22 RF port · keep coax short',
    x: 628,
    y: 72,
    w: 48,
    h: 120,
  },
  {
    id: 'buzzer',
    name: 'Piezo buzzer',
    subtitle: 'Morse sidetone',
    category: 'ui',
    zone: 'Audio out',
    detail: 'Passive buzzer driven by LEDC PWM for key clicks and CW sidetone in SEARCH/LISTEN.',
    pins: 'GPIO 21 · optional series resistor',
    x: 392,
    y: 368,
    w: 56,
    h: 48,
  },
  {
    id: 'power-switch',
    name: 'Slide switch',
    subtitle: 'Hard power disconnect',
    category: 'power',
    zone: 'Safety interlock',
    detail: 'Cuts Vbat before the charger output. Matches the 0/I slide on the device shell mock.',
    pins: 'In series with cell + terminal',
    x: 48,
    y: 188,
    w: 28,
    h: 56,
  },
]

export const LAB_LINKS: LabLink[] = [
  { from: 'battery', to: 'tp4056', label: '3.7 V', kind: 'power', fromAnchor: [0, 0.5], toAnchor: [1, 0.5] },
  { from: 'tp4056', to: 'esp32', label: '3V3 rail', kind: 'power', fromAnchor: [0, 0.35], toAnchor: [1, 0.55] },
  { from: 'power-switch', to: 'tp4056', label: 'Vbat in', kind: 'power', fromAnchor: [1, 0.5], toAnchor: [0.5, 1] },
  { from: 'esp32', to: 'e22', label: 'SPI + DIO', kind: 'data', fromAnchor: [1, 0.35], toAnchor: [0, 0.55] },
  { from: 'esp32', to: 'oled', label: 'SPI display', kind: 'data', fromAnchor: [0.5, 0], toAnchor: [0.5, 1] },
  { from: 'esp32', to: 'gps', label: 'UART2', kind: 'data', fromAnchor: [1, 0.45], toAnchor: [0, 0.5] },
  { from: 'esp32', to: 'switches', label: 'GPIO keys', kind: 'data', fromAnchor: [0.5, 1], toAnchor: [0.5, 0] },
  { from: 'esp32', to: 'buzzer', label: 'PWM audio', kind: 'data', fromAnchor: [1, 0.75], toAnchor: [0, 0.5] },
  { from: 'e22', to: 'antenna', label: 'RF SMA', kind: 'rf', fromAnchor: [1, 0.15], toAnchor: [0, 0.55] },
]

export const LAB_PRESETS: { id: string; label: string; desc: string; parts: LabPartId[] }[] = [
  { id: 'core', label: 'MCU core', desc: 'Power path + ESP32', parts: ['power-switch', 'battery', 'tp4056', 'esp32'] },
  { id: 'radio', label: 'Radio chain', desc: 'LoRa TX/RX path', parts: ['esp32', 'e22', 'antenna'] },
  { id: 'ui', label: 'Operator UI', desc: 'Display + keys + audio', parts: ['esp32', 'oled', 'switches', 'buzzer'] },
  { id: 'nav', label: 'GPS add-on', desc: 'Position in payload', parts: ['esp32', 'gps', 'oled'] },
  { id: 'full', label: 'Full beacon', desc: 'Complete stack', parts: LAB_PARTS.map((p) => p.id) },
]

export const LAB_STEPS: { id: string; title: string; hint: string; parts: LabPartId[] }[] = [
  { id: 's1', title: '1 · Safety & power', hint: 'Mount switch, cell and charger first.', parts: ['power-switch', 'battery', 'tp4056'] },
  { id: 's2', title: '2 · MCU', hint: 'Add the ESP32 once power is routed.', parts: ['esp32'] },
  { id: 's3', title: '3 · Radio', hint: 'Connect LoRa module and antenna last on RF.', parts: ['e22', 'antenna'] },
  { id: 's4', title: '4 · Operator UI', hint: 'Display, keys and buzzer for field use.', parts: ['oled', 'switches', 'buzzer'] },
  { id: 's5', title: '5 · GPS (optional)', hint: 'NEO-6M for coordinate payloads.', parts: ['gps'] },
]

const anchor = (p: LabPart, ax: number, ay: number) => ({
  x: p.x + p.w * ax,
  y: p.y + p.h * ay,
})

export const linkPath = (from: LabPart, to: LabPart, link: LabLink): string => {
  const [fax, fay] = link.fromAnchor
  const [tax, tay] = link.toAnchor
  const a = anchor(from, fax, fay)
  const b = anchor(to, tax, tay)
  const dx = Math.abs(b.x - a.x)
  const bend = Math.min(80, Math.max(28, dx * 0.45))
  const c1x = a.x + (b.x > a.x ? bend : -bend)
  const c2x = b.x + (b.x > a.x ? -bend : bend)
  return `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`
}

export const partByIdMap = () => new Map(LAB_PARTS.map((p) => [p.id, p]))

export const partSvgInner = (id: LabPartId, _variant: 'bench' | 'thumb' = 'bench'): string => {
  switch (id) {
    case 'esp32':
      return `<rect x="0" y="0" width="118" height="72" rx="4" fill="#1e262e" stroke="#5a6878" stroke-width="1.2"/>
        <rect x="6" y="6" width="106" height="60" rx="2" fill="#12181f" stroke="#2a3540"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#9aa8b8">ESP32-WROOM</text>
        <text x="10" y="30" font-family="JetBrains Mono, monospace" font-size="6" fill="#6a7888">USB · EN · 3V3</text>
        <g fill="#c8923a"><rect x="8" y="38" width="4" height="4" rx="0.5"/><rect x="16" y="38" width="4" height="4" rx="0.5"/><rect x="24" y="38" width="4" height="4" rx="0.5"/></g>
        <rect x="78" y="46" width="32" height="18" rx="1.5" fill="#242c34" stroke="#485664"/>
        <text x="82" y="58" font-family="JetBrains Mono, monospace" font-size="5" fill="#788898">WiFi</text>`
    case 'e22':
      return `<rect x="0" y="0" width="92" height="58" rx="3" fill="#151b22" stroke="#c8923a" stroke-width="1"/>
        <text x="6" y="14" font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" fill="#e8c878">E22-400M30S</text>
        <text x="6" y="24" font-family="JetBrains Mono, monospace" font-size="5.5" fill="#8a98a8">SX1262 + PA</text>
        <rect x="6" y="30" width="80" height="22" rx="2" fill="#0a0e12" stroke="#3a4652"/>
        <circle cx="78" cy="10" r="4" fill="#d4aa37" stroke="#7a5810" stroke-width="0.5"/>
        <text x="10" y="44" font-family="JetBrains Mono, monospace" font-size="4.5" fill="#6a7888">433 MHz</text>`
    case 'oled':
      return `<rect x="0" y="0" width="118" height="52" rx="3" fill="#0a0c0e" stroke="#3a444e" stroke-width="1"/>
        <rect x="4" y="4" width="110" height="40" rx="2" fill="#000" stroke="#1a242e"/>
        <text x="8" y="16" font-family="JetBrains Mono, monospace" font-size="7" fill="#6ee7a0">AEGIS BEACON</text>
        <text x="8" y="28" font-family="JetBrains Mono, monospace" font-size="6" fill="#3ecf6a">433.500 MHz</text>
        <text x="8" y="38" font-family="JetBrains Mono, monospace" font-size="5" fill="#2a8f52">SSD1309 · SPI</text>
        <rect x="98" y="6" width="12" height="6" rx="1" fill="#1a2027" stroke="#3a444e"/>`
    case 'gps':
      return `<rect x="0" y="0" width="88" height="58" rx="3" fill="#1a2229" stroke="#4a5562"/>
        <text x="6" y="14" font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" fill="#9aa8b8">NEO-6M</text>
        <circle cx="44" cy="34" r="12" fill="#0f1419" stroke="#3a4652"/>
        <path d="M44 26 L48 38 L40 32 L48 32 L40 38 Z" fill="#0088ff" opacity="0.85"/>
        <text x="6" y="54" font-family="JetBrains Mono, monospace" font-size="4.5" fill="#6a7888">UART 9600</text>`
    case 'tp4056':
      return `<rect x="0" y="0" width="78" height="52" rx="2" fill="#1b2420" stroke="#3ecf6a" stroke-width="0.9"/>
        <text x="5" y="12" font-family="JetBrains Mono, monospace" font-size="6" fill="#6ee7a0">TP4056</text>
        <rect x="22" y="22" width="34" height="10" rx="2" fill="#0a0c0e" stroke="#2a323a"/>
        <text x="26" y="30" font-family="JetBrains Mono, monospace" font-size="5" fill="#c8923a">USB-C</text>
        <circle cx="12" cy="40" r="2" fill="#3ecf6a"/><circle cx="66" cy="40" r="2" fill="#ff5722"/>`
    case 'battery':
      return `<rect x="0" y="0" width="96" height="44" rx="8" fill="#0f1914" stroke="#2d4837" stroke-width="1.2"/>
        <rect x="96" y="14" width="4" height="16" rx="1" fill="#2d4837"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="7" fill="#3ecf6a">18650</text>
        <text x="10" y="30" font-family="JetBrains Mono, monospace" font-size="6" fill="#2a8f52">3000 mAh</text>
        <rect x="12" y="34" width="72" height="4" rx="2" fill="#1a3024"/><rect x="12" y="34" width="52" height="4" rx="2" fill="#3ecf6a" opacity="0.7"/>`
    case 'switches':
      return `<g fill="#1a2027" stroke="#3a444e" stroke-width="0.8">
        <rect x="0" y="0" width="22" height="22" rx="3"/><rect x="28" y="0" width="22" height="22" rx="3"/>
        <rect x="56" y="0" width="22" height="22" rx="3"/><rect x="84" y="0" width="22" height="22" rx="3"/>
      </g>
      <text x="2" y="14" font-family="JetBrains Mono, monospace" font-size="4" fill="#8a98a8">M</text>
      <text x="30" y="14" font-family="JetBrains Mono, monospace" font-size="4" fill="#8a98a8">S</text>
      <text x="62" y="14" font-family="JetBrains Mono, monospace" font-size="4" fill="#8a98a8">+</text>
      <text x="90" y="14" font-family="JetBrains Mono, monospace" font-size="4" fill="#8a98a8">-</text>
      <text x="0" y="40" font-family="JetBrains Mono, monospace" font-size="5" fill="#8a98a8">MODE SEL UP DN</text>`
    case 'antenna':
      return `<rect x="18" y="88" width="12" height="32" rx="2" fill="#d4aa37" stroke="#7a5810"/>
        <rect x="14" y="72" width="20" height="16" rx="2" fill="#2a323a" stroke="#4a5562"/>
        <rect x="16" y="8" width="16" height="64" rx="4" fill="#1a2027" stroke="#3a444e"/>
        <g fill="#14181c"><rect x="18" y="14" width="12" height="3" rx="0.5"/><rect x="18" y="22" width="12" height="3" rx="0.5"/><rect x="18" y="30" width="12" height="3" rx="0.5"/><rect x="18" y="38" width="12" height="3" rx="0.5"/></g>`
    case 'buzzer':
      return `<circle cx="28" cy="24" r="22" fill="#1a2027" stroke="#4a5562" stroke-width="1"/>
        <circle cx="28" cy="24" r="14" fill="#12181f" stroke="#c8923a" stroke-width="0.8"/>
        <circle cx="28" cy="24" r="6" fill="#0a0e12" stroke="#3a444e"/>
        <text x="8" y="46" font-family="JetBrains Mono, monospace" font-size="5" fill="#8a98a8">PIEZO</text>`
    case 'power-switch':
      return `<rect x="4" y="0" width="20" height="56" rx="3" fill="#161b21" stroke="#3a444e"/>
        <rect x="7" y="6" width="14" height="22" rx="2" fill="#ff5722" opacity="0.9"/>
        <rect x="7" y="30" width="14" height="20" rx="2" fill="#5a6470"/>
        <text x="6" y="54" font-family="JetBrains Mono, monospace" font-size="5" fill="#6a7888">0</text>
        <text x="6" y="12" font-family="JetBrains Mono, monospace" font-size="5" fill="#ff5722">I</text>`
    default:
      return ''
  }
}

export const ghostSlotSvg = (p: LabPart): string =>
  `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="4" class="hw-lab-ghost" data-ghost="${p.id}"/>
   <text x="${p.x + 6}" y="${p.y + 12}" class="hw-lab-ghost-label">${p.zone}</text>`
