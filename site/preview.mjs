import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const port = Number(process.env.PORT ?? 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('PORT must be an integer from 1 to 65535.');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.md': 'text/plain',
};
createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep))
      throw new Error('Outside preview root');
    const content = await readFile(file);
    response.writeHead(200, {
      'content-type': `${types[extname(file)] ?? 'application/octet-stream'}; charset=utf-8`,
      'cache-control': 'no-store',
    });
    response.end(content);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('Not found. Run npm run site:build before previewing.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Catalog preview: http://127.0.0.1:${port}`));
