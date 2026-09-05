---
title: How Firmware Loads Configuration
description: "The boot-time config path: NVS read, validation, defaults on failure, and the emergency flag check order."
---

# How Firmware Loads Configuration

At boot the firmware must decide what settings to use. The order of operations determines a lot of edge-case behavior.

## The load sequence

1. Read the NVS namespace.
2. If NVS is empty or corrupt, log the error and use hardcoded defaults.
3. Validate each value against its allowed range; out-of-range values fall back to defaults.
4. Restore the emergency flag from RTC RAM.
5. Restore mode, counters, and GPS cache from RTC RAM.
6. Apply the config to the hardware (radio, OLED, GPS, audio).

## NVS keys

Each setting has a key (e.g. `freq1`, `power`, `wpm`, `sleep`, `name1`, `name2`, `gpsen`, `freqs[]`). The full list is on the configuration reference page.

## Validation rules

| Setting | Valid range | Fallback |
|---------|-------------|----------|
| Frequency | 410-525 MHz | 433.500 |
| TX power | -9 to +22 dBm | +17 |
| WPM | 5-40 | 13 |
| Sleep | 1-300 s | 10 |
| Dwell | 50-2000 ms | 400 |
| RSSI threshold | -120 to -40 dBm | -90 |
| Repeat count | 1-10 | 1 |

## The defaults file

The firmware header defines `DEFAULT_*` constants. Editing and recompiling changes the out-of-box behavior. The dashboard can override all of them at runtime, stored in NVS.

## The emergency flag check

The emergency flag is checked *before* the mode is restored. If set, the firmware boots directly into EMERGENCY regardless of the saved mode. This is the "cannot be cancelled remotely" property: only CONFIG mode (or a factory reset) clears it.

## Corrupt config behavior

If NVS read fails, the firmware logs `[NVS] read fail, using defaults` and continues. The beacon works, but your settings are lost. A factory reset (MODE+SEL at boot) wipes NVS cleanly and restores defaults.

## Why this matters in the field

If a beacon behaves "wrong" after a crash, first suspect stale NVS: re-save from the dashboard or factory reset. Stale settings (e.g. a power left at -9 dBm from a bench test) look like hardware failure but are just config.