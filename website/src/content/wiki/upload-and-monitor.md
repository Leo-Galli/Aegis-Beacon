---
title: "Upload and Monitor"
description: "Flash the firmware with Arduino IDE or PlatformIO and read the live serial console"
---

# Upload and Monitor

## Overview

The firmware lives in `AegisBeacon.ino` at the repository root. Two flashing paths are supported: Arduino IDE and PlatformIO. Both end with the same live serial console at 115200 baud.

## Before You Flash

1. Install the ESP32 board support in Arduino IDE, or PlatformIO with the `espressif32` platform.
2. Install the four libraries: RadioLib (>= 6.0.0), ArduinoJson (>= 7.0.0), U8g2 (>= 2.34.0), TinyGPS++ (>= 1.0.3).
3. Connect the board and confirm the serial port enumerates.
4. Choose the right board: "ESP32 Dev Module" in Arduino IDE, `esp32dev` in PlatformIO.

## Arduino IDE

1. Open `AegisBeacon.ino`.
2. Tools > Board > ESP32 Dev Module.
3. Tools > Port > select the COM port.
4. Click Upload.
5. Open Serial Monitor at 115200 baud.

## PlatformIO

```ini
[env:esp32devkitv1]
platform  = espressif32
board     = esp32dev
framework = arduino
```

```bash
pio run --target upload
pio device monitor --baud 115200
```

## Reading the Console

| Tag | What it tells you |
|-----|-------------------|
| `[OK   ]` | Radio, OLED, GPS subsystems came up |
| `[ERROR]` | A subsystem failed - usually wiring |
| `[BAT  ]` | Battery mV and % every read |
| `[MODE ]` | Mode transitions |
| `[SCAN ]` | RSSI sweeps in SEARCH mode |
| `[GPS  ]` | Fix status and satellites |

## Upload Failure Recovery

| Symptom | Fix |
|---------|-----|
| "Connecting...__" loop | Hold BOOT on the ESP32 during upload |
| Port not found | Reinstall the USB-serial driver, change cable |
| Compile errors | Verify library versions match the DATASHEET |
| Watchdog resets | Rare with bad NVS; do a factory reset after flashing |

## After a Successful Flash

The device boots with hardcoded defaults. Do a [factory reset](/wiki/factory-reset-and-recovery) if you are upgrading from v4.0, then configure frequencies and identity via the [WiFi config portal](/wiki/wifi-config-portal).

## Related Pages

- [Software Build Process](/wiki/software-build-process)
- [Serial Debug System](/wiki/serial-debug-system)
- [Configuration Reference](/wiki/configuration-reference)
- [First Use](/wiki/first-use)
