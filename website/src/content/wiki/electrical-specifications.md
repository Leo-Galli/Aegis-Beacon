---
title: "Electrical Specifications"
description: "Absolute maximum ratings, power supply rails, per-state current draw and realistic battery life estimates"
---

# Electrical Specifications

## Overview

Reference values for the Aegis-Beacon v5.4 power system: what the hardware can tolerate, what it draws in every state, and how long a 2000 mAh 18650 cell lasts per mode.

## Absolute Maximum Ratings

Exceeding any of these limits can permanently damage the board.

| Parameter | Min | Max | Unit |
|-----------|-----|-----|------|
| Supply voltage (VBUS / 5 V in) | 4.5 | 5.5 | V |
| SX1262 VCC | 1.8 | **3.6** | V |
| GPIO voltage (ESP32 DevKit V1) | -0.3 | 3.6 | V |
| Operating temperature | -20 | +60 | C |
| Storage temperature | -40 | +85 | C |
| TX power (SX1262, RadioLib) | -9 | **+22** | dBm |
| TX power (E22-400M30S with PA) | - | **+30** | dBm |
| OLED VCC (SSD1309) | 1.65 | **3.5** | V |
| Audio output load impedance | 16 | 600 | ohm |
| Battery voltage divider input | 0 | 4.5 | V |

> [!WARNING]
> Never connect SX1262 VCC or OLED VCC to 5 V / VBUS - permanent damage will result.

## Power Supply Rails

| Parameter | Typical | Unit | Conditions |
|-----------|---------|------|------------|
| Battery voltage (18650 Li-ion) | 3.7 | V | Nominal |
| ESP32 LDO input (VBUS) | 5.0 | V | From TP4056 OUT+ |
| 3.3 V rail voltage | 3.30 | V | AMS1117-3.3 internal LDO |
| 3.3 V rail output current (max) | 800 | mA | Limited by AMS1117-3.3 |
| Battery divider quiescent current | 0.021 | mA | 100 kohm + 100 kohm at 4.2 V |

The ESP32 DevKit V1 carries its own AMS1117-3.3 LDO, so no external regulator is required.

## Current Consumption by State

| State | Typical | Unit | Notes |
|-------|---------|------|-------|
| Deep sleep (ESP32 only) | 10 | uA | RTC RAM active, GPIOs held |
| BEACON TX active at +17 dBm | 120 | mA | WiFi/BT disabled |
| SEARCH scan (RX, no TX) | 40 | mA | WiFi/BT disabled |
| CONFIG mode (WiFi AP active) | 100 | mA | No TX |
| EMERGENCY mode (continuous TX) | 120 | mA | No sleep |
| SSD1309 OLED (active) | 6 | mA | At 3.3 V |
| SSD1309 OLED (setPowerSave(1)) | 0.3 | mA | Sent before deep sleep |
| NEO-6M GPS (acquiring) | 30 | mA | Cold start |
| NEO-6M GPS (tracking) | 25 | mA | Fix acquired |
| DAC1 audio output (GPIO 25) | 2 | mA | Into 32 ohm load, volume 180/255 |

## Battery Life Estimates

Based on a 2000 mAh 18650 cell at 20 C:

| Mode | Sleep Interval | GPS | OLED | Estimated Runtime |
|------|----------------|-----|------|-------------------|
| BEACON | 10 s | Off | On | ~65 hours |
| BEACON | 10 s | On | On | ~45 hours |
| BEACON | 30 s | Off | On | ~130 hours |
| BEACON | 60 s | Off | On | ~175 hours |
| SEARCH | Continuous | Off | On | ~44 hours |
| EMERGENCY | Continuous | On | On | ~12 hours |

> [!TIP]
> Sleep interval is the single largest lever on runtime: 10 s gives ~65 h, 60 s gives ~175 h. Set it to the fastest rate your scenario actually needs.

## Cold Weather Behavior

- At -20 C expect **40-60% of nominal capacity** from standard Li-ion.
- Use **LiFePO4** cells (rated to -30 C) for alpine cold-weather deployments.
- Below -10 C replace the 100 uF electrolytic bulk cap with a **47 uF X7R ceramic**.

## Firmware Constants That Matter

```cpp
#define BAT_VREF_MV    3900    // ADC full-scale voltage (mV)
#define BAT_SAMPLES    32      // ADC samples per battery reading
#define BAT_READ_MS    5000    // Battery read interval (ms)
#define BAT_FULL_MV    4200    // Full charge voltage
#define BAT_EMPTY_MV   3000    // Empty cutoff voltage
```

The battery ADC is guarded to reject readings outside 2500-4500 mV, which filters out bad-connection transients.
