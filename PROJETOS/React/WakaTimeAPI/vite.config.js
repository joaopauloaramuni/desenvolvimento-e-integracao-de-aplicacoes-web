import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { handleCodando, CODANDO_PATH } from "./api/_codando.js";
import { handleWakaTime, WAKATIME_PATH } from "./api/_wakatime.js";

// Rotas da API atendidas pelo próprio Vite no npm run dev (e no npm run preview).
// Em produção, quem atende são as Vercel Functions da pasta api/.
const ROUTES = {
  [WAKATIME_PATH]: handleWakaTime, // GET /api/wakatime → estatísticas
  [CODANDO_PATH]: handleCodando, //   GET /api/codando  → "codando agora"
};

// Assim o WAKATIME_ACCESS_TOKEN (e o App Secret / refresh token) fica só no
// servidor e nunca vai para o navegador.
function wakatimeApi(env) {
  const middleware = (req, res, next) => {
    const handler = ROUTES[new URL(req.url, "http://localhost").pathname];
    if (!handler) return next();
    handler(req, res, env).catch(next);
  };

  return {
    name: "wakatime-api",
    // Chaves { } de propósito: se a função devolver algo, o Vite o executa depois
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefixo "" lê TODAS as variáveis do .env.local, inclusive as sem VITE_.
  // Isso não as expõe: para o navegador continuam indo só as VITE_*.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), wakatimeApi(env)],
  };
});
