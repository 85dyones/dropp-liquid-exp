// Componentes do sistema de design DROPP em TSX. Mesma marcação e classes `dp-`
// de design/sistema-de-design/project/components/bundle.js.
import type { ReactNode } from 'react';

const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(' ');

const PETALAS: Array<[string, string]> = [
  ['M50 8 C50 8 36 28 32 46 C37 40 45 36 50 36 C55 36 63 40 68 46 C64 28 50 8 50 8 Z', '#FACC15'],
  ['M32 46 C24 57 20 68 22 79 C25 80 29 80 34 78 C31 66 33 55 42 46 C38 45 35 45 32 46 Z', '#10B981'],
  ['M22 79 C24 93 35 106 50 108 C46 98 46 88 50 78 C39 77 31 82 22 79 Z', '#06B6D4'],
  ['M68 46 C76 57 80 68 78 79 C75 80 71 80 66 78 C69 66 67 55 58 46 C62 45 65 45 68 46 Z', '#F97316'],
  ['M78 79 C76 93 65 106 50 108 C54 98 54 88 50 78 C61 77 69 82 78 79 Z', '#EF4444'],
  ['M50 38 C42 45 38 56 39 68 C40 82 48 94 50 96 C52 94 60 82 61 68 C62 56 58 45 50 38 Z', '#D946EF'],
  ['M50 78 C44 86 44 95 50 106 C56 95 56 86 50 78 Z', '#8B5CF6']
];

export function Gota({ className, label, contorno, viewBox = '0 0 100 120' }: { className?: string; label?: string; contorno?: boolean; viewBox?: string }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  if (contorno) {
    return (
      <svg viewBox={viewBox} className={className} {...a11y}>
        <g className="dp-traco">{PETALAS.map(([d], i) => <path key={i} d={d} />)}</g>
      </svg>
    );
  }
  return (
    <svg viewBox={viewBox} className={className} {...a11y}>
      {PETALAS.map(([d, cor], i) => <path key={i} d={d} fill={cor} />)}
    </svg>
  );
}

export function Botao({ children, cheio, largo, peq, onClick, disabled }: { children: ReactNode; cheio?: boolean; largo?: boolean; peq?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cx('dp-btn', cheio && 'dp-btn--cheio', largo && 'dp-btn--largo', peq && 'dp-btn--peq')}>
      {children}
    </button>
  );
}

export type Estado = 'ok' | 'meio' | 'perdido' | 'falta';
export function Selo({ estado = 'ok', children }: { estado?: Estado; children: ReactNode }) {
  return <span className={cx('dp-st', `dp-st--${estado}`)}>{children}</span>;
}

export function Papel({ corte, className, children }: { corte?: boolean; className?: string; children: ReactNode }) {
  return <div className={cx('dp-papel', corte && 'dp-papel--corte', className)}>{children}</div>;
}

export function Abas<T extends string>({ abas, ativa, onChange }: { abas: Array<{ id: T; t: string }>; ativa: T; onChange: (id: T) => void }) {
  return (
    <div className="dp-abas">
      {abas.map((a) => (
        <button key={a.id} type="button" className="dp-aba" aria-pressed={a.id === ativa} onClick={() => onChange(a.id)}>{a.t}</button>
      ))}
    </div>
  );
}

export type TipoCarimbo = 'casa' | 'jornada' | 'carta' | 'escola' | 'arquivo' | 'mentor' | 'brinde';
const FORMA: Partial<Record<TipoCarimbo, string>> = { casa: 'redondo', arquivo: 'redondo', carta: 'oval', mentor: 'oval' };
export function Carimbo({ tipo, rotulo, titulo, linha, pendente, rotacao }: { tipo: TipoCarimbo; rotulo: string; titulo: string; linha?: string; pendente?: boolean; rotacao?: number }) {
  const forma = FORMA[tipo];
  return (
    <span className={cx('dp-carimbo', `dp-cor-${tipo}`, forma && `dp-carimbo--${forma}`, pendente && 'dp-carimbo--pendente')} style={rotacao ? { transform: `rotate(${rotacao}deg)` } : undefined}>
      <span>{rotulo}</span>
      <span className="dp-carimbo-tit">{titulo}</span>
      {linha ? <span className="dp-carimbo-linha">{linha}</span> : null}
    </span>
  );
}

export function Rotulo({ nome, cargo, cantos, link, secao, rodape }: { nome: string; cargo: string; cantos: Array<{ n: string; r: string }>; link: string; secao: string; rodape: string }) {
  return (
    <div className="dp-rotulo">
      <div className="dp-rot-arco">
        <span className="dp-rot-dropp"><Gota />DROPP</span>
        <span className="dp-rot-esp">Liquid experience</span>
      </div>
      <div className="dp-rot-miolo">
        <p className="dp-rot-secao"><span>{secao}</span></p>
        <Gota className="dp-rot-gota" viewBox="16 4 68 108" label={nome} />
        <p className="dp-rot-nome">{nome}</p>
        <p className="dp-rot-cargo">{cargo}</p>
        <div className="dp-rot-cantos">
          {cantos.map((c) => (
            <div key={c.r} className="dp-canto"><span className="dp-canto-n">{c.n}</span><span className="dp-canto-r">{c.r}</span></div>
          ))}
        </div>
        <p className="dp-fita">Meet · <span className="dp-fita-y">Share</span> · Enjoy</p>
        <p className="dp-rot-pe"><span>{link}</span><span>{rodape}</span></p>
      </div>
    </div>
  );
}

export type Cadeira = 'op' | 'fin' | 'mkt';
export function Recado({ cadeira, nomeCadeira, nivel, titulo, linhas, fonte, children }: { cadeira: Cadeira; nomeCadeira: string; nivel: string; titulo: string; linhas: Array<[string, string]>; fonte: string; children?: ReactNode }) {
  return (
    <div className="dp-papel dp-papel--corte dp-recado">
      <div className="dp-recado-cab">
        <span className="dp-cadeira"><span className={`dp-cadeira-ponto dp-cad-${cadeira}`} />{nomeCadeira}</span>
        <span className="dp-nivel">{nivel}</span>
      </div>
      <p className="dp-recado-tit">{titulo}</p>
      <dl className="dp-linhas">
        {linhas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <p className="dp-fonte">{fonte}</p>
      {children}
    </div>
  );
}

export type Tinta = 'amarelo' | 'verde' | 'ciano' | 'laranja' | 'vermelho' | 'magenta' | 'violeta';
export function ReguaLote({ rotulo, tempo, tinta, nome, pct, feito, vence, tec, descricao }: { rotulo: string; tempo: string; tinta: Tinta; nome: string; pct: number; feito: string; vence: string; tec?: string; descricao: string }) {
  const cor = `var(--tinta-${tinta})`;
  const p = `${Math.max(0, Math.min(100, pct))}%`;
  return (
    <div className="dp-papel dp-papel--corte">
      <span className="dp-rot">{rotulo}</span>
      <span className="dp-lote-tempo" style={{ color: cor }}>{tempo}</span>
      <span className="dp-lote-nome">{nome}</span>
      <span className="dp-regua-lote" role="img" aria-label={descricao}>
        <span className="dp-rl-trilho"><span className="dp-rl-enchido" style={{ width: p, background: cor }} /></span>
        <span className="dp-rl-hoje" style={{ left: p }} />
      </span>
      <span className="dp-lote-datas"><span>{feito}</span><span>{vence}</span></span>
      {tec ? <span className="dp-lote-tec">{tec}</span> : null}
    </div>
  );
}

export function Formula({ rotulo, valor, linhas }: { rotulo: string; valor: string; linhas: string[] }) {
  return (
    <div className="dp-papel">
      <div className="dp-resultado"><span className="dp-rot">{rotulo}</span><span className="dp-resultado-v">{valor}</span></div>
      <p className="dp-formula">{linhas.join('\n')}</p>
    </div>
  );
}

export function Aviso({ children, onFechar, fechar }: { children: ReactNode; onFechar: () => void; fechar: string }) {
  return (
    <div className="dp-aviso" role="status">
      <span className="dp-aviso-txt">{children}</span>
      <button type="button" className="dp-aviso-fechar" onClick={onFechar}>{fechar}</button>
    </div>
  );
}

export function Icone({ nome }: { nome: 'turno' | 'caderno' | 'atlas' | 'voz' }) {
  const comum = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, 'aria-hidden': true as const };
  if (nome === 'turno') return <svg {...comum}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
  if (nome === 'caderno') return <svg {...comum}><rect x="5" y="3.5" width="14" height="17" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></svg>;
  if (nome === 'atlas') return <svg {...comum}><path d="M4 5.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4zM20 5.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z" /></svg>;
  return <svg {...comum}><rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" /></svg>;
}
