---
title: Firmware RSSI Measurement
description: How the firmware reads the SX1262 RSSI register, converts it to dBm, and uses it in SEARCH mode and in packet logging.
---

# Firmware RSSI Measurement

Received Signal Strength Indication (RSSI) is the radio's report of how loud a signal is. The firmware reads it in two situations: during a SEARCH sweep and at the end of every received packet.

## Reading RSSI on the SX1262

The SX1262 exposes RSSI through a register. The firmware:

1. Waits until the radio is in RX or has just finished a packet.
2. Reads the RSSI byte.
3. Applies the offset calibration: RSSI (dBm) = register value - 137.5 for the SX1262 in the frequency range used here.

## Packet RSSI

When the radio demodulates a packet, it stores the RSSI measured during the preamble. The firmware attaches this value to the packet record, which is used for the two-beacon bench test (see [Two Beacon Bench Test](two-beacon-bench-test)) and for reporting signal quality during field tests.

## Sweep RSSI

In SEARCH mode the firmware steps through frequencies and records the RSSI at each step, building the bar chart on the OLED. The peak channel and its RSSI are shown as text below the chart.

## What RSSI numbers mean

| RSSI (dBm) | Interpretation |
| --- | --- |
| -40 to -60 | Very strong, near the noise floor of the receiver |
| -60 to -80 | Strong, excellent link |
| -80 to -100 | Moderate, usable |
| -100 to -120 | Weak, near the sensitivity limit |
| below -120 | Below the useful sensitivity of the SX1262 |

## Caveats

RSSI is an instantaneous measurement, not an average. A fading signal can show a different value on every read. For a stable figure, the firmware averages the last 4 readings.

## Related pages

- [RSSI Explained](rssi-explained) for the theory
- [Firmware Scan Engine](firmware-scan-engine) for the sweep
- [Signal Reporting Conventions](signal-reporting-conventions) for how to report what you hear