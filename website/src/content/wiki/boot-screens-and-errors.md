---
title: "Boot Screens and Errors"
description: "Every boot-time screen state and the serial errors you may see on power-up"
---

# Boot Screens and Errors

## Overview

The first seconds after power-on tell you a lot. This page maps boot-time OLED states and serial errors to their causes.

## Boot OLED Sequence

| Screen | What it means |
|--------|---------------|
| AEGIS-BEACON v5.4 + battery | Firmware running |
| INITIALISING progress bar | Peripherals starting |
| ACQUIRING GPS FIX | GPS enabled, no cached fix |
| TX BEACON screen | Ready, mode restored from RTC |

## Boot Serial Errors

| Error | Cause |
|-------|-------|
| `[ERROR] SX1262 TX init FAILED` | SPI wiring or missing BUSY pin |
| `[WARN] NVS empty` | First boot or after reset - normal |
| `[ERROR] OLED init` | OLED wiring, or 4-pin I2C panel |
| Heap below expected | Memory pressure, usually benign |

## Mode Restore

The mode at boot comes from RTC RAM:

- Normal sleep wake: resumes the previous mode.
- EMERGENCY flag set: boots into EMERGENCY and keeps transmitting.

If the device boots straight into EMERGENCY unexpectedly, clear the flag via CONFIG mode (see Factory Reset and Recovery).

## Related Pages

- [Boot Process](/wiki/boot-process)
- [Serial Debug System](/wiki/serial-debug-system)
- [OLED Display](/wiki/oled-display)
- [Troubleshooting](/wiki/troubleshooting)
