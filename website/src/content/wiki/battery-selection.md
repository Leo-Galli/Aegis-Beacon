---
title: "Battery Selection and Management"
description: "Guide to selecting, charging, and managing batteries for Aegis-Beacon"
order: 15
---

# Battery Selection and Management

Choosing the right battery and managing it properly is essential for reliable emergency operation. This guide covers selection criteria, charging procedures, and power management strategies.

## Recommended Battery Types

### Primary Recommendation: 18650 Li-Ion

| Specification | Value |
|---------------|-------|
| Chemistry | Lithium-ion (Li-ion) |
| Nominal Voltage | 3.7V |
| Recommended Capacity | 2500-3500 mAh |
| Discharge Rate | 1C minimum (3A continuous) |
| Protected Cell | Yes (recommended) |

**Top recommendations:**

1. **Samsung INR18650-30Q** (3000 mAh) -- Best balance of capacity and discharge rate
2. **Panasonic NCR18650B** (3400 mAh) -- Highest capacity, lower discharge rate acceptable
3. **Samsung INR18650-25R** (2500 mAh) -- Best for high-drain Emergency mode

> [!TIP]
> Always buy batteries from reputable suppliers. Counterfeit 18650 cells are common and may have significantly lower capacity than labeled.

### Alternative: 21700 Cells

For extended runtime, a 21700 cell can be used with a modified battery holder:

| Cell | Capacity | Advantage |
|------|----------|-----------|
| Samsung INR21700-50E | 5000 mAh | 67% more runtime |
| Molicel P42A | 4200 mAh | Higher discharge rate |

> [!NOTE]
> 21700 cells require a different battery holder and minor enclosure modification. The BOM specifies 18650 as the standard.

## Battery Discharge Characteristics

### Voltage vs. Capacity (18650)

| Voltage | Approximate Charge | Device Behavior |
|---------|-------------------|-----------------|
| 4.20V | 100% | Full power |
| 4.00V | 80% | Normal operation |
| 3.70V | 50% | Normal operation |
| 3.50V | 20% | Low battery warning |
| 3.30V | 5% | Critical -- enter sleep |
| 3.00V | 0% | Cutoff -- device shuts down |

The firmware monitors battery voltage through a resistive voltage divider on ADC pin GPIO 36 (ADC1_CH0, SVP) and displays the percentage on the OLED. The divider halves the voltage: a full 4.2 V cell reads about 2.1 V at the ADC input.

## Charging

### TP4056 Charger Board

The BOM includes a TP4056 USB-C charging board with the following characteristics:

- **Input:** 5V via USB-C
- **Charge Current:** 1A (default, adjustable via Rprog)
- **Charge Time:** ~3-4 hours for 3000 mAh cell
- **Indicator:** Red while charging, blue when complete

> [!WARNING]
> Never charge the battery inside a sealed enclosure without ventilation. While rare, lithium cells can vent gas during fault conditions.

### Charging Procedure

1. Ensure the device is powered off (switch in OFF position).
2. Connect USB-C cable to the charging port.
3. Red LED on TP4056 indicates charging.
4. Blue LED indicates charge complete.
5. Disconnect charger after completion -- do not leave on trickle charge indefinitely.

## Power Consumption by Mode

| Mode | Average Current | 3000 mAh Runtime |
|------|----------------|-------------------|
| Beacon (default) | ~45 mA | ~65 hours |
| Beacon (low power) | ~25 mA | ~120 hours |
| Search | ~80 mA | ~37 hours |
| Config (WiFi) | ~150 mA | ~20 hours |
| Emergency | ~350 mA | ~8.5 hours |
| Deep Sleep | ~10 uA | ~34 years (theoretical) |

> [!TIP]
> In Beacon mode, the device transmits briefly every 30 seconds and sleeps the rest of the time. The average current is dominated by the sleep current and the brief TX bursts.

## Battery Care and Longevity

- **Storage:** Store at 3.7-3.8V (40-60% charge) for long-term storage.
- **Temperature:** Avoid charging below 0C or above 45C.
- **Cycle Life:** Expect 300-500 full charge/discharge cycles before significant capacity loss.
- **Self-discharge:** Approximately 2-3% per month at room temperature.

## Field Tips

- Carry a spare charged 18650 cell in a separate pouch.
- In cold weather, keep spare batteries inside your jacket.
- Label batteries with the date of purchase and last test date.
- Test battery voltage with a multimeter before each deployment.
- A fresh cell at 4.2V provides maximum runtime and TX power.
