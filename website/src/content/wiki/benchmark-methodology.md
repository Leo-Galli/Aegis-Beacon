---
title: Benchmark Methodology
description: "How the automatic benchmarks are measured, on which runners, what each number means, and how to reproduce them locally."
---

# Benchmark Methodology

The Aegis-Beacon repository measures its own performance automatically. A dedicated GitHub Actions workflow compiles the firmware and builds the website on every push to the main branch, records the results, and publishes them on the [Benchmark Results](/benchmarks) page. This page explains exactly how those numbers are produced, what they mean, and how to reproduce them on your own machine.

## What is benchmarked

Two kinds of work are timed on every push:

| Benchmark | What it measures | Where it runs |
| --- | --- | --- |
| Firmware build | Wall-clock time of a full PlatformIO compile of `AegisBeacon.ino` for the ESP32, plus flash and RAM usage | All four runner platforms |
| Website build | Wall-clock time of a full `npm run build` of the Astro site, plus the number of generated HTML pages | Linux x64 runner |

The firmware numbers are the most interesting for development: flash and RAM usage are deterministic for a given commit, so they form a reliable budget that must not regress. Build time is a proxy for code complexity, but it varies with runner load.

## The runners

GitHub Actions hosts four processor families that are publicly available. The workflow runs the firmware benchmark on all of them, which is why the results page shows a card per runner:

| Runner label | Architecture | Typical CPU |
| --- | --- | --- |
| `ubuntu-latest` | Intel x64 | Intel Xeon (x64) |
| `ubuntu-24.04-arm` | ARM64 | Ampere Altra (ARMv8) |
| `windows-latest` | Intel x64 | Intel Xeon (x64) |
| `macos-latest` | Apple Silicon ARM64 | Apple M-series |

Each runner records its own CPU model, core count and total memory with every result, so you can always see which hardware produced a given number.

## How the workflow works

The workflow file is `.github/workflows/benchmarks.yml`. On every push to `main` that touches the firmware, the website, or the workflow itself, it runs:

1. A firmware job on each of the four runners. Each job installs PlatformIO (cached), compiles the firmware, and runs the measurement script `.github/scripts/benchmark-firmware.mjs`.
2. A website job on the Linux x64 runner that runs `npm ci` and times `npm run build` with `.github/scripts/benchmark-website.mjs`.
3. A publish job that downloads all results, merges them with the existing history in `website/src/data/benchmarks.json`, and commits the updated file back to the repository. The commit is tagged `[skip ci]` so the benchmarks do not trigger themselves in a loop.

The workflow can also be started manually from the Actions tab (`workflow_dispatch`) if you want a fresh measurement without pushing.

## What each metric means

| Metric | Meaning |
| --- | --- |
| Build time | Total wall-clock seconds from `platformio run` (or `astro build`) start to finish, including dependency resolution but not package installation. |
| Flash | Bytes and percent of the 4 MB flash limit used by the compiled firmware. Deterministic for a given commit. |
| RAM | Bytes and percent of the 160 KB static RAM limit used by the firmware. Deterministic for a given commit. |
| Pages built | Number of HTML files produced by the Astro build, including every wiki article. |
| Runner and CPU | The operating system, architecture, CPU model, core count and total memory of the machine that produced the run. |

## Reading the results

- **Flash and RAM are the trustworthy numbers.** The same commit produces the same byte counts on every runner. Watch them over time: a jump in flash usage often means a new library or feature, and an unexpected regression in RAM can indicate a buffer allocation problem.
- **Build times are noisy.** Shared CI runners are throttled, caches expire, and a parallel matrix run competes for CPU. Only compare build times within the same runner, and prefer the fastest recent value over the latest one.
- **History is capped.** The workflow keeps the newest 12 firmware runs per runner and the newest 12 website builds, so the results file stays small and the page loads fast.

## Where the results live

- The data file: `website/src/data/benchmarks.json` in the repository.
- The public page: [Benchmark Results](/benchmarks).
- The raw workflow runs: the Actions tab on GitHub, under the Benchmarks workflow.

## Reproducing locally

You can generate the same numbers on your own machine:

```bash
# Firmware benchmark (requires Python and PlatformIO)
python -m pip install platformio
python -m platformio run

# Website benchmark (requires Node.js 20)
cd website
npm ci
npm run build
```

The firmware build prints the RAM and flash summary at the end of its output. To time it precisely on a Unix shell:

```bash
time python -m platformio run
```

Note that a local build is not directly comparable to the CI numbers: your CPU, the state of the PlatformIO package cache, and the room temperature all influence the wall clock.

## Limitations

- The four runner labels cover the processors GitHub Actions offers today. That set can change, and when it does, the workflow is updated and the history from retired runners simply stops growing.
- The first run on a fresh cache includes toolchain downloads and is much slower than subsequent runs.
- Benchmarks measure build performance, not radio performance. RF measurements (range, sensitivity, output power) are documented separately in the [Test Procedures](/wiki/test-procedures-overview) page.