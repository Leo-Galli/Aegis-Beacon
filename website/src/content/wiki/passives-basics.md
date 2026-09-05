---
title: Resistors, Capacitors and Passives
description: "Every passive component in the BOM explained: values, roles, and what happens if you substitute."
---

# Resistors, Capacitors and Passives

The BOM has a handful of passives. Each has a specific job; substitution is fine within reason, but know what the value does.

## Resistors

| Ref | Value | Role |
|-----|-------|------|
| R1, R2 | 330 Ω | LED current limiters |
| R3 | 100 Ω | Audio output series |
| R3a, R3b | 100 kΩ | Battery voltage divider (halves VBAT for the ADC) |

- The divider ratio is what matters: 100k/100k halves the voltage. Using 10k/10k keeps the ratio but raises the current drain from 21 µA to 210 µA - still fine, but 100k is the design value.
- LED resistors: 330 Ω gives ~6-8 mA. 220-470 Ω all work; the LED just gets brighter or dimmer.

## Capacitors

| Ref | Value | Role |
|-----|-------|------|
| C1 | 100 µF electrolytic | Bulk decoupling on 3.3 V rail |
| C2 | 100 nF ceramic (x2) | Local decoupling near the ESP32 and radio |
| C3 | 10 µF electrolytic | AC-coupling on the audio path |

- The 100 µF bulk cap smooths the PA's current bursts. A smaller value (47 µF) still works in practice.
- The 100 nF ceramics are standard bypass; value is not critical (10-100 nF all fine).
- The 10 µF audio cap sets the low-frequency cutoff with the 100 Ω (about 160 Hz) - fine for Morse tones (440-2200 Hz).

## Cold weather substitution

Below -10 C, electrolytic capacitors stiffen and lose capacitance. Replace C1 with a **47 µF X7R ceramic** for alpine use. This is documented in the BOM notes.

## Sizing

The BOM specifies 0805 SMD or through-hole; either works. Through-hole is easier to solder by hand. Tolerance: 5% resistors, 10-20% capacitors - all fine here.

## Testing passives

- Resistors: measure with the multimeter; cold solder joints on the divider are a top cause of wrong battery readings.
- Capacitors: a shorted cap reads near 0 Ω; a dead-open cap reads open. Replace any suspect cap before debugging further.