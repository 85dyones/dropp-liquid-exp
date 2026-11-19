// O que as telas da Escola dividem: a fonte de dados, quem está usando e o "recarregar" depois de cada ação.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../textos';
import { abrirFonte } from './conexao';
import { TX, erroTexto, type TextosEscola } from './textos';
import type { Eu, FonteEscola, Turma } from './tipos';

type Ctx = {
  fonte: FonteEscola;
  eu: Eu | null;
  rev: number;
  t: TextosEscola;
  lang: Lang;
  avisar: (txt: string) => void;
  agir: (f: () => Promise<unknown>, ok?: string) => Promise<boolean>;
};

type Estado = { pronto: Ctx | null; falhou: boolean; tentar: () => void; t: TextosEscola };
const Contexto = createContext<Estado | null>(null);

export function useEscola() {
  const c = useContext(Contexto)?.pronto;
  if (!c) throw new Error('useEscola fora de EscolaPronta');
  return c;
}

// Mostra "abrindo" ou "falhou" no lugar da Escola; o resto do Atlas não espera.
export function EscolaPronta({ children }: { children: ReactNode }) {
  const e = useContext(Contexto);
  if (!e) return null;
  if (e.falhou) {
    return (
      <div className="esc-estado dp-papel">
        <p>{e.t.falhouAbrir}</p>
        <button type="button" className="dp-btn dp-btn--peq" onClick={e.tentar}>{e.t.tentarDeNovo}</button>
      </div>
    );
  }
  if (!e.pronto) return <p className="esc-estado dp-nota" role="status">{e.t.carregando}</p>;
  return <>{children}</>;
}

export function EscolaRaiz({ lang, avisar, children }: { lang: Lang; avisar: (txt: string) => void; children: ReactNode }) {
  const t = TX[lang];
  const [fonte, setFonte] = useState<FonteEscola | null>(null);
  const [eu, setEu] = useState<Eu | null>(null);
  const [rev, setRev] = useState(0);
  const [falhou, setFalhou] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let vivo = true;
    setFalhou(false);
    abrirFonte()
      .then(async (f) => { const e = await f.eu(); if (vivo) { setFonte(f); setEu(e); } })
      .catch(() => { if (vivo) setFalhou(true); });
    return () => { vivo = false; };
  }, [tentativa]);

  useEffect(() => {
    if (!fonte) return;
    return fonte.aoMudarSessao(() => {
      fonte.eu().then((e) => { setEu(e); setRev((r) => r + 1); }).catch(() => setRev((r) => r + 1));
    });
  }, [fonte]);

  // Depois de cada ação, lê de novo quem está usando (nome, plano e papel podem ter mudado).
  useEffect(() => {
    if (!fonte || rev === 0) return;
    let vivo = true;
    fonte.eu().then((e) => { if (vivo) setEu(e); }).catch(() => {});
    return () => { vivo = false; };
  }, [fonte, rev]);

  const agir = useCallback(async (f: () => Promise<unknown>, ok?: string) => {
    try {
      await f();
      if (ok) avisar(ok);
      setRev((r) => r + 1);
      return true;
    } catch (e) {
      avisar(erroTexto(e, t));
      return false;
    }
  }, [avisar, t]);

  const pronto = useMemo(() => (fonte ? { fonte, eu, rev, t, lang, avisar, agir } : null), [fonte, eu, rev, t, lang, avisar, agir]);
  const estado = useMemo(() => ({ pronto, falhou, t, tentar: () => setTentativa((n) => n + 1) }), [pronto, falhou, t]);
  return <Contexto.Provider value={estado}>{children}</Contexto.Provider>;
}

// Lê da fonte e lê de novo a cada ação (rev) ou troca de pessoa.
export function useCarregar<T>(ler: (f: FonteEscola) => Promise<T>, chave = ''): T | undefined {
  const { fonte, rev, eu } = useEscola();
  const [v, setV] = useState<T>();
  useEffect(() => {
    let vivo = true;
    ler(fonte).then((x) => { if (vivo) setV(x); }).catch((e) => { console.warn('Escola: leitura falhou', e); });
    return () => { vivo = false; };
    // ler muda a cada render; o que importa são a fonte, a versão, a pessoa e a chave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fonte, rev, eu?.id, eu?.plano, eu?.papel, chave]);
  return v;
}

export const eSocio = (eu: Eu | null) => !!eu && (eu.plano === 'socio' || eu.plano === 'barback');
export const eInstrutor = (eu: Eu | null) => !!eu && (eu.papel === 'instrutor' || eu.papel === 'admin');
export const ensina = (eu: Eu | null, turma: Turma) => !!eu && (turma.instrutorId === eu.id || eu.papel === 'admin');
