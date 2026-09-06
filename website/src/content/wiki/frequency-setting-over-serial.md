---
title: Frequency Setting over Serial
description: "Set the beacon's desired frequency with the FREQ serial command, verify it, and persist it without the dashboard."
---

# Frequency Setting over Serial

The fastest way to put the beacon on a specific frequency is the `FREQ` serial command from v5.5. No dashboard, no button dance: one line, persisted.

## The command

```
FREQ 433.500
```

Rules:

- Range is **410-525 MHz**, matching the SX1262's coverage (see [SX1262 Frequency Ranges](sx1262-frequency-ranges)).
- The value is written to the beacon's primary frequency slot (`freqs[0]`) and saved to NVS, so it survives deep sleep and reboot.
- Out-of-range values are rejected with `AEGIS:ERR:...`.

## Verify

```
FREQ?
```

prints every configured frequency:

```
AEGIS:FREQ:0=433.500
```

Or use `STATUS` to see the active frequency in the state line.

## Where to type it

- Any serial monitor at 115200 baud (see [Serial Monitor Guide](serial-monitor-guide)).
- The [serial bridge](serial-bridge-guide) terminal: commands typed while the bridge runs are forwarded to the device.

## Typical use

| Goal | Command |
| --- | --- |
| Primary channel | `FREQ 433.500` |
| Channel with known activity | `FREQ 433.775` |
| PMR safety channel inside range | `FREQ 446.08125` (see [Frequency Compatibility](frequency-compatibility)) |
| Back to default | `FREQ 433.500` |

## What the beacon does with it

The first configured frequency is used for the next beacon cycle, and the hop sequence still cycles all configured frequencies in order. To transmit on only the new frequency, configure a single-frequency list in the dashboard.

## Related

- [Serial Command Protocol](serial-command-protocol)
- [Frequency Compatibility](frequency-compatibility)
- [Configuration Reference](configuration-reference)