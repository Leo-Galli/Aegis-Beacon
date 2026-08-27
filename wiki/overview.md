# Project Overview

**Aegis-Beacon** is a low-cost, open-source emergency radio-location system based on LoRa technology. Designed for mountain rescue, land operations, and critical civilian scenarios where cellular infrastructure is unavailable.

| Parameter | Value |
|-----------|-------|
| BOM Cost | ~$23-28 USD |
| Frequency | 410-525 MHz |
| Runtime | 65h (BEACON mode) |
| Max Range | 15 km (LOS) |
| Sleep Current | 10 uA |
| Modes | 4 (BEACON/SEARCH/CONFIG/EMERGENCY) |

## Key Features

### Emergency Morse Beacon
Automatically transmits SOS + name + GPS coordinates in CW Morse code across all configured frequencies.

### Multi-Frequency Scanner
Sequentially scans up to 10 stored frequencies measuring RSSI to locate beacon signals.

### WiFi Configuration Portal
Captive portal at 192.168.4.1 for field configuration without reflashing firmware.

### GPS Integration
Optional NEO-6M module provides real-time NMEA coordinates embedded in Morse payload.

### Ultra-Low Power
10 microamp deep sleep between TX cycles. 65-hour runtime on a single 18650 cell.

### Open Hardware
Full schematics, Gerber files, and BOM under MIT license. Total cost under $28.

## Quick Start

1. **Purchase Components** - Use the [BOM Builder](/builder) for sourcing links. Essential build: ~$23-28.
2. **Assemble PCB** - Follow the 10-step assembly guide. Requires SMD soldering skills. ~3-4 hours.
3. **Flash Firmware** - Install PlatformIO, clone repo, run `pio run --target upload`.
4. **Configure via WiFi** - Connect to "AEGIS-BEACON", open 192.168.4.1, set name and frequencies.
5. **Deploy** - Mount in enclosure, attach antenna, insert battery, switch to BEACON mode.

## System Architecture

```
ESP32 --SPI-- SX1262 (RF)
ESP32 --UART2-- NEO-6M (GPS)
ESP32 --SW SPI-- SSD1309 (OLED)
ESP32 --DAC1-- Audio Circuit
ESP32 --ADC-- Battery Monitor
TP4056 -- 18650 Li-ion Cell
```

## Morse Payload Format

```
SOS DE FIRST LAST PSN N4553 E01230
```

DDM encoding: N4553 = 45 degrees 53 minutes North. E01230 = 12 degrees 30 minutes East. ~185m precision.

## License

This project is distributed under the MIT License. Source code, hardware schematics, and documentation are freely available.
