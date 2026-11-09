// fotos.mjs
// Sincroniza o elenco com o site oficial do Atlético e baixa as fotos que faltam.
//
//   npm run fotos                        lê o site, atualiza o elenco.json e baixa as fotos que faltam
//   npm run fotos -- --forcar            baixa de novo TODAS as fotos (substitui as que já existem)
//   npm run fotos -- --remover-ausentes  tira do elenco.json quem não está mais no site
//   npm run fotos -- --offline           não acessa a internet: só lista quem está sem foto local
//
// Como funciona:
// 1. Baixa o HTML de https://atletico.com.br/futebol/masculino/elenco/ e lê cada card de jogador:
//
//      <div class="elenco-atleta">
//        <img src=".../GOL_Delfim_Site.png" alt="Foto goleiro Gabriel Delfim">
//        <p class="elenco-atleta-camisa">1</p>
//        <h4>Gabriel Delfim</h4>
//        <p class="elenco-atleta-posicao">Goleiro</p>
//
//    Se o site mudar e o HTML vier sem cards, abre a página num Chromium sem janela
//    (Playwright) e lê os cards já desenhados (npx playwright install chromium na 1ª vez).
// 2. Junta com o src/data/elenco.json pelo nome: quem já existe ganha o número e o endereço
//    da foto oficial (campo "foto"); quem é novo entra com overall 70 e "revisar": true.
// 3. Baixa a foto oficial de quem ainda não tem foto em public/jogadores/ ({id}.webp, .png ou .jpg)
//    e salva como public/jogadores/{id}.png.

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const URL_ELENCO = args.find((a) => a.startsWith("--url="))?.slice(6) ?? "https://atletico.com.br/futebol/masculino/elenco/";
const FORCAR = args.includes("--forcar");
const REMOVER = args.includes("--remover-ausentes");
const OFFLINE = args.includes("--offline");

const raiz = fileURLToPath(new URL("..", import.meta.url));
const ARQ_ELENCO = `${raiz}src/data/elenco.json`;
const PASTA_FOTOS = `${raiz}public/jogadores`;
const EXTENSOES = ["webp", "png", "jpg", "jpeg"];
const HEADERS = { "User-Agent": "Mozilla/5.0 (CoachGalo; projeto academico)" };

// ---------------------------------------------------------------
// Texto
// ---------------------------------------------------------------
const normalizar = (t = "") =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const slug = (t) => normalizar(t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const semTags = (t = "") =>
  t.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;|&rsquo;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// Posição do site -> posição usada no app (jogador novo; ajuste depois no elenco.json)
const POSICAO_SITE = { goleiro: "GOL", zagueiro: "ZAG", lateral: "LD", "meio-campista": "MC", atacante: "ATA" };
const posicaoDoSite = (t) => POSICAO_SITE[normalizar(t)] ?? "MC";

// ---------------------------------------------------------------
// 1a. Leitura do HTML estático
// ---------------------------------------------------------------
function lerHtml(html) {
  const blocos = html.split(/<div class="elenco-atleta">/).slice(1);
  return blocos
    .map((bloco) => {
      const card = bloco.split(/<div class="col">/)[0];
      const img = card.match(/<img\b[^>]*>/i)?.[0] ?? "";
      const src = img.match(/\b(?:data-src|src)\s*=\s*["']([^"']+)["']/i)?.[1];
      return {
        nome: semTags(card.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1]),
        numero: Number(semTags(card.match(/elenco-atleta-camisa[^>]*>([\s\S]*?)</i)?.[1])) || null,
        posicao: semTags(card.match(/elenco-atleta-posicao[^>]*>([\s\S]*?)</i)?.[1]),
        foto: src ? new URL(src, URL_ELENCO).href : null,
      };
    })
    .filter((j) => j.nome);
}

// ---------------------------------------------------------------
// 1b. Plano B: página montada por JavaScript (Playwright)
// ---------------------------------------------------------------
async function lerComNavegador() {
  const { chromium } = await import("playwright");
  const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const pagina = await navegador.newPage();
    await pagina.goto(URL_ELENCO, { waitUntil: "networkidle", timeout: 60000 });
    return await pagina.$$eval(".elenco-atleta", (cards) =>
      cards.map((c) => ({
        nome: c.querySelector("h4")?.textContent.trim() ?? "",
        numero: Number(c.querySelector(".elenco-atleta-camisa")?.textContent) || null,
        posicao: c.querySelector(".elenco-atleta-posicao")?.textContent.trim() ?? "",
        foto: c.querySelector("img")?.currentSrc || c.querySelector("img")?.src || null,
      }))
    );
  } finally {
    await navegador.close();
  }
}

// ---------------------------------------------------------------
// Fotos locais
// ---------------------------------------------------------------
const fotoLocal = (arquivos, id) => arquivos.find((a) => EXTENSOES.some((ext) => a.toLowerCase() === `${id}.${ext}`));

async function baixarFoto(url, id) {
  const resp = await fetch(url, { headers: HEADERS });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const bytes = Buffer.from(await resp.arrayBuffer());
  // Remove versões antigas ({id}.webp tem prioridade no app e esconderia a foto nova)
  for (const ext of EXTENSOES) await rm(`${PASTA_FOTOS}/${id}.${ext}`, { force: true });
  await writeFile(`${PASTA_FOTOS}/${id}.png`, bytes);
  return `${id}.png (${Math.round(bytes.length / 1024)} KB)`;
}

// Atributos iniciais de um jogador novo (mesmo modelo do elenco)
const MODELO = {
  GOL: { elasticidade: 2, manejo: -1, chute: -6, reflexos: 3, velocidade: -25, posicionamento: 1 },
  ZAG: { ritmo: -12, finalizacao: -35, passe: -12, drible: -15, defesa: 3, fisico: 4 },
  LD: { ritmo: 4, finalizacao: -18, passe: -3, drible: -1, defesa: -3, fisico: -2 },
  MC: { ritmo: -5, finalizacao: -8, passe: 2, drible: 0, defesa: -8, fisico: -3 },
  ATA: { ritmo: -2, finalizacao: 3, passe: -8, drible: -1, defesa: -38, fisico: 2 },
};
const atributos = (pos, overall) =>
  Object.fromEntries(Object.entries(MODELO[pos]).map(([k, v]) => [k, Math.max(20, Math.min(95, overall + v))]));

// ---------------------------------------------------------------
// Principal
// ---------------------------------------------------------------
await mkdir(PASTA_FOTOS, { recursive: true });
const elenco = JSON.parse(await readFile(ARQ_ELENCO, "utf8"));
let alterouElenco = false;

if (!OFFLINE) {
  console.log(`🌐 Lendo ${URL_ELENCO}`);
  let site = [];
  try {
    const resp = await fetch(URL_ELENCO, { headers: HEADERS });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    site = lerHtml(await resp.text());
  } catch (erro) {
    console.warn(`⚠️  Não deu para ler o HTML (${erro.message}).`);
  }
  if (site.length === 0) {
    console.log("🧭 Nenhum card no HTML: abrindo a página no Chromium (Playwright)...");
    try {
      site = await lerComNavegador();
    } catch (erro) {
      console.error(`❌ Playwright falhou: ${erro.message}\n   Rode "npx playwright install chromium" e tente de novo.`);
    }
  }
  if (site.length === 0) {
    console.error("❌ Nenhum jogador encontrado no site. Nada foi alterado.");
    process.exit(1);
  }
  console.log(`👥 ${site.length} jogadores no site.`);

  // Junta pelo nome (como aparece no site), nome completo ou id
  const chave = new Map();
  elenco.jogadores.forEach((j) => [j.nome, j.nomeCompleto, j.id.replace(/-/g, " ")].forEach((n) => n && chave.set(normalizar(n), j)));

  const vistos = new Set();
  for (const s of site) {
    let jogador = chave.get(normalizar(s.nome)) ?? elenco.jogadores.find((j) => j.id === slug(s.nome));
    if (!jogador) {
      const pos = posicaoDoSite(s.posicao);
      jogador = {
        id: slug(s.nome), nome: s.nome, nomeCompleto: s.nome, numero: s.numero, posicao: pos, secundarias: [],
        nacionalidade: null, nascimento: null, overall: 70, atributos: atributos(pos, 70), foto: s.foto, revisar: true,
      };
      elenco.jogadores.push(jogador);
      console.log(`  ➕ novo: ${s.nome} (${s.posicao}). Revise posição, overall e atributos no elenco.json`);
    }
    vistos.add(jogador.id);
    if (s.numero && jogador.numero !== s.numero) {
      console.log(`  🔢 ${jogador.nome}: camisa ${jogador.numero ?? "-"} -> ${s.numero}`);
      jogador.numero = s.numero;
    }
    if (s.foto && jogador.foto !== s.foto) jogador.foto = s.foto;
  }

  const ausentes = elenco.jogadores.filter((j) => !vistos.has(j.id));
  if (ausentes.length) {
    console.log(`\n🚪 Não aparecem mais no site: ${ausentes.map((j) => j.nome).join(", ")}`);
    if (REMOVER) {
      elenco.jogadores = elenco.jogadores.filter((j) => vistos.has(j.id));
      console.log("   Removidos do elenco.json (--remover-ausentes).");
    } else console.log("   Para tirá-los do elenco: npm run fotos -- --remover-ausentes");
  }

  elenco.meta.fonte = "Site oficial do Atlético";
  elenco.meta.atualizadoEm = new Date().toISOString().slice(0, 10);
  alterouElenco = true;

  // Fotos
  const arquivos = await readdir(PASTA_FOTOS);
  let baixadas = 0;
  for (const j of elenco.jogadores) {
    if (!j.foto || !/^https?:/.test(j.foto)) continue;
    if (fotoLocal(arquivos, j.id) && !FORCAR) continue;
    try {
      console.log(`  📸 ${j.nome} -> public/jogadores/${await baixarFoto(j.foto, j.id)}`);
      baixadas += 1;
    } catch (erro) {
      console.warn(`  ⚠️  foto de ${j.nome}: ${erro.message}`);
    }
  }
  console.log(baixadas ? `\n📥 ${baixadas} foto(s) baixada(s).` : "\n📥 Todas as fotos já estavam em public/jogadores/.");
}

if (alterouElenco) await writeFile(ARQ_ELENCO, `${JSON.stringify(elenco, null, 2)}\n`);

const arquivos = await readdir(PASTA_FOTOS);
const semFoto = elenco.jogadores.filter((j) => !fotoLocal(arquivos, j.id));
console.log(`\n✅ ${elenco.jogadores.length} jogadores, ${elenco.jogadores.length - semFoto.length} com foto em public/jogadores/.`);
if (semFoto.length) console.log(`   Sem foto local (o app usa a do site): ${semFoto.map((j) => j.nome).join(", ")}`);
