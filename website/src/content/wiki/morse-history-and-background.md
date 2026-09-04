---
title: "Morse Code Background"
description: "Why Morse survives: history, the PARIS standard, and why it still fits a rescue beacon"
---

# Morse Code Background

## Overview

Morse code is nearly 200 years old and still the right choice for a rescue beacon. This page explains why, and the standard the firmware implements.

## Why Morse Still Fits

| Requirement | How Morse delivers |
|-------------|--------------------|
| Lowest common denominator | Decodable by ear or any AM radio |
| No protocol needed | No sync, no handshake, no decoder |
| Robust at low SNR | Human brain integrates weak signals |
| Short messages | SOS is 9 elements - seconds on air |

## The PARIS Standard

Timing is calibrated so the word "PARIS" takes exactly 50 units:

- Unit = `1200 / WPM` ms.
- At 13 WPM a unit is 92 ms.

| Element | Units |
|---------|-------|
| Dot | 1 |
| Dash | 3 |
| Intra-char gap | 1 |
| Inter-char gap | 3 |
| Word gap | 7 |

## Pros and Cons vs Digital Modes

| Aspect | CW Morse | Digital packet |
|--------|----------|----------------|
| Equipment needed | Any AM radio | Matching decoder |
| Human readable | Yes | No |
| Robustness | Excellent | Good with FEC |
| Battery cost | Minimal | Similar at low rate |

## Related Pages

- [Morse Code Engine](/wiki/morse-code-engine)
- [Morse Practice](/wiki/morse-practice)
- [Reading CW by Ear](/wiki/reading-cw-by-ear)
- [Morse Abbreviations and Prosigns](/wiki/morse-abbreviations-and-prosigns)
