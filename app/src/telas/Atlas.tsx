import { useState } from 'react';
import { Abas, Botao, Papel } from '../ds/componentes';
import type { Textos } from '../textos';
import { Agenda, Secao } from './comum';

type Aba = 'estante' | 'escola' | 'agenda';

export function Atlas({ t, avisar }: { t: Textos; avisar: (txt: string) => void }) {
  const [aba, setAba] = useState<Aba>('estante');
  const a = t.atlas;
  const abas = (['estante', 'escola', 'agenda'] as Aba[]).map((id) => ({ id, t: a.abas[id] }));

  return (
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
          <Secao titulo={a.escolaTit}>
            <Papel>
              <p>{a.escolaTxt}</p>
              <p className="item-linha">{a.escolaProx}</p>
              <Botao cheio largo onClick={() => avisar(a.escolaAviso)}>{a.escolaBtn}</Botao>
              <p className="dp-nota">{a.escolaPreco}</p>
            </Papel>
          </Secao>
        </div>

        <div className="painel" data-ativo={aba === 'agenda'}>
          <Secao titulo={a.agendaTit}>
            <Agenda itens={a.agendaItens} />
          </Secao>
        </div>
      </div>
    </div>
  );
}
