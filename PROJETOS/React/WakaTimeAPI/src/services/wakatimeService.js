import WAKATIME_CONFIG from "../config/wakatimeConfig";

// Erro com o código que o servidor mandou (ver api/_wakatime.js):
//   missing_config | invalid_token | forbidden | not_found | pending | timeout ...
export class WakaTimeError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// Guarda cada período já buscado: trocar 7 dias → 30 dias → 7 dias não repete a chamada
const cache = new Map();

export async function fetchWakaTimeStats(range = WAKATIME_CONFIG.DEFAULT_RANGE) {
  if (cache.has(range)) return cache.get(range);

  let response;
  try {
    response = await fetch(`${WAKATIME_CONFIG.API_PATH}?range=${range}`);
  } catch {
    throw new WakaTimeError("network", "Sem conexão com o servidor.");
  }

  // Sem a função (ex.: site estático sem /api), a rota devolve o index.html
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (!isJson) {
    throw new WakaTimeError(
      "no_api",
      "A rota /api/wakatime não existe aqui. Rode com npm run dev ou publique na Vercel."
    );
  }

  const body = await response.json();

  if (response.status === 202 || body.error === "pending") {
    throw new WakaTimeError("pending", body.message);
  }
  if (!response.ok) {
    throw new WakaTimeError(body.error ?? "error", body.message ?? `HTTP ${response.status}`);
  }

  cache.set(range, body);
  return body;
}

/* =====================================================================
   "Codando agora" (GET /api/codando, ver api/_codando.js)
   Sem cache permanente: o componente pergunta de novo a cada minuto.
   ===================================================================== */

let codingNowRequest = null;

// Resultado: { status: "ok", data } | { status: "unavailable" } (sem token,
// modo perfil público ou site sem /api) | { status: "error" }
export function fetchCodingNow() {
  // Duas partes da tela pedindo junto: uma chamada só
  if (codingNowRequest) return codingNowRequest;

  codingNowRequest = (async () => {
    try {
      const response = await fetch(WAKATIME_CONFIG.CODING_NOW.API_PATH, {
        headers: { Accept: "application/json" },
      });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      if (!isJson || response.status === 503) return { status: "unavailable" };
      if (!response.ok) return { status: "error" };

      const data = await response.json();
      return typeof data?.active === "boolean" ? { status: "ok", data } : { status: "error" };
    } catch {
      return { status: "error" }; // rede fora
    } finally {
      codingNowRequest = null;
    }
  })();

  return codingNowRequest;
}
