---
title: Report Position Page
description: "What the website's /report-position page does, how it fills itself in, and how to test it without hardware."
---

# Report Position Page

The website has a dedicated page for receiving the beacon's position: **/report-position**. It is the destination of the [serial bridge](serial-bridge-guide) and the simplest way to turn a Morse transmission into a map point.

## What the page shows

- **Live map**: an embedded map (OpenStreetMap, no API key) with a marker at the current position and a track line that grows as new fixes arrive. As the person moves and the beacon reports again, the marker advances and the track traces the movement. A Clear track button resets the view.
- **Live position**: latitude, longitude, altitude, satellite count, frequency and mode, plus the exact Morse payload, in a read-only console panel.
- **Status line**: tells you whether data came from a link, from the bridge, or is still waiting. When the firmware reports a stale fix (`fix=0`), the line says so instead of pretending the position is fresh.
- **Map links**: one click to Google Maps and OpenStreetMap at the received coordinates.
- **Copy link**: a shareable link with the position embedded.
- **Test box**: paste an `AEGIS:POS:` line to see the form fill without any hardware.

## How data gets in

Two paths, same result:

1. **Link**: the bridge (or any tool) opens `/report-position?lat=..&lng=..&freq=..&payload=..`. The page reads the query string on load and fills the form. Works in every browser, including Safari, with no extra software.
2. **Live stream**: the page polls `http://127.0.0.1:8765/stream?from=page` every 1.5 seconds. When the bridge is running, this poll both tells the bridge the page is open (so it stops opening new tabs) and delivers every new fix into the form.

The page never requires an account, and the coordinates only ever travel over HTTPS to the page you choose to open.

## Browser behavior

| Browser | Live stream | Link fill |
| --- | --- | --- |
| Chrome / Edge | Yes | Yes |
| Firefox | Yes | Yes |
| Safari | No (poll blocked) | Yes |

## Testing without hardware

Open the page and paste this into the test box:

```
AEGIS:POS:lat=45.123456;lng=11.123456;alt=1200;sats=8;freq=433.500;mode=BEACON;fix=1;age=87;payload=SOS PSN N4553 E01130
```

The fields fill immediately, the map links enable, and the marker lands on the map. Paste a second line with different coordinates to watch the track draw between the two points.

## Related

- [Serial Bridge Guide](serial-bridge-guide)
- [Position Logging Workflow](position-logging-workflow)
- [Serial Command Protocol](serial-command-protocol)