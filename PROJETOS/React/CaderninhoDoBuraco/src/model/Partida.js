import Rodada from "./Rodada";

/** Um dia de jogo: a data, quem jogou e as rodadas. */
export default class Partida {
  constructor({ id, data, local = null, observacao = null, jogadorIds = [], rodadas = [] }) {
    this.id = id;
    this.data = data; // "2026-11-02" (date do Postgres, sem fuso)
    this.local = local;
    this.observacao = observacao;
    this.jogadorIds = jogadorIds;
    this.rodadas = rodadas;
  }

  static fromRow(row) {
    const jogadores = [...(row.partida_jogadores ?? [])].sort((a, b) => a.ordem - b.ordem);
    const rodadas = (row.rodadas ?? []).map(Rodada.fromRow).sort((a, b) => a.numero - b.numero);
    return new Partida({
      id: row.id,
      data: row.data,
      local: row.local,
      observacao: row.observacao,
      jogadorIds: jogadores.map((j) => j.jogador_id),
      rodadas,
    });
  }

  /** Soma dos pontos de cada jogador no dia: { [jogadorId]: total } */
  get totais() {
    const totais = Object.fromEntries(this.jogadorIds.map((id) => [id, 0]));
    for (const r of this.rodadas) {
      for (const p of r.pontuacoes) totais[p.jogadorId] = (totais[p.jogadorId] ?? 0) + p.total;
    }
    return totais;
  }

  /** Rodadas vencidas por jogador no dia: { [jogadorId]: n } */
  get vitorias() {
    const vitorias = Object.fromEntries(this.jogadorIds.map((id) => [id, 0]));
    for (const r of this.rodadas) {
      for (const id of r.vencedores) vitorias[id] = (vitorias[id] ?? 0) + 1;
    }
    return vitorias;
  }
}
