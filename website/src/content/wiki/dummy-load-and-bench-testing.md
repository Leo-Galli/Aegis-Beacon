---
title: "Dummy Load and Bench Testing"
description: "Test transmissions without radiating: a 50 ohm dummy load and safe bench procedure"
---

# Dummy Load and Bench Testing

## Overview

A dummy load absorbs the TX power instead of radiating it, letting you test the full transmit path on the bench without putting a signal on the air or near people.

## Building a 50 Ohm Load

1. Solder a 50 ohm resistor (or two 100 ohm in parallel) rated for at least 1-2 W.
2. Connect it between the SMA center and ground.
3. Mount it in a small metal box or clip a heat sink to it.

> [!WARNING]
> At +30 dBm the load dissipates ~1 W. A 0.25 W resistor burns out instantly; use a 2 W part or bigger.

## Bench Test Procedure

1. Connect the dummy load to the E22 SMA.
2. Power the beacon and enter BEACON mode.
3. Confirm the serial log shows a clean TX cycle.
4. Check the OLED progress bar and the audio click stream.
5. The only thing missing is radiation - everything else is verified.

## Why Bother

| Benefit | Detail |
|---------|--------|
| No interference | Neighbors' radios unaffected |
| Safe | No RF near eyes or people |
| Legal | No unlicensed on-air tests |
| Consistent | Measurable, repeatable TX checks |

## Related Pages

- [RF Exposure Safety](/wiki/rf-exposure-safety)
- [Outdoor Testing](/wiki/outdoor-testing)
- [Upload and Monitor](/wiki/upload-and-monitor)
- [Antenna Testing and Tuning](/wiki/antenna-testing-and-tuning)
