---
title: RSSI Explained
description: What the RSSI number in SEARCH mode means, how the threshold works, and how to interpret the hit log.
---

# RSSI Explained

RSSI is the number the beacon shows while scanning. It is the raw signal-strength readout, and SEARCH mode's whole job is built on it.

## What RSSI measures

RSSI is the receiver's estimate of the incoming signal power, in dBm. The SX1262 measures it during each receive window.

| RSSI | Meaning |
|------|---------|
| -40 to -70 dBm | Strong signal (nearby) |
| -70 to -90 dBm | Moderate |
| -90 to -105 dBm | Weak but possibly audible |
| -110 to -120 dBm | Near the noise floor; likely nothing |

## The threshold

SEARCH mode compares each reading against a configured threshold (default -90 dBm). Above threshold = a **hit**; below = quiet. The threshold is a trade-off:

- Too high (e.g. -70): only very strong signals count; you miss distant beacons.
- Too low (e.g. -110): noise counts; the scan logs false hits.

## The dwell window

The beacon listens on each frequency for the dwell time (default 400 ms) and records the *peak* RSSI in that window. A brief transmission is still caught if it overlaps the window.

## Reading the hit log

The RTC RAM hit log stores the last 20 detections with frequency, RSSI, and a classification:

- STRONG: typically -60 dBm or better
- MEDIUM: roughly -60 to -80 dBm
- WEAK: roughly -80 to -105 dBm

## Audio correspondence

The SEARCH audio pitch maps directly to RSSI: quiet = silence (DAC parked), weak = 440 Hz rising, strong = up to 2200 Hz. The pitch change is your real-time proximity sensor.

## Troubleshooting with RSSI

- Floor reading around -110 to -90 with no signal: normal.
- A steady strong reading on one frequency with no transmitter: local interference; see the interference page.
- RSSI stuck at one value across all frequencies: the radio is not actually receiving; check the antenna and the SX1262 wiring.