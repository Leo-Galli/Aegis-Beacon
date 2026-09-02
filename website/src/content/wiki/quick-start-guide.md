---
title: "Quick Start Guide"
description: "Technical documentation for Quick Start Guide"
---

# Quick Start Guide

> [!TIP]
> This guide will help you build and flash your first Aegis-Beacon in under 30 minutes.

## Prerequisites

### Hardware

- **ESP32 DevKit V1** (30-pin)
- **Ebyte E22-400M30S** (SX1262 LoRa module)
- **SSD1309 2.42" OLED** (7-pin SPI)
- **Optional:** NEO-6M GPS module
- USB-C cable for programming

### Software

- **Arduino IDE** or **PlatformIO**
- **Git** for cloning the repository

## Step 1: Clone Repository

```bash
git clone https://github.com/Leo-Galli/Aegis-Beacon.git
cd Aegis-Beacon
```

## Step 2: Install Libraries

### Arduino IDE

1. Open `Sketch → Include Library → Manage Libraries`
2. Search and install:
   - `RadioLib` by Jan Gromes
   - `ArduinoJson` by Benoit Blanchon
   - `U8g2` by oliver
   - `TinyGPS++` by Mikal Hart

### PlatformIO

Libraries are auto-installed from `platformio.ini`.

## Step 3: Select Board

### Arduino IDE

1. `Tools → Board → ESP32 Dev Module`
2. `Tools → Port → COMx` (select your ESP32 port)

### PlatformIO

```ini
[env:esp32devkitv1]
platform  = espressif32
board     = esp32dev
framework = arduino
```

## Step 4: Upload Firmware

### Arduino IDE

Open `AegisBeacon.ino` and click Upload (→).

### PlatformIO

```bash
pio run --target upload
```

## Step 5: First Boot

1. Connect power via USB or battery
2. OLED shows boot screen with version info
3. Hold **SEL** button for 3 seconds to start WiFi AP
4. Connect to `AegisBeacon` WiFi network
5. Open `http://192.168.4.1` in browser
6. Configure your name, frequencies, and GPS settings
7. Save and reboot into BEACON mode

> [!IMPORTANT]
> The first boot may take up to 60 seconds while the OLED initializes and GPS acquires a fix (if enabled).

## Next Steps

- **[Assembly Guide](/wiki/assembly-guide)** -- Complete hardware assembly
- **[Configuration Reference](/wiki/configuration-reference)** -- All settings explained
- **[Operating Modes](/wiki/operating-modes)** -- Understanding the 4 modes
