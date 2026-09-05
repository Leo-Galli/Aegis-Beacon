---
title: Audio Recording Guide
description: "Recording the beacon's Morse output cleanly: levels, input types, and the setup that decodes every time."
---

# Audio Recording Guide

Recording the beacon's audio is how you verify, archive and share its transmissions. The failures are almost always levels, and this page is the fix.

## The signal the beacon produces

The audio jack outputs the keyed 700 Hz square wave at 3.3 V logic level (see [Audio Tone Details](audio-tone-details)). That is far hotter than a microphone input expects, and too "digital" for a line input.

## The input ladder

| Input | Level | Result with a direct connection |
| --- | --- | --- |
| Mic input | ~5 - 50 mV | Clipping, distortion |
| Line input | ~0.3 - 1 V | Acceptable to hot |
| Speaker/headphone input | 3.3 V class | Perfect, if the recorder has one |

The honest setups:

1. A recorder with a headphone/speaker input, direct cable: cleanest.
2. A phone mic input with an inline attenuator (two resistors, see [Audio Troubleshooting](audio-troubleshooting)).
3. The beacon's own buzzer, recorded at a distance: works, but captures the room too.

## The recording workflow

1. Set the recorder level so the waveform peaks at about 70%.
2. Trigger one burst (see [Serial Monitor Guide](serial-monitor-guide) for the `tx now` command).
3. Play back and decode with software (see [Morse Decoder Tools](morse-decoder-tools)) or by ear (see [Reading CW by Ear](reading-cw-by-ear)).
4. A decode on the first take means the levels are right.

## The radio bridging version

The same audio can be fed into a handheld radio's mic input to relay the beacon's signal (see [Two Way Build](two-way-build)). The rule changes: the radio's mic gain must be turned down, because the beacon's level will overdrive it and splatter adjacent channels.

## Related pages

- [Audio Troubleshooting](audio-troubleshooting) for the faults
- [Audio Tone Details](audio-tone-details) for the specs
- [Morse Decoder Tools](morse-decoder-tools) for decoding