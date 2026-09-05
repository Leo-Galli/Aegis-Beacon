---
title: "Dashboard Rendering"
description: "How the CONFIG dashboard HTML is stored in flash, served by the web server, and why the page can be updated by changing the firmware"
---

# Dashboard Rendering

## Overview

The CONFIG dashboard is not a separate web app you deploy to the device. It is embedded in the firmware as a single block of HTML, stored in program memory, and served by the ESP32 web server when a client connects to the access point.

That means the dashboard is part of the firmware. To change the dashboard, you update the firmware source and rebuild. There is no separate dashboard bundle and no runtime dashboard update path.

## How the Dashboard Is Stored

The dashboard HTML lives in flash as a raw string literal in the firmware source. It is too large to keep on the stack or in RAM, so it is placed in program memory and sent to clients directly from there.

In the source, the dashboard is a single constant that contains the full HTML document: the page structure, the inline styles, the interactive controls, and the script that runs in the browser.

The dashboard is not fetched from elsewhere at runtime. What you flash is what the device serves.

## How It Is Served

When a client connects to the access point and requests the root URL, the web server responds with the dashboard HTML from flash. The server sends it with the right content type so the browser renders it as a page.

The dashboard then runs entirely in the browser:

- The styling is inline in the page.
- The controls are standard HTML inputs.
- The interactivity is a small script that reads and writes the form and calls the device API.

The device itself serves only the page and the API endpoints. There is no CDN, no external stylesheet, and no runtime asset loading.

## Why the Dashboard Changes With Firmware

Because the dashboard is part of the firmware literal, a change to the dashboard shows up only after you rebuild and reflash. If you want to add a field, change a label, or adjust the layout, you edit the literal in the source and flash the new firmware.

This is different from a hosted web app where the frontend can be updated independently. Here, the frontend and firmware are shipped together.

## What the Dashboard Contains

The dashboard is the CONFIG mode interface. It includes:

- Mode toggle between BEACON and SEARCH, with a live Morse payload preview.
- Beacon settings: message, TX power, sleep interval, repeat count.
- Identity settings: name-in-beacon toggle and first/last name fields.
- GPS settings: enable, include-in-payload toggle, fix timeout, coordinate display.
- Button control reference for the four physical buttons.
- Search settings: frequency list, dwell time, RSSI threshold.
- Audio settings: enable, volume, WPM.
- Radio settings: TX power with the SX1262 range.
- Display settings: OLED enable and invert.
- Device status panel with live values from `/status`.
- Scan hit history from the live device.
- Emergency activation.
- Save, refresh status, and factory reset controls.

## Dashboard and the Web Site Demo

The project web site includes a standalone demo of the same dashboard so you can see how it looks and behaves without the device. The demo loads the dashboard HTML extracted from the firmware source and wraps it in the site chrome.

That demo is generated from the same firmware literal. When the firmware dashboard changes, the site demo is regenerated from the updated literal so it stays in sync.

## Implications for Customization

If you want a custom dashboard, you must edit the firmware source. The dashboard is not pluggable. You can change text, fields, layout, and script, but you must rebuild and reflash to see the change on the device.

For many users this is intentional: the dashboard is a field configuration tool, not a customizable web app. It is shipped with the device firmware so the device always serves the dashboard that matches its firmware version.

## Related Pages

- [WiFi Configuration Portal](/wiki/wifi-config-portal) — how to use the dashboard.
- [Dashboard HTTP API](/wiki/dashboard-http-api) — the API the dashboard calls.
- [Config Dashboard Demo](/config-dashboard) — the live demo extracted from the firmware.
