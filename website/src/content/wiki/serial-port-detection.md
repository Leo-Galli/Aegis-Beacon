---
title: Serial Port Detection
description: "Find the beacon's serial port on Windows, macOS and Linux, including what the port is called and how to verify it is the right one."
---

# Serial Port Detection

Before you can flash, monitor, or run the [serial bridge](serial-bridge-guide), you need the port name. The bridge auto-detects it; the steps below are for when you want to find it yourself.

## Windows

1. Open Device Manager (right-click Start, or `devmgmt.msc`).
2. Expand **Ports (COM and LPT)**.
3. The beacon appears as something like `Silicon Labs CP210x USB to UART Bridge (COM5)` or `USB-SERIAL CH340 (COM3)`.
4. The `COMx` name is the port.

Quick check with the port name in hand:

```powershell
Get-CimInstance Win32_SerialPort | Select-Object DeviceID, Description
```

## macOS

```bash
ls /dev/cu.usb*
```

Plug the beacon in and run the command again; the new entry is your port, typically `/dev/cu.usbserial-XXXX` (CP210x) or `/dev/cu.usbmodemXXXX` (native USB). Use the `cu.` variant, not `tty.`.

## Linux

```bash
# before
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
# plug in, then:
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

The new device is the port. If you are not in the `dialout` group (Debian/Ubuntu), add yourself with `sudo usermod -aG dialout $USER` and log out and back in, or you will get permission errors.

## Verifying it is the beacon

Open the port at 115200 baud and reset the board. The boot banner plus an `AEGIS:HELLO:ver=5.5;...` line are proof you have the right port:

```bash
# any terminal emulator or the bridge in verbose mode
python bridge/aegis-serial-bridge.py --verbose
```

## When auto-detection fails

The bridge scores ports by known USB-serial chip IDs (CP210x, CH340, FTDI, ESP32-S3 native). If your board uses an unusual chip, pass the port explicitly:

```bash
python bridge/aegis-serial-bridge.py --port COM7
```

## Related

- [USB Connection Guide](usb-connection-guide)
- [CP210x Driver Install](cp210x-driver-install)
- [CH340 Driver Install](ch340-driver-install)
- [Serial Adapter Troubleshooting](serial-adapter-troubleshooting)