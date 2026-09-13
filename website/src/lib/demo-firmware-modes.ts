import type { DemoMode } from './demo-oled-canvas'

/** Real firmware v6.0 MODE short-press behaviour. */
export const modeShortPressNext = (current: DemoMode): DemoMode => {
  if (current === 'beacon') return 'search'
  if (current === 'search') return 'beacon'
  return 'beacon'
}

export const MODE_HOLD_MS = 2000
export const SEL_HOLD_MS = 3000
