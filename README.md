<div align="center">

```
 █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
```

# Aegis-Beacon v4.0

### Professional Dual-Mode Avalanche Rescue System  
### + SSD1306 OLED Display + 3.5mm Audio Alert

[![Version](https://img.shields.io/badge/version-4.0.0-blue?style=for-the-badge&logo=github)](https://github.com/leo-galli/aegis-beacon/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

[![CI Build](https://img.shields.io/github/actions/workflow/status/Leo-Galli/Aegis-Beacon/aegis_suite.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%20Build)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/aegis_suite.yml)
[![Code Quality](https://img.shields.io/github/actions/workflow/status/Leo-Galli/Aegis-Beacon/aegis_suite.yml?style=for-the-badge&logo=cppcheck&logoColor=white&label=Code%20Quality)](https://github.com/Leo-Galli/Aegis-Beacon/actions/workflows/aegis_suite.yml)
[![Release](https://img.shields.io/github/v/release/Leo-Galli/Aegis-Beacon?style=for-the-badge&logo=github&logoColor=white&color=blue&label=Firmware)](https://github.com/Leo-Galli/Aegis-Beacon/releases)

[![Platform](https://img.shields.io/badge/platform-ESP32--C3-red?style=for-the-badge&logo=espressif)](https://www.espressif.com/en/products/socs/esp32-c3)
[![Radio](https://img.shields.io/badge/radio-SX1276_OOK%2FCW-orange?style=for-the-badge)](https://www.semtech.com/products/wireless-rf/lora-connect/sx1276)
[![Display](https://img.shields.io/badge/display-SSD1306_0.96%22_OLED-white?style=for-the-badge)](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf)
[![Audio](https://img.shields.io/badge/audio-3.5mm_PWM_DAC-yellow?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/framework-Arduino_PlatformIO-teal?style=for-the-badge&logo=arduino)](https://platformio.org)
[![RadioLib](https://img.shields.io/badge/RadioLib-≥6.0-purple?style=for-the-badge)](https://github.com/jgromes/RadioLib)
[![ArduinoJson](https://img.shields.io/badge/ArduinoJson-≥7.0-blue?style=for-the-badge)](https://arduinojson.org)
[![Cost](https://img.shields.io/badge/BOM_cost-~%2412_USD-yellow?style=for-the-badge)](DATASHEET.md)

<br/>

> **⚡ BEACON mode** — transmits Morse SOS on multiple frequencies via OOK/CW carrier, audible on any AM scanner or SDR.  
> **🔍 SEARCH mode** — continuously scans all configured frequencies, measures RSSI, logs signals, and emits audio tones proportional to signal strength.  
> **📺 OLED display** — real-time status on a 0.96" SSD1306: current mode, frequency, RSSI bar, cycle counter, sleep timer.  
> **🔊 Audio alert** — 3.5mm jack outputs pitch-variable beeps in SEARCH mode (weak→slow, medium→fast, strong→continuous tone).  
> Switchable instantly with a single physical button press, or via a web dashboard over WiFi.

<br/>

![BEACON mode](https://img.shields.io/badge/BEACON-SOS_TX_on_all_freqs-red?style=flat-square)
![SEARCH mode](https://img.shields.io/badge/SEARCH-RSSI_scan_+_audio_alert-blue?style=flat-square)
![Config mode](https://img.shields.io/badge/CONFIG-WiFi_captive_portal-grey?style=flat-square)
![Emergency mode](https://img.shields.io/badge/EMERGENCY-max_power_no_sleep-orange?style=flat-square)

</div>

---

## Table of Contents

- [Overview](#overview)
- [What's New in v4.0](#whats-new-in-v40)
- [Features](#features)
- [Hardware](#hardware)
  - [Bill of Materials](#bill-of-materials)
  - [Wiring Table](#wiring-table)
  - [Schematic Notes](#schematic-notes)
- [Firmware](#firmware)
  - [Dependencies](#dependencies)
  - [Installation — Arduino IDE](#installation--arduino-ide)
  - [Installation — PlatformIO](#installation--platformio)
  - [Configuration](#configuration)
- [Operating Modes](#operating-modes)
  - [BEACON Mode](#beacon-mode)
  - [SEARCH Mode](#search-mode)
  - [CONFIG Mode (Dashboard)](#config-mode-dashboard)
  - [EMERGENCY Mode](#emergency-mode)
- [Physical Button Reference](#physical-button-reference)
- [OLED Display Layouts](#oled-display-layouts)
- [Audio System](#audio-system)
- [Dashboard Features](#dashboard-features)
- [Serial Debug System](#serial-debug-system)
- [Morse Engine](#morse-engine)
- [Deep Sleep & Battery Life](#deep-sleep--battery-life)
- [Antenna Guide](#antenna-guide)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [License](#license)

---

## Overview

**Aegis-Beacon** is an open-source, ultra-low-cost emergency rescue beacon designed for avalanche survival, backcountry emergencies, and SAR (Search and Rescue) operations. It fits in a jacket pocket, costs around $12 to build, and can operate for **72+ hours** on a single 18650 cell.

v4.0 adds a 0.96" OLED screen for at-a-glance status without needing a serial monitor, and a 3.5mm audio jack that outputs pitch-variable alert tones in SEARCH mode — the closer you get to a signal, the higher and faster the tone.

The device operates in four modes, switchable in real time with a physical button:

| Mode              | LED        | OLED                        | Audio               | What it does                                                |
|-------------------|------------|-----------------------------|---------------------|-------------------------------------------------------------|
| 🔴 **BEACON**     | Red blink  | Freq + TX progress          | Morse click stream  | Transmits Morse SOS on 1–10 frequencies via OOK carrier     |
| 🔵 **SEARCH**     | Blue blink | Freq + RSSI bar + last hit  | Variable pitch beep | Scans all frequencies, logs RSSI, audio alert on detection  |
| ⚙️ **CONFIG**     | Both blink | SSID + IP + QR hint         | Silent              | WiFi AP + captive portal dashboard                          |
| ⚡ **EMERGENCY**   | Red fast   | Full-screen inverted "⚡SOS⚡" | Continuous tone    | Max power, continuous TX, no sleep                          |

All settings are stored in NVS (non-volatile storage) and survive reboots and deep sleep cycles. A **fail-safe** system ensures the device defaults to `433.500 MHz / "SOS" / 13 WPM / 17 dBm` if NVS is ever empty or corrupt.

---

## What's New in v4.0

| Feature              | v3.0                  | v4.0                                          |
|----------------------|-----------------------|-----------------------------------------------|
| Display              | None (serial only)    | SSD1306 0.96" OLED, 128×64 px                 |
| Audio output         | None                  | 3.5mm jack, PWM DAC, pitch-variable tones      |
| GPIO 1 assignment    | SW_CONFIG             | OLED SDA (SW_CONFIG moved to GPIO 21)          |
| CONFIG button pin    | GPIO 1                | GPIO 21                                        |
| BOM cost             | ~$7–10                | ~$12–14                                        |
| Enclosure            | Hammond 1551 (60×35)  | Hammond 1593K (80×40×20 mm) or 3D PLA          |
| Dependencies         | RadioLib, ArduinoJson | + Adafruit SSD1306, Adafruit GFX               |
| Audio volume control | —                     | Configurable 0–255 PWM duty via dashboard      |
| Audio enable/disable | —                     | Master toggle in dashboard + NVS saved         |
| OLED enable/disable  | —                     | Toggle to save power; invert option            |
| Debug tags           | INFO/OK/WARN/ERR/…    | + `[OLED]`, `[AUDIO]`                          |

> ⚠️ **Breaking change from v3.0:** SW_CONFIG has moved from GPIO 1 to GPIO 21. If you have a v3.0 board, GPIO 1 is now I2C SDA for the OLED. You must rewire SW_CONFIG to GPIO 21, or omit the OLED and rebuild without the Adafruit libraries.

---

## Features

### RF & Transmission

- ✅ **OOK/CW mode** — carrier on/off keying, audible on any AM-mode scanner or SDR receiver
- ✅ **Frequency hopping** — up to 10 configurable frequencies per cycle
- ✅ **PARIS-standard Morse timing** — `dot=1u, dash=3u, inter-char=3u, word=7u`
- ✅ **Configurable WPM** — 5 to 30 WPM via dashboard slider
- ✅ **Configurable TX power** — +2 to +17 dBm (RA-02 hardware limit)
- ✅ **Configurable repeat count** — 1–5 message repetitions per cycle
- ✅ **Mid-TX interrupt** — mode button can abort a transmission instantly

### Search / Scan Engine

- ✅ **Per-frequency RSSI measurement** with configurable dwell time (100–5000 ms)
- ✅ **Configurable detection threshold** (-120 to -40 dBm)
- ✅ **Rolling hit log** — last 20 detections stored in RTC RAM (survives deep sleep)
- ✅ **Signal classification** — STRONG (≥ -60 dBm) / MEDIUM (≥ -80) / WEAK (≥ threshold)
- ✅ **ASCII signal bar** printed to Serial on every scan pass
- ✅ **OLED RSSI bar** updated every scan step
- ✅ **LED alert** — blue LED blinks on detection, fast blink on strong signal

### Audio Alert System *(new in v4.0)*

- ✅ **PWM audio output** on GPIO 18 via LEDC at 40 kHz carrier (above hearing), amplitude modulated to produce audible tones
- ✅ **Signal-strength proportional tone:** silence → slow beep → fast beep → continuous tone
- ✅ **Pitch rises with signal strength:** 440 Hz (weak) → 880 Hz (medium) → 1760 Hz (strong)
- ✅ **Morse click stream** in BEACON mode for earphone debug monitoring
- ✅ **Configurable volume** (0–255 PWM duty, ~0–3.3 V peak)
- ✅ **Master enable/disable** saved to NVS
- ✅ **AC-coupled output** — 100Ω series + 10 µF blocking cap, safe for 16–600 Ω headphones

### OLED Display *(new in v4.0)*

- ✅ **SSD1306 0.96" 128×64** via I2C (GPIO 0 SCL, GPIO 1 SDA)
- ✅ **Mode-specific screen layouts** — distinct UI for BEACON, SEARCH, EMERGENCY, CONFIG
- ✅ **Boot splash** — logo + version, 2 s
- ✅ **BEACON screen:** frequency, TX progress, message, WPM, cycle number, sleep countdown
- ✅ **SEARCH screen:** current frequency, RSSI bar chart, last hit, total hits, elapsed time
- ✅ **EMERGENCY screen:** full-screen inverted display with large blinking "⚡SOS⚡"
- ✅ **CONFIG screen:** AP SSID, IP address, and "SCAN TO CONFIG" QR code hint
- ✅ **250 ms refresh rate** — fast enough for live RSSI without CPU overhead
- ✅ **Configurable enable/disable + invert** — save power or adapt to bright sunlight

### Dashboard & Configuration

- ✅ **WiFi captive portal** — connect any phone/laptop, browser opens automatically
- ✅ **Dark military-aesthetic UI** — Orbitron / Share Tech Mono fonts, responsive
- ✅ **Live Morse preview** — message decoded to dots/dashes as you type
- ✅ **Frequency manager** — add/remove up to 10 frequencies with band labels
- ✅ **Audio controls** — volume slider + enable toggle
- ✅ **OLED controls** — enable toggle + invert toggle
- ✅ **Scan history panel** — RSSI bar charts, auto-refreshes every 5 s
- ✅ **Device status panel** — boot cycles, TX/scan counts, free heap, uptime
- ✅ **Test TX button** — sends single SOS burst from browser
- ✅ **Test Scan button** — scans all frequencies live, returns RSSI per freq
- ✅ **Emergency override** — activate max-power SOS from browser
- ✅ **5-minute AP timeout** — auto-reverts to beacon mode if nobody connects

### Reliability & Safety

- ✅ **Hardware watchdog** — 30 s WDT resets device if firmware hangs
- ✅ **NVS fail-safe** — hardcoded defaults if storage is empty or corrupt
- ✅ **Factory reset** — hold both buttons at boot for 5 s
- ✅ **RTC RAM state** — mode, cycle counters, scan hits survive deep sleep
- ✅ **Interrupt-driven buttons** — responsive even during TX delays
- ✅ **Debounced button logic** — 50 ms hardware debounce + hold duration measurement
- ✅ **Deep sleep** — ESP32-C3 draws ~10 µA between TX cycles

### Debug System

- ✅ **Color-coded ANSI serial log** — `[INFO]`, `[OK]`, `[WARN]`, `[ERROR]`, `[SCAN]`, `[BTN]`, `[MODE]`, `[CFG]`, `[OLED]`, `[AUDIO]`
- ✅ **Verbose mode** — `DEBUG_VERBOSE 1` adds per-symbol Morse timing + RadioLib state codes
- ✅ **Per-scan ASCII bar graph** — visual RSSI display at 115200 baud
- ✅ **Boot diagnostics** — reset reason, free heap, CPU freq, SDK version on every boot

---

## Hardware

### Bill of Materials

> **Total estimated cost: ~$12–14 USD** (AliExpress / LCSC pricing, 2025)

| # | Ref | Component                                            | Qty | Unit Cost | Notes                                                           |
|---|-----|------------------------------------------------------|-----|-----------|-----------------------------------------------------------------|
| 1 | U1  | **ESP32-C3 SuperMini**                               | 1   | $1.50     | Built-in LDO + USB-C.                                           |
| 2 | U2  | **AI-Thinker RA-02** (SX1276)                        | 1   | $2.50     | 433 MHz, includes spring antenna, ~17 dBm max.                  |
| 3 | U3  | **SSD1306 0.96" OLED 128×64** (4-pin I2C)            | 1   | $1.80     | I2C address 0x3C (default). Some modules use 0x3D.              |
| 4 | B1  | **18650 Li-ion 3.7 V**                               | 1   | $1.50     | Or 14500 for smaller builds.                                    |
| 5 | IC1 | **TP4056 USB-C module** (with DW01A protection)      | 1   | $0.50     | Handles charge + over-discharge. No extra BMS needed.           |
| 6 | J1  | **3.5mm TRRS audio jack** (PJ-320A or CUI SJ-3523)   | 1   | $0.30     | Panel-mount, 4-pole. Tip=audio, Ring1=GND.                      |
| 7 | SW1 | **Tactile switch 6×6 mm**                            | 2   | $0.10     | MODE button (GPIO9) + CONFIG button (GPIO21).                   |
| 8 | C1  | **100 µF 10 V electrolytic**                         | 1   | $0.05     | Bulk cap on 3.3 V rail. Swap for X7R below −10 °C.              |
| 9 | C2  | **100 nF ceramic 0805**                              | 2   | $0.04     | Decoupling on VCC.                                              |
| 10| C3  | **10 µF 10 V electrolytic**                          | 1   | $0.03     | AC-coupling cap on audio output path.                           |
| 11| R1  | **10 kΩ 0805**                                       | 3   | $0.03     | Pull-ups: SW1, SW2, RST.                                        |
| 12| R2  | **330 Ω 0805**                                       | 2   | $0.02     | LED current limiters.                                           |
| 13| R3  | **100 Ω 0805**                                       | 1   | $0.01     | Audio output series resistor.                                   |
| 14| D1  | **Red LED 3 mm**                                     | 1   | $0.05     | BEACON mode indicator.                                          |
| 15| D2  | **Blue LED 3 mm**                                    | 1   | $0.05     | SEARCH mode indicator.                                          |
| 16| ANT | **17.3 cm wire** (¼-wave @ 433 MHz)                  | 1   | $0.00     | Any stiff copper wire. Solder directly to RA-02 ANT pad.        |
| 17| BOX | **Hammond 1593K (80×40×20 mm)** or 3D-printed PLA    | 1   | $2.00     | Fits 18650 + OLED window + audio jack cutout.                   |

**Total: ~$12–14 USD**

> 💡 **Cold weather note:** Below −10 °C, replace C1 electrolytic with a 47 µF X7R ceramic capacitor. Electrolytic capacitors lose capacitance in extreme cold.

---

### Wiring Table

#### ESP32-C3 SuperMini ↔ RA-02 (SX1276)

| RA-02 Pin  | ESP32-C3 GPIO | Wire colour  | Notes                                       |
|------------|---------------|--------------|---------------------------------------------|
| VCC        | 3V3           | Red          | **MAX 3.6 V — never connect to 5 V / VBUS** |
| GND        | GND           | Black        | Common ground                               |
| SCK        | GPIO 4        | Yellow       | SPI Clock                                   |
| MOSI       | GPIO 6        | Green        | SPI Master-Out                              |
| MISO       | GPIO 5        | Blue         | SPI Master-In                               |
| NSS / CS   | GPIO 7        | Orange       | Chip Select (active LOW)                    |
| RESET      | GPIO 3        | White        | Active LOW reset pulse                      |
| DIO0       | GPIO 2        | Purple       | TX/RX Done IRQ                              |
| DIO1       | GPIO 10       | Grey         | RX Timeout (search mode)                    |
| ANT        | —             | —            | Solder 17.3 cm wire to ANT pad              |

#### ESP32-C3 SuperMini ↔ SSD1306 OLED *(new in v4.0)*

| OLED Pin | ESP32-C3 GPIO | Notes                                   |
|----------|---------------|-----------------------------------------|
| VCC      | 3V3           | 3.3 V — **do NOT connect to 5 V**       |
| GND      | GND           |                                         |
| SCL      | GPIO 0        | I2C Clock                               |
| SDA      | GPIO 1        | I2C Data — **shared with SW_CONFIG in v3.0, now moved to GPIO 21** |

#### ESP32-C3 SuperMini ↔ 3.5mm Audio Jack *(new in v4.0)*

| Jack Pin       | ESP32-C3 GPIO | Notes                                        |
|----------------|---------------|----------------------------------------------|
| Tip (L audio)  | GPIO 18       | Via 100 Ω + 10 µF AC-coupling cap            |
| Ring 1 (R)     | GPIO 18       | Tie Tip + Ring 1 for mono output             |
| Ring 2 (MIC)   | N/C           | Not used                                     |
| Sleeve (GND)   | GND           | Audio ground                                 |

#### Other Connections

| Component      | From          | To               | Notes                       |
|----------------|---------------|------------------|-----------------------------|
| LED_RED anode  | GPIO 8        | —                | Via 330 Ω to GND            |
| LED_BLUE anode | GPIO 20       | —                | Via 330 Ω to GND            |
| SW_MODE        | GPIO 9 (BOOT) | GND              | 10 kΩ pull-up to 3V3        |
| SW_CONFIG      | GPIO 21       | GND              | 10 kΩ pull-up to 3V3 *(moved from GPIO 1 in v4.0)* |
| TP4056 OUT+    | —             | ESP32-C3 5V (VBUS) | Battery → regulator → ESP32 |

#### Complete GPIO Map (v4.0)

| GPIO | Function                               |
|------|----------------------------------------|
| 0    | I2C SCL → OLED SCL                     |
| 1    | I2C SDA → OLED SDA                     |
| 2    | SX1276 DIO0 (TX/RX Done IRQ)           |
| 3    | SX1276 RESET (active LOW)              |
| 4    | SPI SCK → RA-02                        |
| 5    | SPI MISO ← RA-02                       |
| 6    | SPI MOSI → RA-02                       |
| 7    | SPI CS → RA-02 NSS (active LOW)        |
| 8    | LED_RED (BEACON mode, 330 Ω)           |
| 9    | SW_MODE / BOOT                         |
| 10   | SX1276 DIO1 (RX timeout)               |
| 18   | DAC/PWM audio → 100 Ω → 10 µF → jack  |
| 20   | LED_BLUE (SEARCH mode, 330 Ω)          |
| 21   | SW_CONFIG *(moved from GPIO 1)*        |

---

### Schematic Notes

- The ESP32-C3 SuperMini has an **AMS1117-3.3 LDO** powered from the 5 V / VBUS rail. No external LDO required.
- The TP4056 module with DW01A includes over-charge, over-discharge, and short-circuit protection. No external BMS needed.
- RA-02 SPI lines must be **3.3 V only**. ESP32-C3 GPIOs are 3.3 V natively — no level shifting required.
- The ESP32-C3 does **not** have a hardware DAC. Audio is generated via LEDC PWM at 40 kHz (above hearing range), then low-pass filtered by the headphone impedance. The 10 µF capacitor blocks DC bias from the headphone drivers.
- OLED I2C address is **0x3C** by default. Some modules use 0x3D — change `OLED_ADDR` in the firmware if the display does not initialise.
- Solder the **17.3 cm wire antenna** vertically upward from the RA-02 ANT pad for best omni-directional radiation pattern.

---

## Firmware

### Dependencies

| Library                                  | Version   | Install                              |
|------------------------------------------|-----------|--------------------------------------|
| **RadioLib** by Jan Gromes               | `≥ 6.0.0` | Arduino Library Manager / PlatformIO |
| **ArduinoJson** by Benoît Blanchon       | `≥ 7.0.0` | Arduino Library Manager / PlatformIO |
| **Adafruit SSD1306** by Adafruit         | `≥ 2.5.0` | Arduino Library Manager / PlatformIO |
| **Adafruit GFX Library** by Adafruit     | `≥ 1.11.0`| Arduino Library Manager / PlatformIO |

---

### Installation — Arduino IDE

1. **Install libraries:**  
   `Sketch → Include Library → Manage Libraries`  
   Search and install: `RadioLib`, `ArduinoJson`, `Adafruit SSD1306`, `Adafruit GFX Library`

2. **Add ESP32-C3 board support:**  
   `File → Preferences → Additional boards URL`:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
   Then: `Tools → Board Manager → search "esp32" → install "esp32 by Espressif"`

3. **Select board:**  
   `Tools → Board → ESP32C3 Dev Module`

4. **Select port:**  
   `Tools → Port → COMx (Windows) / /dev/ttyUSB0 (Linux) / /dev/cu.usbmodem... (macOS)`

5. **Upload:**  
   Open `AegisBeacon.ino` → click Upload (→)

> ⚠️ If upload fails, hold the BOOT button (GPIO9 / SW_MODE) while clicking Upload, then release after "Connecting…" appears.

---

### Installation — PlatformIO

Create `platformio.ini` in the repo root:

```ini
[env:esp32-c3-supermin]
platform  = espressif32
board     = esp32-c3-devkitm-1
framework = arduino

lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
    adafruit/Adafruit SSD1306 @ ^2.5.9
    adafruit/Adafruit GFX Library @ ^1.11.9

monitor_speed = 115200
upload_speed  = 921600

build_flags =
    -DARDUINO_USB_MODE=1
    -DARDUINO_USB_CDC_ON_BOOT=1

board_build.flash_size = 4MB
```

Then:

```bash
pio run --target upload
pio device monitor --baud 115200
```

---

### Configuration

All runtime settings are stored in ESP32 NVS and can be changed via the dashboard or by editing the defaults in the firmware header:

```cpp
#define DEFAULT_FREQ_MHZ      433.500f   // Default frequency (MHz)
#define DEFAULT_MESSAGE       "SOS"      // Default Morse message
#define DEFAULT_WPM           13         // Default words per minute
#define DEFAULT_POWER_DBM     17         // Default TX power (dBm)
#define DEFAULT_SLEEP_SEC     10         // Deep sleep between cycles (s)
#define DEFAULT_SCAN_DWELL_MS 400        // RSSI dwell time per frequency (ms)
#define DEFAULT_RSSI_THRESH   -90        // Detection threshold (dBm)
#define DEFAULT_AUDIO_VOL     180        // 0-255 PWM duty (70% of max)
#define DEFAULT_AUDIO_TONE_HZ 880        // A5 — standard alert tone
```

To enable verbose per-symbol debug logging:

```cpp
#define DEBUG_VERBOSE   1   // 0 = clean log | 1 = full symbol-level log
```

---

## Operating Modes

### BEACON Mode

The primary emergency mode. On each cycle the device:

1. Disables WiFi and Bluetooth stacks (saves ~120 mA)
2. Iterates through all configured frequencies
3. On each frequency: initialises SX1276 in OOK mode, transmits the full Morse message (repeated N times)
4. Emits Morse click tones through the audio jack in sync with TX (if audio enabled)
5. Updates the OLED with current frequency and TX progress
6. Puts the SX1276 into sleep mode
7. Enters ESP32 deep sleep for the configured interval
8. Wakes up and repeats

**Morse timing (PARIS standard):**

| Element              | Duration        |
|----------------------|-----------------|
| Dot                  | `1200 / WPM` ms |
| Dash                 | `3 × dot` ms    |
| Intra-character gap  | `1 × dot` ms    |
| Inter-character gap  | `3 × dot` ms    |
| Word gap             | `7 × dot` ms    |

At 13 WPM: dot = 92 ms, dash = 277 ms. "SOS" takes ~2.7 seconds.

---

### SEARCH Mode

Continuous scan mode for locating other beacons. The device:

1. Disables WiFi and Bluetooth stacks
2. Loops through all configured frequencies indefinitely
3. On each frequency: opens FSK receive window, measures peak RSSI over the dwell period
4. Emits audio tones proportional to signal strength (see [Audio System](#audio-system))
5. Updates the OLED with current frequency, RSSI bar, last hit, and total detections
6. Logs all detections above the configured threshold to RTC RAM
7. Blinks the blue LED on detection (fast blink = strong signal)
8. Prints an ASCII signal bar graph to Serial for each frequency

**Sample serial output (SEARCH mode):**

```
[  42381][SCAN ] Scan pass — 3 frequencies
[  42382][SCAN ] [0] 433.500 MHz  RSSI=-112 dBm  |....................| quiet
[  42784][SCAN ] [1] 434.500 MHz  RSSI= -87 dBm  |#########...........| *** SIGNAL ***
[  42785][SCAN ] HIT recorded: 434.500 MHz -87 dBm [MEDIUM]  total hits=1
[  43188][SCAN ] [2] 435.000 MHz  RSSI=-109 dBm  |....................| quiet
[  43189][SCAN ] Pass complete — elapsed 0 s | total detections: 1
```

---

### CONFIG Mode (Dashboard)

Activated by holding SW_CONFIG (GPIO 21) for 3 seconds. The device:

1. Starts a WiFi Access Point (`AegisBeacon`, open/no password)
2. Starts a DNS server that redirects all domains to the device IP
3. Serves the dashboard at `http://192.168.4.1`
4. Displays SSID, IP, and "SCAN TO CONFIG" on the OLED
5. On most phones, a "Login to network" notification appears automatically (captive portal)
6. After saving, the device reboots into the selected mode
7. If nobody connects within 5 minutes, the device automatically reboots

**Connect from any device:**

- WiFi SSID: `AegisBeacon`
- No password required
- URL: `http://192.168.4.1` (or wait for the captive portal popup)

---

### EMERGENCY Mode

Activated by holding SW_MODE for 2 seconds, or via the dashboard's Emergency button. In this mode:

- Maximum TX power (+17 dBm)
- Message repeated 3× per frequency
- **No deep sleep** — continuous transmission with no pause
- OLED shows full-screen inverted "⚡SOS⚡" animation
- Audio emits continuous tone
- Persists across power cycles (stored in RTC RAM)
- Reset by entering CONFIG mode and saving with a normal mode selected

---

## Physical Button Reference

| Button                        | Action               | Result                                            |
|-------------------------------|----------------------|---------------------------------------------------|
| **SW_MODE** (GPIO 9)          | Short press          | Toggle BEACON ↔ SEARCH mode instantly             |
| **SW_MODE** (GPIO 9)          | Hold 2 s             | Activate **EMERGENCY SOS** (max power, no sleep)  |
| **SW_CONFIG** (GPIO 21)       | Short press          | Print full device status to Serial                |
| **SW_CONFIG** (GPIO 21)       | Hold 3 s             | Launch WiFi AP + dashboard                        |
| **Both SW_MODE + SW_CONFIG**  | Hold at boot for 5 s | **Factory reset** (clears all NVS settings)       |

> 💡 **During TX:** SW_MODE press immediately interrupts the active Morse transmission and switches mode. The interrupt fires at the hardware level — no polling delay.

> ⚠️ **v3.0 → v4.0 migration:** SW_CONFIG has moved from GPIO 1 to GPIO 21. Rewire accordingly.

---

## OLED Display Layouts

The SSD1306 128×64 display shows a different screen for each mode, refreshing every 250 ms.

| Mode          | Screen content                                                                       |
|---------------|--------------------------------------------------------------------------------------|
| **BOOT**      | Logo + "AEGIS-BEACON v4.0" splash, 2 s                                               |
| **BEACON**    | `⬡ BEACON` header, current freq MHz, TX progress bar, message + WPM, cycle #, sleep countdown |
| **SEARCH**    | `◈ SEARCH` header, current freq + RSSI bar, last hit freq + dBm, total hits, elapsed time |
| **EMERGENCY** | Full-screen **inverted** display — large blinking `⚡SOS⚡`                           |
| **CONFIG**    | AP SSID (`AegisBeacon`), device IP (`192.168.4.1`), `SCAN TO CONFIG` QR code hint    |

> 💡 **Power saving:** OLED can be disabled in the dashboard (`oledEnabled = false`). This saves ~5 mA continuously and extends battery life in long-term deployments.

> 💡 **Sunlight:** Enable `oledInvert` for white-on-black rendering which can be easier to read in bright conditions.

---

## Audio System

The ESP32-C3 has no hardware DAC. Audio is generated via **LEDC PWM** at 40 kHz (inaudible carrier), with the duty cycle varied to produce audible tones. The headphone's own impedance acts as a low-pass filter.

**Signal path:** `GPIO 18 → 100 Ω series R → 10 µF AC-coupling cap → 3.5mm jack TIP`

**Tone behaviour in SEARCH mode:**

| Condition                              | Audio output                            | Tone freq  |
|----------------------------------------|-----------------------------------------|------------|
| No signal (RSSI < threshold)           | Silence                                 | —          |
| Weak signal (RSSI –90 to –80 dBm)      | Slow beep (1 beep/s)                    | 440 Hz     |
| Medium signal (RSSI –80 to –60 dBm)    | Fast beep (4 beeps/s)                   | 880 Hz     |
| Strong signal (RSSI ≥ –60 dBm)         | Continuous tone                         | 1760 Hz    |
| Pitch rising                           | Signal getting stronger (metal-detector feel) | Interpolated |

**Audio in BEACON mode:** Morse click stream at 600 Hz — each dot/dash produces a click through the earphone, useful for debug monitoring of transmission timing.

**Volume control:** 0–255 PWM duty (default 180 ≈ 70%). Configurable via dashboard slider; saved to NVS.

**Compatible headphones:** Standard 3.5mm, impedance 16–600 Ω.

---

## Dashboard Features

| Section               | Feature                                                                                  |
|-----------------------|------------------------------------------------------------------------------------------|
| **Mode toggle**       | Large physical-style switch — select BEACON or SEARCH before saving                      |
| **Emergency message** | Text area with live Morse preview (dots/dashes update as you type)                       |
| **Frequency manager** | Add/remove up to 10 frequencies; band labels auto-detected                               |
| **Morse speed**       | Slider 5–30 WPM with real-time display                                                   |
| **TX power**          | Slider +2 to +17 dBm                                                                     |
| **Sleep interval**    | Seconds between TX cycles (1–3600 s)                                                     |
| **Repeat count**      | How many times to repeat message per frequency per cycle (1–5)                           |
| **Scan dwell**        | Milliseconds to listen per frequency in SEARCH mode (100–5000 ms)                        |
| **RSSI threshold**    | Detection sensitivity slider (-120 to -40 dBm)                                           |
| **Audio volume**      | PWM duty slider 0–255 + master enable/disable toggle *(new in v4.0)*                     |
| **OLED settings**     | Enable/disable + invert toggle *(new in v4.0)*                                           |
| **Auto-switch**       | Toggle: auto-switch to BEACON if battery drops low                                       |
| **Scan history**      | Live-updating RSSI bar charts for all detections; Refresh + Clear buttons                |
| **Device status**     | Boot cycles, TX cycles, scan cycles, scan hits, free heap, uptime (auto-refresh 10 s)    |
| **Test TX**           | Sends one SOS burst on first configured frequency                                        |
| **Test Scan**         | Scans all frequencies, returns RSSI per freq in real time                                |
| **Emergency button**  | Activates EMERGENCY mode immediately from the browser                                    |
| **Save button**       | Saves all settings to NVS and reboots into selected mode                                 |

---

## Serial Debug System

Connect at **115200 baud, 8N1** to receive full real-time diagnostics.

**Terminal commands:**

- Linux/Mac: `picocom -b 115200 /dev/ttyUSB0`
- Windows: PuTTY → Serial → COM port → 115200

**Log format:** `[timestamp_ms][LEVEL] message`

| Tag       | Color   | Meaning                                              |
|-----------|---------|------------------------------------------------------|
| `[INFO ]` | Cyan    | Normal operation                                     |
| `[OK   ]` | Green   | Successful operation                                 |
| `[WARN ]` | Yellow  | Non-fatal anomaly                                    |
| `[ERROR]` | Red     | Hardware/radio failure                               |
| `[MODE ]` | Magenta | Mode change event                                    |
| `[SCAN ]` | Blue    | RSSI scan result                                     |
| `[BTN  ]` | White   | Physical button event + hold duration                |
| `[CFG  ]` | White   | Dashboard save/load                                  |
| `[OLED ]` | Magenta | OLED screen update event *(new in v4.0)*             |
| `[AUDIO]` | Green   | Audio tone event *(new in v4.0)*                     |
| `[MORSE]` | Gray    | Per-symbol Morse timing *(DEBUG_VERBOSE 1 only)*     |
| `[RF   ]` | Gray    | RadioLib return codes *(DEBUG_VERBOSE 1 only)*       |

**Healthy BEACON boot sequence:**

```
╔══════════════════════════════════════════════════════════════╗
║  ⬡  AEGIS-BEACON v4.0 — DUAL-MODE + OLED + AUDIO JACK        ║
╚══════════════════════════════════════════════════════════════╝
    Active mode: BEACON

[       5][INFO ] Boot cycle #1
[       6][INFO ] Reset reason: 1
[       7][INFO ] Free heap: 296420 B
[       8][INFO ] CPU freq: 160 MHz
────────────── NVS CONFIG LOAD ───────────────
[      12][INFO ]   freq[0] = 433.500 MHz
[      13][INFO ] Message  : "SOS"
[      14][INFO ] WPM      : 13  (dot=92 ms)
[      15][INFO ] Power    : 17 dBm
[      16][INFO ] Audio    : enabled  vol=180  tone=880 Hz
[      17][INFO ] OLED     : enabled  invert=false
────────────────────────────────────────────
[      20][OLED ] Splash screen displayed
[      22][AUDIO] PWM init OK — GPIO18 ch0 @ 40000 Hz 8-bit
[      25][MODE ] Starting in mode: BEACON
[      30][INFO ] Disabling WiFi + BT stacks...
[      85][OK   ] WiFi + BT disabled
[      90][INFO ] Radio init OOK: 433.500 MHz @ 17 dBm
[     125][OK   ] Radio ready — OOK/CW on 433.500 MHz @ 17 dBm
[     126][INFO ] TX: "SOS" @ 13 WPM  dot=92 ms  dash=277 ms
[    2856][OK   ] TX done: 3 chars in 2730 ms
[    2857][OK   ] Full TX cycle done in 2867 ms
[    2858][INFO ] Deep sleep 10 seconds...
```

---

## Morse Engine

The Morse engine uses **PARIS standard timing** — the word "PARIS" takes exactly 50 units, calibrating against the WPM setting.

```
unit_duration_ms = 1200 / WPM

DOT  = 1 unit
DASH = 3 units
intra-character gap (between elements) = 1 unit
inter-character gap (between letters)  = 3 units
word gap (between words)               = 7 units
```

**Supported characters:** A–Z, 0–9, space (word gap)

**Example — "SOS" at 13 WPM (unit = 92 ms):**

```
S  =  · · ·     = DOT GAP DOT GAP DOT
O  =  − − −     = DASH GAP DASH GAP DASH
S  =  · · ·     = DOT GAP DOT GAP DOT

Full: ···   −−−   ···
Time: ~2730 ms
```

**TX can be interrupted mid-character** by pressing SW_MODE. The `transmitMessage()` function checks the interrupt flag between characters.

---

## Deep Sleep & Battery Life

| State                    | Current draw   |
|--------------------------|----------------|
| Deep sleep (ESP32-C3)    | ~10 µA         |
| TX active @ 17 dBm       | ~120 mA        |
| SEARCH scan              | ~40 mA (no TX) |
| Config AP (WiFi active)  | ~100 mA        |
| OLED active (SSD1306)    | ~5 mA          |
| OLED disabled            | ~0.5 mA        |

**Estimated battery life (2000 mAh 18650):**

| Mode      | Sleep interval   | OLED | Est. runtime |
|-----------|------------------|------|--------------|
| BEACON    | 10 s             | On   | ~70 hours    |
| BEACON    | 10 s             | Off  | ~72 hours    |
| BEACON    | 30 s             | On   | ~140 hours   |
| BEACON    | 60 s             | On   | ~190 hours   |
| SEARCH    | N/A (continuous) | On   | ~48 hours    |
| EMERGENCY | N/A (continuous) | On   | ~15 hours    |

> 💡 These estimates assume normal temperature (20 °C). At −20 °C with a standard Li-ion cell, expect 40–60% of these figures. Use a LiFePO4 cell for cold-weather deployments.

---

## Antenna Guide

| Frequency  | ¼-wave length | ½-wave length |
|------------|---------------|---------------|
| 433.5 MHz  | **17.3 cm**   | 34.6 cm       |
| 868 MHz    | 8.6 cm        | 17.3 cm       |
| 915 MHz    | 8.2 cm        | 16.4 cm       |

**Best practices:**

- Use stiff copper wire (AWG 22–26), vertical orientation
- Keep antenna away from the battery and metal enclosure
- A ground plane (foil on the back of the PCB) improves gain by ~3 dBi
- Helical coil antenna: wind 17.3 cm of wire into a helix (~5 mm diameter) to reduce physical length to ~6 cm with ~1–2 dBi gain loss

---

## Troubleshooting

| Symptom                         | Likely cause                      | Fix                                                      |
|---------------------------------|-----------------------------------|----------------------------------------------------------|
| `[ERROR] beginFSK failed: -2`   | SPI wiring error                  | Check CS/SCK/MOSI/MISO pin assignments                   |
| `[ERROR] beginFSK failed: -7`   | Bad solder joint on RA-02         | Reflow SPI pads on RA-02 module                          |
| `[WARN] NVS empty`              | First boot / after factory reset  | Normal — configure via dashboard                         |
| OLED blank after boot           | Wrong I2C address                 | Try changing `OLED_ADDR` to `0x3D`                       |
| OLED blank after v3→v4 upgrade  | GPIO 1 conflict (old SW_CONFIG)   | Rewire SW_CONFIG from GPIO 1 to GPIO 21                  |
| No audio from jack              | AC coupling cap polarity or wrong pin | Check C3 orientation; verify GPIO 18 wiring         |
| Audio very quiet                | Volume too low                    | Increase `DEFAULT_AUDIO_VOL` or use dashboard slider     |
| No signal on SDR                | Wrong frequency / wrong modulation | Set SDR to AM mode, center on configured frequency      |
| Button not responding           | GPIO change (v3→v4)               | SW_CONFIG is now GPIO 21, not GPIO 1                     |
| Dashboard not opening           | Phone captive portal blocked      | Navigate manually to `http://192.168.4.1`                |
| Upload fails                    | ESP32-C3 USB CDC not recognized   | Hold BOOT (GPIO 9) while clicking Upload                 |
| Device stuck in EMERGENCY       | Flag set in RTC RAM               | Enter CONFIG mode and save — this clears the flag        |
| TX current high                 | WiFi/BT not disabled              | Check `WiFi.mode(WIFI_OFF)` + `btStop()` calls in log    |

---

## FAQ

**Q: Can a regular hiker use this without radio knowledge?**  
A: Yes. In BEACON mode the device transmits automatically. In SEARCH mode it scans and alerts you with LED blinks and audio tones — no radio knowledge needed.

**Q: What receiver do I need to hear the beacon?**  
A: Any AM-mode receiver on 433 MHz: a handheld scanner (Uniden, Baofeng with AM mode), a ham radio transceiver, or an RTL-SDR dongle + SDR# software on a laptop.

**Q: What headphones work with the audio jack?**  
A: Standard 3.5mm wired headphones or earphones, 16–600 Ω impedance. In-ear monitors work best for outdoor use. Wireless/Bluetooth headphones require an adapter or won't work.

**Q: Is this legal to operate?**  
A: 433 MHz ISM band is licence-free in most countries (EU/UK/AU). 915 MHz ISM is licence-free in North America. Always check local regulations before operating. In genuine emergencies, normal frequency restrictions are generally suspended.

**Q: Does it work through snow?**  
A: RF signals at 433 MHz penetrate wet snow with 1–3 dB/m attenuation. At 1 m burial depth expect ~3–9 dB signal loss. The +17 dBm output compensates for this. Reduce sleep interval to increase detection probability.

**Q: Can I add GPS coordinates to the message?**  
A: The firmware has a reserved `emergencyGPS` flag. A future update will support appending NMEA coordinates to the Morse message via a connected GPS module.

**Q: How do I update the firmware without reflashing?**  
A: Enter CONFIG mode (hold SW_CONFIG 3 s) and use the OTA update button *(planned for v4.1)*.

**Q: I upgraded from v3.0 — do I need to factory reset?**  
A: Yes, recommended. The NVS schema changed (new `audioVolume`, `audioEnabled`, `oledEnabled`, `oledInvert` keys). Hold both buttons at boot for 5 s to factory reset, then reconfigure via the dashboard.

---

## CI/CD Workflow

The repository includes a full GitHub Actions pipeline at `.github/workflows/aegis_suite.yml`.

### Pipeline Overview

```
push / PR / tag
      │
      ├── 🔍 validate          ← YAML syntax, required files, platformio.ini
      │         │
      ├── 🔨 build-arduino  ◄──┤   (matrix: 160 MHz + 80 MHz)
      ├── 🔧 build-pio       ◄──┤
      └── 🛡️ static-analysis ◄──┘
                │
                ├── 📊 size-report  (PR only — posts flash/RAM comment)
                │
                ├── 🚀 release      (tag v*.*.* only — creates GitHub Release)
                │
                └── 📋 notify       (always — writes CI summary)
```

### Triggering a Release

```bash
git tag v4.0.0
git push origin v4.0.0
```

The pipeline builds both Arduino and PlatformIO `.bin` files, generates a changelog from commits since the last tag, and publishes a GitHub Release automatically.

---

## License

```
MIT License

Copyright (c) 2026 Leonardo Galli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by [@Leo-Galli](https://github.com/Leo-Galli) for mountain safety.**

[![Stars](https://img.shields.io/github/stars/leo-galli/aegis-beacon?style=social)](https://github.com/leo-galli/aegis-beacon)
[![Forks](https://img.shields.io/github/forks/leo-galli/aegis-beacon?style=social)](https://github.com/leo-galli/aegis-beacon/fork)
[![Issues](https://img.shields.io/github/issues/leo-galli/aegis-beacon?style=flat-square)](https://github.com/leo-galli/aegis-beacon/issues)

*If this project saves a life, please open a PR and let us know.*

</div>