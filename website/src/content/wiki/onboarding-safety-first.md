---
title: Safety First
description: "The non-negotiable safety rules for building and operating the beacon: battery handling, RF exposure, soldering and field use."
---

# Safety First

None of these rules are optional. The beacon is a Li-ion powered radio transmitter; both the battery and the antenna deserve respect.

## Battery safety

- Only use **protected** 18650 cells with a built-in protection circuit (DW01A or equivalent).
- Never pierce, crush, or short a Li-ion cell. A shorted cell can vent or catch fire.
- Charge only with the TP4056 module (or another proper Li-ion charger). Never charge with a raw USB cable and no charger.
- Store cells at 3.6-3.8 V if the beacon will sit unused for months.
- If a cell is swollen, hot, or smells odd, stop using it immediately and dispose of it at a battery recycling point.

## RF exposure

- The antenna radiates while transmitting. Keep the antenna away from your eyes and head.
- During bench tests, either use a dummy load instead of an antenna, or keep the antenna pointed away from people.
- The beacon transmits at +17 dBm typical (+22 dBm in emergency), which is safe at arm's length but should not be held against the body while transmitting.

## Soldering safety

- Work in a ventilated area. Solder fumes are not something to breathe in.
- A hot soldering iron can burn through skin instantly; use a stand and never leave it powered unattended.
- Wash your hands after handling solder; most solders contain lead or rosin.

## Field safety

- A rescue beacon is an aid, not a substitute for training, proper gear, and good judgment.
- Always tell someone where you are going and when you expect to return.
- The beacon does not summon rescue by itself: it only transmits your position. A search must be started by someone who knows you are missing.