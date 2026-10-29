// Vercel Function: GET /api/codando
// Em que projeto você está mexendo no editor agora (heartbeats do WakaTime).
// Lê WAKATIME_ACCESS_TOKEN (token OAuth) das Environment Variables da Vercel;
// WAKATIME_APP_ID, WAKATIME_APP_SECRET e WAKATIME_REFRESH_TOKEN são opcionais
// (renovação automática, ver api/_oauth.js).
// A lógica fica em api/_codando.js, que o vite.config.js também usa no npm run dev.

import { handleCodando } from "./_codando.js";

export default function handler(req, res) {
  return handleCodando(req, res, process.env);
}
