<div align="center">

```
 █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
```

# Aegis-Beacon v5.4

### Professional Dual-Mode Avalanche Rescue System
### SSD1309 2.42" OLED · SX1262 Radio · GPS Payload · Battery Monitor

[![Version](https://img.shields.io/badge/version-5.4.0-blue?style=for-the-badge&logo=github)](https://github.com/leo-galli/aegis-beacon/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

[![CI Build](https://img.shields.io/github/actions/workflow/status/Leo-Galli/Aegis-Beacon/aegis_suite.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%20Build)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/aegis_suite.yml)
[![Code Quality](https://img.shields.io/github/actions/workflow/status/Leo-Galli/Aegis-Beacon/aegis_suite.yml?style=for-the-badge&logo=cppcheck&logoColor=white&label=Code%20Quality)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/aegis_suite.yml)
[![Release](https://img.shields.io/github/v/release/Leo-Galli/Aegis-Beacon?style=for-the-badge&logo=github&logoColor=white&color=blue&label=Firmware)](https://github.com/Leo-Galli/Aegis-Beacon/releases)

[![Platform](https://img.shields.io/badge/platform-ESP32_DevKit_V1-red?style=for-the-badge&logo=espressif)](https://www.espressif.com/en/products/socs/esp32)
[![Radio](https://img.shields.io/badge/radio-SX1262_CW%2FFSK-orange?style=for-the-badge)](https://www.semtech.com/products/wireless-rf/lora-connect/sx1262)
[![Display](https://img.shields.io/badge/display-SSD1309_2.42%22_OLED-white?style=for-the-badge)](https://github.com/olikraus/u8g2)
[![GPS](https://img.shields.io/badge/GPS-NEO--6M_UART-brightgreen?style=for-the-badge)]()
[![Audio](https://img.shields.io/badge/audio-3.5mm_DAC1-yellow?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/framework-Arduino_PlatformIO-teal?style=for-the-badge&logo=arduino)](https://platformio.org)
[![RadioLib](https://img.shields.io/badge/RadioLib-≥6.0-purple?style=for-the-badge)](https://github.com/jgromes/RadioLib)
[![U8g2](https://img.shields.io/badge/U8g2-≥2.34-blue?style=for-the-badge)](https://github.com/olikraus/u8g2)
[![Cost](https://img.shields.io/badge/BOM_cost-~%2423_USD-yellow?style=for-the-badge)](DATASHEET.md)

<br/>

> **⚡ BEACON mode** — transmits Morse SOS on multiple frequencies via CW carrier. Optionally includes your **name** and **live GPS coordinates** in the Morse payload.<br>
> **🔍 SEARCH mode** — continuously scans all configured frequencies, measures RSSI, logs signals, and emits pitch-variable audio tones that rise with signal strength.<br>
> **📺 2.42" OLED** — real-time status on a large SSD1309 128×64 display: mode, frequency, RSSI bar, GPS fix, battery percentage, cycle counter.<br>
> **🔋 Battery monitor** — live percentage and voltage from a 100kΩ/100kΩ voltage divider on the TP4056 BAT+ rail, shown in every screen header.<br>
> **🎛️ 4-button control** — MODE, SEL, UP and DOWN buttons for instant mode switching and live volume/WPM adjustment without opening the config portal.<br>
> **🛰️ GPS payload** — optional NEO-6M module appends your coordinates to every Morse transmission in a compact format readable by any operator.

<br/>

![BEACON mode](https://img.shields.io/badge/BEACON-SOS_+_NAME_+_GPS_TX-red?style=flat-square)
![SEARCH mode](https://img.shields.io/badge/SEARCH-RSSI_scan_+_audio_alert-blue?style=flat-square)
![Config mode](https://img.shields.io/badge/CONFIG-WiFi_captive_portal-grey?style=flat-square)
![Emergency mode](https://img.shields.io/badge/EMERGENCY-max_power_no_sleep-orange?style=flat-square)

</div>

---

## Table of Contents

- [Overview](#overview)
- [What's New in v5.x](#whats-new-in-v5x)
- [Features](#features)
- [Hardware](#hardware)
  - [Bill of Materials](#bill-of-materials)
  - [Wiring Tables](#wiring-tables)
  - [Schematic Notes](#schematic-notes)
- [Firmware](#firmware)
  - [Dependencies](#dependencies)
  - [Installation — Arduino IDE](#installation--arduino-ide)
  - [Installation — PlatformIO](#installation--platformio)
  - [Configuration](#configuration)
- [Operating Modes](#operating-modes)
  - [BEACON Mode](#beacon-mode)
  - [SEARCH Mode](#search-mode)
  - [CONFIG Mode (Dashboard)](#config-mode-dashboard)
  - [EMERGENCY Mode](#emergency-mode)
- [GPS Payload](#gps-payload)
- [Button Reference](#button-reference)
- [OLED Display Layouts](#oled-display-layouts)
- [Battery Monitor](#battery-monitor)
- [Audio System](#audio-system)
- [Dashboard Features](#dashboard-features)
- [Serial Debug System](#serial-debug-system)
- [Morse Engine](#morse-engine)
- [Deep Sleep & Battery Life](#deep-sleep--battery-life)
- [Antenna Guide](#antenna-guide)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Changelog](#changelog)
- [License](#license)

---

## Overview

**Aegis-Beacon** is an open-source, ultra-low-cost emergency rescue beacon designed for avalanche survival, backcountry emergencies, and SAR (Search and Rescue) operations. It fits in a jacket pocket, costs around $23–28 to build, and can operate for **70+ hours** on a single 18650 cell in BEACON mode.

v5.4 is a significant hardware upgrade from the original v4.0. The microcontroller has been upgraded to an **ESP32 DevKit V1** (30-pin), the radio module to an **SX1262** (Ebyte E22-400M30S, up to +30 dBm with onboard PA), and the display to a larger **SSD1309 2.42" OLED**. New features include a **NEO-6M GPS module** that can append your coordinates to every Morse transmission, a **battery voltage monitor** driven by a simple resistor divider, and a **4-button physical control panel** for live volume and WPM adjustment.

| Mode              | LED        | OLED                                 | Audio               | What it does                                                     |
|-------------------|------------|--------------------------------------|---------------------|------------------------------------------------------------------|
| 🔴 **BEACON**     | Red blink  | Freq + TX bar + payload + bat%       | Morse click stream  | Transmits Morse SOS + name + GPS on 1–10 frequencies            |
| 🔵 **SEARCH**     | Blue blink | Freq + RSSI bar + last hit + bat%    | Variable pitch beep | Scans all frequencies, logs RSSI, audio alert on detection       |
| ⚙️ **CONFIG**     | Both blink | SSID + IP + steps                    | Silent              | WiFi AP + full captive-portal dashboard                          |
| ⚡ **EMERGENCY**   | Red fast   | Full-screen inverted "SOS" + coords  | Continuous tone     | Max power, continuous TX with name + GPS, no sleep               |

---

## What's New in v5.x

### v5.4 vs v4.0 — Complete Comparison

| Feature                  | v4.0 (original)              | v5.4 (current)                                       |
|--------------------------|------------------------------|------------------------------------------------------|
| Microcontroller          | ESP32-C3 SuperMini           | **ESP32 DevKit V1 (30-pin)**                         |
| Radio                    | SX1276 RA-02 (OOK, +17 dBm) | **SX1262 E22-400M30S (CW/FSK, +22 dBm / +30 dBm PA)**|
| Display                  | SSD1306 0.96" I2C 128×64     | **SSD1309 2.42" SPI 128×64 (U8g2, larger screen)**  |
| Display driver           | Adafruit SSD1306             | **U8g2 full-frame buffer**                           |
| GPS                      | None (reserved flag)         | **NEO-6M UART — name + coords in Morse payload**     |
| Battery monitor          | None                         | **ADC voltage divider → % + mV, live on every screen**|
| Parameter adjustment     | Dashboard only               | **4 physical buttons: SEL + UP + DN (live VOL/WPM)** |
| Morse payload            | `SOS`                        | `SOS DE [NAME] PSN [LAT] [LON]` (configurable)       |
| BOM cost                 | ~$12–14 USD                  | ~$23–28 USD                                          |
| Audio output pin         | GPIO 18 (PWM only)           | **GPIO 25 (native DAC1 + LEDC)**                     |
| BUSY pin                 | N/A                          | **GPIO 21 — mandatory on SX1262**                    |
| Dependencies             | Adafruit SSD1306 + GFX       | **U8g2 + TinyGPS++**                                 |

> ⚠️ **Breaking change from v4.0:** This is a full hardware revision. All GPIO assignments have changed. Do not attempt to run v5.x firmware on the original ESP32-C3 board with RA-02 module without rewiring.

---

## Features

### RF & Transmission

- ✅ **SX1262 CW keying** — manual FSK carrier on/off (`transmitDirect()` / `standby()`), audible on any AM-mode scanner or SDR
- ✅ **Up to +22 dBm** via RadioLib; **+30 dBm** with E22-400M30S onboard PA
- ✅ **Frequency hopping** — up to 10 configurable frequencies per cycle
- ✅ **PARIS-standard Morse timing** — dot / dash / gaps all calibrated to WPM
- ✅ **Configurable WPM** — 5–40 WPM, adjustable live via UP/DN buttons
- ✅ **Configurable TX power** — −9 to +22 dBm via dashboard
- ✅ **Configurable repeat count** — 1–10 message repetitions per cycle
- ✅ **Mid-TX interrupt** — mode button aborts transmission immediately

### GPS Payload

- ✅ **NEO-6M GPS module** on UART2 (GPIO 22 RX, GPIO 12 TX)
- ✅ **Coordinates in Morse** — compact DDM format: `N4553 E01230` = 45.53°N 12.30°E
- ✅ **Name in Morse** — configurable first + last name appended after `DE`
- ✅ **Payload formats** (selectable from dashboard):
  - `SOS` — base only
  - `SOS DE MARIO ROSSI` — with name
  - `SOS PSN N4553 E01230` — with GPS
  - `SOS DE MARIO ROSSI PSN N4553 E01230` — full
- ✅ **Stale fix reuse** — last known coordinates stored in RTC RAM and retransmitted after deep sleep
- ✅ **Fix wait screen** — satellite count, elapsed time, and progress bar at boot
- ✅ **Skip via MODE button** — press MODE to skip GPS wait if in a hurry
- ✅ **Fix timeout** — configurable 10–120 s; device transmits without coords if exceeded

### Battery Monitor

- ✅ **Piecewise Li-ion curve** — 9-point calibration for realistic % from voltage
- ✅ **32-sample ADC averaging** — reduces ESP32 ADC noise
- ✅ **Live in every screen header** — pixel-art battery icon (18×9 px) with 4 fill levels
- ✅ **Critical blink** — icon blinks at ≤10% battery
- ✅ **Charging detection** — `CHG` shown when TP4056 STDBY pin (GPIO 39) detects charge
- ✅ **Calibratable** — `BAT_VREF_MV` constant adjustable to match real hardware
- ✅ **Exposed in dashboard** — bar chart + mV + % updated every 4 s
- ✅ **5 s read interval** — no impact on radio or display performance

### Physical Controls (4 buttons)

- ✅ **SW_MODE** (GPIO 33) — short: toggle BEACON/SEARCH | long 2 s: EMERGENCY
- ✅ **SW_SEL** (GPIO 32) — short: toggle VOL/WPM target | long 3 s: config portal
- ✅ **SW_UP** (GPIO 35) — increment selected parameter (vol +10, WPM +1)
- ✅ **SW_DN** (GPIO 34) — decrement selected parameter
- ✅ **Auto-repeat** — hold UP/DN for fast repeat after 500 ms, every 150 ms
- ✅ **Adj overlay** — OLED shows live value bar at bottom for 2.5 s after adjustment
- ✅ **NVS save** — hold SEL 1 s to persist current values
- ✅ **Factory reset** — hold MODE + SEL at boot for 5 s

### 2.42" OLED Display

- ✅ **SSD1309 128×64** via software SPI, U8g2 full-frame buffer (no flicker)
- ✅ **Battery icon** in every header bar — 4 fill levels + charging indicator
- ✅ **Mode-specific layouts** — distinct UI for all 5 screens
- ✅ **Large frequency display** — `logisoso24` font, clearly readable outdoors
- ✅ **GPS fix dot** — solid square = fix OK, outline = searching
- ✅ **Adj overlay** — bottom 12 px inverted bar shows live VOL or WPM while adjusting
- ✅ **TX payload scroll** — message scrolls through bottom bar during transmission
- ✅ **120 ms refresh** — smooth updates without CPU overhead
- ✅ **Power save** — OLED off command (`setPowerSave(1)`) before deep sleep
- ✅ **Invert mode** — configurable for bright sunlight readability

### Search / Scan Engine

- ✅ **Per-frequency RSSI measurement** with configurable dwell time
- ✅ **Configurable detection threshold** (−120 to −40 dBm)
- ✅ **Rolling hit log** — last 20 detections in RTC RAM (survives deep sleep)
- ✅ **Signal classification** — STRONG / MEDIUM / WEAK with distinct OLED labels
- ✅ **Threshold tick** — visual marker on RSSI bar at configured threshold
- ✅ **LED heartbeat** — slow blink = scanning, fast blink = signal detected

### Audio Alert System

- ✅ **Native DAC1 on GPIO 25** — cleaner audio than PWM-only ESP32-C3
- ✅ **Mid-rail parking** — `dacWrite(128)` at silence eliminates click transients
- ✅ **LEDC PWM** for precise tone frequency control
- ✅ **Metal-detector style** — pitch rises continuously from 440 Hz to 2200 Hz with signal strength
- ✅ **Morse click stream** in BEACON mode
- ✅ **Volume adjustable live** via UP/DN buttons (no reboot needed)
- ✅ **Volume persisted** to NVS on demand

### Dashboard & Configuration

- ✅ **WiFi captive portal** — any phone opens automatically
- ✅ **GPS settings** — enable/disable, include in beacon, fix timeout
- ✅ **Identity settings** — first name, last name, enable toggle
- ✅ **Battery panel** — animated bar chart, mV readout, charging indicator
- ✅ **Live Morse payload preview** — shows full `SOS DE MARIO ROSSI PSN N4553 E01230` as you type
- ✅ **Frequency manager** — up to 10 frequencies
- ✅ **Audio controls** — volume slider + master toggle
- ✅ **OLED controls** — enable + invert toggles
- ✅ **TX power** — −9 to +22 dBm (SX1262 RadioLib range)
- ✅ **Scan history** — RSSI bar charts, live refresh

### Reliability & Safety

- ✅ **Hardware watchdog** — 30 s WDT
- ✅ **NVS fail-safe** — hardcoded defaults on empty/corrupt storage
- ✅ **RTC RAM state** — mode, counters, scan hits, GPS fix survive deep sleep
- ✅ **Interrupt-driven buttons** — responsive during TX
- ✅ **SX1262 BUSY polling** — RadioLib handles BUSY pin before every SPI transfer
- ✅ **ADC range guard** — ignores battery readings outside 2.5–4.5 V (bad connection detection)
- ✅ **Wi-Fi / BT stack shutdown** — saves ~120 mA during TX/RX cycles

---

## Hardware

### Bill of Materials

> **Total estimated cost: ~$23–28 USD** (AliExpress / LCSC pricing, 2025)

| # | Ref  | Component                                         | Qty | Unit Cost | Notes                                                        |
|---|------|---------------------------------------------------|-----|-----------|--------------------------------------------------------------|
| 1 | U1   | **ESP32 DevKit V1** (30-pin, 38-pin also works)   | 1   | $3.00     | Built-in USB + AMS1117-3.3 LDO                               |
| 2 | U2   | **Ebyte E22-400M30S** (SX1262 / LLCC68)           | 1   | $5.50     | 433 MHz, +30 dBm PA, SMA connector, TCXO onboard            |
| 3 | U3   | **SSD1309 2.42" OLED 128×64** (7-pin SPI)         | 1   | $3.50     | GND VCC SCK SDA RES DC CS. Do NOT confuse with 4-pin I2C.   |
| 4 | U4   | **NEO-6M GPS module**                             | 1   | $4.50     | UART 9600 baud, ceramic patch antenna. Optional.            |
| 5 | B1   | **18650 Li-ion 3.7 V**                            | 1   | $1.50     | Any brand. LiFePO4 recommended for alpine cold deployments. |
| 6 | IC1  | **TP4056 USB-C module** (with DW01A protection)   | 1   | $0.50     | Handles charge + over-discharge. Exposes BAT+ for divider.  |
| 7 | J1   | **3.5mm TRRS audio jack** (PJ-320A or CUI SJ-3523)| 1   | $0.30     | Panel-mount, 4-pole. Tip=audio, Sleeve=GND.                 |
| 8 | SW1  | **Tactile switch 6×6 mm** (×4)                   | 4   | $0.20     | MODE (GPIO 33), SEL (GPIO 32), UP (GPIO 35), DN (GPIO 34)   |
| 9 | R3   | **100 kΩ 0805** (×2)                             | 2   | $0.02     | Battery voltage divider: BAT+ → 100k → GPIO36 → 100k → GND |
| 10| C1   | **100 µF 10 V electrolytic**                      | 1   | $0.05     | Bulk cap on 3.3 V rail                                      |
| 11| C2   | **100 nF ceramic 0805** (×2)                      | 2   | $0.04     | Decoupling on 3.3 V rail                                    |
| 12| C3   | **10 µF 10 V electrolytic**                       | 1   | $0.03     | AC-coupling cap on audio output path                        |
| 13| R1   | **330 Ω 0805** (×2)                               | 2   | $0.02     | LED current limiters                                        |
| 14| R2   | **100 Ω 0805**                                    | 1   | $0.01     | Audio output series resistor                                |
| 15| D1   | **Red LED 3 mm**                                  | 1   | $0.05     | BEACON mode indicator                                       |
| 16| D2   | **Blue LED 3 mm**                                 | 1   | $0.05     | SEARCH mode indicator                                       |
| 17| ANT  | **17.3 cm wire** (¼-wave @ 433 MHz)               | 1   | $0.00     | Or use the E22-400M30S SMA connector with an external antenna|
| 18| BOX  | **Hammond 1593L** (100×60×25 mm) or 3D PLA        | 1   | $3.00     | Fits 18650 + GPS module + 2.42" OLED window                 |

**Total: ~$23–28 USD**

> 💡 **Cold weather:** Below −10 °C replace C1 electrolytic with a 47 µF X7R ceramic. Use a **LiFePO4** cell instead of Li-ion for alpine deployments — rated to −30 °C with minimal capacity loss.

---

### Wiring Tables

#### SX1262 (Ebyte E22-400M30S) ↔ ESP32 DevKit V1

| E22 / SX1262 Pin | ESP32 GPIO | Notes                                              |
|------------------|------------|-----------------------------------------------------|
| VCC              | 3V3        | **3.3 V only — never 5 V**                         |
| GND              | GND        | Common ground                                       |
| SCK              | GPIO 18    | VSPI SCK                                            |
| MISO             | GPIO 19    | VSPI MISO                                           |
| MOSI             | GPIO 23    | VSPI MOSI                                           |
| NSS / CS         | GPIO 5     | Chip Select (active LOW)                            |
| RESET            | GPIO 14    | Active LOW reset                                    |
| BUSY             | GPIO 21    | **MANDATORY** — RadioLib polls this before every SPI transfer |
| DIO1             | GPIO 2     | TX/RX done + timeout IRQ                            |
| TXEN             | N/C (−1)   | Pulled internally on E22 module                    |
| RXEN             | N/C (−1)   | Pulled internally on E22 module                    |

> ⚠️ **BUSY is not optional.** If GPIO 21 is not wired to BUSY, the firmware will hang on the first radio call.

#### SSD1309 2.42" OLED (7-pin SPI) ↔ ESP32 DevKit V1

| OLED Pin    | ESP32 GPIO | Notes                           |
|-------------|------------|---------------------------------|
| GND         | GND        |                                 |
| VCC         | 3V3        | 3.3 V only                      |
| SCK (D0)    | GPIO 15    | Software SPI clock              |
| SDA (D1)    | GPIO 13    | Software SPI data               |
| RES (RESET) | GPIO 4     | Hardware reset                  |
| DC (A0)     | GPIO 16    | Data / Command select           |
| CS          | GPIO 17    | Chip Select (active LOW)        |

> ℹ️ Software SPI is used so the OLED does not share the VSPI bus with the radio. Both devices can operate simultaneously.

#### NEO-6M GPS ↔ ESP32 DevKit V1 (UART2)

| GPS Pin | ESP32 GPIO | Notes                              |
|---------|------------|------------------------------------|
| VCC     | 3V3        | 3.3 V (most modules accept 3.3–5 V)|
| GND     | GND        |                                    |
| TX      | GPIO 22    | GPS TX → ESP32 RX (input-only pin) |
| RX      | GPIO 12    | GPS RX ← ESP32 TX                  |

Baud rate: 9600 (NEO-6M default). UART2 is started only when `gpsEnabled = true`.

#### Battery Monitor — TP4056 + Voltage Divider

| Connection            | Value   | Notes                                              |
|-----------------------|---------|----------------------------------------------------|
| BAT+ (TP4056 output)  | → R3a   | First 100 kΩ resistor                              |
| R3a junction          | GPIO 36 | ADC1_CH0 (SVP) — input-only, no pull needed       |
| GPIO 36               | → R3b   | Second 100 kΩ resistor                             |
| R3b                   | → GND   | Completes divider                                  |
| TP4056 STDBY          | GPIO 39 | Optional — LOW when charging; SVN input-only       |

Divider output: `VBAT / 2` → 4.2 V full = 2.1 V on GPIO 36 (safely within 3.3 V ADC range).

#### Audio Jack — 3.5mm TRRS ↔ ESP32 DevKit V1

| Jack Pin       | Connection   | Notes                                         |
|----------------|--------------|-----------------------------------------------|
| Tip (L audio)  | GPIO 25 → 100 Ω → 10 µF → Tip | DAC1 output, AC-coupled          |
| Ring 1 (R)     | Tie to Tip   | Mono output                                   |
| Ring 2 (MIC)   | N/C          |                                               |
| Sleeve (GND)   | GND          | Audio ground                                  |

#### Other Connections

| Component        | ESP32 GPIO | Notes                            |
|------------------|-----------|----------------------------------|
| LED_RED anode    | GPIO 27   | Via 330 Ω to GND — BEACON mode  |
| LED_BLUE anode   | GPIO 26   | Via 330 Ω to GND — SEARCH mode  |
| SW_MODE          | GPIO 33   | INPUT_PULLUP, connect to GND     |
| SW_SEL           | GPIO 32   | INPUT_PULLUP, connect to GND     |
| SW_UP            | GPIO 35   | Input-only; 10 kΩ ext. pullup recommended |
| SW_DN            | GPIO 34   | Input-only; 10 kΩ ext. pullup recommended |

#### Complete GPIO Map (v5.4)

| GPIO | Function                                                   |
|------|------------------------------------------------------------|
| 2    | SX1262 DIO1 (TX/RX done, timeout IRQ)                      |
| 4    | OLED RESET                                                 |
| 5    | SX1262 NSS/CS (VSPI, active LOW)                           |
| 12   | GPS RX ← NEO-6M TX (Serial2 TX out)                        |
| 13   | OLED SDA (D1/MOSI) — software SPI                          |
| 14   | SX1262 RESET (active LOW)                                  |
| 15   | OLED SCK (D0) — software SPI                               |
| 16   | OLED DC (Data/Command)                                     |
| 17   | OLED CS — software SPI chip select                         |
| 18   | VSPI SCK → SX1262                                          |
| 19   | VSPI MISO ← SX1262                                         |
| 21   | SX1262 BUSY (mandatory input)                              |
| 22   | GPS RX ← NEO-6M TX (Serial2 RX in, input-only)             |
| 23   | VSPI MOSI → SX1262                                         |
| 25   | DAC1 audio → 100 Ω → 10 µF → 3.5mm jack TIP               |
| 26   | LED_BLUE (SEARCH indicator, 330 Ω)                         |
| 27   | LED_RED (BEACON indicator, 330 Ω)                          |
| 32   | SW_SEL (short=VOL/WPM toggle, long 3 s=config portal)      |
| 33   | SW_MODE (short=mode toggle, long 2 s=emergency)            |
| 34   | SW_DN — decrement parameter (input-only)                   |
| 35   | SW_UP — increment parameter (input-only)                   |
| 36   | ADC1_CH0 — battery voltage divider wiper (SVP, input-only) |
| 39   | TP4056 STDBY detect (SVN, input-only, optional)            |

---

### Schematic Notes

- The ESP32 DevKit V1 includes an **AMS1117-3.3 LDO** powered from the USB 5 V / VBUS rail. No external LDO is required.
- The TP4056 module with DW01A includes complete Li-ion protection. The **BAT+** output is used as the battery voltage measurement point.
- The SX1262 BUSY pin is **open-drain output** from the module — connect directly to GPIO 21 with no pull-up needed (module has internal pull-up).
- The SSD1309 OLED uses **software SPI** specifically to avoid bus conflicts with the radio's hardware VSPI. This adds ~2 ms per full-screen update but is imperceptible at 120 ms refresh rate.
- **GPIO 34, 35, 36, 39** are input-only on the ESP32. They have no internal pull-up resistors. Use external 10 kΩ pull-ups for the SW_UP and SW_DN buttons. GPIO 36 and 39 are used purely as ADC inputs and require no pull-up.
- The 100 kΩ/100 kΩ voltage divider draws ~21 µA continuously from the battery (4.2 V / 200 kΩ). This is negligible relative to the 10 µA deep-sleep current.

---

## Firmware

### Dependencies

| Library                            | Version    | Install                                  |
|------------------------------------|------------|------------------------------------------|
| **RadioLib** by Jan Gromes         | `≥ 6.0.0`  | Arduino Library Manager / PlatformIO     |
| **ArduinoJson** by Benoît Blanchon | `≥ 7.0.0`  | Arduino Library Manager / PlatformIO     |
| **U8g2** by oliver                 | `≥ 2.34.0` | Arduino Library Manager / PlatformIO     |
| **TinyGPS++** by Mikal Hart        | `≥ 1.0.3`  | Arduino Library Manager / PlatformIO     |

> ℹ️ U8g2 replaces the Adafruit SSD1306 + GFX libraries used in v4.0. It supports the SSD1309 natively, uses a full-frame buffer for flicker-free rendering, and provides superior font support.

---

### Installation — Arduino IDE

1. **Install libraries:**
   `Sketch → Include Library → Manage Libraries`
   Search and install: `RadioLib`, `ArduinoJson`, `U8g2`, `TinyGPS++`

2. **Add ESP32 board support:**
   `File → Preferences → Additional boards URL`:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
   Then: `Tools → Board Manager → search "esp32" → install "esp32 by Espressif"`

3. **Select board:**
   `Tools → Board → ESP32 Dev Module`

4. **Select port:**
   `Tools → Port → COMx / /dev/ttyUSB0 / /dev/cu.usbserial...`

5. **Upload:**
   Open `AegisBeacon.ino` → click Upload (→)

---

### Installation — PlatformIO

```ini
[env:esp32devkitv1]
platform  = espressif32
board     = esp32dev
framework = arduino

lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
    olikraus/U8g2 @ ^2.34.0
    mikalhart/TinyGPSPlus @ ^1.0.3

monitor_speed = 115200
upload_speed  = 921600

build_flags =
    -DBOARD_HAS_PSRAM=0

board_build.flash_size = 4MB
```

Then:

```bash
pio run --target upload
pio device monitor --baud 115200
```

---

### Configuration

Key firmware constants (edit before compiling, or change via dashboard):

```cpp
#define DEFAULT_FREQ_MHZ      433.500f   // Default frequency (MHz)
#define DEFAULT_MESSAGE       "SOS"      // Base Morse message
#define DEFAULT_WPM           13         // Words per minute
#define DEFAULT_POWER_DBM     17         // TX power (dBm) — up to 22 via RadioLib
#define DEFAULT_SLEEP_SEC     10         // Deep sleep between TX cycles (s)
#define DEFAULT_SCAN_DWELL_MS 400        // RSSI dwell time per frequency (ms)
#define DEFAULT_RSSI_THRESH   -90        // Detection threshold (dBm)
#define DEFAULT_AUDIO_VOL     180        // 0-255 DAC volume

// Battery ADC calibration — measure BAT+ with multimeter and adjust if readings differ
#define BAT_VREF_MV           3900       // ADC full-scale voltage in mV (ADC_11db)
#define BAT_SAMPLES           32         // ADC samples per battery reading
#define BAT_READ_MS           5000       // Battery read interval (ms)

// GPS
#define GPS_FIX_TIMEOUT_S     60         // Max seconds to wait for GPS fix at boot
#define GPS_MIN_SATS          3          // Minimum satellites for valid fix

// Debug verbosity
#define DEBUG_VERBOSE          0          // 1 = per-symbol Morse + RadioLib codes
```

---

## Operating Modes

### BEACON Mode

The primary emergency mode. On each cycle the device:

1. Disables WiFi and Bluetooth stacks (~120 mA saved)
2. Reads potentiometers/buttons for live VOL/WPM updates
3. **Builds the Morse payload** — combines base message + name + GPS coordinates per configuration
4. Iterates through all configured frequencies
5. Initialises SX1262 in CW mode (`beginFSK` + `transmitDirect()` for carrier keying)
6. Transmits the full payload (repeated N times per frequency)
7. Emits Morse click tones through GPIO 25 DAC in sync with TX
8. Updates the OLED with frequency, TX progress bar, scrolling payload, and battery %
9. Enters ESP32 deep sleep for the configured interval
10. Wakes and repeats — RTC RAM preserves mode, cycle counters, and last GPS fix

**Morse timing (PARIS standard):**

| Element              | Duration          |
|----------------------|-------------------|
| Dot                  | `1200 / WPM` ms   |
| Dash                 | `3 × dot` ms      |
| Intra-character gap  | `1 × dot` ms      |
| Inter-character gap  | `3 × dot` ms      |
| Word gap             | `7 × dot` ms      |

At 13 WPM: dot = 92 ms, dash = 277 ms. `SOS` = ~2.7 s. `SOS DE MARIO ROSSI PSN N4553 E01230` = ~45 s.

---

### SEARCH Mode

Continuous scan mode for locating other beacons:

1. Disables WiFi and Bluetooth
2. Loops through all frequencies indefinitely
3. Opens FSK receive window, measures peak RSSI over the dwell period
4. Emits rising-pitch audio tone proportional to RSSI (metal-detector style)
5. Updates OLED: frequency, RSSI bar with threshold tick, last hit, battery %
6. Logs detections above threshold to RTC RAM
7. Blinks blue LED on detection

**Sample serial output:**

```
[  42381][SCAN ] [0] 433.500 MHz  RSSI=-112 dBm  |....................| quiet
[  42784][SCAN ] [1] 434.500 MHz  RSSI= -87 dBm  |#########...........| *** HIT ***
[  42785][SCAN ] HIT: 434.500 MHz -87 dBm [MEDIUM]  total=1
[  43188][SCAN ] [2] 435.000 MHz  RSSI=-109 dBm  |....................| quiet
```

---

### CONFIG Mode (Dashboard)

Activated by holding SW_SEL for 3 seconds:

1. Starts WiFi AP (`AegisBeacon`, open)
2. DNS server redirects all domains → `192.168.4.1`
3. Serves the full dashboard at `http://192.168.4.1`
4. OLED shows SSID, IP, and step-by-step connection instructions
5. Captive portal popup appears automatically on most phones
6. After saving, device reboots into selected mode
7. Auto-reverts after 5 minutes if no client connects

---

### EMERGENCY Mode

Activated by holding SW_MODE for 2 seconds, or via the dashboard Emergency button:

- Maximum TX power (+22 dBm via RadioLib; PA adds more on E22)
- Message repeated 3× per frequency
- **Full payload** — always transmits name + GPS if enabled
- **No deep sleep** — continuous transmission
- OLED shows full-screen alternating-inverse SOS + frequency + coordinates
- Continuous audio tone at 1760 Hz
- Flag persisted in RTC RAM — survives power cycles
- Cleared by entering CONFIG mode and saving

---

## GPS Payload

The GPS module (NEO-6M) connects to UART2 at 9600 baud. The firmware reads NMEA sentences via **TinyGPS++** and assembles the Morse payload at the start of each TX cycle.

### Payload Format

| Configuration         | Morse message transmitted                            |
|-----------------------|------------------------------------------------------|
| Base only             | `SOS`                                                |
| Name only             | `SOS DE MARIO ROSSI`                                 |
| GPS only              | `SOS PSN N4553 E01230`                               |
| Name + GPS            | `SOS DE MARIO ROSSI PSN N4553 E01230`                |

**Coordinate encoding:** truncated DDM (Degrees + Decimal Minutes × 10):
- `N4553` = 45° 53' N (lat 45.883°)
- `E01230` = 12° 30' E (lon 12.50°)

This encoding is intentionally compact to minimise transmission time. Full decimal coordinates are logged to Serial.

### GPS Boot Behaviour

1. If `gpsEnabled` and no RTC fix is cached: show **GPS wait screen** with satellite count and progress bar
2. Press MODE to skip the wait at any time
3. If `gpsFix1Timeout` seconds elapse without a fix: transmit without coordinates (`PSN UNKN`)
4. Once a fix is acquired: store in RTC RAM — coordinates survive deep sleep cycles

### Fix Quality

| Condition                           | Payload coordinates       |
|-------------------------------------|---------------------------|
| Fresh fix (< 3 s age, ≥ 3 sats)     | Current fix               |
| Stale fix (RTC cache from prev boot)| Cached fix (marked stale) |
| No fix + timeout expired            | `PSN UNKN`                |

---

## Button Reference

| Button         | GPIO | Press type     | Duration    | Action                                    |
|----------------|------|----------------|-------------|-------------------------------------------|
| **SW_MODE**    | 33   | Short press    | < 2000 ms   | Toggle BEACON ↔ SEARCH                    |
| **SW_MODE**    | 33   | Long press     | ≥ 2000 ms   | Activate **EMERGENCY SOS**                |
| **SW_SEL**     | 32   | Short press    | < 3000 ms   | Toggle adjustment target: VOL ↔ WPM       |
| **SW_SEL**     | 32   | Long press     | ≥ 3000 ms   | Launch WiFi AP + config dashboard         |
| **SW_SEL**     | 32   | Hold 1 s       | ≥ 1000 ms   | Save current VOL and WPM to NVS           |
| **SW_UP**      | 35   | Short press    | —           | Increment selected parameter (+10 vol / +1 WPM) |
| **SW_UP**      | 35   | Hold           | > 500 ms    | Auto-repeat increment every 150 ms        |
| **SW_DN**      | 34   | Short press    | —           | Decrement selected parameter              |
| **SW_DN**      | 34   | Hold           | > 500 ms    | Auto-repeat decrement every 150 ms        |
| **MODE + SEL** | 33+32| Both at boot   | ≥ 5000 ms   | **Factory reset** (NVS wipe + reboot)     |

> 💡 During TX: SW_MODE aborts the active Morse transmission immediately and switches mode. The interrupt fires at hardware level — no polling delay.

> 💡 **VOL/WPM overlay:** after pressing UP or DN, the OLED shows a live adjustment bar at the bottom of the screen for 2.5 seconds. The target (VOL or WPM) is always shown in the bottom-right corner of the main screen.

---

## OLED Display Layouts

The SSD1309 128×64 display refreshes every 120 ms. Every screen except EMERGENCY shows a **pixel-art battery icon** (18×9 px) in the top-right corner of the header bar.

### Battery Icon States

| Fill level | Battery %  | Icon          |
|------------|------------|---------------|
| 4 segments | 76–100%    | `[████]`      |
| 3 segments | 51–75%     | `[███ ]`      |
| 2 segments | 26–50%     | `[██  ]`      |
| 1 segment  | 11–25%     | `[█   ]`      |
| Blinking ! | 0–10%      | `[!   ]` blinks every 500 ms |
| Letter C   | Charging   | `[ C  ]` (TP4056 STDBY detected) |

### Screen Layouts

| Mode          | Content                                                                            |
|---------------|------------------------------------------------------------------------------------|
| **BOOT**      | Inverted header "AEGIS-BEACON v5.4" · subtitle · feature flags · battery icon + % · INITIALISING bar |
| **BEACON**    | Inverted header "TX BEACON" + cycle# + **bat icon** · Large frequency (logisoso24) · GPS fix dot · Info line (CH/PWR/WPM) · TX progress bar · Payload scroll · Status (GPS state + bat% + sleep countdown) + ADJ indicator |
| **SEARCH**    | Inverted header "RX SEARCH" + hit count + **bat icon** · Large frequency · RSSI value · RSSI fill bar + threshold tick · Signal label / last hit / scan pass + bat% + ADJ indicator |
| **EMERGENCY** | Alternating inverse · Giant "SOS" (logisoso32) · "EMERGENCY BEACON TX" · Frequency + power · GPS coordinates or cycle + bat% |
| **GPS WAIT**  | Inverted header "ACQUIRING GPS FIX" + **bat icon** · Large satellite count · Progress bar · Status line · Coordinates or "MODE: skip wait" |
| **CONFIG**    | Inverted header "CONFIGURATION MODE" · WiFi SSID · URL · 3-step instructions |

---

## Battery Monitor

### Hardware

Connect a **100 kΩ / 100 kΩ voltage divider** between the TP4056 BAT+ rail and GND, with the midpoint wired to **GPIO 36** (ADC1_CH0, SVP, input-only).

```
TP4056 BAT+  ──── 100 kΩ ──── GPIO 36 ──── 100 kΩ ──── GND
                                  │
                              ADC reading
                             (VBAT / 2)
```

The divider halves the battery voltage: at full charge (4.2 V) the ADC sees 2.1 V — safely within the ESP32's 3.3 V limit. Total quiescent current: ~21 µA (negligible).

### Software

The firmware samples GPIO 36 with **32 averaged ADC readings** (reduces ESP32 ADC noise), reconstructs VBAT, and maps it to percentage using a **9-point piecewise linear curve** matching a real 18650 discharge profile:

| VBAT    | %   |   | VBAT    | %  |
|---------|-----|---|---------|----|
| 4.20 V  | 100 |   | 3.65 V  | 50 |
| 4.05 V  | 90  |   | 3.55 V  | 35 |
| 3.90 V  | 75  |   | 3.40 V  | 20 |
| 3.75 V  | 60  |   | 3.20 V  | 10 |
|         |     |   | 3.00 V  | 0  |

### Calibration

If readings differ from a multimeter measurement, adjust:

```cpp
#define BAT_VREF_MV   3900   // Increase if readings are too low, decrease if too high
```

### Charging Detection (optional)

Wire the TP4056 **STDBY** pin to **GPIO 39** (SVN, input-only). When LOW, the firmware sets `g_batCharging = true` and shows "C" in the battery icon instead of the fill bars.

---

## Audio System

The ESP32 DevKit V1 has a **native 8-bit DAC** on GPIO 25 (`DAC_CHANNEL_1`). Audio is generated via **LEDC PWM** for precise frequency control, with `dacWrite(128)` used at silence to park the output at mid-rail (1.65 V) and prevent audible DC-click transients in headphones.

**Signal path:** `GPIO 25 (DAC1) → 100 Ω series R → 10 µF AC-coupling cap → 3.5mm jack TIP`

**Tone behaviour in SEARCH mode:**

| Condition                            | Audio output                    | Tone freq  |
|--------------------------------------|---------------------------------|------------|
| No signal (RSSI < threshold)         | Silence (DAC parked at 1.65 V)  | —          |
| Weak signal (RSSI −90 to −80 dBm)    | Rising-pitch tone, 440 Hz start | 440 Hz     |
| Medium signal (RSSI −80 to −60 dBm)  | Higher pitch tone               | ~880 Hz    |
| Strong signal (RSSI ≥ −60 dBm)       | Continuous high tone            | up to 2200 Hz |
| Pitch rising continuously            | Signal getting stronger (metal-detector feel) | Interpolated |

**In BEACON mode:** 600 Hz Morse click stream — each dot/dash produces a click through the earphone, useful for monitoring transmission timing.

**Volume:** 0–255 (default 180 ≈ 70%). Adjustable live via SW_UP / SW_DN when VOL is selected. Saved to NVS with SEL long press.

**Compatible headphones:** Standard 3.5mm wired, 16–600 Ω.

---

## Dashboard Features

| Section               | Feature                                                                                        |
|-----------------------|------------------------------------------------------------------------------------------------|
| **Mode toggle**       | BEACON ↔ SEARCH physical-style switch with payload preview                                     |
| **Morse payload**     | Live-building preview of full `SOS DE [NAME] PSN [LAT] [LON]` as you configure each section   |
| **Morse preview**     | Message decoded to dots/dashes in real time as you type                                        |
| **Identity (GPS)**    | First name + last name fields + enable toggle — appended as `DE [NAME]` in Morse               |
| **GPS settings**      | Enable/disable module · include in beacon · fix timeout slider · live coordinate display        |
| **Frequency manager** | Add/remove up to 10 frequencies; primary frequency shown                                      |
| **TX power**          | Slider −9 to +22 dBm (SX1262 RadioLib range; E22 PA adds more)                                |
| **Morse speed**       | Slider 5–40 WPM with dot-duration preview                                                      |
| **Sleep interval**    | 1–300 s between TX cycles                                                                      |
| **Repeat count**      | 1–10 message repetitions per frequency                                                         |
| **Scan dwell**        | 50–2000 ms listen time per frequency                                                           |
| **RSSI threshold**    | −120 to −40 dBm detection sensitivity                                                          |
| **Audio**             | Volume slider 0–255 + master enable toggle                                                     |
| **OLED**              | Enable/disable + invert toggle                                                                 |
| **Potentiometer**     | SEL/UP/DN enable toggles (hardware button adjustment)                                          |
| **Radio info**        | SX1262 wiring reference + BUSY warning                                                         |
| **Battery panel**     | Animated bar chart (colour shifts green→yellow→red) + mV readout + charging indicator         |
| **Device status**     | Boot cycles · free heap · GPS fix state · satellite count · live WPM · live volume             |
| **TX/Scan counters**  | Cumulative TX and scan cycles                                                                  |
| **Scan history**      | Live RSSI bar charts for all detections; auto-refresh every 4 s                                |
| **Emergency button**  | Activates EMERGENCY mode from browser                                                          |
| **Factory reset**     | Clears NVS and reboots                                                                         |
| **Save button**       | Saves all settings to NVS and reboots into selected mode                                       |

---

## Serial Debug System

Connect at **115200 baud, 8N1**.

| Tag        | Colour  | Meaning                                                 |
|------------|---------|---------------------------------------------------------|
| `[INFO ]`  | Cyan    | Normal operation                                        |
| `[OK   ]`  | Green   | Successful operation                                    |
| `[WARN ]`  | Yellow  | Non-fatal anomaly                                       |
| `[ERROR]`  | Red     | Hardware / radio failure                                |
| `[MODE ]`  | Magenta | Mode change event                                       |
| `[SCAN ]`  | Blue    | RSSI scan result + ASCII bar graph                      |
| `[BTN  ]`  | White   | Button event + hold duration                            |
| `[CFG  ]`  | White   | Dashboard save / NVS load                               |
| `[OLED ]`  | Magenta | Display event                                           |
| `[AUDIO]`  | Green   | Audio tone event                                        |
| `[GPS  ]`  | Cyan    | GPS engine (fix, satellites, coordinates)               |
| `[ADJ  ]`  | Gray    | Button adjustment (vol/WPM change)                      |
| `[BAT  ]`  | Green   | Battery reading (mV, %, charging state)                 |
| `[MORSE]`  | Gray    | Per-symbol Morse timing *(DEBUG_VERBOSE 1 only)*        |
| `[RF   ]`  | Gray    | RadioLib state codes *(DEBUG_VERBOSE 1 only)*           |

**Healthy BEACON boot with GPS:**

```
╔══════════════════════════════════════════════════════════╗
║  AEGIS-BEACON v5.4 — SX1262+GPS+BTN+BAT+SSD1309         ║
╚══════════════════════════════════════════════════════════╝
    Active mode: BEACON

[       5][INFO ] Boot #1  reset_reason=1  heap=290244 B  cpu=240MHz
[      22][BAT  ] Boot battery: 87%  4100mV  charging=NO
[      40][OK   ] OLED ready — SSD1309 128x64
[      42][AUDIO] LEDC GPIO25 (DAC1) ch0 @ 40000 Hz 8-bit
[      45][GPS  ] Waiting for GPS fix (timeout 30s)...
[   12400][GPS  ] Fix acquired: 45.53124  12.30456  sats=6
[   12401][INFO ] Payload ready: "SOS DE MARIO ROSSI PSN N4553 E01230"
[   12410][MODE ] Starting: BEACON
[   12480][OK   ] SX1262 CW TX ready: 433.500 MHz @ 17 dBm
[   12481][INFO ] TX: "SOS DE MARIO ROSSI PSN N4553 E01230" (31 chars) @ 13WPM
[   57600][OK   ] TX done: 31 chars in 45119 ms
[   57605][BAT  ] VBAT=4098mV  pct=87%  ADC=2148  charging=NO
[   57610][INFO ] Deep sleep 10 s...
```

---

## Morse Engine

Uses **PARIS standard timing** — the word "PARIS" = exactly 50 units, calibrating WPM precisely.

```
unit_ms = 1200 / WPM

DOT  = 1 unit
DASH = 3 units
intra-character gap = 1 unit
inter-character gap = 3 units
word gap            = 7 units
```

**Supported characters:** A–Z, 0–9, space (word gap)

**Payload duration examples at 13 WPM (unit = 92 ms):**

| Payload                                            | Duration  |
|----------------------------------------------------|-----------|
| `SOS`                                              | ~2.7 s    |
| `SOS DE MARIO ROSSI`                               | ~15 s     |
| `SOS PSN N4553 E01230`                             | ~18 s     |
| `SOS DE MARIO ROSSI PSN N4553 E01230`              | ~45 s     |

> 💡 Use shorter names and higher WPM to reduce cycle time in emergency situations.

**Mid-TX interrupt:** SW_MODE aborts transmission immediately between characters. The interrupt flag is checked after every character — maximum latency is one character duration.

---

## Deep Sleep & Battery Life

| State                         | Current draw   |
|-------------------------------|----------------|
| Deep sleep (ESP32)            | ~10 µA         |
| TX active @ +17 dBm           | ~120 mA        |
| SEARCH scan (RX, no TX)       | ~40 mA         |
| Config AP (WiFi active)       | ~100 mA        |
| SSD1309 OLED (active)         | ~6 mA          |
| SSD1309 OLED (setPowerSave(1))| ~0.3 mA        |
| NEO-6M GPS (acquiring)        | ~30 mA         |
| NEO-6M GPS (tracking)         | ~25 mA         |
| Battery divider (always on)   | ~0.021 mA      |

**Estimated battery life (2000 mAh 18650, 20 °C):**

| Mode      | Sleep interval | GPS    | OLED | Est. runtime |
|-----------|----------------|--------|------|--------------|
| BEACON    | 10 s           | Off    | On   | ~65 hours    |
| BEACON    | 10 s           | On     | On   | ~45 hours    |
| BEACON    | 30 s           | Off    | On   | ~130 hours   |
| BEACON    | 60 s           | Off    | On   | ~175 hours   |
| SEARCH    | Continuous     | Off    | On   | ~44 hours    |
| EMERGENCY | Continuous     | On     | On   | ~12 hours    |

> 💡 At −20 °C with standard Li-ion, expect 40–60% of these figures. For alpine deployments use LiFePO4 (rated to −30 °C).

---

## Antenna Guide

| Frequency   | ¼-wave length | ½-wave length |
|-------------|---------------|---------------|
| 433.5 MHz   | **17.3 cm**   | 34.6 cm       |
| 868 MHz     | 8.6 cm        | 17.3 cm       |
| 915 MHz     | 8.2 cm        | 16.4 cm       |

The E22-400M30S module has an **SMA connector** — use a quality 433 MHz SMA whip antenna for best performance. Alternatively solder a 17.3 cm wire to the ANT pad.

**Best practices:**
- Vertical orientation for omni-directional coverage
- Keep antenna away from battery and metal enclosure walls
- A ground plane (copper foil) improves gain by ~3 dBi
- The higher PA power of the E22 (+30 dBm) compensates for antenna compromises

---

## Troubleshooting

| Symptom                            | Likely cause                        | Fix                                                         |
|------------------------------------|-------------------------------------|-------------------------------------------------------------|
| `[ERROR] SX1262 TX init FAILED: -2`| SPI wiring or missing BUSY pin      | Check GPIO 18/19/23/5/14/21 connections                     |
| Radio hangs on first call          | BUSY pin not wired                  | Wire BUSY to GPIO 21 — this is mandatory on SX1262          |
| OLED blank                         | Wrong SPI pins or soft-SPI conflict | Verify GPIO 15/13/4/16/17 match defines                     |
| No GPS fix after 2 minutes         | Obstructed sky view                 | Move outdoors; cold start can take 3 min; check GPIO 22/12  |
| Battery reads 0% / 100% stuck      | Divider not connected or wrong GPIO | Check R3a/R3b divider on GPIO 36; adjust BAT_VREF_MV        |
| Audio too quiet / no audio         | Wrong pin or missing AC cap         | Verify GPIO 25 and 10 µF cap orientation                    |
| SW_UP / SW_DN unresponsive         | No external pullup on input-only pin| Add 10 kΩ from GPIO 34/35 to 3.3 V                          |
| Device stuck in EMERGENCY          | RTC RAM flag set                    | Enter CONFIG mode and save — clears the flag                |
| `[WARN] NVS empty`                 | First boot or after factory reset   | Normal — configure via dashboard                            |
| Upload fails                       | Wrong board selected                | Select "ESP32 Dev Module" in Arduino IDE                    |
| GPS coordinates wrong format       | DDM misread                         | `N4553` = 45°53' N, not 45.53°; add `.` at position 3      |

---

## FAQ

**Q: What receiver do I need to hear the beacon?**
A: Any AM-mode receiver on 433 MHz: Baofeng with AM mode, handheld scanner, ham radio transceiver, or RTL-SDR + SDR# software. The SX1262 CW carrier is detected identically to OOK.

**Q: Can a rescuer decode the GPS coordinates without special software?**
A: Yes. `N4553 E01230` is plain Morse text. A trained operator hears `N 4 5 5 3 E 0 1 2 3 0` and plots it as 45°53' N, 12°30' E. Enter it into any map app.

**Q: How accurate are the GPS coordinates in the Morse message?**
A: The DDM format transmitted encodes ~0.1° minute precision (~185 m). Full decimal coordinates are logged to Serial at much higher precision. For search purposes, ~200 m accuracy is sufficient.

**Q: Is the SX1262 backward compatible with SX1276 receivers?**
A: Yes — the CW carrier signal is modulation-agnostic. Any AM-mode receiver that could hear the SX1276 OOK signal will equally hear the SX1262 CW carrier.

**Q: The battery icon shows a different % than my charger says. Why?**
A: The ESP32 ADC has ±5–10% inherent inaccuracy and the Li-ion curve is not universal. Calibrate `BAT_VREF_MV` by measuring BAT+ with a multimeter while connected and adjusting until the displayed mV matches.

**Q: Can I run this without the GPS module?**
A: Yes. Set `gpsEnabled = false` in the dashboard or NVS. The GPS module is completely optional — the firmware transmits `SOS` or `SOS DE [NAME]` as configured.

**Q: Does it work through snow?**
A: 433 MHz penetrates wet snow at ~3 dB/m attenuation. The E22-400M30S at +30 dBm PA compensates significantly. At 1 m burial depth expect ~3–9 dB signal loss — well within the link budget.

**Q: I upgraded from v4.0. Do I need to factory reset?**
A: Yes, mandatory. Hardware is completely different (ESP32 DevKit V1 instead of C3 SuperMini, SX1262 instead of SX1276) and the NVS schema has new keys. Factory reset, rewire, and reconfigure from scratch.

---

## Changelog

| Version | Date | Changes                                                                                                            |
|---------|------|--------------------------------------------------------------------------------------------------------------------|
| v5.4    | 2026 | Battery monitor: 100kΩ/100kΩ divider on GPIO36, piecewise Li-ion curve, pixel-art icon in all headers, CHG indicator; improved OLED graphics across all screens; `readBattery()` integrated into main loops; battery exposed in dashboard with animated bar |
| v5.3    | 2026 | Replaced potentiometers with 4-button control (MODE/SEL/UP/DN); OLED adj overlay; auto-repeat on UP/DN; NVS save via SEL long press |
| v5.2    | 2026 | Radio upgraded SX1276 → SX1262 (Ebyte E22-400M30S); BUSY pin GPIO21 mandatory; `ensureSpiStarted()` helper; TCXO 1.6V parameter |
| v5.1    | 2026 | GPS module NEO-6M: name + coordinates in Morse payload (`SOS DE [NAME] PSN [LAT] [LON]`); TinyGPS++ integration; RTC GPS cache; GPS wait screen; potentiometer volume/WPM control |
| v5.0    | 2026 | Ported to ESP32 DevKit V1 (30-pin); replaced SSD1306 0.96" with SSD1309 2.42" SPI (U8g2); replaced Adafruit with U8g2 driver; GPIO 25 DAC1 audio; VSPI for radio; improved OLED layouts; `audioDacSilence()` mid-rail parking |
| v4.0    | 2026 | Added SSD1306 0.96" OLED (I2C, GPIO 0/1); added 3.5mm audio jack (GPIO 18 PWM); SW_CONFIG moved GPIO1→GPIO21; audio/OLED NVS keys; `[OLED]` `[AUDIO]` log tags |
| v3.0    | 2025 | Initial public release: ESP32-C3 + SX1276, WiFi dashboard, deep sleep, frequency hopping, NVS config, RTC RAM state, CI/CD |

---

## CI/CD Workflow

The repository includes a GitHub Actions pipeline at `.github/workflows/aegis_suite.yml`.

```
push / PR / tag
      │
      ├── 🔍 validate          ← YAML syntax, required files, platformio.ini
      │
      ├── 🔨 build-arduino  ─── matrix: 240 MHz + 80 MHz
      ├── 🔧 build-pio       ─── esp32dev target
      └── 🛡️ static-analysis ─── cppcheck + size report
                │
                ├── 📊 size-report  (PR only — posts flash/RAM comment)
                ├── 🚀 release      (tag v*.*.* only — creates GitHub Release)
                └── 📋 notify       (always — writes CI summary)
```

Trigger a release:

```bash
git tag v5.4.0
git push origin v5.4.0
```

---

## License

```
MIT License

Copyright (c) 2026 Leonardo Galli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by [@Leo-Galli](https://github.com/Leo-Galli) for mountain safety.**

[![Stars](https://img.shields.io/github/stars/leo-galli/aegis-beacon?style=social)](https://github.com/leo-galli/aegis-beacon)
[![Forks](https://img.shields.io/github/forks/leo-galli/aegis-beacon?style=social)](https://github.com/leo-galli/aegis-beacon/fork)
[![Issues](https://img.shields.io/github/issues/leo-galli/aegis-beacon?style=flat-square)](https://github.com/leo-galli/aegis-beacon/issues)

*If this project saves a life, please open a PR and let us know.*

</div>