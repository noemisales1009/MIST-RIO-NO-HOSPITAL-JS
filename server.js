'use strict';
// Servidor estático mínimo para hospedagens que ligam o site por um "arquivo de entrada" (Hostinger, por exemplo).
// Serve esta pasta na porta indicada em PORT (ou 3000), sem listar pastas e sem sair da pasta (path traversal).
// O jogo não precisa de servidor próprio: isto só entrega os arquivos como estão.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json'
};
// Pastas e arquivos que não fazem parte do jogo (testes, scripts, SQL, documentação) ficam fora do ar.
const hidden = new Set(['.git', 'node_modules', 'tests', 'scripts', 'supabase', 'dist', 'out', 'server.js', 'servidor-local.mjs', 'package.json', 'package-lock.json', '.gitignore', '.htaccess', 'README.md', 'ART_ASSETS.md', 'CLAUDE.md', 'LEIA-ME-PRIMEIRO.txt', 'INICIAR-JOGO.bat']);

http.createServer((request, response) => {
  const fail = (status, text) => { response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end(text); };
  if (request.method !== 'GET' && request.method !== 'HEAD') return fail(405, 'Método não permitido');
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); } catch { return fail(400, 'Endereço inválido'); }
  if (pathname.includes('\0')) return fail(400, 'Endereço inválido');
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) return fail(403, 'Acesso negado');
  const first = path.relative(root, file).split(path.sep)[0];
  if (hidden.has(first) || first.startsWith('.')) return fail(404, 'Página não encontrada');
  fs.stat(file, (error, info) => {
    if (error || !info.isFile()) return fail(404, 'Página não encontrada');
    const type = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': type, 'Content-Length': info.size, 'Cache-Control': file.endsWith('.html') ? 'no-cache' : 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' });
    if (request.method === 'HEAD') return response.end();
    fs.createReadStream(file).on('error', () => fail(500, 'Erro ao ler o arquivo')).pipe(response);
  });
}).listen(port, '0.0.0.0', () => console.log('Mistério no Hospital JS servindo ' + root + ' na porta ' + port));
