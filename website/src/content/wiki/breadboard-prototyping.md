---
title: "Breadboard Prototyping"
description: "Bring the whole beacon up on a breadboard first: power, radio, OLED and GPS before soldering"
---

# Breadboard Prototyping

## Overview

Before soldering the final build, bring every subsystem up on a breadboard. An hour on the bench saves an evening of desoldering, and RF problems are far easier to chase with clip leads than with a glued enclosure.

## Power First

1. Wire the ESP32 DevKit V1 and confirm the serial monitor speaks at 115200.
2. Add the TP4056 and 18650; confirm the battery reads ~3.7-4.2 V at BAT+.
3. Confirm the 3.3 V rail reads 3.30 V and stays stable when the radio transmits.

## Subsystem Bring-Up Order

| Step | What to verify | Symptom if wrong |
|------|----------------|------------------|
| 1 | Serial console boots clean | No `[ERROR]`, heap ~290 kB |
| 2 | OLED header + battery icon | Blank panel = wiring or 4-pin I2C mistake |
| 3 | Buttons | `[BTN ]` lines appear in the log |
| 4 | Radio init | Hang = BUSY pin not on GPIO 21 |
| 5 | Audio | Tone comes out of the jack in SEARCH mode |
| 6 | GPS (if fitted) | `[GPS ] Fix acquired` outdoors |
| 7 | First TX | Progress bar + serial TX log |

## Breadboard vs Final Build

| Concern | Breadboard | Final |
|---------|------------|-------|
| RF ground | Noisy, long leads | Short, direct ground |
| Antenna | Keep the SMA at the edge | Exits the enclosure |
| GPS patch | Near the radio = no fix | Moved away per placement rules |

> [!WARNING]
> RF results on a breadboard are indicative, not final. Expect the soldered build to transmit and receive better because the ground planes and lead lengths improve.

## Tips

- Use short jumper wires for SPI and the radio bus.
- Keep the SMA side of the E22 module hanging off the board edge.
- Add 100 nF decoupling near the ESP32 and the radio module.
- Do not run the breadboard on USB power alone for TX tests; use the cell.

## Related Pages

- [Assembly Guide](/wiki/assembly-guide)
- [Soldering Basics](/wiki/soldering-basics)
- [GPIO Pin Map](/wiki/gpio-pin-mapping)
- [First Use](/wiki/first-use)
