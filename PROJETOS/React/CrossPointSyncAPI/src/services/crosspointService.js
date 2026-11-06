// crosspointService.js
// Chamadas à API do crosspoint-sync com fetch (sem SDK).
//
// Autenticação (igual ao KOReader / KOSync):
//   x-auth-user: <usuário>
//   x-auth-key:  <MD5 hex da senha>
// Contrato completo: https://github.com/crosspoint-reader/crosspoint-sync/blob/main/docs/API.md
import CROSSPOINT_CONFIG from "../config/crosspointConfig";
import md5 from "../utils/md5";

const { ROUTES, TIMEOUT, PAGE_LIMIT, MAX_PAGES } = CROSSPOINT_CONFIG;

export class CrossPointError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "CrossPointError";
    this.status = status;
  }
}

/** Tira espaços e a barra final: "https://x.com/" -> "https://x.com" */
export function normalizarServidor(url) {
  let limpo = url.trim().replace(/\/+$/, "");
  if (limpo && !/^https?:\/\//i.test(limpo)) limpo = `https://${limpo}`;
  return limpo;
}

/** Monta a sessão a partir do formulário. A senha nunca é guardada: só o MD5. */
export function criarSessao({ servidor, usuario, senha }) {
  return {
    server: normalizarServidor(servidor),
    user: usuario.trim(),
    key: md5(senha),
  };
}

async function request(sessao, caminho, { signal } = {}) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(new DOMException("timeout", "TimeoutError")), TIMEOUT);
  const cancelar = () => controle.abort(signal.reason);
  signal?.addEventListener("abort", cancelar);

  let resposta;
  try {
    resposta = await fetch(`${sessao.server}${caminho}`, {
      headers: {
        "x-auth-user": sessao.user,
        "x-auth-key": sessao.key,
        Accept: "application/json",
      },
      signal: controle.signal,
    });
  } catch (erro) {
    if (signal?.aborted) throw erro;
    if (erro?.name === "TimeoutError" || controle.signal.reason?.name === "TimeoutError") {
      throw new CrossPointError("O servidor demorou demais para responder. Tente de novo.");
    }
    // fetch só falha assim quando não alcança o servidor (endereço errado, offline ou CORS bloqueado)
    throw new CrossPointError(
      `Não foi possível falar com ${sessao.server}. Confira o endereço e se o servidor libera CORS (CORS_ORIGINS).`
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancelar);
  }

  if (resposta.status === 401) {
    throw new CrossPointError("Usuário ou senha incorretos.", 401);
  }
  if (resposta.status === 429) {
    throw new CrossPointError("Muitas tentativas seguidas. Espere um minuto e tente de novo.", 429);
  }
  if (resposta.status === 404) {
    throw new CrossPointError(
      "Este servidor não tem a API estendida (/api/v1). Ele precisa ser um crosspoint-sync, não um kosync comum.",
      404
    );
  }
  if (!resposta.ok) {
    throw new CrossPointError(`O servidor respondeu com erro ${resposta.status}.`, resposta.status);
  }
  return resposta.json();
}

/** GET /users/auth: confere usuário e senha. */
export async function autenticar(sessao, opcoes) {
  const dados = await request(sessao, ROUTES.AUTH, opcoes);
  if (dados?.authorized !== "OK") throw new CrossPointError("Usuário ou senha incorretos.", 401);
  return true;
}

/**
 * GET /api/v1/progress: todos os livros sincronizados, do mais recente ao mais antigo.
 * Segue o cursor "next" até a última página.
 */
export async function listarLivros(sessao, opcoes) {
  const livros = [];
  let cursor = null;

  for (let pagina = 0; pagina < MAX_PAGES; pagina++) {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (cursor) params.set("cursor", cursor);
    const dados = await request(sessao, `${ROUTES.PROGRESS}?${params}`, opcoes);
    livros.push(...(dados.items ?? []));
    cursor = dados.next;
    if (!cursor) break;
  }
  return livros;
}

/** GET /api/v1/progress/{document}: a posição salva por cada aparelho. */
export async function listarAparelhos(sessao, documento, opcoes) {
  const dados = await request(sessao, ROUTES.DEVICES(documento), opcoes);
  return dados.devices ?? [];
}

/** GET /api/v1/stats/activity: páginas lidas, livros concluídos e dias de leitura. */
export async function buscarAtividade(sessao, opcoes) {
  const tz = new Date().getTimezoneOffset();
  return request(sessao, `${ROUTES.ACTIVITY}?tz=${tz}`, opcoes);
}
