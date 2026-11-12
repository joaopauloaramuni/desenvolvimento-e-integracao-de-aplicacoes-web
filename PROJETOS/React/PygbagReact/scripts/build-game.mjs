// Gera o build web do(s) jogo(s) Pygame com o pygbag e copia para public/games/.
//
//   npm run game:build                       -> todos os jogos da pasta game/
//   npm run game:build -- cobrinha           -> só um jogo
//
// Para cada pasta game/<nome>/ que tem um main.py, o script:
//   1. roda  python -m pygbag --build --ume_block 0 --icon game/<nome>/favicon.png game/<nome>
//   2. apaga public/games/<nome>/ e copia para lá o conteúdo de game/<nome>/build/web/
//   3. ajusta o index.html para abrir o .tar.gz com tarfile "r:*" (veja corrigirTarGz)
//
// Funciona no Windows, no macOS e no Linux (tenta "python", "python3" e "py").

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const PASTA_JOGOS = join(RAIZ, "game");
const PASTA_PUBLICA = join(RAIZ, "public", "games");

function acharPython() {
  for (const comando of ["python", "python3", "py"]) {
    const teste = spawnSync(comando, ["--version"], { encoding: "utf8" });
    if (teste.status === 0) return comando;
  }
  return null;
}

function listarJogos(pedidos) {
  const todos = readdirSync(PASTA_JOGOS).filter((nome) => {
    const pasta = join(PASTA_JOGOS, nome);
    return statSync(pasta).isDirectory() && existsSync(join(pasta, "main.py"));
  });
  if (pedidos.length === 0) return todos;

  for (const nome of pedidos) {
    if (!todos.includes(nome)) {
      console.error(`\n✖ Não achei game/${nome}/main.py. Jogos encontrados: ${todos.join(", ") || "nenhum"}`);
      process.exit(1);
    }
  }
  return pedidos;
}

// O servidor do Vite (npm run dev / preview) entrega arquivos .gz com o cabeçalho
// "Content-Encoding: gzip". O navegador descompacta sozinho e o Python recebe um .tar
// comum, mas o template do pygbag abre com tarfile.open(..., mode="r:gz") e falha em
// silêncio: a tela fica parada em "Loading, please wait".
// Com "r:*" o tarfile detecta se o arquivo está compactado ou não, em qualquer servidor.
function corrigirTarGz(indexHtml) {
  const html = readFileSync(indexHtml, "utf8");
  const corrigido = html.replaceAll('mode="r:gz"', 'mode="r:*"');
  if (corrigido !== html) {
    writeFileSync(indexHtml, corrigido);
    console.log('✔ index.html ajustado: tarfile "r:gz" -> "r:*"');
  }
}

const python = acharPython();
if (!python) {
  console.error("\n✖ Python não encontrado. Instale o Python 3.12+ e tente de novo.");
  process.exit(1);
}

const temPygbag = spawnSync(python, ["-m", "pygbag", "--help"], { encoding: "utf8" });
if (`${temPygbag.stdout}${temPygbag.stderr}`.includes("No module named pygbag")) {
  console.error("\n✖ pygbag não instalado. Rode:  pip install -r game/requirements.txt");
  process.exit(1);
}

const jogos = listarJogos(process.argv.slice(2));
if (jogos.length === 0) {
  console.error("\n✖ Nenhum jogo em game/. Crie game/<nome-do-jogo>/main.py.");
  process.exit(1);
}

for (const nome of jogos) {
  const pastaJogo = join(PASTA_JOGOS, nome);
  console.log(`\n▶ pygbag: game/${nome}`);

  // --ume_block 0: o jogo começa sem o clique extra do pygbag
  // (o clique em "Jogar" na página React já conta como interação do usuário).
  const args = ["-m", "pygbag", "--build", "--ume_block", "0"];

  // --icon: sem ele, o pygbag procura favicon.png na pasta de onde o comando foi
  // rodado (a raiz do projeto) e, se não achar, baixa o ícone genérico do CDN.
  const icone = join(pastaJogo, "favicon.png");
  if (existsSync(icone)) args.push("--icon", icone);

  const build = spawnSync(python, [...args, pastaJogo], { stdio: "inherit" });
  const pastaBuild = join(pastaJogo, "build", "web");
  if (build.status !== 0 || !existsSync(join(pastaBuild, "index.html"))) {
    console.error(`\n✖ O pygbag não gerou game/${nome}/build/web/index.html. Veja o erro acima.`);
    process.exit(1);
  }

  const destino = join(PASTA_PUBLICA, nome);
  rmSync(destino, { recursive: true, force: true });
  cpSync(pastaBuild, destino, { recursive: true });
  corrigirTarGz(join(destino, "index.html"));
  console.log(`✔ Copiado para public/games/${nome}/`);
}

console.log("\nPronto. Rode  npm run dev  e abra http://localhost:5173");
