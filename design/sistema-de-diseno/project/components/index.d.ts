// DROPP Liquid Experience — props de los componentes (window.Dropp). Documentación, sin comprobación de tipos.
import type { ReactNode } from 'react';

type Tinta = 'amarelo' | 'verde' | 'ciano' | 'laranja' | 'vermelho' | 'magenta' | 'violeta';

/** Botón de acción: uno lleno por pantalla; la etiqueta es el verbo de lo que pasa. */
export interface BotaoProps { variante?: 'cheio' | 'vazado'; largo?: boolean; peq?: boolean; disabled?: boolean; onClick?: () => void; children: ReactNode; }

/** Segmentos (3 o 4 opciones de una cuenta) o chips de filtro con recuento. */
export interface SelecaoProps {
  tipo?: 'segmento' | 'chip';
  rotulo: string;
  opcoes: { valor: string; rotulo: string; nota?: string; n?: number }[];
  valor: string;
  onChange?: (valor: string) => void;
}

/** Estado en una o dos palabras. */
export interface SeloProps { estado: 'ok' | 'meio' | 'perdido' | 'falta'; children: ReactNode; }

/** Pestañas de un área (hasta tres) o, con `titulo`, la barra de volver. */
export interface AbasProps { abas?: string[]; ativa?: string; onChange?: (aba: string) => void; titulo?: string; voltar?: string; onVoltar?: () => void; }

/** Las cuatro áreas, fijas al pie. Esta versión ya trae los nombres en español; `nomes` los cambia. */
export interface NavegacaoProps { atual: 'turno' | 'caderno' | 'passaporte' | 'atlas'; onChange?: (area: string) => void; nomes?: Partial<Record<'turno' | 'caderno' | 'passaporte' | 'atlas', string>>; rotulo?: string; }

/** Confirmación de lo que acaba de pasar. */
export interface AvisoProps { children: ReactNode; onFechar?: () => void; fechar?: string; }

/** Tarjeta de papel; `corte` añade las marcas de corte. */
export interface PapelProps { corte?: boolean; className?: string; children: ReactNode; }

/** Pantalla en el tema Barra (u otro tema de tokens). */
export interface ModoBalcaoProps { tema?: 'balcao' | 'papel'; className?: string; children: ReactNode; }

/** Etiqueta térmica de lote, solo negra, con QR. Esta versión ya trae "Hecho" y "Caduca"; rotuloFeito y rotuloVence los cambian. */
export interface EtiquetaProps {
  casa: string; cidade: string; nome: string; lote: string;
  feito: string; por: string; vence: string; conservar: string;
  ingredientes: string; alergenos: string;
  qr?: { lado: number; path: string };
  rotuloFeito?: string; rotuloVence?: string; instrucao?: string;
}

/** Sello del Pasaporte. La forma viene del tipo, salvo `forma`. */
export interface CarimboProps {
  tipo: 'casa' | 'jornada' | 'carta' | 'escola' | 'arquivo' | 'mentor' | 'brinde';
  titulo: string; linha?: string; rotulo?: string;
  forma?: 'redondo' | 'oval'; pendente?: boolean; rotacao?: number;
}

/** La etiqueta del Pasaporte del oficio. */
export interface RotuloProps { nome: string; cargo: string; cantos: { n: string | number; r: string }[]; link: string; secao?: string; }

/** Recado del Barback: frente, nivel, recomendación, hechos, fuente y salidas. */
export interface RecadoProps {
  cadeira: 'operacao' | 'financeiro' | 'marketing'; nomeCadeira?: string;
  nivel: string; titulo: string;
  linhas?: { k: string; v: string }[]; fonte?: string; acoes?: string[];
}

/** Línea de ficha: nombre, servicio (vaso · hielo · guarnición) y coste. */
export interface FichaProps { nome: string; servico: string; custo: string; estado?: 'ok' | 'meio' | 'falta'; }

/** Lote contado por el tiempo, con la regla de hecho a caducidad. */
export interface ReguaLoteProps { rotulo: string; tempo: string; tinta: Tinta; nome: string; pct: number; feito: string; vence: string; tec?: string; descricao?: string; }

/** Regla que acompaña la lectura de una técnica. */
export interface ReguaLeituraProps { passos: { medida: string; uni: string }[]; atual: number; onPasso?: (i: number) => void; passo?: string; de?: string; }

/** Resultado de una cuenta con la fórmula debajo, una línea por paso. */
export interface FormulaProps { rotulo: string; valor: string; linhas: string[]; }
