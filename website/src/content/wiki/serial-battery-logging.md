---
title: Battery Logging over Serial
description: "Record the beacon's battery state over time with the STATUS command and the bridge, and what the numbers mean."
---

# Battery Logging over Serial

The v5.4+ firmware reports battery state on the OLED, but for a proper discharge curve you want a time series. The serial port gives you one: poll `STATUS`, or watch the OLED values and log them by hand.

## The quick way

The `STATUS` command returns live state:

```
AEGIS:STATE:mode=BEACON;freq=433.500;wpm=12;vol=64;heap=184320;boot=1;tx=0;hits=0;gpsFix=1;sats=8
```

Battery voltage itself is exposed on the OLED and in the dashboard; a full serial battery field is planned as a protocol extension (see [Extending the Serial Protocol](extending-serial-protocol)).

## Logging by script

Poll once a minute from a script and record time + displayed percentage:

```python
import serial, time
s = serial.Serial("COM3", 115200, timeout=2)
while True:
    s.write(b"STATUS\n")
    print(time.strftime("%H:%M:%S"), s.readline().decode().strip())
    time.sleep(60)
```

## Interpreting the numbers

| Reading | Meaning |
| --- | --- |
| `vol=64` | Audio volume (0-255), not voltage |
| `heap=...` | Free heap in bytes |
| `boot=1` | Boot cycle count (RTC-persisted) |
| `tx=0` | TX cycles since last reset |
| `gpsFix=1` | A valid fix is held |
| `sats=8` | Satellites in use |

For voltage, read the OLED battery icon and the dashboard bar, or add a serial field by extending the protocol. See [Battery Monitor Details](battery-monitor-details) for the curve.

## Bench discharge

1. Flash v5.5, fully charge the cell.
2. Run the logger overnight at 1-minute intervals.
3. Compare the displayed percentage against a multimeter at key points.
4. Use the curve to calibrate the battery monitor if needed (see [Battery Monitor Calibration](battery-monitor-calibration)).

## Related

- [Battery Monitor Details](battery-monitor-details)
- [Serial Command Automation](serial-command-automation)
- [Current Draw by Mode](current-draw-by-mode)