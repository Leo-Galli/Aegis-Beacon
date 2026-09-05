---
title: Code Style Guide
description: "The firmware's coding conventions: naming, formatting, comments, and the review rules that keep the code consistent."
---

# Code Style Guide

Consistent code is easier to review, and this project is small enough that the style can stay simple. The rules fit on one page.

## Naming

| Thing | Style | Example |
| --- | --- | --- |
| Variables | lower_snake_case | `sleep_interval_s` |
| Functions | lower_snake_case, verb-first | `build_payload()` |
| Constants | UPPER_SNAKE_CASE | `PAYLOAD_MAX_LEN` |
| Types/structs | UpperCamelCase | `BeaconConfig` |
| Files | lower_snake_case | `firmware_main.cpp` |

## Formatting

- 2-space indentation, no tabs
- Braces on the same line as the opening statement
- One statement per line
- 100-column soft limit; wrap at a comma or operator
- No trailing whitespace

## Comments

- Explain why, not what: the code says what it does.
- A block comment at the top of each file names the file's purpose.
- TODO comments carry an issue reference: `// TODO(#123): add GPS averaging`.
- No commented-out code; git has history.

## The review rules

1. A change does one thing.
2. No unrelated edits in the same commit.
3. New behavior comes with a test or a documented bench procedure.
4. Magic numbers get named constants (the config struct in [Config Payload Format](config-payload-format) is the model).

## Related pages

- [Contributing](contributing) for the contribution rules
- [Software Build Process](software-build-process) for the build
- [Firmware Overview](firmware-overview) for the code map