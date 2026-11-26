// Gera as capturas de tela da pasta imgs/ usadas no README.
//
// Uso:
//   1) npm run dev            (em outro terminal; ou defina BASE_URL)
//   2) npx playwright install chromium   (só na primeira vez)
//   3) npm run screenshots
//
// Variáveis opcionais: BASE_URL (padrão http://localhost:5173) e
// CHROMIUM_PATH (caminho de um Chromium já instalado).

import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
const SAIDA = new URL("../imgs/", import.meta.url).pathname;

const DESKTOP = { width: 1366, height: 900 };
const MOBILE = { width: 390, height: 844 };

const CAPTURAS = [
  { nome: "Home", rota: "/" },
  { nome: "Recursos", rota: "/recursos" },
  { nome: "CadastroRecurso", rota: "/recursos/novo" },
  { nome: "CadastroRecursoErros", rota: "/recursos/novo", acao: (p) => p.getByRole("button", { name: "Cadastrar recurso" }).click() },
  { nome: "NovaReserva", rota: "/reservar?recurso=DS-CE-001" },
  {
    nome: "NovaReservaRevisao",
    rota: "/reservar?recurso=DS-CE-001",
    acao: async (p) => {
      await p.getByRole("button", { name: "Continuar" }).click();
      await p.getByLabel("Nome completo").fill("Maria Fernanda Alves");
      await p.getByLabel("Matrícula").fill("712900");
      await p.getByLabel("Motivo da reserva").fill("Apresentação do protótipo de IHC para a turma.");
      await p.getByRole("button", { name: "Continuar" }).click();
    },
  },
  { nome: "ConfirmarReservas", rota: "/reservas" },
  {
    nome: "DialogoRejeitar",
    rota: "/reservas",
    acao: (p) => p.getByRole("button", { name: /Rejeitar reserva de Ismael/ }).click(),
  },
  { nome: "DetalhesReserva", rota: "/reservas/R-1024" },
  { nome: "GuiaEstilo", rota: "/guia-de-estilo", paginaInteira: true },
  { nome: "BoasPraticas", rota: "/boas-praticas" },
  { nome: "TemaEscuro", rota: "/recursos", tema: "dark" },
  { nome: "Mobile", rota: "/", tela: MOBILE },
  { nome: "MobileReserva", rota: "/reservar?recurso=MC-CE-001", tela: MOBILE },
  { nome: "MobileReservas", rota: "/reservas", tela: MOBILE },
];

await mkdir(SAIDA, { recursive: true });
const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

for (const c of CAPTURAS) {
  const contexto = await navegador.newContext({
    viewport: c.tela ?? DESKTOP,
    deviceScaleFactor: c.tela ? 2 : 1,
    colorScheme: c.tema ?? "light",
    locale: "pt-BR",
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE + c.rota);
  await pagina.evaluate(() => localStorage.clear());
  await pagina.reload();
  await pagina.waitForTimeout(900); // espera a latência simulada (skeleton)
  if (c.acao) {
    await c.acao(pagina);
    await pagina.waitForTimeout(700);
  }
  await pagina.mouse.move(0, 0);
  await pagina.screenshot({ path: `${SAIDA}${c.nome}.png`, fullPage: Boolean(c.paginaInteira) });
  console.log(`✓ imgs/${c.nome}.png`);
  await contexto.close();
}

await navegador.close();
