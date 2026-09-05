---
title: Wire Gauge Guide
description: "Choosing wire sizes for the beacon: the current table, the voltage-drop math, and the gauges the build actually uses."
---

# Wire Gauge Guide

Wire gauge decides three things: how much current the wire can carry, how much voltage it drops, and how well it survives flexing. The beacon uses three gauges for three jobs.

## The current table (AWG)

| AWG | Max current (chassis wiring) | Typical use |
| --- | --- | --- |
| 30 | 0.5 A | Signal wires |
| 28 | 0.8 A | Signal, GPS UART |
| 26 | 1.5 A | Buttons, LED |
| 24 | 2.5 A | Power rails |
| 22 | 4 A | Battery and charger paths |
| 20 | 6 A | Cell leads (overkill, but flexible) |

## The beacon's three gauges

| Path | Gauge | Why |
| --- | --- | --- |
| Signal (UART, I2C, buttons) | 26 - 28 AWG | Small, flexible |
| Power rails (3.3 V) | 24 AWG | 120 mA bursts with margin |
| Cell and charger | 22 AWG | 1 A charging, low drop |

## The voltage-drop math

Drop = I x R. Ten cm of 26 AWG at 120 mA drops about 4 mV: nothing. Ten cm of 30 AWG at 1 A (charging) drops about 30 mV: still fine. The drop only matters on the cell path under the TX burst, where the [Brownout Protection](brownout-protection) page explains the consequences.

## The flex rule

Thin wire breaks with flexing, thick wire is stiff. In a case that opens and closes, use stranded wire and strain relief at every connector (see [Wiring Order and Routing](wiring-order-and-routing)). A broken wire inside a case is the most common intermittent fault in the project.

## The colour convention

The project uses a fixed colour scheme: red for the cell positive, black for ground, orange for 3.3 V, and any other colour for signals. Consistency is worth more than any single wire choice.

## Related pages

- [Connector Types](connector-types) for the connectors
- [Wire and Connectors](wire-and-connectors) for the wiring guide
- [Wiring Order and Routing](wiring-order-and-routing) for the layout