# Testing & QC

## Pre-Flight Checklist

1. **Visual Inspection** - Check for solder bridges, cold joints, and component orientation
2. **Power Rail Verification** - Measure 3.3V, 5V rails with multimeter
3. **SPI Bus Test** - Flash test firmware that reads SX1262 chip ID (expected: 0x1262)
4. **OLED Display Test** - Run U8g2 test sketch
5. **GPS Fix Test** - Connect GPS module, wait for satellite lock

## RF Performance Test

- TX power at 433 MHz: should read +17 dBm (default) to +22 dBm (max)
- Frequency accuracy: within +/- 10 kHz of target
- Spurious emissions: -40 dBc or better at harmonic frequencies
- CW tone frequency: 600 Hz +/- 5 Hz

## Deep Sleep Current

| State | Current | Notes |
|-------|---------|-------|
| Deep Sleep | ~10 uA | RTC domain only |
| Idle (WiFi off) | ~15 mA | CPU running, radio off |
| TX (beacon) | ~350 mA | PA active at +17 dBm |
| TX (emergency) | ~450 mA | Max power +22 dBm |
