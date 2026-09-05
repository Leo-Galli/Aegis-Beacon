---
title: Battery Capacity Math
description: How to estimate beacon runtime from battery capacity and average current draw, with worked examples for the standard build.
---

# Battery Capacity Math

Runtime is capacity divided by average current. The subtlety is "average": the beacon's draw swings from microamps in sleep to hundreds of milliamps during transmit.

## The basic formula

```
runtime (hours) = capacity (mAh) / average current (mA)
```

An 18650 rated 2500 mAh at 100 mA average lasts 25 hours. The rating is itself a moving target: capacity drops as the current rises, and cells age (see [18650 Battery Guide](18650-battery-guide)).

## The duty cycle average

The beacon spends most of its life in deep sleep. The average current is the sum over one full beacon cycle:

```
avg = (I_sleep x t_sleep + I_tx x t_tx + I_gps x t_gps) / cycle_time
```

| Phase | Current | Duration per cycle |
| --- | --- | --- |
| Deep sleep | 0.02 mA | 10 s |
| TX burst | 120 mA | 2 s |
| GPS tracking | 30 mA | continuous |

## Worked example: standard beacon

With GPS always on and a 10 s sleep interval:

```
avg = 30 mA (GPS) + 120 mA x (2/12) + 0.02 x (10/12)
    = 30 + 20 + 0.02 = 50 mA
```

With a 2500 mAh cell: 2500 / 50 = **50 hours**. With GPS off and manual coordinates: about 20 mA average, roughly **125 hours**. The [Power Budget and Runtimes](power-budget-and-runtimes) page lists the measured table.

## Derating

Real cells deliver 80 - 90% of rating at moderate current, and the beacon should not run the cell to zero anyway (see [Undervoltage Protection](undervoltage-protection)). Plan on 70 - 80% of the theoretical number as your honest estimate.

## Field check

The firmware's battery monitor reports voltage, not remaining mAh. The honest field rule: the 3.3 V rail holds until the cell sags; the [Battery Monitor Details](battery-monitor-details) page explains how to read the warning states.

## Related pages

- [Power Budget and Runtimes](power-budget-and-runtimes) for the measured table
- [Current Draw by Mode](current-draw-by-mode) for the numbers
- [Battery Selection](battery-selection) for choosing the cell