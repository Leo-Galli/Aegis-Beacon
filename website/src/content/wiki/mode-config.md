---
title: "CONFIG Mode"
description: "The WiFi configuration dashboard: entering it, what each section does, and safe use"
---

# CONFIG Mode

## Overview

CONFIG mode starts a WiFi access point and serves the configuration dashboard on 192.168.4.1. It is the only mode that transmits no radio signal and runs no deep sleep, so battery drains fastest here - close the session when you are done.

## Entering CONFIG

1. Hold **SW_SEL** for 3 seconds.
2. The OLED shows the SSID, IP address and connection steps.
3. Join the `AegisBeacon` WiFi network (open).
4. Open `http://192.168.4.1` in a browser.
5. The captive portal may open automatically on phones.

## What You Can Configure

| Section | Settings |
|---------|----------|
| Mode | BEACON / SEARCH switch |
| Message | Base Morse message (max 64 chars) |
| Frequencies | Up to 10 frequencies |
| Power | -9 to +22 dBm |
| Morse speed | 5-40 WPM |
| Sleep | Beacon interval |
| Repeat | Payload repetitions |
| Scan | Dwell time, RSSI threshold |
| Identity | First/last name + enable |
| GPS | Enable, include in beacon, fix timeout |
| Audio | Volume + enable |
| OLED | Enable + invert |

## Saving

After changes:

1. Tap **Save**.
2. The device writes NVS and reboots into the selected mode.
3. The AP closes.

## Auto-Revert

If no client connects within 5 minutes, the device exits CONFIG automatically and returns to the previous mode. This prevents a forgotten open AP from draining the battery all day.

> [!WARNING]
> The AP is open (no password) and the dashboard has no authentication. Only use CONFIG mode in a trusted environment, and never leave the device in CONFIG during a deployment.

## Related Pages

- [WiFi Configuration Portal](/wiki/wifi-config-portal)
- [Dashboard HTTP API](/wiki/dashboard-http-api)
- [Configuration Reference](/wiki/configuration-reference)
- [Factory Reset and Recovery](/wiki/factory-reset-and-recovery)
