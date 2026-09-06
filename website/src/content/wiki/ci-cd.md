---
title: CI/CD
description: "The automated checks that gate every change: what CI runs, what CD does, and how to read a failure."
---

# CI/CD

Continuous integration runs the project's checks automatically on every push and pull request. Continuous deployment publishes the website. Both live in the repository's GitHub Actions workflows.

## The CI checks

| Check | What it verifies |
| --- | --- |
| Firmware build | The firmware compiles for the ESP32 |
| Firmware tests | The host unit tests pass (see [Unit Testing](unit-testing-firmware)) |
| Website build | The Astro site builds, all pages included |
| Type check | TypeScript passes |
| Wiki coverage | Every wiki page is registered in the navigation |
| Link check | No broken internal links |
| Content rules | No emojis or em-dashes in UI source, no AI authorship strings |
| Documentation set | README, DATASHEET and CONTRIBUTING exist; the frequency database and technology stack stay merged inside `DATASHEET.md` |

## The workflow files

| Workflow | File | Scope |
| --- | --- | --- |
| Website CI | `website-ci.yml` | Type check, content gates, build, output verification, security audit, documentation set |
| Firmware CI | `firmware-ci.yml` | PlatformIO build, size report, static source checks |
| PR Quality Checks | `pr-checks.yml` | Title and commit validation, sensitive-file scan, reviewer assignment |
| Benchmarks | `benchmarks.yml` | Compiles the firmware on four runner architectures and times the website build, publishing results |

See [CONTRIBUTING.md](https://github.com/Leo-Galli/Aegis-Beacon/blob/main/CONTRIBUTING.md) for the full contribution workflow.

## The CD step

On `main`, a successful build deploys the website to the hosting platform automatically. The [Deployment](deployment) page has the details.

## Reading a failure

1. Open the workflow run; the failing job is marked red.
2. Read the step that failed; the error is usually the last few lines.
3. Fix locally, push, and the checks re-run on the new commit.

## The two golden rules

1. `main` stays green: a red CI on `main` is an incident, not a state.
2. Checks gate merges: a PR with failing checks does not merge, whatever the code looks like.

## Related pages

- [GitHub Workflow Guide](github-workflow-guide) for the platform
- [Software Build Process](software-build-process) for the build
- [Contributing](contributing) for what the checks mean for contributors