const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = (ext) => ({
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
}[ext] || 'text/plain');

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(process.cwd(), urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for unknown paths
      fs.readFile(path.join(process.cwd(), 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data2);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime(ext) });
    res.end(data);
  });
});

const port = process.env.PORT || 5500;
server.listen(port, () => {
  console.log(`Preview running at http://localhost:${port}/`);
});