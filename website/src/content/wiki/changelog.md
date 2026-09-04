---
title: "Changelog"
description: "Version history of Aegis-Beacon firmware and hardware, aligned with the repository DATASHEET"
---

# Changelog

All notable changes across firmware, hardware and documentation, mirroring the authoritative [DATASHEET](../../../DATASHEET.md) at the repository root.

## Version 5.4 (Current)

- Battery monitor: 100 kohm divider on GPIO 36, 9-point piecewise Li-ion curve, pixel-art icon in every screen header, CHG (charging) indicator, animated dashboard bar.
- Improved OLED graphics across all screens.
- `readBattery()` integrated into the main loops; battery state exposed live on every screen.

## Version 5.3

- Replaced the potentiometers with a 4-button control panel: SW_MODE / SW_SEL / SW_UP / SW_DN.
- OLED adjustment overlay and auto-repeat on held buttons.
- NVS save via SW_SEL long press.

## Version 5.2

- Radio upgraded from SX1276 to **SX1262** (Ebyte E22-400M30S).
- BUSY pin on GPIO 21 is now mandatory; `ensureSpiStarted()` helper added.
- TCXO 1.6 V parameter for the E22 module.

## Version 5.1

- NEO-6M GPS: name + coordinates in the Morse payload (`SOS DE [NAME] PSN [LAT] [LON]`).
- TinyGPS++ integration and RTC GPS cache.
- GPS wait screen with satellite count and progress bar.

## Version 5.0

- Ported to **ESP32 DevKit V1 (30-pin)**.
- Display upgraded from SSD1306 0.96" I2C to **SSD1309 2.42" SPI** (U8g2 driver).
- GPIO 25 native DAC1 audio output; `audioDacSilence()` mid-rail parking.
- Radio moved to the VSPI bus.

## Version 4.0

- Added SSD1306 0.96" OLED (I2C, GPIO 0/1).
- Added 3.5 mm audio jack (GPIO 18 PWM).
- SW_CONFIG moved from GPIO 1 to GPIO 21.
- Audio/OLED NVS keys introduced.

## Version 3.0 (Initial Release)

- Initial public release: ESP32-C3 + SX1276.
- WiFi dashboard, deep sleep, frequency hopping, NVS config, RTC RAM state, CI/CD.

## Upgrading

### From v4.0 to v5.4 (Breaking Hardware Revision)

> [!WARNING]
> This is a full hardware revision. Do not run v5.x firmware on the original ESP32-C3 board with the RA-02 module without complete rewiring.

| Feature | v4.0 | v5.4 |
|---------|------|------|
| Microcontroller | ESP32-C3 SuperMini | **ESP32 DevKit V1 (30-pin)** |
| Radio | SX1276 RA-02 (OOK, +17 dBm) | **SX1262 E22-400M30S (CW/FSK, +22/+30 dBm)** |
| Display | SSD1306 0.96" I2C 128x64 | **SSD1309 2.42" SPI 128x64 (U8g2)** |
| GPS | None | **NEO-6M UART, coords + name in Morse payload** |
| Battery monitor | None | **ADC voltage divider to % + mV, live on every screen** |
| Parameter adjustment | Dashboard only | **4 physical buttons: SW_MODE / SEL / UP / DN** |
| Morse payload | `SOS` | `SOS DE [NAME] PSN [LAT] [LON]` (configurable) |
| Audio output pin | GPIO 18 (PWM only) | **GPIO 25 (native DAC1 + LEDC)** |
| BUSY pin | N/A | **GPIO 21, mandatory on SX1262** |
| Display libraries | Adafruit SSD1306 + GFX | **U8g2 + TinyGPS++** |
| BOM cost | ~$12-14 USD | ~$23-28 USD |

**Migration steps:** factory reset NVS, rewire all GPIO connections per the [GPIO pin map](/wiki/gpio-pin-mapping), install the new library dependencies (U8g2, TinyGPS++), then reconfigure via the dashboard.
