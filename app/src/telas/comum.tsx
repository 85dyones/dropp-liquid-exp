import type { ReactNode } from 'react';
import type { EventoDado } from '../textos';

export function Secao({ titulo, nota, className, children }: { titulo: string; nota?: string; className?: string; children: ReactNode }) {
  return (
    <section className={['secao', className].filter(Boolean).join(' ')}>
      <div className="secao-cab">
        <h2 className="dp-titulo-bloco">{titulo}</h2>
        {nota ? <p className="dp-nota">{nota}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Agenda({ itens }: { itens: EventoDado[] }) {
  return (
    <ul className="agenda">
      {itens.map((e) => (
        <li key={e.d + e.m} className="dp-papel">
          <span className="ag-data"><span className="ag-k">{e.dia}</span><b className="ag-d">{e.d}</b><span className="ag-k">{e.m}</span></span>
          <span className="ag-l"><span className="ag-t">{e.t}</span><span className="ag-s">{e.s}</span></span>
        </li>
      ))}
    </ul>
  );
}
