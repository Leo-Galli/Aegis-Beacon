---
title: "Outdoor Testing Guide"
description: "How to conduct range tests, environmental tests, and field validation"
order: 24
---

# Outdoor Testing Guide

Thorough outdoor testing ensures the Aegis-Beacon performs reliably in real-world conditions. This guide covers range testing, environmental testing, and systematic validation procedures.

## Range Testing

### Equipment Needed

- 2x Aegis-Beacon devices (one transmitting, one receiving)
- Fully charged batteries (4.2V)
- Correct antennas for the operating frequency
- Topographic map or GPS app
- Notepad or spreadsheet for recording data
- Measuring tape or laser rangefinder (optional)

### Test Procedure

1. **Setup the beacon:**
   - Configure the transmitting device in Beacon mode.
   - Set the TX power to the value you want to test.
   - Ensure GPS has a fix (if testing GPS functionality).

2. **Setup the receiver:**
   - Configure the second device in Search mode.
   - Set it to scan the same frequency as the beacon.
   - Ensure volume is audible.

3. **Measure at graduated distances:**

| Distance | Terrain | RSSI | Signal Quality | Notes |
|----------|---------|------|----------------|-------|
| 100 m | Clear line of sight | -XX dBm | Excellent | Baseline measurement |
| 500 m | Clear line of sight | -XX dBm | Good | |
| 1 km | Light trees | -XX dBm | Good | |
| 2 km | Valley crossing | -XX dBm | Fair | |
| 5 km | Ridge to valley | -XX dBm | Weak | |
| 10 km | Peak to peak | -XX dBm | Marginal | |
| 15 km | Maximum range | -XX dBm | Barely detectable | |

4. **Record the following at each distance:**
   - GPS coordinates of both devices.
   - Elevation of both devices.
   - RSSI reading on the receiver OLED.
   - Whether the signal was audible.
   - Terrain description and obstacles.

> [!TIP]
> Conduct range tests in the morning when atmospheric conditions are stable. Temperature inversions in the afternoon can significantly affect radio propagation.

### Analyzing Results

**Expected performance:**

| Condition | Expected Range (TX at +17 dBm) |
|-----------|--------------------------------|
| Perfect line of sight (flat terrain) | 10-15 km |
| Light obstacles (scattered trees) | 5-10 km |
| Moderate obstacles (forest edge) | 2-5 km |
| Heavy obstacles (valley floor) | 0.5-2 km |
| Urban environment | 0.3-1 km |

If your results are significantly below expectations, check:

- Antenna condition and connection.
- Battery voltage during the test.
- Whether the receiver was in a signal shadow.

## Environmental Testing

### Temperature Testing

**Setup:**

1. Place the device in a temperature-controlled environment.
2. Allow 30 minutes for the device to reach thermal equilibrium.
3. Power on and verify normal operation.
4. Activate Beacon mode and verify transmission.

**Test points:**

| Temperature | Duration | Expected Behavior |
|-------------|----------|-------------------|
| -20C | 1 hour | Reduced battery capacity, slower GPS fix |
| 0C | 1 hour | Normal operation |
| +25C | 1 hour | Normal operation (baseline) |
| +45C | 1 hour | Normal, monitor for thermal throttling |
| +60C | 30 min | PA may thermally limit, monitor closely |

> [!WARNING]
> Do not charge the battery below 0C or above 45C. Charging outside these temperatures can cause permanent battery damage.

### Humidity Testing

1. Place the device in a high-humidity environment (80-90% RH) for 24 hours.
2. Verify that the electronics are not affected.
3. Check for condensation on the OLED display.
4. Test all modes after the exposure period.

### Vibration and Shock Testing

For devices that will be transported in backpacks or vehicles:

1. **Drop test:** Drop the assembled device from 1 meter onto a hard surface.
   - Inspect for cracked enclosure.
   - Verify SMA connector integrity.
   - Power on and test all modes.

2. **Shake test:** Shake the device vigorously for 60 seconds.
   - Listen for loose components.
   - Verify no rattling sounds.
   - Check all connectors after shaking.

3. **Vehicle transport test:** Secure the device in a vehicle and drive on rough roads for 1 hour.
   - Verify all screws remain tight.
   - Check antenna connection.
   - Test all modes after transport.

## Systematic Validation

### Pre-Deployment Checklist

Run this checklist before any mission deployment:

- [ ] Battery voltage: 4.1V or higher
- [ ] Antenna: Connected and secure
- [ ] Frequency: Correct for region
- [ ] GPS: Lock acquired (SAT count > 4)
- [ ] Beacon mode: Transmits and is audible on test receiver
- [ ] Search mode: Scans and detects test signal
- [ ] Config mode: WiFi portal accessible
- [ ] Emergency mode: Activates with correct power level
- [ ] OLED: Displays correctly, no dead pixels
- [ ] Buttons: All four buttons respond correctly
- [ ] Enclosure: No cracks, all screws tight
- [ ] Charging: USB-C port functional

### Post-Deployment Inspection

After each field use:

- [ ] Battery voltage after mission
- [ ] Any physical damage to enclosure
- [ ] SMA connector condition
- [ ] OLED display condition
- [ ] Button responsiveness
- [ ] Charging functionality
- [ ] GPS fix time (compare to baseline)

### Record Keeping

Maintain a testing log for each device:

```
Device: AB-0001
Date: YYYY-MM-DD
Firmware: v5.4
Battery at start: 4.18V
Battery at end: 3.72V
Duration: 8 hours
Modes used: Beacon (6h), Search (2h)
Range test: 8 km confirmed
Issues: None
Notes: Temperature range 5-18C, clear weather
```

## Range Test Data Template

Use this template to record range test data systematically:

| Test # | Distance (m) | Elevation TX (m) | Elevation RX (m) | Terrain | RSSI (dBm) | Audible | Notes |
|--------|--------------|-------------------|-------------------|---------|-------------|---------|-------|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |

## Common Test Scenarios

### Mountain Rescue Simulation

1. Place the beacon at a mountain peak.
2. Position the search team at the base.
3. Test signal detection from different directions.
4. Measure how terrain affects RSSI.
5. Time the signal acquisition in Search mode.

### Urban Emergency Simulation

1. Place the beacon inside a building.
2. Position the search device outside.
3. Test through different wall types (drywall, concrete, brick).
4. Measure the penetration loss at each wall type.

### Winter Conditions Test

1. Pre-chill the device to -10C in a freezer.
2. Activate Beacon mode immediately.
3. Monitor battery voltage over 2 hours.
4. Compare runtime to room temperature baseline.
