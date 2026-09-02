---
title: "GPIO Pin Mapping"
description: "Technical documentation for GPIO Pin Mapping"
---

# GPIO Pin Mapping

> [!IMPORTANT]
> **GPIO 21 is mandatory** for the SX1262 BUSY pin. If not wired, the firmware will hang on the first radio call.

## Complete GPIO Map (v5.4)

| GPIO | Function | Direction | Notes |
|------|----------|-----------|-------|
| **2** | SX1262 DIO1 | Input | TX/RX done + timeout IRQ |
| **4** | OLED RESET | Output | Hardware reset for SSD1309 |
| **5** | SX1262 NSS/CS | Output | Chip Select (active LOW), VSPI |
| **12** | GPS TX out | Output | Serial2 TX to NEO-6M RX |
| **13** | OLED SDA | Output | Software SPI data (D1/MOSI) |
| **14** | SX1262 RESET | Output | Active LOW reset |
| **15** | OLED SCK | Output | Software SPI clock (D0) |
| **16** | OLED DC | Output | Data/Command select |
| **17** | OLED CS | Output | Software SPI chip select |
| **18** | VSPI SCK | Output | SX1262 SPI clock |
| **19** | VSPI MISO | Input | SX1262 SPI data out |
| **21** | SX1262 BUSY | Input | **MANDATORY** -- RadioLib polls before every SPI |
| **22** | GPS RX in | Input | Serial2 RX from NEO-6M TX (input-only) |
| **23** | VSPI MOSI | Output | SX1262 SPI data in |
| **25** | DAC1 audio | Output | Audio to 3.5mm jack via 100R + 10uF |
| **26** | LED_BLUE | Output | SEARCH mode indicator, 330R to GND |
| **27** | LED_RED | Output | BEACON mode indicator, 330R to GND |
| **32** | SW_SEL | Input | INPUT_PULLUP, short=toggle, long 3s=config |
| **33** | SW_MODE | Input | INPUT_PULLUP, short=toggle, long 2s=emergency |
| **34** | SW_DN | Input | Input-only, needs 10k external pullup |
| **35** | SW_UP | Input | Input-only, needs 10k external pullup |
| **36** | ADC1_CH0 | Input | Battery voltage divider wiper (SVP, input-only) |
| **39** | TP4056 STDBY | Input | Optional -- LOW when charging (SVN, input-only) |

## Input-Only Pins

> [!WARNING]
> **GPIO 34, 35, 36, 39** are input-only on the ESP32. They have no internal pull-up resistors.

- **GPIO 34 (SW_DN):** Add 10k pullup to 3.3V
- **GPIO 35 (SW_UP):** Add 10k pullup to 3.3V
- **GPIO 36 (Battery ADC):** No pullup needed (ADC input)
- **GPIO 39 (TP4056 STDBY):** No pullup needed (optional, ADC input)

## Pin Assignment Rationale

### VSPI Bus (GPIO 18/19/23/5)

Used exclusively for the SX1262 radio. Hardware SPI for maximum speed and reliability.

### Software SPI (GPIO 15/13/4/16/17)

Used for the SSD1309 OLED. Deliberately uses software SPI to avoid bus conflicts with the radio. Adds ~2ms per full-screen update (imperceptible at 120ms refresh rate).

### UART2 (GPIO 22/12)

Used exclusively for the NEO-6M GPS module. Started only when `gpsEnabled = true` in configuration.

### Audio Output (GPIO 25)

Native DAC1 output with LEDC PWM for precise frequency control. Connected to 3.5mm jack via 100 Ohm resistor and 10uF AC-coupling capacitor.

## Wiring Summary

```
ESP32 DevKit V1 Pinout (30-pin)
===============================

        3V3  [1] [30] GND
         EN  [2] [29] GPIO23 (VSPI MOSI)
     GPIO36  [3] [28] GPIO22 (GPS RX)
     GPIO39  [4] [27] GPIO1 (TX0)
     GPIO34  [5] [26] GPIO3 (RX0)
     GPIO35  [6] [25] GPIO21 (SX1262 BUSY)  <-- MANDATORY
     GPIO32  [7] [24] GPIO19 (VSPI MISO)
     GPIO33  [8] [23] GPIO18 (VSPI SCK)
     GPIO25  [9] [22] GPIO5 (SX1262 CS)
     GPIO26 [10] [21] GPIO17 (OLED CS)
     GPIO27 [11] [20] GPIO16 (OLED DC)
     GPIO14 [12] [19] GPIO4 (OLED RESET)
     GPIO12 [13] [18] GPIO2 (SX1262 DIO1)
     GND    [14] [17] GPIO15 (OLED SCK)
     GPIO13 [15] [16] GPIO0
              USB
```
