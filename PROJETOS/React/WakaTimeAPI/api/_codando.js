// "Codando agora": em que projeto você está mexendo no editor NESTE momento.
//
// De onde vem: a extensão do WakaTime (VS Code, Cursor...) manda um
// "heartbeat" a cada ~2 min enquanto você digita, com projeto, linguagem,
// branch e arquivo. Aqui lemos os heartbeats do dia
// (GET /users/current/heartbeats?date=AAAA-MM-DD) e olhamos o último:
// se ele chegou há até CODING_NOW.ACTIVE_MINUTES, você está codando.
//
// Quem chama esta função:
//   • em produção, a Vercel Function api/codando.js  → GET /api/codando
//   • no npm run dev / npm run preview, o vite.config.js (mesma rota)
//
// Heartbeats são PRIVADOS: precisam do token OAuth WAKATIME_ACCESS_TOKEN
// (sem VITE_, escopo read_heartbeats), que fica só no servidor. Desde
// 01/11/2026 a API key do WakaTime só serve para os plugins mandarem dados.
// O token sai do scripts/wakatime-oauth.mjs (npm run wakatime:oauth). Sem o
// token a rota responde 503 e o cartão some. Se o token expirar (401), a
// renovação automática fica em api/_oauth.js.
//
// Privacidade:
//   • o arquivo (entity) nunca sai daqui: ele traz o caminho completo;
//   • projeto fora de CODING_NOW.PUBLIC_PROJECTS (ou de WAKATIME_PUBLIC_PROJECTS)
//     vira "projeto privado", sem nome e sem branch (ou some, com SHOW_PRIVATE: false);
//   • só heartbeats de arquivo (type "file") contam: os de navegador
//     (domínios visitados) são descartados.
//
// Custo: a resposta é igual para todo mundo, então fica 60 s no cache da CDN
// da Vercel e 60 s na memória da função. O token é usado no máximo uma vez
// por minuto, por mais visitantes que estejam com a página aberta.
//
// O nome do arquivo começa com "_" para a Vercel NÃO transformá-lo em rota.

import WAKATIME_CONFIG from "../src/config/wakatimeConfig.js";
import { fetchWakaTime, hasAccessToken } from "./_oauth.js";

const { CODING_NOW } = WAKATIME_CONFIG;
export const CODANDO_PATH = CODING_NOW.API_PATH;

const API_USER = "/users/current";
const TIMEOUT_MS = 8_000;
const CACHE_MS = 60 * 1000;
const EDITORS_CACHE_MS = 60 * 60 * 1000;

const ACTIVE_S = CODING_NOW.ACTIVE_MINUTES * 60;
const BREAK_S = CODING_NOW.BREAK_MINUTES * 60;

/* =====================================================================
   Resposta HTTP (funciona igual na Vercel e no servidor do Vite)
   ===================================================================== */

function send(res, status, body, cache = "no-store") {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
}

/* =====================================================================
   Nomes e datas
   ===================================================================== */

// Nome do editor como o WakaTime manda → como aparece na tela
const EDITOR_NAMES = {
  vscode: "VS Code",
  cursor: "Cursor",
  windsurf: "Windsurf",
  vscodium: "VSCodium",
  zed: "Zed",
  vim: "Vim",
  neovim: "Neovim",
  emacs: "Emacs",
  sublime: "Sublime Text",
  intellij: "IntelliJ IDEA",
  idea: "IntelliJ IDEA",
  pycharm: "PyCharm",
  webstorm: "WebStorm",
  androidstudio: "Android Studio",
  xcode: "Xcode",
  eclipse: "Eclipse",
  visualstudio: "Visual Studio",
  jupyter: "Jupyter",
};

function editorName(editor) {
  if (!editor) return null;
  const text = String(editor);
  const key = text.toLowerCase().replace(/[\s_-]/g, "");
  return EDITOR_NAMES[key] ?? text.charAt(0).toUpperCase() + text.slice(1);
}

// "2026-10-09" no fuso da conta do WakaTime
const dayInTimezone = (ms) =>
  new Date(ms).toLocaleDateString("en-CA", { timeZone: CODING_NOW.TIMEZONE });

// Minutos passados desde a meia-noite no fuso da conta
function minutesSinceMidnight(ms) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CODING_NOW.TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const value = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return value("hour") * 60 + value("minute");
}

// Lista do config + variável WAKATIME_PUBLIC_PROJECTS ("a, b, c")
function publicProjects(env) {
  const extra = String(env.WAKATIME_PUBLIC_PROJECTS ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return new Set([...CODING_NOW.PUBLIC_PROJECTS, ...extra].map((n) => n.toLowerCase()));
}

/* =====================================================================
   Chamadas à API do WakaTime
   ===================================================================== */

// Token OAuth no cabeçalho "Authorization: Bearer" (ver api/_oauth.js)
async function callWakaTime(path, env) {
  const response = await fetchWakaTime(`${API_USER}${path}`, env, { timeout: TIMEOUT_MS });
  if (!response.ok) {
    const error = new Error(`WakaTime HTTP ${response.status} em ${path.split("?")[0]}`);
    error.status = response.status;
    throw error;
  }
  const json = await response.json();
  return Array.isArray(json?.data) ? json.data : [];
}

// id do user agent → nome do editor. Muda pouco: 1 h de cache.
// Se falhar, o cartão só fica sem o nome do editor.
let editors = { at: 0, map: new Map() };
async function editorsMap(env) {
  if (Date.now() - editors.at < EDITORS_CACHE_MS) return editors.map;
  try {
    const list = await callWakaTime("/user_agents", env);
    editors = { at: Date.now(), map: new Map(list.map((ua) => [ua.id, editorName(ua.editor)])) };
  } catch (error) {
    console.error("Codando agora (editores):", error?.message ?? error);
  }
  return editors.map;
}

const heartbeatsOfDay = async (day, env) =>
  (await callWakaTime(`/heartbeats?date=${day}`, env))
    .filter((hb) => hb.type === "file" && Number.isFinite(hb.time))
    .sort((a, b) => a.time - b.time);

/* =====================================================================
   Contas com os heartbeats
   ===================================================================== */

// Tempo somado como o WakaTime faz: o intervalo entre dois heartbeats
// seguidos conta se for menor que a pausa. É aproximado (o dashboard pode
// diferir em alguns minutos).
function sumSeconds(heartbeats) {
  let total = 0;
  for (let i = 1; i < heartbeats.length; i += 1) {
    const gap = heartbeats[i].time - heartbeats[i - 1].time;
    if (gap < BREAK_S) total += gap;
  }
  return Math.round(total);
}

// Começo da sessão atual: volta do último heartbeat até achar uma pausa
function sessionStart(heartbeats) {
  let i = heartbeats.length - 1;
  while (i > 0 && heartbeats[i].time - heartbeats[i - 1].time < BREAK_S) i -= 1;
  return heartbeats[i].time;
}

async function build(env) {
  const now = Date.now();
  const today = dayInTimezone(now);

  const [ofToday, editorById] = await Promise.all([
    heartbeatsOfDay(today, env),
    editorsMap(env),
  ]);

  // Logo depois da meia-noite, a sessão pode ter começado ontem
  let heartbeats = ofToday;
  if (minutesSinceMidnight(now) < CODING_NOW.BREAK_MINUTES + CODING_NOW.ACTIVE_MINUTES) {
    const yesterday = dayInTimezone(now - 24 * 60 * 60 * 1000);
    heartbeats = [...(await heartbeatsOfDay(yesterday, env)), ...ofToday];
  }

  const todaySeconds = sumSeconds(ofToday);
  const last = heartbeats.at(-1);
  if (!last) return { active: false, todaySeconds, last: null };

  const allowed = publicProjects(env);
  const isPublic =
    Boolean(last.project) && (allowed.has("*") || allowed.has(last.project.toLowerCase()));
  if (!isPublic && !CODING_NOW.SHOW_PRIVATE) {
    return { active: false, todaySeconds, last: null };
  }

  return {
    active: now / 1000 - last.time <= ACTIVE_S,
    todaySeconds,
    last: {
      isPublic,
      project: isPublic ? last.project : null,
      branch: isPublic ? last.branch || null : null,
      language: last.language || null,
      editor: editorById.get(last.user_agent_id) ?? null,
      at: Math.round(last.time * 1000), // ms
      sessionStart: Math.round(sessionStart(heartbeats) * 1000), // ms
      // Tempo de hoje só neste projeto (sem os heartbeats de ontem)
      projectTodaySeconds: sumSeconds(ofToday.filter((hb) => hb.project === last.project)),
    },
  };
}

// Vários visitantes no mesmo instante: uma chamada só ao WakaTime
let cache = { at: 0, data: null, promise: null };

async function getCodingNow(env) {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;
  if (!cache.promise) {
    cache.promise = build(env)
      .then((data) => {
        cache = { at: Date.now(), data, promise: null };
        return data;
      })
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }
  return cache.promise;
}

/* =====================================================================
   Handler: GET /api/codando
   ===================================================================== */

export async function handleCodando(req, res, env = {}) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "method_not_allowed", message: "Use GET." });
  }

  if (!hasAccessToken(env)) {
    return send(res, 503, {
      error: "missing_token",
      message: "O \"codando agora\" precisa do WAKATIME_ACCESS_TOKEN (heartbeats são privados).",
    });
  }

  try {
    const data = await getCodingNow(env);
    // Igual para todos os visitantes: pode ficar 60 s na CDN da Vercel
    return send(res, 200, data, "public, max-age=0, s-maxage=60, stale-while-revalidate=60");
  } catch (error) {
    console.error("Codando agora:", error?.message ?? error);
    if (error?.status === 401) {
      return send(res, 401, { error: "invalid_token", message: "Token OAuth do WakaTime inválido ou revogado." });
    }
    if (error?.status === 403) {
      return send(res, 403, { error: "forbidden", message: "O token precisa do escopo read_heartbeats." });
    }
    return send(res, 502, { error: "upstream_error", message: "Não foi possível falar com o WakaTime agora." });
  }
}
