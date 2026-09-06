---
title: One Bridge, Several Beacons
description: "Log positions from multiple beacons with a single bridge, one USB port at a time, and how to keep them apart."
---

# One Bridge, Several Beacons

A training day often means several beacons. The bridge reads one USB port at a time, but that is enough: you do not need one bridge per beacon, just a routine for rotating them.

## How it works

The bridge holds one serial port and prints every `AEGIS:POS:` line it sees. Beacons are identical hardware, so the log alone cannot tell two units apart. The payload can: when names are enabled, `payload=SOS DE MARCO PSN ...` identifies the unit. Keep names configured (see the [Config Dashboard](config-dashboard) identity card).

## The rotation routine

1. Plug in beacon A, let it log a few fixes, unplug.
2. Plug in beacon B. The bridge reconnects automatically (it retries every 2 seconds).
3. Between beacons, send `POS` to confirm which unit is on the line.

The bridge log shows the reconnection gaps, which also mark unit boundaries.

## Keeping the log clean

Tag each session by starting the bridge fresh per beacon:

```bash
python bridge/aegis-serial-bridge.py --no-open > beacon-marco.log
# ... later ...
python bridge/aegis-serial-bridge.py --no-open > beacon-lena.log
```

## Multiple bridges, multiple beacons

Nothing stops you from running several bridge instances on one machine if it has several USB ports. Give each its own HTTP port:

```bash
python bridge/aegis-serial-bridge.py --port COM3 --http-port 8765
python bridge/aegis-serial-bridge.py --port COM4 --http-port 8766
```

Only the default port (8765) feeds the website page; the second instance is for logging only.

## Related

- [Bridge Automation](bridge-automation)
- [Position Logging Workflow](position-logging-workflow)
- [Mission Debrief](mission-debrief)