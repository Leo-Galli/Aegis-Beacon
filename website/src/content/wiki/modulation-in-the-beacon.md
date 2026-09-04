---
title: "Modulation in the Beacon"
description: "How the SX1262 produces Morse: FSK carrier keying, the RadioLib calls and receiver behaviour"
---

# Modulation in the Beacon

## Overview

A Morse beacon is just a carrier that turns on and off. This page explains exactly how the SX1262 does that with RadioLib, since the SX1262 has no OOK mode.

## The Keying Mechanism

```cpp
radio.transmitDirect();  // carrier ON (Morse element begins)
// ... hold for dot or dash duration ...
radio.standby();         // carrier OFF (element ends)
```

`transmitDirect()` streams a raw FSK carrier; `standby()` silences it. Alternating between them produces clean on/off keying - CW.

## What a Receiver Sees

| Receiver type | Result |
|---------------|--------|
| AM demodulator | Audible Morse |
| WFM demodulator | Little or nothing (no deviation) |
| SDR waterfall | Carrier blips appearing/disappearing |

## Frequency Stability

The E22 module's TCXO keeps the carrier within +-1 ppm, so the frequency does not drift during a long payload. A plain crystal module would drift noticeably.

## Why Not LoRa or FSK Packets

The design goal is that ANY receiver can hear the distress call. Raw CW is the lowest common denominator - no protocol, no synchronization, just Morse that a human or any AM radio can copy. LoRa or packet modes would need matching equipment on the rescue side.

## Related Pages

- [E22 Radio Module Guide](/wiki/e22-radio-module-guide)
- [RF Basics for the Beacon](/wiki/rf-basics)
- [Morse Code Engine](/wiki/morse-code-engine)
- [Receiver Compatibility](/wiki/receiver-compatibility)
