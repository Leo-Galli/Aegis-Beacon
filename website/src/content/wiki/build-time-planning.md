---
title: Build Time Planning
description: Realistic time estimates per stage, what takes long, and how to parallelise ordering with building.
---

# Build Time Planning

A realistic plan keeps the build fun instead of frustrating. The stages below assume a first build with modest soldering experience and no special tooling beyond an iron, solder and a multimeter.

## Time per stage

| Stage | First build | Second build |
|-------|-------------|--------------|
| Sourcing parts and waiting for delivery | 2-10 days (shipping dominates) | Same |
| Bench setup and tool check | 30-60 min | 10 min |
| Power path (TP4056, divider, cell holder) | 45-90 min | 25 min |
| Display (OLED software SPI) | 30-60 min | 15 min |
| Radio (E22 module, VSPI) | 45-90 min | 25 min |
| Controls and LEDs | 30-60 min | 20 min |
| Audio path | 20-40 min | 15 min |
| GPS module | 20-40 min | 15 min |
| Enclosure and final fit | 1-3 h | 45-90 min |
| Bench test pass (all gates) | 1-2 h | 30-60 min |

Total for a first build: roughly 6-10 hours of bench time spread over the days while parts arrive. A second build with parts on hand is 3-4 hours.

## Where the time actually goes

1. **Waiting for parts** dominates the calendar, not the bench. Order the long-lead items (E22 module, OLED, GPS from Asia) first, and bench items locally.
2. **The enclosure** is the single longest bench stage. Print or prepare it while the board is being tested, not after.
3. **Debugging** is the unpredictable cost. The quality gates exist to convert unpredictable debugging into a predictable five-minute check at each stage. See [Build Quality Gates](/wiki/build-quality-gates).

## Parallelise ordering with building

- Order 1: E22 module, OLED, GPS, ESP32 (longest lead times).
- Order 2 (while order 1 ships): TP4056, cell holder, buttons, LEDs, passives, enclosure.
- Bench starts the day order 1 arrives; by then order 2 is on the bench.

The [BOM Builder](/builder) tracks quantities and totals, and its phased purchase order is designed around exactly this ordering logic.

## Planning for a field deployment

If the beacon is for a specific trip, add two safety buffers:

- One week of margin after the last expected delivery date.
- A full two-beacon bench test and one outdoor range test before the trip. See [Two-Beacon Bench Test](/wiki/two-beacon-bench-test) and [Outdoor Testing Guide](/wiki/outdoor-testing).

## Related pages

- [Effective Build Strategy](/wiki/effective-build-strategy)
- [Sourcing Parts](/wiki/sourcing-parts)
- [Shopping List](/wiki/shopping-list)