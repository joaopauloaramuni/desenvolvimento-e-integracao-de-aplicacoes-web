// Gera o WAKATIME_ACCESS_TOKEN e o WAKATIME_REFRESH_TOKEN do projeto.
// Uso: npm run wakatime:oauth
//
// Precisa de WAKATIME_APP_ID e WAKATIME_APP_SECRET no .env.local e do
// Redirect URI http://localhost:8787/callback cadastrado no app em
// https://wakatime.com/apps. Abre a autorização no navegador, recebe o
// callback aqui e imprime os tokens para colar no .env.local e na Vercel.
//
// Por quê: a partir de 01/11/2026 a API key do WakaTime só serve para os
// plugins mandarem dados. Para ler (stats, status_bar, heartbeats), a API
// exige um token OAuth.

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { exec } from "node:child_process";

// Lê o .env.local sem dependências
const env = {};
try {
  for (const linha of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  console.error("Não achei o .env.local. Rode na raiz do projeto (cp .env.example .env.local).");
  process.exit(1);
}

const CLIENT_ID = env.WAKATIME_APP_ID;
const CLIENT_SECRET = env.WAKATIME_APP_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Preencha WAKATIME_APP_ID e WAKATIME_APP_SECRET no .env.local.");
  process.exit(1);
}

const PORTA = 8787;
const REDIRECT_URI = `http://localhost:${PORTA}/callback`;

// Escopos separados por vírgula (só leitura):
//   read_stats      → GET /users/current/stats/:range          (/api/wakatime)
//   read_summaries  → GET /users/current/status_bar/today      (indicador "Hoje")
//   read_heartbeats → GET /users/current/heartbeats e /user_agents (/api/codando)
// Se alguma rota responder 403, acrescente o que a documentação de OAuth do
// WakaTime pedir (https://wakatime.com/developers#authentication) e rode de novo.
const SCOPE = "read_stats,read_summaries,read_heartbeats";
const state = randomBytes(16).toString("hex");

const url = new URL("https://wakatime.com/oauth/authorize");
url.search = new URLSearchParams({
  client_id: CLIENT_ID,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: SCOPE,
  state,
}).toString();

const server = createServer(async (req, res) => {
  const recebida = new URL(req.url, REDIRECT_URI);
  if (recebida.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const fim = (status, msg) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end(msg);
    server.close();
    // Fecha também conexões keep-alive do navegador, para o script terminar
    server.closeAllConnections?.();
  };

  if (recebida.searchParams.get("state") !== state) {
    return fim(400, "State inválido. Rode o script de novo.");
  }
  const code = recebida.searchParams.get("code");
  if (!code) {
    return fim(400, `Autorização negada: ${recebida.searchParams.get("error") ?? "sem code"}`);
  }

  try {
    const resp = await fetch("https://wakatime.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
    });
    const texto = await resp.text();
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${texto}`);

    // O WakaTime pode responder em JSON ou em form-urlencoded
    let dados;
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = Object.fromEntries(new URLSearchParams(texto));
    }

    console.log("\nCole no .env.local (e nas variáveis da Vercel):\n");
    console.log(`WAKATIME_ACCESS_TOKEN=${dados.access_token}`);
    console.log(`WAKATIME_REFRESH_TOKEN=${dados.refresh_token}`);
    console.log(`\nEscopo: ${dados.scope ?? "?"}  |  expira em: ${dados.expires_at ?? dados.expires_in ?? "?"}\n`);
    fim(200, "Pronto! Os tokens estão no terminal. Pode fechar esta aba.");
  } catch (erro) {
    console.error("Erro ao trocar o code pelo token:", erro.message);
    process.exitCode = 1;
    fim(500, "Deu erro. Veja o terminal.");
  }
});

server.on("error", (erro) => {
  console.error(
    erro.code === "EADDRINUSE"
      ? `A porta ${PORTA} está em uso. Feche o que estiver usando e rode de novo.`
      : erro.message
  );
  process.exit(1);
});

server.listen(PORTA, () => {
  console.log(`Abrindo a autorização no navegador...\nSe não abrir, acesse:\n${url}\n`);
  const abrir =
    process.platform === "win32" ? `start "" "${url}"` :
    process.platform === "darwin" ? `open "${url}"` :
    `xdg-open "${url}"`;
  exec(abrir);
});
