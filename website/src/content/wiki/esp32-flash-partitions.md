---
title: ESP32 Flash and Partitions
description: How the 4 MB flash is laid out, why partition tables matter, and what happens on a corrupt NVS area.
---

# ESP32 Flash and Partitions

The ESP32 boots from external flash. Understanding the layout explains a lot of "weird" firmware behavior.

## The 4 MB flash

Most DevKit V1 boards carry 4 MB of SPI flash at the default address. The flash holds:

- The bootloader.
- The partition table.
- The application (firmware).
- The NVS area where your settings live.
- The OTA area (if OTA partitions are defined).

## The default partition table

The standard `default.csv` table used by this project:

| Partition | Approx size | Purpose |
|-----------|-------------|---------|
| nvs | 20 KB | Settings, calibration, persistent state |
| otadata | 8 KB | OTA bookkeeping (unused in single-app builds) |
| app0 | 1.3 MB | The firmware |
| app1 | 1.3 MB | Second slot for OTA (unused here) |
| spiffs | 1.5 MB | Unused in this project |

## What NVS is

Non-Volatile Storage is a key-value store in flash. The beacon stores its configuration there (frequency, power, WPM, names, GPS settings) and reads it at boot with hardcoded fallbacks if the area is empty or corrupt.

## Corrupt NVS behavior

If the NVS area is corrupted (power loss mid-write, failed flash), the firmware detects the error, logs it, and falls back to defaults. This is the NVS fail-safe design: the beacon still works, you just lose your settings.

## Why partition size matters

If you flash firmware larger than the app partition, the upload succeeds but the boot fails with a "partition table invalid" or "app partition too small" error. If you see that, check that you selected the 4 MB flash size in the IDE (Tools → Flash Size → 4 MB), not the default 1.2 MB.

## Factory reset and flash

- Factory reset (MODE+SEL at boot) erases the NVS area only.
- A full `esptool erase_flash` wipes everything including the bootloader, after which you must reflash the whole image.
- Reflashing the app does not clear NVS unless you explicitly erase it.