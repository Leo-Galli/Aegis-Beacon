---
title: Wiring Order and Routing
description: "How to route the internal wires cleanly: power, SPI, UART, audio and the antenna feed."
---

# Wiring Order and Routing

Inside a small case, wire routing is what separates a reliable beacon from one that resets randomly.

## The golden rules

1. **Power first, signal second**: run BAT+/GND as a twisted pair or close pair; keep them away from the antenna.
2. **Separate the antenna**: the 17.3 cm wire (or SMA feed) should not run parallel to the GPS antenna or the OLED ribbon.
3. **Short signal runs**: SPI at 433 MHz device speeds is fine on 10-15 cm of wire, but keep runs as short as the case allows.
4. **No loops**: avoid coiling any wire; a loop becomes an antenna or an inductor.
5. **Mechanical strain**: anchor wires with a dab of hot glue at the board edge so the soldered joints never flex.

## Per-bus routing

| Bus | Recommendation |
|-----|----------------|
| VSPI (radio) | Keep SCK/MOSI/MISO together and away from the OLED's software SPI pins |
| Software SPI (OLED) | Short direct runs; this bus runs at a few MHz |
| UART (GPS) | Twist TX/RX together, keep away from the radio |
| Audio | The DAC wire can pick up noise; route it away from the ESP32's antenna area |
| Buttons/LEDs | Any routing works; pull-ups on 34/35 must reach 3.3 V |

## In the enclosure

- Cut wire lengths to fit, do not coil the excess.
- Use the case's internal channels if it has them.
- Keep the OLED ribbon flat; folded ribbon can crack traces.
- The battery sits away from the OLED so the cell's metal can does not block the display.

## The antenna feed

If you use the E22's SMA with an external antenna, the SMA body must connect to the case ground. If you use the internal 17.3 cm wire, route it up the side of the case, away from the battery and the GPS patch.