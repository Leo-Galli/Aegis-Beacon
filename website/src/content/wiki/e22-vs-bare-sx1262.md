---
title: E22 vs Bare SX1262
description: Why the E22-400M30S module is recommended over a bare SX1262 breakout, and when a bare module makes sense.
---

# E22 vs Bare SX1262

The beacon can use an E22-400M30S module or a bare SX1262 breakout. The E22 is the recommended path; this page explains why.

## The E22-400M30S advantages

- **Power amplifier built in**: +30 dBm (1 W) output stage, vs +22 dBm max on the bare SX1262. Real-world range benefit on the same antenna.
- **SMA connector**: a proper antenna interface, no soldering a wire to a pad.
- **TCXO on board**: a temperature-compensated oscillator, so frequency drift stays tiny across temperature. Bare SX1262 breakouts often ship with a plain XO that drifts more.
- **No RF design work**: the matching network and PA are done. A bare SX1262 needs a correct matching circuit to radiate well.
- **TXEN/RXEN handled internally**: the E22 switches its PA/LNA automatically; with a bare module you manage the RF switch yourself.

## The bare SX1262 case

A bare SX1262 breakout (or a module like the E22-900M30S for 915 MHz regions) makes sense when:

- You are constrained by size or cost (bare modules can be a dollar cheaper).
- You need a frequency outside 410-525 MHz.
- You want to do custom RF design (e.g. a PCB-integrated antenna).
- You already own the parts.

## What changes in firmware

The firmware is written against RadioLib with the SX1262 driver, so both hardware options use the same code. The only difference is the achievable TX power: the beacon exposes -9 to +22 dBm regardless, and the E22's PA amplifies beyond that when the external stage is driven.

## The honest recommendation

For a first build, use the E22-400M30S. The SMA antenna connection and onboard PA remove the two hardest parts of RF hardware: getting a matching network right and attaching an antenna reliably.