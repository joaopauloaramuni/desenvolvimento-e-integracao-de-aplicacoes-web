import { cliente, verificar } from "./base";

/**
 * Rodadas e pontuações. Salvar passa pela função salvar_rodada, que grava a
 * rodada e a pontuação de todos os jogadores numa transação só.
 */

/** select salvar_rodada(partida, rodada ou null, '[{...}, {...}]') -> id da rodada */
export async function save(partidaId, rodadaId, pontuacoes) {
  const { data, error } = await cliente().rpc("salvar_rodada", {
    p_partida_id: partidaId,
    p_rodada_id: rodadaId,
    p_pontuacoes: pontuacoes.map((p) => p.toRow()),
  });
  verificar(error);
  return data;
}

/** select excluir_rodada(id): apaga e renumera as rodadas seguintes */
export async function deleteById(rodadaId) {
  const { error } = await cliente().rpc("excluir_rodada", { p_rodada_id: rodadaId });
  verificar(error);
}
