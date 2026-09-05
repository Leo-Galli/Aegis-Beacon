---
title: Callsign Identification
description: Why amateur regulations require periodic identification, and how to configure the beacon to send your callsign in Morse.
---

# Callsign Identification

Amateur radio regulations require operators to identify with their callsign periodically. A beacon that transmits endlessly without identification is a rule violation for licensed operators.

## The requirement

Amateur rules (FCC Part 97, and equivalent national rules) require transmission of the assigned callsign at the end of each communication, and at least every 10 minutes during ongoing transmissions.

## How the beacon handles it

The beacon's Morse payload includes an identity section: `SOS DE [FIRSTNAME] [LASTNAME]`. If you set the first and last name fields to your callsign format, the beacon sends identification on every cycle:

- FIRST NAME: `IW9ABC` (or your callsign)
- LAST NAME: `/M` (portable indicator) or leave empty

The payload becomes `SOS DE IW9ABC` - valid identification at the end of each transmission cycle.

## Practical configuration

1. Enter CONFIG mode.
2. Enable "Include name in beacon".
3. Set FIRST NAME to your callsign.
4. Set LAST NAME to a portable indicator if needed (e.g. `/P` for portable, `/M` for mobile).
5. Save and reboot.

## The 10-minute rule

With a 10 s cycle, the beacon identifies every cycle, which exceeds the 10-minute requirement easily. In EMERGENCY mode it identifies continuously, which is fine and appropriate.

## Non-amateur use

If you are not a licensed amateur, you do not have a callsign. Use your name (or the team's name) in the identity fields instead; there is no identification rule for unlicensed emergency use, and a name in the payload is more useful to rescuers anyway.