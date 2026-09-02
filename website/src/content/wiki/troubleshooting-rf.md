---
title: "Troubleshooting RF Issues"
description: "Diagnosing and fixing radio frequency problems with Aegis-Beacon"
order: 21
---

# Troubleshooting RF Issues

Radio frequency problems can be frustrating because they are often invisible. This guide covers systematic diagnosis and resolution of common RF issues.

## Symptom: No Transmission

The device powers on but does not appear to transmit.

### Checklist

1. **Antenna connected?**
   - Verify the SMA connector is finger-tight.
   - Check that the antenna is the correct type (SMA male, not RP-SMA).

2. **Frequency correct?**
   - Enter Config mode and verify the frequency setting.
   - Ensure the frequency is within the supported 410-525 MHz range.

3. **TX power setting?**
   - Check the TX power level in Config mode.
   - Verify it is not set to 0 dBm or disabled.

4. **SX1262 initialization?**
   - On boot, the OLED should show the firmware version.
   - If no version is displayed, the SX1262 may not be initializing.
   - Check SPI connections: MOSI, MISO, SCK, NSS, RESET, DIO1.

5. **Battery voltage?**
   - A battery below 3.3V may not provide enough current for TX.
   - Check the OLED voltage display or measure with a multimeter.

> [!TIP]
> Use a second Aegis-Beacon in Search mode to verify transmission. If the search device detects no signal, the transmitting device likely has a hardware or configuration issue.

## Symptom: Very Short Range

The device transmits but range is much less than expected (under 1 km).

### Common Causes

1. **Antenna detuning**
   - Metal objects near the antenna detune it. Move the device away from metal surfaces.
   - The operator's hand can detune a rubber duck antenna. Hold the device by the enclosure, not the antenna.

2. **Obstruction**
   - Buildings, rock walls, and dense forest attenuate 433 MHz signals.
   - Move to higher ground or a clearer location.

3. **Low battery**
   - TX power drops as battery voltage decreases.
   - A fresh cell at 4.2V provides maximum power.

4. **Wrong antenna**
   - A 433 MHz antenna used at 462 MHz will be detuned.
   - Ensure the antenna covers the operating frequency.

5. **Poor ground plane**
   - The antenna needs a ground plane to radiate efficiently.
   - Holding the device in your hand provides a ground plane via your body.
   - Placing it on a wooden or plastic surface provides no ground plane.

### Diagnostic Steps

1. **Visual inspection:** Check the SMA connector, antenna cable, and PCB for damage.
2. **Continuity test:** Measure continuity between the SMA center pin and the SX1262 PA output.
3. **SWR measurement:** If you have an SWR meter, measure the antenna VSWR at the operating frequency.
4. **Known good antenna:** Swap in a known good antenna to rule out antenna failure.
5. **Current measurement:** Measure TX current draw. Abnormal current indicates a PA problem.

## Symptom: Intermittent Signal

The signal drops out randomly or is present only sometimes.

### Possible Causes

1. **Loose SMA connector**
   - The SMA connector can loosen over time due to vibration.
   - Check and tighten. Use thread locker (blue Loctite) for permanent installations.

2. **Cold solder joints**
   - A cold joint on the PA output can make intermittent contact.
   - Reflow any suspect solder joints.

3. **Watchdog resets**
   - If the firmware crashes and the watchdog resets the device, TX will be interrupted.
   - Check the serial log for reset messages.

4. **Thermal issues**
   - In Emergency mode, the PA can overheat and enter thermal shutdown.
   - Monitor temperature and reduce power if thermal throttling is observed.

5. **Battery connection**
   - A loose JST connector can cause momentary power loss during TX.
   - Secure the battery connector with a small piece of tape.

## Symptom: Distorted Morse Code

The Morse code timing is wrong or the tone sounds incorrect.

### Diagnosis

1. **WPM setting:** Verify the WPM setting in Config mode. The default is 12 WPM.
2. **Buzzer:** Check the passive buzzer connection. A disconnected or damaged buzzer will produce no sound.
3. **Timer accuracy:** The firmware uses the ESP32 hardware timer for Morse timing. If other interrupts are blocking, timing can drift.
4. **Power supply noise:** Poor power supply filtering can modulate the audio output. Add a 100uF capacitor across the power rails.

## Symptom: GPS Not Locking

The GPS module does not achieve a fix.

### Checklist

1. **Antenna placement:** The NEO-6M patch antenna must face the sky. It cannot lock indoors or under heavy canopy.
2. **Cold start time:** First GPS fix after power-on can take 2-5 minutes outdoors.
3. **Backup battery:** The NEO-6M has a backup battery for warm starts. If the backup battery is dead, every start is a cold start.
4. **Wiring:** Verify TX/RX connections are correct (GPS TX to MCU RX and vice versa).
5. **Baud rate:** The NEO-6M defaults to 9600 baud. Ensure the firmware matches.

> [!TIP]
> To test GPS functionality, take the device outdoors with a clear view of the sky. Wait at least 5 minutes for the first fix. The OLED will display "SAT: XX" where XX is the number of satellites in view.

## RF Measurement Tools

### Basic Tools

| Tool | Use | Approximate Cost |
|------|-----|-----------------|
| Multimeter | Voltage, current, continuity | $20-50 |
| SWR Meter | Antenna matching | $50-200 |
| SDR Dongle | Spectrum analysis, signal monitoring | $25-100 |
| RF Power Meter | TX power verification | $100-500 |

### Using an SDR Dongle

An RTL-SDR dongle ($25) is an invaluable tool for diagnosing RF issues:

1. Install SDR software (SDR#, GQRX, or SDR++).
2. Tune to the operating frequency.
3. Verify that the beacon signal appears at the expected frequency.
4. Measure the signal strength at known distances.
5. Check for spurious emissions on harmonics.

## When to Seek Help

If you have exhausted the above diagnostics and still have issues:

1. Post on the [GitHub Discussions](https://github.com/Leo-Galli/Aegis-Beacon/discussions) page.
2. Include: firmware version, hardware revision, symptoms, and measurements taken.
3. Attach photos of the PCB, solder joints, and any visible damage.
4. Describe the test setup and environment.
