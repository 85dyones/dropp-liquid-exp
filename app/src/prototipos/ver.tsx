// Página de um protótipo: a prancheta numa moldura de celular, o painel e as notas do canvas.
import { createElement, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../estilo/tokens.css';
import './prototipos.css';
import { AREAS, BASE, Nota, TXT, Topo, dados, rotulo, type Dados, type Lang } from './comum';

const slug = new URLSearchParams(location.search).get('p') || '';
const gemeo = (s: string) => s.replace(/-(pt|es)$/, (_, l: string) => (l === 'pt' ? '-es' : '-pt'));

function Moldura({ d, valores }: { d: Dados; valores: Record<string, string> }) {
  const caixa = useRef<HTMLDivElement>(null);
  const quadro = useRef<HTMLIFrameElement>(null);
  const [escala, setEscala] = useState(1);
  const { largura, altura } = d.tela;

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => {
      const livreW = el.clientWidth;
      const livreH = window.innerHeight - 120;
      setEscala(Math.min(1, livreW / (largura + 24), Math.max(0.55, livreH / (altura + 24))));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener('resize', medir);
    return () => { ro.disconnect(); window.removeEventListener('resize', medir); };
  }, [largura, altura]);

  useEffect(() => {
    quadro.current?.contentWindow?.postMessage({ tipo: 'props', props: valores }, location.origin);
  }, [valores]);

  useEffect(() => {
    const ouvir = (e: MessageEvent) => {
      if (e.origin === location.origin && e.data?.tipo === 'pronto') quadro.current?.contentWindow?.postMessage({ tipo: 'props', props: valores }, location.origin);
    };
    window.addEventListener('message', ouvir);
    return () => window.removeEventListener('message', ouvir);
  }, [valores]);

  const w = (largura + 24) * escala;
  const h = (altura + 24) * escala;
  return createElement('div', { className: 'pt-caixa', ref: caixa },
    createElement('div', { className: 'pt-lugar', style: { width: w, height: h } },
      createElement('div', { className: 'pt-celular', style: { transform: `scale(${escala})` } },
        createElement('iframe', { ref: quadro, title: d.titulo, src: `${BASE}prototipos/rodar.html?p=${d.slug}`, width: largura, height: altura }))));
}

function Ver() {
  const [d, setD] = useState<Dados | null>(null);
  const [erro, setErro] = useState(false);
  const [valores, setValores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!/^[a-z]+-(pt|es)$/.test(slug)) { setErro(true); return; }
    dados(`${slug}/notas.json`).then((x: Dados) => {
      setD(x);
      setValores(Object.fromEntries(x.controles.map((c) => [c.nome, c.padrao])));
      document.title = `${x.titulo} · DROPP`;
      document.documentElement.lang = x.lang === 'es' ? 'es-ES' : 'pt-BR';
    }).catch(() => setErro(true));
  }, []);

  if (erro) {
    return createElement('div', { className: 'pt-pagina' }, createElement(Topo, { lang: 'pt' }),
      createElement('main', { className: 'pt-vazio' }, createElement('p', null, TXT.pt.erro), createElement('a', { href: `${BASE}prototipos/` }, TXT.pt.voltar)));
  }
  if (!d) return createElement('div', { className: 'pt-pagina' });
  const lang: Lang = d.lang;
  const t = TXT[lang];
  const area = AREAS.find((a) => a.id === d.area);

  return createElement('div', { className: 'pt-pagina' },
    createElement(Topo, { lang },
      createElement('a', { href: `${BASE}prototipos/` }, t.todos),
      createElement('a', { href: `${BASE}prototipos/ver.html?p=${gemeo(d.slug)}`, hrefLang: lang === 'pt' ? 'es' : 'pt' }, t.outra)),
    createElement('main', { className: 'pt-ver' },
      createElement('section', { className: 'pt-tela', 'aria-label': d.titulo },
        createElement(Moldura, { d, valores }),
        createElement('p', { className: 'pt-cheia' }, createElement('a', { href: `${BASE}prototipos/rodar.html?p=${d.slug}` }, t.cheia))),
      createElement('aside', { className: 'pt-lado' },
        createElement('h1', { className: 'pt-titulo' }, area ? area.nome[lang] : d.titulo),
        createElement('p', { className: 'pt-lide' }, area?.faz[lang]),
        d.controles.length > 0 && createElement('section', { className: 'pt-painel' },
          createElement('h2', null, t.painel),
          ...d.controles.map((c) => createElement('label', { key: c.nome, className: 'pt-controle' },
            createElement('span', null, rotulo(c.nome, lang)),
            createElement('select', {
              value: valores[c.nome],
              onChange: (e: { target: { value: string } }) => setValores((v) => ({ ...v, [c.nome]: e.target.value }))
            }, ...c.opcoes.map((o) => createElement('option', { key: o, value: o }, rotulo(o, lang))))))),
        ...d.notas.map((n) => createElement('section', { key: n.id, className: `pt-nota pt-nota--${n.cor}` }, createElement(Nota, { texto: n.texto }))))));
}

createRoot(document.getElementById('raiz')!).render(createElement(Ver));
