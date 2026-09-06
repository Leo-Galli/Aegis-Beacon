---
title: CP210x Driver Install
description: "Install the Silicon Labs CP210x driver on Windows, macOS and Linux so the beacon's serial port appears."
---

# CP210x Driver Install

Most genuine ESP32 DevKit V1 boards use the **Silicon Labs CP2102 / CP210x** USB-UART bridge. Without its driver the beacon may power on but never show a serial port.

## Do you have a CP210x chip?

- Windows Device Manager: an unknown device or a device under "Other devices" named `CP210x` when the beacon is plugged in.
- macOS: the port `/dev/cu.usbserial-*` appears by default (drivers ship with the OS for recent versions).
- Linux: the `cp210x` kernel module is included in the kernel; the port appears as `/dev/ttyUSB0` without extra installs.

Only Windows generally needs the installer.

## Windows

1. Download the **CP210x Universal Windows Driver** from the Silicon Labs site (search "CP210x VCP driver").
2. Run the installer (`CP210xVCPInstaller_x64.exe`).
3. Unplug and replug the beacon.
4. Device Manager should now show `Silicon Labs CP210x USB to UART Bridge (COMx)` under **Ports (COM and LPT)**.

If it still shows an unknown device, unplug the beacon, uninstall the unknown entry, and replug.

## macOS

Recent macOS versions include the driver. If the port does not appear, install the Silicon Labs VCP driver package for macOS and reboot once.

## Linux

Nothing to do. If the port does not appear, the cable is charge-only (see [USB Cable Types](usb-cable-types)).

## Verify

Open the port at 115200 baud and reset the board; you should see the boot banner and the `AEGIS:HELLO:` line. See [Serial Port Detection](serial-port-detection).

## Related

- [CH340 Driver Install](ch340-driver-install) for clone boards
- [Serial Adapter Troubleshooting](serial-adapter-troubleshooting)