---
title: Firmware Wake Sources
description: "The ESP32 wake sources used by the beacon: RTC timer, GPIO buttons, and how the firmware distinguishes them."
---

# Firmware Wake Sources

The ESP32 can wake from deep sleep in several ways. The beacon uses two of them, and the firmware must tell them apart at boot.

## Wake sources in use

| Source | Hardware | Purpose |
| --- | --- | --- |
| RTC timer | Internal | Scheduled beacon burst |
| GPIO | MODE button | User wakes the device to change settings |

## RTC timer wake

The timer is programmed before sleep with the duration of the sleep interval. It is the primary wake source during normal beacon operation. Accuracy is a few seconds over hours, which is fine for a beacon.

## GPIO wake

The MODE button is wired to an RTC-capable GPIO. Pressing it while the device sleeps wakes it into CONFIG mode so the user can adjust settings without waiting for the next burst. The button must be wired with a pull resistor and connected to a pin the ESP32 allows for RTC GPIO wake (most boards: GPIO 0, 2, 4, 12-15, 25-27, 32-39).

## Distinguishing wake causes

At boot, `esp_sleep_get_wakeup_cause()` returns the reason:

| Cause | Action |
| --- | --- |
| RTC timer | Resume the beacon cycle |
| GPIO | Enter CONFIG mode |
| Power-on / reset | Full boot sequence with splash screen |

## Debounce and re-sleep

A GPIO wake is debounced in firmware before the display turns on, because a glitch on the button line would otherwise light the OLED for no reason. If no button press is confirmed within 5 seconds, the device returns to deep sleep.

## Related pages

- [Firmware Deep Sleep](firmware-deep-sleep) for the sleep side
- [Firmware Buttons](firmware-buttons) for the input handling
- [Boot Process](boot-process) for the full boot sequence