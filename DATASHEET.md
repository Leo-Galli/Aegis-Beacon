# DATASHEET — Aegis-Beacon v4.0

**Dual-Mode Avalanche Rescue System**  
**Revision: 4.0 | Date: 2026 | Author: Leonardo Galli**

---

## 1. General Description

Aegis-Beacon v4.0 is an open-source, ultra-low-cost emergency rescue beacon for avalanche survival, backcountry SAR operations, and off-grid emergency communication. The device combines a 433 MHz OOK/CW radio transmitter with a passive RSSI scanner, a 0.96" OLED status display, and a 3.5mm audio alert output into a pocketable, battery-powered unit buildable under $15 USD.

The firmware runs on an ESP32-C3 microcontroller, controlled by the RadioLib driver stack, and exposes a WiFi captive-portal dashboard for field configuration without any additional tools.

---

## 2. Absolute Maximum Ratings

| Parameter                     | Min    | Max     | Unit |
|-------------------------------|--------|---------|------|
| Supply voltage (VBUS / 5V in) | 4.5    | 5.5     | V    |
| RA-02 VCC                     | 1.8    | **3.6** | V    |
| GPIO voltage (ESP32-C3)       | −0.3   | 3.6     | V    |
| Operating temperature         | −20    | +60     | °C   |
| Storage temperature           | −40    | +85     | °C   |
| TX power (SX1276)             | +2     | **+17** | dBm  |
| OLED VCC (SSD1306)            | 1.65   | **3.5** | V    |
| Audio output load impedance   | 16     | 600     | Ω    |

> ⚠️ **Never connect RA-02 VCC or OLED VCC to 5 V / VBUS — permanent damage will result.**

---

## 3. Electrical Characteristics

### 3.1 Power Supply

| Parameter                          | Typical | Unit  | Conditions                            |
|------------------------------------|---------|-------|---------------------------------------|
| Battery voltage (18650 Li-ion)     | 3.7     | V     | Nominal                               |
| ESP32-C3 LDO input (VBUS)          | 5.0     | V     | From TP4056 OUT+                      |
| 3.3 V rail voltage                 | 3.30    | V     | AMS1117-3.3 internal LDO              |
| 3.3 V rail output current (max)    | 800     | mA    | Limited by AMS1117-3.3                |

### 3.2 Current Consumption

| State                              | Typical | Unit | Notes                                    |
|------------------------------------|---------|------|------------------------------------------|
| Deep sleep (ESP32-C3 only)         | 10      | µA   | RTC RAM active, GPIOs held               |
| BEACON TX active @ +17 dBm         | 120     | mA   | WiFi/BT disabled                         |
| SEARCH scan (RX, no TX)            | 40      | mA   | WiFi/BT disabled                         |
| CONFIG mode (WiFi AP active)       | 100     | mA   | No TX                                    |
| EMERGENCY mode (continuous TX)     | 120     | mA   | No sleep                                 |
| OLED SSD1306 (active, full white)  | 5       | mA   | At 3.3 V                                 |
| OLED SSD1306 (disabled)            | 0.5     | mA   | Standby current                          |
| Audio output (GPIO 18 PWM)         | 2       | mA   | Into 32 Ω load, 180/255 duty             |

### 3.3 Battery Life Estimates (2000 mAh 18650, 20 °C)

| Mode      | Sleep Interval | OLED  | Estimated Runtime |
|-----------|----------------|-------|-------------------|
| BEACON    | 10 s           | On    | ~70 hours         |
| BEACON    | 10 s           | Off   | ~72 hours         |
| BEACON    | 30 s           | On    | ~140 hours        |
| BEACON    | 60 s           | On    | ~190 hours        |
| SEARCH    | Continuous     | On    | ~48 hours         |
| EMERGENCY | Continuous     | On    | ~15 hours         |

> 💡 At −20 °C, expect 40–60% of nominal capacity from standard Li-ion. Use LiFePO4 for alpine cold-weather deployments.

---

## 4. RF Specifications

### 4.1 Transmitter (SX1276 / RA-02)

| Parameter                    | Value      | Unit    | Notes                              |
|------------------------------|------------|---------|------------------------------------|
| RF module                    | AI-Thinker RA-02 |     | SX1276 inside                      |
| Frequency range              | 410–525    | MHz     | Hardware-limited by RA-02 filter   |
| Modulation                   | OOK (CW)   | —       | On/Off Keying, AM-detectable       |
| Output power range           | +2 to +17  | dBm     | SX1276 PA hardware limit           |
| Default output power         | +17        | dBm     | ~50 mW                             |
| Frequency accuracy           | ±10        | ppm     | TCXO not populated on RA-02        |
| Antenna interface            | U.FL/IPEX  | —       | Spring antenna included; wire ANT pad recommended |
| Harmonics                    | < −40      | dBc     | Manufacturer spec                  |
| Spurious emissions           | < −50      | dBc     | Manufacturer spec                  |

### 4.2 Receiver (SEARCH mode)

| Parameter                    | Value   | Unit  | Notes                                   |
|------------------------------|---------|-------|-----------------------------------------|
| Receive mode                 | FSK RX  | —     | Used only to measure RSSI               |
| RSSI measurement range       | −120 to −40 | dBm | SX1276 internal RSSI register          |
| RSSI accuracy                | ±2      | dBm   | Typical at room temperature             |
| Dwell time per frequency     | 100–5000 | ms   | Configurable                            |
| Detection threshold (default)| −90     | dBm   | Configurable via dashboard              |
| Signal classification WEAK   | −90 to −80 | dBm | Audio: 440 Hz slow beep                |
| Signal classification MEDIUM | −80 to −60 | dBm | Audio: 880 Hz fast beep                |
| Signal classification STRONG | ≥ −60   | dBm   | Audio: 1760 Hz continuous              |
| Max simultaneous frequencies | 10      | —     | Scanned sequentially                    |

### 4.3 Antenna

| Configuration                      | Gain      | Notes                            |
|------------------------------------|-----------|----------------------------------|
| ¼-wave monopole, 17.3 cm wire      | ~0 dBi    | Recommended                      |
| Helical coil, ~6 cm                | ~−2 dBi   | Compact option                   |
| Ground plane added                 | +3 dBi    | PCB foil or copper tape          |
| RA-02 spring antenna (stock)       | ~−3 dBi   | Functional, lower efficiency     |

**Frequency / Antenna length reference:**

| Frequency  | ¼-wave  | ½-wave  |
|------------|---------|---------|
| 433.5 MHz  | 17.3 cm | 34.6 cm |
| 434.0 MHz  | 17.3 cm | 34.5 cm |
| 868.0 MHz  | 8.6 cm  | 17.3 cm |
| 915.0 MHz  | 8.2 cm  | 16.4 cm |

---

## 5. Morse / Timing Engine

| Parameter             | Value              | Notes                              |
|-----------------------|--------------------|------------------------------------|
| Standard              | PARIS              | 50 units = 1 word                  |
| WPM range             | 5–30               | Configurable                       |
| Default WPM           | 13                 |                                    |
| Unit duration         | `1200 / WPM` ms    | At 13 WPM: 92 ms                   |
| Dot                   | 1 unit             |                                    |
| Dash                  | 3 units            |                                    |
| Intra-character gap   | 1 unit             | Between dots/dashes in same char   |
| Inter-character gap   | 3 units            | Between letters                    |
| Word gap              | 7 units            | Between words (space character)    |
| "SOS" duration @ 13 WPM | ~2730 ms        |                                    |
| Supported charset     | A–Z, 0–9, space    |                                    |
| Max message length    | 64 chars           |                                    |
| Mid-TX interrupt      | Yes                | Interrupt-driven, hardware level   |

---

## 6. Display — SSD1306 OLED

| Parameter                | Value       | Notes                           |
|--------------------------|-------------|---------------------------------|
| Module                   | SSD1306     | 0.96" 128×64 px monochrome      |
| Interface                | I2C         | 4-pin: VCC GND SCL SDA          |
| I2C address              | 0x3C        | Some modules use 0x3D           |
| I2C clock (SCL)          | GPIO 0      |                                 |
| I2C data (SDA)           | GPIO 1      | **Moved from SW_CONFIG in v3.0**|
| Refresh rate             | 250 ms      | Configurable via `OLED_REFRESH_MS` |
| Supply voltage           | 3.3 V       | Internal boost converter to OLED panel VCC |
| Current @ full brightness| ~5 mA       |                                 |
| Current @ standby        | ~0.5 mA     |                                 |
| Enable/disable           | NVS toggle  | `oledEnabled`                   |
| Invert mode              | NVS toggle  | `oledInvert` — white on black   |

**Screen layouts:**

| Mode       | Layout                                                                  |
|------------|-------------------------------------------------------------------------|
| BOOT       | Logo + "AEGIS-BEACON v4.0", 2 s splash                                  |
| BEACON     | Header `⬡ BEACON`, freq MHz, TX progress bar, message+WPM, cycle#, sleep timer |
| SEARCH     | Header `◈ SEARCH`, freq, RSSI bar, last hit freq+dBm, total hits, time  |
| EMERGENCY  | Full-screen inverted, large blinking `⚡SOS⚡`                           |
| CONFIG     | SSID `AegisBeacon`, IP `192.168.4.1`, `SCAN TO CONFIG` hint             |

---

## 7. Audio Output

| Parameter                 | Value          | Notes                                  |
|---------------------------|----------------|----------------------------------------|
| Output pin                | GPIO 18        | LEDC PWM channel 0                     |
| PWM carrier frequency     | 40,000 Hz      | Above hearing range                    |
| PWM resolution            | 8-bit          | 0–255 duty cycle                       |
| Default volume            | 180            | ~70% PWM duty                          |
| Series resistor           | 100 Ω          | Current limiting                       |
| AC-coupling capacitor     | 10 µF          | Blocks DC bias from headphones         |
| Compatible headphone Ω    | 16–600 Ω       | Standard 3.5mm wired                   |
| Connector                 | 3.5mm TRRS     | Tip=audio, Ring1=GND, Sleeve=GND       |

**Tone frequencies:**

| Condition              | Frequency | Pattern                    |
|------------------------|-----------|----------------------------|
| Weak signal (SEARCH)   | 440 Hz    | 1 beep/s                   |
| Medium signal (SEARCH) | 880 Hz    | 4 beeps/s                  |
| Strong signal (SEARCH) | 1760 Hz   | Continuous                 |
| Morse TX (BEACON)      | 600 Hz    | Click stream, sync with TX |
| No signal              | —         | Silence                    |

---

## 8. GPIO Pin Map

| GPIO | Direction | Function                                         | Notes                              |
|------|-----------|--------------------------------------------------|------------------------------------|
| 0    | Output    | I2C SCL → OLED SCL                               |                                    |
| 1    | Bidir     | I2C SDA → OLED SDA                               | **Was SW_CONFIG in v3.0**          |
| 2    | Input     | SX1276 DIO0 (TX/RX done IRQ)                     | Interrupt-driven                   |
| 3    | Output    | SX1276 RESET (active LOW)                        |                                    |
| 4    | Output    | SPI SCK                                          |                                    |
| 5    | Input     | SPI MISO                                         |                                    |
| 6    | Output    | SPI MOSI                                         |                                    |
| 7    | Output    | SPI CS (NSS, active LOW)                         |                                    |
| 8    | Output    | LED_RED (BEACON indicator)                       | Via 330 Ω to GND                   |
| 9    | Input     | SW_MODE / BOOT                                   | 10 kΩ pull-up, active LOW          |
| 10   | Input     | SX1276 DIO1 (RX timeout)                         |                                    |
| 18   | Output    | PWM audio → 100 Ω → 10 µF → 3.5mm jack          | LEDC ch0, 40 kHz carrier           |
| 20   | Output    | LED_BLUE (SEARCH indicator)                      | Via 330 Ω to GND                   |
| 21   | Input     | SW_CONFIG                                        | **Moved from GPIO 1 in v4.0**      |

---

## 9. SPI Bus (RA-02)

| Signal  | GPIO | Speed      | Mode   |
|---------|------|------------|--------|
| SCK     | 4    | ≤ 10 MHz   | SPI 0  |
| MOSI    | 6    |            |        |
| MISO    | 5    |            |        |
| CS/NSS  | 7    | Active LOW |        |

---

## 10. NVS Configuration Schema

All user settings are stored in ESP32 Non-Volatile Storage under the namespace `aegis`.

| Key               | Type    | Default      | Range / Notes                          |
|-------------------|---------|--------------|----------------------------------------|
| `freqCount`       | uint8   | 1            | 1–10                                   |
| `freq0`…`freq9`   | float   | 433.500      | MHz, one key per frequency slot        |
| `message`         | string  | "SOS"        | Max 64 chars, A–Z 0–9 space            |
| `wpm`             | uint8   | 13           | 5–30                                   |
| `powerDbm`        | int8    | 17           | +2 to +17 dBm                          |
| `sleepSec`        | uint32  | 10           | 1–3600 s                               |
| `scanDwellMs`     | uint16  | 400          | 100–5000 ms                            |
| `rssiThreshold`   | int8    | −90          | −120 to −40 dBm                        |
| `lastMode`        | uint8   | 0 (BEACON)   | 0=BEACON 1=SEARCH 2=CONFIG 3=EMERGENCY |
| `autoSwitch`      | bool    | false        | Auto-switch to BEACON on low battery   |
| `repeatCount`     | uint8   | 1            | 1–5                                    |
| `audioVolume`     | uint8   | 180          | 0–255 PWM duty *(new in v4.0)*         |
| `audioEnabled`    | bool    | true         | Master audio toggle *(new in v4.0)*    |
| `oledEnabled`     | bool    | true         | OLED on/off *(new in v4.0)*            |
| `oledInvert`      | bool    | false        | Invert display *(new in v4.0)*         |
| `emergencyGPS`    | bool    | false        | Reserved for GPS coordinate append     |

**Fail-safe:** If NVS is empty, corrupt, or missing any key, the firmware falls back to hardcoded defaults (listed above). This ensures the device is always functional even after a factory reset or first flash.

---

## 11. RTC RAM State (Deep Sleep Persistent)

| Variable             | Type         | Notes                                         |
|----------------------|--------------|-----------------------------------------------|
| `g_bootCycle`        | uint32       | Increments every boot, survives deep sleep    |
| `g_txCycles`         | uint32       | Total TX cycles since manufacture             |
| `g_scanCycles`       | uint32       | Total scan cycles                             |
| `g_scanHits[20]`     | ScanHit[]    | Rolling log of last 20 signal detections      |
| `g_scanHitCount`     | uint8        | Current number of entries in g_scanHits       |
| `g_currentMode`      | DeviceMode   | Active mode, restored after deep sleep        |
| `g_emergencyActive`  | bool         | Emergency flag — persists across reboots      |

**ScanHit structure:**

| Field       | Type    | Description                       |
|-------------|---------|-----------------------------------|
| `freq`      | float   | Frequency in MHz                  |
| `rssi`      | int16   | RSSI in dBm                       |
| `timestamp` | uint32  | `millis()` at time of detection   |
| `label`     | char[12]| Signal class: WEAK/MEDIUM/STRONG  |

---

## 12. WiFi Dashboard API

The device serves a REST-style HTTP API on `192.168.4.1` when in CONFIG mode.

| Endpoint           | Method | Description                                    |
|--------------------|--------|------------------------------------------------|
| `/`                | GET    | Dashboard HTML (single-page app)               |
| `/api/config`      | GET    | Returns full config as JSON                    |
| `/api/config`      | POST   | Saves JSON config to NVS and reboots           |
| `/api/status`      | GET    | Returns device status (heap, cycles, uptime)   |
| `/api/scan`        | GET    | Performs one scan pass, returns RSSI per freq  |
| `/api/tx`          | GET    | Sends one SOS burst on first configured freq   |
| `/api/emergency`   | POST   | Sets EMERGENCY mode flag and reboots           |
| `/api/hits`        | GET    | Returns the last 20 scan hits as JSON          |
| `/api/hits/clear`  | POST   | Clears RTC RAM scan hit log                    |

**Example `/api/config` GET response:**

```json
{
  "freqs": [433.5, 434.5],
  "message": "SOS",
  "wpm": 13,
  "powerDbm": 17,
  "sleepSec": 10,
  "scanDwellMs": 400,
  "rssiThreshold": -90,
  "repeatCount": 1,
  "audioVolume": 180,
  "audioEnabled": true,
  "oledEnabled": true,
  "oledInvert": false,
  "autoSwitch": false
}
```

---

## 13. Operating Modes Summary

| Mode       | TX | RX | WiFi | OLED layout         | Audio                | Deep sleep     |
|------------|----|----|------|---------------------|----------------------|----------------|
| BEACON     | ✅  | ❌  | Off  | Freq + TX progress  | Morse click stream   | Yes (configurable) |
| SEARCH     | ❌  | ✅  | Off  | RSSI bar + hits     | Variable pitch tone  | No (continuous) |
| CONFIG     | ❌  | ❌  | AP   | SSID + IP           | Silent               | No             |
| EMERGENCY  | ✅  | ❌  | Off  | Full-screen SOS     | Continuous 1760 Hz   | No             |

---

## 14. Button Logic

| Button      | GPIO | Press type    | Duration   | Action                                  |
|-------------|------|---------------|------------|-----------------------------------------|
| SW_MODE     | 9    | Short press   | < 2000 ms  | Toggle BEACON ↔ SEARCH                  |
| SW_MODE     | 9    | Long press    | ≥ 2000 ms  | Activate EMERGENCY mode                 |
| SW_CONFIG   | 21   | Short press   | < 3000 ms  | Print full status to Serial             |
| SW_CONFIG   | 21   | Long press    | ≥ 3000 ms  | Launch WiFi AP + dashboard              |
| Both        | 9+21 | Both at boot  | ≥ 5000 ms  | Factory reset (NVS wipe + reboot)       |

Debounce: 50 ms hardware debounce. Interrupts: GPIO change interrupt, fires immediately.

---

## 15. Firmware Build Parameters

| Parameter              | Value                   | Notes                            |
|------------------------|-------------------------|----------------------------------|
| Target MCU             | ESP32-C3                |                                  |
| Framework              | Arduino / PlatformIO    |                                  |
| CPU frequency          | 160 MHz (default)       | 80 MHz tested in CI matrix       |
| Flash size             | 4 MB                    |                                  |
| Serial baud rate       | 115200                  | 8N1                              |
| Watchdog timeout       | 30 s                    | Hardware WDT via esp_task_wdt    |
| USB CDC on boot        | Enabled                 | Required for serial over USB-C   |

**Library dependencies:**

| Library                  | Min version | Source                    |
|--------------------------|-------------|---------------------------|
| RadioLib                 | 6.0.0       | jgromes/RadioLib          |
| ArduinoJson              | 7.0.0       | bblanchon/ArduinoJson     |
| Adafruit SSD1306         | 2.5.0       | adafruit/Adafruit SSD1306 |
| Adafruit GFX Library     | 1.11.0      | adafruit/Adafruit GFX     |

---

## 16. Regulatory Notes

| Region        | Frequency band | Status            | Notes                                        |
|---------------|----------------|-------------------|----------------------------------------------|
| EU / UK       | 433.050–434.790 MHz | License-free | EN 300 220 / SRD band, ≤ 10 mW ERP recommended |
| Australia/NZ  | 433 MHz ISM    | License-free      | ACMA Class licence                           |
| North America | 433 MHz ISM    | Amateur or Part 15| Check FCC Part 15 or amateur licence         |
| North America | 915 MHz ISM    | License-free      | Part 15 ISM band                             |

> This device is an experimental emergency tool, not a certified distress beacon. In genuine life-threatening emergencies, use certified PLB/EPIRB equipment alongside this device. Always verify local regulations before operation.

---

## 17. Enclosure

| Parameter           | Value                               |
|---------------------|-------------------------------------|
| Recommended enclosure | Hammond 1593K (80×40×20 mm)       |
| Alternative         | 3D-printed PLA, design TBD          |
| Required cutouts    | OLED window (28×13 mm), USB-C port, 3.5mm jack, 2× 6mm buttons, LED holes |
| Antenna exit        | Top or side, vertical orientation   |
| Estimated volume    | ~64 cm³                             |
| Fits 18650 cell     | Yes (requires spring/clip holder)   |

---

## 18. Changelog

| Version | Date    | Changes                                                                               |
|---------|---------|---------------------------------------------------------------------------------------|
| v4.0    | 2026    | Added SSD1306 OLED display (GPIO 0/1); added 3.5mm audio jack (GPIO 18); SW_CONFIG moved from GPIO 1 to GPIO 21; new audio/OLED NVS keys; new `[OLED]` and `[AUDIO]` serial log tags; BOM updated ~$12–14 |
| v3.0    | 2025    | Initial public release: ESP32-C3 + SX1276, WiFi dashboard, deep sleep, frequency hopping, NVS config, RTC RAM state, CI/CD pipeline |

---

*MIT License — Copyright © 2026 Leonardo Galli*  
*https://github.com/Leo-Galli/Aegis-Beacon*