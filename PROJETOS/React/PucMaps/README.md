# Projeto PucMaps (React + Vite) 🗺️

## 📖 Descrição

Mapa interativo do **Campus Coração Eucarístico da PUC Minas** feito com **React**, **Vite** e [**MapLibre GL JS**](https://maplibre.org/maplibre-gl-js/docs/). Mostra os prédios, cantinas, portarias, estacionamentos e áreas verdes do campus, desenha o **grafo de caminhos a pé** (calçadas, escadas e entradas) e calcula **rotas entre os prédios** com o **algoritmo de Dijkstra**, tudo no navegador.

Este projeto **não tem back-end nem banco de dados** e **não precisa de chave de API**: não tem `.env.local` nem variável na Vercel. Os dados vêm direto do [**OpenStreetMap**](https://www.openstreetmap.org) pela [**API Overpass**](https://wiki.openstreetmap.org/wiki/Overpass_API), que é pública e libera CORS, então o navegador chama direto.

- 🏢 **Locais do campus** com ícone e cor por tipo (acadêmico, alimentação, banco, portaria, estacionamento, área verde...);
- 🔎 **Busca** por nome ou número do prédio (sem diferenciar acentos) e **filtro por tipo**;
- 📍 Clique na lista ou no mapa: o mapa **voa até o prédio**, destaca o contorno e abre um **popup**;
- 🧭 **Rotas** entre dois locais: distância, tempo a pé e quantos trechos de escada;
- ♿ **Rota acessível**: ignora escadas e trechos marcados como `wheelchair=no`;
- 🕸️ **Grafo visível no mapa**: nós, arestas, escadas em vermelho e ligações geradas tracejadas em laranja (igual ao painel do projeto original);
- 🗺️ Fundo **Vetorial** (desenhado com os próprios dados, nas cores do projeto original) ou **Raster** (blocos do OpenStreetMap);
- ⚡ Abre **na hora** com a cópia local do campus e busca a versão **ao vivo** em segundo plano (cache de 7 dias no `localStorage`).

| Aba | O que faz |
| --- | --- |
| Locais | Busca, filtro por tipo, detalhes do prédio e "Rota até aqui" |
| Rotas | Origem, destino, rota acessível e o resultado do Dijkstra |
| Grafo | Mostra/oculta o grafo, números (nós, arestas, escadas, ilhas) e legenda |

## 🏆 Créditos: o projeto original

Este projeto é uma **versão simplificada** do **PUCMaps**, projeto do grupo que **venceu o melhor trabalho interdisciplinar da disciplina de TI5** (Trabalho Interdisciplinar 5) do curso de **Engenharia de Software** da **PUC Minas, campus Coração Eucarístico**.

👉 Repositório original: [ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti5-6904100-pucmaps](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti5-6904100-pucmaps)

Aqui ficou só a parte dos **mapas**: o contorno do campus, as regras que classificam cada prédio, as regras de peso e acessibilidade dos caminhos, o grafo e o Dijkstra foram trazidos do back-end original (NestJS) para JavaScript puro, rodando no navegador. Os ícones de cada tipo de local também são os do projeto original. Ficaram de fora o app mobile (Flutter), o painel administrativo, eventos, cardápios, login, banco de dados e a infraestrutura na AWS.

> ### PUCMaps
>
> O projeto PUCMaps tem como objetivo solucionar os desafios de mobilidade e localização dentro do Campus Coração Eucarístico da PUC Minas, que possui mais de 89 prédios distribuídos em uma área superior a 338 mil m². A proposta é transformar a ansiedade e os atrasos de calouros e visitantes em eficiência acadêmica por meio de um aplicativo móvel de navegação interna e micro-navegação. Diferente de sistemas de GPS convencionais que mapeiam apenas vias públicas, o PUCMaps foca em rotas acessíveis entre blocos, rampas e elevadores, integrando essas informações à rotina universitária. Além da função de mapeamento, o aplicativo atua como um hub informativo dinâmico, centralizando dados sobre eventos, palestras e cardápios das lanchonetes em tempo real. O modelo de negócio prevê a sustentabilidade financeira através de parcerias com comércios internos e a futura expansão para outros campi da instituição. Tecnicamente, o projeto supera as limitações de sinal de satélite em ambientes fechados ao utilizar algoritmos de busca em grafos, garantindo precisão no guiamento entre pontos de referência internos.

### 👥 Integrantes

- Gabriel Assis de Souza
- João Pedro Lezsi Fernandes
- João Pedro Peres Barbosa
- Luis Henrique Gonçalves Barbosa
- Marcela Mendes Campos

### 🎓 Orientadores

- Prof. Artur Martins Mol
- Prof. Cleiton Silva Tavares
- Prof. Leonardo Vilela Cardoso

## 🖼️ Capturas de Tela

| Início |
| :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/Home.png) |

| Mapa do campus | Local escolhido |
| :---: | :---: |
| ![Mapa](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/Mapa.png) | ![Local](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/Local.png) |

| Grafo de caminhos | Grafo (zoom) |
| :---: | :---: |
| ![Grafo](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/Grafo.png) | ![GrafoZoom](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/GrafoZoom.png) |

| Rota: Portaria 3 → Cantina do Prédio 16 |
| :---: |
| ![Rota](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/Rota.png) |

| Rota mais rápida (com escadas) | Rota acessível (sem escadas) |
| :---: | :---: |
| ![RotaEscada](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/RotaEscada.png) | ![RotaAcessivel](https://joaopauloaramuni.github.io/react-imgs/PucMaps/imgs/RotaAcessivel.png) |

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Não precisa configurar nada: o site abre na hora com a cópia local do campus e busca a versão ao vivo no Overpass em segundo plano, guardando no `localStorage` por 7 dias.

## 💾 Atualizando a cópia local (`npm run snapshot`)

O arquivo `public/data/campus-overpass.json` é a **cópia de reserva** dos dados: o site usa quando os servidores do Overpass estão fora do ar ou lentos. A cópia que vem no projeto já é do **campus inteiro** (4.563 elementos do OSM, 105 locais).

Para atualizar a cópia com os dados mais recentes do OpenStreetMap, rode (precisa de internet):

```bash
npm run snapshot
```

O script `scripts/snapshot.mjs` usa a mesma consulta e os mesmos servidores do site e sobrescreve `public/data/campus-overpass.json`. Faça o commit do arquivo novo e pronto: mesmo sem o Overpass, o site abre com os dados atualizados.

> 💡 Rode de novo de tempos em tempos: o OpenStreetMap é colaborativo e o mapa do campus vai sendo melhorado.

## ☁️ Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Clique em **Deploy**.

Não há variáveis de ambiente para cadastrar.

## ⚙️ Como funciona

### 1. Os dados (OpenStreetMap + Overpass)

`src/services/overpassService.js` monta uma consulta em **Overpass QL** com o retângulo do campus e pede prédios, estacionamentos, áreas verdes, portarias, entradas e caminhos (`highway=footway|steps|service|...`). É a mesma consulta do back-end original, com algumas áreas a mais para o fundo do mapa.

Para ninguém ficar esperando o Overpass (um servidor público que às vezes demora), o site usa a estratégia **"mostra já, atualiza depois"** (*stale-while-revalidate*):

| # | Fonte | O que acontece |
| --- | --- | --- |
| 1 | `localStorage` | Se baixou ao vivo há menos de 7 dias, abre na hora e pronto |
| 2 | `public/data/campus-overpass.json` | Sem cache, abre **na hora** com a cópia local |
| 3 | Servidores Overpass (3, um depois do outro, 30 s cada) | Em **segundo plano**: quando a resposta chega, o mapa troca para os dados ao vivo e salva no cache |

Se o Overpass não responder, o site simplesmente continua com a cópia local.

O rodapé da lateral mostra **de onde vieram os dados**, quantos elementos do OSM chegaram, quanto tempo o processamento levou e se a versão ao vivo ainda está sendo buscada. O botão 🔄 apaga o cache e busca ao vivo de novo.

### 2. Os locais (`src/core/campus.js` + `src/core/classify.js`)

Cada elemento do OSM com `building`, `amenity=parking`, `leisure=park` ou `barrier=gate` **dentro do contorno do campus** vira um local. O tipo é decidido pelas mesmas regras das *specifications* do original, na mesma ordem:

| Tipo | Exemplo de regra |
| --- | --- |
| Banco | nome tem "caixa", "bradesco", "agência bancária" ou `amenity=bank` |
| Portaria | `barrier=gate` |
| Alimentação | nome tem "cantina", "lanche", "restaurante" ou `amenity=cafe` |
| Esportes | nome tem "quadra", "ginásio", "educação física" |
| Acadêmico | nome tem "prédio", "instituto", "faculdade", "teatro", "museu" ou `building=university` |

### 3. O grafo (`src/core/graph.js`)

1. Cada caminho a pé vira uma sequência de **arestas**, com distância (fórmula de Haversine) e tempo a **1,4 m/s**.
2. **Pesos e acessibilidade** (como no original):

   | Trecho | Tempo | Acessível? |
   | --- | --- | --- |
   | Escada (`highway=steps`) | × 3 | ❌ |
   | Piso irregular (terra, grama, cascalho) | × 1,5 | ✅ |
   | `wheelchair=no` | × 1 | ❌ |

3. Cada local ganha **nós de entrada**: os nós marcados com `entrance=*` no OSM ou, sem eles, o ponto do contorno mais perto de um caminho.
4. As entradas são **ligadas aos caminhos** a até 15 m (no máximo 2 ligações, para não virar um "leque"). Essas são as arestas tracejadas em laranja.
5. **Simplificação**: nós "de passagem" (com só 2 vizinhos) são removidos e as arestas são somadas. Sobram só cruzamentos e entradas.

### 4. A rota (Dijkstra)

`findRoute(graph, origem, destino, { accessibleOnly })` parte de **todas as entradas da origem** ao mesmo tempo e para na **primeira entrada do destino** que alcançar, sempre pelo menor tempo. Com `accessibleOnly`, as arestas não acessíveis são ignoradas. A fila de prioridade é um *min-heap*, então a rota sai em poucos milissegundos.

### 5. O mapa (`src/components/CampusMap/CampusMap.jsx`)

- O **MapLibre não é um componente React**: o mapa é criado uma vez num `useEffect` e guardado num `useRef`. As mudanças de props viram chamadas aos métodos dele:

  | Mudança no React | Chamada no MapLibre |
  | --- | --- |
  | Chegaram os dados | `source.setData(geojson)` |
  | Trocou o fundo / mostrou o grafo | `map.setLayoutProperty(id, "visibility", ...)` |
  | Escolheu um local | `map.setFilter(...)` + `map.flyTo(...)` + popup |
  | Calculou uma rota | `source.setData(rota)` + `map.fitBounds(...)` |

- Todas as camadas existem desde o início: o React só troca dados, filtros e visibilidade.
- As **fontes dos rótulos** (`public/fonts`, Noto Sans) e os **ícones** (`src/assets/icons`) ficam no próprio projeto: nada depende de servidor de terceiros, a não ser o Overpass e os blocos do fundo Raster.
- O popup é montado com `textContent` (nada vira HTML): sem risco de XSS.
- O maplibre-gl só é baixado quando o mapa aparece (`React.lazy` no `App.jsx`).
- O MapLibre processa os dados num **Web Worker** (outra thread). A partir da versão 6 ele procura o arquivo do worker ao lado do próprio código, o que não funciona depois do build. Por isso o `CampusMap.jsx` importa o worker com `?worker&url` (o Vite empacota ele num arquivo próprio) e chama `maplibregl.setWorkerUrl(workerUrl)`. O `vite.config.js` define `worker.format: "es"` porque esse worker usa `import`.

## 📂 Estrutura do Projeto

```text
📁 PucMaps
│
├── 📁 imgs                        └── Capturas de tela usadas neste README
├── 📁 public
│   ├── 📁 data
│   │   └── campus-overpass.json   └── Cópia local dos dados (reserva)
│   ├── 📁 fonts                   └── Noto Sans (.pbf) para os rótulos do mapa
│   └── pucminas-logo.png          └── favicon
│
├── 📁 scripts
│   └── snapshot.mjs               └── npm run snapshot: baixa o campus inteiro
│
├── 📁 src
│   ├── 📁 assets
│   │   ├── 📁 icons               └── Ícones dos tipos (do projeto original)
│   │   └── 📁 images              └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/            └── Card da página com a faixa azul (logo PUC + PUCMaps)
│   │   ├── CampusMap/
│   │   │   ├── CampusMap.jsx      └── MapLibre: camadas, ícones, popup, flyTo, rota
│   │   │   └── CampusMap.css
│   │   └── MapExplorer/
│   │       ├── MapExplorer.jsx    └── Abas + mapa (junta tudo)
│   │       ├── PlaceList.jsx      └── Busca, filtro por tipo e lista de locais
│   │       ├── RoutePanel.jsx     └── Origem, destino, rota acessível e resultado
│   │       ├── GraphPanel.jsx     └── Liga/desliga o grafo, números e legenda
│   │       ├── DataSource.jsx     └── De onde vieram os dados + recarregar
│   │       └── MapExplorer.css
│   │
│   ├── ⚙️ config/mapConfig.js      └── Contorno do campus, zoom, servidores, cache
│   ├── 🧠 core
│   │   ├── campus.js              └── OSM -> locais e fundo vetorial (GeoJSON)
│   │   ├── classify.js            └── Regras de tipo e de peso/acessibilidade
│   │   ├── geometry.js            └── Haversine, ponto no polígono, centroides
│   │   ├── graph.js               └── Grafo de caminhos + Dijkstra
│   │   └── placeTypes.js          └── Nome, cor e ícone de cada tipo
│   ├── 🪝 hooks/useCampusData.js   └── Mostra já (cache/cópia), atualiza depois (Overpass)
│   ├── 🛠️ services/overpassService.js └── Overpass, cache e cópia local
│   ├── App.jsx                    └── Carrega o mapa com React.lazy + créditos
│   ├── index.css
│   └── main.jsx
│
├── 📄 vite.config.js
└── 📄 package.json
```

## 📦 Dependências

```json
"dependencies": {
  "maplibre-gl": "^6.11.2",
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-icons": "^5.7.0"
}
```

- [`maplibre-gl`](https://www.npmjs.com/package/maplibre-gl): mapas vetoriais com WebGL, código aberto e sem token (a mesma biblioteca do projeto original). A versão 6 corrige a falha [GHSA-jrc7-96c5-q579](https://github.com/advisories/GHSA-jrc7-96c5-q579), que o `npm audit` aponta nas versões até a 6.4.0.
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones da interface

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run snapshot` | Baixa o campus inteiro para `public/data/campus-overpass.json` |

## 🗺️ Dados e atribuição

Os dados do mapa são © colaboradores do [OpenStreetMap](https://www.openstreetmap.org/copyright), disponíveis sob a licença [ODbL](https://opendatacommons.org/licenses/odbl/). A atribuição aparece no canto do mapa. Encontrou um prédio errado ou faltando? Dá para corrigir direto no OpenStreetMap (botão **Ver no OSM** em cada local), e a correção aparece aqui na próxima atualização.

## 📄 Licença
Este projeto está licenciado sob a MIT License.
