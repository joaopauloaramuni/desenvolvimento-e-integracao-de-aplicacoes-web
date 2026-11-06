// Transformação dos dados brutos da API em um ranking de colaboradores.
import { Contributor } from "./models";

// Comparação de tuplas (como no Python): [a1, a2] x [b1, b2]
function compareTuples(a, b) {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

// Ordem de texto igual ao str.lower do Python (por código Unicode, sem locale)
export const compareLower = (a, b) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
};

/** Critérios de ordenação do ranking (critério principal + desempate). */
export const SortCriterion = Object.freeze({
  COMMITS: "commits",
  NET_IMPACT: "impacto",
  ADDITIONS: "insercoes",
});

export const SORT_CRITERIA = [
  {
    value: SortCriterion.COMMITS,
    label: "Commits (desempate: impacto líquido)",
    key: (c) => [c.commits, c.netImpact],
  },
  {
    value: SortCriterion.NET_IMPACT,
    label: "Impacto líquido (desempate: commits)",
    key: (c) => [c.netImpact, c.commits],
  },
  {
    value: SortCriterion.ADDITIONS,
    label: "Linhas inseridas (desempate: commits)",
    key: (c) => [c.additions, c.commits],
  },
];

const criterionKey = (criterion) =>
  (SORT_CRITERIA.find((c) => c.value === criterion) ?? SORT_CRITERIA[0]).key;

// "2025-09-30T15:23:45Z" -> "2025-09-30" (data UTC)
function parseIsoDate(text) {
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

/** Início da última semana com commits (usado como data aproximada). */
function lastActiveWeek(weeks) {
  const active = weeks.filter((w) => (w.c ?? 0) > 0 && "w" in w).map((w) => w.w);
  if (!active.length) return null;
  return new Date(Math.max(...active) * 1000).toISOString().slice(0, 10);
}

/**
 * Converte o JSON de /stats/contributors em objetos Contributor.
 *
 * Não faz nenhuma requisição: a data do último commit é preenchida aqui com
 * uma estimativa (semana da última atividade) e pode ser refinada depois.
 */
export function buildContributors(contributorsData) {
  return contributorsData.map((item) => {
    // 'author' pode vir nulo (ex.: conta excluída / e-mail não vinculado)
    const author = item.author ?? {};
    const weeks = item.weeks ?? [];
    return new Contributor({
      username: author.login || "(usuário desconhecido)",
      profileUrl: author.html_url || "",
      commits: Number(item.total ?? 0),
      additions: weeks.reduce((sum, w) => sum + Number(w.a ?? 0), 0),
      deletions: weeks.reduce((sum, w) => sum + Number(w.d ?? 0), 0),
      lastCommit: lastActiveWeek(weeks),
      lastCommitIsEstimate: true,
      weeks, // a aba "Produtividade" usa a atividade semanal
    });
  });
}

/**
 * Agrega commits (já sem duplicatas) por autor.
 *
 * - lastCommit é a data exata (committer) do commit mais recente;
 * - unmergedCommits conta os commits que não estão na branch padrão;
 * - branches lista as branches onde esses commits não mergeados estão.
 */
export function buildContributorsFromCommits(commits) {
  const byAuthor = new Map();
  for (const c of commits) {
    let contrib = byAuthor.get(c.authorKey);
    if (!contrib) {
      contrib = new Contributor({
        username: c.authorName,
        key: c.authorKey,
        profileUrl: c.profileUrl,
        commits: 0,
        additions: 0,
        deletions: 0,
        unmergedCommits: 0,
      });
      byAuthor.set(c.authorKey, contrib);
    }
    contrib.commits += 1;
    contrib.additions += c.additions;
    contrib.deletions += c.deletions;
    if (!c.inDefaultBranch) {
      contrib.unmergedCommits = (contrib.unmergedCommits ?? 0) + 1;
      if (!contrib.branches.includes(c.branch)) contrib.branches.push(c.branch);
    }
    const day = parseIsoDate(c.committedDate || c.authoredDate);
    if (day && (contrib.lastCommit === null || day > contrib.lastCommit)) {
      contrib.lastCommit = day;
    }
  }

  for (const contrib of byAuthor.values()) contrib.branches.sort(compareLower);
  return [...byAuthor.values()];
}

/** Ordena (decrescente) e preenche o campo rank (1, 2, 3…). Devolve novos objetos. */
export function rankContributors(contributors, criterion = SortCriterion.COMMITS) {
  const key = criterionKey(criterion);
  // sort() é estável: empates mantêm a ordem original, como o sorted() do Python
  return [...contributors]
    .sort((a, b) => compareTuples(key(b), key(a)))
    .map((c, index) => {
      const copy = new Contributor({ ...c, branches: [...c.branches] });
      copy.rank = index + 1;
      return copy;
    });
}
