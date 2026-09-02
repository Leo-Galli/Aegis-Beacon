---
title: "Contributing to Aegis-Beacon"
description: "How to contribute code, hardware designs, documentation, and testing"
order: 23
---

# Contributing to Aegis-Beacon

Aegis-Beacon is an open-source project that welcomes contributions from the community. Whether you are a software developer, hardware engineer, documentation writer, or tester, there are many ways to help.

## Ways to Contribute

### Code Contributions

The firmware is written in C++ using PlatformIO and the Arduino framework.

**Getting started:**

1. Fork the repository on GitHub.
2. Clone your fork and create a feature branch.
3. Set up PlatformIO development environment.
4. Make your changes and test on real hardware.
5. Submit a pull request with a clear description.

**Areas where help is needed:**

- Improving GPS parsing reliability
- Adding support for new GPS modules
- Optimizing power consumption
- Implementing new operating modes
- Adding telemetry protocols
- Improving the WiFi captive portal interface

### Hardware Contributions

The hardware is designed in KiCad (open-source EDA tool).

**Areas where help is needed:**

- PCB layout improvements
- New enclosure designs
- Alternative component sourcing
- Antenna designs
- Test fixture development

### Documentation

Good documentation is essential for a hardware project.

**Areas where help is needed:**

- Improving existing wiki pages
- Translating documentation to other languages
- Creating video tutorials
- Writing assembly guides with photos
- Updating the BOM with current pricing

### Testing

Testing is critical for a safety-related device.

**How to help:**

- Test firmware on different hardware revisions
- Report bugs with detailed reproduction steps
- Verify frequency accuracy with test equipment
- Test range in different environments
- Validate battery life measurements

## Development Setup

### Prerequisites

- **VS Code** with PlatformIO extension
- **Git** for version control
- **ESP32 development board** for initial testing
- **Aegis-Beacon hardware** for final validation

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Leo-Galli/Aegis-Beacon.git
cd Aegis-Beacon/firmware

# Open in VS Code with PlatformIO extension
code .

# Build for ESP32
pio run

# Upload to device
pio run --target upload

# Monitor serial output
pio device monitor
```

### Running Tests

```bash
# Run unit tests
pio test

# Run with verbose output
pio test -v
```

## Coding Standards

### C++ Style

- Follow the Arduino style guide.
- Use `camelCase` for variables and functions.
- Use `PascalCase` for class names.
- Use `UPPER_SNAKE_CASE` for constants and macros.
- Document public functions with Doxygen-style comments.

### Git Commit Messages

- Use imperative mood ("Add feature" not "Added feature").
- Keep the subject line under 72 characters.
- Reference issue numbers when applicable.

Example:
```
Add configurable beep pattern for Search mode

Implement user-selectable beep patterns (short, long, ascending)
in the Search mode configuration. Patterns are stored in EEPROM
and persist across reboots.

Fixes #142
```

## Pull Request Process

1. Create a feature branch from `main`.
2. Make your changes in small, focused commits.
3. Test on real hardware before submitting.
4. Update documentation if your change affects the API or user interface.
5. Submit the pull request with a clear description of what changed and why.
6. Respond to review feedback promptly.
7. Once approved, your PR will be merged.

> [!NOTE]
> All pull requests require at least one review before merging. For hardware changes, testing on real hardware is required.

## Reporting Issues

When reporting bugs, please include:

- **Firmware version:** Visible on the OLED during boot.
- **Hardware revision:** Check the PCB silkscreen.
- **Steps to reproduce:** What you did, what you expected, what happened.
- **Serial log output:** If available, include the relevant log section.
- **Photos:** For hardware issues, include clear photos of the affected area.

## Code of Conduct

- Be respectful and constructive in all interactions.
- Focus on the technical merit of contributions.
- Welcome newcomers and help them get started.
- Give credit where it is due.
- Disagreements are normal; resolve them through discussion, not escalation.

## License

By contributing to Aegis-Beacon, you agree that your contributions will be licensed under the MIT License, consistent with the project's existing licensing.
