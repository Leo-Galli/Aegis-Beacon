---
title: "Configuration Reference"
description: "Technical documentation for Configuration Reference"
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

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `mode` | uint8 | 0 | Operating mode (0=BEACON, 1=SEARCH) |
| `freq` | float | 433.500 | Primary frequency (MHz) |
| `freqCount` | uint8 | 1 | Number of configured frequencies |
| `power` | int8 | 17 | TX power (dBm) |
| `wpm` | uint8 | 13 | Morse speed |
| `vol` | uint8 | 180 | Audio volume |
| `sleep` | uint16 | 10 | Sleep interval (seconds) |
| `repeat` | uint8 | 3 | Repeat count |
| `name` | string | "" | Operator name |
| `gpsEnabled` | bool | true | GPS module enabled |
| `gpsInBeacon` | bool | true | Include GPS in beacon |
| `oledEnabled` | bool | true | OLED enabled |
| `oledInvert` | bool | false | OLED invert colors |
| `audioEnabled` | bool | true | Audio enabled |

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
