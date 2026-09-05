---
title: OLED Panel Life
description: How long OLED panels last, the burn-in risk, and the firmware's screen management that keeps the display alive for years.
---

# OLED Panel Life

OLEDs age: the organic material degrades with use, and burn-in is real. This page is the honest life expectancy and the firmware's screen-management tricks.

## The numbers

| Usage | Life expectation |
| --- | --- |
| Continuous full-brightness | 10,000 - 20,000 hours |
| Typical beacon use (screen on minutes per day) | Effectively the device's whole life |
| Static image 24/7 | Burn-in within a year |

At a few minutes of screen-on per day, the beacon's OLED outlives the battery and most of the electronics. Burn-in is only a risk if the display stays on with a static image, which the firmware deliberately avoids.

## The firmware's screen management

| Practice | Effect |
| --- | --- |
| Screen off during deep sleep | The display draws nothing between bursts (see [Firmware Deep Sleep](firmware-deep-sleep)) |
| Screen timeout in idle | The display blanks after a minute of no input |
| Position-shifting status lines | No static pixels accumulate |
| Dimmed idle mode | Less brightness, less aging, less battery |

## The burn-in look

Burn-in appears as a faint ghost of the old screen: the SOS header, the frequency readout. It is cosmetic for a beacon (the pixels still work), and it is avoided by the practices above.

## The winter note

OLEDs work in the cold far better than LCDs: no backlight to slow down, instant response. The display is one of the winter-friendliest parts of the build (see [Winter Operations](winter-operations)).

## Related pages

- [OLED Panel Specs](oled-panel-specs) for the hardware
- [Firmware OLED Rendering](firmware-oled-rendering) for the driver
- [Operating Modes OLED](operating-modes-oled) for the screens