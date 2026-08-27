# Configuration Reference

## Compile-Time Settings (config.h)

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| DEFAULT_FREQ | 433.0 | 410-525 MHz | Default transmission frequency |
| DEFAULT_WPM | 15 | 5-30 | Default Morse speed (words per minute) |
| DEFAULT_TX_POWER | 17 | -9 to +22 dBm | Default TX power in dBm (PA max +30) |
| DEFAULT_AUDIO_VOL | 180 | 0-255 | DAC audio volume (0=silent, 255=max) |
| DEFAULT_AUDIO_HZ | 600 | 200-2000 | Morse tone frequency in Hz |
| DEFAULT_SOS_TEXT | AEGIS BEACON | 1-20 chars | Callsign / name in Morse payload |
| GPS_ENABLED | true | true/false | Enable GPS module (NEO-6M) |
| TX_INTERVAL_SEC | 30 | 10-300 | Seconds between TX cycles in BEACON mode |
| WIFI_AP_SSID | AEGIS-BEACON | 1-32 chars | WiFi AP hotspot name |
| WIFI_AP_PASS | aegis123 | 8-63 chars | WiFi AP password (WPA2) |

## Runtime Configuration (WiFi Portal)

Connect to `AEGIS-BEACON` WiFi and navigate to `http://192.168.4.1`. The captive portal provides:

- Frequency selection (410-525 MHz, 0.1 MHz steps)
- WPM speed adjustment (5-30 WPM)
- TX power control (-9 to +22 dBm)
- Callsign / name editing (up to 20 characters)
- Audio volume and tone frequency
- GPS enable/disable toggle
- TX interval adjustment
- WiFi AP credentials change
- Factory reset option

## Frequency Storage

Up to 10 frequencies stored in ESP32 NVS (non-volatile storage). Each entry is a float (MHz) with a 1-byte enable flag.

## Deep Sleep Configuration

```
Wakeup source: Timer (ESP_TIMER)
Sleep duration: TX_INTERVAL_SEC seconds
GPIO hold: All outputs retained during sleep
Watchdog: 30s hardware WDT (TWDT)
Current draw: ~10 uA (RTC domain only)
```
