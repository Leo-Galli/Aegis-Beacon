import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LANG, DICTIONARIES, SUPPORTED_LANGS } from './translations.js';
import { renderLandingPage } from './views/landing.js';
import { renderWikiPage } from './views/wiki.js';
import { renderOverviewPage } from './views/wiki/overview.js';
import { renderHardwarePage } from './views/wiki/hardware.js';
import { renderFirmwarePage } from './views/wiki/firmware.js';
import { renderAssemblyPage } from './views/wiki/assembly.js';
import { renderFrequenciesPage } from './views/wiki/frequencies.js';
import { renderPowerPage } from './views/wiki/power.js';
import { renderSupportPage } from './views/wiki/support.js';
import { renderPinmapPage } from './views/wiki/pinmap.js';
import { renderMorsePage } from './views/wiki/morse.js';
import { renderGpsPage } from './views/wiki/gps.js';
import { renderAntennaPage } from './views/wiki/antenna.js';
import { renderConfigPage } from './views/wiki/config.js';
import { renderDisplayPage } from './views/wiki/display.js';
import { renderRfDesignPage } from './views/wiki/rf-design.js';
import { renderEnclosurePage } from './views/wiki/enclosure.js';
import { renderTestingPage } from './views/wiki/testing.js';
import { renderGlossaryPage } from './views/wiki/glossary.js';
import { renderFaqPage } from './views/wiki/faq.js';
import { renderSecurityPage } from './views/wiki/security.js';
import { renderManualPage } from './views/manual.js';
import { renderDemoPage } from './views/demo.js';
import { renderBuilderPage } from './views/builder.js';
import { renderStatusPage } from './views/status.js';

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
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.ico': 'image/x-icon'
};

/**
 * Clean URL routes -- no .html extensions.
 * Every page is assembled at request time by the view modules in /views.
 */
const PAGE_RENDERERS = {
  '/': renderLandingPage,
  '/wiki': renderWikiPage,
  '/wiki/overview': renderOverviewPage,
  '/wiki/hardware': renderHardwarePage,
  '/wiki/pinmap': renderPinmapPage,
  '/wiki/rf-design': renderRfDesignPage,
  '/wiki/antenna': renderAntennaPage,
  '/wiki/firmware': renderFirmwarePage,
  '/wiki/morse': renderMorsePage,
  '/wiki/config': renderConfigPage,
  '/wiki/display': renderDisplayPage,
  '/wiki/gps': renderGpsPage,
  '/wiki/power': renderPowerPage,
  '/wiki/assembly': renderAssemblyPage,
  '/wiki/frequencies': renderFrequenciesPage,
  '/wiki/enclosure': renderEnclosurePage,
  '/wiki/testing': renderTestingPage,
  '/wiki/security': renderSecurityPage,
  '/wiki/faq': renderFaqPage,
  '/wiki/glossary': renderGlossaryPage,
  '/wiki/support': renderSupportPage,
  '/manual': renderManualPage,
  '/demo': renderDemoPage,
  '/builder': renderBuilderPage,
  '/status': renderStatusPage
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

function renderPageSafe(renderer, lang, pathname) {
  const dict = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANG];
  return renderer(lang, dict, pathname);
}

export async function handleRequest(request, response) {
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  const pathname = requestUrl.pathname;

  // Fetch API handler (no Node response object -- used by Vercel serverless)
  if (!response) {
    if (pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }
    if (pathname === '/version') {
      return new Response(JSON.stringify({ name: 'aegis-beacon', version: appVersion, runtime: `node ${process.version}` }), {
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }
    if (pathname === '/set-lang') {
      const lang = requestUrl.searchParams.get('lang');
      const redirect = requestUrl.searchParams.get('redirect') || '/';
      const headers = new Headers({ 'Location': redirect });
      if (lang && SUPPORTED_LANGS.includes(lang)) {
        headers.append('Set-Cookie', `aegis-lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`);
      }
      return new Response(null, { status: 302, headers });
    }
    const i18nMatch = pathname.match(/^\/i18n\/([a-z]{2})\.json$/);
    if (i18nMatch) {
      const lang = SUPPORTED_LANGS.includes(i18nMatch[1]) ? i18nMatch[1] : DEFAULT_LANG;
      return new Response(JSON.stringify(DICTIONARIES[lang]), {
        status: 200,
        headers: { 'cache-control': 'public, max-age=3600', 'content-type': 'application/json; charset=utf-8' }
      });
    }
    const renderer = PAGE_RENDERERS[pathname];
    if (!renderer) return new Response('Not found', { status: 404 });
    const lang = detectLanguage(request, requestUrl);
    const html = renderPageSafe(renderer, lang, pathname);
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  // Health check
  if (pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Version info
  if (pathname === '/version') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ name: 'aegis-beacon', version: appVersion, runtime: `node ${process.version}` }));
    return;
  }

  // Set language cookie when switching
  if (pathname === '/set-lang') {
    const lang = requestUrl.searchParams.get('lang');
    const redirect = requestUrl.searchParams.get('redirect') || '/';
    if (lang && SUPPORTED_LANGS.includes(lang)) {
      response.writeHead(302, {
        'Set-Cookie': `aegis-lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`,
        'Location': redirect
      });
      response.end();
    } else {
      response.writeHead(302, { 'Location': redirect });
      response.end();
    }
    return;
  }

  // i18n dictionary endpoint
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

  // Node-rendered page routes (clean URLs, no .html)
  const renderer = PAGE_RENDERERS[pathname];
  if (renderer) {
    const lang = detectLanguage(request, requestUrl);
    try {
      const html = renderPageSafe(renderer, lang, pathname);
      response.writeHead(200, {
        'cache-control': 'no-cache',
        'content-type': 'text/html; charset=utf-8'
      });
      response.end(html);
    } catch (err) {
      console.error('Render error:', err);
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Internal server error');
    }
    return;
  }

  // Static assets with path-traversal protection
  const filePath = normalize(join(publicDirectory, `.${pathname}`));
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
