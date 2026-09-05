---
title: Charger Troubleshooting
description: "TP4056 faults: no charge light, slow charging, overcharging, and the input requirements that make the charger work at all."
---

# Charger Troubleshooting

The TP4056 is simple, but its failure modes are specific: it needs the right input, and its status lights lie in ways you can learn to read.

## The input requirements

| Requirement | Value |
| --- | --- |
| Input voltage | 4.5 - 5.5 V |
| Input current | At least 1 A for fast charging |
| Input quality | Clean DC; sagging inputs charge slowly or not at all |

A USB port that delivers 0.5 A charges a 2500 mAh cell at half rate. A wall adapter that "is 5 V" but sags to 4.2 V under load charges nothing. Test with the battery disconnected: the input should read above 4.5 V under load.

## Reading the lights

| LED state | Meaning |
| --- | --- |
| Red on, green off | Charging |
| Green on, red off | Charged (or no cell!) |
| Blinking | Problem: check input, cell, or solder |

The classic false reading: green with no cell installed. Always confirm a cell is actually connected before trusting the green light.

## Charging too slowly

| Cause | Fix |
| --- | --- |
| Weak USB source | Use a 1 A+ adapter |
| Wrong programming resistor | The Rprog resistor sets the current; 1.2 k = 1 A |
| Cold cell | The charger reduces current below 0 C (see [Cold Weather Batteries](cold-weather-batteries)) |
| Bad solder on the input pads | Reflow the joints |

## Charging too fast / hot

A TP4056 at 1 A into a cold or aged cell heats up. The board should be warm, not hot. A hot board means: wrong Rprog, a shorted cell, or a counterfeit module. Stop, disconnect, inspect.

## The full-cycle test

1. Connect an empty, healthy cell.
2. Confirm red light, note the time.
3. At full charge (green), disconnect and measure the resting voltage: 4.15 - 4.22 V is correct. Above 4.25 V repeatedly means a faulty charger board: replace it.

## Related pages

- [TP4056 Charger Guide](tp4056-charger-guide) for the module
- [TP4056 Wiring](tp4056-wiring) for the circuit
- [Battery Troubleshooting](battery-troubleshooting) for the cell side