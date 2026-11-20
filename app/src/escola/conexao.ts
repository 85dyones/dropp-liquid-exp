// De onde o app lê a conta e a Escola: do Supabase, quando o app tem as duas variáveis do .env.local
// (ou da Vercel), ou da demonstração local, com os dados fictícios do Teo. A página de entrada escolhe:
// "Entrar" usa a nuvem; "Ver demonstração" usa a demonstração. ?escola=demo na URL abre direto nela.
// O supabase-js só é baixado quando a nuvem é usada.
import type { FonteEscola } from './tipos';

const URL_SB = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const CHAVE_SB = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

// O campo do código do e-mail (8 dígitos no dropp-escola) só aparece quando o e-mail traz o código: isso pede SMTP próprio no
// Supabase e um modelo de e-mail com {{ .Token }}. Até lá, VITE_LOGIN_POR_CODIGO fica sem valor.
export const LOGIN_POR_CODIGO = import.meta.env.VITE_LOGIN_POR_CODIGO === '1';

// Sem as variáveis do Supabase, só existe a demonstração (e não há página de entrada).
export const TEM_NUVEM = !!(URL_SB && CHAVE_SB);

const CHAVE_DEMO = 'dropp-demo';

export function querDemo() {
  try {
    if (new URLSearchParams(location.search).get('escola') === 'demo') return true;
    return sessionStorage.getItem(CHAVE_DEMO) === '1';
  } catch { return false; }
}

export function lembrarDemo(sim: boolean) {
  try { if (sim) sessionStorage.setItem(CHAVE_DEMO, '1'); else sessionStorage.removeItem(CHAVE_DEMO); } catch { /* sem armazenamento */ }
  // Sai da demonstração de verdade: tira o ?escola=demo da barra, senão a próxima recarga volta para ela.
  if (!sim) {
    try {
      const u = new URL(location.href);
      if (u.searchParams.get('escola') === 'demo') { u.searchParams.delete('escola'); history.replaceState(null, '', u.toString()); }
    } catch { /* segue */ }
  }
}

const promessas: Partial<Record<'demo' | 'nuvem', Promise<FonteEscola>>> = {};

export function abrirFonte(demo: boolean): Promise<FonteEscola> {
  const modo = demo || !TEM_NUVEM ? 'demo' : 'nuvem';
  const ja = promessas[modo];
  if (ja) return ja;
  const p = (modo === 'nuvem'
    ? import('./nuvem').then((m) => m.criarNuvem(URL_SB!, CHAVE_SB!))
    : import('./demo').then((m) => m.criarDemo())
  ).catch((e) => { delete promessas[modo]; throw e; });
  promessas[modo] = p;
  return p;
}
