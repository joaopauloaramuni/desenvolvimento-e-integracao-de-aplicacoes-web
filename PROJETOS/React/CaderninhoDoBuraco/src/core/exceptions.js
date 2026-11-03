// exceptions.js
// Erros com nome, para as telas decidirem o que mostrar com "instanceof".

/** O Supabase não foi configurado no .env.local. */
export class SupabaseNaoConfiguradoException extends Error {
  constructor() {
    super("Supabase não configurado: preencha o .env.local (veja o README).");
    this.name = "SupabaseNaoConfiguradoException";
  }
}

/** Já existe um jogador com esse nome. */
export class JogadorJaExisteException extends Error {
  constructor(nome) {
    super(`Já existe um jogador chamado "${nome}".`);
    this.name = "JogadorJaExisteException";
  }
}

/** O jogador tem pontos lançados e não pode ser excluído (dá para desativar). */
export class JogadorComPontosException extends Error {
  constructor(nome) {
    super(`${nome} já tem pontos lançados. Em vez de excluir, desative o jogador.`);
    this.name = "JogadorComPontosException";
  }
}

/** Partida ou rodada que não existe (ou foi excluída). */
export class NaoEncontradoException extends Error {
  constructor(message = "Não encontramos o que você procurou. Pode ter sido excluído.") {
    super(message);
    this.name = "NaoEncontradoException";
  }
}

/** Dados do formulário que não passam nas regras. */
export class DadosInvalidosException extends Error {
  constructor(message) {
    super(message);
    this.name = "DadosInvalidosException";
  }
}
