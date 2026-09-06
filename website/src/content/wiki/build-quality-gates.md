---
title: Build Quality Gates
description: The measurable checkpoints that catch faults at the stage boundary instead of after the enclosure is sealed.
---

# Build Quality Gates

A quality gate is a measurement you take at the end of each build stage. It is the difference between "I think it is wired right" and "I know it is wired right". Run every gate; the full sequence takes under five minutes per stage.

## Gate 1: Power path

Measure with the cell inserted and the ESP32 connected:

| Measurement | Where | Expected |
|-------------|-------|----------|
| Rail voltage | 3V3 pin to GND | 3.2-3.4 V |
| Divider wiper | GPIO 36 to GND | 1.6-2.1 V (half of cell) |
| Standby current | In series with the cell | Under 50 mA with the ESP32 awake |
| Cell voltage | BAT+ to GND | 3.0-4.2 V |

A rail below 3.0 V with a charged cell means a short or a bad TP4056 solder joint. Fix it before touching anything else: every later stage depends on this rail.

## Gate 2: Display

- Boot screen appears and stays stable (no flicker, no garbage columns).
- Battery icon shows a percentage within 10 points of a multimeter reading on BAT+.
- Pressing UP and DN shows the adjustment overlay for the selected target.

A stable but garbled display usually means the DC (data/command) line is swapped with CS, or the RES pin is floating.

## Gate 3: Radio

- Boot into BEACON without hanging. A hang on the first radio call is BUSY wiring, almost always.
- With an antenna connected and a receiver nearby, the Morse payload is heard.
- Supply current rises by at least 80 mA during TX and drops after.
- SEARCH mode shows an RSSI bar that moves when you key another radio nearby.

## Gate 4: Controls and status

- MODE toggles BEACON and SEARCH. Long-press activates EMERGENCY, short-press again returns.
- SEL toggles the VOL and WPM target; UP and DN change the selected value.
- Holding SEL for 3 seconds starts the config portal (SSID `AegisBeacon` appears on a phone).
- Red LED lights in BEACON, blue in SEARCH.

## Gate 5: Audio

- In BEACON, a 600 Hz click stream is heard in headphones, in sync with TX.
- In SEARCH, the pitch rises as RSSI increases.
- At silence there is no click or pop: the DAC parks at mid-rail. A pop on every transition points to a missing 10 uF AC-coupling cap.

## Gate 6: GPS

- Outdoors, a fix appears within 3 minutes on a cold start, faster after.
- The Morse payload contains `PSN` coordinates matching the real location within ~200 m.
- The fix survives a deep-sleep cycle: the cached coordinates are retransmitted.

## Gate 7: Enclosure and field

- Everything fits without forcing: cables are not pinched by the lid.
- The antenna exits vertically and is at least 2 cm from the battery.
- The buttons click through the case without sticking.
- The device boots, beacons, and scans with the case fully closed.

## Log the gates

Keep a one-line entry per gate in a build log: date, gate, measured values, pass or fail. When a device misbehaves in the field, the log tells you which measurement drifted and where to look first. See the [Beacon Log Template](/wiki/beacon-log-template) for a ready-made sheet.

## Related pages

- [Bench Checklist](/wiki/bench-checklist)
- [Two-Beacon Bench Test](/wiki/two-beacon-bench-test)
- [First Power-On Protocol](/wiki/first-power-on-protocol)