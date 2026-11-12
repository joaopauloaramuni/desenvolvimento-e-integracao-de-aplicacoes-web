# Projeto PygbagReact (React + Vite + Pygame + pygbag) 🎮

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aramuni-pygbag-react.vercel.app/)

👉 **[aramuni-pygbag-react.vercel.app](https://aramuni-pygbag-react.vercel.app/)**

Abra no navegador do celular ou do computador e jogue direto, sem instalar nada.

## 📖 Descrição

O **PygbagReact** é um projeto modelo que mostra como colocar um **jogo feito com Pygame** dentro de um **site React + Vite**, para ser jogado no navegador. A ideia é simples: quem fez o portfólio em React e um jogo em Pygame em outra disciplina pode juntar os dois, e quem visita o portfólio joga sem instalar Python.

Quem faz a mágica é o **[pygbag](https://github.com/pygame-web/pygbag)**. Ele empacota o jogo (o `main.py` e os arquivos da pasta) num arquivo `.apk` e gera um `index.html` que roda o **Python + pygame-ce compilados para WebAssembly** dentro do navegador. O React não precisa entender nada disso: ele só abre esse `index.html` num **`<iframe>`**.

O jogo de exemplo é a **Cobrinha**, o clássico **Snake**: a cobrinha come as maçãs, cresce e fica mais rápida a cada 5 maçãs; bater na parede ou no próprio corpo encerra a partida. Ela é uma "python" de verdade: azul e amarela, as cores do logo do Python. O jogo é curto de propósito (um único `main.py`, sem imagens nem sons), para o foco ficar no **encapsulamento**: o que muda no código Pygame, como gerar o build com o pygbag e como o componente React mostra o jogo.

Não existe back-end: o build do pygbag fica em `public/games/` e é publicado junto com o site, na Vercel ou no GitHub Pages. O Python não precisa estar instalado no servidor.

## ✨ Funcionalidades

- 🎮 **Jogo Pygame no navegador**: o mesmo `main.py` roda no computador (`python main.py`) e no site.
- ▶️ **Capa com botão Jogar**: o `<iframe>` só é criado depois do clique. A página abre rápido (o Python tem alguns MB) e o clique conta como interação do usuário, que o navegador exige para liberar o som.
- ⌨️ **Foco do teclado**: quando o jogo carrega, o foco vai para ele. Embaixo do jogo aparece "Teclado no jogo" ou "Clique no jogo para usar o teclado", conforme quem está recebendo as teclas.
- 🖥️ **Tela cheia** sem distorcer: o jogo fica centralizado com a proporção do `set_mode()` (640 x 480 = 4:3). O botão só aparece nos navegadores que permitem tela cheia (o Safari do iPhone não permite).
- 🔁 **Reiniciar** e **Fechar jogo**: reiniciar recria o `<iframe>`; fechar remove o jogo da página e para de gastar processador.
- 📱 **Teclado e toque**: setas ou WASD no computador; no celular, deslizar o dedo vira a cobrinha, e um toque vira para o lado tocado.
- 🧩 **Vários jogos**: cada jogo é um objeto em `src/data/games.js`. Com mais de um, a página mostra um abaixo do outro.
- 🛠️ **`npm run game:build`**: um comando roda o pygbag e copia o resultado para `public/games/`. Funciona no Windows, no macOS e no Linux.
- 📚 **Passo a passo na página**: a seção "Do Pygame para o site" resume os quatro passos, com o código de cada um.
- 🌙 **Tema claro e escuro**: segue o sistema na primeira visita e salva a escolha. O tema é aplicado antes do React carregar, então a página não "pisca".

## 🖼️ Capturas de Tela

| Home | Home - Tema escuro |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/Home.png) | ![HomeDark](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/HomeDark.png) |

| Jogando | Jogando - Tema escuro |
| :---: | :---: |
| ![Jogando](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/Jogando.png) | ![JogandoDark](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/JogandoDark.png) |

| Passo a passo | Passo a passo - Tema escuro |
| :---: | :---: |
| ![PassoAPasso](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/PassoAPasso.png) | ![PassoAPassoDark](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/PassoAPassoDark.png) |

| Celular | Celular - Tema escuro | Celular - Jogando |
| :---: | :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/Mobile.png) | ![MobileDark](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/MobileDark.png) | ![MobileJogando](https://joaopauloaramuni.github.io/react-imgs/PygbagReact/imgs/MobileJogando.png) |

## 🚀 Como rodar

Pré-requisitos: **Node.js 20.19+** (ou 22.12+), exigido pelo Vite 8. O **Python 3.12+** só é necessário para gerar de novo o build do jogo.

```bash
npm install
npm run dev
```

Acesse **`http://localhost:5173`** no navegador e clique em **Jogar**.

O build do jogo já vem pronto em `public/games/cobrinha/`, então o site funciona sem Python. Para mexer no jogo:

```bash
pip install -r game/requirements.txt   # pygame-ce + pygbag
python game/cobrinha/main.py           # joga no computador
npm run game:build                     # gera o build web e copia para public/games/
npm run dev
```

> 🌐 Na primeira vez que o jogo abre, o navegador baixa o Python e o pygame-ce do CDN do pygbag (`pygame-web.github.io`). Precisa de internet, mesmo no `localhost`. Depois disso, o navegador guarda os arquivos em cache.

## 🐍 O que é o pygbag

O **pygbag** pega a pasta do jogo e gera um site estático que roda Python no navegador:

```text
game/cobrinha/            pygbag --build            game/cobrinha/build/web/
├── main.py      ─────────────────────────────▶      ├── index.html        (carrega o Python do CDN)
└── favicon.png                                      ├── cobrinha.apk      (main.py + arquivos da pasta)
                                                     ├── cobrinha.tar.gz   (mesmo conteúdo; é o que o template abre)
                                                     └── favicon.png       (vem do --icon)
```

- O **`.apk`** não tem nada a ver com Android: é só um `.zip` com todos os arquivos da pasta do jogo (código, imagens, sons e fontes). O **`.tar.gz`** tem o mesmo conteúdo; o template usa o `.apk` no itch.io e o `.tar.gz` nos outros sites.
- O **`index.html`** baixa do CDN o **CPython compilado para WebAssembly** e o **pygame-ce**, abre o pacote do jogo e roda o `main.py`.
- O pygame do navegador é o **[pygame-ce](https://pyga.me/)** (*community edition*), compatível com o pygame tradicional. Por isso o `requirements.txt` usa `pygame-ce`.
- No navegador, `sys.platform` vale `"emscripten"`. O jogo de exemplo usa isso só para escrever "Rodando no navegador (pygbag)" no menu.

## 🎮 Passo a passo: do seu jogo Pygame para o portfólio

### 1. Deixe o laço principal assíncrono

O navegador tem uma única linha de execução. Um `while True` comum nunca devolveria a vez para ele, e a aba travaria. O pygbag resolve isso com `asyncio`: o laço vai para uma função `async` e, no fim de cada volta, o `await asyncio.sleep(0)` deixa o navegador desenhar a tela e ler o teclado.

**Antes** (jogo de desktop):

```python
import pygame, sys

pygame.init()
tela = pygame.display.set_mode((640, 480))
relogio = pygame.time.Clock()

while True:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
    # ... regras e desenho
    pygame.display.flip()
    relogio.tick(60)
```

**Depois** (funciona no desktop e no navegador):

```python
import asyncio
import pygame

pygame.init()
tela = pygame.display.set_mode((640, 480))
relogio = pygame.time.Clock()

async def main():
    rodando = True
    while rodando:
        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                rodando = False
        # ... regras e desenho
        pygame.display.flip()
        relogio.tick(60)
        await asyncio.sleep(0)   # OBRIGATÓRIO: devolve o controle ao navegador

    pygame.quit()

asyncio.run(main())
```

O checklist completo:

| Regra | Por quê |
|---|---|
| O arquivo principal se chama **`main.py`** | É o que o pygbag procura na pasta |
| O laço fica em **`async def main()`** e o arquivo termina com **`asyncio.run(main())`** | O navegador precisa recuperar o controle a cada quadro |
| **`await asyncio.sleep(0)`** no fim de cada volta do laço | Sem ele, a aba trava numa tela preta |
| Todo laço que dura mais de um quadro (menu, tela de fim, contagem regressiva) também precisa do `await` | Mesmo motivo: cada `while` que roda por vários quadros trava o navegador sem ele |
| Nada de **`sys.exit()`** e **`time.sleep()`** | O primeiro encerra o Python da página; o segundo trava a aba. Use `await asyncio.sleep(segundos)` |
| Nada de **threads** (`threading`) | O navegador não tem threads para o Python |

> 💡 Se o jogo tem várias telas, cada uma com o próprio `while`, a forma mais simples é transformar cada função de tela em `async def` e chamar com `await tela_de_menu()`. O jogo de exemplo usa outra abordagem: um laço só e um atributo `estado` (`"menu"`, `"jogando"`, `"pausa"`, `"fim"`).

### 2. Teste com o servidor do pygbag

```bash
pip install -r game/requirements.txt
pygbag game/cobrinha
```

O pygbag gera o build e abre um servidor de teste em **`http://localhost:8000`**. Se o jogo não aparecer, abra **`http://localhost:8000/#debug`**: a página mostra o console do Python, com o erro e a linha.

> ⚠️ Instale **só um** entre `pygame` e `pygame-ce`. Os dois usam o mesmo `import pygame` e brigam entre si. Se já tinha o `pygame`, rode `pip uninstall pygame` antes.

### 3. Gere o build e copie para `public/games/`

```bash
npm run game:build                        # todos os jogos da pasta game/
npm run game:build -- cobrinha            # só um jogo
```

O script `scripts/build-game.mjs` faz o que você faria à mão:

```bash
python -m pygbag --build --ume_block 0 --icon game/cobrinha/favicon.png game/cobrinha
# apaga public/games/cobrinha/ e copia para lá o conteúdo de:
#   game/cobrinha/build/web/
# troca, no index.html copiado:  tarfile.open(..., mode="r:gz")  ->  mode="r:*"
```

| Opção | O que faz |
|---|---|
| `--build` | Só gera os arquivos, sem abrir o servidor de teste |
| `--ume_block 0` | Não espera o clique "Ready to start" do pygbag. O clique em **Jogar** no React já conta como interação do usuário |
| `--icon game/<nome>/favicon.png` | Usa o ícone da pasta do jogo. Sem essa opção, o pygbag procura `favicon.png` na pasta de onde o comando foi rodado e, se não achar, baixa um ícone genérico do CDN |

> ⚠️ **Por que o script troca `"r:gz"` por `"r:*"`?** O servidor do Vite (`npm run dev` e `npm run preview`) entrega arquivos `.gz` com o cabeçalho `Content-Encoding: gzip`. O navegador descompacta o `cobrinha.tar.gz` sozinho e o Python recebe um `.tar` comum, mas o template do pygbag abre o arquivo com `tarfile.open(..., mode="r:gz")`, que exige um arquivo compactado. O erro acontece em silêncio e a tela fica parada em **"Loading, please wait..."**. Com `mode="r:*"`, o `tarfile` detecta sozinho se o arquivo está compactado, e o jogo abre em qualquer servidor. Se você gerar o build à mão (`pygbag --build`), faça essa troca no `index.html` também.

A pasta `public/` vai para o `dist/` do jeito que está: o Vite não processa o `index.html` nem o `.apk` do jogo. Por isso o **build do jogo é commitado** em `public/games/`, e a Vercel não precisa ter Python.

### 4. Cadastre o jogo na página

Em `src/data/games.js`, um objeto por jogo:

```js
import capaMeuJogo from "../assets/images/meu-jogo-capa.webp";

export const GAMES = [
  {
    pasta: "meu-jogo",                 // public/games/meu-jogo/
    titulo: "Meu Jogo",
    descricao: "Uma frase sobre o jogo.",
    autor: "Seu nome",
    disciplina: "Trabalho de Programação com Pygame",
    largura: 800,                      // o mesmo do pygame.display.set_mode((800, 600))
    altura: 600,
    capa: capaMeuJogo,                 // um print do jogo
    tecnologias: ["Python", "Pygame", "pygbag"],
    codigoFonte: "https://github.com/...",
    controles: [
      { teclas: ["←", "→"], acao: "Mover" },
      { teclas: ["Espaço"], acao: "Pular" },
    ],
  },
];
```

A `largura` e a `altura` definem a proporção da tela do jogo na página. Se forem diferentes do `set_mode()`, o jogo aparece com faixas pretas nas bordas.

### 5. Publique

Suba o projeto para o GitHub e faça o deploy (veja [Deploy](#️-deploy)). Toda vez que mudar o `main.py`, rode `npm run game:build` de novo e faça o commit da pasta `public/games/`.

## ⚙️ Como funciona

```text
Navegador
 └── React (localhost:5173 ou Vercel)
      └── GamePlayer
           ├── antes do clique: <button> com a capa (src/assets/images/...webp)
           └── depois do clique: <iframe src="./games/cobrinha/index.html">
                                      │
                                      ├── pythons.js, CPython (wasm), pygame-ce ◀── pygame-web.github.io (CDN do pygbag)
                                      └── cobrinha.tar.gz ◀── public/games/cobrinha/ (mesmo site)
                                              └── main.py roda dentro do navegador
```

1. O componente `GamePlayer` mostra a capa e o botão **Jogar**. Nenhum arquivo do jogo é baixado ainda.
2. O clique em **Jogar** cria o `<iframe>`. O `index.html` do pygbag baixa o Python do CDN e o pacote do jogo (`cobrinha.tar.gz`) do próprio site.
3. Quando o `index.html` carrega (`onLoad`), o `GamePlayer` dá o foco ao `<iframe>` e ao `<canvas>` do pygbag. Isso funciona porque o jogo está no mesmo domínio do site (pasta `public/`).
4. O `GamePlayer` escuta `blur` e `focus` da janela: quando o usuário clica no jogo, a página perde o foco e o `document.activeElement` passa a ser o `<iframe>`. É assim que ele sabe se mostra "Teclado no jogo" ou "Clique no jogo para usar o teclado".
5. **Reiniciar** muda a `key` do `<iframe>`. O React desmonta o antigo e cria um novo, então o Python começa do zero.
6. **Fechar jogo** desmonta o `<iframe>`, e o navegador encerra o Python daquela página.

### Por que um `<iframe>`?

| Vantagem | Explicação |
|---|---|
| Isolamento | O pygbag tem o próprio HTML, CSS e `<canvas>`. Dentro do `<iframe>`, nada disso interfere no CSS do portfólio |
| Sem configuração no Vite | O build do pygbag é um site pronto; o Vite só copia a pasta `public/` |
| Teclado | As teclas vão para o jogo enquanto ele está com o foco. As setas não rolam a página do portfólio |
| Desligar de verdade | Desmontar o `<iframe>` encerra o Python. Sem ele, o jogo continuaria rodando escondido |

## 🧩 Usando no seu portfólio

Para levar o jogo para um portfólio React + Vite que já existe:

1. Copie para o seu projeto:
   - `src/components/GamePlayer/` (`GamePlayer.jsx` + `GamePlayer.css`)
   - `src/components/Icon/` (ícones usados pelos botões)
   - `src/utils/gameUrl.js` e a constante `GAMES_FOLDER` de `src/config/appConfig.js`
   - `scripts/build-game.mjs` e o script `"game:build"` do `package.json`
2. Coloque o jogo em `game/<nome-do-jogo>/main.py` e rode `npm run game:build`.
3. Use o componente onde quiser:

```jsx
import GamePlayer from "./components/GamePlayer/GamePlayer.jsx";
import capa from "./assets/images/meu-jogo-capa.webp";

<GamePlayer game={{ pasta: "meu-jogo", titulo: "Meu Jogo", largura: 800, altura: 600, capa }} />
```

O `GamePlayer.css` usa as variáveis `--bezel`, `--ink`, `--ink-soft`, `--py-blue`, `--py-yellow` e `--ok`. Defina essas variáveis no seu CSS ou troque pelas cores do seu portfólio.

> 💡 O jogo também funciona sozinho, fora do React. O endereço direto é `https://seu-site/games/<nome-do-jogo>/index.html`, e esse link pode ir no README do repositório do jogo.

## 🔊 Imagens, sons e fontes

Tudo o que está na pasta do jogo vai para dentro do `.apk`. Algumas regras do navegador:

| Assunto | Regra |
|---|---|
| Caminhos | Sempre **relativos** à pasta do `main.py`: `pygame.image.load("assets/nave.png")`. Nada de `C:\Users\...` |
| Maiúsculas e minúsculas | No navegador, `Nave.png` e `nave.png` são arquivos diferentes (no Windows, não). Use o nome exato |
| Sons | Use **`.ogg`**. O pygbag para o build com erro quando encontra `.mp3` ou `.wav`, que nem todo navegador toca |
| Fontes | O navegador não tem as fontes do seu computador, então `pygame.font.SysFont("arial", 30)` não acha a Arial. Use `pygame.font.Font(None, 30)` (fonte padrão do pygame) ou coloque o `.ttf` na pasta do jogo |
| Pasta limpa | Não deixe na pasta do jogo um `venv`, vídeos ou arquivos grandes que o jogo não usa: tudo isso entra no `.apk` e o jogo demora mais para abrir |
| Bibliotecas | Bibliotecas Python puras costumam funcionar. As que dependem de código em C só funcionam se o pygbag tiver uma versão para WebAssembly. Teste com `pygbag pasta` antes |
| Recorde salvo em arquivo | Gravar arquivo funciona, mas some quando a página recarrega. Para o exemplo, o recorde fica só na memória |

Exemplo de pasta de um jogo com imagens e sons:

```text
📁 game/meu-jogo
├── main.py
├── 📁 assets
│   ├── nave.png
│   ├── fundo.png
│   └── pulo.ogg
└── 📁 fonts
    └── PressStart2P.ttf
```

## ⚛️ Conceitos de React utilizados

| Conceito | Onde |
|---|---|
| Componentes funcionais | Todos os arquivos de `src/components/` |
| Props | `GameSection` e `GamePlayer` recebem `game`; `Controls` recebe `controles` |
| `useState` | Jogo ligado, rodada (`key` do iframe), teclado no jogo, tela cheia (`GamePlayer`); tema (`useTheme`) |
| `useEffect` | Escutar `blur`/`focus` da janela e `fullscreenchange`; salvar o tema |
| `useRef` | O `<iframe>` (para dar o foco) e a moldura (para a tela cheia) |
| `useCallback` | `focarJogo`, passado para o `onLoad` do iframe; `alternar` do tema |
| `key` para recriar um elemento | **Reiniciar**: mudar a `key` do `<iframe>` faz o React criar outro do zero |
| Renderização condicional | Capa ou `<iframe>`; botões da barra só com o jogo ligado; Tela cheia só se o navegador permite |
| Listas com `map()` | Jogos, controles, tecnologias e passos |
| Hook próprio | `useTheme` |
| Variável CSS via `style` | `--proporcao` (`640 / 480`) vem do `games.js` e vira `aspect-ratio` no CSS |
| `import.meta.env.BASE_URL` | Monta o caminho do jogo para funcionar na raiz e em subpasta (`gameUrl.js`) |

## 📂 Estrutura do Projeto

```text
📁 PygbagReact
│
├── 🐍 game                                    └── Código-fonte dos jogos Pygame (não vai para o site)
│   ├── requirements.txt                       └── pygame-ce + pygbag
│   └── 📁 cobrinha
│       ├── main.py                            └── O jogo Snake (laço async, pronto para o pygbag)
│       └── favicon.png                        └── Ícone do jogo (passado ao pygbag com --icon)
│
├── 📁 imgs                                    └── Capturas de tela usadas neste README
├── 📁 public
│   ├── 📁 games                               └── Builds do pygbag (gerados pelo npm run game:build)
│   │   └── 📁 cobrinha
│   │       ├── index.html                     └── Página do pygbag (carrega o Python do CDN), com tarfile "r:*"
│   │       ├── cobrinha.apk                   └── O jogo empacotado (main.py + arquivos), usado no itch.io
│   │       ├── cobrinha.tar.gz                └── Mesmo conteúdo, usado nos outros sites (Vercel, GitHub Pages, Vite)
│   │       └── favicon.png                    └── Ícone da aba quando o jogo é aberto sozinho
│   ├── favicon.ico                            └── Favicon da cobrinha (16, 32, 48 e 64 px)
│   ├── favicon-32.png / favicon-192.png       └── Favicon em PNG
│   └── apple-touch-icon.png                   └── Ícone da tela inicial (iPhone/iPad)
│
├── 📁 scripts
│   └── build-game.mjs                         └── Roda o pygbag --build --icon, copia para public/games/ e ajusta o "r:*"
│
├── 📁 src
│   ├── 📁 assets/images
│   │   └── cobrinha-capa.webp                 └── Capa mostrada antes do clique em Jogar (print do jogo)
│   │
│   ├── ⚙️ config
│   │   └── appConfig.js                       └── Título do site, link do repositório, chave do tema, pasta dos jogos
│   │
│   ├── 📊 data
│   │   └── games.js                           └── Cadastro dos jogos (pasta, título, tamanho, capa, controles)
│   │
│   ├── 🪝 hooks
│   │   └── useTheme.js                        └── Tema claro/escuro (sistema + escolha salva)
│   │
│   ├── 🧰 utils
│   │   └── gameUrl.js                         └── Caminho do index.html do jogo com o BASE_URL do Vite
│   │
│   ├── 🎨 components
│   │   ├── GamePlayer/                        └── O jogo: capa, <iframe>, foco, tela cheia, reiniciar e fechar
│   │   ├── GameSection/                       └── Título, descrição, tecnologias, GamePlayer e lateral
│   │   ├── Controls/                          └── Lista de controles com <kbd>
│   │   ├── HowItWorks/                        └── Os quatro passos do Pygame até o site
│   │   ├── Header/                            └── Marca, link do código e botão de tema
│   │   ├── Footer/                            └── Créditos
│   │   └── Icon/                              └── Ícones SVG desenhados à mão
│   │
│   ├── App.jsx                                └── Cabeçalho, um GameSection por jogo, passo a passo e rodapé
│   ├── App.css                                └── Largura da página
│   ├── index.css                              └── Tokens de cor (papel quadriculado + azul e amarelo do Python), fontes, botões
│   └── main.jsx
│
├── 📄 .gitignore                              └── Ignora node_modules, dist e game/*/build/
├── 📄 index.html                              └── Favicon, fontes (Google Fonts) + script do tema (sem "piscar")
├── 📄 vite.config.js                          └── base "./" (funciona na Vercel e no GitHub Pages)
└── 📄 package.json
```

Hierarquia dos componentes:

```text
App
 ├── Header
 ├── GameSection          (um por jogo do games.js)
 │    ├── GamePlayer ── Icon
 │    └── Controls
 ├── HowItWorks
 └── Footer
```

## ☁️ Deploy

### Vercel

1. Suba o projeto para um repositório no GitHub (com a pasta `public/games/`).
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Clique em **Deploy**. Não há variáveis de ambiente.

### GitHub Pages

Como o `vite.config.js` usa `base: "./"`, o `dist/` funciona numa subpasta, como `https://seu-usuario.github.io/portfolio/`:

```bash
npm run build
# publique o conteúdo de dist/ na branch gh-pages (ou pelo GitHub Actions)
```

> 💡 A Vercel e o GitHub Pages só servem arquivos estáticos, e o jogo também é estático: o Python roda no navegador de quem visita. Não há servidor Python em lugar nenhum.

## 🧯 Problemas comuns

| Sintoma / erro | Causa provável | Solução |
|---|---|---|
| Tela cinza com **"Loading, please wait..."** que não sai do lugar | O servidor descompactou o `.tar.gz` e o template abre com `"r:gz"` (veja o passo 3) | Rodar `npm run game:build` (ele já troca para `"r:*"`) ou trocar à mão no `index.html` do jogo |
| Tela azul-clara com "Downloading..." que não sai do lugar | Sem internet ou CDN do pygbag fora do ar | Conferir a conexão; o Python vem de `pygame-web.github.io` |
| Tela preta, o jogo não responde | Faltou `await asyncio.sleep(0)` em algum laço, ou o código deu erro | Abrir com `pygbag pasta` e acessar `http://localhost:8000/#debug` para ver o erro |
| "404" no lugar do jogo | `npm run game:build` não foi rodado, ou a `pasta` do `games.js` não bate com `public/games/` | Rodar `npm run game:build` e conferir o nome da pasta |
| As teclas não fazem nada | O foco está na página, não no jogo | Clicar no jogo ("Teclado no jogo" aparece embaixo) |
| Imagem ou som "não encontrado" só no navegador | Caminho absoluto, ou maiúscula/minúscula diferente | Usar caminho relativo e o nome exato do arquivo |
| O som não toca | Formato `.mp3` ou `.wav` | Converter para `.ogg` |
| Texto com fonte diferente da do computador | `SysFont` procura fontes do sistema | `pygame.font.Font(None, tamanho)` ou um `.ttf` na pasta do jogo |
| Mudei o `main.py` e o site continua igual | O site usa a cópia em `public/games/` | Rodar `npm run game:build` de novo e recarregar com `Ctrl + Shift + R` |
| `ModuleNotFoundError: No module named 'pygbag'` | pygbag não instalado no Python usado pelo script | `pip install -r game/requirements.txt` |
| Erros estranhos ao importar o pygame | `pygame` e `pygame-ce` instalados juntos | `pip uninstall pygame pygame-ce` e depois `pip install pygame-ce` |
| `Python não encontrado` no `npm run game:build` | Python fora do PATH | Instalar o Python marcando **Add to PATH** (o script tenta `python`, `python3` e `py`) |
| O jogo demora muito para abrir | `.apk` grande | Tirar da pasta do jogo o que ele não usa; converter imagens para `.png` menores e sons para `.ogg` |

## 📦 Dependências

```json
"dependencies": {
  "react": "^19.3.1",
  "react-dom": "^19.3.1"
},
"devDependencies": {
  "@types/react": "^19.3.0",
  "@types/react-dom": "^19.3.0",
  "@vitejs/plugin-react": "^6.1.2",
  "oxlint": "^1.88.0",
  "vite": "^8.3.4"
}
```

- [`react`](https://react.dev/) e [`react-dom`](https://react.dev/): a interface. Não há nenhuma biblioteca extra para o jogo: ele é só um `<iframe>`.
- Ícones e moldura do jogo são feitos com SVG e CSS, sem biblioteca.
- Fontes: [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) (títulos), [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (textos) e [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (código), pelo Google Fonts.

Do lado do Python (`game/requirements.txt`):

```text
pygame-ce>=2.5
pygbag>=0.9.3
```

- [`pygame-ce`](https://pyga.me/): o pygame da comunidade, o mesmo que roda no navegador.
- [`pygbag`](https://github.com/pygame-web/pygbag): empacota o jogo e gera o `index.html` que roda Python em WebAssembly.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` (inclui `public/games/`) |
| `npm run preview` | Testa o build localmente (`http://localhost:4173`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run game:build` | Roda o pygbag em cada `game/<nome>/` e copia para `public/games/<nome>/` |
| `pygbag game/cobrinha` | Servidor de teste do pygbag (`http://localhost:8000`) |
| `python game/cobrinha/main.py` | Joga no computador |

## 🔗 Urls do projeto

http://localhost:5173/

http://localhost:5173/games/cobrinha/index.html (o jogo sozinho, sem o React)

http://localhost:4173/ (depois de `npm run build` + `npm run preview`)

http://localhost:8000/ (servidor de teste do pygbag)

http://localhost:8000/#debug (servidor do pygbag com o console do Python)

## 📚 Documentação e Links Úteis

**pygbag**

- [pygbag no GitHub](https://github.com/pygame-web/pygbag)
- [pygbag no PyPI](https://pypi.org/project/pygbag/)
- [Wiki do pygame-web (pygbag)](https://pygame-web.github.io/)

**Pygame**

- [pygame-ce: Documentação](https://pyga.me/docs/)
- [Python: asyncio](https://docs.python.org/pt-br/3/library/asyncio.html)

**React, Vite e deploy**

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Vite: a pasta public](https://vite.dev/guide/assets#the-public-directory)
- [MDN: `<iframe>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/iframe)
- [MDN: Fullscreen API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fullscreen_API)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [GitHub Pages: publicando a partir de uma branch](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
