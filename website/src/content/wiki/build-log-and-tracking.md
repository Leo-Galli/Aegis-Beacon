---
title: Build Log and Tracking
description: Track parts, stages and measurements so any fault can be traced to its cause and the next build is faster.
---

# Build Log and Tracking

A build log turns a one-off assembly into repeatable knowledge. It answers the two questions that matter when something fails later: what was measured at each stage, and what was changed since.

## What to record

| Section | What goes in it |
|---------|-----------------|
| Parts | Where each part came from, the batch, and any note (e.g. "OLED is the SPI variant") |
| Stages | One row per quality gate with measured values and pass/fail |
| Modifications | Every deviation from the documented wiring, with date and reason |
| Field results | Range tests, battery life observations, anything abnormal |
| Serial log excerpts | The boot log and any error lines for reference |

## The one-line-per-gate format

```
2026-09-06  Power:  rail=3.31V  div=2.05V  cell=4.10V  standby=38mA  PASS
2026-09-06  Radio:  boot OK, TX current +95mA, RX RSSI bar moves  PASS
2026-09-06  GPS:    fix in 41s, 6 sats, PSN matches map within 150m  PASS
```

Compact, comparable, and enough to spot drift: if the same beacon later draws 60 mA standby, the log says 38 mA was the baseline.

## Tracking multiple builds

If you build several beacons, give each one a serial number (AEG-001, AEG-002) and keep one section per unit in the same log file. The [Beacon Log Template](/wiki/beacon-log-template) has a ready-made layout. Cross-unit tracking shows which batch of parts behaves differently, which is the fastest way to spot a counterfeit or out-of-spec component.

## Tying the log to the code

The firmware already reports everything you need to compare against: boot battery, heap, radio init results, GPS fix time and TX outcomes on the serial console. Paste the relevant lines into the log instead of retyping measurements. See [Serial Debug System](/wiki/serial-debug-system).

## Related pages

- [Beacon Log Template](/wiki/beacon-log-template)
- [Build Quality Gates](/wiki/build-quality-gates)
- [Bench Checklist](/wiki/bench-checklist)