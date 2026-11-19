-- As funções de regra e os gatilhos saem do schema public, que a API expõe, e vão para "privado".
-- Antes, alguém logado podia chamar e_socio(outra_pessoa) pela API e saber se ela é sócia ou está numa turma.
-- As políticas apontam para a função, não para o nome, e continuam valendo depois da mudança de schema.
-- Ficam na API só as funções feitas para ela: ocupacao (vagas, sem nomes), nomes (mural) e as três do carimbo.

create schema privado;
revoke all on schema privado from public;
grant usage on schema privado to authenticated;

alter function public.e_socio(uuid) set schema privado;
alter function public.e_admin(uuid) set schema privado;
alter function public.e_instrutor(uuid) set schema privado;
alter function public.e_inscrito(uuid, uuid) set schema privado;
alter function public.ensina(uuid, uuid) set schema privado;
alter function public.criar_perfil() set schema privado;
alter function public.conferir_vaga() set schema privado;
alter function public.guardar_moderacao() set schema privado;

revoke execute on function privado.criar_perfil(), privado.conferir_vaga(), privado.guardar_moderacao() from public, anon, authenticated;
revoke execute on function privado.e_socio(uuid), privado.e_admin(uuid), privado.e_instrutor(uuid), privado.e_inscrito(uuid, uuid), privado.ensina(uuid, uuid) from public, anon;
grant execute on function privado.e_socio(uuid), privado.e_admin(uuid), privado.e_instrutor(uuid), privado.e_inscrito(uuid, uuid), privado.ensina(uuid, uuid) to authenticated;

-- O corpo destas funções cita as funções de regra pelo nome: reescrito com o schema novo, mesma lógica.
create or replace function privado.ensina(turma uuid, uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.turmas t where t.id = turma and t.instrutor_id = uid) or privado.e_admin(uid);
$$;

create or replace function privado.conferir_vaga() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  t public.turmas;
  ocupadas int;
begin
  if new.status <> 'inscrito' or (tg_op = 'UPDATE' and old.status <> 'cancelado') then return new; end if;
  select * into t from public.turmas where id = new.turma_id;
  if t.status <> 'aberta' then raise exception 'turma_fechada'; end if;
  if not (t.aberta_a_todos or privado.e_socio(new.user_id)) then raise exception 'so_socios'; end if;
  select count(*) into ocupadas from public.inscricoes where turma_id = new.turma_id and status <> 'cancelado';
  if ocupadas >= t.vagas then raise exception 'turma_cheia'; end if;
  return new;
end $$;

create or replace function privado.guardar_moderacao() returns trigger
language plpgsql security definer set search_path = '' as $$
declare turma uuid;
begin
  if tg_table_name = 'mural_posts' then turma := new.turma_id;
  else select p.turma_id into turma from public.mural_posts p where p.id = new.post_id; end if;
  if not privado.ensina(turma) then
    if tg_table_name = 'mural_posts' and (new.fixado is distinct from old.fixado) then raise exception 'so_quem_ensina'; end if;
    if new.oculto is distinct from old.oculto then raise exception 'so_quem_ensina'; end if;
    if new.autor_id is distinct from old.autor_id then raise exception 'autor_fixo'; end if;
  end if;
  return new;
end $$;

create or replace function public.pedir_carimbo(turma uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare novo uuid;
begin
  if not privado.e_inscrito(turma) then raise exception 'nao_inscrito'; end if;
  insert into public.carimbos (user_id, turma_id) values (auth.uid(), turma)
    on conflict (user_id, turma_id) do update set criado_em = public.carimbos.criado_em
    returning id into novo;
  return novo;
end $$;

create or replace function public.assinar_carimbo(carimbo uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare c public.carimbos;
begin
  select * into c from public.carimbos where id = carimbo;
  if c.id is null then raise exception 'nao_encontrado'; end if;
  if not privado.ensina(c.turma_id) then raise exception 'so_quem_ensina'; end if;
  if c.user_id = auth.uid() then raise exception 'nao_carimba_a_si'; end if;
  if c.conferido_por = auth.uid() then raise exception 'precisa_outra_pessoa'; end if;
  update public.carimbos set assinado_por = auth.uid(), assinado_em = now() where id = carimbo;
  if c.conferido_por is not null then
    update public.inscricoes set status = 'concluido' where turma_id = c.turma_id and user_id = c.user_id;
  end if;
end $$;

create or replace function public.conferir_carimbo(carimbo uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare c public.carimbos;
begin
  select * into c from public.carimbos where id = carimbo;
  if c.id is null then raise exception 'nao_encontrado'; end if;
  if c.user_id = auth.uid() then raise exception 'nao_carimba_a_si'; end if;
  if c.assinado_por = auth.uid() then raise exception 'precisa_outra_pessoa'; end if;
  if not privado.e_inscrito(c.turma_id) then raise exception 'so_colega_da_turma'; end if;
  update public.carimbos set conferido_por = auth.uid(), conferido_em = now() where id = carimbo;
  if c.assinado_por is not null then
    update public.inscricoes set status = 'concluido' where turma_id = c.turma_id and user_id = c.user_id;
  end if;
end $$;
