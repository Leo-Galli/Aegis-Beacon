---
title: Scanning the Band
description: "Using SEARCH mode systematically: sweep ranges, channel steps, and how to identify what you find on each frequency."
---

# Scanning the Band

SEARCH mode turns the beacon into a receiver and shows the band's occupants. This page is the systematic scan: what ranges to sweep and what the peaks mean.

## The sweep ranges

| Goal | Range | Step |
| --- | --- | --- |
| Find the beacon's own band | 433.000 - 434.000 MHz | 25 kHz |
| Check PMR446 (receive only) | 446.000 - 446.200 MHz | 12.5 kHz |
| Survey the whole ISM segment | 433.050 - 434.790 MHz | 25 kHz |

The firmware's scan engine handles these (see [Firmware Scan Engine](firmware-scan-engine)); the numbers here are the tactical choices.

## Interpreting the peaks

| Peak | Likely source |
| --- | --- |
| Exactly at 433.920 | The most common device frequency: remotes, sensors |
| Wide, loud plateau | A nearby transmitter saturating the front end |
| A regular burst pattern | A beacon! Match the pattern to the schedule |
| Moving peak | A mobile transmitter (car remote in use) |

## The identification procedure

1. Note the frequency of a strong peak.
2. Switch to fixed-frequency RX on it (see [Mode Search](mode-search)).
3. Listen or decode: a Morse burst is a beacon; continuous noise is a device.
4. Log it (see [Beacon Log Template](beacon-log-template)).

## The quiet-channel choice

When deploying, scan first and pick the quietest channel with adequate separation from the peaks. A channel 25 kHz from a loud device is usable; on top of it is not. The [Frequency Planning Examples](frequency-planning-examples) page has worked examples.

## Related pages

- [Mode Search](mode-search) for the mode
- [Firmware Scan Engine](firmware-scan-engine) for the engine
- [Frequency Table Reference](frequency-table-reference) for the channels