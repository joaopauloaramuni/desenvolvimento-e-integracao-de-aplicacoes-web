import { GAMES_FOLDER } from "../config/appConfig.js";

// Monta o endereço do index.html gerado pelo pygbag.
// import.meta.env.BASE_URL é "/" no `npm run dev` e "./" no build (base do vite.config.js),
// então o mesmo código funciona na raiz (Vercel) e numa subpasta (GitHub Pages).
export function gameUrl(pasta) {
  return `${import.meta.env.BASE_URL}${GAMES_FOLDER}/${pasta}/index.html`;
}
