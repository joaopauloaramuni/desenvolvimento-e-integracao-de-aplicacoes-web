// screenshots.mjs
// Gera as capturas de tela do README em imgs/, com os dados reais de BH.
//
//   npx playwright install chromium   (só na primeira vez)
//   npm run screenshots
//
// O script sobe o próprio servidor do Vite (com a rota /api/pbh, então os ônibus
// ao vivo aparecem se o PBH_GTFS_RT_URL estiver no .env.local), abre as páginas
// num Chromium sem janela e salva os PNGs. Depois é só copiar a pasta imgs/ para
// o repositório das imagens (GitHub Pages).

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const IMGS = `${raiz}imgs`;
const ESPERA_MAPA_MS = 7000; // tempo para o fundo do mapa e os ônibus carregarem

const campus = JSON.parse(await readFile(`${raiz}public/data/campus.json`, "utf8").catch(() => "null"));
if (!campus) {
  console.error("❌ Rode `npm run dados` antes: public/data/campus.json não existe.");
  process.exit(1);
}

const servidor = await createServer({ root: raiz, server: { port: 5199, strictPort: true }, logLevel: "error" });
await servidor.listen();
const base = "http://localhost:5199/";

// O mapa usa WebGL: sem placa de vídeo, o Chromium desenha por software (SwiftShader).
// CHROMIUM_PATH (opcional) aponta para um Chrome/Chromium já instalado.
const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

async function salvar(nome, opcoes = {}) {
  await pagina.screenshot({ path: `${IMGS}/${nome}.png`, ...opcoes });
  console.log(`📸 imgs/${nome}.png`);
}

try {
  // 1. Início
  await pagina.goto(base);
  await pagina.waitForSelector(".campus-lista li");
  await pagina.waitForTimeout(ESPERA_MAPA_MS);
  await salvar("Home", { fullPage: true });

  // 2. Busca
  await pagina.fill("input[type=search]", "savassi");
  await pagina.waitForTimeout(400);
  await pagina.locator(".busca").screenshot({ path: `${IMGS}/Busca.png` });
  console.log("📸 imgs/Busca.png");
  await pagina.fill("input[type=search]", "");

  // 3. Linhas perto de cada campus
  const abas = pagina.locator(".campus-abas button");
  const nomes = ["CampusCoracaoEucaristico", "CampusLourdes"];
  for (let i = 0; i < Math.min(await abas.count(), nomes.length); i += 1) {
    await abas.nth(i).click();
    await pagina.waitForTimeout(ESPERA_MAPA_MS / 2);
    await pagina.locator(".campus").screenshot({ path: `${IMGS}/${nomes[i]}.png` });
    console.log(`📸 imgs/${nomes[i]}.png`);
  }

  // 4. Uma linha que passa no Coração Eucarístico (a mais próxima do campus)
  const linha = campus.campus[0]?.linhas[0];
  if (linha) {
    await pagina.goto(`${base}#/linha/${encodeURIComponent(linha.arquivo)}`);
    await pagina.waitForSelector(".linha-grade");
    await pagina.waitForTimeout(ESPERA_MAPA_MS);
    await salvar("Linha", { fullPage: true });

    // 5. Previsão no ponto perto do campus
    await pagina.goto(`${base}#/linha/${[linha.arquivo, linha.sentido, linha.pontoId].map(encodeURIComponent).join("/")}`);
    await pagina.reload();
    await pagina.waitForSelector(".linha-grade");
    await pagina.waitForTimeout(ESPERA_MAPA_MS);
    await salvar("LinhaPonto", { fullPage: true });

    // 6. Lista de pontos
    await pagina.click(".linha-abas button:nth-child(2)");
    await pagina.waitForTimeout(500);
    await pagina.locator(".linha-grade").screenshot({ path: `${IMGS}/Pontos.png` });
    console.log("📸 imgs/Pontos.png");

    // 7. Celular
    await pagina.setViewportSize({ width: 390, height: 844 });
    await pagina.reload();
    await pagina.waitForSelector(".linha-grade");
    await pagina.waitForTimeout(ESPERA_MAPA_MS);
    await salvar("Mobile");
  }
} finally {
  await navegador.close();
  await servidor.close();
}
