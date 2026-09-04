---
title: "Scan Engine Details"
description: "Inside SEARCH mode: dwell windows, peak RSSI sampling, hit classification and the rolling log"
---

# Scan Engine Details

## Overview

The SEARCH scanner is a sequential frequency sweeper. It spends a dwell window on each channel, measures the peak RSSI, classifies the result and logs hits above the threshold.

## Scan Loop Internals

| Step | Detail |
|------|--------|
| 1 | Radio set to FSK RX on channel N |
| 2 | RSSI sampled during the dwell window (default 400 ms) |
| 3 | Peak RSSI held for the window |
| 4 | Peak compared to the threshold (`rssi`) |
| 5 | OLED updated with bar + signal label |
| 6 | Hit logged to RTC RAM if above threshold |
| 7 | Advance to channel N+1 |

## RSSI Measurement

| Parameter | Value |
|-----------|-------|
| RSSI range | -120 to -40 dBm |
| Accuracy | +-2 dBm typical |
| Dwell range | 50-2000 ms |
| Default dwell | 400 ms |
| Channels | Up to 10 |

Longer dwell improves sensitivity to slow or intermittent keying but slows the full scan pass.

## Classification Thresholds

| Class | Condition |
|-------|-----------|
| WEAK | Threshold to -80 dBm |
| MEDIUM | -80 to -60 dBm |
| STRONG | -60 dBm and above |

The class drives the OLED label and the audio pitch (440/880/2200 Hz bands).

## Hit Log

| Field | Type | Notes |
|-------|------|-------|
| freq | float | MHz |
| rssi | int16 | Peak dBm |
| timestamp | uint32 | millis() |
| label | char[12] | WEAK / MEDIUM / STRONG |

The log holds the last 20 hits in RTC RAM and survives deep sleep - useful for post-session review even though SEARCH itself never sleeps.

## Related Pages

- [SEARCH Mode](/wiki/mode-search)
- [RTC RAM State](/wiki/rtc-ram-state)
- [Audio Alert System](/wiki/audio-alert-system)
- [Search Patterns and Procedure](/wiki/search-patterns-and-procedure)
