---
title: "SEARCH Mode"
description: "Locate other beacons with the RSSI scanner: dwell, threshold, hit log and audio pitch"
---

# SEARCH Mode

## Overview

SEARCH turns the Aegis-Beacon into a receiver. It sweeps the configured frequencies, measures the RSSI on each one, and translates signal strength into an audio pitch - the metal-detector style feedback that lets a rescuer home in on a buried beacon without staring at the screen.

## Scan Loop

1. WiFi and Bluetooth are disabled.
2. The radio opens an FSK receive window on the current frequency.
3. RSSI is sampled for the dwell time (default 400 ms).
4. If the RSSI crosses the threshold, the hit is logged.
5. The OLED updates: frequency, RSSI value, fill bar, last hit.
6. The loop advances to the next frequency and repeats.

## Key Parameters

| Parameter | Range | Default | NVS key |
|-----------|-------|---------|---------|
| Dwell time | 50-2000 ms | 400 ms | `dwell` |
| Detection threshold | -120 to -40 dBm | -90 dBm | `rssi` |
| Frequencies | 1-10 | 1 | `fcount`, `freq0..9` |

## Signal Classification

| Class | RSSI range | Audio |
|-------|------------|-------|
| WEAK | Threshold to -80 dBm | Rising pitch from 440 Hz |
| MEDIUM | -80 to -60 dBm | ~880 Hz |
| STRONG | >= -60 dBm | Up to 2200 Hz |

## Hit Log

Detections above threshold go into the RTC RAM rolling log (up to 20 entries). Each entry stores frequency, peak RSSI, timestamp and signal class. The log survives deep sleep, and SEARCH mode is continuous (no deep sleep), so hits accumulate across the whole session.

## Related Pages

- [Operating Modes](/wiki/operating-modes)
- [RTC RAM State](/wiki/rtc-ram-state)
- [Audio Alert System](/wiki/audio-alert-system)
- [Field Deployment](/wiki/field-deployment)
