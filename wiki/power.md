# Power Management

## Battery Specifications

| Parameter | Value |
|-----------|-------|
| Cell Type | 18650 Li-ion |
| Nominal Voltage | 3.7V |
| Capacity | 2600-3500 mAh (typ. 3000 mAh) |
| Charging IC | TP4056 (USB-C, 1A max) |
| Protection | Over-discharge, over-charge, short-circuit |

## Runtime by Mode

| Mode | Current Draw | Runtime (3000 mAh) |
|------|-------------|-------------------|
| BEACON (30s interval) | ~15 mA avg | ~65 hours |
| BEACON (10s interval) | ~25 mA avg | ~40 hours |
| SEARCH | ~50 mA avg | ~20 hours |
| CONFIG (WiFi AP) | ~120 mA avg | ~8 hours |
| EMERGENCY (continuous) | ~450 mA | ~6 hours |
| DEEP SLEEP | ~10 uA | years |

## Battery Voltage Curve

| ADC Value | Voltage | Percentage | Status |
|-----------|---------|------------|--------|
| 3300 | 4.20V | 100% | Fully charged |
| 2800 | 3.70V | 50% | Nominal |
| 2400 | 3.30V | 20% | Low warning |
| 2100 | 3.00V | 0% | Critical - deep sleep |

ADC divider: 2x (100K/100K). Calibrate with multimeter for accurate readings.
