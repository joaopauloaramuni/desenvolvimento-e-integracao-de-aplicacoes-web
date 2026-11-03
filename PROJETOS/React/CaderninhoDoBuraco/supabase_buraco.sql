-- ==========================================================================
-- Caderninho do Buraco: rode no Supabase > SQL Editor (obrigatório).
--
-- Cria as tabelas do placar (jogadores, partidas, rodadas e pontuações),
-- liga o RLS e cria as funções que o React chama pela Data API.
-- Pode rodar de novo sem problema (é idempotente).
--
-- Quem calcula os pontos (cartas, canastras, batida, mão) é o React
-- (src/services/contagemService.js). O banco guarda o resultado e confere
-- se a soma bate.
-- ==========================================================================


-- --------------------------------------------------------------------------
-- 1. Jogadores
-- --------------------------------------------------------------------------
create table if not exists public.jogadores (
    id         uuid        primary key default gen_random_uuid(),
    nome       text        not null,
    carta      text        not null default 'dama-copas',   -- figura usada como avatar
    cor        text        not null default '#e2b544',      -- cor nos gráficos
    ativo      boolean     not null default true,           -- false = some das novas partidas
    created_at timestamptz not null default now(),

    constraint jogadores_nome_tamanho check (char_length(btrim(nome)) between 1 and 40),
    constraint jogadores_cor_formato  check (cor ~ '^#[0-9a-fA-F]{6}$'),
    constraint jogadores_carta_valida check (carta in (
        'dama-copas', 'dama-espadas', 'dama-ouros', 'dama-paus',
        'valete-copas', 'valete-espadas', 'valete-ouros', 'valete-paus',
        'joker-carta', 'joker-bobo'
    ))
);

-- "Mariana" e " mariana " são o mesmo jogador
create unique index if not exists jogadores_nome_unico
    on public.jogadores (lower(btrim(nome)));


-- --------------------------------------------------------------------------
-- 2. Partidas (um dia de jogo) e quem jogou nelas
-- --------------------------------------------------------------------------
create table if not exists public.partidas (
    id         uuid        primary key default gen_random_uuid(),
    data       date        not null default current_date,
    local      text,
    observacao text,
    created_at timestamptz not null default now(),

    constraint partidas_local_tamanho      check (local is null or char_length(local) <= 80),
    constraint partidas_observacao_tamanho check (observacao is null or char_length(observacao) <= 500)
);

create index if not exists partidas_data_idx on public.partidas (data desc);

create table if not exists public.partida_jogadores (
    partida_id uuid not null references public.partidas (id)  on delete cascade,
    jogador_id uuid not null references public.jogadores (id) on delete restrict,
    ordem      int  not null default 0,
    primary key (partida_id, jogador_id)
);

create index if not exists partida_jogadores_jogador_idx on public.partida_jogadores (jogador_id);


-- --------------------------------------------------------------------------
-- 3. Rodadas (rodada 1, rodada 2... de uma partida)
-- --------------------------------------------------------------------------
create table if not exists public.rodadas (
    id         uuid        primary key default gen_random_uuid(),
    partida_id uuid        not null references public.partidas (id) on delete cascade,
    numero     int         not null check (numero > 0),
    created_at timestamptz not null default now()
);

-- "deferrable": ao excluir a rodada 1, as rodadas 2 e 3 viram 1 e 2 sem conflito
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'rodadas_partida_numero_unico') then
        alter table public.rodadas
            add constraint rodadas_partida_numero_unico unique (partida_id, numero)
            deferrable initially immediate;
    end if;
end;
$$;


-- --------------------------------------------------------------------------
-- 4. Pontuações: o resultado de cada jogador em cada rodada
--
-- modo = 'cartas': o React contou as cartas digitadas (jogos_texto / mao_texto)
--                  e o total precisa ser a soma das parcelas.
-- modo = 'total' : vocês só digitaram o total da rodada.
-- --------------------------------------------------------------------------
create table if not exists public.pontuacoes (
    id               uuid    primary key default gen_random_uuid(),
    rodada_id        uuid    not null references public.rodadas (id)   on delete cascade,
    jogador_id       uuid    not null references public.jogadores (id) on delete restrict,
    modo             text    not null default 'cartas' check (modo in ('cartas', 'total')),

    jogos_texto      text    not null default '',     -- o que foi digitado: um jogo por linha
    mao_texto        text    not null default '',     -- cartas que sobraram na mão (ou o número)
    jogos            jsonb   not null default '[]',   -- os jogos já lidos e classificados

    pontos_cartas    int     not null default 0,      -- soma das cartas baixadas na mesa
    canastras_limpas int     not null default 0 check (canastras_limpas >= 0),
    canastras_sujas  int     not null default 0 check (canastras_sujas  >= 0),
    canastras_reais  int     not null default 0 check (canastras_reais  >= 0),  -- Ás a Ás
    pontos_canastras int     not null default 0 check (pontos_canastras >= 0),
    bateu            boolean not null default false,
    pontos_batida    int     not null default 0 check (pontos_batida >= 0),
    pontos_mao       int     not null default 0 check (pontos_mao <= 0),        -- sempre desconto
    ajuste           int     not null default 0,      -- outros acertos (+ ou -)
    total            int     not null,
    venceu           boolean not null default false,  -- ganhou a rodada

    constraint pontuacoes_jogador_unico unique (rodada_id, jogador_id),
    constraint pontuacoes_soma_confere check (
        modo = 'total'
        or total = pontos_cartas + pontos_canastras + pontos_batida + pontos_mao + ajuste
    ),
    constraint pontuacoes_texto_tamanho check (
        char_length(jogos_texto) <= 2000 and char_length(mao_texto) <= 300
    )
);

create index if not exists pontuacoes_jogador_idx on public.pontuacoes (jogador_id);

-- Só uma pessoa bate por rodada
create unique index if not exists pontuacoes_uma_batida_por_rodada
    on public.pontuacoes (rodada_id) where bateu;


-- --------------------------------------------------------------------------
-- 5. View para o placar e as estatísticas: cada pontuação já com a data
--    "security_invoker": a view respeita o RLS de quem consulta.
-- --------------------------------------------------------------------------
create or replace view public.v_pontuacoes
with (security_invoker = true) as
select
    p.id,
    p.rodada_id,
    r.partida_id,
    r.numero  as rodada_numero,
    pa.data,
    p.jogador_id,
    p.modo,
    p.pontos_cartas,
    p.canastras_limpas,
    p.canastras_sujas,
    p.canastras_reais,
    p.pontos_canastras,
    p.bateu,
    p.pontos_batida,
    p.pontos_mao,
    p.ajuste,
    p.total,
    p.venceu
from public.pontuacoes as p
join public.rodadas    as r  on r.id  = p.rodada_id
join public.partidas   as pa on pa.id = r.partida_id;


-- --------------------------------------------------------------------------
-- 6. Row Level Security
--
-- O placar é da turma: qualquer pessoa com o endereço do site lê e lança
-- pontos (como um caderninho em cima da mesa). Para exigir login, veja a
-- seção "Segurança" do README.
-- --------------------------------------------------------------------------
alter table public.jogadores         enable row level security;
alter table public.partidas          enable row level security;
alter table public.partida_jogadores enable row level security;
alter table public.rodadas           enable row level security;
alter table public.pontuacoes        enable row level security;

grant select, insert, update, delete on table
    public.jogadores, public.partidas, public.partida_jogadores, public.rodadas, public.pontuacoes
    to anon, authenticated;
grant select on table public.v_pontuacoes to anon, authenticated;

drop policy if exists "jogadores_turma"         on public.jogadores;
drop policy if exists "partidas_turma"          on public.partidas;
drop policy if exists "partida_jogadores_turma" on public.partida_jogadores;
drop policy if exists "rodadas_turma"           on public.rodadas;
drop policy if exists "pontuacoes_turma"        on public.pontuacoes;

create policy "jogadores_turma"         on public.jogadores         for all to anon, authenticated using (true) with check (true);
create policy "partidas_turma"          on public.partidas          for all to anon, authenticated using (true) with check (true);
create policy "partida_jogadores_turma" on public.partida_jogadores for all to anon, authenticated using (true) with check (true);
create policy "rodadas_turma"           on public.rodadas           for all to anon, authenticated using (true) with check (true);
create policy "pontuacoes_turma"        on public.pontuacoes        for all to anon, authenticated using (true) with check (true);


-- --------------------------------------------------------------------------
-- 7. criar_partida: a partida e os jogadores de uma vez só
-- --------------------------------------------------------------------------
create or replace function public.criar_partida(
    p_data        date,
    p_local       text,
    p_observacao  text,
    p_jogadores   uuid[]
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
    v_id uuid;
begin
    if coalesce(array_length(p_jogadores, 1), 0) < 2 then
        raise exception 'Escolha pelo menos 2 jogadores.' using errcode = '22023';
    end if;

    insert into public.partidas (data, local, observacao)
    values (p_data, nullif(btrim(p_local), ''), nullif(btrim(p_observacao), ''))
    returning id into v_id;

    insert into public.partida_jogadores (partida_id, jogador_id, ordem)
    select v_id, j.id, j.ordem::int
      from unnest(p_jogadores) with ordinality as j(id, ordem);

    return v_id;
end;
$$;


-- --------------------------------------------------------------------------
-- 8. atualizar_partida: muda data, local, observação e jogadores.
--    Não deixa tirar quem já tem pontos lançados nesta partida.
-- --------------------------------------------------------------------------
create or replace function public.atualizar_partida(
    p_partida_id  uuid,
    p_data        date,
    p_local       text,
    p_observacao  text,
    p_jogadores   uuid[]
)
returns void
language plpgsql
set search_path = ''
as $$
begin
    if coalesce(array_length(p_jogadores, 1), 0) < 2 then
        raise exception 'Escolha pelo menos 2 jogadores.' using errcode = '22023';
    end if;

    update public.partidas
       set data = p_data,
           local = nullif(btrim(p_local), ''),
           observacao = nullif(btrim(p_observacao), '')
     where id = p_partida_id;

    if not found then
        raise exception 'Partida não encontrada.' using errcode = 'P0002';
    end if;

    if exists (
        select 1
          from public.pontuacoes as p
          join public.rodadas as r on r.id = p.rodada_id
         where r.partida_id = p_partida_id
           and p.jogador_id <> all (p_jogadores)
    ) then
        raise exception 'Quem já tem pontos nesta partida não pode sair dela. Exclua as rodadas antes.'
            using errcode = '23503';
    end if;

    delete from public.partida_jogadores
     where partida_id = p_partida_id
       and jogador_id <> all (p_jogadores);

    insert into public.partida_jogadores (partida_id, jogador_id, ordem)
    select p_partida_id, j.id, j.ordem::int
      from unnest(p_jogadores) with ordinality as j(id, ordem)
    on conflict (partida_id, jogador_id) do update set ordem = excluded.ordem;
end;
$$;


-- --------------------------------------------------------------------------
-- 9. salvar_rodada: cria (p_rodada_id = null) ou substitui uma rodada,
--    com as pontuações de todos os jogadores, numa transação só.
--    p_pontuacoes é um array JSON com as colunas da tabela pontuacoes.
-- --------------------------------------------------------------------------
create or replace function public.salvar_rodada(
    p_partida_id  uuid,
    p_rodada_id   uuid,
    p_pontuacoes  jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
    v_rodada uuid := p_rodada_id;
    v_numero int;
begin
    if jsonb_typeof(p_pontuacoes) <> 'array' or jsonb_array_length(p_pontuacoes) < 2 then
        raise exception 'A rodada precisa dos pontos de pelo menos 2 jogadores.' using errcode = '22023';
    end if;

    if v_rodada is null then
        -- trava a partida para duas pessoas não criarem a "rodada 3" ao mesmo tempo
        perform 1 from public.partidas where id = p_partida_id for update;
        if not found then
            raise exception 'Partida não encontrada.' using errcode = 'P0002';
        end if;

        select coalesce(max(numero), 0) + 1 into v_numero
          from public.rodadas where partida_id = p_partida_id;

        insert into public.rodadas (partida_id, numero)
        values (p_partida_id, v_numero)
        returning id into v_rodada;
    else
        perform 1 from public.rodadas where id = v_rodada and partida_id = p_partida_id;
        if not found then
            raise exception 'Rodada não encontrada.' using errcode = 'P0002';
        end if;

        delete from public.pontuacoes where rodada_id = v_rodada;
    end if;

    insert into public.pontuacoes (
        rodada_id, jogador_id, modo, jogos_texto, mao_texto, jogos,
        pontos_cartas, canastras_limpas, canastras_sujas, canastras_reais, pontos_canastras,
        bateu, pontos_batida, pontos_mao, ajuste, total, venceu
    )
    select
        v_rodada, x.jogador_id, coalesce(x.modo, 'cartas'),
        coalesce(x.jogos_texto, ''), coalesce(x.mao_texto, ''), coalesce(x.jogos, '[]'::jsonb),
        coalesce(x.pontos_cartas, 0), coalesce(x.canastras_limpas, 0), coalesce(x.canastras_sujas, 0),
        coalesce(x.canastras_reais, 0), coalesce(x.pontos_canastras, 0),
        coalesce(x.bateu, false), coalesce(x.pontos_batida, 0), coalesce(x.pontos_mao, 0),
        coalesce(x.ajuste, 0), x.total, coalesce(x.venceu, false)
    from jsonb_to_recordset(p_pontuacoes) as x(
        jogador_id uuid, modo text, jogos_texto text, mao_texto text, jogos jsonb,
        pontos_cartas int, canastras_limpas int, canastras_sujas int, canastras_reais int,
        pontos_canastras int, bateu boolean, pontos_batida int, pontos_mao int,
        ajuste int, total int, venceu boolean
    );

    return v_rodada;
end;
$$;


-- --------------------------------------------------------------------------
-- 10. excluir_rodada: apaga e renumera as seguintes (rodada 3 vira 2...)
-- --------------------------------------------------------------------------
create or replace function public.excluir_rodada(p_rodada_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
declare
    v_partida uuid;
    v_numero  int;
begin
    set constraints public.rodadas_partida_numero_unico deferred;

    delete from public.rodadas
     where id = p_rodada_id
 returning partida_id, numero into v_partida, v_numero;

    if v_partida is null then
        raise exception 'Rodada não encontrada.' using errcode = 'P0002';
    end if;

    update public.rodadas
       set numero = numero - 1
     where partida_id = v_partida
       and numero > v_numero;
end;
$$;


-- --------------------------------------------------------------------------
-- 11. Quem pode chamar as funções (Data API: /rest/v1/rpc/...)
--     Sem "security definer": as funções rodam com o RLS de quem chama.
-- --------------------------------------------------------------------------
revoke execute on function public.criar_partida(date, text, text, uuid[])           from public;
revoke execute on function public.atualizar_partida(uuid, date, text, text, uuid[]) from public;
revoke execute on function public.salvar_rodada(uuid, uuid, jsonb)                  from public;
revoke execute on function public.excluir_rodada(uuid)                              from public;

grant execute on function public.criar_partida(date, text, text, uuid[])           to anon, authenticated;
grant execute on function public.atualizar_partida(uuid, date, text, text, uuid[]) to anon, authenticated;
grant execute on function public.salvar_rodada(uuid, uuid, jsonb)                  to anon, authenticated;
grant execute on function public.excluir_rodada(uuid)                              to anon, authenticated;

-- Avisa a Data API (PostgREST) que o esquema mudou
notify pgrst, 'reload schema';
