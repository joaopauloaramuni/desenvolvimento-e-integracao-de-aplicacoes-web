# Projeto LocationIQAPI (React + Vite) 📍

## 📖 Descrição

Exemplo completo da [**API do LocationIQ**](https://locationiq.com/) feito com **React**, **Vite** e [**MapLibre GL JS**](https://maplibre.org/). O mapa usa os **vector tiles do LocationIQ** (dados do OpenStreetMap) e a lateral tem uma aba para cada recurso da API, partindo das **unidades da PUC Minas**.

O LocationIQ é uma alternativa ao Google Maps e ao Mapbox baseada no **OpenStreetMap**, com plano gratuito sem cartão de crédito.

Recursos:

- 🔎 **Buscar**: sugestões enquanto digita (**Autocomplete API**) e busca completa ao apertar Enter (**Search API**, forward geocoding)
- 🎯 **Ponto**: clique em qualquer lugar do mapa e veja o **endereço** (**Reverse Geocoding**), o **fuso horário** com a hora local (**Timezone API**) e uma **imagem do mapa** (**Static Maps**)
- 🧭 **Perto**: restaurantes, farmácias, hospitais, caixas eletrônicos, postos... num raio de 500 m a 5 km (**Nearby API**)
- 🚗 **Rota**: de carro, a pé ou de bicicleta entre dois pontos, com a linha no mapa e o **passo a passo em português** (**Directions API**)
- 🗺️ **3 estilos de mapa**: ruas, claro e escuro
- 📡 **Painel de requisições**: cada chamada feita, com a URL (token escondido), o status HTTP e o tempo, e o **saldo do dia** (**Balance API**)
- ⏱️ Fila que respeita o limite de **2 requisições por segundo** do plano gratuito (sem erro 429)
- Sem o token, aparece um **passo a passo** no lugar do mapa
- O maplibre-gl só é baixado quando o mapa aparece (`React.lazy`)

## 🖼️ Capturas de Tela

| Início | Busca com autocomplete |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/LocationIQAPI/imgs/Home.png) | ![Busca](https://joaopauloaramuni.github.io/react-imgs/LocationIQAPI/imgs/Busca.png) |

| Endereço de um ponto | Lugares por perto |
| :---: | :---: |
| ![Ponto](https://joaopauloaramuni.github.io/react-imgs/LocationIQAPI/imgs/Ponto.png) | ![Perto](https://joaopauloaramuni.github.io/react-imgs/LocationIQAPI/imgs/Perto.png) |

| Rota | Sem token configurado |
| :---: | :---: |
| ![Rota](https://joaopauloaramuni.github.io/react-imgs/LocationIQAPI/imgs/Rota.png) | ![Sem token](https://joaopauloaramuni.github.io/react-imgs/LocationIQAPI/imgs/SemToken.png) |

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # depois coloque o seu VITE_LOCATIONIQ_TOKEN
npm run dev
```

Acesse `http://localhost:5173`.

## 🔑 Como criar o token do LocationIQ

1. Acesse [my.locationiq.com](https://my.locationiq.com/) e crie a conta gratuita (não pede cartão de crédito).
2. Confirme o e-mail e entre no painel.
3. Abra **Access Tokens**: já existe um token criado, que começa com `pk.`. Copie.
4. **Recomendado:** crie um token só para o portfólio, com restrição:
   1. Clique em **Create Access Token** e dê um nome, ex.: `portfolio`.
   2. Em **HTTP Referrers**, adicione `http://localhost:5173` e o endereço do seu site na Vercel, ex.: `https://seu-projeto.vercel.app`.
   3. Salve e copie o token `pk.`.

> 💡 **Por que restringir?** O token vai para o navegador (o mapa e as buscas precisam dele). Com a restrição por **HTTP Referrer**, mesmo que alguém copie o token, ele não funciona em outro site e não gasta a sua cota.

> O plano gratuito tem um limite **diário** de requisições e de **2 requisições por segundo**. Confira os valores em [locationiq.com/pricing](https://locationiq.com/pricing) e acompanhe o uso no painel (ou no botão **Ver saldo do dia** do projeto).

> ⚠️ No plano gratuito, a página que mostra resultados de busca precisa ter o crédito **"Search by LocationIQ.com"** com link. Ele já está no rodapé da lateral.

## 🔐 Configurando o `.env.local`

O `.env.local` guarda as variáveis de ambiente **só na sua máquina**: ele está no `.gitignore` e **não vai para o GitHub**.

1. Copie o modelo:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha:

   ```properties
   VITE_LOCATIONIQ_TOKEN=pk.0123456789abcdef...
   ```

3. **Reinicie** o `npm run dev`.

> 💡 **Por que aqui tem `VITE_`?** Nos outros projetos (WakaTime, GitHub, Gemini) as chaves são **secretas** e ficam sem `VITE_`, só no servidor. Aqui, como no MapBoxAPI, o próprio mapa no navegador precisa do token: o `VITE_` faz o Vite colocar o valor no build (`import.meta.env.VITE_LOCATIONIQ_TOKEN`). Por isso a restrição por HTTP Referrer é tão importante.

## ☁️ Deploy na Vercel (variável de ambiente)

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Abra **Environment Variables** e cadastre:

   | Key | Value |
   | --- | --- |
   | `VITE_LOCATIONIQ_TOKEN` | `pk.0123456789abcdef...` |

4. Clique em **Deploy**.
5. Copie o endereço do site (ex.: `https://seu-projeto.vercel.app`) e adicione nos **HTTP Referrers** do token no LocationIQ.

Se o projeto já estiver publicado: **Settings** → **Environment Variables** → adicione `VITE_LOCATIONIQ_TOKEN` (marque **Production**, **Preview** e **Development**) → **Save** → **Deployments** → três pontinhos do último deploy → **Redeploy**.

> ⚠️ Variáveis `VITE_` entram no **build**: depois de mudar o token na Vercel é **obrigatório** fazer o **Redeploy**.

## 🌐 APIs do LocationIQ usadas

Todas as chamadas estão em `src/services/locationIqService.js`, uma função para cada:

| Função | Endpoint | Onde aparece |
| --- | --- | --- |
| `autocomplete(q)` | `GET api.locationiq.com/v1/autocomplete` | Aba **Buscar**, enquanto digita |
| `search(q)` | `GET us1.locationiq.com/v1/search` | Aba **Buscar**, ao apertar Enter |
| `reverse([lng, lat])` | `GET us1.locationiq.com/v1/reverse` | Aba **Ponto** (clique no mapa) |
| `timezone([lng, lat])` | `GET us1.locationiq.com/v1/timezone` | Aba **Ponto** |
| `staticMapUrl([lng, lat])` | `maps.locationiq.com/v3/staticmap` | Aba **Ponto** (é só a URL de um `<img>`) |
| `nearby([lng, lat], { tag, radius })` | `GET us1.locationiq.com/v1/nearby` | Aba **Perto** |
| `directions(perfil, a, b)` | `GET us1.locationiq.com/v1/directions/{perfil}/{a};{b}` | Aba **Rota** |
| `balance()` | `GET us1.locationiq.com/v1/balance` | Botão **Ver saldo do dia** |
| `styleUrl(id)` | `tiles.locationiq.com/v3/{estilo}/vector.json` | Estilo do mapa (MapLibre) |

Exemplo de resposta do **Reverse Geocoding** (resumida):

```json
{
  "lat": "-19.9221",
  "lon": "-43.9917",
  "display_name": "Avenida Dom José Gaspar, Coração Eucarístico, Belo Horizonte, Minas Gerais, 30535-610, Brasil",
  "address": {
    "road": "Avenida Dom José Gaspar",
    "suburb": "Coração Eucarístico",
    "city": "Belo Horizonte",
    "state": "Minas Gerais",
    "postcode": "30535-610",
    "country": "Brasil",
    "country_code": "br"
  }
}
```

> ⚠️ O LocationIQ devolve `lat` e `lon` como **texto** e na ordem **latitude, longitude**. O serviço converte tudo para número e para `[longitude, latitude]`, que é a ordem do MapLibre.

## ⚙️ Como funciona

- **Fila de 2 por segundo:** antes de cada `fetch`, o serviço espera a vez (`MIN_INTERVAL_MS: 550`). Por isso o Reverse e o Timezone da aba **Ponto** são feitos um depois do outro, e não com `Promise.all`.
- **404 não é erro:** no LocationIQ, `404` significa "nada encontrado". O serviço devolve lista vazia (ou `null`) e a tela mostra uma mensagem amigável. Os outros status viram mensagens em português (`401` token inválido, `403` referrer bloqueado, `429` limite atingido).
- **Autocomplete x Search:** o autocomplete é rápido e feito para sugestões (espera **400 ms** sem digitar, com *debounce*, e cancela a busca anterior com `AbortController`); o Search é a busca completa, com `addressdetails` e `normalizeaddress`.
- **O maplibre-gl não é um componente React:** ele desenha num `<div>`. O mapa é criado **uma vez** num `useEffect`, guardado num `useRef`, e as mudanças de props viram chamadas aos métodos dele:

  | Mudança no React | Chamada no MapLibre |
  | --- | --- |
  | Trocou o estilo | `map.setStyle(url, { diff: false })` |
  | Escolheu um lugar ou resultado | `map.flyTo({ center, zoom })` |
  | "Ver todas", lugares por perto, rota | `map.fitBounds(bounds)` |
  | Calculou a rota | `addSource` + `addLayer` (linha GeoJSON) |
  | Clicou no mapa | evento `click` → Reverse ou origem/destino |

- A linha da rota some quando o estilo muda, então ela é redesenhada no evento `style.load`.
- A **Directions API** devolve as manobras em códigos (`turn` + `left`, `roundabout` + `exit: 2`...). O `maneuverText()` em `src/utils/format.js` transforma isso em "Vire à esquerda na Rua X" e "Na rotatória, pegue a 2ª saída".
- Os popups são montados com `textContent` (nada vira HTML): sem risco de XSS com o que vem da API.

## 🧩 Usando no seu projeto

```bash
npm install maplibre-gl
```

Para **só as buscas** (sem mapa), copie `src/config/locationIqConfig.js` e `src/services/locationIqService.js`:

```jsx
import { search, reverse } from "./services/locationIqService";

const resultados = await search("Praça da Liberdade, Belo Horizonte");
// [{ id, name, address, type, coordinates: [lng, lat] }]

const endereco = await reverse([-43.9372, -19.9334]);
// { name, address, displayName, details: { road, suburb, city, ... }, coordinates }
```

Para **tudo**, copie também `src/components/LiqMap/`, `src/components/LocationExplorer/`, `src/utils/format.js` e `src/data/places.js`:

```jsx
import LocationExplorer from "./components/LocationExplorer/LocationExplorer";
import PLACES from "./data/places";

<LocationExplorer places={PLACES} />
```

| Prop do `<LiqMap />` | O que faz |
| --- | --- |
| `styleId` | `"streets"`, `"light"` ou `"dark"` |
| `places` / `selectedPlaceId` / `onSelectPlace` | Lugares numerados (formato de `data/places.js`) |
| `point` | `{ name, address, coordinates }` para o pino vermelho |
| `pois` | Pontos de interesse (bolinhas azuis) |
| `route` / `routeEnds` | Rota da Directions API e os marcadores A e B |
| `focus` | `{ center, zoom }` para voar ou `{ bounds: [[lng, lat], ...] }` para enquadrar |
| `onMapClick` | Recebe `[lng, lat]` do clique |

## 📂 Estrutura do Projeto

```text
📁 LocationIQAPI
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── favicon.png
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/              └── Card da página com a faixa azul (logo PUC + logo do projeto)
│   │   ├── LocationIqLogo/          └── Logo do projeto em SVG (usa currentColor)
│   │   ├── LiqMap/
│   │   │   ├── LiqMap.jsx           └── Mapa, marcadores, popups, rota, flyTo, fitBounds
│   │   │   └── LiqMap.css
│   │   └── LocationExplorer/
│   │       ├── LocationExplorer.jsx └── Abas + mapa + estado de tudo
│   │       ├── SearchPanel.jsx      └── Autocomplete + Search + unidades da PUC
│   │       ├── PointPanel.jsx       └── Reverse + Timezone + Static map
│   │       ├── NearbyPanel.jsx      └── Lugares por perto
│   │       ├── RoutePanel.jsx       └── Origem, destino, meio e passo a passo
│   │       ├── RequestLog.jsx       └── Painel de requisições + saldo do dia
│   │       ├── TokenMissing.jsx     └── Passo a passo quando falta o token
│   │       └── LocationExplorer.css
│   │
│   ├── ⚙️ config/locationIqConfig.js       └── Token, região, centro, estilos, categorias
│   ├── 📊 data/places.js                   └── SEUS lugares
│   ├── 🛠️ services/locationIqService.js    └── Todas as chamadas à API (com a fila de 2/s)
│   ├── 🔤 utils/format.js                  └── Distância, tempo, fuso e manobras em português
│   ├── App.jsx                             └── Carrega o explorer com React.lazy
│   ├── index.css
│   └── main.jsx
│
├── 📄 .env.example
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

- [`maplibre-gl`](https://www.npmjs.com/package/maplibre-gl): mapa vetorial de código aberto, que desenha os tiles do LocationIQ
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones das abas e botões

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📄 Licença
Este projeto está licenciado sob a MIT License.
