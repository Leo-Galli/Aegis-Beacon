---
title: The Watchdog
description: How the hardware watchdog prevents hangs, the 30-second window, and why the firmware must feed it during long TX.
---

# The Watchdog

The beacon is a life-safety device: it must not hang. The hardware watchdog is the last line of defense against a stuck loop.

## What it does

The ESP32's Task Watchdog Timer (TWDT) resets the chip if the main task stops feeding it for a set time. The firmware arms a 30-second window and calls `esp_task_wdt_reset()` every loop iteration.

## Why 30 seconds

- Long enough that a legitimate slow operation (GPS wait, radio calibration) never trips it.
- Short enough that a hang is detected and recovered within half a minute.
- In deep sleep the watchdog is not fed and must be disarmed or ignored: the chip is in a powered-down state where the WDT would otherwise reset it on wake. The firmware handles the sleep path correctly.

## What happens on a trip

The chip resets. RTC RAM state (mode, counters, GPS cache) survives, so the beacon reboots into the same mode. The boot log shows the reset reason (`[RESET] watchdog`), which is the diagnostic clue.

## Where hangs actually happen

In practice, the watchdog catches:

- A stuck RadioLib call (e.g. BUSY never clears - which is why BUSY wiring matters).
- An infinite loop in a mode handler.
- A corrupted NVS causing a re-read loop.

## Debugging a reset loop

If the beacon resets every ~30 s:

1. Check the serial log for where it stops each time.
2. If it stops in radio init: check the BUSY pin.
3. If it stops in GPS: check the UART wiring.
4. If it loops in the dashboard: check WiFi init.

## The fail-safe chain

1. NVS fail-safe: defaults on corrupt config.
2. Watchdog: reset on hang.
3. Emergency flag: reboot into EMERGENCY if it was set.
4. Factory reset: manual recovery path.

The design intent: no single software failure should leave the beacon silent forever.