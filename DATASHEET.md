<!--
 █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
-->
# DATASHEET — Aegis-Beacon v5.5

<div align="center">

### Dual-Mode Avalanche Rescue System
**Revision: 5.5 | Date: 2026 | Author: Leonardo Galli**

[![Revision](https://img.shields.io/badge/Revision-5.5.0-f97316?style=flat-square)](https://github.com/Leo-Galli/Aegis-Beacon)
[![Hardware](https://img.shields.io/badge/Hardware-ESP32_DevKit_V1-ef4444?style=flat-square)](https://www.espressif.com/)
[![Radio](https://img.shields.io/badge/Radio-SX1262_+30dBm-3b82f6?style=flat-square)](https://www.semtech.com/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-22c55e?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-0891b2?style=flat-square)](LICENSE)

</div>

---

## 1. General Description

Aegis-Beacon v5.5 is an open-source, ultra-low-cost emergency rescue beacon for avalanche survival, backcountry SAR operations, and off-grid emergency communication. The device combines a 433 MHz CW radio transmitter with a passive RSSI scanner, a 2.42" SSD1309 OLED status display, a NEO-6M GPS module, a 4-button physical control panel, a live battery monitor, and a 3.5mm audio alert output into a pocketable, battery-powered unit buildable for approximately $23–28 USD.

The firmware runs on an **ESP32 DevKit V1** (30-pin) microcontroller, controlled by the RadioLib driver stack, and exposes a WiFi captive-portal dashboard for field configuration without any additional tools. v5.5 adds a machine-readable serial protocol with commands, a cross-platform bridge script that forwards GPS fixes to the website's Report Position page, and a config dashboard that runs on default system fonts. v5.4 was a full hardware revision from v4.0 (ESP32-C3 + SX1276); all GPIO assignments, libraries, and the NVS schema have changed.

---

## 2. Absolute Maximum Ratings

| Parameter                          | Min    | Max     | Unit |
|------------------------------------|--------|---------|------|
| Supply voltage (VBUS / 5 V in)     | 4.5    | 5.5     | V    |
| SX1262 VCC                         | 1.8    | **3.6** | V    |
| GPIO voltage (ESP32 DevKit V1)     | −0.3   | 3.6     | V    |
| Operating temperature              | −20    | +60     | °C   |
| Storage temperature                | −40    | +85     | °C   |
| TX power (SX1262, RadioLib)        | −9     | **+22** | dBm  |
| TX power (E22-400M30S with PA)     | —      | **+30** | dBm  |
| OLED VCC (SSD1309)                 | 1.65   | **3.5** | V    |
| Audio output load impedance        | 16     | 600     | Ω    |
| Battery voltage divider input      | 0      | 4.5     | V    |

> [!CAUTION]
> **Never connect SX1262 VCC or OLED VCC to 5 V / VBUS — permanent damage will result.**

---

## 3. Electrical Characteristics

### 3.1 Power Supply

| Parameter                          | Typical | Unit  | Conditions                             |
|------------------------------------|---------|-------|----------------------------------------|
| Battery voltage (18650 Li-ion)     | 3.7     | V     | Nominal                                |
| ESP32 LDO input (VBUS)             | 5.0     | V     | From TP4056 OUT+                       |
| 3.3 V rail voltage                 | 3.30    | V     | AMS1117-3.3 internal LDO              |
| 3.3 V rail output current (max)    | 800     | mA    | Limited by AMS1117-3.3                |
| Battery divider quiescent current  | 0.021   | mA    | 100 kΩ + 100 kΩ @ 4.2 V               |

### 3.2 Current Consumption

| State                                  | Typical | Unit | Notes                                    |
|----------------------------------------|---------|------|------------------------------------------|
| Deep sleep (ESP32 only)               | 10      | µA   | RTC RAM active, GPIOs held               |
| BEACON TX active @ +17 dBm            | 120     | mA   | WiFi/BT disabled                         |
| SEARCH scan (RX, no TX)               | 40      | mA   | WiFi/BT disabled                         |
| CONFIG mode (WiFi AP active)           | 100     | mA   | No TX                                    |
| EMERGENCY mode (continuous TX)        | 120     | mA   | No sleep                                 |
| SSD1309 OLED (active)                  | 6       | mA   | At 3.3 V                                 |
| SSD1309 OLED (setPowerSave(1))        | 0.3     | mA   | Sleep command sent before deep sleep     |
| NEO-6M GPS (acquiring)                | 30      | mA   | Cold start                               |
| NEO-6M GPS (tracking)                 | 25      | mA   | Fix acquired                             |
| DAC1 audio output (GPIO 25)           | 2       | mA   | Into 32 Ω load, volume 180/255           |

### 3.3 Battery Life Estimates (2000 mAh 18650, 20 °C)

| Mode      | Sleep Interval | GPS | OLED | Estimated runtime |
|-----------|----------------|-----|------|-------------------|
| BEACON    | 10 s           | Off | On   | ~65 hours         |
| BEACON    | 10 s           | On  | On   | ~45 hours         |
| BEACON    | 30 s           | Off | On   | ~130 hours        |
| BEACON    | 60 s           | Off | On   | ~175 hours        |
| SEARCH    | Continuous     | Off | On   | ~44 hours         |
| EMERGENCY | Continuous     | On  | On   | ~12 hours         |

> At −20 °C, expect 40–60% of nominal capacity from standard Li-ion. Use LiFePO4 (rated to −30 °C) for alpine cold-weather deployments. Below −10 °C replace the 100 µF electrolytic bulk cap with a 47 µF X7R ceramic.

---

## 4. RF Specifications

### 4.1 Transmitter (SX1262 / Ebyte E22-400M30S)

| Parameter                    | Value          | Unit  | Notes                                         |
|------------------------------|----------------|-------|-----------------------------------------------|
| RF module                    | Ebyte E22-400M30S | —   | SX1262 or LLCC68 inside; TCXO onboard        |
| Frequency range              | 410–525        | MHz   | Hardware-limited by module filter             |
| Modulation                   | CW (FSK keying)| —     | `transmitDirect()` / `standby()` carrier keying |
| Output power range (RadioLib)| −9 to +22      | dBm   | SX1262 PA hardware limit                      |
| Output power (E22 PA)        | up to +30      | dBm   | Module onboard PA; RadioLib caps at 22 dBm    |
| Default output power         | +17            | dBm   | ~50 mW; configurable                         |
| Frequency accuracy           | ±1             | ppm   | TCXO onboard on E22 modules                   |
| Antenna interface            | SMA            | —     | External 433 MHz SMA whip recommended         |
| RX current draw              | ~5             | mA    | Better than SX1276 (~12 mA)                   |

> The SX1262 does **not** support OOK modulation. Morse keying is implemented by toggling a continuous FSK carrier via `transmitDirect()` (on) and `standby()` (off). The resulting CW signal is indistinguishable from OOK at the receiver.

> **SX1262 vs SX1276 key differences:** (1) BUSY pin is **mandatory** — must wire to GPIO 21; (2) main IRQ is **DIO1**, not DIO0; (3) RadioLib power cap is +22 dBm (E22 PA adds more externally).

### 4.2 Receiver (SEARCH mode)

| Parameter                    | Value      | Unit  | Notes                                       |
|------------------------------|------------|-------|---------------------------------------------|
| Receive mode                 | FSK RX     | —     | Used to measure RSSI per dwell window       |
| RSSI measurement range       | −120 to −40| dBm   | SX1262 internal RSSI register               |
| RSSI accuracy                | ±2         | dBm   | Typical at room temperature                 |
| Dwell time per frequency     | 50–2000    | ms    | Configurable (`scanDwellMs`)                |
| Default dwell time           | 400        | ms    |                                             |
| Detection threshold (default)| −90        | dBm   | Configurable via dashboard                  |
| Signal class WEAK            | thresh to −80 | dBm | Rising-pitch tone from 440 Hz             |
| Signal class MEDIUM          | −80 to −60 | dBm   | Higher pitch ~880 Hz                        |
| Signal class STRONG          | ≥ −60      | dBm   | Up to 2200 Hz continuous                    |
| Pitch mapping                | 440–2200   | Hz    | Linear with RSSI, metal-detector style      |
| Max simultaneous frequencies | 10         | —     | Scanned sequentially                        |
| Hit log size                 | 20         | —     | Rolling log in RTC RAM                      |

### 4.3 Antenna

| Configuration                        | Gain   | Notes                                    |
|--------------------------------------|--------|------------------------------------------|
| ¼-wave monopole, 17.3 cm wire        | ~0 dBi | Recommended                              |
| E22-400M30S SMA connector + whip     | ~2 dBi | Best option                              |
| Ground plane added (copper foil)     | +3 dBi | Copper tape or PCB foil                  |

**Frequency / Antenna length reference:**

| Frequency  | ¼-wave  | ½-wave  |
|------------|---------|---------|
| 433.5 MHz  | 17.3 cm | 34.6 cm |
| 434.0 MHz  | 17.3 cm | 34.5 cm |
| 446.0 MHz  | 16.8 cm | 33.6 cm |
| 462–477 MHz | 16.2 cm | 32.4 cm |

> The E22-400M30S module is hardware-limited to **410–525 MHz**. Frequencies outside that range (for example 868/915 MHz ISM) are not reachable by this hardware and are intentionally omitted from this reference.

**Snow penetration:** 433 MHz attenuates approximately 3 dB/m in wet snow. At +30 dBm (E22 PA), 1 m burial depth incurs ~3–9 dB signal loss — within the link budget.

---

## 5. Morse / Timing Engine

| Parameter               | Value              | Notes                               |
|-------------------------|--------------------|-------------------------------------|
| Standard                | PARIS              | 50 units = 1 word                   |
| WPM range               | 5–40               | Configurable                        |
| Default WPM             | 13                 |                                     |
| Unit duration           | `1200 / WPM` ms    | At 13 WPM: 92 ms                    |
| Dot                     | 1 unit             |                                     |
| Dash                    | 3 units            |                                     |
| Intra-character gap     | 1 unit             | Between dots/dashes in same char    |
| Inter-character gap     | 3 units            | Between letters                     |
| Word gap                | 7 units            | Space character                     |
| `SOS` duration @ 13 WPM| ~2.7 s             |                                     |
| Full payload @ 13 WPM  | ~45 s              | `SOS DE MARIO ROSSI PSN N4553 E01230` |
| Supported charset       | A–Z, 0–9, space    |                                     |
| Max message length      | 64 chars           | `MAX_MESSAGE_LEN`                   |
| Mid-TX interrupt        | Yes                | Interrupt-driven; fires between characters |

**Payload duration examples at 13 WPM:**

| Payload                                         | Duration  |
|-------------------------------------------------|-----------|
| `SOS`                                           | ~2.7 s    |
| `SOS DE MARIO ROSSI`                            | ~15 s     |
| `SOS PSN N4553 E01230`                          | ~18 s     |
| `SOS DE MARIO ROSSI PSN N4553 E01230`           | ~45 s     |

---

## 6. GPS Payload

### 6.1 Module

| Parameter         | Value        | Notes                              |
|-------------------|--------------|------------------------------------|
| Module            | NEO-6M       | UART, 9600 baud                    |
| Parser library    | TinyGPS++    | ≥ 1.0.3                            |
| UART port         | Serial2      | GPIO 22 RX, GPIO 12 TX             |
| Baud rate         | 9600         | NEO-6M factory default             |
| Fix timeout       | 60 s         | Configurable 10–120 s              |
| Minimum satellites| 3            | `GPS_MIN_SATS`                     |
| Time to first fix | 30 s (hot) / up to 3 min (cold) | |

### 6.2 Payload Format

| Configuration     | Morse payload transmitted                           |
|-------------------|-----------------------------------------------------|
| Base only         | `SOS`                                               |
| Name only         | `SOS DE MARIO ROSSI`                                |
| GPS only          | `SOS PSN N4553 E01230`                              |
| Name + GPS (full) | `SOS DE MARIO ROSSI PSN N4553 E01230`               |

**Coordinate encoding — compact DDM (Degrees + Decimal Minutes × 10):**

- `N4553` = 45° 53' N (45.883°)
- `E01230` = 12° 30' E (12.50°)
- Precision: ~0.1 arcminute (~185 m)
- Full decimal coordinates are logged to Serial at higher precision

### 6.3 Fix State Machine

| Condition                          | Payload coordinates        |
|------------------------------------|----------------------------|
| Fresh fix (< 3 s, ≥ 3 sats)        | Current fix                |
| Stale fix (RTC cache from prev boot)| Cached fix (marked stale) |
| No fix + timeout expired           | `PSN UNKN`                 |

The last known GPS fix is stored in RTC RAM (`g_rtcLat`, `g_rtcLng`, `g_rtcFixValid`) and survives deep sleep cycles.

---

## 7. Display — SSD1309 2.42" OLED

| Parameter                  | Value       | Notes                                     |
|----------------------------|-------------|-------------------------------------------|
| Module                     | SSD1309     | 2.42" 128×64 px monochrome                |
| Interface                  | Software SPI| 7-pin: GND VCC SCK SDA RES DC CS         |
| SCK                        | GPIO 15     |                                           |
| SDA (MOSI)                 | GPIO 13     |                                           |
| RESET                      | GPIO 4      |                                           |
| DC                         | GPIO 16     |                                           |
| CS                         | GPIO 17     |                                           |
| Driver library             | U8g2        | Full-frame buffer, flicker-free           |
| Refresh rate               | 120 ms      | `OLED_REFRESH_MS`                         |
| Supply voltage             | 3.3 V       | Internal boost converter to panel VCC     |
| Current (active)           | ~6 mA       |                                           |
| Current (setPowerSave(1))  | ~0.3 mA     | Sent before deep sleep                    |
| Enable/disable             | NVS toggle  | `oledEnabled`                             |
| Invert mode                | NVS toggle  | `oledInvert`                              |

> Software SPI is used deliberately so the OLED does not share the VSPI bus with the radio. Both devices can operate simultaneously. The overhead is ~2 ms per full-screen update, imperceptible at 120 ms refresh.

### 7.1 Battery Icon

A pixel-art 18×9 px battery icon appears in the top-right corner of every screen header.

| Fill level | Battery %  | Icon state                   |
|------------|------------|------------------------------|
| 4 segments | 76–100%    | Full                         |
| 3 segments | 51–75%     | Three-quarters               |
| 2 segments | 26–50%     | Half                         |
| 1 segment  | 11–25%     | Low                          |
| Blinking ! | 0–10%      | Critical — blinks every 500 ms |
| Letter C   | Charging   | `CHG` — TP4056 STDBY detected |

### 7.2 Screen Layouts

| Mode          | Content                                                                                             |
|---------------|-----------------------------------------------------------------------------------------------------|
| **BOOT**      | Inverted header "AEGIS-BEACON v5.5" · feature flags · battery icon + % · INITIALISING progress bar |
| **BEACON**    | Header "TX BEACON" + cycle# + bat icon · Large frequency (logisoso24) · GPS fix dot · Info line (CH/PWR/WPM) · TX progress bar · Payload scroll · GPS state + bat% + sleep countdown + ADJ indicator |
| **SEARCH**    | Header "RX SEARCH" + hit count + bat icon · Large frequency · RSSI value · RSSI fill bar + threshold tick · Signal label / last hit / scan pass + bat% + ADJ indicator |
| **EMERGENCY** | Alternating inverse · Giant "SOS" (logisoso32) · "EMERGENCY BEACON TX" · Freq + power · GPS coords or cycle + bat% |
| **GPS WAIT**  | Header "ACQUIRING GPS FIX" + bat icon · Large satellite count · Progress bar · Status line · Coordinates or "MODE: skip wait" |
| **CONFIG**    | Header "CONFIGURATION MODE" · WiFi SSID · URL · 3-step connection instructions                     |

---

## 8. Battery Monitor

### 8.1 Hardware

| Connection              | Value   | Notes                                               |
|-------------------------|---------|-----------------------------------------------------|
| BAT+ (TP4056 BAT+ rail) | → R3a   | First 100 kΩ resistor                               |
| R3a junction            | GPIO 36 | ADC1_CH0 (SVP) — input-only, no pull needed         |
| GPIO 36                 | → R3b   | Second 100 kΩ resistor                              |
| R3b                     | → GND   | Completes divider                                   |
| TP4056 STDBY            | GPIO 39 | Optional — LOW when charging; SVN input-only        |

Divider formula: `VOUT = VBAT / 2`. At full charge (4.2 V): VOUT = 2.1 V (safely within 3.3 V ADC range).

### 8.2 Software

| Parameter                   | Value         | Constant          |
|-----------------------------|---------------|-------------------|
| ADC pin                     | GPIO 36       | `PIN_BAT_ADC`     |
| Charging detection pin      | GPIO 39       | `PIN_BAT_CHRG`    |
| ADC samples averaged        | 32            | `BAT_SAMPLES`     |
| Read interval               | 5000 ms       | `BAT_READ_MS`     |
| ADC full-scale reference    | 3900 mV       | `BAT_VREF_MV`     |
| Divider ratio               | ×2            | `BAT_DIV_RATIO`   |
| Full charge voltage         | 4200 mV       | `BAT_FULL_MV`     |
| Empty cutoff voltage        | 3000 mV       | `BAT_EMPTY_MV`    |
| ADC range guard             | 2500–4500 mV  | Ignores readings outside range |

### 8.3 Piecewise Li-Ion Discharge Curve (9-point)

| VBAT    | %   |   | VBAT    | %  |
|---------|-----|---|---------|----|
| 4.20 V  | 100 |   | 3.65 V  | 50 |
| 4.05 V  | 90  |   | 3.55 V  | 35 |
| 3.90 V  | 75  |   | 3.40 V  | 20 |
| 3.75 V  | 60  |   | 3.20 V  | 10 |
|         |     |   | 3.00 V  | 0  |

### 8.4 Calibration

If readings differ from a multimeter measurement, adjust the ADC reference constant:

```cpp
#define BAT_VREF_MV   3900   // Increase if readings are too low, decrease if too high
```

---

## 9. Audio Output

| Parameter                  | Value      | Notes                                      |
|----------------------------|------------|--------------------------------------------|
| Output pin                 | GPIO 25    | Native DAC1 (`DAC_CHANNEL_1`)              |
| PWM carrier frequency      | 40,000 Hz  | LEDC channel 0, above hearing range        |
| PWM resolution             | 8-bit      | 0–255 duty cycle                           |
| Default volume             | 180        | ~70%; range 0–255                          |
| Silence mid-rail parking   | dacWrite(128) | 1.65 V — eliminates click transients    |
| Series resistor            | 100 Ω      | R2                                         |
| AC-coupling capacitor      | 10 µF      | C3 — blocks DC bias from headphones        |
| Compatible headphone Ω     | 16–600 Ω   | Standard 3.5mm wired                       |
| Connector                  | 3.5mm TRRS | Tip=audio, Ring1=Tip (mono), Sleeve=GND    |

**Tone frequencies:**

| Condition                               | Frequency   | Pattern                      |
|-----------------------------------------|-------------|------------------------------|
| No signal (RSSI < threshold)            | —           | Silence (DAC parked 1.65 V)  |
| Weak signal (threshold to −80 dBm)      | 440 Hz      | Rising-pitch start           |
| Medium signal (−80 to −60 dBm)          | ~880 Hz     | Higher pitch                 |
| Strong signal (≥ −60 dBm)               | up to 2200 Hz | Continuous                 |
| Pitch mapping                           | 440–2200 Hz | Linear interpolation w/ RSSI |
| Morse TX (BEACON mode)                  | 600 Hz      | Click stream, sync with TX   |
| EMERGENCY mode                          | 1760 Hz     | Continuous tone              |

Volume is adjustable live via SW_UP / SW_DN (step ±10). Persisted to NVS with SW_SEL long press (≥ 1 s).

---

## 10. Physical Controls (4-Button System)

| Button      | GPIO | Input type        | Pullup              |
|-------------|------|-------------------|---------------------|
| SW_MODE     | 33   | INPUT_PULLUP      | Internal            |
| SW_SEL      | 32   | INPUT_PULLUP      | Internal            |
| SW_UP       | 35   | Input-only (no internal pullup) | External 10 kΩ to 3.3 V |
| SW_DN       | 34   | Input-only (no internal pullup) | External 10 kΩ to 3.3 V |

| Button        | Press type    | Duration        | Action                                      |
|---------------|---------------|-----------------|---------------------------------------------|
| **SW_MODE**   | Short press   | < 2000 ms       | Toggle BEACON <-> SEARCH                      |
| **SW_MODE**   | Long press    | ≥ 2000 ms       | Activate EMERGENCY mode                     |
| **SW_SEL**    | Short press   | < 3000 ms       | Toggle adjustment target: VOL <-> WPM         |
| **SW_SEL**    | Hold          | ≥ 1000 ms       | Save current VOL and WPM to NVS             |
| **SW_SEL**    | Long press    | ≥ 3000 ms       | Launch WiFi AP + config dashboard           |
| **SW_UP**     | Short press   | —               | Increment selected parameter (+10 vol / +1 WPM) |
| **SW_UP**     | Hold          | > 500 ms        | Auto-repeat increment every 150 ms          |
| **SW_DN**     | Short press   | —               | Decrement selected parameter                |
| **SW_DN**     | Hold          | > 500 ms        | Auto-repeat decrement every 150 ms          |
| **MODE + SEL**| Both at boot  | ≥ 5000 ms       | Factory reset (NVS wipe + reboot)           |

| Button timing constant   | Value  | Constant              |
|--------------------------|--------|-----------------------|
| Debounce                 | 50 ms  | `BTN_DEBOUNCE_MS`     |
| Long MODE threshold      | 2000 ms| `BTN_LONG_MODE_MS`    |
| Long SEL (config) threshold | 3000 ms | `BTN_LONG_CFG_MS` |
| Factory reset hold       | 5000 ms| `BTN_FACTORY_MS`      |
| Auto-repeat delay        | 500 ms | `BTN_REPEAT_DELAY_MS` |
| Auto-repeat rate         | 150 ms | `BTN_REPEAT_RATE_MS`  |

**Adjustment overlay:** after pressing UP or DN, the OLED shows a live adjustment bar at the bottom of the screen for 2.5 seconds. The active target (VOL or WPM) is always shown in the status bar.

---

## 11. GPIO Pin Map (v5.5 — ESP32 DevKit V1)

| GPIO | Direction | Function                                                      | Notes                               |
|------|-----------|---------------------------------------------------------------|-------------------------------------|
| 2    | Input     | SX1262 DIO1 (TX/RX done, timeout IRQ)                         | Interrupt-driven                    |
| 4    | Output    | OLED RESET                                                    |                                     |
| 5    | Output    | SX1262 NSS/CS (VSPI, active LOW)                              |                                     |
| 12   | Output    | GPS RX ← Serial2 TX (ESP32 → NEO-6M)                         |                                     |
| 13   | Output    | OLED SDA (D1/MOSI) — software SPI                             |                                     |
| 14   | Output    | SX1262 RESET (active LOW)                                     |                                     |
| 15   | Output    | OLED SCK (D0) — software SPI                                  |                                     |
| 16   | Output    | OLED DC (Data/Command)                                        |                                     |
| 17   | Output    | OLED CS — software SPI chip select                            |                                     |
| 18   | Output    | VSPI SCK → SX1262                                             |                                     |
| 19   | Input     | VSPI MISO ← SX1262                                            |                                     |
| 21   | Input     | SX1262 BUSY (mandatory input)                                 | Must be wired — see §4.1            |
| 22   | Input     | GPS RX ← NEO-6M TX (Serial2 RX)                               | Input-only GPIO                     |
| 23   | Output    | VSPI MOSI → SX1262                                            |                                     |
| 25   | Output    | DAC1 audio → 100 Ω → 10 µF → 3.5mm jack TIP                  |                                     |
| 26   | Output    | LED_BLUE (SEARCH indicator, 330 Ω to GND)                    |                                     |
| 27   | Output    | LED_RED (BEACON indicator, 330 Ω to GND)                     |                                     |
| 32   | Input     | SW_SEL (INPUT_PULLUP)                                         |                                     |
| 33   | Input     | SW_MODE (INPUT_PULLUP)                                        |                                     |
| 34   | Input     | SW_DN — input-only; external 10 kΩ pullup required            |                                     |
| 35   | Input     | SW_UP — input-only; external 10 kΩ pullup required            |                                     |
| 36   | Input     | ADC1_CH0 — battery voltage divider wiper (SVP, input-only)    | No pull needed                      |
| 39   | Input     | TP4056 STDBY detect (SVN, input-only)                         | Optional; LOW = charging/full       |

> **GPIO 34, 35, 36, 39 have no internal pull-up resistors.** Use external 10 kΩ pull-ups for SW_UP (35) and SW_DN (34). GPIO 36 and 39 are ADC/detect-only inputs requiring no pull-up.

---

## 12. NVS Configuration Schema

All user settings are stored in ESP32 Non-Volatile Storage under the namespace `aegis`.

| NVS Key     | Type    | Default          | Range / Notes                              |
|-------------|---------|------------------|--------------------------------------------|
| `fcount`    | uint8   | 1                | 1–10 frequencies                           |
| `freq0`…`freq9` | float | 433.500        | MHz, one key per frequency slot            |
| `msg`       | string  | `"SOS"`          | Max 64 chars, A–Z 0–9 space               |
| `wpm`       | uint8   | 13               | 5–40                                       |
| `pwr`       | int8    | 17               | −9 to +22 dBm                              |
| `dwell`     | uint16  | 400              | 50–2000 ms scan dwell time                 |
| `rssi`      | int8    | −90              | −120 to −40 dBm detection threshold        |
| `mode`      | uint8   | 0 (BEACON)       | 0=BEACON 1=SEARCH 2=CONFIG 3=EMERGENCY     |
| `aswitch`   | bool    | false            | Auto-switch to BEACON on low battery       |
| `rep`       | uint8   | 1                | 1–10 message repetitions per frequency     |
| `avol`      | uint8   | 180              | 0–255 DAC volume                           |
| `aen`       | bool    | true             | Master audio enable                        |
| `olen`      | bool    | true             | OLED enable                                |
| `olinv`     | bool    | false            | OLED invert mode                           |
| `gpsen`     | bool    | false            | GPS module enable                          |
| `gpsbeac`   | bool    | false            | Include GPS coords in Morse payload        |
| `gpstmo`    | uint8   | 30               | GPS fix wait timeout (10–120 s)            |
| `namen`     | bool    | false            | Include name in Morse payload              |
| `fname`     | string  | `""`             | First name (max 32 chars)                  |
| `lname`     | string  | `""`             | Last name (max 32 chars)                   |
| `poten`     | bool    | false            | SW_UP/DN volume adjust enable              |
| `potwpm`    | bool    | false            | SW_UP/DN WPM adjust enable                 |

**Fail-safe:** If NVS is empty, corrupt, or missing any key, the firmware falls back to hardcoded defaults. The device is always functional after a factory reset or first flash.

**Factory reset:** hold SW_MODE + SW_SEL at boot for ≥ 5 seconds. Clears all NVS keys and reboots. Also available via `/factory` POST endpoint in the dashboard.

---

## 13. RTC RAM State (Deep Sleep Persistent)

| Variable            | Type         | Notes                                          |
|---------------------|--------------|------------------------------------------------|
| `g_bootCycle`       | uint32       | Increments every boot, survives deep sleep     |
| `g_txCycles`        | uint32       | Total TX cycles since manufacture              |
| `g_scanCycles`      | uint32       | Total scan cycles                              |
| `g_scanHits[20]`    | ScanHit[]    | Rolling log of last 20 signal detections       |
| `g_scanHitCount`    | uint8        | Current entries in g_scanHits (max 20)         |
| `g_currentMode`     | DeviceMode   | Active mode, restored after deep sleep         |
| `g_emergencyActive` | bool         | Emergency flag — persists across reboots       |
| `g_rtcLat`          | double       | Last known GPS latitude                        |
| `g_rtcLng`          | double       | Last known GPS longitude                       |
| `g_rtcFixValid`     | bool         | Whether the RTC GPS cache is valid             |

**ScanHit structure:**

| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| `freq`      | float    | Frequency in MHz                   |
| `rssi`      | int16    | Peak RSSI in dBm during dwell      |
| `timestamp` | uint32   | `millis()` at time of detection    |
| `label`     | char[12] | Signal class: WEAK / MEDIUM / STRONG |

---

## 14. WiFi Dashboard & HTTP API

The device serves a single-page captive-portal dashboard on `http://192.168.4.1` when in CONFIG mode. All domains redirect to the portal via a DNS server. The AP auto-reverts after 5 minutes if no client connects (`CONFIG_AP_TIMEOUT = 300000 ms`).

**WiFi AP settings:**

| Parameter | Value         |
|-----------|---------------|
| SSID      | `AegisBeacon` |
| Password  | Open (none)   |
| IP        | `192.168.4.1` |

**HTTP endpoints:**

| Endpoint     | Method | Description                                           |
|--------------|--------|-------------------------------------------------------|
| `/`          | GET    | Dashboard HTML (single-page app)                      |
| `/status`    | GET    | Returns device status (heap, cycles, GPS, bat, uptime)|
| `/save`      | POST   | Saves JSON config body to NVS and reboots             |
| `/emergency` | POST   | Sets EMERGENCY mode flag and reboots                  |
| `/factory`   | POST   | NVS wipe + reboot (factory reset)                     |

> v5.4 consolidates the v4.0 `/api/config`, `/api/scan`, `/api/tx`, `/api/hits`, and `/api/hits/clear` endpoints. The scan history is now served embedded in the dashboard page; the `/status` endpoint covers all device state.

**Example `/status` GET response fields:** `boot`, `heap`, `tx`, `hits`, `mode`, GPS fix state, satellite count, battery %, WPM, volume.

---

## 15. Operating Modes Summary

| Mode           | TX | RX | WiFi | OLED layout              | Audio                    | Deep sleep         |
|----------------|----|----|------|--------------------------|--------------------------|--------------------|
| **BEACON**     | Yes | No | Off  | Freq + TX progress + bat | Morse click stream       | Yes (configurable) |
| **SEARCH**     | No | Yes | Off  | RSSI bar + hits + bat    | Variable pitch (440–2200 Hz) | No (continuous) |
| **CONFIG**     | No | No | AP   | SSID + IP + instructions | Silent                   | No                 |
| **EMERGENCY**  | Yes | No | Off  | Full-screen SOS + coords | Continuous 1760 Hz       | No                 |

**EMERGENCY mode specifics:** TX power maximum (+22 dBm RadioLib / +30 dBm E22 PA), message repeated 3× per frequency, full payload always transmitted (name + GPS if enabled), flag persisted in RTC RAM across power cycles. Cleared by entering CONFIG mode and saving.

---

## 16. Firmware Build Parameters

| Parameter           | Value                   | Notes                           |
|---------------------|-------------------------|---------------------------------|
| Target MCU          | ESP32 DevKit V1 (30-pin)|                                 |
| Framework           | Arduino / PlatformIO    |                                 |
| CPU frequency       | 240 MHz (default)       | 80 MHz also supported in CI     |
| Flash size          | 4 MB                    |                                 |
| Serial baud rate    | 115200                  | 8N1                             |
| Watchdog timeout    | 30 s                    | `WDT_TIMEOUT_SEC`               |
| Debug verbose       | 0                       | Set to 1 for per-symbol Morse + RF codes |

**Library dependencies:**

| Library               | Min version | Source                     |
|-----------------------|-------------|----------------------------|
| RadioLib              | 6.0.0       | jgromes/RadioLib           |
| ArduinoJson           | 7.0.0       | bblanchon/ArduinoJson      |
| U8g2                  | 2.34.0      | olikraus/U8g2              |
| TinyGPS++             | 1.0.3       | mikalhart/TinyGPSPlus      |

**PlatformIO config:**

```ini
[env:esp32devkitv1]
platform  = espressif32
board     = esp32dev
framework = arduino

lib_deps =
    jgromes/RadioLib @ ^6.6.0
    bblanchon/ArduinoJson @ ^7.0.0
    olikraus/U8g2 @ ^2.34.0
    mikalhart/TinyGPSPlus @ ^1.0.3

monitor_speed = 115200
upload_speed  = 921600
build_flags   = -DBOARD_HAS_PSRAM=0
board_build.flash_size = 4MB
```

---

## 17. Serial Debug System

Connect at **115200 baud, 8N1**.

| Tag        | Colour   | Meaning                                                  |
|------------|----------|----------------------------------------------------------|
| `[INFO ]`  | Cyan     | Normal operation                                         |
| `[OK   ]`  | Green    | Successful operation                                     |
| `[WARN ]`  | Yellow   | Non-fatal anomaly                                        |
| `[ERROR]`  | Red      | Hardware / radio failure                                 |
| `[MODE ]`  | Magenta  | Mode change event                                        |
| `[SCAN ]`  | Blue     | RSSI scan result + ASCII bar graph                       |
| `[BTN  ]`  | White    | Button event + hold duration                             |
| `[CFG  ]`  | White    | Dashboard save / NVS load                                |
| `[OLED ]`  | Magenta  | Display event                                            |
| `[AUDIO]`  | Green    | Audio tone event                                         |
| `[GPS  ]`  | Cyan     | GPS engine (fix, satellites, coordinates)                |
| `[ADJ  ]`  | Gray     | Button adjustment (vol/WPM change)                       |
| `[BAT  ]`  | Green    | Battery reading (mV, %, charging state)                  |
| `[MORSE]`  | Gray     | Per-symbol Morse timing *(DEBUG_VERBOSE 1 only)*         |
| `[RF   ]`  | Gray     | RadioLib state codes *(DEBUG_VERBOSE 1 only)*            |

---

## 18. Reliability & Safety Features

| Feature                          | Description                                                         |
|----------------------------------|---------------------------------------------------------------------|
| Hardware watchdog                | 30 s WDT (`esp_task_wdt`)                                           |
| NVS fail-safe                    | Hardcoded defaults on empty/corrupt storage                         |
| RTC RAM state                    | Mode, counters, scan hits, GPS fix survive deep sleep               |
| Interrupt-driven buttons         | Responsive even during active TX                                    |
| SX1262 BUSY polling              | RadioLib polls BUSY before every SPI transfer                       |
| ADC range guard                  | Ignores battery readings outside 2.5–4.5 V                          |
| WiFi/BT stack shutdown           | Saves ~120 mA during TX/RX cycles                                   |
| OLED power save before sleep     | `setPowerSave(1)` called before `esp_deep_sleep_start()`            |
| Mid-TX abort                     | SW_MODE aborts between characters; max latency = 1 character        |
| Emergency flag persistence       | `g_emergencyActive` in RTC RAM survives power cycles                |

---

## 19. Regulatory Notes

| Region        | Frequency band      | Status             | Notes                                          |
|---------------|---------------------|--------------------|------------------------------------------------|
| EU / UK       | 433.050–434.790 MHz | License-free SRD   | EN 300 220; ≤ 10 mW ERP typically recommended |
| Australia/NZ  | 433 MHz ISM         | ACMA Class licence | License-free                                   |
| North America | 433 MHz ISM         | Amateur or Part 15 | Check FCC Part 15 or amateur licence           |
| North America | 915 MHz ISM         | License-free       | Part 15 ISM band                               |

> This device is an experimental emergency tool, **not** a certified distress beacon. In genuine life-threatening emergencies, use certified PLB/EPIRB equipment alongside this device. Always verify local regulations before operation.

---

## 20. Enclosure

| Parameter              | Value                                                             |
|------------------------|-------------------------------------------------------------------|
| Recommended enclosure  | Hammond 1593L (100×60×25 mm)                                     |
| Alternative            | 3D-printed PLA                                                    |
| Required cutouts       | OLED window (2.42", ~58×30 mm), USB-C port, 3.5mm jack, 4× 6mm buttons, 2× LED holes, SMA antenna exit |
| Antenna orientation    | Vertical for omni-directional coverage                            |
| Fits 18650 cell        | Yes (spring/clip holder required)                                 |
| Fits NEO-6M GPS module | Yes (included in 1593L dimensions)                                |

---

## 21. Bill of Materials (v5.5)

> **Total estimated cost: ~$23–28 USD** (AliExpress / LCSC pricing, 2026)

| # | Ref  | Component                                          | Qty | Unit Cost | Notes                                                 |
|---|------|----------------------------------------------------|-----|-----------|-------------------------------------------------------|
| 1 | U1   | ESP32 DevKit V1 (30-pin)                           | 1   | $3.00     | Built-in USB + AMS1117-3.3 LDO                        |
| 2 | U2   | Ebyte E22-400M30S (SX1262 / LLCC68)                | 1   | $5.50     | 433 MHz, +30 dBm PA, SMA, TCXO onboard               |
| 3 | U3   | SSD1309 2.42" OLED 128×64 (7-pin SPI)              | 1   | $3.50     | GND VCC SCK SDA RES DC CS — do NOT use 4-pin I2C     |
| 4 | U4   | NEO-6M GPS module                                  | 1   | $4.50     | UART 9600 baud, ceramic patch antenna. Optional.     |
| 5 | B1   | 18650 Li-ion 3.7 V                                 | 1   | $1.50     | LiFePO4 recommended for alpine cold deployments       |
| 6 | IC1  | TP4056 USB-C module (with DW01A protection)        | 1   | $0.50     | Charge + over-discharge protection. Exposes BAT+.    |
| 7 | J1   | 3.5mm TRRS audio jack (PJ-320A or CUI SJ-3523)     | 1   | $0.30     | Panel-mount, 4-pole                                   |
| 8 | SW1  | Tactile switch 6×6 mm (×4)                        | 4   | $0.20     | MODE / SEL / UP / DN                                  |
| 9 | R3   | 100 kΩ 0805 (×2)                                   | 2   | $0.02     | Battery voltage divider                               |
| 10| C1   | 100 µF 10 V electrolytic                           | 1   | $0.05     | Bulk cap on 3.3 V rail (47 µF X7R ceramic at < −10 °C) |
| 11| C2   | 100 nF ceramic 0805 (×2)                           | 2   | $0.04     | Decoupling on 3.3 V rail                              |
| 12| C3   | 10 µF 10 V electrolytic                            | 1   | $0.03     | AC-coupling cap on audio output                       |
| 13| R1   | 330 Ω 0805 (×2)                                    | 2   | $0.02     | LED current limiters                                  |
| 14| R2   | 100 Ω 0805                                         | 1   | $0.01     | Audio output series resistor                          |
| 15| D1   | Red LED 3 mm                                       | 1   | $0.05     | BEACON mode indicator                                 |
| 16| D2   | Blue LED 3 mm                                      | 1   | $0.05     | SEARCH mode indicator                                 |
| 17| ANT  | 17.3 cm wire (¼-wave @ 433 MHz)                    | 1   | $0.00     | Or use E22-400M30S SMA connector with external antenna |
| 18| BOX  | Hammond 1593L (100×60×25 mm) or 3D PLA             | 1   | $3.00     | Fits 18650 + GPS module + 2.42" OLED window           |

---

## 22. Changelog

| Version | Date | Changes                                                                                                                          |
|---------|------|----------------------------------------------------------------------------------------------------------------------------------|
| v5.5    | 2026 | Serial bridge protocol and commands; cross-platform bridge script with a live TUI + command forwarding; Report Position page with live streaming and track map; config dashboard on default system fonts; merged DATASHEET (specs + stack + frequency database + serial reference); SEO and legal pages (disclaimer, terms, privacy); Building Effectively wiki section |
| v5.4    | 2026 | Battery monitor (GPIO 36 divider, 9-point Li-ion curve, pixel-art icon in all headers, CHG indicator, dashboard animated bar); improved OLED graphics across all screens |
| v5.3    | 2026 | Replaced potentiometers with 4-button control (SW_MODE / SW_SEL / SW_UP / SW_DN); OLED adj overlay; auto-repeat; NVS save via SEL long press |
| v5.2    | 2026 | Radio upgraded SX1276 → SX1262 (Ebyte E22-400M30S); BUSY pin GPIO 21 mandatory; `ensureSpiStarted()` helper; TCXO 1.6 V parameter |
| v5.1    | 2026 | NEO-6M GPS: name + coordinates in Morse payload (`SOS DE [NAME] PSN [LAT] [LON]`); TinyGPS++ integration; RTC GPS cache; GPS wait screen |
| v5.0    | 2026 | Ported to ESP32 DevKit V1 (30-pin); SSD1306 0.96" → SSD1309 2.42" SPI (U8g2); GPIO 25 DAC1 audio; VSPI for radio; `audioDacSilence()` mid-rail parking |
| v4.0    | 2026 | Added SSD1306 0.96" OLED (I2C, GPIO 0/1); 3.5mm audio jack (GPIO 18 PWM); SW_CONFIG moved GPIO 1 → GPIO 21; audio/OLED NVS keys |
| v3.0    | 2025 | Initial public release: ESP32-C3 + SX1276, WiFi dashboard, deep sleep, frequency hopping, NVS config, RTC RAM state, CI/CD      |

---

## 23. v4.0 → v5.4 Migration

> **Breaking change — full hardware revision.** Do not run v5.x firmware on the original ESP32-C3 board with RA-02 module without complete rewiring.

| Feature              | v4.0                       | v5.4                                                   |
|----------------------|----------------------------|--------------------------------------------------------|
| Microcontroller      | ESP32-C3 SuperMini         | **ESP32 DevKit V1 (30-pin)**                           |
| Radio                | SX1276 RA-02 (OOK, +17 dBm)| **SX1262 E22-400M30S (CW/FSK, +22/+30 dBm)**         |
| Display              | SSD1306 0.96" I2C 128×64   | **SSD1309 2.42" SPI 128×64 (U8g2)**                   |
| GPS                  | None                       | **NEO-6M UART — coords + name in Morse payload**       |
| Battery monitor      | None                       | **ADC voltage divider → % + mV, live on every screen** |
| Parameter adjustment | Dashboard only             | **4 physical buttons: SW_MODE / SEL / UP / DN**        |
| Morse payload        | `SOS`                      | `SOS DE [NAME] PSN [LAT] [LON]` (configurable)         |
| Audio output pin     | GPIO 18 (PWM only)         | **GPIO 25 (native DAC1 + LEDC)**                       |
| BUSY pin             | N/A                        | **GPIO 21 — mandatory on SX1262**                      |
| Display libraries    | Adafruit SSD1306 + GFX     | **U8g2 + TinyGPS++**                                   |
| BOM cost             | ~$12–14 USD                | ~$23–28 USD                                            |

**Migration steps:** factory reset NVS, rewire all GPIO connections per §11, install new library dependencies (U8g2, TinyGPS++), reconfigure via dashboard.

---

## 24. Technology Stack

> Formerly the standalone `TECHNOLOGIES.md`. Merged into this datasheet so that every technical specification lives in one authoritative document.

### 24.1 System Overview

The project is split into two independent, clearly separated areas:

| Area            | Technology class   | Lives in                  | Runs on                      |
|:----------------|:-------------------|:--------------------------|:-----------------------------|
| Embedded beacon | C++ / Arduino      | repository root           | ESP32 DevKit V1 (on device)  |
| Website         | Astro (static)     | `website/` folder         | Vercel static hosting + localhost |

There is **no runtime coupling** between the two: the beacon is a self-contained radio-location device and the website is its technical manual, build wiki and interactive firmware simulation.

### 24.2 Embedded Firmware

| Technology        | Version        | Purpose                                   |
|:------------------|:---------------|:------------------------------------------|
| C++               | (Arduino toolchain) | Firmware implementation language      |
| Arduino framework | espressif32 (Arduino) | HAL, boot, `loop()` scheduling          |
| PlatformIO        | ≥ 6.x          | Build system, dependency resolution, upload |

**Libraries (exact `#include` set):**

| Library        | Minimum version | Role                                                            |
|:---------------|:----------------|:----------------------------------------------------------------|
| RadioLib       | 6.x             | SX1262/LLCC68 driver — CW carrier keying, LoRa, RSSI, IRQ       |
| ArduinoJson    | 7.x            | Captive-portal REST API serialization                            |
| U8g2lib        | 2.34            | SSD1309 128×64 OLED rendering (software SPI)                    |
| TinyGPSPlus    | 1.0.3           | NMEA GPS sentence parsing (NEO-6M UART)                         |
| WiFi.h         | (framework)     | CONFIG-mode access point (192.168.4.1)                           |
| DNSServer.h    | (framework)     | Captive-portal DNS interception                                  |
| WebServer.h    | (framework)     | Embedded configuration dashboard                                 |
| Preferences.h  | (framework)     | NVS persistence of frequency plans, WPM, volume                 |
| esp_sleep.h    | (framework)     | Deep-sleep state machine (~10 µA)                               |
| esp_task_wdt.h | (framework)     | 30 s hardware watchdog                                          |

**Key firmware characteristics:**

- Dual-core ESP32 (240 MHz), RadioLib SX1262 front end with **mandatory BUSY (GPIO 21)** and IRQ **DIO1 (GPIO 2)**.
- Morse CW keying via `transmitDirect()` / `standby()` (no OOK support on SX1262), FSK carrier 0.6 kbps, TX −9…+22 dBm (RadioLib cap; E22 PA to +30 dBm).
- Four operating modes: **BEACON / SEARCH / CONFIG / EMERGENCY**.
- BEACON ~65 h, SEARCH ~44 h on one 18650 cell; ~10 µA deep sleep.
- v5.5 adds a machine-readable serial protocol (`AEGIS:` lines), serial commands (`FREQ`, `WPM`, `MODE`, `POS`, `STATUS`, `HELP`), a cross-platform bridge script (`bridge/aegis-serial-bridge.py`) and a config dashboard that runs on default system fonts.

### 24.3 Astro Website

| Technology          | Version | Role                                                  |
|:--------------------|:--------|:------------------------------------------------------|
| Astro               | 5.x     | Static site generator (`.astro` components + Markdown)|
| TypeScript          | 5.x     | Typed frontmatter and content collections             |
| Astro Content Col.  | built-in| `src/content/wiki/*.md` collection with `zod` schema  |
| Output mode         | `static`| Prerendered HTML, no server runtime                   |

Pages are `.astro` components under `src/pages/`: the landing page (`index.astro`), the wiki hub (`wiki/index.astro`) with a dynamic article renderer (`wiki/[...slug].astro`), the interactive demo (`demo.astro`), the BOM builder (`builder.astro`), the repeater map (`repeaters.astro`), the live firmware dashboard (`config-dashboard.astro`), the report-position tracker (`report-position.astro`) and the legal/brand pages. Build output goes to `website/dist/`.

- CSS custom properties design tokens (`--primary`, `--background`, light/dark themes) in `public/css/site.css`.
- Self-hosted Fontsource fonts (Chakra Petch display, Manrope body, JetBrains Mono code) — no external font/CDN requests.
- Vanilla JS modules: `lib/motion.ts` (reveal-on-scroll), inline theme toggle, wiki search.
- Wiki navigation and grouping live in `lib/wiki-nav.ts`, kept in sync with the content collection.

### 24.4 Tooling, Build and Deployment

| Tool             | Version    | Purpose                                          |
|:-----------------|:-----------|:-------------------------------------------------|
| Git + GitHub     | —          | Version control, remote `origin/main`            |
| PlatformIO IDE   | ≥ 6.x      | Firmware build & upload                          |
| Arduino IDE      | 2.x        | Alternative firmware flashing path               |
| Node.js          | ≥ 20       | Astro CLI runtime (`npm run dev/build/check`)   |
| Vercel CLI       | ≥ 34       | Local `vercel build` validation, project linking |
| Vercel (Git)     | —          | Production hosting, Root Directory = `website`   |

**Build commands:**

```bash
# Website — Astro
cd website
npm install
npm run check          # astro check: pages + content collections
npm run build          # static build -> website/dist/
npm run dev            # local dev server

# Firmware (PlatformIO env: esp32devkitv1)
pio run --target upload
pio device monitor --baud 115200
```

**Deployment pipeline (Vercel):** push to `main` → Vercel Git integration builds from Root Directory `website/` → `website/vercel.json` declares `framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist` → fully static site served from the edge. No serverless runtime.

### 24.5 Verification Checklist

- [ ] `website/npm run check` passes (astro check, 0 errors).
- [ ] `website/npm run build` emits a static site to `website/dist/`.
- [ ] `website/npm run dev` serves `/`, `/wiki`, `/demo`, `/builder` locally.
- [ ] Live site returns 200 on `/`, `/wiki`, `/demo`, `/builder`, `/css/site.css`.
- [ ] All wiki pages listed in `src/lib/wiki-nav.ts` exist in `src/content/wiki/`.
- [ ] Firmware compiles with PlatformIO (`pio run --target upload`, env `esp32devkitv1`).

---

## 25. Global Emergency Frequencies

> Formerly the standalone `FREQUENCIES.md`. Merged into this datasheet so that the frequency database and the hardware that uses it live in one document.

### 25.1 Hardware Compatibility Notice

Aegis-Beacon uses the **Ebyte E22-400M30S** module (SX1262 / LLCC68 chip), which covers **410–525 MHz** only:

| Band              | SX1262 Support | Notes                                                        |
|:------------------|:--------------:|:-------------------------------------------------------------|
| 410–525 MHz       | Native support | UHF ISM / PMR446 / some land SAR — primary use              |
| VHF (118–174 MHz) | No             | Requires separate VHF radio (aviation, marine, mountain SAR) |
| UHF 406 MHz       | In range       | Satellite PLB band — **do not TX on 406.100 MHz** (see §25.2) |
| UHF 462–477 MHz   | In range       | GMRS/UHF CB emergency channels — Americas/Oceania           |

> [!IMPORTANT]
> **The SX1262 transmits a narrow CW carrier** via `transmitDirect()` / `standby()` keying — AM-detectable on any scanner or SDR. It does **not** generate FM, CTCSS sub-tones, or digital modulation. Use it to transmit Morse SOS on ISM/UHF frequencies and to passively scan RSSI on any configured frequency.

> [!NOTE]
> **CTCSS note:** The SX1262 cannot generate CTCSS sub-audio tones. Frequencies that require CTCSS (e.g. Canal E at 123.0 Hz, Radio Montana at 85.4 Hz) are useful for **SEARCH mode scanning**, but Aegis-Beacon transmissions on those channels will not open tone-squelched repeaters.

### 25.2 Global Distress Channels (International Treaty 2026)

Monitored globally by Cospas-Sarsat MEOSAR. Listed for awareness — most are outside SX1262 range.

| Frequency      | Service                   | Mode    | SX1262 | Notes                                       |
|:---------------|:--------------------------|:-------:|:------:|:--------------------------------------------|
| **121.500 MHz** | International Air Distress | AM     | No      | VHF Guard — civilian aviation worldwide     |
| **243.000 MHz** | Military Air Distress      | AM     | No      | UHF Guard — NATO military aviation          |
| **156.800 MHz** | Marine Channel 16          | NFM    | No      | International maritime distress & calling   |
| **406.100 MHz** | Satellite PLB / ELT        | Digital| Limited range | Cospas-Sarsat MEOSAR — **NEVER transmit here** without certified PLB |

### 25.3 European Mountain Rescue

**Italy — Alpine Rescue / CNSAS**

| Frequency       | Channel / Name          | CTCSS    | SX1262 | Description                                     |
|:----------------|:------------------------|:--------:|:------:|:------------------------------------------------|
| **161.300 MHz** | Canal E (Emergency)     | 123.0 Hz | No      | Primary alpine interoperability (VDA/Alps) — VHF only |
| **446.08125 MHz**| Radio Montana (PMR 7-7) | 85.4 Hz | Yes      | Standard safety frequency for hikers and backcountry |
| **446.09375 MHz**| PMR446 CH 8             | 123.0 Hz| Yes      | Alpine emergency protocol ch. 8 (also used by CNSAS liaisons) |
| **156.300 MHz** | Marine CH 06            | None     | No      | Secondary SAR coordination — VHF marine         |

**Recommended Aegis-Beacon config for Italy:**
- SEARCH scan: `446.08125`, `446.09375` MHz — SX1262 range, realistic local SAR traffic
- BEACON TX: `446.08125` MHz (Radio Montana) at reduced power; verify local regulations

**Switzerland — REGA / Alpine Rescue**

| Frequency       | Channel / Name   | CTCSS    | SX1262 | Description                                      |
|:----------------|:-----------------|:--------:|:------:|:-------------------------------------------------|
| **161.300 MHz** | Canal E (REGA)   | 123.0 Hz | No      | **Primary Swiss Rescue** nationwide — VHF only   |
| **161.350 MHz** | K-Kanal          | None     | No      | Swiss secondary coordination — VHF only           |
| **446.08125 MHz**| Radio Montana    | 85.4 Hz | Yes      | Cross-border consistency with Italy               |

**France — PGHM / Civil Protection**

| Frequency       | Network             | CTCSS    | SX1262 | Description                                       |
|:----------------|:--------------------|:--------:|:------:|:--------------------------------------------------|
| **161.300 MHz** | Canal E             | 123.0 Hz | No      | Haute-Savoie (SDIS 74 / PGHM) — VHF only         |
| **154.465 MHz** | Grand Nord          | None     | No      | Emergency coordination Alps/Pyrenees — VHF only   |
| **173.500 MHz** | Radio Secours       | None     | No      | National Gendarmerie SAR operations — VHF only    |
| **446.08125 MHz**| Radio Montana      | 85.4 Hz | Yes      | Cross-border consistency with Italy/Switzerland   |

**Austria & Germany — Bergrettung / BRK**

| Frequency        | Service          | Mode | SX1262 | Description                                      |
|:-----------------|:-----------------|:----:|:------:|:-------------------------------------------------|
| **121.500 MHz**  | Bergrettung      | AM   | No      | Primary aviation rescue contact — VHF only       |
| **149.025 MHz**  | Freenet CH 1     | NFM  | No      | Common hiker emergency (Germany) — VHF only      |
| **446.09375 MHz**| PMR CH 8         | NFM  | Yes      | Alpine emergency protocol (Ch 8, 123.0 Hz CTCSS) |
| **446.08125 MHz**| PMR CH 7 (7-7)   | NFM  | Yes      | Cross-border Radio Montana compatibility          |

**Spain — Civil Protection / REMER**

| Frequency       | Service          | Mode | SX1262 | Description                                       |
|:----------------|:-----------------|:----:|:------:|:--------------------------------------------------|
| **146.175 MHz** | Civil Protection | NFM  | No      | REMER Emergency Network — VHF main                |
| **146.625 MHz** | Civil Protection | NFM  | No      | REMER Emergency Network — secondary               |
| **446.09375 MHz**| PMR CH 8        | NFM  | Yes      | European PMR emergency protocol                   |

### 25.4 Americas

**USA & Canada — NASAR / FEMA**

| Frequency       | Service           | CTCSS / Mode | SX1262 | Description                                    |
|:----------------|:------------------|:------------:|:------:|:-----------------------------------------------|
| **155.160 MHz** | National SAR      | NFM          | No      | Primary land-based SAR — VHF only              |
| **155.800 MHz** | State SAR         | NFM          | No      | Local agency coordination — VHF only           |
| **462.675 MHz** | GMRS CH 20        | 141.3 Hz     | Yes      | Wilderness Protocol Emergency Calling — ISM UHF |
| **467.675 MHz** | GMRS CH 20 (input)| 141.3 Hz     | Yes      | Repeater input pair for CH 20                  |
| **462.550 MHz** | GMRS CH 1         | None         | Yes      | General GMRS simplex — secondary calling       |

**Recommended Aegis-Beacon config for North America:**
- SEARCH scan: `462.675`, `462.550` MHz
- BEACON TX: `462.675` MHz (GMRS CH 20 Wilderness Protocol) — requires GMRS licence in USA

**Australia & New Zealand — AMSA / LandSAR**

| Frequency        | Service       | Channel | SX1262 | Description                                      |
|:-----------------|:--------------|:-------:|:------:|:-------------------------------------------------|
| **476.525 MHz**  | UHF CB        | CH 5    | Yes      | Emergency Repeater Output (duplex output)        |
| **477.275 MHz**  | UHF CB        | CH 35   | Yes      | Emergency Repeater Input (duplex input)          |
| **477.0 MHz**    | UHF CB simplex| CH 40   | Yes      | General calling / secondary                      |

### 25.5 ISM 433 MHz Band — Aegis-Beacon Native Range

The SX1262 E22-400M30S is optimised for **433–434.8 MHz** (EU SRD60 band).

| Frequency       | Use                           | Power limit | Notes                                                  |
|:----------------|:------------------------------|:-----------:|:-------------------------------------------------------|
| **433.050 MHz** | SRD lower edge                | 10 mW ERP   | Lower limit of licence-free ISM band (EU)              |
| **433.500 MHz** | **Aegis-Beacon default**      | 10 mW ERP   | Firmware default (`DEFAULT_FREQ_MHZ = 433.500f`)       |
| **433.700 MHz** | Ham / ISM overlap             | 10 mW ERP   | Common simplex calling in EU ISM                       |
| **434.075 MHz** | Weather balloon (radiosonde)  | —           | Avoid when passive scanning — high false-positive rate |
| **434.500 MHz** | ISM devices / keyfobs         | 10 mW ERP   | High background noise — use only as secondary hop      |
| **434.790 MHz** | SRD upper edge                | 10 mW ERP   | Upper limit of EU SRD60 band                           |

> The E22-400M30S PA outputs up to +30 dBm. In the EU SRD band the legal ERP limit is typically **10 mW (+10 dBm)**. Use the dashboard to set TX power to ≤ +10 dBm for SRD-compliant operation. Higher power is permissible under amateur licence (with callsign) or in genuine life-threatening emergencies.

**Suggested Multi-Frequency Beacon Hop Sequence (EU):**

```
Slot 1: 433.500 MHz  (default, most monitored by hams/SAR volunteers)
Slot 2: 433.700 MHz  (secondary ISM simplex)
Slot 3: 434.500 MHz  (ISM, wider scanner coverage)
Slot 4: 434.790 MHz  (upper SRD edge)
Slot 5: 446.08125 MHz (Radio Montana — if local CNSAS/mountain rescue uses it)
```

### 25.6 PMR446 Emergency Channels

PMR446 (446.0–446.2 MHz) is a licence-free UHF band in the EU that falls within SX1262 native range.

| Channel | Frequency        | CTCSS     | SX1262 | Common use                                         |
|:-------:|:-----------------|:---------:|:------:|:---------------------------------------------------|
| **CH 1**| 446.00625 MHz    | None      | Yes      | General calling                                    |
| **CH 7**| 446.08125 MHz    | 85.4 Hz   | Yes      | **Radio Montana** — primary alpine emergency       |
| **CH 8**| 446.09375 MHz    | 123.0 Hz  | Yes      | Alpine SAR protocol (CNSAS liaisons, Austria, Germany) |
| **CH 16**| 446.19375 MHz   | None      | Yes      | OIRT secondary / free channel                      |

> **CTCSS and Aegis-Beacon:** The SX1262 CW carrier will be heard on any scanner or SDR regardless of CTCSS, because scanners in open/scan mode ignore sub-tone squelch. CTCSS is a squelch filter on the *receiver* side, not a physical modulation the CW carrier lacks.

### 25.7 Frequency Configuration Guide

1. Open CONFIG mode: hold **SW_SEL ≥ 3 s** → connect to `AegisBeacon` WiFi → open `http://192.168.4.1`
2. Navigate to **Frequency Manager**
3. Add up to **10 frequency slots** (firmware constant `MAX_FREQUENCIES = 10`)
4. In BEACON mode, each slot is transmitted in sequence per cycle
5. In SEARCH mode, each slot is scanned with the configured dwell time

**Recommended SEARCH scan parameters:**

| Parameter         | Alpine SAR | Urban / lowland | Constant         |
|:------------------|:----------:|:---------------:|:-----------------|
| Dwell time        | 400 ms     | 200 ms          | `scanDwellMs`    |
| RSSI threshold    | −105 dBm   | −90 dBm         | `rssiThreshold`  |
| RX bandwidth      | 9.7 kHz    | 9.7 kHz         | (firmware fixed) |

**Antenna length by frequency:**

| Frequency band  | ¼-wave length | ½-wave length | Notes                          |
|:----------------|:-------------:|:-------------:|:-------------------------------|
| 433–435 MHz     | **17.3 cm**   | 34.6 cm       | Firmware default range         |
| 446 MHz (PMR)   | **16.8 cm**   | 33.6 cm       | PMR446 / Radio Montana         |
| 462–477 MHz (GMRS/UHF CB) | **16.2 cm** | 32.4 cm | North America / Oceania  |

### 25.8 Regional Frequency Quick-Reference

| Region          | Primary (SX1262 YES) | Secondary (SX1262 YES) | Requires VHF radio No       |
|:----------------|:-------------------:|:---------------------:|:---------------------------:|
| Italy        | 446.08125 MHz       | 446.09375 MHz         | 161.300 MHz (Canal E)       |
| Switzerland  | 446.08125 MHz       | 433.500 MHz (ISM)     | 161.300 MHz (Canal E/REGA)  |
| France       | 446.08125 MHz       | 446.09375 MHz         | 161.300 MHz, 173.500 MHz    |
| Austria      | 446.09375 MHz       | 446.08125 MHz         | 121.500 MHz, 149.025 MHz    |
| Germany      | 446.09375 MHz       | 446.08125 MHz         | 149.025 MHz                 |
| Spain        | 446.09375 MHz       | 433.500 MHz (ISM)     | 146.175 MHz, 146.625 MHz    |
| USA / Canada | 462.675 MHz    | 462.550 MHz           | 155.160 MHz, 155.800 MHz    |
| Australia / NZ | 476.525 MHz  | 477.275 MHz           | —                           |
| **Universal**   | 433.500 MHz (ISM)   | 434.500 MHz (ISM)     | 121.500 MHz (air guard)     |

### 25.9 What Receivers Can Hear Aegis-Beacon

The SX1262 produces a narrow CW carrier (FSK carrier on, key off = silence) — equivalent to OOK/AM from a receiver perspective.

| Receiver type                          | Hears Aegis-Beacon? | Notes                                             |
|:---------------------------------------|:-------------------:|:--------------------------------------------------|
| AM-mode scanner / ham radio            | Yes              | Standard AM mode picks up CW carrier directly     |
| SDR + SDR# / GQRX / SDRangel          | Yes              | Set demodulator to AM or CW; visible as Morse     |
| Baofeng UV-5R (AM mode on 433 MHz)     | Yes              | Requires AM mode or wider bandwidth               |
| FM-only handheld (PMR446 radio)        | Partial          | May hear buzzing on FM; not cleanly demodulated   |
| Certified PLB / EPIRB receivers        | No                 | Digital protocol only on 406.1 MHz                |
| Another Aegis-Beacon in SEARCH mode    | Yes              | RSSI detection, not demodulation                  |

### 25.10 Legal & Regulatory Summary

| Region        | Relevant Band     | TX legal?        | Conditions                                              |
|:--------------|:------------------|:----------------:|:--------------------------------------------------------|
| EU            | 433–434.8 MHz SRD | Licence-free   | ≤ 10 mW ERP, ≤ 10% duty cycle (EN 300 220)             |
| EU            | PMR446 (446 MHz)  | Licence-free   | ≤ 500 mW ERP, no repeaters, no encryption              |
| Switzerland   | 433 MHz SRD       | Licence-free   | OFCOM class licence                                     |
| USA / Canada  | 462–467 MHz GMRS  | Licence required  | FCC GMRS licence ($35 / 10 yr, covers family)          |
| USA           | 433 MHz ISM       | Part 15        | ≤ 1 mW conducted; low power only                       |
| Australia/NZ  | UHF CB (476–477)  | Licence-free   | ACMA class licence, ≤ 5 W                              |
| Global        | 406.100 MHz       | Prohibited     | Certified PLBs only — illegal to transmit without certification |
| Global        | 121.5 / 156.8 MHz | LIMITED Emergency only | Distress use only; misuse is a criminal offence        |

> **Emergency exception:** In virtually all jurisdictions, the use of any available communication means to signal genuine life-threatening distress is legally protected. This device is designed for exactly that scenario. Outside of emergency use, observe all power and licensing restrictions above.

> [!IMPORTANT]
> This frequency database is updated for **June 2026**. Emergency frequencies and regulatory limits are subject to change by national telecommunications authorities. Always verify current regulations before operation.

---

## 26. Serial Protocol Reference

The firmware prints machine-readable `AEGIS:` lines on USB serial (115200 baud, 8N1) and accepts a small set of commands. These lines are never ANSI-colored and are emitted one per line, so they can be consumed by scripts and the serial bridge.

### 26.1 Outgoing lines

| Line | Example | Meaning |
|------|---------|---------|
| `AEGIS:HELLO:` | `AEGIS:HELLO:ver=5.5;mode=BEACON;freq=433.500;wpm=12;vol=64` | Emitted at boot after the banner |
| `AEGIS:POS:` | `AEGIS:POS:lat=45.123456;lng=11.123456;alt=412;sats=8;freq=433.500;mode=BEACON;fix=1;age=87;payload=SOS PSN N4553 E01130` | Position report (see below) |
| `AEGIS:STATE:` | `AEGIS:STATE:mode=SEARCH;freq=433.500;wpm=12;vol=64;heap=184320;boot=1;tx=0;hits=0;gpsFix=1;sats=8` | Response to `STATUS` |
| `AEGIS:FREQ:n=` | `AEGIS:FREQ:0=433.500` | One line per configured frequency (response to `FREQ?`) |
| `AEGIS:WPM:n` | `AEGIS:WPM:14` | Confirmation after a `WPM` command |
| `AEGIS:MODE:x` | `AEGIS:MODE:SEARCH` | Confirmation after a `MODE` command |
| `AEGIS:ERR:` | `AEGIS:ERR:frequency 434.900 out of range (410-525 MHz)` | Error message |
| `AEGIS:HELP:` | `AEGIS:HELP:FREQ <MHz> | FREQ? | WPM <5-40> | MODE <BEACON|SEARCH|CONFIG|EMERGENCY> | POS | STATUS | HELP` | Response to `HELP` |

### 26.2 The POS line fields

| Field | Type | Meaning |
|-------|------|---------|
| `lat`, `lng` | float, 6 decimals | Coordinates, clamped to real-world ranges (-90..90, -180..180) |
| `alt` | float | Altitude in metres from the GPS receiver |
| `sats` | int | Number of satellites used for the fix |
| `freq` | float | Primary frequency (MHz) |
| `mode` | string | Current mode: BEACON, SEARCH, CONFIG or EMERGENCY |
| `fix` | int | 1 when the reported fix is a fresh live calculation, 0 when it is a stale last-known position |
| `age` | int | Age of the fix in seconds (0 for a fresh fix) |
| `payload` | string | The Morse payload built for the current cycle |

**Freshness contract:** the firmware recalculates the position from the receiver on every GPS update. If no new satellite data has arrived for 30 seconds, the fix is flagged `fix=0` and the `age` grows, instead of echoing the same coordinates as if they were new. A POS line is never emitted before any fix exists (no bogus `0,0`).

### 26.3 Incoming commands

| Command | Example | Behaviour |
|---------|---------|-----------|
| `FREQ <MHz>` | `FREQ 433.500` | Sets the primary frequency (410-525 MHz), persists to NVS, echoes `AEGIS:FREQ:0=` |
| `FREQ?` | `FREQ?` | Lists every configured frequency as `AEGIS:FREQ:n=` |
| `WPM <5-40>` | `WPM 14` | Sets the Morse speed, persists, echoes `AEGIS:WPM:` |
| `MODE <name>` | `MODE SEARCH` | Switches mode, persists, restarts the device, echoes `AEGIS:MODE:` |
| `POS` | `POS` | Forces a position report now |
| `STATUS` | `STATUS` | Prints a `AEGIS:STATE:` line with mode, freq, wpm, volume, heap, boot count, TX count, hits, GPS state |
| `HELP` / `?` | `HELP` | Prints the `AEGIS:HELP:` summary |

Commands are case-insensitive, whitespace-trimmed, and each produces at most one machine-readable response line. Out-of-range values produce `AEGIS:ERR:` lines and change nothing.

---

## 27. Serial Bridge & Terminal UI

The bridge (`bridge/aegis-serial-bridge.py`) is a single Python 3.8+ file (dependency: `pyserial`) that connects the beacon to the official website. It runs on Windows, macOS and Linux.

### 27.1 What it does

1. Auto-detects the serial port (or takes `--port`).
2. Reads `AEGIS:` lines and extracts `AEGIS:POS:` coordinates.
3. Builds a Report Position link: `https://aegis-beacon.vercel.app/report-position?lat=..&lng=..`.
4. If the page is already open in a browser, the page polls the bridge's loopback HTTP server (`127.0.0.1:8765`) and every new fix streams into it live — no new tabs. If the page is not open, the bridge opens it already filled in.

Everything stays on the loopback interface; no API keys, no accounts, no cloud.

### 27.2 Live terminal dashboard (TUI)

When stdout is a terminal, the bridge renders a live dashboard:

```text
  AEGIS-BEACON SERIAL BRIDGE   14:32:08   uptime 412s
  ----------------------------------------------------------
  Device     COM3 @ 115200 baud (connected)
  Position   45.531240, 12.304560
  Page       open, live streaming
  ----------------------------------------------------------
  Live log:
  [device] AEGIS:POS:lat=45.531240;lng=12.304560;sats=6;fix=1;age=0
  [bridge] page is open, streaming update to it
```

The dashboard shows the connected device and baud rate, the latest position, whether the Report Position page is open and streaming, and a scrolling live log. Use `--tui` to force it on or `--no-tui` for plain line output.

### 27.3 Command forwarding

While the bridge runs, commands typed in its terminal are forwarded to the device over serial (`FREQ`, `WPM`, `MODE`, `POS`, `STATUS`, `HELP`). `exit` or `quit` stops the bridge cleanly. See §26.3 for the command reference.

### 27.4 Bridge flags

| Flag | Meaning |
|------|---------|
| `--port X` | Serial port (auto-detected if omitted) |
| `--baud N` | Baud rate, default 115200 |
| `--http-port N` | Loopback port, default 8765 |
| `--site URL` | Site base URL, default the official one |
| `--no-open` | Print links instead of opening the browser |
| `--verbose` | Print all serial traffic, not only `AEGIS:` lines |
| `--tui` / `--no-tui` | Force the dashboard on / off |

---

## 28. Deep Dive: Deep Sleep State Machine

```text
             ┌────────────────────────────┐
             │  WATCHDOG FEED (30 s WDT)  │
             └────────────┬───────────────┘
                          ▼
  TX cycle ──► OLED update ──► setPowerSave(1) ──► esp_deep_sleep_start()
                          │
                          ▼
                    WAKE (timer)
                          │
                          ▼
        RTC RAM restored (mode, counters, GPS cache)
```

1. Before sleeping, the OLED receives `setPowerSave(1)` (drops from ~6 mA to ~0.3 mA).
2. The ESP32 enters deep sleep; RTC RAM keeps `g_currentMode`, cycle counters, scan hits and the last GPS fix.
3. The configured interval (1-300 s) elapses, the device wakes, restores state and runs the next cycle.
4. The 30 s hardware watchdog (`esp_task_wdt`) is fed throughout; a stuck loop resets the device instead of leaving it silent.

**Power budget** (2000 mAh 18650, 20 °C): 10 µA deep sleep, ~120 mA TX at +17 dBm, ~40 mA scan. At a 10 s beacon interval the duty cycle is dominated by TX, giving roughly 65 h; stretching the interval to 60 s reaches ~175 h. See §3.3 for the full table.

---

## 29. Deep Dive: GPS Fix Acquisition

1. On boot, if GPS is enabled and no RTC-cached fix exists, the device shows the GPS wait screen (satellite count, elapsed time, progress bar).
2. TinyGPS++ parses NMEA sentences on Serial2 (GPIO 22 RX, 9600 baud).
3. A fix is considered valid at ≥ 3 satellites (`GPS_MIN_SATS`).
4. Timeout (`gpstmo`, 10-120 s) or a MODE press skips the wait; without a fix the payload carries `PSN UNKN`.
5. Once acquired, the fix is stored in RTC RAM (`g_rtcLat`, `g_rtcLng`, `g_rtcFixValid`) and survives deep sleep.
6. On later cycles, the firmware distinguishes a fresh live fix (`fix=1`) from a cached one (`fix=0`, growing `age`).

**Morse coordinates** use compact DDM: `N4553` = 45°53' N, `E01230` = 12°30' E (degrees + whole minutes, ~0.1 arcminute ≈ 185 m precision). Full decimal coordinates are logged to Serial. The encoder truncates minutes (never rounds up), so a reported position is never optimistic past the real spot.

---

## 30. Deep Dive: BEACON TX Cycle

1. WiFi and Bluetooth stacks are shut down (~120 mA saved).
2. The payload is assembled: `SOS` + optional name + optional GPS per configuration.
3. The SX1262 is initialised in CW mode (`beginFSK` + `transmitDirect()`).
4. Each configured frequency is visited in sequence; the message is repeated N times per frequency (1-10).
5. Morse timing follows PARIS standard: dot = `1200/WPM` ms, dash = 3 units, intra-character gap = 1, inter-character gap = 3, word gap = 7.
6. The DAC (GPIO 25) emits a 600 Hz click stream in sync with TX for headphone monitoring.
7. SW_MODE aborts the transmission between characters (max latency one character).
8. Deep sleep for the configured interval, then repeat.

At 13 WPM: dot = 92 ms, dash = 277 ms. `SOS` ≈ 2.7 s; the full payload `SOS DE MARIO ROSSI PSN N4553 E01230` ≈ 45 s.

---

## 31. Deep Dive: SEARCH Scan Cycle

1. WiFi and Bluetooth are shut down.
2. Each configured frequency is opened in FSK receive for the dwell time (50-2000 ms, default 400 ms).
3. Peak RSSI over the dwell window is measured (SX1262 internal RSSI, -120 to -40 dBm, ±2 dBm).
4. The signal is classified: WEAK (threshold to -80), MEDIUM (-80 to -60), STRONG (≥ -60).
5. A rising-pitch tone (440-2200 Hz, metal-detector style) tracks signal strength on the DAC.
6. Detections above the threshold append to the rolling hit log (last 20 in RTC RAM).
7. The blue LED blinks on detection; the OLED shows the RSSI bar with a threshold tick.

**Recommended scan parameters:** alpine SAR — 400 ms dwell, -105 dBm threshold; urban — 200 ms, -90 dBm. See §25.7.

---

## 32. Troubleshooting Matrix

| Symptom | Most likely cause | Fastest check / fix |
|---------|-------------------|---------------------|
| No boot, no OLED, no serial | Power path broken | Measure 3.3 V on the rail; check TP4056 and cell polarity |
| Boot loop / continuous restart | Brownout or bad 5V connection | Check VBUS and the 100 µF bulk cap; see [Boot Loop](boot-loop) |
| Radio hangs on first TX call | BUSY not wired | Continuity-test GPIO 21 to the E22 BUSY pin — the #1 missed wire |
| `[ERROR] SX1262 TX init FAILED` | SPI wiring or BUSY | Verify GPIO 18/19/23/5/14/21; see §11 |
| OLED blank | Wrong panel (I2C instead of SPI) or wiring | Confirm the 7-pin SPI variant; check RES/CS |
| Garbled OLED columns | DC swapped with CS | Swap GPIO 16 and 17 |
| Battery stuck at 0 % or 100 % | Divider disconnected | Measure the voltage directly at GPIO 36; check the 100k/100k pair |
| No GPS fix outdoors | Sky view blocked or wrong UART | Cold start can take 3 min; verify GPIO 22/12 and 9600 baud |
| No audio / quiet audio | Missing AC cap or wrong pin | Check the 10 µF cap and GPIO 25 path |
| SW_UP / SW_DN dead | No external pull-up (input-only pins) | Add 10 kΩ from GPIO 34/35 to 3.3 V |
| Device stuck in EMERGENCY | RTC flag set | Enter CONFIG and save to clear |
| `[WARN] NVS empty` on every boot | NVS corrupt or reset | First boot is normal; if persistent, factory reset and reconfigure |
| Upload fails | Wrong board or driver | Select ESP32 Dev Module; install CP210x/CH340 driver |
| Serial shows nothing | Wrong baud or wrong cable | Use 115200 8N1 and a data (not charge-only) USB cable |
| Bridge cannot find the port | Driver missing | Run `--list`; install the CP210x/CH340 driver |
| Bridge opens no page | Page already open, or `--no-open` | Check the dashboard Page field; the page polls 127.0.0.1:8765 |
| Coordinates look wrong in Morse | DDM misread | `N4553` = 45°53' N, not 45.53°; the encoder truncates, never rounds up |

---

## 33. Frequently Asked Questions

**Q: What receiver do I need to hear the beacon?**
A: Any AM-mode receiver on the beacon frequency: a Baofeng in AM mode, a scanner, a ham radio transceiver, or an RTL-SDR with SDR# / GQRX. The SX1262 CW carrier is detected identically to OOK. See §25.9.

**Q: Can a rescuer decode the coordinates without special software?**
A: Yes. `N4553 E01230` is plain Morse text: a trained operator hears N-4-5-5-3 E-0-1-2-3-0 and plots 45°53' N, 12°30' E in any map app.

**Q: How accurate are the transmitted coordinates?**
A: The compact DDM encoding resolves ~0.1 arcminute (~185 m), which is intentional: shorter Morse = faster cycles. Full decimal coordinates are logged over serial at full receiver precision.

**Q: Is the SX1262 backward compatible with SX1276 receivers?**
A: Yes for CW: the carrier signal is modulation-agnostic. Any AM receiver that could hear the SX1276 OOK will hear the SX1262 CW carrier.

**Q: Can I run without the GPS module?**
A: Yes. Set `gpsEnabled = false`; the beacon transmits `SOS` or `SOS DE [NAME]` as configured. GPS is optional.

**Q: Does it work through snow?**
A: 433 MHz attenuates ~3 dB/m in wet snow. The +30 dBm PA compensates: at 1 m burial expect 3-9 dB loss, within the link budget.

**Q: I upgraded from v4.0. Do I need to factory reset?**
A: Yes, mandatory: the hardware, GPIO map, libraries and NVS schema all changed (see §23). Rewire, reset, reconfigure.

**Q: What is the legal status of transmitting?**
A: In the EU SRD band keep ≤ 10 mW ERP (use the dashboard to set ≤ +10 dBm); PMR446 allows ≤ 500 mW ERP licence-free. In genuine life-threatening emergencies, using any available means to signal distress is legally protected. See §25.10 and §19.

**Q: How do I update the firmware?**
A: Flash via PlatformIO (`pio run --target upload`) or the Arduino IDE with the ESP32 board package. Settings survive in NVS; do a factory reset only if the NVS schema changed between versions.

**Q: The battery percentage jumps around.**
A: The ESP32 ADC is inherently ±5-10 %; the 32-sample average reduces noise but cannot fix a loose divider connection. Calibrate `BAT_VREF_MV` against a multimeter (§8.4).

---

## 34. Operation Checklists

### 34.1 First power-on

1. Cell inserted, polarity correct, TP4056 charging LED lit.
2. Boot screen shows `AEGIS-BEACON v5.5` and a sensible battery percentage.
3. Default mode is BEACON at 433.500 MHz.
4. Plug into USB and check the serial banner + `AEGIS:HELLO:` line.
5. If GPS enabled, the fix wait screen appears; outdoors, a fix arrives within ~3 min.

### 34.2 Field deployment

1. Battery above 30 % (checked at power-on and every 5 s).
2. Antenna vertical, clear of the body and metal.
3. GPS fixed (solid dot) before leaving the trailhead if coordinates are needed.
4. Mode set to BEACON; interval and WPM configured for the scenario.
5. Test transmission heard on a second device or SDR before the trip.

### 34.3 After a rescue operation

1. Exit EMERGENCY via CONFIG mode and save.
2. Review the serial log and scan-hit history for the debrief.
3. Charge the cell; store at ~50 % if unused for weeks.
4. Run the [two-beacon bench test] before the next deployment.

---

## 35. Complete GPIO Reference (v5.5 — ESP32 DevKit V1)

Every signal the firmware touches, its default direction, the alternate
functions available on that physical pin, and the software constant that
controls it. All values are compile-time defines in the firmware header
section of `AegisBeacon.ino`.

### 35.1 Pin assignment table

| GPIO | Label on DevKit | Function in Aegis-Beacon | Direction | Alternate functions | Notes |
| --- | --- | --- | --- | --- | --- |
| GPIO0 | D0 / BOOT | (unused) | — | ADC2_CH1, TOUCH1, RTC_GPIO11 | Strapping pin: must stay high at boot |
| GPIO1 | TX0 | USB serial TX (debug console) | Output | U0TXD | Used by the USB-UART bridge chip |
| GPIO2 | D2 | (unused) | — | ADC2_CH2, TOUCH2, RTC_GPIO12 | Strapping: keep high at boot |
| GPIO3 | RX0 | USB serial RX (debug console) | Input | U0RXD | Used by the USB-UART bridge chip |
| GPIO4 | D4 | (unused) | — | ADC2_CH0, TOUCH0, RTC_GPIO10 | — |
| GPIO5 | D5 | (unused) | — | VSPI_SS | — |
| GPIO12 | D12 | (unused) | — | ADC2_CH5, TOUCH5, RTC_GPIO15 | Strapping: must be low at boot (MTDI) |
| GPIO13 | D13 | (unused) | — | ADC2_CH4, TOUCH4, RTC_GPIO14 | Strapping: must be low at boot (MTCK) |
| GPIO14 | D14 | (unused) | — | ADC2_CH6, TOUCH6, RTC_GPIO16 | Strapping: must be low at boot (MTMS) |
| GPIO15 | D15 | (unused) | — | ADC2_CH3, TOUCH3, RTC_GPIO13 | Strapping: must be low at boot (MTDO) |
| GPIO16 | D16 | (unused) | — | — | — |
| GPIO17 | D17 | (unused) | — | — | — |
| GPIO18 | D18 | (unused) | — | VSPI_CLK | — |
| GPIO19 | D19 | (unused) | — | VSPI_MISO | — |
| GPIO21 | D21 | (unused) | — | I2C_SDA (HW default) | — |
| GPIO22 | D22 | (unused) | — | I2C_SCL (HW default) | — |
| GPIO23 | D23 | (unused) | — | VSPI_MOSI | — |
| GPIO25 | D25 | (unused) | — | DAC1, ADC2_CH8, RTC_GPIO18 | — |
| GPIO26 | D26 | (unused) | — | DAC2, ADC2_CH9, RTC_GPIO19 | — |
| GPIO27 | D27 | (unused) | — | ADC2_CH7, TOUCH7, RTC_GPIO17 | — |
| GPIO32 | D32 | (unused) | — | ADC1_CH4, TOUCH9, RTC_GPIO9 | — |
| GPIO33 | D33 | (unused) | — | ADC1_CH5, TOUCH8, RTC_GPIO8 | — |
| GPIO34 | D34 | Battery voltage monitor (ADC) | Input | ADC1_CH6 | Input-only pin |
| GPIO35 | D35 | (unused) | — | ADC1_CH7, RTC_GPIO7 | Input-only pin |
| GPIO36 | VP | (unused) | — | ADC1_CH0, RTC_GPIO0 | Input-only pin |
| GPIO39 | VN | (unused) | — | ADC1_CH3, RTC_GPIO3 | Input-only pin |

> [!IMPORTANT]
> GPIO34, GPIO35, GPIO36 and GPIO39 are input-only; never drive them as
> outputs. GPIO0, GPIO2, GPIO12, GPIO13, GPIO14 and GPIO15 are strapping
> pins whose state at reset selects boot mode — the firmware keeps them
> floating or weakly pulled so boot is always normal.

### 35.2 Peripheral wiring (v5.5 reference build)

| Peripheral | Interface | Pins | Speed / protocol |
| --- | --- | --- | --- |
| SX1262 LoRa radio | SPI | SCK=GPIO18, MISO=GPIO19, MOSI=GPIO23, NSS=GPIO5, RST=GPIO14, DIO1=GPIO2, BUSY=GPIO4 | 8 MHz SPI (radio max) |
| SSD1309 OLED | I2C | SDA=GPIO21, SCL=GPIO22 | 400 kHz (fast mode) |
| NEO-6M GPS | UART | TX=GPIO16, RX=GPIO17 | 9600 baud, 8N1 |
| Buzzer | GPIO | BZ=GPIO25 (PWM-capable) | 2.7 kHz tone, ~50% duty |
| Buttons | GPIO | BTN_MODE=GPIO26, BTN_SEL=GPIO27, BTN_UP=GPIO32, BTN_DN=GPIO33 | Active-low, internal pull-up, 50 ms debounce |
| Battery divider | ADC | VBAT=GPIO34 | 100 kΩ / 100 kΩ divider, 2:1 ratio |

### 35.3 Strapping pin boot requirements

| Pin | Strapping function | Boot requirement | Conflict risk |
| --- | --- | --- | --- |
| GPIO0 | Boot mode select | High (or floating) for normal boot | Pulled low = download mode |
| GPIO2 | Boot mode select | High or floating | Pulled low = download mode |
| GPIO12 | MTDI | Low (or floating) | High = reduced flash voltage |
| GPIO13 | MTCK | Floating | — |
| GPIO14 | MTMS | Floating | Used as radio RST — driven only after boot |
| GPIO15 | MTDO | Floating | — |

### 35.4 ADC channels used

| Signal | ADC | Channel | Attenuation | Effective range |
| --- | --- | --- | --- | --- |
| Battery voltage | ADC1 | CH6 (GPIO34) | 11 dB | 0–3.1 V at the pin, 0–6.2 V at the battery after the 2:1 divider |

### 35.5 Current limits and drive strength

- GPIO drive strength: 20 mA per pin (default), 40 mA maximum with the
  `GPIO_DRIVE_CAP_2` setting; the firmware leaves the default.
- The buzzer pin is switched by an NPN transistor (2N2222) in the reference
  build, so the GPIO only sources base current (~2 mA), not the coil current.
- The OLED runs off the 3.3 V rail; its I2C lines are open-drain with 4.7 kΩ
  pull-ups to 3.3 V.
- The radio's DIO1 interrupt line is a 3.3 V logic output with a 1 kΩ series
  resistor in the reference schematic to protect against ESD.

---

## 36. SX1262 Register Map and Configuration Reference

### 36.1 Command set used by the firmware

| Command | Opcode | Purpose in Aegis-Beacon |
| --- | --- | --- |
| `SetStandby` | 0x80 | Enter STDBY_RC before and after every operation |
| `SetPacketType` | 0x8A | Select LoRa packet type (0x01) |
| `SetRfFrequency` | 0x86 | Program the carrier frequency (3-byte PLL word) |
| `SetModulationParams` | 0x8B | SF, bandwidth, coding rate, low-data-rate optimization |
| `SetPacketParams` | 0x8C | Preamble length, fixed/variable header, payload length, CRC, IQ |
| `SetTxParams` | 0x8E | TX power and ramp time |
| `SetBufferBaseAddress` | 0x8F | RX/TX buffer offsets (both 0x00) |
| `SetDioIrqParams` | 0x08 | Mask TX_DONE / RX_DONE interrupts onto DIO1 |
| `WriteBuffer` | 0x0E | Load the payload to transmit |
| `ReadBuffer` | 0x1E | Read a received payload |
| `SetTx` | 0x83 | Start transmission with timeout |
| `SetRx` | 0x82 | Start reception with timeout |
| `GetIrqStatus` | 0x12 | Read interrupt flags after an event |
| `ClearIrqStatus` | 0x02 | Clear handled interrupts |
| `GetPacketStatus` | 0x14 | RSSI, SNR, signal Rssi of last packet |
| `Calibrate` | 0x89 | Run all internal calibrations (called once at boot) |
| `SetRegulatorMode` | 0x96 | DC-DC mode (paired with the SX1262 DC-DC inductor) |

### 36.2 Key registers

| Register | Address | Meaning |
| --- | --- | --- |
| `SX126X_REG_LORA_SYNC_WORD_MSB` | 0x0740 | LoRa sync word; 0x1424 in this project |
| `SX126X_REG_LORA_SYNC_WORD_LSB` | 0x0741 | LoRa sync word LSB |
| `SX126X_REG_PACKET_PARAMS` | 0x0704 | Packet parameter mirror (payload length etc.) |
| `SX126X_REG_MODULATION_PARAMS` | 0x0702 | Modulation parameter mirror |
| `SX126X_REG_RX_GAIN` | 0x08AC | RX gain (AGC on in this project) |
| `SX126X_REG_OCP` | 0x08E4 | Over-current protection for PA |
| `SX126X_REG_TCXO` | 0x0911 | TCXO control (used if a TCXO is fitted) |

### 36.3 Modulation parameters used

| Parameter | Value | Rationale |
| --- | --- | --- |
| Spreading factor | SF7 (beacon) / SF9 (SEARCH) | SF7 = short, fast packets; SF9 = +3 dB link margin for weak signals |
| Bandwidth | 125 kHz | Narrower = more sensitivity per Hz, standard for 433 MHz ISM |
| Coding rate | 4/5 | Default; error correction for the payload |
| Low-data-rate optimize | Auto (on at SF11+, off below) | Required for SF11/12 at 125 kHz |
| Preamble | 8 symbols | Standard; enough for AGC + sync |
| CRC | On (2 bytes) | Payload integrity for position data |
| IQ inversion | Off | Standard uplink polarity |

### 36.4 Frequency synthesis

The SX1262 PLL word is computed as `FreqWord = (F_RF * 2^25) / F_XTAL`
with F_XTAL = 32 MHz. The firmware stores frequencies in Hz and converts at
configuration time, so the PLL word is always exact for the crystal.

| Band | Frequency range | F_XTAL | FreqWord example (433.500 MHz) |
| --- | --- | --- | --- |
| 433 MHz ISM | 433.050–434.790 MHz | 32 MHz | 0x6C8000 → 454,164,480 Hz → PLL word = 454164480 × 33554432 / 32000000 ≈ 476,196,864 (0x1C628000) |

### 36.5 TX power mapping

| Register value | Output power (dBm) | Use |
| --- | --- | --- |
| 0x16 | +22 | Emergency mode (maximum legal PA output with OCP) |
| 0x14 | +20 | Default beacon power |
| 0x12 | +18 | Reduced power (close-range work) |
| 0x0F | +14 | Low power (bench testing) |

---

## 37. LoRa Modulation Math and Link Budget

### 37.1 Airtime calculation

LoRa symbol duration: `Tsym = 2^SF / BW`. For SF7 at 125 kHz:
`Tsym = 128 / 125000 = 1.024 ms`.

Payload symbols: `Nsym = 8 + max(ceil((8·PL − 4·SF + 28 + 16·CRC − 20·H) /
(4·(SF − 2·DE)))·(CR + 4), 0)` where PL = payload bytes, CRC = 2 (on),
H = 0 (explicit header), DE = 1 (low-data-rate optimize, SF≥11).

| Payload | SF | BW | Airtime (approx.) |
| --- | --- | --- | --- |
| 18 bytes (beacon) | SF7 | 125 kHz | 51.2 ms |
| 18 bytes (beacon) | SF9 | 125 kHz | 205 ms |
| 40 bytes (worst case) | SF7 | 125 kHz | 82 ms |

### 37.2 Sensitivity vs. spreading factor

| SF | Sensitivity at 125 kHz (typ.) | Gain vs SF7 |
| --- | --- | --- | --- |
| SF7 | −123 dBm | 0 dB (reference) |
| SF8 | −126 dBm | +3 dB |
| SF9 | −129 dBm | +6 dB |
| SF10 | −132 dBm | +9 dB |
| SF11 | −134.5 dBm | +11.5 dB |
| SF12 | −137 dBm | +14 dB |

### 37.3 Link budget at 433 MHz

| Contribution | Value |
| --- | --- |
| TX power (beacon, default) | +20 dBm |
| TX antenna gain (quarter-wave whip) | +2.15 dBi |
| RX antenna gain | +2.15 dBi |
| Free-space path loss at 5 km | ~99.2 dB |
| RX sensitivity (SF7) | −123 dBm |
| Total link budget (SF7, 5 km) | 20 + 2.15 + 2.15 − 99.2 + 123 ≈ 48 dB |
| Link budget (SF9, 5 km) | ≈ 54 dB |

### 37.4 Free-space path loss table

`FSPL = 32.45 + 20·log10(f_MHz) + 20·log10(d_km)`

| Distance | FSPL @ 433 MHz | FSPL @ 868 MHz (for comparison) |
| --- | --- | --- |
| 100 m | 65.2 dB | 71.2 dB |
| 500 m | 79.2 dB | 85.2 dB |
| 1 km | 85.2 dB | 91.2 dB |
| 5 km | 99.2 dB | 105.2 dB |
| 10 km | 105.2 dB | 111.2 dB |

---

## 38. NEO-6M GPS Module Reference

### 38.1 Electrical interface

| Parameter | Value |
| --- | --- |
| Operating voltage | 2.7–3.6 V (3.3 V in the reference build) |
| Supply current (acquisition) | ~67 mA |
| Supply current (tracking) | ~47 mA |
| Backup current (V_BCKP) | ~15 µA |
| Serial baud (default) | 9600 8N1 |
| Update rate | 1 Hz (default), 5 Hz configurable |
| Cold start (TTFF) | ~27 s typical |
| Warm start | ~27 s typical |
| Hot start | ~1 s typical |
| Position accuracy (CEP) | 2.5 m horizontal |
| Velocity accuracy | 0.1 m/s |

### 38.2 NMEA sentences the firmware parses

| Sentence | Content used |
| --- | --- |
| `$GPGGA` | Fix status, latitude, longitude, altitude, number of satellites |
| `$GPRMC` | (Optional) speed and course; the firmware uses GGA as primary |

### 38.3 GGA fields used by the firmware

```text
$GPGGA,hhmmss.ss,llll.lllll,a,yyyyy.yyyyy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*cs
  1        2            3  4             5  6 7  8  9   10 11 12  13
```

| Field | Meaning | Firmware use |
| --- | --- | --- |
| 1 | UTC time | Shown on the OLED status line |
| 2 | Latitude (DDMM.MMMMM) | Converted to decimal degrees |
| 3 | N/S hemisphere | Sign applied to latitude |
| 4 | Longitude (DDDMM.MMMMM) | Converted to decimal degrees |
| 5 | E/W hemisphere | Sign applied to longitude |
| 6 | Fix quality (0–8) | 0 = no fix; ≥1 = valid fix |
| 7 | Satellites in use | Displayed and included in the payload |
| 8 | HDOP | Logged in verbose serial debug |
| 9 | Altitude (m) | Included in the payload when available |

### 38.4 Fix acquisition state machine

The firmware transitions through: `NO_FIX → COLD_ACQUIRE → TRACKING →
FIX_HOLD` (a fix is held for a configurable period after the last valid GGA,
so a momentary sky blockage does not drop the beacon position). See §29 for
the full deep dive.

---

## 39. Morse Engine Reference

### 39.1 Timing model

The firmware generates Morse using the standard element-time model, where
one "unit" is `60 / WPM` milliseconds (the PARIS standard):

| Element | Duration (units) | Duration at 12 WPM |
| --- | --- | --- |
| Dot | 1 | 50 ms |
| Dash | 3 | 150 ms |
| Intra-character gap | 1 | 50 ms |
| Inter-character gap | 3 | 150 ms |
| Inter-word gap | 7 | 350 ms |

### 39.2 Character table

| Char | Code | Char | Code |
| --- | --- | --- | --- |
| A | .- | N | -. |
| B | -... | O | --- |
| C | -.-. | P | .--. |
| D | -.. | Q | --.- |
| E | . | R | .-. |
| F | ..-. | S | ... |
| G | --. | T | - |
| H | .... | U | ..- |
| I | .. | V | ...- |
| J | .--- | W | .-- |
| K | -.- | X | -..- |
| L | .-.. | Y | -.-- |
| M | -- | Z | --.. |
| 0 | ----- | 5 | ..... |
| 1 | .---- | 6 | -.... |
| 2 | ..--- | 7 | --... |
| 3 | ...-- | 8 | ---.. |
| 4 | ....- | 9 | ----.

### 39.3 Beacon payload format

The beacon transmits its own position as Morse (audible) and the same data as
a LoRa packet (machine-readable). The audible format is:

```text
SOS SOS [SATS nn] [LAT ddd mm.m] [LON ddd mm.m] [ALT nnn] [MODE x]
```

Example at 14 WPM:

```text
SOS SOS SATS 9 LAT 45 31.8 LON 11 18.2 ALT 812 MODE B
```

### 39.4 TX cycle timing

| Phase | Duration |
| --- | --- |
| Pre-announce (key-up) | 1 s |
| SOS sent twice | ~4.8 s at 14 WPM |
| Payload sent | ~20 s at 14 WPM |
| Post-announce (key-up) | 1 s |
| Inter-cycle pause | Configurable (default 5 s) |

### 39.5 Frequency offset for beaconing

The firmware applies a configurable frequency offset (±kHz) to the carrier
when keying, shifting the transmitted tone slightly so a fixed-frequency
receiver can copy Morse by ear while the SX1262 still transmits within band.
This offset is stored in the NVS config (`FREQ_OFFSET`) and is applied
per-transmission.

---

## 40. Serial Protocol — Complete Reference

### 40.1 Line protocol

- Baud: 115200, 8 data bits, no parity, 1 stop bit.
- Lines are `\n`-terminated ASCII.
- Machine-readable lines are prefixed `AEGIS:`; human console output is
  plain text and can be ignored by tooling.

### 40.2 Machine-readable lines emitted by the firmware

| Line | Example | Meaning |
| --- | --- | --- |
| `AEGIS:HELLO:` | `AEGIS:HELLO:v5.5.0` | Boot handshake, firmware version |
| `AEGIS:POS:lat=..;lng=..;alt=..;sats=..;fix=..;age=..;mode=..;freq=..` | `AEGIS:POS:lat=45.53124;lng=12.30456;alt=812.0;sats=9;fix=1;age=0;mode=BEACON;freq=433.500` | GPS position (emitted on fix, on request, and on mode change) |
| `AEGIS:TX:start` | `AEGIS:TX:start` | Transmission started (key-down) |
| `AEGIS:TX:end` | `AEGIS:TX:end` | Transmission ended (key-up) |
| `AEGIS:MODE:mode` | `AEGIS:MODE:SEARCH` | Mode changed |
| `AEGIS:ERR:code` | `AEGIS:ERR:01` | Error event (see error table) |

### 40.3 Commands the firmware accepts

| Command | Arguments | Example | Response |
| --- | --- | --- | --- |
| `FREQ` | frequency in MHz | `FREQ 433.500` | `AEGIS:FREQ:433.500` |
| `FREQ?` | — | `FREQ?` | `AEGIS:FREQ:433.500;433.475;433.525` |
| `WPM` | integer 5–40 | `WPM 14` | `AEGIS:WPM:14` |
| `WPM?` | — | `WPM?` | `AEGIS:WPM:14` |
| `MODE` | `BEACON` / `SEARCH` / `CONFIG` / `EMERGENCY` | `MODE SEARCH` | `AEGIS:MODE:SEARCH` |
| `MODE?` | — | `MODE?` | `AEGIS:MODE:BEACON` |
| `POS` | — | `POS` | `AEGIS:POS:lat=..;lng=..` (or `AEGIS:ERR:03` if no fix) |
| `STATUS` | — | `STATUS` | Multi-line device state dump |
| `SLEEP` | — | `SLEEP` | Deep sleep entered (device goes quiet) |
| `WAKE` | — | `WAKE` | (only if a wake source is available) |
| `HELP` | — | `HELP` | Lists all commands |

### 40.4 Error codes

| Code | Meaning |
| --- | --- |
| `01` | Radio init failure |
| `02` | Radio TX timeout |
| `03` | No GPS fix available |
| `04` | Invalid frequency (out of band) |
| `05` | NVS read/write failure |

---

## 41. NVS Configuration Schema — Complete Field Reference

### 41.1 Configuration keys

| Key | Type | Default | Range | Persisted |
| --- | --- | --- | --- | --- |
| `freq_bcn` | uint32 (Hz) | 433500000 | 433050000–434790000 | Yes |
| `freq_rx` | uint32 (Hz) | 433475000 | 433050000–434790000 | Yes |
| `freq_rx2` | uint32 (Hz) | 433525000 | 433050000–434790000 | Yes |
| `wpm` | uint8 | 14 | 5–40 | Yes |
| `tx_power` | int8 | 20 | 2–22 (dBm) | Yes |
| `tx_interval` | uint16 | 5000 | 1000–60000 (ms) | Yes |
| `squelch` | uint8 | 0 | 0–15 | Yes |
| `scroll_speed` | uint8 | 3 | 1–10 | Yes |
| `freq_offset` | int16 | 0 | −1000..1000 (Hz) | Yes |
| `gps_timeout` | uint16 | 120 | 10–600 (s) | Yes |
| `brightness` | uint8 | 100 | 10–100 (%) | Yes |

### 41.2 Persistence behavior

- All configuration is stored in the ESP32 NVS partition (flash).
- Writes are atomic and verified (read-back after write).
- A failed write is reported via `AEGIS:ERR:05` and the previous value is
  kept.
- Factory reset (`FACTORY` command or config menu item) erases all keys and
  restores defaults.
- Configuration survives deep sleep and power loss.

---

## 42. WiFi Dashboard HTTP API

### 42.1 Overview

The device runs a captive-style WiFi access point with a small HTTP server
that serves the configuration dashboard (and the firmware's raw HTML, which
is extracted and rendered on the website's Config Dashboard page). The API
below is served on the AP's IP (192.168.4.1).

### 42.2 Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Dashboard HTML page |
| GET | `/api/config` | JSON of all configuration values |
| POST | `/api/config` | Update one or more configuration values |
| GET | `/api/status` | Device status (mode, battery, GPS, radio) |
| POST | `/api/reboot` | Reboot the device |
| POST | `/api/factory` | Restore factory defaults and reboot |

### 42.3 JSON schema (`/api/config`)

```json
{
  "freq_bcn": 433500000,
  "freq_rx": 433475000,
  "freq_rx2": 433525000,
  "wpm": 14,
  "tx_power": 20,
  "tx_interval": 5000,
  "squelch": 0,
  "scroll_speed": 3,
  "freq_offset": 0,
  "gps_timeout": 120,
  "brightness": 100
}
```

### 42.4 POST body (`/api/config`)

```json
{ "wpm": 16, "tx_power": 22 }
```

Partial updates are allowed; only the supplied keys are changed. All values
are range-checked server-side before being written to NVS.

---

## 43. Power Architecture Deep Dive

### 43.1 Supply rails

| Rail | Source | Voltage | Consumers |
| --- | --- | --- | --- |
| VUSB | USB 5 V | 5.0 V | Charger, LDO input |
| VBAT | Battery (protected) | 3.0–4.2 V | ESP32 VIN, radio VDD, OLED VDD |
| 3V3 | AMS1117-3.3 | 3.3 V | All logic, radio, OLED, GPS |

### 43.2 Power flow

```text
USB 5V ──► Charger (TP4056, 1 A) ──► Li-ion cell (18650 or 2×18650)
                 │
                 └──► VBAT ──► AMS1117-3.3 ──► 3V3 rail
                         └──► Battery monitor divider (GPIO34)
```

### 43.3 Current consumption by state

| State | ESP32 | Radio | OLED | GPS | Total (typ.) |
| --- | --- | --- | --- | --- | --- |
| Deep sleep | 10 µA | 1 µA (standby) | off | off | ~11 µA |
| Active idle (OLED on) | 40 mA | 2 mA | 25 mA | off | ~67 mA |
| GPS acquiring | 40 mA | 2 mA | 25 mA | 67 mA | ~134 mA |
| RX listening | 40 mA | 7 mA | 25 mA | 47 mA | ~119 mA |
| TX at +20 dBm | 80 mA | 110 mA | 25 mA | off | ~215 mA |
| TX at +22 dBm (emergency) | 80 mA | 130 mA | 25 mA | off | ~235 mA |

### 43.4 Battery life estimates (18650, 3000 mAh, 3.7 V nominal)

| Use pattern | Average draw | Estimated runtime |
| --- | --- | --- | --- |
| Deep sleep + wake every 60 s for 2 s | ~1.5 mA | ~80 days |
| Beaconing every 30 s at +20 dBm | ~30 mA | ~100 h |
| Continuous RX listening | ~119 mA | ~25 h |
| Emergency mode (continuous TX) | ~235 mA | ~12 h |

### 43.5 Charging behavior

- The TP4056 charges at 1 A CC until 4.2 V, then CV with a 1/10 termination
  current.
- Charge status is indicated on the charger module's LED; the firmware does
  not read it (a future revision may add the STDBY/CHRG lines).
- Reverse-polarity and over-discharge protection is provided by the cell's
  protection PCB (or the DW01+8205 circuit on 18650 holders).
- Deep-discharge recovery: the TP4056 pre-charges at 1/10 rate below 2.9 V.

### 43.6 Low-battery behavior

| Voltage | Action |
| --- | --- |
| < 3.5 V | Battery icon shows low, warning on OLED |
| < 3.3 V | Beaconing pauses, SEARCH still allowed briefly |
| < 3.0 V | Device enters deep sleep with a wake timer (50% duty) |
| < 2.9 V | Full shutdown (charger must be applied) |

---

## 44. Deep Sleep State Machine (Full Reference)

### 44.1 Why deep sleep

The beacon is a field device. Between transmissions it should consume
microamps, not milliamps. Deep sleep achieves this by powering down the CPU,
radio, OLED and GPS, keeping only the RTC domain alive.

### 44.2 Wake sources

| Source | Mechanism | Use |
| --- | --- | --- |
| Timer | RTC timer (configurable period) | Periodic beacon cycle |
| GPIO | EXT1 wake on button press | Manual wake / mode change |
| UART | (not used) | — |

### 44.3 State flow

```text
ACTIVE ──► (idle timeout or SLEEP cmd) ──► DEEP_SLEEP
                                              │
                          wake timer / button │
                                              ▼
                                          ACTIVE (boot)
```

### 44.4 Sleep configuration

| Parameter | Default | Notes |
| --- | --- | --- |
| Sleep period | 60 s | Configurable via `SLEEP` command argument (seconds) |
| Wake GPIO mask | BTN_MODE + BTN_SEL | Any of the four buttons wakes |
| RTC memory | Preserved | Mode, last position, counters survive |
| Flash (NVS) | Unchanged | Configuration persists |

### 44.5 Deep sleep power notes

- The AMS1117 LDO consumes ~5 mA quiescent even in deep sleep — a
  significant fraction of the deep-sleep budget. Builds that need the full
  battery life should add a MOSFET load switch on the 3V3 rail, driven by a
  GPIO that the firmware drives low during sleep.
- The TP4056's quiescent draw is negligible (~1 µA).
- The GPS module must have its own power switch (MOSFET on the GPS VDD) for
  deep sleep to reach the µA range; the reference build gates GPS power with
  GPIO25.

---

## 45. GPS Fix Acquisition (Complete Walkthrough)

### 45.1 Module selection

- NEO-6M (u-blox 6): the reference module, 2.5 m CEP, 50-channel.
- NEO-M8N: drop-in compatible, 2.5 m CEP, 72-channel, faster TTFF, better
  sensitivity. Recommended upgrade; no firmware change needed.
- See [NEO-6M vs NEO-M8N](wiki) for the comparison.

### 45.2 Acquisition phases

| Phase | Condition | Duration (NEO-6M) | Notes |
| --- | --- | --- | --- |
| Cold start | No almanac, no ephemeris, no time | 27–40 s | Full sky search |
| Warm start | Almanac + time known | 27 s typ. | Ephemeris re-acquired |
| Hot start | All data < 30 s old | ~1 s | From RTC-backed RAM or backup battery |

### 45.3 Fix quality thresholds

| Fix quality (GGA field 6) | Meaning | Firmware policy |
| --- | --- | --- |
| 0 | No fix | Keep acquiring |
| 1 | GPS fix (SPS) | Accept |
| 2 | DGPS fix | Accept (preferred) |
| 4 | RTK fixed | Accept |
| 5 | RTK float | Accept with caution |

### 45.4 Fix hold logic

- Once a fix is acquired, the firmware keeps beaconing that position for a
  configurable hold period (`GPS_HOLD`, default 60 s) even if the module
  briefly loses sky view.
- A new fix replaces the held position only when it is newer (GGA timestamp)
  and valid.
- The serial line `AEGIS:POS:...age=..` reports the age of the fix in
  seconds, so tooling can see staleness.

---

## 46. Display — SSD1309 2.42" OLED (Complete Reference)

### 46.1 Panel characteristics

| Parameter | Value |
| --- | --- |
| Resolution | 128×64 |
| Driver IC | SSD1309 (SSD1306-compatible) |
| Interface | I2C (address 0x3C) |
| Viewing angle | ~160° |
| Supply | 3.3 V |
| Current (all pixels on) | ~25 mA |

### 46.2 Firmware screens

| Screen | Content |
| --- | --- |
| Status (default) | Mode, frequency, battery, satellites, last TX time |
| Position | Current lat/lng, altitude, fix age |
| Config menu | Scrolling list of configuration parameters |
| Emergency | Large SOS banner + position |
| Search | Signal strength bar, frequency, squelch |

### 46.3 Screen refresh policy

- The status screen refreshes at 1 Hz (matching the GPS update).
- The config menu redraws only on key events (no busy loop).
- The OLED is blanked after 30 s of inactivity in CONFIG mode to save power;
  any key wakes it.

---

## 47. Physical Controls — 4-Button System (Complete Reference)

### 47.1 Buttons

| Button | GPIO | Debounce | Action (context) |
| --- | --- | --- | --- |
| MODE | 26 | 50 ms | Cycle modes (BEACON → SEARCH → CONFIG → EMERGENCY); in CONFIG: cancel/exit |
| SEL | 27 | 50 ms | Confirm selection; in CONFIG: select parameter to edit |
| UP | 32 | 50 ms | Increase value; scroll up |
| DN | 33 | 50 ms | Decrease value; scroll down |

### 47.2 Long-press actions

| Button | Long press (1.5 s) |
| --- | --- |
| MODE | Power menu (sleep / reboot / factory reset) |
| SEL | Quick status dump to serial |
| UP | Brightness up |
| DN | Brightness down |

### 47.3 Key repeat

- Holding UP or DN in the config menu repeats at 250 ms after a 500 ms
  initial delay.
- Values wrap at their configured limits (e.g. WPM 5 → 40 → 5).

---

## 48. Enclosure and Mounting (Complete Reference)

### 48.1 Recommended enclosure

- 3D-printed two-part case (STL files in `hardware/`), designed for the
  DevKit V1 + SX1262 module + OLED + 18650 holder.
- Dimensions (approx.): 130 × 70 × 35 mm.

### 48.2 Antenna mounting

- SMA panel-mount connector on the short edge.
- Quarter-wave whip (16.4 cm at 433 MHz) with a 15 mm ground plane pad.
- Keep the antenna at least 20 mm from the OLED and battery to limit detuning
  and SAR.

### 48.3 Environmental

| Condition | Rating |
| --- | --- |
| Operating temperature | −20 °C to +60 °C (electronics) |
| Storage temperature | −30 °C to +70 °C |
| Humidity | 0–85% RH non-condensing (case adds protection) |
| IP rating (with gasket) | IP54 (dust + splash) |

### 48.4 Mounting options

- Molle/PALS straps for backpack attachment (two webbing slots on the case).
- M3 threaded inserts for belt clip or helmet mount.
- Lanyard eyelet for handheld carry.

---

## 49. Assembly Guide (Step-by-Step)

### 49.1 Bill of materials recap

See §21 for the full BOM with prices and alternatives.

### 49.2 Recommended assembly order

1. Solder the SX1262 module to the DevKit (or use a breakout board).
2. Wire the OLED (I2C) and confirm it initializes (`AEGIS:HELLO:` on serial
   shows display init).
3. Wire the buzzer driver and test tone output.
4. Wire the GPS module and confirm `$GPGGA` lines appear on serial (GPS TX →
   ESP32 RX).
5. Wire the four buttons and test debounce behavior.
6. Wire the battery divider and calibrate the ADC reading against a
   multimeter.
7. Fit the antenna and confirm SWR with a VNA or SWR meter.
8. Enclose and test the full field loop.

### 49.3 Quality gates

| Gate | Check | Pass criteria |
| --- | --- | --- |
| Power | USB only, no battery | No smoke, 3V3 = 3.3 V ±5% |
| Serial | `AEGIS:HELLO:` on 115200 | Handshake within 5 s of boot |
| Display | OLED shows status screen | Text readable, no artifacts |
| GPS | Outdoor or window test | Fix within 2 min |
| Radio | Loopback test | RX hears own TX at 2 m |
| Battery | Full charge, discharge | Runtime ≥ 90% of estimate |

---

## 50. Antenna Design Guide

### 50.1 Antenna types

| Type | Length (433 MHz) | Gain | Pattern | Use |
| --- | --- | --- | --- | --- |
| Quarter-wave whip | 16.4 cm | +2.15 dBi | Omnidirectional | Standard handheld |
| Half-wave dipole | 32.8 cm | +2.15 dBi | Figure-8 | Better on body |
| Helical (rubber duck) | 10–15 cm | 0–2 dBi | Omnidirectional | Compact |
| J-pole (ground plane) | 34 cm | +3 dBi | Omnidirectional | Base station |
| Yagi (5-el) | 1.2 m boom | +8 dBi | Directional | Search operations |

### 50.2 Quarter-wave whip dimensions

- Electrical length at 433.500 MHz: λ/4 = 17.3 cm in free space.
- Physical length with velocity factor (0.95 for solid wire): ~16.4 cm.
- Ground plane: 4 radials of λ/4 each (17.3 cm) or a solid 15 mm pad.

### 50.3 SWR and matching

| SWR | Reflected power | Meaning |
| --- | --- | --- |
| 1.0:1 | 0% | Perfect match (ideal) |
| 1.5:1 | 4% | Acceptable |
| 2.0:1 | 11% | Marginal — check for damage |
| 3.0:1 | 25% | Bad — do not transmit continuously |

- Matching network: series inductor or shunt cap on the feed; values depend
  on the antenna's reactive component measured with a VNA.
- The SX1262 module has a 50 Ω output; keep the feed line to the SMA
  connector as short as possible.

### 50.4 Antenna safety

- Never transmit without an antenna connected; the PA can be damaged by
  reflected power.
- Keep the antenna at least 20 cm from the body during continuous
  transmission.
- Do not operate in explosive atmospheres (fuel depots, gas leaks).

---

## 51. RF Theory Primer (for Operators)

### 51.1 Frequencies and bands

| Band | Range | Typical use in this project |
| --- | --- | --- |
| 433 MHz ISM | 433.050–434.790 MHz | Primary beacon and search band |
| 868 MHz ISM | 863–870 MHz | (Future revision; SX1262 supports it, EU regulations) |
| 915 MHz ISM | 902–928 MHz | (Future revision; US/CA regulations) |

### 51.2 Propagation

- **Line of sight**: the dominant mode at 433 MHz over open ground.
- **Diffraction**: signal bends slightly around obstacles; mountains are the
  main killer.
- **Multipath**: reflections cause fading; moving the receiver a few meters
  often restores the signal.
- **Fresnel zone**: the first Fresnel zone must be clear for reliable links;
  at 5 km and 2 m height the zone radius is ~8 m.

### 51.3 Range expectations

| Terrain | SF7 range (typ.) | SF9 range (typ.) |
| --- | --- | --- |
| Open field | 3–5 km | 6–10 km |
| Forest | 1–2 km | 2–4 km |
| Mountain valley (line of sight) | 5–8 km | 10–15 km |
| Urban | 0.5–1 km | 1–2 km |

### 51.4 Receiver sensitivity limits

- At SF7/125 kHz the sensitivity floor is −123 dBm; a signal below that is
  unrecoverable regardless of antenna.
- Raising the antenna height is the single most effective improvement for
  range: doubling height adds ~6 dB at the horizon.

---

## 52. Regulatory Compliance Reference

### 52.1 The legal landscape (summary)

Using the beacon requires a valid amateur radio license in most jurisdictions
(433.050–434.790 MHz overlaps amateur and ISM allocations; the ISM band
allows unlicensed use at low power with equipment certification, but the
project explicitly targets licensed amateur use for emergency/relief
operations). See §19 for the full legal summary.

### 52.2 Regional notes

| Region | Relevant body | Notes |
| --- | --- | --- |
| EU | ECC / national regulators | 433.050–434.790 MHz: amateur and ISM; 10 mW ERP cap on unlicensed ISM |
| Italy | MISE/AGCOM | Amateur class A/B licenses; emergency communications permitted |
| Switzerland | OFCOM | 433 MHz ISM + amateur allocations |
| Austria | RTR | Similar structure |
| Germany | BNetzA | Similar structure |
| USA | FCC | 433 MHz: ISM Part 15 at 50 mV/m (very low); amateur 70 cm band is the licensed path |
| Canada | ISED | Similar to US |

### 52.3 Operator obligations

- Identify per national rules (Morse ID or callsign in payload).
- Keep power within license limits.
- Avoid causing interference; cease operation if interference is reported.
- Log transmissions as required by your license class.

---

## 53. Security Model

### 53.1 Threat model

The beacon is an emergency device, not a security appliance. The threat model
is: accidental interference, spoofed beacons, and denial of service within
RF range. It is not designed to resist a determined adversary.

### 53.2 Protections

| Concern | Mitigation |
| --- | --- |
| Spoofed positions | Payload includes fix age and satellite count; operators cross-check with bearing |
| Interference | SEARCH mode with squelch; frequency agility (3 stored frequencies) |
| Unauthorized config | Config requires physical access or the WiFi AP password |
| WiFi AP hijack | Random SSID suffix per boot; password printed on OLED and serial |
| Serial injection | USB serial is trusted (physical access assumed) |

### 53.3 Privacy

- The device transmits position openly by design (emergency use).
- The serial bridge only listens on 127.0.0.1 and never forwards data to any
  third party; the Report Position page is a static page with no analytics.
- No telemetry, no cloud, no accounts.

---

## 54. Testing and Calibration Procedures

### 54.1 Bench setup

| Item | Purpose |
| --- | --- |
| USB cable (data) | Power + serial |
| Serial terminal (115200) | Observe `AEGIS:` lines |
| Multimeter | Verify 3V3 rail and battery divider |
| VNA or SWR meter | Antenna match |
| Second beacon or SDR | Loopback TX/RX verification |
| Variable DC supply | Battery simulation |

### 54.2 Calibration steps

1. **ADC calibration**: apply known voltages to the battery input and record
   the ADC readings; update `BAT_DIVIDER` and `BAT_OFFSET` constants.
2. **Frequency calibration**: transmit on a known frequency and verify with a
   calibrated receiver or SDR; adjust `FREQ_CAL` if off by more than ±500 Hz.
3. **WPM calibration**: play a known character sequence at the configured
   WPM and verify timing with a stopwatch (10 chars should take
   10 × 6 × 60/WPM s).
4. **Battery curve**: log voltage vs. remaining capacity during a discharge;
   update the lookup table.

### 54.3 Test matrix (regression)

| Test | Steps | Pass criteria |
| --- | --- | --- |
| Boot | Power on, observe serial | `AEGIS:HELLO:` + version |
| Mode cycle | MODE button ×4 | Each mode appears on OLED and serial |
| GPS fix | Outdoor 2 min | `AEGIS:POS:` with sats ≥ 4 |
| Beacon TX | Trigger beacon, monitor with SDR | Morse audible + LoRa packet decodes |
| SEARCH RX | Second beacon transmits | RSSI/SNR shown, squelch works |
| Config persist | Change WPM, reboot | Value restored |
| Deep sleep | SLEEP cmd | Current < 1 mA, wakes on button |
| Battery monitor | Variable supply at 3.3/3.8/4.2 V | Voltage reads within ±50 mV |

---

## 55. Serial Bridge Reference (Full)

### 55.1 Purpose

One Python script (`bridge/aegis-serial-bridge.py`) connects the beacon over
USB to the official website: it reads `AEGIS:POS:` lines, streams them to the
open Report Position page (via a loopback HTTP server) or opens the page
pre-filled, and now also keeps a local track + share link in its terminal
dashboard.

### 55.2 Requirements

- Python 3.8+ and `pyserial`.
- No API keys, no accounts, no cloud.

### 55.3 CLI reference

| Flag | Default | Meaning |
| --- | --- | --- |
| `--port` | auto | Serial port |
| `--baud` | 115200 | Baud rate |
| `--http-port` | 8765 | Loopback server port |
| `--site` | https://aegis-beacon.vercel.app | Site base URL |
| `--no-open` | off | Never open a browser |
| `--tui` | auto | Force the terminal dashboard on |
| `--no-tui` | — | Plain log lines |
| `--list` | — | List serial ports and exit |
| `--verbose` | off | Print all serial traffic |

### 55.4 Loopback endpoints

| Path | Purpose |
| --- | --- |
| `/stream` | Latest position JSON (polled by the page) |
| `/ping` | Heartbeat (page says "I am open") |
| `/state` | Latest state + page-open flag |

### 55.5 Terminal dashboard fields

| Field | Meaning |
| --- | --- |
| Device | Serial port + connection state |
| Position | Latest lat/lng |
| Share | Public site link for the latest fix (paste to share) |
| Page | Is the Report Position page open? |
| Local track | Last 8 fixes with timestamps (the path taken) |
| Live log | Rolling device/bridge messages |

---

## 56. Website Reference

### 56.1 Stack

- Astro (static site), TypeScript, Markdown wiki (440+ pages), CSS design
  system, Leaflet maps (repeaters + report-position), self-hosted fonts
  (Chakra Petch / Manrope / JetBrains Mono).
- Deployed on Vercel. Sitemap + robots.txt + full SEO/OG/Twitter meta on
  every page.

### 56.2 Pages

| Path | Purpose |
| --- | --- |
| `/` | Landing page |
| `/demo` | Interactive beacon simulator |
| `/builder` | BOM builder with budget auto-fit and price-comparison links |
| `/benchmarks` | Firmware benchmark results (CI-generated) |
| `/repeaters` | Keyless repeater map (OSM/Overpass) |
| `/report-position` | Position report page (fed by the bridge) |
| `/config-dashboard` | Live firmware configuration dashboard (extracted from the .ino) |
| `/wiki` | 440+ page documentation wiki with search |
| `/branding`, `/terms`, `/privacy`, `/disclaimer` | Brand + legal pages |

### 56.3 Wiki

The wiki covers: getting started, hardware, firmware, modes, field
operations, frequencies/legal, troubleshooting, building effectively,
USB/connectivity, the serial bridge, the website itself, and more — every
page cross-linked, searchable from the top search bar.

---

## 57. Glossary

| Term | Definition |
| --- | --- |
| AEGIS | The project's protocol prefix for machine-readable serial lines |
| Beacon | A device transmitting its position (audible Morse + LoRa) |
| CEP | Circular error probable; radius within which 50% of fixes fall |
| DDM | Degrees and decimal minutes coordinate format (`N45 53.0`) |
| DIO1 | SX1262 interrupt line used for TX/RX events |
| ERP | Effective radiated power (transmitter + antenna gain) |
| GGA | NMEA sentence carrying position, altitude and fix quality |
| ISM | Industrial, scientific and medical frequency bands |
| LoRa | Long-range chirp spread-spectrum modulation |
| NMEA | Standard GPS sentence protocol |
| NVS | Non-volatile storage (ESP32 flash) |
| PA | Power amplifier (SX1262 output stage) |
| PLL | Phase-locked loop (frequency synthesis) |
| PMR446 | License-free 446 MHz band (walkie-talkies; not used by the beacon) |
| SF | Spreading factor (LoRa) |
| SX1262 | Semtech LoRa transceiver used by the beacon |
| WPM | Words per minute (Morse speed) |

---

---

## 58. Firmware Architecture (Module-by-Module)

### 58.1 Source layout (`AegisBeacon.ino`)

| Region | Lines (approx.) | Responsibility |
| --- | --- | --- |
| Header / payload format docs | 1–120 | Protocol documentation, constants |
| Includes and pin defines | 120–220 | Board wiring, libraries |
| Configuration (NVS schema) | 220–360 | Defaults, load/save, factory reset |
| Display driver | 360–560 | SSD1309 init, screens, scroll |
| GPS driver | 560–760 | NMEA parse, fix state machine |
| Radio driver (SX1262) | 760–1100 | SPI, LoRa config, TX/RX |
| Morse engine | 1100–1300 | Key timing, character table, beacon text |
| Modes (BEACON/SEARCH/CONFIG/EMERGENCY) | 1300–1700 | Mode state machines |
| WiFi dashboard | 1700–2000 | AP, HTTP server, config API |
| Serial command handler | 2000–2200 | `AEGIS:` command parsing |
| Deep sleep management | 2200–2300 | Sleep entry, wake sources |
| `setup()` / `loop()` | 2300–end | Initialization and dispatch |

### 58.2 Module responsibilities in detail

**Configuration layer.** Loads defaults into RAM at boot, then overlays
persisted NVS values. All writes go through a single `saveConfig()` that
writes the whole struct, reads it back, and reports success/failure on
serial. Factory reset clears the NVS namespace.

**Display driver.** A minimal SSD1309 I2C driver (no external library)
provides: init sequence, full-buffer clear, 8×8 font, 6×8 mini font,
bitmap blit, and a soft-scroll routine for long lines. All drawing is
buffered to a 1 KB frame buffer to avoid tearing.

**GPS driver.** Parses `$GPGGA` lines into a position struct. Maintains a
fix state machine (NO_FIX → COLD → TRACKING → HOLD) and exposes
`getPosition()` for the beacon payload and the serial port.

**Radio driver.** Thin wrapper around the SX1262 SPI command set. Configures
LoRa params per mode, performs TX with timeout, RX with timeout, and reports
RSSI/SNR. A single `radioSend(payload, len)` function is used by both
BEACON and EMERGENCY modes.

**Morse engine.** Converts the payload string into key-up/key-down timing.
The keying waveform is applied to the buzzer (audio) and optionally to the
radio carrier (frequency offset keying).

**Mode state machines.** Each mode is a `switch` in the main loop with its
own timing budget, so BEACON never blocks SEARCH and vice versa. Mode
changes are requested via button or serial command and take effect at the
next loop iteration.

**WiFi dashboard.** Brings up a soft-AP (`AegisBeacon-XXXX`) with a captive
portal HTTP server on 192.168.4.1. Serves the configuration HTML (the same
page rendered on the website's Config Dashboard) and the JSON API.

**Serial command handler.** Parses `AEGIS:` lines and dispatches to the
appropriate subsystem. Every command logs its effect; errors return
`AEGIS:ERR:xx`.

**Deep sleep.** A single `enterDeepSleep()` that configures the wake sources
(timer + buttons), powers down peripherals, and calls `esp_deep_sleep()`. On
wake the device reboots into the previously selected mode.

---

## 59. Operating Modes — Complete Specification

### 59.1 BEACON mode

**Purpose:** periodically transmit the device's position as Morse (audible)
and LoRa (machine-readable).

| Parameter | Default | Range |
| --- | --- | --- |
| Interval | 30 s | 10–600 s |
| Power | +20 dBm | 2–22 dBm |
| Frequency | freq_bcn | 433.050–434.790 MHz |
| WPM | 14 | 5–40 |

Transmission cycle: pre-announce key-up (1 s) → SOS ×2 → payload →
post-announce (1 s) → pause. During the pause the receiver side can listen.

### 59.2 SEARCH mode

**Purpose:** receive and demodulate a beacon's LoRa signal, show RSSI/SNR
and the decoded position on the OLED, and optionally alert when the signal
rises above a squelch threshold.

| Parameter | Default | Range |
| --- | --- | --- |
| Frequency | freq_rx | 433.050–434.790 MHz |
| Squelch | 0 | 0–15 |
| Scan (multi-freq) | freq_rx + freq_rx2 | both configured |

### 59.3 CONFIG mode

**Purpose:** edit all configuration values with the four buttons, or via the
WiFi dashboard / serial commands.

Button map: MODE cycles parameters, UP/DN change the value, SEL confirms and
moves on, MODE long-press exits.

### 59.4 EMERGENCY mode

**Purpose:** transmit continuously at maximum power until cancelled — the
"find me now" mode.

| Parameter | Value |
| --- | --- |
| Power | +22 dBm (maximum) |
| Frequency | freq_bcn |
| Payload | SOS + position, repeated |
| Cancellation | Any button, or serial `MODE BEACON` |

> [!WARNING]
> EMERGENCY mode transmits at maximum power continuously. Use it only when
there is a genuine emergency and a licensed operator is in control of the
frequency.

---

## 60. GPS Payload Specification (Byte-Level)

### 60.1 LoRa payload layout

| Byte offset | Field | Size | Encoding |
| --- | --- | --- | --- |
| 0 | Magic | 2 | ASCII `AB` |
| 2 | Version | 1 | uint8 (0x01) |
| 3 | Mode | 1 | enum (0=BEACON, 1=SEARCH, 2=CONFIG, 3=EMERGENCY) |
| 4 | Fix quality | 1 | uint8 (0–8) |
| 5 | Satellites | 1 | uint8 |
| 6–9 | Latitude | 4 | int32 microdegrees |
| 10–13 | Longitude | 4 | int32 microdegrees |
| 14–15 | Altitude | 2 | int16 meters |
| 16 | Frequency (index) | 1 | uint8 (index into configured list) |
| 17 | CRC8 | 1 | CRC-8 over bytes 0–16 |

Total: 18 bytes.

### 60.2 Coordinate encoding

- Latitude and longitude are transmitted as microdegrees (degrees × 1e6),
  little-endian int32.
- Range checks: |lat| ≤ 90e6, |lng| ≤ 180e6. Values outside are clamped.

### 60.3 CRC8

- Polynomial 0x07 (CRC-8/ATM), init 0x00, no reflection, no final XOR.
- Computed over the 17 bytes before the CRC field.

---

## 61. Morse Payload Specification (Human-Readable)

### 61.1 Audible format

```text
SOS SOS SATS nn LAT ddd mm.m LON ddd mm.m ALT nnnn MODE X
```

### 61.2 Field rules

- All numbers are sent digit-by-digit (no words).
- Coordinates use the DDM format: `LAT 45 31.8` means 45°31.8′ N.
- The mode letter: B (beacon), S (search), C (config), E (emergency).
- Prosigns: the SOS group is sent as three dots, three dashes, three dots
  with character gaps, exactly as in the ITU standard.

---

## 62. Benchmarks (Reference Table)

The benchmark suite compiles the firmware for a matrix of target boards and
measures flash/RAM usage; results are published on the website's
Benchmarks page by CI. See the wiki's Benchmark Methodology page for how the
runs are executed.

| Board / env | Flash (used) | RAM (used) | Notes |
| --- | --- | --- | --- |
| ESP32 DevKit V1 (reference) | ~81.8% | ~16.2% | Primary target |
| ESP32-S3 DevKit | ~79% | ~15% | Alternative with native USB |
| ESP32-C3 Super Mini | ~88% | ~19% | Smaller flash; some features trimmed |

> [!NOTE]
> Exact numbers are regenerated on every push and stored as a CI artifact;
> the values above are representative snapshots. Live results live on the
> Benchmarks page.

---

## 63. FAQ — Expanded

### 63.1 General

**Q: Is this a commercial product?**
A: No. It is an open-source emergency radio-location project (MIT license).
You build it yourself; the site provides the BOM, wiring, firmware and wiki.

**Q: Do I need a license to use it?**
A: In most countries, transmitting on the amateur bands requires a license.
The 433 MHz ISM band allows low-power unlicensed use with certified
equipment, but for real emergency operations you should hold a valid amateur
license and follow your national rules. See §19 and §52.

**Q: Can I use it without GPS?**
A: Yes for SEARCH and CONFIG. BEACON requires a fix to transmit a position;
without one it waits (and reports `AEGIS:ERR:03` on serial).

### 63.2 Hardware

**Q: Which ESP32 board works?**
A: Any ESP32 DevKit V1-class board with 4 MB flash. ESP32-S3 and C3 variants
work with minor pin re-mapping (see wiki).

**Q: Can I use a NEO-M8N instead of the NEO-6M?**
A: Yes — drop-in, same UART, better sensitivity and TTFF. See the wiki
comparison page.

**Q: What battery should I use?**
A: One 18650 (2000–3000 mAh) for portability, or two in parallel for
longer runtime. The TP4056 charger handles 3.7 V Li-ion cells.

**Q: My OLED stays black.**
A: Check I2C wiring (SDA/SCL), the 4.7 kΩ pull-ups, and the address (0x3C).
See the troubleshooting matrix §32.

**Q: My range is short.**
A: Check the antenna connection, SWR, and that you are using SF9 in SEARCH.
Height is everything — raise the antenna.

### 63.3 Firmware

**Q: How do I update the firmware?**
A: Flash via PlatformIO (`pio run -t upload`) or the Arduino IDE with the
ESP32 core. See the wiki's firmware flashing page.

**Q: How do I reset to factory defaults?**
A: `FACTORY` serial command, or the factory-reset item in the CONFIG menu.
The device reboots with defaults.

**Q: The beacon doesn't transmit.**
A: Check for a GPS fix (BEACON requires one), check the frequency is in
band, and verify the antenna is connected.

**Q: What does `AEGIS:ERR:02` mean?**
A: A radio TX timeout — the SX1262 did not confirm transmission within the
expected window. Usually a hardware/power issue; see §32.

### 63.4 Field operation

**Q: How do I find a beacon?**
A: Put your second unit in SEARCH mode on the beacon's frequency, follow the
signal strength, and let the bridge log positions. The wiki has a full
homing procedure.

**Q: Can the beacon be tracked in real time?**
A: Yes — via the serial bridge to the Report Position page, or with a
computer running the bridge and its local track dashboard.

**Q: What happens in a real emergency?**
A: Switch to EMERGENCY mode: continuous maximum-power transmissions of SOS +
position. Every licensed operator in range can home in.

---

## 64. Version History (v5.x line)

| Version | Highlights |
| --- | --- |
| v5.0 | Astro website migration, wiki launch, first benchmarks |
| v5.1 | Config dashboard, serial protocol v1, bridge v1 |
| v5.2 | Repeater map, SEO overhaul, 200+ wiki pages |
| v5.3 | Wiki search, workflow consolidation, 400+ wiki pages |
| v5.4 | Firmware encoder fix, emergency power correction, loop refactor |
| v5.5 | Bridge TUI + local tracking, disclaimer, JSON-LD, datasheet expansion, config-dashboard live extraction, workflow hardening |

---

---

## 65. Wiring Diagrams (ASCII)

### 65.1 Radio (SX1262 module)

```text
ESP32 DevKit                SX1262 module
─────────────               ─────────────
GPIO18 (SCK)  ────────────► SCK
GPIO19 (MISO) ◄──────────── MISO
GPIO23 (MOSI) ────────────► MOSI
GPIO5  (NSS)  ────────────► NSS
GPIO14 (RST)  ────────────► RST
GPIO2  (DIO1) ◄──────────── DIO1
GPIO4  (BUSY) ◄──────────── BUSY
3V3           ────────────► VDD
GND           ────────────► GND
```

### 65.2 OLED (SSD1309, I2C)

```text
ESP32 DevKit                SSD1309 2.42" OLED
─────────────               ──────────────────
GPIO21 (SDA)  ────────────► SDA
GPIO22 (SCL)  ────────────► SCL
3V3           ────────────► VDD
GND           ────────────► GND

Pull-ups: 4.7 kΩ from SDA to 3V3, 4.7 kΩ from SCL to 3V3
Address: 0x3C
```

### 65.3 GPS (NEO-6M)

```text
ESP32 DevKit                NEO-6M module
─────────────               ─────────────
GPIO16 (GPS_RX) ◄────────── TX
GPIO17 (GPS_TX) ──────────► RX
3V3           ────────────► VCC
GND           ────────────► GND

(Optional: V_BCKP to a coin cell or supercap for hot starts)
```

### 65.4 Buzzer (with driver transistor)

```text
ESP32 DevKit                Buzzer driver
─────────────               ─────────────
GPIO25 (BZ)  ──► 1 kΩ ──► Base (2N2222)
Emitter                ──► GND
Collector              ──► Buzzer (-)
Buzzer (+)             ──► 3V3 (or VBAT for louder)

Flyback diode across buzzer terminals (1N4148, cathode to +)
```

### 65.5 Buttons

```text
ESP32 DevKit                Buttons (active-low)
─────────────               ────────────────────
GPIO26 (BTN_MODE) ──┬── [MODE] ── GND
GPIO27 (BTN_SEL)  ──┬── [SEL]  ── GND
GPIO32 (BTN_UP)   ──┬── [UP]   ── GND
GPIO33 (BTN_DN)   ──┬── [DN]   ── GND

Internal pull-ups enabled in firmware (INPUT_PULLUP)
```

### 65.6 Battery monitor

```text
Battery (+) ──┬── 100 kΩ ──┬── GPIO34 (ADC1_CH6)
              │            │
              └── 100 kΩ ──┴── GND

Scale: 2:1 divider → ADC reads 0–3.1 V for 0–6.2 V battery
```

---

## 66. Soldering Guide

### 66.1 Tools

| Tool | Recommendation |
| --- | --- |
| Soldering iron | 30–40 W temperature-controlled, ~350 °C tip |
| Solder | 0.5–0.8 mm leaded 60/40 or lead-free SAC305 |
| Flux | Rosin pen or paste (essential for module pins) |
| Magnifier | 10× loupe or USB microscope |
| Desoldering | Braid or vacuum pump |
| Fume extractor | Recommended (lead and flux fumes) |

### 66.2 Technique notes

- Tin the pads first, then place the component and reflow each joint.
- For SX1262 module pins: apply flux generously, drag-solder with a clean
  tip, then inspect under magnification.
- Keep heat time under 3 s per joint; the modules have small thermal mass.
- Clean flux residue with isopropyl alcohol after soldering.
- Inspect every joint: cold joints (dull, cracked) are the #1 cause of
  intermittent failures.

### 66.3 Quality checklist

| Check | Method |
| --- | --- |
| No bridges between pins | Magnifier + continuity test on adjacent pins |
| No cold joints | Pull test on wires; shine check on solder |
| No solder splashes | Visual inspection, especially under the OLED |
| Correct orientation | Compare silkscreen, IC pin 1 markers |

---

## 67. PCB Design Notes (for Custom Boards)

### 67.1 Stackup

- 2-layer FR4, 1.6 mm, 1 oz copper (standard).
- Ground plane on layer 2; signals on layer 1.

### 67.2 Layout rules

| Rule | Value |
| --- | --- |
| Antenna keep-out | 15 mm around the SMA pad, no copper/ground pour |
| 50 Ω trace | 1.6 mm FR4, 1 oz: ~2.8 mm wide for 50 Ω microstrip |
| Decoupling | 100 nF per IC near the VDD pin |
| GPS antenna | External patch with clear sky view, keep away from radio antenna |
| Crystal/TCXO | Keep traces short, guard with ground |
| USB | Differential pair, series 22 Ω resistors |

### 67.3 EMC considerations

- Filter the radio's PA supply with a ferrite bead + 10 µF bulk cap.
- Place the battery monitor divider close to the ESP32 ADC pin.
- Keep the buzzer (inductive load) away from the radio and GPS antenna.
- Add an ESD diode array on the USB D+/D− lines.

---

## 68. Field Operations Manual

### 68.1 Pre-mission checklist

| Item | Status |
| --- | --- |
| Battery charged (≥3.8 V) | ☐ |
| Antenna connected and tight | ☐ |
| Frequency agreed with the team | ☐ |
| GPS fix acquired before departure | ☐ |
| Bridge + laptop ready (if logging) | ☐ |
| Spare battery / power bank | ☐ |

### 68.2 During the mission

- Keep the beacon's antenna vertical and clear of your body.
- In BEACON mode, verify a fix every 5 minutes (OLED satellites count).
- Log every position change in the field log (see the wiki's beacon log
  template).
- If the signal drops, move 50–100 m and re-check; multipath nulls are
  common.

### 68.3 Homing procedure (finding a beacon)

1. Set the receiver to SEARCH mode on the beacon's frequency.
2. Note the RSSI/SNR — walk in the direction of increasing signal.
3. At close range (RSSI > −70 dBm), switch to the Morse audio to confirm
   the beacon's identity and exact position.
4. If the signal fades, backtrack and try another route (ridge vs valley).
5. On arrival, record the final position and time in the log.

### 68.4 Post-mission

- Power off the beacon (long-press MODE → Power menu).
- Recharge; store at 40–60% charge if unused for weeks.
- Download the bridge log / track for the incident report.

---

## 69. EMC and Interference

### 69.1 Sources of interference

| Source | Band | Mitigation |
| --- | --- | --- |
| Other 433 MHz devices (car keys, sensors) | 433.05–434.79 | Frequency agility; SEARCH scans 3 channels |
| LTE/GSM harmonics | 700–900 MHz | Keep phone away from radio antenna |
| Motor noise (quads, snowmobiles) | broadband | Physical separation |
| High-voltage lines | broadband | Avoid under lines; use SF9 |

### 69.2 Self-interference

- The ESP32's WiFi (2.4 GHz) can de-sense the 433 MHz radio when both are
  active. The firmware disables WiFi unless the dashboard is explicitly
  started (CONFIG mode).
- The OLED's I2C clock (400 kHz) has harmonics; keep the display data lines
  away from the radio's SPI.

### 69.3 Testing for interference

- With the beacon TXing at +20 dBm, walk a second unit 10 m away in SEARCH
  and confirm clean decodes (SNR ≥ +3 dB).
- If decodes fail intermittently, check for a nearby device transmitting on
  433 MHz (garage openers, tire sensors).

---

## 70. Benchmarks — Methodology (What CI Measures)

On every push, the Benchmarks workflow compiles the firmware for a matrix of
boards and records: flash usage (bytes and %), RAM usage (bytes and %),
compile time, and warnings. The results are written to the workflow summary
and an artifact; the website's Benchmarks page renders the latest snapshot.

| Metric | How measured |
| --- | --- |
| Flash used | From the linker map (`text + data` sections) |
| RAM used | From the linker map (`data + bss`) |
| Compile time | Wall-clock of the PlatformIO build |
| Warnings | Parsed from the compiler log |

See the wiki page [Benchmark Methodology](benchmark-methodology) for the full
procedure and the design decisions behind the numbers.

---

## 71. Report Position Page Reference

### 71.1 Purpose

The Report Position page (`/report-position`) shows a received position on a
map. It can be fed three ways:

1. **By URL parameters** — open
   `/report-position?lat=45.123&lng=11.456&alt=812&sats=9&mode=BEACON`.
2. **By the serial bridge** — the bridge streams fixes to the open page via
   the loopback server.
3. **Manually** — paste an `AEGIS:POS:` line into the input box and the form
   fills in.

### 71.2 Behavior

- Each new fix draws a marker; moving fixes draw a polyline track.
- A "Open in Google Maps" / "OpenStreetMap" link is shown for the latest
  fix.
- The page polls the bridge's loopback endpoint at 1 Hz while open.
- No data is sent to any third party; the map tiles come from OSM.

---

## 72. Repeaters Page Reference

### 72.1 Purpose

The Repeaters page (`/repeaters`) plots amateur radio repeaters near you on a
keyless Leaflet map: OpenStreetMap tiles + Overpass API queries, no API key.

### 72.2 Features

- Browser geolocation ("Near me") or manual center.
- Band filters (6 m / 2 m / 70 cm / all).
- Click a marker for callsign, frequency, offset, CTCSS, and a link to the
directory source.
- Graceful degradation: if the Overpass pool is busy, a curated fallback
dataset is shown with a banner.

---

## 73. Config Dashboard Reference

### 73.1 How it works

The Config Dashboard page (`/config-dashboard`) renders the *actual* WiFi
configuration interface from the firmware: a build-time script extracts the
`R"HTMLDOC(...)"` raw string from `AegisBeacon.ino` and injects it into the
page. When the firmware's dashboard changes, the website updates with the
next build — no manual copy.

### 73.2 What it shows

A live, faithful preview of the on-device configuration screen (frequency,
WPM, TX power, interval, squelch, offset, GPS timeout, brightness), plus
notes on how to reach the real dashboard (connect to the `AegisBeacon-XXXX`
AP, open http://192.168.4.1).

---

---

## 74. Component Reference — TP4056 Charger

### 74.1 Overview

The TP4056 is a linear single-cell Li-ion charger. The module used in the
reference build adds a DW01A protection IC and an 8205A dual MOSFET for
over-charge, over-discharge and over-current protection.

### 74.2 Parameters

| Parameter | Value |
| --- | --- |
| Charge current (programmed) | 1 A (R_PROG = 1.2 kΩ) |
| Charge voltage | 4.2 V ±1% |
| Pre-charge threshold | 2.9 V (1/10 current) |
| Termination current | 1/10 of programmed current (100 mA) |
| Input voltage | 4.5–5.5 V (USB) |
| Quiescent (standby) | ~55 µA |

### 74.3 Behavior states

| State | CHRG LED | STDBY LED |
| --- | --- | --- |
| Charging | ON | OFF |
| Charge complete | OFF | ON |
| No battery / fault | OFF (blink) | OFF |

### 74.4 Integration notes

- Input from USB 5 V via the same connector the ESP32 uses (or a second
  port).
- The battery output (B+/B−) feeds the system VBAT rail; the ESP32 can run
  while charging (load sharing is passive — the charger may cycle if the
  load exceeds 1 A; acceptable for this project's draw).
- Do not connect a second charger in parallel.

---

## 75. Component Reference — AMS1117-3.3 LDO

| Parameter | Value |
| --- | --- |
| Output | 3.3 V ±2% |
| Dropout | 1.1 V max at 1 A (typically ~0.9 V at 500 mA) |
| Input range | 4.75–12 V (device), 4.5 V min with dropout |
| Output current | 1 A max |
| Quiescent current | ~5 mA (typical of the 1117 family) |
| Ripple rejection | ~60 dB at 120 Hz |

### 75.1 Why it matters

- With a 3.7 V Li-ion, the LDO runs at the edge of dropout (3.7 − 1.1 =
  2.6 V < 3.3 V output — actually *below* regulation). In practice the
  ESP32 and peripherals keep working down to ~3.2–3.4 V because the 1117
  output collapses gradually. This is the main reason the low-battery
  thresholds (§43.6) are set where they are.
- A future revision may swap the LDO for a buck converter (e.g. TPS54302)
  for efficiency and lower dropout; the deep-sleep current would also drop
  (buck quiescent ~15 µA vs ~5 mA).

---

## 76. Component Reference — 2N2222 Buzzer Driver

| Parameter | Value |
| --- | --- |
| Type | NPN BJT, TO-92 |
| V_CE(sat) | 0.3 V at 150 mA |
| h_FE | 100–300 |
| Base resistor | 1 kΩ (limits base current to ~3 mA at 3.3 V) |
| Collector load | Buzzer coil (typ. 30–60 Ω) |
| Flyback | 1N4148 across the buzzer (cathode to +) |

### 76.1 Drive math

With a 3.3 V logic high and 1 kΩ base resistor, base current ≈ (3.3 − 0.7) /
1000 ≈ 2.6 mA; with h_FE ≈ 100 that supports up to 260 mA of collector
current — far more than the ~60 mA the buzzer needs, so the transistor
saturates cleanly.

---

## 77. Battery Chemistry Reference

### 77.1 Li-ion 18650

| Parameter | Value |
| --- | --- |
| Nominal voltage | 3.6–3.7 V |
| Full charge | 4.2 V |
| Discharge cutoff | 2.5–3.0 V (protection PCB) |
| Cycle life | 300–500 cycles (to 80% capacity) |
| Operating temperature | 0–45 °C charge, −20–60 °C discharge |
| Self-discharge | ~2–3% per month |

### 77.2 Voltage vs. state of charge (typical)

| SOC | Voltage (rest, no load) |
| --- | --- |
| 100% | 4.20 V |
| 90% | 4.10 V |
| 75% | 3.95 V |
| 50% | 3.80 V |
| 25% | 3.65 V |
| 10% | 3.50 V |
| 0% | 3.30 V (under load it dips lower) |

### 77.3 Care

- Store at 40–60% charge (3.7–3.8 V) for long idle periods.
- Do not charge below 0 °C or above 45 °C.
- Use protected cells or rely on the TP4056 module's DW01A protection.
- Replace cells that swell, overheat, or lose > 20% capacity.

---

## 78. Radio Library Reference (SX1262)

### 78.1 SPI transaction flow

Every radio operation follows: set NSS low → send opcode (+ optional
address/data) → wait for BUSY to clear → set NSS high. The firmware uses a
5 ms BUSY timeout and treats a timeout as `AEGIS:ERR:01`.

### 78.2 Initialization sequence (boot)

1. Hardware reset (RST low ≥ 100 µs, then high).
2. Wait for BUSY low.
3. `SetStandby(STDBY_RC)`.
4. `Calibrate` (all blocks).
5. `SetPacketType(LORA)`.
6. `SetRfFrequency(freq)`.
7. `SetModulationParams(SF, BW, CR, LDRO)`.
8. `SetPacketParams(...)`.
9. `SetTxParams(power, ramp)`.
10. `SetDioIrqParams(...)`.
11. `SetBufferBaseAddress(0, 0)`.
12. `SetRegulatorMode(DCDC)` (if the DC-DC inductor is fitted).

### 78.3 TX flow

1. `SetStandby` → 2. `WriteBuffer(payload)` → 3. `SetTx(timeout)` →
4. wait for DIO1 (TX_DONE) → 5. `GetIrqStatus`/`ClearIrqStatus` →
6. `SetStandby`. A missing DIO1 within the timeout produces `AEGIS:ERR:02`.

### 78.4 RX flow (SEARCH)

1. `SetStandby` → 2. `SetRx(timeout)` → 3. wait for DIO1 (RX_DONE or
TIMEOUT) → 4. `ReadBuffer` → 5. `GetPacketStatus` (RSSI/SNR) →
6. `ClearIrqStatus` → 7. `SetStandby`. RX timeout is set to one
inter-transmission window so the receiver wakes periodically.

---

## 79. GPS Module Comparison (NEO-6M vs NEO-M8N)

| Feature | NEO-6M | NEO-M8N |
| --- | --- | --- |
| Channels | 50 | 72 |
| Horizontal accuracy (CEP) | 2.5 m | 2.5 m |
| Cold start TTFF | ~27 s | ~26 s |
| Sensitivity (tracking) | −161 dBm | −167 dBm |
| Sensitivity (cold start) | −147 dBm | −148 dBm |
| Update rate | 1 Hz (5 Hz opt.) | 1 Hz (up to 10 Hz) |
| SBAS support | GPS only | GPS + GLONASS + SBAS |
| Supply | 2.7–3.6 V | 2.7–3.6 V |
| Price (typical) | ~€6 | ~€10 |
| Firmware change needed | None | None (drop-in) |

---

## 80. Complete Configuration Walkthrough

### 80.1 Scenario: change the beacon frequency and speed

**Via buttons (CONFIG mode):**
1. Press MODE until CONFIG appears.
2. MODE selects parameters; UP/DN change values.
3. Find `FREQ BCN`, set to 433.500 MHz, SEL to confirm.
4. Find `WPM`, set to 16, SEL to confirm.
5. MODE long-press to exit and save.

**Via serial:**
```
FREQ 433.500
WPM 16
STATUS
```

**Via the WiFi dashboard:**
1. Connect to the `AegisBeacon-XXXX` AP.
2. Open http://192.168.4.1, edit the fields, save.
3. The device confirms and persists to NVS.

All three paths write the same NVS keys (§41).

---

## 81. CI/CD Reference

### 81.1 Workflows

| Workflow | Triggers | What it does |
| --- | --- | --- |
| Website CI | push / PR | astro check, build, verify script (SEO, sitemap, robots, broken links, nav coverage, content gates), security audit |
| Firmware CI | push / PR | PlatformIO compile for the target matrix |
| Benchmarks | push | Compiles for the benchmark matrix, writes results to the summary + artifact — never commits |
| PR checks | PR | Conventional-commit title/message validation, root-doc consistency, legacy-file rejection |

### 81.2 Content gates (website)

| Gate | Rule |
| --- | --- |
| Emoji | No emoji in UI source |
| Em-dash | No em-dash in UI source (markdown docs may use it) |
| AI strings | No AI/co-author strings in code (policy page excluded) |
| External fonts | No Google Fonts links in built HTML (fonts are self-hosted) |
| Wiki nav | Every wiki page registered in the navigation |
| Localhost | No localhost URLs in production pages |

---

## 82. Legal Deep Dive — Italy

### 82.1 Amateur radio in Italy

- Administered by the Ministry (MISE) with AGCOM oversight.
- Classes: A (full, all bands ≥ 30 MHz with Morse or exam credit) and B
  (restricted, VHF/UHF).
- 433.050–434.790 MHz is inside the 70 cm amateur allocation (430–440 MHz).
- Emergency communications by licensed amateurs are expressly contemplated
  (art. 106 Codice delle Comunicazioni Elettroniche).

### 82.2 ISM unlicensed use

- 433.050–434.790 MHz is also an ISM band in the EU (ERC/REC 70-03).
- Unlicensed operation is capped at 10 mW ERP and requires CE-marked
  equipment. The beacon at +20 dBm exceeds that, so licensed amateur use is
  the intended path.

### 82.3 Practical guidance

- Hold at least a class B license for VHF/UHF (the 70 cm band qualifies).
- Identify with your callsign per the rules.
- For organized relief work, coordinate with the regional civil-protection
  net (e.g. the mountain-rescue services listed in §25).

---

## 83. Legal Deep Dive — EU / ECC

### 83.1 The 70 cm band in Europe

- 430–440 MHz is the primary amateur allocation across the CEPT countries.
- 433.05–434.79 MHz overlaps with ISM (ERC/REC 70-03 annex 1).
- National tables may add restrictions (bandwidth, power, duplex).

### 83.2 Emergency provisions

- CEPT Recommendation T/R 61-01 encourages administrations to allow amateur
  emergency communications.
- Many national societies (IARU Region 1 members) have formal emergency
  communication groups (e.g. Italian, Swiss, Austrian mountain-rescue nets).

### 83.3 Equipment rules

- Homemade equipment may be used under an amateur license; it must meet
  national EMC requirements (EN 301 489 series) and not cause harmful
  interference.
- Selling or CE-marking the beacon as a product would require certification;
  the project explicitly remains open-source DIY.

---

## 84. Legal Deep Dive — Switzerland, Austria, Germany

### 84.1 Switzerland (OFCOM)

- 430–440 MHz amateur; 433.05–434.79 MHz also ISM with the 10 mW ERP cap.
- Amateur license classes HB3 (novice), HB9 (full).

### 84.2 Austria (RTR)

- 430–440 MHz amateur; ISM overlap as in the EU annex.
- License classes: beginner (OE3…) and general (OE1…).

### 84.3 Germany (BNetzA)

- 430–440 MHz amateur; ISM 433.05–434.79 MHz (10 mW ERP cap).
- License classes: class E (novice) and class A (full).

All three follow the CEPT table; the beacon's settings (433.050–434.790 MHz,
≤ +22 dBm, licensed use) fit the amateur path in each.

---

---

## 85. Serial Command Examples (Worked Sessions)

### 85.1 Session A — configure and verify

```text
> AEGIS:HELLO:v5.5.0          ← device boots
> FREQ 433.500                ← set beacon frequency
AEGIS:FREQ:433.500
> WPM 16
AEGIS:WPM:16
> MODE SEARCH
AEGIS:MODE:SEARCH
> STATUS
AEGIS:STATUS:mode=SEARCH;freq=433.500000;batt=3.92V;sats=0;fix=0
> MODE BEACON
AEGIS:MODE:BEACON
```

### 85.2 Session B — bridge capture

```text
[device] AEGIS:POS:lat=45.531240;lng=12.304560;alt=812.0;sats=9;fix=1;age=0;mode=BEACON;freq=433.500
[bridge] share link: https://aegis-beacon.vercel.app/report-position?lat=45.531240&lng=12.304560&alt=812.0&sats=9.0&mode=BEACON
[bridge] page is open, streaming update to it
[device] AEGIS:POS:lat=45.531300;lng=12.304620;alt=812.0;sats=9;fix=1;age=0;mode=BEACON;freq=433.500
[bridge] page is open, streaming update to it
```

### 85.3 Session C — error handling

```text
> POS
AEGIS:ERR:03                  ← no fix yet
> FREQ 500.000                ← out of band
AEGIS:ERR:04
> FREQ 433.500
AEGIS:FREQ:433.500
```

---

## 86. Display Glyphs and Icons

The OLED uses a custom 8×8 font plus a set of small glyphs:

| Glyph | Location | Meaning |
| --- | --- | --- |
| Battery (5 segments) | top-right | Charge level 0–100% |
| Satellite dish | next to sats | Satellite count ≥ 1 |
| TX dot | next to frequency | Currently transmitting |
| RX bars (SEARCH) | center | Signal strength 0–5 bars |
| Lock | CONFIG | Configuration locked/saving |
| SOS (big, 2× font) | EMERGENCY | Emergency mode banner |

Font metrics: 8×8 base font; 6×8 mini font for dense tables; 16×16 double
font for the emergency banner. Line height 10 px; 6 lines fit the 64 px
tall panel.

---

## 87. Watchdog and Fault Handling

### 87.1 Watchdogs

| Watchdog | Purpose | Timeout | Recovery |
| --- | --- | --- | --- |
| Task watchdog | Main loop livelock detection | 5 s | Panic reboot |
| I2C timeout | OLED stall | 200 ms per transaction | Skip frame, retry next cycle |
| SPI busy timeout | SX1262 BUSY stuck | 5 ms | `AEGIS:ERR:01`, re-init radio |
| GPS line timeout | NMEA starvation | 2 s | Re-sync on next `$` |

### 87.2 Error escalation

| Error | Count | Escalation |
| --- | --- | --- |
| Radio init failure | 3 consecutive | Enter safe mode (beacon disabled, serial explains) |
| GPS no-fix | 10 min | Deep sleep 60 s and retry (saves battery) |
| NVS write failure | 3 consecutive | Factory-reset prompt on serial |

---

## 88. Firmware Build System (PlatformIO)

### 88.1 Environment

| Item | Value |
| --- | --- |
| Platform | espressif32 |
| Board | esp32dev (DevKit V1) |
| Framework | Arduino |
| Flash | 4 MB (default partition scheme) |
| Upload speed | 921600 baud |

### 88.2 Build commands

```bash
pio run                  # compile
pio run -t upload        # compile + flash
pio run -t monitor       # serial monitor at 115200
pio run -e esp32dev      # specific environment
pio check                # static analysis (clang-tidy subset)
```

### 88.3 Flash and RAM budget

| Section | Bytes | % of flash (4 MB) |
| --- | --- | --- |
| Program (text) | ~850 KB | ~20% |
| Data (rodata) | ~180 KB | ~4% |
| Total sketch | ~2.1 MB with libs | ~51% of the app partition |

> [!NOTE]
> The exact numbers are regenerated by the Benchmarks workflow on every
> push; see the Benchmarks page for the live matrix.

---

## 89. Fuses and Boot Options

| eFuse / option | Default | When to change |
| --- | --- | --- |
| JTAG | Enabled | Disable for hardened field builds (optional) |
| Flash encryption | Disabled | Out of scope (open firmware) |
| Secure boot | Disabled | Out of scope |
| ROM messages | Enabled | Keep for serial debugging |

No fuses need changing for normal operation. The firmware never calls
`esp_efuse_*` APIs.

---

## 90. Thermal Considerations

| Component | Max junction | Typical dissipation |
| --- | --- | --- |
| AMS1117 (from 4.2 V to 3.3 V, 200 mA) | 125 °C | (4.2−3.3) × 0.2 ≈ 0.18 W |
| SX1262 PA (+22 dBm, 50% duty) | 125 °C | ~0.5 W peak |
| TP4056 (1 A charge) | 125 °C | ~0.7 W (5 V − 4.2 V) × 1 A |

- In continuous emergency TX, the radio module can reach 45–55 °C in still
  air; this is within spec but the enclosure should have a vent near the
  radio.
- The TP4056 throttles itself thermally (reduces current above ~120 °C
  junction) so charging in a sealed case is safe but slower.

---

## 91. Firmware Versioning and OTA

### 91.1 Version string

- The firmware reports `AEGIS:HELLO:v5.5.0` at boot.
- Version lives in one define; the wiki changelog and the DATASHEET version
  history (§64) are updated in lockstep.

### 91.2 OTA

- Not currently implemented; updates are done over USB serial.
- The partition scheme leaves room for a future dual-slot OTA layout.

---

## 92. Wiki Content Map (Group Overview)

| Group | Covers |
| --- | --- |
| Getting Started | What it is, quick start, first power-on |
| Hardware & Build | BOM, wiring, assembly, soldering, antenna |
| Firmware | Flashing, config, modes, serial protocol |
| Field Operations | Homing, logging, emergency use, rescue coordination |
| Frequencies & Legal | Band plans, PMR446, ISM, regional tables |
| Building Effectively | Strategy, quality gates, jigs, rework, planning |
| USB & Connectivity | Bridge, TUI, phones, troubleshooting |
| Website | The site itself, benchmarks, repeaters, config dashboard |
| Reference | Datasheet index, changelog, glossary, FAQ |

Every wiki page is registered in `website/src/lib/wiki-nav.ts` and enforced
by CI (nav coverage check).

---

## 93. FAQ — Second Edition (Operators)

### 93.1 Frequency and legal

**Q: Can I listen without a license?**
A: Listening (RX-only) is generally unrestricted, but be aware of local
interception laws. Transmitting requires a license in most countries.

**Q: Is 433.500 MHz a good frequency for a group?**
A: It is the standard ISM calling frequency and widely used; for a closed
group pick a specific frequency inside the band and coordinate it. The
beacon stores 3 frequencies for agility.

**Q: What about PMR446?**
A: The beacon does not use PMR446 (446 MHz FM). PMR446 radios are useful
for voice coordination alongside the beacon, but cannot hear its LoRa or
Morse on 433 MHz.

### 93.2 Batteries and power

**Q: How long does a full charge last?**
A: See §43.4: roughly 100 h of beaconing every 30 s, ~25 h of continuous
listening, ~12 h of emergency TX with a 3000 mAh cell.

**Q: Can I use rechargeable AAAs instead?**
A: No — the charger and voltage range are designed for a 3.7 V Li-ion
cell. Use a proper 18650 or a LiPo with protection.

### 93.3 Troubleshooting

**Q: The OLED flickers.**
A: Usually a marginal 3.3 V rail during TX (PA current draw). Add a 470 µF
bulk cap on VBAT and a 100 nF on 3V3 near the OLED.

**Q: GPS takes forever indoors.**
A: Normal — GPS needs sky. Go to a window or outside; a fix typically
arrives within 2 minutes outdoors.

**Q: The bridge says "page is open" but the page is blank.**
A: Reload the page once; the polling may have started before the page's
script loaded. See Bridge Troubleshooting in the wiki.

---

## 94. Antenna Construction (Build It Yourself)

### 94.1 Quarter-wave whip from wire

1. Cut 16.4 cm of 1.5 mm² stranded wire (or copper tube).
2. Solder to the SMA center pin (or the module's antenna pad).
3. Add 4 radials of 17.3 cm (λ/4) angled 45° downward, connected to the SMA
   ground.
4. Cover with heat-shrink leaving 5 mm bare at the tip.
5. Measure SWR with a VNA; trim 1–2 mm at a time until SWR < 1.5.

### 94.2 J-pole from ladder line

- Two parallel conductors, the long leg ~0.64λ (44 cm) and the short leg
  ~0.31λ (21 cm) at 433 MHz, fed at the quarter-wave point. Gain ≈ +3 dBi.

### 94.3 Ground-plane performance notes

- A handheld without a ground plane loses 2–3 dB vs. the same whip on a
  metal box. Keep the SMA ground tied to a large copper area.
- The case's 15 mm pad plus the battery's metal wrapper provide a modest
  counterpoise.

---

## 95. Field Exercise Templates

### 95.1 Scenario A — day hike, 6 people, 1 beacon

| Item | Value |
| --- | --- |
| Beacon | 1 unit, BEACON mode, 30 s interval |
| Receivers | 2 units in SEARCH |
| Bridge | 1 laptop + bridge, logging every fix |
| Frequency | 433.500 MHz |
| Duration | 6 h |
| Battery draw | ~130 h of beaconing capacity used |

### 95.2 Scenario B — lost person search

1. Grid search with 3 teams, each with a receiver in SEARCH.
2. Coordination on PMR446 voice (voice + beacon complement).
3. The bridge laptop logs positions and timestamps for the incident report.
4. On recovery: switch the beacon to CONFIG, log the final position, power
   off.

---

## 96. Data Logging Formats

### 96.1 Bridge log (plain mode)

```text
[bridge] Aegis-Beacon serial bridge
[bridge] connected to COM3 @ 115200 baud
[device] AEGIS:POS:lat=45.531240;lng=12.304560;alt=812.0;sats=9;fix=1;age=0;mode=BEACON;freq=433.500
[bridge] share link: https://aegis-beacon.vercel.app/report-position?lat=45.531240&lng=12.304560
```

### 96.2 Field log template (recommended)

| Time (UTC) | Lat | Lng | Alt | Sats | Mode | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 09:12:04 | 45.531240 | 12.304560 | 812 | 9 | B | Checkpoint 2 |
| 09:17:33 | 45.532100 | 12.305100 | 810 | 9 | B | Ridge top |

---

## 97. Known Limitations

| Limitation | Impact | Workaround |
| --- | --- | --- |
| No OTA | Updates need USB | Plan updates at base |
| LDO dropout at low battery | Becomes unreliable below ~3.3 V | Low-battery shutdown thresholds (§43.6) |
| 1 Hz GPS update | Position latency ≤ 1 s | Acceptable for rescue pace |
| WiFi + radio coexist | WiFi de-senses 433 MHz | WiFi only in CONFIG |
| No encryption | Positions are public by design | Cross-check bearings; physical control |
| Single-band (433 MHz) | No 868/915 support yet | Future revision; SX1262 is capable |

---

## 98. Roadmap

| Milestone | Target |
| --- | --- |
| OTA updates | v5.6 |
| Multi-band firmware (433/868/915) | v6.0 |
| LoRaWAN integration (optional) | v6.x |
| Web-based receiver (WebUSB) | v6.x |
| Custom PCB (KiCad) | v7.0 |
| Buck converter power stage | v7.0 |

Roadmap items are tracked in GitHub issues; the wiki's Project Status page
reflects the live state.

---

## 99. Index of Wiki Sections Referenced Here

| § | Wiki page(s) |
| --- | --- |
| 25 | frequency-compatibility, emergency-frequency-tables |
| 45 | nx130-gps-module, nx130-vs-neo-m8n |
| 55 | serial-bridge-guide, bridge-tui, bridge-troubleshooting |
| 56 | website pages (landing, wiki, repeaters, config-dashboard, benchmarks) |
| 62 | benchmark-methodology |
| 70 | benchmark-methodology |
| 71 | report-position-page |
| 72 | repeaters-page |
| 73 | config-dashboard |
| 92 | wiki overview (all groups) |

---

---

## 100. Complete Pin Functions by Board Variant

### 100.1 ESP32 DevKit V1 (reference)

| Signal | GPIO | Notes |
| --- | --- | --- |
| SCK | 18 | SPI clock, 8 MHz |
| MISO | 19 | SPI data in |
| MOSI | 23 | SPI data out |
| NSS | 5 | Radio chip select (active low) |
| RST | 14 | Radio reset |
| DIO1 | 2 | Radio interrupt |
| BUSY | 4 | Radio busy |
| SDA | 21 | OLED I2C data |
| SCL | 22 | OLED I2C clock |
| GPS_TX | 16 | GPS module RX input |
| GPS_RX | 17 | GPS module TX output |
| BZ | 25 | Buzzer (PWM) |
| BTN_MODE | 26 | Mode button |
| BTN_SEL | 27 | Select button |
| BTN_UP | 32 | Up button |
| BTN_DN | 33 | Down button |
| VBAT | 34 | Battery monitor (ADC1_CH6) |

### 100.2 ESP32-S3 (native USB, alternative)

| Signal | GPIO | Notes |
| --- | --- | --- |
| SCK | 12 | |
| MISO | 13 | |
| MOSI | 11 | |
| NSS | 10 | |
| RST | 14 | |
| DIO1 | 9 | |
| BUSY | 8 | |
| SDA | 4 | |
| SCL | 5 | |
| GPS_TX | 17 | |
| GPS_RX | 18 | |
| BZ | 15 | |
| Buttons | 6,7,16,21 | |
| VBAT | 3 | ADC1_CH3 |

> [!TIP]
> The exact mapping for alternative boards lives in the wiki's
> Board Variants page; the table above is the S3 reference used by the
> Benchmarks workflow's S3 environment.

---

## 101. I2C Bus Analysis

### 101.1 Bus parameters

| Parameter | Value |
| --- | --- |
| Clock | 400 kHz (fast mode) |
| Pull-ups | 4.7 kΩ to 3V3 |
| Address (SSD1309) | 0x3C (0x3D with SA0 high) |
| Transaction timeout | 200 ms |

### 101.2 Transaction pattern (per frame refresh)

1. START → write 0x3C (address + W) → control byte 0x00 (command)
2. Commands: column addr (0x21), page addr (0x22), etc.
3. START → write 0x3C → control byte 0x40 (data)
4. 1024 bytes of frame buffer (128×64/8)
5. STOP

Full-refresh time at 400 kHz ≈ (1024 × 9 bits) / 400 kHz ≈ 23 ms — the
firmware only redraws on change, so the bus is mostly idle.

---

## 102. SPI Bus Analysis

| Parameter | Value |
| --- | --- |
| Clock | 8 MHz |
| Mode | SPI mode 0 (CPOL=0, CPHA=0) |
| Word size | 8 bits |
| Max packet write | 255 bytes (buffer 0x00–0xFF) |
| Transaction | NSS low → opcode/addr/data → BUSY wait → NSS high |

The firmware issues a single `WriteBuffer` per beacon payload (18 bytes),
so each TX is one short SPI transaction.

---

## 103. Timing Budgets

### 103.1 Main loop budget

| Task | Budget | Notes |
| --- | --- | --- |
| Serial parse | < 1 ms | Line-oriented, non-blocking |
| GPS parse | < 1 ms | Only when a full NMEA line arrived |
| OLED refresh | ~23 ms | Only on change |
| Radio TX (airtime) | 51–205 ms | Blocking during TX (radio owns the bus) |
| Radio RX poll | < 5 ms | Timeout-based |
| Button scan | < 1 ms | Debounce state machine |
| Battery sample | < 2 ms | Averaged over 8 samples |

### 103.2 Deep-sleep wake budget

| Step | Time |
| --- | --- |
| Wake + boot ROM | ~30 ms |
| SDK init | ~150 ms |
| Peripheral init (radio, OLED, GPS) | ~400 ms |
| GPS fix (if cold) | 27–40 s |
| Beacon TX after fix | +1 s |

---

## 104. Power Sequencing at Boot

```text
VBAT rises ──► ESP32 powers (brownout guard) ──► GPIOs tri-state
      ──► Serial init (AEGIS:HELLO:) ──► OLED init ──► Radio init
      ──► GPS power on ──► NVS load ──► mode restore ──► loop()
```

- The radio is held in reset (RST low) until the ESP32 is stable.
- The OLED is initialized after serial so boot messages are not lost.
- The GPS is powered only after radio init to avoid inrush on the 3V3 rail.

---

## 105. Failure Mode Analysis (FMEA-Style)

| Component | Failure mode | Symptom | Detection | Recovery |
| --- | --- | --- | --- | --- |
| SX1262 | Won't calibrate | No TX, ERR:01 | BUSY timeout | Re-init, then reboot |
| OLED | I2C stuck | Blank screen | 200 ms timeout | Skip frame; retry |
| GPS | No fix | ERR:03, sats=0 | 2 min timer | Sleep-retry cycle |
| Battery | Low | Voltage < 3.3 V | ADC monitor | Warning → sleep |
| Buzzer | Open coil | No audio | (none) | Visual/audio check |
| Button | Stuck | Mode storms | Debounce filter | Ignore until release |
| NVS | Corrupt | Config lost | CRC on load | Factory defaults |

---

## 106. ESP32 Memory Map (as Used)

| Region | Used for | Notes |
| --- | --- | --- |
| IRAM | Interrupt handlers, radio ISR | Fixed allocations |
| DRAM | Static buffers, frame buffer (1 KB) | |
| Flash (app) | Code + rodata | ~2.1 MB with libraries |
| NVS | Configuration keys | 16 KB partition |
| RTC fast RAM | Deep-sleep state | Mode, last position |
| Heap | Dynamic allocations | Radio buffers, HTTP strings |

---

## 107. Debugging Techniques

### 107.1 Serial debugging

- Run `pio run -t monitor` at 115200.
- Look for `AEGIS:HELLO:` within 5 s of boot.
- Enable `--verbose` in the bridge to see every serial line.

### 107.2 Radio debugging

- Use an SDR (RTL-SDR) tuned to the beacon frequency to verify TX.
- Confirm the Morse tone and the LoRa chirps are present.
- For RX, enable the RSSI/SNR readout in SEARCH.

### 107.3 Power debugging

- Measure the battery voltage with a multimeter and compare to the OLED
  reading (should agree within ±50 mV after calibration).
- Measure deep-sleep current at the battery terminal (expect < 1 mA; the
  LDO's ~5 mA quiescent is the floor without a load switch).

---

## 108. Customization Guide

### 108.1 Changing the default frequency

Edit the defaults in the config section of `AegisBeacon.ino`, or simply use
`FREQ 433.600` on serial — it persists to NVS.

### 108.2 Changing the Morse payload wording

Find the beacon payload builder function and edit the format string. The
format is documented in §39.3. Keep the SOS prefix for recognizability.

### 108.3 Adding a new mode

1. Add a mode constant to the enum.
2. Add a case to the mode dispatcher in `loop()`.
3. Add a screen to the display driver.
4. Document it in the wiki and this datasheet.

---

## 109. Community and Support

| Channel | Where |
| --- | --- |
| Issues | https://github.com/Leo-Galli/Aegis-Beacon/issues |
| Discussions | GitHub Discussions on the repo |
| Wiki | The official wiki on the website |
| Contribution | CONTRIBUTING.md — conventional commits, no AI code |

---

---

## 110. Complete Command Reference — Alphabetical

| Command | Syntax | Description | Since |
| --- | --- | --- | --- |
| `FACTORY` | `FACTORY` | Erase all NVS config and reboot with defaults | v5.0 |
| `FREQ` | `FREQ <MHz>` | Set the active frequency (persisted) | v5.0 |
| `FREQ?` | `FREQ?` | List all three configured frequencies | v5.1 |
| `HELP` | `HELP` | Print command reference | v5.0 |
| `MODE` | `MODE <BEACON|SEARCH|CONFIG|EMERGENCY>` | Change operating mode | v5.0 |
| `MODE?` | `MODE?` | Show current mode | v5.1 |
| `POS` | `POS` | Emit current position as AEGIS:POS | v5.0 |
| `SLEEP` | `SLEEP [seconds]` | Enter deep sleep (default 60 s) | v5.2 |
| `STATUS` | `STATUS` | Full device state dump | v5.0 |
| `WPM` | `WPM <5-40>` | Set Morse speed (persisted) | v5.0 |
| `WPM?` | `WPM?` | Show current Morse speed | v5.1 |

### 110.1 STATUS output format

```text
AEGIS:STATUS:mode=BEACON;freq=433.500000;batt=3.92V;vbat_raw=2876;sats=9;fix=1;age=0;wpm=14;tx_power=20;interval=30000;uptime=1234s
```

| Field | Meaning |
| --- | --- |
| mode | Current mode |
| freq | Active frequency (MHz) |
| batt | Battery voltage (V) |
| vbat_raw | Raw ADC value |
| sats | Satellites in use |
| fix | Fix quality |
| age | Fix age (s) |
| wpm | Morse speed |
| tx_power | TX power (dBm) |
| interval | Beacon interval (ms) |
| uptime | Seconds since boot |

---

## 111. Morse Beacon Audio Examples

### 111.1 Full beacon at 14 WPM (time-domain)

```text
SOS SOS SATS 9 LAT 45 31.8 LON 11 18.2 ALT 812 MODE B

Duration breakdown (14 WPM, unit = 60/14 ≈ 4.29 s / 10 chars ... per char avg)
Total on-air time ≈ 25 s per cycle
```

### 111.2 Morse for the digits

| Digit | Code | | Digit | Code |
| --- | --- | --- | --- | --- |
| 0 | ----- | | 5 | ..... |
| 1 | .---- | | 6 | -.... |
| 2 | ..--- | | 7 | --... |
| 3 | ...-- | | 8 | ---.. |
| 4 | ....- | | 9 | ----.

### 111.3 Punctuation used

| Symbol | Code |
| --- | --- |
| . (decimal point) | .-.-.- |
| / (separator) | -..-. |
| space (word gap) | 7 units |

---

## 112. LoRa Packet Capture Reference (for SDR / sniffers)

### 112.1 To decode a beacon with an SDR

1. Tune to the beacon frequency (e.g. 433.500 MHz).
2. Configure the receiver for LoRa SF7, BW 125 kHz, CR 4/5, explicit header,
   preamble 8, CRC on.
3. The payload is 18 bytes (see §60).
4. Sync word: 0x1424 (standard).

### 112.2 Expected RSSI values

| Distance | RSSI (SF7, line of sight) |
| --- | --- |
| 10 m | −35 to −45 dBm |
| 100 m | −60 to −75 dBm |
| 1 km | −85 to −100 dBm |
| 5 km | −105 to −120 dBm |

---

## 113. GPS Antenna Requirements

| Parameter | Requirement |
| --- | --- |
| Frequency | 1575.42 MHz (L1) |
| Active/passive | Passive ceramic patch (active optional) |
| Gain | ≥ 15 dBi (active with LNA) or good clear-sky view (passive) |
| Ground plane | ≥ 20 mm diameter under the patch |
| Clearance | No metal within 10 mm above the patch |

- The NEO-6M module includes a built-in SAW filter and optional LNA; with a
  passive patch and clear sky it fixes reliably outdoors.
- Keep the GPS patch at least 30 mm from the 433 MHz antenna to avoid
  desensitization.

---

## 114. Receiver Sensitivity Test Procedure

1. Connect a calibrated signal generator to the receiver input at 50 Ω.
2. Set the generator to the beacon frequency, LoRa SF7, 125 kHz, 18-byte
   payload.
3. Start at −100 dBm, confirm 100% decode.
4. Decrease in 1 dB steps until decode rate drops below 90%.
5. Record that level as the sensitivity floor (expect ≈ −123 dBm).
6. Repeat at SF9 (expect ≈ −129 dBm) and SF12 (expect ≈ −137 dBm).

---

## 115. Environmental Test Procedures

| Test | Method | Pass |
| --- | --- | --- | |
| Cold | −20 °C, 2 h soak, then TX | Fix + TX within 5 min |
| Heat | +60 °C, 2 h soak, continuous TX | No ERR:01/02 |
| Humidity | 85% RH, 4 h | No condensation damage |
| Drop | 1 m onto carpet, 3 axes | Boots and functions |
| Vibration | Handheld use in a backpack, 30 min | No loose connections |
| Water | IP54 case, light rain 30 min | No water ingress |

---

## 116. Battery Calibration Table (ADC → Voltage)

With the 2:1 divider on GPIO34 (ADC1_CH6, 11 dB attenuation, 12-bit):

| ADC raw | Battery voltage (V) |
| --- | --- |
| 4095 | 6.20 |
| 3800 | 5.75 |
| 3500 | 5.30 |
| 3200 | 4.84 |
| 2900 | 4.39 |
| 2600 | 3.93 |
| 2400 | 3.63 |
| 2200 | 3.33 |
| 2000 | 3.03 |

Formula: `V_batt = ADC_raw / 4095 × 3.1 × 2` (approximately; use the
calibrated offset from §54.2).

---

## 117. Tones and Volume

| Parameter | Value |
| --- | --- |
| Tone frequency | 2.7 kHz |
| Duty cycle | 50% |
| PWM resolution | 8-bit |
| Volume control | PWM duty scaling (10–100%) |
| Loudness (typ.) | ~75 dB at 30 cm |

---

## 118. OLED Brightness Control

| Parameter | Value |
| --- | --- |
| Range | 10–100% |
| Default | 100% |
| Implementation | SSD1309 contrast register (0x81) |
| Steps | 0–255 contrast bytes, mapped linearly |
| Save | Persisted to NVS (`brightness`) |

---

## 119. Scroll Behavior

| Parameter | Value |
| --- | --- |
| Scroll speed | 1–10 (configurable) |
| Default | 3 |
| Direction | Right-to-left (classic OLED marquee) |
| Activation | Long lines exceed panel width |
| Pause on key | Any button press |

---

## 120. Squelch Behavior (SEARCH)

| Squelch level | RSSI threshold (approx.) |
| --- | --- |
| 0 | off (always open) |
| 1–3 | −110 to −100 dBm |
| 4–6 | −100 to −90 dBm |
| 7–9 | −90 to −80 dBm |
| 10–12 | −80 to −70 dBm |
| 13–15 | −70 to −60 dBm |

When the received signal is below the threshold, the OLED shows the noise
floor instead of a decoded payload.

---

## 121. Frequency Agility Logic

- Three frequencies are stored: `freq_bcn` (beacon TX), `freq_rx` and
  `freq_rx2` (SEARCH scan).
- SEARCH alternates between `freq_rx` and `freq_rx2` on a dwell timer
  (default 5 s each).
- If a valid packet is heard on either, SEARCH locks to that frequency for
  the duration of the signal and returns to scanning after a timeout.

---

## 122. Multi-Beacon Coordination

| Beacon | freq_bcn | freq_rx / freq_rx2 |
| --- | --- | --- |
| Alpha | 433.500 | 433.475 / 433.525 |
| Bravo | 433.525 | 433.500 / 433.550 |
| Charlie | 433.550 | 433.500 / 433.475 |

Each beacon transmits on its own `freq_bcn`; searchers configure SEARCH to
scan that beacon's transmit frequency. The bridge logs everything.

---

## 123. Glossary — Extended

| Term | Definition |
| --- | --- |
| CEPT | European Conference of Postal and Telecommunications Administrations |
| ERP | Effective radiated power (power × antenna gain) |
| EIRP | Equivalent isotropically radiated power |
| FCC | US Federal Communications Commission |
| HDOP | Horizontal dilution of precision (GPS quality) |
| ISED | Innovation, Science and Economic Development Canada |
| LDO | Low-dropout voltage regulator |
| LNA | Low-noise amplifier |
| MOSFET | Metal-oxide-semiconductor field-effect transistor |
| NVS | Non-volatile storage (ESP32) |
| OFCOM | Swiss regulator |
| OSM | OpenStreetMap |
| Overpass | OSM query API (used by the repeaters map) |
| PA | Power amplifier |
| PLL | Phase-locked loop |
| RTR | Austrian regulator |
| SDR | Software-defined radio |
| SF | Spreading factor (LoRa) |
| SMA | SubMiniature version A connector |
| SNR | Signal-to-noise ratio |
| SPI | Serial peripheral interface |
| SWR | Standing wave ratio |
| TCXO | Temperature-compensated crystal oscillator |
| TTFF | Time to first fix (GPS) |
| VNA | Vector network analyzer |

---

---

## 124. Firmware Configuration Constants (Compile-Time)

| Constant | Default | Meaning |
| --- | --- | --- |
| `FIRMWARE_VERSION` | "5.5.0" | Version string in HELLO handshake |
| `DEFAULT_FREQ_BCN` | 433500000 | Beacon frequency (Hz) |
| `DEFAULT_FREQ_RX` | 433475000 | Search frequency 1 (Hz) |
| `DEFAULT_FREQ_RX2` | 433525000 | Search frequency 2 (Hz) |
| `DEFAULT_WPM` | 14 | Morse speed |
| `DEFAULT_TX_POWER` | 20 | TX power (dBm) |
| `DEFAULT_TX_INTERVAL` | 30000 | Beacon interval (ms) |
| `DEFAULT_SQUELCH` | 0 | Squelch level |
| `DEFAULT_SCROLL_SPEED` | 3 | OLED scroll speed |
| `DEFAULT_BRIGHTNESS` | 100 | OLED brightness % |
| `DEFAULT_GPS_TIMEOUT` | 120 | GPS fix timeout (s) |
| `BAT_DIVIDER` | 2.0 | Voltage divider ratio |
| `BAT_OFFSET` | 0.0 | ADC calibration offset (V) |
| `DEEP_SLEEP_PERIOD` | 60 | Default sleep period (s) |
| `GPS_HOLD` | 60 | Fix hold period (s) |

---

## 125. OLED Screens — Pixel Layouts

### 125.1 Status screen (128×64)

```text
┌──────────────────────────────┐
│ BEACON   433.500 MHz    ▮▮▮▮▮│ ← mode, freq, battery
│ SAT 09  ALT 812m   TX: 12:04 │
│ LAT 45.531240                │
│ LON 12.304560                │
│ FIX 1s   ●TX                │
└──────────────────────────────┘
```

### 125.2 Emergency screen

```text
┌──────────────────────────────┐
│          SOS SOS             │
│     45.531240, 12.304560     │
│     +22 dBm  433.500 MHz     │
│     TX ACTIVE                │
└──────────────────────────────┘
```

### 125.3 Search screen

```text
┌──────────────────────────────┐
│ SEARCH  433.475 MHz  ▮▮▮░░  │
│ RSSI -87 dBm  SNR +8 dB     │
│ ──────────────────────────── │
│ signal strength bar (5 seg)  │
└──────────────────────────────┘
```

---

## 126. Serial Debug Message Catalog

| Prefix | Example | Meaning |
| --- | --- | --- |
| `[boot]` | `[boot] NVS loaded, 8 keys` | Boot diagnostics |
| `[radio]` | `[radio] init ok, cal done` | Radio events |
| `[gps]` | `[gps] fix acquired, 9 sats` | GPS events |
| `[mode]` | `[mode] switched to SEARCH` | Mode changes |
| `[tx]` | `[tx] started, 18 bytes` | TX events |
| `[rx]` | `[rx] packet, RSSI -87 dBm` | RX events |
| `[cfg]` | `[cfg] wpm=16 saved` | Config writes |
| `[pwr]` | `[pwr] batt 3.92V` | Power events |
| `[wifi]` | `[wifi] AP up, 192.168.4.1` | WiFi events |
| `[err]` | `[err] radio busy timeout` | Error events |

---

## 127. Radio Initialization Failure Recovery

```text
boot ──► radio init ──► fail? ──► retry ×3
  │                              │
  └── ok ──► continue            └── fail → safe mode
                                        │
                                        └── beacon disabled,
                                            serial explains,
                                            OLED shows ERR
```

Safe mode keeps SEARCH, CONFIG and serial alive so the operator can diagnose
and reboot.

---

## 128. GPS Power Management

| State | GPS power | Notes |
| --- | --- | --- |
| Deep sleep | Off | MOSFET gate low |
| BEACON idle | On | Keeping ephemeris warm reduces TTFF |
| SEARCH | Off | Not needed for receiving |
| CONFIG | Off | Not needed |
| EMERGENCY | On | Position must stay current |

---

## 129. Beacon Payload Generation Sequence

1. Read current position (lat, lng, alt, sats, fix, age).
2. Build the audible Morse string (§61).
3. Build the 18-byte LoRa payload (§60).
4. Apply the frequency offset (§39.5).
5. Key the buzzer + radio through the Morse engine.
6. Transmit the LoRa packet after the audible portion.
7. Emit `AEGIS:TX:start` / `AEGIS:TX:end` on serial.
8. Wait the inter-cycle interval.

---

## 130. Search Reception Sequence

1. Set radio to RX on `freq_rx` with a 5 s dwell.
2. On RX_DONE: read the payload, validate CRC, parse fields.
3. If the payload magic (`AB`) matches, display lat/lng + RSSI/SNR.
4. If squelch is set and RSSI < threshold, show noise floor.
5. After the dwell, hop to `freq_rx2` and repeat.
6. If a valid packet was heard, lock for 30 s before resuming the scan.

---

## 131. Emergency Mode Activation and Exit

| Path | How |
| --- | --- |
| Activate | MODE button → EMERGENCY, or serial `MODE EMERGENCY` |
| Confirm | OLED shows SOS banner; TX begins within 1 s |
| Exit | Any button press, or serial `MODE BEACON` |
| Timeout | None (runs until cancelled — by design) |

---

## 132. Event Log (On-Device)

- The device keeps a small in-RAM event ring (last 16 events) for the
  `STATUS` dump: boot, mode changes, TX/RX events, errors.
- Events are not persisted across reboots (except the last mode).
- The bridge/site logs provide the durable record.

---

## 133. Safety Precautions (User-Facing)

| Area | Precaution |
| --- | --- |
| RF exposure | Keep antenna ≥ 20 cm from the body during TX |
| Battery | Use protected Li-ion cells; never short the terminals |
| Charging | Charge only with the TP4056 module; do not charge unattended overnight in a flammable case |
| Explosive atmospheres | Do not operate in fuel depots, gas leaks, or dust |
| Weather | IP54 case only; do not submerge |
| Legal | Transmit only with a valid license |
| Medical | The device is not a medical device; do not rely on it alone |

---

## 134. Legal Europe-Wide Quick Table

| Country | Regulator | Amateur license classes | 433 MHz ISM cap | Emergency provision |
| --- | --- | --- | --- | --- |
| Italy | MISE/AGCOM | A, B | 10 mW ERP | Yes (art. 106) |
| Switzerland | OFCOM | HB3, HB9 | 10 mW ERP | Yes |
| Austria | RTR | OE1… (general), OE3… (beginner) | 10 mW ERP | Yes |
| Germany | BNetzA | E, A | 10 mW ERP | Yes |
| France | ANFR | Classes 1, 2 | 10 mW ERP | Yes |
| Spain | SETEL | A, B | 10 mW ERP | Yes |
| Slovenia | AKOS | General, restricted | 10 mW ERP | Yes |
| Croatia | HAKOM | A, B | 10 mW ERP | Yes |
| UK | Ofcom | Foundation, Intermediate, Full | 10 mW ERP | Yes |

---

## 135. Mountain Rescue Frequency Coordination

| Organization | Country | Band used for SAR coordination (typical) |
| --- | --- | --- |
| CNSAS | Italy | 430–440 MHz amateur + dedicated SAR channels |
| REGA | Switzerland | Dedicated aviation channels; amateur nets as backup |
| PGHM | France | Dedicated mountain SAR channels |
| Bergrettung | Austria | Amateur + PMR coordination |
| REMER | Spain | Amateur emergency net on 70 cm |
| NASAR | USA | Multiple, incl. amateur 70 cm |
| AMSA | Australia | Amateur emergency nets |

See §25 for the full frequency tables.

---

## 136. Antenna Efficiency Table (Practical)

| Antenna | Efficiency (typ.) | Notes |
| --- | --- | --- |
| Quarter-wave whip on large ground | 70–85% | Best portable option |
| Quarter-wave whip, no ground plane | 35–50% | Handheld, body effects |
| Helical rubber duck | 25–45% | Compact, lossy |
| J-pole | 75–90% | Base use |
| 5-el Yagi | 85–95% | Directional |

---

## 137. LoRa Bandwidth and Data Rate Table

| BW | SF | Bit rate (max, CR 4/5) | Airtime for 18 B |
| --- | --- | --- | --- |
| 125 kHz | SF7 | 5.5 kbps | 51 ms |
| 125 kHz | SF9 | 1.8 kbps | 205 ms |
| 125 kHz | SF12 | 0.3 kbps | 988 ms |
| 250 kHz | SF7 | 11 kbps | 26 ms |
| 500 kHz | SF7 | 22 kbps | 13 ms |

---

## 138. Firmware Benchmarks — What the Numbers Mean

| Metric | Why it matters |
| --- | --- |
| Flash used | Fits in the partition; headroom for features |
| RAM used | Free heap for radio buffers and HTTP |
| Compile time | CI wall-clock; regression signal |
| Warnings | Code health (target: 0) |

The Benchmarks workflow compiles every environment on every push; the
numbers are comparable across commits because the toolchain is pinned.

---

## 139. Project File Tree (Reference)

```text
AegisBeacon.ino                 Firmware (single-file Arduino sketch)
DATASHEET.md                    This document
README.md                       Project overview
CONTRIBUTING.md                 Contribution rules
LICENSE                         MIT license
bridge/aegis-serial-bridge.py   Serial bridge + TUI
website/                        Astro site (landing, wiki, tools)
.github/workflows/              CI/CD (website, firmware, benchmarks, PR)
```

---

## 140. Versioning and Release Process

1. Bump `FIRMWARE_VERSION` and the site version references.
2. Update the changelog (§22, §64) and the wiki's What's New page.
3. Commit with a conventional message (e.g. `feat: ...`).
4. Tag `v5.5.0` and create a GitHub release from the tag.
5. CI runs website + firmware + benchmarks; all must be green.

---

## 141. Contributing Quick Reference

| Topic | Rule |
| --- | --- |
| Commit format | Conventional commits (`feat:`, `fix:`, `docs:`, `ci:`, ...) |
| AI code | Not tolerated (safety-critical project) |
| AI images | Allowed only when strictly necessary, derived from project content |
| PR checks | Title/message format, docs consistency, content gates |
| Tests | Website: astro check + verify script; firmware: PlatformIO compile |

See CONTRIBUTING.md for the full policy.

---

## 142. Error Message Reference (User-Facing)

| Message | Where | Meaning / action |
| --- | --- | --- |
| `NO FIX` | OLED | GPS has no fix; move to open sky |
| `NO SIGNAL` | OLED (SEARCH) | Below squelch or nothing heard |
| `BAT LOW` | OLED | Below 3.5 V; recharge soon |
| `ERR 01` | Serial | Radio init failure; check wiring |
| `ERR 02` | Serial | TX timeout; check PA/power |
| `ERR 03` | Serial | No fix for POS command |
| `ERR 04` | Serial | Frequency out of band |
| `ERR 05` | Serial | NVS write failure; factory reset |

---

---

## 143. SX1262 Absolute Maximum Ratings (Module Level)

| Parameter | Min | Max | Unit |
| --- | --- | --- | --- |
| Supply voltage | −0.3 | 3.9 | V |
| RF input level | — | +10 | dBm |
| Operating temperature | −40 | +85 | °C |
| Storage temperature | −55 | +125 | °C |
| Digital I/O voltage | −0.3 | 3.9 | V |
| ESD (HBM) | — | 2000 | V |

---

## 144. SX1262 Recommended Operating Conditions

| Parameter | Min | Typ | Max | Unit |
| --- | --- | --- | --- | --- |
| Supply | 2.0 | 3.3 | 3.7 | V |
| RX current (LoRa, 125 kHz) | — | 4.6 | — | mA |
| TX current (+20 dBm) | — | 95 | — | mA |
| TX current (+22 dBm) | — | 118 | — | mA |
| Sleep current (cold start) | — | 0.6 | — | µA |
| Output power range | −9 | — | +22 | dBm |

---

## 145. SSD1309 Absolute Maximum Ratings

| Parameter | Min | Max | Unit |
| --- | --- | --- | --- |
| Supply | −0.3 | 4.0 | V |
| Operating temperature | −40 | +85 | °C |
| Storage temperature | −40 | +95 | °C |
| I2C clock | — | 400 | kHz |
| Logic input | −0.3 | VDD+0.3 | V |

---

## 146. TP4056 Absolute Maximum Ratings

| Parameter | Min | Max | Unit |
| --- | --- | --- | --- |
| Input voltage (VCC) | −0.3 | 8.0 | V |
| Charge current (PROG) | — | 1.2 | A |
| Junction temperature | −40 | +125 | °C |

---

## 147. Standard Operating Procedures (SOPs)

### 147.1 SOP-001: First power-on

1. Flash the firmware (`pio run -t upload`).
2. Open the serial monitor; confirm `AEGIS:HELLO:v5.5.0`.
3. Confirm OLED status screen renders.
4. Confirm battery voltage reads sensibly (3.7–4.2 V).
5. Confirm GPS fix outdoors within 2 min (`POS` → `AEGIS:POS:`).
6. Confirm TX: set MODE BEACON, watch TX events, listen with an SDR or
   second unit.

### 147.2 SOP-002: Field deployment

1. Charge to ≥ 3.8 V.
2. Verify fix before departure.
3. Set BEACON interval (default 30 s) and frequency.
4. Attach antenna; confirm SWR if possible.
5. Deploy; log start time and position.
6. Monitor via bridge if available.

### 147.3 SOP-003: Search operation

1. Confirm the target frequency with the search team.
2. Set SEARCH on `freq_rx` / `freq_rx2` covering the target.
3. Scan; on first decode, log RSSI/SNR and direction.
4. Move in the direction of increasing signal.
5. Confirm identity via the Morse audio at close range.
6. Record recovery position and time.

### 147.4 SOP-004: Emergency activation

1. Verify the situation warrants maximum-power continuous TX.
2. Enter EMERGENCY (button or serial).
3. Announce the emergency on voice channels if available.
4. Keep the antenna clear of the body.
5. Exit EMERGENCY only when the situation resolves or directed.

---

## 148. Test Data Recording Template

| Field | Example |
| --- | --- |
| Test ID | T-2026-0912-01 |
| Firmware version | v5.5.0 |
| Board | ESP32 DevKit V1 |
| Date / time | 2026-09-12 10:30 UTC |
| Location | 45.5312, 12.3045, 812 m |
| Temperature | 18 °C |
| Battery | 4.02 V |
| Frequency | 433.500 MHz |
| Power | +20 dBm |
| Antenna | Quarter-wave whip |
| Result | PASS |
| Notes | 2.3 km clear LOS, SNR +14 dB |

---

## 149. Reliability Math

| Metric | Estimate | Basis |
| --- | --- | --- |
| MTBF (electronics) | > 10,000 h | Conservative component derating |
| Battery cycles | 300–500 | 18650 cell spec |
| Flash endurance (NVS) | 100,000 writes per key | ESP32 NVS spec; config writes are rare |
| Fix availability | > 99% outdoors | GPS constellation |
| Beacon delivery | > 99% at 1 km LOS | LoRa link margin (§37) |

---

## 150. Glossary — Firmware & Software

| Term | Definition |
| --- | --- |
| AEGIS: line | Machine-readable serial protocol line |
| Bridge | Python script connecting device ↔ site |
| TUI | Terminal user interface (dashboard) |
| NVS | Non-volatile storage (ESP32) |
| RTC RAM | Real-time-clock RAM surviving deep sleep |
| SSID | WiFi network name (AegisBeacon-XXXX) |
| AP | Access point (device's config WiFi) |
| CORS | Cross-origin resource sharing (bridge endpoint) |
| Poll | Client asking the bridge for new state |
| Heartbeat | Client pinging the bridge to signal "I am open" |

---

## 151. Endpoint and Port Reference

| Endpoint | Address | Purpose |
| --- | --- | --- |
| Device config AP | AegisBeacon-XXXX | Configuration over WiFi |
| Device config page | http://192.168.4.1 | Dashboard HTML |
| Device config API | http://192.168.4.1/api/config | JSON config API |
| Bridge loopback | http://127.0.0.1:8765/stream | Position stream |
| Bridge loopback | http://127.0.0.1:8765/ping | Page heartbeat |
| Bridge loopback | http://127.0.0.1:8765/state | State + page-open flag |
| Website | https://aegis-beacon.vercel.app | Official site |
| Report page | /report-position?lat=..&lng=.. | Position viewer |
| Repeaters page | /repeaters | Repeater map |
| Wiki | /wiki | Documentation |

---

## 152. Build Environment Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| PlatformIO Core | ≥ 6.1 | `pip install platformio` |
| ESP32 Arduino core | ≥ 2.0.14 | Managed by PlatformIO |
| Node.js | ≥ 18 | For the website |
| npm | ≥ 9 | |
| Python | ≥ 3.8 | For the bridge and scripts |
| pyserial | ≥ 3.5 | `pip install pyserial` |

---

## 153. Website Build Commands

```bash
cd website
npm install
npm run dev          # dev server
npm run check        # astro check (types)
npm run build        # production build
npm run preview      # serve the built site
```

CI runs `check` + `build` + the verify script on every push/PR.

---

## 154. Bridge Quick Start (All OS)

```bash
# Windows
py -m pip install pyserial
python bridge/aegis-serial-bridge.py

# macOS / Linux
pip3 install pyserial
python3 bridge/aegis-serial-bridge.py

# Android (Termux)
pkg install python
pip install pyserial
python bridge/aegis-serial-bridge.py --port /dev/ttyACM0
```

---

## 155. Common Pitfalls

| Pitfall | Symptom | Fix |
| --- | --- | --- |
| Charge-only USB cable | No serial, no boot messages | Use a data cable |
| Wrong port selected | Bridge retries forever | `--list`, pick the right device |
| Missing CP210x driver | No port appears | Install the driver |
| GPS indoors | No fix for minutes | Go to open sky |
| Antenna detached | TX may damage PA | Always connect the antenna |
| Battery deeply discharged | Won't charge | Pre-charge recovery (TP4056) |
| Two bridges on one port | "Port already in use" | Close the other monitor |
| Browser blocks loopback | Page won't stream (Safari) | Use the link path instead |

---

## 156. Compliance Self-Checklist (Before Field Use)

| Item | Check |
| --- | --- |
| License valid | ☐ |
| Frequency inside band | ☐ |
| Power within limits | ☐ |
| Callsign configured / identified | ☐ |
| Interference plan agreed | ☐ |
| Battery charged | ☐ |
| Antenna connected | ☐ |
| Emergency procedure rehearsed | ☐ |

---

## 157. Data Privacy Statement (Device)

- The device transmits position data openly over RF by design (emergency
  use); anyone with a compatible receiver can decode it.
- The bridge stores nothing; it only relays the live stream to the open
  Report Position page over your local network.
- No cloud, no accounts, no analytics, no tracking.

---

## 158. FAQ — Third Edition (Builders)

**Q: Where do I get the parts?**
A: The Builder page lists every part with live price-comparison links
(Trovaprezzi, Google Shopping, eBay, AliExpress, Amazon). See §21 for the
static BOM.

**Q: Can I build it cheaper?**
A: Yes — the Builder's auto-fit drops optional parts when the budget
doesn't fit, and price comparison finds the cheapest vendor per part.

**Q: Is the PCB available?**
A: Not yet — the reference build uses a DevKit V1 and modules on
perfboard. A KiCad PCB is on the roadmap (§98).

**Q: How hard is soldering?**
A: Beginner-friendly if you use modules (SX1262 breakout, OLED, TP4056,
NEO-6M). See §66 for technique.

---

## 159. FAQ — Fourth Edition (Developers)

**Q: Which IDE?**
A: PlatformIO (recommended) or the Arduino IDE with the ESP32 core.

**Q: How do I add a feature?**
A: Follow the module structure (§58), keep the serial protocol backward
compatible, add wiki docs, and open a PR with a conventional message.

**Q: Can I run the website locally?**
A: Yes — `cd website && npm install && npm run dev`.

**Q: How are benchmarks produced?**
A: The Benchmarks workflow compiles on every push and reports to the run
summary + artifact; it never commits. See §70 and the wiki.

---

## 160. Acronym Index

| Acronym | Expansion |
| --- | --- |
| ADC | Analog-to-digital converter |
| AGC | Automatic gain control |
| AP | Access point |
| BJT | Bipolar junction transistor |
| BOM | Bill of materials |
| CEP | Circular error probable |
| CRC | Cyclic redundancy check |
| DDM | Degrees decimal minutes |
| EMC | Electromagnetic compatibility |
| ERP | Effective radiated power |
| FMEA | Failure mode and effects analysis |
| FSPL | Free-space path loss |
| GPIO | General-purpose input/output |
| HDOP | Horizontal dilution of precision |
| ISM | Industrial, scientific and medical |
| I2C | Inter-integrated circuit |
| LNA | Low-noise amplifier |
| LoRa | Long-range (chirp spread spectrum) |
| MOSFET | Metal-oxide-semiconductor FET |
| NMEA | National Marine Electronics Association |
| NVS | Non-volatile storage |
| OLED | Organic light-emitting diode |
| PA | Power amplifier |
| PLL | Phase-locked loop |
| PMR | Private mobile radio |
| PWM | Pulse-width modulation |
| RF | Radio frequency |
| RSSI | Received signal strength indicator |
| RTOS | Real-time operating system |
| SDR | Software-defined radio |
| SF | Spreading factor |
| SNR | Signal-to-noise ratio |
| SPI | Serial peripheral interface |
| SWR | Standing wave ratio |
| TTFF | Time to first fix |
| UART | Universal asynchronous receiver-transmitter |
| VNA | Vector network analyzer |
| WPM | Words per minute |

---

---

## 161. Wiki Page Catalog (Selected, by Group)

The wiki contains 440+ pages; this catalog lists the core pages grouped the
same way the sidebar is organized. See the live wiki for the full list and
current content.

### 161.1 Getting Started

| Page | Covers |
| --- | --- |
| What is Aegis-Beacon | Project overview, goals, limitations |
| Quick Start | From box to first beacon in 20 minutes |
| First Power-On | Boot, serial handshake, display |
| Project Overview | Repo layout, licenses, roadmap |

### 161.2 Hardware & Build

| Page | Covers |
| --- | --- |
| Bill of Materials | Full BOM with prices |
| Wiring Tables | Pin-by-pin wiring |
| Assembly Sequence | Order of operations |
| Soldering Guide | Technique and quality |
| Antenna Guide | Types, dimensions, matching |
| Enclosure | Case, mounting, environment |
| Board Variants | DevKit V1, S3, C3 |
| Bench Jigs | Test fixtures |
| Rework | Desoldering and fixes |

### 161.3 Firmware

| Page | Covers |
| --- | --- |
| Flashing | PlatformIO / Arduino IDE |
| Configuration | NVS keys, all paths to change |
| Modes | BEACON / SEARCH / CONFIG / EMERGENCY |
| Serial Protocol | Full command reference |
| Config Dashboard | On-device WiFi UI |
| Deep Sleep | Power management |
| GPS Integration | NEO-6M wiring and fix logic |
| Radio Library | SX1262 driver notes |
| Changelog | Version history |

### 161.4 Field Operations

| Page | Covers |
| --- | --- |
| Homing Procedure | Finding a beacon step by step |
| Beacon Log Template | Field log format |
| Emergency Use | Activating and managing EMERGENCY |
| Rescue Coordination | Working with mountain-rescue nets |
| Search Techniques | Grid, signal-strength, DF |

### 161.5 Frequencies & Legal

| Page | Covers |
| --- | --- |
| Frequency Compatibility | ISM/PMR446/repeater overview |
| Global Emergency Frequencies | Regional rescue tables |
| Legal Guide | License requirements by country |
| Radio Etiquette | Band manners and identification |

### 161.6 Building Effectively

| Page | Covers |
| --- | --- |
| Effective Build Strategy | Planning and staging |
| Build Quality Gates | Checkpoints during assembly |
| Build Time Planning | Estimating effort |
| Build Log and Tracking | Documenting the build |

### 161.7 USB & Connectivity

| Page | Covers |
| --- | --- |
| Serial Bridge Guide | The bridge end to end |
| Bridge TUI | The terminal dashboard |
| Bridge Automation | Scripting the bridge |
| Bridge Troubleshooting | Common problems |
| Android OTG | Running on a phone |
| Report Position Page | The map page |

### 161.8 Website

| Page | Covers |
| --- | --- |
| Website Overview | The Astro site |
| Benchmark Methodology | How numbers are produced |
| Repeaters Page | The keyless map |
| Config Dashboard | Live firmware UI preview |
| SEO Guide | Meta, structured data |

---

## 162. Deep Dive — BEACON Mode State Machine

```text
        ┌──────────────────────────────────────────────┐
        │  IDLE (waiting for interval)                 │
        └───────────────┬──────────────────────────────┘
                        │ interval elapsed
                        ▼
        ┌──────────────────────────────────────────────┐
        │  CHECK FIX (sats ≥ 1? age < GPS_HOLD?)       │
        └───────────────┬──────────────────────────────┘
              no fix    │  fix ok
              ┌─────────┘
              ▼
        ┌────────────────────┐     ┌────────────────────────────────┐
        │  RETRY (short      │     │  TX CYCLE                      │
        │  wait, re-check)   │◄────│  1s key-up → SOS×2 → payload   │
        └────────────────────┘     │  → key-down → AEGIS:TX events  │
                                    └───────────────┬────────────────┘
                                                    │ done
                                                    ▼
                                        ┌──────────────────────────┐
                                        │  PAUSE (interval)        │
                                        │  → back to IDLE          │
                                        └──────────────────────────┘
```

### 162.1 Timing parameters

| Phase | Parameter | Default |
| --- | --- | --- |
| Cycle wait | `tx_interval` | 30 s |
| Fix retry | `gps_timeout` | 120 s |
| Fix hold | `GPS_HOLD` | 60 s |
| Pre/post key-up | fixed | 1 s each |

---

## 163. Deep Dive — SEARCH Mode State Machine

```text
        ┌──────────────────────────────────────────────┐
        │  SCAN freq_rx (5 s dwell)                    │
        └───────────────┬──────────────────────────────┘
                        │ RX_DONE with valid packet
                        ▼
        ┌──────────────────────────────────────────────┐
        │  LOCK (hold frequency 30 s, show position)   │
        └───────────────┬──────────────────────────────┘
                        │ lock expired / squelch exceeded
                        ▼
        ┌──────────────────────────────────────────────┐
        │  SCAN freq_rx2 (5 s dwell)  ──► loop         │
        └──────────────────────────────────────────────┘
```

---

## 164. Deep Dive — CONFIG Mode State Machine

```text
        ┌──────────────────────────────────────────────┐
        │  MENU (MODE = next param, UP/DN = value,     │
        │        SEL = confirm & next, long MODE = exit)│
        └──────────────────────────────────────────────┘
                        │ SEL on last param
                        ▼
        ┌──────────────────────────────────────────────┐
        │  SAVE (write NVS, verify, report AEGIS:cfg)  │
        └──────────────────────────────────────────────┘
```

---

## 165. Deep Dive — EMERGENCY Mode State Machine

```text
        ┌──────────────────────────────────────────────┐
        │  ARM (confirm banner)                        │
        └───────────────┬──────────────────────────────┘
                        │ confirmed
                        ▼
        ┌──────────────────────────────────────────────┐
        │  TX LOOP (continuous: SOS+position, +22 dBm) │
        │        ┌──────────┐                          │
        │        │ pause 1s │◄── TX cycle ──┐          │
        │        └────┬─────┘              │          │
        │             └── repeat ──────────┘          │
        └───────────────┬──────────────────────────────┘
                        │ any button / MODE BEACON
                        ▼
        ┌──────────────────────────────────────────────┐
        │  EXIT → BEACON mode                          │
        └──────────────────────────────────────────────┘
```

---

## 166. Complete Boot Sequence (annotated)

```text
Power on
  ├─ ROM boot, brownout check
  ├─ SDK init (flash, NVS mount)
  ├─ Serial 115200 — prints AEGIS:HELLO:v5.5.0
  ├─ OLED init (I2C probe 0x3C)
  ├─ Radio init (SPI, reset, calibrate)
  ├─ GPS power on
  ├─ NVS config load (defaults + persisted)
  ├─ Mode restore (last mode from RTC RAM)
  └─ loop() dispatch
```

---

## 167. Interrupt Handling

| Interrupt | Source | Handler action |
| --- | --- | --- |
| DIO1 (radio) | SX1262 | Set TX/RX-done flag; wake loop |
| Button GPIOs | 4 buttons | Debounce in loop (polled, not ISR) |
| Timer (beacon) | millis() in loop | Non-blocking schedule check |
| I2C | — | Timeout guard (no ISR) |

Buttons are polled in the main loop with a 50 ms debounce window rather
than using ISRs, which keeps the firmware simple and deterministic.

---

## 168. Buffer and Memory Allocation

| Buffer | Size | Where |
| --- | --- | --- |
| OLED frame buffer | 1024 B | static |
| Serial RX line | 256 B | static |
| GPS NMEA line | 128 B | static |
| LoRa payload | 64 B | static |
| HTTP response (dashboard) | 2048 B | dynamic (heap) |
| Event ring | 16 × 32 B | static |

---

## 169. Numerical Formats

| Value | Format | Example |
| --- | --- | --- |
| Latitude | decimal degrees ×1e6, int32 LE | 45531240 |
| Longitude | decimal degrees ×1e6, int32 LE | 12304560 |
| Altitude | meters, int16 LE | 812 |
| Frequency | Hz, uint32 | 433500000 |
| Battery | volts ×100, uint16 | 392 |
| Sats | uint8 | 9 |
| Fix | uint8 | 1 |

---

## 170. Display Fonts — Metrics

| Font | Cell | Uses |
| --- | --- | --- |
| Base 8×8 | 8×8 px | Status, menus |
| Mini 6×8 | 6×8 px | Dense tables, serial dump view |
| Double 16×16 | 16×16 px | Emergency banner, SOS |
| Icon set | 8×8 px | Battery, sats, TX, RX bars |

---

## 171. OLED Command Sequence (Init)

```text
0xAE  display off
0xD5 0x80  clock divide
0xA8 0x3F  multiplex 64
0xD3 0x00  display offset
0x40  start line 0
0x8D 0x14  charge pump on
0x20 0x02  memory mode (page)
0xA1  segment remap
0xC8  com scan remapped
0xDA 0x12  com pins
0x81 0xCF  contrast (set from brightness)
0xD9 0xF1  pre-charge
0xDB 0x40  vcom detect
0xA4  display on (resume)
0xA6  normal (not inverted)
0xAF  display on
```

---

## 172. SX1262 SPI Command Timing

| Operation | NSS low duration (typ.) |
| --- | --- |
| SetStandby | ~20 µs |
| WriteBuffer (18 B) | ~50 µs |
| SetTx | ~20 µs |
| GetIrqStatus | ~30 µs |
| Full TX sequence | ~150 µs (SPI overhead only; airtime dominates) |

---

## 173. Bridge Internal Architecture

```text
┌──────────────┐     ┌──────────────────────────────────────┐
│ Serial port  │────►│ handle_serial() → parse_pos_line()   │
│ (115200)     │     │   │                                   │
└──────────────┘     │   ▼                                   │
                     │ BridgeState (lock-protected)          │
                     │   └─► TUI (track + share link + log)  │
                     │   └─► should_open_browser()?          │
                     │        └─► webbrowser.open(url)       │
                     └──────────────────────────────────────┘
┌──────────────┐     ┌──────────────────────────────────────┐
│ HTTP server  │◄────│ /stream /ping /state (loopback)       │
│ 127.0.0.1    │     │   page polls → STATE.note_page_ping() │
└──────────────┘     └──────────────────────────────────────┘
```

---

## 174. Bridge State Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `lat` | float | Latitude |
| `lng` | float | Longitude |
| `alt` | float | Altitude (m) |
| `sats` | float | Satellites |
| `freq` | float | Frequency (MHz) |
| `mode` | str | Mode |
| `payload` | str | Raw payload (truncated 128) |
| `fix` | float | Fix quality |
| `age` | float | Fix age (s) |
| `ts` | int | Stream counter (increments on change) |
| `page_open` | bool | Is the page polling? |

---

## 175. Website Component Inventory

| Component | Path | Role |
| --- | --- | --- |
| Layout | src/layouts/Layout.astro | Global chrome, SEO head |
| WikiLayout | src/layouts/WikiLayout.astro | Article shell, TOC, JSON-LD |
| WikiSearch | src/components/WikiSearch.astro | Search bar over all pages |
| wiki-nav | src/lib/wiki-nav.ts | Navigation registry (enforced by CI) |
| site.css | public/css/site.css | Design system |
| firstBody.cjs | scripts/firstBody.cjs | Extracts the firmware dashboard HTML |
| verify-website.mjs | .github/scripts/ | CI verification (SEO, links, gates) |

---

## 176. Wiki Search Behavior

- Searches across every wiki page's title and content.
- Results show the page title; body text appears only when the query
  matches the description, keeping the list scannable.
- Keyboard: Up/Down to navigate, Enter to open, Esc to close.
- The search index is generated at build time from the content collection
  (fast, static, no server).

---

## 177. JSON-LD Structured Data (Website)

| Page type | Schema |
| --- | --- | --- |
| All pages | WebSite |
| Wiki articles | Article + BreadcrumbList |
| Landing | WebSite + Organization (via head) |

---

## 178. Sitemap and Robots

| File | Contents |
| --- | --- |
| /robots.txt | Allow all, sitemap URL |
| /sitemap-index.xml | Auto-generated by @astrojs/sitemap |
| /sitemap-0.xml | All 450+ pages |

---

## 179. Analytics and Privacy (Website)

- No third-party analytics, cookies, or trackers on the site.
- Vercel server logs may capture standard request metadata (hosting
  platform behavior).
- The repeaters and report pages use OSM tiles (no key, no account); the
  Overpass queries are anonymous.
- See the Privacy page for the full statement.

---

## 180. Brand Assets

| Asset | File | Use |
| --- | --- | --- |
| Banner | website/public/banner.png | OG image, README header, branding page |
| Favicon | website/public/favicon.svg | Browser tab icon |
| OG image | website/public/og.png | Social sharing (1200×630) |
| Logo text | — | "Aegis-Beacon" in Chakra Petch |

---

## 181. Design System Summary

| Token | Value |
| --- | --- |
| Display font | Chakra Petch |
| Body font | Manrope |
| Mono font | JetBrains Mono |
| Accent | Signal orange (#f97316 family, OKLCH) |
| Background (dark) | Deep graphite (OKLCH, AA-checked) |
| Background (light) | Paper white (AA-checked) |
| Radius | Tiered (2 / 6 / 12 / 999) |
| Motion | Reduced-motion respected |
| Focus | Visible :focus-visible rings |

---

---

## 182. Complete Walkthrough — Build Your First Beacon

### 182.1 Step 1 — Gather parts (30 min)

| Part | Qty | Notes |
| --- | --- | --- |
| ESP32 DevKit V1 | 1 | 4 MB flash |
| SX1262 module (LoRa) | 1 | 433 MHz version |
| SSD1309 2.42" OLED | 1 | I2C |
| NEO-6M GPS | 1 | With patch antenna |
| TP4056 charger | 1 | With protection |
| 18650 cell + holder | 1 | 2000–3000 mAh |
| AMS1117-3.3 | 1 | Or use the DevKit's regulator |
| Buzzer 2.7 kHz | 1 | |
| 2N2222 + resistors | set | |
| Buttons ×4 | 4 | Tactile |
| Antenna (whip) + SMA | 1 | Quarter-wave 433 MHz |
| Perfboard, wire, headers | — | |

### 182.2 Step 2 — Flash the firmware (15 min)

```bash
pip install platformio
pio run -t upload
pio run -t monitor
```

Confirm `AEGIS:HELLO:v5.5.0`.

### 182.3 Step 3 — Bench test without radio (20 min)

1. Power over USB only.
2. Confirm OLED status screen.
3. Confirm serial commands (STATUS, POS → ERR:03 is fine without GPS).
4. Test all four buttons change modes.

### 182.4 Step 4 — Add and test the radio (30 min)

1. Wire the SX1262 per §65.1.
2. Boot; watch for `[radio] init ok`.
3. With a second unit or SDR, verify TX decodes.

### 182.5 Step 5 — Add GPS (20 min)

1. Wire per §65.3.
2. Take it to a window; confirm `AEGIS:POS:` within 2 min.

### 182.6 Step 6 — Battery and enclosure (45 min)

1. Wire the TP4056 and battery; confirm charge LED behavior.
2. Calibrate the battery monitor (§54.2).
3. Fit the case, mount the antenna, do a final field test.

---

## 183. Complete Walkthrough — Configuring via Serial Only

```text
AEGIS:HELLO:v5.5.0
> FREQ 433.500
AEGIS:FREQ:433.500
> WPM 16
AEGIS:WPM:16
> MODE BEACON
AEGIS:MODE:BEACON
> STATUS
AEGIS:STATUS:mode=BEACON;freq=433.500000;batt=3.92V;vbat_raw=2876;sats=9;fix=1;age=0;wpm=16;tx_power=20;interval=30000;uptime=1234s
> SLEEP 60
AEGIS:SLEEP:60
(device sleeps 60 s, wakes, resumes BEACON)
```

---

## 184. Complete Walkthrough — Using the Bridge with a Group

1. Each beacon has a unique `freq_bcn` (§122).
2. A laptop runs the bridge connected to the receiving unit.
3. The bridge logs every position to its local track and prints share
   links.
4. The operator pastes the share link into the group chat; everyone opens
   the Report Position page.
5. If a page is open, the bridge streams live updates to it (no new tabs).

---

## 185. Measurement Log — Representative Field Test

| Parameter | Measurement |
| --- | --- |
| Date | 2026-09-05 |
| Location | Alpine valley, 1,450 m |
| Frequency | 433.500 MHz |
| Power | +20 dBm |
| Antenna | Quarter-wave whip |
| Distance (LOS) | 4.7 km |
| RSSI at receiver | −102 dBm (SF7) |
| SNR | +6 dB |
| Decode success | 98% (49/50 packets) |
| Battery at start/end | 4.08 V / 3.94 V (2 h beaconing) |

---

## 186. Edge Cases and Their Handling

| Case | Behavior |
| --- | --- |
| GPS fix at exactly ±90° | Clamped to ±90° |
| Frequency exactly at band edge | Allowed if within 433.050–434.790 |
| WPM out of range | Clamped to 5–40 |
| Payload with non-ASCII | Sanitized to ASCII |
| Serial line longer than buffer | Truncated at 256 B |
| Bridge receives corrupt line | Parsed defensively; bad fields dropped |
| NVS full | Oldest key evicted? No — write fails with ERR:05 |
| Battery ADC saturated | Reports 6.2 V max |

---

## 187. Performance Metrics

| Metric | Value | How measured |
| --- | --- | --- |
| Beacon cycle time | ~26 s at 14 WPM | Stopwatch over 10 cycles |
| Fix-to-TX latency | < 1 s after fix | Serial timestamps |
| SEARCH hop time | 5 s dwell | Code + timer |
| OLED refresh | On-change only | Code inspection |
| Serial throughput | 11.5 kB/s max | 115200 baud |
| Bridge poll latency | < 100 ms | Loopback timing |
| Boot to HELLO | < 5 s | Serial log |

---

## 188. Radio Library Dependencies

| Library | Version | Purpose |
| --- | --- | --- |
| (none for the radio) | — | The firmware drives the SX1262 directly over SPI |
| (OLED) | — | Direct I2C driver included in the sketch |
| (GPS) | — | Direct NMEA parser in the sketch |
| Arduino core | ≥ 2.0.14 | Platform base |
| WiFi (dashboard) | built-in | ESP32 WiFi lib |
| WebServer | built-in | HTTP server for the dashboard |

Deliberate choice: no third-party radio/display/GPS libraries — the
firmware is self-contained, which keeps the flash footprint small and the
behavior deterministic.

---

## 189. Firmware Style Guide

| Rule | Example |
| --- | --- |
| Functions do one thing | `parseNmea()`, `buildPayload()` |
| Constants are named | `DEFAULT_WPM` not `14` |
| Comments explain why | "never optimistic past the real spot" |
| No magic numbers in logic | Use named constants |
| Serial protocol is versioned | `AEGIS:HELLO:v5.5.0` |
| All config through NVS layer | No direct flash writes |

---

## 190. Code Review Checklist (for Maintainers)

| Item | Check |
| --- | --- |
| Serial protocol backward compatible | ☐ |
| No new global mutable state without need | ☐ |
| NVS writes verified | ☐ |
| Watchdogs not disabled | ☐ |
| Strings sanitized before display/serial | ☐ |
| Mode state machines can't livelock | ☐ |
| Benchmarks compile for all envs | ☐ |
| Wiki/docs updated | ☐ |
| Conventional commit message | ☐ |

---

## 191. Release Checklist

| Step | Done |
| --- | --- |
| Version bumped everywhere (§140) | ☐ |
| Changelog + What's New updated | ☐ |
| CI green (website, firmware, benchmarks) | ☐ |
| Tag pushed | ☐ |
| Release notes written from the changelog | ☐ |
| Wiki updated to the new version | ☐ |

---

## 192. Troubleshooting — Radio Won't Initialize

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| ERR:01 at boot | SPI wiring wrong | Verify SCK/MISO/MOSI/NSS per §65.1 |
| ERR:01 with correct wiring | Power to module missing | Check 3V3 and GND to the module |
| BUSY stuck high | Module held in reset | Check RST pin (GPIO14) is driven |
| Calibrate hangs | Bad module / solder | Reflow or replace module |
| Works cold, fails warm | Marginal supply | Add bulk capacitance on VBAT |

---

## 193. Troubleshooting — GPS Won't Fix

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| sats=0 indoors | No sky | Go outside / window |
| sats=0 outdoors | Antenna not connected | Check patch antenna |
| GGA absent | Wiring wrong | Check TX/RX crossover (§65.3) |
| Fix drops repeatedly | Sky blockage / multipath | Move; check GPS_HOLD |
| Fix is stale | age increasing | Module losing lock; check antenna |

---

## 194. Troubleshooting — Display Issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Blank OLED | I2C wiring / address | Verify SDA/SCL, 0x3C, pull-ups |
| Flicker during TX | 3V3 droop | Bulk cap on VBAT; 100 nF near OLED |
| Partial frame | I2C contention | Check for address conflicts |
| Artifacts | Marginal timing | Reduce I2C speed to 100 kHz for test |

---

## 195. Troubleshooting — Power and Battery

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Battery reads high | Divider calibration | Recalibrate BAT_OFFSET |
| Battery reads low | ADC attenuation config | Check 11 dB attenuation setting |
| Won't charge | Deep discharge / bad cell | Pre-charge recovery; replace cell |
| Sudden reboot | Brownout | Check supply, add capacitance |
| Sleep current high | LDO quiescent | Add load switch (§44.5) |

---

## 196. Troubleshooting — Bridge

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No port found | Driver / cable | Install CP210x/CH340; use data cable |
| Retries forever | Wrong port | `--list`, select the right one |
| No positions | No GPS fix on device | Send POS; move to sky |
| Page won't stream | Safari / stale page | Reload; or use the link path |
| Port busy | Another monitor open | Close it, or `--http-port` change |

---

## 197. Reference — Antenna Dimensions by Band

| Band | λ/4 (cm) | λ/2 (cm) | Notes |
| --- | --- | --- | --- |
| 433.500 MHz | 17.3 (16.4 physical) | 34.6 (33) | Primary band |
| 868 MHz | 8.6 | 17.3 | Future revision |
| 915 MHz | 8.2 | 16.4 | Future revision |
| 144 MHz (2 m) | 52 | 104 | Receivers only |

---

## 198. Reference — LoRa Sync Words

| Sync word | Use |
| --- | --- |
| 0x1424 | Public standard (used by this project) |
| 0x1425 / others | Private networks (custom) |
| 0x3444 | LoRaWAN public |

---

## 199. Reference — Morse Timing Table (ms)

| WPM | Unit | Dot | Dash | Char gap | Word gap |
| --- | --- | --- | --- | --- | --- |
| 5 | 120 | 120 | 360 | 360 | 840 |
| 10 | 60 | 60 | 180 | 180 | 420 |
| 12 | 50 | 50 | 150 | 150 | 350 |
| 14 | 43 | 43 | 129 | 129 | 300 |
| 16 | 37.5 | 37.5 | 112.5 | 112.5 | 262.5 |
| 20 | 30 | 30 | 90 | 90 | 210 |
| 25 | 24 | 24 | 72 | 72 | 168 |
| 30 | 20 | 20 | 60 | 60 | 140 |
| 40 | 15 | 15 | 45 | 45 | 105 |

---

## 200. Reference — Frequently Asked Legal Questions

**Q: Can I listen to repeaters without a license?**
A: RX-only is generally unrestricted, but check local interception laws.

**Q: Is PMR446 legal to use for a group?**
A: Yes — license-free, but the beacon does not transmit on PMR446.

**Q: Can an unlicensed person use this beacon?**
A: Only in jurisdictions where 433 MHz ISM low-power operation is allowed
with certified equipment (10 mW ERP); for real emergency use, a licensed
operator should control the frequency.

**Q: What identification is needed?**
A: Per your license class — typically a callsign announced in Morse or
voice. The payload can carry an operator ID field.

---

## 201. Data Retention and Logs

| Log | Where | Retention |
| --- | --- | --- |
| Bridge live log | Terminal | Session only |
| Bridge track | Terminal | Session only (8 fixes on screen) |
| Site report page | URL params | Ephemeral (page state) |
| Field log (manual) | User's notebook/CSV | User-managed |
| CI artifacts | GitHub | 7 days (benchmarks) |
| Release assets | GitHub | Forever |

---

---

## 202. NMEA Reference — All Sentences the GPS Can Emit

The NEO-6M can output several sentences; the firmware parses GGA and
ignores the rest. This table documents the full set for debugging.

| Sentence | Content | Firmware use |
| --- | --- | --- |
| `$GPGGA` | Time, position, fix quality, sats, HDOP, altitude | **Parsed** |
| `$GPGLL` | Lat/lng, time, fix status | Ignored |
| `$GPGSA` | Active satellites, PDOP/HDOP/VDOP | Ignored |
| `$GPGSV` | Satellites in view | Ignored |
| `$GPRMC` | Recommended minimum (speed, course, date) | Ignored (future use) |
| `$GPVTG` | Track and ground speed | Ignored |
| `$GPTXT` | Text messages (e.g. "Antenna open") | Ignored |

### 202.1 Typical GGA line

```text
$GPGGA,092112.00,4531.87440,N,01118.27360,E,1,09,0.9,812.4,M,48.0,M,,*5F
```

| Field | Value | Meaning |
| --- | --- | --- |
| 1 | 092112.00 | 09:21:12 UTC |
| 2 | 4531.87440 | Lat 45°31.87440′ |
| 3 | N | North |
| 4 | 01118.27360 | Lng 11°18.27360′ |
| 5 | E | East |
| 6 | 1 | Fix quality (GPS) |
| 7 | 09 | 9 satellites |
| 8 | 0.9 | HDOP |
| 9 | 812.4 | Altitude (m) |

---

## 203. GPS Configuration Messages (u-blox, for Reference)

The firmware leaves the NEO-6M at factory defaults; advanced users can
configure the module over its own UART with u-blox commands:

| Command class | Purpose |
| --- | --- |
| CFG-PRT | Port configuration (baud, protocol) |
| CFG-MSG | Which sentences are output |
| CFG-RATE | Measurement rate (1–10 Hz) |
| CFG-NAV5 | Dynamic platform model |
| CFG-SBAS | SBAS enable/disable |
| CFG-RST | Soft/hard reset |

> [!WARNING]
> Reconfiguring the module can disable the GGA output the firmware
> depends on. Keep a factory reset procedure handy (u-center or the
> module's default config).

---

## 204. Bill of Materials — Expanded with Alternatives

| Part | Primary | Alternative | Price range |
| --- | --- | --- | --- |
| MCU | ESP32 DevKit V1 | ESP32-S3 DevKit, ESP32-C3 Super Mini | €7–15 |
| Radio | SX1262 433 MHz module | E22-400M30S, Ra-01SH | €4–12 |
| Display | SSD1309 2.42" I2C | SSD1306 0.96" (smaller), SH1106 | €3–10 |
| GPS | NEO-6M | NEO-M8N (better), ATGM336H | €5–15 |
| Charger | TP4056 module | IP5306 (with boost), MCP73831 | €1–4 |
| Regulator | AMS1117-3.3 | TPS54302 (buck), ME6211 | €1–6 |
| Battery | 18650 + holder | 2×18650 parallel, LiPo pouch | €5–15 |
| Buzzer | 2.7 kHz passive | 5 V active buzzer (with resistor) | €0.5–2 |
| Buttons | Tactile 6×6 | Membrane, waterproof | €1–3 |
| Antenna | Quarter-wave whip | Helical rubber duck, J-pole | €2–10 |
| Enclosure | 3D-printed (STL) | Hammond 1591, ABS box | €3–15 |
| Misc | Wire, headers, perfboard | Proto PCB | €3–8 |

Total (core, single-unit): €25–45 depending on choices and vendors. The
website's Builder page prices this live and auto-fits a budget.

---

## 205. Antenna Matching Networks

### 205.1 When to match

Measure the antenna impedance at the feed point with a VNA. If the SWR is
above 1.5:1 at the operating frequency, add a matching network.

### 205.2 Common topologies at 433 MHz

| Antenna | Typical impedance | Network | Component values (approx.) |
| --- | --- | --- | --- |
| Short whip (capacitive) | 25 − j50 Ω | Series L | L ≈ 18 nH |
| Long whip (inductive) | 75 + j30 Ω | Shunt C | C ≈ 12 pF |
| Helical (variable) | 20–80 Ω reactive | L-match | L 15–27 nH, C 5–15 pF |
| 50 Ω (ideal) | 50 + j0 Ω | None | — |

### 205.3 Tuning procedure

1. Connect the VNA at the SMA feed.
2. Sweep 433.0–434.8 MHz; note SWR minimum.
3. Add/remove the network component; re-sweep.
4. Iterate until SWR < 1.5 across the used frequency.
5. Lock the components with a dab of glue or heatshrink.

---

## 206. LoRaWAN Considerations (Future Integration)

| Aspect | Notes |
| --- | --- | --- |
| Region | EU868 plan for Europe; the beacon hardware supports 433 MHz custom LoRa |
| Joining | OTAA with AppKey (device credentials) |
| Payload | Use the same 18-byte schema as a custom port |
| Duty cycle | EU868 sub-band limits apply (~1% typical) |
| Power | Max +14 dBm in EU868 — lower than the beacon's +20/22 dBm |
| Use case | Optional cloud delivery of positions; not required for the core mission |

---

## 207. Battery Management Deep Dive

### 207.1 Cell selection

| Criterion | Recommendation |
| --- | --- |
| Capacity | 2000–3500 mAh |
| Chemistry | Li-ion (18650) |
| Protection | Protected cell OR DW01A on the holder |
| Discharge rating | ≥ 1 A continuous (beacon peaks ~0.25 A) |
| Temperature | −20–60 °C discharge |

### 207.2 Charging curve

```text
Voltage
 4.2V ┤                  ┌────── CV phase ──────┐
 3.7V ┤     ┌────────────┘                      │
      ┤  CC │                                  │
      └─────┴──────────────────────────────────┘
       0A        1A (CC)          tapering      0A
```

### 207.3 Runtime vs. interval

| Beacon interval | Draw (avg, 3000 mAh) | Runtime |
| --- | --- | --- |
| 10 s | ~55 mA | ~55 h |
| 30 s | ~30 mA | ~100 h |
| 60 s | ~18 mA | ~165 h |
| 300 s | ~7 mA | ~430 h |

---

## 208. Firmware Performance Budget Analysis

| Loop iteration | Max work | Typical time |
| --- | --- | --- |
| Serial parse | 1 line | < 1 ms |
| GPS parse | 1 sentence | < 1 ms |
| Button scan | 4 pins | < 1 ms |
| OLED (on change) | 1 KB blit | ~23 ms |
| Radio poll | RX timeout | < 5 ms |
| Battery sample | 8 reads | < 2 ms |

Worst-case loop iteration (all events simultaneously): ~35 ms, leaving
ample headroom against the 5 s task watchdog.

---

## 209. Flash and RAM — What Consumes Space

| Consumer | Approx. flash | Approx. RAM |
| --- | --- | --- |
| Arduino core | 900 KB | 100 KB |
| WiFi stack | 180 KB | 30 KB |
| Radio driver | 25 KB | 2 KB |
| Display driver + fonts | 45 KB | 1.2 KB (frame buffer) |
| GPS parser | 8 KB | 1 KB |
| Morse engine | 6 KB | 1 KB |
| Config + NVS | 10 KB | 2 KB |
| Application logic | 120 KB | 15 KB |

---

## 210. Field Guide — Reading the Display

| Element | What it tells you |
| --- | --- |
| Mode text (BEACON/SEARCH/...) | Current mode |
| Frequency | Active frequency (MHz) |
| Battery icon | Approximate charge |
| SAT nn | Satellites in use |
| ALT | Altitude (m) |
| FIX | Fix age (s) |
| TX dot | Transmitting now |
| RSSI/SNR (SEARCH) | Received signal quality |
| Squelch bar (SEARCH) | Squelch threshold vs. signal |

---

## 211. Field Guide — Audio Interpretation

| Sound | Meaning |
| --- | --- |
| SOS ×2 + data (beacon) | Normal beacon cycle |
| Continuous SOS + data | EMERGENCY mode |
| Single long tone | Key-up test / radio self-check |
| Rapid beeps | Low battery warning (3 rapid) |
| Chirp at boot | Firmware boot confirmation |

---

## 212. Glossary — Field Operations

| Term | Definition |
| --- | --- |
| Bearing | Direction to the signal (compass) |
| DF | Direction finding |
| Grid search | Systematic area search |
| Homing | Following the signal to its source |
| LOS | Line of sight |
| Multipath | Signal arriving via reflections |
| Null | A direction with no signal (multipath) |
| Squelch | Signal threshold before audio opens |

---

## 213. Coordinating with Rescue Services

- Contact the regional mountain-rescue coordination (CNSAS, REGA, PGHM,
  Bergrettung, REMER...) on their published frequencies/channels.
- Provide: your callsign, position, the beacon's frequency and mode, and the
  last known position.
- The bridge's share link gives them a map view instantly.
- Follow their instructions; amateur nets are a backup, not the primary SAR
  channel.

---

## 214. Training and Practice

| Exercise | Purpose |
| --- | --- |
| Bench loopback | Verify TX/RX with two units |
| Park hide-and-seek | Practice homing in a safe area |
| Timed grid search | Practice systematic search |
| Night exercise | Practice with reduced visibility |
| Bridge rehearsal | Practice logging and sharing positions |

---

## 215. Accessibility Considerations

| Feature | How the project helps |
| --- | --- |
| Low vision | Large SOS banner, high-contrast OLED |
| Hearing | Visual TX indicator on OLED |
| Gloved operation | Large tactile buttons, 50 ms debounce |
| Cold weather | Buttons work with gloves (tactile, raised) |
| Non-technical users | Wiki quick start, bridge automation |

---

## 216. Sustainability and Disposal

- The 18650 cell must be recycled at a battery collection point.
- The PCB and electronics should be disposed of as e-waste.
- The 3D-printed case is recyclable PLA/ABS depending on material.
- The firmware is open source; nothing is locked or proprietary.

---

## 217. Related Projects and References

| Project / resource | Relation |
| --- | --- |
| Meshtastic | LoRa mesh radios (different mission) |
| LoRaWAN | Long-range IoT protocol (optional integration) |
| APRS | Amateur position reporting (144 MHz) |
| SDR receivers | Decoding the beacon's LoRa/Morse |
| RepeaterBook | Repeater directory (used by the site) |
| OpenStreetMap | Map tiles for the site's maps |

---

## 218. FAQ — Fifth Edition (Everything Else)

**Q: Does it work without any internet?**
A: The beacon and receivers work fully offline. Internet is only needed
for the optional website integration (bridge → Report Position page).

**Q: Can I build it with only the parts I have?**
A: Probably — the core is the ESP32 + SX1262. The OLED, GPS and buzzer are
each optional to a degree (no GPS = no position; no OLED = serial only;
no buzzer = LoRa only).

**Q: What if I break a pin?**
A: Most signals are on multiple GPIOs; see §100 for remap options and the
Board Variants wiki page.

**Q: Is the WiFi dashboard required?**
A: No — every setting is also reachable via the four buttons or serial.
The dashboard is a convenience.

**Q: Can two beacons talk to each other?**
A: Only through a receiver in SEARCH mode; the beacon TX channel is
one-directional by design. For bidirectional comms, add a second device in
SEARCH.

**Q: How do I know my firmware is the latest?**
A: Check `AEGIS:HELLO:vX.Y.Z` against the releases page and the wiki's
changelog.

---

## 219. Reference — Data Flow Diagram (Full System)

```text
[GPS] ──► [Firmware: position] ──► [Morse engine] ──► [Buzzer (audio)]
                        │
                        └──────► [LoRa TX] ──► air ──► [Receiver SEARCH]
                                                       │
                                                       ├──► [OLED display]
                                                       └──► [Serial AEGIS:POS]
                                                              │
                                                              ▼
                                                   [Bridge] ──► [Site page]
                                                              │
                                                              └──► [Track + share link]
```

---

## 220. Reference — Timing Diagram (One Beacon Cycle)

```text
time ──►
0s       1s          6s              26s        27s      57s
│ key-up │ SOS SOS    │ payload Morse  │ key-down │ pause  │ next cycle
└────────┴────────────┴────────────────┴──────────┴────────┘
   pre     announce     data             post       interval
```

---

## 221. Reference — Voltage Rails During TX

| Rail | Idle | During TX (+20 dBm) | During TX (+22 dBm) |
| --- | --- | --- | --- |
| VBAT | 3.7–4.2 V | dips 50–150 mV | dips 80–200 mV |
| 3V3 | 3.30 V | dips 30–80 mV | dips 50–120 mV |

Marginal rails cause flicker and brownouts; §194 covers the fixes.

---

## 222. Reference — Connector Pinouts

| Connector | Pin | Signal |
| --- | --- | --- |
| USB (micro/Type-C) | 1 | VBUS (+5 V) |
| USB | 2/3 | D−/D+ |
| USB | 4/5 | GND / (CC on Type-C) |
| SMA | center | RF |
| SMA | outer | Ground |
| Battery holder | + / − | Cell terminals |
| JST-XH (if used) | 1/2 | BAT+ / BAT− |

---

## 223. Reference — Torque and Fastener Specs

| Fastener | Torque | Use |
| --- | --- | --- |
| SMA nut | 1.2–1.7 N·m (finger + 1/4 turn) | Antenna |
| M3 (case) | 0.3–0.5 N·m | Enclosure |
| M3 (PCB standoff) | 0.4–0.6 N·m | Board mount |

---

## 224. Reference — Adhesive and Sealing

| Application | Material | Notes |
| --- | --- | --- |
| Case seal | Silicone gasket or foam tape | IP54 |
| Antenna feed | Silicone sealant around SMA | Water ingress |
| Button boot | Rubber membrane or silicone dots | Splash |
| OLED window | Clear PET/acrylic, glued | UV-safe |

---

## 225. Reference — Labels and Markings

| Label | Content |
| --- | --- |
| Top of case | Aegis-Beacon logo, version |
| Rear | Callsign field, emergency note |
| Battery compartment | Cell type, polarity |
| SMA | Frequency band |
| Serial | Port, baud |

---

---

## 226. Units and Conversions Reference

| Quantity | Unit | Conversion |
| --- | --- | --- |
| Power | dBm | 0 dBm = 1 mW; +20 dBm = 100 mW; +22 dBm = 158 mW |
| Power | mW ↔ dBm | dBm = 10·log10(mW) |
| Distance | km ↔ mi | 1 km = 0.6214 mi |
| Altitude | m ↔ ft | 1 m = 3.281 ft |
| Frequency | MHz ↔ Hz | 1 MHz = 1,000,000 Hz |
| Temperature | °C ↔ °F | F = C × 9/5 + 32 |
| Angle | deg ↔ rad | 1 rad ≈ 57.30° |
| Capacity | mAh ↔ Ah | 1000 mAh = 1 Ah |
| Energy | Wh | Wh = V × Ah (e.g. 3.7 V × 3 Ah = 11.1 Wh) |

---

## 227. Signal Level Reference

| Level | Example |
| --- | --- |
| +22 dBm | Emergency TX (158 mW) |
| +20 dBm | Default beacon TX (100 mW) |
| 0 dBm | 1 mW — SDR reference level |
| −50 dBm | Strong local signal |
| −87 dBm | Typical received beacon at 500 m |
| −100 dBm | Weak but decodable |
| −123 dBm | SF7 sensitivity floor |
| −129 dBm | SF9 sensitivity floor |
| −137 dBm | SF12 sensitivity floor |

---

## 228. Battery Voltage Reference (Instant Readings)

| Reading | Meaning |
| --- | --- |
| 4.20 V | Full |
| 3.90–4.10 V | Charged (90–100%) |
| 3.80 V | ~50% |
| 3.65 V | ~25% |
| 3.50 V | Low — recharge soon |
| 3.30 V | Critical — sleep threshold |
| < 3.0 V | Protection circuit cutoff |

> [!TIP]
> Readings under load are lower than at rest; compare like-for-like (both
> at rest, or both during TX).

---

## 229. Complete SEARCH Operation Guide

### 229.1 Setup

1. Ensure SEARCH mode is selected (`MODE SEARCH`).
2. Set `freq_rx` / `freq_rx2` to the target beacon's transmit frequency.
3. Set squelch appropriately (0 = always open for testing).
4. Orient the antenna vertically and clear of your body.

### 229.2 Scanning

- The receiver dwells 5 s on each frequency.
- On a valid packet: display lat/lng, RSSI, SNR, and lock for 30 s.
- If multiple beacons share the scan list, each is identified by payload.

### 229.3 Homing with the display

| Reading | Action |
| --- | --- |
| RSSI rising | You are getting closer — keep heading |
| RSSI falling | Turn around — you passed the null |
| SNR ≥ +10 dB | Close range; switch to Morse audio for precision |
| Signal lost | Backtrack 50–100 m and re-scan |

### 229.4 Close-range confirmation

- Within ~50 m, the Morse audio gives the exact position.
- Compare the decoded lat/lng on the display with your map.
- Record the recovery point with the bridge or in the field log.

---

## 230. RF Exposure and Safety Math

### 230.1 Limits (reference)

| Frequency | General public limit (ICNIRP, avg over 6 min) |
| --- | --- | --- |
| 433 MHz | 27.4 V/m (approx. 0.2 W/m²) |
| 868 MHz | 28.8 V/m |

### 230.2 Practical guidance

- At +22 dBm (158 mW) into a quarter-wave whip, the exposure at 20 cm is
  far below ICNIRP general-public limits.
- Keep the antenna ≥ 20 cm from the body during continuous TX (the
  standard precaution).
- Never hold the antenna tip near eyes or skin.

---

## 231. Complete Firmware Configuration Menu (OLED Order)

| Order | Parameter | Button map |
| --- | --- | --- |
| 1 | Frequency beacon | MODE = next, UP/DN = value, SEL = confirm |
| 2 | Frequency RX | same |
| 3 | Frequency RX2 | same |
| 4 | WPM | same |
| 5 | TX power | same |
| 6 | TX interval | same |
| 7 | Squelch | same |
| 8 | Scroll speed | same |
| 9 | Frequency offset | same |
| 10 | GPS timeout | same |
| 11 | Brightness | same |
| 12 | Exit and save | SEL |

---

## 232. Status Screen Element Reference

```text
BEACON   433.500 MHz    ▮▮▮▮▮
SAT 09  ALT 812m   TX: 12:04
LAT 45.531240
LON 12.304560
FIX 1s   ●TX
```

| Line | Elements |
| --- | --- |
| 1 | Mode, frequency, battery icon |
| 2 | Satellites, altitude, last TX time |
| 3 | Latitude |
| 4 | Longitude |
| 5 | Fix age, TX-active indicator |

---

## 233. Command Response Timing

| Command | Response latency (typ.) |
| --- | --- | --- |
| FREQ | < 50 ms |
| WPM | < 50 ms |
| MODE | < 100 ms |
| POS | < 1 s (waits for latest fix) |
| STATUS | < 100 ms |
| SLEEP | < 10 ms (then sleeps) |
| HELP | < 100 ms |

---

## 234. Bridge Command Forwarding Reference

While the bridge runs, typed lines go to the device:

| Typed | Device receives | Effect |
| --- | --- | --- |
| `FREQ 433.500` | FREQ 433.500 | Set frequency |
| `MODE SEARCH` | MODE SEARCH | Change mode |
| `POS` | POS | Emit position |
| `exit` / `quit` | — | Stop the bridge |
| anything else | forwarded as typed | Sent verbatim |

---

## 235. Site Page Performance Targets

| Metric | Target |
| --- | --- |
| Lighthouse performance | ≥ 95 |
| First contentful paint | < 1.5 s (3G) |
| Largest contentful paint | < 2.5 s |
| CLS | < 0.1 |
| JS per page | < 100 KB (excl. maps) |
| Fonts | Self-hosted, subset |
| Images | Optimized, lazy-loaded |

---

## 236. Wiki Writing Standards

| Rule | Example |
| --- | --- |
| Sentence case headings | "First power-on" not "FIRST POWER ON" |
| Active voice | "Set the frequency" not "The frequency is set" |
| Tables for specs | Every spec as a table |
| Callouts for warnings | [!WARNING] syntax |
| Cross-links | Every page links to related pages |
| No emoji | Plain text only |
| Precise numbers | Real values, not "a lot" |

---

## 237. Content Quality Gates (CI)

| Gate | Enforced | Where |
| --- | --- | --- |
| Wiki nav coverage | Every page registered | website-ci.yml |
| SEO meta | Canonical/OG/Twitter on every page | verify-website.mjs |
| Broken links | No 404s | verify-website.mjs |
| Sitemap | All pages listed | verify-website.mjs |
| No emoji/em-dash | UI source clean | website-ci.yml |
| No AI strings | Code clean (policy page excluded) | website-ci.yml |
| No external fonts | Fonts self-hosted | website-ci.yml |
| No localhost | Production pages clean | verify-website.mjs |

---

## 238. GitHub Workflow Reference

| File | Jobs |
| --- | --- | --- |
| website-ci.yml | check, build, verify, content gates, security audit |
| firmware-ci.yml | PlatformIO compile matrix |
| benchmarks.yml | Benchmark compile matrix + report (no commit) |
| pr-checks.yml | PR title/message format, doc consistency |

---

## 239. Troubleshooting — CI Failures

| Failure | Likely cause | Fix |
| --- | --- | --- |
| "Missing from nav" | New wiki page not registered | Add to wiki-nav.ts |
| "Emoji check" | Emoji in UI source | Remove it |
| "Em-dash check" | Em-dash in UI source | Use hyphen |
| "AI strings" | Co-author/AI text in code | Remove; policy page excluded |
| "External fonts" | Google Fonts link in HTML | Self-host via fontsource |
| "Broken link" | Dead href in a page | Fix the href |
| Firmware compile fail | Sketch error | Fix and re-run |
| Benchmark report empty | Overpass/workflow issue | Check run logs |

---

## 240. Reference — Default Values Quick Table

| Setting | Default |
| --- | --- |
| Beacon frequency | 433.500 MHz |
| RX frequency 1 | 433.475 MHz |
| RX frequency 2 | 433.525 MHz |
| Morse speed | 14 WPM |
| TX power | +20 dBm |
| Beacon interval | 30 s |
| Squelch | 0 (off) |
| Scroll speed | 3 |
| Frequency offset | 0 Hz |
| GPS timeout | 120 s |
| Brightness | 100% |
| Deep sleep period | 60 s |
| GPS hold | 60 s |

---

## 241. Reference — Range vs. Antenna Height

| Antenna height (both ends) | LOS range (SF7, 433 MHz) |
| --- | --- | --- |
| 1 m | ~3.6 km (horizon-limited) |
| 2 m | ~5.1 km |
| 5 m | ~8 km |
| 10 m | ~11.3 km |
| 20 m | ~16 km |

Radio horizon ≈ 4.12 × √h(m) km.

---

## 242. Reference — Decibel Quick Reference

| dB change | Factor |
| --- | --- | --- |
| +3 dB | 2× |
| +6 dB | 4× |
| +10 dB | 10× |
| +20 dB | 100× |
| −3 dB | ½ |
| −6 dB | ¼ |
| −10 dB | 1/10 |
| −20 dB | 1/100 |

---

## 243. Reference — Frequency Plan for Group Ops

| Role | Frequency | Notes |
| --- | --- | --- |
| Beacon 1 | 433.500 | Primary |
| Beacon 2 | 433.525 | |
| Beacon 3 | 433.550 | |
| Search scan | 433.475–433.575 | Covers all beacons |
| Voice coordination | PMR446 (446.00625+ ) | Walkie-talkies |
| Emergency | Beacon frequency | EMERGENCY mode |

---

## 244. Reference — Power Consumption by Feature

| Feature | Extra draw |
| --- | --- |
| OLED on | +25 mA |
| GPS on | +47–67 mA |
| Radio RX | +7 mA |
| Radio TX +20 dBm | +110 mA |
| Radio TX +22 dBm | +130 mA |
| WiFi (dashboard) | +80 mA (while AP up) |
| Buzzer (during key) | +30 mA |

---

## 245. Reference — Code Size by Feature

| Feature | Approx. flash |
| --- | --- |
| Serial protocol + commands | 8 KB |
| WiFi dashboard | 60 KB |
| OLED + fonts | 45 KB |
| Radio driver | 25 KB |
| GPS parser | 8 KB |
| Morse engine | 6 KB |
| Deep sleep + power mgmt | 4 KB |
| Application logic | 60 KB |

---

## 246. FAQ — Sixth Edition (Power and Battery)

**Q: Why does the battery drop fast in SEARCH?**
A: The OLED + GPS may both be on. GPS is not needed in SEARCH; the
firmware powers it off there (§128).

**Q: Can I use a bigger battery?**
A: Yes — any 3.7 V Li-ion within the charger's current limit. Two 18650s
in parallel double capacity.

**Q: What happens at 0 °C?**
A: Li-ion capacity drops significantly below 0 °C; expect reduced runtime.
Warm the cell before TX for best performance.

---

## 247. FAQ — Seventh Edition (Radio)

**Q: Why can't I hear the beacon on a normal FM radio?**
A: The beacon uses LoRa (chirp spread spectrum) and a 2.7 kHz audio tone,
not FM voice. An SDR or a second beacon in SEARCH is required.

**Q: What if two beacons transmit at once?**
A: LoRa packets can collide; the CRC rejects corrupted packets. Spread the
frequencies (§122) or time-slot the beacons.

---

## 248. Reference — Regional ISM and Amateur Bands

| Region | ISM band | Amateur band (relevant) | Notes |
| --- | --- | --- | --- |
| EU | 433.05–434.79 MHz | 430–440 MHz | 10 mW ERP ISM cap |
| US | 902–928 MHz | 420–450 MHz (70 cm) | 433 MHz is not a primary US ISM band |
| Canada | 902–928 MHz | 430–450 MHz | Similar to US |
| Australia | 915–928 MHz | 430–450 MHz | 433 MHz amateur permitted |
| Japan | 920 MHz | 430–440 MHz | Different ISM allocation |

---

## 249. Reference — Time and Timezones

- The GPS provides UTC; the firmware displays it as received (UTC) on the
  status line.
- Field logs should record UTC (or local + offset) consistently.
- The bridge logs in local time with the device's timestamps.

---

## 250. Reference — Serial Escape Sequences

| Sequence | Meaning |
| --- | --- |
| `\r\n` | Line terminator (CRLF) |
| `\n` | Accepted as terminator |
| (none) | No escape codes — commands are plain ASCII |

---

## 251. Reference — Weather Effects on Range

| Condition | Effect on 433 MHz |
| --- | --- |
| Rain | +1–3 dB loss (minor) |
| Snow | +2–5 dB loss |
| Dense fog | +1–2 dB loss |
| Wet foliage | +5–10 dB loss (leaves absorb) |
| Temperature inversion | Possible ducting (longer range) |

---

## 252. Reference — Terrain Effects

| Terrain | Effect |
| --- | --- |
| Ridge between stations | Severe shadowing (10–30 dB) |
| Valley floor | Multipath + shadowing |
| Open water | Slight gain (reflections) |
| Urban canyon | Heavy multipath |
| Forest | 5–15 dB loss |

---

## 253. Reference — Connectors and Adapters

| Adapter | Use |
| --- | --- |
| SMA male ↔ SMA female | Extend antenna feed |
| SMA ↔ BNC | Connect to test gear |
| USB-A ↔ Micro USB | Power/programming (data!) |
| USB-C OTG | Android connection |

---

## 254. Reference — Test Equipment Usage

| Tool | What to measure |
| --- | --- |
| Multimeter | Voltages, continuity |
| VNA | SWR, antenna impedance |
| SDR | Verify TX, decode LoRa |
| Frequency counter | Exact carrier frequency |
| Oscilloscope | I2C/SPI signals, buzzer waveform |
| Power supply | Battery simulation, current draw |

---

## 255. Reference — Soldering Temperatures

| Solder | Tip temp | Joint time |
| --- | --- | --- |
| Leaded 60/40 | 315–340 °C | 1–2 s |
| Lead-free SAC305 | 350–370 °C | 2–3 s |
| SMD rework (hot air) | 300–350 °C air | until reflow |

---

---

## 256. GPIO Alternate Function Table (Full)

| GPIO | ADC | Touch | RTC | Other |
| --- | --- | --- | --- | --- |
| 0 | ADC2_CH1 | TOUCH1 | RTC_GPIO11 | Strapping |
| 2 | ADC2_CH2 | TOUCH2 | RTC_GPIO12 | Strapping |
| 4 | ADC2_CH0 | TOUCH0 | RTC_GPIO10 | — |
| 12 | ADC2_CH5 | TOUCH5 | RTC_GPIO15 | Strapping |
| 13 | ADC2_CH4 | TOUCH4 | RTC_GPIO14 | Strapping |
| 14 | ADC2_CH6 | TOUCH6 | RTC_GPIO16 | Strapping |
| 15 | ADC2_CH3 | TOUCH3 | RTC_GPIO13 | Strapping |
| 25 | DAC1, ADC2_CH8 | — | RTC_GPIO18 | — |
| 26 | DAC2, ADC2_CH9 | — | RTC_GPIO19 | — |
| 27 | ADC2_CH7 | TOUCH7 | RTC_GPIO17 | — |
| 32 | ADC1_CH4 | TOUCH9 | RTC_GPIO9 | — |
| 33 | ADC1_CH5 | TOUCH8 | RTC_GPIO8 | — |
| 34 | ADC1_CH6 | — | RTC_GPIO4 | Input-only |
| 35 | ADC1_CH7 | — | RTC_GPIO5 | Input-only |
| 36 | ADC1_CH0 | — | RTC_GPIO0 | Input-only |
| 39 | ADC1_CH3 | — | RTC_GPIO3 | Input-only |

---

## 257. Complete HELP Output

```text
AEGIS-HELP
FREQ <MHz>        Set frequency (persisted)
FREQ?             List frequencies
WPM <5-40>        Set Morse speed
WPM?              Show speed
MODE <MODE>       BEACON|SEARCH|CONFIG|EMERGENCY
MODE?             Show mode
POS               Print position
STATUS            Device state
SLEEP [sec]       Deep sleep
FACTORY           Reset to defaults
HELP              This list
```

---

## 258. Complete STATUS Output (Annotated)

```text
AEGIS:STATUS:mode=BEACON;freq=433.500000;batt=3.92V;vbat_raw=2876;sats=9;fix=1;age=0;wpm=16;tx_power=20;interval=30000;uptime=1234s
```

| Field | Example | Notes |
| --- | --- | --- |
| mode | BEACON | Current mode |
| freq | 433.500000 | MHz |
| batt | 3.92V | Battery |
| vbat_raw | 2876 | Raw ADC |
| sats | 9 | Satellites |
| fix | 1 | Quality |
| age | 0 | Fix age (s) |
| wpm | 16 | Morse speed |
| tx_power | 20 | dBm |
| interval | 30000 | ms |
| uptime | 1234s | Seconds |

---

## 259. OLED Boot Sequence Messages

```text
AEGIS-BEACON v5.5.0
Initializing...
  Radio: OK
  GPS: acquiring...
  NVS: loaded
  Mode: BEACON
```

(Each line replaces the previous; the last stays on the status screen.)

---

## 260. Bridge TUI Complete Field Reference

```text
  AEGIS-BEACON SERIAL BRIDGE   14:32:08   uptime 412s
  ----------------------------------------------------------
  Device     COM3 @ 115200 baud (connected)
  Position   45.531240, 12.304560
  Share      https://aegis-beacon.vercel.app/report-position?lat=45.531240&lng=12.304560
  Page       open, live streaming
  ----------------------------------------------------------
  Local track (path taken, newest last):
    14:28:11  45.530210, 12.301120
    14:30:47  45.530880, 12.302940
    14:32:08  45.531240, 12.304560
  ----------------------------------------------------------
  Live log:
  [device] AEGIS:POS:lat=45.531240;lng=12.304560;sats=6;fix=1;age=0
  [bridge] share link: https://aegis-beacon.vercel.app/report-position?lat=45.531240&lng=12.304560
```

| Row | Content |
| --- | --- |
| Header | Name, time, uptime |
| Device | Port + state |
| Position | Latest fix |
| Share | Public share link |
| Page | Page state |
| Track | Last 8 fixes (timestamp + coords) |
| Log | Rolling device/bridge messages |

---

## 261. Bridge Log Line Reference

| Line | Example |
| --- | --- |
| Connect | `[bridge] connected to COM3 @ 115200 baud` |
| Position | `[device] AEGIS:POS:lat=...;lng=...` |
| Share | `[bridge] share link: https://...` |
| Page open | `[bridge] page is open, streaming update to it` |
| Opening | `[bridge] opening page with position: https://...` |
| Unchanged | `[bridge] position unchanged, not opening a new tab` |
| Error | `[bridge] cannot open COM3: ...` |

---

## 262. Report Position URL Parameter Reference

| Param | Type | Meaning |
| --- | --- | --- |
| lat | float | Latitude (−90..90) |
| lng | float | Longitude (−180..180) |
| alt | float | Altitude (m) |
| sats | int | Satellites |
| freq | float | Frequency (MHz) |
| mode | str | Mode |
| payload | str | Raw payload |

Example:

```text
/report-position?lat=45.531240&lng=12.304560&alt=812&sats=9&freq=433.500&mode=BEACON
```

---

## 263. Repeaters Page Parameters

| Control | Behavior |
| --- | --- |
| Geolocate | Asks the browser for your position; centers the map |
| Band filter | 6 m / 2 m / 70 cm / All |
| Marker click | Shows callsign, frequency, offset, CTCSS, source link |
| Fallback | If Overpass is busy, curated data with a notice |

---

## 264. Config Dashboard Page Reference

| Element | Source |
| --- | --- | --- |
| The dashboard UI | Extracted from the firmware's `R"HTMLDOC(...)"` at build time |
| Update trigger | Any firmware change → next site build reflects it |
| Related docs | How to connect to the real AP (AegisBeacon-XXXX → 192.168.4.1) |

---

## 265. Benchmarks Page Reference

| Element | Content |
| --- | --- |
| Board matrix | DevKit V1, S3, C3... |
| Metrics | Flash %, RAM %, compile time, warnings |
| Data source | `website/src/data/benchmarks.json` snapshot + CI artifacts |
| Freshness | Regenerated by the workflow on every push (summary + artifact) |

---

## 266. Landing Page Section Map

| Section | Content |
| --- | --- |
| Hero | Device mockup, tagline, CTAs |
| Promise | What the device is for |
| Modes | BEACON/SEARCH/CONFIG/EMERGENCY |
| Specifications | Quick specs table |
| Builder | Link to the BOM builder |
| Wiki | Link to docs |
| Open source | GitHub CTA |

---

## 267. Demo Page Reference

| Control | Behavior |
| --- | --- |
| Mode buttons | Cycle BEACON/SEARCH/CONFIG/EMERGENCY |
| Frequency select | Sets the simulated frequency |
| Power slider | Sets TX power |
| WPM slider | Sets Morse speed |
| OLED | Live simulated display |
| TX indicator | Shows transmission state |

---

## 268. Builder Page Reference

| Feature | Behavior |
| --- | --- |
| BOM table | 11 rows (essentials + optional) |
| Compare links | 5 price engines per part (55 total) |
| Budget field | User-set; totals shown live |
| Auto-fit | Drops optional parts when over budget |
| Budget status | "Within budget" / "Over budget by €X" |

---

## 269. Branding Page Reference

| Section | Content |
| --- | --- |
| Logo | SVG favicon + wordmark |
| Banner | banner.png (1376×768) |
| Colors | Signal orange + graphite palette |
| Typography | Chakra Petch / Manrope / JetBrains Mono |
| Usage | Guidelines for community use |

---

## 270. Terms / Privacy / Disclaimer Coverage

| Page | Covers |
| --- | --- |
| Terms | Site usage, IP, liability |
| Privacy | No analytics, hosting notes, contact |
| Disclaimer | No warranty, not certified, RF/battery/liability |

---

## 271. Complete Field Kit List

| Item | Purpose |
| --- | --- |
| Beacon + antenna | Primary |
| Spare battery | Extended ops |
| Receiver (2nd unit) | Homing |
| Bridge laptop + cable | Logging |
| PMR446 radios | Voice coordination |
| Maps (paper or app) | Navigation |
| Compass | Bearing |
| Multimeter (optional) | Quick checks |
| Spare parts kit | Field repair |

---

## 272. Packing List — Search Team

| Role | Gear |
| --- | --- |
| Leader | Map, radio, receiver, log |
| Operator 1 | Receiver, compass |
| Operator 2 | Receiver, spare battery |
| Logger | Bridge laptop, cable |
| Safety | First aid, spare cells, comms |

---

## 273. Reference — Common Resistor/Cap Values Kit

| Type | Values |
| --- | --- |
| Resistors | 100, 220, 330, 470, 1k, 2.2k, 4.7k, 10k, 100k |
| Capacitors | 100 nF, 1 µF, 10 µF, 100 µF, 470 µF |
| Inductors | 10 nH, 18 nH, 27 nH, 100 nH |

---

## 274. Reference — Wire Gauge Quick Table

| AWG | Diameter (mm) | Current (chassis, A) | Typical use |
| --- | --- | --- | --- |
| 22 | 0.64 | 7 | Signal, button wiring |
| 20 | 0.81 | 11 | Power leads (short) |
| 18 | 1.02 | 16 | Battery leads |
| 16 | 1.29 | 22 | Main power (long) |

---

## 275. Reference — Connector Crimp and Strain Relief

| Practice | Why |
| --- | --- | --- |
| Strain relief on USB and battery | Prevents fatigue breaks |
| Crimp + solder JST contacts | Reliable power |
| Tie wraps at case exits | Stress relief |
| Ferrite bead on USB | EMC |

---

## 276. Reference — ESD Precautions

| Practice | Detail |
| --- | --- | --- |
| Grounded wrist strap | While handling PCBs |
| Anti-static bag | For storage/transport |
| Discharge before touching | Touch a grounded object |
| Avoid synthetic clothing | Static generation |
| Handle by edges | Avoid components/pins |

---

## 277. Reference — Storage Conditions

| Condition | Value |
| --- | --- |
| Temperature | 10–25 °C ideal |
| Humidity | < 60% RH |
| Battery | 40–60% charge |
| Case | Closed, dust-free |
| Antenna | Detached (or protected) |

---

## 278. Reference — Firmware Build Env Details

| Item | Value |
| --- | --- |
| Platform | espressif32@6.x |
| Framework | arduino |
| Board | esp32dev |
| Flash | 4 MB |
| Partition | default |
| Monitor speed | 115200 |
| Upload speed | 921600 |

---

## 279. Reference — Site Dependencies

| Package | Purpose |
| --- | --- |
| astro | Framework |
| @astrojs/sitemap | Sitemap |
| leaflet | Maps |
| fontsource packages | Self-hosted fonts |
| rehype plugins | Wiki rendering (callouts, external links) |

---

## 280. Reference — Bridge Dependencies

| Package | Purpose |
| --- | --- |
| pyserial | Serial port access |
| (stdlib only otherwise) | HTTP, threading, webbrowser |

---

## 281. Reference — Wiki Content Rules

| Rule | Detail |
| --- | --- |
| Frontmatter | title + description required |
| Heading style | Sentence case |
| Callouts | [!WARNING] / [!TIP] / [!NOTE] / [!INFO] / [!IMPORTANT] |
| Links | Internal wiki links relative; external auto target=_blank |
| Images | From public/ only, referenced with absolute paths |
| Tables | For all specs and comparisons |

---

## 282. Reference — SEO Meta Fields (Every Page)

| Field | Value |
| --- | --- |
| title | Page title + site name |
| description | Page-specific |
| canonical | https://aegis-beacon.vercel.app/path |
| og:title | Same as title |
| og:description | Same as description |
| og:image | /og.png (1200×630) |
| og:url | canonical |
| twitter:card | summary_large_image |
| theme-color | Brand color |
| JSON-LD | WebSite (+ Article/Breadcrumb on wiki) |

---

## 283. Reference — Structured Data Examples

### 283.1 WebSite

```json
{"@context":"https://schema.org","@type":"WebSite","name":"Aegis-Beacon","url":"https://aegis-beacon.vercel.app"}
```

### 283.2 Article (wiki)

```json
{"@context":"https://schema.org","@type":"Article","headline":"...","url":"..."}
```

### 283.3 BreadcrumbList (wiki)

```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Docs","item":"..."}]}
```

---

## 284. Reference — OG Image Requirements

| Property | Value |
| --- | --- |
| File | website/public/og.png |
| Dimensions | 1200×630 |
| Format | PNG |
| Source | banner.png center-crop |
| Social cards | WhatsApp, Discord, Telegram, Facebook, X |

---

## 285. Reference — Robots.txt Content

```text
User-agent: *
Allow: /
Sitemap: https://aegis-beacon.vercel.app/sitemap-index.xml
```

---

## 286. Reference — Headers and Security (Site)

| Header | Value |
| --- | --- |
| Content-Type | text/html; charset=utf-8 |
| Referrer-Policy | strict-origin-when-cross-origin (via links rel=noreferrer) |
| X-Frame-Options | (static hosting defaults) |
| CSP | Not set (static site, no dynamic content) |

---

## 287. Reference — Link Policy (In-App Browsers)

All external links on the site (wiki content included) open in a real
browser tab: `target="_blank"` + `rel="noopener noreferrer"` is applied
by the external-links rehype plugin (§175) and inline in the layouts. This
matters when the site is viewed inside WhatsApp/Discord/Telegram/Instagram
in-app browsers — the links hand off to the system browser instead of
staying trapped in the webview.

---

## 288. FAQ — Eighth Edition (Website)

**Q: Why does a link open a new tab?**
A: Deliberate — external links force the system browser so they don't stay
inside in-app browsers (WhatsApp, Discord, etc.).

**Q: How do I share a position?**
A: Paste the bridge's share link, or open
`/report-position?lat=..&lng=..` with coordinates.

**Q: Does the site track me?**
A: No analytics, no cookies, no trackers. See the Privacy page.

---

## 289. FAQ — Ninth Edition (Miscellaneous)

**Q: Can I sell the device?**
A: The hardware design is open (MIT on firmware; hardware files under the
same spirit). CE-marking and liability are your responsibility.

**Q: Can I contribute?**
A: Yes — see CONTRIBUTING.md. Conventional commits; no AI-written code.

**Q: Where are the STL files?**
A: In the repo's hardware folder (referenced by the wiki's Enclosure page).

---

## 290. Changelog — Full History (Condensed)

| Version | Date (approx.) | Highlights |
| --- | --- | --- |
| v1.0 | 2026-05 | Initial firmware proof of concept |
| v2.0 | 2026-05 | OLED, GPS, first field test |
| v3.0 | 2026-06 | Modes, NVS config, serial protocol |
| v4.0 | 2026-07 | WiFi dashboard, bridge, website v1 |
| v5.0 | 2026-08 | Astro website, wiki launch, benchmarks |
| v5.1 | 2026-08 | Config dashboard, serial v1, bridge v1 |
| v5.2 | 2026-08 | Repeater map, SEO overhaul |
| v5.3 | 2026-08 | Wiki search, workflow consolidation |
| v5.4 | 2026-09 | Encoder fix, emergency power fix, loop refactor |
| v5.5 | 2026-09 | Bridge TUI + local tracking, disclaimer, JSON-LD, config-dashboard live extraction, datasheet expansion, workflow hardening |

---

---

## 291. Complete Mode Transition Table

| From \ To | BEACON | SEARCH | CONFIG | EMERGENCY |
| --- | --- | --- | --- | --- |
| BEACON | — | MODE btn / cmd | MODE btn / cmd | MODE btn / cmd |
| SEARCH | MODE btn / cmd | — | MODE btn / cmd | MODE btn / cmd |
| CONFIG | MODE long-press (save) | — | — | (not directly) |
| EMERGENCY | MODE btn / cmd | MODE btn / cmd | — | — |

- CONFIG exits via long-press MODE (saves) — it does not jump directly to
  EMERGENCY.
- EMERGENCY exits to BEACON on any button or `MODE BEACON`; a second MODE
  press during the exit confirmation also works.

---

## 292. Button Action Table (All Contexts)

| Context | MODE | SEL | UP | DN |
| --- | --- | --- | --- | --- |
| Status | Next mode | Status dump (serial) | Brightness+ | Brightness− |
| BEACON TX | Stop TX (key-up) | Skip cycle | — | — |
| SEARCH | Next mode | Lock/resume scan | Squelch+ | Squelch− |
| CONFIG menu | Next parameter | Confirm + next | Value+ | Value− |
| CONFIG edit | Cancel edit | Confirm + next | Value+ | Value− |
| EMERGENCY | Exit to BEACON | Exit to BEACON | Exit to BEACON | Exit to BEACON |
| Power menu | Cancel | — | — | Confirm sleep/reboot/factory |

---

## 293. Long-Press Table

| Button | Duration | Action |
| --- | --- | --- |
| MODE | 1.5 s | Power menu |
| SEL | 1.5 s | Serial status dump |
| UP | 1.5 s | Brightness max |
| DN | 1.5 s | Brightness min |

---

## 294. Key Repeat Table

| Context | Initial delay | Repeat rate |
| --- | --- | --- |
| CONFIG value edit | 500 ms | 250 ms |
| CONFIG menu scroll | 500 ms | 300 ms |
| Brightness | 500 ms | 250 ms |

---

## 295. Audio Tone Patterns

| Pattern | Meaning |
| --- | --- |
| 1× 200 ms chirp at boot | Boot OK |
| 3× 100 ms rapid | Low battery |
| Continuous SOS | EMERGENCY |
| 1× 500 ms | Button press confirm |
| 2× 200 ms | Invalid action (e.g. ERR:04) |

---

## 296. NVS Key List (Complete)

| NVS key | Type | Default |
| --- | --- | --- |
| `freq_bcn` | u32 | 433500000 |
| `freq_rx` | u32 | 433475000 |
| `freq_rx2` | u32 | 433525000 |
| `wpm` | u8 | 14 |
| `tx_power` | i8 | 20 |
| `tx_interval` | u16 | 30000 |
| `squelch` | u8 | 0 |
| `scroll_speed` | u8 | 3 |
| `freq_offset` | i16 | 0 |
| `gps_timeout` | u16 | 120 |
| `brightness` | u8 | 100 |

All keys are namespaced under the default NVS namespace; `FACTORY` erases
the namespace and restores the table above.

---

## 297. RTC RAM Persisted State

| Field | Size | Meaning |
| --- | --- | --- |
| magic | 4 B | Integrity check |
| mode | 1 B | Last mode |
| lat | 4 B | Last latitude |
| lng | 4 B | Last longitude |
| sats | 1 B | Last satellite count |
| boot_count | 4 B | Boot counter (diagnostics) |

---

## 298. Boot Counter and Diagnostics

- `boot_count` increments every boot and is exposed in STATUS (diagnostic).
- A rapidly increasing boot count suggests brownout reboots (§195).
- The value survives deep sleep but not `FACTORY` (which resets it).

---

## 299. Serial Line Sanitization Rules

| Input | Rule |
| --- | --- |
| Control characters | Stripped |
| Non-ASCII | Replaced |
| Length | Truncated at 256 B |
| Command names | Case-insensitive match |
| Arguments | Parsed as numbers, range-checked |
| Unknown commands | Ignored (logged in verbose) |

---

## 300. Security — Serial Command Guards

| Command | Guard |
| --- | --- |
| FACTORY | Requires confirmation (`FACTORY CONFIRM`) |
| SLEEP | Accepts optional seconds, clamped 10–3600 |
| FREQ | Band check 433.050–434.790 |
| WPM | Clamped 5–40 |
| MODE | Enum validated |
| TX power | Clamped 2–22 |

---

## 301. Bridge Security Notes

| Aspect | Detail |
| --- | --- |
| Bind address | 127.0.0.1 only (loopback) |
| CORS | `Access-Control-Allow-Origin: *` on the loopback endpoints |
| Auth | None needed — loopback only, page polls are anonymous |
| Data | Positions stay on your machine; no third-party relay |
| HTTPS page → HTTP loopback | Allowed in Chrome/Edge/Firefox; Safari blocks (link path works) |

---

## 302. Site Security Notes

| Aspect | Detail |
| --- | --- |
| Hosting | Vercel static hosting, HTTPS by default |
| JS | Minimal, no third-party analytics |
| User input | URL params only (report page), validated ranges |
| External data | Overpass/OSM queried client-side; community strings escaped |
| Fonts | Self-hosted (no external requests) |

---

## 303. Accessibility Checklist (Site)

| Item | Status |
| --- | --- |
| Contrast AA | Token-checked in both themes |
| Focus visible | :focus-visible rings |
| Reduced motion | prefers-reduced-motion respected |
| Keyboard nav | All interactive elements tabbable |
| Semantic HTML | header/nav/main/footer used |
| Alt text | Images carry alt |
| Screen reader labels | aria-labels on icon-only controls |

---

## 304. Responsive Breakpoints (Site)

| Width | Behavior |
| --- | --- | --- |
| < 640 px | Single column, hamburger menu |
| 640–1024 px | Two-column layouts, condensed nav |
| > 1024 px | Full desktop layout |

---

## 305. Performance — Wiki Build Numbers

| Metric | Value |
| --- | --- |
| Wiki pages | 440+ |
| Build time | ~40 s (CI) |
| Sitemap entries | 450+ |
| JS per wiki page | Minimal (search only) |
| Static assets | Fonts + CSS + Leaflet |

---

## 306. Site Font Loading Strategy

| Font | Weight | Format |
| --- | --- | --- |
| Chakra Petch (display) | 400–700 | woff2 (fontsource) |
| Manrope (body) | variable | woff2 (fontsource-variable) |
| JetBrains Mono (data) | 400–700 | woff2 (fontsource) |

- All fonts are bundled locally — no Google Fonts requests, ever.
- `font-display: swap` avoids invisible-text flashes.

---

## 307. Design Tokens (Abbreviated)

| Token | Dark | Light |
| --- | --- | --- |
| --bg | #0f1410-ish graphite | paper |
| --ink | near-white | near-black |
| --accent | signal orange | signal orange |
| --muted | 60% ink | 60% ink |
| --border | subtle hairline | subtle hairline |
| --radius-sm / md / lg | 2 / 6 / 12 px | same |

---

## 308. Wiki Component Inventory

| Component | Purpose |
| --- | --- |
| Sidebar | Group navigation |
| Search | Full-wiki search |
| Breadcrumb | Location context |
| TOC | In-page outline with scroll-spy |
| Prev/next | Sequential navigation |
| Callouts | [!WARNING] etc. |
| Edit link | GitHub edit shortcut |

---

## 309. TOC Behavior

| Feature | Detail |
| --- | --- |
| Depth | H2 + H3 |
| Scroll-spy | Active heading highlighted |
| Sticky | Follows scroll on desktop |
| Mobile | Collapsed above content |

---

## 310. Search Index Details

| Aspect | Detail |
| --- | --- |
| Build-time index | From the content collection |
| Query | Case-insensitive substring + scoring |
| Results | Title + description (matched) |
| Keyboard | Up/Down/Enter/Esc |
| Placement | Wiki home + every article |

---

## 311. Repeater Data Sources

| Source | Type | URL |
| --- | --- | --- |
| OpenStreetMap (Overpass) | Live, keyless | overpass-api.de / kumi.systems |
| RepeaterBook | Directory | repeaterbook.com |
| RepeaterMap | Community | repeatermap.de |
| OEVSV | Austria | repeater.oevsv.at |
| USKA | Switzerland | uska.ch |

---

## 312. Overpass Query Notes

| Aspect | Detail |
| --- | --- |
| Tag | `communication:amateur_radio:repeater` |
| Endpoint | Multiple mirrors with failover |
| CORS | Enabled (`Access-Control-Allow-Origin: *`) |
| Rate limits | Public pool — retry/backoff built in |
| Fallback | Curated dataset shown when all mirrors fail |

---

## 313. Map Tiles

| Provider | URL | License |
| --- | --- | --- |
| OpenStreetMap | tile.openstreetmap.org | ODbL, attribution required |

Attribution is shown on every map (report-position and repeaters pages).

---

## 314. Geolocation Usage (Site)

| Page | Permission | Fallback |
| --- | --- | --- |
| Repeaters | Browser geolocation (opt-in) | Manual center + radius |
| Report-position | None (params drive the map) | Default world view |

---

## 315. Benchmark Environments

| Env | Board | Notes |
| --- | --- | --- |
| esp32dev | DevKit V1 | Reference |
| esp32-s3 | S3 DevKit | Native USB |
| esp32-c3 | C3 Super Mini | Smaller flash |

---

## 316. Benchmark Metrics Detail

| Metric | Formula |
| --- | --- | --- |
| Flash % | used_bytes / partition_size × 100 |
| RAM % | used_bytes / available × 100 |
| Compile time | build wall-clock |
| Warnings | parsed compiler warnings |

---

## 317. Release Asset Checklist

| Asset | Source |
| --- | --- |
| Firmware binary | PlatformIO build output |
| Source archive | GitHub auto |
| Release notes | Changelog text |
| Website | Deployed via Vercel (auto) |

---

## 318. Community Norms

| Topic | Norm |
| --- | --- |
| Issues | Search before filing; include firmware version and logs |
| PRs | Conventional commits; CI must pass |
| Discussions | On-topic, respectful |
| Usage | Amateur bands require licenses; follow local law |

---

## 319. Reporting a Bug

1. Check the wiki troubleshooting pages first.
2. Note the firmware version (`AEGIS:HELLO:vX.Y.Z`).
3. Include: board, wiring, steps to reproduce, serial log excerpt.
4. Open an issue with the template.

---

## 320. Feature Request Flow

1. Discuss in GitHub Discussions first.
2. File an issue with the proposed behavior.
3. Implement per the firmware style guide (§189).
4. Open a PR with tests/docs.

---

## 321. Glossary — Radio Amateur Terms

| Term | Definition |
| --- | --- |
| 70 cm | The 430–440 MHz amateur band |
| Callsign | Licensed operator identifier |
| CQ | General call ("seek you") |
| DX | Distant station |
| HT | Handheld transceiver |
| QRM | Interference |
| QRP | Low power operation |
| QTH | Location |
| RIT | Receiver incremental tuning |
| Split | TX/RX on different frequencies |

---

## 322. Glossary — GPS Terms

| Term | Definition |
| --- | --- |
| Almanac | Coarse satellite orbit data |
| Ephemeris | Precise orbit data per satellite |
| HDOP | Horizontal dilution of precision |
| PDOP | Position dilution of precision |
| SBAS | Satellite-based augmentation (EGNOS/WAAS) |
| TTFF | Time to first fix |
| NMEA | GPS sentence protocol |
| Fix | Valid position solution |

---

## 323. Glossary — Web Terms

| Term | Definition |
| --- | --- |
| Astro | Static site framework |
| JSON-LD | Structured data format for SEO |
| OG | Open Graph (social meta) |
| Sitemap | List of pages for crawlers |
| robots.txt | Crawler instructions |
| Canonical | Preferred URL for a page |
| Rehype | HTML processing pipeline (markdown) |

---

## 324. Glossary — Python/Bridge Terms

| Term | Definition |
| --- | --- |
| Daemon thread | Background thread (bridge HTTP server) |
| Loopback | 127.0.0.1 (local only) |
| pyserial | Python serial library |
| TTY | Terminal device |
| TUI | Terminal user interface |
| Heartbeat | Periodic "I am alive" signal |
| Poll | Periodic request for new data |

---

## 325. Number Ranges and Limits (Complete)

| Value | Min | Max | Default |
| --- | --- | --- | --- |
| Latitude | −90 | +90 | — |
| Longitude | −180 | +180 | — |
| Altitude | −500 | +9000 | — |
| Sats | 0 | 24 | — |
| WPM | 5 | 40 | 14 |
| TX power (dBm) | 2 | 22 | 20 |
| Beacon interval (ms) | 1000 | 60000 | 30000 |
| Squelch | 0 | 15 | 0 |
| Scroll speed | 1 | 10 | 3 |
| Freq offset (Hz) | −1000 | +1000 | 0 |
| GPS timeout (s) | 10 | 600 | 120 |
| Brightness (%) | 10 | 100 | 100 |
| Sleep period (s) | 10 | 3600 | 60 |
| GPS hold (s) | 5 | 300 | 60 |

---

## 326. Coordinate Precision Analysis

| Format | Precision at equator |
| --- | --- | --- |
| Degrees (3 dp) | ~111 m |
| Degrees (5 dp) | ~1.1 m |
| Degrees (6 dp, micro) | ~0.11 m |
| DDM (2 dp minutes) | ~18.5 m |
| DDM (1 dp minutes) | ~1.85 m |

- The LoRa payload uses microdegrees (§60): ~0.11 m precision.
- The audible Morse uses DDM with 1 decimal minute (~1.85 m) — plenty for
  rescue work and readable over the air.

---

## 327. Payload Validation Rules

| Field | Check |
| --- | --- |
| Magic | Must equal `AB` |
| Version | ≤ current, forward-compatible |
| Mode | In enum range |
| Fix | 0–8 |
| Sats | 0–24 |
| Lat | −90e6..90e6 |
| Lng | −180e6..180e6 |
| Alt | −500..9000 |
| CRC8 | Must match |

Any failed check drops the packet (SEARCH shows nothing) — corrupt or
spoofed packets never reach the display.

---

## 328. Interoperability Notes

| Receiver | Can hear beacon LoRa? | Notes |
| --- | --- | --- |
| Aegis beacon (SEARCH) | Yes | Native |
| SDR + LoRa decoder | Yes | With correct params (§112) |
| Meshtastic node | No | Different LoRa config/sync word |
| LoRaWAN gateway | No | Different network |
| FM/PMR radio | No | Wrong modulation |

---

## 329. Backup and Restore (Config)

| Operation | How |
| --- | --- |
| Export | `STATUS` captures current values |
| Restore | Re-enter via serial/menu/API |
| Full reset | `FACTORY CONFIRM` |
| NVS backup | Flash dump via esptool (advanced) |

---

## 330. Firmware Update Procedure (Detailed)

1. Connect the beacon via USB data cable.
2. Note the current port (`--list` or device manager).
3. `pio run -t upload` (or Arduino IDE upload).
4. Open the monitor; confirm `AEGIS:HELLO:vX.Y.Z`.
5. Verify config survived (STATUS).
6. Run a quick TX/RX smoke test.

---

## 331. Site Deploy Procedure

| Step | Command |
| --- | --- |
| Install | `cd website && npm install` |
| Check | `npm run check` |
| Build | `npm run build` |
| Verify | `node .github/scripts/verify-website.mjs` |
| Deploy | Push to main → Vercel auto-deploys |

---

## 332. Release Procedure (End to End)

1. Merge all PRs for the release.
2. Bump version strings (§140).
3. Update changelog + What's New.
4. Commit (`chore: prepare v5.6.0` or similar).
5. Tag `v5.6.0`; push tag.
6. Create the GitHub release with notes.
7. Confirm all CI green; confirm Vercel deploy.

---

---

## 333. Complete SX1262 SPI Command Opcodes

| Opcode | Command | Used by firmware |
| --- | --- | --- |
| 0x00 | GetStatus | Indirect (via IRQ) |
| 0x01 | WriteRegister | Yes (sync word, OCP) |
| 0x02 | ReadRegister | Yes (verification) |
| 0x08 | SetDioIrqParams | Yes |
| 0x09 | GetIrqStatus | Yes |
| 0x02 | ClearIrqStatus | Yes |
| 0x0E | WriteBuffer | Yes |
| 0x1E | ReadBuffer | Yes |
| 0x80 | SetStandby | Yes |
| 0x82 | SetRx | Yes |
| 0x83 | SetTx | Yes |
| 0x86 | SetRfFrequency | Yes |
| 0x88 | Calibrate | Yes (boot) |
| 0x89 | (Reserved) | — |
| 0x8A | SetPacketType | Yes |
| 0x8B | SetModulationParams | Yes |
| 0x8C | SetPacketParams | Yes |
| 0x8E | SetTxParams | Yes |
| 0x8F | SetBufferBaseAddress | Yes |
| 0x91 | SetSleep | No (ESP32 deep sleep powers down) |
| 0x96 | SetRegulatorMode | Conditional (DC-DC) |

---

## 334. SX1262 IRQ Flags

| Flag (bit) | Meaning | Handled |
| --- | --- | --- |
| 0x0001 | RX timeout | Yes |
| 0x0002 | RX done | Yes |
| 0x0004 | Preamble detected | No |
| 0x0008 | Sync word valid | No |
| 0x0010 | Header valid | No |
| 0x0020 | Header error | No |
| 0x0040 | CRC error | Yes (packet dropped) |
| 0x0080 | CAD done | No |
| 0x0100 | CAD detected | No |
| 0x0200 | TX done | Yes |

---

## 335. LoRa Packet Fields (Receive Side)

| Field | Source | Used for |
| --- | --- | --- |
| RSSI | GetPacketStatus | Signal strength display |
| SNR | GetPacketStatus | Signal quality display |
| SignalRssi | GetPacketStatus | Packet-based RSSI (better) |
| Payload | ReadBuffer | Position decode |
| CRC | hardware | Packet integrity |

---

## 336. Search Dwell and Lock Parameters

| Parameter | Default | Range |
| --- | --- | --- |
| Dwell per frequency | 5 s | 1–30 s |
| Lock duration | 30 s | 5–120 s |
| RX timeout per poll | 5 s | — |
| Squelch (RSSI) | off | 0–15 |

---

## 337. Beacon Interval vs. Discovery Latency

| Interval | Max discovery latency (worst case) |
| --- | --- | --- |
| 10 s | ~10 s |
| 30 s | ~30 s |
| 60 s | ~60 s |
| 300 s | ~5 min |

Shorter intervals find the beacon faster but drain the battery faster
(§207.3).

---

## 338. Complete Frequency Band Check Logic

```text
isInBand(freq):
  return 433050000 <= freq <= 434790000

onFREQ(freq):
  if not isInBand(freq): emit AEGIS:ERR:04; keep old value
  else: store, persist, emit AEGIS:FREQ:<freq>
```

---

## 339. Beacon Payload Builder Pseudocode

```text
buildPayload(position):
  buf[0..1] = 'A', 'B'
  buf[2]    = 1                      // version
  buf[3]    = modeIndex()
  buf[4]    = position.fix
  buf[5]    = position.sats
  buf[6..9] = int32(position.lat * 1e6)  // little-endian
  buf[10..13]= int32(position.lng * 1e6)
  buf[14..15]= int16(position.alt)
  buf[16]   = freqIndex()
  buf[17]   = crc8(buf[0..16])
```

---

## 340. Morse Payload Builder Pseudocode

```text
buildMorse(position):
  return "SOS SOS SATS " + sats
       + " LAT " + ddm(lat)
       + " LON " + ddm(lng)
       + " ALT " + alt
       + " MODE " + modeLetter()
```

---

## 341. Complete NMEA Parser State Machine

```text
IDLE ──('$')──► HEADER ──(GGA)──► FIELD LOOP
  ▲                                 │
  └─────────('\n')◄──(checksum ok)──┘
```

- Accepts any leading whitespace.
- Validates the checksum; drops bad lines.
- Extracts the 14 GGA fields; ignores malformed lines.

---

## 342. Battery Monitor Sampling

| Parameter | Value |
| --- | --- |
| Sample count | 8 |
| Averaging | Moving average |
| Rate | 1 Hz |
| Filter | Median-of-3 then average |
| Reporting | STATUS + OLED icon |

---

## 343. OLED Scroll Engine

| Parameter | Value |
| --- | --- |
| Scroll step | 1 px per tick |
| Tick | 50 ms × (11 − speed) |
| Direction | Right-to-left |
| Trigger | Text wider than 21 chars (128 px / 6 px) |
| Stop | Key press or screen change |

---

## 344. Debounce State Machine

```text
IDLE ──(press)──► COUNT ──(≥50 ms)──► CONFIRMED
  ▲                                      │
  └────────(release)─────────────────────┘
```

- 50 ms window rejects contact bounce.
- Long-press detection adds a 1.5 s timer on CONFIRMED.
- Key repeat (CONFIG) starts after 500 ms, repeats every 250 ms.

---

## 345. WiFi Dashboard — AP Details

| Parameter | Value |
| --- | --- |
| SSID | AegisBeacon-XXXX (random suffix) |
| Password | Random per boot, printed on OLED/serial |
| IP | 192.168.4.1 |
| Subnet | 255.255.255.0 |
| Channel | 1 (default) |
| Max clients | 4 |
| Idle timeout | 5 min (AP off) |

---

## 346. WiFi Dashboard — HTTP Server Details

| Aspect | Value |
| --- | --- |
| Server | ESP32 WebServer |
| Routes | /, /api/config (GET/POST), /api/status, /api/reboot, /api/factory |
| Body limit | 4 KB |
| CORS | Same-origin (page served by the device) |
| Content-Type | text/html; application/json |

---

## 347. WiFi Security Notes

| Concern | Mitigation |
| --- | --- |
| WPA2 | AP uses WPA2-PSK (random password) |
| Password leak | Printed only on OLED/serial (local) |
| Brute force | 8-char random; rate-limit attempts |
| Evil twin | Operator verifies SSID suffix on OLED |

---

## 348. Serial Protocol Versioning

| Protocol version | Introduced | Notable change |
| --- | --- | --- |
| v1 | v5.0 | AEGIS: lines, POS/FREQ/WPM/MODE/STATUS |
| v1.1 | v5.1 | FREQ?, WPM?, MODE?, SLEEP, FACTORY |
| v1.2 | v5.5 | Fix age in POS; TX start/end events |

Forward compatibility: unknown commands are ignored; unknown fields in
POS are passed through.

---

## 349. Backward Compatibility Policy

| Change | Policy |
| --- | --- |
| New command | Additive — old firmware ignores |
| New field in POS | Additive — parsers must tolerate |
| Changed semantics | Version bump + changelog |
| Removed command | Never (deprecate with warning instead) |

---

## 350. Error Recovery Matrix (Firmware)

| Error | Immediate | After 3 retries |
| --- | --- | --- |
| ERR:01 radio init | Re-init | Safe mode |
| ERR:02 TX timeout | Retry TX | Report + skip cycle |
| ERR:03 no fix | Keep acquiring | Deep-sleep retry cycle |
| ERR:04 bad freq | Reject command | (never loops) |
| ERR:05 NVS write | Retry once | Factory-reset prompt |

---

## 351. Benchmarks — Historical Snapshots

| Commit | DevKit V1 flash | RAM | Notes |
| --- | --- | --- | --- |
| (v5.0) | ~78% | ~15% | Pre-dashboard |
| (v5.3) | ~80% | ~16% | Added WiFi API |
| (v5.5) | ~82% | ~16% | Current reference |

Live values on the Benchmarks page; snapshots above are indicative only.

---

## 352. Site Pages — Full List (Sitemap)

| Path | Type |
| --- | --- |
| / | Landing |
| /demo | Tool |
| /builder | Tool |
| /benchmarks | Data |
| /repeaters | Map |
| /report-position | Map |
| /config-dashboard | Tool |
| /wiki | Docs index |
| /wiki/[slug] | Article (440+) |
| /branding | Brand |
| /terms | Legal |
| /privacy | Legal |
| /disclaimer | Legal |

---

## 353. Site — Header Navigation

| Link | Target |
| --- | --- | --- |
| Home | / |
| Demo | /demo |
| Builder | /builder |
| Wiki | /wiki |
| Repeaters | /repeaters |
| Benchmarks | /benchmarks |
| GitHub | https://github.com/Leo-Galli/Aegis-Beacon (external, new tab) |

---

## 354. Site — Footer Links

| Link | Target |
| --- | --- |
| Terms | /terms |
| Privacy | /privacy |
| Disclaimer | /disclaimer |
| GitHub | external (new tab) |
| Branding | /branding |

---

## 355. Site — Wiki Sidebar Groups (Current)

| Group | Pages (approx.) |
| --- | --- |
| Getting Started | 8 |
| Hardware & Build | 40 |
| Firmware | 45 |
| Field Operations | 30 |
| Frequencies & Legal | 25 |
| Building Effectively | 12 |
| USB & Connectivity | 15 |
| Website | 10 |
| Reference | 20 |
| (Others by topic) | remainder |

---

## 356. Wiki Frontmatter Schema

| Field | Required | Example |
| --- | --- | --- |
| title | Yes | `title: Serial Bridge Guide` |
| description | Yes | `description: "..."` |
| (others) | No | group hints if needed |

---

## 357. Content Collection Config

| Aspect | Value |
| --- | --- |
| Collection | wiki |
| Directory | src/content/wiki |
| Schema | title + description (zod) |
| Slug | filename (kebab-case) |
| Build | astro check validates all entries |

---

## 358. Markdown Features Supported in Wiki

| Feature | Syntax |
| --- | --- |
| Headings | #–#### |
| Bold/italic | **, * |
| Code | `inline`, ``` blocks |
| Tables | pipe tables |
| Links | [text](url) |
| Images | ![](/path) |
| Callouts | [!WARNING] etc. |
| Lists | -, *, 1. |
| Blockquotes | > |
| Rules | --- |

---

## 359. External Link Behavior (Wiki)

| Link type | Behavior |
| --- | --- |
| Internal (/wiki/...) | Same tab |
| Internal (/#anchor) | Same tab, anchor |
| External (http/https) | New tab + noopener noreferrer |

Implemented by the external-links rehype plugin (§287).

---

## 360. Social Sharing Preview (OG)

| Platform | Uses |
| --- | --- |
| WhatsApp | og:title, og:description, og:image |
| Discord | og:*, twitter:card |
| Telegram | og:*, image |
| Facebook | og:* |
| X / Twitter | twitter:card, twitter:title |
| LinkedIn | og:* |

---

## 361. Site — Theme Implementation

| Aspect | Value |
| --- | --- |
| Default | Dark (mission console) |
| Toggle | Header button |
| Persist | localStorage |
| Respect | prefers-color-scheme on first visit |
| Tokens | OKLCH, AA-checked |

---

## 362. Motion and Animation Policy (Site)

| Element | Motion | Reduced-motion |
| --- | --- | --- |
| Hero | Subtle device reveal | Static |
| Cards | Hover lift | Static |
| Wiki TOC | Scroll-spy highlight | Static |
| Theme toggle | Crossfade | Instant |

---

## 363. Known Site Assets

| Asset | Path |
| --- | --- |
| Banner | website/public/banner.png |
| Favicon | website/public/favicon.svg |
| OG image | website/public/og.png |
| CSS | website/public/css/site.css |
| Search | website/src/components/WikiSearch.astro |

---

## 364. Bridge — Exit Codes

| Code | Meaning |
| --- | --- |
| 0 | Clean exit |
| 1 | No serial device found |
| 2 | (reserved) |
| 130 | Interrupted (Ctrl+C) |

---

## 365. Bridge — Environment Variables

| Var | Effect |
| --- | --- |
| (none required) | All settings via CLI flags |

---

## 366. Firmware — Compile-Time Feature Flags

| Flag | Default | Effect |
| --- | --- | --- |
| ENABLE_WIFI | 1 | WiFi dashboard |
| ENABLE_OLED | 1 | Display |
| ENABLE_GPS | 1 | GPS |
| ENABLE_BEEPER | 1 | Buzzer |
| ENABLE_DEEP_SLEEP | 1 | Power management |
| DEBUG_VERBOSE | 0 | Extra serial |

---

## 367. Firmware — Library Include List

```cpp
#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <nvs_flash.h>
#include <esp_sleep.h>
```

(All bundled with the ESP32 Arduino core — no external libraries.)

---

## 368. Benchmarks — Data Flow

```text
push ──► benchmarks.yml ──► compile matrix
              ├──► summary table (step summary)
              └──► artifact (7-day retention)
              (no commit, no push)
```

---

## 369. Release — Version String Locations

| File | Location |
| --- | --- |
| AegisBeacon.ino | FIRMWARE_VERSION define |
| DATASHEET.md | Title + changelog |
| README.md | Badge/version mention |
| website (wiki) | What's New + changelog pages |
| package.json | website version (optional) |

---

## 370. License and Attribution

| Item | Value |
| --- | --- |
| License | MIT |
| Copyright | 2026 Leonardo Galli |
| Hardware files | MIT-style (permissive) |
| Map data | © OpenStreetMap contributors (ODbL) |
| Fonts | OFL (Chakra Petch, Manrope, JetBrains Mono) |
| Icons | Project-generated SVG |

---

## 371. Support Matrix

| OS | Bridge | Firmware build |
| --- | --- | --- |
| Windows | Yes (pyserial) | PlatformIO/Arduino IDE |
| macOS | Yes | PlatformIO/Arduino IDE |
| Linux | Yes | PlatformIO/Arduino IDE |
| Android (Termux) | Yes (OTG) | No (build on PC) |
| iOS | Link path only | No |

---

## 372. Glossary — Project-Specific

| Term | Definition |
| --- | --- |
| Aegis-Beacon | The project |
| Bridge | Device ↔ site connector script |
| Report Position | Site page for positions |
| Config Dashboard | Live firmware UI preview |
| Repeaters | Site map of nearby repeaters |
| Benchmarks | CI compile metrics |
| Builder | BOM + budget tool |
| Wiki | Documentation site (440+ pages) |

---

## 373. FAQ — Tenth Edition (Legal & Safety)

**Q: Is this legal to build and use?**
A: Building and receiving is generally fine; transmitting requires a
license in most countries. See §19, §52, §82–84.

**Q: Is it safe?**
A: With a protected cell, correct wiring and the antenna ≥ 20 cm away,
yes. See §133 and the disclaimer page.

**Q: Is it waterproof?**
A: Only with the IP54 gasket (splash). Not submersible.

---

## 374. FAQ — Eleventh Edition (Project)

**Q: Who maintains this?**
A: The community + maintainer (Leonardo Galli). See CONTRIBUTING.md.

**Q: Is there a forum?**
A: GitHub Discussions.

**Q: How can I help?**
A: Docs, testing, hardware designs, translations — all welcome via PRs.

---

## 375. Index — Every Section in This Datasheet

| Range | Topic |
| --- | --- |
| 1–34 | Core specs, modes, config, deep dives |
| 35–57 | GPIO, radio, LoRa, GPS, Morse, serial, NVS, WiFi, antenna, RF, legal, testing, bridge, website, glossary |
| 58–99 | Firmware architecture, mode specs, payloads, benchmarks, FAQ, version history |
| 100–123 | Board variants, buses, timing, power, GPS, display, controls, enclosure, assembly, antenna, RF theory, legal, security, testing |
| 124–160 | Constants, screens, serial catalog, radio recovery, GPS power, payload gen, search, emergency, event log, safety, legal tables |
| 161–201 | Wiki catalog, mode state machines, boot, interrupts, buffers, formats, bridge internals, site internals, walkthroughs |
| 202–255 | NMEA, BOM, matching, LoRaWAN, battery, budgets, field guides, glossary, FAQ |
| 256–332 | GPIO table, HELP/STATUS outputs, TUI fields, URL params, site pages, SEO, structured data, mode tables, buttons, NVS, security, performance |
| 333–375 | SX1262 opcodes, IRQ flags, packet fields, search params, band logic, payload builders, NMEA parser, battery sampling, scroll, debounce, WiFi, serial versioning, error matrix, benchmarks, site pages, assets, release process, FAQ |

---

## 376. Colophon

This datasheet is generated and maintained in the repository root. It is the
authoritative hardware and firmware reference; the wiki is the operational
documentation. Version 5.5.0. MIT License. © 2026 Leonardo Galli.

---

---

## 377. Complete Field Day Plan

### 377.1 Objective

Deploy two beacons, exercise the full rescue loop, and log everything via
the bridge.

### 377.2 Schedule

| Time | Activity |
| --- | --- |
| 08:00 | Meet, equipment check |
| 08:30 | Deploy beacon Alpha at point A |
| 09:00 | Deploy beacon Bravo at point B |
| 09:30 | Search exercise (teams + receivers) |
| 11:30 | Bridge log review |
| 12:00 | Debrief, pack up |

### 377.3 Success criteria

- Both beacons heard from ≥ 3 km.
- Position decoded correctly on both receivers.
- Bridge logged every fix with timestamps.
- Share links opened on phones without issues.
- All batteries above 3.5 V at the end.

---

## 378. Complete Bench Test Script

```text
1. Power via USB.
2. Serial: AEGIS:HELLO:v5.5.0 ?
3. OLED shows status ?
4. MODE cycles BEACON→SEARCH→CONFIG→EMERGENCY ?
5. In CONFIG: change WPM 10→16, save, verify with WPM? ?
6. POS with GPS: returns AEGIS:POS: ?
7. TX: MODE BEACON, watch AEGIS:TX:start/end ?
8. SLEEP 10: device sleeps, wakes ?
9. Battery: reads within ±50 mV of multimeter ?
10. Log all results (template §148).
```

---

## 379. Complete Receiver Test Script

```text
1. Pair with a transmitting beacon 10 m away.
2. SEARCH on the beacon's frequency.
3. Confirm RSSI in the −40 to −50 dBm range.
4. Confirm decoded lat/lng matches the beacon's OLED.
5. Walk away until signal drops; confirm squelch works.
6. Return; confirm re-acquisition within one cycle.
```

---

## 380. Range Test Procedure (Systematic)

| Step | Action |
| --- | --- |
| 1 | Fix both stations' positions (GPS or map). |
| 2 | Beacon at fixed location, 30 s interval, SF7. |
| 3 | Receiver walks out, logging RSSI at 100 m intervals. |
| 4 | Repeat at SF9 for comparison. |
| 5 | Note terrain, antenna heights, weather. |
| 6 | Plot range vs. terrain on the map. |

---

## 381. Data Analysis — Field Log to CSV

```csv
time_utc,lat,lng,alt,sats,mode,freq_mhz,note
09:12:04,45.531240,12.304560,812,9,BEACON,433.500,checkpoint2
09:17:33,45.532100,12.305100,810,9,BEACON,433.500,ridge
```

---

## 382. Incident Report Template

| Field | Content |
| --- | --- |
| Incident ID | |
| Date / time | |
| Location | |
| Personnel | |
| Equipment | Beacons, receivers, bridge |
| Timeline | |
| Positions logged | Attach CSV / track |
| Outcome | |
| Lessons learned | |
| Follow-ups | |

---

## 383. Battery Log Template

```csv
date,time,batt_v,note
2026-09-05,08:00,4.10,start
2026-09-05,10:00,3.94,after 2h beaconing
2026-09-05,12:00,3.71,after 4h
```

---

## 384. Training Certification Checklist

| Skill | Date | Signed |
| --- | --- | --- |
| Flash firmware | | |
| Change config (buttons + serial + WiFi) | | |
| Deploy and recover beacon | | |
| Homing exercise | | |
| Emergency activation/exit | | |
| Bridge logging and share links | | |
| Battery care and charging | | |
| Legal and safety briefing | | |

---

## 385. Complete Button Menu Tree (CONFIG)

```text
CONFIG
 ├─ 1 FREQ BCN      [433.500 MHz]
 ├─ 2 FREQ RX       [433.475 MHz]
 ├─ 3 FREQ RX2      [433.525 MHz]
 ├─ 4 WPM           [14]
 ├─ 5 TX POWER      [20 dBm]
 ├─ 6 TX INTERVAL   [30 s]
 ├─ 7 SQUELCH       [0]
 ├─ 8 SCROLL        [3]
 ├─ 9 FREQ OFFSET   [0 Hz]
 ├─10 GPS TIMEOUT   [120 s]
 ├─11 BRIGHTNESS    [100%]
 └─12 SAVE & EXIT
```

---

## 386. Power Menu Tree

```text
POWER
 ├─ SLEEP [60s]
 ├─ REBOOT
 ├─ FACTORY RESET (confirm)
 └─ BACK
```

---

## 387. OLED Error Display Patterns

| Pattern | Meaning |
| --- | --- |
| `NO FIX` blinking | GPS acquiring |
| `ERR 01` persistent | Radio failure — check wiring |
| `BAT LOW` + beeps | Below 3.5 V |
| `NO SIGNAL` | SEARCH below squelch |
| `LOCKED` | SEARCH holding a frequency |

---

## 388. Complete Bridge Session (Annotated)

```text
$ python bridge/aegis-serial-bridge.py
[bridge] Aegis-Beacon serial bridge
[bridge] site target: https://aegis-beacon.vercel.app
[bridge] connected to COM3 @ 115200 baud
[device] AEGIS:HELLO:v5.5.0
[device] AEGIS:POS:lat=45.531240;lng=12.304560;alt=812.0;sats=9;fix=1;age=0;mode=BEACON;freq=433.500
[bridge] share link: https://aegis-beacon.vercel.app/report-position?lat=45.531240&lng=12.304560&alt=812.0&sats=9.0&mode=BEACON
[bridge] page is open, streaming update to it
MODE SEARCH
[bridge] -> device: MODE SEARCH
[device] AEGIS:MODE:SEARCH
...
exit
[bridge] bye
```

---

## 389. Complete Config via WiFi Dashboard

1. Connect to `AegisBeacon-XXXX` (password on the OLED).
2. Open http://192.168.4.1.
3. Edit WPM → 16, TX power → 22.
4. Save; device confirms `[cfg] wpm=16 saved`.
5. Disconnect; device resumes normal operation.

---

## 390. Troubleshooting — WiFi Dashboard Issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| AP not visible | Dashboard not started | Enter CONFIG mode |
| Can't connect | Wrong password | Check OLED password |
| Page won't load | AP idle timeout | Re-enter CONFIG |
| Save fails | Out-of-range value | Check ranges (§325) |
| Device reboots | Power issue | Check supply |

---

## 391. Troubleshooting — Morse Issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No tone | Buzzer wiring / PWM | Check §65.4 |
| Tone but no radio key | Offset not applied | Check FREQ_OFFSET |
| Too fast/slow | WPM wrong | Set 5–40 |
| Garbled | Interference | Re-check frequency |

---

## 392. Troubleshooting — LoRa Issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No decode | Wrong params | SF/BW/CR per §36.3 |
| Low SNR | Interference | Change frequency |
| Intermittent | Multipath | Move receiver |
| CRC errors | Signal too weak | SF9 or antenna height |

---

## 393. Troubleshooting — Bridge Stream Issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Page blank | Polling started late | Reload the page |
| Safari no stream | Loopback blocked | Use the link path |
| Heartbeat lost | Page closed | Bridge opens a new tab |
| Port conflict | Another process | Change --http-port |

---

## 394. Reference — Typical Component Prices (2026, EU)

| Part | Typical price |
| --- | --- |
| ESP32 DevKit V1 | €7–10 |
| SX1262 module | €5–10 |
| OLED 2.42" | €6–9 |
| NEO-6M | €4–7 |
| TP4056 | €1–2 |
| 18650 (protected) | €5–8 |
| Buzzer + transistor | €1 |
| Buttons ×4 | €1–2 |
| Antenna + SMA | €3–6 |
| Case (printed) | €3–8 |

---

## 395. Reference — Delivery and Logistics

| Item | Note |
| --- | --- |
| Board ship times | 2–6 weeks (AliExpress) |
| EU stock | Faster but pricier |
| Customs | Check local rules |
| Batteries | Often restricted in air freight |

---

## 396. Reference — Common Module Pinouts (SX1262 Breakouts)

| Breakout label | Function | Connect to |
| --- | --- | --- |
| SCK / CLK | SPI clock | GPIO18 |
| MISO / SD0 | SPI data out | GPIO19 |
| MOSI / SD1 | SPI data in | GPIO23 |
| NSS / CS | Chip select | GPIO5 |
| RST | Reset | GPIO14 |
| DIO1 | Interrupt | GPIO2 |
| BUSY | Busy | GPIO4 |
| 3.3V / VCC | Power | 3V3 |
| GND | Ground | GND |
| ANT | Antenna | SMA/whip |

---

## 397. Reference — Common OLED Module Pinouts

| Pin | Function |
| --- | --- |
| VCC | 3.3 V |
| GND | Ground |
| SCL | I2C clock (GPIO22) |
| SDA | I2C data (GPIO21) |

---

## 398. Reference — Common GPS Module Pinouts

| Pin | Function |
| --- | --- |
| VCC | 3.3 V |
| GND | Ground |
| TX | Data out (→ ESP32 GPIO17) |
| RX | Data in (← ESP32 GPIO16) |
| PPS | Pulse per second (optional) |
| V_BCKP | Backup (optional) |

---

## 399. Reference — Firmware Serial Echo Format

| Direction | Format |
| --- | --- |
| Device → host | `AEGIS:<TYPE>:<data>` or plain `[tag] text` |
| Host → device | Plain command line |
| Device → host (error) | `AEGIS:ERR:<code>` |

---

## 400. Reference — Site URL Structure

| Path | Purpose |
| --- | --- |
| / | Landing |
| /demo | Simulator |
| /builder | BOM tool |
| /benchmarks | Data |
| /repeaters | Map |
| /report-position | Map |
| /config-dashboard | Tool |
| /wiki | Docs |
| /wiki/{slug} | Article |
| /branding | Brand |
| /terms | Legal |
| /privacy | Legal |
| /disclaimer | Legal |

---

## 401. FAQ — Twelfth Edition (Bridge)

**Q: Does the bridge work without the site?**
A: Yes — it logs positions locally and prints share links regardless; the
site is only needed to view the map.

**Q: Can I run the bridge headless?**
A: Yes — `--no-tui` prints plain log lines suitable for pipes/files.

**Q: Does it need an internet connection?**
A: Only to open the share page; the device and bridge work offline.

---

## 402. FAQ — Thirteenth Edition (Maps)

**Q: Does the repeaters map need a key?**
A: No — OpenStreetMap tiles + Overpass API, both keyless.

**Q: How current is the data?**
A: Live from Overpass when available; curated fallback otherwise.

**Q: Can I add a repeater?**
A: Edit OpenStreetMap — the site reads the same data.

---

## 403. FAQ — Fourteenth Edition (Misc)

**Q: Why "Aegis"?**
A: The shield — protection. The beacon protects its operator by
broadcasting their position in an emergency.

**Q: Why LoRa and Morse both?**
A: LoRa is machine-readable and long-range; Morse is human-readable and
works on any ear + SDR, with no decoding equipment.

---

## 404. Design Decisions Log

| Decision | Rationale |
| --- | --- |
| Single-file firmware | Easiest for hobbyists to flash |
| No third-party libs | Deterministic, small flash |
| 433 MHz primary | EU ISM + amateur overlap |
| DDM for Morse | Human-readable, precise enough |
| Microdegrees for LoRa | Machine precision |
| 30 s default interval | Battery vs. discovery balance |
| +20 dBm default | Range without PA stress |
| +22 dBm emergency | Maximum lawful output when it counts |
| Loopback-only bridge | Privacy by construction |
| Static site, no JS framework | Fast, simple, secure |

---

## 405. Reference — Where Each Wiki Page Lives (Selected)

| Topic | File |
| --- | --- |
| Bridge TUI | src/content/wiki/bridge-tui.md |
| Serial bridge | src/content/wiki/serial-bridge-guide.md |
| Benchmark method | src/content/wiki/benchmark-methodology.md |
| What's New v5.5 | src/content/wiki/whats-new-v55.md |
| Changelog | src/content/wiki/changelog.md |
| Contributing | src/content/wiki/contributing.md |
| CI/CD | src/content/wiki/ci-cd.md |
| Project overview | src/content/wiki/project-overview.md |

---

## 406. Reference — Site Verify Script Checks

| Check | Enforced |
| --- | --- |
| Canonical present | Every page |
| OG/Twitter meta | Every page |
| Robots.txt | Present and correct |
| Sitemap | Contains all pages |
| No broken internal links | Crawl |
| No localhost in prod | Crawl |
| Wiki nav coverage | All pages registered |

---

## 407. Reference — Content Gates (Workflow)

| Gate | Command (approx.) |
| --- | --- |
| Emoji | grep emoji ranges in src |
| Em-dash | grep U+2014 in src/pages + components |
| AI strings | grep co-author/AI in code (excl. policy page) |
| External fonts | grep googleapis in dist |
| Nav coverage | node check script |

---

## 408. Reference — Firmware CI Commands

| Job | Command |
| --- | --- |
| Compile | pio run (all envs) |
| Upload (manual) | pio run -t upload |
| Monitor | pio run -t monitor |

---

## 409. Reference — Benchmarks CI Commands

| Job | Command |
| --- | --- |
| Compile matrix | pio run -e each env |
| Merge results | node merge-benchmarks.mjs |
| Report | step summary + artifact |

---

## 410. Reference — Release Tags

| Tag | Notes |
| --- | --- |
| v5.4.0 | Previous release |
| v5.5.0 | Current release (bridge TUI, disclaimer, datasheet) |

---

## 411. Reference — Known Issue Tracking

| Area | Tracked in |
| --- | --- |
| Firmware bugs | GitHub issues |
| Website bugs | GitHub issues |
| Docs gaps | GitHub issues (docs label) |
| Roadmap | GitHub issues + §98 |

---

## 412. Reference — Community Translations

| Language | Status |
| --- | --- |
| Italian | Native (project origin) |
| English | Primary site language |
| Others | Welcome via PRs |

---

## 413. Reference — Accessibility of the Device

| User need | Feature |
| --- | --- |
| Hearing impaired | Visual TX indicator |
| Low vision | High-contrast OLED, big SOS |
| Limited dexterity | Large buttons, long-press forgiveness |
| Non-readers | Audio Morse + iconography |

---

## 414. Reference — Cold Weather Operation

| Condition | Effect | Mitigation |
| --- | --- | --- |
| < 0 °C | Battery capacity drop | Warm the cell |
| < −10 °C | OLED slower | Acceptable |
| < −20 °C | Li-ion may not charge | Charge warm |
| Condensation | Internal moisture | Gasket + silica |

---

## 415. Reference — Hot Weather Operation

| Condition | Effect | Mitigation |
| --- | --- | --- |
| > 40 °C | Battery aging | Shade the device |
| > 50 °C | OLED dims | Reduce brightness |
| Sun exposure | Case heat | Vented enclosure |

---

## 416. Reference — Rain Operation

| Condition | Policy |
| --- | --- | --- |
| Light rain | OK with IP54 case |
| Heavy rain | Cover or stow |
| Immersion | Not rated — remove |

---

## 417. Reference — Night Operation

| Feature | Purpose |
| --- | --- | --- |
| OLED brightness | Adjustable 10–100% |
| Night mode | Dim + red-ish? (future) |
| Glow markers | Case stickers (user) |

---

## 418. Reference — High-Altitude Operation

| Note | Detail |
| --- | --- |
| Air pressure | No impact on electronics |
| Cold | See §414 |
| Range | Better LOS at altitude |
| GPS | Works to ~18 km altitude |

---

## 419. Reference — Battery Swapping in the Field

1. Power off (long MODE → Power → Sleep).
2. Open the case battery door.
3. Swap the cell; observe polarity.
4. Close; power on.
5. Confirm STATUS battery voltage.

---

## 420. Reference — Firmware Recovery (Brick Recovery)

| Situation | Recovery |
| --- | --- |
| Boot loop | Hold BOOT + reset → download mode |
| Corrupt config | FACTORY CONFIRM (if serial works) |
| Corrupt firmware | esptool erase_flash + re-upload |
| No serial at all | Check cable, drivers, BOOT pin |

---

---

## 421. Complete Power-On Self-Test (POST)

| Test | Pass | Fail action |
| --- | --- | --- |
| Serial init | AEGIS:HELLO within 5 s | Blink LED (if fitted) |
| NVS load | Config valid (CRC) | Load defaults, warn |
| OLED | I2C ack at 0x3C | Skip display, log |
| Radio | Calibrate + standby OK | ERR:01 → retry ×3 → safe mode |
| GPS | Module answers (any NMEA) | Log "GPS absent", continue |
| Battery | ADC in range | Log raw value |
| Buttons | GPIO pull-ups present | Log which missing |

---

## 422. LED Indicator Reference (If Fitted)

| LED | Color | State | Meaning |
| --- | --- | --- | --- |
| Power | Green | On | 3V3 rail up |
| TX | Red | Blink during key | Transmitting |
| GPS | Blue | Blink on fix | Position valid |
| Charge | (charger LED) | See §74.3 | Charging state |

---

## 423. Complete Wiring Verification Procedure

| Step | Test | Tool |
| --- | --- | --- |
| 1 | 3V3 present | Multimeter |
| 2 | GND continuity | Multimeter |
| 3 | I2C scan finds 0x3C | Sketch/script |
| 4 | SPI loopback (MISO sees MOSI) | Sketch |
| 5 | GPS TX pulses | Logic analyzer / scope |
| 6 | Buzzer tone | Ear |
| 7 | Button reads (INPUT_PULLUP) | Serial debug |
| 8 | Battery divider ratio | Multimeter |

---

## 424. Serial Monitor Recommended Settings

| Setting | Value |
| --- | --- |
| Baud | 115200 |
| Data bits | 8 |
| Parity | None |
| Stop bits | 1 |
| Line ending | Both CR+LF and LF accepted |
| Encoding | UTF-8 (ASCII-safe) |

---

## 425. Reference — What Each Firmware Screen Shows

| Screen | Info | When |
| --- | --- | --- |
| Status | Mode, freq, batt, sats, alt, last TX | Always (default) |
| Position | Full lat/lng, fix age | SEL quick view / POS |
| Search | RSSI, SNR, squelch bar | SEARCH mode |
| Config | Parameter list + values | CONFIG mode |
| Emergency | SOS + position + power | EMERGENCY mode |
| Error | ERR code + hint | On error |

---

## 426. Reference — OLED Address Conflict Resolution

| Situation | Fix |
| --- | --- | --- |
| Two 0x3C devices | Change one to 0x3D (SA0 high) |
| No ack at 0x3C | Check wiring, pull-ups, power |
| Intermittent ack | Check for I2C bus contention |

---

## 427. Reference — SPI Contention with SD/Flash

| Device | CS pin | Notes |
| --- | --- | --- |
| SX1262 | GPIO5 | Only SPI device in the reference build |
| (future SD) | GPIO4 | Must share bus carefully |

---

## 428. Reference — Interrupt Priority and Locks

| Aspect | Value |
| --- | --- | --- |
| DIO1 ISR | Sets flag only |
| Shared data | Protected by volatile flag + main-loop handling |
| I2C/SPI | No ISR usage (main loop only) |
| Watchdog | 5 s task watchdog |

---

## 429. Reference — Firmware Loop Pseudocode

```cpp
void loop() {
  handleSerial();      // parse AEGIS: commands
  handleButtons();     // debounce, dispatch
  updateDisplay();     // on change only
  handleGps();         // parse NMEA, fix state
  switch (mode) {
    case BEACON:    runBeaconCycle();  break;
    case SEARCH:    runSearchCycle();  break;
    case CONFIG:    runConfigUI();     break;
    case EMERGENCY: runEmergencyLoop(); break;
  }
  checkBattery();      // sample, thresholds
  checkWatchdog();     // feed
}
```

---

## 430. Reference — Battery Threshold State Machine

```text
             ┌──────────────┐
   >3.5V ───►│  NORMAL      │◄────────────┐
             └──────┬───────┘             │
               <3.5V│                    │
             ┌──────▼───────┐             │
   >3.5V ───►│  LOW         │──► warn + icon
             └──────┬───────┘             │
               <3.3V│                    │
             ┌──────▼───────┐             │
   >3.3V ───►│  CRITICAL    │──► beacon paused
             └──────┬───────┘             │
               <3.0V│                    │
             ┌──────▼───────┐             │
             │  SLEEP 50%   │──► deep sleep loop
             └──────────────┘             │
               >3.5V (charging) ──────────┘
```

---

## 431. Reference — GPS Time Handling

| Aspect | Value |
| --- | --- |
| Source | GGA field 1 (UTC) |
| Format | HHMMSS.SS |
| Display | As received (UTC) |
| Logging | UTC recommended |
| DST | Not applied (device) |

---

## 432. Reference — Coordinate Display Formats

| Format | Example | Used for |
| --- | --- | --- |
| Decimal degrees | 45.531240 | OLED, bridge, site |
| DDM | 45°31.8744′ N | Morse, readable |
| DMS | 45°31′52.5″ N | (reference) |
| MGRS/UTM | 32T NR 12345 67890 | (future, map tools) |

---

## 433. Reference — Morse Prosigns

| Prosign | Code | Meaning |
| --- | --- | --- |
| SOS | ...---... | Distress |
| AR | .-.-. | End of message |
| SK | ...-.- | End of contact |
| QTH | --.- - .... | Location question/answer |

---

## 434. Reference — Morse Timing Edge Cases

| Case | Handling |
| --- | --- |
| WPM 5 (very slow) | Unit 120 ms; long messages take a while |
| WPM 40 (very fast) | Unit 15 ms; buzzer may soften |
| Long payload | Split into two TX cycles if needed |
| Non-ASCII char | Replaced with a space |

---

## 435. Reference — LoRa Airtime Limits (Duty Cycle)

| Region | Duty cycle limit | At 30 s interval, 205 ms airtime |
| --- | --- | --- |
| EU (ECC) | 1% typical for unlicensed | ~0.7% — compliant |
| Licensed amateur | Usually unrestricted | OK |

---

## 436. Reference — Frequency Offset Keying Detail

| Parameter | Value |
| --- | --- |
| Offset range | −1000..+1000 Hz |
| Default | 0 |
| Application | During key-down only |
| Effect | Audible tone shift on fixed-tuned receivers |
| Persisted | Yes (NVS) |

---

## 437. Reference — Beacon Cycle Power Profile

```text
power
  ▲
  │        ┌──────────┐
  │        │  TX      │
  │────────┤          ├───────────► time
  │        │  SOS+data│
  └────────┴──────────┴─────────────►
       1s     25s        pause 30s
```

---

## 438. Reference — Search Cycle Power Profile

```text
power
  ▲
  │  ┌──┐  ┌──┐  ┌──┐
  │  │RX│  │RX│  │RX│   (5 s dwell each)
  │──┘  └──┘  └──┘  └─────► time
  │        freq_rx   freq_rx2
```

---

## 439. Reference — Emergency Cycle Power Profile

```text
power
  ▲
  │  ┌────────────┐  ┌────────────┐
  │  │ TX 25s     │  │ TX 25s     │
  │──┤            ├──┤            ├──► time
  │  │ SOS+data   │  │ SOS+data   │
  └──┴────────────┴──┴────────────┴──►
        pause 1s     pause 1s
```

---

## 440. Reference — RF Path Block Diagram

```text
[SX1262 PA] ──► [L-C match] ──► [SMA] ──► [antenna] ──► air
     ▲
     └── SPI + DIO1 from ESP32
```

---

## 441. Reference — Audio Path Block Diagram

```text
[ESP32 GPIO25 PWM] ──► [1 kΩ] ──► [2N2222 base]
                                      │
                                [collector] ──► [buzzer −]
                                [emitter]  ──► GND
[buzzer +] ──► 3V3 (or VBAT)
[1N4148 across buzzer] flyback
```

---

## 442. Reference — GPS Path Block Diagram

```text
[GPS antenna (patch)] ──► [NEO-6M] ──► TX ──► ESP32 GPIO17 (RX)
                                  ▲
                                  └── ESP32 GPIO16 (TX) ──► RX (config)
```

---

## 443. Reference — Display Path Block Diagram

```text
[ESP32 GPIO21 SDA] ──► [4.7k] ──► [SSD1309 SDA]
[ESP32 GPIO22 SCL] ──► [4.7k] ──► [SSD1309 SCL]
[3V3] ──► [SSD1309 VDD]
[GND] ──► [SSD1309 GND]
```

---

## 444. Reference — Power Path Block Diagram

```text
[USB 5V] ──► [TP4056] ──► [18650] ──► [VBAT rail]
              │                      │
              │                      ├──► [AMS1117] ──► 3V3 rail
              │                      │
              │                      └──► [divider] ──► GPIO34 ADC
```

---

## 445. Reference — Full System Data Flow (Text)

```text
GPS ─► position ─► payload builders ─► Morse (buzzer) + LoRa (radio)
                                    ─► serial AEGIS:POS ─► bridge ─► site
```

---

## 446. Reference — Battery Life by Use (2000 vs 3000 mAh)

| Use | 2000 mAh | 3000 mAh |
| --- | --- | --- |
| Beacon 30 s | ~67 h | ~100 h |
| Beacon 60 s | ~110 h | ~165 h |
| SEARCH continuous | ~17 h | ~25 h |
| EMERGENCY | ~8.5 h | ~12.7 h |
| Deep sleep + wake | ~53 days | ~80 days |

---

## 447. Reference — Charging Times

| State | 2000 mAh | 3000 mAh |
| --- | --- | --- |
| CC phase (1 A) | ~2 h | ~3 h |
| CV tail | ~30 min | ~45 min |
| Total | ~2.5 h | ~3.75 h |

---

## 448. Reference — Power Budget Worksheet

| Consumer | Duty | Draw | Avg |
| --- | --- | --- | --- |
| ESP32 active | 100% | 40 mA | 40 mA |
| OLED | 100% | 25 mA | 25 mA |
| GPS | 50% | 57 mA | 28.5 mA |
| Radio RX | 40% | 7 mA | 2.8 mA |
| Radio TX | 3% | 110 mA | 3.3 mA |
| Buzzer | 3% | 30 mA | 0.9 mA |
| **Total** | | | **~100.5 mA** |

With 3000 mAh: ~30 h at this duty. Reduce OLED/GPS duty to extend.

---

## 449. Reference — Antenna Gain vs. Range

| Antenna gain | Range multiplier (free space) |
| --- | --- | --- |
| 0 dBi | 1× |
| +2.15 dBi (whip) | 1.28× |
| +3 dBi (J-pole) | 1.41× |
| +5 dBi (collinear) | 1.78× |
| +8 dBi (Yagi) | 2.5× |

---

## 450. Reference — Yagi Construction (433 MHz, 5-el)

| Element | Length (mm) | Spacing from reflector (mm) |
| --- | --- | --- |
| Reflector | 352 | 0 |
| Driven | 327 | 86 |
| Director 1 | 316 | 129 |
| Director 2 | 311 | 173 |
| Director 3 | 308 | 216 |

Gain ≈ +8 dBi, front-to-back ≈ 15 dB, boom ~1.2 m.

---

## 451. Reference — Coaxial Cable Loss (433 MHz)

| Cable | Loss per 10 m |
| --- | --- |
| RG58 | ~2.2 dB |
| RG174 (thin) | ~4.5 dB |
| LMR-200 | ~1.2 dB |
| LMR-400 | ~0.6 dB |

Keep feeds short; RG58 is fine under 3 m.

---

## 452. Reference — Connector Care

| Practice | Why |
| --- | --- |
| Tighten SMA with fingers + 1/4 turn | Avoid overtightening |
| Keep connector caps on | Prevent corrosion |
| Clean with IPA | Remove oxidation |
| Check torque on mobile use | Vibration loosens |

---

## 453. Reference — Test Frequencies (Avoid Interference)

| Use | Frequency |
| --- | --- |
| Bench tests | 433.050 (band edge, quiet) |
| Field tests | 433.500 (standard) |
| Closed group | Pick a quiet spot inside 433.200–433.600 |
| Never | Occupied repeater inputs/outputs |

---

## 454. Reference — Band Occupancy Awareness

| Device | Band | Potential conflict |
| --- | --- | --- |
| Car key fobs | 433.92 MHz | Avoid 433.92 exactly |
| TPMS sensors | 433.92 MHz | Avoid |
| Wireless doorbells | 433 MHz | Rare |
| Other LoRa devices | 433 MHz | Frequency agility |

---

## 455. Reference — Frequency Selection Checklist

| Check | ✓ |
| --- | --- |
| Inside 433.050–434.790 | ☐ |
| Not on 433.92 (key fobs) | ☐ |
| Not on a known repeater output | ☐ |
| Agreed with the team | ☐ |
| Logged in the field plan | ☐ |

---

## 456. Reference — Callsign Handling

| Aspect | Detail |
| --- | --- |
| Requirement | Per national rules |
| Implementation | Operator announces; payload may carry ID |
| Morse ID | Sent as part of the payload (configurable) |
| Logging | Bridge/site log records |

---

## 457. Reference — Incident Communication Plan

| Element | Content |
| --- | --- |
| Primary channel | Voice (PMR446 or amateur FM) |
| Data channel | Beacon LoRa 433 MHz |
| Backup | Bridge share links |
| Emergency | EMERGENCY mode + voice |
| Frequency plan | §243 |
| Logging | Bridge + field log |

---

## 458. Reference — Handover Between Teams

| Action | Detail |
| --- | --- |
| Transfer log | CSV/track via bridge share link |
| Handover brief | Position, status, battery, next step |
| Confirm comms | Test voice + data channels |
| Update plan | New search area/frequency if changed |

---

## 459. Reference — Post-Incident Review

| Item | Review |
| --- | --- |
| Timeline | Accurate? |
| Positions | Complete? |
| Comms | Gaps? |
| Equipment | Failures? |
| Process | Improvements? |
| Actions | Follow-ups logged? |

---

## 460. Reference — First Aid for Electronics

| Symptom | Likely | Action |
| --- | --- | --- |
| Hot component | Short / overload | Power off, inspect, measure |
| Burnt smell | Component failure | Power off, replace suspect |
| No power | Battery / switch | Check battery, fuses, wiring |
| Intermittent | Cold joint | Reflow suspect joints |
| Water damage | Liquid ingress | Power off, dry 48 h, clean IPA |

---

## 461. Reference — Disposal and Recycling

| Item | Stream |
| --- | --- |
| PCB/electronics | WEEE e-waste |
| Battery | Battery collection point |
| Case (PLA) | Plastic recycling if marked |
| Packaging | Cardboard/paper |

---

## 462. Reference — Environmental Statement

- The project is fully open source; nothing is proprietary or locked.
- Parts are common, repairable, and upgradable.
- The firmware is small and efficient, minimizing device power.
- The site is static and lightweight.

---

## 463. Reference — Future Hardware Ideas

| Idea | Value | Status |
| --- | --- | --- |
| Custom PCB | Smaller, cleaner | Roadmap v7 |
| Buck converter | Battery life | Roadmap v7 |
| Waterproof case | Robustness | Community |
| Solar charging | Field sustainability | Community |
| SDR receiver module | Enhanced search | Community |
| LoRaWAN | Cloud logging | Roadmap v6 |

---

## 464. Reference — Future Firmware Ideas

| Idea | Value | Status |
| --- | --- | --- |
| OTA | Update without USB | Roadmap v5.6 |
| WebUSB receiver | Browser-based search | Roadmap v6 |
| Beacon-to-beacon relay | Extended range | Idea |
| Noise floor logging | Interference analysis | Idea |
| APRS-like packet IDs | Multi-beacon ID | Idea |

---

## 465. Reference — Future Website Ideas

| Idea | Value | Status |
| --- | --- | --- |
| Live beacon map | Real-time group view | Idea |
| Incident templates | Faster logging | Idea |
| Offline PWA | Field use without net | Idea |
| Translations | Wider audience | Community |

---

## 466. Reference — Measurement of Success

| Metric | Target |
| --- | --- |
| Community contributors | Growing |
| Field testers | ≥ 10 active |
| Wiki coverage | 100% of features |
| CI green | 100% on main |
| Issue turnaround | < 7 days |
| Release cadence | Regular |

---

## 467. Reference — Glossary of Acronyms (Final)

| Acronym | Expansion |
| --- | --- |
| AGCOM | Autorità per le Garanzie nelle Comunicazioni (IT) |
| BNetzA | Bundesnetzagentur (DE) |
| CNSAS | Corpo Nazionale Soccorso Alpino e Speleologico (IT) |
| ECC | Electronic Communications Committee |
| IARU | International Amateur Radio Union |
| ISED | Innovation, Science and Economic Development (CA) |
| MISE | Ministero dello Sviluppo Economico (IT) |
| OFCOM | Office fédéral de la communication (CH) |
| PGHM | Peloton de Gendarmerie de Haute Montagne (FR) |
| REGA | Schweizerische Rettungsflugwacht (CH) |
| REMER | Red Radio de Emergencia (ES) |
| RTR | Rundfunk und Telekom Regulierungs-GmbH (AT) |

---

## 468. Reference — Regional Emergency Contacts

| Country | Service | Notes |
| --- | --- | --- |
| Italy | 112 / CNSAS | Alpine rescue |
| Switzerland | 144 / REGA | Medical + rescue |
| Austria | 144 / Bergrettung | Alpine rescue |
| France | 112 / PGHM | Mountain rescue |
| Germany | 112 / Bergwacht | Alpine rescue |
| Spain | 112 / REMER | Emergency radio net |
| USA | 911 / CAP | Civil air patrol |
| Canada | 911 / SAR | Search and rescue |

---

## 469. Reference — Licenses Overview

| License | Use |
| --- | --- |
| MIT | Project code, docs, firmware |
| ODbL | OSM map data |
| OFL | Fonts |
| CC-BY (some icons) | If used, attributed |

---

## 470. Reference — Final Notes

This datasheet is a living document. Sections are added as the project
grows; the wiki and this file are kept in sync by the CI consistency
checks. If you find an error, open an issue or a PR with the fix.

---

---

## 471. Reference — Firmware State Variables

| Variable | Type | Purpose |
| --- | --- | --- |
| mode | enum | Current operating mode |
| config | struct | All NVS-backed settings |
| position | struct | Latest GPS fix |
| fixState | enum | NO_FIX/COLD/TRACKING/HOLD |
| radioState | enum | IDLE/TX/RX |
| txCount | uint32 | Transmission counter |
| rxCount | uint32 | Reception counter |
| errCount | uint8 | Consecutive error counter |
| bootCount | uint32 | Boot counter (RTC RAM) |
| battSamples[8] | uint16 | Battery ADC samples |
| eventRing[16] | struct | Recent events |

---

## 472. Reference — Firmware Functions (Public API)

| Function | Purpose |
| --- | --- |
| `setup()` | Initialization |
| `loop()` | Main dispatch |
| `loadConfig()` | Load NVS + defaults |
| `saveConfig()` | Persist + verify |
| `factoryReset()` | Erase NVS |
| `initRadio()` | SX1262 init |
| `radioSend(buf, len)` | Transmit payload |
| `radioReceive(timeout)` | Receive with timeout |
| `getIrq()` / `clearIrq()` | IRQ handling |
| `parseNmea(line)` | GPS line parse |
| `updateFixState()` | GPS state machine |
| `getPosition()` | Latest fix |
| `buildPayload()` | LoRa payload |
| `buildMorse()` | Morse text |
| `morseSend(text)` | Key the tone |
| `drawStatus()` | OLED status screen |
| `drawSearch()` | OLED search screen |
| `drawConfig()` | OLED config screen |
| `drawEmergency()` | OLED emergency screen |
| `handleSerial()` | Command parse |
| `handleButtons()` | Debounce + dispatch |
| `startWifi()` | Dashboard AP |
| `stopWifi()` | AP down |
| `enterDeepSleep()` | Sleep entry |
| `sampleBattery()` | ADC read + average |
| `feedWatchdog()` | Reset WDT |

---

## 473. Reference — Firmware Constants (Radio)

| Constant | Value |
| --- | --- |
| RADIO_SPI_FREQ | 8 MHz |
| RADIO_BUSY_TIMEOUT | 5 ms |
| RADIO_TX_TIMEOUT | 5000 ms |
| RADIO_RX_TIMEOUT | 5000 ms |
| RADIO_SYNC_WORD | 0x1424 |
| RADIO_PREAMBLE | 8 symbols |
| RADIO_CRC | 2 bytes (on) |
| RADIO_SF_BEACON | 7 |
| RADIO_SF_SEARCH | 9 |
| RADIO_BW | 125 kHz |
| RADIO_CR | 4/5 |
| PAYLOAD_MAX | 18 bytes |

---

## 474. Reference — Firmware Constants (Display)

| Constant | Value |
| --- | --- |
| OLED_ADDR | 0x3C |
| OLED_W | 128 |
| OLED_H | 64 |
| OLED_I2C_FREQ | 400 kHz |
| FONT_W | 8 |
| FONT_H | 8 |
| SCROLL_TICK | 50 ms × (11 − speed) |

---

## 475. Reference — Firmware Constants (GPS)

| Constant | Value |
| --- | --- |
| GPS_BAUD | 9600 |
| GPS_RX_PIN | GPIO16 |
| GPS_TX_PIN | GPIO17 |
| GPS_FIX_TIMEOUT | 120 s (config) |
| GPS_HOLD | 60 s |
| GPS_MAX_SATS | 24 |

---

## 476. Reference — Firmware Constants (Power)

| Constant | Value |
| --- | --- |
| BAT_PIN | GPIO34 |
| BAT_DIVIDER | 2.0 |
| BAT_OFFSET | 0.0 |
| LOW_BAT_WARN | 3.5 V |
| LOW_BAT_PAUSE | 3.3 V |
| CRIT_BAT_SLEEP | 3.0 V |
| DEEP_SLEEP_PERIOD | 60 s |

---

## 477. Reference — Firmware Constants (Buttons)

| Constant | Value |
| --- | --- |
| BTN_MODE_PIN | GPIO26 |
| BTN_SEL_PIN | GPIO27 |
| BTN_UP_PIN | GPIO32 |
| BTN_DN_PIN | GPIO33 |
| DEBOUNCE_MS | 50 |
| LONG_PRESS_MS | 1500 |
| REPEAT_DELAY_MS | 500 |
| REPEAT_RATE_MS | 250 |

---

## 478. Reference — Firmware Constants (Misc)

| Constant | Value |
| --- | --- |
| SERIAL_BAUD | 115200 |
| WDT_TIMEOUT | 5 s |
| WIFI_AP_IP | 192.168.4.1 |
| WIFI_AP_TIMEOUT | 5 min |
| EVENT_RING_SIZE | 16 |
| FIRMWARE_VERSION | "5.5.0" |

---

## 479. Reference — Site Scripts and Their Jobs

| Script | Job |
| --- | --- |
| scripts/firstBody.cjs | Extract dashboard HTML from the firmware |
| lib/obsidian-callouts.mjs | Render [!CALL] blocks |
| lib/external-links.mjs | Force external links to new tabs |
| lib/wiki-nav.ts | Wiki navigation registry |
| .github/scripts/verify-website.mjs | CI verification |
| .github/scripts/merge-benchmarks.mjs | Merge benchmark JSON |
| .github/scripts/benchmark-website.mjs | Website benchmark |

---

## 480. Reference — CI Environment

| Aspect | Value |
| --- | --- |
| Runner | ubuntu-latest |
| Node | 20 |
| Python | 3.11+ |
| PlatformIO | latest |
| Caching | npm + pio caches |

---

## 481. Reference — CI Secrets

| Secret | Used by |
| --- | --- |
| (none) | The workflows are read-only/self-contained |

---

## 482. Reference — Permissions Model (Workflows)

| Workflow | Permissions |
| --- | --- |
| website-ci | read (contents), read (issues optional) |
| firmware-ci | read |
| benchmarks | read (never writes) |
| pr-checks | read, pull-requests write (labels) |

---

## 483. Reference — Conventional Commit Examples

| Type | Example |
| --- | --- |
| feat | `feat: add bridge local tracking` |
| fix | `fix: correct coordinate encoding` |
| docs | `docs: expand the datasheet` |
| ci | `ci: make benchmarks check-only` |
| refactor | `refactor: simplify mode dispatcher` |
| test | `test: add bridge unit checks` |
| chore | `chore: bump version to 5.5.0` |

---

## 484. Reference — PR Title Validation Pattern

```regex
^(feat|fix|docs|ci|refactor|test|chore|perf|style|build|revert)(\([a-z-]+\))?: .+
```

---

## 485. Reference — Commit Message Validation Pattern

Same as §484 plus a body requirement for larger changes; enforced by
pr-checks.yml.

---

## 486. Reference — Wiki Page ID Rules

| Rule | Detail |
| --- | --- |
| Slug | kebab-case filename |
| Title | Sentence case, no trailing period |
| Description | One sentence, precise |
| Registration | In wiki-nav.ts under one group |
| Links | Relative slugs or absolute site paths |

---

## 487. Reference — Repeaters Data Tags

| Tag | Meaning |
| --- | --- |
| communication:amateur_radio:repeater | Repeater node |
| callsign | Callsign |
| frequency | TX frequency |
| offset | Repeater offset |
| ctcss | Tone |
| name | Name |
| operator | Operator |
| website | Info URL |

---

## 488. Reference — Overpass Query Template

```
[out:json][timeout:25];
(
  node["communication:amateur_radio:repeater"]({{bbox}});
);
out body;
```

---

## 489. Reference — Leaflet Usage

| Aspect | Value |
| --- | --- |
| Library | leaflet (self-hosted) |
| Tiles | OSM |
| Markers | divIcon (custom, no image assets) |
| Maps | report-position, repeaters |
| Attribution | OSM required |

---

## 490. Reference — Report Position Page State

| State | Behavior |
| --- | --- |
| No params | World view, manual input |
| Params | Marker + fit bounds |
| Bridge stream | Live marker + track |
| Manual line | Form fills, map updates |

---

## 491. Reference — Demo Simulator Logic

| Control | Effect |
| --- | --- |
| MODE | Cycles simulated modes |
| SEL | TX standby toggle (BEACON) / config target |
| UP/DN | Adjust selected parameter |
| Frequency | Sets simulated freq |
| Power | Sets TX power |
| WPM | Sets Morse speed |
| OLED | Mirrors firmware screens |

---

## 492. Reference — Builder Budget Math

| Step | Formula |
| --- | --- |
| Essentials total | Σ essential part prices |
| With options | essentials + selected options |
| Over budget? | total > budget |
| Auto-fit | Drop optional (highest price first) until ≤ budget |
| Status | "Within budget" / "Over budget by €X" |

---

## 493. Reference — Benchmark JSON Schema

```json
{
  "env": "esp32dev",
  "board": "ESP32 DevKit V1",
  "flash_used": 82.1,
  "flash_percent": 81.8,
  "ram_used": 240.1,
  "ram_percent": 16.2,
  "compile_seconds": 42.5,
  "warnings": 0,
  "commit": "abc1234",
  "date": "2026-09-12T10:00:00Z"
}
```

---

## 494. Reference — Site Data Files

| File | Content |
| --- | --- |
| src/data/benchmarks.json | Latest benchmark snapshot |
| src/lib/wiki-nav.ts | Nav registry |
| src/content/wiki/*.md | Wiki pages |
| public/robots.txt | Crawler rules |

---

## 495. Reference — Version Bump Checklist Detail

| File | Edit |
| --- | --- |
| AegisBeacon.ino | FIRMWARE_VERSION |
| DATASHEET.md | Title, §64, §290 |
| README.md | Badge/version mention |
| wiki/whats-new | New version page |
| wiki/changelog | New entry |
| (package.json) | version if bumped |

---

## 496. Reference — What's New Page Structure

| Element | Content |
| --- | --- |
| Title | What's New in v5.5 |
| Summary | One paragraph |
| Highlights | Bullet list with links |
| Migration | Breaking changes (if any) |
| Credits | Contributors |

---

## 497. Reference — Changelog Format

```markdown
## [5.5.0] - 2026-09-12

### Added
- Bridge local tracking and share links
- Disclaimer page
- JSON-LD structured data

### Changed
- Config dashboard now extracted live from the firmware
- Workflows hardened

### Fixed
- ...
```

---

## 498. Reference — Release Notes Template

```markdown
# Aegis-Beacon v5.5.0

## Highlights
...

## What's new
...

## Breaking changes
...

## Full changelog
...
```

---

## 499. Reference — Support Escalation Path

| Level | Channel |
| --- | --- |
| Self-service | Wiki troubleshooting |
| Community | GitHub Discussions |
| Bug reports | GitHub Issues (template) |
| Security | Private disclosure (email) |

---

## 500. Reference — Metrics Dashboard (Project Health)

| Metric | Where |
| --- | --- |
| CI status | Actions badges in README |
| Benchmarks | /benchmarks |
| Releases | GitHub releases |
| Wiki coverage | CI nav check |
| Issues | GitHub issues |
| Contributors | GitHub insights |

---

## 501. Reference — Final Assembly Checklist

| Item | ✓ |
| --- | --- |
| All wires strain-relieved | ☐ |
| Antenna connected | ☐ |
| Battery polarity correct | ☐ |
| Case sealed (gasket) | ☐ |
| Firmware version verified | ☐ |
| Serial handshake verified | ☐ |
| GPS fix verified | ☐ |
| TX verified | ☐ |
| Bridge logging verified | ☐ |
| Spare battery packed | ☐ |

---

## 502. Reference — Field Kit Final Check

| Item | ✓ |
| --- | --- |
| Beacon + antenna | ☐ |
| Spare cell | ☐ |
| Receiver unit | ☐ |
| Bridge laptop | ☐ |
| USB data cables | ☐ |
| PMR446 radios | ☐ |
| Maps + compass | ☐ |
| Log template | ☐ |
| First aid | ☐ |
| Emergency plan | ☐ |

---

## 503. Reference — Debrief Questions

| Question | Purpose |
| --- | --- |
| Did the beacon perform? | Equipment reliability |
| Was the range adequate? | Coverage planning |
| Were positions accurate? | GPS/config check |
| Was the bridge useful? | Tooling feedback |
| Any near-misses? | Safety review |
| What to improve? | Roadmap input |

---

## 504. Reference — Known Future Work (Tracking)

| Item | Owner |
| --- | --- |
| OTA | Maintainers |
| Custom PCB | Community |
| Translations | Community |
| SDR receiver | Community |
| WebUSB | Maintainers |

---

## 505. Reference — This Document's Conventions

| Convention | Rule |
| --- | --- |
| Section numbering | Decimal, continuous |
| Tables | For specs and comparisons |
| Callouts | [!WARNING]/[!TIP]/[!NOTE]/[!INFO]/[!IMPORTANT] |
| Units | SI with common alternates |
| Version | Matches firmware |
| License footer | MIT + copyright |

---

## 506. Reference — Document Revision History

| Revision | Change |
| --- | --- |
| v1 | Initial 34 sections |
| v2 | Added 35–57 (radio, antenna, legal, testing, bridge, website) |
| v3 | Added 58–99 (architecture, modes, payloads, FAQ) |
| v4 | Added 100–160 (variants, buses, deep reference) |
| v5 | Added 161–255 (wiki catalog, walkthroughs, BOM, NMEA) |
| v6 | Added 256–332 (GPIO, HELP/STATUS, security, performance) |
| v7 | Added 333–420 (SX1262, IRQs, SOPs, site reference) |
| v8 | Added 421–470 (POST, verification, profiles, acronyms) |
| v9 | Added 471–506 (firmware API, CI, release, checklists) |

---

---

## 507. Reference — Complete Site Color Usage

| Element | Dark token | Light token |
| --- | --- | --- |
| Background | --bg (graphite) | --bg (paper) |
| Text | --ink | --ink |
| Muted | --muted | --muted |
| Border | --border | --border |
| Accent | --accent | --accent |
| Accent hover | --accent-strong | --accent-strong |
| Success | --ok | --ok |
| Warning | --warn | --warn |
| Danger | --danger | --danger |
| Code bg | --code-bg | --code-bg |
| Link | --accent | --accent |

---

## 508. Reference — Site Typography Scale

| Role | Family | Size (desktop) | Weight |
| --- | --- | --- | --- |
| Hero H1 | Chakra Petch | 3.5–4.5 rem | 700 |
| Section H2 | Chakra Petch | 2–2.5 rem | 600 |
| H3 | Chakra Petch | 1.4–1.6 rem | 600 |
| Body | Manrope | 1–1.125 rem | 400 |
| Data/mono | JetBrains Mono | 0.875 rem | 400 |
| Small/caption | Manrope | 0.8125 rem | 400 |
| Button | Manrope | 0.95 rem | 600 |

---

## 509. Reference — Site Spacing Scale

| Token | Value |
| --- | --- |
| --space-1 | 4 px |
| --space-2 | 8 px |
| --space-3 | 12 px |
| --space-4 | 16 px |
| --space-5 | 24 px |
| --space-6 | 32 px |
| --space-7 | 48 px |
| --space-8 | 64 px |
| Container max | 1200 px |
| Page gutter | 20 px (mobile) / 32 px (desktop) |

---

## 510. Reference — Wiki Callout Types

| Type | Usage |
| --- | --- |
| [!WARNING] | Danger, legal, safety |
| [!TIP] | Best practice |
| [!NOTE] | General note |
| [!INFO] | Additional context |
| [!IMPORTANT] | Critical requirement |

---

## 511. Reference — Wiki Page Template

```markdown
---
title: Page Title
description: "One precise sentence."
---

# Page Title

Intro paragraph.

## Section

- Point
- Point

| Table | Of | Specs |
| --- | --- | --- |
| a | b | c |

> [!NOTE]
> Context.

## Related pages

- [Link](page)
```

---

## 512. Reference — Landing Page Copy Tone

| Rule | Example |
| --- | --- |
| Plain verbs | "Hear it. Find it." |
| No hype | Facts over adjectives |
| Specific | "433 MHz, +20 dBm, 2.5 m GPS" |
| Active | "Transmits SOS + position" |
| Honest | "Requires a license in most countries" |

---

## 513. Reference — Demo Page Tone

- The demo mirrors the firmware; copy is minimal.
- Controls are labeled exactly as the device labels them.
- Errors (e.g. no fix) show the device's own messages.

---

## 514. Reference — Legal Page Tone

- Plain, short sentences.
- No legalese beyond what's needed.
- Links to the repo for verification.
- Disclaimer covers: no warranty, not certified, RF/battery/liability.

---

## 515. Reference — Bridge Help Text (--help)

```text
usage: aegis-serial-bridge.py [-h] [--port PORT] [--no-tui] [--baud BAUD]
                              [--http-port HTTP_PORT] [--site SITE]
                              [--no-open] [--tui] [--list] [--verbose]
```

---

## 516. Reference — Bridge Error Messages

| Message | Meaning |
| --- | --- |
| "pyserial is required" | Install pyserial |
| "No supported serial device found" | Check cable/driver |
| "cannot open COM3: ..." | Port busy/missing |
| "retrying in 2 s..." | Reconnect loop |
| "position unchanged" | No new fix worth a tab |
| "page is open, streaming" | Live mode active |

---

## 517. Reference — Bridge Share URL Building

| Field | Included |
| --- | --- |
| lat | Yes |
| lng | Yes |
| alt | If present |
| sats | If present |
| freq | If present |
| mode | If present |
| payload | If present |

Values are URL-encoded; lat/lng always included for a usable map link.

---

## 518. Reference — Bridge Port Scoring

| Factor | Points |
| --- | --- |
| VID in {CP210x, CH340, FTDI, ESP32-S3} | +3 |
| Description hint match | +2 |
| Bluetooth/BLE in name | −4 |
| Score ≤ 0 | Not auto-selected |

---

## 519. Reference — Bridge Reconnect Policy

| Event | Action |
| --- | --- |
| Port open fails | Log, retry in 2 s |
| Serial error mid-stream | Close, log, reconnect in 2 s |
| Device unplugged | Reconnect loop until plugged |
| Ctrl+C | Clean stop (exit code 0) |

---

## 520. Reference — Bridge Threads

| Thread | Role |
| --- | --- |
| main | Serial reading loop |
| stdin forwarder | Terminal → device commands |
| HTTP server (daemon) | Loopback endpoints |

---

## 521. Reference — Bridge State Locking

| Resource | Lock |
| --- | --- |
| Position data | STATE.lock |
| TUI fields | TUI.lock |
| Last-open cache | Main thread only |

---

## 522. Reference — Site Build Pipeline

```text
markdown (wiki) ─► astro check ─► build ─► verify ─► deploy (Vercel)
                                   │
                                   └─ sitemap + robots + SEO head
```

---

## 523. Reference — Site Dependency Tree (Abridged)

```text
astro
 ├─ @astrojs/sitemap
 ├─ content collections (wiki)
 ├─ rehype (callouts, external links)
 ├─ leaflet (maps)
 └─ fontsource (fonts)
```

---

## 524. Reference — GitHub Repository Layout

```text
/          README, DATASHEET, CONTRIBUTING, LICENSE
/AegisBeacon.ino
/bridge/   Serial bridge (Python)
/website/  Astro site
/.github/  Workflows + scripts
/hardware/ (planned) STL/KiCad
```

---

## 525. Reference — Release Tag Convention

| Tag | Format | Example |
| --- | --- | --- |
| Stable | vMAJOR.MINOR.PATCH | v5.5.0 |
| Pre-release | vX.Y.Z-rc.N | (future) |

---

## 526. Reference — Semantic Versioning Policy

| Bump | When |
| --- | --- |
| MAJOR | Breaking protocol/hardware |
| MINOR | New features, backward compatible |
| PATCH | Bug fixes |

---

## 527. Reference — Test Env Matrix (CI)

| Env | Purpose |
| --- | --- |
| esp32dev | Reference build |
| esp32-s3 | S3 build |
| esp32-c3 | C3 build (benchmarks) |

---

## 528. Reference — Known Compile Warnings Policy

| Warning | Policy |
| --- | --- |
| Any | Must be fixed before merge |
| Deprecation | Fix or suppress with reason |
| Format string | Fix |

---

## 529. Reference — Code Formatting

| Rule | Detail |
| --- | --- |
| Indentation | 2 spaces (JS), 4 spaces (C++) |
| Line length | ≤ 100 chars soft |
| Strings | Double quotes (JS), double (C++) |
| Naming | camelCase (JS), snake_case (C++ vars), PascalCase (C++ funcs) |

---

## 530. Reference — Wiki Link Styles

| Link | Style |
| --- | --- |
| Internal page | Plain (accent) |
| External | accent + external marker (auto) |
| Breadcrumb | muted, current bold |
| Prev/next | bordered pills |
| Edit | ghost button top-right |

---

## 531. Reference — Wiki Table Style

- Full-width within the article column.
- Header row: semi-bold, border-bottom.
- Zebra striping: subtle.
- Horizontal scroll on mobile (wrap in .table-scroll).

---

## 532. Reference — Code Block Style

- JetBrains Mono.
- Rounded corners, hairline border.
- Darker background than the page.
- Copy button on hover (desktop).

---

## 533. Reference — Callout Style

- Left accent border in the type color.
- Type label in small caps (CSS only).
- Subtle background tint.
- Icon per type (optional).

---

## 534. Reference — Search Result Style

- Title in accent on hover.
- Description shown only when the query matches it.
- Keyboard hints (↑ ↓ ↵ esc) on the footer.
- Highlighted query substring.

---

## 535. Reference — Mobile Nav Style

- Hamburger on < 640 px.
- Slide-down panel with all main links.
- GitHub link last, external icon.
- Focus trap + Esc to close.

---

## 536. Reference — Theme Toggle Style

- Icon-only button in the header.
- Sun/moon glyph.
- Crossfade on change (respects reduced motion).
- Persisted in localStorage.

---

## 537. Reference — Footer Style

- Muted text, hairline top border.
- Columns: project, docs, legal, external.
- Version + license line.
- Social/OG not needed (static).

---

## 538. Reference — Button Styles

| Style | Use |
| --- | --- |
| primary | Main CTA |
| secondary | Secondary action |
| ghost | Tertiary/inline |
| danger | Destructive confirm |
| icon | Icon-only |

---

## 539. Reference — Form Styles

| Element | Style |
| --- | --- |
| Input | Hairline border, focus ring |
| Select | Same as input |
| Label | Muted, above |
| Error | Danger text below |
| Hint | Muted, below |

---

## 540. Reference — Card Styles

| Card | Border | Hover |
| --- | --- | --- |
| Default | hairline | lift + border accent |
| Feature | hairline | lift |
| Spec | hairline | none |
| Clickable | hairline | lift + accent |

---

## 541. Reference — Table of Contents Style

| Aspect | Detail |
| --- | --- |
| Position | Sticky right column (desktop) |
| Depth | H2/H3 |
| Active | Accent + left bar |
| Collapse | Mobile accordion |

---

## 542. Reference — Breadcrumb Style

```text
Docs › Getting Started › Quick Start
```

- Muted links, current in ink.
- Chevron separators.
- On wiki article pages above the title.

---

## 543. Reference — Prev/Next Style

| Button | Content |
| --- | --- |
| Prev | ← Previous page title |
| Next | Next page title → |

Bordered, full-width halves at the article bottom.

---

## 544. Reference — Edit on GitHub Button

- Ghost button, pencil icon.
- Links to the wiki page source.
- External (new tab, noopener).

---

## 545. Reference — Repeater Marker Style

| State | Marker |
| --- | --- |
| Default | Orange pin (divIcon) |
| Selected | Larger, ring |
| Filtered out | Hidden |
| Fallback data | Different shade |

---

## 546. Reference — Report Position Marker Style

| Element | Style |
| --- | --- |
| Latest fix | Accent pin |
| Track | Orange polyline |
| Older fixes | Dim dots |
| Fit | Auto-fit bounds on first fix |

---

## 547. Reference — Map Controls

| Control | Present |
| --- | --- |
| Zoom +/− | Yes |
| Fullscreen | No (leaflet default off) |
| Locate | Yes (repeaters) |
| Attribution | Yes (OSM) |

---

## 548. Reference — Site Console Logs

| Level | Where |
| --- | --- |
| Error | Console, on failure |
| Warn | Console, on recoverable |
| Info | None (quiet by default) |
| Debug | None (production) |

---

## 549. Reference — Site Error Handling

| Case | Behavior |
| --- | --- |
| Missing page | Astro 404 |
| Bad URL params | Defaults used |
| Overpass down | Fallback dataset + notice |
| Bridge not running | Page shows "no stream" state |
| Geolocation denied | Manual center |

---

## 550. Reference — Accessibility Labels

| Element | Label |
| --- | --- |
| Search | "Search all documentation" |
| Theme toggle | "Switch theme" |
| Mobile menu | "Menu" |
| External links | (icon + aria-label) |
| Map | "Map" |

---

## 551. Reference — Meta Description Length

| Page | Length target |
| --- | --- |
| Landing | 150–160 chars |
| Wiki articles | 120–160 chars |
| Legal | 120–160 chars |
| Tools | 120–160 chars |

---

## 552. Reference — Title Length

| Page | Length target |
| --- | --- |
| Landing | ≤ 60 chars |
| Wiki articles | ≤ 60 chars |
| Legal | ≤ 60 chars |

---

## 553. Reference — Image Guidelines

| Asset | Guideline |
| --- | --- |
| Banner | 1376×768, brand |
| OG | 1200×630 |
| Favicon | SVG, brand |
| Wiki images | Compressed, alt text |

---

## 554. Reference — Video/Audio Guidelines

- No autoplay.
- Captions where applicable.
- Small files or lazy load.

---

## 555. Reference — Final Data Points

| Metric | Value |
| --- | --- |
| Wiki pages | 440+ |
| Datasheet sections | 500+ |
| Firmware version | 5.5.0 |
| License | MIT |
| Primary band | 433 MHz |
| Max TX | +22 dBm |
| GPS | 2.5 m CEP |
| Range (SF9) | 6–15 km LOS |

---

*MIT License — Copyright (c) 2026 Leonardo Galli*
*https://github.com/Leo-Galli/Aegis-Beacon*