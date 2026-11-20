// A Escola no Supabase. Quem guarda as regras é o banco (RLS, gatilhos e funções da migração);
// aqui só se lê, grava e traduz o erro do banco para o código que a tela entende.
import { createClient, type PostgrestError, type SupabaseClient } from '@supabase/supabase-js';
import type { Lang } from '../textos';
import {
  ErroEscola, mesDe,
  type CodigoErro, type Critica, type Encontro, type Eu, type Evento, type FonteEscola, type Material,
  type PedidoCarimbo, type Post, type Resposta, type Turma, type Txt
} from './tipos';

const CODIGOS: CodigoErro[] = ['so_socios', 'turma_cheia', 'turma_fechada', 'so_quem_ensina', 'precisa_outra_pessoa', 'so_colega_da_turma', 'nao_carimba_a_si', 'nao_inscrito'];

function traduzir(e: PostgrestError | Error | null): never {
  const msg = e?.message ?? '';
  const achado = CODIGOS.find((c) => msg.includes(c));
  if (achado) throw new ErroEscola(achado);
  if ('code' in (e ?? {}) && (e as PostgrestError).code === '23505') throw new ErroEscola('ja_mandou');
  if (/row-level security|permission denied/i.test(msg)) throw new ErroEscola('sem_permissao');
  throw new ErroEscola('falhou');
}

const ok = <T,>(r: { data: T; error: PostgrestError | null }): T => { if (r.error) traduzir(r.error); return r.data; };
const txt = (v: unknown): Txt => { const o = (v ?? {}) as Partial<Txt>; return { es: o.es ?? '', pt: o.pt ?? o.es ?? '' }; };

export function criarNuvem(url: string, chave: string): FonteEscola {
  // Fluxo "implicit" (o padrão do supabase-js para app só no navegador): o link do e-mail entra em
  // qualquer navegador que o abrir. Com "pkce", o link só funcionaria no navegador que pediu o login,
  // e quem pede no celular e abre o e-mail pelo app de e-mail ficaria de fora.
  const sb: SupabaseClient = createClient(url, chave, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' } });

  const uid = async () => (await sb.auth.getSession()).data.session?.user.id ?? null;
  const precisaUid = async () => { const id = await uid(); if (!id) throw new ErroEscola('precisa_entrar'); return id; };
  const nomes = async (ids: Array<string | null>) => {
    const unicos = [...new Set(ids.filter((x): x is string => !!x))];
    if (!unicos.length) return new Map<string, string>();
    const linhas = ok(await sb.rpc('nomes', { ids: unicos })) as Array<{ id: string; nome: string }>;
    return new Map(linhas.map((l) => [l.id, l.nome]));
  };

  return {
    modo: 'nuvem',
    hoje: () => new Date(),
    eu: async () => {
      const s = (await sb.auth.getSession()).data.session;
      if (!s) return null;
      const r = await sb.from('perfis').select('id, nome, plano, plano_ate, papel').eq('id', s.user.id).maybeSingle();
      const p = ok(r);
      if (!p) return { id: s.user.id, nome: '', plano: 'gratis', papel: 'membro', planoAte: null, email: s.user.email } as Eu;
      // O banco guarda o plano e o último dia; o teste de 30 dias vencido vale como grátis (como em e_socio).
      const hoje = new Date().toISOString().slice(0, 10);
      const vencido = p.plano !== 'gratis' && !!p.plano_ate && p.plano_ate < hoje;
      return { id: p.id, nome: p.nome, plano: vencido ? 'gratis' : p.plano, papel: p.papel, planoAte: vencido ? null : p.plano_ate, email: s.user.email } as Eu;
    },
    aoMudarSessao: (cb) => {
      const { data } = sb.auth.onAuthStateChange((evento) => { if (evento !== 'TOKEN_REFRESHED') cb(); });
      return () => data.subscription.unsubscribe();
    },
    entrar: async (email: string, lang: Lang) => {
      const volta = `${location.origin}${location.pathname}?area=atlas&aba=escola`;
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: volta, data: { lang } } });
      if (error) throw new ErroEscola('falhou');
    },
    confirmarCodigo: async (email: string, codigo: string) => {
      const { error } = await sb.auth.verifyOtp({ email, token: codigo.replace(/\D/g, ''), type: 'email' });
      if (error) throw new ErroEscola('codigo_invalido');
    },
    sair: async () => { await sb.auth.signOut(); },
    mudarNome: async (nome) => {
      const id = await precisaUid();
      const n = nome.trim();
      if (!n) throw new ErroEscola('texto_vazio');
      // O banco só deixa a pessoa mudar o próprio nome e a língua (grant por coluna).
      ok(await sb.from('perfis').update({ nome: n.slice(0, 80) }).eq('id', id));
    },

    turmas: async () => {
      const linhas = ok(await sb.from('turmas').select('*').order('inicio'));
      const oc = ok(await sb.rpc('ocupacao')) as Array<{ turma_id: string; ocupadas: number }>;
      const mapa = new Map(oc.map((o) => [o.turma_id, o.ocupadas]));
      return (linhas ?? []).map<Turma>((t) => ({
        id: t.id, codigo: t.codigo, titulo: txt(t.titulo), oficio: t.oficio, descricao: txt(t.descricao),
        instrutorId: t.instrutor_id, instrutorNome: t.instrutor_nome, inicio: t.inicio, vagas: t.vagas, ocupadas: mapa.get(t.id) ?? 0,
        patrocinador: t.patrocinador, abertaATodos: t.aberta_a_todos, soMaiores: t.so_maiores, precoPratica: Number(t.preco_pratica_eur), status: t.status
      }));
    },
    encontros: async (turmaId) => {
      const linhas = ok(await sb.from('encontros').select('*').eq('turma_id', turmaId).order('ordem'));
      return (linhas ?? []).map<Encontro>((e) => ({ id: e.id, turmaId: e.turma_id, ordem: e.ordem, tipo: e.tipo, titulo: txt(e.titulo), descricao: txt(e.descricao), quando: e.quando, lugar: e.lugar }));
    },
    inscricoes: async () => {
      const id = await uid();
      if (!id) return [];
      const linhas = ok(await sb.from('inscricoes').select('turma_id, status').eq('user_id', id));
      return (linhas ?? []).map((i) => ({ turmaId: i.turma_id, status: i.status }));
    },
    inscrever: async (turmaId) => {
      const id = await precisaUid();
      const { error } = await sb.from('inscricoes').insert({ turma_id: turmaId, user_id: id });
      if (!error) return;
      if (error.code !== '23505') traduzir(error);
      // Já tinha saído da turma: volta, passando de novo pela conta de vagas.
      ok(await sb.from('inscricoes').update({ status: 'inscrito' }).eq('turma_id', turmaId).eq('user_id', id).eq('status', 'cancelado'));
    },
    sairDaTurma: async (turmaId) => {
      const id = await precisaUid();
      ok(await sb.from('inscricoes').update({ status: 'cancelado' }).eq('turma_id', turmaId).eq('user_id', id).eq('status', 'inscrito'));
    },
    progresso: async (turmaId) => {
      const id = await uid();
      if (!id) return [];
      const linhas = ok(await sb.from('progresso').select('encontro_id, encontros!inner(turma_id)').eq('user_id', id).eq('encontros.turma_id', turmaId));
      return (linhas ?? []).map((l) => l.encontro_id as string);
    },
    marcarFeito: async (encontroId, feito) => {
      const id = await precisaUid();
      if (feito) {
        const { error } = await sb.from('progresso').insert({ encontro_id: encontroId, user_id: id });
        if (error && error.code !== '23505') traduzir(error);
      } else {
        ok(await sb.from('progresso').delete().eq('encontro_id', encontroId).eq('user_id', id));
      }
    },

    mural: async (turmaId) => {
      if (!(await uid())) return [];
      const posts = ok(await sb.from('mural_posts').select('id, turma_id, autor_id, texto, fixado, oculto, criado_em').eq('turma_id', turmaId)
        .order('fixado', { ascending: false }).order('criado_em', { ascending: false }).limit(100)) ?? [];
      const ids = posts.map((p) => p.id);
      const resp = ids.length ? ok(await sb.from('mural_respostas').select('id, post_id, autor_id, texto, oculto, criado_em').in('post_id', ids).order('criado_em')) ?? [] : [];
      const n = await nomes([...posts.map((p) => p.autor_id), ...resp.map((r) => r.autor_id)]);
      return posts.map<Post>((p) => ({
        id: p.id, turmaId: p.turma_id, autorId: p.autor_id, autorNome: n.get(p.autor_id) ?? '', texto: p.texto, fixado: p.fixado, oculto: p.oculto, criadoEm: p.criado_em,
        respostas: resp.filter((r) => r.post_id === p.id).map<Resposta>((r) => ({ id: r.id, postId: r.post_id, autorId: r.autor_id, autorNome: n.get(r.autor_id) ?? '', texto: r.texto, oculto: r.oculto, criadoEm: r.criado_em }))
      }));
    },
    postar: async (turmaId, texto) => {
      const id = await precisaUid();
      const t = texto.trim();
      if (!t) throw new ErroEscola('texto_vazio');
      ok(await sb.from('mural_posts').insert({ turma_id: turmaId, autor_id: id, texto: t.slice(0, 2000) }));
    },
    responder: async (postId, texto) => {
      const id = await precisaUid();
      const t = texto.trim();
      if (!t) throw new ErroEscola('texto_vazio');
      ok(await sb.from('mural_respostas').insert({ post_id: postId, autor_id: id, texto: t.slice(0, 1000) }));
    },
    moderarPost: async (postId, mudar) => { ok(await sb.from('mural_posts').update(mudar).eq('id', postId)); },
    moderarResposta: async (respostaId, oculto) => { ok(await sb.from('mural_respostas').update({ oculto }).eq('id', respostaId)); },

    carimbos: async (turmaId) => {
      if (!(await uid())) return [];
      const linhas = ok(await sb.from('carimbos').select('*').eq('turma_id', turmaId).order('criado_em')) ?? [];
      const n = await nomes(linhas.flatMap((c) => [c.user_id, c.assinado_por, c.conferido_por]));
      return linhas.map<PedidoCarimbo>((c) => ({
        id: c.id, userId: c.user_id, userNome: n.get(c.user_id) ?? '', turmaId: c.turma_id,
        assinadoPor: c.assinado_por, assinadoNome: c.assinado_por ? n.get(c.assinado_por) ?? '' : null, assinadoEm: c.assinado_em,
        conferidoPor: c.conferido_por, conferidoNome: c.conferido_por ? n.get(c.conferido_por) ?? '' : null, conferidoEm: c.conferido_em
      }));
    },
    pedirCarimbo: async (turmaId) => { await precisaUid(); ok(await sb.rpc('pedir_carimbo', { turma: turmaId })); },
    assinarCarimbo: async (id) => { ok(await sb.rpc('assinar_carimbo', { carimbo: id })); },
    conferirCarimbo: async (id) => { ok(await sb.rpc('conferir_carimbo', { carimbo: id })); },

    criticas: async () => {
      if (!(await uid())) return [];
      const linhas = ok(await sb.from('criticas').select('id, user_id, mes, drink, ficha, resposta, respondida_em').order('mes', { ascending: false }).limit(60)) ?? [];
      const n = await nomes(linhas.map((c) => c.user_id));
      return linhas.map<Critica>((c) => ({ id: c.id, userId: c.user_id, userNome: n.get(c.user_id) ?? '', mes: c.mes, drink: c.drink, ficha: c.ficha, resposta: c.resposta, respondidaEm: c.respondida_em }));
    },
    mandarCritica: async (drink, ficha) => {
      const id = await precisaUid();
      const d = drink.trim(); const f = ficha.trim();
      if (!d || !f) throw new ErroEscola('texto_vazio');
      const { error } = await sb.from('criticas').insert({ user_id: id, mes: mesDe(new Date()), drink: d.slice(0, 80), ficha: f.slice(0, 2000) });
      if (error) {
        if (error.code === '23505') throw new ErroEscola('ja_mandou');
        if (/row-level security/i.test(error.message)) throw new ErroEscola('so_socios');
        traduzir(error);
      }
    },
    responderCritica: async (criticaId, resposta) => {
      const id = await precisaUid();
      const t = resposta.trim();
      if (!t) throw new ErroEscola('texto_vazio');
      ok(await sb.from('criticas').update({ resposta: t, instrutor_id: id, respondida_em: new Date().toISOString() }).eq('id', criticaId));
    },

    materiais: async () => {
      const id = await uid();
      if (!id) return [];
      const linhas = ok(await sb.from('materiais').select('id, titulo, tipo, oficio, resumo, livre_em').order('criado_em')) ?? [];
      const est = ok(await sb.from('estante').select('material_id').eq('user_id', id)) ?? [];
      const guardados = new Set(est.map((e) => e.material_id));
      return linhas.map<Material>((x) => ({ id: x.id, titulo: txt(x.titulo), tipo: x.tipo, oficio: x.oficio, resumo: txt(x.resumo), guardado: guardados.has(x.id), livreEm: x.livre_em }));
    },
    guardar: async (materialId, sim) => {
      const id = await precisaUid();
      if (sim) {
        const { error } = await sb.from('estante').insert({ user_id: id, material_id: materialId });
        if (error && error.code !== '23505') traduzir(error);
      } else {
        ok(await sb.from('estante').delete().eq('user_id', id).eq('material_id', materialId));
      }
    },
    eventos: async () => {
      if (!(await uid())) return [];
      const linhas = ok(await sb.from('eventos').select('*').order('quando')) ?? [];
      return linhas.map<Evento>((e) => ({ id: e.id, titulo: txt(e.titulo), tipo: e.tipo, quando: e.quando, link: e.link, soSocios: e.so_socios }));
    }
  };
}
