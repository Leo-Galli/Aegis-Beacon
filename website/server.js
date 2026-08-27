import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LANG, DICTIONARIES, SUPPORTED_LANGS } from './translations.js';
import { renderLandingPage } from './views/landing.js';
import { renderWikiPage } from './views/wiki.js';
import { renderManualPage } from './views/manual.js';
import { renderDemoPage } from './views/demo.js';

const publicDirectory = fileURLToPath(new URL('./public/', import.meta.url));
const port = Number(process.env.PORT || 3000);
const appVersion = createRequire(import.meta.url)('./package.json').version;

const contentTypes = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

/**
 * Node-rendered pages. There are NO static .html files in this repository:
 * every page is assembled at request time by the view modules in /views
 * (landing.js — hero-style landing page; wiki.js — comprehensive wiki;
 * manual.js — legacy manual; demo.js — firmware simulator).
 */
const PAGE_RENDERERS = {
  '/': renderLandingPage,
  '/index.html': renderLandingPage,
  '/wiki': renderWikiPage,
  '/manual': renderManualPage,
  '/demo.html': renderDemoPage,
  '/demo': renderDemoPage
};

function detectLanguage(request, requestUrl) {
  const queryLang = requestUrl.searchParams.get('lang');
  if (queryLang && SUPPORTED_LANGS.includes(queryLang)) return queryLang;

  const cookieMatch = (request.headers.cookie || '').match(/(?:^|;\s*)aegis-lang=([a-z]{2})/);
  if (cookieMatch && SUPPORTED_LANGS.includes(cookieMatch[1])) return cookieMatch[1];

  const accept = request.headers['accept-language'] || '';
  const preferred = accept.split(',')[0].trim().slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(preferred)) return preferred;

  return DEFAULT_LANG;
}

export async function handleRequest(request, response) {
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  const pathname = requestUrl.pathname;
  if (!response) {
    const renderer = PAGE_RENDERERS[pathname];
    if (!renderer) return new Response('Not found', { status: 404 });
    const lang = detectLanguage(request, requestUrl);
    return new Response(renderer(lang, DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG]), {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
  }

  if (pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  if (pathname === '/version') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ name: 'aegis-beacon', version: appVersion, runtime: `node ${process.version}` }));
    return;
  }

  // i18n dictionary endpoint (used by the client-side language switcher).
  const i18nMatch = pathname.match(/^\/i18n\/([a-z]{2})\.json$/);
  if (i18nMatch) {
    const lang = SUPPORTED_LANGS.includes(i18nMatch[1]) ? i18nMatch[1] : DEFAULT_LANG;
    response.writeHead(200, {
      'cache-control': 'public, max-age=3600',
      'content-type': 'application/json; charset=utf-8'
    });
    response.end(JSON.stringify(DICTIONARIES[lang]));
    return;
  }

  // Node-rendered page routes (language-aware, no static HTML involved).
  const renderer = PAGE_RENDERERS[pathname];
  if (renderer) {
    const lang = detectLanguage(request, requestUrl);
    try {
      const html = renderer(lang, DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG]);
      response.writeHead(200, {
        'cache-control': 'no-cache',
        'content-type': 'text/html; charset=utf-8'
      });
      response.end(html);
    } catch {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Internal server error');
    }
    return;
  }

  // Static assets (banner.png, favicon, /js/*, /css/*) with path-traversal protection.
  const requestedPath = pathname;
  const filePath = normalize(join(publicDirectory, `.${requestedPath}`));
  const rootPrefix = publicDirectory.endsWith(sep) ? publicDirectory : `${publicDirectory}${sep}`;
  if (!filePath.startsWith(rootPrefix)) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      'cache-control': 'public, max-age=3600',
      'content-type': contentTypes[extname(filePath)] || 'application/octet-stream'
    });
    response.end(file);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer(handleRequest).listen(port, () => {
    console.log(`Aegis-Beacon server listening on http://localhost:${port}`);
  });
}
