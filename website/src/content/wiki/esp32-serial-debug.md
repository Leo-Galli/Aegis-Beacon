---
title: "ESP32 Serial Debug Output"
description: "What the firmware prints on Serial, the log macros, and how to interpret each log category"
---

# ESP32 Serial Debug Output

## Overview

The firmware prints a structured log to Serial (USB) during operation. Every line is timestamped in milliseconds and tagged with a category. The logs are the primary way to see what the device is doing when it is not booting, not fixing GPS, not beaconing, or not scanning as expected.

## Log Macros

The firmware defines a small set of log macros, one per category:

```cpp
LOG_INFO(fmt, ...)   - general informational messages
LOG_OK(fmt, ...)     - successful operations
LOG_WARN(fmt, ...)   - recoverable warnings
LOG_ERR(fmt, ...)    - errors
LOG_MODE(fmt, ...)   - mode changes and transitions
LOG_SCAN(fmt, ...)   - scan engine events
LOG_BTN(fmt, ...)    - button presses and state
LOG_CFG(fmt, ...)    - configuration load/save
LOG_OLED(fmt, ...)   - OLED display events
LOG_AUDIO(fmt, ...)  - audio player events
LOG_GPS(fmt, ...)    - GPS read and fix events
LOG_POT(fmt, ...)    - potentiometer / button volume events
LOG_MORSE(fmt, ...)  - Morse encoder events (when enabled)
LOG_RF(fmt, ...)     - radio transmit and receive events (when enabled)
```

There is also a section divider macro that prints a labelled separator line for readability.

## Serial Configuration

The USB serial console runs at the project baud rate. The GPS lives on a separate UART (UART2), so GPS data does not pollute the console log. The console is the place to watch boot, mode, configuration, and errors.

## What to Watch On Startup

A healthy boot prints:

- The banner with firmware version and active mode.
- Battery and GPS status.
- Mode.
- Whether the configuration was loaded from NVS or defaults were used.

If the device does not beacon, look for:

- GPS fix state and satellite count.
- RX/TX events for the radio.
- Any error tagged `[ERROR]`.

## Category Guide

### LOG_MODE

Use this to confirm which mode the device entered and why. Mode transitions (beacon to search, search to config, config to emergency) are logged here.

### LOG_GPS

Use this to see how many satellites the module sees and whether a fix was obtained. If GPS stays at zero satellites, the module is not seeing the sky, not wired correctly, or not powered.

### LOG_SCAN

Use this to see the scan engine activity in SEARCH mode: which frequencies are scanned, dwell time, and detection events.

### LOG_BTN

Use this to debug button behavior. If buttons do not respond, this log shows whether the firmware registered presses and what it interpreted them as.

### LOG_CFG

Use this to see configuration load from NVS and save operations. If settings do not persist, check whether save was logged.

### LOG_RF and LOG_MORSE

These are conditionally compiled. They appear only when the build enables RF and Morse logging. Use them when you need to see exactly what is being transmitted and when.

## Reading a Log Line

Each line has the form:

```
[  12345][CATEGORY] message
```

The number is milliseconds since power-on. The category is a short tag. The message is human-readable. Use the timestamp to correlate events: for example, a GPS fix at 20 seconds followed by a beacon at 25 seconds.

## Common Log Patterns

| Pattern | Meaning |
|---|---|
| Mode printed, no beacon | Radio TX not occurring — check power, antenna, mode |
| GPS satellites zero | Module not in open sky, or wrong wiring |
| Save logged, then config matches | NVS write succeeded |
| Button logged but no action | Button recognized but action disabled or out of range |
| Error before boot banner | Early init failure — check wiring and power |

## Capturing Logs

Connect the ESP32 USB to a computer running a serial monitor, or use a USB-to-serial adapter on the UART pins. Set the terminal to the project baud rate. Watch during startup and during the action you want to diagnose.

For field debugging where USB is not practical, the OLED and the web dashboard show the most relevant state. Serial is the deep-dive tool for development and diagnosis.

## Related Pages

- [Serial Debug System](/wiki/serial-debug-system) — the full debug interface and what to connect.
- [GPS Integration](/wiki/gps-integration) — GPS log events and fix behavior.
- [Dashboard HTTP API](/wiki/dashboard-http-api) — the web dashboard's `/status` endpoint mirrors much of this state.
