---
title: Audio Troubleshooting
description: "Diagnosing the beacon's audio: silent buzzer, distorted jack output, and the level checks for recording and radio bridging."
---

# Audio Troubleshooting

The audio path has two ends: the buzzer inside the case and the jack outside it. Each has its own failure signature.

## Buzzer faults

| Symptom | Likely cause |
| --- | --- |
| Totally silent | Wiring, or the tone feature disabled |
| Quiet | Series resistor too large, or low battery |
| Rattles | Buzzer touching the case wall |
| Works then stops | Cold solder joint on the buzzer leads |

## Jack faults

| Symptom | Likely cause |
| --- | --- |
| No sound on the recording | Mono vs stereo plug mismatch, or the isolation diode |
| Distorted | Level too hot for the recorder input |
| Crackling | Dry solder at the jack lugs |
| Works with headphones, not a recorder | Recorder input expects line level, not speaker level |

## The levels

The beacon's audio is a 3.3 V square wave: far too hot for most recorder mic inputs. The honest fix:

- Use the jack into the mic input of a handheld radio with its gain turned down.
- Or record at a distance, not plugged in.
- Or add a fixed pad (two resistors) at the jack.

The [Audio Tone Details](audio-tone-details) page has the frequency and level specs.

## The isolation diode

The jack circuit includes a diode so the buzzer still sounds when a plug is inserted. If the buzzer dies exactly when you plug in the cable, the diode is reversed or shorted. Check it with the multimeter's diode test.

## The capture test

1. Plug into a recorder.
2. Play a test burst (transmit or tone test).
3. The recording should decode by ear or with software (see [Reading CW by Ear](reading-cw-by-ear)).
4. A recording that decodes on the bench but not through a radio means the radio's mic gain is clipping: turn it down.

## Related pages

- [Audio Tone Details](audio-tone-details) for the specs
- [Audio Jack Wiring](audio-jack-wiring) for the circuit
- [Transmitter Testing](transmitter-testing) for the full-path test