import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O navegador fala direto com o Supabase (Data API), sem servidor no meio.
// Na Vercel, o vercel.json manda qualquer caminho (/partidas/..., /placar)
// para o index.html, e o React Router decide.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Bibliotecas em arquivos separados: mudam pouco e ficam no cache do navegador
        codeSplitting: {
          groups: [
            { name: "supabase", test: /node_modules[\\/]@supabase[\\/]/ },
            { name: "react", test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
});
