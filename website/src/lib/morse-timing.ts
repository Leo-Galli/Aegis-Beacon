/**
 * Precise PARIS standard Morse timing and interval calculator.
 * Standard: 1 unit = 1200 / WPM ms.
 * Dit = 1 unit ON, Dah = 3 units ON.
 * Intra-character gap = 1 unit OFF.
 * Inter-character gap = 3 units OFF.
 * Inter-word gap = 7 units OFF.
 */

export const MORSE_TABLE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', '/': '-..-.', '-': '-....-', '?': '..--..',
}

export interface MorseInterval {
  startMs: number
  endMs: number
}

export interface MorseTimeline {
  intervals: MorseInterval[]
  totalMs: number
  unitMs: number
}

export const computeMorseTimeline = (text: string, wpm: number): MorseTimeline => {
  const safeWpm = Math.max(5, Math.min(40, wpm))
  const unitMs = Math.round(1200 / safeWpm)
  const intervals: MorseInterval[] = []
  let currentMs = 0
  let prevWasChar = false

  const upper = text.toUpperCase()
  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i]
    if (ch === ' ') {
      currentMs += unitMs * 7
      prevWasChar = false
      continue
    }

    const code = MORSE_TABLE[ch]
    if (!code) continue

    if (prevWasChar) {
      currentMs += unitMs * 3
    }

    for (let j = 0; j < code.length; j++) {
      const sym = code[j]
      const duration = sym === '.' ? unitMs : unitMs * 3
      intervals.push({ startMs: currentMs, endMs: currentMs + duration })
      currentMs += duration
      if (j < code.length - 1) {
        currentMs += unitMs
      }
    }
    prevWasChar = true
  }

  // End of frame pause (3 units)
  currentMs += unitMs * 3

  return {
    intervals,
    totalMs: Math.max(unitMs * 10, currentMs),
    unitMs,
  }
}

export const isMorseCarrierOn = (timeline: MorseTimeline, elapsedMs: number): boolean => {
  if (timeline.intervals.length === 0 || timeline.totalMs === 0) return false
  const t = elapsedMs % timeline.totalMs
  for (let i = 0; i < timeline.intervals.length; i++) {
    const interval = timeline.intervals[i]
    if (t >= interval.startMs && t < interval.endMs) {
      return true
    }
    if (interval.startMs > t) break
  }
  return false
}
