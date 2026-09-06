---
title: Extending the Serial Protocol
description: "Add new AEGIS: lines and serial commands to the firmware: where the code lives and the conventions to follow."
---

# Extending the Serial Protocol

The serial protocol is deliberately small, but it is also easy to grow. This page shows where the code lives and the conventions that keep it parseable by the [bridge](serial-bridge-guide) and any other client.

## Where the code lives

In `AegisBeacon.ino`, before `setup()`:

- `serialPosReport(bool force)` prints `AEGIS:POS:` lines (throttled unless forced).
- `processSerialCommand(const char* cmd)` handles inbound commands.
- `serialPoll()` reads newline-terminated lines from `Serial` and calls `processSerialCommand`.
- `serialPoll()` is called from every mode loop: beacon sleep, search, config, and the GPS wait.

## Adding an outgoing line

1. Print with plain `Serial.printf` - never the colored `LOG_*` macros - so the line has no ANSI escapes.
2. Keep the `AEGIS:` prefix and a single `TYPE:` label.
3. Use `key=value;` fields, ASCII only, one line per record.
4. Document the format in the [Serial Command Protocol](serial-command-protocol) page.

Example:

```cpp
Serial.printf("AEGIS:BAT:mv=%d;percent=%d\n", mv, pct);
```

## Adding an inbound command

1. Add a `striStarts(s, "CMD ")` branch in `processSerialCommand`.
2. Validate ranges the way `FREQ` does, and reply with `AEGIS:CMD:...` on success or `AEGIS:ERR:...` on failure.
3. Persist with `saveConfig()` when the setting must survive reboot.
4. Document it in the protocol page and in the bridge README.

## Conventions

| Rule | Why |
| --- | --- |
| Plain `Serial.printf` only | Clients must not strip ANSI codes |
| One record per line, `\n` terminated | `readline()` in any language works |
| `AEGIS:` prefix on every line | The bridge ignores everything else |
| Lowercase keys | Clients parse case-sensitively |
| SI units in field names | `alt` in meters, `freq` in MHz |
| Throttle position spam | `serialPosReport` keeps a 5 s floor |

## Testing

Flash, open a monitor, and exercise both directions: send `HELP`, `POS`, `STATUS`, and confirm the replies. Then run the bridge with `--verbose` and check the new lines pass through cleanly.

## Related

- [Serial Command Protocol](serial-command-protocol)
- [Serial Bridge Guide](serial-bridge-guide)
- [Code Style Guide](code-style-guide)