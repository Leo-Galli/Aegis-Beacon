export type PressVisual = (el: Element, pressed: boolean) => void

export type HoldProgress = (el: Element, ratio: number) => void

export const bindLongPress = (
  el: Element | null,
  holdMs: number,
  onShort: () => void,
  onLong: () => void,
  pressVisual: PressVisual,
  onHoldProgress?: HoldProgress,
) => {
  if (!el) return

  let downAt = 0
  let longFired = false
  let raf = 0

  const stopHold = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    el.classList.remove('is-holding')
    onHoldProgress?.(el, 0)
  }

  const tick = () => {
    const elapsed = Date.now() - downAt
    const ratio = Math.min(1, elapsed / holdMs)
    onHoldProgress?.(el, ratio)

    if (elapsed >= holdMs && !longFired) {
      longFired = true
      onLong()
      stopHold()
      pressVisual(el, false)
      return
    }

    raf = requestAnimationFrame(tick)
  }

  el.addEventListener('contextmenu', (ev) => ev.preventDefault())

  el.addEventListener('pointerdown', (ev) => {
    const e = ev as PointerEvent
    if (e.button !== 0) return
    e.preventDefault()
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    downAt = Date.now()
    longFired = false
    el.classList.add('is-holding')
    pressVisual(el, true)
    raf = requestAnimationFrame(tick)
  })

  el.addEventListener('pointerup', (ev) => {
    const e = ev as PointerEvent
    const target = e.currentTarget as Element
    if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId)
    stopHold()
    pressVisual(el, false)
    if (!longFired) onShort()
  })

  el.addEventListener('pointercancel', () => {
    stopHold()
    pressVisual(el, false)
  })

  el.addEventListener('lostpointercapture', () => {
    stopHold()
    pressVisual(el, false)
  })
}

export const bindTap = (
  el: Element | null,
  onTap: () => void,
  pressVisual: PressVisual,
) => {
  if (!el) return

  el.addEventListener('pointerdown', (ev) => {
    const e = ev as PointerEvent
    if (e.button !== 0) return
    e.preventDefault()
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    pressVisual(el, true)
  })

  el.addEventListener('pointerup', (ev) => {
    const e = ev as PointerEvent
    const target = e.currentTarget as Element
    if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId)
    pressVisual(el, false)
    onTap()
  })

  el.addEventListener('pointercancel', () => pressVisual(el, false))
}
