// gerar-exemplos.mjs
// Gera as imagens de public/exemplos/ com o provedor do .env.local (GPT Image ou Gemini),
// usando os MESMOS prompts do app.
//
//   npm run exemplos                       -> gera os 6 exemplos
//   npm run exemplos -- aquarela-pena      -> gera só um (ou vários, separados por espaço)
//
// Lê VITE_IMAGE_PROVIDER e a chave do provedor do .env.local.
// Roda no Node (18 ou mais novo), fora do navegador. Cada imagem é cobrada.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EXAMPLES, FORMATS, findById } from "../src/config/tattooOptions.js";
import { buildTattooPrompt } from "../src/services/promptBuilder.js";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAUSA_MS = 3000; // folga entre uma imagem e outra (limite de imagens por minuto)

/* ---------- .env.local ---------- */

async function lerEnv() {
  const env = {};
  for (const arquivo of [".env", ".env.local"]) {
    try {
      const texto = await readFile(join(RAIZ, arquivo), "utf8");
      for (const linha of texto.split(/\r?\n/)) {
        const achou = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (achou) env[achou[1]] = achou[2].replace(/^["']|["']$/g, "");
      }
    } catch {
      // arquivo não existe: segue
    }
  }
  return { ...env, ...process.env };
}

const pararCom = (mensagem, parar) => Object.assign(new Error(mensagem), { parar });

async function chamar(url, opcoes) {
  try {
    return await fetch(url, opcoes);
  } catch (erro) {
    throw new Error(`sem conexão (${erro.cause?.code ?? erro.message})`);
  }
}

/* ---------- OpenAI (GPT Image) ---------- */

async function gerarOpenAI({ env, prompt, formato }) {
  const chave = (env.VITE_OPENAI_API_KEY ?? env.OPENAI_API_KEY ?? "").trim();
  const modelo = (env.VITE_OPENAI_IMAGE_MODEL ?? "").trim() || "gpt-image-1";
  const qualidadeEnv = (env.VITE_OPENAI_IMAGE_QUALITY ?? "").trim();
  const qualidade = ["low", "medium", "high"].includes(qualidadeEnv) ? qualidadeEnv : "medium";
  if (!chave) throw pararCom("falta VITE_OPENAI_API_KEY no .env.local", true);

  const resposta = await chamar("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${chave}` },
    body: JSON.stringify({ model: modelo, prompt, n: 1, size: formato.size, quality: qualidade, output_format: "png" }),
  });

  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const codigo = json?.error?.code ?? "";
    const parar =
      [401, 403].includes(resposta.status) || ["insufficient_quota", "billing_hard_limit_reached"].includes(codigo);
    throw pararCom(`HTTP ${resposta.status}: ${json?.error?.message ?? "erro desconhecido"}`, parar);
  }
  const base64 = json.data?.[0]?.b64_json;
  if (!base64) throw new Error("a OpenAI não devolveu imagem");
  return Buffer.from(base64, "base64");
}

/* ---------- Google Gemini ---------- */

async function gerarGemini({ env, prompt, formato }) {
  const chave = (env.VITE_GEMINI_API_KEY ?? "").trim();
  const modelo = (env.VITE_GEMINI_IMAGE_MODEL ?? "").trim() || "gemini-2.5-flash-image";
  if (!chave) throw pararCom("falta VITE_GEMINI_API_KEY no .env.local", true);

  const resposta = await chamar(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: formato.aspectRatio } },
      }),
    }
  );

  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const mensagem = json?.error?.message ?? "erro desconhecido";
    if (resposta.status === 429 && /free_tier[\s\S]*limit: 0/.test(mensagem)) {
      throw pararCom("o Gemini não tem cota gratuita para imagens (limit: 0). Ative o faturamento no AI Studio.", true);
    }
    throw pararCom(`HTTP ${resposta.status}: ${mensagem.split("\n")[0]}`, [400, 401, 403].includes(resposta.status));
  }
  const partes = json.candidates?.[0]?.content?.parts ?? [];
  const imagem = partes.find((parte) => parte.inlineData?.data || parte.inline_data?.data);
  if (!imagem) throw new Error(`o Gemini não devolveu imagem (${json.candidates?.[0]?.finishReason ?? "?"})`);
  return Buffer.from((imagem.inlineData ?? imagem.inline_data).data, "base64");
}

/* ---------- Principal ---------- */

const env = await lerEnv();
const provedor = (env.VITE_IMAGE_PROVIDER ?? "").trim().toLowerCase() === "gemini" ? "gemini" : "openai";
const gerar = provedor === "gemini" ? gerarGemini : gerarOpenAI;

const pedidos = process.argv.slice(2);
const exemplos = pedidos.length ? EXAMPLES.filter((exemplo) => pedidos.includes(exemplo.id)) : EXAMPLES;

if (exemplos.length === 0) {
  console.error(`❌ Nenhum exemplo com esse id. Use um destes: ${EXAMPLES.map((e) => e.id).join(", ")}`);
  process.exit(1);
}

console.log(`🖋️  Gerando ${exemplos.length} exemplo(s) com o ${provedor === "gemini" ? "Gemini" : "GPT Image"}...\n`);
let falhas = 0;

for (const [indice, exemplo] of exemplos.entries()) {
  const prompt = buildTattooPrompt(exemplo);
  const formato = findById(FORMATS, exemplo.formato);
  const destino = join(RAIZ, "public", exemplo.src);

  try {
    await writeFile(destino, await gerar({ env, prompt, formato }));
    console.log(`✅ ${exemplo.id} -> public${exemplo.src}`);
  } catch (erro) {
    falhas++;
    console.error(`❌ ${exemplo.id}: ${erro.message}`);
    if (erro.parar) process.exit(1);
  }

  if (indice < exemplos.length - 1) await new Promise((r) => setTimeout(r, PAUSA_MS));
}

console.log(
  falhas
    ? `\n${falhas} falha(s). Rode de novo só as que faltaram: npm run exemplos -- <id>`
    : "\nPronto! Os novos exemplos já aparecem no npm run dev."
);
process.exit(falhas ? 1 : 0);
