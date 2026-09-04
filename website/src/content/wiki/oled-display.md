---
title: "OLED Display"
description: "SSD1309 layout reference: every screen, battery icon state and the U8g2 rendering path"
---

# OLED Display

## Overview

The SSD1309 2.42" OLED provides real-time status information across all operating modes. Connected via software SPI for flicker-free rendering.

## Hardware Specifications

| Parameter | Value |
|-----------|-------|
| **Driver** | SSD1309 |
| **Resolution** | 128x64 pixels |
| **Size** | 2.42 inches |
| **Interface** | Software SPI (7-pin) |
| **Refresh Rate** | 120 ms (8 Hz) |
| **Driver Library** | U8g2 |

## Pin Connection

| OLED Pin | ESP32 GPIO | Notes |
|----------|------------|-------|
| GND | GND | |
| VCC | 3.3V | 3.3V only |
| SCK (D0) | GPIO 15 | Software SPI clock |
| SDA (D1) | GPIO 13 | Software SPI data |
| RES (RESET) | GPIO 4 | Hardware reset |
| DC (A0) | GPIO 16 | Data/Command select |
| CS | GPIO 17 | Chip select (active LOW) |

> [!NOTE]
> Software SPI is used to avoid bus conflicts with the radio's hardware VSPI.

## Screen Layouts

### BOOT Screen

```
+----------------------------------+
| AEGIS-BEACON v5.4          [87%]|  <-- Inverted header with battery
| Emergency Radio System           |
|                                  |
| [Features enabled]               |
|                                  |
| Initializing...                  |
| [========              ] 45%     |  <-- Progress bar
+----------------------------------+
```

### BEACON Screen

```
+----------------------------------+
| TX BEACON #12             [87%]|  <-- Inverted header
|                                  |
|       433.500 MHz                |  <-- Large frequency
|                                  |
| CH:3 PWR:17 WPM:13              |  <-- Info line
| [==============        ] 67%     |  <-- TX progress
| > SOS DE MARIO ROSSI PSN...     |  <-- Scrolling payload
|                                  |
| GPS:FIX BAT:87% SLP:8s  [ADJ]  |  <-- Status bar
+----------------------------------+
```

### SEARCH Screen

```
+----------------------------------+
| RX SEARCH #5               [87%]|  <-- Inverted header
|                                  |
|       433.500 MHz                |  <-- Large frequency
|     -87 dBm                     |  <-- RSSI value
| [#########...........]  MEDIUM  |  <-- RSSI bar
|                                  |
| HIT: 434.500 MHz -87dBm         |  <-- Last detection
| SCAN:12 BAT:87%          [ADJ]  |  <-- Status bar
+----------------------------------+
```

### EMERGENCY Screen

```
+----------------------------------+
|                                  |
|          E M E R G E N C Y      |  <-- Alternating inverse
|                                  |
|             SOS                  |  <-- Giant SOS
|    EMERGENCY BEACON TX           |
|                                  |
|    433.500 MHz @ +22 dBm        |
|    N4553 E01230                  |
|                                  |
+----------------------------------+
```

### GPS WAIT Screen

```
+----------------------------------+
| ACQUIRING GPS FIX          [87%]|  <-- Inverted header
|                                  |
|            6                     |  <-- Satellite count
|                                  |
| [============          ] 60%     |  <-- Progress bar
|                                  |
| Fix: 45.53124 12.30456           |
| MODE: skip wait                  |
+----------------------------------+
```

### CONFIG Screen

```
+----------------------------------+
| CONFIGURATION MODE               |  <-- Inverted header
|                                  |
| SSID: AegisBeacon                |
| URL: 192.168.4.1                 |
|                                  |
| 1. Connect to WiFi               |
| 2. Open browser                  |
| 3. Configure settings            |
+----------------------------------+
```

## Battery Icon

Located in top-right corner of header bar.

| Fill Level | Battery % | Icon |
|------------|-----------|------|
| 4 segments | 76-100% | `[====]` |
| 3 segments | 51-75% | `[=== ]` |
| 2 segments | 26-50% | `[==  ]` |
| 1 segment | 11-25% | `[=   ]` |
| Blinking ! | 0-10% | `[!   ]` blinks every 500ms |
| Letter C | Charging | `[ C  ]` |

> [!WARNING]
> Battery icon blinks when charge drops below 10%. Replace or recharge immediately.

## Display Features

### Large Frequency Display

Uses `logisoso24` font for maximum readability outdoors. Clear at arm's length distance.

### GPS Fix Indicator

- **Solid square:** Fix acquired
- **Outline square:** Searching for fix
- **No indicator:** GPS disabled

### Adj Overlay

Bottom 12px inverted bar shows live VOL or WPM while adjusting. Appears for 2.5 seconds after button press.

### TX Payload Scroll

Message scrolls through bottom bar during transmission. Shows full `SOS DE MARIO ROSSI PSN N4553 E01230`.

### Power Save

OLED turns off before deep sleep:

```cpp
u8g2.setPowerSave(1); // Turn off
u8g2.setPowerSave(0); // Turn on
```

### Invert Mode

Configurable for bright sunlight readability. Toggle via CONFIG portal or NVS setting.

## U8g2 Configuration

```cpp
#include <U8g2lib.h>

// Software SPI constructor
U8g2_SSD1309_128X64_NONAME_1_4W_SW_SPI u8g2(
  U8G2_R0,     // Rotation
  15,          // SCK
  13,          // SDA/MOSI
  17,          // CS
  16,          // DC
  4            // RESET
);

void initOLED() {
  u8g2.begin();
  u8g2.setFlipMode(0);
  u8g2.setFontMode(1);
}
```

> [!TIP]
> U8g2 full-frame buffer eliminates flicker. Each screen update draws to buffer then sends in one SPI transaction.
