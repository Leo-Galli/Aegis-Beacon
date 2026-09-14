/**
 * Web Audio API synthesizer for the Aegis-Beacon firmware demo.
 * Provides authentic amateur radio CW sidetone (700 Hz with raised cosine envelope),
 * receiver static/atmospheric noise for SEARCH/LISTEN modes, and tactile microswitch clicks.
 * Fully client-side, zero external assets, strictly adhering to no-semicolon formatting.
 */

let audioCtx: AudioContext | null = null
let soundEnabled = false
let cwOsc: OscillatorNode | null = null
let cwGain: GainNode | null = null
let noiseNode: AudioNode | null = null
let noiseGain: GainNode | null = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const isSoundEnabled = () => soundEnabled

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled
  if (soundEnabled) {
    getAudioContext()
  } else {
    stopCwTone()
    stopRadioNoise()
  }
  return soundEnabled
}

export const toggleSound = () => {
  return setSoundEnabled(!soundEnabled)
}

/** Synthesizes a crisp tactile mechanical microswitch click */
export const playKeyClick = (pitch = 1200) => {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = ctx.currentTime

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(pitch, now)
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.035)

  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.04)
}

/** Authentic 700 Hz Morse CW sidetone with smooth 6ms raised envelope (no clicks) */
export const startCwTone = (freq = 700, vol = 0.12) => {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  if (!cwOsc) {
    cwOsc = ctx.createOscillator()
    cwGain = ctx.createGain()
    cwOsc.type = 'sine'
    cwOsc.frequency.setValueAtTime(freq, now)
    cwGain.gain.setValueAtTime(0.0001, now)
    cwOsc.connect(cwGain)
    cwGain.connect(ctx.destination)
    cwOsc.start(now)
  }

  if (cwGain) {
    cwGain.gain.cancelScheduledValues(now)
    cwGain.gain.setValueAtTime(cwGain.gain.value, now)
    cwGain.gain.exponentialRampToValueAtTime(vol, now + 0.006)
  }
}

export const stopCwTone = () => {
  if (!cwGain || !audioCtx) return
  const now = audioCtx.currentTime
  cwGain.gain.cancelScheduledValues(now)
  cwGain.gain.setValueAtTime(cwGain.gain.value, now)
  cwGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008)
}

/** Receiver atmospheric white/pink noise for SEARCH and LISTEN modes */
export const updateRadioNoise = (active: boolean, rssi = -90) => {
  if (!soundEnabled || !active) {
    stopRadioNoise()
    return
  }
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  if (!noiseNode) {
    // Generate 2 seconds of pink/atmospheric noise buffer
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let b0 = 0
    let b1 = 0
    let b2 = 0
    let b3 = 0
    let b4 = 0
    let b5 = 0
    let b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04
      b6 = white * 0.115926
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(950, now)
    filter.Q.setValueAtTime(1.8, now)

    noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.0001, now)

    source.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    source.start(now)
    noiseNode = source
  }

  if (noiseGain) {
    // Calculate noise level inversely proportional to signal strength (squelch effect)
    const normalizedRssi = Math.max(0, Math.min(1, (rssi + 120) / 80))
    const targetGain = Math.max(0.004, (1 - normalizedRssi * 0.85) * 0.035)
    noiseGain.gain.cancelScheduledValues(now)
    noiseGain.gain.setValueAtTime(noiseGain.gain.value, now)
    noiseGain.gain.linearRampToValueAtTime(targetGain, now + 0.1)
  }
}

export const stopRadioNoise = () => {
  if (!noiseGain || !audioCtx) return
  const now = audioCtx.currentTime
  noiseGain.gain.cancelScheduledValues(now)
  noiseGain.gain.setValueAtTime(noiseGain.gain.value, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
}
