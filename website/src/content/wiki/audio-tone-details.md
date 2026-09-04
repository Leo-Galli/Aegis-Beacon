---
title: "Audio Tone Details"
description: "The exact tone map: SEARCH pitch progression, Morse clicks and the EMERGENCY tone"
---

# Audio Tone Details

## Overview

Audio is a single-wire system on GPIO 25 with distinct tones per context. Understanding the tone map tells you what the beacon is doing without looking at it.

## Tone Map

| Context | Frequency | Meaning |
|---------|-----------|---------|
| SEARCH, no signal | Silence (parked) | Below threshold |
| SEARCH, WEAK | 440 Hz rising | Signal near threshold |
| SEARCH, MEDIUM | ~880 Hz | Getting stronger |
| SEARCH, STRONG | Up to 2200 Hz | Very strong signal |
| BEACON TX | 600 Hz clicks | Morse keying |
| EMERGENCY | 1760 Hz continuous | Emergency mode |

## Pitch Linearization

In SEARCH, pitch is mapped linearly from the RSSI:

- At exactly the threshold: 440 Hz.
- At -60 dBm: ~880 Hz.
- At -40 dBm and above: ~2200 Hz.

The rising pitch with rising signal is the "metal detector" feel.

## Why 600 Hz Clicks in BEACON

Morse keying is a square wave of on/off; 600 Hz inside each element makes each dot/dash audible as a short tone burst. This is the audio confirmation of RF keying.

## Volume and Targets

- Default volume 180 (~70%), range 0-255.
- SW_UP/DN adjust the selected target (VOL or WPM).
- Hold SEL 1 s to persist.

## Related Pages

- [Audio Alert System](/wiki/audio-alert-system)
- [SEARCH Mode](/wiki/mode-search)
- [BEACON Mode](/wiki/mode-beacon)
- [EMERGENCY Mode](/wiki/mode-emergency)
