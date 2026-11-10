-- =====================================================================
-- Yu-Gi-Oh! API (React + Vite + Supabase): cartas favoritas
-- Rode no Supabase > SQL Editor > Run. Pode rodar de novo sem problema.
-- =====================================================================

-- Um favorito = uma carta marcada por um navegador.
-- owner_token: UUID aleatório que cada navegador gera na primeira visita (não há login).
-- card_id: o "id" (passcode) da carta na YGOPRODeck, ex.: 46986414 (Dark Magician).
create table if not exists public.favorite_cards (
    owner_token uuid        not null,
    card_id     integer     not null check (card_id > 0),
    created_at  timestamptz not null default now(),
    primary key (owner_token, card_id)
);

-- O React fala com o Supabase pela Data API, usando a chave publicável (pública).
-- RLS ligado e NENHUMA permissão direta na tabela: o visitante não consegue
-- listar, alterar nem apagar os favoritos dos outros. Ele só chama as funções abaixo.
alter table public.favorite_cards enable row level security;
revoke all on public.favorite_cards from anon, authenticated;

-- ---------------------------------------------------------------------
-- list_my_favorite_cards: favoritos de UM navegador, do mais recente ao mais antigo
-- ---------------------------------------------------------------------
create or replace function public.list_my_favorite_cards(p_owner_token uuid)
returns table (card_id integer, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
    select f.card_id, f.created_at
      from public.favorite_cards f
     where f.owner_token = p_owner_token
     order by f.created_at desc, f.card_id;
$$;

-- ---------------------------------------------------------------------
-- toggle_favorite_card: se já é favorita, apaga e devolve false; senão, insere e devolve true
-- Tudo numa função só (uma transação), sem janela entre consultar e gravar.
-- ---------------------------------------------------------------------
create or replace function public.toggle_favorite_card(p_owner_token uuid, p_card_id integer)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
    if p_owner_token is null or p_card_id is null then
        raise exception 'owner_token e card_id são obrigatórios' using errcode = '22004';
    end if;

    delete from public.favorite_cards
     where owner_token = p_owner_token
       and card_id     = p_card_id;

    if found then
        return false;
    end if;

    -- O check (card_id > 0) da tabela recusa IDs inválidos.
    insert into public.favorite_cards (owner_token, card_id)
    values (p_owner_token, p_card_id)
    on conflict do nothing;

    return true;
end;
$$;

-- Só as duas funções ficam liberadas para a Data API.
revoke execute on function public.list_my_favorite_cards(uuid) from public;
revoke execute on function public.toggle_favorite_card(uuid, integer) from public;
grant execute on function public.list_my_favorite_cards(uuid) to anon, authenticated;
grant execute on function public.toggle_favorite_card(uuid, integer) to anon, authenticated;

-- Atualiza o cache da Data API (PostgREST) para ela enxergar as funções na hora.
notify pgrst, 'reload schema';
