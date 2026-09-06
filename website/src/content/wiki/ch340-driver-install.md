---
title: CH340 Driver Install
description: "Install the CH340 / CH341 USB-serial driver on Windows, macOS and Linux for clone ESP32 boards."
---

# CH340 Driver Install

Many clone ESP32 DevKit boards (and nearly all "ESP32 DevKit" boards from Chinese vendors) use the **CH340G** USB-UART chip instead of the CP210x. The symptoms are identical: the board powers on, but no serial port appears until the driver is installed.

## Do you have a CH340?

- Windows Device Manager: an unknown device named `USB-SERIAL CH340` when plugged in.
- macOS: the port `/dev/cu.usbserial-*` usually appears after installing the driver.
- Linux: the `ch341` kernel module is built into the kernel; the port appears as `/dev/ttyUSB0` automatically.

## Windows

1. Download the **CH340 driver** from the WCH site (search "CH340 driver WCH"). Beware of lookalike sites; the official one is wch.cn.
2. Run the installer and replug the beacon.
3. Device Manager shows `USB-SERIAL CH340 (COMx)` under **Ports (COM and LPT)**.

If Windows blocks the driver with "unsigned", allow it once, or use the signed variant from the board vendor (Espressif boards often ship it on their download pages).

## macOS

1. Download the CH340 macOS driver (same source).
2. Install, then reboot once. In System Settings, Privacy and Security, approve the kernel extension if prompted.
3. The port appears as `/dev/cu.usbserial-*`.

## Linux

Nothing to do; the kernel handles it.

## Verify

Open the port at 115200 baud and reset the board; the boot banner and `AEGIS:HELLO:` line confirm it works. See [Serial Port Detection](serial-port-detection).

## Related

- [CP210x Driver Install](cp210x-driver-install)
- [USB-Serial Adapter Troubleshooting](serial-adapter-troubleshooting)