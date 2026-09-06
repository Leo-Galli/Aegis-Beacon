#!/usr/bin/env node
/**
 * Website build benchmark.
 *
 * Times a full `npm run build` of the Astro site and counts the produced
 * HTML pages plus the total output size. Runs in the Benchmarks workflow
 * on every push to main. Writes a single JSON object to `bench-website.json`
 * one directory above the current working directory (the repo root).
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const outFile = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'bench-website.json');

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p, out);
    } else if (name.endsWith('.html') && !name.includes('dashboard-body')) {
      out.push(p);
    }
  }
}

const startedAt = Date.now();
execFileSync(npmCmd, ['run', 'build'], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
  stdio: ['ignore', 'inherit', 'inherit'],
});
const buildMs = Date.now() - startedAt;

const dist = join(process.cwd(), 'dist');
const pages = [];
walk(dist, pages);

const commit = git(['rev-parse', 'HEAD']);
const shortSha = commit.slice(0, 7);
const cpu = os.cpus()[0];

const result = {
  id: `${shortSha}-${os.platform()}-${os.arch()}-website`,
  kind: 'website-build',
  commit,
  shortSha,
  branch: git(['branch', '--show-current']) || 'main',
  timestamp: new Date().toISOString(),
  platform: `${os.platform()}-${os.arch()}`,
  runner: `${process.env.RUNNER_OS ?? os.platform()} ${process.env.RUNNER_ARCH ?? os.arch()}`,
  cpuModel: cpu ? cpu.model.replace(/\s+/g, ' ').trim() : 'unknown',
  cpuCount: os.cpus().length,
  buildMs,
  pages: pages.length,
};

writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(`Website build benchmark done: ${buildMs} ms, ${pages.length} pages, on ${result.runner}`);