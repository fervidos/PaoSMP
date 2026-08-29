const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8123;
const PACK_PATH = path.join(__dirname, 'PaoSMP.zip');

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${ip} UA=${req.headers['user-agent'] || '-'}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.url === '/PaoSMP.zip' || req.url === '/pack.zip' || req.url === '/PaoSMP.zip?') {
    fs.stat(PACK_PATH, (err, stats) => {
      if (err) {
        console.error('Pack not found:', err.message);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Pack not found');
        return;
      }
      const headers = {
        'Content-Type': 'application/zip',
        'Content-Length': stats.size,
        'Content-Disposition': 'attachment; filename="PaoSMP.zip"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept-Ranges': 'bytes',
        'Last-Modified': stats.mtime.toUTCString()
      };
      res.writeHead(200, headers);
      if (req.method === 'HEAD') {
        res.end();
        console.log(`  -> HEAD 200 ${stats.size} bytes`);
      } else {
        const stream = fs.createReadStream(PACK_PATH);
        stream.on('error', (e) => {
          console.error('Stream error', e);
          if (!res.headersSent) res.writeHead(500);
          res.end();
        });
        stream.on('end', () => console.log(`  -> GET 200 sent ${stats.size} bytes`));
        stream.pipe(res);
      }
    });
  } else if (req.url === '/' || req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('PaoSMP pack host running\nGET /PaoSMP.zip to download pack (17.48M)\n');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[pack-host] Serving ${PACK_PATH} on http://0.0.0.0:${PORT}/PaoSMP.zip`);
  console.log(`[pack-host] Also: http://localhost:${PORT}/PaoSMP.zip and http://45.83.246.70:${PORT}/PaoSMP.zip`);
});
server.on('error', (e) => console.error('Server error', e));
