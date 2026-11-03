import Partida from "../model/Partida";
import { buscarTudo, cliente, verificar } from "./base";

/**
 * Acesso às tabelas "partidas" e "partida_jogadores".
 * Criar e editar passam pelas funções criar_partida e atualizar_partida
 * (uma transação só para a partida e os jogadores).
 */
const TABELA = "partidas";

// Lista: só o necessário para o resumo (total e vencedor de cada rodada)
const COLUNAS_LISTA = `
  id, data, local, observacao,
  partida_jogadores ( jogador_id, ordem ),
  rodadas ( id, numero, pontuacoes ( jogador_id, total, venceu, bateu ) )
`;

// Detalhe: tudo de cada pontuação (jogos digitados, canastras, mão...)
const COLUNAS_DETALHE = `
  id, data, local, observacao,
  partida_jogadores ( jogador_id, ordem ),
  rodadas ( id, numero, pontuacoes ( * ) )
`;

/** As partidas, da mais nova para a mais antiga. */
export async function findAll() {
  const linhas = await buscarTudo(() =>
    cliente()
      .from(TABELA)
      .select(COLUNAS_LISTA)
      .order("data", { ascending: false })
      .order("created_at", { ascending: false })
  );
  return linhas.map(Partida.fromRow);
}

/** Uma partida com todas as rodadas, ou null. */
export async function findById(id) {
  const { data, error } = await cliente()
    .from(TABELA)
    .select(COLUNAS_DETALHE)
    .eq("id", id)
    .maybeSingle();
  verificar(error);
  return data ? Partida.fromRow(data) : null;
}

/** select criar_partida(...) -> id da partida nova */
export async function save({ data, local, observacao, jogadorIds }) {
  const { data: id, error } = await cliente().rpc("criar_partida", {
    p_data: data,
    p_local: local ?? "",
    p_observacao: observacao ?? "",
    p_jogadores: jogadorIds,
  });
  verificar(error);
  return id;
}

/** select atualizar_partida(...) */
export async function update(id, { data, local, observacao, jogadorIds }) {
  const { error } = await cliente().rpc("atualizar_partida", {
    p_partida_id: id,
    p_data: data,
    p_local: local ?? "",
    p_observacao: observacao ?? "",
    p_jogadores: jogadorIds,
  });
  verificar(error);
}

/** delete from partidas where id = ? (as rodadas e pontuações vão junto) */
export async function deleteById(id) {
  const { error } = await cliente().from(TABELA).delete().eq("id", id);
  verificar(error);
}
