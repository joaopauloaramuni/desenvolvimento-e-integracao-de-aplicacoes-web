/**
 * Um jogador da mesa. O supabase-js devolve as colunas em snake_case;
 * aqui viram camelCase.
 */
export default class Jogador {
  constructor({ id, nome, carta = "dama-copas", cor = "#e2b544", ativo = true, createdAt = new Date() }) {
    this.id = id;
    this.nome = nome;
    this.carta = carta;
    this.cor = cor;
    this.ativo = ativo;
    this.createdAt = new Date(createdAt);
  }

  static fromRow(row) {
    return new Jogador({
      id: row.id,
      nome: row.nome,
      carta: row.carta,
      cor: row.cor,
      ativo: row.ativo,
      createdAt: row.created_at,
    });
  }

  /** "João Paulo" -> "JP", "Lara" -> "LA" */
  get iniciais() {
    const partes = this.nome.trim().split(/\s+/);
    const texto = partes.length > 1 ? partes[0][0] + partes[1][0] : this.nome.slice(0, 2);
    return texto.toUpperCase();
  }
}
