---
title: "Reliability & Safety Features"
description: "Watchdog, NVS fail-safe, interrupt-driven buttons, mid-TX abort and the EMERGENCY flag design"
---

# Reliability & Safety Features

## Overview

A rescue beacon has one job: keep transmitting when it is needed most. This page documents the engineering features that make the Aegis-Beacon resilient to the failures most likely to kill a field device: a wedged CPU, corrupt settings, a dead battery reading and a button that needs pressing mid-transmission.

## Feature Matrix

| Feature | Description |
|---------|-------------|
| Hardware watchdog | 30 s WDT (`esp_task_wdt`) reboots a wedged CPU |
| NVS fail-safe | Hardcoded defaults on empty or corrupt storage |
| RTC RAM state | Mode, counters, scan hits, GPS fix survive deep sleep |
| Interrupt-driven buttons | Responsive even during active TX |
| SX1262 BUSY polling | RadioLib polls BUSY before every SPI transfer |
| ADC range guard | Ignores battery readings outside 2.5-4.5 V |
| WiFi/BT stack shutdown | Saves ~120 mA during TX/RX cycles |
| OLED power save before sleep | `setPowerSave(1)` before `esp_deep_sleep_start()` |
| Mid-TX abort | SW_MODE aborts between characters, max latency 1 character |
| Emergency flag persistence | `g_emergencyActive` in RTC RAM survives power cycles |

## Hardware Watchdog

The task watchdog is armed at boot with a 30 second timeout. If any mode loop stalls (radio hang, blocking WiFi operation, an infinite loop), the ESP32 reboots itself rather than sitting dead. A repeated watchdog reset pattern in the serial log is the first clue to investigate; see [Troubleshooting](/wiki/troubleshooting).

## NVS Fail-Safe

If NVS is empty, corrupt, or missing any key, the firmware falls back to hardcoded defaults. Every key is read with a default value:

```cpp
cfg.wpm     = prefs.getUChar("wpm", DEFAULT_WPM);
cfg.powerDbm = prefs.getChar("pwr", DEFAULT_POWER_DBM);
```

This means the device is always functional after a first flash or a factory reset - there is no state where it boots into a bricked configuration.

## Interrupt-Driven Buttons

Button presses are serviced from an interrupt context, not polled in the main loop. During a ~45 s payload transmission the buttons keep working: SW_MODE aborts the Morse stream at the next character boundary (worst case one character of latency) and switches mode immediately.

## SX1262 BUSY Polling

The SX1262 has a BUSY pin that signals when its internal state machine is unavailable. RadioLib polls this pin before every SPI transfer - the firmware cannot speak too early to the radio. This is also why **GPIO 21 must be wired to BUSY**: without it the radio never reports ready and every call hangs (see [GPIO Pin Map](/wiki/gpio-pin-mapping)).

## ADC Range Guard

Battery readings outside 2500-4500 mV are discarded. A disconnected divider reads ~0 V and a miswire can read the full 3.3 V rail; both are obviously wrong for a 3.7 V cell, and the guard prevents the percentage display from flipping to 0% or 100% on a transient.

## Power-Saving Shutdowns

| Stack | When | Saving |
|-------|------|--------|
| WiFi | BEACON / SEARCH entry | ~120 mA |
| Bluetooth | BEACON / SEARCH entry | included above |
| OLED | Just before deep sleep | ~6 mA |

The OLED is explicitly told to sleep (`setPowerSave(1)`) before the chip enters deep sleep, dropping the display from 6 mA to 0.3 mA for the whole sleep window.

## EMERGENCY Flag Design

The single most important reliability decision in the firmware:

1. EMERGENCY mode is triggered by hardware (long-press SW_MODE), not only software.
2. The flag is written to RTC RAM **before** continuous TX begins.
3. RTC RAM survives power cycles, so a reboot or battery swap does not stop the beacon.
4. The flag is cleared only by entering CONFIG mode and saving, or by factory reset.

This guarantees that the emergency transmission state cannot be lost to a crash, a brownout or an accidental power cycle.

## What This Means in the Field

- A beacon that crashes during a payload restarts and keeps transmitting (watchdog + NVS fail-safe + RTC mode restore).
- A beacon that loses its GPS fix transmits the last known cached position.
- A beacon that is buried keeps transmitting on battery until the cell is exhausted (EMERGENCY has no sleep).
- A beacon that is found can be switched to CONFIG to clear EMERGENCY and reconfigured in the field.
