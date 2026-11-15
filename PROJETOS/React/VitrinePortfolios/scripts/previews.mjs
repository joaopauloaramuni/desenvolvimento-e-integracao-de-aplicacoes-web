// previews.mjs
// Tira uma captura da página inicial de TODOS os portfólios (professor + turma)
// e salva em public/previews/<id>.png. São essas imagens que aparecem nos cards.
//
//   npx playwright install chromium   (só na primeira vez)
//   npm run previews
//
// Sempre captura todos de novo, no mesmo tamanho e no mesmo momento: ao incluir
// um aluno novo, os outros também são atualizados, caso tenham mudado o layout.
// Se um site não abrir, a captura antiga dele (se existir) é mantida.

import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import PORTFOLIOS from "../src/data/portfolios.js";
import VITRINE_CONFIG from "../src/config/vitrineConfig.js";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const SAIDA = `${raiz}public/previews`;
const ESPERA_MS = 2500; // tempo para animações de entrada terminarem

const alvos = [VITRINE_CONFIG.PROFESSOR, ...PORTFOLIOS];
console.log(`Capturando ${alvos.length} portfólios...\n`);

await mkdir(SAIDA, { recursive: true });

// CHROMIUM_PATH (opcional) aponta para um Chrome/Chromium já instalado.
const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const contexto = await navegador.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  ignoreHTTPSErrors: true,
  colorScheme: "dark",
});

let ok = 0;
const falhas = [];

for (const p of alvos) {
  const pagina = await contexto.newPage();
  try {
    await pagina.goto(p.site, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await pagina.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
    await pagina.waitForTimeout(ESPERA_MS);
    await pagina.screenshot({ path: `${SAIDA}/${p.id}.png` });
    ok += 1;
    console.log(`📸 ${p.site} -> public/previews/${p.id}.png`);
  } catch (erro) {
    falhas.push(p.id);
    console.warn(`❌ ${p.site}: ${erro.message.split("\n")[0]}`);
  } finally {
    await pagina.close();
  }
}

await navegador.close();
console.log(`\n✅ ${ok} capturas salvas${falhas.length ? `, ❌ ${falhas.length} falharam: ${falhas.join(", ")}` : ""}`);
