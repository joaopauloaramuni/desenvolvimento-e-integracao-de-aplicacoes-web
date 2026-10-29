import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Permite importar com "@/..." (ex.: "@/lib/utils"), igual ao código do site da Aceternity
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
