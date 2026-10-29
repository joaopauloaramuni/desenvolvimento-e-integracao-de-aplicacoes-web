// snapshot.mjs
// Baixa os dados do campus INTEIRO do Overpass e salva em public/data/campus-overpass.json.
// Essa é a cópia local que o site usa quando o Overpass não responde.
//
//   npm run snapshot
//
// Usa a mesma consulta e os mesmos servidores do site (src/services e src/config).
import { writeFile } from "node:fs/promises";
import MAP_CONFIG from "../src/config/mapConfig.js";
import { buildQuery } from "../src/services/overpassService.js";

const OUTPUT = new URL("../public/data/campus-overpass.json", import.meta.url);

async function run() {
  const body = new URLSearchParams({ data: buildQuery() });

  for (const url of MAP_CONFIG.OVERPASS_URLS) {
    console.log(`Consultando ${url} ...`);
    try {
      const res = await fetch(url, {
        method: "POST",
        body,
        headers: { "User-Agent": "PucMaps-React (projeto didatico PUC Minas)" },
        signal: AbortSignal.timeout(90_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.elements?.length) throw new Error("resposta vazia");

      const snapshot = {
        version: json.version,
        generator: `PucMaps snapshot (campus completo via ${new URL(url).host})`,
        osm3s: json.osm3s,
        fetchedAt: Date.now(),
        elements: json.elements,
      };
      await writeFile(OUTPUT, JSON.stringify(snapshot));
      console.log(`OK: ${json.elements.length} elementos salvos em public/data/campus-overpass.json`);
      return;
    } catch (error) {
      console.warn(`  falhou: ${error.message}`);
    }
  }
  console.error("Nenhum servidor Overpass respondeu. Tente de novo em alguns minutos.");
  process.exit(1);
}

run();
