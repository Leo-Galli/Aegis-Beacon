# Frequently Asked Questions

## General

### What is Aegis-Beacon?

Aegis-Beacon is an open-source, ultra-low-cost emergency rescue beacon designed for avalanche survival, backcountry emergencies, and SAR operations. It transmits Morse code with GPS coordinates on 433 MHz.

### How much does it cost?

Total BOM cost is **~$23-28 USD** using AliExpress/LCSC components. See [Hardware Components](/wiki/hardware-components) for complete parts list.

### How long does the battery last?

In BEACON mode with 10-second sleep interval: **~65 hours** on a single 18650 cell. See [Power Management](/wiki/power-management) for detailed runtime estimates.

### Is it legal to use?

Check local regulations. In the EU, PMR446 allows 500mW without license. In the US, FRS allows 2W without license. See [Frequency Compatibility](/wiki/frequency-compatibility) for regional details.

## Hardware

### What receiver do I need?

Any AM-mode receiver on 433 MHz:
- Baofeng with AM mode
- Handheld scanner
- Ham radio transceiver
- RTL-SDR + SDR# software

The SX1262 CW carrier is detected identically to OOK.

### Can I run this without GPS?

Yes. Set `gpsEnabled = false` in the CONFIG portal. The beacon works without GPS -- it just transmits `SOS` or `SOS DE [NAME]` as configured.

### Does it work through snow?

433 MHz penetrates wet snow at ~3 dB/m attenuation. The E22-400M30S at +30 dBm PA compensates significantly. At 1m burial depth expect ~3-9 dB signal loss -- well within the link budget.

### What battery should I use?

Any 18650 Li-ion cell works. For alpine deployments, use **LiFePO4** (rated to -30C) for better cold weather performance.

> [!TIP]
> LiFePO4 cells have slightly lower capacity (1500-2000 mAh) but maintain performance in extreme cold.

## Firmware

### How do I update firmware?

1. Connect ESP32 via USB
2. Open Arduino IDE or PlatformIO
3. Upload new firmware
4. Settings are preserved in NVS

### Can I change settings without reflashing?

Yes. Use the CONFIG portal (WiFi AP) to change all settings at runtime. Hold SEL for 3 seconds to start WiFi AP.

### What is the maximum range?

Line of sight: **15+ km**. Mountain terrain: 5-10 km. Urban: 1-3 km. See [RF Design](/wiki/rf-design-link-budget) for link budget analysis.

### How accurate are GPS coordinates?

The transmitted DDM format encodes ~0.1 minute precision (~185m). Full decimal coordinates are logged to Serial at much higher precision. For search purposes, ~200m accuracy is sufficient.

## Assembly

### Do I need SMD soldering skills?

Yes. The project uses 0805 SMD components. If you're new to soldering, practice on scrap boards first.

### How long does assembly take?

Approximately **3-4 hours** for experienced builders. First-time builders may need 5-6 hours.

### Can I 3D print the enclosure?

Yes. STL files are available in the repository. Use PLA or PETG for durability.

### What tools do I need?

- Soldering iron (25-40W, fine tip)
- Solder (60/40 or lead-free)
- Flux
- Multimeter
- Wire strippers

## Operation

### How do I switch modes?

Press **MODE** button to toggle between BEACON and SEARCH. Hold for 2 seconds to activate EMERGENCY mode.

### How do I adjust volume/WPM?

1. Press **SEL** to toggle VOL/WPM target
2. Use **UP/DN** to adjust value
3. Hold **SEL** for 1 second to save

### How do I access the config portal?

1. Hold **SEL** for 3 seconds
2. Connect to `AegisBeacon` WiFi
3. Open `http://192.168.4.1`

### How do I factory reset?

Hold both **MODE** and **SEL** buttons at boot for 5 seconds. Device reboots with default settings.

> [!WARNING]
> Factory reset erases all configuration. You must reconfigure via CONFIG portal after reset.

## Troubleshooting

### Device won't boot

1. Check USB connection
2. Verify power supply
3. Try different USB cable
4. Press BOOT button during upload

### Radio not transmitting

1. Verify BUSY pin (GPIO 21) connected
2. Check SPI connections
3. Test with SDR
4. Increase TX power

### OLED not displaying

1. Check SPI connections
2. Verify 3.3V power
3. Test with simple sketch
4. Check reset pin (GPIO 4)

### GPS not fixing

1. Move outdoors
2. Wait 5-15 minutes
3. Check UART2 connections
4. Verify GPS power

## Community

### How can I contribute?

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

See [Security & Legal](/wiki/security) for contribution guidelines.

### Where can I get help?

- **GitHub Issues:** Report bugs or request features
- **GitHub Discussions:** Ask questions
- **Wiki:** Technical documentation

### Can I use this commercially?

Yes, under MIT license. See [Security & Legal](/wiki/security) for details.

> [!NOTE]
> If this project saves a life, please open a PR and let us know.
