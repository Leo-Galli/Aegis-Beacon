---
title: Firmware Error Codes
description: The error codes the firmware reports on the OLED and serial debug output, and what each one means.
---

# Firmware Error Codes

When something goes wrong, the firmware does not silently keep going. It reports a short code on the OLED status line and, in the debug build, a full message over serial.

## Reporting surface

| Surface | Format |
| --- | --- |
| OLED status line | `ERR <code>` |
| Serial (debug build) | `[ERR] <code>: <message>` |
| LED (if fitted) | 3 fast blinks before the code repeats |

## Code table

| Code | Meaning | Likely cause |
| --- | --- | --- |
| `E01` | Radio not responding | Wiring to the E22 module, or wrong SPI pins |
| `E02` | Radio calibration failed | Power glitch during boot, re-run calibration |
| `E03` | GPS UART timeout | GPS not powered or wrong pins |
| `E04` | NVS read error | Corrupt partition, run factory reset |
| `E05` | OLED I2C not found | SDA/SCL swapped, or address differs from 0x3C |
| `E06` | Configuration invalid | Blob version mismatch, defaults loaded |
| `E07` | Watchdog reset | A loop overran the 3-second watchdog window |
| `E08` | Low battery | Voltage below the configured cutoff, TX disabled |

## Recovery order

1. Read the code and check this table.
2. For `E01`, `E03`, `E05`: verify wiring before anything else.
3. For `E02`, `E04`, `E06`: a factory reset clears the store and recalibrates.
4. For `E07`: update the firmware; it indicates a firmware bug, not hardware.
5. For `E08`: charge or replace the cell, then reset.

## Non-fatal vs fatal

Most codes are non-fatal: the device keeps running with reduced function (for example, no GPS until `E03` clears). `E01` is fatal to beaconing because there is no radio. The OLED makes the distinction clear: fatal errors are shown continuously, transient ones clear after 10 seconds.

## Related pages

- [Troubleshooting](troubleshooting) for the general procedures
- [Firmware Watchdog](firmware-watchdog) for `E07`
- [Serial Debug System](serial-debug-system) for the debug build