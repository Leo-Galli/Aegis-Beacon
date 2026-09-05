---
title: The Button System in Firmware
description: How presses, holds, debounce, and auto-repeat work inside the firmware, with the timing constants.
---

# The Button System in Firmware

Four buttons drive the entire interaction. The firmware turns raw presses into mode switches, parameter edits, and config entry.

## The hardware mapping

| Button | GPIO | Pull | Action |
|--------|------|------|--------|
| MODE | 33 | Internal | Short: mode toggle. Long 2 s: EMERGENCY |
| SEL | 32 | Internal | Short: VOL/WPM target. Long 3 s: CONFIG |
| UP | 35 | External 10 k | Increment |
| DN | 34 | External 10 k | Decrement |

## Debounce

Mechanical switches bounce for 1-5 ms. The firmware samples each pin on a timer (typically every 10-20 ms) and requires a stable reading for 30-50 ms before registering a press. This kills bounce without extra hardware.

## Press vs hold

The firmware tracks press duration:

- **Short press** (< 2 s): primary action (toggle mode, toggle target).
- **Long press** (≥ 2 s for MODE, ≥ 3 s for SEL): secondary action (EMERGENCY, CONFIG).
- **Hold 1 s** (SEL): save VOL/WPM to NVS.
- **Both at boot 5 s** (MODE+SEL): factory reset.

## Auto-repeat

Holding UP or DN repeats the increment:

- Initial delay: 500 ms.
- Repeat rate: every 150 ms.
- Volume steps: +10 per repeat. WPM steps: +1.

## During TX

The buttons are interrupt-driven: an ISR sets a flag on the rising edge, and the main loop processes it between symbols. This is what makes the mid-TX abort responsive even while the radio is keyed.

## The adjustment overlay

After UP/DN changes a value, the OLED shows a bottom-bar overlay with the live value for 2.5 s, then hides it. The target (VOL or WPM) is shown in the corner of the main screen.

## Saving

Adjustments apply live in RAM. To persist: hold SEL for 1 s. Without a save, a reboot restores the old NVS values. This is deliberate: a mis-click should not be permanent.

## Edge cases

- Both MODE and SEL pressed at boot: factory reset path (checked in setup).
- A stuck button (held by the case): the firmware sees a permanent press; the long-press actions trigger. Check the case fit if the beacon enters CONFIG or EMERGENCY by itself.