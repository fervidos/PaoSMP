const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8123;
const PACK_PATH = path.join(__dirname, 'PaoSMP.zip');

const server = http.createServer((req, res) => {
  // CORS for Minecraft client
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/PaoSMP.zip' || req.url === '/pack.zip') {
    fs.stat(PACK_PATH, (err, stats) => {
      if (err) {
        res.writeHead(404);
        res.end('Pack not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stats.size,
        'Content-Disposition': 'attachment; filename="PaoSMP.zip"',
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(PACK_PATH).pipe(res);
    });
  } else if (req.url === '/' || req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('PaoSMP pack host running\nGET /PaoSMP.zip to download pack\n');
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[pack-host] Serving ${PACK_PATH} on http://0.0.0.0:${PORT}/PaoSMP.zip`);
  console.log(`[pack-host] Also: http://localhost:${PORT}/PaoSMP.zip and http://192.168.1.240:${PORT}/PaoSMP.zip`);
});
