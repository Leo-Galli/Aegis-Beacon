---
title: Off-Grid Position Sharing
description: "Share beacon positions with no internet: bridge links over mesh, serial copy, and radio voice relay."
---

# Off-Grid Position Sharing

The [Report Position Page](report-position-page) needs the internet to open. In the field you often have none. Positions can still be shared three ways, in increasing order of sophistication.

## 1. Copy it by voice

The position is in the Morse payload itself. Anyone who copies `N4553 E01230` has the coordinates. Practice until a payload takes one pass (see [Morse Listening Workflow](morse-listening-workflow)).

## 2. Read it from the OLED or the bridge

- The beacon's OLED shows coordinates on the GPS WAIT and BEACON screens.
- The bridge prints every `AEGIS:POS:` line; read them over the radio: "Position, four five decimal one two three, north, one one decimal three four, east."

## 3. Bridge over local networks

If you have a local network but no internet (a cabin router, a mesh phone app):

- Run the bridge on one machine and set `--site http://<laptop-ip>:4321` serving the site locally, or
- Simpler: the bridge prints the coordinates; relay them by voice or by copying the link text over a local chat app. The link itself needs internet, but the *data* in it does not.

## What not to do

Do not send coordinates in the clear on channels that require licensing without authorization; see [Emergency Use Legal](emergency-use-legal) and [Regulatory Compliance](regulatory-compliance).

## Related

- [Position Reporting](position-reporting)
- [Group Communication Plan](group-communication-plan)
- [Emergency Communication Basics](rescue-communication-basics)