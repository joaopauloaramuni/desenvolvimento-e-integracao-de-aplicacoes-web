import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Não existe servidor neste projeto: o navegador fala direto com a API da
// YGOPRODeck (cartas) e com o Supabase (favoritos).
// base "./" + HashRouter deixam o build funcionar na Vercel e no GitHub Pages (subpasta).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  // O supabase-js + React Router passam um pouco de 500 kB (≈150 kB com gzip).
  build: { chunkSizeWarningLimit: 600 },
});
