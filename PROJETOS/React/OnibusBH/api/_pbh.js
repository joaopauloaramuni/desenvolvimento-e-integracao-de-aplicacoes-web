// _pbh.js
// Busca a posição dos ônibus no feed GTFS-Realtime da PBH, no SERVIDOR.
//
// Por que não chamar o feed direto do navegador?
//   • A URL do feed tem uma CHAVE de acesso (pegue a sua no Portal de Dados Abertos,
//     recurso "vehicle-positions" em https://dados.pbh.gov.br/dataset/gtfs-rt).
//     Se ela fosse para o navegador, qualquer visitante poderia ler e usar.
//   • O feed não libera CORS e vem em Protocol Buffers (binário), com os ~1.500
//     ônibus da cidade. Aqui o servidor decodifica, filtra só as linhas pedidas e
//     devolve um JSON pequeno.
//
// Quem atende a rota /api/pbh:
//   • em produção, a Vercel Function api/pbh.js
//   • no npm run dev / npm run preview, o vite.config.js
//
// Variável de ambiente (SEM o prefixo VITE_, de propósito):
//   PBH_GTFS_RT_URL → URL completa do recurso "vehicle-positions", com a chave
//
// O nome do arquivo começa com "_" para a Vercel NÃO transformá-lo em rota.

import { decodificarFeed } from "./_gtfsrt.js";

export const PBH_PATH = "/api/pbh";

const TIMEOUT_MS = 15_000;
// O feed gera uma foto nova a cada ~20 s: guardamos a última por 15 s para que
// vários visitantes ao mesmo tempo não multipliquem as chamadas à PBH
const CACHE_MS = 15_000;
const MAX_ROTAS = 12;
const ROTA_RE = /^[A-Za-z0-9_.:-]{1,64}$/;

let cache = { em: 0, url: null, feed: null };
let emAndamento = null;

function send(res, status, body, cacheControl = "no-store") {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl);
  res.end(JSON.stringify(body));
}

class PbhError extends Error {
  constructor(message, statusCode = 502, codigo = "pbh_error") {
    super(message);
    this.statusCode = statusCode;
    this.codigo = codigo;
  }
}

async function baixarFeed(url) {
  let resposta;
  try {
    resposta = await fetch(url, {
      headers: { "User-Agent": "OnibusBH-React (projeto didatico PUC Minas)" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new PbhError("O feed de tempo real da PBH demorou demais para responder.", 504, "timeout");
    }
    throw new PbhError(`Falha de conexão com o feed da PBH: ${error?.message ?? error}`);
  }

  if (resposta.status === 401 || resposta.status === 403) {
    throw new PbhError(
      "A PBH recusou o acesso (chave inválida ou trocada). Pegue a URL atual do recurso " +
        '"vehicle-positions" em dados.pbh.gov.br/dataset/gtfs-rt e atualize o PBH_GTFS_RT_URL.',
      502,
      "chave_invalida"
    );
  }
  if (!resposta.ok) throw new PbhError(`O feed da PBH respondeu HTTP ${resposta.status}.`);

  const tipo = resposta.headers.get("Content-Type") ?? "";
  if (tipo.includes("html")) {
    throw new PbhError("O feed da PBH devolveu uma página HTML em vez dos dados (manutenção?).");
  }

  const bytes = new Uint8Array(await resposta.arrayBuffer());
  try {
    return decodificarFeed(bytes);
  } catch (error) {
    throw new PbhError(`Não foi possível ler o feed GTFS-Realtime: ${error.message}`);
  }
}

// Mesma foto do feed para todo mundo durante 15 s (e uma só chamada por vez)
async function feedAtual(url) {
  if (cache.feed && cache.url === url && Date.now() - cache.em < CACHE_MS) return cache.feed;
  if (!emAndamento) {
    emAndamento = baixarFeed(url)
      .then((feed) => {
        cache = { em: Date.now(), url, feed };
        return feed;
      })
      .finally(() => {
        emAndamento = null;
      });
  }
  return emAndamento;
}

// Só o que o mapa precisa, com coordenadas arredondadas (~1 m)
const arred = (n, casas = 5) => (Number.isFinite(n) ? Math.round(n * 10 ** casas) / 10 ** casas : null);

function resumir(v) {
  return {
    id: v.veiculo.id ?? v.entidade,
    rotulo: v.veiculo.rotulo ?? v.veiculo.id ?? null,
    rota: v.viagem.routeId ?? null,
    viagem: v.viagem.tripId ?? null,
    sentido: v.viagem.directionId ?? null,
    lon: arred(v.posicao.lon),
    lat: arred(v.posicao.lat),
    rumo: arred(v.posicao.rumo, 0),
    // O GTFS-RT manda a velocidade em m/s
    kmh: Number.isFinite(v.posicao.velocidade) ? Math.round(v.posicao.velocidade * 3.6) : null,
    timestamp: v.timestamp,
  };
}

/* =====================================================================
   Handler: GET /api/pbh?recurso=status
            GET /api/pbh?recurso=onibus&rotas=ID1,ID2
   ===================================================================== */

export async function handlePbh(req, res, env = {}) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "method_not_allowed", message: "Use GET." });
  }

  const url = new URL(req.url, "http://localhost");
  const recurso = url.searchParams.get("recurso");
  const feedUrl = String(env.PBH_GTFS_RT_URL ?? "").trim();

  // O navegador pergunta se o tempo real está configurado (sem nunca receber a chave)
  if (recurso === "status") return send(res, 200, { tempoReal: Boolean(feedUrl) });

  if (recurso !== "onibus") {
    return send(res, 400, { error: "bad_request", message: "recurso deve ser: status ou onibus." });
  }

  const rotas = String(url.searchParams.get("rotas") ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  if (!rotas.length || rotas.length > MAX_ROTAS || !rotas.every((r) => ROTA_RE.test(r))) {
    return send(res, 400, { error: "bad_request", message: `Informe de 1 a ${MAX_ROTAS} linhas válidas em "rotas".` });
  }

  if (!feedUrl) {
    return send(res, 503, {
      error: "sem_url",
      message: "Tempo real desligado: configure o PBH_GTFS_RT_URL (veja o README).",
    });
  }

  try {
    const feed = await feedAtual(feedUrl);
    const procuradas = new Set(rotas);
    const veiculos = feed.veiculos.filter((v) => procuradas.has(v.viagem.routeId)).map(resumir);
    return send(
      res,
      200,
      { atualizadoEm: feed.timestamp, totalNaCidade: feed.veiculos.length, veiculos },
      "public, max-age=0, s-maxage=15, stale-while-revalidate=15"
    );
  } catch (error) {
    if (error instanceof PbhError) {
      return send(res, error.statusCode, { error: error.codigo, message: error.message });
    }
    console.error("PBH:", error?.message ?? error);
    return send(res, 500, { error: "internal_error", message: `Erro inesperado: ${error?.message ?? error}` });
  }
}
