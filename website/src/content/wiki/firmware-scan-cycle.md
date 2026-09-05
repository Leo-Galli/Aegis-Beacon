---
title: The Scan Cycle in Detail
description: How SEARCH mode walks the frequency list, samples RSSI, classifies hits, and logs them to RTC RAM.
---

# The Scan Cycle in Detail

SEARCH mode is a continuous loop: tune, listen, measure, decide, next. Understanding the timing helps you set dwell and threshold correctly.

## The per-frequency step

1. Tune the SX1262 to the next frequency in the list.
2. Open the receive window for the dwell time (default 400 ms).
3. Sample RSSI repeatedly during the window; keep the peak.
4. Compare the peak against the threshold.
5. Above threshold: classify (STRONG/MEDIUM/WEAK), log the hit, raise the audio pitch, blink the blue LED fast.
6. Below threshold: quiet, baseline audio.
7. Move to the next frequency.

## Dwell time trade-off

| Dwell | Pros | Cons |
|-------|------|------|
| 100 ms | Fast full scan, more passes | May miss short transmissions |
| 400 ms (default) | Balanced | Full scan takes longer |
| 2000 ms | Catches almost anything | Very slow scan |

With 10 frequencies at 400 ms, one full pass takes 4 seconds.

## Peak vs average

The firmware samples RSSI during the window and keeps the **peak**. A brief transmission overlapping the window registers, even if most of the window was quiet. This is the right behavior for finding intermittent beacons.

## Hit classification

| Class | Typical RSSI |
|-------|--------------|
| STRONG | -60 dBm or better |
| MEDIUM | -80 to -60 dBm |
| WEAK | -105 to -80 dBm |

The classification label shows on the OLED and is stored with each hit.

## The hit log

The last 20 detections are stored in RTC RAM: frequency, RSSI, class, and a timestamp counter. They survive deep sleep (SEARCH does not sleep, but a mode change or reboot preserves them). The dashboard displays the log as bar charts.

## Audio mapping

RSSI maps to a pitch from 440 Hz (weak) up to 2200 Hz (strong), continuously interpolated. The rising pitch with approach is the metal-detector effect that makes SEARCH usable hands-free.

## Restart behavior

On reboot the scan resumes from the saved position in the frequency list, so a power blip does not restart the pattern.

## Setting the threshold honestly

Set the threshold just above the local noise floor. Measure the floor first: run SEARCH with no known transmitter and note the typical RSSI; set the threshold 5-10 dB above it.