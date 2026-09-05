#!/usr/bin/env node
/**
 * firstBody.cjs — Extract the real <body>...</body> block from
 * AegisBeacon.ino's DASHBOARD_HTML raw string literal.
 *
 * Logic:
 *  - Locate the R"HTMLDOC( ... )HTMLDOC" literal.
 *  - Find the first <body> inside it (line 1701 in the .ino).
 *  - The real closing tag is the LAST </body> token in the literal (line 2083).
 *    Earlier </body> occurrences belong to inline fragments (e.g. the radio
 *    card's stray closing snippet) and are NOT the real closing tag.
 *  - Extract from <body> up to and including the last </body>, then normalise
 *    line endings to LF.
 *
 * Run from the repo root.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INO = path.join(ROOT, 'AegisBeacon.ino');
const OUT = path.join(ROOT, 'website', 'public', 'dashboard-body.html');

let source;
try {
  source = fs.readFileSync(INO, 'utf8');
} catch (err) {
  console.error('Cannot read', INO);
  process.exit(1);
}

const startTag = 'R"HTMLDOC(';
const start = source.indexOf(startTag);
if (start < 0) {
  console.error('DASHBOARD_HTML literal not found in AegisBeacon.ino');
  process.exit(1);
}
const litStart = start + startTag.length;

const closeToken = ')HTMLDOC"';
let litEnd = source.lastIndexOf(closeToken, source.length);
if (litEnd < 0) {
  console.error('Could not find end of DASHBOARD_HTML literal');
  process.exit(1);
}
const literal = source.slice(litStart, litEnd);

const bodyOpen = literal.indexOf('<body>');
if (bodyOpen < 0) {
  console.error('No <body> found in DASHBOARD_HTML');
  process.exit(1);
}

// The real closing tag is the LAST </body> in the literal.
let scan = bodyOpen;
let lastClose = -1;
let pos = 0;
while ((pos = literal.indexOf('</body>', pos)) !== -1) {
  lastClose = pos;
  pos += 7;
}
if (lastClose < 0) {
  console.error('No </body> found in DASHBOARD_HTML');
  process.exit(1);
}

let bodyBlock = literal.slice(bodyOpen, lastClose + 7);

// Normalise line endings.
bodyBlock = bodyBlock.replace(/\r\n?/g, '\n');

const outDir = path.dirname(OUT);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(OUT, bodyBlock, 'utf8');

console.log('Wrote', OUT, '(', bodyBlock.length, 'bytes )');
