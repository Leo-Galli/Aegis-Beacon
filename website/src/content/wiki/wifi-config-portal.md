---
title: "WiFi Configuration Portal"
description: "Technical documentation for WiFi Configuration Portal"
---

# WiFi Configuration Portal

## Overview

The CONFIG mode provides a web-based dashboard for field configuration without reflashing firmware. Access via any WiFi-enabled device.

## Accessing the Portal

### Step 1: Start WiFi AP

Hold **SEL** button for 3 seconds. The OLED displays:

```
CONFIGURATION MODE
SSID: AegisBeacon
URL: 192.168.4.1

1. Connect to WiFi
2. Open browser
3. Configure settings
```

### Step 2: Connect to WiFi

On your phone or laptop:

1. Open WiFi settings
2. Select network: **AegisBeacon**
3. Wait for connection (open, no password)
4. Captive portal should appear automatically

### Step 3: Open Dashboard

If captive portal doesn't appear:

- Open browser manually
- Navigate to `http://192.168.4.1`

> [!TIP]
> Most phones show a captive portal popup automatically. If not, try opening a non-HTTPS website to trigger the redirect.

## Dashboard Sections

### Mode Toggle

Switch between BEACON and SEARCH modes:

- Physical-style switch with payload preview
- Shows full Morse message as you configure
- Real-time dots/dashes preview

### Identity Settings

Configure operator name:

- **First Name:** Appended after `DE` in Morse
- **Last Name:** Part of operator callsign
- **Enable Toggle:** Include name in beacon

**Example:** `SOS DE MARIO ROSSI PSN N4553 E01230`

### GPS Settings

Configure GPS module:

- **Enable/Disable:** Turn module on/off
- **Include in Beacon:** Add coordinates to Morse
- **Fix Timeout:** 10-120 seconds wait time
- **Live Coordinates:** Current position display

### Frequency Manager

Add/remove up to 10 frequencies:

- **Primary Frequency:** First in list
- **Add Frequency:** Tap "+" and enter MHz
- **Remove Frequency:** Tap "x" on frequency
- **Range:** 410-525 MHz

### Audio Controls

| Control | Range | Default |
|---------|-------|---------|
| **Volume** | 0-255 | 180 (~70%) |
| **Master Enable** | On/Off | On |

### OLED Controls

| Control | Options |
|---------|---------|
| **Enable** | On/Off |
| **Invert** | Normal/Inverted |

> [!TIP]
> Invert mode improves readability in bright sunlight.

### TX Power

Adjust transmission power:

- **Range:** -9 to +22 dBm
- **Default:** +17 dBm
- **E22 PA:** Adds additional gain

### Morse Speed

Adjust words per minute:

- **Range:** 5-40 WPM
- **Default:** 13 WPM
- **Preview:** Shows dot duration

### Sleep Interval

Adjust deep sleep between TX cycles:

- **Range:** 1-300 seconds
- **Default:** 10 seconds
- **Trade-off:** Longer sleep = longer battery life, slower beacon rate

### Scan Settings

For SEARCH mode:

- **Dwell Time:** 50-2000 ms per frequency
- **RSSI Threshold:** -120 to -40 dBm

## Battery Panel

Live battery information:

| Metric | Description |
|--------|-------------|
| **Voltage** | Real-time mV reading |
| **Percentage** | Calculated from Li-ion curve |
| **Bar Chart** | Visual representation |
| **Charging** | Shows "CHG" when charging |

### Battery Curve

| Voltage | Percentage |
|---------|------------|
| 4.20V | 100% |
| 4.05V | 90% |
| 3.90V | 75% |
| 3.75V | 60% |
| 3.65V | 50% |
| 3.55V | 35% |
| 3.40V | 20% |
| 3.20V | 10% |
| 3.00V | 0% |

## Device Status

Real-time device information:

- **Boot Cycles:** Total power-ons
- **Free Heap:** Available memory
- **GPS Fix:** Current status
- **Satellites:** GPS satellite count
- **Live WPM:** Current Morse speed
- **Live Volume:** Current audio level

## Save & Reboot

After making changes:

1. Tap **Save** button
2. Settings stored to NVS
3. Device reboots into selected mode
4. WiFi AP closes

> [!WARNING]
> If no client connects within 5 minutes, the device automatically reverts to the previous mode.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to WiFi | Hold SEL for 3s, ensure WiFi is on |
| Portal doesn't load | Try `http://192.168.4.1` directly |
| Settings not saving | Hold SEL 1s to force NVS save |
| Device reverts mode | Wait 5 minutes (auto-revert) |
