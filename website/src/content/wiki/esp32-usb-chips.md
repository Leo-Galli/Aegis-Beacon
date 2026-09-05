---
title: ESP32 USB Chips
description: CH340 vs CP2102, why the USB chip matters for flashing, and how to fix a board the PC cannot see.
---

# ESP32 USB Chips

The DevKit V1 carries a USB-to-serial chip that turns the ESP32's UART into a USB port. Two chips dominate the market, and they behave differently.

## CH340 (most clones)

The CH340 is the budget workhorse. It works well but needs a driver on Windows (bundled with recent versions of the Arduino IDE, or downloadable from WCH).

- If the PC shows an unknown device named "USB-SERIAL CH340", the driver is missing.
- Baud rates up to 2 Mbps are supported; the beacon uploads fine at 921600.

## CP2102 (genuine Espressif and better clones)

The CP2102 has built-in drivers on Windows and macOS. It is the smoother experience, and slightly more expensive.

- Shows as "Silicon Labs CP210x USB to UART Bridge".
- Also fine at high upload baud rates.

## Other chips you may see

- **CH9102**: newer WCH chip, also needs a driver, works fine.
- **CP2104**: small package, no external crystal, fine.

## Why the PC sees nothing

In order of likelihood:

1. Charge-only cable: swap the cable.
2. Missing driver (CH340): install it.
3. Faulty board: try holding the BOOT button while plugging in.
4. Windows driver conflict: the CH340 and CP2102 drivers can fight; uninstall the wrong one.

## During flashing

Some boards need you to hold the BOOT/IO0 button while the IDE starts the upload, then release it. If the upload hangs at "Connecting...", press and hold BOOT, start upload, release when it connects. Newer auto-reset circuits make this unnecessary, but clones vary.