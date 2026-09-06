---
title: Repeater Position Reporting
description: "Send and receive beacon positions through repeater and relay networks, and the limits the SX1262 puts on tone access."
---

# Repeater Position Reporting

Repeaters extend range but add rules. The beacon's SX1262 radio can transmit on channels inside 410-525 MHz, which includes many PMR and UHF repeaters, with important caveats.

## What the beacon can and cannot do

- **Can**: transmit CW on any frequency in 410-525 MHz, including repeater outputs.
- **Cannot**: generate CTCSS sub-audio tones. Channels that require a tone (many repeaters, and safety channels like Radio Montana at 85.4 Hz) will not key the repeater. See [Frequency Compatibility](frequency-compatibility).
- **Cannot**: receive through repeaters in SEARCH mode beyond detecting the repeater's own output; SEARCH listens, it does not decode.

## The practical workflow

1. Put the beacon on the repeater **output** frequency (the one you can hear) so a listener on the channel hears the Morse directly: `FREQ 433.500` over serial.
2. Have the receiving station copy the payload and relay the coordinates by voice, or log them with the [bridge](serial-bridge-guide).
3. For tone-protected channels, use a separate radio with CTCSS to reach the repeater, and the beacon only as the position source.

## Legal notes

Transmitting on repeater channels is usually allowed for licensed operators only, and emergency use has specific exceptions. Read [Emergency Use Legal](emergency-use-legal) and the [Regulatory Compliance](regulatory-compliance) page before using repeater channels.

## Related

- [Repeater Beacon](repeater-beacon)
- [Frequency Compatibility](frequency-compatibility)
- [Repeaters Map](/repeaters) on the website