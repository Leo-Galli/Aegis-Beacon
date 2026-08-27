# GPS Integration

Optional NEO-6M GPS module provides real-time coordinates embedded in the Morse payload.

## Hardware Connection

| GPS Pin | ESP32 GPIO | Notes |
|---------|------------|-------|
| VCC | 3V3 | 3.3V (most accept 3.3-5V) |
| GND | GND | Common ground |
| TX | GPIO 22 | GPS TX to ESP32 RX |
| RX | GPIO 12 | GPS RX from ESP32 TX |

## Coordinate Encoding

Compact DDM format: N4553 = 45 degrees 53 minutes North. E01230 = 12 degrees 30 minutes East. ~185m precision.

## Boot Behavior

GPS wait screen with satellite count. Press MODE to skip. Timeout after 60s transmits without coordinates.
