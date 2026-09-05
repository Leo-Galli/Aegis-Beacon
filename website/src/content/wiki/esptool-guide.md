---
title: esptool Guide
description: "The low-level ESP32 flashing tool: when to use it, the key commands, and the recovery procedures PlatformIO cannot do."
---

# esptool Guide

esptool is the low-level tool under every ESP32 flasher. PlatformIO and the Arduino CLI call it for you; knowing it directly is how you recover a bricked board.

## Install

```bash
pip install esptool
```

Or use the copy bundled with PlatformIO (`python -m esptool`).

## The essential commands

| Command | Purpose |
| --- | --- |
| `esptool.py chip_id` | Confirm the chip and connection |
| `esptool.py --port COM3 flash_id` | Read the flash chip |
| `esptool.py --port COM3 erase_flash` | Erase everything |
| `esptool.py --port COM3 write_flash 0x0 firmware.bin` | Write a raw image |
| `esptool.py --port COM3 read_flash 0 1M dump.bin` | Backup the flash |

## When to use it directly

- **Flash locked or write-protected**: `esptool` reports the chip state clearly.
- **Erase before a clean install**: a full `erase_flash` fixes most post-upgrade corruption.
- **Recovering a board that will not enter flash mode**: `esptool` with the `--before default_reset` sequence and the chip forced into download mode.
- **Reading a bricked board's bootloader** for diagnosis.

## The reset dance

Most ESP32 boards: hold BOOT, press EN, release BOOT. esptool prints:

```
Chip is ESP32-D0WD-V3 (revision 3)
```

when it connects. If it hangs on "Connecting...", the board is not in download mode.

## The partition layout

The beacon uses the default 4 MB layout with the NVS partition the firmware writes (see [ESP32 Flash Partitions](esp32-flash-partitions)). When flashing raw, write the bootloader at 0x1000, the partition table at 0x8000, and the app at 0x10000. PlatformIO does this automatically; manual flashing is for recovery only.

## Related pages

- [Flash Troubleshooting](flash-troubleshooting) for the error map
- [ESP32 Flash Partitions](esp32-flash-partitions) for the layout
- [Factory Reset and Recovery](factory-reset-and-recovery) for the firmware path