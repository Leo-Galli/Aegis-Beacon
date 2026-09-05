---
title: The Firmware State Machine
description: The states the firmware can be in, the transitions between them, and where each transition is triggered.
---

# The Firmware State Machine

The beacon's behavior is a small state machine. Mapping it out makes the firmware readable and debugging faster.

## The states

```
BOOT → BEACON (default or NVS-saved mode)
BOOT → SEARCH   (MODE short press)
BOOT → CONFIG   (SEL held 3 s)
BOOT → FACTORY_RESET (MODE+SEL at boot 5 s)

BEACON ⇄ SEARCH   (MODE short press)
BEACON → EMERGENCY (MODE held 2 s)
SEARCH → EMERGENCY (MODE held 2 s)
CONFIG → EMERGENCY (dashboard emergency button)

EMERGENCY → BEACON (MODE held 2 s)
CONFIG → BEACON    (Save & Reboot)
```

## Where the state lives

- The current mode is stored in a global variable and mirrored in RTC RAM so it survives deep sleep.
- On boot, `setup()` restores the mode from RTC RAM (unless a factory reset is pending).

## The emergency flag

EMERGENCY is special: a persisted flag in RTC RAM marks the state even across power cycles. If the beacon is in EMERGENCY at deep sleep (it should not sleep in EMERGENCY, but a power loss can happen), it reboots back into EMERGENCY. Clearing it requires entering CONFIG and saving.

## Sub-states inside BEACON

BEACON itself has phases: sleep-wait → payload-build → per-frequency TX → sleep. Each phase is a step in the handler, advanced by a timer, not by blocking delays.

## Sub-states inside SEARCH

SEARCH steps: tune frequency → open RX window (dwell) → sample RSSI → classify → next frequency. The hit log and LED heartbeat update per step.

## Why this design

A state machine with non-blocking steps keeps the UI responsive (OLED, buttons, battery) during TX, and makes the mid-TX abort simple: the MODE interrupt sets a flag the next step checks.

## Debugging with the state machine

The serial log prints `[STATE]` transitions. If the beacon behaves oddly, the log shows which state it is stuck in and which transition never fired. See the serial debug pages for the full tag reference.