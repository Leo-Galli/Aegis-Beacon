#!/usr/bin/env node
/**
 * Firmware benchmark.
 *
 * Compiles the Aegis-Beacon firmware with PlatformIO and records:
 *   - wall-clock build time
 *   - flash usage (bytes and percent of the 4 MB limit)
 *   - RAM usage (bytes and percent of the 160 KB limit)
 *   - the runner's CPU model, architecture and OS
 *
 * Runs in the Benchmarks workflow on every push to main, on every
 * processor family GitHub Actions provides (Linux x64, Linux arm64,
 * Windows x64, macOS arm64). Writes a single JSON object to
 * `bench-firmware.json` in the current directory.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import os from 'node:os';

function run(cmd, args) {
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const startedAt = Date.now();
const log = run('python', ['-m', 'platformio', 'run']);
const buildMs = Date.now() - startedAt;

const ramMatch = log.match(
  /RAM:\s*\[[^\]]*\]\s*([\d.]+)%\s*\(used\s+(\d+)\s+bytes\s+from\s+(\d+)\s+bytes\)/
);
const flashMatch = log.match(
  /Flash:\s*\[[^\]]*\]\s*([\d.]+)%\s*\(used\s+(\d+)\s+bytes\s+from\s+(\d+)\s+bytes\)/
);

let pioVersion = 'unknown';
try {
  pioVersion = run('python', ['-m', 'platformio', '--version']).trim();
} catch {
  /* keep default */
}

const cpu = os.cpus()[0];
const commit = git(['rev-parse', 'HEAD']);
const shortSha = commit.slice(0, 7);

const result = {
  id: `${shortSha}-${os.platform()}-${os.arch()}`,
  kind: 'firmware',
  commit,
  shortSha,
  branch: git(['branch', '--show-current']) || 'main',
  timestamp: new Date().toISOString(),
  platform: `${os.platform()}-${os.arch()}`,
  runner: `${process.env.RUNNER_OS ?? os.platform()} ${process.env.RUNNER_ARCH ?? os.arch()}`,
  cpuModel: cpu ? cpu.model.replace(/\s+/g, ' ').trim() : 'unknown',
  cpuSpeedMhz: cpu ? cpu.speed : null,
  cpuCount: os.cpus().length,
  totalMemMb: Math.round(os.totalmem() / (1024 * 1024)),
  buildMs,
  flashBytes: flashMatch ? Number(flashMatch[2]) : null,
  flashLimit: flashMatch ? Number(flashMatch[3]) : null,
  flashPct: flashMatch ? Number(flashMatch[1]) : null,
  ramBytes: ramMatch ? Number(ramMatch[2]) : null,
  ramLimit: ramMatch ? Number(ramMatch[3]) : null,
  ramPct: ramMatch ? Number(ramMatch[1]) : null,
  pioVersion,
};

writeFileSync('bench-firmware.json', JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(
  `Firmware benchmark done: ${buildMs} ms, flash ${result.flashPct}%, RAM ${result.ramPct}%, on ${result.runner} (${result.cpuModel})`
);