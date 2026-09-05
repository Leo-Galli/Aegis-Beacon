#!/usr/bin/env node
/**
 * firstBody.cjs - Extract the dashboard CSS and <body>...</body> block from
 * AegisBeacon.ino's DASHBOARD_HTML raw string literal.
 *
 * Logic:
 *  - Locate AegisBeacon.ino (works from repo root or website directory).
 *  - Locate the R"HTMLDOC( ... )HTMLDOC" literal.
 *  - Extract the <style> block, scope it to .dash-frame-inner, and strip external fonts.
 *  - Find the real closing tag: the LAST </body> token in the literal.
 *  - Extract from <body> up to and including the last </body>.
 *  - Save extracted files to website/src/data/dashboard-body.html and website/src/data/dashboard.css.
 */

const fs = require('fs');
const path = require('path');

// Locate AegisBeacon.ino
let rootDir = process.cwd();
let foundIno = false;
if (fs.existsSync(path.join(rootDir, 'AegisBeacon.ino'))) {
  foundIno = true;
} else if (fs.existsSync(path.join(rootDir, '..', 'AegisBeacon.ino'))) {
  rootDir = path.resolve(rootDir, '..');
  foundIno = true;
}

const INO = path.join(rootDir, 'AegisBeacon.ino');
const DATA_DIR = path.join(rootDir, 'website', 'src', 'data');
const OUT_BODY = path.join(DATA_DIR, 'dashboard-body.html');
const OUT_CSS = path.join(DATA_DIR, 'dashboard.css');

if (!foundIno) {
  if (fs.existsSync(OUT_BODY) && fs.existsSync(OUT_CSS)) {
    console.log('AegisBeacon.ino not found, using existing extracted dashboard files.');
    process.exit(0);
  }
  console.error('Cannot locate AegisBeacon.ino from', process.cwd());
  process.exit(1);
}

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

// -- 1. Extract and scope CSS -----------------------------------------------
const styleOpen = literal.indexOf('<style>');
const styleClose = literal.indexOf('</style>', styleOpen);
if (styleOpen < 0 || styleClose < 0) {
  console.error('No <style> found in DASHBOARD_HTML');
  process.exit(1);
}
const rawCss = literal.slice(styleOpen + 7, styleClose).trim();

function scopeCss(css, scopeClass = '.dash-frame-inner') {
  // Remove external Google fonts import to satisfy self-hosted policy & CI
  let cleaned = css.replace(/@import\s+url\([^)]+\);?/g, '');

  // Add self-hosted font fallbacks
  cleaned = cleaned
    .replace(/'Share Tech Mono',\s*monospace/g, "'Share Tech Mono', 'JetBrains Mono', monospace")
    .replace(/'Orbitron',\s*sans-serif/g, "'Orbitron', 'Chakra Petch', sans-serif");

  cleaned = cleaned.replace(/\r\n?/g, '\n');

  const result = [];
  let i = 0;
  while (i < cleaned.length) {
    while (i < cleaned.length && /\s/.test(cleaned[i])) i++;
    if (i >= cleaned.length) break;

    // Handle @keyframes
    if (cleaned.startsWith('@keyframes', i)) {
      const braceOpen = cleaned.indexOf('{', i);
      let depth = 0;
      let j = braceOpen;
      while (j < cleaned.length) {
        if (cleaned[j] === '{') depth++;
        else if (cleaned[j] === '}') {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      result.push(cleaned.slice(i, j + 1));
      i = j + 1;
      continue;
    }

    // Handle @media
    if (cleaned.startsWith('@media', i)) {
      const braceOpen = cleaned.indexOf('{', i);
      const mediaHeader = cleaned.slice(i, braceOpen).trim();
      let depth = 0;
      let j = braceOpen;
      while (j < cleaned.length) {
        if (cleaned[j] === '{') depth++;
        else if (cleaned[j] === '}') {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      const mediaBody = cleaned.slice(braceOpen + 1, j);
      const scopedMediaBody = scopeCss(mediaBody, scopeClass);
      result.push(`${mediaHeader} {\n${scopedMediaBody}\n}`);
      i = j + 1;
      continue;
    }

    // Standard rule
    const braceOpen = cleaned.indexOf('{', i);
    if (braceOpen === -1) break;
    const braceClose = cleaned.indexOf('}', braceOpen);
    if (braceClose === -1) break;

    const selectorChunk = cleaned.slice(i, braceOpen).trim();
    let ruleBody = cleaned.slice(braceOpen + 1, braceClose).trim();

    const selectors = selectorChunk.split(',').map(s => s.trim()).filter(Boolean);
    const transformedSelectors = selectors.map(sel => {
      if (sel === ':root') return scopeClass;
      if (sel === 'body') return scopeClass;
      if (sel === '*') return `${scopeClass}, ${scopeClass} *`;
      if (sel.startsWith('::-webkit-scrollbar')) return `${scopeClass}${sel}`;
      return `${scopeClass} ${sel}`;
    });

    if (selectorChunk === 'header') {
      ruleBody = ruleBody.replace(/position:\s*sticky;?/, 'position:relative;');
      ruleBody += ';border-radius:0;';
    }

    result.push(`${transformedSelectors.join(', ')} {\n  ${ruleBody}\n}`);
    i = braceClose + 1;
  }

  return result.join('\n\n');
}

const scopedCss = scopeCss(rawCss);

// -- 2. Extract Body --------------------------------------------------------
const bodyOpen = literal.indexOf('<body>');
if (bodyOpen < 0) {
  console.error('No <body> found in DASHBOARD_HTML');
  process.exit(1);
}

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

let bodyBlock = literal.slice(bodyOpen + 6, lastClose).trim();
bodyBlock = bodyBlock.replace(/\r\n?/g, '\n');

// -- 3. Write files ---------------------------------------------------------
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

fs.writeFileSync(OUT_CSS, scopedCss, 'utf8');
console.log('Wrote', OUT_CSS, '(', scopedCss.length, 'bytes )');

fs.writeFileSync(OUT_BODY, bodyBlock, 'utf8');
console.log('Wrote', OUT_BODY, '(', bodyBlock.length, 'bytes )');

// Also remove stale public/dashboard-body.html if present
const publicBody = path.join(rootDir, 'website', 'public', 'dashboard-body.html');
if (fs.existsSync(publicBody)) {
  fs.unlinkSync(publicBody);
  console.log('Removed stale', publicBody);
}
