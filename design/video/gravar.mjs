// Grava o vídeo de lançamento no Edge headless, sem ffmpeg.
//   node gravar.mjs            → grava design/video/dropp-lanzamiento-es.mp4 (ou .webm, se o Edge não gravar MP4)
//   node gravar.mjs quadros DIR 1 4.5 9 …  → salva quadros parados (PNG) desses segundos em DIR, para conferir
// Um servidor HTTP local serve a raiz do repositório, assim o canvas lê imagens e fontes da mesma origem.
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirEdge, novaAba } from './cdp.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '../..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };

const servidor = createServer((req, res) => {
  const url = new URL(req.url, 'http://local');
  if (req.method === 'POST' && url.pathname === '/salvar') {
    const nome = (url.searchParams.get('nome') || 'video.mp4').replace(/[^\w.-]/g, '');
    const partes = [];
    req.on('data', (d) => partes.push(d));
    req.on('end', () => { writeFileSync(join(aqui, nome), Buffer.concat(partes)); res.end(join('design/video', nome)); });
    return;
  }
  const caminho = normalize(join(raiz, decodeURIComponent(url.pathname)));
  if (!caminho.startsWith(raiz) || !existsSync(caminho) || statSync(caminho).isDirectory()) { res.statusCode = 404; res.end('não encontrado'); return; }
  res.setHeader('Content-Type', TIPOS[extname(caminho)] || 'application/octet-stream');
  createReadStream(caminho).pipe(res);
});
await new Promise((r) => servidor.listen(8765, '127.0.0.1', r));

const edge = await abrirEdge(9336);
const aba = await novaAba(edge.porta);
await aba.send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false });
await aba.ir('http://127.0.0.1:8765/design/video/video.html', 500);
await aba.avaliar('window.pronto');

try {
  if (process.argv[2] === 'quadros') {
    const pasta = resolve(process.argv[3]);
    mkdirSync(pasta, { recursive: true });
    for (const t of process.argv.slice(4).map(Number)) {
      await aba.avaliar(`window.desenhar(${t}); true`);
      const { data } = await aba.send('Page.captureScreenshot', { format: 'png' });
      const arq = join(pasta, `t-${String(t).replace('.', '_')}.png`);
      writeFileSync(arq, Buffer.from(data, 'base64'));
      console.log('quadro', t, arq);
    }
  } else {
    const r = await aba.avaliar('window.gravar()');
    console.log(JSON.stringify(r));
  }
} finally {
  aba.fechar();
  await edge.fechar();
  servidor.close();
}
