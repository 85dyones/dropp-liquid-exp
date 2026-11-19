// Índice dos protótipos navegáveis: cinco áreas, cada uma em português e espanhol.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import '../estilo/tokens.css';
import './prototipos.css';
import { AREAS, BASE, TXT, Topo } from './comum';

function Indice() {
  return createElement('div', { className: 'pt-pagina' },
    createElement(Topo, { lang: 'pt' }),
    createElement('main', { className: 'pt-indice' },
      createElement('h1', { className: 'pt-titulo' }, 'Protótipos navegáveis'),
      createElement('p', { className: 'pt-lide' },
        'Cinco áreas do DROPP, cada uma em português e em espanhol da Espanha. Toque na tela do celular para navegar; ao lado, o que experimentar em cada uma.'),
      createElement('ul', { className: 'pt-areas' },
        ...AREAS.map((a) => createElement('li', { key: a.id, className: 'pt-area' },
          createElement('h2', null, a.nome.pt),
          createElement('p', null, a.faz.pt),
          createElement('p', { className: 'pt-idiomas' },
            createElement('a', { className: 'pt-botao', href: `${BASE}prototipos/ver.html?p=${a.id}-pt` }, 'Português'),
            createElement('a', { className: 'pt-botao', href: `${BASE}prototipos/ver.html?p=${a.id}-es`, hrefLang: 'es' }, 'Español'))))),
      createElement('p', { className: 'pt-rodape' }, TXT.pt.ficticio, ' ', TXT.es.ficticio)));
}

createRoot(document.getElementById('raiz')!).render(createElement(Indice));
