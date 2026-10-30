# Projeto Ônibus BH (React + Vite) 🚌

## 📖 Descrição

Consulta de **linhas de ônibus de Belo Horizonte** feita com **React**, **Vite** e [**MapLibre GL JS**](https://maplibre.org/maplibre-gl-js/docs/). Busca a linha pelo número ou pelo nome, **desenha o trajeto no mapa**, mostra o **quadro de horários da BHTrans** (dias úteis, sábado e domingo/feriado) e a **posição dos ônibus em tempo real**. Na página inicial, lista as **linhas que passam perto dos campi Coração Eucarístico e Lourdes da PUC Minas**, com o ponto mais próximo, a distância a pé e os próximos horários previstos nele.

Os dados são **abertos e oficiais**:

- **GTFS estático da BHTrans**: linhas, pontos, trajetos e horários programados. O `npm run dados` baixa o arquivo e transforma em JSONs pequenos em `public/data`.
- **GTFS-Realtime da Prefeitura de Belo Horizonte** ([dados.pbh.gov.br/dataset/gtfs-rt](https://dados.pbh.gov.br/dataset/gtfs-rt)): a posição de cada ônibus, atualizada a cada ~20 segundos. Como a URL tem uma **chave de acesso**, quem fala com a PBH é o servidor (Vercel Function `api/pbh.js`), nunca o navegador.

- 🔎 **Busca** por número ou nome da linha, sem diferenciar acentos (Enter abre a primeira);
- 🎓 **Linhas perto da PUC Minas**: abas para os campi **Coração Eucarístico** e **Lourdes**, pontos a até 500 m no mapa e filtro por ponto;
- 🗺️ **Trajeto da linha** desenhado pelas ruas (`shapes.txt`), com todos os pontos clicáveis e os dois sentidos;
- 📍 **Ônibus ao vivo** no mapa, com seta indicando o rumo, velocidade e há quanto tempo a posição foi enviada;
- 🕐 **Quadro de horários** no formato do quadro impresso (uma linha por hora), com as **3 próximas partidas** e a tabela do dia escolhida sozinha (inclusive **feriados** nacionais e de BH);
- 🚏 **Previsão em qualquer ponto**: escolha um ponto e os horários passam a ser os previstos nele, e não só a saída do ponto inicial;
- 📱 Layout responsivo e link direto para cada linha (`#/linha/...`).

| Página | O que faz |
| --- | --- |
| Início | Busca de linhas, linhas perto de cada campus da PUC Minas e fonte dos dados |
| Linha | Letreiro, sentidos, mapa com trajeto e ônibus ao vivo, horários e lista de pontos |

## 🖼️ Capturas de Tela

| Início |
| :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/Home.png) |

| Busca por linha |
| :---: |
| ![Busca](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/Busca.png) |

| Perto do Coração Eucarístico | Perto de Lourdes |
| :---: | :---: |
| ![CampusCoracaoEucaristico](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/CampusCoracaoEucaristico.png) | ![CampusLourdes](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/CampusLourdes.png) |

| Linha: trajeto, ônibus ao vivo e horários |
| :---: |
| ![Linha](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/Linha.png) |

| Previsão no ponto perto do campus | Lista de pontos |
| :---: | :---: |
| ![LinhaPonto](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/LinhaPonto.png) | ![Pontos](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/Pontos.png) |

| Celular |
| :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/OnibusBH/imgs/Mobile.png) |

> 📸 As capturas são geradas pelo `npm run screenshots` (veja abaixo) e ficam em `imgs/`.

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # opcional: preencha o PBH_GTFS_RT_URL para ver os ônibus ao vivo
npm run dev
```

Acesse `http://localhost:5173`.

Na primeira vez, o `npm run dev` baixa o GTFS da BHTrans e gera os dados sozinho (o `predev` roda `scripts/dados.mjs --se-faltar`). Leva alguns segundos, porque o `stop_times.txt` tem milhões de linhas.

Sem o `PBH_GTFS_RT_URL`, **tudo funciona** (busca, mapa, trajeto, pontos, horários e linhas perto da PUC), só sem os ônibus ao vivo: a faixa acima do mapa avisa que o tempo real está desligado.

## 🔑 Como pegar a URL do tempo real (GTFS-RT)

1. Abra [dados.pbh.gov.br/dataset/gtfs-rt](https://dados.pbh.gov.br/dataset/gtfs-rt), o conjunto de dados **GTFS-RT** do Portal de Dados Abertos da PBH.
2. Entre no recurso **`vehicle-positions`** (posição dos veículos).
3. Copie a **URL completa** do recurso, **com a chave** que vem nela.

> ⚠️ A chave pode ser **trocada pela PBH sem aviso**. Se o mapa disser que a PBH recusou o acesso (HTTP 401/403), pegue a URL atual no portal e atualize a variável.

## 🔐 Configurando o `.env.local`

O `.env.local` guarda as variáveis de ambiente **só na sua máquina**: ele está no `.gitignore` e **não vai para o GitHub**.

1. Copie o modelo:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha:

   ```properties
   PBH_GTFS_RT_URL=https://...vehicle-positions...?chave=xxxxxxxx

   # Opcional: outra URL para o GTFS estático (usada pelo npm run dados)
   PBH_GTFS_URL=
   ```

3. **Reinicie** o `npm run dev`.

> 💡 **Por que não `VITE_PBH_GTFS_RT_URL`?** Tudo que começa com `VITE_` vai **dentro do JavaScript** do navegador, e qualquer visitante consegue ler. Sem o prefixo, a URL é lida **só no servidor**: pelo `vite.config.js` no `npm run dev` e pela **Vercel Function** `api/pbh.js` em produção. A página só pergunta ao servidor **se** o tempo real está ligado.

## 💾 Atualizando os dados (`npm run dados`)

Os arquivos de `public/data` saem do GTFS da BHTrans. Para baixar a versão mais recente (o quadro de horários muda algumas vezes por ano), rode:

```bash
npm run dados
```

| Opção | O que faz |
| --- | --- |
| `npm run dados` | Baixa o GTFS (URL em `src/config/appConfig.js` ou `PBH_GTFS_URL`) e gera tudo de novo |
| `npm run dados -- --arquivo gtfs.zip` | Usa um `.zip` do GTFS que você já baixou |
| `node scripts/dados.mjs --se-faltar` | Só roda se `public/data/linhas.json` não existir (é o que o `predev` e o `prebuild` usam) |

O resultado mostra quantas linhas foram geradas e quantas passam perto de cada campus:

```text
✅ 3xx linhas salvas em public/data
   🎓 Coração Eucarístico: xx linhas a até 500 m
   🎓 Lourdes: xx linhas a até 500 m
```

> 💡 Os arquivos de `public/data` estão no `.gitignore`: o deploy na Vercel baixa o GTFS sozinho no `prebuild`, então o site sempre sai com o quadro de horários mais novo. Se preferir **versionar** os dados (para o build não depender do download), apague as duas últimas linhas do `.gitignore` e faça o commit da pasta.

## 📸 Gerando as capturas de tela (`npm run screenshots`)

```bash
npx playwright install chromium   # só na primeira vez
npm run screenshots
```

O script `scripts/screenshots.mjs` sobe o próprio servidor do Vite (com a rota `/api/pbh`), abre as páginas num Chromium sem janela e salva em `imgs/`: `Home`, `Busca`, `CampusCoracaoEucaristico`, `CampusLourdes`, `Linha`, `LinhaPonto`, `Pontos` e `Mobile`. Com o `PBH_GTFS_RT_URL` no `.env.local`, os ônibus ao vivo aparecem nas imagens.

Depois é só copiar a pasta para o repositório das imagens do GitHub Pages, em `react-imgs/OnibusBH/imgs/`, que é de onde este README carrega as capturas.

## ☁️ Deploy na Vercel (variáveis de ambiente)

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Abra **Environment Variables** e cadastre:

   | Key | Value |
   | --- | --- |
   | `PBH_GTFS_RT_URL` | URL do recurso `vehicle-positions`, com a chave |
   | `PBH_GTFS_URL` | (opcional) outra URL para o GTFS estático |

4. Clique em **Deploy**. O `prebuild` baixa o GTFS e gera `public/data` durante o build.

Se o projeto já estiver publicado: **Settings** → **Environment Variables** → adicione a variável (marque **Production**, **Preview** e **Development**) → **Save** → **Deployments** → três pontinhos do último deploy → **Redeploy**.

## ⚙️ Como funciona

### 1. O GTFS da BHTrans (`scripts/dados.mjs`)

O [GTFS](https://gtfs.org/pt/documentation/schedule/reference/) é um `.zip` com arquivos CSV. O script lê cada um **em streaming** (linha a linha, com `readline`), porque o `stop_times.txt` não cabe confortavelmente na memória de uma vez:

| Arquivo | Para que serve aqui |
| --- | --- |
| `routes.txt` | Número (`route_short_name`) e nome de cada linha |
| `trips.txt` | Viagens: linha, sentido (`direction_id`), destino e traçado |
| `calendar.txt` / `calendar_dates.txt` | Se a viagem roda em dia útil, sábado ou domingo |
| `stop_times.txt` | **1ª passada**: horário de saída de cada viagem. **2ª passada**: a sequência de pontos |
| `stops.txt` | Nome e coordenadas dos pontos |
| `shapes.txt` | O desenho do trajeto pelas ruas |
| `frequencies.txt` | (se existir) viagens "a cada N minutos", expandidas em horários |

Para cada **linha + sentido**, o script escolhe uma viagem **representante** (a do traçado mais comum, com mais pontos) para desenhar o mapa e listar os pontos, e junta as saídas de **todas** as viagens no quadro de horários. Também guarda quantos minutos o ônibus leva da saída até cada ponto (interpolando os pontos sem horário no GTFS), o que permite a **previsão em qualquer ponto**.

O traçado é simplificado com **Douglas-Peucker** (~4 m de tolerância) e as coordenadas ficam com 5 casas decimais (~1 m): os arquivos ficam várias vezes menores sem diferença visível no mapa.

Os nomes do GTFS vêm em CAIXA ALTA e viram "Título" (`CAETANO FURQUIM/NOVA CINTRA` → `Caetano Furquim / Nova Cintra`), mantendo siglas como BH, PUC, UFMG e MOVE.

### 2. Linhas perto da PUC Minas

Os campi ficam em `src/config/appConfig.js` (`CAMPI`). Para cada ponto de cada linha, o script calcula a distância até o campus (**fórmula de Haversine**) e guarda as linhas com algum ponto a até **500 m** (`RAIO_CAMPUS_M`), com o ponto mais próximo. A página inicial mostra a distância, o tempo a pé (a 1,3 m/s) e os próximos horários **previstos naquele ponto**.

> 📍 Mudou a coordenada de um campus ou o raio? Rode `npm run dados` de novo.

### 3. Horários (`src/core/horarios.js`)

| Regra | Como |
| --- | --- |
| Que horas são em BH | `Intl.DateTimeFormat` com `America/Sao_Paulo`, qualquer que seja o fuso do computador |
| Qual tabela vale hoje | Domingo **ou feriado** → domingo; sábado → sábado; senão, dias úteis |
| Feriados | Nacionais, Assunção (15/8) e Imaculada Conceição (8/12) de BH, Sexta-feira Santa e Corpus Christi (calculados a partir da **Páscoa**) |
| Depois da meia-noite | Como no GTFS, 0h30 de sábado é procurado como **24h30 da tabela de sexta** |

### 4. Tempo real (`api/_pbh.js` + `api/_gtfsrt.js`)

```text
navegador ──GET /api/pbh?recurso=onibus&rotas=ID──▶ servidor ──▶ feed GTFS-RT da PBH (com a chave)
          ◀──── JSON só com os ônibus da linha ─────          ◀── ~1.500 ônibus em Protocol Buffers
```

- O feed vem em **Protocol Buffers** (binário). Em vez da biblioteca oficial (que instala junto ferramentas de geração de código só para ler 10 campos), `api/_gtfsrt.js` tem um **decodificador mínimo** do formato: lê a etiqueta de cada campo (número + tipo), o valor (varint, float ou bloco) e pula o resto.
- O servidor guarda a última foto do feed por **15 s**: vários visitantes ao mesmo tempo não multiplicam as chamadas à PBH (e a CDN da Vercel também guarda a resposta, com `s-maxage=15`).
- A rota só aceita `status` e `onibus`, com no máximo 12 linhas e ids validados: não vira uma "porta aberta" para usar a chave com qualquer coisa.
- No navegador, `useOnibusAoVivo` pergunta a cada **20 s** e **pausa quando a aba fica escondida**.
- Os ônibus são ligados à linha pelo `route_id` do GTFS-RT, o mesmo do GTFS estático. Se o feed informar o `direction_id`, o mapa mostra só os ônibus do sentido escolhido.

### 5. O mapa (`src/components/Mapa/Mapa.jsx`)

- Fundo vetorial do [**OpenFreeMap**](https://openfreemap.org) (estilo *Positron*), **sem chave e sem cadastro**. Se ele não responder em 8 s, o mapa troca sozinho para os blocos do OpenStreetMap.
- Como no PucMaps, o **MapLibre não é um componente React**: o mapa é criado uma vez num `useEffect` e as props viram chamadas aos métodos dele:

  | Mudança no React | Chamada no MapLibre |
  | --- | --- |
  | Trocou de linha ou sentido | `source.setData(...)` + `map.fitBounds(...)` |
  | Chegou uma foto nova do tempo real | `source.setData(onibus)` |
  | Escolheu um ponto na lista | `map.easeTo(...)` + ponto destacado em âmbar |
  | Fundo de reserva carregou | camadas recriadas no evento `style.load` |

- O **ícone do ônibus** é desenhado num `<canvas>` (sem arquivo de imagem) e girado pelo rumo (`bearing`) que vem no GTFS-RT.
- Os popups são montados com `textContent` (nada vira HTML): sem risco de XSS.
- O maplibre-gl só é baixado quando um mapa aparece (`React.lazy` em `MapaLazy.jsx`), e o worker é importado com `?worker&url` + `maplibregl.setWorkerUrl(...)`, igual ao PucMaps.

### 6. O letreiro

O número da linha usa a fonte [**Doto**](https://fonts.google.com/specimen/Doto) (matriz de pontos), em âmbar sobre azul-marinho, imitando o letreiro eletrônico dos ônibus. O mesmo estilo marca as horas do quadro de horários.

## 📂 Estrutura do Projeto

```text
📁 OnibusBH
│
├── 📁 api
│   ├── _gtfsrt.js                 └── Decodificador mínimo de GTFS-Realtime (Protocol Buffers)
│   ├── _pbh.js                    └── Rota /api/pbh: busca, filtra e guarda o feed por 15 s
│   └── pbh.js                     └── Vercel Function (usa o _pbh.js)
│
├── 📁 imgs                        └── Capturas de tela (npm run screenshots)
├── 📁 public
│   ├── 📁 data                    └── Gerados pelo npm run dados
│   │   ├── linhas.json            └── Índice das linhas (busca)
│   │   ├── campus.json            └── Linhas perto de cada campus da PUC Minas
│   │   └── 📁 linhas/<id>.json    └── Sentidos, traçado, pontos e horários de cada linha
│   └── pucminas-logo.png          └── favicon
│
├── 📁 scripts
│   ├── dados.mjs                  └── npm run dados: GTFS da BHTrans -> JSON
│   └── screenshots.mjs            └── npm run screenshots: capturas para o README
│
├── 📁 src
│   ├── 📁 assets/images           └── pucminas-logo.png
│   ├── 🧩 components
│   │   ├── PageLayout/            └── Card da página com a faixa azul (logo PUC + Ônibus BH)
│   │   ├── BuscaLinhas/           └── Campo de busca e resultados
│   │   ├── CampusProximos/        └── Abas dos campi, lista de linhas e mapa dos pontos
│   │   ├── LinhaDetalhe/          └── Página da linha: sentidos, mapa, abas Horários/Pontos
│   │   ├── QuadroHorarios/        └── Próximas partidas e quadro por hora
│   │   ├── StatusAoVivo/          └── Faixa "N ônibus rodando agora"
│   │   ├── Letreiro/              └── Número da linha em estilo de letreiro
│   │   └── Mapa/
│   │       ├── Mapa.jsx           └── MapLibre: traçado, pontos, ônibus, campi, popups
│   │       └── MapaLazy.jsx       └── Carrega o mapa sob demanda (React.lazy)
│   │
│   ├── ⚙️ config/appConfig.js      └── Campi, URLs do GTFS, estilo do mapa, intervalo do tempo real
│   ├── 🧠 core
│   │   ├── geometria.js           └── Haversine, limites e Douglas-Peucker
│   │   ├── horarios.js            └── Hora em BH, feriados, tipo do dia, próximas partidas
│   │   └── texto.js               └── Busca sem acentos, nomes em "Título", ordem natural
│   ├── 🪝 hooks
│   │   ├── useCarregar.js         └── Carrega um JSON quando a chave muda
│   │   ├── useOnibusAoVivo.js     └── Pergunta ao /api/pbh a cada 20 s (pausa com a aba escondida)
│   │   ├── useAgora.js            └── Relógio de BH, atualizado a cada 30 s
│   │   └── useRota.js             └── Rotas no "#" da URL (#/linha/...)
│   ├── 🛠️ services
│   │   ├── dadosService.js        └── Lê public/data (com cache)
│   │   └── tempoRealService.js    └── Fala com o /api/pbh
│   ├── App.jsx                    └── Início (busca + campi) ou página da linha
│   ├── index.css
│   └── main.jsx
│
├── 📄 .env.example
├── 📄 vite.config.js              └── Plugin React + middleware /api/pbh no dev
└── 📄 package.json
```

## 📦 Dependências

```json
"dependencies": {
  "maplibre-gl": "^6.11.2",
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-icons": "^5.7.0"
},
"devDependencies": {
  "playwright": "^1.56.0",
  "yauzl": "^3.2.0"
}
```

- [`maplibre-gl`](https://www.npmjs.com/package/maplibre-gl): mapas vetoriais com WebGL, código aberto e sem token (a mesma biblioteca do PucMaps)
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones da interface
- [`yauzl`](https://www.npmjs.com/package/yauzl): lê o `.zip` do GTFS em streaming (só no `npm run dados`)
- [`playwright`](https://playwright.dev/): Chromium sem janela para o `npm run screenshots`

> O tempo real **não usa biblioteca de protobuf**: o decodificador está em `api/_gtfsrt.js`.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (gera os dados antes, se faltarem) |
| `npm run build` | Build de produção em `dist/` (gera os dados antes, se faltarem) |
| `npm run preview` | Testa o build localmente (com a rota `/api/pbh`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run dados` | Baixa o GTFS da BHTrans e gera `public/data` |
| `npm run screenshots` | Gera as capturas de tela do README em `imgs/` |

## 🗺️ Dados e atribuição

- Linhas, pontos, trajetos e horários: **GTFS da BHTrans / Prefeitura de Belo Horizonte**.
- Posição dos ônibus: **GTFS-RT do [Portal de Dados Abertos da PBH](https://dados.pbh.gov.br/dataset/gtfs-rt)**.
- Mapa: [OpenFreeMap](https://openfreemap.org) e dados © colaboradores do [OpenStreetMap](https://www.openstreetmap.org/copyright), licença [ODbL](https://opendatacommons.org/licenses/odbl/). A atribuição aparece no canto do mapa.

Os horários são os **programados** pela BHTrans: o trânsito pode adiantar ou atrasar a passagem. Para a posição real, use o mapa ao vivo.

## 📄 Licença
Este projeto está licenciado sob a MIT License.
