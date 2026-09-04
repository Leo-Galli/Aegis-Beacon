---
title: "18650 Battery Guide"
description: "Protected vs unprotected cells, LiFePO4 for winter, holders and cold-weather capacity math"
---

# 18650 Battery Guide

## Overview

The Aegis-Beacon runs on a single 18650 cell. The choice of cell and holder matters more for reliability than for price: a cheap cell with a marginal protection circuit can cut a deployment short.

## Cell Types

| Type | Voltage | Notes |
|------|---------|-------|
| Li-ion 18650 | 3.7 V nominal | Standard choice, ~2000-3500 mAh |
| Protected Li-ion | 3.7 V nominal | Adds a protection PCB, slightly longer cell |
| LiFePO4 18650 | 3.2 V nominal | Rated to -30 C, lower capacity |

> [!NOTE]
> LiFePO4 cells have a lower nominal voltage (3.2 V) than Li-ion. The firmware's 9-point discharge curve is calibrated for Li-ion; with LiFePO4 expect the percentage reading to sit lower than the true state of charge. Prefer LiFePO4 in alpine winter use anyway because standard Li-ion loses 40-60% of capacity below -20 C.

## Protected vs Unprotected

| Aspect | Protected | Unprotected |
|--------|-----------|-------------|
| Over-discharge protection | Built into the cell | None (relies on DW01A in the TP4056 module) |
| Over-current protection | Built in | None |
| Length | ~65-67 mm | ~65 mm |
| Typical use | Safer with a bare TP4056 module | Only with a protection board in the path |

The build already includes a TP4056 module with DW01A protection, so an unprotected cell is acceptable. A protected cell adds redundancy at the cost of a few mm of fit.

## Cold Weather Math

| Temperature | Capacity retained (Li-ion) |
|-------------|-----------------------------|
| 20 C | 100% |
| 0 C | 80-90% |
| -10 C | 60-80% |
| -20 C | 40-60% |

A 3000 mAh cell at -20 C behaves like a 1200-1800 mAh cell. Plan beacon runtime around the worst-case number, not the label.

## Holder Options

| Holder | Fit | Notes |
|--------|-----|-------|
| Spring clip (single cell) | Best | Solder two wires, fits the 1593L case |
| 18650 sled with leads | Good | Same electrical result |
| Battery box (2x18650) | Poor | Parallel wiring adds failure modes, only use one bay |

## Related Pages

- [Battery Selection](/wiki/battery-selection)
- [Power Management](/wiki/power-management)
- [TP4056 Charger Guide](/wiki/tp4056-charger-guide)
- [Electrical Specifications](/wiki/electrical-specifications)
