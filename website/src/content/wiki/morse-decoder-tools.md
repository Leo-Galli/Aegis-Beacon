---
title: "Morse Decoder Tools"
description: "Decode the beacon payload with software, SDR plugins, or a plain phone app"
---

# Morse Decoder Tools

## Overview

You do not need to read Morse by ear to receive a payload. Several free tools decode the keying automatically - useful for verifying payloads on the bench and for confirming a real transmission contains the expected name and coordinates.

## Decoding Methods

| Method | Tool | Best for |
|--------|------|----------|
| SDR audio decode | SDR# plugin "CW decoder" or "Digital Voice" | Live waterfall decode |
| Phone app | Morse decoder apps (record and decode) | Field checks |
| Desktop decoder | fldigi, CWGet, MultiMorse | Precise timing analysis |
| Online | Web Morse decoders (paste audio file) | Occasional use |
| By eye on waterfall | See the blips yourself | Instant verification |

## The fldigi Path

fldigi is a free ham-radio digital mode program with a solid CW decoder:

1. Connect the SDR audio (or a phone recording) to the PC input.
2. Open fldigi, select CW mode.
3. Set the center frequency so the tone sits near 1000 Hz.
4. Start the decoder and watch text appear.

## Decoding With a Phone

1. Record the beacon audio with the phone's recorder.
2. Open any Morse decoder app and load the recording.
3. Adjust the WPM setting to match the beacon (13 WPM default).
4. Read the decoded text.

## Timing Reality Check

The firmware uses PARIS-standard timing with unit duration `1200 / WPM` ms. At 13 WPM a dot is 92 ms. Decoders configured for the wrong WPM still decode but produce characters slowly; set 13 WPM for the default configuration.

## What the Payload Should Look Like

| Configuration | Decoded text |
|---------------|--------------|
| Base only | `SOS` |
| Name only | `SOS DE MARIO ROSSI` |
| GPS only | `SOS PSN N4553 E01230` |
| Full | `SOS DE MARIO ROSSI PSN N4553 E01230` |

See [GPS Integration](/wiki/gps-integration) for the coordinate format.

## Related Pages

- [SDR Listening Guide](/wiki/sdr-listening-guide)
- [Reading CW by Ear](/wiki/reading-cw-by-ear)
- [Morse Code Engine](/wiki/morse-code-engine)
- [GPS Integration](/wiki/gps-integration)
