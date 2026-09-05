---
title: The TX Cycle in Detail
description: "What happens during one BEACON transmission cycle: frequency iteration, Morse keying, timing, and sleep."
---

# The TX Cycle in Detail

One BEACON cycle is: build payload, transmit on every frequency, then sleep. This page follows a single cycle end to end.

## The cycle steps

1. Wake from deep sleep (or start).
2. Load config from RTC RAM / globals.
3. Disable WiFi and Bluetooth (saves ~120 mA).
4. Read battery and update the OLED header.
5. Build the payload string.
6. For each configured frequency:
   a. Tune the SX1262.
   b. Key the carrier (CW mode).
   c. Send the payload in Morse (repeated N times).
   d. Unkey and pause.
7. Log TX counters to RTC RAM.
8. Enter deep sleep for the configured interval.

## Frequency iteration

The beacon holds a list of up to 10 frequencies. The dashboard manages this list (add/remove). Each frequency gets the full payload; repeat count multiplies the payload per frequency.

## Morse keying on the SX1262

The firmware uses RadioLib's FSK mode with direct carrier keying: `transmitDirect()` turns the carrier on, `standby()` turns it off. The Morse engine times these toggles per the WPM setting. This produces true CW - a pure carrier switched on and off - which any AM receiver or SDR can hear.

## Timing math

At WPM w, the dot length is `1200/w` ms. At 13 WPM: dot 92 ms, dash 277 ms, intra-char gap 92 ms, inter-char gap 277 ms, word gap 645 ms. The Morse timing reference has the full table.

## TX power per mode

| Mode | Power |
|------|-------|
| BEACON | Configurable (-9 to +22 dBm, default +17) |
| EMERGENCY | Forced +22 dBm |

## Interrupt handling during TX

The MODE button interrupts TX mid-symbol and switches mode. The firmware checks the interrupt flag between symbols, not mid-symbol, so the Morse stream stays valid.

## Deep sleep

After the cycle, `esp_deep_sleep_start()` with a timer wake at the sleep interval. Current drops to ~10 uA. RTC RAM preserves: mode, TX counter, scan hits, GPS fix cache, emergency flag.

## Cycle duration example

SOS at 13 WPM ≈ 2.7 s per frequency. Three frequencies × 1 repeat ≈ 8-10 s of TX, then 10 s sleep: roughly a 50% duty cycle at defaults (see the duty cycle page for why that matters legally).