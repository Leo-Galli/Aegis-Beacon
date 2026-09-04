---
title: "Two-Beacon Bench Test"
description: "Verify the full TX/RX loop with two beacons on the bench before any field use"
---

# Two-Beacon Bench Test

## Overview

The most convincing end-to-end test is two beacons: one transmitting in BEACON, one scanning in SEARCH. This validates the entire chain - RF, RSSI, audio, hit log and payload - on the bench.

## Setup

1. Place two beacons 5-10 m apart with antennas vertical.
2. Beacon A: BEACON mode, primary frequency 433.500 MHz.
3. Beacon B: SEARCH mode with 433.500 MHz in its frequency plan.
4. Keep both on fresh cells.

## What to Verify

| Check | Expected |
|-------|----------|
| B hears A | RSSI rises during A's TX bursts |
| B classifies | WEAK/MEDIUM/STRONG label changes |
| B logs a hit | Hit appears in the log with 433.500 MHz |
| B audio pitches | Click-aligned tone when A keys |
| A OLED | Progress bar and payload scroll during TX |

## Controlling the Test

A's TX is gated by its deep-sleep interval. To make the test fast:

1. Set A's sleep interval low (1-5 s) via the dashboard.
2. Or trigger A manually by pressing MODE to cycle modes back to BEACON.

## Reading the Results

On B's serial console:

```text
[SCAN ] HIT: 433.500 MHz -87 dBm [MEDIUM]  total=1
```

A MEDIUM or STRONG hit at 5-10 m confirms the whole RF path works. If B hears nothing, work backwards: A's TX (OLED + audio), A's antenna, B's frequency plan, B's threshold.

## Related Pages

- [SEARCH Mode](/wiki/mode-search)
- [BEACON Mode](/wiki/mode-beacon)
- [Outdoor Testing](/wiki/outdoor-testing)
- [Dummy Load and Bench Testing](/wiki/dummy-load-and-bench-testing)
