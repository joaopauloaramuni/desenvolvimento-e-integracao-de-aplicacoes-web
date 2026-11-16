// capturar-telas.mjs
// Tira as capturas de tela do README e salva em imgs/.
//
// Como usar (com o token no .env.local):
//   1. npm install
//   2. npm run capturas:instalar        (baixa o Chromium, só na primeira vez)
//   3. npm run dev                      (deixe rodando em outro terminal)
//   4. npm run capturas                 (todas as telas)
//      npm run capturas -- Perto Rota   (só as telas escolhidas)
//
// A tela "SemToken.png" precisa do projeto SEM token, por isso não entra aqui.

import { chromium } from "playwright";

const APP_URL = process.env.APP_URL ?? "http://localhost:5173";
const OUT = new URL("../imgs/", import.meta.url).pathname;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true });
  console.log(`✔ imgs/${name}.png`);
};

const tab = (label) => page.getByRole("tab", { name: label }).click();

const openFresh = async () => {
  await page.goto(APP_URL);
  await page.locator(".liq-map canvas").waitFor({ timeout: 20000 });
  await page.waitForTimeout(4000); // tempo para os blocos do mapa desenharem
};

// Escolhe uma unidade da PUC na lista da aba Buscar
const choosePlace = async (name) => {
  await tab("Buscar");
  await page.locator(".liq-tab-body").getByRole("button", { name }).click();
  await page.waitForTimeout(3000); // o mapa voa até a unidade
};

const STEPS = {
  async Home() {
    await openFresh();
    await shot("Home");
  },

  async Busca() {
    await openFresh();
    await page.getByPlaceholder("Endereço, lugar ou CEP").pressSequentially("Praça da Liberdade", { delay: 60 });
    await page.locator(".liq-dropdown button").first().waitFor({ timeout: 15000 });
    await page.waitForTimeout(800);
    await shot("Busca");
  },

  async Ponto() {
    await openFresh();
    const box = await page.locator(".liq-map").boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(5000); // reverse + timezone + static map
    await shot("Ponto");
  },

  // Usa a unidade da Savassi: região central, com bastante restaurante perto
  async Perto() {
    await openFresh();
    await choosePlace(/Praça da Liberdade/);
    await tab("Perto");
    await page.getByRole("group", { name: "Categoria" }).getByRole("button", { name: "Restaurantes" }).click();
    await page.getByRole("group", { name: "Raio da busca" }).getByRole("button").nth(1).click(); // 1 km
    await page.getByRole("button", { name: "Buscar ao redor" }).click();

    // Espera a lista, o aviso de "nada encontrado" ou um erro (o que vier primeiro)
    const result = page.locator(".liq-tab-body .liq-list li, .liq-tab-body .liq-empty, .liq-tab-body .liq-info.error").first();
    await result.waitFor({ timeout: 20000 });
    if (!(await result.evaluate((el) => el.tagName === "LI"))) {
      console.warn(`⚠ Perto: ${await result.innerText()}`);
    }
    await page.waitForTimeout(3000); // mapa ajusta para mostrar todos os pontos
    await shot("Perto");
  },

  async Rota() {
    await openFresh();
    await tab("Rota");
    await page.getByLabel("Origem: unidade PUC Minas").selectOption({ index: 1 });
    await page.getByLabel("Destino: unidade PUC Minas").selectOption({ index: 2 });
    await page.getByRole("button", { name: "Traçar rota" }).click();
    await page.waitForTimeout(6000); // rota + ajuste do mapa
    await shot("Rota");
  },
};

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(STEPS);

for (const name of names) {
  if (!STEPS[name]) {
    console.error(`✖ Tela desconhecida: ${name}. Use: ${Object.keys(STEPS).join(", ")}`);
    continue;
  }
  try {
    await STEPS[name]();
  } catch (error) {
    console.error(`✖ ${name}: ${error.message.split("\n")[0]}`);
  }
}

await browser.close();
