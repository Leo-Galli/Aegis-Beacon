export type DemoMode = 'beacon' | 'search' | 'listen' | 'config' | 'emergency'
export type AdjTarget = 'vol' | 'wpm'

export interface DemoState {
  currentMode: DemoMode
  currentFreq: string
  channelIdx: number
  wpm: number
  power: number
  battery: number
  rssi: number
  rssiThreshold: number
  adjTarget: AdjTarget
  vol: number
  adjOverlayUntil: number
  txActive: boolean
  cycleNum: number
  hitCount: number
  scanPass: number
  txProgress: number
  sleepRemain: number
  gpsFix: boolean
  cwText: string
  cwDecoded: number
  rssiHistory: number[]
  tickMs: number
  payload: string
}

export const OLED_LOGICAL_W = 128
export const OLED_LOGICAL_H = 64
export const OLED_SCALE = 4

const W = OLED_LOGICAL_W
const H = OLED_LOGICAL_H
const FG = '#e8eaed'
const BG = '#050608'
const FG_INV = '#050608'
const BG_INV = '#e8eaed'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const setFont = (ctx: CanvasRenderingContext2D, size: number, bold = false) => {
  ctx.font = `${bold ? '700' : '400'} ${size}px "JetBrains Mono", ui-monospace, monospace`
}

const drawHeader = (
  ctx: CanvasRenderingContext2D,
  title: string,
  meta: string,
  invert: boolean,
  antLive = false,
) => {
  ctx.fillStyle = invert ? BG_INV : BG_INV
  ctx.fillRect(0, 0, W, 12)
  ctx.fillStyle = invert ? FG_INV : FG_INV
  setFont(ctx, 6, true)
  ctx.fillText(title, 2, 9)
  if (meta) {
    const mw = ctx.measureText(meta).width
    ctx.fillText(meta, W - mw - 2, 9)
  }
  if (antLive) {
    ctx.strokeStyle = FG_INV
    ctx.beginPath()
    ctx.arc(64, 6, 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(64, 6, 4, 0, Math.PI * 2)
    ctx.stroke()
  }
}

const drawBattery = (ctx: CanvasRenderingContext2D, pct: number, x: number, y: number) => {
  const segs = pct <= 10 ? 1 : pct >= 76 ? 4 : pct >= 51 ? 3 : pct >= 26 ? 2 : 1
  ctx.strokeStyle = FG_INV
  ctx.strokeRect(x, y, 10, 6)
  for (let i = 0; i < 4; i++) {
    const on = i < segs
    ctx.fillStyle = on ? FG_INV : 'transparent'
    if (on) ctx.fillRect(x + 1 + i * 2, y + 1 + (3 - i), 1, 1 + i)
  }
}

const drawTrace = (ctx: CanvasRenderingContext2D, history: number[], y: number, h: number, thr: number) => {
  ctx.strokeStyle = FG
  ctx.strokeRect(0, y, W, h)
  ctx.fillStyle = FG
  for (let i = 0; i < history.length; i++) {
    const v = history[i]
    if (v === 0) continue
    const py = y + h - 1 - Math.round(((clamp(v, -120, -40) + 120) / 80) * (h - 2))
    ctx.fillRect(W - 1 - i, py, 1, 1)
  }
  const tx = Math.round(((clamp(Math.round(((thr + 120) / 80) * 100), 0, 100)) / 100) * (W - 1))
  ctx.fillRect(tx, y, 1, h)
}

const drawBar = (ctx: CanvasRenderingContext2D, pct: number, y: number) => {
  ctx.strokeStyle = FG
  ctx.strokeRect(0, y, W, 7)
  ctx.fillStyle = FG
  ctx.fillRect(1, y + 1, Math.round((pct / 100) * (W - 2)), 5)
}

export const drawOledCanvas = (
  ctx: CanvasRenderingContext2D,
  s: DemoState,
  scale: number = OLED_SCALE,
) => {
  const pw = W * scale
  const ph = H * scale
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.imageSmoothingEnabled = false

  const inv = s.currentMode === 'emergency' && Math.floor(s.tickMs / 500) % 2 === 1
  ctx.fillStyle = inv ? BG_INV : BG
  ctx.fillRect(0, 0, pw, ph)
  ctx.scale(scale, scale)
  ctx.fillStyle = inv ? FG_INV : FG

  const showAdj = s.tickMs < s.adjOverlayUntil

  if (s.currentMode === 'beacon') {
    drawHeader(ctx, 'TX BEACON', `#${s.cycleNum}`, false, s.txActive)
    drawBattery(ctx, s.battery, 112, 2)
    setFont(ctx, 14, true)
    ctx.fillText(s.currentFreq, 0, 28)
    setFont(ctx, 6)
    ctx.fillText('MHz', 98, 28)
    setFont(ctx, 6)
    ctx.fillText(`CH${s.channelIdx + 1}/5 +${s.power}dBm ${s.wpm}WPM`, 0, 37)
    drawBar(ctx, s.txProgress, 44)
    if (s.txActive && Math.floor(s.tickMs / 300) % 2 === 0) {
      ctx.fillStyle = BG_INV
      ctx.fillRect(0, 52, W, 12)
      ctx.fillStyle = FG_INV
      setFont(ctx, 6, true)
      ctx.fillText(s.payload.slice(0, 21), 1, 60)
    } else {
      ctx.fillStyle = inv ? FG_INV : FG
      setFont(ctx, 6)
      ctx.fillText(`GPS:${s.gpsFix ? 'OK' : '--'}  SLP ${s.sleepRemain}s`, 0, 60)
      ctx.strokeRect(101, 52, 27, 10)
      ctx.fillText(s.adjTarget === 'vol' ? 'VOL' : 'WPM', 104, 60)
    }
  } else if (s.currentMode === 'search') {
    drawHeader(ctx, 'RX SEARCH', `HIT:${s.hitCount}`, false)
    drawBattery(ctx, s.battery, 112, 2)
    setFont(ctx, 14, true)
    ctx.fillText(s.currentFreq, 0, 28)
    setFont(ctx, 6)
    ctx.fillText('MHz', 98, 28)
    ctx.fillText(`CH${s.channelIdx + 1}/5  RSSI ${s.rssi}dBm`, 0, 37)
    drawTrace(ctx, s.rssiHistory, 43, 8, s.rssiThreshold)
    const detected = s.rssi >= s.rssiThreshold
    if (detected && Math.floor(s.tickMs / 280) % 2 === 0) {
      const lbl = s.rssi >= -60 ? '** STRONG **' : s.rssi >= -80 ? '* MEDIUM *' : 'WEAK'
      ctx.fillStyle = BG_INV
      ctx.fillRect(0, 52, W, 12)
      ctx.fillStyle = FG_INV
      setFont(ctx, 6, true)
      ctx.fillText(lbl, 8, 60)
    } else if (s.hitCount > 0) {
      setFont(ctx, 6)
      ctx.fillStyle = inv ? FG_INV : FG
      ctx.fillText(`LAST ${s.currentFreq}MHz ${s.rssi}dBm`, 0, 60)
    } else {
      ctx.fillText(`SCAN #${s.scanPass}  THR:${s.rssiThreshold}dBm`, 0, 60)
      ctx.strokeRect(101, 52, 27, 10)
      ctx.fillText(s.adjTarget === 'vol' ? 'VOL' : 'WPM', 104, 60)
    }
  } else if (s.currentMode === 'listen') {
    drawHeader(ctx, 'RX LISTEN', `${s.cwDecoded} CHR`, false, true)
    drawBattery(ctx, s.battery, 112, 2)
    setFont(ctx, 6)
    ctx.fillText(`${s.currentFreq} MHz`, 2, 22)
    drawTrace(ctx, s.rssiHistory, 24, 9, s.rssiThreshold)
    ctx.fillText(`RSSI ${s.rssi}dBm  THR ${s.rssiThreshold}dBm`, 0, 40)
    ctx.beginPath()
    ctx.moveTo(0, 43)
    ctx.lineTo(W, 43)
    ctx.stroke()
    const start = s.cwText.length > 42 ? s.cwText.length - 42 : 0
    const slice = s.cwText.slice(start)
    setFont(ctx, 6, true)
    ctx.fillText(slice.slice(0, 21) || '...', 1, 52)
    if (slice.length > 21) ctx.fillText(slice.slice(21, 42), 1, 62)
  } else if (s.currentMode === 'config') {
    drawHeader(ctx, 'CONFIGURATION MODE', '', false)
    ctx.strokeRect(2, 13, 124, 19)
    setFont(ctx, 6)
    ctx.fillText('WIFI AP:', 6, 22)
    ctx.fillText('AegisBeacon', 48, 22)
    ctx.fillText('URL: http://192.168.4.1', 6, 30)
    ctx.beginPath()
    ctx.moveTo(0, 35)
    ctx.lineTo(W, 35)
    ctx.stroke()
    ctx.strokeRect(2, 38, 4, 4)
    ctx.fillText('Connect to WiFi network', 10, 42)
    ctx.strokeRect(2, 46, 4, 4)
    ctx.fillText('Open your browser', 10, 50)
    ctx.strokeRect(2, 54, 4, 4)
    ctx.fillText('Go to the URL above', 10, 58)
  } else {
    if (inv) {
      ctx.fillStyle = BG_INV
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = FG_INV
    } else {
      ctx.strokeRect(0, 0, W, H)
      ctx.strokeRect(2, 2, 124, 60)
    }
    setFont(ctx, 18, true)
    ctx.fillText('SOS', 14, 22)
    ctx.beginPath()
    ctx.moveTo(4, 35)
    ctx.lineTo(124, 35)
    ctx.stroke()
    setFont(ctx, 6, true)
    ctx.fillText('EMERGENCY BEACON TX', 4, 44)
    setFont(ctx, 6)
    ctx.fillText(`${s.currentFreq} MHz  +22dBm`, 4, 52)
    ctx.fillText(s.gpsFix ? '46.4983  11.3558' : `CYCLE #${s.cycleNum}  NO GPS`, 4, 60)
  }

  if (showAdj && s.currentMode !== 'config' && s.currentMode !== 'emergency') {
    ctx.fillStyle = BG_INV
    ctx.fillRect(0, H - 12, W, 12)
    ctx.fillStyle = FG_INV
    setFont(ctx, 6, true)
    const label = s.adjTarget === 'vol' ? 'VOL' : 'WPM'
    const val = s.adjTarget === 'vol' ? String(s.vol) : String(s.wpm)
    ctx.fillText(`${label} ${val}`, 4, H - 4)
  }

}

export const OLED_W = OLED_LOGICAL_W * OLED_SCALE
export const OLED_H = OLED_LOGICAL_H * OLED_SCALE
