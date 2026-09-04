---
title: "Battery Monitor Details"
description: "ADC chain, the 9-point Li-ion curve, calibration and the charging detect path"
---

# Battery Monitor Details

## Overview

The battery monitor turns a resistor divider reading into a percentage you can trust. It samples 32 times, maps the voltage through a 9-point Li-ion discharge curve, and shows the result as both a number and a pixel-art icon.

## Signal Chain

```
BAT+ (TP4056)
  -> 100k R3a
  -> GPIO 36 (ADC1_CH0) ---- 100k R3b ---- GND
```

Divider halves the voltage: 4.2 V full charge reads 2.1 V at the ADC.

## Software Parameters

| Parameter | Value | Constant |
|-----------|-------|----------|
| ADC pin | GPIO 36 | PIN_BAT_ADC |
| Samples averaged | 32 | BAT_SAMPLES |
| Read interval | 5000 ms | BAT_READ_MS |
| Full-scale reference | 3900 mV | BAT_VREF_MV |
| Full charge | 4200 mV | BAT_FULL_MV |
| Empty | 3000 mV | BAT_EMPTY_MV |
| Range guard | 2500-4500 mV | - |

## The 9-Point Curve

| Voltage | % |
|---------|---|
| 4.20 V | 100 |
| 4.05 V | 90 |
| 3.90 V | 75 |
| 3.75 V | 60 |
| 3.65 V | 50 |
| 3.55 V | 35 |
| 3.40 V | 20 |
| 3.20 V | 10 |
| 3.00 V | 0 |

## Calibration

If the reading disagrees with a multimeter, adjust `BAT_VREF_MV`:

```cpp
#define BAT_VREF_MV   3900   // Increase if readings too low, decrease if too high
```

## Charging Detect

The optional TP4056 STDBY line on GPIO 39 goes LOW while charging or full. The firmware shows a `C` in the battery icon when active.

## Related Pages

- [Power Management](/wiki/power-management)
- [Electrical Specifications](/wiki/electrical-specifications)
- [18650 Battery Guide](/wiki/18650-battery-guide)
- [Charging and Cell Care](/wiki/charging-and-cell-care)
