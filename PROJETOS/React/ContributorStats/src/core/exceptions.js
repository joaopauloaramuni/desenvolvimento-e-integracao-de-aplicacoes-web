// Exceções da regra de negócio (a camada de apresentação decide como exibi-las).

/** Erro base do projeto. */
export class ContributorStatsError extends Error {
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
}

/** A URL / identificador do repositório não pôde ser interpretado. */
export class InvalidRepoURLError extends ContributorStatsError {}

/** A API do GitHub retornou um erro (ou não pôde ser acessada). */
export class GitHubAPIError extends ContributorStatsError {
  constructor(message, statusCode = null) {
    super(message);
    this.statusCode = statusCode;
  }
}

/** O GitHub não terminou de calcular as estatísticas dentro do tempo limite. */
export class StatsNotReadyError extends ContributorStatsError {}

/** A operação foi cancelada pelo usuário. */
export class OperationCancelledError extends ContributorStatsError {}
