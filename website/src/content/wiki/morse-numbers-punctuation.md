---
title: Morse Numbers and Punctuation
description: Morse for numbers, punctuation and the prosigns the beacon uses in its payload.
---

# Morse Numbers and Punctuation

The beacon's payload is restricted to letters and digits (see [Config Payload Format](config-payload-format)), but the receiving side of the world uses the full table. This page covers the characters that appear around the beacon's traffic.

## Numbers

| 0 ----- | 1 .---- | 2 ..--- | 3 ...-- | 4 ....- |
| 5 ..... | 6 -.... | 7 --... | 8 ---.. | 9 ----. |

Numbers appear in the payload as coordinates, and they are the reason the receiving side needs the digit table solid: `45.8325` is a long string of them.

## Punctuation (the useful set)

| Character | Code |
| --- | --- |
| Period (.) | .-.-.- |
| Comma (,) | --..-- |
| Slash (/) | -..-. |
| Question (?) | ..--.. |
| Space | Between words: 7 units |

The slash is the prosign the beacon uses in `SOS DE`-style messages when a separator is needed (see [Config Payload Format](config-payload-format)).

## Prosigns

| Prosign | Code | Meaning |
| --- | --- | --- |
| DE | -.. . | "from" (identity separator) |
| SOS | ... --- ... | Distress |
| AR | .-.-. | End of message |
| BT | -...- | Break |

## The frequency

Coordinates and identity dominate the payload, so the receiver's drill is: digits first, then the callsign letters, then the DE separator. [Morse Keying Practice](morse-keying-practice) has the training path.

## Related pages

- [Morse Letter Table](morse-letter-table) for the letters
- [Morse Abbreviations and Prosigns](morse-abbreviations-and-prosigns) for the full set
- [Morse Timing Reference](morse-timing-reference) for the gaps