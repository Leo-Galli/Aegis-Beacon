---
title: Connector Types
description: "The connectors used in the beacon build: JST, Dupont, USB, SMA, and the current ratings that decide which one is safe."
---

# Connector Types

Every wire in the beacon ends in a connector, and every connector is a compromise between size, current, and reliability. This page is the catalogue.

## The power connectors

| Connector | Current | Used for |
| --- | --- | --- |
| JST-PH 2.0 | 2 A | Battery and module connections |
| JST-XH 2.5 | 3 A | Charger to cell |
| Dupont 2.54 | 1 - 3 A | Breadboard prototyping (see [Breadboard Prototyping](breadboard-prototyping)) |
| USB | 0.5 - 3 A | Charging input |

## The RF connectors

| Connector | Use |
| --- | --- |
| SMA | The standard antenna mount (see [Antenna Cable and Connectors](antenna-cable-connectors)) |
| RP-SMA | The trap to avoid on marketplaces |
| U.FL / IPEX | Internal module pigtails only |

## The current rule

Every connector has a current rating, and the beacon's TX burst pulls 120 mA: trivial for all of the above. The real risk is the charger input at 1 A and the cell leads during a hard TX. Rule of thumb: power paths use connectors rated at least 3x the expected current, or solder directly.

## The failure hierarchy

Connectors fail in this order: worn Dupont (loose fit), JST with a cold crimp, USB ports (mechanically weak), SMA (water ingress). The field repair kit (see [Field Maintenance and Storage](field-maintenance-and-storage)) carries the common spares.

## The cold connection

In winter, connectors stiffen and loose fits open up. The fix is the same as everywhere else in this project: strain relief, good crimps, and a case design that does not flex the connectors (see [Wiring Order and Routing](wiring-order-and-routing)).

## Related pages

- [Wire and Connectors](wire-and-connectors) for the full wiring guide
- [Wire Gauge Guide](wire-gauge-guide) for the wire side
- [Antenna Cable and Connectors](antenna-cable-connectors) for the RF side