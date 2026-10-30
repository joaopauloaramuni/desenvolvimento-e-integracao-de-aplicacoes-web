// Vercel Function: GET /api/pbh?recurso=status|onibus&rotas=...
// Lê o PBH_GTFS_RT_URL das Environment Variables da Vercel.
// A lógica fica em api/_pbh.js, que o vite.config.js também usa no npm run dev.

import { handlePbh } from "./_pbh.js";

export default function handler(req, res) {
  return handlePbh(req, res, process.env);
}
