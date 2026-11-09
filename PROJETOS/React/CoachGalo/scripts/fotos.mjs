// fotos.mjs
// Baixa as fotos oficiais do elenco no site do Atlético e sincroniza o elenco 2026.
//
//   npm run fotos                        lê o site, baixa as fotos e atualiza src/data/elenco.json
//   npm run fotos -- --forcar            baixa de novo mesmo as fotos que já existem
//   npm run fotos -- --remover-ausentes  tira do elenco.json quem não está mais no site
//   npm run fotos -- --offline           não acessa a internet: só registra as fotos
//                                        que você salvou à mão em public/jogadores/{id}.png|jpg|webp
//
// Como funciona:
// 1. Baixa o HTML de https://atletico.com.br/futebol/masculino/elenco/ e procura os cards
//    dos jogadores (imagem + nome + posição).
// 2. Se o HTML vier "vazio" (página montada por JavaScript), abre a página num Chromium
//    sem janela (Playwright) e lê os cards já desenhados. Na primeira vez:
//    npx playwright install chromium
// 3. Junta com o src/data/elenco.json pelo nome (sem acento): quem já existe ganha a foto
//    e o número; quem é novo entra com overall 70 e "revisar": true (ajuste os atributos).
// 4. Salva as fotos em public/jogadores/{id}.{ext} e grava o caminho no campo "foto".

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const URL_ELENCO = "https://atletico.com.br/futebol/masculino/elenco/";
const raiz = fileURLToPath(new URL("..", import.meta.url));
const ARQ_ELENCO = `${raiz}src/data/elenco.json`;
const PASTA_FOTOS = `${raiz}public/jogadores`;
const CACHE = `${raiz}.cache`;

const args = new Set(process.argv.slice(2));
const FORCAR = args.has("--forcar");
const REMOVER = args.has("--remover-ausentes");
const OFFLINE = args.has("--offline");

const HEADERS = { "User-Agent": "Mozilla/5.0 (CoachGalo; projeto academico)", Accept: "text/html,image/*" };

// ---------------------------------------------------------------
// Texto
// ---------------------------------------------------------------
const normalizar = (t = "") => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const slug = (t) => normalizar(t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const decodificar = (t = "") =>
  t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).trim();

// Palavra da posição no site -> código usado no app
const POSICAO_TEXTO = [
  [/goleir/, "GOL"],
  [/zagueir|defensor/, "ZAG"],
  [/lateral.*dir/, "LD"],
  [/lateral.*esq/, "LE"],
  [/lateral/, "LD"],
  [/volant/, "VOL"],
  [/meia|meio|armador/, "MC"],
  [/ponta|extremo/, "PD"],
  [/atacant|centroavant/, "ATA"],
];
const posicaoDoTexto = (t) => POSICAO_TEXTO.find(([re]) => re.test(normalizar(t)))?.[1] ?? null;

// ---------------------------------------------------------------
// 1. Leitura do site (HTML estático)
// ---------------------------------------------------------------
function lerHtml(html) {
  const jogadores = [];
  // Seções da página ("Goleiros", "Zagueiros"...): guardamos onde cada uma começa
  const secoes = [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((m) => ({ pos: posicaoDoTexto(m[1].replace(/<[^>]+>/g, "")), inicio: m.index }))
    .filter((s) => s.pos);

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const attr = (nome) => tag.match(new RegExp(`\\b${nome}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];
    const src = attr("data-src") || attr("data-lazy-src") || attr("src") || attr("srcset")?.split(/\s/)[0];
    if (!src || /logo|icon|escudo|patrocin|sprite|\.svg/i.test(src)) continue;

    // Texto logo depois da imagem (nome, número, posição do card)
    const depois = html.slice(m.index + tag.length, m.index + tag.length + 600).replace(/<[^>]+>/g, "\n");
    const linhas = depois.split("\n").map(decodificar).filter(Boolean).slice(0, 4);
    const alt = decodificar(attr("alt") || attr("title") || "");
    const nome = alt && !/foto|imagem|image/i.test(alt) ? alt : linhas.find((l) => /[a-zà-ú]{2}/i.test(l) && !posicaoDoTexto(l));
    if (!nome || nome.length > 40) continue;

    const numero = Number(linhas.find((l) => /^\d{1,2}$/.test(l))) || null;
    const secao = secoes.filter((s) => s.inicio < m.index).at(-1);
    const posicao = linhas.map(posicaoDoTexto).find(Boolean) ?? secao?.pos ?? null;
    jogadores.push({ nome, numero, posicao, foto: new URL(src, URL_ELENCO).href });
  }
  return jogadores;
}

// ---------------------------------------------------------------
// 2. Leitura com o navegador (página montada por JavaScript)
// ---------------------------------------------------------------
async function lerComNavegador() {
  const { chromium } = await import("playwright");
  const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const pagina = await navegador.newPage({ userAgent: HEADERS["User-Agent"] });
    await pagina.goto(URL_ELENCO, { waitUntil: "networkidle", timeout: 60000 });
    // Rola até o fim para carregar as imagens "lazy"
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    return await pagina.evaluate(() => {
      const titulos = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
      return [...document.querySelectorAll("img")]
        .map((img) => {
          const src = img.currentSrc || img.src || img.dataset.src;
          if (!src || /logo|icon|escudo|patrocin|\.svg/i.test(src) || img.naturalWidth < 80) return null;
          // Sobe até achar o "card": um bloco com pouco texto
          let card = img.parentElement;
          for (let i = 0; i < 5 && card && card.innerText.trim().length < 3; i += 1) card = card.parentElement;
          const linhas = (card?.innerText ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
          if (!linhas.length || linhas.join(" ").length > 120) return null;
          const secao = titulos.filter((h) => h.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING).at(-1);
          return { linhas, alt: img.alt, src, secao: secao?.innerText ?? "" };
        })
        .filter(Boolean);
    });
  } finally {
    await navegador.close();
  }
}

const deCardsDoNavegador = (cards) =>
  cards
    .map(({ linhas, alt, src, secao }) => {
      const nome = (alt && !/foto|imagem|image/i.test(alt) ? alt : null) ??
        linhas.find((l) => /[a-zà-ú]{2}/i.test(l) && !posicaoDoTexto(l));
      return {
        nome,
        numero: Number(linhas.find((l) => /^\d{1,2}$/.test(l))) || null,
        posicao: linhas.map(posicaoDoTexto).find(Boolean) ?? posicaoDoTexto(secao),
        foto: src,
      };
    })
    .filter((j) => j.nome && j.nome.length <= 40);

// ---------------------------------------------------------------
// 3. Download das fotos
// ---------------------------------------------------------------
async function baixarFoto(url, id) {
  const resp = await fetch(url, { headers: HEADERS });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const tipo = resp.headers.get("content-type") ?? "";
  const ext = tipo.includes("webp") ? "webp" : tipo.includes("png") ? "png" : "jpg";
  const destino = `${PASTA_FOTOS}/${id}.${ext}`;
  await writeFile(destino, Buffer.from(await resp.arrayBuffer()));
  return `jogadores/${id}.${ext}`;
}

// Atributos iniciais de um jogador novo (o mesmo modelo do elenco base)
const MODELO = {
  GOL: { elasticidade: 2, manejo: -1, chute: -6, reflexos: 3, velocidade: -25, posicionamento: 1 },
  ZAG: { ritmo: -12, finalizacao: -35, passe: -12, drible: -15, defesa: 3, fisico: 4 },
  LD: { ritmo: 4, finalizacao: -18, passe: -3, drible: -1, defesa: -3, fisico: -2 },
  VOL: { ritmo: -8, finalizacao: -15, passe: -1, drible: -5, defesa: 1, fisico: 2 },
  MC: { ritmo: -5, finalizacao: -8, passe: 2, drible: 0, defesa: -8, fisico: -3 },
  PD: { ritmo: 7, finalizacao: -3, passe: -4, drible: 3, defesa: -35, fisico: -10 },
  ATA: { ritmo: -2, finalizacao: 3, passe: -8, drible: -1, defesa: -38, fisico: 2 },
};
const atributos = (pos, overall) =>
  Object.fromEntries(Object.entries(MODELO[pos] ?? MODELO.MC).map(([k, v]) => [k, Math.max(20, Math.min(95, overall + v))]));

// ---------------------------------------------------------------
// Principal
// ---------------------------------------------------------------
await mkdir(PASTA_FOTOS, { recursive: true });
const elenco = JSON.parse(await readFile(ARQ_ELENCO, "utf8"));
const porNome = new Map();
elenco.jogadores.forEach((j) => {
  [j.nome, j.nomeCompleto, j.id.replace(/-/g, " ")].filter(Boolean).forEach((n) => porNome.set(normalizar(n), j));
});
const encontrar = (nome) => {
  const n = normalizar(nome);
  return porNome.get(n) ?? elenco.jogadores.find((j) => normalizar(j.nomeCompleto ?? "").includes(n) || n.includes(normalizar(j.nome)));
};

if (!OFFLINE) {
  console.log(`🌐 Lendo ${URL_ELENCO}`);
  let site = [];
  try {
    const html = await (await fetch(URL_ELENCO, { headers: HEADERS })).text();
    await mkdir(CACHE, { recursive: true });
    await writeFile(`${CACHE}/elenco-site.html`, html); // para conferir, se algo der errado
    site = lerHtml(html);
  } catch (erro) {
    console.warn(`⚠️  Não deu para baixar o HTML (${erro.message}).`);
  }
  if (site.length < 11) {
    console.log("🧭 Poucos jogadores no HTML: abrindo a página no Chromium (Playwright)...");
    try {
      site = deCardsDoNavegador(await lerComNavegador());
    } catch (erro) {
      console.error(`❌ Playwright falhou: ${erro.message}\n   Rode "npx playwright install chromium" e tente de novo.`);
    }
  }

  // Sem repetidos (o mesmo jogador pode ter duas imagens no card)
  site = [...new Map(site.map((j) => [normalizar(j.nome), j])).values()];
  console.log(`👥 ${site.length} jogadores encontrados no site.`);

  const vistos = new Set();
  for (const s of site) {
    let jogador = encontrar(s.nome);
    if (!jogador) {
      const pos = s.posicao ?? "MC";
      jogador = {
        id: slug(s.nome), nome: s.nome, nomeCompleto: s.nome, numero: s.numero, posicao: pos, secundarias: [],
        nacionalidade: null, nascimento: null, overall: 70, atributos: atributos(pos, 70), foto: null, espnId: null, revisar: true,
      };
      elenco.jogadores.push(jogador);
      console.log(`  ➕ novo: ${s.nome} (${pos}) - revise posição e overall no elenco.json`);
    }
    vistos.add(jogador.id);
    if (s.numero) jogador.numero = s.numero;

    const jaTem = jogador.foto && !/^https?:/.test(jogador.foto) && existsSync(`${raiz}public/${jogador.foto}`);
    if (s.foto && (!jaTem || FORCAR)) {
      try {
        jogador.foto = await baixarFoto(s.foto, jogador.id);
        console.log(`  📸 ${jogador.nome} -> public/${jogador.foto}`);
      } catch (erro) {
        console.warn(`  ⚠️  foto de ${jogador.nome}: ${erro.message}`);
      }
    }
  }

  if (site.length) {
    const ausentes = elenco.jogadores.filter((j) => !vistos.has(j.id));
    if (ausentes.length) {
      console.log(`\n🚪 Não aparecem no site: ${ausentes.map((j) => j.nome).join(", ")}`);
      if (REMOVER) {
        elenco.jogadores = elenco.jogadores.filter((j) => vistos.has(j.id));
        console.log("   Removidos do elenco.json (--remover-ausentes).");
      } else console.log('   Para tirá-los do elenco: npm run fotos -- --remover-ausentes');
    }
    elenco.meta.fonte = "Site oficial do Atlético";
    elenco.meta.atualizadoEm = new Date().toISOString().slice(0, 10);
  }
}

// Fotos salvas à mão em public/jogadores/{id}.png|jpg|jpeg|webp
const arquivos = await readdir(PASTA_FOTOS);
elenco.jogadores.forEach((j) => {
  const arquivo = arquivos.find((a) => new RegExp(`^${j.id}\\.(png|jpe?g|webp)$`, "i").test(a));
  if (arquivo) j.foto = `jogadores/${arquivo}`;
  // URL oficial fica como está; caminho local que não existe mais volta para a silhueta
  else if (j.foto && !/^https?:/.test(j.foto) && !existsSync(`${raiz}public/${j.foto}`)) j.foto = null;
});

await writeFile(ARQ_ELENCO, `${JSON.stringify(elenco, null, 2)}\n`);
const comFoto = elenco.jogadores.filter((j) => j.foto).length;
console.log(`\n✅ elenco.json salvo: ${elenco.jogadores.length} jogadores, ${comFoto} com foto.`);
