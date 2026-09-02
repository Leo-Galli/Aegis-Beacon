---
title: "Safety Guidelines"
description: "Critical safety information for operating Aegis-Beacon emergency radio equipment"
order: 3
---

# Safety Guidelines

This page contains critical safety information that must be read before operating the Aegis-Beacon device. Failure to follow these guidelines may result in equipment damage, legal issues, or personal harm.

## Radio Frequency Safety

### Power Output Limits

| Mode | TX Power | Duty Cycle | Duration |
|------|----------|------------|----------|
| Beacon | +17 dBm (50 mW) | 10% | Indefinite |
| Search | Rx only | N/A | Indefinite |
| Config | N/A (WiFi) | N/A | Until timeout |
| Emergency | +22 dBm (160 mW) | 100% | Until battery depleted |

> [!WARNING]
> Continuous transmission at +22 dBm (Emergency mode) will rapidly deplete the battery and may cause the PA amplifier to overheat. Limit Emergency mode to genuine rescue situations.

### Antenna Safety

- Never transmit without a properly connected antenna. Transmitting without a load can damage the SX1262 transceiver permanently.
- Keep the antenna away from your face and body during transmission.
- Do not modify or cut the antenna length without recalculating the matching network.

> [!IMPORTANT]
> The antenna is tuned for the 410-525 MHz band. Using it on other frequencies will result in poor performance and potentially damage the transmitter.

## Electrical Safety

### Battery Handling

The Aegis-Beacon uses a single 18650 lithium-ion cell (3.7V nominal).

- **Never** short-circuit the battery.
- **Never** charge the battery unattended.
- **Never** use a damaged or swollen battery.
- Use only the TP4056 charging board included in the BOM for charging.
- Charge in a fireproof location away from flammable materials.

> [!WARNING]
> Lithium-ion batteries can cause fires if punctured, overcharged, or short-circuited. Always use proper battery holders and the included TP4056 charger board.

### Soldering Safety

When assembling the device:

- Work in a well-ventilated area.
- Use lead-free solder (Sn96.5/Ag3.0/Cu0.5 recommended).
- Wear safety glasses when soldering.
- Keep the soldering iron in its stand when not in use.
- Allow joints to cool before touching.

## Environmental Limits

| Parameter | Safe Range | Notes |
|-----------|------------|-------|
| Operating Temperature | -20 to +60 C | Derate TX power above 45C |
| Storage Temperature | -40 to +85 C | Remove battery for long-term storage |
| Humidity | 0-90% RH | Non-condensing |
| Altitude | Up to 5000m | No derating required |

> [!TIP]
> In extreme cold (below -10C), battery capacity drops significantly. Pre-warm the device against your body before activation in winter conditions.

## Legal and Regulatory Compliance

### Radio Operation

- Verify that operation in the 410-525 MHz band is permitted in your jurisdiction before transmitting.
- Many countries allow low-power emergency beacons, but specific rules vary.
- PMR446-compliant frequencies (446.0-446.2 MHz) are generally available in the EU without a license.

### Emergency Use Only

The Aegis-Beacon is designed as a **supplementary** emergency device. It is not a replacement for:

- Professional rescue equipment
- Satellite communicators (InReach, SPOT, etc.)
- Calling emergency services (112, 911, etc.)

> [!NOTE]
> In a life-threatening emergency, always contact professional rescue services first if any means is available. Use Aegis-Beacon to supplement, not replace, professional rescue channels.

## Storage and Transport

- Remove the battery if storing the device for more than 30 days.
- Store in a dry, temperature-stable environment.
- When transporting by air, remove the battery and carry it in hand luggage (IATA regulations for lithium batteries).
- Keep the device in an anti-static bag when not in use.
