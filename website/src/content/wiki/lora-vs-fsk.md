---
title: LoRa vs FSK
description: "The two modulation modes of the SX1262: LoRa sensitivity versus FSK compatibility, and which the beacon uses and why."
---

# LoRa vs FSK

The SX1262 supports two modulations: LoRa (proprietary spread-spectrum) and FSK (standard frequency-shift keying). The beacon can use either, and the choice changes who can hear it.

## The comparison

| Property | LoRa | FSK |
| --- | --- | --- |
| Sensitivity | Down to about -137 dBm | About -120 dBm |
| Interference rejection | Excellent | Standard |
| Decodable by | Only LoRa radios | Nearly any radio |
| Data rate at sensitivity | Low | Higher |
| Bandwidth use | Wide (spread) | Narrow |

## The compatibility axis

FSK at 433 MHz is what generic receivers, scanners and PMR446-adjacent hardware expect: a 5 kHz deviation FSK signal is audible on any FM receiver as a tone burst. LoRa is only audible to another LoRa radio, which is the [E22 modules](e22-radio-module-guide) or a LoRa SDR setup.

## What the beacon does

The firmware supports both, selected in CONFIG mode:

- **FSK**: the compatible default for a rescue device, decodable by the broadest set of receivers (see [Receiver Compatibility](receiver-compatibility)).
- **LoRa**: the sensitive mode, used between two beacons or with a matching receiver when range beats compatibility.

## The range difference

At the same power, LoRa's sensitivity advantage is worth 10 - 15 dB, roughly doubling the range in open terrain. That is real. The reason the beacon defaults to FSK anyway is the mission: being heard by whatever is out there beats being heard farther by fewer things.

## Related pages

- [Modulation in the Beacon](modulation-in-the-beacon) for the project's modulation
- [Sensitivity vs Selectivity](sensitivity-vs-selectivity) for the receiver theory
- [Receiver Compatibility](receiver-compatibility) for who hears what