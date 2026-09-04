---
title: "Factory Reset and Recovery"
description: "Wipe NVS, clear a stuck EMERGENCY flag, and get the beacon back to known-good defaults"
---

# Factory Reset and Recovery

## Overview

Three recovery procedures cover almost every "my beacon is doing something wrong" situation: a full NVS wipe, clearing a stuck EMERGENCY flag, and reflashing after a bad configuration.

## Method 1: Hardware Factory Reset

Hold **SW_MODE + SW_SEL together at boot for at least 5 seconds**.

| Detail | Value |
|--------|-------|
| Buttons | MODE (GPIO 33) + SEL (GPIO 32) |
| Hold time | >= 5000 ms |
| Effect | Erases the `aegis` NVS namespace |
| After | Reboots with hardcoded defaults |

The RTC boot counter is not part of NVS and survives the reset, which is useful for tracking.

## Method 2: Dashboard Factory Reset

From the CONFIG portal (`http://192.168.4.1`):

1. Enter CONFIG mode (hold SEL 3 s).
2. Open the dashboard.
3. Press the factory reset button.
4. The device POSTs to `/factory`, wipes NVS, and reboots.

## Method 3: Clearing a Stuck EMERGENCY Flag

The EMERGENCY flag lives in RTC RAM and survives power cycles by design. To clear it:

1. Enter CONFIG mode by holding SEL for 3 seconds.
2. Save any setting from the dashboard (or press the emergency-clear action).
3. The device reboots into the selected normal mode.

If the buttons do not respond because the beacon is transmitting:

- Power off, wait 10 s, power on, and hold SEL immediately at boot.

## After Recovery

| State | Action |
|-------|--------|
| Defaults loaded | Reconfigure frequencies and identity |
| Frequencies lost | Re-enter them via the portal |
| Name and GPS lost | Re-enter identity and GPS settings |
| Boot counter | Check the serial log to confirm the reset |

## Related Pages

- [Configuration Reference](/wiki/configuration-reference)
- [RTC RAM State](/wiki/rtc-ram-state)
- [Upload and Monitor](/wiki/upload-and-monitor)
- [Troubleshooting](/wiki/troubleshooting)
