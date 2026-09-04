---
title: "Power Budget and Runtimes"
description: "Worked runtime math for every mode, cell capacity and temperature scenario"
---

# Power Budget and Runtimes

## Overview

Runtime is the product of three numbers: cell capacity, average current draw and temperature derating. This page works through the math so you can predict battery life for your exact configuration.

## Current Draw by State

| State | Current |
|-------|---------|
| Deep sleep | 10 uA |
| TX active (+17 dBm) | 120 mA |
| RX (SEARCH) | 40 mA |
| OLED | 6 mA |
| GPS tracking | 25 mA |
| GPS acquiring | 30 mA |

## BEACON Worked Example

Configuration: 10 s sleep, 100 ms TX burst, GPS off, OLED on during TX.

```
Per 10 s cycle:
  Sleep:  10 uA x 9.9 s     = 0.099 mA x s
  TX:     120 mA x 0.1 s    = 12 mA x s
  Total per cycle           = 12.1 mA x s

Average = 12.1 / 10 = 1.21 mA
Runtime on 2000 mAh = 2000 / 1.21 = ~1650 h
```

The datasheet estimate (~65 h at 10 s sleep) assumes the full payload takes ~45 s to transmit, so TX dominates. Short payloads and longer sleep stretch runtime dramatically.

## Runtimes by Mode

| Mode | Sleep | GPS | Runtime (2000 mAh) |
|------|-------|-----|--------------------|
| BEACON | 10 s | Off | ~65 h |
| BEACON | 60 s | Off | ~175 h |
| SEARCH | - | Off | ~44 h |
| EMERGENCY | - | On | ~12 h |

## Temperature Derating

| Temperature | Capacity multiplier |
|-------------|---------------------|
| 20 C | 1.0x |
| 0 C | 0.85x |
| -10 C | 0.7x |
| -20 C | 0.5x |

At -20 C a 2000 mAh cell behaves like 1000 mAh. Recompute your worst case with the multiplier.

## Related Pages

- [Power Management](/wiki/power-management)
- [Battery Selection](/wiki/battery-selection)
- [18650 Battery Guide](/wiki/18650-battery-guide)
- [Electrical Specifications](/wiki/electrical-specifications)
