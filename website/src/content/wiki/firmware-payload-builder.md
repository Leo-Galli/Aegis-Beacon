---
title: The Payload Builder
description: How the firmware assembles the Morse message from message base, name, and GPS coordinates.
---

# The Payload Builder

Every transmission starts with a string. The payload builder combines three parts into the final Morse message.

## The three parts

| Part | Source | Example |
|------|--------|---------|
| Message base | Dashboard "SOS message base" | `SOS` |
| Identity | First/last name, if enabled | `DE MARIO ROSSI` |
| Position | GPS, if enabled and fixed | `PSN N4553 E01230` |

## Assembly order

The firmware concatenates in a fixed order:

```
SOS DE MARIO ROSSI PSN N4553 E01230
```

Each part is added only if its feature is enabled and (for GPS) a fix is available. Missing GPS yields `PSN UNKN`; missing name omits the `DE` section entirely.

## The preview in the dashboard

The dashboard shows this assembly live as you type. The preview is computed in JavaScript the same way the firmware computes it in C++: message + optional name + optional position.

## Name rules

- Only A-Z (uppercase) letters are transmitted; lowercase is uppercased, digits and spaces are handled as Morse allows.
- Keep names short: every letter costs airtime (~92 ms per dot at 13 WPM, more for dashes).
- Names with apostrophes or accents should be avoided or spelled out (e.g. `D`AN` becomes `D AN` or just `DAN`).

## GPS encoding

Coordinates are encoded as truncated DDM:

- `N4553` = 45 degrees 53 minutes North (45.883 N)
- `E01230` = 12 degrees 30 minutes East (12.50 E)

Each coordinate is 5 characters: hemisphere letter + 2 digit degrees + 2 digit minutes (with tenths). See the GPS pages for the full encoding.

## Character set and Morse mapping

The firmware maps A-Z, 0-9, and a few prosigns to Morse. Characters outside the set are skipped (not transmitted). The Morse engine page has the full table.

## Empty payload edge cases

- Message base empty: the firmware falls back to `SOS`.
- Name enabled but empty: the `DE` section is omitted.
- GPS enabled but never fixed: `PSN UNKN` after the timeout.