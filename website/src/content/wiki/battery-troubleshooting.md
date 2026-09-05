---
title: Battery Troubleshooting
description: "Diagnosing beacon battery faults: fast drain, no charge, sagging under TX, and the measurements that find the cause."
---

# Battery Troubleshooting

Battery faults look like every other fault: the beacon resets, the range drops, the runtime collapses. This page is the isolation sequence.

## The symptom map

| Symptom | Likely cause |
| --- | --- |
| Runtime collapsed | Cell aged, or something not sleeping (see [Sleep Current](sleep-current)) |
| Resets during TX | Cell sagging under the burst (see [Cold Weather Batteries](cold-weather-batteries)) |
| Won't charge | TP4056 input problem, or dead cell |
| "Low battery" with full cell | Cold, or wrong thresholds for the chemistry |
| Hot cell during charging | Charger fault, or cell damaged: STOP using it |

## The measurements

1. **Resting voltage**: 4.2 V charged, 3.7 V nominal, below 3.0 V is dead (protected cells cut off first, see [Protected vs Unprotected](protected-vs-unprotected)).
2. **Voltage under load**: watch the voltage while the beacon transmits; a healthy cell dips less than 0.3 V, a tired cell dips 0.5 V+ and can brown out the ESP32.
3. **Sleep current**: see [Power Measurement](power-measurement); above 1 mA in sleep is a board problem, not a cell problem.

## The sag test

The definitive test for a tired cell:

1. Charge fully and rest 30 minutes.
2. Note the resting voltage.
3. Enable a continuous TX test (or the emergency interval).
4. If the voltage drops below 3.3 V during the burst, the cell cannot deliver the current: replace it.

## Cell replacement rules

- Same chemistry and protected type (see [Protected vs Unprotected](protected-vs-unprotected)).
- Never mix new and old cells (see [Parallel Cells](parallel-cells)).
- Dispose of damaged cells properly; a swollen cell is a fire risk, not a battery.

## Related pages

- [Battery Monitor Details](battery-monitor-details) for the firmware side
- [Charging and Cell Care](charging-and-cell-care) for the charger
- [Power Measurement](power-measurement) for the procedure