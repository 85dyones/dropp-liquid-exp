// Captura as telas reais dos protótipos em espanhol, a 3×, para o vídeo de lançamento.
// Precisa do app rodando (npm --prefix app run dev) ou de BASE apontando para o endereço publicado.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirEdge, novaAba, espera } from './cdp.mjs';

const BASE = process.env.BASE || 'http://localhost:5173';
const pasta = join(dirname(fileURLToPath(import.meta.url)), 'telas');
mkdirSync(pasta, { recursive: true });

// Cada tela: o protótipo, os cliques (pelo texto do botão) e até onde rolar antes da captura.
export const TELAS = [
  { nome: '1-recados', query: 'p=turno-es&hora=antes', cliques: [], rolar: null },
  { nome: '2-lote', query: 'p=caderno-es', cliques: ['+ Lote', 'Cordial de lima', '3 L', 'Crear lote'], rolar: 'La etiqueta' },
  { nome: '3-servicio', query: 'p=turno-es&hora=servico', cliques: ['Penicillin'], rolar: 'Tú, por voz' },
  { nome: '4-cierre', query: 'p=turno-es&hora=fecho', cliques: ['Grabar la nota'], rolar: 'Tu nota' },
  { nome: '5-pasaporte', query: 'p=passaporte-es&tela=rotulo', cliques: [], rolar: null }
];

const CLICAR = `(txt) => { const b = [...document.querySelectorAll('button,[role=button]')].find(x => (x.textContent||'').replace(/\\s+/g,' ').includes(txt)); if (!b) throw new Error('Botão não encontrado: ' + txt); b.dispatchEvent(new MouseEvent('click', { bubbles: true })); }`;
// Rola o contêiner de rolagem até o primeiro elemento cujo texto começa com o alvo (soma os offsetTop, como no Atlas).
const ROLAR = `(alvo) => {
  const corpo = document.querySelector('.corpo'); if (!corpo) return 'sem corpo';
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const el = [...corpo.querySelectorAll('*')].find(e => norm(e.textContent).startsWith(norm(alvo)) && e.children.length < 6);
  if (!el) throw new Error('Texto não encontrado para rolar: ' + alvo);
  let y = 0, n = el; while (n && n !== corpo) { y += n.offsetTop; n = n.offsetParent; }
  corpo.scrollTop = Math.max(0, y - 16); return corpo.scrollTop; }`;

const edge = await abrirEdge(9335);
const aba = await novaAba(edge.porta);
await aba.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
for (const t of TELAS) {
  await aba.ir(`${BASE}/prototipos/rodar.html?${t.query}`, 1800);
  await aba.avaliar('document.fonts.ready.then(() => true)');
  for (const c of t.cliques) { await aba.avaliar(`(${CLICAR})(${JSON.stringify(c)})`); await espera(450); }
  if (t.rolar) { await aba.avaliar(`(${ROLAR})(${JSON.stringify(t.rolar)})`); await espera(300); }
  const erro = await aba.avaliar(`!!document.querySelector('.motor-erro')`);
  if (erro) throw new Error(`O protótipo parou em ${t.nome}`);
  const { data } = await aba.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(pasta, `${t.nome}.png`), Buffer.from(data, 'base64'));
  console.log('capturada', t.nome);
}
aba.fechar();
await edge.fechar();
