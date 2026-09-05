---
title: Morse Letter Table
description: The full Morse code table for letters and digits, with the patterns the beacon transmits.
---

# Morse Letter Table

The complete Morse table for the characters the beacon can transmit: A-Z and 0-9, per the payload restriction documented in [Config Payload Format](config-payload-format).

## Letters

| A .- | B -... | C -.-. | D -.. | E . |
| F ..-. | G --. | H .... | I .. | J .--- |
| K -.- | L .-.. | M -- | N -. | O --- |
| P .--. | Q --.- | R .-. | S ... | T - |
| U ..- | V ...- | W .-- | X -..- | Y -.-- | Z --.. |

## Digits

| 0 ----- | 1 .---- | 2 ..--- | 3 ...-- | 4 ....- |
| 5 ..... | 6 -.... | 7 --... | 8 ---.. | 9 ----. |

## The pattern families

The table is easier to learn in families:

- E (. ), I (.. ), S (...), H (....): the dot ladder
- T (-), M (--), O (---): the dash ladder
- Digits: 1-5 add dots, 6-0 add dashes, in sequence

## The beacon's characters

The payload uses letters, digits, spaces and the slash prosign `-..-.` for separators like `DE`. Everything the beacon transmits comes from this table (see [Morse Code Engine](morse-code-engine)).

## Related pages

- [Morse Numbers and Punctuation](morse-numbers-punctuation) for the rest
- [Morse Abbreviations and Prosigns](morse-abbreviations-and-prosigns) for the shorthand
- [Morse Timing Reference](morse-timing-reference) for the rhythm