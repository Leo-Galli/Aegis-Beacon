import type { DemoMode } from './demo-oled-canvas'

export type BridgeTuiSnapshot = {
  connected: boolean
  mode: DemoMode
  freqMhz: number
  rssi: number
  payload: string
  cwChar?: string
  startedAtMs: number
  nowMs: number
}

const LOG_MAX = 16
const TRACK_MAX = 4

const parseCoords = (payload: string): { lat: number; lng: number; label: string } | null => {
  const m = payload.match(/(\d+\.\d+)N\s+(\d+\.\d+)E/i)
  if (!m) return null
  const lat = parseFloat(m[1])
  const lng = parseFloat(m[2])
  return { lat, lng, label: `${lat.toFixed(4)}N, ${lng.toFixed(4)}E` }
}

const modeDeviceLabel = (mode: DemoMode, freq: number, rssi: number): string => {
  const f = freq.toFixed(3)
  if (mode === 'listen') return `LISTEN · ${f} MHz · CW decode · RSSI ${rssi} dBm`
  if (mode === 'search') return `SEARCH · ${f} MHz · RSSI scan · ${rssi} dBm`
  if (mode === 'config') return `CONFIG · WiFi portal 192.168.4.1`
  if (mode === 'emergency') return `EMERGENCY · ${f} MHz · SOS TX`
  return `BEACON · ${f} MHz · Morse TX`
}

const formatClock = (nowMs: number): string => {
  const d = new Date(nowMs)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const formatUptime = (startedAtMs: number, nowMs: number): string => {
  const s = Math.max(0, Math.floor((nowMs - startedAtMs) / 1000))
  return `uptime ${s}s`
}

const classifyLogLine = (line: string): string => {
  if (line.startsWith('AEGIS:CW:')) return 'cw'
  if (line.startsWith('AEGIS:MODE:') || line.startsWith('AEGIS:OK:')) return 'ok'
  if (line.startsWith('AEGIS:')) return 'aegis'
  if (line.startsWith('[device]')) return 'device'
  if (line.startsWith('[bridge]')) return 'bridge'
  if (line.startsWith('[serial]')) return 'serial'
  if (line.startsWith('>')) return 'cmd'
  return 'plain'
}

export const getBridgeTuiRoot = (id: string): HTMLElement | null =>
  document.getElementById(id)

export const resetBridgeTuiLogs = (root: HTMLElement | null) => {
  if (!root) return
  const log = root.querySelector('[data-bridge-log]')
  if (log) log.innerHTML = ''
  const track = root.querySelector('[data-bridge-track]')
  if (track) track.innerHTML = ''
}

export const appendBridgeLog = (root: HTMLElement | null, line: string) => {
  if (!root) return
  const log = root.querySelector('[data-bridge-log]')
  if (!log) return
  const row = document.createElement('div')
  row.className = `demo-bridge-tui__log-line demo-bridge-tui__log-line--${classifyLogLine(line)}`
  row.textContent = line
  log.appendChild(row)
  while (log.childElementCount > LOG_MAX) {
    log.firstElementChild?.remove()
  }
  log.scrollTop = log.scrollHeight
}

const pushTrackFix = (root: HTMLElement, label: string, time: string) => {
  const wrap = root.querySelector('[data-bridge-track-wrap]')
  const list = root.querySelector('[data-bridge-track]')
  if (!wrap || !list) return
  wrap.removeAttribute('hidden')
  const li = document.createElement('li')
  li.className = 'demo-bridge-tui__track-item'
  li.textContent = `${time}  ${label}`
  list.appendChild(li)
  while (list.childElementCount > TRACK_MAX) {
    list.firstElementChild?.remove()
  }
}

export const renderBridgeTui = (root: HTMLElement | null, snap: BridgeTuiSnapshot) => {
  if (!root) return

  const clock = root.querySelector('[data-bridge-clock]')
  const uptime = root.querySelector('[data-bridge-uptime]')
  const device = root.querySelector('[data-bridge-device]')
  const position = root.querySelector('[data-bridge-position]')
  const share = root.querySelector('[data-bridge-share]')
  const page = root.querySelector('[data-bridge-page]')
  const modePill = root.querySelector('[data-bridge-mode-pill]')
  const rssiEl = root.querySelector('[data-bridge-rssi]')
  const cwPanel = root.querySelector('[data-bridge-cw-panel]')
  const cwLine = root.querySelector('[data-bridge-cw-line]')
  const connLed = root.querySelector('[data-bridge-conn-led]')

  if (clock) clock.textContent = formatClock(snap.nowMs)
  if (uptime) uptime.textContent = formatUptime(snap.startedAtMs, snap.nowMs)

  root.dataset.bridgeConnected = snap.connected ? '1' : '0'
  connLed?.classList.toggle('is-live', snap.connected)

  if (device) {
    device.textContent = snap.connected
      ? `COM3 @ 115200 baud (connected)`
      : 'waiting for USB device...'
  }

  const coords = parseCoords(snap.payload)
  if (position) {
    position.textContent = coords?.label ?? 'no position received yet'
  }
  if (share) {
    share.textContent = coords
      ? `report-position?lat=${coords.lat.toFixed(4)}&lng=${coords.lng.toFixed(4)}`
      : '(public link appears on first fix)'
  }
  if (page) {
    page.textContent = snap.connected
      ? snap.mode === 'listen'
        ? 'bench · streaming CW decode'
        : 'demo bench (simulation)'
      : 'not detected'
  }
  if (modePill) {
    modePill.textContent = snap.mode.toUpperCase()
    modePill.setAttribute('data-mode', snap.mode)
  }

  root.dataset.bridgeMode = snap.mode

  const showRssi = snap.connected && (snap.mode === 'listen' || snap.mode === 'search')
  if (rssiEl) {
    if (showRssi) {
      rssiEl.removeAttribute('hidden')
      rssiEl.textContent = `${snap.rssi} dBm`
    } else {
      rssiEl.setAttribute('hidden', '')
    }
  }

  const statusHint = root.querySelector('[data-bridge-status-hint]')
  if (statusHint) {
    statusHint.textContent = snap.connected
      ? modeDeviceLabel(snap.mode, snap.freqMhz, snap.rssi)
      : 'Run python bridge/aegis-serial-bridge.py --tui'
  }

  const listenCw = snap.mode === 'listen' && snap.connected
  if (cwPanel) {
    if (listenCw) cwPanel.removeAttribute('hidden')
    else cwPanel.setAttribute('hidden', '')
  }
  if (cwLine && snap.cwChar !== undefined) {
    cwLine.textContent = `AEGIS:CW:${snap.cwChar === ' ' ? 'SP' : snap.cwChar}`
  }

  if (coords && snap.connected && root.dataset.bridgeTrackSeed !== coords.label) {
    root.dataset.bridgeTrackSeed = coords.label
    pushTrackFix(root, coords.label, formatClock(snap.nowMs))
  }
}

export const seedBridgeListenSession = (root: HTMLElement | null) => {
  resetBridgeTuiLogs(root)
  if (root) delete root.dataset.bridgeTrackSeed
  appendBridgeLog(root, '[bridge] loopback server on http://127.0.0.1:8765/')
  appendBridgeLog(root, '[bridge] connected to COM3 @ 115200 baud')
  appendBridgeLog(root, '[device] AEGIS:HELLO:ver=6.0;mode=BEACON;freq=433.500;wpm=13;vol=64')
  appendBridgeLog(root, '[device] firmware handshake received')
  appendBridgeLog(root, '[bridge] -> device: MODE LISTEN')
  appendBridgeLog(root, '[device] AEGIS:MODE:LISTEN')
  appendBridgeLog(root, '[bridge] LISTEN active · forwarding AEGIS:CW to terminal')
}

export const updateBridgeCwLine = (root: HTMLElement | null, ch: string) => {
  if (!root) return
  const line = root.querySelector('[data-bridge-cw-line]')
  const display = ch === ' ' ? 'SP' : ch
  if (line) line.textContent = `AEGIS:CW:${display}`
}
