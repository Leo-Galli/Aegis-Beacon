import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = fileURLToPath(new URL('./public/', import.meta.url));
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

export async function handleRequest(request, response) {
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  if (requestUrl.pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  const requestedPath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const filePath = normalize(join(rootDirectory, `.${requestedPath}`));
  const rootPrefix = rootDirectory.endsWith(sep) ? rootDirectory : `${rootDirectory}${sep}`;
  if (!filePath.startsWith(rootPrefix)) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      'cache-control': extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=3600',
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
