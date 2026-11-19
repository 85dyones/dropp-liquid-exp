import { useState } from 'react';
import { Abas, Botao, Formula, ReguaLote, Selo } from '../ds/componentes';
import { euro, pct, type Lang, type Textos } from '../textos';
import { Secao } from './comum';

type Aba = 'lotes' | 'conferir' | 'fichas';
const META = 0.22;

export function Caderno({ t, lang, avisar }: { t: Textos; lang: Lang; avisar: (txt: string) => void }) {
  const [aba, setAba] = useState<Aba>('conferir');
  const c = t.caderno;
  const abas = (['lotes', 'conferir', 'fichas'] as Aba[]).map((id) => ({ id, t: c.abas[id] }));

  return (
    <div className="tela">
      <div className="so-estreito"><Abas abas={abas} ativa={aba} onChange={setAba} /></div>

      <div className="grade grade--paineis">
        <div className="painel" data-ativo={aba === 'lotes'}>
          <Secao titulo={c.lotesTit}>
            {c.lotes.map((l) => <ReguaLote key={l.rotulo} {...l} />)}
          </Secao>
        </div>

        <div className="painel" data-ativo={aba === 'conferir'}>
          <Secao titulo={c.visorTit} className="conferir">
            <div className="visor">
              <div className="visor-quadro" aria-hidden="true"><span /><span /><span /><span /></div>
              <p>{c.visorTxt}</p>
              <Botao onClick={() => avisar(c.lerAviso)}>{c.ler}</Botao>
            </div>
            <div className="dia">
              <h3 className="sub-titulo">{c.diaTit}</h3>
              <ul className="garrafas">
                {c.garrafas.map((g) => (
                  <li key={g.lote} data-estado={g.estado}>
                    <span className="gf-l">
                      <span className="gf-recip">{g.recip}</span>
                      <span className="gf-nome">{g.nome}</span>
                      <span className="gf-lote">{g.lote}</span>
                    </span>
                    <Selo estado={g.estado}>{g.st}</Selo>
                  </li>
                ))}
              </ul>
              <p className="dp-fonte">{c.resumo}</p>
              <Botao cheio largo onClick={() => avisar(c.fecharConfAviso)}>{c.fecharConf}</Botao>
            </div>
          </Secao>
        </div>

        <div className="painel" data-ativo={aba === 'fichas'}>
          <Secao titulo={c.fichasTit} nota={c.meta}>
            <ul className="fichas">
              {c.fichas.map((f) => {
                const p = f.custo / f.preco;
                const acima = p > META + 0.005;
                return (
                  <li key={f.nome} className="dp-papel">
                    <span className="fc-l">
                      <span className="dp-ficha-nome">{f.nome}</span>
                      <span className="dp-ficha-serv">{f.servico}</span>
                    </span>
                    <span className="fc-n">
                      <span className="fc-preco">{euro(f.preco, lang)}</span>
                      <span className="fc-custo">{euro(f.custo, lang)}</span>
                      <Selo estado={acima ? 'meio' : 'ok'}>{pct(p)}{acima ? ` · ${c.acima}` : ''}</Selo>
                    </span>
                  </li>
                );
              })}
            </ul>
            <Formula rotulo={c.formulaRot} valor={pct(2.08 / 9)} linhas={c.formulaLinhas} />
          </Secao>
        </div>
      </div>
    </div>
  );
}
