-- Escola DROPP: a comunidade paga.
-- Regras do produto que o banco garante:
--   * turma com data, encontros e vagas; inscrição só para sócio (ou turma patrocinada aberta a todos);
--   * mural por turma, moderado por quem ensina, sem curtidas;
--   * crítica escrita uma vez por mês;
--   * o carimbo Escola só existe com duas assinaturas: quem ensina e um colega; ninguém carimba a si mesmo.
-- O plano (grátis, sócio, com Barback) é marcado à mão por um admin nesta etapa; o Stripe entra depois.

-- ——— perfis ———
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '' check (char_length(nome) <= 80),
  lang text not null default 'es' check (lang in ('es', 'pt')),
  papel text not null default 'membro' check (papel in ('membro', 'instrutor', 'admin')),
  plano text not null default 'gratis' check (plano in ('gratis', 'socio', 'barback')),
  plano_ate date,
  criado_em timestamptz not null default now()
);
comment on table public.perfis is 'Um perfil por usuário. Plano e papel só mudam por admin.';

-- O usuário edita só o próprio nome e a língua.
revoke update on public.perfis from authenticated;
grant update (nome, lang) on public.perfis to authenticated;

create or replace function public.criar_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, nome, lang)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'nome', ''),
          case when new.raw_user_meta_data ->> 'lang' = 'pt' then 'pt' else 'es' end);
  return new;
end $$;
create trigger perfil_ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();

-- ——— funções de regra (usadas nas políticas) ———
create or replace function public.e_socio(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfis p
                 where p.id = uid and p.plano in ('socio', 'barback')
                   and (p.plano_ate is null or p.plano_ate >= current_date));
$$;

create or replace function public.e_admin(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfis p where p.id = uid and p.papel = 'admin');
$$;

create or replace function public.e_instrutor(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfis p where p.id = uid and p.papel in ('instrutor', 'admin'));
$$;

-- ——— turmas e encontros ———
create table public.turmas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check (codigo ~ '^ESC-[0-9]{2,3}$'),
  titulo jsonb not null,                 -- {"es": "...", "pt": "..."}
  oficio text not null,                  -- o ofício do Passaporte que a turma carimba
  descricao jsonb not null default '{}'::jsonb,
  instrutor_id uuid references public.perfis (id) on delete set null,
  instrutor_nome text not null,          -- nome mostrado; o perfil liga a conta de quem ensina
  inicio date not null,
  vagas int not null check (vagas > 0),
  patrocinador text,                     -- "Pago por": sempre visível quando existe
  aberta_a_todos boolean not null default false,
  so_maiores boolean not null default false,
  preco_pratica_eur numeric(6, 2) not null default 39,
  status text not null default 'aberta' check (status in ('aberta', 'em_curso', 'encerrada')),
  criado_em timestamptz not null default now(),
  check (patrocinador is null or (aberta_a_todos and so_maiores))
);
create index turmas_instrutor_idx on public.turmas (instrutor_id);

create table public.encontros (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete cascade,
  ordem int not null,
  tipo text not null check (tipo in ('aula_app', 'aula_ao_vivo', 'pratica')),
  titulo jsonb not null,
  descricao jsonb not null default '{}'::jsonb,
  quando timestamptz,                    -- null = quando quiser, no app
  lugar text,
  unique (turma_id, ordem)
);

-- ——— inscrições e progresso ———
create table public.inscricoes (
  turma_id uuid not null references public.turmas (id) on delete cascade,
  user_id uuid not null references public.perfis (id) on delete cascade,
  status text not null default 'inscrito' check (status in ('inscrito', 'concluido', 'cancelado')),
  criado_em timestamptz not null default now(),
  primary key (turma_id, user_id)
);
create index inscricoes_user_idx on public.inscricoes (user_id);

create or replace function public.e_inscrito(turma uuid, uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.inscricoes i where i.turma_id = turma and i.user_id = uid and i.status <> 'cancelado');
$$;

create or replace function public.ensina(turma uuid, uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.turmas t where t.id = turma and t.instrutor_id = uid) or public.e_admin(uid);
$$;

-- Vagas: a inscrição falha quando a turma está cheia ou fechada. Vale também para quem saiu e volta.
create or replace function public.conferir_vaga() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  t public.turmas;
  ocupadas int;
begin
  if new.status <> 'inscrito' or (tg_op = 'UPDATE' and old.status <> 'cancelado') then return new; end if;
  select * into t from public.turmas where id = new.turma_id;
  if t.status <> 'aberta' then raise exception 'turma_fechada'; end if;
  if not (t.aberta_a_todos or public.e_socio(new.user_id)) then raise exception 'so_socios'; end if;
  select count(*) into ocupadas from public.inscricoes where turma_id = new.turma_id and status <> 'cancelado';
  if ocupadas >= t.vagas then raise exception 'turma_cheia'; end if;
  return new;
end $$;
create trigger vaga_ao_inscrever before insert or update of status on public.inscricoes
  for each row execute function public.conferir_vaga();

-- Vagas ocupadas por turma, sem mostrar quem se inscreveu.
create or replace function public.ocupacao() returns table (turma_id uuid, ocupadas int)
language sql stable security definer set search_path = '' as $$
  select i.turma_id, count(*)::int from public.inscricoes i where i.status <> 'cancelado' group by i.turma_id;
$$;

create table public.progresso (
  encontro_id uuid not null references public.encontros (id) on delete cascade,
  user_id uuid not null references public.perfis (id) on delete cascade,
  feito_em timestamptz not null default now(),
  primary key (encontro_id, user_id)
);
create index progresso_user_idx on public.progresso (user_id);

-- ——— mural por turma (sem curtidas) ———
create table public.mural_posts (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete cascade,
  autor_id uuid not null references public.perfis (id) on delete cascade,
  texto text not null check (char_length(texto) between 1 and 2000),
  foto_path text,
  fixado boolean not null default false,
  oculto boolean not null default false,  -- moderação de quem ensina
  criado_em timestamptz not null default now()
);
create index mural_posts_turma_idx on public.mural_posts (turma_id, criado_em desc);
create index mural_posts_autor_idx on public.mural_posts (autor_id);

create table public.mural_respostas (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.mural_posts (id) on delete cascade,
  autor_id uuid not null references public.perfis (id) on delete cascade,
  texto text not null check (char_length(texto) between 1 and 1000),
  oculto boolean not null default false,
  criado_em timestamptz not null default now()
);
create index mural_respostas_post_idx on public.mural_respostas (post_id, criado_em);
create index mural_respostas_autor_idx on public.mural_respostas (autor_id);

-- Só quem ensina muda "fixado" e "oculto"; o autor muda só o texto.
create or replace function public.guardar_moderacao() returns trigger
language plpgsql security definer set search_path = '' as $$
declare turma uuid;
begin
  if tg_table_name = 'mural_posts' then turma := new.turma_id;
  else select p.turma_id into turma from public.mural_posts p where p.id = new.post_id; end if;
  if not public.ensina(turma) then
    if tg_table_name = 'mural_posts' and (new.fixado is distinct from old.fixado) then raise exception 'so_quem_ensina'; end if;
    if new.oculto is distinct from old.oculto then raise exception 'so_quem_ensina'; end if;
    if new.autor_id is distinct from old.autor_id then raise exception 'autor_fixo'; end if;
  end if;
  return new;
end $$;
create trigger moderacao_post before update on public.mural_posts for each row execute function public.guardar_moderacao();
create trigger moderacao_resposta before update on public.mural_respostas for each row execute function public.guardar_moderacao();

-- ——— crítica mensal ———
create table public.criticas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfis (id) on delete cascade,
  mes date not null check (extract(day from mes) = 1),
  drink text not null check (char_length(drink) between 1 and 80),
  ficha text not null check (char_length(ficha) between 1 and 2000),
  foto_path text,
  resposta text,
  instrutor_id uuid references public.perfis (id) on delete set null,
  respondida_em timestamptz,
  criado_em timestamptz not null default now(),
  unique (user_id, mes)
);
create index criticas_instrutor_idx on public.criticas (instrutor_id);

-- ——— carimbos Escola ———
create table public.carimbos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfis (id) on delete cascade,
  turma_id uuid not null references public.turmas (id) on delete cascade,
  assinado_por uuid references public.perfis (id) on delete set null,
  assinado_em timestamptz,
  conferido_por uuid references public.perfis (id) on delete set null,
  conferido_em timestamptz,
  criado_em timestamptz not null default now(),
  unique (user_id, turma_id),
  check (assinado_por is distinct from user_id and conferido_por is distinct from user_id),
  check (assinado_por is null or conferido_por is null or assinado_por <> conferido_por)
);
create index carimbos_turma_idx on public.carimbos (turma_id);
create index carimbos_assinado_idx on public.carimbos (assinado_por);
create index carimbos_conferido_idx on public.carimbos (conferido_por);
comment on table public.carimbos is 'O carimbo vale quando tem as duas assinaturas: quem ensina (assinado_por) e um colega da turma (conferido_por).';

-- Pedir o carimbo depois da prática.
create or replace function public.pedir_carimbo(turma uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare novo uuid;
begin
  if not public.e_inscrito(turma) then raise exception 'nao_inscrito'; end if;
  insert into public.carimbos (user_id, turma_id) values (auth.uid(), turma)
    on conflict (user_id, turma_id) do update set criado_em = public.carimbos.criado_em
    returning id into novo;
  return novo;
end $$;

-- Quem ensina assina.
create or replace function public.assinar_carimbo(carimbo uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare c public.carimbos;
begin
  select * into c from public.carimbos where id = carimbo;
  if c.id is null then raise exception 'nao_encontrado'; end if;
  if not public.ensina(c.turma_id) then raise exception 'so_quem_ensina'; end if;
  if c.user_id = auth.uid() then raise exception 'nao_carimba_a_si'; end if;
  if c.conferido_por = auth.uid() then raise exception 'precisa_outra_pessoa'; end if;
  update public.carimbos set assinado_por = auth.uid(), assinado_em = now() where id = carimbo;
  if c.conferido_por is not null then
    update public.inscricoes set status = 'concluido' where turma_id = c.turma_id and user_id = c.user_id;
  end if;
end $$;

-- Um colega da mesma turma confere.
create or replace function public.conferir_carimbo(carimbo uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare c public.carimbos;
begin
  select * into c from public.carimbos where id = carimbo;
  if c.id is null then raise exception 'nao_encontrado'; end if;
  if c.user_id = auth.uid() then raise exception 'nao_carimba_a_si'; end if;
  if c.assinado_por = auth.uid() then raise exception 'precisa_outra_pessoa'; end if;
  if not public.e_inscrito(c.turma_id) then raise exception 'so_colega_da_turma'; end if;
  update public.carimbos set conferido_por = auth.uid(), conferido_em = now() where id = carimbo;
  if c.assinado_por is not null then
    update public.inscricoes set status = 'concluido' where turma_id = c.turma_id and user_id = c.user_id;
  end if;
end $$;

-- ——— biblioteca e eventos ———
create table public.materiais (
  id uuid primary key default gen_random_uuid(),
  titulo jsonb not null,
  tipo text not null check (tipo in ('monografia', 'ficha', 'procedimento')),
  oficio text not null,
  resumo jsonb not null default '{}'::jsonb,
  arquivo_path text,
  criado_em timestamptz not null default now()
);

create table public.estante (
  user_id uuid not null references public.perfis (id) on delete cascade,
  material_id uuid not null references public.materiais (id) on delete cascade,
  guardado_em timestamptz not null default now(),
  primary key (user_id, material_id)
);
create index estante_material_idx on public.estante (material_id);

create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo jsonb not null,
  tipo text not null check (tipo in ('aula_ao_vivo', 'critica', 'troca_de_fichas')),
  quando timestamptz not null,
  link text,
  so_socios boolean not null default true
);

-- Nomes para o mural, sem expor plano nem papel.
create or replace function public.nomes(ids uuid[]) returns table (id uuid, nome text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.nome from public.perfis p where p.id = any (ids);
$$;

-- ——— RLS ———
alter table public.perfis enable row level security;
alter table public.turmas enable row level security;
alter table public.encontros enable row level security;
alter table public.inscricoes enable row level security;
alter table public.progresso enable row level security;
alter table public.mural_posts enable row level security;
alter table public.mural_respostas enable row level security;
alter table public.criticas enable row level security;
alter table public.carimbos enable row level security;
alter table public.materiais enable row level security;
alter table public.estante enable row level security;
alter table public.eventos enable row level security;

create policy "perfil: ver o próprio" on public.perfis for select to authenticated using (id = (select auth.uid()) or (select public.e_admin()));
create policy "perfil: editar o próprio" on public.perfis for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "turmas: catálogo aberto" on public.turmas for select to anon, authenticated using (true);
create policy "encontros: catálogo aberto" on public.encontros for select to anon, authenticated using (true);

create policy "inscrições: ver as suas ou as da turma que ensina" on public.inscricoes for select to authenticated
  using (user_id = (select auth.uid()) or (select public.ensina(turma_id)));
create policy "inscrições: inscrever-se" on public.inscricoes for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'inscrito');
create policy "inscrições: cancelar a sua" on public.inscricoes for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and status in ('inscrito', 'cancelado'));

create policy "progresso: o seu" on public.progresso for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and exists (
    select 1 from public.encontros e where e.id = encontro_id and (select public.e_inscrito(e.turma_id))));

create policy "mural: ler a sua turma" on public.mural_posts for select to authenticated
  using (((select public.e_inscrito(turma_id)) and (not oculto or autor_id = (select auth.uid()))) or (select public.ensina(turma_id)));
create policy "mural: postar na sua turma" on public.mural_posts for insert to authenticated
  with check (autor_id = (select auth.uid()) and not oculto and not fixado
              and ((select public.e_inscrito(turma_id)) or (select public.ensina(turma_id))));
create policy "mural: editar o seu ou moderar" on public.mural_posts for update to authenticated
  using (autor_id = (select auth.uid()) or (select public.ensina(turma_id)));
create policy "mural: apagar o seu ou moderar" on public.mural_posts for delete to authenticated
  using (autor_id = (select auth.uid()) or (select public.ensina(turma_id)));

create policy "respostas: ler na sua turma" on public.mural_respostas for select to authenticated
  using (exists (select 1 from public.mural_posts p where p.id = post_id
                 and (((select public.e_inscrito(p.turma_id)) and (not mural_respostas.oculto or mural_respostas.autor_id = (select auth.uid())))
                      or (select public.ensina(p.turma_id)))));
create policy "respostas: responder na sua turma" on public.mural_respostas for insert to authenticated
  with check (autor_id = (select auth.uid()) and not oculto and exists (
    select 1 from public.mural_posts p where p.id = post_id and ((select public.e_inscrito(p.turma_id)) or (select public.ensina(p.turma_id)))));
create policy "respostas: editar a sua ou moderar" on public.mural_respostas for update to authenticated
  using (autor_id = (select auth.uid()) or exists (select 1 from public.mural_posts p where p.id = post_id and (select public.ensina(p.turma_id))));
create policy "respostas: apagar a sua ou moderar" on public.mural_respostas for delete to authenticated
  using (autor_id = (select auth.uid()) or exists (select 1 from public.mural_posts p where p.id = post_id and (select public.ensina(p.turma_id))));

create policy "críticas: ver as suas, ou todas se ensina" on public.criticas for select to authenticated
  using (user_id = (select auth.uid()) or (select public.e_instrutor()));
create policy "críticas: mandar uma por mês, se sócio" on public.criticas for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.e_socio()) and resposta is null and instrutor_id is null);
create policy "críticas: responder, se ensina" on public.criticas for update to authenticated
  using ((select public.e_instrutor())) with check (instrutor_id = (select auth.uid()));

create policy "carimbos: ver os seus e os da turma" on public.carimbos for select to authenticated
  using (user_id = (select auth.uid()) or (select public.e_inscrito(turma_id)) or (select public.ensina(turma_id)));

create policy "biblioteca: só sócios" on public.materiais for select to authenticated using ((select public.e_socio()) or (select public.e_instrutor()));
create policy "estante: a sua" on public.estante for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "eventos: sócios veem todos; os abertos, qualquer um" on public.eventos for select to authenticated
  using (not so_socios or (select public.e_socio()) or (select public.e_instrutor()));

-- As funções de regra e de ação ficam fechadas para anônimos.
revoke execute on function public.pedir_carimbo(uuid), public.assinar_carimbo(uuid), public.conferir_carimbo(uuid), public.nomes(uuid[]) from public, anon;
grant execute on function public.pedir_carimbo(uuid), public.assinar_carimbo(uuid), public.conferir_carimbo(uuid), public.nomes(uuid[]) to authenticated;
grant execute on function public.ocupacao() to anon, authenticated;
