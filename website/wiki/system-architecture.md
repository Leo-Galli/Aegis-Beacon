# System Architecture

## Overview

The Aegis-Beacon system consists of three main layers: **Hardware**, **Firmware**, and **Software**. Each layer is designed for reliability in emergency situations.

## Hardware Architecture

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   ESP32 DevKit   |<--->|  E22-400M30S     |<--->|  433 MHz Antenna |
|   (MCU)          | SPI |  (SX1262 Radio)  |     |                  |
|                  |     |                  |     +------------------+
+--------+---------+     +------------------+
         |
         | Software SPI
         v
+------------------+     +------------------+
|                  |     |                  |
|  SSD1309 OLED    |     |  NEO-6M GPS      |
|  (128x64)        |     |  (UART2)         |
|                  |     |                  |
+------------------+     +------------------+
         |
         | GPIO
         v
+------------------+     +------------------+
|                  |     |                  |
|  4-Button Panel  |     |  Audio Output    |
|  MODE/SEL/UP/DN  |     |  (GPIO 25 DAC1)  |
|                  |     |                  |
+------------------+     +------------------+
```

## Data Flow

### BEACON Mode

```
GPS Module --> NMEA Parser --> Payload Builder --> Morse Engine --> SX1262 TX
    |                                        |
    +--> RTC RAM Cache <-- Deep Sleep Cycle --+
```

### SEARCH Mode

```
SX1262 RX --> RSSI Measurement --> Audio Generator --> DAC1 Output
    |                                |
    +--> OLED Display <-- OLED Driver --+
```

## Power Distribution

| Component | Supply | Current |
|-----------|--------|---------|
| ESP32 MCU | 3.3V (AMS1117) | 10 uA - 240 mA |
| SX1262 Radio | 3.3V direct | 5 mA - 120 mA |
| SSD1309 OLED | 3.3V direct | 0.3 mA - 6 mA |
| NEO-6M GPS | 3.3V direct | 25 mA - 30 mA |
| Voltage Divider | BAT+ direct | 0.021 mA |
| LEDs | 3.3V via 330R | 2 mA each |
| Audio Output | DAC1 | 0 mA - 5 mA |

## Communication Interfaces

| Interface | Pins | Speed | Purpose |
|-----------|------|-------|---------|
| **VSPI** | GPIO 18/19/23/5 | 10 MHz | SX1262 Radio |
| **Software SPI** | GPIO 15/13/4/16/17 | 2 MHz | SSD1309 OLED |
| **UART2** | GPIO 22/12 | 9600 baud | NEO-6M GPS |
| **DAC1** | GPIO 25 | 40 kHz | Audio Output |
| **ADC1** | GPIO 36 | 12-bit | Battery Monitor |

## Memory Map

| Region | Size | Usage |
|--------|------|-------|
| **RTC RAM** | 8 KB | Mode state, cycle counter, GPS fix, scan hits |
| **NVS** | 64 KB | Configuration (frequencies, WPM, power, name) |
| **Flash** | 4 MB | Firmware code, fonts, UI assets |
| **SRAM** | 520 KB | Runtime data, OLED buffer, radio buffers |

## Boot Sequence

1. **Hardware Init** -- GPIO, SPI, UART, ADC
2. **NVS Load** -- Read configuration from flash
3. **OLED Init** -- Display boot screen
4. **Radio Init** -- SX1262 SPI configuration
5. **GPS Init** (if enabled) -- UART2 start, NMEA parser
6. **Mode Start** -- Enter BEACON/SEARCH/CONFIG/EMERGENCY
7. **Main Loop** -- Mode-specific task execution
8. **Deep Sleep** (BEACON) -- RTC wakeup, state preservation

> [!NOTE]
> RTC RAM preserves mode, cycle counters, and GPS fix across deep sleep cycles. NVS stores persistent configuration that survives power cycles.
