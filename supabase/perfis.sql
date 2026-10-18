-- Mistério no Hospital JS · perfil do detetive (reexecutável)
-- Guarda o nome escolhido por cada pessoa. Uma linha por conta.
-- Cada pessoa só enxerga e altera a própria linha (RLS). Cole inteiro no SQL Editor e rode; pode repetir.

create table if not exists public.hospital_perfis (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  nome text not null check (char_length(btrim(nome)) between 1 and 100),
  atualizado_em timestamptz not null default now()
);

alter table public.hospital_perfis enable row level security;

create or replace function public.hospital_perfis_ajusta_data()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em := now();
  new.nome := btrim(new.nome);
  return new;
end;
$$;

drop trigger if exists hospital_perfis_ajusta_data on public.hospital_perfis;
create trigger hospital_perfis_ajusta_data
  before insert or update on public.hospital_perfis
  for each row execute function public.hospital_perfis_ajusta_data();

drop policy if exists hospital_perfis_select on public.hospital_perfis;
drop policy if exists hospital_perfis_insert on public.hospital_perfis;
drop policy if exists hospital_perfis_update on public.hospital_perfis;
drop policy if exists hospital_perfis_delete on public.hospital_perfis;

create policy hospital_perfis_select on public.hospital_perfis
  for select to authenticated using (auth.uid() = user_id);
create policy hospital_perfis_insert on public.hospital_perfis
  for insert to authenticated with check (auth.uid() = user_id);
create policy hospital_perfis_update on public.hospital_perfis
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy hospital_perfis_delete on public.hospital_perfis
  for delete to authenticated using (auth.uid() = user_id);

-- Conferência: deve mostrar rls_ativo = true e politicas = 4.
select
  (select relrowsecurity from pg_class where oid = 'public.hospital_perfis'::regclass) as rls_ativo,
  (select count(*) from pg_policies where schemaname = 'public' and tablename = 'hospital_perfis') as politicas;
