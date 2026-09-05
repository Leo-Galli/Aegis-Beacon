---
title: "CONFIG Payload Format"
description: "How the dashboard builds the Morse payload from message, name, and GPS, and what each part of the payload means"
---

# CONFIG Payload Format

## Overview

The dashboard shows a live preview of the Morse payload as you configure the beacon. The payload is what the beacon will transmit in BEACON mode, rendered first as text and then as Morse code. Understanding the payload format helps you predict what will be transmitted before you save and deploy.

The payload is built from three optional parts: the base message, the operator name, and the GPS coordinate.

## Base Message

The base message is the free-text field in the dashboard, defaulting to `SOS`. The firmware uppercases it and limits it to a reasonable length. Only characters that have a Morse representation are transmitted; anything without a mapping is skipped.

The base message is always present. If you leave it as `SOS`, the payload starts with `SOS`.

## Name

When the name-in-beacon toggle is enabled, the payload includes the operator name after the base message, using the format `DE <FIRST> <LAST>`.

`DE` is the Morse prosign convention for "from" or "this is". The first and last name fields are uppercased and trimmed. If one is empty, only the other is included.

Example with both names:

```
SOS DE MARIO ROSSI
```

Example with only first name:

```
SOS DE MARIO
```

## GPS Coordinate

When GPS is enabled and the GPS-in-beacon toggle is enabled, and the module has a fix, the payload includes a compact coordinate after the name.

The coordinate uses the short form:

```
PSN N4553 E01230
```

`PSN` means position. The coordinate is degrees and minutes only, truncated to fit Morse. North latitudes start with `N`, East longitudes with `E`.

The full example payload with message, name, and GPS is:

```
SOS DE MARIO ROSSI PSN N4553 E01230
```

If GPS is enabled but there is no fix, the coordinate is not included. The payload then ends with the name, or with just the base message if the name is also off.

## Order of Parts

The payload is assembled in this order:

1. Base message.
2. `DE` and the operator name, if name is enabled.
3. `PSN` coordinate, if GPS is enabled, GPS-in-beacon is enabled, and a fix exists.

Nothing is omitted from the middle. If name is off, the payload goes straight from message to GPS. If GPS has no fix, the payload ends after the name.

## Morse Preview

The dashboard shows the Morse equivalent below the text payload. It is a direct translation using the standard Morse table:

- Letters A through Z.
- Digits 0 through 9.
- Space between words becomes a longer gap in the Morse output.

The preview updates as you type, so you can see the Morse grow as you add a name or change the message.

## Why the Short Coordinate Format

The coordinate is truncated to degrees and minutes because the full decimal coordinate would be long in Morse and would not add much value for a rescue beacon. Degrees and minutes are precise enough to narrow a search to a small area, which is the intended use.

If you need more precision, the full coordinates are still logged on Serial for field work. The payload just uses the short form to keep transmissions short.

## What Is Not Transmitted

The payload does not include:

- Device serial number.
- Battery voltage.
- Timestamps.
- Raw NMEA sentences.
- Any data that is not message, name, or coordinate.

The payload is intentionally small and human-readable. A receiver that hears it should be able to copy the message, the operator, and a rough position by ear.

## Payload Length and TX Time

Longer payload means longer transmission time. Each extra word adds Morse symbols and gaps. If you are concerned about battery life or airtime, keep the message short and decide whether you need the name and coordinate.

The repeat count multiplies the transmission time. Lower repeat count and shorter payload reduce battery use.

## Related Pages

- [CONFIG Mode](/wiki/mode-config) — how the payload is used during beaconing.
- [NEO-6M GPS Module](/wiki/nx130-gps-module) — the GPS side of the coordinate.
- [Morse Code Engine](/wiki/morse-code-engine) — how the payload is converted to Morse.
