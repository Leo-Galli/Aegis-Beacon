---
title: "NVS Configuration Store"
description: "How the ESP32 Non-Volatile Storage holds settings, what survives power cycles, and how save and factory reset interact with it"
---

# NVS Configuration Store

## Overview

The beacon stores all runtime configuration in the ESP32 Non-Volatile Storage (NVS). NVS survives power cycles, so when the device reboots it loads the last saved configuration rather than the compile-time defaults — unless NVS is empty, corrupt, or erased.

NVS is the reason you can configure the beacon once and have it remember frequencies, power, WPM, name, GPS options, audio, OLED, and mode across reflashes and reboots, as long as you saved.

## What Lives in NVS

Every setting the user can change in CONFIG ends up in NVS under the `aegis` namespace. The key names are intentionally short to reduce NVS per-key overhead.

### Radio and beacon

- Frequencies: one key per slot, `freq0` through `freq9`.
- Message text.
- TX power.
- Sleep interval.
- Repeat count.

### Morse and identity

- WPM.
- Name-in-beacon flag.
- First name.
- Last name.

### Audio and display

- Audio enable flag.
- Audio volume.
- OLED enable flag.
- OLED invert flag.

### GPS

- GPS enable flag.
- GPS-in-beacon flag.
- GPS fix timeout.

### Scan

- Scan dwell time.
- RSSI threshold.

### Mode and system

- Active mode.
- Button potentiometer enable flags.
- Auto-switch flag.

## How Save Works

When you save in CONFIG, the dashboard posts the current configuration to the device as JSON. The device deserializes it and writes the keys to NVS. After a successful write, the device reboots into the selected mode.

Saving does not require a reflash. It is purely an NVS write plus reboot.

## How Factory Reset Works

Factory reset erases the entire `aegis` NVS namespace. After a factory reset, the device boots with the compile-time defaults. This is the only way to fully clear the configuration.

Factory reset is irreversible. All frequencies, message, name, GPS settings, audio, OLED, scan settings, and mode are lost and must be reconfigured.

## Empty or Corrupt NVS

If NVS is empty, corrupt, or missing a key, the firmware falls back to the hardcoded defaults for that key. A partial NVS — for example, one that has some keys but not others — still results in a working device, because each missing key is replaced by its default.

This fail-safe design means the beacon is always functional after a factory reset or first flash, even though the saved configuration is gone.

## NVS During Reflash

Reflashing firmware does not automatically erase NVS. Your saved configuration survives a reflash unless you explicitly erase it. If you change firmware in a way that adds or renames keys, the old keys remain in NVS and the new firmware uses defaults for any key it does not recognize.

If you need a clean configuration state after a firmware change, use factory reset rather than relying on the reflash to clear it.

## Storage Limits

NVS is not large. It is fine for the beacon's configuration because the data is small: a handful of floats, integers, flags, and short strings. It is not suitable for logs, scan history, or arbitrary data. Those remain in RAM or are not stored at all.

## Related Pages

- [Configuration Reference](/wiki/configuration-reference) — every NVS key, type, default, and range.
- [Factory Reset and Recovery](/wiki/factory-reset-and-recovery) — how to reset and recover.
- [Dashboard HTTP API](/wiki/dashboard-http-api) — the `/save`, `/emergency`, and `/factory` endpoints.
