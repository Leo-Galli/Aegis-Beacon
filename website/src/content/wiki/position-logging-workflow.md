---
title: Position Logging Workflow
description: "Capture every beacon position during a mission: bridge setup, live tracking, and the log you keep afterwards."
---

# Position Logging Workflow

A rescue or training scenario produces a stream of positions: the subject's beacon transmits, you home in, and you want a record of where each fix came from. The [serial bridge](serial-bridge-guide) turns that into an automatic log.

## Before you leave

1. Flash **v5.5 firmware** and confirm the `AEGIS:HELLO:` line prints at 115200 baud.
2. Put the beacon on its own charged 18650 (see [USB Power vs Data](usb-power-and-data)).
3. Prepare the logging machine: laptop, or an Android phone with [Termux](termux-serial-bridge).
4. Have a data cable and (for a phone) an OTG adapter.

## During the mission

Start the bridge with logging enabled:

```bash
python bridge/aegis-serial-bridge.py --no-open > mission.log 2>&1
```

`--no-open` keeps the browser out of the way; the terminal shows every `AEGIS:POS:` line as it arrives. If you want live tracking instead, omit `--no-open` and leave the Report Position page open.

## What a log line gives you

```
[device] AEGIS:POS:lat=45.123456;lng=11.123456;alt=1200;sats=8;freq=433.500;mode=BEACON;payload=SOS PSN N4553 E01130
```

Latitude, longitude, altitude, satellites, frequency and the exact payload that went over the air. That is everything you need to reproduce the find afterwards.

## After the mission

Convert the log to a track:

```bash
grep AEGIS:POS mission.log | sed 's/AEGIS:POS://; s/;/ /g' \
  | awk '{print $1, $2}' > track.tsv
```

Load `track.tsv` into any mapping tool (QGIS, Google My Maps, a GPS app) to draw the path you followed. See [Mission Debrief](mission-debrief) for the full debrief routine.

## Related

- [Bridge Automation](bridge-automation)
- [Morse Listening Workflow](morse-listening-workflow)
- [Mission Debrief](mission-debrief)