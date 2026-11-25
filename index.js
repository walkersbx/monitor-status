#!/usr/bin/env node
// 极小静态状态页 + 健康检查。零依赖，只用 Node 内置 http/fs。
// 监听 $PORT（Cloady 默认 3000）。
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const INDEX = path.join(__dirname, 'index.html');
const UPDATED = process.env.PAGE_UPDATED || '';

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/healthz') {
    const body = JSON.stringify({ ok: true, app: 'monitor-status', updated: UPDATED });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
    res.end(body);
    return;
  }
  if (url === '/' || url === '/index.html') {
    fs.readFile(INDEX, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('page missing');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': data.length });
      res.end(data);
    });
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('monitor-status listening on ' + PORT);
});
