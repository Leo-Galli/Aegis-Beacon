---
title: GitHub Workflow Guide
description: "Using GitHub for the project: issues, pull requests, releases, and the CI checks that gate every change."
---

# GitHub Workflow Guide

GitHub is where the project lives publicly: issues, pull requests, CI, releases and the wiki. This page is the tour from a contributor's perspective.

## Issues

- **Bug reports** should include: firmware version, board, the scenario, and the serial log (see [Serial Monitor Guide](serial-monitor-guide)).
- **Feature requests** should describe the use case, not the implementation.
- Labels organize the work: `bug`, `enhancement`, `wiki`, `ci`.

## Pull requests

Every change lands through a pull request. The CI runs automatically on each PR (see [CI/CD](ci-cd)): the checks must pass before merge. A good PR:

- Is small and single-purpose
- Links the issue it closes
- Includes the test evidence (build log, bench test results)

## Releases

Releases are tagged from `main` following the firmware's version scheme (see [Changelog](changelog)). Each release bundles the firmware binary, the flash instructions, and the list of changes. The website's release badge tracks the latest tag.

## The wiki

This wiki is part of the repository: pages live under `website/src/content/wiki/`. Documentation changes go through the same PR flow as code. New pages must be registered in the navigation (see [Contributing](contributing) for the requirement).

## Related pages

- [Git Basics](git-basics) for the git layer
- [Contributing](contributing) for the project rules
- [CI/CD](ci-cd) for the automated checks