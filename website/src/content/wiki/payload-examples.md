---
title: Payload Examples
description: Real examples of the beacon's Morse payload, from the minimal SOS to the full identity-plus-coordinates transmission.
---

# Payload Examples

The best way to understand the payload format is to read actual transmissions. This page shows the range, from the minimal to the complete.

## The format in one line

```
SOS DE <IDENTITY> <LATITUDE> <LONGITUDE>
```

Full details and the field-by-field rules are on [Config Payload Format](config-payload-format).

## Example 1: the minimal emergency

With identity and GPS disabled:

```
SOS
```

Three characters, seconds of airtime, unmistakable. This is the fallback when nothing else is configured (see [GPS Failure Contingency](gps-failure-contingency)).

## Example 2: identity added

```
SOS DE IK2XYZ
```

The distress signal plus the callsign: the receiving side now knows WHO. This is the [Callsign Identification](callsign-identification) requirement in its minimal form.

## Example 3: the full payload

```
SOS DE IK2XYZ 45.8325 6.8650
```

Identity plus position: the complete report. The coordinates are in decimal degrees, 5 decimals (see [GPS Coordinate Systems](gps-coordinate-systems)).

## Example 4: the name variant

For the unlicensed builder, the identity can be a name:

```
SOS DE MARIO ROSSI 45.8325 6.8650
```

Only capital letters A-Z and digits transmit (see [Config Payload Format](config-payload-format)), so names are converted to uppercase.

## The airtime math

At 12 WPM, the full payload is roughly 30 - 35 seconds of key-down time (see [Firmware TX Scheduler](firmware-tx-scheduler) for the timing consequences). Keeping the identity short is a battery and duty-cycle decision, not just a style one.

## Related pages

- [Config Payload Format](config-payload-format) for the rules
- [Morse Letter Table](morse-letter-table) for the codes
- [Mode Beacon](mode-beacon) for the mode