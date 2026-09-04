---
title: "Alternate Power Inputs"
description: "USB power banks, solar, bench supplies and battery swaps in the field"
---

# Alternate Power Inputs

## Overview

The beacon normally runs on a single 18650, but the TP4056's USB-C input accepts any 5 V source. This page covers the practical alternatives and their caveats.

## USB Power Bank

| Use | Setup |
|-----|-------|
| Bench work | Connect a power bank to the TP4056 USB-C |
| Field top-up | Recharge the cell through the same port |
| Continuous operation | Possible, but the bank's auto-off may cut power |

## Solar Panel

| Panel | Notes |
|-------|-------|
| 5 V USB solar panel | Works, slow; panel output varies with sun |
| 6 V panels | May exceed the TP4056 input rating |

> [!WARNING]
> Keep panel output near 5 V. The TP4056 input is rated around 5-6 V; overvoltage can damage the charger.

## Bench Supply

For development, a bench supply set to 5 V with current limiting (start at 500 mA) into the TP4056 USB input is ideal. Never feed the ESP32 5 V rail directly without the TP4056 in the path unless you understand the circuit.

## Field Battery Swap

1. Power off the beacon.
2. Swap the 18650 (mode is preserved in RTC RAM).
3. Power on. The beacon resumes the saved mode.

The RTC RAM keeps the mode and counters across the swap; only a full power loss longer than the RTC retention clears them.

## Related Pages

- [TP4056 Charger Guide](/wiki/tp4056-charger-guide)
- [18650 Battery Guide](/wiki/18650-battery-guide)
- [Power Management](/wiki/power-management)
- [Winter Operations](/wiki/winter-operations)
