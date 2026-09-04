---
title: "Operating Modes"
description: "BEACON, SEARCH, CONFIG and EMERGENCY: what each mode does, when to use it and how to switch"
---

# Operating Modes

## Overview

The Aegis-Beacon has four operating modes, each designed for specific scenarios. Use the MODE button to switch between BEACON and SEARCH modes.

## BEACON Mode

> [!INFO]
> **Primary emergency mode.** Transmits Morse SOS + GPS on all configured frequencies.

### Operation

1. Disables WiFi and Bluetooth (~120 mA saved)
2. Reads buttons for live VOL/WPM updates
3. Builds Morse payload (base + name + GPS)
4. Iterates through all configured frequencies
5. Initializes SX1262 in CW mode
6. Transmits full payload (repeated N times)
7. Emits Morse click tones through GPIO 25
8. Updates OLED with frequency and progress
9. Enters deep sleep for configured interval
10. Wakes and repeats

### Morse Timing (PARIS Standard)

| Element | Duration |
|---------|----------|
| Dot | `1200 / WPM` ms |
| Dash | `3 x dot` ms |
| Intra-character gap | `1 x dot` ms |
| Inter-character gap | `3 x dot` ms |
| Word gap | `7 x dot` ms |

**Example at 13 WPM:** dot = 92 ms, dash = 277 ms

| Payload | Duration |
|---------|----------|
| `SOS` | ~2.7 s |
| `SOS DE MARIO ROSSI` | ~15 s |
| `SOS PSN N4553 E01230` | ~18 s |
| `SOS DE MARIO ROSSI PSN N4553 E01230` | ~45 s |

> [!TIP]
> Use shorter names and higher WPM to reduce cycle time in emergency situations.

### LED Indicator

**Red LED blinks** during transmission.

## SEARCH Mode

> [!INFO]
> **Continuous scan mode** for locating other beacons.

### Operation

1. Disables WiFi and Bluetooth
2. Loops through all frequencies indefinitely
3. Opens FSK receive window
4. Measures peak RSSI over dwell period
5. Emits rising-pitch audio tone
6. Updates OLED with RSSI bar
7. Logs detections to RTC RAM
8. Blinks blue LED on detection

### Audio Alert

| Signal Strength | Tone |
|-----------------|------|
| No signal | Silence |
| Weak (-90 to -80 dBm) | 440 Hz rising |
| Medium (-80 to -60 dBm) | ~880 Hz |
| Strong (>= -60 dBm) | up to 2200 Hz |

> [!TIP]
> The audio behaves like a metal detector -- pitch rises as signal gets stronger.

### LED Indicator

**Blue LED blinks** slowly during scan, fast on detection.

## CONFIG Mode

> [!INFO]
> **WiFi configuration portal** for field settings.

### Operation

1. Starts WiFi AP (`AegisBeacon`, open)
2. DNS redirects all domains to `192.168.4.1`
3. Serves full dashboard at `http://192.168.4.1`
4. OLED shows SSID, IP, and instructions
5. Captive portal appears on phones
6. After saving, reboots into selected mode
7. Auto-reverts after 5 minutes if no client

### Access

1. Hold **SEL** button for 3 seconds
2. Connect to `AegisBeacon` WiFi
3. Open `http://192.168.4.1`
4. Configure and save

### LED Indicator

**Both LEDs blink** alternately.

## EMERGENCY Mode

> [!WARNING]
> **Maximum power mode.** Use only in critical situations. Consumes maximum battery.

### Operation

- Maximum TX power (+22 dBm / +30 dBm with PA)
- Message repeated 3x per frequency
- Full payload always transmitted
- **No deep sleep** -- continuous transmission
- OLED shows alternating inverse SOS
- Continuous audio tone at 1760 Hz
- Flag persisted in RTC RAM

### Activation

1. Hold **MODE** button for 2 seconds, OR
2. Use Emergency button in CONFIG dashboard

### Deactivation

Enter CONFIG mode and save -- clears the emergency flag.

### LED Indicator

**Red LED blinks fast.**

## Mode Comparison

| Mode | Power | Sleep | Audio | GPS |
|------|-------|-------|-------|-----|
| **BEACON** | +17 dBm | Yes (10-300s) | Morse clicks | Optional |
| **SEARCH** | Rx only | No | Rising tone | No |
| **CONFIG** | WiFi AP | No | Silent | No |
| **EMERGENCY** | +22/+30 dBm | No | Continuous | Yes |

## Battery Life by Mode

| Mode | Sleep | GPS | Runtime |
|------|-------|-----|---------|
| BEACON | 10s | Off | ~65 hours |
| BEACON | 10s | On | ~45 hours |
| BEACON | 30s | Off | ~130 hours |
| SEARCH | Continuous | Off | ~44 hours |
| EMERGENCY | Continuous | On | ~12 hours |

> [!NOTE]
> At -20C with standard Li-ion, expect 40-60% of these figures. Use LiFePO4 for alpine deployments.
