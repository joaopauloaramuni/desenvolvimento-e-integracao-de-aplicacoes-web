// dados.mjs
// Baixa o GTFS estático da BHTrans e transforma em arquivos JSON pequenos,
// que o site lê direto de public/data (sem back-end):
//
//   public/data/linhas.json            → índice de todas as linhas (busca)
//   public/data/linhas/<id>.json       → uma linha: sentidos, traçado, pontos e horários
//   public/data/campus.json            → linhas que passam perto de cada campus da PUC
//
// Uso:
//   npm run dados                      → baixa o GTFS e gera tudo
//   npm run dados -- --arquivo gtfs.zip  → usa um .zip que você já baixou
//   node scripts/dados.mjs --se-faltar → só roda se public/data/linhas.json não existir
//                                        (é o que o predev e o prebuild fazem)
//
// A URL do GTFS fica em src/config/appConfig.js e pode ser trocada com a
// variável de ambiente PBH_GTFS_URL.

import { createWriteStream, existsSync } from "node:fs";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import readline from "node:readline";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import yauzl from "yauzl";
import { CAMPI, DADOS } from "../src/config/appConfig.js";
import { distanciaM, simplificar } from "../src/core/geometria.js";
import { compararCodigo, titulo } from "../src/core/texto.js";

const raiz = (caminho) => fileURLToPath(new URL(`../${caminho}`, import.meta.url));
const SAIDA = raiz("public/data");
const SAIDA_LINHAS = raiz("public/data/linhas");
const CACHE = raiz(".cache");
const ZIP_PADRAO = raiz(".cache/gtfs.zip");

const args = process.argv.slice(2);
const opcao = (nome) => {
  const i = args.indexOf(nome);
  return i === -1 ? null : (args[i + 1] ?? "");
};

/* =====================================================================
   1. Download
   ===================================================================== */

async function baixarGtfs() {
  const local = opcao("--arquivo");
  if (local) return local;

  const url = process.env.PBH_GTFS_URL || DADOS.GTFS_URL;
  console.log(`⬇️  Baixando o GTFS: ${url}`);
  await mkdir(CACHE, { recursive: true });
  const resposta = await fetch(url, {
    headers: { "User-Agent": "OnibusBH-React (projeto didatico PUC Minas)" },
    signal: AbortSignal.timeout(180_000),
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ao baixar o GTFS`);
  await pipeline(Readable.fromWeb(resposta.body), createWriteStream(ZIP_PADRAO));
  const { size } = await stat(ZIP_PADRAO);
  console.log(`   ${(size / 1024 / 1024).toFixed(1)} MB salvos em .cache/gtfs.zip`);
  return ZIP_PADRAO;
}

/* =====================================================================
   2. Leitura do .zip e dos CSVs (em streaming: o stop_times tem milhões de linhas)
   ===================================================================== */

function abrirZip(caminho) {
  return new Promise((resolve, reject) => {
    yauzl.open(caminho, { lazyEntries: true, autoClose: false }, (erro, zip) => {
      if (erro) return reject(erro);
      const arquivos = new Map();
      zip.on("entry", (entrada) => {
        // Alguns GTFS vêm dentro de uma pasta: guardamos só o nome do arquivo
        const nome = entrada.fileName.split("/").pop().toLowerCase();
        if (nome.endsWith(".txt")) arquivos.set(nome, entrada);
        zip.readEntry();
      });
      zip.on("end", () => resolve({ zip, arquivos }));
      zip.on("error", reject);
      zip.readEntry();
    });
  });
}

// Divide uma linha de CSV respeitando aspas ("Av. Amazonas, 100")
function dividirCsv(linha) {
  if (!linha.includes('"')) return linha.split(",");
  const campos = [];
  let atual = "";
  let aspas = false;
  for (let i = 0; i < linha.length; i += 1) {
    const c = linha[i];
    if (aspas) {
      if (c === '"' && linha[i + 1] === '"') {
        atual += '"';
        i += 1;
      } else if (c === '"') aspas = false;
      else atual += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") {
      campos.push(atual);
      atual = "";
    } else atual += c;
  }
  campos.push(atual);
  return campos;
}

/** Lê um arquivo do GTFS linha a linha: aoLer(campo) recebe uma função campo("nome"). */
async function lerCsv({ zip, arquivos }, nome, aoLer) {
  const entrada = arquivos.get(nome);
  if (!entrada) return false;
  const fluxo = await new Promise((resolve, reject) =>
    zip.openReadStream(entrada, (erro, s) => (erro ? reject(erro) : resolve(s)))
  );
  const leitor = readline.createInterface({ input: fluxo, crlfDelay: Infinity });
  let indice = null;
  let valores = [];
  const campo = (coluna) => {
    const i = indice.get(coluna);
    return i === undefined ? "" : (valores[i] ?? "").trim();
  };
  for await (const linha of leitor) {
    if (!linha.trim()) continue;
    if (!indice) {
      const cabecalho = dividirCsv(linha.replace(/^\uFEFF/, "")).map((c) => c.trim().toLowerCase());
      indice = new Map(cabecalho.map((c, i) => [c, i]));
      continue;
    }
    valores = dividirCsv(linha);
    aoLer(campo);
  }
  return true;
}

// "05:10:00" -> 310 (minutos). Aceita horas acima de 24 ("25:05:00").
function minutos(hhmmss) {
  const [h, m] = hhmmss.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}

// Moda (valor mais frequente) de um Map valor -> contagem
function maisFrequente(contagem) {
  let melhor = null;
  let max = -1;
  for (const [valor, n] of contagem) {
    if (n > max) {
      melhor = valor;
      max = n;
    }
  }
  return melhor;
}

// Minutos de cada ponto depois do primeiro. O GTFS pode deixar horários em branco
// nos pontos intermediários: preenchemos por interpolação entre os conhecidos.
function minutosDesdeAPartida(horarios) {
  const conhecidos = horarios.map((h, i) => [i, h]).filter(([, h]) => h !== null);
  if (!conhecidos.length) return horarios.map(() => 0);
  const base = conhecidos[0][1];
  const resultado = horarios.map((h) => (h === null ? null : h - base));
  for (let k = 0; k < conhecidos.length - 1; k += 1) {
    const [i0, h0] = conhecidos[k];
    const [i1, h1] = conhecidos[k + 1];
    for (let i = i0 + 1; i < i1; i += 1) resultado[i] = Math.round(h0 - base + ((h1 - h0) * (i - i0)) / (i1 - i0));
  }
  return resultado.map((m) => (m === null ? (conhecidos.at(-1)[1] - base) : Math.max(0, m)));
}

const contar = (mapa, valor) => mapa.set(valor, (mapa.get(valor) ?? 0) + 1);
const arredondar = (n) => Math.round(n * 1e5) / 1e5; // 5 casas ≈ 1 m
const idDeArquivo = (id) => id.replace(/[^A-Za-z0-9_-]/g, "_");

/* =====================================================================
   3. Calendário: qual tabela (dia útil, sábado, domingo) cada serviço atende
   ===================================================================== */

function hojeAAAAMMDD() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function tipoDaData(aaaammdd) {
  const ano = Number(aaaammdd.slice(0, 4));
  const mes = Number(aaaammdd.slice(4, 6));
  const dia = Number(aaaammdd.slice(6, 8));
  const semana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
  return semana === 0 ? "domingo" : semana === 6 ? "sabado" : "util";
}

// Última tentativa: o nome do serviço costuma dizer ("DU", "SAB", "DOM")
function tipoPeloNome(serviceId) {
  const s = serviceId.toLowerCase();
  if (/sab|sat/.test(s)) return "sabado";
  if (/dom|sun|fer|hol/.test(s)) return "domingo";
  return "util";
}

async function lerCalendario(gtfs) {
  const hoje = hojeAAAAMMDD();
  const linhas = [];
  await lerCsv(gtfs, "calendar.txt", (c) => {
    linhas.push({
      id: c("service_id"),
      fim: c("end_date"),
      util: ["monday", "tuesday", "wednesday", "thursday", "friday"].some((d) => c(d) === "1"),
      sabado: c("saturday") === "1",
      domingo: c("sunday") === "1",
    });
  });
  // Se houver versões antigas e novas do calendário, fica só com as vigentes
  const vigentes = linhas.filter((l) => !l.fim || l.fim >= hoje);
  const servicos = new Map();
  for (const l of vigentes.length ? vigentes : linhas) {
    const tipos = servicos.get(l.id) ?? new Set();
    for (const t of ["util", "sabado", "domingo"]) if (l[t]) tipos.add(t);
    servicos.set(l.id, tipos);
  }

  // calendar_dates.txt: serviços que só existem como lista de datas
  const datas = new Map();
  await lerCsv(gtfs, "calendar_dates.txt", (c) => {
    if (c("exception_type") !== "1") return;
    const id = c("service_id");
    if (servicos.get(id)?.size) return;
    if (!datas.has(id)) datas.set(id, []);
    datas.get(id).push(c("date"));
  });
  for (const [id, lista] of datas) {
    const futuras = lista.filter((d) => d >= hoje);
    const tipos = new Set((futuras.length ? futuras : lista).map(tipoDaData));
    servicos.set(id, tipos);
  }
  return servicos;
}

/* =====================================================================
   4. Processamento
   ===================================================================== */

async function processar(caminhoZip) {
  const inicio = Date.now();
  const gtfs = await abrirZip(caminhoZip);
  const obrigatorios = ["routes.txt", "trips.txt", "stops.txt", "stop_times.txt"];
  const faltando = obrigatorios.filter((n) => !gtfs.arquivos.has(n));
  if (faltando.length) throw new Error(`O .zip não parece um GTFS: faltam ${faltando.join(", ")}`);

  // ---------- routes.txt ----------
  const rotas = new Map();
  await lerCsv(gtfs, "routes.txt", (c) => {
    const id = c("route_id");
    const cor = c("route_color").replace("#", "");
    rotas.set(id, {
      id,
      codigo: c("route_short_name") || id,
      nome: titulo(c("route_long_name") || c("route_desc")),
      cor: /^[0-9a-f]{6}$/i.test(cor) && cor.toLowerCase() !== "ffffff" ? `#${cor}` : null,
    });
  });
  console.log(`🚌 ${rotas.size} linhas em routes.txt`);

  // ---------- calendar ----------
  const servicos = await lerCalendario(gtfs);
  const tiposDoServico = (id) => {
    const t = servicos.get(id);
    return t?.size ? [...t] : [tipoPeloNome(id)];
  };

  // ---------- trips.txt ----------
  const viagens = new Map();
  await lerCsv(gtfs, "trips.txt", (c) => {
    const rota = c("route_id");
    if (!rotas.has(rota)) return;
    const servico = c("service_id");
    if (servicos.has(servico) && servicos.get(servico).size === 0) return; // serviço sem dias
    const direcao = c("direction_id");
    const destino = c("trip_headsign");
    viagens.set(c("trip_id"), {
      rota,
      servico,
      sentido: direcao !== "" ? `d${direcao}` : `h${destino || "0"}`,
      destino,
      tracado: c("shape_id"),
      primeiraSeq: Infinity,
      partida: null,
      paradas: 0,
    });
  });
  console.log(`🧭 ${viagens.size} viagens em trips.txt`);

  // ---------- frequencies.txt (opcional): viagens "a cada N minutos" ----------
  const frequencias = new Map();
  await lerCsv(gtfs, "frequencies.txt", (c) => {
    const id = c("trip_id");
    if (!viagens.has(id)) return;
    if (!frequencias.has(id)) frequencias.set(id, []);
    frequencias.get(id).push({
      inicio: minutos(c("start_time")),
      fim: minutos(c("end_time")),
      intervalo: Math.max(1, Math.round(Number(c("headway_secs")) / 60)),
    });
  });

  // ---------- stops.txt ----------
  const pontos = new Map();
  await lerCsv(gtfs, "stops.txt", (c) => {
    const lat = Number(c("stop_lat"));
    const lon = Number(c("stop_lon"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) return;
    pontos.set(c("stop_id"), { nome: titulo(c("stop_name")) || c("stop_id"), lon: arredondar(lon), lat: arredondar(lat) });
  });
  console.log(`🚏 ${pontos.size} pontos em stops.txt`);

  // ---------- stop_times.txt, 1ª passada: horário de partida de cada viagem ----------
  console.log("⏱️  Lendo stop_times.txt (1ª passada: partidas)...");
  await lerCsv(gtfs, "stop_times.txt", (c) => {
    const v = viagens.get(c("trip_id"));
    if (!v) return;
    v.paradas += 1;
    const seq = Number(c("stop_sequence"));
    if (seq < v.primeiraSeq) {
      v.primeiraSeq = seq;
      v.partida = minutos(c("departure_time") || c("arrival_time"));
    }
  });

  // ---------- Agrupa por linha e sentido ----------
  const grupos = new Map(); // rota -> sentido -> grupo
  for (const [tripId, v] of viagens) {
    if (!v.paradas) continue;
    if (!grupos.has(v.rota)) grupos.set(v.rota, new Map());
    const porSentido = grupos.get(v.rota);
    if (!porSentido.has(v.sentido)) {
      porSentido.set(v.sentido, { destinos: new Map(), tracados: new Map(), viagens: [], horarios: { util: new Set(), sabado: new Set(), domingo: new Set() } });
    }
    const g = porSentido.get(v.sentido);
    g.viagens.push(tripId);
    if (v.destino) contar(g.destinos, v.destino);
    if (v.tracado) contar(g.tracados, v.tracado);

    const partidas = frequencias.has(tripId)
      ? frequencias.get(tripId).flatMap(({ inicio, fim, intervalo }) => {
          const lista = [];
          for (let m = inicio; m < fim; m += intervalo) lista.push(m);
          return lista;
        })
      : [v.partida];
    for (const tipo of tiposDoServico(v.servico)) {
      for (const p of partidas) if (p !== null) g.horarios[tipo].add(p);
    }
  }

  // Viagem "representante" de cada sentido: a do traçado mais comum, com mais paradas
  const representantes = new Set();
  const tracadosUsados = new Set();
  for (const porSentido of grupos.values()) {
    for (const g of porSentido.values()) {
      g.tracado = maisFrequente(g.tracados);
      let melhor = null;
      for (const id of g.viagens) {
        const v = viagens.get(id);
        if (g.tracado && v.tracado !== g.tracado) continue;
        if (!melhor || v.paradas > viagens.get(melhor).paradas) melhor = id;
      }
      g.representante = melhor ?? g.viagens[0];
      representantes.add(g.representante);
      if (g.tracado) tracadosUsados.add(g.tracado);
    }
  }

  // ---------- stop_times.txt, 2ª passada: a sequência de pontos das representantes ----------
  console.log("⏱️  Lendo stop_times.txt (2ª passada: pontos de cada sentido)...");
  const sequencias = new Map();
  await lerCsv(gtfs, "stop_times.txt", (c) => {
    const id = c("trip_id");
    if (!representantes.has(id)) return;
    if (!sequencias.has(id)) sequencias.set(id, []);
    sequencias.get(id).push([Number(c("stop_sequence")), c("stop_id"), minutos(c("arrival_time") || c("departure_time"))]);
  });

  // ---------- shapes.txt (opcional): o desenho da rota pelas ruas ----------
  const tracados = new Map();
  await lerCsv(gtfs, "shapes.txt", (c) => {
    const id = c("shape_id");
    if (!tracadosUsados.has(id)) return;
    if (!tracados.has(id)) tracados.set(id, []);
    tracados.get(id).push([Number(c("shape_pt_sequence")), Number(c("shape_pt_lon")), Number(c("shape_pt_lat"))]);
  });

  // ---------- feed_info.txt (opcional): vigência ----------
  let vigencia = null;
  await lerCsv(gtfs, "feed_info.txt", (c) => {
    vigencia = { inicio: c("feed_start_date") || null, fim: c("feed_end_date") || null, versao: c("feed_version") || null };
  });

  gtfs.zip.close();

  // ---------- Monta os arquivos ----------
  await rm(SAIDA_LINHAS, { recursive: true, force: true });
  await mkdir(SAIDA_LINHAS, { recursive: true });

  const indice = [];
  const pontosPorLinha = []; // para o cálculo dos campi

  const linhasOrdenadas = [...grupos.keys()].map((id) => rotas.get(id)).sort((a, b) => compararCodigo(a.codigo, b.codigo));

  for (const rota of linhasOrdenadas) {
    const sentidos = [];
    const porSentido = grupos.get(rota.id);
    const chaves = [...porSentido.keys()].sort();
    for (const chave of chaves) {
      const g = porSentido.get(chave);
      const seq = (sequencias.get(g.representante) ?? []).sort((a, b) => a[0] - b[0]);
      const apos = minutosDesdeAPartida(seq.map((s) => s[2]));
      // Cada ponto: [id, nome, lon, lat, minutos depois da saída do ponto inicial]
      const paradas = seq
        .map(([, stopId], i) => {
          const p = pontos.get(stopId);
          return p ? [stopId, p.nome, p.lon, p.lat, apos[i]] : null;
        })
        .filter(Boolean);

      let linha = (tracados.get(g.tracado) ?? []).sort((a, b) => a[0] - b[0]).map(([, lon, lat]) => [lon, lat]);
      if (linha.length < 2) linha = paradas.map(([, , lon, lat]) => [lon, lat]); // sem shapes.txt
      linha = simplificar(linha, DADOS.TOLERANCIA_TRACADO).map(([lon, lat]) => [arredondar(lon), arredondar(lat)]);

      const destino = maisFrequente(g.destinos) || paradas.at(-1)?.[1] || "";
      const horarios = {};
      for (const tipo of ["util", "sabado", "domingo"]) horarios[tipo] = [...g.horarios[tipo]].sort((a, b) => a - b);

      sentidos.push({ id: chave, destino: titulo(destino), tracado: linha, paradas, horarios });
      pontosPorLinha.push({ rota, sentido: chave, destino: titulo(destino), paradas, horarios });
    }

    const arquivo = idDeArquivo(rota.id);
    await writeFile(`${SAIDA_LINHAS}/${arquivo}.json`, JSON.stringify({ ...rota, sentidos }));
    indice.push({ id: rota.id, codigo: rota.codigo, nome: rota.nome, cor: rota.cor, arquivo, sentidos: sentidos.map((s) => s.destino) });
  }

  // ---------- Linhas perto de cada campus ----------
  const campus = CAMPI.map((c) => {
    const proximas = new Map(); // id da linha -> melhor ponto
    const pontosPerto = new Map();
    for (const { rota, sentido, destino, paradas, horarios } of pontosPorLinha) {
      for (const [stopId, nome, lon, lat, apos] of paradas) {
        const dist = distanciaM(c.coords, [lon, lat]);
        if (dist > DADOS.RAIO_CAMPUS_M) continue;
        if (!pontosPerto.has(stopId)) pontosPerto.set(stopId, { id: stopId, nome, lon, lat, dist: Math.round(dist), linhas: new Set() });
        pontosPerto.get(stopId).linhas.add(rota.codigo);
        const atual = proximas.get(rota.id);
        if (!atual || dist < atual.dist) {
          // Os horários vão junto para a página inicial mostrar a próxima partida
          proximas.set(rota.id, { id: rota.id, codigo: rota.codigo, nome: rota.nome, cor: rota.cor, arquivo: idDeArquivo(rota.id), sentido, destino, ponto: nome, pontoId: stopId, dist: Math.round(dist), apos, horarios });
        }
      }
    }
    return {
      ...c,
      linhas: [...proximas.values()].sort((a, b) => a.dist - b.dist || compararCodigo(a.codigo, b.codigo)),
      pontos: [...pontosPerto.values()].map((p) => ({ ...p, linhas: [...p.linhas].sort(compararCodigo) })).sort((a, b) => a.dist - b.dist),
    };
  });

  const meta = {
    geradoEm: new Date().toISOString(),
    fonte: opcao("--arquivo") ? "arquivo local" : process.env.PBH_GTFS_URL || DADOS.GTFS_URL,
    vigencia,
    totais: { linhas: indice.length, pontos: pontos.size, viagens: viagens.size },
  };
  await writeFile(`${SAIDA}/linhas.json`, JSON.stringify({ meta, linhas: indice }));
  await writeFile(`${SAIDA}/campus.json`, JSON.stringify({ meta, raio: DADOS.RAIO_CAMPUS_M, campus }));

  console.log(`✅ ${indice.length} linhas salvas em public/data (${((Date.now() - inicio) / 1000).toFixed(1)} s)`);
  for (const c of campus) console.log(`   🎓 ${c.nome}: ${c.linhas.length} linhas a até ${DADOS.RAIO_CAMPUS_M} m`);
}

/* =====================================================================
   Execução
   ===================================================================== */

async function main() {
  if (args.includes("--se-faltar") && existsSync(`${SAIDA}/linhas.json`)) {
    console.log("ℹ️  public/data/linhas.json já existe (rode `npm run dados` para atualizar).");
    return;
  }
  await mkdir(SAIDA, { recursive: true });
  const zip = await baixarGtfs();
  await processar(zip);
}

main().catch((erro) => {
  console.error(`❌ Não foi possível gerar os dados: ${erro.message}`);
  console.error("   Confira a internet e a URL do GTFS (PBH_GTFS_URL ou src/config/appConfig.js).");
  process.exit(1);
});
