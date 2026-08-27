# Assembly Guide

Assembly of the Aegis-Beacon unit requires precision and basic SMD (Surface Mount Device) soldering skills.

## Bill of Materials (BOM)

Estimated total BOM: ~$23-28 USD

## Step-by-Step Assembly

### Step 1: Solder Passive Components
Solder the 0805 or 0603 SMD resistors and capacitors first, preferably using high-conductivity solder paste and a hot-air station.

### Step 2: Position Main ICs
Position the ESP32 and SX1262 chip accurately on their respective footprints. Tack the corners before reflowing the contacts.

### Step 3: Solder SMA Connector
**WARNING:** Never power the unit without first connecting a suitable antenna or 50-ohm dummy load, otherwise the power amplifier stage may fail immediately.

### Step 4: Install Display Header
Solder the 7-pin header for the SSD1309 OLED display module.

### Step 5: GPS Module
Connect NEO-6M GPS module via 4-pin header to GPIO 12 (TX) and GPIO 22 (RX).

### Step 6: Audio Circuit
Solder 100 ohm resistor and 10uF coupling capacitor to GPIO 25 (DAC1) for Morse tone output.

### Step 7: LED Indicators
Install Red LED (GPIO 27) and Blue LED (GPIO 26) with current-limiting resistors.

### Step 8: Battery Connector
Install TP4056 charger module and 18650 battery holder with spring contacts.

### Step 9: Buttons
Install 4 tactile buttons for MODE, SEL, UP, and DOWN functions.

### Step 10: Enclosure Assembly
Mount PCB in Hammond 1593L enclosure. Cut holes for SMA, USB-C, OLED, and buttons. Apply silicone sealant for weather resistance.
