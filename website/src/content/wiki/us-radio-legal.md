---
title: US Radio Legal
description: "Using the 433 MHz beacon in the United States: FCC Part 15 rules, the 433.92 MHz ISM allocation, and the amateur alternative."
---

# US Radio Legal

The United States is not a CEPT country, so the rules differ from Europe in one important way: the 433 MHz band is a narrow ISM allocation with a different power regime.

## The 433 MHz allocation

The FCC allocates 433.05 - 434.79 MHz as an ISM band used mainly for industrial equipment. Under Part 15 rules, unlicensed devices may operate there, but the practical regime is different from Europe: Part 15 imposes field-strength limits rather than the ERP ceiling used by CEPT, and interference protection is not guaranteed.

## The honest reading

For a beacon builder in the US, the practical positions are:

1. **Part 15 operation**: keep the device within Part 15 field-strength limits; the beacon at low power settings is designed to be capable of this.
2. **The higher settings** exceed the unlicensed envelope and are only defensible in a genuine emergency.
3. **Receive-only use** (SEARCH mode, SDR listening) is always legal.

## The amateur alternative (recommended)

The clean US path is an amateur radio license (Technician class and above), which opens the 70 cm band (420 - 450 MHz) with full privileges up to the power limit the license class allows. The beacon's frequency and identification settings support this directly (see [Amateur License Process](amateur-license-process) and [Callsign Identification](callsign-identification)).

## Emergency use

The FCC's emergency communication provisions apply: in a genuine life-threatening emergency, using the equipment to summon help is protected. The [Emergency Use Legal](emergency-use-legal) page describes the principle, which is universal even though the implementing rules differ by country.

## Related pages

- [Regulatory Compliance](regulatory-compliance) for the framework comparison
- [Amateur License Process](amateur-license-process) for the recommended path
- [Frequency Compatibility](frequency-compatibility) for the band data