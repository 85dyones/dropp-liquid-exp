// DROPP Liquid Experience — props dos componentes (window.Dropp). Documentação, não checada.
import type { ReactNode } from 'react';

type Tinta = 'amarelo' | 'verde' | 'ciano' | 'laranja' | 'vermelho' | 'magenta' | 'violeta';

/** Botão de ação: um cheio por tela, o rótulo é o verbo do que acontece. */
export interface BotaoProps { variante?: 'cheio' | 'vazado'; largo?: boolean; peq?: boolean; disabled?: boolean; onClick?: () => void; children: ReactNode; }

/** Segmentos (3 ou 4 opções de uma conta) ou chips de filtro com contagem. */
export interface SelecaoProps {
  tipo?: 'segmento' | 'chip';
  rotulo: string;
  opcoes: { valor: string; rotulo: string; nota?: string; n?: number }[];
  valor: string;
  onChange?: (valor: string) => void;
}

/** Estado em uma ou duas palavras. */
export interface SeloProps { estado: 'ok' | 'meio' | 'perdido' | 'falta'; children: ReactNode; }

/** Abas de uma área (até três) ou, com `titulo`, a barra de voltar. */
export interface AbasProps { abas?: string[]; ativa?: string; onChange?: (aba: string) => void; titulo?: string; voltar?: string; onVoltar?: () => void; }

/** As quatro áreas, fixas no pé. `nomes` traduz os rótulos (ES). */
export interface NavegacaoProps { atual: 'turno' | 'caderno' | 'passaporte' | 'atlas'; onChange?: (area: string) => void; nomes?: Partial<Record<'turno' | 'caderno' | 'passaporte' | 'atlas', string>>; rotulo?: string; }

/** Confirmação do que acabou de acontecer. */
export interface AvisoProps { children: ReactNode; onFechar?: () => void; fechar?: string; }

/** Cartão de papel; `corte` acrescenta as marcas de corte. */
export interface PapelProps { corte?: boolean; className?: string; children: ReactNode; }

/** Tela no tema Balcão (ou outro tema de tokens). */
export interface ModoBalcaoProps { tema?: 'balcao' | 'papel'; className?: string; children: ReactNode; }

/** Etiqueta térmica de lote, só preto, com QR. ES: rotuloFeito "Hecho", rotuloVence "Caduca". */
export interface EtiquetaProps {
  casa: string; cidade: string; nome: string; lote: string;
  feito: string; por: string; vence: string; conservar: string;
  ingredientes: string; alergenos: string;
  qr?: { lado: number; path: string };
  rotuloFeito?: string; rotuloVence?: string; instrucao?: string;
}

/** Carimbo do Passaporte. A forma vem do tipo, salvo `forma`. */
export interface CarimboProps {
  tipo: 'casa' | 'jornada' | 'carta' | 'escola' | 'arquivo' | 'mentor' | 'brinde';
  titulo: string; linha?: string; rotulo?: string;
  forma?: 'redondo' | 'oval'; pendente?: boolean; rotacao?: number;
}

/** O rótulo do Passaporte do ofício. */
export interface RotuloProps { nome: string; cargo: string; cantos: { n: string | number; r: string }[]; link: string; secao?: string; }

/** Recado do Barback: cadeira, nível, recomendação, fatos, fonte e saídas. */
export interface RecadoProps {
  cadeira: 'operacao' | 'financeiro' | 'marketing'; nomeCadeira?: string;
  nivel: string; titulo: string;
  linhas?: { k: string; v: string }[]; fonte?: string; acoes?: string[];
}

/** Linha de ficha: nome, serviço (copo · gelo · guarnição) e custo. */
export interface FichaProps { nome: string; servico: string; custo: string; estado?: 'ok' | 'meio' | 'falta'; }

/** Lote contado pelo tempo, com a régua do feito ao vence. */
export interface ReguaLoteProps { rotulo: string; tempo: string; tinta: Tinta; nome: string; pct: number; feito: string; vence: string; tec?: string; descricao?: string; }

/** Régua que acompanha a leitura de uma técnica. */
export interface ReguaLeituraProps { passos: { medida: string; uni: string }[]; atual: number; onPasso?: (i: number) => void; passo?: string; de?: string; }

/** Resultado de uma conta com a fórmula embaixo, uma linha por passo. */
export interface FormulaProps { rotulo: string; valor: string; linhas: string[]; }
