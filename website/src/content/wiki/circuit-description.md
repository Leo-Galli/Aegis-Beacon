---
title: "Circuit Description"
description: "Technical documentation for Circuit Description"
---

# Circuit Description

## Overview

The Aegis-Beacon circuit is designed for simplicity and reliability. All connections use standard 0.1" pitch headers for easy assembly and debugging.

## SPI Bus Configuration

### VSPI (Hardware SPI) -- SX1262 Radio

| Signal | ESP32 GPIO | SX1262 Pin | Notes |
|--------|------------|------------|-------|
| SCK | GPIO 18 | SCK | SPI clock |
| MISO | GPIO 19 | MISO | Data from radio |
| MOSI | GPIO 23 | MOSI | Data to radio |
| CS | GPIO 5 | NSS | Chip select (active LOW) |
| RESET | GPIO 14 | RESET | Active LOW reset |
| BUSY | GPIO 21 | BUSY | **MANDATORY** -- RadioLib polls |

> [!WARNING]
> The BUSY pin is not optional. If GPIO 21 is not wired to BUSY, the firmware will hang on the first radio call.

### Software SPI -- SSD1309 OLED

| Signal | ESP32 GPIO | OLED Pin | Notes |
|--------|------------|----------|-------|
| SCK | GPIO 15 | D0 | SPI clock |
| SDA | GPIO 13 | D1 | SPI data |
| RESET | GPIO 4 | RES | Hardware reset |
| DC | GPIO 16 | A0 | Data/Command select |
| CS | GPIO 17 | CS | Chip select (active LOW) |

> [!NOTE]
> Software SPI is used to avoid bus conflicts with the radio. Both devices can operate simultaneously.

## UART Configuration

### UART2 -- NEO-6M GPS

| Signal | ESP32 GPIO | GPS Pin | Notes |
|--------|------------|---------|-------|
| RX | GPIO 22 | TX | GPS TX to ESP32 RX (input-only) |
| TX | GPIO 12 | RX | ESP32 TX to GPS RX |

**Baud rate:** 9600 (NEO-6M default)

## Audio Output

### DAC1 Path

```
GPIO 25 (DAC1) --> 100 Ohm --> 10uF cap --> 3.5mm jack TIP
```

**Components:**
- R2: 100 Ohm series resistor (current limiting)
- C3: 10uF electrolytic (AC coupling, blocks DC)
- J1: 3.5mm TRRS jack (Tip=audio, Sleeve=GND)

> [!TIP]
> The ESP32 DevKit V1 has a native 8-bit DAC on GPIO 25. Audio is generated via LEDC PWM for precise frequency control.

## Battery Monitor

### Voltage Divider

```
TP4056 BAT+ --> R3a (100k) --> GPIO 36 --> R3b (100k) --> GND
                                |
                            ADC reading
                           (VBAT / 2)
```

**Calculation:**
- Full charge (4.2V): ADC sees 2.1V
- Empty (3.0V): ADC sees 1.5V
- Quiescent current: ~21uA (negligible)

> [!NOTE]
> GPIO 36 is input-only (ADC1_CH0, SVP). No external pullup needed.

## LED Indicators

### Red LED (BEACON Mode)

```
GPIO 27 --> 330 Ohm --> Red LED anode --> LED cathode --> GND
```

### Blue LED (SEARCH Mode)

```
GPIO 26 --> 330 Ohm --> Blue LED anode --> LED cathode --> GND
```

## Button Connections

### MODE Button (GPIO 33)

```
GPIO 33 <-- [SW_MODE] --> GND
```
Internal pullup enabled in firmware.

### SEL Button (GPIO 32)

```
GPIO 32 <-- [SW_SEL] --> GND
```
Internal pullup enabled in firmware.

### UP Button (GPIO 35)

```
GPIO 35 <-- [SW_UP] --> GND
         |
         +--> 10k --> 3.3V (external pullup required)
```

### DN Button (GPIO 34)

```
GPIO 34 <-- [SW_DN] --> GND
         |
         +--> 10k --> 3.3V (external pullup required)
```

> [!WARNING]
> GPIO 34 and 35 are input-only pins with no internal pullup. External 10k pullup resistors are required.

## Power Supply

### Main Power Path

```
USB 5V --> AMS1117-3.3V --> 3.3V Rail
                             |
Battery 3.7V --> TP4056 --> BAT+ --> 3.3V Rail
```

### Decoupling

- **C1:** 100uF electrolytic on 3.3V rail (bulk storage)
- **C2:** 100nF ceramic on 3.3V rail (high-frequency decoupling)

> [!TIP]
> For cold weather operation (< -10C), replace C1 electrolytic with a 47uF X7R ceramic capacitor.
