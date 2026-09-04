---
title: "Receiver Compatibility"
description: "Which radios and receivers hear the 433 MHz CW signal, and how to tune them"
---

# Receiver Compatibility

## Overview

The beacon keys a continuous FSK carrier in Morse. Any receiver that can demodulate an on-off keyed carrier around 433 MHz will hear it - the CW signal is modulation-agnostic.

## What Works

| Receiver | Mode | How to hear the beacon |
|----------|------|------------------------|
| Handheld scanner | AM or NFM | Tune to 433.500 MHz, listen for keying |
| Baofeng / ham HT with AM | AM mode (modded or supported) | Rare on Baofengs; most are FM only |
| Ham transceiver with SSB/CW | USB | CW tones appear as audible keying |
| RTL-SDR dongle + SDR# | Wideband FM or AM | Carrier blips visible on the waterfall |
| SDR with AM demodulation | AM | Best visual confirmation |

## The FM Problem

Most cheap handhelds (Baofeng UV-5R and similar) are **FM only**. A pure CW carrier through an FM demodulator produces little or no audio, because the carrier is unmodulated in frequency.

| Receiver type | FM? | AM/CW capable? | Hears the beacon? |
|---------------|-----|----------------|-------------------|
| Baofeng UV-5R | yes | no | Usually poor |
| Baofeng with AM mod | yes | yes | Yes |
| Scanner (Uniden, etc.) | yes | yes (AM mode) | Yes |
| RTL-SDR | yes | yes (SDR) | Yes |
| Icom IC-705 / HF rig | yes | yes (SSB/CW) | Excellent |

> [!TIP]
> The SDR is the cheapest guaranteed way to hear and SEE the beacon. An RTL-SDR dongle costs ~$15 and shows the carrier as a spike that appears and disappears with the Morse keying.

## Tuning Steps

1. Set the receiver to 433.500 MHz (or the beacon's configured frequency).
2. Select AM or WFM mode if available.
3. If using SSB, tune a few kHz off and adjust the BFO pitch.
4. Trigger a test transmission and watch for the carrier keying.

## Verifying You Heard the Right Signal

The SOS pattern is unmistakable:

- Three short, three long, three short keying bursts.
- On an SDR waterfall it looks like three blips, a pause, three long blips, a pause, three blips.
- With GPS enabled the payload scrolls as plain Morse text a trained ear can copy.

## Related Pages

- [SDR Listening Guide](/wiki/sdr-listening-guide)
- [Morse Engine](/wiki/morse-code-engine)
- [Reading CW by Ear](/wiki/reading-cw-by-ear)
- [Frequency Compatibility](/wiki/frequency-compatibility)
