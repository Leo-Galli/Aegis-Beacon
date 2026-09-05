---
title: "Morse Timing Reference"
description: "Every unit, dot, dash and gap in milliseconds across the common WPM settings this beacon uses"
---

# Morse Timing Reference

## Overview

This page is a quick numeric reference for Morse timing. It is derived from the PARIS-standard timing the firmware uses, where one word "PARIS" equals exactly 50 units and the unit length is 1200 / WPM milliseconds.

Use it to estimate how long a transmission will take, or to verify what you hear against the expected dot and dash lengths.

## Formula

```
unit_ms = 1200 / WPM

DOT                 = 1 unit
DASH                = 3 units
intra-char gap      = 1 unit
inter-char gap      = 3 units
word gap            = 7 units
```

Word gap is the silence between words, not the gap after the last symbol of a word.

## Timing at Common Speeds

| WPM | unit (ms) | dot (ms) | dash (ms) | intra-char gap (ms) | inter-char gap (ms) | word gap (ms) |
|---|---|---|---|---|---|---|
| 5 | 240 | 240 | 720 | 240 | 720 | 1680 |
| 10 | 120 | 120 | 360 | 120 | 360 | 840 |
| 13 | 92 | 92 | 277 | 92 | 277 | 646 |
| 15 | 80 | 80 | 240 | 80 | 240 | 560 |
| 20 | 60 | 60 | 180 | 60 | 180 | 420 |
| 25 | 48 | 48 | 144 | 48 | 144 | 336 |
| 30 | 40 | 40 | 120 | 40 | 120 | 280 |
| 40 | 30 | 30 | 90 | 30 | 90 | 210 |

Round to the nearest millisecond where the division is not exact. The firmware works in integer milliseconds.

## "PARIS" at 13 WPM

PARIS as a string is P A R I S. Using the standard Morse:

- P: .--.
- A: .-
- R: .-.
- I: ..
- S: ...

Counting units:

- P: dot + intra + dash + intra + dash + intra + dot + inter = 1 + 1 + 3 + 1 + 3 + 1 + 1 + 3 = 14 units.
- A: dot + intra + dash + inter = 1 + 1 + 3 + 3 = 8 units.
- R: dot + intra + dash + intra + dot + inter = 1 + 1 + 3 + 1 + 1 + 3 = 10 units.
- I: dot + intra + dot + inter = 1 + 1 + 1 + 3 = 6 units.
- S: dot + intra + dot + intra + dot + inter = 1 + 1 + 1 + 1 + 1 + 3 = 8 units.

Total = 14 + 8 + 10 + 6 + 8 = 46 units of symbol and intra/inter gaps, plus the word gap after PARIS if another word follows. The definition of PARIS-standard is that the word PARIS plus the word gap equals 50 units, so the word gap here is 4 units? No — the convention is that PARIS itself is 50 units including the word gap that would follow it. The exact accounting varies by implementation; the firmware uses 50 units per word with the standard dot/dash/gap ratios above.

## Transmission Time Estimates

For a payload of N characters including spaces, a rough estimate is:

```
chars_units ≈ N * average_char_units
total_units  = chars_units + word_gaps
total_ms     = total_units * unit_ms
```

Average character length is around 3 to 4 units for English text in Morse, depending on the mix of short and long letters.

Example: "SOS DE MARIO ROSSI" is 18 characters including spaces. At 13 WPM, unit = 92 ms, and a rough average of 3.5 units per character gives about 63 units for the characters plus a couple of word gaps. That is roughly 65 units * 92 ms ≈ 6 seconds for one transmission, before repeats.

## How This Relates to the Beacon

The beacon transmits the payload as Morse, so the TX time for each beacon cycle is driven by the payload length and the WPM setting. Lower WPM means longer dots and dashes and longer total transmission time. Higher repeat count multiplies that time.

If battery life matters, shorten the payload and consider a higher WPM. If copyability matters, a lower WPM is easier to copy by ear.

## Related Pages

- [Morse Code Engine](/wiki/morse-code-engine) — the implementation behind these timings.
- [CONFIG Payload Format](/wiki/config-payload-format) — what is being timed.
- [Configuration Reference](/wiki/configuration-reference) — the WPM range and default.
