-- =====================================================================
-- Pokédex (React + Vite + Supabase): favoritos
-- Rode no Supabase > SQL Editor > Run. Pode rodar de novo sem problema.
-- =====================================================================

-- Um favorito = um Pokémon marcado por um navegador.
-- owner_token: UUID aleatório que cada navegador gera na primeira visita (não há login).
create table if not exists public.favorites (
    owner_token uuid        not null,
    pokemon_id  smallint    not null check (pokemon_id between 1 and 151),
    created_at  timestamptz not null default now(),
    primary key (owner_token, pokemon_id)
);

-- O React fala com o Supabase pela Data API, usando a chave publicável (pública).
-- RLS ligado e NENHUMA permissão direta na tabela: o visitante não consegue
-- listar, alterar nem apagar os favoritos dos outros. Ele só chama as funções abaixo.
alter table public.favorites enable row level security;
revoke all on public.favorites from anon, authenticated;

-- ---------------------------------------------------------------------
-- list_my_favorites: favoritos de UM navegador (getFavoriteIds)
-- ---------------------------------------------------------------------
create or replace function public.list_my_favorites(p_owner_token uuid)
returns table (pokemon_id smallint, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
    select f.pokemon_id, f.created_at
      from public.favorites f
     where f.owner_token = p_owner_token
     order by f.created_at, f.pokemon_id;
$$;

-- ---------------------------------------------------------------------
-- toggle_favorite: se já é favorito, apaga e devolve false; senão, insere e devolve true
-- Tudo numa função só (uma transação), sem janela entre consultar e gravar.
-- ---------------------------------------------------------------------
create or replace function public.toggle_favorite(p_owner_token uuid, p_pokemon_id integer)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
    if p_owner_token is null or p_pokemon_id is null then
        raise exception 'owner_token e pokemon_id são obrigatórios' using errcode = '22004';
    end if;

    delete from public.favorites
     where owner_token = p_owner_token
       and pokemon_id  = p_pokemon_id;

    if found then
        return false;
    end if;

    -- O check (1 a 151) da tabela recusa IDs inválidos.
    insert into public.favorites (owner_token, pokemon_id)
    values (p_owner_token, p_pokemon_id)
    on conflict do nothing;

    return true;
end;
$$;

-- Só as duas funções ficam liberadas para a Data API.
revoke execute on function public.list_my_favorites(uuid) from public;
revoke execute on function public.toggle_favorite(uuid, integer) from public;
grant execute on function public.list_my_favorites(uuid) to anon, authenticated;
grant execute on function public.toggle_favorite(uuid, integer) to anon, authenticated;

-- Atualiza o cache da Data API (PostgREST) para ela enxergar as funções na hora.
notify pgrst, 'reload schema';
