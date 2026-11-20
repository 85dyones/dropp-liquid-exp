// Roda a migração e o seed da Escola num Postgres em memória (PGlite) e testa as regras com usuários de mentira.
import { PGlite } from '@electric-sql/pglite';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Uso: cd supabase && npm install && npm test
const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const db = new PGlite();

// O que o Supabase já traz: papéis, o schema auth e as permissões padrão.
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  grant usage on schema public to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
`);
for (const f of readdirSync(RAIZ + 'migrations').filter((n) => n.endsWith('.sql')).sort()) {
  await db.exec(readFileSync(RAIZ + 'migrations/' + f, 'utf8'));
}
await db.exec(readFileSync(RAIZ + 'seed.sql', 'utf8'));

const U = { gratis: '00000000-0000-0000-0000-00000000000a', b: '00000000-0000-0000-0000-00000000000b', c: '00000000-0000-0000-0000-00000000000c', irene: '00000000-0000-0000-0000-00000000000d' };
for (const [k, id] of Object.entries(U)) await db.query(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)`, [id, `${k}@exemplo.test`, { nome: k, lang: 'pt' }]);
// Todo cadastro nasce com 30 dias de Sócio (teste invertido). Os de teste recebem o plano à mão.
const teste = (await db.query(`select plano, plano_ate - current_date as dias, privado.e_socio(id) as socio from public.perfis where id = $1`, [U.gratis])).rows[0];
await db.exec(`update public.perfis set plano = 'gratis', plano_ate = null where id in ('${U.gratis}', '${U.irene}');
               update public.perfis set plano = 'socio', plano_ate = null where id in ('${U.b}', '${U.c}');
               update public.perfis set papel = 'instrutor' where id = '${U.irene}';
               update public.turmas set instrutor_id = '${U.irene}' where codigo in ('ESC-07', 'ESC-11');`);
const turma = async (cod) => (await db.query(`select id from public.turmas where codigo = $1`, [cod])).rows[0].id;
const T07 = await turma('ESC-07'); const T11 = await turma('ESC-11');

let falhas = 0;
async function como(uid, sql, params = []) {
  await db.exec(`reset role; set role authenticated; select set_config('request.jwt.claim.sub', '${uid}', false);`);
  try { return await db.query(sql, params); } finally { await db.exec('reset role;'); }
}
async function espera(nome, fn, deveFalhar, contem) {
  try {
    const r = await fn();
    if (deveFalhar) { falhas++; console.log('FALHOU (devia dar erro):', nome); }
    else if (contem && !contem(r)) { falhas++; console.log('FALHOU (resultado):', nome, JSON.stringify(r.rows)); }
    else console.log('ok', nome);
  } catch (e) {
    if (deveFalhar && (typeof deveFalhar !== 'string' || e.message.includes(deveFalhar))) console.log('ok', nome, '→', e.message.split('\n')[0]);
    else { falhas++; console.log('FALHOU:', nome, '→', e.message.split('\n')[0]); }
  }
}

await espera('seed: 5 turmas (2 básicas) e 13 encontros', () => db.query(`select (select count(*) from public.turmas)::int t, (select count(*) from public.turmas where aberta_a_todos and patrocinador is null)::int b, (select count(*) from public.encontros)::int e`), false, (r) => r.rows[0].t === 5 && r.rows[0].b === 2 && r.rows[0].e === 13);
await espera('cadastro novo nasce Sócio por 30 dias', async () => ({ rows: [teste] }), false, (r) => r.rows[0].plano === 'socio' && r.rows[0].dias === 30 && r.rows[0].socio === true);
await espera('grátis não entra em turma de sócio', () => como(U.gratis, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T07, U.gratis]), 'so_socios');
await espera('grátis entra na turma patrocinada aberta', () => como(U.gratis, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T11, U.gratis]));
await espera('sócio B entra na ESC-07', () => como(U.b, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T07, U.b]));
await espera('sócio C entra na ESC-07', () => como(U.c, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T07, U.c]));
await espera('ninguém inscreve outra pessoa', () => como(U.b, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T11, U.c]), 'row-level security');
await espera('B posta no mural da ESC-07', () => como(U.b, `insert into public.mural_posts (turma_id, autor_id, texto) values ($1, $2, 'Meu bloco ficou turvo no fundo. Normal?')`, [T07, U.b]));
await espera('quem não é da turma não lê o mural', () => como(U.gratis, `select count(*)::int n from public.mural_posts where turma_id = $1`, [T07]), false, (r) => r.rows[0].n === 0);
await espera('C lê o mural da sua turma', () => como(U.c, `select count(*)::int n from public.mural_posts where turma_id = $1`, [T07]), false, (r) => r.rows[0].n === 1);
await espera('B não fixa o próprio post', () => como(U.b, `update public.mural_posts set fixado = true where autor_id = $1`, [U.b]), 'so_quem_ensina');
await espera('Irene oculta o post (moderação)', () => como(U.irene, `update public.mural_posts set oculto = true where turma_id = $1`, [T07]));
await espera('C não vê o post oculto', () => como(U.c, `select count(*)::int n from public.mural_posts where turma_id = $1`, [T07]), false, (r) => r.rows[0].n === 0);
await espera('B ainda vê o próprio post oculto', () => como(U.b, `select count(*)::int n from public.mural_posts where turma_id = $1`, [T07]), false, (r) => r.rows[0].n === 1);
const POST = (await db.query(`select id from public.mural_posts limit 1`)).rows[0].id;
await espera('C não responde a post oculto', () => como(U.c, `insert into public.mural_respostas (post_id, autor_id, texto) values ($1, $2, 'x')`, [POST, U.c]), 'row-level security');
await espera('Irene mostra o post de novo', () => como(U.irene, `update public.mural_posts set oculto = false where id = $1`, [POST]));
await espera('C responde no mural', () => como(U.c, `insert into public.mural_respostas (post_id, autor_id, texto) values ($1, $2, 'É o ar que sobe. Corta o fundo.')`, [POST, U.c]));
await espera('grátis não responde em turma alheia', () => como(U.gratis, `insert into public.mural_respostas (post_id, autor_id, texto) values ($1, $2, 'x')`, [POST, U.gratis]), 'row-level security');
await espera('B pede o carimbo', () => como(U.b, `select public.pedir_carimbo($1)`, [T07]));
await espera('B não assina o próprio carimbo', () => como(U.b, `select public.assinar_carimbo(id) from public.carimbos where user_id = $1`, [U.b]), 'so_quem_ensina');
await espera('Irene assina', () => como(U.irene, `select public.assinar_carimbo(id) from public.carimbos where user_id = $1`, [U.b]));
await espera('Irene não confere o que assinou', () => como(U.irene, `select public.conferir_carimbo(id) from public.carimbos where user_id = $1`, [U.b]), 'precisa_outra_pessoa');
const CARIMBO = (await db.query(`select id from public.carimbos where user_id = $1`, [U.b])).rows[0].id;
await espera('grátis (fora da turma) não vê o carimbo', () => como(U.gratis, `select count(*)::int n from public.carimbos`), false, (r) => r.rows[0].n === 0);
await espera('grátis (fora da turma) não confere nem com o id', () => como(U.gratis, `select public.conferir_carimbo($1)`, [CARIMBO]), 'so_colega_da_turma');
await espera('C, colega da turma, confere', () => como(U.c, `select public.conferir_carimbo(c.id) from public.carimbos c where c.user_id = $1`, [U.b]));
await espera('B terminou a turma', () => db.query(`select status from public.inscricoes where turma_id = $1 and user_id = $2`, [T07, U.b]), false, (r) => r.rows[0].status === 'concluido');
await espera('grátis não manda crítica', () => como(U.gratis, `insert into public.criticas (user_id, mes, drink, ficha) values ($1, '2026-11-01', 'Negroni', '30/30/30')`, [U.gratis]), 'row-level security');
await espera('sócio manda a crítica do mês', () => como(U.b, `insert into public.criticas (user_id, mes, drink, ficha) values ($1, '2026-11-01', 'Penicillin', 'scotch 60, mel 22,5, limão 22,5')`, [U.b]));
await espera('só uma crítica por mês', () => como(U.b, `insert into public.criticas (user_id, mes, drink, ficha) values ($1, '2026-11-01', 'Outro', 'x')`, [U.b]), 'duplicate key');
await espera('Irene responde a crítica', () => como(U.irene, `update public.criticas set resposta = 'Gengibre forte demais.', instrutor_id = $1, respondida_em = now() where user_id = $2`, [U.irene, U.b]));
// O material do mês: um só, marcado para o mês corrente (o teste não depende da data em que roda).
await db.exec(`update public.materiais set livre_em = null;
               update public.materiais set livre_em = date_trunc('month', current_date)::date where id = (select id from public.materiais order by criado_em, id limit 1);`);
await espera('grátis vê só o material do mês', () => como(U.gratis, `select count(*)::int n, bool_and(livre_em = date_trunc('month', current_date)::date) m from public.materiais`), false, (r) => r.rows[0].n === 1 && r.rows[0].m === true);
await espera('sócio vê a biblioteca inteira', () => como(U.b, `select count(*)::int n from public.materiais`), false, (r) => r.rows[0].n === 3);
await espera('grátis vê só a aula aberta do mês', () => como(U.gratis, `select count(*)::int n, bool_and(not so_socios) a from public.eventos`), false, (r) => r.rows[0].n === 1 && r.rows[0].a === true);
await espera('sócio vê todos os eventos', () => como(U.b, `select count(*)::int n from public.eventos`), false, (r) => r.rows[0].n === 3);
await espera('grátis entra no curso básico', async () => como(U.gratis, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [await turma('ESC-02'), U.gratis]));
await espera('ninguém se promove a sócio', () => como(U.gratis, `update public.perfis set plano = 'socio' where id = $1`, [U.gratis]), 'permission denied');
await espera('o nome a pessoa muda', () => como(U.gratis, `update public.perfis set nome = 'Iker' where id = $1`, [U.gratis]));
await espera('ninguém lê o perfil dos outros', () => como(U.b, `select count(*)::int n from public.perfis`), false, (r) => r.rows[0].n === 1);
await espera('nomes() devolve só id e nome', () => como(U.b, `select * from public.nomes($1::uuid[])`, [[U.c, U.irene]]), false, (r) => r.rows.length === 2 && Object.keys(r.rows[0]).join() === 'id,nome');
await espera('anônimo vê o catálogo', async () => { await db.exec('set role anon;'); try { return await db.query(`select count(*)::int n from public.turmas`); } finally { await db.exec('reset role;'); } }, false, (r) => r.rows[0].n === 5);
await espera('anônimo não chama as funções de regra', async () => { await db.exec('set role anon;'); try { return await db.query(`select privado.e_socio($1)`, [U.b]); } finally { await db.exec('reset role;'); } }, 'permission denied');
await espera('as regras não ficam na API (schema public)', () => db.query(`select count(*)::int n from pg_proc p join pg_namespace s on s.oid = p.pronamespace where s.nspname = 'public' and p.proname in ('e_socio', 'e_admin', 'e_instrutor', 'e_inscrito', 'ensina', 'criar_perfil', 'conferir_vaga', 'guardar_moderacao')`), false, (r) => r.rows[0].n === 0);
await espera('anônimo vê as vagas ocupadas, sem nomes', async () => { await db.exec('set role anon;'); try { return await db.query(`select ocupadas from public.ocupacao() where turma_id = $1`, [T07]); } finally { await db.exec('reset role;'); } }, false, (r) => r.rows[0].ocupadas === 2);

// Ordem trocada: o colega confere antes de quem ensina assinar.
await espera('C pede o carimbo', () => como(U.c, `select public.pedir_carimbo($1)`, [T07]));
await espera('B confere antes da assinatura', () => como(U.b, `select public.conferir_carimbo(c.id) from public.carimbos c where c.user_id = $1`, [U.c]));
await espera('C ainda não terminou', () => db.query(`select status from public.inscricoes where turma_id = $1 and user_id = $2`, [T07, U.c]), false, (r) => r.rows[0].status === 'inscrito');
await espera('Irene assina depois e C termina', () => como(U.irene, `select public.assinar_carimbo(id) from public.carimbos where user_id = $1`, [U.c]));
await espera('C terminou a turma', () => db.query(`select status from public.inscricoes where turma_id = $1 and user_id = $2`, [T07, U.c]), false, (r) => r.rows[0].status === 'concluido');

// Quem sai e volta passa pela mesma conta de vagas.
await db.exec(`insert into public.turmas (codigo, titulo, oficio, instrutor_nome, inicio, vagas, aberta_a_todos) values ('ESC-99', '{"es": "x", "pt": "x"}', 'gelo-diluicao', 'Irene Soler', '2027-02-01', 1, true)`);
const T99 = await turma('ESC-99');
await espera('grátis ocupa a única vaga', () => como(U.gratis, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T99, U.gratis]));
await espera('B não entra: turma cheia', () => como(U.b, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T99, U.b]), 'turma_cheia');
await espera('grátis sai da turma', () => como(U.gratis, `update public.inscricoes set status = 'cancelado' where turma_id = $1 and user_id = $2`, [T99, U.gratis]));
await espera('B entra na vaga livre', () => como(U.b, `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T99, U.b]));
await espera('grátis não volta com a turma cheia', () => como(U.gratis, `update public.inscricoes set status = 'inscrito' where turma_id = $1 and user_id = $2`, [T99, U.gratis]), 'turma_cheia');
// O teste de 30 dias vence e a pessoa cai para o grátis sozinha.
await db.query(`insert into auth.users (id, email, raw_user_meta_data) values ($1, 'novo@exemplo.test', '{"lang":"es"}')`, ['00000000-0000-0000-0000-00000000000e']);
await db.exec(`update public.perfis set plano_ate = current_date - 1 where id = '00000000-0000-0000-0000-00000000000e'`);
await espera('teste vencido: não entra em turma de sócio', () => como('00000000-0000-0000-0000-00000000000e', `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [T07, '00000000-0000-0000-0000-00000000000e']), 'so_socios');
await espera('teste vencido: entra no curso básico', async () => como('00000000-0000-0000-0000-00000000000e', `insert into public.inscricoes (turma_id, user_id) values ($1, $2)`, [await turma('ESC-03'), '00000000-0000-0000-0000-00000000000e']));
console.log(falhas ? `\n${falhas} falha(s)` : '\ntudo certo');
