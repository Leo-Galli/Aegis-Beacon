---
title: Firmware Scan Engine
description: How the SEARCH mode sweeps frequencies, measures RSSI and reports the strongest signal in the band.
---

# Firmware Scan Engine

SEARCH mode turns the radio into a receiver: it sweeps a frequency range, measures the received signal strength at each step, and shows the loudest channel.

## Sweep parameters

The scan engine is configurable through CONFIG mode:

| Parameter | Default | Meaning |
| --- | --- | --- |
| Start frequency | 433.000 MHz | Lower edge of the sweep |
| End frequency | 434.000 MHz | Upper edge of the sweep |
| Step size | 12.5 kHz | Channel spacing |
| Dwell time | 20 ms | Listening time per step |

## How a sweep works

1. The SX1262 is switched to RX with a single-channel frequency.
2. The firmware waits one dwell period.
3. The RSSI register is read (the packet handler also records RSSI on any received packet).
4. The frequency steps and the process repeats.

One full sweep across 80 steps takes about 1.6 seconds.

## Display

The OLED renders the sweep as a vertical bar chart: height proportional to RSSI, horizontal axis frequency. The strongest channel is marked with an inverted block and its frequency printed below. This is the same visualization used on the website demo, which mirrors the firmware's scan screen.

## What it is for

- Finding a clear channel before a field exercise
- Locating another beacon on a known frequency
- Verifying that your own transmissions stay on channel

## Limits

The sweep measures relative strength, not absolute signal quality. A loud signal near the band edge can look like a broad plateau. For exact frequency measurement, switch the radio to fixed-frequency RX and listen to the tone.

## Related pages

- [Firmware Scan Cycle](firmware-scan-cycle) for the loop that drives it
- [Scan Engine Details](scan-engine-details) for the data structures
- [Mode Search](mode-search) for the user-facing mode