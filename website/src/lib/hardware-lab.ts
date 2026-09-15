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

export interface LabPart {
  id: LabPartId
  name: string
  subtitle: string
  x: number
  y: number
  w: number
  h: number
}

export const LAB_PARTS: LabPart[] = [
  { id: 'esp32', name: 'ESP32 DevKit', subtitle: 'Dual-core MCU + WiFi', x: 108, y: 268, w: 118, h: 72 },
  { id: 'e22', name: 'E22-400M30S', subtitle: 'SX1262 LoRa +30 dBm PA', x: 268, y: 108, w: 92, h: 58 },
  { id: 'oled', name: 'SSD1309 OLED', subtitle: '2.42 in SPI 128x64', x: 108, y: 72, w: 118, h: 52 },
  { id: 'gps', name: 'NEO-6M GPS', subtitle: 'UART fix + PPS', x: 392, y: 88, w: 88, h: 58 },
  { id: 'tp4056', name: 'TP4056', subtitle: 'USB-C Li-ion charge', x: 512, y: 288, w: 78, h: 52 },
  { id: 'battery', name: '18650 cell', subtitle: '3.7 V protected pack', x: 512, y: 388, w: 96, h: 44 },
  { id: 'switches', name: 'Tactile keys', subtitle: 'MODE SEL UP DN', x: 268, y: 368, w: 108, h: 48 },
  { id: 'antenna', name: '433 MHz whip', subtitle: 'SMA quarter-wave', x: 628, y: 72, w: 48, h: 120 },
  { id: 'buzzer', name: 'Piezo buzzer', subtitle: 'Morse sidetone', x: 392, y: 368, w: 56, h: 48 },
  { id: 'power-switch', name: 'Power slide', subtitle: 'Hard disconnect', x: 48, y: 188, w: 28, h: 56 },
]

export const LAB_LINKS: { from: LabPartId; to: LabPartId; label: string }[] = [
  { from: 'battery', to: 'tp4056', label: '3.7 V' },
  { from: 'tp4056', to: 'esp32', label: '5 V / 3V3 rail' },
  { from: 'esp32', to: 'e22', label: 'SPI + DIO' },
  { from: 'esp32', to: 'oled', label: 'SPI display' },
  { from: 'esp32', to: 'gps', label: 'UART2' },
  { from: 'esp32', to: 'switches', label: 'GPIO keys' },
  { from: 'esp32', to: 'buzzer', label: 'PWM audio' },
  { from: 'e22', to: 'antenna', label: 'RF SMA' },
  { from: 'power-switch', to: 'tp4056', label: 'Vbat in' },
]

export const LAB_PRESETS: { id: string; label: string; parts: LabPartId[] }[] = [
  { id: 'core', label: 'MCU core', parts: ['esp32', 'power-switch', 'tp4056', 'battery'] },
  { id: 'radio', label: 'Radio chain', parts: ['esp32', 'e22', 'antenna'] },
  { id: 'ui', label: 'Operator UI', parts: ['esp32', 'oled', 'switches', 'buzzer'] },
  { id: 'full', label: 'Full beacon', parts: LAB_PARTS.map((p) => p.id) },
]

const cx = (p: LabPart) => p.x + p.w / 2
const cy = (p: LabPart) => p.y + p.h / 2

export const linkPath = (from: LabPart, to: LabPart): string => {
  const x1 = cx(from)
  const y1 = cy(from)
  const x2 = cx(to)
  const y2 = cy(to)
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

export const partSvgInner = (id: LabPartId): string => {
  switch (id) {
    case 'esp32':
      return `<rect x="0" y="0" width="118" height="72" rx="4" fill="#1e262e" stroke="#5a6878" stroke-width="1.2"/>
        <rect x="6" y="6" width="106" height="60" rx="2" fill="#12181f"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#9aa8b8">ESP32-WROOM</text>
        <text x="10" y="30" font-family="JetBrains Mono, monospace" font-size="6" fill="#6a7888">USB · 3V3 · EN</text>
        <g fill="#c8923a"><circle cx="14" cy="44" r="2"/><circle cx="22" cy="44" r="2"/><circle cx="30" cy="44" r="2"/></g>
        <rect x="82" y="48" width="26" height="14" rx="1" fill="#242c34" stroke="#485664"/>`
    case 'e22':
      return `<rect x="0" y="0" width="92" height="58" rx="3" fill="#151b22" stroke="#c8923a" stroke-width="1"/>
        <text x="6" y="14" font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" fill="#e8c878">E22-400M30S</text>
        <text x="6" y="24" font-family="JetBrains Mono, monospace" font-size="5.5" fill="#8a98a8">SX1262 + PA</text>
        <rect x="6" y="30" width="80" height="22" rx="2" fill="#0a0e12" stroke="#3a4652"/>
        <circle cx="78" cy="10" r="4" fill="#d4aa37" stroke="#7a5810" stroke-width="0.5"/>`
    case 'oled':
      return `<rect x="0" y="0" width="118" height="52" rx="3" fill="#0a0c0e" stroke="#3a444e" stroke-width="1"/>
        <rect x="4" y="4" width="110" height="40" rx="2" fill="#000"/>
        <text x="8" y="16" font-family="JetBrains Mono, monospace" font-size="7" fill="#6ee7a0">AEGIS BEACON</text>
        <text x="8" y="28" font-family="JetBrains Mono, monospace" font-size="6" fill="#3ecf6a">433.500 MHz</text>
        <text x="8" y="38" font-family="JetBrains Mono, monospace" font-size="5" fill="#2a8f52">SSD1309 SPI</text>`
    case 'gps':
      return `<rect x="0" y="0" width="88" height="58" rx="3" fill="#1a2229" stroke="#4a5562"/>
        <text x="6" y="14" font-family="JetBrains Mono, monospace" font-size="7" font-weight="700" fill="#9aa8b8">NEO-6M</text>
        <circle cx="44" cy="34" r="12" fill="#0f1419" stroke="#3a4652"/>
        <path d="M44 26 L48 38 L40 32 L48 32 L40 38 Z" fill="#0088ff" opacity="0.85"/>`
    case 'tp4056':
      return `<rect x="0" y="0" width="78" height="52" rx="2" fill="#1b2420" stroke="#3ecf6a" stroke-width="0.9"/>
        <text x="5" y="12" font-family="JetBrains Mono, monospace" font-size="6" fill="#6ee7a0">TP4056</text>
        <rect x="22" y="22" width="34" height="10" rx="2" fill="#0a0c0e" stroke="#2a323a"/>
        <text x="26" y="30" font-family="JetBrains Mono, monospace" font-size="5" fill="#c8923a">USB-C</text>`
    case 'battery':
      return `<rect x="0" y="0" width="96" height="44" rx="8" fill="#0f1914" stroke="#2d4837" stroke-width="1.2"/>
        <rect x="96" y="14" width="4" height="16" rx="1" fill="#2d4837"/>
        <text x="10" y="18" font-family="JetBrains Mono, monospace" font-size="7" fill="#3ecf6a">18650</text>
        <text x="10" y="30" font-family="JetBrains Mono, monospace" font-size="6" fill="#2a8f52">3000 mAh</text>`
    case 'switches':
      return `<g fill="#1a2027" stroke="#3a444e" stroke-width="0.8">
        <rect x="0" y="0" width="22" height="22" rx="3"/><rect x="28" y="0" width="22" height="22" rx="3"/>
        <rect x="56" y="0" width="22" height="22" rx="3"/><rect x="84" y="0" width="22" height="22" rx="3"/>
      </g>
      <text x="0" y="40" font-family="JetBrains Mono, monospace" font-size="5" fill="#8a98a8">MODE SEL UP DN</text>`
    case 'antenna':
      return `<rect x="18" y="88" width="12" height="32" rx="2" fill="#d4aa37" stroke="#7a5810"/>
        <rect x="14" y="72" width="20" height="16" rx="2" fill="#2a323a" stroke="#4a5562"/>
        <rect x="16" y="8" width="16" height="64" rx="4" fill="#1a2027" stroke="#3a444e"/>
        <g fill="#14181c"><rect x="18" y="14" width="12" height="3" rx="0.5"/><rect x="18" y="22" width="12" height="3" rx="0.5"/><rect x="18" y="30" width="12" height="3" rx="0.5"/></g>`
    case 'buzzer':
      return `<circle cx="28" cy="24" r="22" fill="#1a2027" stroke="#4a5562" stroke-width="1"/>
        <circle cx="28" cy="24" r="14" fill="#12181f" stroke="#c8923a" stroke-width="0.8"/>
        <text x="8" y="46" font-family="JetBrains Mono, monospace" font-size="5" fill="#8a98a8">PIEZO</text>`
    case 'power-switch':
      return `<rect x="4" y="0" width="20" height="56" rx="3" fill="#161b21" stroke="#3a444e"/>
        <rect x="7" y="28" width="14" height="22" rx="2" fill="#5a6470"/>
        <text x="6" y="52" font-family="JetBrains Mono, monospace" font-size="5" fill="#6a7888">0</text>
        <text x="6" y="12" font-family="JetBrains Mono, monospace" font-size="5" fill="#ff5722">I</text>`
    default:
      return ''
  }
}
