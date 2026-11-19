import { useState } from 'react';
import { Botao, Icone, Papel, Recado, ReguaLote, Selo } from '../ds/componentes';
import type { Textos } from '../textos';
import { Agenda, Secao } from './comum';

export function Turno({ t, avisar, escolhas, escolher, verCaderno }: {
  t: Textos; avisar: (txt: string) => void;
  escolhas: Record<string, number>; escolher: (id: string, i: number) => void; verCaderno: () => void;
}) {
  const [dono, setDono] = useState<'casa' | 'meu'>('casa');
  const tt = t.turno;
  const recados = dono === 'casa' ? tt.recadosCasa : tt.recadosMeu;
  const lotesHoje = [t.caderno.lotes[1], t.caderno.lotes[0]];

  return (
    <div className="tela">
      <div className="tela-cab">
        <p className="dp-rot">{tt.quando}</p>
        <div className="dp-seg-row dono" role="group" aria-label={tt.donoRot}>
          {(['casa', 'meu'] as const).map((d) => (
            <button key={d} type="button" className="dp-seg" aria-pressed={dono === d} onClick={() => setDono(d)}>
              <span>{d === 'casa' ? tt.casa : tt.meu}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grade grade--abc">
        <Secao titulo={tt.titulo} className="area-a">
          {recados.map((r) => {
            const e = escolhas[r.id];
            return (
              <Recado key={r.id} cadeira={r.cad} nomeCadeira={tt.cadeiras[r.cad]} nivel={tt.nivel} titulo={r.titulo} linhas={r.linhas} fonte={r.fonte}>
                {e === undefined ? (
                  <div className="dp-linha-btns">
                    {r.opcoes.map((o, i) => (
                      <Botao key={o.t} cheio={i === 0} onClick={() => escolher(r.id, i)}>
                        <span>{o.t}</span>{o.efeito ? <small className="efeito">{o.efeito}</small> : null}
                      </Botao>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="feito-linha"><Selo>{t.feito}</Selo><span>{r.opcoes[e].feito}</span></p>
                    {r.opcoes[e].caderno ? <button type="button" className="link-acao" onClick={verCaderno}>{tt.verCaderno}</button> : null}
                  </>
                )}
              </Recado>
            );
          })}
        </Secao>

        <Secao titulo={tt.bancada} className="area-b">
          {lotesHoje.map((l) => <ReguaLote key={l.rotulo} {...l} />)}
        </Secao>

        <div className="area-c pilha">
          <Secao titulo={tt.servico}>
            <Papel>
              <p>{tt.servicoTxt}</p>
              <Botao cheio largo onClick={() => avisar(tt.falarAviso)}><Icone nome="voz" />{tt.falar}</Botao>
            </Papel>
          </Secao>
          <Secao titulo={tt.agenda}>
            <Agenda itens={tt.agendaItens} />
          </Secao>
        </div>
      </div>
    </div>
  );
}
