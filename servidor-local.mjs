// Servidor local do jogo: serve apenas a pasta public/ neste computador.
// Uso: node servidor-local.mjs   (ou dê dois cliques em INICIAR-JOGO.bat)
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { exec } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const port = Number(process.env.PORT) || 5174;
const host = '127.0.0.1'; // só este computador acessa

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

// O navegador só carrega do próprio jogo e fala com o Supabase por HTTPS.
const csp = [
  "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
  "font-src 'self'", 'connect-src \'self\' https://*.supabase.co', "worker-src 'self' blob:",
  "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'",
].join('; ');

const server = http.createServer(async (req, res) => {
  const headers = {
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
  const fail = (code, text) => { res.writeHead(code, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }); res.end(text); };
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') return fail(405, 'Método não permitido');
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return fail(400, 'Endereço inválido'); }
    if (pathname.includes('\0')) return fail(400, 'Endereço inválido');
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.resolve(root, '.' + pathname);
    // Impede sair da pasta public/ (path traversal).
    if (file !== root && !file.startsWith(root + path.sep)) return fail(403, 'Acesso negado');
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) return fail(404, 'Página não encontrada');
    const ext = path.extname(file).toLowerCase();
    const type = types[ext];
    if (!type) return fail(404, 'Página não encontrada');
    const body = await readFile(file);
    const extra = ext === '.html' ? { 'Content-Security-Policy': csp } : {};
    res.writeHead(200, { ...headers, ...extra, 'Content-Type': type, 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    fail(500, 'Erro ao processar solicitação'); // detalhe técnico não vai para o navegador
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`A porta ${port} já está em uso. O jogo provavelmente já está aberto em http://localhost:${port}`);
    if (process.platform === 'win32' && !process.env.NAO_ABRIR) exec(`start "" http://localhost:${port}`);
  } else console.log('Não foi possível iniciar o servidor.');
  process.exit(1);
});

server.listen(port, host, () => {
  const url = `http://localhost:${port}`;
  console.log(`\n  Mistério no Hospital JS está rodando em ${url}`);
  console.log('  Deixe esta janela aberta enquanto joga. Para parar, feche a janela (ou Ctrl+C).\n');
  if (process.platform === 'win32' && !process.env.NAO_ABRIR) exec(`start "" ${url}`);
});
