# RF Design & Link Budget

## Link Budget

| Parameter | Value | Notes |
|-----------|-------|-------|
| TX Power (max) | +30 dBm (1W) | E22-400M30S PA (RadioLib limits to +22) |
| RX Sensitivity | -130 dBm (SF12/BW125) | Best sensitivity at lowest data rate |
| Antenna Gain | +2 dBi (typical) | Quarter-wave whip, rubber duck |
| Cable Loss | ~0.5 dB | Short SMA pigtail |
| **Total Link Budget** | **161.5 dB** | 30 + 130 + 2 - 0.5 |

## Estimated Range

- **Line of Sight (LOS)**: 15-25 km depending on terrain and antenna height
- **Urban / Forest**: 2-5 km typical. Foliage attenuation ~0.1 dB/m at 433 MHz
- **Underground / Indoor**: 500m-1km. Concrete attenuation ~10-15 dB per floor
- **Emergency Mode (+22 dBm)**: Continuous TX at max power

## Modulation Parameters

```
Mode: FSK + CW Keying (transmitDirect)
Data rate: 0.6 kbps (CW equivalent)
Spreading factor: SF12 (for LoRa mode scanning)
Bandwidth: 125 kHz (for LoRa mode scanning)
Coding rate: 4/5 (default)
Sync word: 0x1424 (SX1262 default)
```

## EMC Considerations

- TX spurious emissions must comply with ETSI EN 300 220 or FCC Part 15.247
- Harmonic suppression: >= 40 dBc for 2nd and 3rd harmonics
- TX rise/fall time: 2 ms (configurable via RadioLib)
- Duty cycle: 1% (configurable, default 100% for emergency)
