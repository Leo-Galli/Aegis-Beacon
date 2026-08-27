# Frequency Compatibility

## Overview

The Aegis-Beacon operates in the 410-525 MHz ISM band. Configuration supports up to 10 frequencies per cycle for maximum flexibility.

## Supported Frequencies

### European (PMR446/LPD)

| Frequency | License | Notes |
|-----------|---------|-------|
| 433.050 MHz | LPD433 | Low Power Device, max 10mW |
| 433.075 MHz | PMR446 | Private Mobile Radio, 500mW |
| 433.100 MHz | LPD433 | Low Power Device |
| 434.750 MHz | ISM | General ISM band |

### USA (GMRS/FRS)

| Frequency | License | Notes |
|-----------|---------|-------|
| 462.5625 MHz | FRS/GMRS | Family Radio Service |
| 462.5875 MHz | FRS/GMRS | Family Radio Service |
| 462.6125 MHz | FRS/GMRS | Family Radio Service |

### Italy (PMR446)

| Frequency | License | Notes |
|-----------|---------|-------|
| 433.075 MHz | PMR446 | Standard Italian PMR |
| 434.075 MHz | PMR446 | Alternate channel |

### Global (ISM Band)

| Frequency | License | Notes |
|-----------|---------|-------|
| 410-525 MHz | ISM | General Industrial/Scientific |

> [!INFO]
> The 433 MHz band is available worldwide for low-power devices. Check local regulations for power limits.

## Configuration

### Adding Frequencies

Via CONFIG portal:

1. Open `http://192.168.4.1`
2. Navigate to Frequency Manager
3. Tap "+" to add new frequency
4. Enter frequency in MHz (e.g., 433.500)
5. Save configuration

### Maximum Frequencies

| Parameter | Value |
|-----------|-------|
| **Max per cycle** | 10 |
| **Frequency steps** | 100 kHz |
| **Range** | 410-525 MHz |

### Frequency Hopping

In BEACON mode, the device transmits on all configured frequencies sequentially:

```
Cycle 1: Freq1, Freq2, Freq3, ...
Cycle 2: Freq1, Freq2, Freq3, ...
...
```

> [!TIP]
> More frequencies = longer cycle time but better chance of detection. Use 3-5 frequencies for optimal balance.

## Regional Regulations

### European Union

| Regulation | Limit |
|------------|-------|
| **LPD433** | 10 mW (10 dBm) |
| **PMR446** | 500 mW (27 dBm) |
| **License** | No license required |

### United States

| Regulation | Limit |
|------------|-------|
| **FRS** | 2 W (33 dBm) |
| **GMRS** | 5 W (37 dBm) |
| **License** | GMRS requires FCC license |

### Italy

| Regulation | Limit |
|------------|-------|
| **PMR446** | 500 mW (27 dBm) |
| **License** | No license required |

> [!WARNING]
> Check local regulations before operation. Power limits vary by country and frequency band.

## Link Budget by Frequency

### 433 MHz

| Parameter | Value |
|-----------|-------|
| **Quarter-wave** | 17.3 cm |
| **Penetration** | Excellent |
| **Range (LOS)** | 15+ km |
| **Best for** | Mountain rescue |

### 462 MHz

| Parameter | Value |
|-----------|-------|
| **Quarter-wave** | 16.2 cm |
| **Penetration** | Good |
| **Range (LOS)** | 12+ km |
| **Best for** | Urban/suburban |

### 868 MHz (EU)

| Parameter | Value |
|-----------|-------|
| **Quarter-wave** | 8.6 cm |
| **Penetration** | Moderate |
| **Range (LOS)** | 8+ km |
| **Best for** | Compact antenna |

## Testing Frequencies

### Verification Steps

1. Configure frequency in portal
2. Flash firmware
3. Power on device
4. Verify transmission on oscilloscope or SDR
5. Check with AM receiver at known distance

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No transmission | Wrong frequency | Verify in CONFIG portal |
| Weak signal | Antenna mismatch | Check antenna length for frequency |
| Interference | Shared frequency | Try different frequency |
| Out of range | Low power | Increase TX power in settings |

> [!TIP]
> Use SDR (Software Defined Radio) to verify transmission. RTL-SDR dongles cost ~$20 and provide visual confirmation.
