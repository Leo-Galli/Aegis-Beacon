---
title: Serial Command Automation
description: "Drive the beacon's serial commands from scripts and CI: expect-style flows, batch configuration and verification."
---

# Serial Command Automation

The [serial commands](serial-command-protocol) turn the beacon into a scriptable device. This page is about driving them from your own code, for bench testing and repeatable configuration.

## The interaction model

Commands are plain lines; replies are `AEGIS:` lines. A session looks like:

```
> FREQ 433.775
AEGIS:FREQ:0=433.775
> WPM 14
AEGIS:WPM:14
> STATUS
AEGIS:STATE:mode=BEACON;freq=433.775;wpm=14;...
```

`MODE` is the only command that reboots; after it, wait for the new `AEGIS:HELLO:` line before sending anything else.

## Python example

```python
import serial
ser = serial.Serial("COM3", 115200, timeout=2)
ser.write(b"FREQ 433.775\n")
print(ser.readline().decode().strip())   # AEGIS:FREQ:0=433.775
```

## Bash example

```bash
python - <<'EOF'
import serial, time
s = serial.Serial("/dev/ttyUSB0", 115200, timeout=3)
time.sleep(0.5)
for cmd in (b"FREQ 433.500\n", b"WPM 14\n", b"STATUS\n"):
    s.write(cmd)
    print(s.readline().decode().strip())
EOF
```

## Reading the position stream

Position lines arrive continuously once a fix exists. Read until you see `AEGIS:POS:`:

```python
for _ in range(60):
    line = ser.readline().decode(errors="replace")
    if line.startswith("AEGIS:POS:"):
        print(line.strip())
        break
```

## Batch configuration with the bridge

Run the bridge with piped commands to configure and observe in one session (see [Bridge Automation](bridge-automation)):

```bash
{ echo "FREQ 433.775"; echo "WPM 14"; } | python bridge/aegis-serial-bridge.py --no-open
```

## CI and bench rigs

Add a serial smoke test to a bench rig: flash, then assert that `HELP`, `FREQ?` and `STATUS` each produce the expected `AEGIS:` reply. This catches protocol regressions before they reach the field.

## Related

- [Serial Command Protocol](serial-command-protocol)
- [Bridge Automation](bridge-automation)
- [Unit Testing the Firmware](unit-testing-firmware)