-- O plano grátis com conteúdo (decisões do usuário em 19/11/2026):
--   * teste invertido: quem cria a conta começa como Sócio por 30 dias, sem cartão, e cai para o grátis sozinho
--     (e_socio já confere plano_ate);
--   * cursos básicos: turmas com aberta_a_todos e sem patrocinador (o banco já deixa o grátis entrar nelas);
--   * uma aula ao vivo aberta por mês: eventos com so_socios = false (a política já mostra a todos);
--   * o material do mês: um material da biblioteca aberto a todos no mês marcado em livre_em.

create or replace function privado.criar_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, nome, lang, plano, plano_ate)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'nome', ''),
          case when new.raw_user_meta_data ->> 'lang' = 'pt' then 'pt' else 'es' end,
          'socio', current_date + 30);
  return new;
end $$;
revoke execute on function privado.criar_perfil() from public, anon, authenticated;
comment on column public.perfis.plano_ate is 'Último dia do plano. No cadastro, 30 dias de Sócio (teste invertido); vazio = sem data de fim.';

alter table public.materiais
  add column livre_em date check (livre_em is null or extract(day from livre_em) = 1);
comment on column public.materiais.livre_em is 'Material do mês: aberto a todos no mês que começa nesta data.';

drop policy "biblioteca: só sócios" on public.materiais;
create policy "biblioteca: sócios, ou o material do mês" on public.materiais for select to authenticated
  using ((select privado.e_socio()) or (select privado.e_instrutor())
         or livre_em = date_trunc('month', current_date)::date);
