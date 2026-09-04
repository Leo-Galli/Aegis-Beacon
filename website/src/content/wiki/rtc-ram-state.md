---
title: "RTC RAM State"
description: "What survives deep sleep: boot and TX counters, scan hit log, GPS fix cache and the emergency flag"
---

# RTC RAM State

## Overview

The ESP32 keeps a small set of variables in **RTC RAM**, a memory region that stays powered during deep sleep and even across a full power cycle (as long as the RTC battery rail holds). This is how the beacon remembers its mode, its counters and its last GPS fix without touching flash.

## Persistent Variables

| Variable | Type | Meaning |
|----------|------|---------|
| `g_bootCycle` | uint32 | Increments every boot, survives deep sleep |
| `g_txCycles` | uint32 | Total TX cycles since manufacture |
| `g_scanCycles` | uint32 | Total scan cycles |
| `g_scanHits[20]` | ScanHit[] | Rolling log of the last 20 signal detections |
| `g_scanHitCount` | uint8 | Current entries in g_scanHits (max 20) |
| `g_currentMode` | DeviceMode | Active mode, restored after deep sleep |
| `g_emergencyActive` | bool | Emergency flag, persists across reboots |
| `g_rtcLat` | double | Last known GPS latitude |
| `g_rtcLng` | double | Last known GPS longitude |
| `g_rtcFixValid` | bool | Whether the RTC GPS cache is valid |

## ScanHit Structure

Each entry in the rolling hit log records:

| Field | Type | Description |
|-------|------|-------------|
| `freq` | float | Frequency in MHz |
| `rssi` | int16 | Peak RSSI in dBm during the dwell window |
| `timestamp` | uint32 | `millis()` at time of detection |
| `label` | char[12] | Signal class: WEAK / MEDIUM / STRONG |

The log is a ring buffer: when it reaches 20 entries the oldest hit is overwritten. SEARCH mode shows the most recent hit on the display, and the dashboard renders the full history as RSSI bar charts.

## Emergency Flag Persistence

`g_emergencyActive` is the most safety-critical RTC variable:

- Setting EMERGENCY mode (long-press SW_MODE, or the dashboard `/emergency` endpoint) sets the flag **before** entering continuous TX.
- Because the flag lives in RTC RAM, a battery swap or accidental reboot does **not** clear it - the device comes back up still transmitting.
- The only ways to clear it are entering CONFIG mode and saving, or a factory reset.

> [!WARNING]
> If a beacon you are testing is stuck in EMERGENCY mode after a reboot, this flag is why. Enter CONFIG mode (hold SW_SEL 3 s) and save to clear it.

## GPS Fix Cache

`g_rtcLat`, `g_rtcLng` and `g_rtcFixValid` store the last known position:

| Condition | Payload coordinates |
|-----------|---------------------|
| Fresh fix (less than 3 s old, at least 3 sats) | Current fix |
| Stale fix (RTC cache from previous boot) | Cached fix, marked stale |
| No fix and timeout expired | `PSN UNKN` |

This means the beacon can transmit a position even on the first cycle after a cold boot, before the GPS has re-acquired - the coordinates are the last place the operator was known to be.

## Related Pages

- [Power Management](/wiki/power-management) - what deep sleep does to the rest of the chip
- [Dashboard HTTP API](/wiki/dashboard-http-api) - the endpoints that read and set this state
- [Serial Debug System](/wiki/serial-debug-system) - the boot line reports the RTC boot counter
