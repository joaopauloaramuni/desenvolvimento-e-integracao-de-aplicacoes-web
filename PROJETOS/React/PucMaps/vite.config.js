import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // O worker do MapLibre 6 usa "import": precisa ser empacotado como módulo ES
  worker: {
    format: "es",
  },
  build: {
    // O maplibre-gl sozinho tem ~800 KB. Ele já fica num arquivo separado (lazy
    // no App.jsx), então o aviso de "chunk grande" pode subir.
    chunkSizeWarningLimit: 1200,
  },
});
