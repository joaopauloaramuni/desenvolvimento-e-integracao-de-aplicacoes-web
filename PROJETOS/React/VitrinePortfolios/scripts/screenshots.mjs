// screenshots.mjs
// Gera as capturas de tela do README em imgs/.
//
//   npx playwright install chromium   (só na primeira vez)
//   npm run screenshots
//
// O script sobe o próprio servidor do Vite, abre a vitrine num Chromium sem janela
// e salva os PNGs. Depois é só copiar a pasta imgs/ para o repositório das imagens
// do GitHub Pages, em react-imgs/VitrinePortfolios/imgs/.

import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const IMGS = `${raiz}imgs`;

const servidor = await createServer({ root: raiz, server: { port: 5198, strictPort: true }, logLevel: "error" });
await servidor.listen();
const base = "http://localhost:5198/";

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, colorScheme: "light" });

async function salvar(nome, opcoes = {}) {
  await pagina.screenshot({ path: `${IMGS}/${nome}.png`, ...opcoes });
  console.log(`📸 imgs/${nome}.png`);
}

async function esperarImagens() {
  await pagina.waitForLoadState("networkidle").catch(() => {});
  await pagina.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((img) => (img.loading = "eager"));
    await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
  });
  await pagina.waitForTimeout(800);
}

try {
  // 1. Início (cabeçalho, professor e primeiros cards)
  await pagina.goto(base);
  await esperarImagens();
  await salvar("Home");

  // 2. Página inteira
  await salvar("HomeCompleta", { fullPage: true });

  // 2b. Tema escuro (botão da barra de busca) e volta para o claro
  await pagina.locator(".tema").click();
  await pagina.waitForTimeout(300);
  await salvar("HomeEscuro");
  await pagina.locator(".tema").click();

  // 3. Busca por nome
  await pagina.fill("input[type=search]", "pedro");
  await pagina.waitForTimeout(400);
  await pagina.evaluate(() => window.scrollTo(0, document.querySelector(".turma").offsetTop));
  await pagina.waitForTimeout(400);
  await salvar("Busca");

  // 4. Busca sem resultado
  await pagina.fill("input[type=search]", "zzz");
  await pagina.waitForTimeout(300);
  await pagina.locator(".turma").screenshot({ path: `${IMGS}/BuscaVazia.png` });
  console.log("📸 imgs/BuscaVazia.png");
  await pagina.fill("input[type=search]", "");

  // 5. Preview (captura) de um aluno
  await pagina.locator(".card-preview").first().click();
  await pagina.getByRole("tab", { name: "Captura" }).click();
  await pagina.waitForTimeout(600);
  await salvar("Preview");
  await pagina.keyboard.press("Escape");

  // 6. Celular
  await pagina.setViewportSize({ width: 390, height: 844 });
  await pagina.goto(base);
  await esperarImagens();
  await salvar("Mobile");
} finally {
  await navegador.close();
  await servidor.close();
}
