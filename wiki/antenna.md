# Antenna Design

## Quarter-Wave Whip

For 433 MHz: length = 300 / (4 * 433) = 17.3 cm. Use rigid copper wire or telescopic antenna. SMA male connector.

## Frequency-Specific Lengths

| Frequency | Length |
|-----------|--------|
| 433 MHz (ISM) | 17.3 cm |
| 446 MHz (PMR) | 16.8 cm |
| 462 MHz (GMRS) | 16.2 cm |
| 477 MHz (UHF CB) | 15.7 cm |

Formula: L(cm) = 7500 / f(MHz)

## Impedance Matching

50-ohm output. Never transmit without matched load. Mismatched loads damage the PA stage.

## Ground Plane

PCB ground plane acts as counterpoise. Mount antenna vertically for omnidirectional coverage.
