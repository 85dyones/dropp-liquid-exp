// Copia os protótipos de design/ para public/prototipos-dados/, que o player lê.
// Cada protótipo leva o Main.dc.html como está e um notas.json com o título,
// as notas do canvas (na ordem de leitura) e os controles do painel.
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const design = resolve(aqui, '../../design');
const destino = resolve(aqui, '../public/prototipos-dados');

export const LISTA = [
  { slug: 'turno-pt', pasta: 'prototipo-turno', area: 'turno', lang: 'pt' },
  { slug: 'turno-es', pasta: 'prototipo-turno-es', area: 'turno', lang: 'es' },
  { slug: 'caderno-pt', pasta: 'prototipo-caderno', area: 'caderno', lang: 'pt' },
  { slug: 'caderno-es', pasta: 'prototipo-cuaderno-es', area: 'caderno', lang: 'es' },
  { slug: 'passaporte-pt', pasta: 'prototipo-passaporte', area: 'passaporte', lang: 'pt' },
  { slug: 'passaporte-es', pasta: 'prototipo-pasaporte-es', area: 'passaporte', lang: 'es' },
  { slug: 'atlas-pt', pasta: 'prototipo-atlas', area: 'atlas', lang: 'pt' },
  { slug: 'atlas-es', pasta: 'prototipo-atlas-es', area: 'atlas', lang: 'es' },
  { slug: 'escola-pt', pasta: 'prototipo-escola', area: 'escola', lang: 'pt' },
  { slug: 'escola-es', pasta: 'prototipo-escola-es', area: 'escola', lang: 'es' }
];

function propsDoScript(html) {
  const m = html.match(/<script type="text\/x-dc"[^>]*data-props='([^']*)'/);
  if (!m) return { controles: [], tela: { largura: 390, altura: 844 } };
  const def = JSON.parse(m[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  const tela = { largura: def.$preview?.width ?? 390, altura: def.$preview?.height ?? 844 };
  const controles = Object.entries(def)
    .filter(([k, v]) => !k.startsWith('$') && v && v.editor === 'enum')
    .map(([nome, v]) => ({ nome, opcoes: v.options, padrao: v.default }));
  return { controles, tela };
}

rmSync(destino, { recursive: true, force: true });
const manifesto = [];
for (const p of LISTA) {
  const origem = join(design, p.pasta, 'project');
  const pasta = join(destino, p.slug);
  mkdirSync(pasta, { recursive: true });
  const html = readFileSync(join(origem, 'Main.dc.html'), 'utf8');
  copyFileSync(join(origem, 'Main.dc.html'), join(pasta, 'Main.dc.html'));
  const canvas = JSON.parse(readFileSync(join(origem, 'canvas.json'), 'utf8'));
  const notas = Object.entries(canvas.notes || {})
    .map(([id, n]) => ({ id, texto: n.text, tipo: n.kind || 'nota', cor: n.fill || 'gray', x: n.x ?? 0, y: n.y ?? 0 }))
    .sort((a, b) => (a.y - b.y) || (a.x - b.x));
  const titulo = notas.find((n) => n.tipo === 'title1')?.texto || canvas.title;
  const { controles, tela } = propsDoScript(html);
  const dados = { ...p, titulo: canvas.title, chamada: titulo, controles, tela, notas: notas.filter((n) => n.tipo !== 'title1') };
  writeFileSync(join(pasta, 'notas.json'), JSON.stringify(dados));
  manifesto.push({ slug: p.slug, area: p.area, lang: p.lang, titulo: canvas.title });
}
writeFileSync(join(destino, 'manifesto.json'), JSON.stringify(manifesto));
console.log(`prototipos: ${manifesto.length} copiados para public/prototipos-dados`);
