---
title: Unit Testing the Firmware
description: "Testing firmware logic on the host: what can be tested without hardware, the test layout, and what the CI runs."
---

# Unit Testing the Firmware

Most firmware bugs live in pure logic: the Morse encoder, the payload builder, the NMEA parser. Those functions do not need hardware, so they can be tested on a computer, fast, in CI.

## What can be tested on the host

| Module | What the test checks |
| --- | --- |
| Morse encoder | Correct dots/dashes for every letter and digit |
| Payload builder | Exact output for given inputs (see [Config Payload Format](config-payload-format)) |
| NMEA parser | Field extraction and checksum validation |
| Config loader | Defaults, version migration, invalid-blob recovery |
| Coordinate conversion | DDM to decimal and back (see [Coordinate Conversion](coordinate-conversion)) |

## The test layout

PlatformIO's unit test framework puts tests next to the code:

```
lib/morse/
  morse.c
  test/test_morse.cpp
```

Run with `pio test` (see [PlatformIO Guide](platformio-guide)). The tests compile the module for the host, run, and report pass/fail in seconds.

## The golden test

The best kind of test for a beacon payload: a golden test. Feed known inputs, assert the exact expected bytes:

```
build_payload("SOS", "IK2XYZ", 45.8325, 6.8650)
  == "SOS DE IK2XYZ 45.8325 6.8650"
```

When the format changes (see [Changelog](changelog)), the golden test changes with it, deliberately, in the same commit.

## What CI runs

The CI builds and runs the host tests on every push (see [CI/CD](ci-cd)). A failing test blocks the merge: that is the point of the pipeline.

## What still needs hardware

Timing, radio behavior, GPS acquisition and battery behavior cannot be unit-tested. Those get the bench procedures: [Two Beacon Bench Test](two-beacon-bench-test) and [Receiver Testing](receiver-testing).

## Related pages

- [Software Build Process](software-build-process) for the build
- [CI/CD](ci-cd) for the pipeline
- [Code Style Guide](code-style-guide) for the conventions