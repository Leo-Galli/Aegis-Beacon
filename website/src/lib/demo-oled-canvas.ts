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
const FG = '#ffffff'
const BG = '#000000'
const FG_DIM = '#8e96a0'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const setFont = (ctx: CanvasRenderingContext2D, size: number, bold = false) => {
  ctx.font = `${bold ? '700' : '500'} ${size}px "JetBrains Mono", ui-monospace, monospace`
}

/** Draws antenna icon with radio broadcast arcs */
const drawAntennaIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, radiating = false) => {
  ctx.strokeStyle = FG
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x + 3, y + 8)
  ctx.lineTo(x + 3, y + 2)
  ctx.moveTo(x + 1, y)
  ctx.lineTo(x + 5, y)
  ctx.stroke()

  if (radiating) {
    ctx.beginPath()
    ctx.arc(x + 3, y + 1, 3, -0.8 * Math.PI, -0.2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 3, y + 1, 6, -0.8 * Math.PI, -0.2 * Math.PI)
    ctx.stroke()
  }
}

/** Draws battery meter with voltage readout and discrete level bars */
const drawBattery = (ctx: CanvasRenderingContext2D, pct: number, x: number, y: number) => {
  ctx.strokeStyle = FG
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, 14, 7)
  ctx.fillRect(x + 14, y + 2, 1.5, 3)

  const bars = pct <= 15 ? 1 : pct <= 40 ? 2 : pct <= 70 ? 3 : 4
  for (let i = 0; i < 4; i++) {
    if (i < bars) {
      ctx.fillStyle = FG
      ctx.fillRect(x + 2 + i * 3, y + 2, 2, 3)
    }
  }
}

/** Draws the top telemetry status bar */
const drawHeader = (
  ctx: CanvasRenderingContext2D,
  title: string,
  meta: string,
  radiating = false,
  batteryPct = 85
) => {
  drawAntennaIcon(ctx, 2, 1, radiating)
  setFont(ctx, 6, true)
  ctx.fillStyle = FG
  ctx.fillText(title, 14, 8)

  if (meta) {
    setFont(ctx, 6, false)
    ctx.fillStyle = FG_DIM
    ctx.fillText(meta, 60, 8)
  }

  drawBattery(ctx, batteryPct, W - 17, 1)

  ctx.strokeStyle = '#222830'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 11.5)
  ctx.lineTo(W, 11.5)
  ctx.stroke()
}

/** Draws large centered frequency with MHz unit */
const drawLargeFreq = (ctx: CanvasRenderingContext2D, freq: string, baseline = 27) => {
  setFont(ctx, 15, true)
  const freqW = ctx.measureText(freq).width
  setFont(ctx, 6, false)
  const unitW = ctx.measureText('MHz').width
  const gap = 3
  const startX = Math.max(0, Math.round((W - freqW - gap - unitW) / 2))

  setFont(ctx, 15, true)
  ctx.fillStyle = FG
  ctx.fillText(freq, startX, baseline)
  setFont(ctx, 6, false)
  ctx.fillStyle = FG_DIM
  ctx.fillText('MHz', startX + freqW + gap, baseline)
}

/** Draws the RF signal strength trace / waterfall */
const drawTrace = (ctx: CanvasRenderingContext2D, history: number[], y: number, h: number, thr: number) => {
  ctx.fillStyle = '#080c10'
  ctx.fillRect(0, y, W, h)
  ctx.strokeStyle = '#1e242c'
  ctx.strokeRect(0, y, W, h)

  ctx.fillStyle = FG
  for (let i = 0; i < history.length; i++) {
    const val = history[i]
    if (val === 0) continue
    const py = y + h - 1 - Math.round(((clamp(val, -120, -40) + 120) / 80) * (h - 2))
    ctx.fillRect(W - 1 - i, py, 1, 1)
  }

  const thrX = Math.round(((clamp(Math.round(((thr + 120) / 80) * 100), 0, 100)) / 100) * (W - 1))
  ctx.fillStyle = '#404c5a'
  ctx.fillRect(thrX, y, 1, h)
}

/** Draws transmission progress bar */
const drawBar = (ctx: CanvasRenderingContext2D, pct: number, y: number) => {
  ctx.strokeStyle = '#2e3844'
  ctx.strokeRect(0, y, W, 6)
  ctx.fillStyle = FG
  const fillWidth = Math.round((clamp(pct, 0, 100) / 100) * (W - 2))
  if (fillWidth > 0) {
    ctx.fillRect(1, y + 1, fillWidth, 4)
  }
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

  // Deep pitch black background
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, pw, ph)
  ctx.scale(scale, scale)

  const showAdj = s.tickMs < s.adjOverlayUntil

  if (s.currentMode === 'beacon') {
    drawHeader(ctx, 'BEACON', `CH${s.channelIdx + 1}/5`, s.txActive, s.battery)
    drawLargeFreq(ctx, s.currentFreq, 26)

    // Sub-telemetry line
    setFont(ctx, 6, false)
    ctx.fillStyle = FG_DIM
    const subInfo = `PWR +${s.power}dBm   CW ${s.wpm}WPM`
    const subW = ctx.measureText(subInfo).width
    ctx.fillText(subInfo, Math.max(0, (W - subW) / 2), 36)

    // Progress bar for payload transmission
    drawBar(ctx, s.txProgress, 41)

    // Bottom telemetry
    if (s.txActive && Math.floor(s.tickMs / 300) % 2 === 0) {
      // Inverted ticker banner during live transmission
      ctx.fillStyle = FG
      ctx.fillRect(0, 50, W, 14)
      ctx.fillStyle = BG
      setFont(ctx, 6, true)
      ctx.fillText(`TX > ${s.payload.slice(0, 20)}`, 2, 59)
    } else {
      setFont(ctx, 6, false)
      ctx.fillStyle = FG
      ctx.fillText(`GPS: ${s.gpsFix ? '3D FIX (8)' : 'SEARCHING'}`, 1, 59)

      ctx.fillStyle = FG_DIM
      ctx.fillText(`SLP ${s.sleepRemain}s`, 88, 59)
    }
  } else if (s.currentMode === 'search') {
    drawHeader(ctx, 'SEARCH', `HITS:${s.hitCount}`, false, s.battery)
    drawLargeFreq(ctx, s.currentFreq, 25)

    setFont(ctx, 6, false)
    ctx.fillStyle = FG_DIM
    const info = `SCAN #${s.scanPass}  RSSI ${s.rssi}dBm`
    ctx.fillText(info, Math.max(0, (W - ctx.measureText(info).width) / 2), 35)

    drawTrace(ctx, s.rssiHistory, 39, 10, s.rssiThreshold)

    const detected = s.rssi >= s.rssiThreshold
    setFont(ctx, 6, true)
    if (detected && Math.floor(s.tickMs / 250) % 2 === 0) {
      ctx.fillStyle = FG
      ctx.fillRect(0, 51, W, 13)
      ctx.fillStyle = BG
      const level = s.rssi >= -60 ? '** CARRIER DETECTED **' : '* SIGNAL FOUND *'
      ctx.fillText(level, 6, 60)
    } else {
      ctx.fillStyle = FG
      ctx.fillText(`THR: ${s.rssiThreshold}dBm  LAST: ${s.currentFreq}M`, 1, 60)
    }
  } else if (s.currentMode === 'listen') {
    drawHeader(ctx, 'LISTEN', `${s.cwDecoded} CHR`, true, s.battery)
    drawLargeFreq(ctx, s.currentFreq, 23)
    drawTrace(ctx, s.rssiHistory, 26, 8, s.rssiThreshold)

    setFont(ctx, 6, false)
    ctx.fillStyle = FG_DIM
    const linf = `RSSI ${s.rssi}dBm | CW DECODER`
    ctx.fillText(linf, Math.max(0, (W - ctx.measureText(linf).width) / 2), 38)

    ctx.strokeStyle = '#222830'
    ctx.beginPath()
    ctx.moveTo(0, 41)
    ctx.lineTo(W, 41)
    ctx.stroke()

    // Live decoded text stream
    const start = s.cwText.length > 40 ? s.cwText.length - 40 : 0
    const slice = s.cwText.slice(start)
    setFont(ctx, 6, true)
    ctx.fillStyle = FG
    ctx.fillText(slice.slice(0, 20) || 'LISTENING FOR CW...', 2, 50)
    if (slice.length > 20) {
      ctx.fillText(slice.slice(20, 40), 2, 60)
    }
  } else if (s.currentMode === 'config') {
    drawHeader(ctx, 'CONFIG PORTAL', 'AP ACTIVE', false, s.battery)
    ctx.strokeStyle = '#222830'
    ctx.strokeRect(2, 14, 124, 20)

    setFont(ctx, 6, true)
    ctx.fillStyle = FG
    ctx.fillText('SSID: AEGIS-SETUP', 6, 23)
    setFont(ctx, 6, false)
    ctx.fillStyle = FG_DIM
    ctx.fillText('IP: http://192.168.4.1', 6, 31)

    ctx.fillStyle = FG
    ctx.fillText('1. Connect to WiFi access point', 4, 43)
    ctx.fillText('2. Open browser to configure', 4, 52)
    ctx.fillText('3. Hold SEL 3s to exit', 4, 61)
  } else {
    // EMERGENCY SOS mode - matched with banner.png aesthetic!
    const flash = Math.floor(s.tickMs / 400) % 2 === 0

    if (flash) {
      ctx.strokeStyle = FG
      ctx.lineWidth = 1
      ctx.strokeRect(1, 1, W - 2, H - 2)
      ctx.strokeRect(3, 3, W - 6, H - 6)
    }

    drawAntennaIcon(ctx, 5, 5, true)
    drawBattery(ctx, s.battery, W - 18, 5)

    // Centered large SOS
    setFont(ctx, 19, true)
    ctx.fillStyle = FG
    const sosW = ctx.measureText('SOS').width
    ctx.fillText('SOS', (W - sosW) / 2, 23)

    // SEARCH & RESCUE line (matching banner.png)
    setFont(ctx, 6, true)
    ctx.fillStyle = FG
    const sar = 'SEARCH & RESCUE'
    const sarW = ctx.measureText(sar).width
    ctx.fillText(sar, (W - sarW) / 2, 32)

    ctx.strokeStyle = '#333d48'
    ctx.beginPath()
    ctx.moveTo(12, 35)
    ctx.lineTo(W - 12, 35)
    ctx.stroke()

    // GPS coordinates (matching banner.png format)
    setFont(ctx, 6, false)
    ctx.fillStyle = FG
    const coords = s.gpsFix ? '46.4983 N   11.3558 E' : 'GPS ACQUIRING...'
    const coordsW = ctx.measureText(coords).width
    ctx.fillText(coords, (W - coordsW) / 2, 45)

    // Emergency telemetry
    setFont(ctx, 6, false)
    ctx.fillStyle = FG_DIM
    const emergInfo = `TX +22dBm  ${s.currentFreq}MHz  #${s.cycleNum}`
    const emergW = ctx.measureText(emergInfo).width
    ctx.fillText(emergInfo, (W - emergW) / 2, 57)
  }

  // Parameter adjustment overlay badge
  if (showAdj && s.currentMode !== 'config' && s.currentMode !== 'emergency') {
    ctx.fillStyle = FG
    ctx.fillRect(0, H - 12, W, 12)
    ctx.fillStyle = BG
    setFont(ctx, 6, true)
    const label = s.adjTarget === 'vol' ? 'VOL' : 'WPM'
    const val = s.adjTarget === 'vol' ? `${s.vol}%` : `${s.wpm} WPM`
    ctx.fillText(`ADJUST: ${label} = ${val}`, 4, H - 3)
  }
}

export const OLED_W = OLED_LOGICAL_W * OLED_SCALE
export const OLED_H = OLED_LOGICAL_H * OLED_SCALE
