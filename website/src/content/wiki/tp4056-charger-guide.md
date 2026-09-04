---
title: "TP4056 Charger Guide"
description: "The TP4056 USB-C charge module: BAT+, STDBY, DW01A protection and wiring to the ESP32"
---

# TP4056 Charger Guide

## Overview

The TP4056 is a single-cell Li-ion linear charger sold as a tiny USB-C breakout. In the Aegis-Beacon it charges the 18650 and provides the BAT+ rail that the voltage divider samples.

## Module Facts

| Parameter | Value |
|-----------|-------|
| Charge current | 1 A max (set by resistor on module) |
| Input | USB-C 5 V |
| Cell output | BAT+ / BAT- |
| Protection | DW01A + FS8205 (over-discharge, over-current) |
| Status pins | CHRG (charging), STDBY (done) |
| STDBY to ESP32 | GPIO 39 (optional) |

## The Pads That Matter

| Pad | Connect to | Purpose |
|-----|-----------|---------|
| BAT+ | 100k divider input | Battery voltage measurement point |
| BAT- | GND (common) | Cell negative |
| STDBY | GPIO 39 | LOW while charging or full |
| CHRG | (optional) | LOW while actively charging |
| OUT+/OUT- | ESP32 VBUS/5V or separate | Depends on module layout |

> [!WARNING]
> Two TP4056 breakout layouts exist: one exposes the cell on BAT+/BAT- and the system on OUT+/OUT-, another uses only BAT. Measure with a multimeter before wiring so the ESP32 5 V input comes from the right pads.

## Charging Behavior

| State | CHRG LED | STDBY pin |
|-------|----------|-----------|
| Charging | Red on | LOW |
| Charge complete | Off | LOW |
| No cell / standby | Red blinks | HIGH |

The firmware reads STDBY on GPIO 39 and shows a `C` in the battery icon while charging.

## Protection Layer

The DW01A protector handles:

- Over-discharge cutoff around 2.4-3.0 V.
- Over-current protection.
- Over-voltage during charge.

This is why the build does not need a separate protection PCB for the cell.

## Charging Tips

1. Charge at 0.5 A or 1 A; the module's resistor sets the rate.
2. Do not leave the cell charging unattended overnight on a cheap supply.
3. In the field, a 5 V solar bank can top up the cell through the USB-C port.

## Related Pages

- [18650 Battery Guide](/wiki/18650-battery-guide)
- [Electrical Specifications](/wiki/electrical-specifications)
- [Charging and Cell Care](/wiki/charging-and-cell-care)
- [Assembly Guide](/wiki/assembly-guide)
