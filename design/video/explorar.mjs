// Lista os botões de cada estado, para escrever os passos da captura.
// Uso: node explorar.mjs "p=caderno-es|+ Lote|Cordial de lima"  (cada | é um clique pelo texto do botão)
import { abrirEdge, novaAba, espera } from './cdp.mjs';

const BASE = process.env.BASE || 'http://localhost:5173';
const edge = await abrirEdge(9334);
const aba = await novaAba(edge.porta);
await aba.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
const CLICAR = `(txt) => { const b = [...document.querySelectorAll('button,[role=button]')].find(x => (x.textContent||'').replace(/\\s+/g,' ').includes(txt)); if (!b) return 'NÃO ACHEI: ' + txt; b.dispatchEvent(new MouseEvent('click', { bubbles: true })); return 'ok ' + txt; }`;
for (const e of process.argv.slice(2)) {
  const [query, ...cliques] = e.split('|');
  await aba.ir(`${BASE}/prototipos/rodar.html?${query}`, 1500);
  for (const c of cliques) { console.log('  ' + await aba.avaliar(`(${CLICAR})(${JSON.stringify(c)})`)); await espera(400); }
  const r = await aba.avaliar(`[...document.querySelectorAll('button,[role=button]')].map(b => (b.textContent||b.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,70)).filter(Boolean)`);
  const texto = await aba.avaliar(`(document.querySelector('.app')||document.body).innerText.replace(/\\s+/g,' ').slice(0, 400)`);
  console.log(`== ${e}\n  TEXTO: ${texto}\n  ` + r.join('\n  '));
}
aba.fechar();
await edge.fechar();
