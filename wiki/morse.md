# Morse Code Engine

The Morse engine generates CW timing using software delays with PARIS-standard calibration.

## Timing Parameters

| Element | Duration |
|---------|----------|
| Dot | 1200 / WPM ms |
| Dash | 3 x dot ms |
| Intra-character | 1 x dot ms |
| Inter-character | 3 x dot ms |
| Word gap | 7 x dot ms |

## Audio Generation

600 Hz CW tone via DAC1 (GPIO 25). DAC output toggles between 0V (silence) and ~2.5V (tone). Volume: DEFAULT_AUDIO_VOL (0-255, default 180).

## Payload Format

```
SOS DE FIRST LAST PSN N4553 E01230
```

## Character Set

Full ITU Morse: A-Z, 0-9, punctuation. SOS is hardcoded as emergency prefix.
