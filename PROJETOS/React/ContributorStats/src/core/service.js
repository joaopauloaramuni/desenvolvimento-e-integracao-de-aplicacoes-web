// Caso de uso principal: analisar um repositório e produzir o ranking
// (equivalente ao core/service.py do Python).
//
// É a única função que a interface precisa chamar. Ela não conhece React:
// comunica o andamento por meio de onProgress e pode ser cancelada com um
// AbortSignal (o equivalente ao threading.Event do Python).
import CONFIG from "../config/contributorStatsConfig";
import { GitHubClient } from "../services/githubClient";
import { ContributorStatsError, OperationCancelledError } from "./exceptions";
import { AnalysisResult, progressEvent } from "./models";
import {
  SortCriterion,
  buildContributors,
  buildContributorsFromCommits,
  rankContributors,
} from "./ranking";
import { parseRepoUrl } from "./repoUrl";

const noop = () => {};
const cancelled = () => new OperationCancelledError("Operação cancelada.");

/**
 * Com allBranches = true (padrão), percorre o histórico de TODAS as
 * branches via GraphQL, sem contar o mesmo commit duas vezes.
 *
 * Com allBranches = false, usa /stats/contributors (só a branch padrão):
 * 1. interpreta a URL;
 * 2. busca as estatísticas (com polling);
 * 3. monta e ordena o ranking;
 * 4. opcionalmente busca a data exata do último commit (em paralelo).
 */
export async function analyzeRepository(repoUrl, options = {}) {
  const { client = new GitHubClient(), onProgress = noop, signal } = options;
  const result = await analyzeRanking(repoUrl, { ...options, client });
  // Título do trabalho (primeira linha do README.md). Não é essencial: se
  // falhar, a análise continua sem ele.
  try {
    result.title = await client.fetchReadmeTitle(result.owner, result.repo, signal);
    onProgress(
      progressEvent(
        result.title
          ? `Título do trabalho (README.md): ${result.title}`
          : "README.md não encontrado: o trabalho fica identificado só pelo repositório.",
        result.title ? "info" : "warning"
      )
    );
  } catch (error) {
    if (signal?.aborted) throw cancelled();
    onProgress(progressEvent(`Não foi possível ler o README.md: ${error.message}`, "warning"));
  }
  return result;
}

async function analyzeRanking(
  repoUrl,
  {
    criterion = SortCriterion.COMMITS,
    fetchExactDates = true,
    allBranches = true,
    includeMerges = false,
    onProgress = noop,
    signal,
    client = new GitHubClient(),
  } = {}
) {
  const { owner, repo } = parseRepoUrl(repoUrl);

  // O token fica no servidor: aqui só perguntamos se ele foi configurado
  const { hasToken } = await client.fetchStatus(signal);

  if (allBranches) {
    if (!hasToken) {
      throw new ContributorStatsError(
        "A análise de todas as branches usa a API GraphQL do GitHub, que exige " +
          'um token. Configure o GITHUB_TOKEN no .env.local ou desative a opção "todas as branches".'
      );
    }
    return analyzeAllBranches(client, owner, repo, criterion, includeMerges, onProgress, signal);
  }

  if (!hasToken) {
    onProgress(
      progressEvent(
        "Nenhum token informado: apenas repositórios públicos poderão ser " +
          "analisados (limite de 60 requisições/hora).",
        "warning"
      )
    );
  }

  const raw = await client.fetchContributorsStats(owner, repo, { onProgress, signal });
  const contributors = buildContributors(raw);

  if (fetchExactDates && contributors.length) {
    const total = contributors.length;
    onProgress(progressEvent("Buscando a data do último commit…", "info", 0, total));

    // ignora autores desconhecidos
    const queue = contributors.filter((c) => c.profileUrl);
    let done = total - queue.length;

    // Até MAX_WORKERS requisições simultâneas (o ThreadPoolExecutor do Python)
    const worker = async () => {
      while (queue.length) {
        const contributor = queue.shift();
        let exact = null;
        try {
          exact = await client.fetchLastCommitDate(owner, repo, contributor.username, signal);
        } catch {
          exact = null; // falha pontual não interrompe a análise
        }
        if (signal?.aborted) throw cancelled();
        if (exact !== null) {
          contributor.lastCommit = exact;
          contributor.lastCommitIsEstimate = false;
        }
        done += 1;
        onProgress(
          progressEvent(
            `Último commit de ${contributor.username}: ${contributor.lastCommitDisplay}`,
            "info",
            done,
            total
          )
        );
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(CONFIG.MAX_WORKERS, queue.length) }, worker)
    );
  }

  const ranked = rankContributors(contributors, criterion);
  onProgress(progressEvent(`Ranking gerado com ${ranked.length} colaborador(es).`, "success"));
  return new AnalysisResult({ owner, repo, contributors: ranked, allBranches: false });
}

/**
 * Lê o histórico de cada branch (a padrão primeiro) e deduplica os commits:
 *
 * - pelo SHA: um commit presente em várias branches conta uma vez só;
 * - por "impressão digital" (autor + data de autoria + mensagem + linhas):
 *   commits copiados por rebase ou cherry-pick têm outro SHA, mas são o
 *   mesmo trabalho, então também contam uma vez só.
 *
 * Commits de merge são ignorados por padrão (as alterações já foram contadas
 * nos commits originais da branch).
 */
async function analyzeAllBranches(client, owner, repo, criterion, includeMerges, onProgress, signal) {
  onProgress(progressEvent(`Listando as branches de ${owner}/${repo}…`));
  const { defaultBranch, branches } = await client.fetchBranches(owner, repo, signal);
  if (!branches.length) {
    onProgress(progressEvent("O repositório não possui branches/commits.", "warning"));
    return new AnalysisResult({ owner, repo, allBranches: true, defaultBranch });
  }

  onProgress(
    progressEvent(
      `${branches.length} branch(es) encontrada(s). Branch padrão: ${defaultBranch}.`,
      "success"
    )
  );

  const seenOids = new Set();
  const seenFingerprints = new Set();
  const walkedTips = new Set();
  const commits = [];
  let skippedMerges = 0;
  let skippedCopies = 0;
  const total = branches.length;

  for (const [i, { name: branch, oid: tip }] of branches.entries()) {
    const index = i + 1;
    if (signal?.aborted) throw cancelled();
    const inDefault = branch === defaultBranch;
    if (walkedTips.has(tip) || seenOids.has(tip)) {
      // Branch sem nenhum commit próprio (aponta para um commit já lido)
      onProgress(progressEvent(`Branch ${branch}: sem commits novos.`, "info", index, total));
      continue;
    }
    walkedTips.add(tip);

    let newHere = 0;
    for await (const node of client.iterBranchHistory(owner, repo, tip, { signal })) {
      const oid = node.oid;
      if (seenOids.has(oid)) continue;
      seenOids.add(oid);
      const record = GitHubClient.toCommitRecord(node, branch, inDefault);
      if (record.isMerge && !includeMerges) {
        skippedMerges += 1;
        continue;
      }
      const fingerprint = JSON.stringify([
        record.authorKey,
        record.authoredDate,
        record.messageHeadline,
        record.additions,
        record.deletions,
      ]);
      if (seenFingerprints.has(fingerprint)) {
        skippedCopies += 1;
        continue;
      }
      seenFingerprints.add(fingerprint);
      commits.push(record);
      newHere += 1;
    }

    const label = inDefault ? "padrão" : "novos (fora da padrão)";
    onProgress(progressEvent(`Branch ${branch}: ${newHere} commit(s) ${label}.`, "info", index, total));
  }

  if (skippedMerges) onProgress(progressEvent(`${skippedMerges} commit(s) de merge ignorado(s).`));
  if (skippedCopies) {
    onProgress(
      progressEvent(`${skippedCopies} commit(s) duplicado(s) por rebase/cherry-pick ignorado(s).`)
    );
  }

  const contributors = buildContributorsFromCommits(commits);
  const ranked = rankContributors(contributors, criterion);
  const unmerged = commits.filter((c) => !c.inDefaultBranch).length;
  onProgress(
    progressEvent(
      `Ranking gerado com ${ranked.length} colaborador(es) · ${commits.length} commit(s) ` +
        `únicos em ${total} branch(es), ${unmerged} fora da ${defaultBranch}.`,
      "success"
    )
  );
  return new AnalysisResult({
    owner,
    repo,
    contributors: ranked,
    allBranches: true,
    defaultBranch,
    branchNames: branches.map((b) => b.name),
    includeMerges,
    commitRefs: commits.map((c) => ({ oid: c.oid, authorKey: c.authorKey, isMerge: c.isMerge })),
    commitRecords: commits,
  });
}

/* ===================================================================== */
/* Abas "Tipos de arquivo"                                               */
/* ===================================================================== */

// Erros que não adianta repetir commit a commit: interrompem a busca
const isFatal = (error) =>
  error?.code === "rate_limited" || [401, 403, 429].includes(error?.statusCode);

/**
 * Busca os arquivos alterados em cada commit de uma análise já feita, para as
 * abas "Tipos de arquivo" (por aluno e por grupo).
 *
 * - "todas as branches": usa os mesmos commits do ranking (já deduplicados);
 * - "branch padrão": lista os commits da branch padrão via REST.
 *
 * Commits de merge são sempre ignorados aqui: o diff de um merge repete as
 * alterações que já foram contadas nos commits originais.
 *
 * Cada commit custa 1 requisição. Se o limite da API for atingido no meio do
 * caminho, devolve o que já foi lido (partial = true).
 *
 * Retorna { commits: [{ oid, authorKey, files }], analyzed, candidates,
 *           skippedMerges, failed, truncatedCommits, limited, partial }
 */
export async function analyzeFileTypes(
  result,
  { onProgress = noop, signal, client = new GitHubClient(), maxCommits = CONFIG.FILE_TYPES_MAX_COMMITS } = {}
) {
  if (!result) throw new ContributorStatsError("Analise um repositório antes.");
  const { owner, repo } = result;

  let refs;
  if (result.commitRefs) {
    refs = result.commitRefs;
  } else {
    onProgress(progressEvent(`Listando os commits da branch padrão de ${owner}/${repo}…`));
    const list = await client.fetchCommitList(owner, repo, {
      signal,
      onPage: (n) => onProgress(progressEvent(`${n} commit(s) listado(s)…`)),
    });
    refs = list.map((c) => ({
      oid: c.sha,
      authorKey: c.login ? c.login.toLowerCase() : "(usuário desconhecido)",
      isMerge: c.isMerge,
    }));
  }

  const skippedMerges = refs.filter((r) => r.isMerge).length;
  let candidates = refs.filter((r) => !r.isMerge);
  const totalCandidates = candidates.length;
  const limited = totalCandidates > maxCommits;
  if (limited) {
    // A lista começa pelos mais recentes da branch padrão
    candidates = candidates.slice(0, maxCommits);
    onProgress(
      progressEvent(
        `O repositório tem ${totalCandidates} commits: só os ${maxCommits} primeiros serão ` +
          "analisados (FILE_TYPES_MAX_COMMITS).",
        "warning"
      )
    );
  }
  if (skippedMerges) {
    onProgress(progressEvent(`${skippedMerges} commit(s) de merge ignorado(s) na análise de arquivos.`));
  }

  const total = candidates.length;
  onProgress(
    progressEvent(`Buscando os arquivos alterados em ${total} commit(s)…`, "info", 0, total)
  );

  const commits = [];
  const queue = [...candidates];
  let done = 0;
  let failed = 0;
  let truncatedCommits = 0;
  let fatal = null;

  // Até MAX_WORKERS requisições simultâneas
  const worker = async () => {
    while (queue.length && !fatal) {
      const ref = queue.shift();
      try {
        const detail = await client.fetchCommitFiles(owner, repo, ref.oid, signal);
        commits.push({ oid: ref.oid, authorKey: ref.authorKey, files: detail.files });
        if (detail.truncated) truncatedCommits += 1;
      } catch (error) {
        if (error instanceof OperationCancelledError || signal?.aborted) throw cancelled();
        if (isFatal(error)) {
          fatal = error;
          return;
        }
        failed += 1; // falha pontual não interrompe a análise
        onProgress(progressEvent(`Commit ${ref.oid.slice(0, 7)}: ${error.message}`, "warning"));
      }
      done += 1;
      if (done % 10 === 0 || done === total) {
        onProgress(progressEvent(`Arquivos de ${done}/${total} commit(s) lidos…`, "info", done, total));
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONFIG.MAX_WORKERS, total) }, worker));
  if (signal?.aborted) throw cancelled();

  if (fatal) {
    if (!commits.length) throw fatal;
    onProgress(
      progressEvent(
        `${fatal.message} Resultado parcial: ${commits.length} de ${total} commit(s).`,
        "warning"
      )
    );
  }
  if (failed) onProgress(progressEvent(`${failed} commit(s) não puderam ser lidos.`, "warning"));
  if (truncatedCommits) {
    onProgress(
      progressEvent(
        `${truncatedCommits} commit(s) com mais de 3.000 arquivos foram contados parcialmente.`,
        "warning"
      )
    );
  }

  onProgress(
    progressEvent(`Tipos de arquivo calculados a partir de ${commits.length} commit(s).`, "success")
  );

  return {
    commits,
    analyzed: commits.length,
    candidates: totalCandidates,
    skippedMerges,
    failed,
    truncatedCommits,
    limited,
    partial: Boolean(fatal),
  };
}
