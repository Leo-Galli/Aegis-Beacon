---
title: "Firmware CW Decoder"
description: "The internals of the LISTEN mode Morse decoder: sampling, mark and gap timing, symbol accumulation and the ITU table"
---

# Firmware CW Decoder

The CW decoder in LISTEN mode is a lightweight, state-machine implementation that needs no external libraries. It lives in the system-monitoring section of `AegisBeacon.ino` and is driven by `cwDecodeSample()`.

## Sampling loop

`runListenMode()` reads `radio.getRSSI()` every `CW_SAMPLE_MS` (5 ms). A sample counts as a **mark** when the RSSI is at or above `cfg.rssiThreshold`; anything below is a **gap**. The sample cadence is fixed, so the decoder measures time by counting samples: each tick adds `CW_SAMPLE_MS` to the current mark or gap duration.

## Timing model

The decoder assumes the transmitter uses the PARIS standard, which the beacon itself does (see [Morse Timing Reference](morse-timing-reference)):

| Element | Duration |
|---------|----------|
| Unit | 1200 / WPM ms |
| Dot | 1 unit |
| Dash | 3 units |
| Intra-character gap | 1 unit |
| Character gap | 3 units |
| Word gap | 7 units |

The configured `cfg.wpm` drives `unit`; the decoder clamps it to at least 20 ms so a very high WPM cannot produce degenerate timings.

## State machine

1. **Mark starts** (gap to mark edge): the accumulated gap is compared:
   - gap >= 7 units: flush the pending symbol, then insert a space;
   - gap >= 3 units: flush the pending symbol;
   - otherwise: same character continues.
2. **Mark ends** (mark to gap edge): the mark duration is classified:
   - mark <= 2 units: append a dot (`.`);
   - mark > 2 units: append a dash (`-`).
3. The symbol buffer is capped at `CW_MAX_SYMBOLS` (40); overflow resets the buffer.

## Character decode

When a symbol is flushed, `cwCharFromSymbols()` matches it against the full ITU table:

- Letters A-Z, digits 0-9;
- Punctuation: `.` `,` `?` `-` `"` `/` `!` `+` `=` `@` `$` `(` `)`.

Unknown symbols (for example a prosign not in the table) decode to nothing and the buffer resets, so the text window never shows garbage characters.

## Output

- `cwAppendChar()` inserts the character into the 96-character text buffer (`CW_TEXT_LEN`) shown on the OLED. When full, the buffer scrolls left by one word.
- Every non-space character increments the decoded counter, blinks the blue LED and prints `AEGIS:CW:<char>` over serial.
- Consecutive spaces are collapsed.

## Tuning advice

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Random characters in noise | Threshold too low | Raise `rssiThreshold` |
| Dots become dashes | WPM too high for the sender | Set `WPM` to the sender's speed |
| Text lags or misses characters | Signal fading below threshold | Lower threshold or improve antenna |

The decoder is a timing-based detector: it does not shape the signal, so a clean, stable carrier (as produced by the beacon's own `transmitDirect()` keying) decodes far better than an overdriven or distorted transmission.