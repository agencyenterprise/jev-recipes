import { createServer } from 'node:http';
import { createFindHandler } from './find.mjs';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const { recipes } = JSON.parse(
  await readFile(new URL('./dist/catalog.json', import.meta.url), 'utf8'),
);
const find = createFindHandler({ recipes });
const port = Number(process.env.PORT ?? 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('PORT must be an integer from 1 to 65535.');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};
const securityHeaders = {
  'content-security-policy': "default-src 'self'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
};
const staticCache = 'public, max-age=300, stale-while-revalidate=86400';
const notFoundPage = await readFile(resolve(root, '404.html')).catch(() => null);

createServer(async (request, response) => {
  for (const [name, value] of Object.entries(securityHeaders)) response.setHeader(name, value);
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/api/find') {
      await find(request, response);
      return;
    }
    const path = decodeURIComponent(url.pathname);
    let file = resolve(root, '.' + path);
    if (file !== resolve(root) && !file.startsWith(root.endsWith(sep) ? root : root + sep))
      return notFound(response);
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(308, { location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      file = resolve(file, 'index.html');
    }
    const content = await readFile(file);
    response.writeHead(200, {
      'content-type': `${types[extname(file)] ?? 'application/octet-stream'}; charset=utf-8`,
      'cache-control': staticCache,
    });
    response.end(content);
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code) || error instanceof URIError)
      return notFound(response);
    response.writeHead(500, {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    });
    response.end('The page could not be served. Please try again.');
  }
}).listen(port, '0.0.0.0', () => console.log(`Catalog preview: http://127.0.0.1:${port}`));

function notFound(response) {
  if (notFoundPage) {
    response.writeHead(404, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    });
    response.end(notFoundPage);
    return;
  }
  response.writeHead(404, {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end('Not found. Run npm run site:build before previewing.');
}
