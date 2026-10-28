// Minimal static server for out/, mirroring the Nginx try_files rule. Used by tests.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('out');
const port = Number(process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json', '.pdf': 'application/pdf' };

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (url === '/') {
      res.writeHead(302, { Location: /^vi/i.test(req.headers['accept-language'] || '') ? '/vi/' : '/en/' });
      return res.end();
    }
    let file = path.join(root, url);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'Content-Type': types['.html'] });
      return fs.createReadStream(path.join(root, '404.html')).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`serving out/ on http://localhost:${port}`));
