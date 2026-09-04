---
title: "First Use"
description: "Unboxing to first transmission: what to check, what the boot screen should show, and your first SOS on the air"
---

# First Use

## Overview

A freshly flashed Aegis-Beacon boots straight into BEACON mode with safe defaults: 433.500 MHz, +17 dBm, 13 WPM, message `SOS`, no GPS. This page walks through the first power-on and the first real transmission.

## Before First Power-On

1. Insert a charged 18650 cell, or power via USB-C through the TP4056 module.
2. Do not connect an antenna to the radio yet for the very first boot check (keeps any accidental TX off-air during testing is not possible - the firmware will still transmit). Prefer testing with a dummy load or a 17.3 cm wire in an isolated spot.
3. Open a serial monitor at 115200 baud, 8N1 to watch the boot log.

## Expected Boot Sequence

```text
[       5][INFO ] Boot #1  reset_reason=1  heap=290244 B  cpu=240MHz
[      22][BAT  ] Boot battery: 87%  4100mV  charging=NO
[      40][OK   ] OLED ready - SSD1309 128x64
[      42][AUDIO] LEDC GPIO25 (DAC1) ch0 @ 40000 Hz 8-bit
[      45][GPS  ] GPS disabled (or waiting for fix)
[  12410][MODE ] Starting: BEACON
```

On the OLED you should see the inverted `AEGIS-BEACON v5.4` header, the battery icon, and the BEACON layout with a large frequency.

## First Transmission

1. Set the device in an open area away from people.
2. It transmits the configured message on each frequency, then deep-sleeps for the configured interval (default 10 s).
3. Watch the TX progress bar and the scrolling payload on the OLED.
4. On the serial console you should see `TX: "SOS" (3 chars) @ 13WPM` then `TX done` and `Deep sleep 10 s...`.

## Hearing It Yourself

To confirm the RF path without a second radio, tune any AM-capable receiver or SDR to 433.500 MHz and listen for the CW carrier keying. You do not need special equipment - an RTL-SDR dongle with SDR# shows the carrier blips visually. See [SDR Listening Guide](/wiki/sdr-listening-guide).

## First-Time Checklist

| Check | Expected result |
|-------|-----------------|
| Boot screen | AEGIS-BEACON v5.4 + battery icon |
| Battery % | Matches a fresh cell (80-100%) |
| Serial log | No `[ERROR]`, no SX1262 init failure |
| First TX | Progress bar runs, payload scrolls |
| Deep sleep | OLED blanks, current drops to ~10 uA |
| Wake | Beacon transmits again after the interval |

> [!WARNING]
> If the serial log shows `[ERROR] SX1262 TX init FAILED`, stop and check the radio wiring first - especially the BUSY pin on GPIO 21. See [RF Troubleshooting](/wiki/troubleshooting-rf).

## Related Pages

- [Quick Start](/wiki/quick-start-guide)
- [Build Configurations](/wiki/build-configurations)
- [Boot Process](/wiki/boot-process)
- [Upload and Monitor](/wiki/upload-and-monitor)
