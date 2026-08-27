# GPS Integration

## Overview

The NEO-6M GPS module provides real-time coordinate acquisition for embedding in Morse transmissions. GPS is completely optional -- the beacon works without it.

## Hardware Connection

### UART2 Configuration

| Signal | ESP32 GPIO | GPS Pin | Notes |
|--------|------------|---------|-------|
| RX | GPIO 22 | TX | GPS TX to ESP32 RX (input-only) |
| TX | GPIO 12 | RX | ESP32 TX to GPS RX |

**Baud rate:** 9600 (NEO-6M default)

> [!NOTE]
> UART2 is started only when `gpsEnabled = true` in configuration.

## NMEA Parsing

### TinyGPS++ Integration

```cpp
#include <TinyGPSPlus.h>

TinyGPSPlus gps;
HardwareSerial GPSSerial(2);

void initGPS() {
  GPSSerial.begin(9600, SERIAL_8N1, 22, 12);
}

void readGPS() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }
  
  if (gps.location.isValid()) {
    lat = gps.location.lat();
    lon = gps.location.lng();
    sats = gps.satellites.value();
  }
}
```

## Payload Formats

### Configuration Options

| Config | Morse Message |
|--------|---------------|
| Base only | `SOS` |
| Name only | `SOS DE MARIO ROSSI` |
| GPS only | `SOS PSN N4553 E01230` |
| Name + GPS | `SOS DE MARIO ROSSI PSN N4553 E01230` |

### GPS Coordinate Encoding

Truncated DDM (Degrees + Decimal Minutes x 10):

```
N4553 = 45 53' N (lat 45.883)
E01230 = 12 30' E (lon 12.50)
```

> [!INFO]
> This encoding is intentionally compact to minimize transmission time. Full decimal coordinates are logged to Serial at much higher precision.

## GPS Boot Behavior

### Boot Sequence

1. If `gpsEnabled` and no RTC fix cached: show **GPS wait screen**
2. Display satellite count and progress bar
3. Press MODE to skip wait at any time
4. If timeout elapses: transmit without coordinates
5. Once fix acquired: store in RTC RAM

### Fix Quality

| Condition | Payload |
|-----------|---------|
| Fresh fix (< 3s age, >= 3 sats) | Current fix |
| Stale fix (RTC cache) | Cached fix (marked stale) |
| No fix + timeout | `PSN UNKN` |

### Configuration Parameters

| Parameter | Default | Range | Notes |
|-----------|---------|-------|-------|
| `gpsEnabled` | true | true/false | Enable/disable module |
| `gpsIncludeInBeacon` | true | true/false | Include in Morse payload |
| `gpsFixTimeout` | 60s | 10-120s | Max wait for fix at boot |
| `gpsMinSats` | 3 | 1-10 | Minimum satellites for valid fix |

> [!TIP]
> Press MODE during GPS wait to skip and transmit without coordinates. Useful when time is critical.

## RTC RAM Storage

GPS fix is stored in RTC RAM to survive deep sleep cycles:

```cpp
struct GPSState {
  double lat;
  double lon;
  uint32_t timestamp;
  uint8_t sats;
  bool valid;
};

RTC_DATA_ATTR GPSState lastFix;
```

### Benefits

- Coordinates available immediately after wake
- No cold start delay
- Last known position transmitted even without fresh fix

## Serial Output

### GPS Debug Messages

```
[      45][GPS  ] Waiting for GPS fix (timeout 30s)...
[   12400][GPS  ] Fix acquired: 45.53124  12.30456  sats=6
[   12401][INFO ] Payload ready: "SOS DE MARIO ROSSI PSN N4553 E01230"
```

### Coordinates in Serial

Full decimal coordinates logged at higher precision:

```
[GPS] Location: 45.531243, 12.304567 (6 sats, HDOP=1.2)
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No fix after 2 min | Obstructed sky | Move outdoors |
| Fix timeout | Weak signal | Check antenna, wait 5+ min |
| Wrong coordinates | DDM format | `N4553` = 45 53' N, not 45.53 |
| GPS not starting | Module disabled | Enable in CONFIG portal |

> [!WARNING]
> Cold start can take 5-15 minutes. Plan accordingly for alpine deployments.
