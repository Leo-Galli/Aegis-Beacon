---
title: "Field Deployment Guide"
description: "Practical guide for deploying Aegis-Beacon in real-world rescue scenarios"
order: 16
---

# Field Deployment Guide

This guide covers practical deployment strategies for the Aegis-Beacon in real-world mountain rescue and emergency scenarios.

## Pre-Deployment Checklist

Before heading into the field, verify the following:

- [ ] Battery fully charged (4.2V, check OLED voltage display)
- [ ] Antenna securely connected (SMA connector finger-tight)
- [ ] Correct frequencies configured for your region
- [ ] GPS lock acquired (check satellite count on OLED)
- [ ] SOS message verified (test in Config mode)
- [ ] Emergency contacts informed of planned route
- [ ] Device tested in Beacon mode for 5 minutes

## Optimal Placement

### Elevation is Critical

Radio range depends heavily on line-of-sight. The Aegis-Beacon at +17 dBm can reach 15 km in ideal conditions, but obstacles significantly reduce this.

**Best practices:**

- Place the device at the **highest accessible point** -- ridge lines, peaks, or elevated rocks.
- Even 2-3 meters of additional height can dramatically improve range.
- Avoid placing inside caves, deep valleys, or dense canopy.

### Antenna Orientation

The included rubber duck antenna radiates omnidirectionally in the horizontal plane. For maximum effectiveness:

- Keep the antenna **vertical** (perpendicular to the ground).
- Do not lay the device flat on the ground -- prop it up or hang it.
- Avoid placing the antenna against metal surfaces.

> [!TIP]
> In Search mode, slowly rotate the receiving device while scanning. The directional sensitivity of the receiving antenna helps pinpoint signal direction.

## Deployment Scenarios

### Scenario 1: Stranded Hiker

A hiker is stranded on a mountainside with a broken ankle.

1. Activate **Beacon mode** with the device placed at the highest nearby point.
2. Ensure GPS has a lock (wait 2-3 minutes if needed).
3. The device will transmit SOS with coordinates every 30 seconds.
4. Preserve battery -- switch to Emergency mode only if rescue is imminent.

### Scenario 2: Search Team Coordination

A search team is scanning a valley for a missing person.

1. Rescuers carry devices in **Search mode**.
2. The missing person's device (if available) should be in **Beacon mode**.
3. Search team devices scan all frequencies and provide audio alerts on signal detection.
4. RSSI values on the OLED display indicate signal strength and proximity.

### Scenario 3: Remote Worksite

A construction crew operates in an area with no cellular coverage.

1. Keep one device in **Beacon mode** at a central location.
2. Workers carry personal devices in **Search mode**.
3. Config mode allows adjustment of unique identifiers for each team member.
4. Periodic GPS position reports help track team locations.

## Weather Considerations

### Rain

The Aegis-Beacon is not waterproof. In wet conditions:

- Place the device inside a waterproof bag (leave the antenna protruding).
- Silica gel packets inside the enclosure help absorb moisture.
- After exposure to moisture, dry thoroughly before storage.

### Extreme Cold

Below -10C, lithium battery capacity drops by 20-40%:

- Pre-warm the device against your body before activation.
- Carry spare batteries in an inner pocket.
- Consider using lithium primary cells (CR123A) for extreme cold -- they perform better at low temperatures.

### High Altitude

Above 3000m, no special considerations are needed for the electronics. However:

- UV exposure may degrade the antenna coaxial cable over time.
- Thinner atmosphere means slightly better radio propagation.
- Temperature swings are more extreme -- manage battery accordingly.

## Range Optimization Tips

1. **Line of sight matters most.** A 100m elevation gain can add 5+ km of effective range.
2. **Avoid metal objects** near the antenna -- they detune it and reduce radiation efficiency.
3. **Use fresh batteries** for maximum TX power.
4. **Night time** can be slightly better for radio propagation due to atmospheric conditions.
5. **Valley-to-valley** communication works better with the device at the valley rim, not the bottom.
6. **Multiple devices** in Beacon mode on different frequencies increase the chance of detection.

## Coordination with Rescue Services

The beacon is a **supplementary** tool. Always follow local rescue protocols and the instructions of the coordinating agency:

1. **Inform the rescue coordinator** which frequency and Morse payload format you are using (`SOS DE [NAME] PSN [LAT] [LON]`).
2. **State the cycle timing**: default is one full payload transmission every 30 s, so tell the search team what to expect and how to confirm they are copying your signal.
3. **Do not transmit on frequencies reserved for active rescue channels** in your region without authorization -- check the [Frequency Compatibility](/wiki/frequency-compatibility) and [Regulatory Compliance](/wiki/regulatory-compliance) pages first.
4. If a professional team establishes contact, **switch to their instructed mode or channel** immediately and, if told, power the beacon down to save battery for a potential second incident.

> [!IMPORTANT]
> In a life-threatening emergency always attempt to contact emergency services (112 / 911 / 999 or the local SAR number) first when any phone or radio channel is available. Aegis-Beacon supplements, never replaces, professional rescue systems.

## Battery Management During Long Missions

| Situation | Action |
|-----------|--------|
| Battery at 50-80% | Normal operation, keep beacon cycling |
| Battery at 20-50% | Reduce repeat count or extend sleep interval via config |
| Battery under 20% | Switch to low-power beacon profile, carry spare cell |
| Spare cell available | Swap only in a dry, sheltered spot |
| Emergency imminent | Use EMERGENCY mode regardless of battery level |

Expected runtimes with a 3000 mAh cell: see [Battery Selection](/wiki/battery-selection#power-consumption-by-mode).

## Post-Mission

After each deployment:

1. Power off the device.
2. Check battery voltage and recharge if below 3.7V.
3. Inspect antenna connector and SMA threads.
4. Clean any moisture from the enclosure.
5. Log the mission duration and battery consumption for future planning.
6. Update firmware if a new version is available.

## Related Guides

- **[Battery Selection](/wiki/battery-selection)** -- choosing cells for cold weather
- **[Outdoor Testing](/wiki/outdoor-testing)** -- validating range before a real mission
- **[Safety Guidelines](/wiki/safety-guidelines)** -- legal and electrical safety
- **[Troubleshooting](/wiki/troubleshooting)** -- what to do when a device fails in the field
