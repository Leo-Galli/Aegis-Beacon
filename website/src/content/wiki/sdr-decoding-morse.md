---
title: SDR Decoding Morse
description: "Decoding the beacon's Morse automatically from an SDR recording: the software options and the settings that make decoding reliable."
---

# SDR Decoding Morse

The beacon transmits Morse so any receiver can decode it, and software decoders make the receiving side effortless. This page is the software path.

## The pipeline

SDR -> audio (FM demodulated) -> decoder -> text

The decoder needs clean audio: the beacon's tone must be the dominant sound in the passband, with the correct speed setting.

## The decoder options

| Tool | Platform | Notes |
| --- | --- | --- |
| CW decoders in SDR apps | The SDR software itself | Built-in, good for live |
| Standalone CW decoders | Desktop / mobile | Accept audio files or live input |
| Web-based decoders | Browser | Paste a recording |

The [Morse Decoder Tools](morse-decoder-tools) page has the full list with setup notes.

## The settings that matter

| Setting | Value |
| --- | --- |
| Speed (WPM) | Match the beacon's setting (default 12) |
| Filter bandwidth | Narrow around the tone: 200 - 500 Hz |
| Tone frequency | 700 Hz (see [Audio Tone Details](audio-tone-details)) |
| Noise gate | On: keeps hash from becoming characters |

## The failure modes

| Symptom | Cause |
| --- | --- |
| Garbage characters | Speed or filter mismatch |
| Missing characters | Signal too weak, or the noise gate too aggressive |
| Everything decodes wrong | The recording is distorted (see [Audio Recording Guide](audio-recording-guide)) |

## The verification

A decoder that reads the test recording correctly (see [Audio Recording Guide](audio-recording-guide)) will read the live signal: the same audio path, the same settings. Verify once, then trust the setup.

## Related pages

- [Morse Decoder Tools](morse-decoder-tools) for the tools
- [SDR Software Setup](sdr-software-setup) for the receiver
- [SDR Listening Guide](sdr-listening-guide) for the listening