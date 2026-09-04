---
title: "Dashboard HTTP API"
description: "Captive portal access point settings and the /status, /save, /emergency and /factory endpoints"
---

# Dashboard HTTP API

## Overview

In CONFIG mode the ESP32 starts a WiFi access point and serves a single-page dashboard. The dashboard talks to the device over a small HTTP API with four endpoints.

## Access Point Settings

| Parameter | Value |
|-----------|-------|
| SSID | `AegisBeacon` |
| Password | Open (none) |
| IP address | `192.168.4.1` |
| Captive portal | DNS redirects all domains to the portal |
| Auto-revert | 5 minutes without a client (`CONFIG_AP_TIMEOUT = 300000 ms`) |

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Dashboard HTML (single-page app) |
| `/status` | GET | Device status: heap, cycles, GPS, battery, uptime |
| `/save` | POST | Saves JSON config body to NVS and reboots |
| `/emergency` | POST | Sets EMERGENCY mode flag and reboots |
| `/factory` | POST | NVS wipe + reboot (factory reset) |

> [!NOTE]
> v5.4 consolidated the v4.0 endpoints `/api/config`, `/api/scan`, `/api/tx`, `/api/hits` and `/api/hits/clear`. Scan history is now embedded in the dashboard page itself; `/status` covers all live device state.

## Reading /status

A typical `/status` response reports:

- Boot cycle count
- Free heap
- Cumulative TX cycles
- Cumulative scan cycles
- Active mode
- GPS fix state + satellite count
- Battery percentage
- Live WPM and volume

This is the same data the dashboard shows in its device-status panel, refreshed every few seconds.

## Saving Configuration

POST a JSON body to `/save` with the NVS keys you want to change. The device writes the values to NVS and reboots into the selected mode. Unknown or out-of-range keys fall back to firmware defaults.

## Emergency and Factory

| Endpoint | Effect |
|----------|--------|
| `/emergency` | Sets the RTC emergency flag, then reboots into continuous max-power TX |
| `/factory` | Erases the whole `aegis` NVS namespace and reboots clean |

> [!WARNING]
> `/factory` permanently erases your frequency plan, message, name and all settings. There is no undo - reconfigure everything afterwards.

## Manual Access

1. Hold **SW_SEL** for 3 seconds to enter CONFIG mode.
2. Join the `AegisBeacon` WiFi network (open).
3. Open `http://192.168.4.1` in a browser.
4. If the captive-portal popup does not appear, open any non-HTTPS site to trigger the redirect.

## Related Pages

- See [WiFi Configuration Portal](/wiki/wifi-config-portal) for the dashboard UI walkthrough.
- See [RTC RAM State](/wiki/rtc-ram-state) for how the emergency flag survives power cycles.
