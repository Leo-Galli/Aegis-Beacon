---
title: USB-Serial Adapter Troubleshooting
description: "Diagnose why the beacon does not show up as a serial port: drivers, cables, permissions, ports in use and brown-outs."
---

# USB-Serial Adapter Troubleshooting

The beacon does not appear as a serial port. Work through this list top to bottom; most cases are solved by one of the first three.

## 1. Cable

A charge-only cable powers the board but carries no data. Swap to a known data cable (see [USB Cable Types](usb-cable-types)). This is the single most common cause.

## 2. Driver

If the port still does not appear on Windows/macOS, the USB-serial chip needs its driver: [CP210x Driver Install](cp210x-driver-install) or [CH340 Driver Install](ch340-driver-install). On Device Manager, look under "Other devices" for a device without a driver.

## 3. Permissions (Linux/macOS)

- Linux: add yourself to the `dialout` group: `sudo usermod -aG dialout $USER`, log out and back in.
- macOS: grant the terminal app access under System Settings, Privacy and Security.

## 4. Port busy

Only one program can hold a serial port at a time. If the Arduino IDE, PlatformIO monitor, or a previous bridge instance is running, the port is locked. Close them all, then retry. On Linux you can check with `lsof /dev/ttyUSB0`.

## 5. Brown-out on USB power

If the board boots in a loop while USB is the only power source, the supply is weak. Use a powered hub, a better cable, or keep the 18650 installed (see [USB Power vs Data](usb-power-and-data)).

## 6. Wrong port picked

With several USB-serial devices attached, the bridge or monitor may open the wrong one. Unplug everything else, or pass the port explicitly (`--port COMx` / `--port /dev/ttyUSB0`). See [Serial Port Detection](serial-port-detection).

## 7. Hardware

If none of the above helps, test the board with a known-good ESP32 and a different machine. A dead onboard USB-serial chip is rare but possible; the board can still run from a separate USB-UART adapter wired to TX/RX/EN/IO0.

## Related

- [USB Connection Guide](usb-connection-guide)
- [Bridge Troubleshooting](bridge-troubleshooting)