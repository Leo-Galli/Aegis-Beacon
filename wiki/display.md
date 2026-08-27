# OLED Display

The 2.42" SSD1309 OLED display (128x64 pixels) provides real-time operational feedback using software SPI via the U8g2 library.

## Display Interface

| OLED Pin | ESP32 GPIO | Function |
|----------|------------|----------|
| GND | GND | Ground |
| VCC | 3V3 | 3.3V power |
| D0 (SCK) | GPIO 15 | Software SPI clock |
| D1 (SDA) | GPIO 13 | Software SPI data |
| RES | GPIO 4 | Hardware reset (active LOW) |
| DC | GPIO 16 | Data/Command select |
| CS | GPIO 17 | Software SPI chip select |

## Display Pages

- **Status Page (Home)**: Shows current mode, frequency, battery voltage, WPM, and GPS status
- **GPS Wait Screen**: Displayed during cold start. Shows satellite count and fix status
- **WiFi Portal Info**: Shows AP SSID and IP address when CONFIG mode is active
- **Scanning Progress**: SEARCH mode displays frequency, RSSI bar, and signal strength

## U8g2 Library Setup

```cpp
// Software SPI constructor
U8G2_SSD1309_128X64_NONAME_F_SW_SPI
u8g2(U8G2_R0, SCK, SDA, CS, DC, RESET);
```

Software SPI is used instead of hardware SPI to avoid conflicts with the SX1262 (VSPI bus).

## Display Power

The OLED draws approximately 20 mA when active and 0.01 mA in sleep mode. The display is automatically powered down during deep sleep.
