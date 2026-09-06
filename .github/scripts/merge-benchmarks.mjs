#!/usr/bin/env node
/**
 * Merge benchmark results.
 *
 * Collects every `bench-*.json` artifact produced by the matrix runners,
 * merges them with the existing history in `website/src/data/benchmarks.json`
 * (deduplicated by run id), keeps the newest 12 firmware runs per platform
 * and the newest 12 website builds, and writes the file back.
 *
 * Usage: node merge-benchmarks.mjs <artifactsDir> <targetJson>
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [artifactsDir, targetPath] = process.argv.slice(2);
if (!artifactsDir || !targetPath) {
  console.error('Usage: node merge-benchmarks.mjs <artifactsDir> <targetJson>');
  process.exit(1);
}

const files = [];
if (existsSync(artifactsDir)) {
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        walk(p);
      } else if (name.startsWith('bench-') && name.endsWith('.json')) {
        files.push(p);
      }
    }
  }
  walk(artifactsDir);
}

const fresh = [];
for (const f of files) {
  try {
    const parsed = JSON.parse(readFileSync(f, 'utf8'));
    if (Array.isArray(parsed)) fresh.push(...parsed);
    else fresh.push(parsed);
  } catch (err) {
    console.warn(`Skipping unreadable artifact ${f}: ${err.message}`);
  }
}

let existing = [];
if (existsSync(targetPath)) {
  try {
    existing = JSON.parse(readFileSync(targetPath, 'utf8')).runs ?? [];
  } catch {
    existing = [];
  }
}

const byId = new Map();
for (const run of [...fresh, ...existing]) {
  if (run && typeof run.id === 'string' && run.timestamp) byId.set(run.id, run);
}

let runs = [...byId.values()];

const firmwarePlatforms = [
  ...new Set(runs.filter((r) => r.kind === 'firmware').map((r) => r.platform)),
];
const kept = [];
for (const platform of firmwarePlatforms) {
  kept.push(
    ...runs
      .filter((r) => r.kind === 'firmware' && r.platform === platform)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 12)
  );
}
kept.push(
  ...runs
    .filter((r) => r.kind === 'website-build')
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 12)
);

runs = kept.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

const data = {
  updatedAt: new Date().toISOString(),
  generatedBy: 'github-actions benchmarks workflow',
  runs,
};

writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Merged ${fresh.length} new result(s); history now holds ${runs.length} runs.`);