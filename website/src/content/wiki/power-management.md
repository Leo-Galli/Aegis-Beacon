---
title: "Power Management"
description: "Technical documentation for Power Management"
---

# Power Management

## Overview

The Aegis-Beacon is designed for ultra-low power consumption. Deep sleep at 10 microamps enables 65+ hours of beacon operation on a single 18650 cell.

## Power Sources

### Battery

| Parameter | Value |
|-----------|-------|
| **Type** | 18650 Li-ion |
| **Voltage** | 3.7V nominal |
| **Capacity** | 2600-3500 mAh |
| **Recommended** | LiFePO4 for alpine |

### Charging

| Parameter | Value |
|-----------|-------|
| **Charger** | TP4056 USB-C |
| **Max Current** | 1A |
| **Protection** | DW01A (over-discharge) |
| **LED Indicators** | Red = charging, Blue = full |

## Current Consumption

### By State

| State | Current | Notes |
|-------|---------|-------|
| **Deep Sleep** | ~10 uA | ESP32 + RTC |
| **TX Active (+17 dBm)** | ~120 mA | SX1262 + ESP32 |
| **TX Active (+22 dBm)** | ~150 mA | Max power |
| **SEARCH Scan (RX)** | ~40 mA | SX1262 receive |
| **WiFi AP (CONFIG)** | ~100 mA | ESP32 WiFi |
| **OLED Active** | ~6 mA | SSD1309 display |
| **OLED Power Save** | ~0.3 mA | setPowerSave(1) |
| **GPS Acquiring** | ~30 mA | NEO-6M cold start |
| **GPS Tracking** | ~25 mA | NEO-6M locked |
| **Battery Divider** | ~0.021 mA | Always on |
| **LEDs (each)** | ~2 mA | Red or Blue |

### Total Power Budget

**BEACON Mode (10s sleep, GPS off):**

```
Sleep: 10uA x 9.9s = 0.099 mA x s
TX: 120mA x 0.1s = 12 mA x s
OLED: 6mA x 0.1s = 0.6 mA x s
Total per cycle: 12.7 mA x s / 10s = 1.27 mA average
```

**Estimated runtime (2000 mAh):** ~65 hours

## Battery Monitor

### Hardware

Voltage divider on GPIO 36:

```
TP4056 BAT+ --> R3a (100k) --> GPIO 36 --> R3b (100k) --> GND
```

**Divider ratio:** VBAT / 2

### ADC Configuration

```cpp
// 32-sample averaging
uint32_t readBatteryADC() {
  uint32_t sum = 0;
  for (int i = 0; i < BAT_SAMPLES; i++) {
    sum += analogRead(BAT_PIN);
    delayMicroseconds(100);
  }
  return sum / BAT_SAMPLES;
}
```

### Li-ion Discharge Curve

| Voltage | Percentage |
|---------|------------|
| 4.20V | 100% |
| 4.05V | 90% |
| 3.90V | 75% |
| 3.75V | 60% |
| 3.65V | 50% |
| 3.55V | 35% |
| 3.40V | 20% |
| 3.20V | 10% |
| 3.00V | 0% |

### Calibration

If readings differ from multimeter:

```cpp
#define BAT_VREF_MV   3900   // Adjust as needed
```

### Charging Detection

Optional connection from TP4056 STDBY to GPIO 39:

```cpp
bool isCharging() {
  return digitalRead(CHG_PIN) == LOW; // LOW = charging
}
```

> [!TIP]
> Charging detection is optional. Battery percentage works without it.

## Runtime Estimates

### BEACON Mode

| Sleep Interval | GPS | OLED | Runtime |
|----------------|-----|------|---------|
| 10s | Off | On | ~65 hours |
| 10s | On | On | ~45 hours |
| 30s | Off | On | ~130 hours |
| 60s | Off | On | ~175 hours |

### SEARCH Mode

| Configuration | Runtime |
|---------------|---------|
| Continuous scan, GPS off | ~44 hours |
| Continuous scan, GPS on | ~30 hours |

### EMERGENCY Mode

| Configuration | Runtime |
|---------------|---------|
| Continuous TX, GPS on | ~12 hours |

> [!WARNING]
> At -20C with standard Li-ion, expect 40-60% of these figures. Use LiFePO4 for alpine deployments (rated to -30C).

## Power Saving Features

### WiFi/BT Shutdown

In BEACON and SEARCH modes:

```cpp
WiFi.mode(WIFI_OFF);
btStop();
// Saves ~120 mA continuous draw
```

### OLED Power Save

Before deep sleep:

```cpp
u8g2.setPowerSave(1); // Turn off display
esp_deep_sleep(sleepTimeUs);
```

### Radio Standby

After transmission:

```cpp
radio.standby(); // Low power mode
// vs radio.sleep() // Even lower, but slower wakeup
```

## Cold Weather Considerations

### Battery Performance

| Temperature | Capacity | Internal Resistance |
|-------------|----------|---------------------|
| 20C | 100% | 1x |
| 0C | 80-90% | 1.5x |
| -10C | 60-80% | 2x |
| -20C | 40-60% | 3x |
| -30C | 20-40% (Li-ion) | 5x |

### Recommendations

1. **Use LiFePO4** cells (rated to -30C)
2. **Keep device warm** in pocket until needed
3. **Reduce sleep interval** for faster beacon rate
4. **Replace electrolytic C1** with X7R ceramic below -10C

> [!TIP]
> LiFePO4 cells have slightly lower capacity (1500-2000 mAh) but maintain performance in extreme cold.
