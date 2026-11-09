// screenshots.mjs
// Gera as capturas de tela do README em imgs/.
//
//   npx playwright install chromium   (só na primeira vez)
//   npm run screenshots
//
// O script sobe o próprio servidor do Vite, abre o app num Chromium sem janela,
// faz as jogadas (arrastar, trocar esquema...) e salva os PNGs. Depois é só copiar
// a pasta imgs/ para o repositório das imagens (GitHub Pages).
// CHROMIUM_PATH (opcional) aponta para um Chrome/Chromium já instalado.

import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const IMGS = `${raiz}imgs`;
await mkdir(IMGS, { recursive: true });

const servidor = await createServer({ root: raiz, server: { port: 5198, strictPort: true }, logLevel: "error" });
await servidor.listen();
const base = "http://localhost:5198/";

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

async function novaPagina(viewport, opcoes = {}) {
  const pagina = await navegador.newPage({ viewport, deviceScaleFactor: 1, ...opcoes });
  await pagina.goto(base);
  await pagina.evaluate(() => localStorage.clear());
  await pagina.reload();
  await pagina.waitForSelector(".vaga .carta");
  await pagina.evaluate(() => document.fonts.ready);
  return pagina;
}

async function salvar(pagina, nome, opcoes = {}) {
  await pagina.waitForTimeout(500); // fim das transições das barras
  await pagina.screenshot({ path: `${IMGS}/${nome}.png`, ...opcoes });
  console.log(`📸 imgs/${nome}.png`);
}

// Arrasta do centro de um elemento até o centro de outro, com o mouse
async function arrastar(pagina, de, para) {
  const a = await pagina.locator(de).first().boundingBox();
  const b = await pagina.locator(para).first().boundingBox();
  await pagina.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await pagina.mouse.down();
  await pagina.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 + 20, { steps: 4 });
  await pagina.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  return async () => {
    await pagina.mouse.up();
  };
}

const esquema = (pagina, id) => pagina.getByRole("radio", { name: id }).click();

try {
  const p = await novaPagina({ width: 1440, height: 1000 });

  // 1. Início: o melhor time no 4-3-3
  await salvar(p, "Home", { fullPage: true });

  // 2. Arrastando o Bernard (banco) do elenco para a ponta esquerda (a carta segue o mouse)
  const soltar = await arrastar(p, '.elenco-item:has-text("Bernard")', '[data-alvo="titular:8"]');
  await salvar(p, "Arrastando");
  await soltar();
  await salvar(p, "DepoisDaTroca", { fullPage: true });

  // 3. Outros esquemas
  await esquema(p, "3-5-2");
  await salvar(p, "Esquema352");
  await esquema(p, "5-3-2");
  await salvar(p, "Esquema532");
  await esquema(p, "4-2-3-1");

  // 4. Ficha do jogador (clique) e jogador improvisado
  await p.locator('[data-alvo="titular:10"]').click();
  await salvar(p, "FichaJogador");
  await p.locator(".elenco-item", { hasText: "Everson" }).click();
  await p.locator('[data-alvo="titular:10"]').click(); // goleiro de centroavante
  await salvar(p, "Improvisado"); // piorou: faixa do ataque em vermelho

  // 4b. Cassierra (que tinha ido para o gol) volta para o ataque: tudo melhora
  const voltar = await arrastar(p, '.elenco-item:has-text("Cassierra")', '[data-alvo="titular:10"]');
  await voltar();
  await salvar(p, "Melhorou"); // faixas do ataque e do goleiro em verde

  // 5. Pesquisa e filtro do elenco
  await p.getByRole("button", { name: "Defensores" }).click();
  await p.locator(".elenco").screenshot({ path: `${IMGS}/FiltroDefensores.png` });
  console.log("📸 imgs/FiltroDefensores.png");
  await p.getByRole("button", { name: "Todos" }).click();
  await p.fill("input[type=search]", "fred");
  await p.locator(".elenco").screenshot({ path: `${IMGS}/Pesquisa.png` });
  console.log("📸 imgs/Pesquisa.png");
  await p.fill("input[type=search]", "");

  // 6. Gráfico de força em destaque
  await p.getByRole("button", { name: "Escalar melhores" }).click();
  await esquema(p, "4-3-3");
  await esquema(p, "3-4-3");
  await p.locator(".painel:has(.forca)").screenshot({ path: `${IMGS}/GraficoForca.png` });
  console.log("📸 imgs/GraficoForca.png");

  // 7. Escalação zerada
  await p.getByRole("button", { name: "Limpar" }).click();
  await salvar(p, "Vazio");
  await p.close();

  // 8. Tablet e celular
  const tablet = await novaPagina({ width: 1024, height: 1300 });
  await salvar(tablet, "Tablet");
  await tablet.close();

  const cel = await novaPagina({ width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await salvar(cel, "Mobile");
  await cel.locator('[data-alvo="titular:5"]').tap();
  await cel.locator(".forca").scrollIntoViewIfNeeded();
  await salvar(cel, "MobileForca");
  await cel.close();
} finally {
  await navegador.close();
  await servidor.close();
}
