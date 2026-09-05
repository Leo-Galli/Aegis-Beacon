---
title: Antenna Troubleshooting
description: "The antenna fault checklist: broken coax, bad connectors, detuning, and the test sequence that isolates the problem."
---

# Antenna Troubleshooting

Antenna faults are the most common cause of "the beacon transmits but nobody hears it". The checklist is short, and the tests are simple.

## The symptom list

| Symptom | Likely cause |
| --- | --- |
| Range much shorter than before | Damaged coax or connector |
| Range short from day one | Wrong antenna for the band, or no ground plane |
| SWR high on one channel only | Narrow-band antenna, wrong tuning |
| SWR varies when you touch it | Bad connector or ground connection |
| Sudden total failure | Antenna snapped at the base |

## The test sequence

1. **Visual**: inspect the coax for kinks, the connector for corrosion, the whip for cracks.
2. **Multimeter**: continuity center-to-center, shield-to-shield; NO continuity center-to-shield.
3. **SWR**: measure across the whole band (see [VSWR Measurement](vswr-measurement)).
4. **Range test**: the two-beacon test against a known-good antenna (see [Two Beacon Bench Test](two-beacon-bench-test)).

## The classic mistakes

| Mistake | Why it fails |
| --- | --- |
| RP-SMA antenna on SMA mount | Does not mate properly |
| 2.4 GHz WiFi antenna | Wrong band entirely |
| Whip without ground plane | No return path (see [Quarter Wave Antenna](quarter-wave-antenna)) |
| Coax pinched in the case seam | Short or broken center conductor |
| Metal battery against the antenna | Detuning (see [Antenna Mounting](antenna-mounting)) |

## The wet antenna

Water in a connector adds loss and corrosion. After any wet trip: dry the connector, check the SWR again, and treat a slowly rising SWR over weeks as water ingress, not mystery.

## Related pages

- [Antenna Testing and Tuning](antenna-testing-and-tuning) for the full procedure
- [Antenna Cable and Connectors](antenna-cable-connectors) for the parts
- [Troubleshooting RF](troubleshooting-rf) for the radio-side faults