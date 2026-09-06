---
title: Bridge Automation
description: "Use the serial bridge headlessly: log positions to files, script sessions, and integrate with your own tools."
---

# Bridge Automation

The [serial bridge](serial-bridge-guide) is built for humans, but it is also a plain script, so it slots into automation easily.

## Log positions to a file

Run the bridge with `--no-open` and redirect output:

```bash
python bridge/aegis-serial-bridge.py --no-open > mission-$(date +%F).log
```

Every `AEGIS:POS:` line lands in the file with a timestamp from the device log lines. Grep them later:

```bash
grep AEGIS:POS mission-2026-09-06.log
```

## Parse with your own tools

The protocol is stable text: `AEGIS:POS:lat=..;lng=..;alt=..;sats=..;freq=..;mode=..;payload=..`. A one-liner turns the log into CSV:

```bash
grep AEGIS:POS mission.log | sed 's/AEGIS:POS://; s/;/ /g' | awk '{print $1, $2, $3, $4}'
```

## Script a test session

The bridge forwards commands you type to the device, so a scripted session can drive a whole bench test:

```bash
{
  echo "FREQ 433.500"
  echo "WPM 14"
  echo "MODE SEARCH"
} | python bridge/aegis-serial-bridge.py --no-open
```

## Loop the bridge

The bridge reconnects automatically when the device is unplugged and replugged (it retries every 2 seconds), so you can leave it running under `nohup` or as a service:

```bash
nohup python bridge/aegis-serial-bridge.py --no-open >> bridge.log 2>&1 &
```

## HTTP for your own dashboard

The bridge serves `GET /stream` on `127.0.0.1:8765`. Any local script can read the latest position:

```bash
curl -s http://127.0.0.1:8765/stream
```

This is exactly what the Report Position page polls; see [Bridge Security](bridge-security) for why loopback-only is the right default.

## Related

- [Serial Command Automation](serial-command-automation)
- [Position Logging Workflow](position-logging-workflow)
- [Bridge Security](bridge-security)