---
title: "Project Overview"
description: "Technical documentation for Project Overview"
---

# Project Overview

> [!NOTE]
> **Aegis-Beacon** is an open-source, ultra-low-cost emergency rescue beacon designed for avalanche survival, backcountry emergencies, and SAR operations.

## What is Aegis-Beacon?

Aegis-Beacon is a professional emergency radio-location system based on LoRa technology. It fits in a jacket pocket, costs around **$23-28** to build, and can operate for **70+ hours** on a single 18650 cell in BEACON mode.

### Key Statistics

| Metric | Value |
|--------|-------|
| **Total BOM Cost** | `~$23-28 USD` |
| **Frequency Range** | `410-525 MHz` |
| **Max Range (LOS)** | `15 km` |
| **Deep Sleep Current** | `10 uA` |
| **Operating Modes** | `4` |
| **Display** | `SSD1309 2.42" OLED` |

## Core Features

### Radio & Transmission

- **SX1262 CW keying** -- manual FSK carrier on/off
- **Up to +22 dBm** via RadioLib; **+30 dBm** with E22-400M30S PA
- **Frequency hopping** -- up to 10 configurable frequencies per cycle
- **PARIS-standard Morse timing** -- dot / dash / gaps calibrated to WPM

### GPS & Battery

- **NEO-6M GPS module** on UART2 (GPIO 22 RX, GPIO 12 TX)
- **Coordinates in Morse** -- compact DDM format: `N4553 E01230`
- **Battery monitor** -- live percentage and voltage via voltage divider
- **Charging detection** -- CHG shown when TP4056 STDBY pin detects charge

### Physical Controls

- **4-button panel** -- MODE, SEL, UP, DN for instant mode switching
- **Live adjustment** -- VOL/WPM adjustable without opening config portal
- **Auto-repeat** -- hold UP/DN for fast repeat after 500 ms
- **Factory reset** -- hold MODE + SEL at boot for 5 s

## Operating Modes

| Mode | Description | Power |
|------|-------------|-------|
| **BEACON** | Transmits Morse SOS + GPS on all configured frequencies | `+17 dBm` |
| **SEARCH** | Scans all frequencies, measures RSSI, audio alert on detection | `Rx only` |
| **CONFIG** | WiFi AP mode with captive portal dashboard | `WiFi AP` |
| **EMERGENCY** | Maximum power continuous TX with full payload, no deep sleep | `+22 dBm` |

> [!WARNING]
> EMERGENCY mode consumes maximum power. Use only in critical situations where immediate rescue communication is required.

## Quick Links

- **[Quick Start Guide](/wiki/quick-start-guide)** -- Get started in 5 minutes
- **[Hardware Components](/wiki/hardware-components)** -- Full BOM and wiring
- **[Assembly Guide](/wiki/assembly-guide)** -- Step-by-step build instructions
- **[Firmware Overview](/wiki/firmware-overview)** -- Code structure and dependencies
- **[BOM Builder](/builder)** -- Interactive cost calculator
