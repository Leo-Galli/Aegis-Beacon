---
title: TP4056 Charging Current
description: How the TP4056 sets its charging current, the programming resistor values, and the trade-offs of fast versus slow charging.
---

# TP4056 Charging Current

The TP4056 charges at a current set by one resistor. This page is the resistor math, the standard values, and the honest trade-offs.

## The programming resistor

The charging current is set by Rprog between the PROG pin and ground:

```
I_charge (A) = 1200 / Rprog (ohms)
```

| Rprog | Charging current |
| --- | --- |
| 1.2 k | 1.0 A (the common default) |
| 2.0 k | 0.6 A |
| 3.0 k | 0.4 A |
| 10 k | 0.12 A |

## The trade-offs

| Current | Charge time (2500 mAh) | Heat | Cell stress |
| --- | --- | --- | --- |
| 1.0 A | ~3 h | Noticeable | Normal |
| 0.5 A | ~6 h | Low | Gentler |
| 0.2 A | ~15 h | Minimal | Gentlest |

The recommended value for the beacon: **0.5 - 1.0 A**. Faster than 1 A exceeds the module's spec and stresses the cell; slower than 0.3 A means overnight charging for a day trip.

## The USB input limit

The TP4056 input current is limited by the source: a 500 mA USB port charges at 500 mA regardless of Rprog. The [Charger Troubleshooting](charger-troubleshooting) page covers the input side.

## The thermal behavior

At 1 A the TP4056 and the cell both warm up. This is normal; a hot-to-the-touch board is not (see [Charger Troubleshooting](charger-troubleshooting)). In winter the warmth is even welcome (see [Cold Weather Batteries](cold-weather-batteries)).

## Related pages

- [TP4056 Charger Guide](tp4056-charger-guide) for the module
- [TP4056 Wiring](tp4056-wiring) for the circuit
- [Charging and Cell Care](charging-and-cell-care) for the cell side