import { useState } from 'react';
import { Abas, Botao, Formula, ReguaLote, Selo } from '../ds/componentes';
import { euro, pct, type Lang, type LoteDado, type Textos } from '../textos';
import { Secao } from './comum';

export type AbaCaderno = 'lotes' | 'conferir' | 'fichas';
export type Feito = { id: string; litros: number };
const META = 0.22;
const milhar = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// A lista de preparo do dia. O cordial muda com a decisão do Turno (2 L de rotina, 3 L se o recado foi aceito);
// o xarope simples o Barback pôs sozinho às 16:45. Os lotes novos seguem o protótipo do Caderno: LIM-022, SIM-014.
const PREPAROS = [
  { id: 'cordial', lote: 'LIM-022', tec: 'Brix 48°', dias: 3, venceDia: '23/11' },
  { id: 'simples', lote: 'SIM-014', tec: 'Brix 50°', dias: 30, venceDia: '20/12' }
] as const;

export function Caderno({ t, lang, avisar, abaInicial, escolhas, feitos, fazer }: {
  t: Textos; lang: Lang; avisar: (txt: string) => void;
  abaInicial: AbaCaderno; escolhas: Record<string, number>; feitos: Feito[]; fazer: (f: Feito) => void;
}) {
  const [aba, setAba] = useState<AbaCaderno>(abaInicial);
  const c = t.caderno;
  const p = c.preparo;
  const abas = (['lotes', 'conferir', 'fichas'] as AbaCaderno[]).map((id) => ({ id, t: c.abas[id] }));

  const cordial = escolhas.cordial;
  const itens = PREPAROS.map((x) => ({
    ...x,
    nome: x.id === 'cordial' ? p.cordial : p.simples,
    litros: x.id === 'cordial' ? (cordial === 0 ? 3 : 2) : 2,
    origem: x.id === 'cordial'
      ? (cordial === 0 ? p.cordialOrigem.aceito : cordial === 1 ? p.cordialOrigem.mantido : p.cordialOrigem.pendente)
      : p.simplesOrigem
  }));
  const faltam = itens.filter((i) => !feitos.some((f) => f.id === i.id)).length;
  const lotesNovos: LoteDado[] = feitos.map((f, ordem) => {
    const i = itens.find((x) => x.id === f.id)!;
    return {
      rotulo: `${i.lote} · ${p.garrafa} #${6 + ordem}`, tempo: p.pronto, tinta: 'verde', nome: i.nome, pct: 0,
      feito: p.feitoHoje, vence: p.vence(i.venceDia), tec: `${i.tec} · ${milhar(f.litros * 1000)} de ${milhar(f.litros * 1000)} ml`,
      descricao: p.descricao(i.dias)
    };
  });

  return (
    <div className="tela">
      <div className="so-estreito"><Abas abas={abas} ativa={aba} onChange={setAba} /></div>

      <div className="grade grade--paineis">
        <div className="painel pilha" data-ativo={aba === 'lotes'}>
          <Secao titulo={p.tit} nota={p.nota(faltam)}>
            <ul className="preparo">
              {itens.map((i) => {
                const feito = feitos.find((f) => f.id === i.id);
                return (
                  <li key={i.id} className="dp-papel" data-feito={!!feito}>
                    <span className="pp-l">
                      <span className="pp-nome">{i.nome}</span>
                      <span className="pp-origem">{i.origem}</span>
                    </span>
                    <span className="pp-qtd">{feito ? feito.litros : i.litros} L</span>
                    {feito ? (
                      <p className="feito-linha pp-fim"><Selo>{p.feito}</Selo><span>{p.feitoTxt(i.lote)}</span></p>
                    ) : (
                      <span className="pp-fim"><Botao peq onClick={() => { fazer({ id: i.id, litros: i.litros }); avisar(p.criado(i.lote)); }}>{p.fazer}</Botao></span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Secao>
          <Secao titulo={c.lotesTit}>
            {[...lotesNovos].reverse().concat(c.lotes).map((l) => <ReguaLote key={l.rotulo} {...l} />)}
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
