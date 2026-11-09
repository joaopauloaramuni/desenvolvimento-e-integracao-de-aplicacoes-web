# Projeto CoachGalo (React + Vite) ⚽🐓

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://coach-galo.vercel.app/)

👉 **[coach-galo.vercel.app](https://coach-galo.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

O **CoachGalo** é uma prancheta tática estilo **FIFA** para escalar o **Atlético Mineiro** em 2026, feita com **React** e **Vite**.

O elenco inteiro aparece com **foto**, **nome**, **posição** e **overall**. Você **arrasta** cada jogador para uma vaga do campo ou do banco, troca o **esquema tático** (4-4-2, 4-3-3, 3-5-2...) e um **gráfico** mostra na hora se o time ficou **melhor ou pior no ataque, no meio-campo, na defesa e no gol**, comparando com o que era antes da última mudança.

Não existe back-end: o elenco fica em **`src/data/elenco.json`** (empacotado no build) e a escalação fica salva no `localStorage` do navegador. O elenco e as **fotos oficiais** vêm do [site do Atlético](https://atletico.com.br/futebol/masculino/elenco/): as 32 fotos ficam em `public/jogadores/` (o app funciona sem internet) e, se faltar alguma, a carta carrega a foto direto do site. O script opcional **`npm run fotos`** sincroniza o elenco com o site no futuro.

O topo da página traz o **escudo do Atlético** ao lado do nome do app, e o favicon é uma **bola de futebol** do `react-icons`.

O arrastar e soltar é feito com **Pointer Events**, sem biblioteca: funciona com mouse, caneta e toque.

## ✨ Funcionalidades

- 🃏 **Cartas estilo FIFA**: overall, posição, foto e nome. A cor segue o FIFA: **ouro** (75+), **prata** (65 a 74) e **bronze** (até 64), com as listras da camisa alvinegra por cima.
- 🖐️ **Arrastar e soltar**: do elenco para o campo, do campo para o banco, entre vagas do campo ou de volta para o elenco (tira o jogador da escalação). Soltar em cima de outro jogador **troca** os dois de lugar. A carta segue o ponteiro e a vaga embaixo dele acende.
- 👆 **Modo clique (celular e teclado)**: clique num jogador para selecioná-lo e depois clique na vaga. `Esc` cancela um arrasto.
- 🧩 **8 esquemas táticos**: 4-4-2, 4-3-3, 4-2-3-1, 4-3-1-2, 4-1-4-1, 3-5-2, 3-4-3 e 5-3-2, cada um com uma miniatura do desenho. Ao trocar, os **mesmos 11** são redistribuídos nas vagas novas, cada um no lugar onde rende mais.
- 🟢 **Encaixe na posição**: a bolinha da carta fica **verde** (posição natural ou secundária), **amarela** (adaptado) ou **vermelha** (improvisado), e o overall mostrado já é o overall **naquela posição**.
- 📊 **Força do time**: barras de **Ataque**, **Meio-campo**, **Defesa** e **Goleiro**, mais **Geral** e **Entrosamento**. A cor da barra mostra o nível do setor: 🟩 **verde** (forte, 75+), 🟨 **amarelo** (regular, 70 a 74) e 🟥 **vermelho** (fraco, até 69).
- 🚦 **Melhorou ou piorou?** A cada jogador trocado (ou esquema novo), o setor que **melhorou** fica **verde** e o que **piorou** fica **vermelho**, em três lugares: a linha do setor no gráfico (com ▲/▼ e o valor), a frase de resumo (*"▲ Melhorou: ataque +11"*, *"▼ Piorou: defesa −2"*) e a **faixa do próprio campo** (ataque, meio-campo e defesa), com o rótulo na lateral. Uma marca branca na barra mostra onde o setor estava antes da mudança.
- ⚡ **Escalar melhores**: monta o melhor 11 possível no esquema atual e completa o banco (sempre com um goleiro reserva).
- ↩️ **Desfazer**: volta as últimas 40 mudanças.
- 📋 **Copiar escalação**: copia o time em texto para colar no WhatsApp ou no X.
- 🔎 **Elenco com pesquisa e filtro**: por nome (sem acento: `ivan` encontra `Iván`) ou número, e por setor (Goleiros, Defensores, Meio-campo, Atacantes). Cada jogador mostra se está **Titular** ou no **Banco**.
- 🪪 **Ficha do jogador**: carta grande, posições secundárias, nacionalidade, idade, camisa e os seis atributos (RIT, FIN, PAS, DRI, DEF, FIS; nos goleiros, ELA, MAN, CHU, REF, VEL, POS), com atalhos **Mandar para o banco** e **Tirar da escalação**.
- 💾 **Escalação salva**: ao recarregar a página, o time continua como você deixou.
- 📸 **Fotos oficiais**: as 32 fotos vêm do site do Atlético. O fundo cinza da foto é "multiplicado" com a cor da carta (`mix-blend-mode: multiply`) e o enquadramento aproxima no rosto e no peito. Sem internet, a carta mostra uma silhueta com a camisa listrada e o número.
- 📱 **Responsivo**: desktop (elenco, campo e painel lado a lado), tablet e celular.

## 🖼️ Capturas de Tela

| Home |
| :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Home.png) |

| Arrastando um jogador | Depois da troca |
| :---: | :---: |
| ![Arrastando](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Arrastando.png) | ![DepoisDaTroca](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/DepoisDaTroca.png) |

| Esquema 3-5-2 | Esquema 5-3-2 |
| :---: | :---: |
| ![Esquema352](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Esquema352.png) | ![Esquema532](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Esquema532.png) |

| Piorou: goleiro improvisado no ataque (vermelho) | Melhorou: o centroavante volta (verde) |
| :---: | :---: |
| ![Improvisado](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Improvisado.png) | ![Melhorou](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Melhorou.png) |

| Ficha do jogador |
| :---: |
| ![FichaJogador](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/FichaJogador.png) |

| Gráfico de força | Filtro (Defensores) | Pesquisa ("fred") |
| :---: | :---: | :---: |
| ![GraficoForca](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/GraficoForca.png) | ![FiltroDefensores](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/FiltroDefensores.png) | ![Pesquisa](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Pesquisa.png) |

| Escalação zerada | Tablet |
| :---: | :---: |
| ![Vazio](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Vazio.png) | ![Tablet](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Tablet.png) |

| Celular | Celular - Força e ficha |
| :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/Mobile.png) | ![MobileForca](https://joaopauloaramuni.github.io/react-imgs/CoachGalo/imgs/MobileForca.png) |

> 📸 As capturas são geradas por `npm run screenshots` na pasta `imgs/`. Para publicá-las, copie a pasta `imgs/` para `react-imgs/CoachGalo/imgs/` no repositório do GitHub Pages.

## 🚀 Como rodar

Pré-requisito: **Node.js 20.19+** (ou 22.12+), exigido pelo Vite 8.

```bash
npm install
npm run dev
```

Acesse **`http://localhost:5173`** no navegador.

Não precisa de mais nada: o elenco 2026 e os links das fotos oficiais já estão no `src/data/elenco.json`.

> 📸 **Fotos locais:** as 32 fotos oficiais já estão em **`public/jogadores/`** (`fred.webp`, `everson.webp`, `renan-lodi.webp`...), baixadas do site do Atlético e convertidas para WebP (408 x 615 px, cerca de 30 KB cada). Para trocar uma foto, salve `{id}.webp` ou `{id}.png` nessa pasta. O app usa a foto local primeiro; se ela não existir, carrega a foto direto do site do Atlético; sem internet, mostra a silhueta listrada (componente `FotoJogador`, função `fotosDe` do `elencoService`).

## 📸 Fotos oficiais e elenco 2026

O elenco foi lido da página oficial em **09/11/2026**: **32 jogadores** (4 goleiros, 5 zagueiros, 4 laterais, 13 meio-campistas e 6 atacantes), com nome, número e foto exatamente como no site. O campo `foto` de cada jogador aponta para a imagem oficial (816 x 1230 px):

```text
https://atletico.com.br/wp-content/uploads/2026/08/Fred_Site.png
```

O site só informa o setor (goleiro, zagueiro, lateral, meio-campista, atacante). A posição exata (lateral direito ou esquerdo, volante, meia, ponta...), as posições secundárias, o overall e os atributos foram definidos para o jogo.

### Atualizar o elenco no futuro (`npm run fotos`)

Quando houver contratações ou saídas, o script **`scripts/fotos.mjs`** lê de novo a página oficial:

```text
https://atletico.com.br/futebol/masculino/elenco/
```

A página é HTML estático: os 32 cards já vêm prontos, sem JavaScript. O script lê cada um pelas classes do site:

```html
<div class="elenco-atleta">
  <img src=".../2022/02/GOL_Delfim_Site.png" alt="Foto goleiro Gabriel Delfim">
  <p class="elenco-atleta-camisa">1</p>
  <h4>Gabriel Delfim</h4>
  <p class="elenco-atleta-posicao">Goleiro</p>
</div>
```

1. Junta cada card com o `src/data/elenco.json` pelo nome, sem acento: quem já existe tem o **número da camisa** e o **endereço da foto oficial** (campo `foto`) atualizados.
2. Jogador que está no site e não está no JSON **entra no elenco** com overall 70 e `"revisar": true` (a ficha dele mostra um aviso). Ajuste posição, overall e atributos no JSON.
3. Jogador que está no JSON e não aparece mais no site é listado no terminal. Para tirá-lo do elenco, use `--remover-ausentes`.
4. Baixa a foto oficial de quem ainda **não tem foto** em `public/jogadores/` e salva como `{id}.png`. Quem já tem foto não é baixado de novo, a não ser com `--forcar`.
5. Se o site um dia mudar e o HTML vier sem cards, o script abre a página num **Chromium sem janela** (Playwright) e lê os cards já desenhados. Se nem assim encontrar jogadores, **não altera nada**.

| Comando | O que faz |
| --- | --- |
| `npm run fotos` | Lê o site, atualiza o `elenco.json` e baixa as fotos que faltam |
| `npm run fotos -- --forcar` | Baixa de novo todas as fotos (substitui as que já existem, inclusive os `.webp`) |
| `npm run fotos -- --remover-ausentes` | Tira do `elenco.json` quem não está mais no site |
| `npm run fotos -- --offline` | Não acessa a internet: só lista quem está sem foto local |

Exemplo de saída, com um jogador novo, uma saída e uma troca de camisa:

```text
🌐 Lendo https://atletico.com.br/futebol/masculino/elenco/
👥 32 jogadores no site.
  🔢 Fred: camisa 7 -> 10
  ➕ novo: Novo Craque (Atacante). Revise posição, overall e atributos no elenco.json

🚪 Não aparecem mais no site: Dudu
   Para tirá-los do elenco: npm run fotos -- --remover-ausentes
  📸 Novo Craque -> public/jogadores/novo-craque.png (512 KB)

📥 1 foto(s) baixada(s).

✅ 33 jogadores, 33 com foto em public/jogadores/.
```

> 💡 **Foto à mão:** salve a imagem como `public/jogadores/{id}.webp` (ou `.png`/`.jpg`), com o `id` do jogador no `elenco.json` (ex.: `fred.webp`). O app usa a foto local primeiro e, se ela não existir, a do site.

> ⚠️ O script depende do HTML do site do Atlético (classes `elenco-atleta`, `elenco-atleta-camisa` e `elenco-atleta-posicao`), que pode mudar sem aviso. Se ele não encontrar os jogadores, ajuste as funções `lerHtml` e `lerComNavegador` em `scripts/fotos.mjs`.

## ⚙️ Como funciona

```text
src/data/elenco.json ──import──▶ elencoService.js ──▶ Elenco (lista)
                                                      │
public/jogadores/{id}.webp ◀── <img> ── FotoJogador ◀─┤
                                                      │
Pointer Events ─▶ useArrastar ─▶ useEscalacao (useReducer) ─▶ Campo, Banco
                                     │        │
                         localStorage ◀┘        └▶ escalacaoService.calcularForca ─▶ ForcaTime
```

1. O `elencoService` prepara os jogadores uma vez só (setor, idade, texto de pesquisa sem acento) e ordena pelo overall.
2. O hook **`useEscalacao`** guarda o estado da prancheta com `useReducer`: `formacao`, `titulares` (11 ids), `reservas` (12 ids), `historico` (para o Desfazer) e `ultima` (frase da última mudança). Toda mudança grava no `localStorage`.
3. O hook **`useArrastar`** escuta `pointermove`/`pointerup` na janela. O arrasto só começa depois de 6 px de movimento (abaixo disso é clique). Ao soltar, `document.elementFromPoint` encontra o elemento com `data-alvo` embaixo do ponteiro (`titular:3`, `reserva:0` ou `elenco`) e chama `mover(id, destino)`.
4. A **força do time** é recalculada com `useMemo` a cada mudança, e a força **antes** da mudança vem do último item do histórico.

### Arrastar e soltar sem biblioteca

| Situação | Como foi resolvido |
| --- | --- |
| Clique x arrasto | Só vira arrasto depois de 6 px; o clique que vem logo após soltar é ignorado (`foiArrasto()`) |
| Toque no campo e no banco | `touch-action: none` nas vagas: o dedo arrasta a carta em vez de rolar a página |
| Toque na lista do elenco | `touch-action: pan-y`: o dedo rola a lista; no celular, use o modo clique (toque no jogador, depois na vaga) |
| Carta seguindo o ponteiro | Um "fantasma" com `position: fixed` e `pointer-events: none`, para não atrapalhar o `elementFromPoint` |
| Vaga ocupada | O jogador que estava lá vai para o lugar de onde o outro saiu (troca). Se o outro veio do elenco, ele volta para o elenco |

## 📊 Cálculo da força do time

**Overall na posição:** cada jogador tem uma posição natural e posições secundárias. Fora delas ele perde overall:

| Encaixe | Exemplo | Perda | Bolinha |
| --- | --- | ---: | :---: |
| Natural | Cassierra de centroavante | 0 | 🟢 |
| Secundária | Minda de ponta esquerda | −2 | 🟢 |
| Vizinha | Bernard (meia) de ponta direita | −6 | 🟡 |
| Improvisado | Lyanco de centroavante | −15 | 🔴 |
| Goleiro na linha (ou o contrário) | Everson de centroavante | −45 | 🔴 |

As posições vizinhas de cada posição ficam em `src/config/posicoes.js` (`POSICOES`).

**Setores:** cada vaga pesa em um ou mais setores (`PESOS`). Um lateral é 0,8 defesa + 0,2 meio + 0,1 ataque; um meia ofensivo é 0,7 meio + 0,6 ataque; um volante é 0,45 defesa + 1 meio.

```text
força do setor = média ponderada do overall na posição de quem joga no setor
               + 3 × (peso do setor neste esquema − peso médio do setor nos 8 esquemas)
```

A primeira parte mede a **qualidade** dos jogadores; a segunda, a **quantidade** de gente no setor. Por isso o 5-3-2 sobe a defesa e derruba o ataque, mesmo com os mesmos jogadores. Vaga vazia conta como um jogador de overall 35.

| Indicador | Cálculo |
| --- | --- |
| Ataque, Meio-campo, Defesa | Fórmula acima (0 a 99) |
| Goleiro | Overall na posição de quem está no gol |
| Geral | Média do overall na posição dos 11 |
| Entrosamento | Média do encaixe: natural 100, secundária 85, vizinha 60, improvisado 25, goleiro na linha 0 |

### 🚦 Cores

| Onde | Verde | Amarelo | Vermelho |
| --- | --- | --- | --- |
| Cor da barra e do número Geral | Forte (75+) | Regular (70 a 74) | Fraco (até 69) |
| Linha do setor no gráfico | Melhorou na última mudança | (não muda) | Piorou na última mudança |
| Faixa do campo (ataque, meio, defesa) | Melhorou na última mudança | (não muda) | Piorou na última mudança |
| Bolinha da carta | Na posição | Adaptado | Improvisado |

Os limites de cada nível ficam em `NIVEIS_FORCA` (`src/config/appConfig.js`). As faixas do campo vão de 0 a 30% da altura (ataque), de 30 a 60% (meio-campo) e de 60 a 100% (defesa), e ficam em `ZONAS` (`src/components/Campo/Campo.jsx`).

## 🧬 Dados do elenco

Os dados ficam em **`src/data/elenco.json`**:

```json
{
  "meta": { "clube": "Atlético Mineiro", "temporada": 2026, "fonte": "Site oficial do Atlético", "atualizadoEm": "2026-11-09" },
  "jogadores": [
    {
      "id": "fred",
      "nome": "Fred",
      "nomeCompleto": "Frederico Rodrigues de Paula Santos",
      "numero": 7,
      "posicao": "VOL",
      "secundarias": ["MC"],
      "nacionalidade": "Brasil",
      "nascimento": 1993,
      "overall": 78,
      "atributos": { "ritmo": 66, "finalizacao": 63, "passe": 83, "drible": 73, "defesa": 79, "fisico": 80 },
      "foto": "https://atletico.com.br/wp-content/uploads/2026/08/Fred_Site.png"
    }
  ]
}
```

| Campo | Descrição |
| --- | --- |
| `id` | Identificador e nome do arquivo da foto (`public/jogadores/{id}.webp`) |
| `posicao` | Posição natural: `GOL`, `LD`, `LE`, `ZAG`, `ALD`, `ALE`, `VOL`, `MC`, `MD`, `ME`, `MEI`, `PD`, `PE`, `ATA` |
| `secundarias` | Posições onde ele também joga bem (perde só 2) |
| `overall` | Nota geral estilo FIFA (de 1 a 99) |
| `atributos` | RIT, FIN, PAS, DRI, DEF, FIS (goleiros: ELA, MAN, CHU, REF, VEL, POS) |
| `foto` | URL da foto oficial, ou caminho dentro de `public/` (`null` = silhueta) |
| `revisar` | `true` para jogadores que o `npm run fotos` adicionar no futuro e que ainda precisam de ajuste |

> 📌 Overall e atributos são **estimativas no estilo FIFA**, feitas para o jogo; ajuste à vontade no `elenco.json`. Jogadores jovens sem dados públicos (Robert Alves, Pedro Cobra, K. Pascini, Índio, Cissé, T. Borbas e C. Soares) estão sem idade e, em alguns casos, sem nacionalidade.

## 🧩 Esquemas táticos

Os esquemas ficam em `src/config/formacoes.js`. Cada vaga tem a posição e as coordenadas em porcentagem do campo (`x` da esquerda para a direita, `y` do gol adversário para o nosso):

```js
{
  id: "4-3-3",
  vagas: [
    { pos: "GOL", x: 50, y: 89 },
    { pos: "LE", x: 14, y: 68 }, { pos: "ZAG", x: 37, y: 73 }, { pos: "ZAG", x: 63, y: 73 }, { pos: "LD", x: 86, y: 68 },
    { pos: "MC", x: 28, y: 47 }, { pos: "VOL", x: 50, y: 54 }, { pos: "MC", x: 72, y: 47 },
    { pos: "PE", x: 16, y: 21 }, { pos: "ATA", x: 50, y: 14 }, { pos: "PD", x: 84, y: 21 },
  ],
}
```

Para criar um esquema novo, basta acrescentar um objeto com 11 vagas: o seletor, a miniatura e o cálculo da força se ajustam sozinhos.

Ao trocar de esquema (e no **Escalar melhores**), a função `distribuir` monta todos os pares jogador × vaga com o overall na posição, ordena do maior para o menor e vai preenchendo as vagas (algoritmo guloso).

## ⚛️ Conceitos de React utilizados

| Conceito | Onde |
| --- | --- |
| Componentes funcionais e props | Todos os arquivos de `src/components/` |
| `useReducer` | Estado da prancheta em `useEscalacao` (mover, trocar esquema, escalar, limpar, desfazer) |
| `useState` | Jogador selecionado, pesquisa e filtro do elenco, posição do arrasto |
| `useEffect` | Gravar no `localStorage`; ouvir `pointermove`/`pointerup` na janela |
| `useMemo` | Força do time (agora e antes), lista filtrada do elenco |
| `useCallback` + `useRef` | Callback estável do arrasto; ponto de início do arrasto sem re-render |
| `useId` | `<label>` da pesquisa e padrão SVG das listras da silhueta |
| Hooks próprios | `useEscalacao`, `useArrastar` |
| Renderização condicional | Ficha do jogador, vaga livre x carta, estado vazio da pesquisa |
| Listas com `map()` | Vagas, banco, elenco, esquemas, barras do gráfico |
| Eventos | `onPointerDown`, `onClick`, `onChange`, `onKeyDown`, `onError` (foto reserva) |

## 📂 Estrutura do Projeto

```text
📁 CoachGalo
│
├── 📁 imgs                                └── Capturas de tela usadas neste README (npm run screenshots)
├── 📁 public
│   ├── 📁 jogadores                       └── Fotos oficiais dos jogadores ({id}.webp)
│   └── favicon.svg                        └── Favicon: bola de futebol do react-icons (IoFootball)
│
├── 📁 scripts
│   ├── fotos.mjs                          └── npm run fotos: fotos oficiais + sincroniza o elenco com o site
│   └── screenshots.mjs                    └── npm run screenshots: capturas para o README
│
├── 📁 src
│   ├── 📁 assets/images
│   │   └── atletico.svg                   └── Escudo do Atlético (topo da página)
│   │
│   ├── ⚙️ config
│   │   ├── appConfig.js                   └── Tamanho do banco, chave do localStorage, escala do gráfico, cor da carta, níveis de força (verde/amarelo/vermelho)
│   │   ├── formacoes.js                   └── Os 8 esquemas táticos com as coordenadas das vagas
│   │   └── posicoes.js                    └── Posições, setores, posições vizinhas, perdas e pesos
│   │
│   ├── 📊 data
│   │   └── elenco.json                    └── Elenco 2026: posições, overall, atributos e fotos
│   │
│   ├── 🔎 services
│   │   ├── elencoService.js               └── Jogadores prontos para a tela, pesquisa e URL da foto
│   │   └── escalacaoService.js            └── Encaixe, overall na posição, força do time, distribuir, escalar melhores
│   │
│   ├── 🪝 hooks
│   │   ├── useEscalacao.js                └── Reducer da prancheta + histórico + localStorage
│   │   └── useArrastar.js                 └── Arrastar e soltar com Pointer Events
│   │
│   ├── 🧰 utils
│   │   ├── storage.js                     └── localStorage com try/catch
│   │   └── texto.js                       └── normalizar() para a pesquisa e sinal() (+3 / −2)
│   │
│   ├── 🎨 components
│   │   ├── PageLayout/                    └── Faixa listrada alvinegra com o escudo do Galo, título e rodapé
│   │   ├── Elenco/                        └── Lista do elenco com pesquisa, filtro e status
│   │   ├── Campo/                         └── Campo com as linhas em SVG, as 11 vagas e as faixas coloridas dos setores
│   │   ├── Banco/                         └── 12 vagas de reserva
│   │   ├── CartaJogador/                  └── Carta estilo FIFA (ouro, prata, bronze) com o encaixe
│   │   ├── FotoJogador/                   └── Foto com a silhueta listrada como plano B
│   │   ├── SeletorEsquema/                └── Botões dos esquemas com miniatura
│   │   ├── ForcaTime/                     └── Gráfico de barras com cores de nível, melhorou/piorou e legenda
│   │   └── FichaJogador/                  └── Atributos e ações do jogador selecionado
│   │
│   ├── App.jsx                            └── Liga elenco, campo, banco e painel; modo clique e arrasto
│   ├── App.css                            └── Grade da prancheta (3 colunas, 2 no tablet, 1 no celular)
│   ├── index.css                          └── Tokens de cor, fontes e botões
│   └── main.jsx
│
├── 📄 index.html
├── 📄 vite.config.js                      └── base "./" (funciona na Vercel e no GitHub Pages)
└── 📄 package.json
```

Hierarquia dos componentes:

```text
App
 └── PageLayout
      ├── Elenco ── FotoJogador
      ├── Campo ── CartaJogador ── FotoJogador
      ├── Banco ── CartaJogador
      ├── SeletorEsquema
      ├── ForcaTime
      ├── FichaJogador ── CartaJogador
      └── (fantasma do arrasto) ── CartaJogador
```

## ☁️ Deploy

**Vercel:** em [vercel.com/new](https://vercel.com/new), importe o repositório (preset **Vite**) e clique em **Deploy**. Não há variáveis de ambiente.

**GitHub Pages:** como o `vite.config.js` usa `base: "./"`, a pasta `dist/` funciona numa subpasta como `https://seu-usuario.github.io/coachgalo/`.

```bash
npm run build
```

> As fotos são carregadas do site oficial, então o deploy não precisa delas. Se preferir hospedar cópias, rode o `npm run fotos` antes do build: as fotos de `public/jogadores/` vão para o `dist/`.

## 🧯 Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Cartas só com a silhueta | Sem internet ou site do Atlético fora do ar | As fotos voltam quando a conexão voltar; ou salve cópias locais com `npm run fotos` |
| `npm run fotos` diz "Nenhum jogador encontrado" | O site mudou o HTML ou está fora do ar | Nada é alterado; ajuste `lerHtml` em `scripts/fotos.mjs` se o HTML mudou |
| `Executable doesn't exist` no `npm run screenshots` (ou no `npm run fotos`) | Chromium do Playwright não instalado | `npx playwright install chromium` |
| Jogador novo com overall 70 e aviso na ficha | Veio do site com `"revisar": true` | Ajustar posição, overall e atributos no `elenco.json` |
| No celular, a lista rola em vez de arrastar | Comportamento esperado (`touch-action: pan-y`) | Toque no jogador e depois na vaga |
| A escalação antiga reaparece | Ela fica salva no `localStorage` | Botão **Limpar** ou **Escalar melhores** |

## 📦 Dependências

```json
"dependencies": {
  "@fontsource/saira": "^5.3.0",
  "@fontsource/saira-condensed": "^5.3.0",
  "react": "^19.3.1",
  "react-dom": "^19.3.1",
  "react-icons": "^5.7.0"
},
"devDependencies": {
  "@vitejs/plugin-react": "^6.3.0",
  "oxlint": "^1.93.0",
  "playwright": "^1.65.0",
  "vite": "^8.3.7"
}
```

- [`react`](https://react.dev/) e [`react-dom`](https://react.dev/): a interface.
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones da interface (Feather) e a bola de futebol do favicon (`IoFootball`, do Ionicons 5, convertida para `public/favicon.svg`).
- [`@fontsource/saira-condensed`](https://fontsource.org/fonts/saira-condensed) e [`@fontsource/saira`](https://fontsource.org/fonts/saira): fontes empacotadas pelo Vite (funcionam sem internet). Saira Condensed nos números das cartas e nos títulos; Saira nos textos.
- [`playwright`](https://playwright.dev/): Chromium sem janela para o `npm run fotos` (quando a página é montada por JavaScript) e para o `npm run screenshots`.
- Arrastar e soltar, campo, cartas e gráfico são feitos com React, SVG e CSS, sem biblioteca.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente (`http://localhost:4173`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run fotos` | Sincroniza o elenco com o site do Atlético e baixa as fotos que faltam |
| `npm run screenshots` | Gera as capturas de tela do README em `imgs/` (na 1ª vez: `npx playwright install chromium`) |

## 🔗 Urls do projeto

http://localhost:5173/

http://localhost:4173/ (depois de `npm run build` + `npm run preview`)

## 📚 Documentação e Links Úteis

**Atlético Mineiro**

- [Elenco oficial (fotos)](https://atletico.com.br/futebol/masculino/elenco/)

**React e Vite**

- [Documentação do React](https://react.dev/)
- [React: useReducer](https://react.dev/reference/react/useReducer)
- [Documentação do Vite](https://vite.dev/)

**Arrastar e soltar**

- [MDN: Pointer Events](https://developer.mozilla.org/pt-BR/docs/Web/API/Pointer_events)
- [MDN: document.elementFromPoint](https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint)
- [MDN: touch-action](https://developer.mozilla.org/pt-BR/docs/Web/CSS/touch-action)

**Ferramentas**

- [Playwright](https://playwright.dev/)
- [Fontsource](https://fontsource.org/)
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html)

> ⚠️ O nome, as cores e os jogadores do Clube Atlético Mineiro, assim como as fotos oficiais, pertencem ao clube e aos seus titulares. Overall e atributos são estimativas para o jogo, sem relação com o EA Sports FC. O escudo (`src/assets/images/atletico.svg`) é marca do clube. Este é um projeto acadêmico, sem fins comerciais.

## 📄 Licença
Este projeto está licenciado sob a MIT License.
