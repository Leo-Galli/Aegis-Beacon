---
title: "LISTEN Mode"
description: "Operating the LISTEN mode: real-time Morse CW decoding on the OLED, live audio pitch and the serial AEGIS:CW stream"
---

# LISTEN Mode

LISTEN is the receiving counterpart of BEACON. The radio stays on one frequency and decodes Morse code as it arrives, showing the decoded text live on the OLED and streaming every character over USB serial.

## How to enter

- **Serial**: `MODE LISTEN` (persisted as the boot mode via `cfg.lastMode`, like BEACON and SEARCH).
- The device reboots into LISTEN and starts listening on the first configured frequency (`freqs[0]`).

## Screen layout

| Row | Content |
|-----|---------|
| Header | `RX LISTEN` + pulsing antenna glyph + decoded character count |
| Line 1 | Frequency (e.g. `433.500 MHz`) + battery glyph |
| Trace | RSSI history strip-chart (120 samples) with threshold tick |
| Readout | `RSSI <val>dBm  THR <val>dBm` |
| Text area | The last 42 decoded characters, two lines of 21 |

The antenna glyph pulses while listening. Every decoded character increments the header counter and blinks the blue LED.

## Audio

The same variable-pitch search tone as SEARCH mode is active: the louder the signal, the higher the pitch (440-2200 Hz mapped from `rssiThreshold` to -40 dBm). This makes it easy to tune in to a beacon by ear before the decoder locks the text.

## Decoding behavior

- The decoder uses the PARIS timing model: unit = 1200 / WPM ms, using the configured WPM. Dots are marks of at most 2 units, dashes longer.
- A gap of at least 3 units ends a character; a gap of at least 7 units adds a space between words.
- Unknown symbol combinations are ignored (the symbol buffer resets).
- The text window scrolls one word at a time when the 96-character buffer fills.
- In noise, occasional false characters are possible: the threshold and the configured WPM directly trade sensitivity for decoding stability.

## Controls

| Button | Action |
|--------|--------|
| MODE short | Return to BEACON (persisted) |
| MODE long (2 s) | Enter EMERGENCY |
| SEL short | Toggle the adjustment target (VOL / WPM) |
| SEL long (3 s) | Enter CONFIG mode |
| UP / DN | Adjust the selected parameter live |

## Serial output

Every decoded character is printed as its own line, machine-readable and plain:

```
AEGIS:CW:S
AEGIS:CW:O
AEGIS:CW:S
AEGIS:CW:
```

The trailing space line marks a word gap (only when a space is actually inserted). Use the [Serial Bridge](serial-bridge-guide) or any terminal to log a full decode session.

## Use cases

- Verifying your own beacon: transmit with a second unit and read the payload text back.
- Homing practice: decode the caller's position string instead of only using RSSI.
- Field checks: confirm another operator's CW payload without an SDR.