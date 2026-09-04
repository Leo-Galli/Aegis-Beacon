---
title: "Project Overview"
description: "What the Aegis-Beacon is, what it costs, how it works and where the project is heading"
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

## Hardware Platform (v5.4)

| Component | Part | Role |
|-----------|------|------|
| MCU | ESP32 DevKit V1 (30-pin) | Control, WiFi, deep sleep |
| Radio | Ebyte E22-400M30S (SX1262) | CW/FSK TX + RSSI scan, up to +30 dBm PA |
| Display | SSD1309 2.42" OLED (SPI) | Mode UI, battery, GPS state |
| GPS | NEO-6M (UART2) | Coordinates in the Morse payload |
| Battery | 18650 Li-ion + TP4056 | Power and USB-C charging |
| Audio | GPIO 25 DAC1 + 3.5 mm jack | Morse clicks and RSSI audio alerts |
| Controls | 4 tactile buttons | MODE / SEL / UP / DN |

## What Changed in v5.x

Aegis-Beacon v5.4 is a full hardware revision of the original v4.0 design:

- **ESP32-C3 -> ESP32 DevKit V1** with native DAC1 audio (cleaner tone)
- **SX1276 -> SX1262** (E22 module): CW keying, +30 dBm PA, and a mandatory BUSY pin
- **0.96" I2C -> 2.42" SPI OLED** driven by U8g2 (flicker-free full-frame buffer)
- **Added GPS** with compact DDM coordinates (`N4553 E01230`) sent in Morse
- **Added a battery monitor** (ADC divider -> % + mV, live on every screen)
- **Added 4 physical buttons** for live VOL/WPM adjustment without the dashboard

> [!IMPORTANT]
> GPIO assignments changed completely between v4.0 and v5.x. Do not run v5.x firmware on the old ESP32-C3 + RA-02 hardware without rewiring. See the [GPIO Pin Map](/wiki/gpio-pin-mapping).

## Project Layout

| Path | What lives there |
|------|------------------|
| `AegisBeacon.ino` | Full ESP32 firmware (single file) |
| `README.md` | Project overview and quick start |
| `DATASHEET.md` | Electrical specs and GPIO map |
| `FREQUENCIES.md` | SAR frequency reference per region |
| `TECHNOLOGIES.md` | Stack, build commands and verification checklist |
| `website/` | This documentation site, demo and BOM builder |

## Quick Links

- **[Quick Start Guide](/wiki/quick-start-guide)** -- Get started in 5 minutes
- **[Hardware Components](/wiki/hardware-components)** -- Full BOM and wiring
- **[Assembly Guide](/wiki/assembly-guide)** -- Step-by-step build instructions
- **[Firmware Overview](/wiki/firmware-overview)** -- Code structure and dependencies
- **[Operating Modes](/wiki/operating-modes)** -- BEACON, SEARCH, CONFIG, EMERGENCY
- **[BOM Builder](/builder)** -- Interactive cost calculator
