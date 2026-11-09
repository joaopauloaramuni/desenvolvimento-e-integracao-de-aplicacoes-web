import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Não existe servidor neste projeto: o navegador lê o pokedex-data.json (empacotado
// no build), carrega as imagens da PokéAPI e fala com o Supabase (Data API) direto.
// base "./" deixa o build funcionar tanto na Vercel quanto no GitHub Pages (subpasta).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
