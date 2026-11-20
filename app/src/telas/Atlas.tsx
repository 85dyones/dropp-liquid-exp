import { useState } from 'react';
import { Abas, Papel } from '../ds/componentes';
import type { Lang, Textos } from '../textos';
import { Agenda, Secao } from './comum';
import { EscolaPronta } from '../escola/contexto';
import { EscolaPainel } from '../escola/Painel';
import { TurmaTela } from '../escola/Turma';
import '../escola/escola.css';

type Aba = 'estante' | 'escola' | 'agenda';

const abaInicial = (): Aba => {
  try { return new URLSearchParams(location.search).get('aba') === 'escola' ? 'escola' : 'estante'; } catch { return 'estante'; }
};

export function Atlas({ t, lang, avisar }: { t: Textos; lang: Lang; avisar: (txt: string) => void }) {
  const [aba, setAba] = useState<Aba>(abaInicial);
  const [turma, setTurma] = useState<string | null>(null);
  const a = t.atlas;
  const abas = (['estante', 'escola', 'agenda'] as Aba[]).map((id) => ({ id, t: a.abas[id] }));
  const abrirTurma = (id: string | null) => { setTurma(id); window.scrollTo({ top: 0 }); };

  return (
    <>
      {turma ? (
        <EscolaPronta><TurmaTela id={turma} voltar={() => { abrirTurma(null); setAba('escola'); }} /></EscolaPronta>
      ) : (
        <div className="tela">
          <div className="so-estreito"><Abas abas={abas} ativa={aba} onChange={setAba} /></div>

          <div className="grade grade--paineis">
            <div className="painel" data-ativo={aba === 'estante'}>
              <Secao titulo={a.estanteTit}>
                {a.estante.map((i) => (
                  <Papel key={i.nome} corte className="item">
                    <span className="dp-rot">{i.rot}</span>
                    <span className="item-nome">{i.nome}</span>
                    <span className="item-porque">→ {i.porque}</span>
                    <span className="item-linha">{i.linha}</span>
                  </Papel>
                ))}
              </Secao>
            </div>

            <div className="painel" data-ativo={aba === 'escola'}>
              <EscolaPronta><EscolaPainel abrirTurma={abrirTurma} /></EscolaPronta>
            </div>

            <div className="painel" data-ativo={aba === 'agenda'}>
              <Secao titulo={a.agendaTit}>
                <Agenda itens={a.agendaItens} />
              </Secao>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
