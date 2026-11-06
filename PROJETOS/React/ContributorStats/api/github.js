// Vercel Function: GET /api/github?resource=status|stats|last-commit|branches|history|commits|commit|readme&...
// Lê GITHUB_TOKEN (e GITHUB_ALLOWED_OWNERS, opcional) das Environment Variables da Vercel.
// A lógica fica em api/_github.js, que o vite.config.js também usa no npm run dev.

import { handleGitHub } from "./_github.js";

export default function handler(req, res) {
  return handleGitHub(req, res, process.env);
}
