---
title: Ohm's Law
description: "V = I x R, worked examples for the beacon's circuits, and the three practical uses in this project: LEDs, dividers, and current limiting."
---

# Ohm's Law

Every calculation in this project comes back to one equation: V = I x R (voltage equals current times resistance). This page is the refresher plus the beacon-specific uses.

## The triangle

```
  V
 I R
```

Cover the value you want: V = I x R, I = V / R, R = V / I.

## Worked example: the LED resistor

A beacon LED runs from 3.3 V and needs 10 mA; the LED drops 2 V. The resistor must drop the rest:

```
R = (3.3 - 2.0) / 0.01 = 130 ohms
```

Use 150 ohms (standard value); the LED sees 8.7 mA, well within spec and kinder to the battery.

## Worked example: the battery monitor divider

The ADC reads up to 3.3 V but the battery reaches 4.2 V. A divider of R1 = 100k and R2 = 100k halves the voltage:

```
V_adc = 4.2 x (100 / (100 + 100)) = 2.1 V
```

The [Battery Monitor Details](battery-monitor-details) page gives the exact values used.

## Worked example: buzzer limiting

A buzzer rated for 5 V on a 3.3 V rail usually runs fine without a resistor, but if it is too loud, add series resistance:

```
R = (3.3 - 1.5) / 0.02 = 90 ohms
```

## The three mistakes

| Mistake | Consequence |
| --- | --- |
| LED without resistor | LED overcurrent, early death |
| Divider values too low | Battery drain through the divider |
| Resistor power rating ignored | Smoke; P = I^2 x R |

## Related pages

- [Electrical Specifications](electrical-specifications) for the project's values
- [LED Wiring](led-wiring) for the LED circuit
- [Battery Monitor Details](battery-monitor-details) for the divider