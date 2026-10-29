// Autenticação com o WakaTime por token OAuth, usada por api/_wakatime.js e
// api/_codando.js.
//
// Por que OAuth: a partir de 01/11/2026 a API key do WakaTime passa a ser
// "write-only": só serve para os plugins (VS Code, JetBrains...) mandarem a
// atividade de código. Para LER dados (stats, status_bar, heartbeats...), a
// API exige um token OAuth, enviado em "Authorization: Bearer <token>".
//
// Variáveis de ambiente (sem o prefixo VITE_, de propósito: ficam só no
// servidor e nunca vão para o build):
//   WAKATIME_ACCESS_TOKEN   → token OAuth (gerado pelo npm run wakatime:oauth)
//   WAKATIME_APP_ID         → opcionais: renovação automática. Com as três,
//   WAKATIME_APP_SECRET       quando a API responde 401 (token expirado ou
//   WAKATIME_REFRESH_TOKEN    revogado), pedimos um novo e tentamos de novo.
//
// O token renovado fica só na memória da função; para valer de vez, rode
// npm run wakatime:oauth de novo e troque o WAKATIME_ACCESS_TOKEN.
//
// O nome do arquivo começa com "_" para a Vercel NÃO transformá-lo em rota.

export const WAKATIME_API = "https://wakatime.com/api/v1";
const OAUTH_TOKEN_URL = "https://wakatime.com/oauth/token";
const REFRESH_TIMEOUT_MS = 8_000;

const clean = (value) => String(value ?? "").trim();

// Token renovado nesta instância da função (null = usar o do env)
let renewedToken = null;
let renewing = null;

export const hasAccessToken = (env) => Boolean(clean(env.WAKATIME_ACCESS_TOKEN));

const currentToken = (env) => renewedToken ?? clean(env.WAKATIME_ACCESS_TOKEN);

const canRenew = (env) =>
  Boolean(
    clean(env.WAKATIME_APP_ID) &&
      clean(env.WAKATIME_APP_SECRET) &&
      clean(env.WAKATIME_REFRESH_TOKEN)
  );

// O WakaTime pode responder em JSON ou em form-urlencoded
function parseTokenResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return Object.fromEntries(new URLSearchParams(text));
  }
}

// Vários pedidos com 401 ao mesmo tempo: uma renovação só
function renewToken(env) {
  if (!renewing) {
    renewing = (async () => {
      const response = await fetch(OAUTH_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: clean(env.WAKATIME_APP_ID),
          client_secret: clean(env.WAKATIME_APP_SECRET),
          grant_type: "refresh_token",
          refresh_token: clean(env.WAKATIME_REFRESH_TOKEN),
        }),
        signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`WakaTime OAuth HTTP ${response.status} ao renovar o token`);

      const data = parseTokenResponse(text);
      if (!data.access_token) throw new Error("WakaTime OAuth: resposta sem access_token");

      renewedToken = data.access_token;
      console.warn(
        "WakaTime: token OAuth renovado. Rode npm run wakatime:oauth para atualizar o .env.local e a Vercel."
      );
    })().finally(() => {
      renewing = null;
    });
  }
  return renewing;
}

// GET na API do WakaTime. Devolve o Response (quem chama decide o que fazer
// com cada status).
//   auth: true  → manda o token OAuth (dados da própria conta, "current")
//   auth: false → sem autenticação (perfil público)
export async function fetchWakaTime(path, env, { auth = true, timeout = 10_000 } = {}) {
  const request = () => {
    const headers = { Accept: "application/json" };
    if (auth) headers.Authorization = `Bearer ${currentToken(env)}`;
    return fetch(`${WAKATIME_API}${path}`, { headers, signal: AbortSignal.timeout(timeout) });
  };

  const response = await request();

  // Token expirado ou revogado: renova uma vez e tenta de novo
  if (auth && response.status === 401 && canRenew(env)) {
    try {
      await renewToken(env);
    } catch (error) {
      console.error("WakaTime:", error?.message ?? error);
      return response;
    }
    return request();
  }

  return response;
}
