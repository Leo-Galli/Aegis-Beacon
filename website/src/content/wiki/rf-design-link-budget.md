---
title: "RF Design & Link Budget"
description: "Free-space path loss, link budget math and realistic range expectations for 410-525 MHz"
---

# RF Design & Link Budget

## Overview

The Aegis-Beacon uses the SX1262 transceiver in CW (Continuous Wave) mode for emergency beacon transmissions. The signal is detectable by any AM-mode receiver on the same frequency.

## Frequency Range

| Parameter | Value |
|-----------|-------|
| **Operating Band** | 410-525 MHz |
| **Default Frequency** | 433.500 MHz |
| **Frequency Steps** | 100 kHz |
| **Max Frequencies** | 10 per cycle |

## Link Budget Analysis

### TX Parameters (SX1262 + E22 PA)

| Parameter | Value |
|-----------|-------|
| **Output Power** | +22 dBm (RadioLib) / +30 dBm (E22 PA) |
| **Antenna Gain** | 0 dBi (wire) / 2 dBi (whip) |
| **Feedline Loss** | 0 dB (direct) |

### RX Parameters (Typical Scanner)

| Parameter | Value |
|-----------|-------|
| **Sensitivity** | -120 dBm (AM mode) |
| **Antenna Gain** | 2 dBi (whip) |
| **Noise Floor** | -110 dBm |

### Free Space Path Loss

```
FSPL(dB) = 20*log10(d) + 20*log10(f) + 32.45

Where:
  d = distance in km
  f = frequency in MHz
```

### Example: 433.5 MHz, 5 km

```
FSPL = 20*log10(5) + 20*log10(433.5) + 32.45
     = 13.98 + 52.74 + 32.45
     = 99.17 dB
```

### Link Margin

```
Link Margin = TX Power + TX Antenna - FSPL + RX Antenna - RX Sensitivity

With E22 PA (+30 dBm):
= 30 + 0 - 99.17 + 2 - (-120)
= 52.83 dB (excellent margin)

With RadioLib (+22 dBm):
= 22 + 0 - 99.17 + 2 - (-120)
= 44.83 dB (good margin)
```

## Maximum Range Estimates

| Condition | Range |
|-----------|-------|
| **Line of Sight (LOS)** | 15+ km |
| **Mountain terrain** | 5-10 km |
| **Urban/suburban** | 1-3 km |
| **Through snow** | 3-9 dB loss at 1m depth |
| **Through foliage** | 5-10 dB loss |

> [!WARNING]
> Range estimates assume clear line of sight. Real-world performance depends on terrain, obstacles, and antenna quality.

## Antenna Considerations

### Quarter-Wave Lengths

| Frequency | Length |
|-----------|--------|
| 433.5 MHz | **17.3 cm** |
| 462 MHz | 16.2 cm |
| 868 MHz | 8.6 cm |

### Best Practices

1. **Vertical orientation** for omni-directional coverage
2. **Keep antenna away** from battery and metal enclosure walls
3. **Ground plane** (copper foil) improves gain by ~3 dBi
4. **E22 SMA connector** -- use quality 433 MHz whip antenna

## CW Signal Characteristics

### Modulation

- **Type:** CW (Continuous Wave) -- on/off keying
- **Detection:** Any AM-mode receiver
- **Bandwidth:** ~500 Hz (narrow)
- **Audible:** Yes, through earpiece/speaker

### Comparison with Other Modes

| Mode | Bandwidth | Sensitivity | Audible |
|------|-----------|-------------|---------|
| **CW (Aegis)** | ~500 Hz | -120 dBm | Yes |
| FSK | ~125 kHz | -130 dBm | No |
| OOK | ~10 kHz | -115 dBm | Yes |

> [!NOTE]
> CW mode is chosen for maximum compatibility. Any AM-mode receiver can detect the signal without special software.
