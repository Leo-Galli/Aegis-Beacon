<!--
 █████╗ ███████╗ ██████╗ ██╗███████╗    ██████╗ ███████╗ █████╗  ██████╗ ██████╗ ███╗   ██╗
██╔══██╗██╔════╝██╔════╝ ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║
███████║█████╗  ██║  ███╗██║███████╗    ██████╔╝█████╗  ███████║██║     ██║   ██║██╔██╗ ██║
██╔══██║██╔══╝  ██║   ██║██║╚════██║    ██╔══██╗██╔══╝  ██╔══██║██║     ██║   ██║██║╚██╗██║
██║  ██║███████╗╚██████╔╝██║███████║    ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝  ╚═══╝
-->
# DATASHEET — Aegis-Beacon v5.4

**Dual-Mode Avalanche Rescue System**
**Revision: 5.4 | Date: 2026 | Author: Leonardo Galli**

---

## 1. General Description

Aegis-Beacon v5.4 is an open-source, ultra-low-cost emergency rescue beacon for avalanche survival, backcountry SAR operations, and off-grid emergency communication. The device combines a 433 MHz CW radio transmitter with a passive RSSI scanner, a 2.42" SSD1309 OLED status display, a NEO-6M GPS module, a 4-button physical control panel, a live battery monitor, and a 3.5mm audio alert output into a pocketable, battery-powered unit buildable for approximately $23–28 USD.

The firmware runs on an **ESP32 DevKit V1** (30-pin) microcontroller, controlled by the RadioLib driver stack, and exposes a WiFi captive-portal dashboard for field configuration without any additional tools. v5.4 is a full hardware revision from v4.0 (ESP32-C3 + SX1276); all GPIO assignments, libraries, and the NVS schema have changed.

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

> ⚠️ **Never connect SX1262 VCC or OLED VCC to 5 V / VBUS — permanent damage will result.**

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

| Mode      | Sleep Interval | GPS | OLED | Estimated Runtime |
|-----------|----------------|-----|------|-------------------|
| BEACON    | 10 s           | Off | On   | ~65 hours         |
| BEACON    | 10 s           | On  | On   | ~45 hours         |
| BEACON    | 30 s           | Off | On   | ~130 hours        |
| BEACON    | 60 s           | Off | On   | ~175 hours        |
| SEARCH    | Continuous     | Off | On   | ~44 hours         |
| EMERGENCY | Continuous     | On  | On   | ~12 hours         |

> 💡 At −20 °C, expect 40–60% of nominal capacity from standard Li-ion. Use LiFePO4 (rated to −30 °C) for alpine cold-weather deployments. Below −10 °C replace the 100 µF electrolytic bulk cap with a 47 µF X7R ceramic.

---

## 4. RF Specifications

### 4.1 Transmitter (SX1262 / Ebyte E22-400M30S)

| Parameter                    | Value          | Unit  | Notes                                         |
|------------------------------|----------------|-------|-----------------------------------------------|
| RF module                    | Ebyte E22-400M30S |    | SX1262 or LLCC68 inside; TCXO onboard        |
| Frequency range              | 410–525        | MHz   | Hardware-limited by module filter             |
| Modulation                   | CW (FSK keying)| —     | `transmitDirect()` / `standby()` carrier keying |
| Output power range (RadioLib)| −9 to +22      | dBm   | SX1262 PA hardware limit                      |
| Output power (E22 PA)        | up to +30      | dBm   | Module onboard PA; RadioLib caps at 22 dBm    |
| Default output power         | +17            | dBm   | ~50 mW; configurable                         |
| Frequency accuracy           | ±1             | ppm   | TCXO onboard on E22 modules                   |
| Antenna interface            | SMA            | —     | External 433 MHz SMA whip recommended         |
| RX current draw              | ~5             | mA    | Better than SX1276 (~12 mA)                   |

> ℹ️ The SX1262 does **not** support OOK modulation. Morse keying is implemented by toggling a continuous FSK carrier via `transmitDirect()` (on) and `standby()` (off). The resulting CW signal is indistinguishable from OOK at the receiver.

> ⚠️ **SX1262 vs SX1276 key differences:** (1) BUSY pin is **mandatory** — must wire to GPIO 21; (2) main IRQ is **DIO1**, not DIO0; (3) RadioLib power cap is +22 dBm (E22 PA adds more externally).

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
| 868.0 MHz  | 8.6 cm  | 17.3 cm |
| 915.0 MHz  | 8.2 cm  | 16.4 cm |

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

> ℹ️ Software SPI is used deliberately so the OLED does not share the VSPI bus with the radio. Both devices can operate simultaneously. The overhead is ~2 ms per full-screen update, imperceptible at 120 ms refresh.

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
| **BOOT**      | Inverted header "AEGIS-BEACON v5.4" · feature flags · battery icon + % · INITIALISING progress bar |
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
| **SW_MODE**   | Short press   | < 2000 ms       | Toggle BEACON ↔ SEARCH                      |
| **SW_MODE**   | Long press    | ≥ 2000 ms       | Activate EMERGENCY mode                     |
| **SW_SEL**    | Short press   | < 3000 ms       | Toggle adjustment target: VOL ↔ WPM         |
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

## 11. GPIO Pin Map (v5.4 — ESP32 DevKit V1)

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

> ⚠️ **GPIO 34, 35, 36, 39 have no internal pull-up resistors.** Use external 10 kΩ pull-ups for SW_UP (35) and SW_DN (34). GPIO 36 and 39 are ADC/detect-only inputs requiring no pull-up.

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

> ℹ️ v5.4 consolidates the v4.0 `/api/config`, `/api/scan`, `/api/tx`, `/api/hits`, and `/api/hits/clear` endpoints. The scan history is now served embedded in the dashboard page; the `/status` endpoint covers all device state.

**Example `/status` GET response fields:** `boot`, `heap`, `tx`, `hits`, `mode`, GPS fix state, satellite count, battery %, WPM, volume.

---

## 15. Operating Modes Summary

| Mode           | TX | RX | WiFi | OLED layout              | Audio                    | Deep sleep         |
|----------------|----|----|------|--------------------------|--------------------------|--------------------|
| **BEACON**     | ✅  | ❌  | Off  | Freq + TX progress + bat | Morse click stream       | Yes (configurable) |
| **SEARCH**     | ❌  | ✅  | Off  | RSSI bar + hits + bat    | Variable pitch (440–2200 Hz) | No (continuous) |
| **CONFIG**     | ❌  | ❌  | AP   | SSID + IP + instructions | Silent                   | No                 |
| **EMERGENCY**  | ✅  | ❌  | Off  | Full-screen SOS + coords | Continuous 1760 Hz       | No                 |

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

> ⚠️ This device is an experimental emergency tool, **not** a certified distress beacon. In genuine life-threatening emergencies, use certified PLB/EPIRB equipment alongside this device. Always verify local regulations before operation.

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

## 21. Bill of Materials (v5.4)

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
| v5.4    | 2026 | Battery monitor (GPIO 36 divider, 9-point Li-ion curve, pixel-art icon in all headers, CHG indicator, dashboard animated bar); improved OLED graphics across all screens |
| v5.3    | 2026 | Replaced potentiometers with 4-button control (SW_MODE / SW_SEL / SW_UP / SW_DN); OLED adj overlay; auto-repeat; NVS save via SEL long press |
| v5.2    | 2026 | Radio upgraded SX1276 → SX1262 (Ebyte E22-400M30S); BUSY pin GPIO 21 mandatory; `ensureSpiStarted()` helper; TCXO 1.6 V parameter |
| v5.1    | 2026 | NEO-6M GPS: name + coordinates in Morse payload (`SOS DE [NAME] PSN [LAT] [LON]`); TinyGPS++ integration; RTC GPS cache; GPS wait screen |
| v5.0    | 2026 | Ported to ESP32 DevKit V1 (30-pin); SSD1306 0.96" → SSD1309 2.42" SPI (U8g2); GPIO 25 DAC1 audio; VSPI for radio; `audioDacSilence()` mid-rail parking |
| v4.0    | 2026 | Added SSD1306 0.96" OLED (I2C, GPIO 0/1); 3.5mm audio jack (GPIO 18 PWM); SW_CONFIG moved GPIO 1 → GPIO 21; audio/OLED NVS keys |
| v3.0    | 2025 | Initial public release: ESP32-C3 + SX1276, WiFi dashboard, deep sleep, frequency hopping, NVS config, RTC RAM state, CI/CD      |

---

## 23. v4.0 → v5.4 Migration

> ⚠️ **Breaking change — full hardware revision.** Do not run v5.x firmware on the original ESP32-C3 board with RA-02 module without complete rewiring.

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

*MIT License — Copyright © 2026 Leonardo Galli*
*https://github.com/Leo-Galli/Aegis-Beacon*