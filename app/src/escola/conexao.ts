// Escolhe de onde a Escola lê: do Supabase, quando o app tem as duas variáveis do .env.local
// (ou da Vercel), ou da demonstração local. ?escola=demo na URL força a demonstração.
// O supabase-js só é baixado quando a nuvem é usada.
import type { FonteEscola } from './tipos';

let promessa: Promise<FonteEscola> | null = null;

// O campo do código de 6 dígitos só aparece quando o e-mail traz o código: isso pede SMTP próprio no
// Supabase e um modelo de e-mail com {{ .Token }}. Até lá, VITE_LOGIN_POR_CODIGO fica sem valor.
export const LOGIN_POR_CODIGO = import.meta.env.VITE_LOGIN_POR_CODIGO === '1';

export function querDemo() {
  try { return new URLSearchParams(location.search).get('escola') === 'demo'; } catch { return false; }
}

export function abrirFonte(): Promise<FonteEscola> {
  if (promessa) return promessa;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  promessa = (url && chave && !querDemo()
    ? import('./nuvem').then((m) => m.criarNuvem(url, chave))
    : import('./demo').then((m) => m.criarDemo())
  ).catch((e) => { promessa = null; throw e; });
  return promessa;
}
