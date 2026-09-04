---
title: "Quick Start Guide"
description: "From zero to a transmitting beacon in under 30 minutes: parts, flash and first boot"
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

### What You Should See on Boot

| Screen element | Expected value |
|----------------|----------------|
| Inverted header | `AEGIS-BEACON v5.4` |
| Subtitle line | Build feature flags (SX1262, GPS, BTN, BAT, SSD1309) |
| Battery icon + % | e.g. `[███ ] 87%` |
| Status bar | `INITIALISING...` then mode name |

If the display stays dark, check that the OLED is on 3.3 V (never 5 V), the software-SPI wiring matches the [GPIO pin map](/wiki/gpio-pin-mapping), and that contrast/`displayInit` completed in the serial log.

## Step 6: Verify the Radio Works

Before relying on the beacon in the field, confirm it actually transmits:

1. Enter **BEACON** mode (short-press MODE).
2. Hold an AM-mode scanner, SDR dongle, or a second Aegis-Beacon in SEARCH mode within 1-2 m.
3. You should hear (or see, on an SDR waterfall) clean CW keying bursts on the configured frequency.
4. With an SDR you should see a sharp carrier appear during each dot and dash -- SX1262 CW keying switches the carrier on and off directly.

> [!TIP]
> No receiver handy? Watch the OLED TX progress bar and the LED: in BEACON mode the red LED blinks with each transmission cycle. The serial console also logs `TX done` with the character count and duration.

## Step 7: Emergency Mode Test (Optional)

Hold **MODE for 2 seconds** to enter EMERGENCY mode. The display switches to an inverted full-screen `SOS`, TX runs continuously at maximum power with the full payload, and no deep sleep is entered.

> [!WARNING]
> Only test EMERGENCY mode briefly (a few seconds) and with a matched antenna connected. Continuous +22 dBm transmission drains the battery quickly and stresses the PA.

## Common First-Boot Issues

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Hang on first radio call | SX1262 BUSY not wired to GPIO 21 | Wire GPIO 21, see GPIO map |
| No OLED output | Wrong SPI pins or 5 V on VCC | Re-check wiring, 3.3 V only |
| `SOS` only, no GPS | GPS disabled or no fix yet | Enable GPS, wait for fix screen |
| Device resets in a loop | Weak battery or brown-out | Charge cell; check TP4056 output |
| Config portal unreachable | Wrong AP name or 192.168.4.1 conflicts | Forget network, retry; check OLED SSID/IP |

See the full [Troubleshooting](/wiki/troubleshooting) page for deeper diagnosis.

## Next Steps

- **[Assembly Guide](/wiki/assembly-guide)** -- Complete hardware assembly
- **[Configuration Reference](/wiki/configuration-reference)** -- All settings explained
- **[Operating Modes](/wiki/operating-modes)** -- Understanding the 4 modes
- **[Field Deployment Guide](/wiki/field-deployment)** -- Preparing for a real mission
