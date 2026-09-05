---
title: Boot Loop Troubleshooting
description: "The beacon that restarts endlessly: brownouts, watchdog resets, flash corruption, and how to catch the loop in the act."
---

# Boot Loop Troubleshooting

A beacon that reboots forever looks dead and is often one measurement from fixed. This page is the boot-loop isolation sequence.

## The loop types

| Pattern | Likely cause |
| --- | --- |
| Rebooting during TX bursts | Power sag (see [Battery Troubleshooting](battery-troubleshooting)) |
| Rebooting on a schedule | Watchdog timeout: firmware bug (see [Firmware Watchdog](firmware-watchdog)) |
| Rebooting at random | Brownout detection, or marginal power |
| Rebooting after flashing | Flash corruption or wrong partition table |

## Catch it in the act

1. Connect the serial monitor before power-on (see [Serial Debug System](serial-debug-system)).
2. Power on and watch the boot log.
3. The last line before the reset names the cause: "Brownout detector was triggered", "Watchdog timer expired", "Guru Meditation Error", or a clean reset with no message.

## Brownout

The ESP32 has a built-in brownout detector that resets the chip when the supply dips. A "Brownout detector was triggered" line means the 3.3 V rail collapsed, almost always from the TX burst on a weak cell or a thin supply wire. Fixes: fresh cell, thicker power wires, decoupling capacitor at the board input.

## Watchdog

"Task watchdog got triggered" or a reset at a fixed interval means a firmware loop overran its window. This is a firmware bug: update to the latest firmware and report the scenario (see [Contributing](contributing)).

## Flash corruption

Resets immediately after a flash, or "invalid header" lines, mean the flash contents are wrong. Reflash completely (erase first), then factory-reset the configuration (see [Factory Reset and Recovery](factory-reset-and-recovery)).

## The last-resort loop

If the beacon loops too fast to flash, hold BOOT while connecting so it stays in flash mode, erase the flash, and flash fresh. See [Flash Troubleshooting](flash-troubleshooting) for the mode entry.

## Related pages

- [No Boot Troubleshooting](no-boot-troubleshooting) for the no-boot case
- [Firmware Watchdog](firmware-watchdog) for the watchdog
- [Battery Troubleshooting](battery-troubleshooting) for the sag case