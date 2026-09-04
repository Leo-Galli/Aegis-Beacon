---
title: "WiFi and Security"
description: "How the open access point works, its limits, and safe practices around CONFIG mode"
---

# WiFi and Security

## Overview

CONFIG mode starts an **open** WiFi access point - no password - serving the dashboard on 192.168.4.1. This is deliberate (a password you must remember defeats field configuration) but it has real security implications.

## The Design

| Aspect | Value |
|--------|-------|
| SSID | `AegisBeacon` |
| Encryption | None (open) |
| Dashboard auth | None |
| Range | ~10 m indoor |
| Auto-revert | 5 minutes without a client |

## Threats

| Threat | Realistic? | Mitigation |
|--------|------------|------------|
| Someone changes your config | Only within ~10 m | Use CONFIG only at home/trusted spots |
| Payload snooping | Config contains no secrets | No private data stored |
| Firmware tampering via WiFi | Not supported | No OTA/update endpoint exists |
| Jamming | Possible | Radio is off in CONFIG anyway |

## Safe Practices

1. Enter CONFIG only where you trust the surroundings.
2. Save and reboot as soon as the settings are applied.
3. Never leave the beacon in CONFIG during a deployment.
4. Prefer configuring at home, in the car, or at a hut - not on a public square.

## Related Pages

- [CONFIG Mode](/wiki/mode-config)
- [WiFi Configuration Portal](/wiki/wifi-config-portal)
- [Dashboard HTTP API](/wiki/dashboard-http-api)
- [Configuration Reference](/wiki/configuration-reference)
