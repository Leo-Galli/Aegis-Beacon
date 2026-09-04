---
title: "RF Interference and Noise"
description: "Sources of noise at 433 MHz, how they affect SEARCH mode, and what to do about them"
---

# RF Interference and Noise

## Overview

433 MHz is a shared ISM band. The SEARCH scanner measures RSSI, so it cannot tell a real beacon from a strong interferer - it only reports signal strength. Knowing the local noise floor keeps false hits from wasting a search.

## Common Noise Sources

| Source | Signal shape | How to tell |
|--------|--------------|-------------|
| Car key fobs | Bursts on button press | Short, repeatable when you press your own key |
| Wireless weather stations | Periodic short packets | Regular cadence every minute |
| Tire pressure sensors | Short bursts as cars pass | Moves with traffic |
| Smart plugs / LED drivers | Broadband hash | Persistent, wide on the waterfall |
| Other LoRa/ISM devices | Variable | Check what neighbors use |

## Using SEARCH Threshold

The detection threshold (`rssi`, default -90 dBm) is your noise gate:

- Raise it (e.g., to -80 dBm) in noisy urban areas.
- Lower it toward -100 dBm only in quiet backcountry.
- Watch the RSSI baseline on a quiet channel first.

## Checking the Noise Floor

1. Enter SEARCH mode on an unused frequency.
2. Note the idle RSSI over 30 seconds.
3. Compare against a known-quiet channel (e.g., one no one uses).
4. Set the threshold a few dB above the quiet baseline.

## Real Beacon vs Interferer

A real Aegis-Beacon in SEARCH mode shows:

- A carrier keying in Morse (SOS pattern) at a stable frequency.
- RSSI that rises as you approach.
- The same frequency every TX cycle.

An interferer shows none of those patterns. If in doubt, look for the Morse signature before acting on a hit.

## Related Pages

- [SEARCH Mode](/wiki/mode-search)
- [Frequency Compatibility](/wiki/frequency-compatibility)
- [Troubleshooting RF](/wiki/troubleshooting-rf)
- [Propagation and Range](/wiki/propagation-and-range)
