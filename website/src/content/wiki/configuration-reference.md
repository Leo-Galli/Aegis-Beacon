---
title: "Configuration Reference"
description: "Every firmware constant, NVS key, button binding and calibration procedure in one reference"
---

# Configuration Reference

## Overview

All configuration is stored in NVS (Non-Volatile Storage) and survives power cycles. Settings can be changed via the CONFIG portal or by editing firmware constants.

## Firmware Constants

> [!INFO]
> These constants are compile-time defaults. Change them before flashing, or use the CONFIG portal to modify at runtime.

### Radio Settings

```cpp
#define DEFAULT_FREQ_MHZ      433.500f   // Default frequency (MHz)
#define DEFAULT_POWER_DBM     17         // TX power (dBm) -- up to 22 via RadioLib
#define DEFAULT_SLEEP_SEC     10         // Deep sleep between TX cycles (s)
#define DEFAULT_REPEAT_COUNT  3          // Message repetitions per frequency
```

### Morse Settings

```cpp
#define DEFAULT_MESSAGE       "SOS"      // Base Morse message
#define DEFAULT_WPM           13         // Words per minute
```

### Audio Settings

```cpp
#define DEFAULT_AUDIO_VOL     180        // 0-255 DAC volume
#define DEFAULT_AUDIO_ENABLE  true       // Audio on/off
```

### Display Settings

```cpp
#define DEFAULT_OLED_ENABLE   true       // OLED on/off
#define DEFAULT_OLED_INVERT   false      // Invert colors for sunlight
```

### Scan Settings

```cpp
#define DEFAULT_SCAN_DWELL_MS 400        // RSSI dwell time per frequency (ms)
#define DEFAULT_RSSI_THRESH   -90        // Detection threshold (dBm)
```

### Battery Settings

```cpp
#define BAT_VREF_MV           3900       // ADC full-scale voltage in mV
#define BAT_SAMPLES           32         // ADC samples per reading
#define BAT_READ_MS           5000       // Battery read interval (ms)
```

### GPS Settings

```cpp
#define GPS_FIX_TIMEOUT_S     60         // Max seconds to wait for fix
#define GPS_MIN_SATS          3          // Minimum satellites for valid fix
```

## NVS Keys

All settings live in the ESP32 Non-Volatile Storage under the namespace `aegis`. The exact keys below match the firmware `Preferences` reads/writes.

| Key | Type | Default | Range / Notes |
|-----|------|---------|---------------|
| `fcount` | uint8 | 1 | 1-10 frequencies |
| `freq0`..`freq9` | float | 433.500 | MHz, one key per frequency slot |
| `msg` | string | "SOS" | Max 64 chars, A-Z 0-9 space |
| `wpm` | uint8 | 13 | 5-40 |
| `pwr` | int8 | 17 | -9 to +22 dBm |
| `sleep` | ulong | 10 | Deep sleep seconds between TX cycles |
| `dwell` | uint16 | 400 | 50-2000 ms scan dwell time |
| `rssi` | int8 | -90 | -120 to -40 dBm detection threshold |
| `mode` | uint8 | 0 | 0=BEACON 1=SEARCH 2=CONFIG 3=EMERGENCY |
| `aswitch` | bool | false | Auto-switch to BEACON on low battery |
| `rep` | uint8 | 1 | 1-10 message repetitions per frequency |
| `avol` | uint8 | 180 | 0-255 DAC volume |
| `aen` | bool | true | Master audio enable |
| `olen` | bool | true | OLED enable |
| `olinv` | bool | false | OLED invert mode |
| `gpsen` | bool | false | GPS module enable |
| `gpsbeac` | bool | false | Include GPS coords in Morse payload |
| `gpstmo` | uint8 | 30 | GPS fix wait timeout (10-120 s) |
| `namen` | bool | false | Include name in Morse payload |
| `fname` | string | "" | First name (max 32 chars) |
| `lname` | string | "" | Last name (max 32 chars) |
| `poten` | bool | false | SW_UP/DN volume adjust enable |
| `potwpm` | bool | false | SW_UP/DN WPM adjust enable |

> [!NOTE]
> Key names are intentionally short (NVS has per-key overhead). `freq0`..`freq9` are separate keys, not an array.

**Fail-safe:** if NVS is empty, corrupt, or missing any key, the firmware falls back to the hardcoded defaults in the section above. The device is always functional after a factory reset or first flash.

## Button Reference

| Button | GPIO | Press | Duration | Action |
|--------|------|-------|----------|--------|
| **SW_MODE** | 33 | Short | < 2s | Toggle BEACON/SEARCH |
| **SW_MODE** | 33 | Long | >= 2s | Activate EMERGENCY |
| **SW_SEL** | 32 | Short | < 3s | Toggle VOL/WPM target |
| **SW_SEL** | 32 | Long | >= 3s | Launch WiFi AP |
| **SW_SEL** | 32 | Hold | >= 1s | Save to NVS |
| **SW_UP** | 35 | Short | -- | Increment parameter |
| **SW_UP** | 35 | Hold | > 500ms | Auto-repeat increment |
| **SW_DN** | 34 | Short | -- | Decrement parameter |
| **SW_DN** | 34 | Hold | > 500ms | Auto-repeat decrement |
| **MODE+SEL** | 33+32 | Both | >= 5s | Factory reset |

> [!WARNING]
> Factory reset erases all NVS configuration. Device reboots with default settings.

## Factory Reset Procedure

1. Power on device
2. Hold both MODE and SEL buttons
3. Keep holding for 5 seconds
4. Device reboots with default configuration
5. Reconfigure via CONFIG portal

## Calibration

### Battery Voltage

If readings differ from multimeter measurement:

```cpp
#define BAT_VREF_MV   3900   // Increase if too low, decrease if too high
```

### Audio Volume

Default 180 (~70%). Adjust via UP/DN buttons when VOL is selected.

### Morse Speed

Default 13 WPM. Adjust via UP/DN buttons when WPM is selected.

> [!TIP]
> Hold SEL for 1 second to save current VOL and WPM to NVS. Values persist across power cycles.
