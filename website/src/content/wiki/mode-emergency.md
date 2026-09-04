---
title: "EMERGENCY Mode"
description: "Continuous max-power SOS: activation, behavior, flag persistence and how to clear it"
---

# EMERGENCY Mode

## Overview

EMERGENCY is the last-resort mode: continuous transmission at maximum power with no deep sleep. It is deliberately hard to stop accidentally - the flag survives reboots and power cycles so a crash or battery swap does not silence the beacon.

## Activation

| Method | How |
|--------|-----|
| Hardware | Hold SW_MODE for >= 2 s |
| Dashboard | Emergency button (POST `/emergency`) |
| Auto | Optional low-battery auto-switch (`aswitch`) |

## What It Does

- TX at maximum power (+22 dBm RadioLib; up to +30 dBm on the E22 PA).
- Payload repeated 3x per frequency.
- Full payload always: name + GPS when enabled.
- No deep sleep: continuous transmission.
- OLED: full-screen alternating inverse `SOS` + frequency + coordinates.
- Audio: continuous 1760 Hz tone.

## Battery Reality

| Cell | Expected runtime |
|------|------------------|
| 2000 mAh, GPS on | ~12 hours |
| 3000 mAh, GPS on | ~18 hours |

This is why EMERGENCY is for the acute phase, not for a multi-day wait. BEACON mode with a long sleep interval lasts days; EMERGENCY lasts hours.

## Flag Persistence

The emergency flag (`g_emergencyActive`) lives in RTC RAM:

- It survives deep sleep, reboots and power cycles.
- A battery swap does not stop the transmission.
- Only CONFIG mode + save, or a factory reset, clears it.

> [!WARNING]
> If you are testing EMERGENCY mode, expect the device to keep transmitting after you power-cycle it. Clear it deliberately via CONFIG mode - this is the designed failsafe, not a bug.

## Related Pages

- [Operating Modes](/wiki/operating-modes)
- [RTC RAM State](/wiki/rtc-ram-state)
- [Reliability and Safety Features](/wiki/reliability-and-safety-features)
- [Factory Reset and Recovery](/wiki/factory-reset-and-recovery)
