---
title: USB Connection Guide
description: "How to connect the beacon to a computer or phone over USB: ports, cables, drivers and what you can do once connected."
---

# USB Connection Guide

The beacon's only wired interface is USB. Over that one cable you can flash firmware, watch debug logs, run serial commands, and stream GPS positions to the website through the [serial bridge](serial-bridge-guide). This page covers the connection itself.

## What the USB port is

The ESP32 DevKit V1 exposes its UART through an onboard USB-serial chip. From the computer's point of view the beacon looks like a serial port, not a disk or a network device. Two common chips are used:

- **CP2102 / CP210x** (Silicon Labs) on most DevKit V1 boards.
- **CH340** on many clones.

The chip matters only for drivers. See [CP210x Driver Install](cp210x-driver-install) and [CH340 Driver Install](ch340-driver-install).

## The three USB jobs

One cable, three uses, no replugging needed:

| Job | How |
| --- | --- |
| Flash firmware | `pio run -t upload` (PlatformIO) or esptool over the same port |
| Talk to the device | Any serial monitor at 115200 baud (see [Serial Monitor Guide](serial-monitor-guide)) |
| Report positions | Run `bridge/aegis-serial-bridge.py`; the bridge reads the same port |

## Cable checklist

- Use a **data** cable. Many cables sold for charging only carry power; the beacon will light up but never appear as a serial port.
- Short, decent-quality cables are more reliable for flashing. Long thin cables can drop bytes during uploads.
- USB 2.0 is plenty; nothing here needs USB 3 speeds.

## Port naming

| OS | Typical name | Notes |
| --- | --- | --- |
| Windows | `COM3`, `COM5` | See Device Manager under Ports (COM and LPT) |
| macOS | `/dev/cu.usbserial-*` or `/dev/cu.usbmodem*` | The `cu.` variant is the one to use |
| Linux | `/dev/ttyUSB0` or `/dev/ttyACM0` | Check `ls /dev/tty*` before and after plugging in |

See [Serial Port Detection](serial-port-detection) for finding the exact name.

## First connection

1. Plug the beacon in with a known-good data cable.
2. Install the driver for your USB-serial chip if the port does not appear.
3. Open a serial monitor at **115200 baud** and press the EN button on the board.
4. You should see the boot banner and the `AEGIS:HELLO:ver=5.5;...` line.

If nothing appears, go to [Serial Adapter Troubleshooting](serial-adapter-troubleshooting).

## Phones

Android phones can drive the beacon over USB with an OTG adapter; iOS devices cannot run a serial terminal or the bridge, but can still open position links. See [Android OTG Guide](android-otg-guide) and [Termux Serial Bridge](termux-serial-bridge).

## Related

- [USB Power vs Data](usb-power-and-data) for powering the board safely
- [USB Cables](usb-cable-types) for choosing cables
- [Bridge Troubleshooting](bridge-troubleshooting) when the bridge cannot open the port