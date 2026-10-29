// Vercel Function: GET /api/wakatime?range=last_7_days
// Lê WAKATIME_ACCESS_TOKEN (token OAuth) e/ou WAKATIME_USERNAME das Environment
// Variables da Vercel (renovação automática opcional: ver api/_oauth.js).
// A lógica fica em api/_wakatime.js, que o vite.config.js também usa no npm run dev.

import { handleWakaTime } from "./_wakatime.js";

export default function handler(req, res) {
  return handleWakaTime(req, res, process.env);
}
