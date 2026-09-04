---
title: "Charging and Cell Care"
description: "Safe charging practice, storage voltage, cycle life and how the TP4056 protects the cell"
---

# Charging and Cell Care

## Overview

A rescue beacon spends most of its life waiting in a pack. How the cell is charged and stored between deployments determines whether it still holds a useful charge when it is needed.

## Charging Basics

| Parameter | Recommended |
|-----------|-------------|
| Charge current | 0.5-1 A (TP4056 resistor sets it) |
| Cutoff voltage | 4.2 V (TP4056 does this) |
| Temperature | 10-30 C for charging |
| Never charge | Below 0 C, above 45 C |

> [!WARNING]
> Do not charge Li-ion cells below freezing. Charge at room temperature and keep the cell warm in a pocket before use in winter.

## Storage Voltage

A cell stored at full charge (4.2 V) degrades faster than one stored at a partial charge.

| Storage duration | Recommended state of charge |
|------------------|-----------------------------|
| Under 1 month | 100% (ready to deploy) |
| 1-6 months | 60-80% |
| Over 6 months | 40-60% and recheck every 2 months |

For a field beacon that must work instantly, the convenience of a full charge usually wins over the small storage penalty - just top it up every couple of months.

## Cycle Life Expectations

| Chemistry | Cycles to 80% capacity |
|-----------|------------------------|
| Li-ion (standard) | ~300-500 |
| LiFePO4 | ~1000-2000 |

The beacon draws very little: one 10 s TX burst plus deep sleep. In normal beacon use the cell is limited by calendar aging (2-4 years) rather than cycle count.

## What the Firmware Checks

The beacon monitors cell health every 5 s:

- Voltage from the GPIO 36 divider.
- Percentage from the 9-point Li-ion curve.
- Charging state from the TP4056 STDBY pin.

An ADC reading outside 2500-4500 mV is rejected as a fault - a sure sign of a bad connection or dead cell.

## Field Top-Up

A 5 V USB power bank can recharge the cell through the TP4056 USB-C port while the device stays assembled. Do not transmit while charging at the same time if the supply is marginal; the TP4056 input and the ESP32 5 V rail share the USB line.

## Related Pages

- [18650 Battery Guide](/wiki/18650-battery-guide)
- [TP4056 Charger Guide](/wiki/tp4056-charger-guide)
- [Battery Selection](/wiki/battery-selection)
- [Safety Guidelines](/wiki/safety-guidelines)
