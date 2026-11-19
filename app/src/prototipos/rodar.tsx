// Roda um protótipo sozinho, do tamanho da prancheta (390 × 844).
// Dentro da moldura da página do protótipo, recebe os controles do painel por postMessage.
// Aberto direto no celular, escala para caber na tela.
import { createElement, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Host, Limite, lerPrototipo, type Prototipo } from './motor';
import './rodar.css';

const busca = new URLSearchParams(location.search);
const slug = busca.get('p') || '';
const base = import.meta.env.BASE_URL;
const raiz = document.getElementById('raiz')!;

function Rodar({ prototipo, largura, altura }: { prototipo: Prototipo; largura: number; altura: number }) {
  const inicial: Record<string, unknown> = { ...prototipo.padroes };
  for (const k of Object.keys(prototipo.padroes)) if (busca.has(k)) inicial[k] = busca.get(k);
  const [props, setProps] = useState(inicial);
  const [escala, setEscala] = useState(1);

  useEffect(() => {
    const ouvir = (e: MessageEvent) => {
      if (e.origin !== location.origin || !e.data || e.data.tipo !== 'props') return;
      setProps((p) => ({ ...p, ...e.data.props }));
    };
    window.addEventListener('message', ouvir);
    window.parent?.postMessage({ tipo: 'pronto', slug }, location.origin);
    return () => window.removeEventListener('message', ouvir);
  }, []);

  useEffect(() => {
    if (window.parent !== window) return;
    const ajustar = () => {
      const w = Math.min(window.innerWidth, window.screen.width || window.innerWidth);
      const h = Math.min(window.innerHeight, window.screen.height || window.innerHeight);
      setEscala(Math.min(1, w / largura, h / altura));
    };
    ajustar();
    window.addEventListener('resize', ajustar);
    return () => window.removeEventListener('resize', ajustar);
  }, [largura, altura]);

  return createElement('div', { className: 'prancheta', style: { width: largura, height: altura, transform: escala < 1 ? `scale(${escala})` : undefined } },
    createElement(Limite, null, createElement(Host, { prototipo, props })));
}

async function iniciar() {
  if (!/^[a-z]+-(pt|es)$/.test(slug)) throw new Error('Protótipo não encontrado.');
  const [html, notas] = await Promise.all([
    fetch(`${base}prototipos-dados/${slug}/Main.dc.html`).then((r) => { if (!r.ok) throw new Error('Protótipo não encontrado.'); return r.text(); }),
    fetch(`${base}prototipos-dados/${slug}/notas.json`).then((r) => r.json())
  ]);
  const prototipo = lerPrototipo(html);
  document.title = notas.titulo;
  document.documentElement.lang = notas.lang === 'es' ? 'es-ES' : 'pt-BR';
  for (const el of prototipo.helmet) document.head.appendChild(document.importNode(el, true));
  createRoot(raiz).render(createElement(Rodar, { prototipo, largura: notas.tela.largura, altura: notas.tela.altura }));
}

iniciar().catch((e) => {
  raiz.textContent = e instanceof Error ? e.message : String(e);
  raiz.className = 'motor-erro';
});
