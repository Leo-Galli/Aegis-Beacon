---
title: "Benchmark Demo Mode"
description: "Run the full beacon UI and Morse timing on a bench rig without a radio, battery divider or GPS receiver, using the BENCHMARK_DEMO compile flag"
---

# Benchmark Demo Mode

`BENCHMARK_DEMO` is a compile-time flag that runs the complete beacon firmware — every screen, the Morse timing engine, the buttons, the audio feedback and the watchdog — on a bench board whose radio module, battery divider and GPS receiver are **not connected**. It exists so the repository's benchmark workflows can measure the real firmware behavior on hardware that has only the ESP32, a display and the buttons.

## Enable it

Pass the define at build time:

```bash
# PlatformIO
PLATFORMIO_BUILD_FLAGS="-D BENCHMARK_DEMO=1" pio run -e esp32dev

# Arduino IDE / arduino-cli
# Sketch > Add .ZIP Library is not needed; add to build flags:
#   -DBENCHMARK_DEMO=1
```

Or flip the default in the source:

```cpp
#define BENCHMARK_DEMO 1
```

> Warning: never flash a `BENCHMARK_DEMO` build onto a rescue device. It will not transmit and it will not read the battery.

## What it disables

Each subsystem is gated at its entry point, so the rest of the firmware is untouched:

| Subsystem | Without the flag | With `BENCHMARK_DEMO=1` |
|---|---|---|
| SX1262 radio | `ensureSpiStarted()` + `radio.beginFSK()` on every TX/RX init | Both init functions return success immediately; no SPI traffic to the module |
| Carrier keying | `txOn()` / `txOff()` call `radio.transmitDirect()` / `radio.standby()` | Both become empty stubs; the Morse engine still waits the exact dot and dash durations, so per-message timing matches a real TX |
| RSSI sampling | `radio.getRSSI()` every 20 ms (SCAN) or 5 ms (LISTEN) | A virtual noise floor of -120 dBm; the scan and decode pipelines run against it |
| RX state | `radio.startReceive()` before each dwell | Skipped |
| Radio sleep | `radio.sleep()` / `radio.standby()` at mode exits | Skipped |
| Battery | `analogReadMilliVolts()` on GPIO 36 every 5 s, low-battery warning at 3550 mV | `readBatteryMv()` returns 0 and marks the reading invalid; no ADC access, no low-battery blink, no `AEGIS:BATT:low` line |
| GPS | `gpsSerial.begin()` at boot and `gps.encode()` in every loop | The UART is never opened and NMEA is never parsed; the cached fix stays whatever it was |
| Deep sleep | `esp_deep_sleep()` after each beacon cycle | Replaced by an idle loop that keeps the remaining-time screen up, so a measurement session can run back to back |

The watchdog, buttons, display rendering, CW timing model and serial bridge all keep running — they are what a benchmark measures.

## What it does not change

- The UI is identical: the same splash, the same screens, the same battery glyph (rendered from the invalid reading), the same RSSI trace at the noise floor.
- Morse timing is exact: `txOn()`/`txOff()` stubs preserve the `delay()` structure, so TX cycles take the same wall-clock time as a transmitting unit.
- The dashboard and serial protocol behave the same; `AEGIS:STATE` reports the demo build through its normal fields.
- Flash footprint barely changes (roughly 1 percent smaller on core 3.x), because the flag removes call sites rather than features.

## Related

- [Firmware Overview](firmware-overview) - where each gate sits
- [Build Configurations](build-configurations) - the three practical hardware builds
- [Serial Debug System](serial-debug-system) - reading `AEGIS:STATE` on a demo rig
