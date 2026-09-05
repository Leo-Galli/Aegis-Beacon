---
title: Feature Requests
description: "Proposing a new feature for the beacon: describing the use case, checking the roadmap, and what makes a request get built."
---

# Feature Requests

The roadmap is driven by use cases, not ideas. This page explains how to propose a feature so it has a real chance of being built.

## The use-case rule

Describe the problem, not the solution:

| Weak | Strong |
| --- | --- |
| "Add a louder buzzer" | "During a snowstorm the buzzer is inaudible at 20 m" |
| "Add Bluetooth" | "I want to read the beacon status without opening the case" |

The maintainer's job is matching solutions to use cases; the request should supply the use case.

## Before you ask

1. Check the [Roadmap](roadmap): the feature may already be planned.
2. Check the [FAQ](faq) and the wiki: it may already exist in another form.
3. Search the issues: someone may have asked the same thing, with the discussion that matters.

## The process

1. Open an issue with the use case (see [Reporting Issues](reporting-issues) for the format).
2. Discuss scope: every feature has a cost in battery, complexity or both.
3. If it survives discussion, it lands on the roadmap.
4. The fastest path to any feature: build it yourself on a branch (see [Contributing](contributing)).

## The honest filter

The project's design constraint is stated on the [Overview](project-overview): a simple, rugged, battery-honest rescue device. Features that fight that constraint (heavy, power-hungry, complex) need an exceptional use case to win.

## Related pages

- [Roadmap](roadmap) for the planned work
- [Contributing](contributing) for building it yourself
- [Reporting Issues](reporting-issues) for the issue format