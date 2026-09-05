---
title: Flash Troubleshooting
description: "Diagnosing firmware flashing problems: no serial port, connection failures, wrong board, and the recovery paths."
---

# Flash Troubleshooting

Flashing is the one step every builder hits first, and the one with the least friendly errors. This page maps the common messages to their causes.

## The error map

| Error | Likely cause |
| --- | --- |
| "No serial port found" | Driver missing, or wrong cable |
| "Connecting... ____" (hang) | Board not in flash mode, or bad USB connection |
| "A fatal error occurred" | Wrong board/port settings, or a locked flash |
| "Timed out waiting for packet header" | The board's UART not responding: hold BOOT while resetting |
| "Failed to connect" on clone boards | Clone-specific chip or wrong flash mode |

## The cable problem

Many "USB cables" are charge-only: they power the board but carry no data. Symptoms: the port enumerates or not, and flashing randomly fails. Test with a known data cable before anything else. The [ESP32 USB Chips](esp32-usb-chips) page covers the onboard UART chips.

## Getting the board into flash mode

Most ESP32 boards: hold BOOT, press EN, release BOOT, then start the flash. This is the single most common fix for the "Connecting..." hang.

## The clone situation

Cheap clones (see [Board Variants and Clones](board-variants-and-clones)) use different UART chips and sometimes non-standard flash settings. If a board refuses to flash with the standard settings, try: a different flash mode (DIO vs QIO), a lower baud rate, and the clone-specific board definition.

## Recovery paths

| Situation | Path |
| --- | --- |
| Bricked by a bad flash | Re-enter flash mode and reflash; the bootloader survives unless erased |
| Flash locked | `esptool` with the correct chip and the unlock sequence |
| NVS corrupt after reflash | Factory reset from the firmware (see [Factory Reset and Recovery](factory-reset-and-recovery)) |

## Related pages

- [ESP32 USB Chips](esp32-usb-chips) for the onboard UART
- [Software Build Process](software-build-process) for the build steps
- [Upload and Monitor](upload-and-monitor) for the serial side