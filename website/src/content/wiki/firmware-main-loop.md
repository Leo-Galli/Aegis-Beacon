---
title: The Firmware Main Loop
description: How the ESP32 firmware is structured, what the main loop does every cycle, and how the watchdog fits in.
---

# The Firmware Main Loop

The beacon's firmware is a single Arduino sketch with a clear structure. Understanding the main loop explains how all the features coexist.

## The top-level structure

```
setup()
  - load config from NVS (or defaults)
  - init Serial, OLED, radio, buttons, LEDs
  - restore RTC RAM state (mode, counters, GPS cache)
  - handle factory reset / emergency flag

loop()
  - run the active mode's state machine
  - refresh the OLED periodically
  - update battery percentage every 5 s
  - feed the watchdog
```

## Mode dispatch

The `loop()` reads the current mode from state and dispatches to the mode handler:

| Mode | Handler behavior |
|------|------------------|
| BEACON | TX cycle → deep sleep → wake → repeat |
| SEARCH | Scan frequencies, measure RSSI, log hits |
| CONFIG | Serve the WiFi dashboard |
| EMERGENCY | Continuous TX at max power, no sleep |

## The timing structure

- The main loop is non-blocking where possible: state machines step on timers instead of `delay()`.
- The OLED refreshes at 120 ms.
- Battery reads every 5 s (32 averaged samples).
- The watchdog is fed on every loop iteration (30 s window).

## Why non-blocking matters

During a TX cycle the loop cannot sleep, but it still refreshes the OLED and monitors the buttons. The mid-TX abort (MODE button) works because the button handler runs on an interrupt, not on the loop.

## The deep-sleep exit

In BEACON mode, after the TX cycle the firmware stores state in RTC RAM and calls `esp_deep_sleep_start()`. On wake, `setup()` runs again, restores the mode and counters from RTC RAM, and resumes the cycle. This is why the beacon can survive weeks on one cell.

## Where to look in the source

- `setup()`: the config load and init sequence.
- `loop()`: the mode dispatch and housekeeping.
- Each mode has a dedicated handler; the state machine page lists them.

## A typical BEACON cycle in the loop

1. Check if it is time to TX (sleep countdown expired).
2. Build the payload (message + name + GPS).
3. For each frequency: init radio, key the carrier, send Morse, unkey.
4. Update counters in RTC RAM.
5. Enter deep sleep for the configured interval.