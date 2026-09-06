# Contributing to Aegis-Beacon

Thank you for considering a contribution. This project is built for mountain safety, so correctness matters: a bug in the firmware or a wrong number in the documentation can have real-world consequences. Please read this guide before opening an issue or a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Automated Checks](#automated-checks)
- [Automated Pull Request Workflows](#automated-pull-request-workflows)
- [Benchmark Pipeline](#benchmark-pipeline)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Testing](#testing)
- [Release Process](#release-process)

## Code of Conduct

Be respectful and constructive. This project welcomes contributors of every experience level. Harassment, trolling and personal attacks are not tolerated.

## How to Contribute

| Type | Where |
|------|-------|
| Bug report | [Issues](https://github.com/Leo-Galli/Aegis-Beacon/issues) with the `bug` label |
| Feature request | [Issues](https://github.com/Leo-Galli/Aegis-Beacon/issues) with the `enhancement` label |
| Question | [Discussions](https://github.com/Leo-Galli/Aegis-Beacon/discussions) |
| Code, docs or wiki | Fork, branch, commit, open a pull request |

Small fixes (typos, one-line corrections, missing wiki pages) are always welcome. Larger changes should be discussed in an issue first so maintainers can confirm the direction.

## Development Setup

```bash
# Website (wiki, demo, builder)
cd website
npm install
npm run check        # Astro type check
npm run build        # Static build -> website/dist/
npm run dev          # Local dev server at http://localhost:4321

# Firmware (PlatformIO env: esp32devkitv1)
pio run --target upload
pio device monitor --baud 115200
```

The firmware is a single-file Arduino sketch (`AegisBeacon.ino`) at the repository root. The website is an Astro static site in `website/`. All documentation content lives in `website/src/content/wiki/*.md`, with navigation defined in `website/src/lib/wiki-nav.ts` — **every new wiki page must be registered in the navigation**, or CI fails.

## Commit Message Format

Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description in English>
```

Allowed types:

| Type | Use for |
|------|---------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation or wiki changes |
| `style` | Formatting, no behaviour change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build, CI, tooling or maintenance |
| `ci` | CI workflow changes |

Examples:

```
fix: align Morse coordinate encoding with documented DDM format
feat: add serial command to set frequency over USB
docs: expand the build and assembly wiki section
ci: harden website workflow content checks
```

Rules:

- Write the description in **English**, imperative mood, lowercase, no trailing period.
- **Never** add co-author trailers, AI attribution, or bot signatures (for example `Co-authored-by: ...`). Commit messages must remain clean and professional.
- Keep the message under 72 characters where possible. Use the body for the "why", not the "what".

## Pull Request Process

1. Fork the repository and create a branch with a descriptive name: `fix/emergency-power`, `feat/serial-commands`, `docs/wiki-build`.
2. Make your changes. Keep them focused: one logical change per PR.
3. Run the local verification steps relevant to your change (see [Testing](#testing)).
4. Open the pull request against `main` with a clear title that describes the change, and a body explaining what and why.
5. Wait for the automated checks. A maintainer reviews and merges once everything is green.

## Automated Checks

Every pull request and push to `main` runs automated checks:

- **Type Check & Lint** (Website CI): `astro check`, wiki navigation coverage (every `.md` page registered, none orphaned), content-quality gates (no emoji, no em-dashes in UI source, no AI/co-author strings, no hardcoded localhost, no external fonts or CDNs), then a full static build and a verification pass over the built output (sitemap, robots.txt, SEO meta, internal links).
- **Build & Verify**: the built site is inspected by `.github/scripts/verify-website.mjs` to catch broken pages and missing metadata.
- **Security Audit**: `npm audit` plus a static scan for `eval()`, `innerHTML` and hardcoded secrets.
- **Firmware CI**: compiles the sketch with PlatformIO, checks the firmware size and runs static checks over the `.ino` source (required libraries, serial init, watchdog, deep sleep, GPS, WiFi/BT management).
- **PR Quality Checks**: validates the PR title and commit messages, flags sensitive or oversized files, and verifies the root documentation set (`README.md`, `DATASHEET.md`, `CONTRIBUTING.md`, and that the legacy `FREQUENCIES.md` / `TECHNOLOGIES.md` stay merged inside `DATASHEET.md`).

If a check fails, read the workflow log, fix the cause locally, and push again. Do not silence checks with `[skip ci]` except for the benchmark publish commit, which uses it deliberately to avoid an infinite loop.

## Automated Pull Request Workflows

| Workflow | File | When it runs | What it does |
|----------|------|--------------|--------------|
| Website CI | `.github/workflows/website-ci.yml` | Push/PR touching `website/**` | Type check, content gates, build, output verification, security audit |
| Firmware CI | `.github/workflows/firmware-ci.yml` | Push/PR touching the sketch or `platformio.ini` | PlatformIO build, size report, static source checks |
| PR Quality Checks | `.github/workflows/pr-checks.yml` | Every PR | Title/commit validation, sensitive-file scan, documentation set verification, reviewer assignment |
| Benchmarks | `.github/workflows/benchmarks.yml` | Push to `main` touching code or the site | Compiles the firmware on four runner architectures, times the website build, publishes results |

Reviewer assignment is automatic: the PR Quality Checks workflow assigns the maintainer as reviewer and posts a summary comment.

## Benchmark Pipeline

Pushes to `main` trigger the **Benchmarks** workflow, which measures the firmware build time on the four GitHub Actions architectures (Intel x64 Linux, ARM64 Linux, Windows x64, Apple Silicon macOS) plus the full website build time. Results are merged into `website/src/data/benchmarks.json` and committed back with `[skip ci]`; the `/benchmarks` page on the site renders them. See the [Benchmark Methodology](/wiki/benchmark-methodology) wiki article for details.

## Code Style

**Firmware (`AegisBeacon.ino`):**

- Comment generously, especially around safety-critical paths (radio, GPS, emergency mode, deep sleep).
- Use the existing `#define` naming convention (`DEFAULT_*`, `BAT_*`, `PIN_*`) and keep constants at the top of the file.
- Keep the sketch compilable with PlatformIO and Arduino IDE; do not introduce platform-specific code without guarding it.
- ASCII only in source strings: no em-dashes or non-ASCII punctuation in log output.

**Website (Astro):**

- TypeScript strict; `npm run check` must pass with zero errors, warnings and hints.
- No external font or CDN requests: fonts are self-hosted via Fontsource.
- No emoji and no em-dashes in UI source files (`src/pages`, `src/layouts`, `src/components`).
- Reuse the design-system classes in `public/css/site.css` instead of adding ad-hoc page styles.
- New wiki pages need valid frontmatter (`title`, `description`) and a navigation entry in `src/lib/wiki-nav.ts`.

## Documentation

The wiki is the primary documentation surface (400+ pages). When you change firmware behaviour, update the affected wiki pages and the `DATASHEET.md` so the repository reference and the live site stay in sync:

- `DATASHEET.md` is the single merged reference: electrical specs, GPIO map, NVS schema, HTTP API, technology stack, build/deploy commands and the global SAR frequency database.
- `README.md` is intentionally short and points to `DATASHEET.md`, `CONTRIBUTING.md` and the wiki.

## Testing

Before opening a PR:

```bash
# Website
cd website && npm run check && npm run build

# CI content gates (run from the repository root)
node .github/scripts/verify-website.mjs   # against website/dist after a build

# Firmware
pio run
```

Manually verify what you changed: after a firmware change, flash a device and exercise the affected mode; after a website change, run the dev server and check the affected pages at mobile and desktop widths.

## Release Process

Releases are created from `main` by the maintainer. A release is tagged `vX.Y.Z` and follows the changelog in `DATASHEET.md` (section 22). If your PR changes user-visible behaviour, mention it in the PR body so it can be folded into the next changelog entry.

---

*Questions? Open an issue or a discussion and a maintainer will help.*