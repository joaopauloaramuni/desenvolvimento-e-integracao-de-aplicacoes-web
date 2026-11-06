// Estruturas de dados usadas pela regra de negócio (equivalente ao core/models.py).
//
// Datas são guardadas como texto "AAAA-MM-DD" (UTC): comparam-se em ordem
// alfabética e não sofrem com fuso horário.

/** "2025-09-30" -> "30/09/2025" */
export function formatDateBR(isoDay) {
  if (!isoDay) return "";
  const [y, m, d] = isoDay.split("-");
  return `${d}/${m}/${y}`;
}

const DAY_MS = 86_400_000;

/** Data de hoje (fuso de quem usa) como "AAAA-MM-DD". */
export function todayISO(now = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Dias inteiros entre dois dias "AAAA-MM-DD" (to - from), nunca negativo. */
export function daysBetween(fromIsoDay, toIsoDay) {
  if (!fromIsoDay || !toIsoDay) return null;
  const diff = Date.parse(`${toIsoDay}T00:00:00Z`) - Date.parse(`${fromIsoDay}T00:00:00Z`);
  return Number.isFinite(diff) ? Math.max(0, Math.round(diff / DAY_MS)) : null;
}

/** 0 -> "hoje" · 1 -> "1 dia" · 5 -> "5 dias" */
export function formatDays(days) {
  if (days === null || days === undefined) return "N/A";
  if (days === 0) return "hoje";
  return `${new Intl.NumberFormat("pt-BR").format(days)} ${days === 1 ? "dia" : "dias"}`;
}

/** Métricas consolidadas de um colaborador do repositório. */
export class Contributor {
  constructor({
    username,
    key = null, // identificador do autor nos commits (login em minúsculas ou e-mail)
    profileUrl,
    commits,
    additions,
    deletions,
    lastCommit = null,
    lastCommitIsEstimate = false, // true = data veio da semana de atividade (aproximada)
    rank = 0,
    unmergedCommits = null, // commits fora da branch padrão (só em "todas as branches")
    branches = [], // branches (exceto a padrão) com commits ainda não mergeados
    weeks = null, // só no modo "branch padrão": [{ w, a, d, c }] do /stats/contributors
  }) {
    Object.assign(this, {
      username,
      key: key ?? username.toLowerCase(),
      profileUrl,
      commits,
      additions,
      deletions,
      lastCommit,
      lastCommitIsEstimate,
      rank,
      unmergedCommits,
      branches,
      weeks,
    });
  }

  /** Impacto líquido = linhas inseridas - linhas deletadas. */
  get netImpact() {
    return this.additions - this.deletions;
  }

  /** Dias sem commit, do último commit até hoje (null se a data é desconhecida). */
  daysWithoutCommit(today = todayISO()) {
    return daysBetween(this.lastCommit, today);
  }

  /** "5 dias", "hoje" ou "N/A" — com "~" quando a data do último commit é aproximada. */
  daysWithoutCommitDisplay(today = todayISO()) {
    const days = this.daysWithoutCommit(today);
    if (days === null) return "N/A";
    return this.lastCommitIsEstimate ? `~${formatDays(days)}` : formatDays(days);
  }

  get lastCommitDisplay() {
    if (!this.lastCommit) return "N/A";
    const text = formatDateBR(this.lastCommit);
    return this.lastCommitIsEstimate ? `~${text}` : text;
  }

  /** Linha no formato usado pelo CSV. */
  toRow() {
    return {
      Posição: this.rank,
      "Nome de Usuário": this.username,
      "URL Perfil": this.profileUrl,
      "Commits Totais": this.commits,
      "Linhas Inseridas": this.additions,
      "Linhas Deletadas": this.deletions,
      "Impacto Líquido (Ins - Del)": this.netImpact,
      "Último Commit": this.lastCommitDisplay,
      "Dias sem Commit (até hoje)": this.daysWithoutCommit() ?? "",
      "Commits Fora da Branch Padrão": this.unmergedCommits ?? "",
      "Branches (não mergeadas)": this.branches.join(", "),
    };
  }
}

/** Resultado completo de uma análise de repositório. */
export class AnalysisResult {
  constructor({
    owner,
    repo,
    contributors = [],
    allBranches = false, // true = considerou todas as branches; false = só a padrão
    defaultBranch = null,
    branchNames = [],
    includeMerges = false,
    // Commits considerados no ranking: [{ oid, authorKey, isMerge }] (só em "todas as branches").
    // As abas "Tipos de arquivo" usam esta lista para buscar os arquivos de cada commit.
    commitRefs = null,
    // Commits completos (CommitRecord, com data, linhas e mensagem) — só em "todas as
    // branches". A aba "Produtividade" usa esta lista; null = só a branch padrão.
    commitRecords = null,
    // Título do trabalho: primeira linha com texto do README.md (null se não houver)
    title = null,
  }) {
    Object.assign(this, {
      owner,
      repo,
      contributors,
      allBranches,
      defaultBranch,
      branchNames,
      includeMerges,
      commitRefs,
      commitRecords,
      title,
    });
  }

  get scopeLabel() {
    if (this.allBranches) return `todas as branches (${this.branchNames.length})`;
    return this.defaultBranch ? `branch padrão (${this.defaultBranch})` : "branch padrão";
  }

  get fullName() {
    return `${this.owner}/${this.repo}`;
  }

  get totalCommits() {
    return this.contributors.reduce((sum, c) => sum + c.commits, 0);
  }

  get totalAdditions() {
    return this.contributors.reduce((sum, c) => sum + c.additions, 0);
  }

  get totalDeletions() {
    return this.contributors.reduce((sum, c) => sum + c.deletions, 0);
  }

  get totalNetImpact() {
    return this.totalAdditions - this.totalDeletions;
  }

  /** Cópia com outra lista de colaboradores (útil para o estado do React). */
  withContributors(contributors) {
    return new AnalysisResult({ ...this, contributors });
  }
}

/**
 * Um commit lido de uma branch (modo "todas as branches").
 * @typedef {Object} CommitRecord
 * @property {string} oid
 * @property {string} authorKey      login do GitHub ou, na falta dele, o e-mail
 * @property {string} authorName
 * @property {string} profileUrl
 * @property {number} additions
 * @property {number} deletions
 * @property {string} authoredDate   ISO 8601
 * @property {string} committedDate  ISO 8601
 * @property {string} messageHeadline
 * @property {boolean} isMerge
 * @property {string} branch         primeira branch em que o commit foi encontrado
 * @property {boolean} inDefaultBranch
 */

/**
 * Mensagem de progresso enviada pela regra de negócio à interface.
 * level: info | success | warning | error
 */
export function progressEvent(message, level = "info", current = null, total = null) {
  return { message, level, current, total };
}
