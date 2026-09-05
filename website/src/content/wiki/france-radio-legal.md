---
title: France Radio Legal
description: "Using the 433 MHz beacon legally in France: ANFR rules, ISM limits, PMR446 and the emergency exception."
---

# France Radio Legal

France regulates radio under ANFR, following the same CEPT framework as its neighbors. The beacon's 433 MHz ISM operation is license-free within the standard limits.

## ISM operation

The 433.050 - 434.790 MHz band is available for license-free short-range devices under the harmonized rules, with the standard 10 mW ERP ceiling for general use. Type-approved modules (CE marked) satisfy the equipment requirements.

## French specifics

- The ARCEP/ANFR framework tracks the CEPT decisions closely; there is no additional French license for compliant SRD use.
- PMR446 (446 MHz) is separately licensed-free with a 500 mW ERP limit and fixed integrated antennas: the beacon can receive PMR446 channels with an SDR or a PMR446 handheld, but it does not transmit there (see [PMR446 Deep Dive](pmr446-deep-dive)).

## The power ceiling

Above the 10 mW ERP ISM ceiling, operation moves outside the license-free envelope. The wiki's standing guidance applies: routine beaconing at the legal floor, higher settings only for genuine emergencies (EMERGENCY mode), testing with a dummy load.

## Duty cycle and emergency

France applies the harmonized duty-cycle limits, and the same distress exception as the rest of CEPT: in a genuine emergency, the limits do not prevent you from calling for help. See [Duty Cycle Rule](duty-cycle-rule) and [Emergency Use Legal](emergency-use-legal).

## Amateur alternative

The French amateur license (F callsigns) opens the 70 cm band for the same hardware with full privileges and mandatory identification.

## Related pages

- [Regulatory Compliance](regulatory-compliance) for the framework
- [Frequency Compatibility](frequency-compatibility) for the tables
- [Emergency Use Legal](emergency-use-legal) for the exception