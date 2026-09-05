---
title: Decibel Table
description: "The dB reference table for the beacon: power levels, gains and losses, and the mental arithmetic that makes the numbers stick."
---

# Decibel Table

The decibel is the radio's unit of comparison. This page is the reference table plus the mental math that makes dB usable without a calculator.

## The power table

| Ratio | dB |
| --- | --- |
| 1x | 0 |
| 1.26x | 1 |
| 2x | 3 |
| 4x | 6 |
| 10x | 10 |
| 100x | 20 |
| 1000x | 30 |
| 1/2 | -3 |
| 1/10 | -10 |

## The beacon's numbers

| Quantity | dBm |
| --- | --- |
| Beacon TX, low setting | +10 to +17 |
| Beacon TX, high setting | +22 |
| Receiver sensitivity (LoRa) | about -137 |
| Receiver sensitivity (FSK) | about -120 |
| Comfortable RX signal | -80 to -60 |

The span from +22 dBm to -120 dBm is 142 dB: a power ratio of about 10^14, which is why dB exists.

## Mental arithmetic rules

- Every 3 dB doubles or halves power.
- Every 10 dB is a factor of 10.
- dBm + dB = dBm (add gains and losses to power levels).
- Two equal powers add: +3 dB (not +6).

## A worked link budget

```
TX power          +17 dBm
Cable loss         -1 dB
Antenna gain      +2 dBi
Path loss (1 km)  -85 dB
Receiver antenna  +0 dBi
RX signal         -67 dBm   (strong)
```

Change the path to 5 km (-99 dB) and the RX signal falls to -81 dBm, still workable.

## Related pages

- [RF and Link Budget](rf-design-link-budget) for the full budget
- [RSSI Explained](rssi-explained) for the received side
- [ERP vs EIRP](erp-vs-eirp) for the legal side