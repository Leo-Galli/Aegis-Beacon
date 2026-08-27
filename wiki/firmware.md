# Firmware

Written in C++ (Arduino/PlatformIO), based on RadioLib >= 6.x for the SX1262 front end, U8g2 >= 2.34 for the SSD1309 display, and TinyGPS++ >= 1.0.3 for NMEA coordinates. The WiFi/BT stack is disabled in BEACON/SEARCH to save ~120 mA.

## Operating Modes

Four modes (BEACON / SEARCH / CONFIG / EMERGENCY) with ~10 uA deep sleep, a 30 s hardware watchdog, IRQ-driven DIO1, and mandatory polling of SX1262 BUSY GPIO 21.

## Libraries

- **RadioLib >= 6.x** - SX1262 transceiver driver
- **U8g2 >= 2.34** - SSD1309 OLED display driver
- **TinyGPS++ >= 1.0.3** - NMEA sentence parser
- **ArduinoJson >= 7.x** - Configuration dashboard JSON

## Build Instructions

```bash
# Install PlatformIO
pip install platformio

# Build firmware
pio run

# Upload to ESP32
pio run --target upload

# Monitor serial output
pio device monitor
```
