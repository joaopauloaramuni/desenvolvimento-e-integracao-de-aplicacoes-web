import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base "./": o dist/ funciona na Vercel e numa subpasta do GitHub Pages
  base: "./",
});
