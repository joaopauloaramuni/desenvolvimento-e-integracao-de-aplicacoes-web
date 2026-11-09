# Projeto RadioBrowserAPI_2 (React + Vite + Supabase) 📻

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://radiobrowser.vercel.app/)

👉 **[radiobrowser.vercel.app](https://radiobrowser.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

O **RadioBrowserAPI_2_React** é a versão em **React** e **Vite** do projeto [RadioBrowserAPI_2 (Spring Boot)](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/SpringBoot/RadioBrowserAPI_2). Ele consome a [Radio Browser API](https://api.radio-browser.info/) para exibir estações de rádio, permite filtrar por **país** e **estado**, marcar estações como **favoritas** e ouvi-las direto no navegador pela tag `<audio>` do HTML5.

Os favoritos continuam **persistidos no PostgreSQL do [Supabase](https://supabase.com/)**, na mesma tabela `favorites`. A diferença está no caminho até o banco: no Spring, o servidor conectava via **JDBC** (Spring Data JPA); aqui não existe servidor, e o navegador fala com o Supabase pelo SDK **`@supabase/supabase-js`**, que usa a **Data API** (HTTPS) com a chave **publicável**, protegida por **RLS**.

A tela e o CSS são os mesmos do projeto Spring (o painel de sintonizador do **AraDio**).

## ✨ Funcionalidades

- **Filtro por país e estado**: os dropdowns são carregados da API (`/countries` e `/states`), ordenados em pt-BR (`Intl.Collator`, o `Collator` do Java). Por padrão, a busca é `country=Brazil` e `state=Minas Gerais`.
- **Favoritos persistidos no Supabase**: um clique na estrela grava ou apaga o UUID da estação na tabela `favorites`. As favoritas sobem para o topo, mantendo a ordem por votos dentro de cada grupo.
- **Ordenação**: estações por número de votos (decrescente).
- **Player embutido**: `<audio>` do HTML5 com `preload="none"` (o stream só é baixado ao dar play).
- **Filtros na URL**: `/?country=Brazil&state=Minas+Gerais`, como o `GET` do Spring. Dá para copiar o link e usar o botão voltar.
- **Funciona sem Supabase**: sem o `.env.local`, a lista e o player funcionam e as estrelas ficam desativadas, com um aviso.

## 🖼️ Capturas de Tela

| Home |
| :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/RadioBrowserAPI_2_React/imgs/Home1.png) |

| Celular - Busca | Celular - Lista de rádios |
| :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/RadioBrowserAPI_2_React/imgs/Mobile1.png) | ![Mobile2](https://joaopauloaramuni.github.io/react-imgs/RadioBrowserAPI_2_React/imgs/Mobile2.png) |

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase
npm run dev
```

Acesse `http://localhost:5173`. Antes de favoritar, crie a tabela no Supabase (passo 2 abaixo).

## 🗄️ Configuração do Supabase (passo a passo)

### 1. Criar a conta e o projeto

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta (dá para entrar com o GitHub).
2. No dashboard, clique em **New project**.
3. Preencha:
   - **Name**: por exemplo, `radio-browser`.
   - **Database Password**: crie uma senha e guarde-a. Neste projeto ela **não** vai para o `.env` (o React não conecta com usuário e senha do banco), mas você vai precisar dela se um dia conectar por JDBC, como no projeto Spring.
   - **Region**: escolha a mais próxima. No Brasil, **South America (São Paulo)** (`sa-east-1`). ⚠️ A região não pode ser alterada depois.
4. Clique em **Create new project** e aguarde o banco ficar pronto.

> 💡 Se você já fez o projeto Spring, **pode usar o mesmo projeto Supabase**: a tabela `favorites` é a mesma. Só rode o script do passo 2 para criar as policies.

### 2. Criar a tabela e as policies (obrigatório)

No Spring, o Hibernate criava a tabela sozinho (`ddl-auto=update`). Aqui não existe Hibernate, então abra o **SQL Editor** no Supabase e execute o conteúdo de `supabase_favorites.sql`:

```sql
create table if not exists public.favorites (
    station_uuid varchar(64) primary key,
    created_at   timestamptz not null default now()
);

alter table public.favorites enable row level security;

grant select, insert, delete on public.favorites to anon, authenticated;

create policy "favorites_select" on public.favorites
    for select to anon, authenticated using (true);

create policy "favorites_insert" on public.favorites
    for insert to anon, authenticated with check (true);

create policy "favorites_delete" on public.favorites
    for delete to anon, authenticated using (true);
```

> ℹ️ **O que mudou no RLS em relação ao Spring?** No Spring, o RLS ficava ligado **sem policies**: isso bloqueava a Data API, e a aplicação passava porque conectava como `postgres`, que ignora o RLS. Aqui é o contrário: o React **usa** a Data API, então as policies dizem exatamente o que o papel `anon` (quem usa a chave publicável) pode fazer: **ler**, **inserir** e **apagar**. Não há policy de `UPDATE`, então ninguém consegue alterar uma linha existente.

### 3. Pegar a URL e a chave publicável

1. **Project Settings → Data API**: copie a **Project URL** (`https://<project-ref>.supabase.co`).
2. **Project Settings → API Keys**: copie a **Publishable key** (`sb_publishable_...`).

Os dois também aparecem no botão **Connect**, na barra superior do projeto. A chave **`anon`** (legacy) funciona do mesmo jeito.

> ⛔ **Nunca use a `secret key` (`sb_secret_...`) nem a `service_role`** neste projeto. Elas **ignoram o RLS** e dão acesso total ao banco, e tudo que começa com `VITE_` vai para o JavaScript do navegador, onde qualquer visitante consegue ler.

### 4. Configurar o `.env.local`

O `.env.local` fica **só na sua máquina** (está no `.gitignore`).

```bash
cp .env.example .env.local
```

```properties
# ---------- Supabase ----------
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx

# ---------- Radio Browser API (opcional) ----------
VITE_RADIO_API_BASE_URL=https://de1.api.radio-browser.info/json
```

| Variável | Para que serve | Equivalente no Spring |
|---|---|---|
| `VITE_SUPABASE_URL` | Endereço da Data API do seu projeto | `spring.datasource.url` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública usada pelo `supabase-js` (também aceita `VITE_SUPABASE_ANON_KEY`) | `spring.datasource.username` / `password` |
| `VITE_RADIO_API_BASE_URL` | Base da Radio Browser API (opcional; padrão `de1`) | `radio.api.base.url` |

Reinicie o `npm run dev` depois de alterar: o Vite só lê o `.env.local` quando inicia.

### 5. Rodar e verificar

1. Acesse `http://localhost:5173` e clique na estrela (☆) de alguma rádio.
2. No Supabase, abra o **Table Editor** e selecione a tabela `favorites`: o `station_uuid` da rádio deve aparecer lá.
3. Recarregue a página: a rádio continua marcada (★) e no topo da lista.

> 💤 No plano gratuito, projetos sem atividade por cerca de uma semana são **pausados**. Se os favoritos pararem de carregar, entre no dashboard e clique em **Restore project**.

## 🔐 Por que a chave pode ficar no navegador?

A **publishable key** foi feita para ser pública, como a *site key* de um captcha. Ela só identifica o projeto; o que cada visitante pode fazer é decidido pelas **policies de RLS** no banco.

Neste projeto as policies liberam ler, inserir e apagar favoritos para **qualquer visitante**. É o mesmo comportamento do projeto Spring, em que qualquer pessoa que abrisse a página podia clicar nas estrelas: os favoritos são **uma lista única, compartilhada**. Para um projeto didático, isso é o esperado.

> 🎓 **Próximo passo natural:** favoritos **por usuário**. Com o **Supabase Auth**, a tabela ganha uma coluna `user_id uuid default auth.uid()`, a chave primária vira `(user_id, station_uuid)` e as policies passam a usar `using (user_id = auth.uid())`. Cada pessoa só enxerga e altera as próprias estrelas, sem mudar nada no `favoriteRepository.js` além do login.

## 🔁 O que mudou em relação ao Spring Boot

| Spring Boot (Thymeleaf + JPA) | React + Vite + Supabase |
|---|---|
| `config/ApiConfig.java` + `radio.api.base.url` | `src/config/apiConfig.js` + `VITE_RADIO_API_BASE_URL` |
| `application.properties` (JDBC, usuário, senha) | `.env.local` (URL + chave publicável) e `src/config/supabaseClient.js` |
| JDBC no **Session pooler** (Postgres, porta 5432) | **Data API** do Supabase (HTTPS) pelo `supabase-js` |
| `model/RadioStation.java` | `src/model/RadioStation.js` (mesmos campos) |
| `model/FavoriteStation.java` (`@Entity`) | Não existe classe: o `supabase-js` devolve objetos `{ station_uuid }` |
| `repository/FavoriteRepository.java` (`JpaRepository`) | `src/repository/favoriteRepository.js` (mesmos nomes: `findAllStationUuids`, `existsById`, `deleteById`, `save`) |
| `service/FavoriteService.java` | `src/services/favoriteService.js` (mesmas funções) |
| `service/RadioBrowserApiService.java` (`RestTemplate`) | `src/services/radioBrowserApiService.js` (`fetch`) |
| `controller/RadioBrowserApiController.java` | `src/App.jsx` + hooks em `src/hooks/` |
| `templates/home.html` | Componentes `TunerHeader`, `SearchForm` e `StationsTable` |
| `static/css/style.css` | O mesmo CSS, dividido por componente |
| `@RequestParam(defaultValue = ...)` | `useFiltrosDaUrl` (mesmos padrões: Brazil / Minas Gerais) |
| `POST /favorites/toggle` + `redirect:/` | Clique na estrela → `toggle()` no Supabase → só a linha muda, sem recarregar |
| `ddl-auto=update` (Hibernate cria a tabela) | `supabase_favorites.sql` (obrigatório) |
| RLS ligado **sem** policies (bloqueia a Data API) | RLS ligado **com** policies para `anon` (libera só o necessário) |
| `@PrePersist` preenche `created_at` | `default now()` no banco |
| `@Transactional` no `toggle` | Duas chamadas (`existsById` + `insert`/`delete`); a chave primária impede favorito duplicado |
| `onerror` do `<img>` com `aradio.webp` | `onError` no `StationRow` com o mesmo `aradio.webp` |
| Erro de banco derruba a página | Aviso no topo da tabela; a lista e o player continuam funcionando |

## ⚙️ Como funciona

```text
                    ┌──fetch──▶ de1.api.radio-browser.info/json  (sem chave, CORS liberado)
                    │            /stations/search · /countries · /states
Navegador (React) ──┤
                    │
                    └──supabase-js──▶ <project-ref>.supabase.co/rest/v1/favorites
                                       chave publicável + RLS (select / insert / delete)
```

1. Ao abrir a página, três buscas começam em paralelo: **estações** do país/estado da URL, **países e estados** (uma vez só) e **favoritos** (uma única consulta: `getFavoriteUuids()`).
2. O `App.jsx` coloca as favoritas no topo. O `sort` do JavaScript é estável, então a ordem por votos se mantém dentro de cada grupo, como no `Comparator` do Java.
3. A estrela chama `toggle(uuid)`: confere se já existe (`existsById`) e apaga ou insere. Enquanto o Supabase responde, a estrela fica desativada.
4. Trocar o filtro e clicar em **Buscar** atualiza a URL (`history.pushState`) e busca as estações de novo. Os favoritos não são recarregados.

## 🎮 Filtros na URL (o antigo `GET /`)

| Parâmetro | Obrigatório | Padrão | Descrição |
|---|---|---|---|
| `country` | Não | `Brazil` | País usado para filtrar as estações |
| `state` | Não | `Minas Gerais` | Estado usado para filtrar as estações. **Presente e vazio** (`?state=`) significa "Todos os estados" |

```
http://localhost:5173/
http://localhost:5173/?country=Brazil&state=S%C3%A3o+Paulo
http://localhost:5173/?country=Brazil&state=
```

O hook `useFiltrosDaUrl` reproduz a regra do `@RequestParam(required = false, defaultValue = "Minas Gerais")`: parâmetro **ausente** usa o padrão; parâmetro **vazio** é respeitado.

**Informações da Home**

| ★ | # | Favicon | Nome | URL | Tags | Status | Idioma | Votos | Cliques | Tendência | Local | Bitrate | Codec | Player |
|---|---|---------|------|-----|------|--------|--------|-------|---------|-----------|-------|---------|-------|--------|

## 🛠️ Services e repository

### `radioBrowserApiService.js`

- `listRadioStations(country, state)`: busca as estações filtradas por país/estado, ordenadas por votos (decrescente). Em erro, lança uma mensagem que a tabela exibe (`502` → "Serviço indisponível...").
- `listCountries()`: todos os países, ordenados em pt-BR.
- `listStates()`: todos os estados do mundo, ordenados em pt-BR, independentes do país.
- `extractRadioStations(stationsData)`: converte o JSON da API em objetos `RadioStation` (`url_resolved` → `urlResolved`, favicon vazio → `aradio.webp` etc.).

### `favoriteService.js`

- `getFavoriteUuids()`: todos os UUIDs favoritos numa **única consulta**, devolvidos como `Set`. É o usado pela Home.
- `isFavorite(stationUuid)`: verifica uma estação específica (uma consulta por chamada).
- `toggle(stationUuid)`: se já é favorita, apaga; senão, insere. Devolve o novo estado (`true` = favorita).

### `favoriteRepository.js`

Mesmos métodos do `FavoriteRepository` do Spring Data JPA, agora escritos com o `supabase-js`:

```js
// select station_uuid from favorites
const { data, error } = await supabase.from("favorites").select("station_uuid");

// select ... where station_uuid = ?  (0 ou 1 linha)
await supabase.from("favorites").select("station_uuid").eq("station_uuid", uuid).maybeSingle();

// insert into favorites (station_uuid) values (?)
await supabase.from("favorites").insert({ station_uuid: uuid });

// delete from favorites where station_uuid = ?
await supabase.from("favorites").delete().eq("station_uuid", uuid);
```

Cada função confere o `error` devolvido pelo Supabase e lança uma exceção com a mensagem, para o hook `useFavoritos` exibir no aviso.

### Tabela `favorites`

| Coluna | Tipo | Descrição |
|---|---|---|
| `station_uuid` | `varchar(64)` | **Chave primária**. UUID da estação na Radio Browser API. |
| `created_at` | `timestamptz` | Data/hora em que a estação foi favoritada (`default now()`). |

## 📂 Estrutura do Projeto

```text
📁 RadioBrowserAPI_2_React
│
├── 📁 imgs                              └── Capturas de tela usadas neste README
├── 📁 public
│   ├── 📁 imgs
│   │   └── 🖼️ aradio.webp                └── Favicon padrão quando a estação não tem um
│   └── pucminas-logo.png                └── Favicon da página
│
├── 📁 src
│   ├── ⚙️ config
│   │   ├── apiConfig.js                 └── URLs da Radio Browser API (o ApiConfig.java)
│   │   └── supabaseClient.js            └── createClient com a URL e a chave publicável
│   │
│   ├── 🧩 model
│   │   └── RadioStation.js              └── Representa uma estação de rádio (vinda da API)
│   │
│   ├── 🗄️ repository
│   │   └── favoriteRepository.js        └── Acesso à tabela "favorites" pelo supabase-js
│   │
│   ├── 🔎 services
│   │   ├── radioBrowserApiService.js    └── Busca/ordena estações, países e estados
│   │   └── favoriteService.js           └── Regras dos favoritos (lê/grava no Supabase)
│   │
│   ├── 🪝 hooks
│   │   ├── useFiltrosDaUrl.js           └── country/state na URL, com os padrões do Spring
│   │   ├── useRadioBrowser.js           └── usePaisesEEstados + useEstacoes
│   │   └── useFavoritos.js              └── Carrega os favoritos e alterna a estrela
│   │
│   ├── 🎨 components
│   │   ├── TunerHeader/                 └── Cabeçalho do sintonizador (AraDio + Ao vivo)
│   │   ├── SearchForm/                  └── Selects de país e estado + Buscar
│   │   └── StationsTable/
│   │       ├── StationsTable.jsx        └── Tabela, colgroup e mensagens (carregando/vazio/erro)
│   │       ├── StationRow.jsx           └── Uma estação: estrela, dados, mapa e player
│   │       └── StationsTable.css
│   │
│   ├── App.jsx                          └── Home (o antigo controller + home.html)
│   ├── index.css                        └── Tokens de cor, reset, container e links
│   └── main.jsx
│
├── 🗃️ supabase_favorites.sql            └── Tabela + RLS + policies (rode no SQL Editor)
├── 📄 .env.example                      └── Modelo do .env.local
├── 📄 vite.config.js
└── 📄 package.json
```

## ☁️ Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Abra **Environment Variables** e cadastre:

   | Key | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |

4. Clique em **Deploy**.

> As variáveis `VITE_*` entram no JavaScript **na hora do build**: se trocar alguma, faça um **Redeploy**.

> 🔊 **Streams `http://` em site `https://`:** no `localhost` todas as rádios tocam, mas na Vercel (HTTPS) o navegador tenta trocar `http://` por `https://` nas rádios antigas (*mixed content*). Se a rádio não tiver HTTPS, ela não toca. Não é erro do projeto: é uma regra de segurança do navegador.

## 🧯 Problemas comuns

| Sintoma / erro | Causa provável | Solução |
|---|---|---|
| Aviso "Favoritos desativados: preencha..." | `.env.local` ausente ou servidor não reiniciado | Criar o `.env.local` (passo 4) e reiniciar o `npm run dev` |
| `Invalid API key` | Chave copiada errada ou de outro projeto | Copiar de novo em **Project Settings → API Keys** |
| `relation "public.favorites" does not exist` | Tabela não criada | Rodar o `supabase_favorites.sql` (passo 2) |
| `permission denied for table favorites` | Faltou o `grant` para `anon` | Rodar o `supabase_favorites.sql` inteiro |
| `new row violates row-level security policy` | RLS ligado sem a policy de `insert` | Rodar o `supabase_favorites.sql` inteiro |
| Estrela marca, mas some ao recarregar | Sem policy de `select`: o RLS devolve lista vazia **sem erro** | Rodar o `supabase_favorites.sql` inteiro |
| Estrela desmarca, mas volta ao recarregar | Sem policy de `delete`: o RLS apaga 0 linhas **sem erro** | Rodar o `supabase_favorites.sql` inteiro |
| `Failed to fetch` nos favoritos | Projeto pausado (plano free) ou URL errada | **Restore project** no dashboard / conferir `VITE_SUPABASE_URL` |
| "Não foi possível obter as estações..." | Servidor `de1` da Radio Browser fora do ar | Trocar `VITE_RADIO_API_BASE_URL` para outro espelho (veja `/servers`) |
| Rádio não toca na Vercel | Stream `http://` em página `https://` | Veja a nota de *mixed content* no deploy |

> 💡 **Por que alguns erros de RLS são silenciosos?** Para o Postgres, uma policy que não deixa ver uma linha é igual a a linha não existir. O `select` devolve `[]` e o `delete` apaga 0 linhas, ambos com sucesso. Só o `insert` reclama, porque a linha nova não passa no `with check`.

## ⚡ Dicas de Desempenho

- **Uma consulta por página**: a Home usa `getFavoriteUuids()`, e não `isFavorite()` por estação (seriam centenas de requisições).
- **`preload="none"` no `<audio>`**: com centenas de players, o navegador só abre a conexão com o stream ao clicar em play.
- **`loading="lazy"` nos favicons**: só baixam as imagens que aparecem na tela.
- **`memo` no `StationRow`**: favoritar uma rádio redesenha só as linhas que mudaram (a estrela clicada e as que trocaram de posição), e não as centenas de players.
- **Região do banco**: um projeto Supabase em `sa-east-1` (São Paulo) responde bem mais rápido do Brasil.

## 🌐 API Radio Browser: Endpoints Úteis

Base usada aqui: `https://de1.api.radio-browser.info/json`. Todos aceitam os prefixos `json/`, `xml/` ou `csv/`, não pedem chave e liberam CORS, por isso o navegador chama a API direto.

### Já usados neste projeto

| Endpoint | Usado por | Descrição |
|---|---|---|
| `GET /stations/search` | `listRadioStations()` | Busca avançada com `country`, `state`, `tag`, `language`, `order`, `limit`, `offset`, `hidebroken` e outros filtros. |
| `GET /countries` | `listCountries()` | Todos os países, com contagem de estações (`stationcount`). |
| `GET /states` | `listStates()` | Todos os estados/regiões. |

### Outros endpoints (úteis para futuras features)

| Endpoint | Descrição |
|---|---|
| `GET /stations/byuuid?uuids=...` | Estações por UUID. Daria uma página "Minhas favoritas" direto da tabela `favorites`. |
| `GET /stations/topvote/{n}` | As `n` estações mais votadas, boa para uma seção "Destaques". |
| `GET /stations/topclick/{n}` | As `n` estações mais clicadas. |
| `GET /tags` | Tags/gêneros com contagem; pode virar um filtro por gênero. |
| `GET /languages` | Idiomas com contagem. |
| `GET /url/{stationuuid}` | Deve ser chamado ao dar play, para contar o clique oficialmente. **Ainda não é chamado.** |
| `POST /vote/{stationuuid}` | Registra um voto (1 por IP a cada 10 minutos). |
| `GET /servers` | Lista os espelhos da API, para fallback. |

> ⚠️ A documentação da Radio Browser pede um `User-Agent` descritivo. No Spring isso era uma melhoria pendente no `RestTemplate`; no navegador **não é possível**: `User-Agent` é um cabeçalho proibido para o `fetch`, e o navegador sempre envia o próprio.

## 📦 Dependências

```json
"dependencies": {
  "@supabase/supabase-js": "^2.117.2",
  "react": "^19.2.8",
  "react-dom": "^19.2.8"
}
```

- [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction): cliente oficial do Supabase. Faz o papel do `spring-boot-starter-data-jpa` + driver `postgresql`: monta as requisições para a Data API a partir de `from(...).select()`, `insert()`, `delete()` e `eq()`.
- A Radio Browser API é chamada com o `fetch` nativo do navegador, sem biblioteca.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 🔗 Urls do projeto

http://localhost:5173/

http://localhost:5173/?country=Brazil&state=Minas+Gerais

http://localhost:5173/?country=Brazil&state=

## 📚 Documentação e Links Úteis

**Radio Browser API**

- [API Radio Browser: Documentação oficial](https://api.radio-browser.info/)
- [Radio Browser: Site do projeto](https://www.radio-browser.info/)
- [Estações em Minas Gerais](https://de1.api.radio-browser.info/json/stations/search?country=Brazil&state=Minas%20Gerais)
- [Estação Itatiaia](https://de1.api.radio-browser.info/json/stations/search?name=itatiaia)
- [Lista de Países](https://de1.api.radio-browser.info/json/countries)
- [Lista de Estados](https://de1.api.radio-browser.info/json/states)
- [Lista de servidores-espelho](https://de1.api.radio-browser.info/json/servers)

**Supabase**

- [Supabase: Dashboard](https://supabase.com/dashboard)
- [supabase-js: Referência](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase: Usando com React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase: API Keys (publishable e secret)](https://supabase.com/docs/guides/api/api-keys)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

**React, Vite e Vercel**

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Variáveis de ambiente no Vite](https://vite.dev/guide/env-and-mode)
- [Mixed content (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/Security/Mixed_content)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
