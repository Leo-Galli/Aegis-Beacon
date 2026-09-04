---
title: "Morse Abbreviations and Prosigns"
description: "What DE, PSN and other Morse shorthand mean in the beacon payload"
---

# Morse Abbreviations and Prosigns

## Overview

The beacon uses amateur-radio style Morse shorthand so payloads stay short: shorter transmissions use less battery and are faster to copy.

## Terms in the Payload

| Term | Full form | Meaning |
|------|-----------|---------|
| `DE` | from | Introduces the sender's name |
| `PSN` | position | Coordinates follow |
| `SOS` | distress | Emergency signal |
| `UNKN` | unknown | No position available |

## How They Appear

| Payload | Reads as |
|---------|----------|
| `SOS DE MARIO ROSSI` | Distress from Mario Rossi |
| `SOS PSN N4553 E01230` | Distress, position 45N 53, 12E 30 |
| `SOS DE MARIO ROSSI PSN N4553 E01230` | Full form |

## Why Shorthand

| Reason | Effect |
|--------|--------|
| Shorter payload | Less TX time, less battery |
| Faster to copy | Fewer characters to mishear |
| Standard terms | Rescuers know DE and PSN |

## Reading Practice

- `DE` is two characters: `-..` `.`
- `PSN` is three: `.--.` `...` `-.`
- Say them as "from" and "position" when copying aloud.

## Related Pages

- [Morse Code Engine](/wiki/morse-code-engine)
- [Reading CW by Ear](/wiki/reading-cw-by-ear)
- [GPS Integration](/wiki/gps-integration)
- [Morse Practice](/wiki/morse-practice)
