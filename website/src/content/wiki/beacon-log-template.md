---
title: Beacon Log Template
description: "The test log format for bench and field sessions: what to record, why, and how the log catches regressions."
---

# Beacon Log Template

A beacon log is the project's memory. The same test run twice, months apart, is only comparable if both runs were logged the same way. This page is the template.

## The bench log entry

```
Date: 2026-09-05
Firmware: v5.4.0
Beacon A: unit 1, E22 module, whip antenna
Beacon B: unit 2, E22 module, whip antenna
Distance: 2 m, bench, 30 dB attenuator in line
Frequency: 433.100 MHz, power +17 dBm
Result: A -> B decode OK, RSSI -86 dBm
        B -> A decode OK, RSSI -84 dBm
Notes: new antenna on unit 1
```

## The field log entry

```
Date: 2026-09-05, 14:30
Location: ridge above Refugio, 2400 m
Beacon: unit 1, GPS on, 10 s interval
Receiver: SDR + whip, at chest height
Distance: 1.2 km, clear ridge line
Result: bursts heard, 5/5 decoded, RSSI -92 dBm
Weather: clear, 8 C, light wind
```

## The columns that matter

| Column | Why |
| --- | --- |
| Firmware version | Behavior changes between versions |
| Hardware config | Antenna, power, distance |
| Result | Decode? RSSI? |
| Conditions | Weather, terrain (see [Weather Planning](weather-planning)) |

## The regression rule

Run the identical bench setup after every change: firmware update, antenna swap, case reassembly. A decode that used to succeed and now fails, with the same log format, is a regression with a fingerprint. Without the log, it is a mystery.

## Related pages

- [Two Beacon Bench Test](two-beacon-bench-test) for the bench procedure
- [Receiver Testing](receiver-testing) for the tests
- [Outdoor Testing](outdoor-testing) for the field version