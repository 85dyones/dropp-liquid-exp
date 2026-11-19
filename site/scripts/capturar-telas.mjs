// Captura as telas reais dos protótipos (em espanhol e português) para o site, em WebP a 2×.
// Precisa dos protótipos no ar: o app em http://localhost:5173 (npm --prefix app run dev) ou BASE com o endereço publicado.
import { mkdirSync, writeFileSync } from 'node:fs';
import { abrirEdge, novaAba, espera } from './cdp.mjs';

const BASE = process.env.BASE || 'http://localhost:5173';
const TELAS = [
  { nome: 'turno', p: { es: 'turno-es', pt: 'turno-pt' }, extra: '&hora=antes', cliques: {}, rolar: {} },
  { nome: 'lote', p: { es: 'caderno-es', pt: 'caderno-pt' }, extra: '',
    cliques: { es: ['+ Lote', 'Cordial de lima', '3 L', 'Crear lote'], pt: ['+ Lote', 'Cordial de limão', '3 L', 'Criar lote'] },
    rolar: { es: 'La etiqueta', pt: 'A etiqueta' } },
  { nome: 'voz', p: { es: 'turno-es', pt: 'turno-pt' }, extra: '&hora=servico', cliques: { es: ['Penicillin'], pt: ['Penicillin'] }, rolar: { es: 'Tú, por voz', pt: 'Você, por voz' } },
  { nome: 'passaporte', p: { es: 'passaporte-es', pt: 'passaporte-pt' }, extra: '&tela=rotulo', cliques: {}, rolar: {} },
  { nome: 'atlas', p: { es: 'atlas-es', pt: 'atlas-pt' }, extra: '&aba=estante', cliques: {}, rolar: {} },
  { nome: 'escola', p: { es: 'escola-es', pt: 'escola-pt' }, extra: '&aba=escola&plano=socio', cliques: {}, rolar: {} }
];

const CLICAR = `(txt) => { const b = [...document.querySelectorAll('button,[role=button]')].find(x => (x.textContent||'').replace(/\\s+/g,' ').includes(txt)); if (!b) throw new Error('Botão não encontrado: ' + txt); b.dispatchEvent(new MouseEvent('click', { bubbles: true })); }`;
const ROLAR = `(alvo) => {
  const corpo = document.querySelector('.corpo'); if (!corpo) return 0;
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const el = [...corpo.querySelectorAll('*')].find(e => norm(e.textContent).startsWith(norm(alvo)) && e.children.length < 6);
  if (!el) throw new Error('Texto não encontrado para rolar: ' + alvo);
  let y = 0, n = el; while (n && n !== corpo) { y += n.offsetTop; n = n.offsetParent; }
  corpo.scrollTop = Math.max(0, y - 16); return corpo.scrollTop; }`;

const edge = await abrirEdge(9336);
const aba = await novaAba(edge.porta);
await aba.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
for (const lang of ['es', 'pt']) {
  const pasta = new URL(`../public/telas/${lang}/`, import.meta.url);
  mkdirSync(pasta, { recursive: true });
  for (const t of TELAS) {
    await aba.ir(`${BASE}/prototipos/rodar.html?p=${t.p[lang]}${t.extra}`, 1800);
    await aba.avaliar('document.fonts.ready.then(() => true)');
    for (const c of t.cliques[lang] || []) { await aba.avaliar(`(${CLICAR})(${JSON.stringify(c)})`); await espera(450); }
    if (t.rolar[lang]) { await aba.avaliar(`(${ROLAR})(${JSON.stringify(t.rolar[lang])})`); await espera(300); }
    if (await aba.avaliar(`!!document.querySelector('.motor-erro')`)) throw new Error(`O protótipo parou em ${lang}/${t.nome}`);
    const { data } = await aba.send('Page.captureScreenshot', { format: 'webp', quality: 82 });
    writeFileSync(new URL(`${t.nome}.webp`, pasta), Buffer.from(data, 'base64'));
    console.log('capturada', lang, t.nome);
  }
}
aba.fechar();
await edge.fechar();
