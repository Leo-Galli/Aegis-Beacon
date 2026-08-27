# Assembly Guide

> [!WARNING]
> This guide assumes basic SMD soldering skills. If you're new to soldering, practice on scrap boards first.

## Prerequisites

### Tools Required

- Soldering iron (25-40W, fine tip)
- Solder (60/40 or lead-free)
- Flux (rosin or no-clean)
- Multimeter
- Wire strippers
- Hot glue gun (optional)

### Components

See [Hardware Components](/wiki/hardware-components) for complete BOM.

## Step 1: Prepare ESP32 DevKit

1. Inspect board for damage
2. Test USB connection: `Tools → Port` should show COM port
3. Flash test firmware to verify operation

> [!TIP]
> Flash firmware first to ensure ESP32 is working before assembly.

## Step 2: Install SX1262 Module

### Pin Connections

| E22 Pin | ESP32 GPIO | Wire Color |
|---------|------------|------------|
| VCC | 3V3 | Red |
| GND | GND | Black |
| SCK | GPIO 18 | Yellow |
| MISO | GPIO 19 | Orange |
| MOSI | GPIO 23 | Green |
| NSS | GPIO 5 | Blue |
| RESET | GPIO 14 | Purple |
| BUSY | GPIO 21 | White |

> [!IMPORTANT]
> **BUSY (GPIO 21) is mandatory.** Without it, firmware will hang on first radio call.

### Soldering Order

1. Solder VCC and GND first
2. Verify 3.3V on VCC pin (never 5V!)
3. Solder SPI pins (SCK, MISO, MOSI, NSS)
4. Solder control pins (RESET, BUSY)
5. Test SPI communication

## Step 3: Install OLED Display

### Pin Connections

| OLED Pin | ESP32 GPIO | Wire Color |
|----------|------------|------------|
| GND | GND | Black |
| VCC | 3.3V | Red |
| SCK | GPIO 15 | Yellow |
| SDA | GPIO 13 | Green |
| RES | GPIO 4 | Purple |
| DC | GPIO 16 | Blue |
| CS | GPIO 17 | Orange |

### Mounting

1. Position OLED on enclosure front panel
2. Secure with hot glue or mounting clips
3. Route cables to ESP32

## Step 4: Install GPS Module (Optional)

### Pin Connections

| GPS Pin | ESP32 GPIO | Wire Color |
|---------|------------|------------|
| VCC | 3.3V | Red |
| GND | GND | Black |
| TX | GPIO 22 | White |
| RX | GPIO 12 | Yellow |

### Antenna Placement

- Mount ceramic patch antenna facing up
- Keep away from battery and metal
- Route antenna wire through enclosure

## Step 5: Battery System

### TP4056 Charger

1. Mount TP4056 module near USB port
2. Connect USB-C connector to enclosure
3. Route BAT+ and BAT- to battery holder

### Battery Holder

1. Mount 18650 holder in enclosure
2. Connect spring contacts to TP4056
3. Ensure polarity is correct

### Voltage Divider

```
BAT+ --> R3a (100k) --> Junction --> R3b (100k) --> GND
                         |
                     GPIO 36
```

> [!WARNING]
> GPIO 36 is input-only. No external pullup needed.

## Step 6: Audio Output

### Components

- R2: 100 Ohm series resistor
- C3: 10uF electrolytic (AC coupling)
- J1: 3.5mm TRRS jack

### Connections

```
GPIO 25 --> R2 (100R) --> C3 (+) --> C3 (-) --> Jack TIP
                                         |
                                         GND --> Jack SLEEVE
```

### Jack Wiring

| Jack Pin | Connection |
|----------|------------|
| Tip (L audio) | From C3 |
| Ring 1 (R) | Tie to Tip (mono) |
| Ring 2 (MIC) | Not connected |
| Sleeve (GND) | Ground |

## Step 7: Button Panel

### Mounting

1. Drill holes in enclosure for 6x6mm switches
2. Mount switches on PCB or panel
3. Route wires to ESP32

### Connections

| Button | ESP32 GPIO | Pullup |
|--------|------------|--------|
| MODE | GPIO 33 | Internal |
| SEL | GPIO 32 | Internal |
| UP | GPIO 35 | External 10k |
| DN | GPIO 34 | External 10k |

> [!NOTE]
> GPIO 34 and 35 are input-only. External 10k pullup resistors required.

## Step 8: LED Indicators

### Red LED (BEACON)

```
GPIO 27 --> 330R --> Red LED anode --> Cathode --> GND
```

### Blue LED (SEARCH)

```
GPIO 26 --> 330R --> Blue LED anode --> Cathode --> GND
```

### Mounting

- Drill 3mm holes in enclosure
- Mount LEDs with hot glue
- Route wires to ESP32

## Step 9: Antenna

### Wire Antenna

1. Cut 17.3cm of solid copper wire
2. Strip 5mm from one end
3. Solder to ANT pad on E22 module
4. Route wire through enclosure

### SMA Connector

1. Mount SMA bulkhead connector
2. Connect to E22 SMA output
3. Attach whip antenna

> [!TIP]
> Never transmit without antenna connected. This can damage the power amplifier.

## Step 10: Final Assembly

### Enclosure Preparation

1. Drill holes for:
   - USB-C port
   - Audio jack
   - SMA connector
   - Buttons (4x)
   - LEDs (2x)
   - OLED window
2. Mount standoffs for ESP32

### Component Placement

1. Mount ESP32 on standoffs
2. Position OLED on front panel
3. Install battery holder
4. Route all cables neatly
5. Secure with hot glue where needed

### Testing

1. Power on via USB
2. Verify OLED display
3. Test button functions
4. Check radio transmission
5. Verify audio output
6. Test GPS (if installed)

> [!TIP]
> Perform a range test after assembly. Walk away with AM receiver and note maximum audible distance.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No display | Check SPI connections, verify GPIO 4 reset |
| Radio hangs | Verify BUSY pin (GPIO 21) connected |
| No audio | Check GPIO 25, verify 10uF cap orientation |
| Buttons unresponsive | Check pullups on GPIO 34/35 |
| GPS not fixing | Move outdoors, check UART2 connections |
| Low battery reading | Verify voltage divider, adjust BAT_VREF_MV |
