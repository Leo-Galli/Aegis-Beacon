# Aegis-Beacon v1.0 — Technical Datasheet

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](../LICENSE)
[![Platform: ESP32-C3](https://img.shields.io/badge/Platform-ESP32--C3-blue?style=for-the-badge&logo=espressif)](https://www.espressif.com/en/products/socs/esp32-c3)
[![Framework: Arduino](https://img.shields.io/badge/Framework-Arduino-00979D?style=for-the-badge&logo=arduino)](https://www.arduino.cc/)
[![RadioLib](https://img.shields.io/badge/RadioLib-%E2%89%A56.0-purple?style=for-the-badge)](https://github.com/jgromes/RadioLib)
[![ArduinoJson](https://img.shields.io/badge/ArduinoJson-%E2%89%A57.0-yellow?style=for-the-badge)](https://arduinojson.org/)
[![Frequency: 433 MHz](https://img.shields.io/badge/Frequency-433%20MHz-red?style=for-the-badge)](https://en.wikipedia.org/wiki/433_MHz)
![C Syntax Check](https://img.shields.io/github/actions/workflow/status/Leo-Galli/Aegis-Beacon/c-syntax-check.yml?branch=main&label=C%20Syntax%20Check&logo=github&style=for-the-badge)
[![Version](https://img.shields.io/badge/Version-1.0-orange?style=for-the-badge)](../README.md)
[![Back to README](https://img.shields.io/badge/←%20Back%20to-README-lightgrey?style=for-the-badge)](../README.md)

</div>

---

> **Document type**: Engineering Reference & Technical Specification  
> **Firmware version**: 1.0  
> **Target hardware**: ESP32-C3 SuperMini + AI-Thinker RA-02 (SX1276)  
> **Revision date**: 2026  
> **License**: MIT

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [System Architecture](#2-system-architecture)
3. [Hardware Specifications](#3-hardware-specifications)
   - 3.1 [Microcontroller — ESP32-C3 SuperMini](#31-microcontroller--esp32-c3-supermini)
   - 3.2 [RF Transceiver — AI-Thinker RA-02 (SX1276)](#32-rf-transceiver--ai-thinker-ra-02-sx1276)
   - 3.3 [Power System — TP4056 + 18650](#33-power-system--tp4056--18650)
   - 3.4 [Antenna](#34-antenna)
   - 3.5 [Passive Components & Peripherals](#35-passive-components--peripherals)
4. [Complete Bill of Materials](#4-complete-bill-of-materials)
5. [Pin Assignment & Wiring](#5-pin-assignment--wiring)
   - 5.1 [SPI Bus — ESP32-C3 to RA-02](#51-spi-bus--esp32-c3-to-ra-02)
   - 5.2 [Control Signals](#52-control-signals)
   - 5.3 [Power Wiring](#53-power-wiring)
   - 5.4 [Peripheral Wiring](#54-peripheral-wiring)
6. [Firmware Architecture](#6-firmware-architecture)
   - 6.1 [Boot Sequence & State Machine](#61-boot-sequence--state-machine)
   - 6.2 [NVS Configuration System](#62-nvs-configuration-system)
   - 6.3 [Radio Initialization — OOK Mode](#63-radio-initialization--ook-mode)
   - 6.4 [Morse Code Engine](#64-morse-code-engine)
   - 6.5 [Deep Sleep & Wake Cycle](#65-deep-sleep--wake-cycle)
   - 6.6 [Configuration Mode — Wi-Fi Captive Portal](#66-configuration-mode--wi-fi-captive-portal)
   - 6.7 [Web Server API Endpoints](#67-web-server-api-endpoints)
   - 6.8 [Debug & Logging System](#68-debug--logging-system)
7. [RF & Signal Specifications](#7-rf--signal-specifications)
   - 7.1 [Modulation](#71-modulation)
   - 7.2 [Frequency Plan](#72-frequency-plan)
   - 7.3 [Morse Timing (PARIS Standard)](#73-morse-timing-paris-standard)
   - 7.4 [Transmission Duty Cycle & Battery Life](#74-transmission-duty-cycle--battery-life)
8. [Configuration Parameters Reference](#8-configuration-parameters-reference)
   - 8.1 [Firmware Compile-Time Constants](#81-firmware-compile-time-constants)
   - 8.2 [Runtime Configuration (NVS)](#82-runtime-configuration-nvs)
9. [Power Analysis](#9-power-analysis)
   - 9.1 [Current Consumption by Mode](#91-current-consumption-by-mode)
   - 9.2 [Battery Life Estimation](#92-battery-life-estimation)
   - 9.3 [Cold-Weather Considerations](#93-cold-weather-considerations)
10. [Software Dependencies](#10-software-dependencies)
11. [Build & Flash Instructions](#11-build--flash-instructions)
    - 11.1 [Arduino IDE](#111-arduino-ide)
    - 11.2 [PlatformIO](#112-platformio)
12. [Serial Debug Reference](#12-serial-debug-reference)
    - 12.1 [Log Level Tags](#121-log-level-tags)
    - 12.2 [Healthy Boot Sequence](#122-healthy-boot-sequence)
    - 12.3 [Error Codes & Diagnostics](#123-error-codes--diagnostics)
13. [Memory Map & Resource Usage](#13-memory-map--resource-usage)
14. [Regulatory & Legal Notes](#14-regulatory--legal-notes)
15. [Design Rationale & Trade-offs](#15-design-rationale--trade-offs)
16. [Revision History](#16-revision-history)

---

## 1. Product Overview

Aegis-Beacon is an open-source, ultra-low-cost emergency radio beacon firmware targeting the ESP32-C3 SuperMini microcontroller combined with the AI-Thinker RA-02 (Semtech SX1276) LoRa/FSK/OOK transceiver module. The system transmits a configurable Morse code message over OOK-modulated RF on one or more frequencies in the 433 MHz ISM band (or any frequency supported by the SX1276), entering deep sleep between transmission cycles to maximize battery life.

**Primary use case**: DIY emergency locator / rescue beacon for wilderness, avalanche, or search-and-rescue scenarios where a low-cost, battery-powered, continuously transmitting device is needed. Signal is receivable by any AM-mode radio scanner, Software Defined Radio (SDR), or compatible search-and-rescue equipment.

**Key design goals**:

| Goal | How achieved |
|------|-------------|
| **Minimum cost** | ESP32-C3 SuperMini ($1.50) + RA-02 ($2.50) — no external LDO, no RF design work |
| **Maximum battery life** | Deep sleep between TX cycles (~10 µA sleep current); Wi-Fi/BT disabled during beacon mode |
| **Zero-configuration first boot** | Hardcoded NVS defaults (433.5 MHz, "SOS", 13 WPM) injected if NVS is empty |
| **Easy field reconfiguration** | Wi-Fi captive portal accessible from any smartphone browser |
| **Broad signal detectability** | OOK/CW Morse — audible on any AM-mode receiver, SDR, or scanner |

---

## 2. System Architecture

The firmware implements a non-preemptive single-threaded state machine. The Arduino `loop()` function is never used under normal operation — the MCU either enters deep sleep (beacon mode) or blocks in the captive portal loop (config mode).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM BLOCK DIAGRAM                                │
│                                                                             │
│  ┌──────────────┐   SPI (HSPI)    ┌─────────────────────────────────────┐  │
│  │  ESP32-C3    │◄───────────────►│  RA-02 (SX1276)                     │  │
│  │  SuperMini   │                 │  OOK/CW transmitter                 │  │
│  │              │  GPIO2 (DIO0)   │  433 MHz, up to 17 dBm              │  │
│  │  4MB Flash   │◄────────────────│  Spring or wire antenna             │  │
│  │  400KB SRAM  │  GPIO3 (RST)    └──────────────┬──────────────────────┘  │
│  │  USB-CDC     │─────────────────►               │                         │
│  │              │                                 ▼ RF out                  │
│  │  NVS (Prefs) │   GPIO8 (LED)   ┌──────────────────────────────────────┐ │
│  │              │─────────────────►│  17.3 cm ¼λ wire antenna           │ │
│  │              │   GPIO9 (BOOT)  └──────────────────────────────────────┘ │
│  │              │◄─────────────────[ BOOT button ]                         │
│  └──────┬───────┘                                                           │
│         │ VBUS (5V via TP4056 OUT+)                                         │
│  ┌──────▼───────┐                                                           │
│  │  TP4056      │◄──── USB-C charging cable                                 │
│  │  charge ctrl │                                                           │
│  └──────┬───────┘                                                           │
│         │ BAT+/BAT-                                                         │
│  ┌──────▼───────┐                                                           │
│  │  18650 / 14500│                                                          │
│  │  3.7V Li-ion  │                                                          │
│  └───────────────┘                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Firmware state machine

```
             POWER ON / DEEP-SLEEP WAKE (setup())
                          │
                    debugBanner()
                    g_bootCycle++
                    loadConfig() ← NVS
                          │
             ┌────────────▼────────────┐
             │  GPIO9 (BOOT) == LOW?   │
             └────────────┬────────────┘
                    YES   │   NO
                    ┌─────┘   └──────────────────────┐
                    ▼                                 ▼
           runConfigMode()                   runBeaconMode()
           WiFi AP on                        WiFi/BT disabled
           DNS 53 / HTTP 80                  initRadio() for each freq
           captive portal HTML               transmitMessage()
           blocks until:                     radio.sleep()
             • POST /save → reboot           esp_deep_sleep(sleepSec × 1e6)
             • 5 min timeout → reboot              │
                                                   └──► wakes → setup()
```

---

## 3. Hardware Specifications

### 3.1 Microcontroller — ESP32-C3 SuperMini

| Parameter | Value |
|-----------|-------|
| SoC | Espressif ESP32-C3 (RISC-V single core) |
| CPU | 32-bit RISC-V, up to 160 MHz |
| CPU clock (firmware) | Default (160 MHz, not downclocked in firmware) |
| Flash | 4 MB SPI Flash (QIO) |
| SRAM | 400 KB total (320 KB data + 128 KB instruction cache) |
| RTC SRAM | 8 KB (used for `g_bootCycle` counter via `RTC_DATA_ATTR`) |
| USB | Native USB 1.1 Full-Speed CDC (no external UART chip) |
| Wi-Fi | 802.11 b/g/n 2.4 GHz |
| Bluetooth | BLE 5.0 |
| GPIO voltage | 3.3 V (not 5 V tolerant) |
| Onboard LDO | AMS1117-3.3 powered from VBUS (5 V rail) |
| Operating voltage | 3.0–3.6 V (3.3 V nominal) |
| Supply input | VBUS: 4.5–5.5 V (from TP4056 OUT+) |
| Deep sleep current | ~10 µA (MCU only, excluding RA-02) |
| Package | Castellated module, 22.5 × 18 mm |

**RTC memory usage**: The firmware stores `g_bootCycle` (uint32_t) in RTC memory so the boot cycle counter persists across deep-sleep wakeups without hitting NVS write wear.

### 3.2 RF Transceiver — AI-Thinker RA-02 (SX1276)

| Parameter | Value |
|-----------|-------|
| IC | Semtech SX1276 |
| Frequency range | 137–1020 MHz (SX1276 spec); module tuned for 433 MHz |
| Modulation used | OOK (On-Off Keying) / CW via RadioLib |
| TX output power | +2 to +17 dBm (RFO pin, firmware default: 17 dBm) |
| TX output power (PA_BOOST variant) | up to +20 dBm (module-dependent) |
| Frequency configured in firmware | 433.500 MHz (default); configurable 137–1020 MHz |
| FSK init params | 1.2 kbps bitrate, 5.0 kHz deviation, 125 kHz RxBw, 16 preamble |
| OOK mode | Enabled via `radio.setOOK(true)` after FSK init |
| CW keying | `radio.transmitDirect()` = carrier ON, `radio.standby()` = carrier OFF |
| Supply voltage | 3.3 V (max 3.6 V — do NOT connect to 5 V) |
| Interface | SPI (up to 10 MHz) |
| Module size | 17 × 16 mm |
| Crystal | TCXO included on module |
| Antenna connector | U.FL + spring antenna (17.3 cm wire also acceptable) |
| Sleep current (radio.sleep()) | ~0.2 µA (SX1276 datasheet) |

**Why FSK init before OOK?** RadioLib requires initializing the SX1276 in FSK mode first to configure the baseband before switching to OOK via `setOOK(true)`. The FSK parameters (bitrate, deviation, bandwidth) are irrelevant once OOK mode is active — only frequency and output power matter for CW transmission.

### 3.3 Power System — TP4056 + 18650

| Parameter | Value |
|-----------|-------|
| Charge controller | TP4056 (single-cell Li-ion/LiPo) |
| Protection IC | DW01A (over-discharge, over-charge, short circuit) |
| Charge input | USB-C (5 V) |
| Charge current | 1A (typical TP4056 module, resistor-configurable) |
| Full charge voltage | 4.2 V |
| Under-voltage cutoff | ~2.5 V (DW01A) |
| Battery recommended | 18650 Li-ion 3.7 V, ≥2000 mAh |
| Battery alternative | 14500 AA-size Li-ion 3.7 V (smaller capacity) |
| Battery cold-weather note | LiFePO4 (3.2 V nominal) preferred for sub-zero use; 3× cost |
| Output rail | TP4056 OUT+ → ESP32-C3 VBUS → AMS1117-3.3 → 3.3 V |

**Power path**: Battery → TP4056 (protection + regulation bypass) → VBUS (ESP32-C3) → AMS1117-3.3 LDO → 3.3 V rail → ESP32-C3 core + RA-02 VCC.

### 3.4 Antenna

| Parameter | Value |
|-----------|-------|
| Type | ¼-wave monopole (wire antenna) |
| Frequency | 433 MHz |
| Length | **17.3 cm** (= 300 / (433 × 4) × 1000 mm ≈ 173 mm) |
| Construction | Any insulated or bare wire, soldered directly to RA-02 ANT pad |
| Alternative | Spring antenna included with RA-02 module |
| Impedance | ~50 Ω (unbalanced, no ground plane correction applied) |
| Gain | ~2.1 dBi (theoretical monopole over ground plane) |
| Notes | A ground plane (radials or PCB copper pour) improves performance. For search-and-rescue use, orient antenna vertically. |

### 3.5 Passive Components & Peripherals

| Ref | Value | Function |
|-----|-------|----------|
| C1 | 100 µF 10 V electrolytic (or 47 µF X7R ceramic for cold) | Bulk decoupling on 3.3 V rail — prevents voltage sag on TX bursts |
| C2 | 100 nF ceramic 0805 | Local decoupling near RA-02 VCC pin |
| R1 | 10 kΩ 0805 | RST pull-up (RA-02 RST pin to 3.3 V) |
| R2 | 330 Ω 0805 | LED current limiting: (3.3 V − 2.0 V) / 330 Ω ≈ 3.9 mA |
| D1 | Red LED 3mm | Status indicator driven from GPIO8 |
| SW1 | Tactile 6×6mm | BOOT button — GPIO9 to GND, active LOW, triggers config mode |

---

## 4. Complete Bill of Materials

| Ref | Part | Vendor | ~Cost USD | Notes |
|-----|------|--------|:---------:|-------|
| U1 | ESP32-C3 SuperMini | AliExpress / LCSC | $1.50 | Built-in LDO + USB-CDC |
| U2 | AI-Thinker RA-02 (SX1276) 433 MHz | AliExpress / LCSC | $2.50 | TCXO + matching network + spring ant. |
| B1 | 18650 Li-ion 3.7 V ≥2000 mAh | AliExpress | $1.50 | LiFePO4 for cold: ~$4.50 |
| IC1 | TP4056 USB-C module with DW01A | AliExpress | $0.50 | Charging + protection included |
| SW1 | Tactile switch 6×6mm | LCSC / AliExpress | $0.05 | BOOT button |
| C1 | 100 µF 10 V electrolytic | LCSC | $0.05 | Or 47 µF X7R ceramic (cold weather) |
| C2 | 100 nF 0805 ceramic | LCSC | $0.02 | Decoupling |
| R1 | 10 kΩ 0805 | LCSC | $0.01 | RST pull-up |
| R2 | 330 Ω 0805 | LCSC | $0.01 | LED limiter |
| D1 | Red LED 3mm | LCSC / AliExpress | $0.05 | Status |
| ANT | 17.3 cm hookup wire | — | $0.00 | Free — any wire |
| BOX | Hammond 1551 (60×35×20 mm) | Mouser / RS | $1.50 | Or 3D-print PLA at ~$0.30 |
| **TOTAL** | | | **~$8–10 USD** | |

---

## 5. Pin Assignment & Wiring

### 5.1 SPI Bus — ESP32-C3 to RA-02

The firmware uses `SPIClass lora_spi(HSPI)` to configure a non-default SPI bus on the ESP32-C3, since the default SPI pins conflict with the SuperMini's onboard peripherals.

| Signal | RA-02 Pin | ESP32-C3 GPIO | Direction | Notes |
|--------|-----------|:-------------:|-----------|-------|
| VCC | VCC | 3V3 | Power | **MAX 3.6 V — never connect to VBUS/5 V** |
| GND | GND | GND | Power | Common ground — connect all grounds together |
| SPI Clock | SCK | **GPIO 4** | MCU → RA-02 | HSPI CLK |
| SPI MOSI | MOSI | **GPIO 6** | MCU → RA-02 | HSPI MOSI |
| SPI MISO | MISO | **GPIO 5** | RA-02 → MCU | HSPI MISO |
| Chip Select | NSS/CS | **GPIO 7** | MCU → RA-02 | Active LOW; pulled HIGH when idle |
| Reset | RESET | **GPIO 3** | MCU → RA-02 | Active LOW; R1 (10 kΩ) pulls to 3.3 V |
| IRQ | DIO0 | **GPIO 2** | RA-02 → MCU | TX/RX Done interrupt |
| (unused) | DIO1 | N/C | — | Not required for OOK/CW mode |
| Antenna | ANT | — | RF out | 17.3 cm wire or spring antenna |

### 5.2 Control Signals

| Signal | GPIO | Direction | Notes |
|--------|:----:|-----------|-------|
| LED anode | **GPIO 8** | MCU → LED | Through R2 (330 Ω) to GND. Active HIGH = LED on. |
| BOOT button | **GPIO 9** | Input | `INPUT_PULLUP`. Button shorts GPIO9 to GND. |

### 5.3 Power Wiring

```
USB-C cable ──► TP4056 USB-C IN (5V)
                    │
              TP4056 BAT+ ◄──► 18650 (+)
              TP4056 BAT- ◄──► 18650 (-)
                    │
              TP4056 OUT+ ──► ESP32-C3 VBUS (5V rail)
                               │
                         AMS1117-3.3 LDO
                               │
                            3.3 V ──► RA-02 VCC
                                  ──► C1, C2
                                  ──► R2 → LED → GPIO8
```

> ⚠️ **Critical**: RA-02 VCC must be connected to the **3.3 V** output of the AMS1117, not to VBUS (5 V). Applying 5 V to the SX1276 will destroy it permanently.

### 5.4 Peripheral Wiring

```
ESP32-C3 GPIO8 ──── R2 (330 Ω) ──── D1 (LED anode)
                                     D1 (cathode) ──── GND

ESP32-C3 GPIO9 ──── SW1 (one leg)
                    SW1 (other leg) ──── GND
```

---

## 6. Firmware Architecture

### 6.1 Boot Sequence & State Machine

The Arduino `setup()` function is the only entry point — it is called both on cold boot and after every deep-sleep wakeup. `loop()` is never reached under normal operation. If `loop()` is reached (indicating a software fault), the firmware logs an error and calls `ESP.restart()`.

**setup() sequence:**

1. `Serial.begin(115200)` + 150 ms settle (USB-CDC enumeration delay for ESP32-C3)
2. `debugBanner()` — prints ASCII art boot banner over Serial
3. `g_bootCycle++` — increment RTC memory counter (survives deep sleep)
4. Log: reset reason, free heap, CPU frequency, flash size
5. `pinMode(PIN_LED, OUTPUT)` + `pinMode(PIN_BOOT, INPUT_PULLUP)`
6. `blinkLed(2, 80)` — startup visual confirmation (2 quick blinks)
7. `loadConfig()` — read NVS, inject defaults if empty
8. BOOT button check: `digitalRead(PIN_BOOT) == LOW` with 100 ms debounce
   - If held: `runConfigMode()` — blocks until reboot
   - If not held: `runBeaconMode()` — transmits then deep-sleeps (never returns)

### 6.2 NVS Configuration System

Configuration is persisted using the ESP32 `Preferences` library (a wrapper over NVS — Non-Volatile Storage in flash). The NVS namespace is `"aegis"`.

**NVS key map:**

| Key | Type | Meaning | Default |
|-----|------|---------|---------|
| `fcount` | `uint8_t` | Number of frequencies stored | — (0 = use default) |
| `f0`…`f9` | `float` | Frequency in MHz for slot N | 433.500 |
| `msg` | `String` | Morse message text | `"SOS"` |
| `wpm` | `uint8_t` | Words per minute | 13 |
| `pwr` | `int8_t` | TX power in dBm | 17 |
| `sleep` | `uint32_t` | Sleep interval in seconds | 10 |

**loadConfig() logic:**

```
prefs.begin("aegis", readonly=true)
if fcount == 0 or > MAX_FREQUENCIES:
    → inject hardcoded defaults (LOG_WARN "NVS empty or corrupt")
else:
    → load fcount frequencies from f0…fN keys
load msg, wpm, pwr, sleep with per-field defaults if key absent
prefs.end()
```

**saveConfig() logic (triggered by HTTP POST /save):**

```
prefs.begin("aegis", readonly=false)
write fcount, f0…fN, msg, wpm, pwr, sleep
prefs.end()
→ ESP.restart() after 1500 ms (reboot into beacon mode)
```

**NVS wear**: NVS uses flash page wear leveling. At typical use (one save per field configuration session), NVS lifetime far exceeds the device lifetime. The `g_bootCycle` counter in RTC SRAM avoids NVS writes on every deep-sleep wake.

### 6.3 Radio Initialization — OOK Mode

```cpp
bool initRadio(float freqMHz, int8_t powerDbm)
```

**Step-by-step:**

1. `lora_spi.begin(SCK=4, MISO=5, MOSI=6, CS=7)` — configure HSPI with non-default pins
2. `radio.beginFSK(freqMHz, br=1.2, fDev=5.0, rxBw=125.0, power=powerDbm, preamble=16, OOK=false)` — initialize SX1276 baseband in FSK mode (required before OOK)
3. Check `state == RADIOLIB_ERR_NONE` — if not, log error with GPIO pinout hint and return `false`
4. `radio.setOOK(true)` — switch SX1276 to OOK modulation (sets `RegModemConfig` `OokModulationType`)
5. `radio.setOutputPower(powerDbm)` — set PA level (2–17 dBm on RFO, up to 20 dBm on PA_BOOST)
6. Return `true` on success

**Failure handling**: If `beginFSK` returns `RADIOLIB_ERR_CHIP_NOT_FOUND` (code `-2`), SPI wiring is wrong. If it returns `-7`, the SPI clock is not reaching the RA-02 (check solder joints). The function returns `false` and the outer loop calls `blinkLed(5, 50)` (rapid error blink) and skips that frequency.

### 6.4 Morse Code Engine

The firmware implements a complete ITU/PARIS-standard Morse encoder with precise timing.

**Morse lookup table** (`MORSE_TABLE[]`):

- Indices 0–25: A–Z (e.g., index 0 = `".-"` for A)
- Indices 26–35: 0–9 (e.g., index 26 = `"-----"` for 0)
- Space character: triggers word gap delay, no RF transmission

**Timing formulas (PARIS standard)**:

```
dot duration    = 1200 / WPM  [ms]
dash duration   = dot × 3     [ms]
intra-char gap  = dot × 1     [ms]   (between elements of same character)
inter-char gap  = dot × 3     [ms]   (between characters)
word gap        = dot × 7     [ms]   (between words)
```

**At default 13 WPM:**

| Element | Duration |
|---------|----------|
| Dot | 92 ms |
| Dash | 276 ms |
| Intra-character gap | 92 ms |
| Inter-character gap | 276 ms |
| Word gap | 646 ms |

**transmitMorseChar(char c, int charIndex):**

1. Convert to uppercase
2. Look up pattern in `MORSE_TABLE`
3. For each element in pattern:
   - `txOn()` → `radio.transmitDirect()` → carrier ON for dot/dash duration
   - `txOff()` → `radio.standby()` → carrier OFF
   - If not last element: intra-char gap delay
4. Inter-char gap delay after full character

**transmitMessage(const char\* msg):**

- Iterates over message string
- Toggles LED on each character (visual heartbeat: GPIO8 HIGH/LOW alternating per character)
- Calls `transmitMorseChar()` for each character
- Logs total TX time

**"SOS" timing example at 13 WPM:**

```
S  →  ...  (dot 92ms, gap 92ms, dot 92ms, gap 92ms, dot 92ms) + inter-char 276ms
O  →  ---  (dash 276ms, gap 92ms, dash 276ms, gap 92ms, dash 276ms) + inter-char 276ms
S  →  ...  (dot 92ms, gap 92ms, dot 92ms, gap 92ms, dot 92ms) + inter-char 276ms
Total "SOS" ≈ 2730 ms at 13 WPM
```

### 6.5 Deep Sleep & Wake Cycle

After completing one full beacon cycle (all frequencies transmitted), the firmware enters ESP32-C3 deep sleep:

```cpp
uint64_t sleepUs = (uint64_t)cfg.sleepSec * 1000000ULL;
digitalWrite(PIN_LED, LOW);
esp_deep_sleep(sleepUs);
// Never reaches here
```

Before sleeping:
1. `radio.sleep()` — puts SX1276 in sleep mode (~0.2 µA)
2. `Serial.flush()` — ensures last log lines are flushed to USB-CDC before sleep
3. LED turned off

On wake: deep sleep wake restarts execution from `setup()`, not from where it left off. The `g_bootCycle` counter in RTC SRAM is incremented each boot to track the number of TX cycles since power-on.

**Wake source**: Timer only (`esp_deep_sleep(us)`). No external interrupt wake is configured.

### 6.6 Configuration Mode — Wi-Fi Captive Portal

Triggered by holding the BOOT button (GPIO9 LOW) at power-on. The firmware:

1. `blinkLed(3, 200)` — triple slow blink as visual confirmation
2. `WiFi.mode(WIFI_AP)` + `WiFi.softAP("AegisBeacon-Config")`
3. Static IP: `192.168.4.1 / 255.255.255.0`
4. DNS server on port 53: all queries → `192.168.4.1` (captive portal trick)
5. HTTP server on port 80 — serves the dashboard HTML from PROGMEM
6. Event loop: `dns.processNextRequest()` + `server.handleClient()` per iteration
7. LED heartbeat: `digitalWrite(PIN_LED, (millis() / 500) % 2)` — 1 Hz blink
8. Heartbeat log every 30 seconds: remaining time + connected station count
9. **Timeout**: 5 minutes (`CONFIG_TIMEOUT_MS = 300000`) — then `ESP.restart()` → beacon mode

**Dashboard HTML**: Embedded in PROGMEM (`const char DASHBOARD_HTML[] PROGMEM`) to avoid consuming SRAM. Uses Google Fonts (Share Tech Mono + Orbitron) loaded from CDN, dark cyber-aesthetic theme with CSS variables, responsive grid layout.

**Dashboard features**:
- Message textarea with live Morse preview (JS Morse encoder in browser)
- Multi-frequency list manager (add/remove up to 10 frequencies, 137–1020 MHz)
- WPM slider (5–30 WPM) with live value display
- TX power slider (2–17 dBm)
- Sleep interval numeric input (1–3600 s)
- "Transmit Test" button: calls `/test` endpoint, triggers live SOS on first configured frequency
- SAVE button: POSTs JSON to `/save`, triggers NVS write + reboot

### 6.7 Web Server API Endpoints

| Method | Path | Handler | Description |
|--------|------|---------|-------------|
| GET | `/` | `handleRoot()` | Serves dashboard HTML from PROGMEM |
| GET | `/config` | `handleConfig()` | Returns current config as JSON |
| POST | `/save` | `handleSave()` | Receives new config JSON, validates, saves to NVS, reboots |
| GET | `/test` | `handleTest()` | Transmits one SOS on first frequency (live RF test) |
| ANY | `/*` | `handleNotFound()` | 302 redirect to `http://192.168.4.1` (captive portal) |

**GET /config response example:**
```json
{
  "wpm": 13,
  "power": 17,
  "sleep": 10,
  "message": "SOS",
  "freqs": [433.500]
}
```

**POST /save request body:**
```json
{
  "message": "SOS MY COORDS ARE 46N 12E",
  "wpm": 10,
  "power": 17,
  "sleep": 15,
  "freqs": [433.500, 433.775, 434.150]
}
```

**Validation applied in handleSave():**
- `wpm`: constrained to [5, 30]
- `power`: constrained to [2, 17]
- `sleep`: constrained to [1, 3600]
- Frequencies: accepted if in range [137.0, 1020.0] MHz; out-of-range values are logged and rejected
- If no valid frequencies remain after filtering: falls back to default 433.500 MHz

**ArduinoJson usage**: `StaticJsonDocument<1024>` used for POST body parsing. This reserves 1024 bytes on the stack — adequate for the maximum payload size (10 frequencies × ~8 bytes + overhead ≈ ~200 bytes).

### 6.8 Debug & Logging System

All debug output is sent to `Serial` (USB-CDC) at **115200 baud, 8N1**. ANSI colour escape codes are used for terminal colouring.

**Macro definitions:**

```cpp
#define LOG_INFO(fmt, ...)   Serial.printf(ANSI_CYAN   "[%7lu][INFO ] " fmt "\n", millis(), ##__VA_ARGS__)
#define LOG_OK(fmt, ...)     Serial.printf(ANSI_GREEN  "[%7lu][OK   ] " fmt "\n", millis(), ##__VA_ARGS__)
#define LOG_WARN(fmt, ...)   Serial.printf(ANSI_YELLOW "[%7lu][WARN ] " fmt "\n", millis(), ##__VA_ARGS__)
#define LOG_ERR(fmt, ...)    Serial.printf(ANSI_RED    "[%7lu][ERROR] " fmt "\n", millis(), ##__VA_ARGS__)
#define LOG_SECTION(name)    Serial.printf(ANSI_BOLD   "\n── " name " ──\n")
```

**Verbose macros** (compiled out when `DEBUG_VERBOSE 0`):

```cpp
#define LOG_MORSE(fmt, ...)  // per-symbol Morse timing log
#define LOG_RF(fmt, ...)     // RadioLib return codes, SPI register access
```

**ANSI colour map:**

| Constant | ANSI Code | Colour | Used for |
|----------|-----------|--------|----------|
| `ANSI_CYAN` | `\033[36m` | Cyan | INFO messages |
| `ANSI_GREEN` | `\033[32m` | Green | OK messages |
| `ANSI_YELLOW` | `\033[33m` | Yellow | WARN messages |
| `ANSI_RED` | `\033[31m` | Red | ERROR messages |
| `ANSI_GRAY` | `\033[90m` | Dark gray | MORSE/RF verbose |
| `ANSI_BOLD` | `\033[1m` | Bold | Section headers |

**Timestamp**: All log lines include `millis()` (ms since boot) as a 7-digit field, enabling precise timing analysis.

---

## 7. RF & Signal Specifications

### 7.1 Modulation

**OOK (On-Off Keying)** is the simplest form of amplitude modulation: the RF carrier is either fully ON (transmitting at configured power) or fully OFF (suppressed). This is electrically equivalent to CW (Continuous Wave) keying used in classic Morse radio.

**Why OOK?**
- Detectable by any AM-mode receiver (no special decoder needed)
- Supported natively by the SX1276 via `setOOK(true)` + `transmitDirect()` / `standby()`
- Minimal firmware complexity — no packet framing, FEC, or spreading factor
- Audible to human operators on any SDR or scanner in AM mode

**SX1276 OOK implementation**: After `beginFSK()` configures the baseband, `setOOK(true)` sets the `OokModulationType` bits in `RegModemConfig2`. `transmitDirect()` puts the SX1276 in continuous TX mode (carrier ON). `standby()` exits TX mode (carrier OFF). The transition time between ON and OFF is governed by the SX1276 PA ramp time (configurable, default ~40 µs — negligible vs. dot duration of 92 ms at 13 WPM).

### 7.2 Frequency Plan

| Parameter | Value |
|-----------|-------|
| Default frequency | 433.500 MHz |
| Band | 433–434 MHz (EU ISM 433.050–434.790 MHz) |
| SX1276 tunable range | 137–1020 MHz |
| Max frequencies per cycle | 10 |
| Inter-frequency guard delay | 50 ms |
| Frequency step resolution | RadioLib / SX1276: ~61 Hz resolution |

**Common frequencies (shown in dashboard):**
- `433.500 MHz` — EU ISM band center
- `915.000 MHz` — US ISM band (SX1276 supports this with different module variant)
- `121.500 MHz` — International aviation distress (requires appropriate module)

> ⚠️ Always verify that your country's regulations permit transmission on the selected frequency at the configured power level.

### 7.3 Morse Timing (PARIS Standard)

The PARIS standard defines the word "PARIS" as exactly 50 dot-units long and is the basis for calculating WPM timing.

```
1 dot unit = 1200 / WPM  [milliseconds]
```

**Full timing table at common WPM values:**

| WPM | Dot (ms) | Dash (ms) | Intra-char (ms) | Inter-char (ms) | Word gap (ms) | "SOS" duration (ms) |
|-----|:--------:|:---------:|:---------------:|:---------------:|:-------------:|:-------------------:|
| 5 | 240 | 720 | 240 | 720 | 1680 | 7080 |
| 8 | 150 | 450 | 150 | 450 | 1050 | 4425 |
| 10 | 120 | 360 | 120 | 360 | 840 | 3540 |
| **13** | **92** | **276** | **92** | **276** | **646** | **~2730** |
| 15 | 80 | 240 | 80 | 240 | 560 | 2370 |
| 20 | 60 | 180 | 60 | 180 | 420 | 1770 |
| 25 | 48 | 144 | 48 | 144 | 336 | 1416 |
| 30 | 40 | 120 | 40 | 120 | 280 | 1180 |

**Morse alphabet implemented (A–Z):**

| Letter | Code | Letter | Code | Letter | Code |
|--------|------|--------|------|--------|------|
| A | `.-` | J | `.---` | S | `...` |
| B | `-...` | K | `-.-` | T | `-` |
| C | `-.-.` | L | `.-..` | U | `..-` |
| D | `-..` | M | `--` | V | `...-` |
| E | `.` | N | `-.` | W | `.--` |
| F | `..-.` | O | `---` | X | `-..-` |
| G | `--.` | P | `.--.` | Y | `-.--` |
| H | `....` | Q | `--.-` | Z | `--..` |
| I | `..` | R | `.-.` | | |

**Digits 0–9:**

| Digit | Code | Digit | Code |
|-------|------|-------|------|
| 0 | `-----` | 5 | `.....` |
| 1 | `.----` | 6 | `-....` |
| 2 | `..---` | 7 | `--...` |
| 3 | `...--` | 8 | `---..` |
| 4 | `....-` | 9 | `----.` |

### 7.4 Transmission Duty Cycle & Battery Life

**TX cycle timeline (default settings: "SOS", 13 WPM, 1 frequency, 10 s sleep):**

```
[Boot ~150ms][Config load ~50ms][Radio init ~80ms][TX "SOS" ~2730ms][Sleep 10000ms]
Total cycle period ≈ 13 seconds
TX active time ≈ 2730 ms
Duty cycle ≈ 21%
```

**Multi-frequency cycle (3 frequencies):**

```
TX "SOS" on freq 1 → 50ms guard → TX "SOS" on freq 2 → 50ms guard → TX "SOS" on freq 3
TX active ≈ 3 × 2730 ms + 2 × 50 ms = 8290 ms per cycle
```

---

## 8. Configuration Parameters Reference

### 8.1 Firmware Compile-Time Constants

These are defined as `#define` macros in the sketch and require recompilation to change.

| Constant | Default | Description |
|----------|---------|-------------|
| `DEBUG_VERBOSE` | `0` | `1` = enable per-symbol Morse and RF verbose log |
| `DEFAULT_FREQ_MHZ` | `433.500f` | Default frequency if NVS empty |
| `DEFAULT_MESSAGE` | `"SOS"` | Default Morse message if NVS empty |
| `DEFAULT_WPM` | `13` | Default words per minute |
| `DEFAULT_POWER_DBM` | `17` | Default TX power in dBm |
| `DEFAULT_SLEEP_SEC` | `10` | Default sleep between TX cycles (seconds) |
| `MAX_FREQUENCIES` | `10` | Maximum number of frequencies in the list |
| `MAX_MESSAGE_LEN` | `64` | Maximum message length (including null terminator) |
| `CONFIG_TIMEOUT_MS` | `300000` | Config mode auto-timeout (5 minutes) |
| `AP_SSID` | `"AegisBeacon-Config"` | Wi-Fi AP network name in config mode |
| `AP_IP` | `"192.168.4.1"` | Static IP for config portal |
| `PIN_LORA_CS` | `7` | SPI chip select GPIO |
| `PIN_LORA_RST` | `3` | RA-02 reset GPIO |
| `PIN_LORA_DIO0` | `2` | RA-02 IRQ GPIO |
| `PIN_SPI_SCK` | `4` | SPI clock GPIO |
| `PIN_SPI_MISO` | `5` | SPI MISO GPIO |
| `PIN_SPI_MOSI` | `6` | SPI MOSI GPIO |
| `PIN_LED` | `8` | Status LED GPIO |
| `PIN_BOOT` | `9` | BOOT button GPIO |

### 8.2 Runtime Configuration (NVS)

These parameters are set via the captive portal and persist across power cycles.

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `message` | string | 1–63 chars, A-Z 0-9 space | `"SOS"` | Morse message to transmit |
| `freqs[]` | float[] | 137.0–1020.0 MHz, up to 10 | `[433.500]` | Transmission frequencies |
| `wpm` | uint8 | 5–30 | 13 | Morse words per minute |
| `powerDbm` | int8 | 2–17 | 17 | SX1276 output power |
| `sleepSec` | uint32 | 1–3600 | 10 | Deep sleep between TX cycles |

---

## 9. Power Analysis

### 9.1 Current Consumption by Mode

| Mode | Component | Current | Notes |
|------|-----------|--------:|-------|
| **Deep sleep** | ESP32-C3 | ~10 µA | RTC memory active, timer running |
| **Deep sleep** | SX1276 | ~0.2 µA | `radio.sleep()` called before sleep |
| **Deep sleep** | TP4056 | ~1–2 µA | Quiescent |
| **Deep sleep total** | All | **~12 µA** | |
| **Active (no TX)** | ESP32-C3 | ~50–80 mA | CPU active, peripherals on |
| **TX (17 dBm)** | RA-02 (SX1276) | ~120 mA | OOK carrier on |
| **TX (17 dBm)** | ESP32-C3 | ~50 mA | Wi-Fi/BT already disabled |
| **TX (17 dBm) total** | All | **~170 mA** | |
| **Config mode (Wi-Fi AP)** | ESP32-C3 + Wi-Fi | ~200–280 mA | Wi-Fi TX on; RA-02 idle |

### 9.2 Battery Life Estimation

Calculation model (default settings: "SOS" 13 WPM, 1 freq, 10 s sleep, 17 dBm, 2000 mAh 18650):

```
TX active time per cycle:   ≈ 2730 ms = 2.73 s
Boot/init time per cycle:   ≈ 280 ms = 0.28 s
Active time per cycle:      ≈ 3.01 s  @ ~170 mA average
Sleep time per cycle:       ≈ 10 s    @ ~0.012 mA

Charge per cycle:
  Active: 170 mA × 3.01 s / 3600 = 0.1421 mAh
  Sleep:  0.012 mA × 10 s / 3600 = 0.0000333 mAh
  Total:  ≈ 0.1422 mAh per cycle

Cycles per mAh:  1 / 0.1422 ≈ 7.03 cycles/mAh
Battery life:    2000 mAh × 7.03 ≈ 14,060 cycles
                 14,060 × 13 s / 3600 ≈ 50.8 hours ≈ ~51 hours (~2 days)
```

**Battery life at various sleep intervals (2000 mAh, "SOS" 13 WPM, 17 dBm):**

| Sleep interval | Approx. battery life |
|:--------------:|:-------------------:|
| 5 s | ~30 hours |
| 10 s | ~51 hours |
| 30 s | ~110 hours (~4.5 days) |
| 60 s | ~180 hours (~7.5 days) |
| 120 s | ~310 hours (~13 days) |
| 300 s | ~680 hours (~28 days) |

> Note: These are theoretical estimates assuming a fixed 3.7 V supply and 100% battery capacity. Real-world values will be lower due to LDO inefficiency, cold temperature, battery aging, and the AMS1117 dropout voltage.

### 9.3 Cold-Weather Considerations

- **Li-ion (18650)**: Capacity drops significantly below 0°C — expect 60–70% capacity at −10°C, 30–40% at −20°C. Internal resistance increases, causing voltage sag under load (TX peak current ~170 mA).
- **LiFePO4 (14500 or 18650)**: Better cold performance; retains ~80% capacity at −20°C. Recommended for alpine/avalanche use despite 3× cost.
- **Ceramic capacitors**: The firmware BOM notes X7R ceramic for C1 (vs. electrolytic) as the preferred choice for cold weather — electrolytic capacitors lose capacitance at low temperature.
- **Voltage sag**: At cold temperatures, battery voltage sags more under the TX load. The `C1` bulk capacitor (100 µF) helps absorb TX current spikes and prevent brownout resets.

---

## 10. Software Dependencies

| Library | Version | Author | Purpose |
|---------|---------|--------|---------|
| `RadioLib` | ≥ 6.0 (firmware uses ≥ 6.6 in platformio.ini) | Jan Gromes | SX1276 FSK/OOK init, TX control, sleep |
| `ArduinoJson` | ≥ 7.0 | Benoît Blanchon | HTTP POST `/save` JSON body parsing |
| `Preferences` | Built-in (ESP32 Arduino) | Espressif | NVS config persistence |
| `WiFi` | Built-in (ESP32 Arduino) | Espressif | Wi-Fi AP for config mode |
| `DNSServer` | Built-in (ESP32 Arduino) | Espressif | Captive portal DNS redirect |
| `WebServer` | Built-in (ESP32 Arduino) | Espressif | HTTP server for config dashboard |
| `Arduino.h` | Built-in | Arduino / Espressif | Core framework |

**PlatformIO `lib_deps`:**
```ini
lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
```

**Arduino IDE**: Install `RadioLib` and `ArduinoJson` from Library Manager. All other dependencies are part of the ESP32 board package.

---

## 11. Build & Flash Instructions

### 11.1 Arduino IDE

1. Install Arduino IDE 2.x from [arduino.cc](https://www.arduino.cc/en/software)
2. Add ESP32 board support:
   - File → Preferences → Additional board manager URLs:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → Install "esp32 by Espressif Systems" (≥ 2.0)
3. Install libraries:
   - Sketch → Include Library → Manage Libraries
   - Search and install: `RadioLib` (Jan Gromes, ≥ 6.0)
   - Search and install: `ArduinoJson` (Benoît Blanchon, ≥ 7.0)
4. Select board: **Tools → Board → ESP32C3 Dev Module**
5. Select port: your ESP32-C3 USB-CDC port
6. Open `AegisBeacon.ino`
7. Click **Upload** (Ctrl+U)

### 11.2 PlatformIO

**`platformio.ini`:**
```ini
[env:aegis-beacon]
platform = espressif32
board = esp32-c3-devkitm-1
framework = arduino
monitor_speed = 115200
lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
```

```bash
# Build
pio run

# Upload
pio run --target upload

# Monitor serial (115200 baud)
pio device monitor --baud 115200

# Build + upload + monitor in one command
pio run --target upload && pio device monitor --baud 115200
```

---

## 12. Serial Debug Reference

Open any serial terminal at **115200 baud, 8N1**:

- **Linux/Mac**: `picocom -b 115200 /dev/ttyUSB0` or `screen /dev/ttyUSB0 115200`
- **Windows**: PuTTY → Serial → COM port → 115200
- **VS Code**: Serial Monitor extension (supports ANSI colours)
- **Arduino IDE**: Built-in Serial Monitor (ANSI colours not shown)

### 12.1 Log Level Tags

| Tag | Colour | Meaning | Always shown? |
|-----|--------|---------|:-------------:|
| `[INFO ]` | Cyan | Normal operation milestone | ✅ |
| `[OK   ]` | Green | Operation succeeded | ✅ |
| `[WARN ]` | Yellow | Non-fatal anomaly | ✅ |
| `[ERROR]` | Red | Hardware/software failure | ✅ |
| `[MORSE]` | Dark gray | Per dot/dash symbol log | Only if `DEBUG_VERBOSE 1` |
| `[RF   ]` | Dark gray | RadioLib return codes | Only if `DEBUG_VERBOSE 1` |

### 12.2 Healthy Boot Sequence

```
╔══════════════════════════════════════════════════════╗
║       AEGIS-BEACON v1.0  — BOOT                      ║
║   ESP32-C3 SuperMini + RA-02 SX1276  OOK/CW Beacon   ║
╚══════════════════════════════════════════════════════╝

[    150][INFO ] Boot cycle #1
[    151][INFO ] Reset reason: 1
[    152][INFO ] Free heap   : 298240 bytes
[    153][INFO ] CPU freq    : 160 MHz
[    154][INFO ] Flash size  : 4194304 bytes
────────────────────────────────────────
── NVS CONFIG LOAD ──
[    160][WARN ] NVS empty or corrupt — using hardcoded defaults
────────────── ACTIVE CONFIG ──────────────
[    161][INFO ] Message  : "SOS"
[    162][INFO ] WPM      : 13  (dot=92 ms, dash=276 ms)
[    163][INFO ] Power    : 17 dBm
[    164][INFO ] Sleep    : 10 sec
[    165][INFO ] Freq cnt : 1
[    166][INFO ]   [0] 433.500 MHz
────────────────────────────────────────
[    170][INFO ] Checking BOOT button (GPIO9)...
[    170][INFO ] BOOT button not held — beacon mode

── BEACON MODE ──
[    175][INFO ] Boot cycle  : #1
[    176][INFO ] Message     : "SOS"
[    177][INFO ] Frequencies : 1
[    178][INFO ] WPM         : 13  (dot=92 ms, dash=276 ms)
[    179][INFO ] Power       : 17 dBm
[    180][INFO ] Sleep after : 10 sec
[    185][INFO ] Disabling WiFi + Bluetooth stacks...
[    210][OK   ] RF radios (WiFi/BT) disabled
────────────────────────────────────────
[    215][INFO ] Frequency hop 1/1 → 433.500 MHz
[    295][OK   ] Radio ready — 433.500 MHz, 17 dBm, OOK/CW
[    296][INFO ] TX START: "SOS" @ 13 WPM (dot=92 ms)
[   3026][OK   ] TX DONE: 3 chars in 2730 ms (2.7 sec)
[   3028][OK   ] SX1276 in sleep mode
[   3029][OK   ] Full TX cycle done in 2814 ms (2.81 sec)
[   3030][INFO ] Entering deep sleep for 10 seconds...
────────────── SLEEP ──────────────
```

### 12.3 Error Codes & Diagnostics

| Log message | Cause | Fix |
|-------------|-------|-----|
| `Radio beginFSK failed! Code: -2` | `RADIOLIB_ERR_CHIP_NOT_FOUND` — SX1276 not responding | Check all SPI wires (CS, SCK, MOSI, MISO, RST). Check RA-02 VCC is on 3.3V. |
| `Radio beginFSK failed! Code: -7` | SPI clock not reaching chip | Check SCK solder joint on RA-02. Check GPIO4 continuity. |
| `OOK mode failed! Code: -X` | Rare — SPI communication OK but OOK register write failed | Power cycle; check RA-02 module integrity. |
| `NVS empty or corrupt — using hardcoded defaults` | First boot or flash erase | Normal. Configure via AP mode if non-default settings needed. |
| `Rejected out-of-range freq: X MHz` | Frequency submitted via portal outside [137, 1020] MHz | Enter a valid frequency in the dashboard. |
| `loop() reached unexpectedly!` | Software fault — `runBeaconMode()` or `runConfigMode()` returned | Should never happen; device will restart automatically. |
| `Config AP timeout reached — rebooting` | 5-minute config mode timer expired without a save | Normal; device returns to beacon mode. Reconnect and save sooner. |

---

## 13. Memory Map & Resource Usage

**Flash usage (approximate, ESP32-C3 4 MB):**

| Region | Size | Contents |
|--------|-----:|---------|
| Bootloader | ~64 KB | ESP-IDF bootloader |
| Partition table | 4 KB | Arduino partition scheme |
| App partition | ~512–700 KB | Compiled firmware + PROGMEM HTML |
| NVS partition | 24 KB | Configuration key-value store |
| SPIFFS/LittleFS | not used | — |
| Free flash | ~3.2 MB | Unused |

**SRAM usage (approximate, ESP32-C3 400 KB):**

| Region | Size | Contents |
|--------|-----:|---------|
| Stack (main task) | 8 KB | Arduino main loop stack |
| Heap (startup) | ~298 KB free | ArduinoJson, WebServer, RadioLib, String objects |
| `DASHBOARD_HTML` | ~4.5 KB | PROGMEM — stored in flash, not SRAM |
| `Config` struct | 64 bytes | 10× float freqs + message + wpm/pwr/sleep |
| `StaticJsonDocument<1024>` | 1 KB | Only allocated during POST /save |
| RadioLib objects | ~1 KB | `SPIClass`, `SX1276`, `Module` |
| Web/DNS server | ~10–15 KB | `WebServer`, `DNSServer` (only in config mode) |

**RTC SRAM (8 KB):**

| Variable | Type | Size | Notes |
|----------|------|-----:|------|
| `g_bootCycle` | `uint32_t` | 4 bytes | Boot counter, survives deep sleep |

---

## 14. Regulatory & Legal Notes

- **EU 433 MHz ISM band**: EN 300 220 permits short-range devices in the 433.050–434.790 MHz band at up to +10 dBm ERP without licensing. The firmware defaults to +17 dBm conducted power; actual ERP depends on antenna gain and losses. Users must verify compliance with their national regulator.
- **EU radio equipment**: This is a hobby/DIY device. It is **not** CE marked and **not** compliant with RED (Radio Equipment Directive 2014/53/EU) as a certified product.
- **ITU avalanche beacon standard**: Professional avalanche transceivers must comply with ETSI EN 300 718. This device does **not** comply and **must not** be used as a primary safety device.
- **Amateur radio**: Some jurisdictions permit higher power levels on 433 MHz under amateur (ham) radio licenses. Consult local regulations.
- **Frequency selection**: The SX1276 can be tuned to frequencies outside the 433 MHz ISM band (e.g., aviation 121.5 MHz, MURS, GMRS). Transmission on these frequencies without authorization is illegal in most countries.

---

## 15. Design Rationale & Trade-offs

### Why ESP32-C3 SuperMini?
The SuperMini integrates everything needed: a RISC-V MCU, 4 MB flash, 3.3 V LDO, USB-CDC (no external FTDI chip), and Wi-Fi+BT — in a $1.50 package. The ESP32-C3 deep sleep current (~10 µA) is acceptable for this use case, and the Wi-Fi peripheral enables the captive portal without any additional hardware.

### Why RA-02 (SX1276) instead of a simpler 433 MHz module?
The SX1276 offers a wide frequency range (137–1020 MHz), programmable power (+2 to +20 dBm), and precise OOK control via RadioLib. Cheaper ASK/OOK-only modules (e.g., STX882) exist but have fixed or pin-configurable power, no SPI interface, and no multi-frequency capability.

### Why OOK/CW instead of LoRa?
LoRa provides better range at the same power level, but requires a LoRa-capable receiver. OOK/CW Morse is receivable by any AM-mode radio, scanner, or SDR — making it universally detectable by rescue teams with basic equipment.

### Why deep sleep instead of a continuous beacon loop?
At 17 dBm output and ~170 mA peak current, a continuous beacon would drain a 2000 mAh 18650 in ~12 hours. With 10 s sleep cycles, the same battery lasts ~51 hours — a critical difference in survival scenarios.

### Why Wi-Fi captive portal instead of BLE or USB serial config?
Wi-Fi captive portals work on any smartphone without an app — the OS automatically opens the portal page. BLE would require a dedicated app. USB serial requires a cable. In the field, the phone-based portal is the most practical approach.

### PARIS vs. FARNSWORTH timing
The firmware implements strict PARIS timing (all gaps scale with WPM). Farnsworth timing (faster character timing with extended inter-character gaps for readability) is not implemented, as the target use case prioritizes compatibility with automated decoders over human readability.

---

## 16. Revision History

| Version | Changes |
|---------|---------|
| v1.0 | Multi-frequency hopping (up to 10 frequencies), NVS config persistence, Wi-Fi captive portal with live Morse preview and test TX, ANSI colour serial log, PROGMEM HTML dashboard, RTC boot cycle counter, inter-frequency guard delay, verbose debug mode (`DEBUG_VERBOSE`). |

---

*Aegis-Beacon — MIT License — Use freely, save lives.*