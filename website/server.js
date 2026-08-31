import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderLandingPage } from './views/landing.js';
import { renderWikiPage } from './views/wiki.js';
import { renderPage as renderOverviewPage } from './views/wiki/overview.js';
import { renderPage as renderHardwarePage } from './views/wiki/hardware.js';
import { renderPage as renderFirmwarePage } from './views/wiki/firmware.js';
import { renderPage as renderAssemblyPage } from './views/wiki/assembly.js';
import { renderPage as renderFrequenciesPage } from './views/wiki/frequencies.js';
import { renderPage as renderPowerPage } from './views/wiki/power.js';
import { renderPage as renderSupportPage } from './views/wiki/support.js';
import { renderPage as renderPinmapPage } from './views/wiki/pinmap.js';
import { renderPage as renderMorsePage } from './views/wiki/morse.js';
import { renderPage as renderGpsPage } from './views/wiki/gps.js';
import { renderPage as renderAntennaPage } from './views/wiki/antenna.js';
import { renderPage as renderConfigPage } from './views/wiki/config.js';
import { renderPage as renderDisplayPage } from './views/wiki/display.js';
import { renderPage as renderRfDesignPage } from './views/wiki/rf-design.js';
import { renderPage as renderEnclosurePage } from './views/wiki/enclosure.js';
import { renderPage as renderTestingPage } from './views/wiki/testing.js';
import { renderPage as renderGlossaryPage } from './views/wiki/glossary.js';
import { renderPage as renderFaqPage } from './views/wiki/faq.js';
import { renderPage as renderSecurityPage } from './views/wiki/security.js';
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

async function renderPageSafe(renderer, pathname) {
  return await renderer(pathname);
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
    const renderer = PAGE_RENDERERS[pathname];
    if (!renderer) return new Response('Not found', { status: 404 });
    const html = await renderPageSafe(renderer, pathname);
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

  // Node-rendered page routes (clean URLs, no .html)
  const renderer = PAGE_RENDERERS[pathname];
  if (renderer) {
    try {
      const html = await renderPageSafe(renderer, pathname);
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
