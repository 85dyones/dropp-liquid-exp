// O que a Escola lê e grava. As duas fontes (demonstração local e Supabase) seguem as mesmas regras,
// escritas em supabase/migrations/20261119160000_escola.sql e testadas em supabase/testes/regras.mjs.
import type { Lang } from '../textos';

export type Txt = { es: string; pt: string };
export type Plano = 'gratis' | 'socio' | 'barback';
export type Papel = 'membro' | 'instrutor' | 'admin';

export type Eu = { id: string; nome: string; plano: Plano; papel: Papel; email?: string };

export type Turma = {
  id: string; codigo: string; titulo: Txt; oficio: string; descricao: Txt;
  instrutorId: string | null; instrutorNome: string;
  inicio: string; vagas: number; ocupadas: number;
  patrocinador: string | null; abertaATodos: boolean; soMaiores: boolean;
  precoPratica: number; status: 'aberta' | 'em_curso' | 'encerrada';
};

export type TipoEncontro = 'aula_app' | 'aula_ao_vivo' | 'pratica';
export type Encontro = { id: string; turmaId: string; ordem: number; tipo: TipoEncontro; titulo: Txt; descricao: Txt; quando: string | null; lugar: string | null };

export type StatusInscricao = 'inscrito' | 'concluido' | 'cancelado';
export type Inscricao = { turmaId: string; status: StatusInscricao };

export type Resposta = { id: string; postId: string; autorId: string; autorNome: string; texto: string; oculto: boolean; criadoEm: string };
export type Post = { id: string; turmaId: string; autorId: string; autorNome: string; texto: string; fixado: boolean; oculto: boolean; criadoEm: string; respostas: Resposta[] };

export type PedidoCarimbo = {
  id: string; userId: string; userNome: string; turmaId: string;
  assinadoPor: string | null; assinadoNome: string | null; assinadoEm: string | null;
  conferidoPor: string | null; conferidoNome: string | null; conferidoEm: string | null;
};

export type Critica = { id: string; userId: string; userNome: string; mes: string; drink: string; ficha: string; resposta: string | null; respondidaEm: string | null };

export type TipoMaterial = 'monografia' | 'ficha' | 'procedimento';
export type Material = { id: string; titulo: Txt; tipo: TipoMaterial; oficio: string; resumo: Txt; guardado: boolean };

export type Evento = { id: string; titulo: Txt; tipo: 'aula_ao_vivo' | 'critica' | 'troca_de_fichas'; quando: string; link: string | null; soSocios: boolean };

// Códigos de erro: os mesmos que o banco levanta.
export type CodigoErro =
  | 'so_socios' | 'turma_cheia' | 'turma_fechada' | 'so_quem_ensina' | 'precisa_outra_pessoa'
  | 'so_colega_da_turma' | 'nao_carimba_a_si' | 'nao_inscrito' | 'ja_mandou' | 'sem_permissao'
  | 'precisa_entrar' | 'texto_vazio' | 'codigo_invalido' | 'falhou';

export class ErroEscola extends Error {
  constructor(public codigo: CodigoErro) { super(codigo); }
}

// Só na demonstração: quem está usando e com qual plano.
export type Pessoa = { id: string; nome: string; papel: Papel; plano: Plano; rot: Txt };

export interface FonteEscola {
  modo: 'demo' | 'nuvem';
  hoje(): Date;
  eu(): Promise<Eu | null>;
  aoMudarSessao(cb: () => void): () => void;
  entrar(email: string, lang: Lang): Promise<void>;
  // O código do e-mail vale em qualquer aparelho; o link, só no navegador que pediu.
  confirmarCodigo(email: string, codigo: string): Promise<void>;
  sair(): Promise<void>;
  mudarNome(nome: string): Promise<void>;

  turmas(): Promise<Turma[]>;
  encontros(turmaId: string): Promise<Encontro[]>;
  inscricoes(): Promise<Inscricao[]>;
  inscrever(turmaId: string): Promise<void>;
  sairDaTurma(turmaId: string): Promise<void>;
  progresso(turmaId: string): Promise<string[]>;
  marcarFeito(encontroId: string, feito: boolean): Promise<void>;

  mural(turmaId: string): Promise<Post[]>;
  postar(turmaId: string, texto: string): Promise<void>;
  responder(postId: string, texto: string): Promise<void>;
  moderarPost(postId: string, mudar: { fixado?: boolean; oculto?: boolean }): Promise<void>;
  moderarResposta(respostaId: string, oculto: boolean): Promise<void>;

  carimbos(turmaId: string): Promise<PedidoCarimbo[]>;
  pedirCarimbo(turmaId: string): Promise<void>;
  assinarCarimbo(id: string): Promise<void>;
  conferirCarimbo(id: string): Promise<void>;

  criticas(): Promise<Critica[]>;
  mandarCritica(drink: string, ficha: string): Promise<void>;
  responderCritica(id: string, resposta: string): Promise<void>;

  materiais(): Promise<Material[]>;
  guardar(materialId: string, guardar: boolean): Promise<void>;
  eventos(): Promise<Evento[]>;

  // Só na demonstração.
  pessoas?(): Pessoa[];
  trocarPessoa?(id: string): void;
  trocarPlano?(plano: Plano): void;
  recomecar?(): void;
}

export const mesDe = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
