import { Botao, Carimbo, Rotulo } from '../ds/componentes';
import type { Textos } from '../textos';
import { Secao } from './comum';

export function Passaporte({ t, avisar }: { t: Textos; avisar: (txt: string) => void }) {
  const p = t.passaporte;
  return (
    <div className="tela">
      <div className="grade grade--abc">
        <div className="area-a rotulo-lugar">
          <Rotulo nome="Teo Aranda" cargo={p.cargo} cantos={p.cantos} link="dropp.me/teo" secao={p.secao} rodape="el bar primero" />
          <Botao largo onClick={() => avisar(p.recrutadorAviso)}>{p.recrutador}</Botao>
        </div>

        <Secao titulo={p.oficiosTit} nota={p.oficiosNota} className="area-b">
          <ul className="oficios">
            {p.oficios.map((o) => (
              <li key={o.nome}>
                <span className="of-ponto" style={{ background: `var(--gota-${o.cor})` }} aria-hidden="true" />
                <span className="of-l"><span className="of-nome">{o.nome}</span><span className="of-tempo">{o.tempo}</span></span>
                <span className="of-grau">{o.grau}</span>
              </li>
            ))}
          </ul>
        </Secao>

        <Secao titulo={p.carimbosTit} className="area-c">
          <div className="carimbos">
            {p.carimbos.map((c) => <Carimbo key={c.titulo} {...c} />)}
          </div>
        </Secao>
      </div>
    </div>
  );
}
