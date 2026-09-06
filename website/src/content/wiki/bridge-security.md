---
title: Bridge Security
description: "Why the serial bridge only listens on 127.0.0.1, what data leaves your machine, and how the site talks to the bridge."
---

# Bridge Security

The [serial bridge](serial-bridge-guide) handles position data, so it is worth knowing exactly what it does and does not expose.

## Loopback only

The bridge's tiny HTTP server binds to `127.0.0.1`, the loopback interface. It is not reachable from your local network, and it is never reachable from the internet. Only a program on the same machine (your browser tab) can talk to it.

## What leaves your machine

- The position **link** when the bridge opens the browser: `https://aegis-beacon.vercel.app/report-position?lat=..&lng=..&...`. The coordinates travel over HTTPS to the official site.
- The **page's live polls** go to `127.0.0.1` only; the bridge never uploads anything by itself.
- With `--no-open`, nothing leaves your machine at all: positions are printed and served only to the loopback page.

## What the site can see

The Report Position page is a normal website. When it polls the bridge it asks `http://127.0.0.1:8765/stream?from=page`; the browser performs that request locally. The site itself never learns where you are unless you share the link.

## CORS and the browser

The bridge answers with `Access-Control-Allow-Origin: *` so the HTTPS page may read the response. That is safe here because the endpoint only ever returns the position the device already printed, and only the loopback server holds it.

## Is the beacon data sensitive?

A GPS position is personal data. Treat position links like a shared live location: they reveal where the device was at a given time. The bridge logs every position to the console; clear logs before handing a machine over, and prefer `--no-open` when you only want local logging.

## Related

- [Bridge Automation](bridge-automation)
- [Report Position Page](report-position-page)
- [Privacy Policy](/privacy)