import { createElement, type ReactNode } from 'react';
import { Gota } from '../ds/componentes';

export type Lang = 'pt' | 'es';
export type Item = { slug: string; area: string; lang: Lang; titulo: string };
export type NotaDado = { id: string; texto: string; tipo: string; cor: string };
export type Controle = { nome: string; opcoes: string[]; padrao: string };
export type Dados = Item & { chamada: string; controles: Controle[]; tela: { largura: number; altura: number }; notas: NotaDado[] };

export const BASE = import.meta.env.BASE_URL;
export const dados = (caminho: string) => fetch(`${BASE}prototipos-dados/${caminho}`).then((r) => {
  if (!r.ok) throw new Error('não encontrado');
  return r.json();
});

export const AREAS: { id: string; nome: Record<Lang, string>; faz: Record<Lang, string> }[] = [
  { id: 'turno', nome: { pt: 'Turno com o Barback', es: 'Turno con el Barback' },
    faz: { pt: 'Recados das 17:00, voz no serviço, nota de fechamento e livro de turno.', es: 'Recados de las 17:00, voz en el servicio, nota de cierre y libro de turno.' } },
  { id: 'caderno', nome: { pt: 'Caderno', es: 'Cuaderno' },
    faz: { pt: 'Lotes com etiqueta e QR, perda, fichas com custo, contas e conferência da bancada.', es: 'Lotes con etiqueta y QR, merma, fichas con coste, cuentas y comprobación de la barra.' } },
  { id: 'passaporte', nome: { pt: 'Passaporte do Ofício', es: 'Pasaporte del Oficio' },
    faz: { pt: 'Rótulo com a gota, páginas de carimbos, brinde, link público e compartilhar.', es: 'Etiqueta con la gota, páginas de sellos, brindis, enlace público y compartir.' } },
  { id: 'atlas', nome: { pt: 'Atlas', es: 'Atlas' },
    faz: { pt: 'Estante curada, técnica com régua, Arquivo de clássicos e agenda.', es: 'Estante curado, técnica con regla, Archivo de clásicos y agenda.' } },
  { id: 'escola', nome: { pt: 'Escola DROPP', es: 'Escuela DROPP' },
    faz: { pt: 'Turmas, aula como exercício, prática com assinaturas e os planos Sócio e com Barback.', es: 'Cursos, clase como ejercicio, práctica con firmas y los planes Socio y con Barback.' } }
];

export const TXT = {
  pt: { todos: 'Todos os protótipos', app: 'O app', cheia: 'Abrir em tela cheia', outra: 'Ver em espanhol', painel: 'Painel do protótipo',
    erro: 'Este protótipo não foi encontrado.', ficticio: 'Pessoas, bares, preços e números são fictícios e ilustrativos.', voltar: 'Voltar aos protótipos' },
  es: { todos: 'Todos los prototipos', app: 'La app', cheia: 'Abrir a pantalla completa', outra: 'Ver en portugués', painel: 'Panel del prototipo',
    erro: 'No se encontró este prototipo.', ficticio: 'Personas, bares, precios y números son ficticios e ilustrativos.', voltar: 'Volver a los prototipos' }
} as const;

const ROTULOS: Record<string, Record<Lang, string>> = {
  aba: { pt: 'Aba', es: 'Pestaña' }, plano: { pt: 'Plano', es: 'Plan' },
  gratis: { pt: 'Grátis', es: 'Gratis' }, socio: { pt: 'Sócio', es: 'Socio' }, barback: { pt: 'Com Barback', es: 'Con Barback' },
  escola: { pt: 'Escola', es: 'Escuela' }, estante: { pt: 'Estante', es: 'Estante' }, agenda: { pt: 'Agenda', es: 'Agenda' },
  arquivo: { pt: 'Arquivo', es: 'Archivo' }
};
export const rotulo = (v: string, lang: Lang) => ROTULOS[v]?.[lang] ?? v.charAt(0).toUpperCase() + v.slice(1);

export function Topo({ lang, children }: { lang: Lang; children?: ReactNode }) {
  return createElement('header', { className: 'pt-topo' },
    createElement('a', { className: 'pt-marca', href: `${BASE}prototipos/` },
      createElement(Gota, { className: 'pt-gota' }),
      createElement('span', { className: 'pt-nome' }, 'DROPP'),
      createElement('span', { className: 'pt-esp' }, 'Liquid Experience')),
    createElement('nav', { className: 'pt-links', 'aria-label': lang === 'es' ? 'Navegación' : 'Navegação' },
      children,
      createElement('a', { href: BASE }, TXT[lang].app)));
}

// Texto das notas do canvas: blocos separados por linha em branco; "• " vira lista; "1. " vira lista numerada.
export function Nota({ texto }: { texto: string }) {
  const limpo = texto
    .replace(/^Aperte Play e experimente:/, 'Experimente:')
    .replace(/^Pulsa Play y prueba:/, 'Prueba:');
  const blocos = limpo.split(/\n\s*\n/);
  return createElement('div', { className: 'pt-nota-corpo' }, ...blocos.map((b, i) => {
    const linhas = b.split('\n').filter((l) => l.trim());
    if (linhas.every((l) => /^•\s/.test(l))) return createElement('ul', { key: i }, ...linhas.map((l, j) => createElement('li', { key: j }, l.replace(/^•\s*/, ''))));
    if (linhas.every((l) => /^\d+\.\s/.test(l))) return createElement('ol', { key: i }, ...linhas.map((l, j) => createElement('li', { key: j }, l.replace(/^\d+\.\s*/, ''))));
    if (i === 0 && linhas.length === 1 && b.length < 60) return createElement('h2', { key: i }, linhas[0].replace(/:$/, ''));
    return createElement('p', { key: i }, linhas.join(' '));
  }));
}
