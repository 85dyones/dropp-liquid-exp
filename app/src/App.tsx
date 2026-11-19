import { useEffect, useState } from 'react';
import { Aviso, Gota, Icone } from './ds/componentes';
import { TEXTOS, type Area, type Lang } from './textos';
import { Turno } from './telas/Turno';
import { Caderno, type AbaCaderno, type Feito } from './telas/Caderno';
import { Passaporte } from './telas/Passaporte';
import { Atlas } from './telas/Atlas';

const AREAS: Area[] = ['turno', 'caderno', 'passaporte', 'atlas'];

// ?area=atlas abre direto numa área (o link de entrada da Escola volta para o Atlas).
const areaInicial = (): Area => {
  try { const a = new URLSearchParams(location.search).get('area'); return AREAS.includes(a as Area) ? (a as Area) : 'turno'; } catch { return 'turno'; }
};

export function App() {
  const [area, setArea] = useState<Area>(areaInicial);
  const [lang, setLang] = useState<Lang>('pt');
  const [balcao, setBalcao] = useState(false);
  const [aviso, setAviso] = useState('');
  // O que você decide no Turno e o que já virou lote ficam aqui, para valer nas duas áreas.
  const [escolhas, setEscolhas] = useState<Record<string, number>>({});
  const [feitos, setFeitos] = useState<Feito[]>([]);
  const [cadernoAba, setCadernoAba] = useState<AbaCaderno>('conferir');
  const t = TEXTOS[lang];

  useEffect(() => {
    document.documentElement.lang = t.lang;
    document.documentElement.dataset.theme = balcao ? 'balcao' : 'papel';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', balcao ? '#171410' : '#EFE8D8');
  }, [t.lang, balcao]);

  const irPara = (a: Area, aba: AbaCaderno = 'conferir') => { setCadernoAba(aba); setArea(a); setAviso(''); window.scrollTo({ top: 0 }); };
  const avisar = (txt: string) => setAviso(txt);
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
      </nav>

      <header className="topo">
        <p className="topo-marca"><Gota className="topo-gota" />DROPP</p>
        <h1 className="topo-area">{t.areas[area]}</h1>
        <div className="topo-ctrl">
          <div className="idioma" role="group" aria-label={t.idiomaRot}>
            {(['pt', 'es'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => { setLang(l); setAviso(''); }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button type="button" className="modo" aria-pressed={balcao} onClick={() => setBalcao(!balcao)}>
            {balcao ? t.modoDia : t.modoBalcao}
          </button>
        </div>
      </header>

      <main className="conteudo" key={`${area}-${lang}`}>
        {area === 'turno' && <Turno t={t} avisar={avisar} escolhas={escolhas} escolher={escolher} verCaderno={() => irPara('caderno', 'lotes')} />}
        {area === 'caderno' && <Caderno t={t} lang={lang} avisar={avisar} abaInicial={cadernoAba} escolhas={escolhas} feitos={feitos} fazer={fazer} />}
        {area === 'passaporte' && <Passaporte t={t} avisar={avisar} />}
        {area === 'atlas' && <Atlas t={t} lang={lang} avisar={avisar} />}
      </main>

      {aviso ? <div className="aviso-lugar"><Aviso onFechar={() => setAviso('')} fechar={t.fechar}>{aviso}</Aviso></div> : null}
    </div>
  );
}
