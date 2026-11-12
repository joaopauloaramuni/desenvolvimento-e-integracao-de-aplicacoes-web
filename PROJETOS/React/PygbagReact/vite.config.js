import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O jogo não passa pelo Vite: o build do pygbag fica em public/games/<pasta>/ e é
// copiado do jeito que está para o dist/. O React só abre esse index.html num <iframe>.
// base "./" deixa o build funcionar tanto na Vercel quanto no GitHub Pages (subpasta).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
