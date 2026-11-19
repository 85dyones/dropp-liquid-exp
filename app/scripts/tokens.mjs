// Gera src/estilo/tokens.css a partir de design/sistema-de-design/project/tokens.json.
// O sistema de design é a fonte única: mude o tokens.json e rode `npm run tokens`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const raiz = new URL('../../design/sistema-de-design/project/', import.meta.url);
const t = JSON.parse(readFileSync(new URL('tokens.json', raiz), 'utf8'));

const valor = (v) => (typeof v === 'string' ? v.replace(/^\{(.+)\}$/, 'var(--$1)') : v);
const temas = t.color.themes.map((x) => x.id);

let css = '/* Gerado de design/sistema-de-design/project/tokens.json por scripts/tokens.mjs. Não edite à mão. */\n';

temas.forEach((tema, i) => {
  const seletor = i === 0 ? `:root, [data-theme="${tema}"]` : `[data-theme="${tema}"]`;
  const linhas = t.color.tokens
    .map((tok) => {
      const v = typeof tok.value === 'object' ? tok.value[tema] : i === 0 ? tok.value : null;
      return v == null ? '' : `  --${tok.name}: ${valor(v)};\n`;
    })
    .join('');
  css += `${seletor} {\n${linhas}}\n`;
});

css += ':root {\n';
for (const familia of ['spacing', 'radius', 'shadow', 'alvo', 'borda']) {
  for (const tok of t[familia]?.tokens ?? []) css += `  --${tok.name}: ${tok.value};\n`;
}
for (const [chave, pilha] of Object.entries(t.type.families)) css += `  --font-${chave}: ${pilha};\n`;
css += '}\n';

for (const f of t.type.fonts) {
  css += `@font-face { font-family: "${f.family}"; src: url("../../../design/sistema-de-design/project/fonts/${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style}; font-display: swap; }\n`;
}

const destino = new URL('../src/estilo/', import.meta.url);
mkdirSync(destino, { recursive: true });
writeFileSync(new URL('tokens.css', destino), css);
console.log(`tokens.css: ${t.color.tokens.length} cores em ${temas.length} temas, ${t.type.fonts.length} fontes`);
