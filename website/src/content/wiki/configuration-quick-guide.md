---
title: Configuration Quick Guide
description: "The fast path to a configured beacon: the settings that matter, the order to set them, and the verification."
---

# Configuration Quick Guide

Configuring the beacon is a short checklist: the settings that matter, set in an order that catches mistakes early. The full flow is on [Mode Config](mode-config).

## The order

| Step | Setting | Value |
| --- | --- | --- |
| 1 | Frequency | Your planned channel (see [Frequency Table Reference](frequency-table-reference)) |
| 2 | Power | Legal floor for routine use (see [E22 Power Levels](e22-power-levels)) |
| 3 | Sleep interval | 10 s default |
| 4 | Tone speed | 12 WPM default |
| 5 | Identity | Your callsign or name (see [Config Payload Format](config-payload-format)) |
| 6 | Message base | SOS (default) |
| 7 | GPS | On, or manual coordinates entered |
| 8 | Save and reboot | Settings survive (see [Config Backup](config-backup)) |

## The paths

| Path | When |
| --- | --- |
| Buttons (CONFIG mode) | Always available (see [Mode Config](mode-config)) |
| WiFi portal | With a phone (see [WiFi Config Portal](wifi-config-portal)) |
| Serial commands | Displayless builds (see [Serial Monitor Guide](serial-monitor-guide)) |

## The verification

After configuring: reboot, `config dump` over serial, fire one test burst, and confirm the decoded payload shows what you set (see [Pack Check Routine](pack-check-routine)).

## The backup

Once verified: back up the config (see [Config Backup](config-backup)). The next firmware update will thank you.

## Related pages

- [Mode Config](mode-config) for the flow
- [Configuration Reference](configuration-reference) for the full list
- [Quick Reference Sheet](quick-reference-sheet) for the one-pager