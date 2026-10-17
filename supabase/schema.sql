-- Mistério no Hospital JS · tabela de dados do jogo (reexecutável)
-- Guarda, por pessoa, o caderno (nota), o progresso (config) e o código digitado (codigo).
-- Cada pessoa só enxerga e altera as próprias linhas (RLS).

create table if not exists public.hospital_dados (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('nota', 'config', 'codigo')),
  chave text not null check (chave ~ '^[A-Za-z0-9_.:-]{1,120}$'),
  valor jsonb not null check (pg_column_size(valor) <= 6000000),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, tipo, chave)
);

alter table public.hospital_dados enable row level security;

-- Relógio errado no aparelho não pode "ganhar para sempre": datas no futuro viram agora.
create or replace function public.hospital_dados_ajusta_data()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.atualizado_em > now() + interval '5 minutes' then
    new.atualizado_em := now();
  end if;
  return new;
end;
$$;

drop trigger if exists hospital_dados_ajusta_data on public.hospital_dados;
create trigger hospital_dados_ajusta_data
  before insert or update on public.hospital_dados
  for each row execute function public.hospital_dados_ajusta_data();

drop policy if exists hospital_dados_select on public.hospital_dados;
drop policy if exists hospital_dados_insert on public.hospital_dados;
drop policy if exists hospital_dados_update on public.hospital_dados;
drop policy if exists hospital_dados_delete on public.hospital_dados;

create policy hospital_dados_select on public.hospital_dados
  for select to authenticated using (user_id = (select auth.uid()));
create policy hospital_dados_insert on public.hospital_dados
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy hospital_dados_update on public.hospital_dados
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy hospital_dados_delete on public.hospital_dados
  for delete to authenticated using (user_id = (select auth.uid()));

-- Sem login (anon) não há acesso nenhum.
revoke all on public.hospital_dados from anon, public;
grant select, insert, update, delete on public.hospital_dados to authenticated;

-- Conferência: rls_ativo deve ser true e politicas deve ser 4.
select c.relrowsecurity as rls_ativo,
       (select count(*) from pg_policies where schemaname = 'public' and tablename = 'hospital_dados') as politicas
from pg_class c
where c.oid = 'public.hospital_dados'::regclass;
