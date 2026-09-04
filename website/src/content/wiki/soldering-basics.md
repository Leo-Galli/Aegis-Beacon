---
title: "Soldering Basics"
description: "Tools, technique and joints for the Aegis-Beacon build: modules, wire and the SMA feed"
---

# Soldering Basics

## Overview

The Aegis-Beacon is a through-hole and pigtail build - no surface-mount work is strictly required beyond what comes pre-soldered on the modules. A few reliable joints are all the electronics need.

## Minimum Tools

| Tool | Purpose |
|------|---------|
| Soldering iron, 30-40 W with fine tip | General joints |
| Leaded solder (63/37 or 60/40) | Easiest to work with, lower melting point |
| Flux pen or paste | Clean, fast wetting on oxidised pads |
| Helping hands or a small vise | Hold modules and wire |
| Desoldering wick | Fix mistakes |
| Multimeter | Verify every joint |

## Technique

1. Tin the iron tip, then clean it on a damp sponge.
2. Heat the pad AND the wire together for 1-2 s.
3. Feed solder into the joint, not onto the iron.
4. Remove the iron and hold still until the solder freezes.
5. A good joint is shiny and cone-shaped; a dull, balled joint is cold.

## Joint Checklist

| Check | How |
|-------|-----|
| Continuity | Multimeter beep pad-to-pad |
| No bridges | Inspect between adjacent pins under light |
| Insulation | No stray whiskers of solder across tracks |
| Mechanical | A gentle tug does not move the wire |

## Project-Specific Joints

- **Module pins:** solder headers onto the ESP32 and the OLED first, then wire between headers. Removable and reworkable.
- **E22 module:** it has castellated pads. Tin each pad, then tack the wires one at a time. Do not overheat - 2-3 s per pad max.
- **18650 holder:** use heavy 20-22 AWG wire; the cell can draw an amp while charging.
- **Audio and SMA:** the SMA on the E22 is mechanical; never strain the solder joints by bending the cable at the connector.

## Rework Rules

| Symptom | Fix |
|---------|-----|
| Cold joint (dull, cracked) | Reheat with flux, add a touch of solder |
| Bridge between pins | Wick it away, then re-solder cleanly |
| Pad lifted | Stop; use an adjacent pad or a bodge wire |

## Related Pages

- [Assembly Guide](/wiki/assembly-guide)
- [Breadboard Prototyping](/wiki/breadboard-prototyping)
- [Circuit Description](/wiki/circuit-description)
- [Wiring and Connectors](/wiki/wiring-and-connectors)
