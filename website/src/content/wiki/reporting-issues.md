---
title: Reporting Issues
description: "Filing a useful bug report: the information a maintainer needs, the format, and what makes a report actionable."
---

# Reporting Issues

A good bug report is a gift: it contains everything needed to reproduce, and nothing else. This page is the template the project asks for.

## The template

```
title: one sentence, the symptom
Firmware version: (from the boot log or changelog)
Hardware: board, radio module, GPS module
Scenario: what you were doing
Expected: what should have happened
Actual: what happened instead
Serial log: the relevant lines
```

## What makes a report actionable

| Include | Example |
| --- | --- |
| The version | "v5.5.0" |
| The exact scenario | "In CONFIG mode, setting TX power to +22, then saving" |
| The serial log | The lines around the failure (see [Serial Monitor Guide](serial-monitor-guide)) |
| A photo of the wiring | For hardware reports |
| What you already tried | Saves the maintainer repeating your work |

## What makes it useless

- "It doesn't work" with no version, scenario or log
- A photo of a screen with no explanation
- Reporting two unrelated problems in one issue
- Speculation about the cause instead of the facts

## The verification step

Before filing, check the [Troubleshooting](troubleshooting) page and the [FAQ](faq): the answer may already exist. A report that arrives after the user checked the wiki is worth double.

## Related pages

- [Contributing](contributing) for the whole contribution flow
- [Feature Requests](feature-requests) for the other direction
- [GitHub Workflow Guide](github-workflow-guide) for the platform