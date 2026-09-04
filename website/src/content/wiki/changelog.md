---
title: "Changelog"
description: "Version history and release notes for Aegis-Beacon firmware and hardware"
order: 20
---

# Changelog

All notable changes to the Aegis-Beacon project are documented here. This covers firmware, hardware, and documentation changes.

## Version 5.4 (Current)

### Firmware

- Fixed GPS NMEA parsing timeout handling
- Improved Morse code timing accuracy to within 2% of specified WPM
- Added configurable TX power levels (5, 10, 14, 17, 20, 22 dBm)
- Optimized deep sleep current to 10 uA (was 12 uA)
- Added battery voltage averaging (10-sample window) for stable readings
- Fixed WiFi captive portal crash on prolonged Config mode usage

### Hardware

- Updated BOM with current AliExpress pricing
- Added SMA bulkhead connector variant to assembly guide
- Revised GPIO pin mapping documentation for clarity

### Website

- Migrated to Astro framework
- Added interactive firmware demo
- Added BOM builder tool
- Expanded wiki to 25+ pages

## Version 5.3

### Firmware

- Added OTA (Over-The-Air) firmware update capability
- Implemented WiFi provisioning for initial network setup
- Added support for NEO-M9N GPS module (in addition to NEO-6M)
- Fixed watchdog timer reset during WiFi operations
- Added GPS cold start optimization (faster first fix)

### Hardware

- Added NEO-M9N as alternative GPS module option
- Updated schematic for improved ESD protection on USB port
- Added test points for production quality control

## Version 5.2

### Firmware

- Implemented PMR446 frequency presets for EU compliance
- Added configurable frequency list (up to 8 frequencies)
- Improved RSSI measurement accuracy in Search mode
- Added audio tone frequency scaling in Search mode (pitch proportional to RSSI)
- Fixed LED blinking pattern in Emergency mode

### Hardware

- Removed unused components from BOM (cost reduction)
- Updated antenna recommendation to wider-band model
- Added enclosure mounting holes for DIN rail clip

## Version 5.1

### Firmware

- Added GPS position averaging for improved accuracy
- Implemented Morse code configurable WPM (5-25)
- Added SOS pattern with position encoding
- Fixed power management during WiFi operations
- Added device serial number display in Config mode

### Hardware

- Updated TP4056 charger to USB-C variant
- Added reverse polarity protection on battery input
- Improved SMA connector mounting reliability

## Version 5.0

### Firmware

- Complete rewrite of firmware architecture
- Implemented state machine for mode management
- Added WiFi captive portal for configuration
- Implemented OTA update capability (disabled by default)
- Added power management with hardware watchdog
- Full RadioLib integration for SX1262 control

### Hardware

- Migrated from SX1276 to SX1262 transceiver
- Added SSD1309 OLED display (replaced manual-only interface)
- Integrated NEO-6M GPS module on main PCB
- Added TP4056 charging circuit
- Redesigned enclosure for 3D printing

## Version 4.x

Legacy versions. These are archived and no longer maintained.

### Key Features of v4

- SX1276 LoRa transceiver
- Arduino-based firmware (pre-PlatformIO)
- 4 operating modes (basic implementation)
- No GPS integration
- No WiFi configuration
- Manual frequency selection via button presses

## Version 3.x

### Key Features of v3

- Initial SX1262 support
- Basic Morse beacon functionality
- No OLED display
- No GPS
- Single frequency operation

## Upgrading

### From v5.x to v5.4

1. Connect the device via USB.
2. Open PlatformIO in VS Code.
3. Select the correct serial port.
4. Upload the new firmware.
5. Settings are preserved in non-volatile storage.

> [!WARNING]
> Major version upgrades (v4 to v5) may reset stored settings to defaults. Record your configuration before upgrading.

### From v4.0 to v5.4 (Breaking Hardware Revision)

Do not run v5.x firmware on the original ESP32-C3 board with the RA-02 module without complete rewiring.

| Feature | v4.0 | v5.4 |
|---------|------|------|
| Microcontroller | ESP32-C3 SuperMini | ESP32 DevKit V1 (30-pin) |
| Radio | SX1276 RA-02 (OOK, +17 dBm) | SX1262 E22-400M30S (CW/FSK, +22/+30 dBm) |
| Display | SSD1306 0.96" I2C 128x64 | SSD1309 2.42" SPI 128x64 (U8g2) |
| GPS | None | NEO-6M UART — coords + name in Morse payload |
| Battery monitor | None | ADC voltage divider to % + mV, live on every screen |
| Parameter adjustment | Dashboard only | 4 physical buttons: SW_MODE / SEL / UP / DN |
| Morse payload | `SOS` | `SOS DE [NAME] PSN [LAT] [LON]` (configurable) |
| Audio output pin | GPIO 18 (PWM only) | GPIO 25 (native DAC1 + LEDC) |
| BUSY pin | N/A | GPIO 21 — mandatory on SX1262 |
| Display libraries | Adafruit SSD1306 + GFX | U8g2 + TinyGPS++ |
| BOM cost | ~$12-14 USD | ~$23-28 USD |

**Migration steps:** factory-reset NVS, rewire all GPIO connections per the GPIO pin map, install the new library dependencies (U8g2, TinyGPS++), then reconfigure via the dashboard.

### OTA Updates

If OTA updates are enabled in the firmware:

1. Connect to the AEGIS-SETUP WiFi network.
2. Open 192.168.4.1 in a browser.
3. Navigate to the Firmware tab.
4. Select the .bin file and upload.
5. The device will reboot automatically.
