---
title: "Morse Practice"
description: "Exercises for copying the beacon's payload by ear and with software"
---

# Morse Practice

## Overview

Reading the beacon's Morse in an emergency is a perishable skill. Ten minutes of practice a week keeps SOS, the name field and the digits recognizable under stress.

## Why Practice

| Situation | Skill needed |
|-----------|--------------|
| Verify your own beacon | Copy SOS + name |
| Decode a partner's payload | Copy name + PSN coordinates |
| Field verification with SDR | Compare waterfall to your copy |
| Helping a rescuer | Read coordinates aloud correctly |

## Exercise 1: Digits Only

1. Configure the payload to `PSN N4553 E01230` (GPS only).
2. Let the beacon transmit on a bench.
3. Copy the digits onto paper.
4. Check against the configured value.

Digits are the hardest part: five elements each, easy to confuse. Do this until `N4553 E01230` is automatic.

## Exercise 2: Name Field

1. Set `namen` true with your own first and last name.
2. Transmit and copy the `DE [NAME]` segment.
3. Increase WPM in steps (13, then 18, then 25) as you improve.

## Exercise 3: Full Payload Under Time Pressure

1. Set the full payload.
2. Give yourself one transmission to copy name and coordinates.
3. Compare with the truth.
4. Repeat until one-shot copy is reliable.

## Tools

- [Morse Decoder Tools](/wiki/morse-decoder-tools) for software checks.
- [Reading CW by Ear](/wiki/reading-cw-by-ear) for ear training methods.
- The [Morse Code Engine](/wiki/morse-code-engine) reference for timing details.

## Related Pages

- [Reading CW by Ear](/wiki/reading-cw-by-ear)
- [Morse Decoder Tools](/wiki/morse-decoder-tools)
- [GPS Integration](/wiki/gps-integration)
- [Configuration Reference](/wiki/configuration-reference)
