import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { handlePbh, PBH_PATH } from "./api/_pbh.js";

// No npm run dev (e no npm run preview), a rota /api/pbh é atendida por
// este middleware. Em produção, quem atende é a Vercel Function api/pbh.js.
// Assim a chave do feed de tempo real fica só no servidor.
function pbhApi(env) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, "http://localhost").pathname !== PBH_PATH) return next();
    handlePbh(req, res, env).catch(next);
  };

  return {
    name: "pbh-api",
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
    plugins: [react(), pbhApi(env)],
    // O worker do MapLibre 6 usa "import": precisa ser empacotado como módulo ES
    worker: {
      format: "es",
    },
    build: {
      // O maplibre-gl sozinho tem ~800 KB. Ele já fica num arquivo separado
      // (React.lazy), então o aviso de "chunk grande" pode subir.
      chunkSizeWarningLimit: 1200,
    },
  };
});
