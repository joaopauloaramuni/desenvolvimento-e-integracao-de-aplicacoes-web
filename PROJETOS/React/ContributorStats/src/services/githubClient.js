// Cliente da API do GitHub usado pela regra de negócio (equivalente ao
// core/github_client.py do Python).
//
// O navegador não fala direto com a api.github.com: cada método chama a rota
// /api/github do próprio site, e é o servidor (api/_github.js) que usa o token.
import CONFIG from "../config/contributorStatsConfig";
import {
  ContributorStatsError,
  GitHubAPIError,
  OperationCancelledError,
  StatsNotReadyError,
} from "../core/exceptions";
import { progressEvent } from "../core/models";
import { compareLower } from "../core/ranking";

const noop = () => {};

const cancelled = () => new OperationCancelledError("Operação cancelada.");

/** Espera `seconds` segundos, mas termina na hora se o usuário cancelar. */
function wait(seconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(cancelled());
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, seconds * 1000);
    function onAbort() {
      clearTimeout(timer);
      reject(cancelled());
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function rateLimitMessage(body) {
  let msg = body.message;
  if (body.resetAt) {
    const time = new Date(body.resetAt * 1000).toLocaleTimeString("pt-BR");
    msg += ` O limite será renovado às ${time}.`;
  }
  return `${msg} Usar um token aumenta o limite de 60 para 5.000 requisições/hora.`;
}

export class GitHubClient {
  constructor({ apiPath = CONFIG.API_PATH } = {}) {
    this.apiPath = apiPath;
    // Tamanho da página do histórico; é reduzido (e reaproveitado) após timeouts
    this.historyPageSize = CONFIG.GRAPHQL_PAGE_SIZE;
  }

  /* ------------------------------------------------------------------ */
  /* Infraestrutura                                                      */
  /* ------------------------------------------------------------------ */

  async request(resource, params = {}, signal) {
    if (signal?.aborted) throw cancelled();
    const query = new URLSearchParams({ resource });
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") query.set(k, v);
    });

    let response;
    try {
      response = await fetch(`${this.apiPath}?${query}`, { signal });
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError") throw cancelled();
      throw new GitHubAPIError("Sem conexão com o servidor.");
    }

    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (!isJson) {
      // Função da Vercel estourou o tempo (504) ou gateway falhou
      if ([502, 503, 504].includes(response.status)) {
        throw new GitHubAPIError(
          "Tempo limite excedido ao acessar a API do GitHub.",
          response.status
        );
      }
      // Sem a função (ex.: site estático sem /api), a rota devolve o index.html
      throw new ContributorStatsError(
        "A rota /api/github não existe aqui. Rode com npm run dev ou publique na Vercel."
      );
    }

    const body = await response.json();
    if (!response.ok) {
      const message = body.error === "rate_limited" ? rateLimitMessage(body) : body.message;
      const error = new GitHubAPIError(message ?? `HTTP ${response.status}`, body.statusCode ?? null);
      error.code = body.error ?? null; // ex.: "rate_limited", "token_required"
      throw error;
    }
    return body;
  }

  /** O servidor tem GITHUB_TOKEN configurado? (o token em si nunca vem para cá) */
  async fetchStatus(signal) {
    return this.request("status", {}, signal);
  }

  /* ------------------------------------------------------------------ */
  /* Somente a branch padrão (REST)                                      */
  /* ------------------------------------------------------------------ */

  /**
   * GET /repos/{owner}/{repo}/stats/contributors
   *
   * A API responde 202 Accepted enquanto calcula as estatísticas;
   * nesse caso é feito polling até maxTries vezes.
   */
  async fetchContributorsStats(
    owner,
    repo,
    { maxTries = CONFIG.MAX_TRIES, waitTime = CONFIG.WAIT_TIME, onProgress = noop, signal } = {}
  ) {
    for (let attempt = 1; attempt <= maxTries; attempt += 1) {
      if (signal?.aborted) throw cancelled();

      onProgress(
        progressEvent(`Buscando estatísticas (tentativa ${attempt}/${maxTries}) de ${owner}/${repo}…`)
      );
      const { state, data } = await this.request("stats", { owner, repo }, signal);

      if (state === "ready") {
        onProgress(progressEvent("Estatísticas recebidas com sucesso.", "success"));
        return data ?? [];
      }

      if (state === "empty") {
        // repositório vazio
        onProgress(progressEvent("O repositório não possui commits.", "warning"));
        return [];
      }

      // state === "computing" (HTTP 202)
      if (attempt === maxTries) break;
      onProgress(
        progressEvent(
          `O GitHub está calculando as estatísticas. Aguardando ${waitTime} s…`,
          "warning"
        )
      );
      // espera cancelável
      await wait(waitTime, signal);
    }

    throw new StatsNotReadyError(
      "O GitHub ainda está processando as estatísticas e o tempo limite foi " +
        "atingido. Tente novamente em alguns instantes."
    );
  }

  /**
   * Data ("AAAA-MM-DD") do commit mais recente de `username` no branch padrão.
   * Retorna null se não for possível determinar (ex.: contas bot).
   */
  async fetchLastCommitDate(owner, repo, username, signal) {
    const { date } = await this.request("last-commit", { owner, repo, author: username }, signal);
    return date ?? null;
  }

  /* ------------------------------------------------------------------ */
  /* Tipos de arquivo (REST)                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Lista os commits da branch padrão: [{ sha, login, isMerge }].
   * Usado nas abas "Tipos de arquivo" quando a análise foi só da branch padrão.
   */
  async fetchCommitList(owner, repo, { signal, onPage = noop } = {}) {
    const commits = [];
    for (let page = 1; ; page += 1) {
      const data = await this.request("commits", { owner, repo, page }, signal);
      commits.push(...data.commits);
      onPage(commits.length);
      if (!data.hasNextPage) break;
    }
    return commits;
  }

  /**
   * Título do trabalho: a primeira linha com texto do README.md do repositório
   * (ex.: "# Sistema de Reservas" -> "Sistema de Reservas"). null se não houver README.
   */
  async fetchReadmeTitle(owner, repo, signal) {
    const { title } = await this.request("readme", { owner, repo }, signal);
    return title ?? null;
  }

  /** Arquivos alterados por um commit: { sha, files: [[caminho, ins, del]], truncated }. */
  async fetchCommitFiles(owner, repo, oid, signal) {
    return this.request("commit", { owner, repo, oid }, signal);
  }

  /* ------------------------------------------------------------------ */
  /* Todas as branches (GraphQL)                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Lista as branches do repositório.
   * Retorna { defaultBranch, branches: [{ name, oid }] } com a branch padrão
   * sempre em primeiro lugar.
   */
  async fetchBranches(owner, repo, signal) {
    const branches = [];
    let defaultName = null;
    let cursor = null;
    for (;;) {
      const page = await this.request("branches", { owner, repo, cursor }, signal);
      defaultName = page.defaultBranch || defaultName;
      branches.push(...page.branches);
      if (!page.hasNextPage) break;
      cursor = page.endCursor;
    }

    branches.sort((a, b) => {
      const aNotDefault = a.name !== defaultName ? 1 : 0;
      const bNotDefault = b.name !== defaultName ? 1 : 0;
      return aNotDefault - bNotDefault || compareLower(a.name, b.name);
    });
    return { defaultBranch: defaultName, branches };
  }

  /**
   * Percorre todo o histórico a partir de `tipOid` (página a página) e
   * devolve os nós de commit do GraphQL. Em caso de timeout/502 (commits muito
   * grandes), reduz o tamanho da página e tenta de novo.
   */
  async *iterBranchHistory(owner, repo, tipOid, { signal, pageSize } = {}) {
    let cursor = null;
    // Reaproveita o tamanho reduzido entre branches, se já houve timeout
    let n = pageSize || this.historyPageSize;
    for (;;) {
      if (signal?.aborted) throw cancelled();
      let page;
      try {
        page = await this.request("history", { owner, repo, oid: tipOid, cursor, n }, signal);
      } catch (error) {
        if (
          error instanceof GitHubAPIError &&
          ([502, 503, 504].includes(error.statusCode) ||
            error.message.toLowerCase().includes("timeout")) &&
          n > 10
        ) {
          n = this.historyPageSize = Math.max(10, Math.floor(n / 2));
          continue;
        }
        throw error;
      }
      const history = page.history;
      if (!history) return;
      yield* history.nodes;
      if (!history.hasNextPage) return;
      cursor = history.endCursor;
    }
  }

  /** Converte um nó de commit do GraphQL em CommitRecord. */
  static toCommitRecord(node, branch, inDefault) {
    const author = node.author ?? {};
    const user = author.user ?? {};
    const name = author.name || "";
    const email = (author.email || "").toLowerCase();
    const login = user.login;

    let key;
    let display;
    let url;
    if (login) {
      key = login.toLowerCase();
      display = login;
      url = user.url || `https://github.com/${login}`;
    } else if (name.endsWith("[bot]")) {
      // Contas bot não são "User" no GraphQL
      key = name.toLowerCase();
      display = name;
      url = `https://github.com/apps/${name.slice(0, -5)}`;
    } else {
      // E-mail não vinculado a nenhuma conta do GitHub
      key = email || name.toLowerCase() || "(usuário desconhecido)";
      display = email
        ? `${name || "desconhecido"} <${email}>`
        : name || "(usuário desconhecido)";
      url = "";
    }

    return {
      oid: node.oid,
      authorKey: key,
      authorName: display,
      profileUrl: url,
      additions: Number(node.additions || 0),
      deletions: Number(node.deletions || 0),
      authoredDate: node.authoredDate || "",
      committedDate: node.committedDate || "",
      messageHeadline: node.messageHeadline || "",
      isMerge: (node.parents?.totalCount || 0) > 1,
      branch,
      inDefaultBranch: inDefault,
    };
  }
}
