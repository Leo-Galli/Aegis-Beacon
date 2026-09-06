---
title: Morse Listening Workflow
description: "How to listen to the beacon's Morse in the field: tuning in, reading the payload, and turning copy into a position."
---

# Morse Listening Workflow

The beacon transmits its identity and position in Morse. Listening is how you confirm you have the right signal, read the coordinates, and home in. This page is the field routine.

## 1. Get on frequency

SEARCH mode sweeps the configured frequencies and alerts on activity. When you hear a tone, note the frequency from the display. You can also set a specific frequency over serial with `FREQ 433.500` (see [Frequency Setting over Serial](frequency-setting-over-serial)).

## 2. Know the payload shape

```
SOS DE <NAME> PSN <LAT> <LON>
```

| Part | Example | Meaning |
| --- | --- | --- |
| SOS | `SOS` | Distress |
| DE | `DE` | "from" |
| Name | `MARCO` | Operator name (if enabled) |
| PSN | `PSN` | "position" |
| LAT / LON | `N4553 E01230` | DDM: 45.53 N, 12.30 E |

The coordinates use DDM with the decimal point implied: `N4553` is 45 degrees 53 minutes north, `E01230` is 12 degrees 30 minutes east. See [Coordinate Conversion](coordinate-conversion).

## 3. Copy on paper

Write the payload as you hear it, symbol by symbol. Two people is better than one: one reads, one writes. If a symbol is lost, keep the rhythm going and mark the gap; a partial payload still narrows the search.

## 4. Confirm and convert

- Confirm the name matches the subject you expect.
- Convert DDM to decimal for the map: `N4553 E01230` becomes `45.8833 N, 12.5000 E`.
- The [Report Position Page](report-position-page) does this for you automatically when the bridge is connected.

## 5. Log it

Record frequency, time, and the exact payload in the [Beacon Log Template](beacon-log-template). The same payload is what the device puts in its `AEGIS:POS:` line, so the serial log and your paper copy should match.

## Practice

Get fast at symbols before the field. See [Morse Keying Practice](morse-keying-practice) and the [Morse Audio Cheat Sheet](morse-audio-cheat-sheet).

## Related

- [Homing with the Serial Bridge](homing-with-bridge)
- [Position Reporting](position-reporting)
- [Signal Reporting Conventions](signal-reporting-conventions)