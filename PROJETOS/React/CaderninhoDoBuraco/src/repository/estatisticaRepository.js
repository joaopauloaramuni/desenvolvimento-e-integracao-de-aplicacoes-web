import { buscarTudo, cliente } from "./base";

/**
 * Leitura da view v_pontuacoes (cada pontuação já com a data da partida),
 * usada pelo placar e pelo dashboard.
 *
 * select * from v_pontuacoes where data between ? and ? order by data, rodada_numero
 */
const COLUNAS =
  "id, rodada_id, partida_id, rodada_numero, data, jogador_id, modo, pontos_cartas, " +
  "canastras_limpas, canastras_sujas, canastras_reais, pontos_canastras, bateu, " +
  "pontos_batida, pontos_mao, ajuste, total, venceu";

export async function findPontuacoes({ inicio = null, fim = null } = {}) {
  return buscarTudo(() => {
    let consulta = cliente().from("v_pontuacoes").select(COLUNAS);
    if (inicio) consulta = consulta.gte("data", inicio);
    if (fim) consulta = consulta.lte("data", fim);
    return consulta
      .order("data", { ascending: true })
      .order("partida_id", { ascending: true })
      .order("rodada_numero", { ascending: true })
      .order("id", { ascending: true });
  });
}
