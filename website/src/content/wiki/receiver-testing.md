---
title: Receiver Testing
description: "How to test the beacon's receiver without a lab: sensitivity checks with a second beacon, attenuators, and the SEARCH mode."
---

# Receiver Testing

You cannot buy a spectrum analyzer, but you can still answer the questions that matter: does the receiver hear, how weak a signal does it hear, and does it reject nearby interference?

## The second-beacon method

The [Two Beacon Bench Test](two-beacon-bench-test) is the foundation: transmit from one beacon, receive on the other, and read the RSSI. Everything else in this page builds on it.

## Testing sensitivity without a lab

Sensitivity tests need calibrated signal levels, which need an attenuator. A cheap fixed attenuator (10 - 30 dB) plus the known output power gives you a coarse calibration:

1. Beacon A transmits at +17 dBm through a 30 dB attenuator into beacon B.
2. Beacon B should decode a -113 dBm-equivalent signal (17 - 30).
3. Compare the decoded RSSI with the expected value; a big gap means receiver problems or a bad cable.

## What to look for

| Symptom | Likely cause |
| --- | --- |
| No decode at close range | TX or RX wiring, frequency mismatch |
| Decodes but RSSI lower than expected | Cable/antenna loss, or the attenuator |
| Decodes only at very close range | Sensitivity loss: bad front end, or supply noise |
| Intermittent decode | Power sag during TX, or a loose connection |

## The SEARCH mode as a test tool

SEARCH mode sweeps the band and shows relative signal levels. Point it at a known transmitter and the bar chart should peak on that frequency. If the peak appears 25 kHz away from where the transmitter is, the radio's frequency reference is off, which is a hardware or calibration issue.

## Documenting the results

Keep a log: date, beacons, distance, RSSI, decode success. The same test repeated after a firmware update or a case reassembly will reveal regressions instantly. The wiki's [Two Beacon Bench Test](two-beacon-bench-test) page includes a log template.

## Related pages

- [Two Beacon Bench Test](two-beacon-bench-test) for the setup
- [Sensitivity vs Selectivity](sensitivity-vs-selectivity) for the theory
- [Dummy Load and Bench Testing](dummy-load-and-bench-testing) for the transmitter side