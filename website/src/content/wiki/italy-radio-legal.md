---
title: Italy Radio Legal
description: "Using the 433 MHz beacon legally in Italy: the ISM band rules, the 10 mW ERP limit, and the emergency exception."
---

# Italy Radio Legal

Italy is the beacon's home market, and its rules are representative of the CEPT harmonized approach across Europe. The short version: 433 MHz ISM use is license-free but power-limited, and genuine emergencies are exempt.

## The 433 MHz ISM band in Italy

The band 433.050 - 434.790 MHz is harmonized for license-free use across the CEPT countries. Italian rules follow the ECC Decision 70(03) framework: no individual license for equipment that stays within the technical limits.

## The power limit that matters

The beacon must respect the ISM effective radiated power limit of **10 mW ERP** (see [ERP vs EIRP](erp-vs-eirp)) for standard operation. The firmware's power settings map to this: the higher settings are intended for emergency use and controlled testing, and the [Regulatory Compliance](regulatory-compliance) page explains the reasoning in full.

## Duty cycle

The band's duty-cycle rule applies: continuous transmission is not permitted for normal operation. The beacon's scheduler enforces the gap between bursts precisely for this reason (see [Duty Cycle Rule](duty-cycle-rule)).

## The emergency exception

Like the rest of the CEPT framework, Italian rules recognize that a genuine distress situation overrides the standard limitations: a person in danger may use any means to summon help. The beacon's EMERGENCY mode exists for this case. The [Emergency Use Legal](emergency-use-legal) page covers the boundary carefully: the exception protects you in a real emergency, not in a drill.

## Amateur radio alternative

With an amateur radio license (A - B class or the newer FDP), the same hardware can be used on amateur-allocated channels in the 70 cm band with full amateur privileges and identification requirements (see [Amateur License Process](amateur-license-process) and [Callsign Identification](callsign-identification)).

## Related pages

- [Regulatory Compliance](regulatory-compliance) for the full picture
- [Emergency Use Legal](emergency-use-legal) for the exception
- [Frequency Compatibility](frequency-compatibility) for the band table