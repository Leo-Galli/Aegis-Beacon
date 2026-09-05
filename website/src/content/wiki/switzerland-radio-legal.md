---
title: Switzerland Radio Legal
description: "Using the 433 MHz beacon legally in Switzerland: OFCOM rules, ISM power limits, and practical notes for the Alps."
---

# Switzerland Radio Legal

Switzerland follows the CEPT harmonized framework through OFCOM (Bakom). The beacon's 433 MHz ISM operation is license-free within the standard limits.

## ISM operation

The band 433.050 - 434.790 MHz is open to license-free short-range devices. The standard ISM limit applies: maximum 10 mW ERP for general use. Equipment must be type-approved under the SRD framework; a module like the E22 with CE certification satisfies this.

## The power setting in practice

At typical beacon power levels above 10 mW ERP, the device operates outside the license-free envelope. The practical position, as documented throughout this wiki: use the legal power floor for routine beaconing, reserve higher settings for genuine emergencies, and test only with a dummy load or on amateur-licensed channels.

## Duty cycle

Swiss rules apply the harmonized duty-cycle limits for continuous operation. The beacon's sleep interval exists to respect this (see [Duty Cycle Rule](duty-cycle-rule)).

## The emergency exception

The distress exception applies: a person in genuine danger may exceed the normal limits to summon help. The beacon's EMERGENCY mode is designed for exactly this situation.

## Amateur alternative

Swiss amateur licensing (HB callsigns) opens the 70 cm band with full privileges. The beacon's frequency and identification settings support this use (see [Callsign Identification](callsign-identification)).

## Practical Alpine notes

- Cross-border trips: the beacon's behavior is identical across CH/IT/FR/AT because all four follow the same harmonized framework; the [Frequency Compatibility](frequency-compatibility) tables are valid on all of them.
- The SEARCH mode is fully legal in all these countries: receiving requires no license anywhere.

## Related pages

- [Regulatory Compliance](regulatory-compliance) for the framework
- [Emergency Use Legal](emergency-use-legal) for the exception
- [Frequency Planning Examples](frequency-planning-examples) for channel choice