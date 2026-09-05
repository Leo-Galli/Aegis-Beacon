---
title: Release Process
description: "How firmware releases happen: version numbering, the changelog, the release checklist, and what users should do before updating."
---

# Release Process

A release is a promise: this version is tested, documented and flashable by anyone. The process exists to keep that promise honest.

## Version numbering

The firmware follows semantic versioning (see [Changelog](changelog)):

| Bump | When |
| --- | --- |
| Major | Breaking config or payload format (v4 to v5) |
| Minor | New features, backward compatible |
| Patch | Bug fixes |

## The release checklist

1. All CI checks green (see [CI/CD](ci-cd)).
2. The changelog updated with the new entries.
3. The wiki's version-specific pages reviewed (config format, migration notes).
4. A bench test pass on the release candidate (see [Two Beacon Bench Test](two-beacon-bench-test)).
5. Tag the release; attach the firmware binary.

## What users should do

Before updating:

1. Read the changelog for the target version, especially migration notes.
2. Back up your configuration (serial `config dump`, see [Serial Monitor Guide](serial-monitor-guide)).
3. Flash, then verify: boot log clean, config loaded, one test burst decoded.

## Rollback

If a release misbehaves:

1. Flash the previous version.
2. Factory reset (see [Factory Reset and Recovery](factory-reset-and-recovery)) to clear any new-format config.
3. Report the problem (see [Reporting Issues](reporting-issues)).

## Related pages

- [Changelog](changelog) for the history
- [Version Selection](version-selection) for choosing a version
- [Software Build Process](software-build-process) for building from source