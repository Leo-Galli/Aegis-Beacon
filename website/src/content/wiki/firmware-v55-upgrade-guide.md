---
title: Upgrading to v5.5
description: "How to upgrade the beacon from v5.4 (or older) to v5.5: what changes, what carries over, and what to re-verify."
---

# Upgrading to v5.5

Upgrading from v5.4 to v5.5 is a firmware-only change: same hardware, same wiring, same NVS keys. Older versions need the hardware checklist below.

## From v5.4

1. Pull the latest source: `git pull` (or download the v5.5.0 release).
2. Flash: `pio run -t upload` from the repo root.
3. The config carries over from NVS, but re-verify the basics after boot (below).

## From v5.0-v5.3

The v5.4 hardware requirements apply: NEO-6M GPS on UART2, the current pin map. Flash v5.5 and run the [first-use checklist](first-use). A factory reset (MODE+SEL at boot for 5 s) is recommended so stale keys cannot cause odd behavior.

## From v4.0

Do not flash v5.x on v4.0 hardware. The GPIO map, radio, display and libraries are all different. See [Version Selection](version-selection).

## What changed in the serial story

| Area | v5.4 | v5.5 |
| --- | --- | --- |
| Serial output | Debug log only | Debug log + `AEGIS:` machine lines |
| Serial commands | None | `FREQ`, `WPM`, `MODE`, `POS`, `STATUS`, `HELP` |
| Position reporting | Not available | `AEGIS:POS:` lines + [bridge](serial-bridge-guide) + [Report Position page](report-position-page) |
| Dashboard fonts | Web fonts (needed internet) | Default system fonts |

## After boot, verify

1. **Serial**: open a monitor at 115200 baud; expect the banner and `AEGIS:HELLO:ver=5.5;...`.
2. **Position**: outdoors, expect `AEGIS:POS:` lines once a fix lands (see [GPS Fix Capture Tips](gps-fix-capture-tips)).
3. **Commands**: send `FREQ?` and `STATUS` and confirm sane replies.
4. **Bridge**: run `python bridge/aegis-serial-bridge.py --no-open` and confirm positions print.

## Rollback

Keep the v5.4.0 release binary; re-flashing it restores the old behavior. NVS keys are shared, so a factory reset after rollback is a good idea.

## Related

- [What's New in v5.5](whats-new-v55)
- [Changelog](changelog)
- [Version Selection](version-selection)