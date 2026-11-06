// Fala com a API do GitHub no SERVIDOR, usando o GITHUB_TOKEN.
//
// Por que não chamar a api.github.com direto do navegador?
//   • A análise de TODAS as branches usa a API GraphQL, que exige token.
//   • Repositórios privados também exigem token.
//   • O token NÃO pode ir para o navegador: qualquer visitante conseguiria ler e usar.
// Então o navegador chama /api/github no próprio site, e quem fala com o GitHub
// (com o token) é:
//   • em produção, a Vercel Function api/github.js
//   • no npm run dev / npm run preview, o vite.config.js
//
// A regra de negócio (polling do 202, deduplicação de commits, ranking...) roda
// no navegador, em src/core. Aqui ficam só as chamadas ao GitHub, e a rota aceita
// apenas os recursos abaixo, com parâmetros validados: ela não vira uma
// "porta aberta" para gastar o token com qualquer consulta.
//
// Variáveis de ambiente (SEM o prefixo VITE_, de propósito):
//   GITHUB_TOKEN          → PAT do GitHub (obrigatório para "todas as branches" e privados)
//   GITHUB_ALLOWED_OWNERS → opcional: donos permitidos, separados por vírgula
//
// O nome do arquivo começa com "_" para a Vercel NÃO transformá-lo em rota.

export const GITHUB_PATH = "/api/github";

const API = "https://api.github.com";
const GRAPHQL_URL = "https://api.github.com/graphql";
const API_VERSION = "2022-11-28";
const TIMEOUT_MS = 30_000; // tempo máximo de cada requisição ao GitHub

// Nomes válidos de usuário/organização e de repositório no GitHub
const NAME_RE = /^[A-Za-z0-9_.-]+$/;
// Login de autor (contas bot têm "[bot]" no fim, ex.: github-classroom[bot])
const AUTHOR_RE = /^[A-Za-z0-9_.-]+(\[bot\])?$/;
const OID_RE = /^[0-9a-f]{40}$/i;

const RESOURCES = [
  "status",
  "stats",
  "last-commit",
  "branches",
  "history",
  "commits",
  "commit",
  "readme",
];

// Detalhe de um commit: arquivos por página (máx. 300) e nº máximo de páginas.
// O GitHub devolve no máximo 3.000 arquivos por commit.
const FILES_PER_PAGE = 300;
const MAX_FILE_PAGES = 10;

/* =====================================================================
   Consultas GraphQL (as mesmas do projeto Python)
   ===================================================================== */

const BRANCHES_QUERY = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    defaultBranchRef { name target { oid } }
    refs(refPrefix: "refs/heads/", first: 100, after: $cursor) {
      totalCount
      pageInfo { hasNextPage endCursor }
      nodes { name target { oid } }
    }
  }
}`;

const HISTORY_QUERY = `
query($owner: String!, $name: String!, $oid: GitObjectID!, $cursor: String, $n: Int!) {
  repository(owner: $owner, name: $name) {
    object(oid: $oid) {
      ... on Commit {
        history(first: $n, after: $cursor) {
          totalCount
          pageInfo { hasNextPage endCursor }
          nodes {
            oid
            additions
            deletions
            authoredDate
            committedDate
            messageHeadline
            parents { totalCount }
            author { name email user { login url } }
          }
        }
      }
    }
  }
}`;

/* =====================================================================
   Resposta HTTP (funciona igual na Vercel e no servidor do Vite)
   ===================================================================== */

function send(res, status, body, cache = "no-store") {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
}

// Erro com o status "semântico" do GitHub (igual ao GitHubAPIError do Python).
// statusCode pode ser null (ex.: erro genérico do GraphQL).
class GitHubAPIError extends Error {
  constructor(message, statusCode = null, extra = {}) {
    super(message);
    this.statusCode = statusCode;
    this.extra = extra;
  }
}

const NOT_FOUND_MSG =
  "Repositório não encontrado (404). Verifique a URL ou, se o " +
  "repositório for privado, se o token tem o escopo 'repo'.";

/* =====================================================================
   Chamadas ao GitHub
   ===================================================================== */

function githubHeaders(token, accept = "application/vnd.github+json") {
  const headers = {
    Accept: accept,
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "GitHubAPI-ContributorStats",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

const isTimeout = (error) => error?.name === "TimeoutError" || error?.name === "AbortError";

async function restGet(path, params, token, accept) {
  const url = new URL(`${API}${path}`);
  Object.entries(params ?? {}).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    return await fetch(url, {
      headers: githubHeaders(token, accept),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (isTimeout(error)) {
      throw new GitHubAPIError("Tempo limite excedido ao acessar a API do GitHub.");
    }
    throw new GitHubAPIError(`Falha de conexão com a API do GitHub: ${error?.message ?? error}`);
  }
}

// Monta uma mensagem de erro amigável a partir da resposta HTTP
async function errorFromResponse(response) {
  let apiMessage = "";
  try {
    apiMessage = (await response.clone().json())?.message ?? "";
  } catch {
    apiMessage = (await response.text()).slice(0, 200);
  }

  const status = response.status;
  const remaining = response.headers.get("X-RateLimit-Remaining");

  if ((status === 403 || status === 429) && remaining === "0") {
    // O horário de renovação é formatado no navegador (fuso de quem usa)
    const reset = Number(response.headers.get("X-RateLimit-Reset")) || null;
    return new GitHubAPIError("Limite de requisições da API do GitHub atingido.", status, {
      error: "rate_limited",
      resetAt: reset,
    });
  }
  if (status === 401) {
    return new GitHubAPIError("Token inválido ou expirado (401). Gere um novo PAT no GitHub.", 401);
  }
  if (status === 404) return new GitHubAPIError(NOT_FOUND_MSG, 404);
  if (status === 403) return new GitHubAPIError(`Acesso negado (403). ${apiMessage}`.trim(), 403);
  return new GitHubAPIError(`Erro ${status} da API do GitHub. ${apiMessage}`.trim(), status);
}

// POST /graphql — devolve `data` ou lança GitHubAPIError
async function graphql(query, variables, token) {
  let response;
  try {
    response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { ...githubHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (isTimeout(error)) {
      throw new GitHubAPIError("Tempo limite excedido ao acessar a API GraphQL do GitHub.", 504);
    }
    throw new GitHubAPIError(`Falha de conexão com a API do GitHub: ${error?.message ?? error}`);
  }

  if (response.status !== 200) throw await errorFromResponse(response);

  const payload = await response.json();
  const errors = payload.errors ?? [];
  if (errors.length) {
    const types = new Set(errors.map((e) => e.type));
    if (types.has("RATE_LIMITED")) {
      throw new GitHubAPIError(
        "Limite de requisições da API GraphQL do GitHub atingido. Tente novamente mais tarde.",
        403
      );
    }
    if (types.has("NOT_FOUND")) throw new GitHubAPIError(NOT_FOUND_MSG, 404);
    const msg = errors
      .slice(0, 3)
      .map((e) => e.message ?? "erro desconhecido")
      .join("; ");
    throw new GitHubAPIError(`Erro da API GraphQL do GitHub: ${msg}`);
  }
  return payload.data ?? {};
}

/* =====================================================================
   Recursos
   ===================================================================== */

// GET /repos/{owner}/{repo}/stats/contributors (uma tentativa; o polling é no navegador)
async function getStats({ owner, repo }, token) {
  const response = await restGet(`/repos/${owner}/${repo}/stats/contributors`, null, token);
  if (response.status === 200) {
    const data = (await response.json()) ?? [];
    return {
      state: "ready",
      data: data.map((item) => ({
        author: item.author ? { login: item.author.login, html_url: item.author.html_url } : null,
        total: item.total,
        weeks: (item.weeks ?? []).map(({ w, a, d, c }) => ({ w, a, d, c })),
      })),
    };
  }
  if (response.status === 204) return { state: "empty", data: [] }; // repositório vazio
  if (response.status === 202) return { state: "computing", data: null }; // calculando
  throw await errorFromResponse(response);
}

// Data (UTC, AAAA-MM-DD) do commit mais recente do autor na branch padrão, ou null
async function getLastCommit({ owner, repo, author }, token) {
  const response = await restGet(
    `/repos/${owner}/${repo}/commits`,
    { author, per_page: 1 },
    token
  );
  if (response.status !== 200) return { date: null };
  const commits = await response.json();
  if (!commits?.length) return { date: null };
  const commit = commits[0].commit ?? {};
  const dateStr = commit.committer?.date || commit.author?.date;
  if (!dateStr) return { date: null };
  return { date: new Date(dateStr).toISOString().slice(0, 10) };
}

// Uma página da lista de branches
async function getBranches({ owner, repo, cursor }, token) {
  const data = await graphql(BRANCHES_QUERY, { owner, name: repo, cursor: cursor || null }, token);
  const repository = data.repository;
  if (!repository) throw new GitHubAPIError("Repositório não encontrado (404).", 404);
  const refs = repository.refs;
  return {
    defaultBranch: repository.defaultBranchRef?.name ?? null,
    totalCount: refs.totalCount,
    hasNextPage: refs.pageInfo.hasNextPage,
    endCursor: refs.pageInfo.endCursor,
    branches: refs.nodes
      .filter((node) => node.target?.oid)
      .map((node) => ({ name: node.name, oid: node.target.oid })),
  };
}

// Uma página do histórico a partir de um commit
async function getHistory({ owner, repo, oid, cursor, n }, token) {
  const data = await graphql(
    HISTORY_QUERY,
    { owner, name: repo, oid, cursor: cursor || null, n },
    token
  );
  const history = data.repository?.object?.history;
  if (!history) return { history: null };
  return {
    history: {
      totalCount: history.totalCount,
      hasNextPage: history.pageInfo.hasNextPage,
      endCursor: history.pageInfo.endCursor,
      nodes: history.nodes,
    },
  };
}

// Uma página (100) da lista de commits da branch padrão (REST, aceita acesso anônimo).
// Usado pelas abas "Tipos de arquivo" quando a análise foi só da branch padrão.
async function getCommits({ owner, repo, page }, token) {
  const response = await restGet(
    `/repos/${owner}/${repo}/commits`,
    { per_page: 100, page },
    token
  );
  if (response.status === 409) return { hasNextPage: false, commits: [] }; // repositório vazio
  if (response.status !== 200) throw await errorFromResponse(response);
  const data = (await response.json()) ?? [];
  return {
    hasNextPage: data.length === 100,
    commits: data.map((c) => ({
      sha: c.sha,
      login: c.author?.login ?? null,
      isMerge: (c.parents?.length ?? 0) > 1,
    })),
  };
}

// Arquivos alterados por um commit: [[caminho, inseridas, deletadas], ...]
// (formato compacto, para a resposta ficar pequena)
async function getCommit({ owner, repo, oid }, token) {
  const files = [];
  let truncated = false;
  for (let page = 1; page <= MAX_FILE_PAGES; page += 1) {
    const response = await restGet(
      `/repos/${owner}/${repo}/commits/${oid}`,
      { per_page: FILES_PER_PAGE, page },
      token
    );
    if (response.status !== 200) throw await errorFromResponse(response);
    const data = await response.json();
    const pageFiles = data.files ?? [];
    for (const f of pageFiles) {
      files.push([f.filename, Number(f.additions || 0), Number(f.deletions || 0)]);
    }
    if (pageFiles.length < FILES_PER_PAGE) break;
    if (page === MAX_FILE_PAGES) truncated = true;
  }
  return { sha: oid, files, truncated };
}

// Título do trabalho: a primeira linha com texto do README.md do repositório.
// Só o título sai do servidor (não o README inteiro).
const TITLE_MAX = 200;

/** "# 🏆 Projeto <b>X</b> [![badge](...)](...)" -> "🏆 Projeto X" */
export function readmeTitle(markdown) {
  for (const raw of String(markdown ?? "").split(/\r?\n/)) {
    const line = raw
      .replace(/<!--.*?-->/g, "") // comentários HTML
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // imagens e badges
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> texto
      .replace(/<[^>]+>/g, "") // tags HTML (<h1 align="center">...)
      .replace(/^\s{0,3}#{1,6}\s*/, "") // "# Título"
      .replace(/\s+#+\s*$/, "") // "# Título #"
      .replace(/(\*\*|__|`)/g, "") // negrito e código
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Linhas só com "===" / "---" (sublinhado do Markdown) não são título
    if (line && !/^[=\-*_\s]+$/.test(line)) return line.slice(0, TITLE_MAX);
  }
  return null;
}

// GET /repos/{owner}/{repo}/readme (conteúdo bruto) -> { title }
async function getReadme({ owner, repo }, token) {
  const response = await restGet(
    `/repos/${owner}/${repo}/readme`,
    null,
    token,
    "application/vnd.github.raw+json"
  );
  if (response.status === 404) return { title: null }; // repositório sem README
  if (response.status !== 200) throw await errorFromResponse(response);
  return { title: readmeTitle(await response.text()) };
}

/* =====================================================================
   Validação dos parâmetros
   ===================================================================== */

function badRequest(message) {
  return { status: 400, body: { error: "bad_request", message } };
}

function readParams(resource, searchParams, allowedOwners) {
  const get = (name) => String(searchParams.get(name) ?? "").trim();
  if (resource === "status") return { params: {} };

  const owner = get("owner");
  const repo = get("repo");
  if (!NAME_RE.test(owner) || !NAME_RE.test(repo) || owner.length > 100 || repo.length > 100) {
    return badRequest(`Nome de repositório inválido: ${owner}/${repo}`);
  }
  if (allowedOwners.length && !allowedOwners.includes(owner.toLowerCase())) {
    return {
      status: 403,
      body: {
        error: "forbidden_owner",
        message: `Este servidor não permite analisar repositórios de '${owner}' (GITHUB_ALLOWED_OWNERS).`,
        statusCode: 403,
      },
    };
  }
  const params = { owner, repo };

  if (resource === "last-commit") {
    params.author = get("author");
    if (!AUTHOR_RE.test(params.author) || params.author.length > 100) {
      return badRequest("Autor inválido.");
    }
  }
  if (resource === "branches" || resource === "history") {
    params.cursor = get("cursor");
    if (params.cursor.length > 200) return badRequest("Cursor inválido.");
  }
  if (resource === "commits") {
    params.page = Number(get("page") || 1);
    if (!Number.isInteger(params.page) || params.page < 1 || params.page > 1000) {
      return badRequest("page deve ser um inteiro entre 1 e 1000.");
    }
  }
  if (resource === "commit") {
    params.oid = get("oid");
    if (!OID_RE.test(params.oid)) return badRequest("Commit (oid) inválido.");
  }
  if (resource === "history") {
    params.oid = get("oid");
    params.n = Number(get("n") || 100);
    if (!OID_RE.test(params.oid)) return badRequest("Commit (oid) inválido.");
    if (!Number.isInteger(params.n) || params.n < 1 || params.n > 100) {
      return badRequest("n deve ser um inteiro entre 1 e 100.");
    }
  }
  return { params };
}

/* =====================================================================
   Handler: GET /api/github?resource=...&owner=...&repo=...
   ===================================================================== */

const HANDLERS = {
  stats: getStats,
  "last-commit": getLastCommit,
  branches: getBranches,
  history: getHistory,
  commits: getCommits,
  commit: getCommit,
  readme: getReadme,
};

// O histórico a partir de um commit (oid) e o detalhe de um commit nunca mudam:
// podem ficar no cache da CDN
const CACHE_HISTORY = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

export async function handleGitHub(req, res, env = {}) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "method_not_allowed", message: "Use GET." });
  }

  const url = new URL(req.url, "http://localhost");
  const resource = url.searchParams.get("resource");
  if (!RESOURCES.includes(resource)) {
    return send(res, 400, {
      error: "bad_request",
      message: `resource deve ser: ${RESOURCES.join(", ")}.`,
    });
  }

  const token = String(env.GITHUB_TOKEN ?? "").trim();
  const allowedOwners = String(env.GITHUB_ALLOWED_OWNERS ?? "")
    .split(",")
    .map((o) => o.trim().toLowerCase())
    .filter(Boolean);

  // O navegador pergunta se há token (sem nunca recebê-lo)
  if (resource === "status") {
    return send(res, 200, { hasToken: Boolean(token), restrictedOwners: allowedOwners.length > 0 });
  }

  const parsed = readParams(resource, url.searchParams, allowedOwners);
  if (!parsed.params) return send(res, parsed.status, parsed.body);

  // GraphQL não aceita acesso anônimo
  if ((resource === "branches" || resource === "history") && !token) {
    return send(res, 401, {
      error: "token_required",
      message:
        "A análise de todas as branches usa a API GraphQL do GitHub, que exige um token. " +
        'Configure o GITHUB_TOKEN no .env.local ou desative a opção "todas as branches".',
      statusCode: 401,
    });
  }

  try {
    const data = await HANDLERS[resource](parsed.params, token);
    // O conteúdo de um commit (oid) nunca muda, assim como o histórico a partir dele
    const cache = resource === "history" || resource === "commit" ? CACHE_HISTORY : "no-store";
    return send(res, 200, data, cache);
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      return send(res, error.statusCode ?? 502, {
        error: error.extra.error ?? "github_error",
        message: error.message,
        statusCode: error.statusCode,
        ...(error.extra.resetAt ? { resetAt: error.extra.resetAt } : {}),
      });
    }
    console.error("GitHub:", error?.message ?? error);
    return send(res, 500, {
      error: "internal_error",
      message: `Erro inesperado: ${error?.message ?? error}`,
      statusCode: null,
    });
  }
}
