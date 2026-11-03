import Pontuacao from "./Pontuacao";

/** Uma rodada de uma partida, com a pontuação de cada jogador. */
export default class Rodada {
  constructor({ id, numero, pontuacoes = [] }) {
    this.id = id;
    this.numero = numero;
    this.pontuacoes = pontuacoes;
  }

  static fromRow(row) {
    return new Rodada({
      id: row.id,
      numero: row.numero,
      pontuacoes: (row.pontuacoes ?? []).map(Pontuacao.fromRow),
    });
  }

  /** Pontuação de um jogador nesta rodada (ou undefined). */
  de(jogadorId) {
    return this.pontuacoes.find((p) => p.jogadorId === jogadorId);
  }

  get vencedores() {
    return this.pontuacoes.filter((p) => p.venceu).map((p) => p.jogadorId);
  }
}
