---
title: "Morse Timing and Audio Sync"
description: "How the 600 Hz click stream tracks the RF keying and why timing is to PARIS standard"
---

# Morse Timing and Audio Sync

## Overview

During BEACON transmission the DAC emits a 600 Hz click stream synchronized with the RF carrier keying. Hearing the clicks lets you monitor the transmission without a radio - if the clicks match the payload rhythm, the RF keying is matching too.

## The Two Signals

| Signal | Path | What it is |
|--------|------|------------|
| RF carrier | SX1262 | On/off keyed Morse |
| Audio click | DAC1 GPIO 25 | 600 Hz during carrier on |

Both are driven from the same timing engine, so they cannot drift apart.

## PARIS Standard Timing

Unit duration = `1200 / WPM` ms.

| Element | Units |
|---------|-------|
| Dot | 1 |
| Dash | 3 |
| Intra-character gap | 1 |
| Inter-character gap | 3 |
| Word gap | 7 |

## Why Sync Matters

1. **Bench verification** - hear the payload before needing a radio.
2. **Field confidence** - the audio confirms transmission is happening.
3. **Timing QA** - a dot that sounds wrong signals a WPM or clock bug.

## Related Pages

- [Morse Code Engine](/wiki/morse-code-engine)
- [Audio Alert System](/wiki/audio-alert-system)
- [BEACON Mode](/wiki/mode-beacon)
- [Morse Practice](/wiki/morse-practice)
