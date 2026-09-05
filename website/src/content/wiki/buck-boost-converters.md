---
title: Buck-Boost Converters
description: How switching regulators turn the battery voltage into a clean 3.3 V, and why the beacon uses a regulator rather than a direct feed.
---

# Buck-Boost Converters

The ESP32 runs on 3.3 V. An 18650 runs from 4.2 V down to 2.8 V. Something must bridge that gap, and that something is a voltage regulator.

## The three options

| Regulator | Voltage range | Efficiency | Noise |
| --- | --- | --- | --- |
| Linear (LDO) | Vin > Vout only | 50 - 85% | Clean |
| Buck (step-down) | Vin > Vout | 85 - 95% | Switched |
| Buck-boost | Any Vin | 80 - 92% | Switched |

A linear regulator burns the difference as heat: at 3.7 V in and 120 mA out, it wastes about 15% of the battery as heat. A buck recovers most of that. The beacon boards with a proper regulator use a buck or buck-boost; the cheap clone boards use an LDO (see [ESP32 Board Guide](esp32-board-guide)).

## Why not feed 3.3 V directly

Some builders power the ESP32's 3.3 V pin from a lithium cell through a diode. This works until the cell sags under the TX burst, the ESP32 browns out and resets, and the beacon silently stops transmitting. The regulator's job is to hold 3.3 V steady while the input swings from 4.2 V to 2.8 V.

## Reading the efficiency table

Efficiency numbers matter at the margins. A buck at 90% turns a 50 mA average draw into 55.6 mA from the cell: a 10% runtime penalty. A linear at 75% costs 33%. On a multi-day mission this is the difference between day three and day four.

## Ripple and the radio

Switching regulators emit ripple and switching noise. The SX1262 is sensitive to supply noise on its PA. The fix is capacitor decoupling at the radio's power pin (100 nF plus 10 uF) and keeping the switch node away from the antenna feed.

## Related pages

- [Alternate Power Inputs](alternate-power-inputs) for supply options
- [ESP32 Power Input](esp32-power-input) for the board's regulator
- [RF Interference and Noise](rf-interference-and-noise) for the noise side