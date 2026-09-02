---
title: "Troubleshooting"
description: "Technical documentation for Troubleshooting"
---

# Troubleshooting

## Overview

Common issues and solutions for Aegis-Beacon assembly and operation.

## Radio Issues

### SX1262 TX Init Failed

**Symptom:** `[ERROR] SX1262 TX init FAILED: -2`

**Cause:** SPI wiring or missing BUSY pin

**Solution:**
1. Check GPIO 18/19/23/5 connections
2. Verify BUSY pin (GPIO 21) is connected
3. Test SPI continuity with multimeter

> [!WARNING]
> GPIO 21 (BUSY) is mandatory. Without it, firmware hangs on first radio call.

### Radio Hangs on First Call

**Symptom:** Device freezes after boot

**Cause:** BUSY pin not wired

**Solution:**
1. Wire BUSY to GPIO 21
2. Verify connection with continuity test
3. Re-flash firmware

### Weak Signal / No Range

**Symptom:** Beacon not heard at expected distance

**Cause:** Antenna issue or low power

**Solution:**
1. Verify antenna length (17.3cm for 433 MHz)
2. Check SMA connection
3. Increase TX power in CONFIG portal
4. Test with SDR to verify transmission

## Display Issues

### OLED Blank

**Symptom:** No display output

**Cause:** Wrong SPI pins or soft-SPI conflict

**Solution:**
1. Verify GPIO 15/13/4/16/17 connections
2. Check 3.3V power to OLED
3. Test with simple sketch

### OLED Flickering

**Symptom:** Display flickers or shows artifacts

**Cause:** SPI bus contention

**Solution:**
1. Ensure software SPI is used (not hardware)
2. Check for loose connections
3. Reduce SPI clock speed

## GPS Issues

### No GPS Fix After 2 Minutes

**Symptom:** GPS wait screen shows 0 satellites

**Cause:** Obstructed sky view or weak signal

**Solution:**
1. Move outdoors with clear sky view
2. Wait 5-15 minutes for cold start
3. Check GPIO 22/12 connections
4. Verify GPS module power

### Wrong Coordinates

**Symptom:** Coordinates don't match location

**Cause:** DDM format misread

**Solution:**
- `N4553` = 45 53' N, not 45.53
- `E01230` = 12 30' E, not 12.30
- Add decimal point at position 3

## Battery Issues

### Battery Reads 0% or 100% Stuck

**Symptom:** Battery percentage doesn't change

**Cause:** Divider not connected or wrong GPIO

**Solution:**
1. Check R3a/R3b divider on GPIO 36
2. Verify BAT+ connection to TP4056
3. Adjust `BAT_VREF_MV` in config

### Battery Drains Quickly

**Symptom:** Runtime much shorter than expected

**Cause:** High current draw or cold weather

**Solution:**
1. Check for WiFi/BT left enabled
2. Verify deep sleep is working
3. Monitor serial for sleep messages
4. Use LiFePO4 in cold weather

## Audio Issues

### No Audio Output

**Symptom:** No sound from earphone

**Cause:** Wrong pin or missing AC cap

**Solution:**
1. Verify GPIO 25 connection
2. Check 10uF cap orientation (+ to GPIO)
3. Test with 100 Ohm resistor to GND

### Audio Too Quiet

**Symptom:** Very low volume

**Cause:** Volume setting too low

**Solution:**
1. Increase volume via UP/DN buttons
2. Check VOL/WPM toggle (SEL button)
3. Verify DAC1 configuration

## Button Issues

### Buttons Unresponsive

**Symptom:** No response to button presses

**Cause:** Missing pullup on input-only pins

**Solution:**
1. Add 10k pullup to GPIO 34/35
2. Verify button wiring to GND
3. Check for stuck buttons

### Factory Reset Not Working

**Symptom:** MODE+SEL at boot doesn't reset

**Cause:** Not holding long enough

**Solution:**
1. Hold both buttons for 5+ seconds
2. Release after OLED shows reset message
3. Device reboots with defaults

## Software Issues

### Upload Fails

**Symptom:** `Failed to connect` error

**Cause:** Wrong board or port selected

**Solution:**
1. Select "ESP32 Dev Module" board
2. Verify COM port in Device Manager
3. Press BOOT button during upload
4. Try different USB cable

### NVS Empty Warning

**Symptom:** `[WARN] NVS empty` on boot

**Cause:** First boot or after factory reset

**Solution:**
- This is normal behavior
- Configure via CONFIG portal
- Settings save to NVS on first save

## Performance Issues

### Slow Display Updates

**Symptom:** OLED updates slowly

**Cause:** SPI clock too slow

**Solution:**
1. Verify software SPI connections
2. Check for bus contention
3. Reduce update frequency

### High Power Consumption

**Symptom:** Battery drains faster than expected

**Cause:** WiFi/BT not disabled

**Solution:**
1. Verify WiFi/BT shutdown in beacon mode
2. Check serial for WiFi messages
3. Disable WiFi in CONFIG portal

## Debug Output

### Serial Monitor

Connect at 115200 baud for debug output:

```
[INFO ] Boot #1 reset_reason=1 heap=290244 B cpu=240MHz
[BAT  ] Boot battery: 87% 4100mV charging=NO
[OK   ] OLED ready -- SSD1309 128x64
[OK   ] SX1262 CW TX ready: 433.500 MHz @ 17 dBm
```

### Common Debug Tags

| Tag | Meaning |
|-----|---------|
| `[INFO ]` | Normal operation |
| `[OK   ]` | Successful operation |
| `[WARN ]` | Non-fatal warning |
| `[ERROR]` | Hardware failure |
| `[SCAN ]` | RSSI scan result |
| `[GPS  ]` | GPS engine |
| `[BAT  ]` | Battery reading |

> [!TIP]
> Set `DEBUG_VERBOSE 1` for per-symbol Morse timing and RadioLib state codes.
