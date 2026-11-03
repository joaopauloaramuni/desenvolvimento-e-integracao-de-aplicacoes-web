/**
 * O resultado de um jogador numa rodada (uma linha da tabela pontuacoes).
 */
export default class Pontuacao {
  constructor(dados) {
    this.id = dados.id ?? null;
    this.jogadorId = dados.jogadorId;
    this.modo = dados.modo ?? "cartas";
    this.jogosTexto = dados.jogosTexto ?? "";
    this.maoTexto = dados.maoTexto ?? "";
    this.jogos = dados.jogos ?? [];
    this.pontosCartas = dados.pontosCartas ?? 0;
    this.canastrasLimpas = dados.canastrasLimpas ?? 0;
    this.canastrasSujas = dados.canastrasSujas ?? 0;
    this.canastrasReais = dados.canastrasReais ?? 0;
    this.pontosCanastras = dados.pontosCanastras ?? 0;
    this.bateu = Boolean(dados.bateu);
    this.pontosBatida = dados.pontosBatida ?? 0;
    this.pontosMao = dados.pontosMao ?? 0;
    this.ajuste = dados.ajuste ?? 0;
    this.total = dados.total ?? 0;
    this.venceu = Boolean(dados.venceu);
  }

  static fromRow(row) {
    return new Pontuacao({
      id: row.id,
      jogadorId: row.jogador_id,
      modo: row.modo,
      jogosTexto: row.jogos_texto,
      maoTexto: row.mao_texto,
      jogos: row.jogos,
      pontosCartas: row.pontos_cartas,
      canastrasLimpas: row.canastras_limpas,
      canastrasSujas: row.canastras_sujas,
      canastrasReais: row.canastras_reais,
      pontosCanastras: row.pontos_canastras,
      bateu: row.bateu,
      pontosBatida: row.pontos_batida,
      pontosMao: row.pontos_mao,
      ajuste: row.ajuste,
      total: row.total,
      venceu: row.venceu,
    });
  }

  /** Formato do parâmetro p_pontuacoes da função salvar_rodada. */
  toRow() {
    return {
      jogador_id: this.jogadorId,
      modo: this.modo,
      jogos_texto: this.jogosTexto,
      mao_texto: this.maoTexto,
      jogos: this.jogos,
      pontos_cartas: this.pontosCartas,
      canastras_limpas: this.canastrasLimpas,
      canastras_sujas: this.canastrasSujas,
      canastras_reais: this.canastrasReais,
      pontos_canastras: this.pontosCanastras,
      bateu: this.bateu,
      pontos_batida: this.pontosBatida,
      pontos_mao: this.pontosMao,
      ajuste: this.ajuste,
      total: this.total,
      venceu: this.venceu,
    };
  }
}
