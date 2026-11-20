import { useCallback, useEffect, useState } from 'react';
import { Aviso, Gota, Icone } from './ds/componentes';
import { TEXTOS, type Area, type Lang } from './textos';
import { Turno } from './telas/Turno';
import { Caderno, type AbaCaderno, type Feito } from './telas/Caderno';
import { Passaporte } from './telas/Passaporte';
import { Atlas } from './telas/Atlas';
import { Entrada } from './telas/Entrada';
import { EscolaRaiz, useEscola, useEstadoEscola } from './escola/contexto';
import { TEM_NUVEM, lembrarDemo, querDemo } from './escola/conexao';

const AREAS: Area[] = ['turno', 'caderno', 'passaporte', 'atlas'];
const CHAVE_LANG = 'dropp-lang';

// ?area=atlas abre direto numa área (o link de entrada da Escola volta para o Atlas).
const areaInicial = (): Area => {
  try { const a = new URLSearchParams(location.search).get('area'); return AREAS.includes(a as Area) ? (a as Area) : 'turno'; } catch { return 'turno'; }
};
const langInicial = (): Lang => {
  try { const l = localStorage.getItem(CHAVE_LANG); return l === 'es' || l === 'pt' ? l : 'pt'; } catch { return 'pt'; }
};

// O app inteiro pede conta, mesmo no plano grátis. Sem sessão, mostra a página de entrada;
// "Ver demonstração" abre o app com os dados fictícios do Teo.
export function App() {
  const [lang, setLangBruto] = useState<Lang>(langInicial);
  const [demo, setDemo] = useState<boolean>(querDemo);
  const [aviso, setAviso] = useState('');
  const avisar = useCallback((txt: string) => setAviso(txt), []);
  const setLang = (l: Lang) => {
    setLangBruto(l);
    setAviso('');
    try { localStorage.setItem(CHAVE_LANG, l); } catch { /* segue sem lembrar */ }
  };
  const trocarDemo = (sim: boolean) => { lembrarDemo(sim); setDemo(sim); setAviso(''); window.scrollTo({ top: 0 }); };

  useEffect(() => { document.documentElement.lang = TEXTOS[lang].lang; }, [lang]);

  return (
    <EscolaRaiz lang={lang} avisar={avisar} demo={demo}>
      <Portao lang={lang} setLang={setLang} trocarDemo={trocarDemo} aviso={aviso} setAviso={setAviso} avisar={avisar} />
    </EscolaRaiz>
  );
}

function Portao({ lang, setLang, trocarDemo, aviso, setAviso, avisar }: {
  lang: Lang; setLang: (l: Lang) => void; trocarDemo: (sim: boolean) => void;
  aviso: string; setAviso: (s: string) => void; avisar: (s: string) => void;
}) {
  const estado = useEstadoEscola();
  const t = TEXTOS[lang];
  let tela;
  if (estado.falhou) {
    tela = (
      <div className="abrindo" role="alert">
        <Gota className="abrindo-gota" />
        <p>{estado.t.falhouAbrir}</p>
        <button type="button" className="dp-btn dp-btn--peq" onClick={estado.tentar}>{estado.t.tentarDeNovo}</button>
      </div>
    );
  } else if (!estado.pronto) {
    tela = <div className="abrindo" role="status"><Gota className="abrindo-gota" /><p>{estado.t.entrada.abrindo}</p></div>;
  } else if (estado.pronto.fonte.modo === 'nuvem' && !estado.pronto.eu) {
    tela = <Entrada lang={lang} setLang={setLang} idiomaRot={t.idiomaRot} verDemo={() => trocarDemo(true)} />;
  } else {
    tela = <Casca lang={lang} setLang={setLang} sairDemo={() => trocarDemo(false)} avisar={avisar} setAviso={setAviso} />;
  }
  const solto = !estado.pronto || (estado.pronto.fonte.modo === 'nuvem' && !estado.pronto.eu);
  return (
    <>
      {tela}
      {aviso ? <div className={solto ? 'aviso-lugar aviso-lugar--solto' : 'aviso-lugar'}><Aviso onFechar={() => setAviso('')} fechar={t.fechar}>{aviso}</Aviso></div> : null}
    </>
  );
}

function Casca({ lang, setLang, sairDemo, avisar, setAviso }: {
  lang: Lang; setLang: (l: Lang) => void; sairDemo: () => void; avisar: (s: string) => void; setAviso: (s: string) => void;
}) {
  const { fonte, eu, t: te } = useEscola();
  const [area, setArea] = useState<Area>(areaInicial);
  const [balcao, setBalcao] = useState(false);
  // O que você decide no Turno e o que já virou lote ficam aqui, para valer nas duas áreas.
  const [escolhas, setEscolhas] = useState<Record<string, number>>({});
  const [feitos, setFeitos] = useState<Feito[]>([]);
  const [cadernoAba, setCadernoAba] = useState<AbaCaderno>('conferir');
  const t = TEXTOS[lang];
  const demo = fonte.modo === 'demo';

  useEffect(() => {
    document.documentElement.dataset.theme = balcao ? 'balcao' : 'papel';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', balcao ? '#171410' : '#EFE8D8');
  }, [balcao]);

  const irPara = (a: Area, aba: AbaCaderno = 'conferir') => { setCadernoAba(aba); setArea(a); setAviso(''); window.scrollTo({ top: 0 }); };
  const escolher = (id: string, i: number) => setEscolhas((e) => ({ ...e, [id]: i }));
  const fazer = (novo: Feito) => setFeitos((f) => (f.some((x) => x.id === novo.id) ? f : [...f, novo]));

  return (
    <div className="app">
      <nav className="navegacao" aria-label={t.navRot}>
        <p className="nav-marca"><Gota className="nav-gota" /><span className="nav-nome">DROPP</span><span className="nav-esp">Liquid Experience</span></p>
        {AREAS.map((a) => (
          <button key={a} type="button" className="nav-item" aria-current={a === area ? 'page' : undefined} onClick={() => irPara(a)}>
            {a === 'passaporte' ? <Gota /> : <Icone nome={a} />}
            <span>{t.areas[a]}</span>
          </button>
        ))}
        <a className="nav-prototipos" href={`${import.meta.env.BASE_URL}prototipos/`}>{t.prototipos}</a>
        {!demo && eu ? (
          <div className="nav-conta">
            <span className="nav-conta-nome">{eu.nome || eu.email}</span>
            <button type="button" className="link-acao" onClick={() => fonte.sair()}>{te.sair}</button>
          </div>
        ) : null}
      </nav>

      <header className="topo">
        <p className="topo-marca"><Gota className="topo-gota" />DROPP</p>
        <h1 className="topo-area">{t.areas[area]}</h1>
        <div className="topo-ctrl">
          <div className="idioma" role="group" aria-label={t.idiomaRot}>
            {(['pt', 'es'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button type="button" className="modo" aria-pressed={balcao} onClick={() => setBalcao(!balcao)}>
            {balcao ? t.modoDia : t.modoBalcao}
          </button>
        </div>
      </header>

      <main className="conteudo" key={`${area}-${lang}`}>
        {demo ? (
          <p className="faixa-demo">
            <span>{te.entrada.faixaDemo}</span>
            {TEM_NUVEM ? <button type="button" className="link-acao" onClick={sairDemo}>{te.entrada.sairDemo}</button> : null}
          </p>
        ) : null}
        {area === 'turno' && <Turno t={t} avisar={avisar} escolhas={escolhas} escolher={escolher} verCaderno={() => irPara('caderno', 'lotes')} />}
        {area === 'caderno' && <Caderno t={t} lang={lang} avisar={avisar} abaInicial={cadernoAba} escolhas={escolhas} feitos={feitos} fazer={fazer} />}
        {area === 'passaporte' && <Passaporte t={t} avisar={avisar} />}
        {area === 'atlas' && <Atlas t={t} lang={lang} avisar={avisar} />}
      </main>
    </div>
  );
}
