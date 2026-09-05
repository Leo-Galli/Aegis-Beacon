---
title: Audio Jack Wiring
description: The 3.5 mm TRRS jack, the DAC output path, and why the AC-coupling capacitor matters.
---

# Audio Jack Wiring

The beacon's audio comes out of a 3.5 mm jack so you can listen on any wired headphone. The circuit is tiny but has one trap.

## The signal path

```
GPIO 25 (DAC1) → 100 Ω → 10 µF → jack TIP
                                → jack SLEEVE (GND)
```

- **GPIO 25** is the ESP32's native 8-bit DAC channel 1 (0-3.3 V).
- The **100 Ω** resistor limits current.
- The **10 µF capacitor** AC-couples the signal: it blocks the DC bias so the headphone sees only the audio waveform. Without it, headphones click and distort.

## The jack

Use a 3.5 mm **TRRS** jack (PJ-320A or similar):

- **Tip**: audio (from the capacitor).
- **Ring 1**: tie to Tip for mono.
- **Ring 2 (MIC)**: not connected.
- **Sleeve**: ground.

A standard TRS (3-pole) jack also works: Tip = audio, Ring = NC, Sleeve = GND.

## Mid-rail parking

The firmware calls `dacWrite(128)` at silence. This parks the output at mid-rail (about 1.65 V) so the DAC doesn't click when audio starts. The AC-coupling capacitor blocks that DC anyway.

## Wiring mistakes

- Missing capacitor: loud clicks at the start of every tone.
- Tip and sleeve swapped: no sound (or hum).
- Using a 5 V audio source: never connect anything to the jack except headphones.
- Shorting Tip to GND: the 100 Ω protects the DAC, but check the wiring before powering.

## Testing

- Play a SEARCH scan: you should hear the pitch rise with signal.
- Play a BEACON cycle: you should hear Morse clicks synchronized with the RF keying.
- Volume 0: near-silence (not absolute silence; the DAC floor is audible with sensitive earphones).

## Headphones

Any wired headphone, 16-600 Ω, works. Bluetooth headphones do not: the jack is analog.