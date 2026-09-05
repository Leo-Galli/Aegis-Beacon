---
title: SX1262 Registers
description: "The SX1262 register map essentials: the configuration commands the firmware uses and the ones that cause most integration errors."
---

# SX1262 Registers

The SX1262 is configured through SPI commands, not bare register writes. This page lists the commands the firmware actually uses and the traps around them.

## The command surface

| Command | Purpose |
| --- | --- |
| `SetStandby` | Enter standby mode |
| `SetFrequency` | Set the carrier frequency |
| `SetPacketType` | LoRa or FSK |
| `SetModulationParams` | Bandwidth, spreading factor, coding rate |
| `SetTxParams` | Power level and ramp |
| `SetPacketParams` | Preamble, payload length, CRC |
| `SetDioIrqParams` | Which events raise the interrupt |
| `WriteBuffer / ReadBuffer` | Payload data |
| `SetRx / SetTx` | Start reception or transmission |
| `GetRssiInst` | Read the instantaneous RSSI (see [Firmware RSSI Measurement](firmware-rssi-measurement)) |

## The busy line trap

The SX1262 requires the host to wait while it is busy after every command: poll the BUSY pin before sending the next command. Ignoring this is the single most common SX1262 integration error, and its symptom is maddening: commands seem to work but the radio never transmits correctly. See [E22 Module Pinout](e22-module-pinout) for the pin.

## The frequency trap

`SetFrequency` takes a 32-bit value in units of the crystal reference (the "step"). The firmware computes it as:

```
freq = frequency_Hz / (32 MHz / 2^25)
```

Using the wrong reference (the bare chip datasheet uses 32 MHz; some modules change it) shifts the radio off-frequency. A beacon that transmits but cannot be heard on the expected channel is usually this.

## Power and ramp

`SetTxParams` sets both the power (in dBm) and the ramp time. The E22 module's PA configuration must match the module variant; the [E22 Radio Module Guide](e22-radio-module-guide) documents the values for the 30 dBm modules.

## Related pages

- [SX1262 Datasheet Notes](sx1262-datasheet-notes) for the datasheet reading
- [Radio Library and SX1262](radio-library-and-sx1262) for the library layer
- [E22 Module Pinout](e22-module-pinout) for the hardware