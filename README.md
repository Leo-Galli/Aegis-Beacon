# 🏔️ Aegis-Beacon

<div align="center">

```
 █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
```

**Ultra-Low-Cost DIY Avalanche Rescue Beacon**  
*ESP32-C3 SuperMini + RA-02 SX1276 · OOK/CW Morse · ~$8–12 USD total build cost*

---

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Platform: ESP32-C3](https://img.shields.io/badge/Platform-ESP32--C3-blue?style=for-the-badge&logo=espressif)](https://www.espressif.com/en/products/socs/esp32-c3)
[![Framework: Arduino](https://img.shields.io/badge/Framework-Arduino-00979D?style=for-the-badge&logo=arduino)](https://www.arduino.cc/)
[![Framework: PlatformIO](https://img.shields.io/badge/Framework-PlatformIO-FF7F00?style=for-the-badge&logo=platformio)](https://platformio.org/)
[![RadioLib](https://img.shields.io/badge/RadioLib-%E2%89%A56.0-purple?style=for-the-badge)](https://github.com/jgromes/RadioLib)
[![ArduinoJson](https://img.shields.io/badge/ArduinoJson-%E2%89%A57.0-yellow?style=for-the-badge)](https://arduinojson.org/)
[![Frequency: 433 MHz](https://img.shields.io/badge/Frequency-433%20MHz-red?style=for-the-badge)](https://en.wikipedia.org/wiki/433_MHz)
[![Build Cost](https://img.shields.io/badge/Build%20Cost-%248--12%20USD-brightgreen?style=for-the-badge)](https://github.com)
![C Syntax Check](https://img.shields.io/github/actions/workflow/status/Leo-Galli/Aegis-Beacon/c-syntax-check.yml?branch=main&label=C%20Syntax%20Check&logo=github&style=for-the-badge)
[![Version](https://img.shields.io/badge/Version-1.0-orange?style=for-the-badge)](../README.md)
[![Go to TECHNICAL_DATASHEET](https://img.shields.io/badge/%20Go%20to-TECHNICAL_DATASHEET-lightgrey?style=for-the-badge)](../TECHNICAL_DATASHEET.md)

</div>

---

## 📖 Overview

**Aegis-Beacon** is an open-source, ultra-low-cost avalanche rescue beacon firmware for the ESP32-C3 SuperMini + RA-02 (SX1276) combo. It transmits a configurable Morse code message on one or more 433 MHz frequencies using OOK (On-Off Keying / CW) modulation — detectable by any AM-mode scanner, SDR receiver, or compatible rescue device.

The entire device can be built for **under $12 USD** using widely available AliExpress / LCSC components, with no RF design experience required.

> ⚠️ **DISCLAIMER**: This project is a hobbyist/educational tool. It does **not** comply with ETSI EN 300 718 or any certified avalanche beacon standard. Do **not** use it as a replacement for a certified avalanche transceiver (e.g., Mammut, Pieps, Ortovox) in real backcountry situations.

---

## ✨ Features

- 📡 **OOK/CW Morse transmission** on 433 MHz (or any SX1276-supported frequency)
- 🔁 **Multi-frequency hopping** — transmit on up to 10 frequencies per cycle
- 💤 **Ultra-deep sleep** between TX cycles (ESP32-C3 deep sleep, ~10 µA)
- ⚙️ **Wi-Fi captive portal** for browser-based configuration (no app needed)
- 💾 **NVS persistence** — settings survive power cycles and deep sleep
- 🐛 **Rich ANSI debug logging** over USB-CDC Serial (115200 baud)
- 🔋 **USB-C charging** via TP4056 module (18650 or 14500 Li-ion)
- 💰 **~$8–12 USD total BOM** (AliExpress / LCSC pricing)

---

## 🛒 Bill of Materials

| Ref | Part | ~Cost (USD) | Notes |
|-----|------|:-----------:|-------|
| U1 | ESP32-C3 SuperMini | $1.50 | Built-in LDO + USB-CDC, no extra regulator needed |
| U2 | AI-Thinker RA-02 (SX1276) 433 MHz | $2.50 | ~17 dBm, spring antenna included |
| B1 | 18650 Li-ion 3.7V (any brand) | $1.50 | LiFePO4 better for cold, but 3× cost |
| IC1 | TP4056 USB-C charge module (DW01A) | $0.50 | Charging + over-discharge protection |
| SW1 | Tactile switch 6×6mm | $0.05 | BOOT / config mode |
| C1 | 100 µF 10V electrolytic (or 47µF X7R ceramic) | $0.05 | Bulk cap on 3.3V rail |
| C2 | 100 nF ceramic 0805 | $0.02 | Decoupling |
| R1 | 10 kΩ 0805 | $0.01 | RST pull-up |
| R2 | 330 Ω 0805 | $0.01 | LED current limit |
| D1 | Red LED 3mm | $0.05 | Status indicator |
| ANT | 17.3 cm wire (¼-wave 433 MHz) | $0.00 | Any wire — FREE |
| BOX | Hammond 1551 (60×35×20mm) OR 3D-printed PLA | $0.30–$1.50 | Print your own |
| **Total** | | **~$8–10 USD** | |

> 💡 **Why so cheap?** The ESP32-C3 SuperMini has a built-in LDO (no external regulator), the RA-02 has a complete RF front-end (no RF design), the TP4056 has protection built-in (no separate BMS), and the antenna is just a wire. Only 4 passive components total.

---

## 🔌 Wiring

### ESP32-C3 SuperMini ↔ RA-02 (SX1276)

| RA-02 Pin | ESP32-C3 GPIO | Notes |
|-----------|:-------------:|-------|
| VCC (3.3V) | 3V3 | **MAX 3.6V — do NOT connect to 5V/VBUS** |
| GND | GND | Common ground |
| SCK | GPIO 4 | SPI Clock |
| MOSI | GPIO 6 | SPI MOSI |
| MISO | GPIO 5 | SPI MISO |
| NSS / CS | GPIO 7 | Chip Select (active LOW) |
| RESET | GPIO 3 | Active LOW reset |
| DIO0 | GPIO 2 | TX/RX Done IRQ |
| DIO1 | N/C | Not needed for OOK/CW |
| ANT | — | 17.3 cm wire soldered directly to ANT pad |

### Other connections

| Component | ESP32-C3 GPIO | Notes |
|-----------|:-------------:|-------|
| LED anode | GPIO 8 | Through R2 (330 Ω) to GND |
| SW1 (BOOT) | GPIO 9 | Between GPIO9 and GND |

### Battery wiring

```
18650 (+) → TP4056 BAT+ → ESP32-C3 SuperMini 5V (VBUS input)
18650 (-) → TP4056 BAT- → GND
TP4056 USB-C port → any USB-C cable for charging
```

> ℹ️ The ESP32-C3 SuperMini has an onboard AMS1117-3.3 LDO powered from VBUS. Running 3.7V Li-ion through the TP4056 OUT+ → VBUS works without any extra regulator.

---

## 📐 System Architecture

```
POWER ON / DEEP-SLEEP WAKE
│
├─ BOOT button held? ──YES──► runConfigMode()
│                              WiFi AP + Captive Portal dashboard
│                              blocks until save/reboot or 5-min timeout
└─ NO
     │
     ▼
loadConfig()  ← NVS
NVS empty? → inject hardcoded defaults (433.5 MHz, "SOS", 13 WPM)
     │
     ▼
Disable WiFi + BT (saves ~120 mA during beacon mode)
     │
     ▼
initRadio(freq, power)  — OOK mode via RadioLib
     │
╔══════════════════════════════════════════╗
║  BEACON LOOP (one pass, then deep sleep) ║
║  for each freq in cfg.freqs[]:           ║
║      setFrequency(freq)                  ║
║      for each char in message:           ║
║          morse encode → dot/dash timing  ║
║          txOn() / txOff() via OOK        ║
║      inter-freq guard delay (50 ms)      ║
╚══════════════════════════════════════════╝
     │
     ▼
radio.sleep()
esp_deep_sleep(cfg.sleepSec × 1e6)
→ wakes → setup() → repeat
```

---

## 🚀 Getting Started

### Prerequisites

- [Arduino IDE 2.x](https://www.arduino.cc/en/software) **or** [PlatformIO](https://platformio.org/)
- ESP32 board support package (Arduino: `esp32` by Espressif ≥ 2.0)
- Libraries:
  - [RadioLib](https://github.com/jgromes/RadioLib) **≥ 6.0**
  - [ArduinoJson](https://arduinojson.org/) **≥ 7.0**

### Arduino IDE

1. Open **Sketch → Include Library → Manage Libraries**
2. Install `RadioLib` by Jan Gromes (≥ 6.0)
3. Install `ArduinoJson` by Benoît Blanchon (≥ 7.0)
4. Select board: **ESP32C3 Dev Module**
5. Open `AegisBeacon.ino` and click **Upload**

### PlatformIO

```ini
; platformio.ini
[env:esp32-c3-supermini]
platform = espressif32
board = esp32-c3-devkitm-1
framework = arduino
lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
```

```bash
pio run --target upload
pio device monitor --baud 115200
```

---

## ⚙️ Configuration

### First boot (hardcoded defaults)

On first boot with an empty NVS, the beacon uses these defaults:

| Parameter | Default |
|-----------|---------|
| Frequency | 433.500 MHz |
| Message | `SOS` |
| WPM | 13 |
| TX Power | 17 dBm |
| Sleep interval | 10 seconds |

### Config mode (Wi-Fi captive portal)

1. **Hold the BOOT button** while powering on (or pressing reset)
2. Connect to Wi-Fi network **`AegisBeacon-Config`**
3. Open a browser to **`http://192.168.4.1`** (captive portal auto-redirects)
4. Edit message, frequencies (up to 10), WPM, TX power, sleep interval
5. Click **Save** — settings are written to NVS and the device reboots into beacon mode
6. Config mode auto-times-out after **5 minutes** if no save occurs

---

## 🐛 Debug / Serial Monitor

Connect via USB-CDC at **115200 baud**. The firmware uses ANSI colour codes for easy reading in any terminal that supports them (VS Code, picocom, minicom, PuTTY).

### Log level tags

| Tag | Colour | Meaning |
|-----|--------|---------|
| `[INFO ]` | Cyan | Normal operation |
| `[OK   ]` | Green | Successful operation |
| `[WARN ]` | Yellow | Non-fatal anomaly |
| `[ERROR]` | Red | Failure — check wiring/hardware |
| `[MORSE]` | Gray | Per-symbol Morse log *(verbose only)* |
| `[RF   ]` | Gray | RadioLib SPI/register log *(verbose only)* |

Enable full verbose logging by setting `#define DEBUG_VERBOSE 1` at the top of the sketch.

### Typical healthy boot log

```
╔══════════════════════════════════════════════════════╗
║       AEGIS-BEACON v1.0  — BOOT                      ║
║   ESP32-C3 SuperMini + RA-02 SX1276  OOK/CW Beacon   ║
╚══════════════════════════════════════════════════════╝

[    150][INFO ] Boot cycle #1
[    151][INFO ] Loading 1 frequencies from NVS
[    210][INFO ] Disabling WiFi + BT stacks...
[    280][OK   ] Radio ready — 433.500 MHz, 17 dBm, OOK/CW
[    285][INFO ] TX START: "SOS" @ 13 WPM (dot=92 ms)
[   3015][OK   ] TX DONE: 3 chars in 2730 ms
[   3020][OK   ] Full TX cycle done in 2845 ms
[   3021][INFO ] Entering deep sleep for 10 seconds...
```

### Common errors and fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Radio beginFSK failed! Code: -2` | SPI wiring wrong | Double-check CS/SCK/MOSI/MISO/RST pins |
| `Radio beginFSK failed! Code: -7` | RA-02 not receiving SPI clock | Check solder joints on RA-02 |
| `NVS empty — using hardcoded defaults` | First boot | Normal — configure via AP mode |

---

## 📡 RF / Morse Technical Details

- **Modulation**: OOK (On-Off Keying) — RF carrier ON = key down, OFF = key up
- **Encoding**: Standard ITU Morse (A–Z, 0–9, space)
- **Timing**: PARIS standard — 1 unit = `1200 / WPM` ms
- **Frequency**: 433 MHz band (EU ISM, 433.050–434.790 MHz)
- **TX power**: Up to 17 dBm on RFO pin (RA-02 default); 20 dBm via PA_BOOST variant
- **Antenna**: ¼-wave monopole = **17.3 cm** of any wire, or the spring antenna included with RA-02
- **Reception**: Audible on any AM-mode scanner, SDR (RTL-SDR, HackRF), or compatible receiver

---

## 📁 Project Structure

```
AegisBeacon/
├── AegisBeacon.ino        # Main firmware (single-file Arduino sketch)
├── README.md              # This file
└── LICENSE                # MIT License
```

---

## 🔧 Customization

| What | Where | Notes |
|------|-------|-------|
| Default frequency | `#define DEFAULT_FREQ_MHZ` | Any SX1276-supported frequency |
| Default message | `#define DEFAULT_MESSAGE` | Any string with A-Z, 0-9, spaces |
| Default WPM | `#define DEFAULT_WPM` | Standard CW: 5–25 WPM |
| TX power | `#define DEFAULT_POWER_DBM` | 2–17 dBm (RFO), up to 20 dBm (PA_BOOST) |
| Sleep interval | `#define DEFAULT_SLEEP_SEC` | Seconds between TX cycles |
| Max frequencies | `#define MAX_FREQUENCIES` | Default 10, limited by NVS space |
| Config AP name | `#define AP_SSID` | Wi-Fi network name in config mode |
| Config timeout | `#define CONFIG_TIMEOUT_MS` | Default 5 min (300 000 ms) |

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome! Please open an issue or pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Use freely, save lives.
```

---

## ⚠️ Legal & Safety Notice

- In most countries, 433 MHz ISM band transmissions are permitted under short-range device regulations, but **always verify local regulations** before operating.
- This device is **not certified** as an avalanche rescue transceiver and **must not** be used as a substitute for a certified device in real emergencies.
- The author(s) accept no liability for any use of this firmware in life-safety situations.

---

<div align="center">

Made with ❤️ for the mountains · [MIT License](LICENSE) · *Use freely, save lives.*

</div>