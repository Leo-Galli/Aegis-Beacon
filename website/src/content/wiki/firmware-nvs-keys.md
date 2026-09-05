---
title: Firmware NVS Keys
description: The Non-Volatile Storage keys the firmware uses to persist configuration, and how to read or reset them.
---

# Firmware NVS Keys

The ESP32's Non-Volatile Storage (NVS) partition is a small flash-backed key-value store. The firmware keeps its whole configuration there, so settings survive power loss and reboots.

## Key layout

| Key | Type | Content |
| --- | --- | --- |
| `cfg` | blob | The full configuration struct, versioned |
| `gps_last` | blob | Last valid GPS fix (lat, lon, altitude, age) |
| `boot_count` | u32 | Number of boots, used by diagnostics |
| `cal_rssi` | i32 | RSSI calibration offset, if applied |

## Why one blob

The configuration is stored as a single versioned blob rather than dozens of individual keys. This makes the config atomic: either the whole blob is valid or it is replaced by defaults. The first field of the blob is a magic number plus a version, so firmware updates can migrate old layouts (see [Changelog](changelog) for the v4 to v5 migration).

## Reading the store

When the firmware boots:

1. `nvs_flash_init()` opens the default partition.
2. The `cfg` blob is read.
3. If the magic or version mismatches, defaults are written back.

## Resetting

Factory reset (MODE + SEL held for 5 seconds, see [Factory Reset and Recovery](factory-reset-and-recovery)) erases the `cfg` key and rewrites defaults. The GPS fix is also cleared so the device does not transmit stale coordinates after a reset.

## Using the serial debugger

With the serial debug build, `config dump` prints every key in the store. This is the fastest way to confirm what the device thinks its configuration is.

## Related pages

- [NVS Configuration Store](nvs-configuration-store) for the full design
- [Firmware Config Load](firmware-config-load) for the boot-time loading
- [Factory Reset and Recovery](factory-reset-and-recovery) for the reset procedure