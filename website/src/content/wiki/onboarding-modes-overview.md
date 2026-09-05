---
title: Understanding the Modes in One Page
description: BEACON, SEARCH, CONFIG and EMERGENCY explained with a real-world example for each.
---

# Understanding the Modes in One Page

The beacon has four modes. Each maps to a real situation.

## BEACON (transmit SOS)

**Situation: you need to be found.** The beacon cycles through your configured frequencies, transmitting SOS (plus name and GPS if enabled) in Morse at each one, then enters deep sleep to save battery.

Defaults: +17 dBm, 10 s sleep between cycles, repeat once per frequency.

## SEARCH (listen for others)

**Situation: you are a rescuer looking for a beacon.** The beacon scans every configured frequency, measures RSSI on each, and gives an audio alert whose pitch rises with signal strength, like a metal detector. Detections are logged to the RTC RAM hit log.

Defaults: 400 ms dwell per frequency, -90 dBm threshold.

## CONFIG (change settings)

**Situation: you need to change frequency, power, or your name without reflashing.** Hold SEL for 3 seconds and the beacon becomes a WiFi access point with a captive-portal dashboard at 192.168.4.1. Every parameter is editable from a browser.

## EMERGENCY (maximum effort)

**Situation: a life is on the line.** Maximum power (+22 dBm), continuous transmission, full payload with name and GPS, no deep sleep, 1760 Hz audible tone, and a persisted flag that survives reboots so the beacon keeps screaming even if it restarts. Cleared by entering CONFIG and saving.

Activate by holding MODE for 2 seconds. Deactivate the same way, or from the dashboard.

## One rule of thumb

- Need to be heard: BEACON.
- Looking for someone: SEARCH.
- Changing settings: CONFIG.
- Life-threatening emergency: EMERGENCY.