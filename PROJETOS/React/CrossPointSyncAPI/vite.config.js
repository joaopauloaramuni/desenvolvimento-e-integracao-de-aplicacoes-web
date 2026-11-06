import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Projeto 100% front-end: não há pasta api/ nem servidor.
// O navegador chama o crosspoint-sync direto (ele libera CORS para /users e /api/v1).
//
// base: "./" deixa os caminhos relativos, então a pasta dist/ funciona no
// GitHub Pages numa subpasta, como https://seu-usuario.github.io/CrossPointSyncAPI/
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
