---
title: "RF Exposure Safety"
description: "Antenna placement, duty cycle and keeping a transmitting beacon away from eyes and head"
---

# RF Exposure Safety

## Overview

At +17 to +30 dBm the beacon is low power by ham standards, but a transmitting antenna held against the body or eyes is still worth avoiding. This page gives practical exposure rules.

## Power Context

| Setting | Power | Comparison |
|---------|-------|------------|
| +17 dBm | ~50 mW | Below most phone TX peaks |
| +22 dBm | ~160 mW | Modest handheld level |
| +30 dBm (PA) | ~1 W | Ham HT territory |

## Practical Rules

1. Do not hold the antenna against your head or eyes while transmitting.
2. Keep the beacon at arm's length during bench TX tests.
3. Point the antenna away from people when running EMERGENCY tests.
4. Use a dummy load for repeated bench transmissions - see [Dummy Load and Bench Testing](/wiki/dummy-load-and-bench-testing).

## Duty Cycle

Morse keying is not continuous: at 13 WPM the carrier is on less than half the time, and the deep-sleep duty cycle is tiny. EMERGENCY mode is the exception - treat it as continuous TX and keep clear.

## Related Pages

- [EMERGENCY Mode](/wiki/mode-emergency)
- [Dummy Load and Bench Testing](/wiki/dummy-load-and-bench-testing)
- [Safety and Liability](/wiki/safety-and-liability)
- [Regulatory Compliance](/wiki/regulatory-compliance)
