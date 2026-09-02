---
title: "Regulatory Compliance"
description: "Legal requirements and frequency regulations for operating Aegis-Beacon"
order: 19
---

# Regulatory Compliance

Operating radio equipment is regulated by law in virtually every country. This page provides a general overview of regulations and compliance strategies. It is your responsibility to verify and comply with the specific regulations in your jurisdiction.

## Frequency Bands

The Aegis-Beacon operates in the 410-525 MHz band. Specific allocations and regulations vary by region.

### European Union

#### PMR446 (446.0 - 446.2 MHz)

- **License required:** No (license-exempt)
- **Max power:** 500 mW ERP
- **Channels:** 16
- **Bandwidth:** 12.5 kHz (narrowband FM)
- **Aegis-Beacon compliance:** The device supports PMR446 frequencies in the firmware. At +17 dBm (50 mW), it is well below the 500 mW limit.

> [!NOTE]
> PMR446 is designed for short-range voice communication. Using it for Morse beacons is technically permitted but unusual. Check with your national regulator if in doubt.

#### 433.05 - 434.79 MHz (ISM Band)

- **License required:** No (license-exempt, low power)
- **Max power:** 10 mW ERP (up to 25 kHz bandwidth)
- **Use:** Short-range devices, telemetry, alarms
- **Aegis-Beacon compliance:** At +17 dBm (50 mW), the device exceeds the 10 mW limit. Use PMR446 frequencies instead for EU compliance.

### United States

#### MURS (151-154 MHz)

- **License required:** No
- **Max power:** 2W
- **Note:** Aegis-Beacon does not cover this band.

#### FRS/GMRS (462/467 MHz)

- **License required:** FRS (no license), GMRS (FCC license required)
- **Max power:** FRS: 2W, GMRS: 5W
- **Aegis-Beacon compliance:** The 462 MHz frequencies fall within the supported range. FRS use at +17 dBm (50 mW) is well within the 2W limit.

#### Part 15 (Various ISM bands)

- **License required:** No
- **Max power:** Varies by frequency
- **Note:** Part 15 operation is very low power and generally not useful for emergency beacons.

### International (ITU Region)

The 400-470 MHz band is allocated to various services internationally:

- **Mobile service:** Primary allocation in most countries
- **Amateur radio:** 430-440 MHz ( amateur license required)
- **ISM:** Various sub-bands with power limits

> [!WARNING]
> Transmitting without a license in a band that requires one is illegal and may result in fines, equipment seizure, or criminal charges. Always verify your local regulations.

## Compliance Strategies

### Use License-Exempt Frequencies

The safest approach is to use frequencies that do not require a license in your jurisdiction:

- **EU:** PMR446 (446.0-446.2 MHz)
- **US:** FRS (462 MHz)
- **Other:** Consult your national spectrum authority

### Obtain a License

For maximum flexibility, consider obtaining an amateur radio license:

- **EU:** Varies by country (e.g., Novice, Class 1, Class 2)
- **US:** FCC Technician, General, or Amateur Extra
- **Benefits:** Access to wider frequency range, higher power limits, and legal protection

### Operate Under Emergency Exemptions

Most countries have emergency exemptions that permit unauthorized radio transmissions in genuine life-threatening situations:

- The transmission must be for the purpose of preserving life.
- It should be for the minimum duration necessary.
- It should use the minimum power necessary.

> [!IMPORTANT]
> Emergency exemptions are a legal defense, not a pre-authorization. They should only be invoked in genuine emergencies where professional rescue services are not available.

## Documentation Requirements

Even for license-exempt operation, keep the following records:

- **Frequency list:** Which frequencies the device is configured to use.
- **Power levels:** TX power for each frequency.
- **Location:** Where the device was operated.
- **Date and time:** When transmissions occurred.
- **Purpose:** The reason for operation (rescue, training, testing).

## Testing and Certification

### CE Marking (EU)

For commercial sale in the EU, the device requires CE marking:

- **EMC Directive (2014/30/EU):** Electromagnetic compatibility testing
- **Radio Equipment Directive (2014/53/EU):** Radio performance and spectrum access
- **RoHS Directive (2011/65/EU):** Restriction of hazardous substances

The Aegis-Beacon is open-source hardware and not certified. If you intend to sell assembled devices, you must obtain certification.

### FCC (US)

For sale in the US:

- **FCC Part 15:** Intentional radiators require FCC ID
- **Process:** Testing at an accredited lab, filing with FCC, receiving FCC ID
- **Timeline:** 4-8 weeks typical

### Self-Certification

For personal use (not commercial sale), self-certification is generally acceptable:

- Operate only on license-exempt frequencies.
- Stay within power limits.
- Use approved antennas (or equivalent).
- Label the device with the operating frequency and power.

## Record of Compliance

Maintain a compliance log for each device:

| Field | Value |
|-------|-------|
| Device Serial | AB-XXXX |
| Firmware Version | v5.4 |
| Frequencies | 446.000, 446.0625, ... |
| Max TX Power | +17 dBm |
| Operator License | PMR446 (exempt) |
| Last Tested | YYYY-MM-DD |

> [!TIP]
> Keep a printed copy of this log with the device. In the event of an inspection, having documentation readily available demonstrates good faith compliance.
