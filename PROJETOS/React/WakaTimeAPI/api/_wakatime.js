// Busca as estatísticas do WakaTime no SERVIDOR, para o token não ir para o navegador.
//
// Quem chama esta função:
//   • em produção, a Vercel Function api/wakatime.js  → GET /api/wakatime
//   • no npm run dev / npm run preview, o vite.config.js (mesma rota)
//
// Variáveis de ambiente (sem o prefixo VITE_, de propósito: variáveis com
// VITE_ vão para o build e qualquer visitante consegue ler):
//   WAKATIME_ACCESS_TOKEN → token OAuth (npm run wakatime:oauth), escopos
//                           read_stats e read_summaries
//   WAKATIME_APP_ID, WAKATIME_APP_SECRET, WAKATIME_REFRESH_TOKEN
//                         → opcionais: renovação automática (ver api/_oauth.js)
//   WAKATIME_USERNAME     → opcional: seu usuário, para usar o perfil PÚBLICO sem token
//
// A partir de 01/11/2026 a API key do WakaTime não serve mais para ler dados:
// só os plugins dos editores a usam, para mandar a atividade.
//
// O nome do arquivo começa com "_" para a Vercel NÃO transformá-lo em rota.

import WAKATIME_CONFIG from "../src/config/wakatimeConfig.js";
import { fetchWakaTime, hasAccessToken } from "./_oauth.js";

const { MAX_LIBRARIES = 10, HIDDEN_DEPENDENCIES = [] } = WAKATIME_CONFIG;

export const WAKATIME_PATH = "/api/wakatime";

// Períodos aceitos pela API do WakaTime (o navegador só pode pedir um destes)
export const RANGES = [
  "last_7_days",
  "last_30_days",
  "last_6_months",
  "last_year",
  "all_time",
];

// Menos de 1 minuto não aparece na tela
const MIN_SECONDS = 60;

/* =====================================================================
   Resposta HTTP (funciona igual na Vercel e no servidor do Vite)
   ===================================================================== */

function send(res, status, body, cache = "no-store") {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
}

const sendError = (res, status, error, message) =>
  send(res, status, { error, message });

/* =====================================================================
   Normalização: devolve só o que a tela usa (resposta bem menor)
   ===================================================================== */

const toItems = (list = [], limit = 20) =>
  list
    .filter((item) => item.total_seconds >= MIN_SECONDS)
    .slice(0, limit)
    .map(({ name, total_seconds, percent }) => ({
      name,
      seconds: Math.round(total_seconds),
      percent,
    }));

// HIDDEN_DEPENDENCIES: nome exato ou, terminando com "*", o começo do nome
const hiddenRules = HIDDEN_DEPENDENCIES.map((name) => String(name).toLowerCase());
function isHiddenDependency(name) {
  const lower = String(name ?? "").toLowerCase();
  return hiddenRules.some((rule) =>
    rule.endsWith("*") ? lower.startsWith(rule.slice(0, -1)) : lower === rule
  );
}

// Bibliotecas (dependencies): os pacotes dos import dos arquivos que você
// editou. As escondidas saem AQUI, no servidor, antes do corte.
// Um arquivo importa várias bibliotecas ao mesmo tempo, então o tempo delas se
// sobrepõe: a porcentagem é recalculada entre as bibliotecas que sobraram
// (é a fatia entre as bibliotecas, não do tempo total).
function toLibraries(list = []) {
  const visible = list
    .filter((item) => item.name && item.total_seconds >= MIN_SECONDS)
    .filter((item) => !isHiddenDependency(item.name))
    .sort((a, b) => b.total_seconds - a.total_seconds);
  const sum = visible.reduce((total, item) => total + item.total_seconds, 0);
  return visible.slice(0, MAX_LIBRARIES).map(({ name, total_seconds }) => ({
    name,
    seconds: Math.round(total_seconds),
    percent: sum ? (total_seconds / sum) * 100 : 0,
  }));
}

function normalize(data, today, mode) {
  return {
    mode, // "oauth" ou "public"
    username: data.username ?? null,
    range: data.range,
    humanRange: data.human_readable_range ?? null,
    start: data.start ?? null,
    totalSeconds: Math.round(
      data.total_seconds_including_other_language ?? data.total_seconds ?? 0
    ),
    dailyAverage: Math.round(
      data.daily_average_including_other_language ?? data.daily_average ?? 0
    ),
    activeDays: data.days_minus_holidays ?? null,
    bestDay: data.best_day?.date
      ? { date: data.best_day.date, seconds: Math.round(data.best_day.total_seconds) }
      : null,
    languages: toItems(data.languages),
    editors: toItems(data.editors, 6),
    operatingSystems: toItems(data.operating_systems, 5),
    categories: toItems(data.categories, 6),
    projects: toItems(data.projects, 10),
    // Só com o token: o perfil público não manda as dependencies
    libraries: toLibraries(data.dependencies),
    today,
  };
}

// "Hoje" só existe com o token (endpoint privado status_bar/today, escopo read_summaries)
async function fetchToday(env) {
  try {
    const response = await fetchWakaTime("/users/current/status_bar/today", env);
    if (!response.ok) return null;
    const { data } = await response.json();
    const seconds = data?.grand_total?.total_seconds;
    return typeof seconds === "number" ? { seconds: Math.round(seconds) } : null;
  } catch {
    return null;
  }
}

/* =====================================================================
   Handler: GET /api/wakatime?range=last_7_days
   ===================================================================== */

export async function handleWakaTime(req, res, env = {}) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendError(res, 405, "method_not_allowed", "Use GET.");
  }

  const url = new URL(req.url, "http://localhost");
  const askedRange = url.searchParams.get("range");
  const range = RANGES.includes(askedRange) ? askedRange : "last_7_days";

  const hasToken = hasAccessToken(env);
  const username = String(env.WAKATIME_USERNAME ?? "").trim();

  if (!hasToken && !username) {
    return sendError(
      res,
      503,
      "missing_config",
      "Configure WAKATIME_ACCESS_TOKEN (ou WAKATIME_USERNAME) no .env.local ou na Vercel."
    );
  }

  // Com o token: dados da própria conta ("current"), mesmo com perfil privado.
  // Sem o token: perfil público do usuário (precisa estar público no WakaTime).
  const mode = hasToken ? "oauth" : "public";
  const user = hasToken ? "current" : encodeURIComponent(username);

  try {
    const [response, today] = await Promise.all([
      fetchWakaTime(`/users/${user}/stats/${range}`, env, { auth: hasToken }),
      hasToken ? fetchToday(env) : Promise.resolve(null),
    ]);

    // 202: o WakaTime ainda está calculando esse período (tente de novo em instantes)
    if (response.status === 202) {
      return sendError(res, 202, "pending", "O WakaTime ainda está calculando as estatísticas.");
    }
    if (response.status === 401) {
      return sendError(res, 401, "invalid_token", "Token OAuth do WakaTime inválido ou revogado.");
    }
    if (response.status === 402 || response.status === 403) {
      return sendError(
        res,
        403,
        "forbidden",
        mode === "public"
          ? "Perfil privado: deixe as estatísticas públicas no WakaTime ou use o WAKATIME_ACCESS_TOKEN."
          : "Sem permissão: o token precisa do escopo read_stats (ou este período não está disponível na sua conta)."
      );
    }
    if (response.status === 404) {
      return sendError(res, 404, "not_found", "Usuário do WakaTime não encontrado.");
    }
    if (!response.ok) {
      return sendError(res, 502, "upstream_error", `WakaTime respondeu HTTP ${response.status}.`);
    }

    const { data } = await response.json();
    if (data?.status === "pending_update" || !Array.isArray(data?.languages)) {
      return sendError(res, 202, "pending", "O WakaTime ainda está calculando as estatísticas.");
    }

    // 10 min no cache da CDN da Vercel: o token é usado no máximo 1x a cada 10 min por período
    return send(
      res,
      200,
      normalize(data, today, mode),
      "public, max-age=0, s-maxage=600, stale-while-revalidate=3600"
    );
  } catch (error) {
    console.error("WakaTime:", error?.message ?? error);
    return sendError(res, 504, "timeout", "Não foi possível falar com o WakaTime agora.");
  }
}
