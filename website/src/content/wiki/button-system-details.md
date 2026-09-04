---
title: "Button System Details"
description: "Debounce, hold detection, auto-repeat and the timing constants behind every press"
---

# Button System Details

## Overview

Four buttons drive the whole device. Their behavior - short vs long press, auto-repeat, save-on-hold - is defined by a set of timing constants worth knowing when debugging.

## Button Mapping

| Button | GPIO | Input type |
|--------|------|------------|
| SW_MODE | 33 | INPUT_PULLUP (internal) |
| SW_SEL | 32 | INPUT_PULLUP (internal) |
| SW_UP | 35 | Input-only, external 10k pull-up |
| SW_DN | 34 | Input-only, external 10k pull-up |

## Timing Constants

| Constant | Value | Meaning |
|----------|-------|---------|
| BTN_DEBOUNCE_MS | 50 | Debounce window |
| BTN_LONG_MODE_MS | 2000 | MODE long press (EMERGENCY) |
| BTN_LONG_CFG_MS | 3000 | SEL long press (CONFIG) |
| BTN_FACTORY_MS | 5000 | MODE+SEL at boot (reset) |
| BTN_REPEAT_DELAY_MS | 500 | Delay before auto-repeat |
| BTN_REPEAT_RATE_MS | 150 | Auto-repeat interval |

## Press Actions

| Press | Action |
|-------|--------|
| MODE short | Toggle BEACON/SEARCH |
| MODE long (2 s) | EMERGENCY |
| SEL short | Toggle VOL/WPM target |
| SEL hold (1 s) | Save VOL/WPM to NVS |
| SEL long (3 s) | CONFIG mode |
| UP/DN short | Adjust selected value |
| UP/DN hold | Auto-repeat |

## Wiring Caution

GPIO 34 and 35 are input-only with no internal pull-ups. Without the external 10k pull-up to 3.3 V, the buttons float and presses are unreliable or stuck.

## Related Pages

- [Configuration Reference](/wiki/configuration-reference)
- [Operating Modes](/wiki/operating-modes)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [Troubleshooting](/wiki/troubleshooting)
