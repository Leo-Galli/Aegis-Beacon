---
title: "Boot Process"
description: "What happens between power-on and the first transmission: RTC restore, GPS wait, radio init"
---

# Boot Process

## Overview

Every boot follows the same ordered sequence, whether it is a cold power-on, a wake from deep sleep, or a reboot after a dashboard save. Understanding the order helps you read the serial log and diagnose slow starts.

## Boot Sequence

| Step | What happens | Serial tag |
|------|--------------|------------|
| 1 | ESP32 starts, hardware watchdog armed | `[INFO ]` Boot #N |
| 2 | NVS configuration loaded (with fail-safe defaults) | `[CFG  ]` |
| 3 | RTC RAM state restored: mode, counters, GPS cache | `[INFO ]` |
| 4 | Battery sampled and displayed | `[BAT  ]` |
| 5 | OLED initialized (SSD1309 via U8g2) | `[OK   ]` |
| 6 | Audio DAC + LEDC carrier started | `[AUDIO]` |
| 7 | Optional GPS fix wait (if enabled and no cache) | `[GPS  ]` |
| 8 | Radio initialized for the restored mode | `[OK   ]` |
| 9 | Mode loop begins | `[MODE ]` |

## Restoring the Mode

The mode is read from RTC RAM (`g_currentMode`), not from NVS. This is intentional:

- If the device went to sleep in BEACON mode, it wakes and transmits again without user input.
- If it was in SEARCH mode, the scan continues where it left off.
- EMERGENCY mode survives even a full power cycle via `g_emergencyActive`.

## GPS Wait Screen

When GPS is enabled and no valid fix is cached in RTC RAM, the device shows the **ACQUIRING GPS FIX** screen:

- Large satellite count
- Elapsed progress bar
- Coordinates once a fix lands, or `MODE: skip wait`

The wait ends when any of these happens first:

1. A fix is acquired (minimum 3 satellites).
2. The configurable timeout expires (`gpstmo`, default 30 s).
3. The user presses SW_MODE to skip the wait.

If the timeout expires without a fix, the payload uses `PSN UNKN` and transmission starts anyway.

## Radio Initialization

For BEACON and EMERGENCY modes the firmware brings up the SX1262 in CW mode:

```cpp
radio.beginFSK();
radio.setFrequency(currentFreq);
radio.setOutputPower(txPower);
radio.transmitDirect();   // carrier ON
radio.standby();          // carrier OFF (Morse keying)
```

For SEARCH mode the radio opens an FSK receive window instead. Any failure here surfaces as `[ERROR] SX1262 TX init FAILED` - almost always a wiring problem (see [RF Troubleshooting](/wiki/troubleshooting-rf)).

## Cold Boot vs Deep Sleep Wake

| Aspect | Cold boot | Deep sleep wake |
|--------|-----------|-----------------|
| Reset reason | Power-on (1) | Deep-sleep wake |
| NVS read | Full load | Full load (cheap, still done) |
| Boot counter | Incremented | Incremented |
| GPS cache | Used if valid | Used if valid |
| Time to first TX | ~1 s + GPS wait | ~100 ms (no GPS wait with cache) |

> [!TIP]
> Because NVS and RTC are re-read on every wake, a deep-sleep wake is nearly as fast as a cold boot. The main difference is the skipped GPS acquisition when a cached fix exists.

## Factory Reset

Hold **SW_MODE + SW_SEL together at boot for at least 5 seconds** to erase NVS and reboot with defaults. The same operation is available remotely via the `/factory` POST endpoint. After a reset the RTC boot counter survives (it is not part of NVS), which is useful for tracking how many times the device has booted since manufacture.
