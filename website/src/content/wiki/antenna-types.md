---
title: "Antenna Design and Selection"
description: "Guide to antenna types, design, and optimization for Aegis-Beacon"
order: 17
---

# Antenna Design and Selection

The antenna is one of the most critical components of any radio system. This guide covers antenna selection, design considerations, and optimization for the Aegis-Beacon.

## Stock Antenna

The BOM includes a 433 MHz rubber duck antenna with the following specifications:

| Parameter | Value |
|-----------|-------|
| Type | Helical rubber duck |
| Frequency | 433 MHz center |
| Gain | ~2 dBi |
| Impedance | 50 ohm |
| Connector | SMA male |
| Length | ~17 cm |

This antenna provides adequate performance for most scenarios and is compact enough for portable use.

## Alternative Antenna Options

### Quarter-Wave Vertical

The simplest effective antenna for the Aegis-Beacon:

- **Length:** ~17.3 cm at 433 MHz (225 / frequency in MHz = quarter wavelength in meters)
- **Gain:** ~2 dBi
- **Pattern:** Omnidirectional in horizontal plane
- **Best for:** General-purpose use, beacon deployment

### J-Pole Antenna

A J-pole provides slightly better gain without requiring a ground plane:

- **Gain:** ~3 dBi
- **Advantage:** No ground plane needed
- **Construction:** Two pieces of 300-ohm twin-lead or copper tubing
- **Best for:** Fixed installations, base stations

### Yagi-Uda Antenna

For定向 search operations, a Yagi provides significant gain:

- **Gain:** 7-10 dBi (3-4 element)
- **Beamwidth:** 40-60 degrees
- **Best for:** Directional search, finding beacons at maximum range
- **Construction:** Aluminum rod elements on a boom

> [!TIP]
> A simple 3-element Yagi can be built from aluminum tubing and dramatically improve range in a known direction. Use the Search mode RSSI display to rotate and null the signal.

### Dipole Antenna

A half-wave dipole is the reference antenna:

- **Length:** ~34.6 cm total (2 x 17.3 cm elements)
- **Gain:** 2.15 dBi
- **Pattern:** Figure-8 in the E-plane, omnidirectional in the H-plane
- **Best for:** Testing, benchmarking, permanent installations

## Antenna Tuning

### SWR Measurement

Standing Wave Ratio (SWR) measures how well the antenna is matched to the transmitter:

| SWR | Quality | Action |
|-----|---------|--------|
| 1.0 - 1.5:1 | Excellent | No adjustment needed |
| 1.5 - 2.0:1 | Good | Acceptable for operation |
| 2.0 - 3.0:1 | Fair | Trim or extend antenna elements |
| > 3.0:1 | Poor | Significant mismatch, redesign needed |

> [!WARNING]
> Operating with high SWR (>3:1) wastes power as heat in the PA and reduces effective range. Always verify SWR after building a custom antenna.

### Field Tuning Procedure

Without an SWR meter, you can approximate tuning:

1. Set the device to Beacon mode at your target frequency.
2. Measure the DC current draw during transmission.
3. A properly tuned antenna will show the lowest current draw.
4. If current is higher than expected, the antenna is likely mistuned.
5. Make small adjustments to element length and retest.

## Connector Types

| Connector | Typical Use | Notes |
|-----------|-------------|-------|
| SMA | Stock antenna, most modules | Thread-on, compact |
| RP-SMA | Some WiFi antennas | Reverse pin -- not compatible with SMA |
| BNC | Quick-connect applications | Bayonet mount, faster to connect |
| N-type | High-power base stations | Larger, weather-resistant |
| SMA female | Panel mount | For enclosure bulkhead connectors |

> [!IMPORTANT]
> The E22-400M30S module uses an SMA female connector. Ensure your antenna has an SMA male connector.

## Coaxial Cable

For remote antenna mounting, use low-loss coaxial cable:

| Cable Type | Loss at 433 MHz | Recommendation |
|------------|-----------------|----------------|
| RG-174 | 0.4 dB/m | Acceptable up to 1m |
| RG-58 | 0.17 dB/m | Good for 1-3m runs |
| LMR-200 | 0.13 dB/m | Best for 1-5m runs |
| LMR-400 | 0.04 dB/m | For permanent installations >5m |

> [!TIP]
> Every 3 dB of cable loss cuts your effective power in half. A 3m run of RG-174 loses about 1.2 dB -- equivalent to reducing TX power from 50 mW to 32 mW. Use the lowest-loss cable practical for your installation.

## Weatherproofing

For outdoor installations:

- Use self-amalgamating tape around all connectors.
- Apply silicone sealant at the cable entry point.
- Use a drip loop to prevent water running down the cable into the connector.
- Consider a weatherproof enclosure (IP65 rated minimum).

## Ground Plane

The ground plane affects antenna performance significantly:

- **Rubber duck antennas** have an internal ground plane (the operator's body or the PCB).
- **External antennas** mounted on a pole need an artificial ground plane.
- A metal sheet or radial wires (4 x quarter-wavelength) below the antenna provides an effective ground plane.
- For the Aegis-Beacon, the PCB ground plane is adequate when using the stock antenna directly on the device.
