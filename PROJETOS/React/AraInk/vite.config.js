import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Projeto 100% front-end: não há pasta api/ nem servidor.
// O navegador chama a API do Gemini direto, com a chave VITE_GEMINI_API_KEY
// lida do .env.local na hora do build (veja src/config/geminiConfig.js).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
