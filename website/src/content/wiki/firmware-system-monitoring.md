---
title: "Firmware System Monitoring"
description: "Battery voltage measurement, board temperature and the RSSI history buffer in the v6.0 firmware"
---

# Firmware System Monitoring

v6.0 adds three always-on system monitors to the firmware: battery voltage, board temperature and an RSSI history buffer. All of them are read inside the main loops (BEACON, SEARCH, LISTEN) so their values are always fresh on the OLED and over serial.

## Battery monitor

### Hardware

A 2:1 resistor divider samples the pack:

| Connection | Value |
|------------|-------|
| BAT+ (TP4056 BAT+ rail) | 100 kohm to GPIO 34 |
| GPIO 34 (ADC1_CH6) | 100 kohm to GND |

At 4.2 V full charge the pin sees 2.1 V, safely inside the 3.3 V ADC range. GPIO 34 is ADC1, so it keeps measuring even while WiFi (ADC2) is active in CONFIG mode.

### Software

| Constant | Value | Meaning |
|----------|-------|---------|
| `BATTERY_READ_MS` | 5000 | Read interval in ms |
| `BATTERY_FULL_MV` | 4200 | Full-charge voltage |
| `BATTERY_EMPTY_MV` | 3300 | Empty cutoff |
| `BATTERY_LOW_MV` | 3550 | Low-battery warning threshold |

- `readBatteryMv()`: `analogReadMilliVolts()` on GPIO 34, doubled for the divider, clamped to 0-4200 mV, cached for `BATTERY_READ_MS`.
- `battPct()`: linear map of 3300-4200 mV to 0-100%.
- Low-battery event: red LED blinks 4x, `AEGIS:BATT:low;mv=..` is printed once, and the OLED glyph flashes at 400 ms; the warning resets when voltage recovers above the threshold.
- `BATT` serial command replies `AEGIS:BATT:mv=..;pct=..`.

### Calibration

If the reported voltage differs from a multimeter, adjust the divider factor in `readBatteryMv()` (multiply by 2.0-2.2 depending on resistor tolerance). See [Battery Monitor Calibration](battery-monitor-calibration) for the full procedure and [Cell Discharge Curve](cell-discharge-curve) for the optional piecewise state-of-charge curve.

## Board temperature

`boardTempC()` reads the ESP32 internal silicon sensor through `temperatureRead()` (Arduino-ESP32). Values in the 1-125 °C range are trusted; anything outside reports as 0.0 (sensor unavailable). It appears in:

- the `AEGIS:STATE` line from the `STATUS` command (`temp=42.1`);
- the serial STATUS debug block.

The internal sensor tracks the silicon, not the ambient air: use it as a trend indicator for thermal protection, not as a weather reading.

## RSSI history buffer

`recordRssi()` pushes every RSSI sample (SEARCH and LISTEN loops) into a 120-sample ring buffer (`RSSI_HIST_LEN`). The OLED engine renders the buffer newest-to-oldest:

- SEARCH: the buffer replaces the plain fill bar with an oscilloscope-style trace inside the RSSI frame; the threshold tick and the sweeping caret remain.
- LISTEN: a dedicated trace frame with the threshold tick and the live RSSI/THR readout.

Unused slots read 0 and are skipped, so the trace fills from the right as samples accumulate. The buffer is RAM-only: it resets on deep sleep, exactly like the scan history.

## Serial additions summary

| Command / line | Reply |
|----------------|-------|
| `BATT` | `AEGIS:BATT:mv=3710;pct=52` |
| Low battery (event) | `AEGIS:BATT:low;mv=3510` |
| `STATUS` | `AEGIS:STATE:...;batt=3710;temp=42.1;up=312` |
| `HELP` | includes `BATT` and `MODE ... LISTEN` |