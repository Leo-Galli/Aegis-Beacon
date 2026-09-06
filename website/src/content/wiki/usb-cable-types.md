---
title: USB Cable Types
description: "How to tell a data cable from a charge-only cable, and which cables work for flashing, serial and bridge use."
---

# USB Cable Types

Most "my beacon won't connect" reports end with a charge-only cable. This page is the quick guide to picking the right one.

## Data vs charge-only

- **Data cable**: all four wires (power + D+/D-). Works for flashing, serial, and the bridge.
- **Charge-only cable**: two wires (power only). Charges fine, never appears as a serial port.

There is no reliable way to tell them apart by look. Test: plug the cable between the beacon and a computer and check whether a COM port appears (see [Serial Port Detection](serial-port-detection)).

## What the beacon needs

| Task | Cable |
| --- | --- |
| Flashing | Data, short (under 1 m preferred) |
| Serial monitor / bridge | Data; length is less critical once uploaded |
| Bench power | Either, if you also have a data cable for serial |

## Common pitfalls

- **Braided "premium" cables are often charge-only** because they are sold as chargers.
- **Micro-USB connectors wear out.** If a board worked and now fails intermittently, replace the cable first.
- **Extension cables and adapters** add resistance and can drop bytes during uploads. Plug the beacon directly into the machine when flashing.

## Quick test without a computer

If you only have a phone charger, you cannot verify the data lines. If you have a laptop, plug in and run:

```bash
# Windows (PowerShell)
Get-CimInstance Win32_SerialPort | Select-Object DeviceID, Description
# macOS
ls /dev/cu.usb*
# Linux
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

A new port appearing while the beacon is plugged in means the cable carries data.

## Related

- [USB Connection Guide](usb-connection-guide)
- [USB Power vs Data](usb-power-and-data)