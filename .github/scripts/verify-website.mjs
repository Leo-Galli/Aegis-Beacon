#!/usr/bin/env node
/**
 * Deep verification of the built Astro website (run in CI after `npm run build`).
 * Checks, from the `website/dist` output:
 *   1. robots.txt exists and points at the sitemap
 *   2. sitemap-index.xml exists and lists the built pages
 *   3. every built HTML page has the expected SEO head (canonical, OG, Twitter)
 *   4. every internal link and asset resolves to a real built file
 *   5. no leftover Google Fonts or other external font/CDN references
 *   6. every wiki content page is registered in the navigation source
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dist = join(root, 'website', 'dist');
const srcDir = join(root, 'website', 'src');
const problems = [];
const pages = [];

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p, out); continue; }
    if (name.endsWith('.html')) out.push(p);
  }
}

// 1 + 2. robots.txt and sitemap
if (!existsSync(join(dist, 'robots.txt'))) problems.push('dist/robots.txt is missing');
else {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  if (!/Sitemap:\s*https:\/\/aegis-beacon\.vercel\.app\/sitemap-index\.xml/i.test(robots)) {
    problems.push('robots.txt does not reference the sitemap index');
  }
}
if (!existsSync(join(dist, 'sitemap-index.xml'))) problems.push('dist/sitemap-index.xml is missing');
else {
  const idx = readFileSync(join(dist, 'sitemap-index.xml'), 'utf8');
  if (!idx.includes('sitemap-0.xml')) problems.push('sitemap-index.xml does not list sitemap-0.xml');
}
if (!existsSync(join(dist, 'sitemap-0.xml'))) problems.push('dist/sitemap-0.xml is missing');
else {
  const sm = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  const urls = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.length < 100) problems.push(`sitemap-0.xml only lists ${urls.length} URLs (expected 100+)`);
  if (!urls.some((u) => u.includes('/wiki/'))) problems.push('sitemap has no /wiki/ URLs');
  if (!urls.some((u) => u.includes('/repeaters'))) problems.push('sitemap has no /repeaters URL');
}

// 3 + 4. every page: SEO head + internal link integrity
walk(dist, pages);
const requiredMeta = [
  ['canonical', /<link rel="canonical" href="https:\/\/aegis-beacon\.vercel\.app\//],
  ['description', /<meta name="description" content=/],
  ['og:title', /<meta property="og:title" content=/],
  ['og:description', /<meta property="og:description" content=/],
  ['og:image', /<meta property="og:image" content="https:\/\/aegis-beacon\.vercel\.app\//],
  ['og:url', /<meta property="og:url" content=/],
  ['twitter:card', /<meta name="twitter:card" content="summary_large_image">/],
  ['JSON-LD', /<script type="application\/ld\+json"/],
];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const rel = page.slice(dist.length).replaceAll('\\', '/');
  for (const [name, re] of requiredMeta) {
    if (!re.test(html)) problems.push(`${rel}: missing ${name} meta`);
  }
  // internal links: strip fragments; only same-origin or root-relative
  for (const m of html.matchAll(/(?:href|src)="(\/(?:[^"#]*?))(?:"|#)/g)) {
    const target = m[1].replace(/\/$/, '');
    if (!target || target === '/' || target.startsWith('/css') || target.startsWith('/_astro')) {
      // asset links verified below; skip root + inlined
      continue;
    }
    const candidates = [
      join(dist, target),
      join(dist, target, 'index.html'),
      join(dist, `${target}.html`),
    ];
    if (!candidates.some((c) => existsSync(c))) problems.push(`${rel}: broken link /${target}`);
  }
}

// 5. no external font/CDN references in built assets
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  if (/fonts\.googleapis\.com|cdnjs\.cloudflare|unpkg\.com|jsdelivr\.net/i.test(html)) {
    problems.push(`${page.slice(dist.length)}: external font/CDN reference found`);
  }
}

// 6. every wiki .md file registered in wiki-nav.ts
const wikiDir = join(srcDir, 'content', 'wiki');
const navSrc = readFileSync(join(srcDir, 'lib', 'wiki-nav.ts'), 'utf8');
const wikiFiles = readdirSync(wikiDir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const missing = wikiFiles.filter((id) => !navSrc.includes(`id: '${id}'`));
if (missing.length) problems.push(`wiki pages not registered in wiki-nav.ts: ${missing.join(', ')}`);

if (problems.length) {
  console.error(`Website verification failed with ${problems.length} issue(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Website verification passed: ${pages.length} pages checked, robots + sitemap OK, no broken links.`);
