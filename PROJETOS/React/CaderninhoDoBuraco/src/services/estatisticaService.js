import * as estatisticaRepository from "../repository/estatisticaRepository";
import { intervaloDoPeriodo } from "../utils/periodo";

/**
 * Placar geral e números do dashboard, calculados a partir da view
 * v_pontuacoes (uma linha por jogador por rodada) no período escolhido.
 */

export async function buscarEstatisticas(periodo, jogadores) {
  const linhas = await estatisticaRepository.findPontuacoes(intervaloDoPeriodo(periodo));
  return calcularEstatisticas(linhas, jogadores);
}

function vazio(jogador) {
  return {
    jogador,
    rodadas: 0,
    vitorias: 0,
    pontos: 0,
    batidas: 0,
    limpas: 0,
    sujas: 0,
    reais: 0,
    pontosMao: 0,
    maiorRodada: null,
    partidas: new Set(),
  };
}

/**
 * Função pura (dá para testar sem banco). Recebe as linhas da view e a lista
 * de jogadores, e devolve tudo o que o placar e os gráficos precisam.
 */
export function calcularEstatisticas(linhas, jogadores) {
  const porId = new Map(jogadores.map((j) => [j.id, vazio(j)]));
  const partidas = new Set();
  const rodadas = new Set();
  let maiorRodada = null;

  // Evolução: pontos acumulados de cada jogador, dia a dia
  const acumulado = new Map();
  const porDia = new Map();
  // Vitórias por mês
  const porMes = new Map();

  for (const l of linhas) {
    const s = porId.get(l.jogador_id);
    if (!s) continue;

    partidas.add(l.partida_id);
    rodadas.add(l.rodada_id);
    s.partidas.add(l.partida_id);
    s.rodadas += 1;
    s.pontos += l.total;
    s.pontosMao += l.pontos_mao;
    s.limpas += l.canastras_limpas;
    s.sujas += l.canastras_sujas;
    s.reais += l.canastras_reais;
    if (l.bateu) s.batidas += 1;
    if (l.venceu) s.vitorias += 1;

    if (!s.maiorRodada || l.total > s.maiorRodada.total) {
      s.maiorRodada = { total: l.total, data: l.data, rodada: l.rodada_numero };
    }
    if (!maiorRodada || l.total > maiorRodada.total) {
      maiorRodada = { jogador: s.jogador, total: l.total, data: l.data, rodada: l.rodada_numero };
    }

    acumulado.set(l.jogador_id, (acumulado.get(l.jogador_id) ?? 0) + l.total);
    porDia.set(l.data, { ...porDia.get(l.data), ...Object.fromEntries(acumulado) });

    const mes = l.data.slice(0, 7);
    const linhaMes = porMes.get(mes) ?? { mes };
    if (l.venceu) linhaMes[l.jogador_id] = (linhaMes[l.jogador_id] ?? 0) + 1;
    porMes.set(mes, linhaMes);
  }

  const participantes = [...porId.values()].filter((s) => s.rodadas > 0);

  const ranking = participantes
    .map((s) => ({
      jogador: s.jogador,
      partidas: s.partidas.size,
      rodadas: s.rodadas,
      vitorias: s.vitorias,
      aproveitamento: s.rodadas ? s.vitorias / s.rodadas : 0,
      pontos: s.pontos,
      media: s.rodadas ? Math.round(s.pontos / s.rodadas) : 0,
      batidas: s.batidas,
      limpas: s.limpas,
      sujas: s.sujas,
      reais: s.reais,
      canastras: s.limpas + s.sujas + s.reais,
      pontosMao: s.pontosMao,
      maiorRodada: s.maiorRodada,
    }))
    .sort((a, b) => b.vitorias - a.vitorias || b.pontos - a.pontos || a.jogador.nome.localeCompare(b.jogador.nome));

  // Para a linha não "cair" em quem não jogou num dia, repete o último valor
  const evolucao = [];
  const ultimo = {};
  for (const [data, valores] of porDia) {
    Object.assign(ultimo, valores);
    evolucao.push({ data, ...ultimo });
  }

  const vitoriasPorMes = [...porMes.values()].map((linha) => {
    const completa = { ...linha };
    for (const s of participantes) completa[s.jogador.id] = completa[s.jogador.id] ?? 0;
    return completa;
  });

  return {
    ranking,
    jogadores: participantes.map((s) => s.jogador),
    totais: {
      partidas: partidas.size,
      rodadas: rodadas.size,
      canastrasReais: ranking.reduce((soma, r) => soma + r.reais, 0),
      canastras: ranking.reduce((soma, r) => soma + r.canastras, 0),
      maiorRodada,
    },
    evolucao,
    vitoriasPorMes,
  };
}
