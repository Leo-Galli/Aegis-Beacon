---
title: "Serial Debug System"
description: "Log tag reference, colours, verbose mode and a healthy annotated boot log"
---

# Serial Debug System

## Overview

The firmware logs structured, tagged output over USB serial at **115200 baud, 8N1**. Every log line follows the same shape:

```text
[   elapsed_ms][TAG  ] message
```

The elapsed time in milliseconds since boot makes it easy to correlate events across the whole boot and TX cycle.

## Log Tags

| Tag | Colour | Meaning |
|-----|--------|---------|
| `[INFO ]` | Cyan | Normal operation |
| `[OK   ]` | Green | Successful operation |
| `[WARN ]` | Yellow | Non-fatal anomaly |
| `[ERROR]` | Red | Hardware / radio failure |
| `[MODE ]` | Magenta | Mode change event |
| `[SCAN ]` | Blue | RSSI scan result + ASCII bar graph |
| `[BTN  ]` | White | Button event + hold duration |
| `[CFG  ]` | White | Dashboard save / NVS load |
| `[OLED ]` | Magenta | Display event |
| `[AUDIO]` | Green | Audio tone event |
| `[GPS  ]` | Cyan | GPS engine (fix, satellites, coordinates) |
| `[ADJ  ]` | Gray | Button adjustment (vol/WPM change) |
| `[BAT  ]` | Green | Battery reading (mV, %, charging state) |
| `[MORSE]` | Gray | Per-symbol Morse timing (verbose only) |
| `[RF   ]` | Gray | RadioLib state codes (verbose only) |

## Verbose Mode

Set `DEBUG_VERBOSE 1` at the top of the firmware to enable the two per-symbol tags:

- `[MORSE]` logs every dot/dash with its measured unit timing.
- `[RF   ]` logs RadioLib state codes around each radio call.

Verbose mode is off by default because it floods the console during a long payload transmission.

## Healthy BEACON Boot With GPS

```text
============================================================
  AEGIS-BEACON v5.4 - SX1262+GPS+BTN+BAT+SSD1309
============================================================
    Active mode: BEACON

[       5][INFO ] Boot #1  reset_reason=1  heap=290244 B  cpu=240MHz
[      22][BAT  ] Boot battery: 87%  4100mV  charging=NO
[      40][OK   ] OLED ready - SSD1309 128x64
[      42][AUDIO] LEDC GPIO25 (DAC1) ch0 @ 40000 Hz 8-bit
[      45][GPS  ] Waiting for GPS fix (timeout 30s)...
[   12400][GPS  ] Fix acquired: 45.53124  12.30456  sats=6
[   12401][INFO ] Payload ready: "SOS DE MARIO ROSSI PSN N4553 E01230"
[   12410][MODE ] Starting: BEACON
[   12480][OK   ] SX1262 CW TX ready: 433.500 MHz @ 17 dBm
[   12481][INFO ] TX: "SOS DE MARIO ROSSI PSN N4553 E01230" (31 chars) @ 13WPM
[   57600][OK   ] TX done: 31 chars in 45119 ms
[   57605][BAT  ] VBAT=4098mV  pct=87%  ADC=2148  charging=NO
[   57610][INFO ] Deep sleep 10 s...
```

## Typical SEARCH Scan Output

```text
[  42381][SCAN ] [0] 433.500 MHz  RSSI=-112 dBm  |....................| quiet
[  42784][SCAN ] [1] 434.500 MHz  RSSI= -87 dBm  |#########...........| *** HIT ***
[  42785][SCAN ] HIT: 434.500 MHz -87 dBm [MEDIUM]  total=1
[  43188][SCAN ] [2] 435.000 MHz  RSSI=-109 dBm  |....................| quiet
```

The ASCII bar graph is 20 columns wide, scaled from the detection threshold up to -40 dBm, so a hit is visible at a glance.

## Reading the Boot Line

```text
[INFO ] Boot #1  reset_reason=1  heap=290244 B  cpu=240MHz
```

| Field | Meaning |
|-------|---------|
| `Boot #1` | Value of the RTC boot-cycle counter (survives deep sleep) |
| `reset_reason=1` | ESP32 power-on reset reason code |
| `heap` | Free heap at boot, useful to spot memory leaks |
| `cpu` | Configured CPU frequency |

> [!TIP]
> A `heap` figure that keeps dropping across repeated cycles in the same session points to a memory leak in whatever mode you are exercising.
