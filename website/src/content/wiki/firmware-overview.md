---
title: "Firmware Overview"
description: "Technical documentation for Firmware Overview"
---

# Firmware Overview

## Overview

The Aegis-Beacon firmware is written in C++ using the Arduino framework. It runs on the ESP32 DevKit V1 and controls all hardware peripherals.

## Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **RadioLib** | >= 6.0.0 | SX1262 radio control |
| **ArduinoJson** | >= 7.0.0 | JSON serialization |
| **U8g2** | >= 2.34.0 | SSD1309 OLED driver |
| **TinyGPS++** | >= 1.0.3 | NMEA GPS parsing |

> [!NOTE]
> U8g2 replaces the Adafruit SSD1306 + GFX libraries used in v4.0. It supports the SSD1309 natively with full-frame buffer for flicker-free rendering.

## Code Structure

```
AegisBeacon.ino
├── Configuration (config.h)
│   ├── Pin definitions
│   ├── Default values
│   └── Compile-time options
├── Hardware Drivers
│   ├── Radio (SX1262 via RadioLib)
│   ├── Display (SSD1309 via U8g2)
│   ├── GPS (NEO-6M via TinyGPS++)
│   └── Audio (DAC1 + LEDC PWM)
├── Core Systems
│   ├── Morse Engine
│   ├── Battery Monitor
│   ├── Button Handler
│   └── NVS Storage
├── Operating Modes
│   ├── BEACON Mode
│   ├── SEARCH Mode
│   ├── CONFIG Mode
│   └── EMERGENCY Mode
└── Utilities
    ├── Serial Debug
    ├── RTC RAM
    └── Deep Sleep
```

## Key Functions

### Main Loop

```cpp
void loop() {
  // Read buttons
  handleButtons();
  
  // Mode-specific logic
  switch (currentMode) {
    case MODE_BEACON:
      beaconLoop();
      break;
    case MODE_SEARCH:
      searchLoop();
      break;
    case MODE_CONFIG:
      configLoop();
      break;
    case MODE_EMERGENCY:
      emergencyLoop();
      break;
  }
  
  // Update display
  updateOLED();
  
  // Read battery
  readBattery();
}
```

### Radio Initialization

```cpp
void initRadio() {
  int state = radio.beginFSK();
  if (state != RADIOLIB_ERR_NONE) {
    Serial.println("[ERROR] SX1262 init FAILED");
    return;
  }
  
  // Configure for CW mode
  radio.setFrequency(currentFreq);
  radio.setOutputPower(txPower);
  
  Serial.println("[OK] SX1262 ready");
}
```

### Morse Transmission

```cpp
void transmitMorse(String message) {
  for (char c : message) {
    if (c == ' ') {
      delay(unitMs * 7); // Word gap
    } else {
      // Transmit dot or dash pattern
      transmitChar(c);
    }
    delay(unitMs); // Intra-character gap
  }
}
```

## Build Configuration

### PlatformIO

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
```

### Arduino IDE

1. Install ESP32 board support
2. Add libraries via Library Manager
3. Select "ESP32 Dev Module" board
4. Upload AegisBeacon.ino

> [!IMPORTANT]
> Always perform a factory reset after upgrading from v4.0. The NVS schema has changed and old configuration will cause errors.

## Debug Output

Connect at **115200 baud, 8N1** for serial debug output.

| Tag | Color | Meaning |
|-----|-------|---------|
| `[INFO ]` | Cyan | Normal operation |
| `[OK   ]` | Green | Successful operation |
| `[WARN ]` | Yellow | Non-fatal anomaly |
| `[ERROR]` | Red | Hardware/radio failure |
| `[SCAN ]` | Blue | RSSI scan result |
| `[GPS  ]` | Cyan | GPS engine |
| `[BAT  ]` | Green | Battery reading |

> [!TIP]
> Set `DEBUG_VERBOSE 1` for per-symbol Morse timing and RadioLib state codes.
