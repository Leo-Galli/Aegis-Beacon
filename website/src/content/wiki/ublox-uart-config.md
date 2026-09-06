---
title: Configuring the NEO-6M over UART
description: "Change NEO-6M settings (baud rate, update rate, constellations) with u-blox u-center over a USB-serial adapter."
---

# Configuring the NEO-6M over UART

The NEO-6M comes with sensible defaults (9600 baud, 1 Hz) that the firmware relies on. If you want to change them, you configure the module directly over its UART with u-blox's free **u-center** tool.

## Why you usually should not

The firmware assumes 9600 baud and parses the standard NMEA sentences. Changing the baud rate without also changing the firmware breaks GPS. Only reconfigure for good reasons: a lower update rate to save power, or `UBX` binary messages for experimentation.

## What you need

- A USB-UART adapter (CP210x/CH340) or a second ESP32 in passthrough.
- A way to power the module at 3.3 V.
- u-center from u-blox (Windows/macOS/Linux).

## Wiring the module to the adapter

| NEO-6M pin | Adapter pin |
| --- | --- |
| VCC | 3.3 V |
| GND | GND |
| TX | RX |
| RX | TX |

Leave the beacon's GPS unplugged while you configure the module, so two drivers are not fighting over the UART.

## The steps in u-center

1. Connect to the module's COM port (see [Serial Port Detection](serial-port-detection)).
2. Receiver, UBX-CFG: set baud rate and update rate under PRT and RATE.
3. View, Text Console: watch GGA/RMC sentences stream at the new settings.
4. **Save**: in the message view, CFG-CFG with "Save" set, so the changes survive power-off. Unsaved changes reset on reboot.

## Restore defaults

If the module ends up at a baud rate the firmware cannot use, re-flash the defaults with u-center (CFG-CFG, "Reset to default"), then save. The firmware only talks 9600 baud 8N1.

## Related

- [GPS Serial Details](gps-nmea-sentences)
- [GPS Warm vs Cold Start](gps-warm-vs-cold-start)
- [GPS Fix Capture Tips](gps-fix-capture-tips)