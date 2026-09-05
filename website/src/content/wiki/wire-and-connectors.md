---
title: Wire and Connectors
description: Wire gauge, jumper types, and the connectors used across the beacon build.
---

# Wire and Connectors

The beacon is small, so the wiring choices matter more than they look.

## Wire gauge

- **Power wires** (BAT+, GND): 22-24 AWG. The radio PA bursts can draw 100+ mA; thin wire drops voltage under load.
- **Signal wires** (SPI, UART, buttons): 24-28 AWG is fine; the currents are microamps.
- **Antenna feed**: the E22 uses SMA; the internal antenna wire (17.3 cm) needs no connector.

## Common wire types

- **Solid core 22 AWG**: great for breadboards, snaps into headers cleanly.
- **Stranded 24 AWG**: flexible for enclosure routing, needs tinning or ferrules.
- **Silicone-insulated** wire: survives soldering heat and stays flexible in cold weather; worth it for field builds.

## Connectors used

| Connector | Where |
|-----------|-------|
| SMA (E22) | Radio to external antenna |
| USB-C (TP4056) | Charging input |
| 3.5 mm TRRS | Audio out |
| Pin headers (2.54 mm) | ESP32, OLED, GPS module breaks |
| Dupont / JST-XH (optional) | Battery and sensor connections |

## Recommended wiring approach

1. Pre-cut and strip all wires before soldering.
2. Tin the wire ends.
3. Use heat shrink over every soldered joint that could touch a neighbor.
4. Keep power and signal wires separated where they run parallel.

## The internal antenna wire

The 17.3 cm quarter-wave wire attaches directly to the SMA center pin (or a short pigtail). Route it away from the OLED and the ESP32's antenna area to reduce detuning.

## A trap to avoid

Running the GPS antenna wire (or the patch) next to the radio's SMA feed can desensitize the GPS. Keep at least 1-2 cm of separation, and orient the GPS patch away from the radio antenna.