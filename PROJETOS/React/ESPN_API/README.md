# Projeto ESPN_API (React + Vite) ⚽🏀

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aramuni-espn-api.vercel.app/)

👉 **[aramuni-espn-api.vercel.app](https://aramuni-espn-api.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Painel de **futebol** e **basquete** feito com **React** e **Vite**, lido ao vivo da **API pública da ESPN**: próximos jogos com **contagem regressiva**, **placar ao vivo**, últimos resultados e **classificação**.

- **⚽ Futebol**: os jogos de um time em todas as competições (Brasileirão, Copa do Brasil, Libertadores, Sul-Americana, estaduais...), os últimos resultados (V/E/D) e a tabela do **Brasileirão Série A** com as faixas de Libertadores, Sul-Americana e rebaixamento. Abre no **Atlético-MG**, e dá para escolher qualquer time da Série A.
- **🏀 Basquete**: os próximos jogos da **NBA** inteira (ou de um time), com quarto e relógio nos jogos ao vivo, e a classificação das conferências **Leste** e **Oeste** (playoffs e play-in).

A API da ESPN **não pede chave, não tem cadastro e libera CORS**: o navegador chama a ESPN direto, então este projeto **não tem pasta `api/`**. O `.env.example` serve só para trocar o time, a liga e o fuso sem mexer no código (é opcional).

A ideia é que você copie o componente `<EspnDashboard />` (ou só `<Futebol />` ou `<Basquete />`) para o **seu portfólio** ou para qualquer outro projeto React.

## 🖼️ Capturas de Tela

| Futebol | Basquete (NBA) |
| :---: | :---: |
| ![Futebol](https://joaopauloaramuni.github.io/react-imgs/ESPN_API/imgs/Futebol.png) | ![Basquete](https://joaopauloaramuni.github.io/react-imgs/ESPN_API/imgs/Basquete.png) |

| Um time da NBA | Celular |
| :---: | :---: |
| ![Time](https://joaopauloaramuni.github.io/react-imgs/ESPN_API/imgs/Time.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/ESPN_API/imgs/Mobile.png) |

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # opcional: trocar o time, a liga ou o fuso
npm run dev
```

Acesse `http://localhost:5173`. Não precisa de chave: sem o `.env.local`, o projeto abre no Atlético-MG e na NBA toda.

## 🔧 Configurando o `.env.local` (opcional)

O `.env.local` fica **só na sua máquina** (está no `.gitignore`).

```bash
cp .env.example .env.local
```

```properties
# Time do futebol (id da ESPN): 7632 = Atlético-MG, 2022 = Cruzeiro, 819 = Flamengo...
VITE_SOCCER_TEAM_ID=7632

# Liga da tabela e da lista de times (bra.1 = Série A, bra.2 = Série B)
VITE_SOCCER_LEAGUE=bra.1
VITE_SOCCER_LEAGUE_NAME=Brasileirão Série A

# Time da NBA ao abrir a aba Basquete (lal, gs, bos...). Vazio = a liga toda
VITE_NBA_TEAM=

# Fuso das datas e horas dos jogos
VITE_TIMEZONE=America/Sao_Paulo
```

Reinicie o `npm run dev` depois de alterar (o Vite só lê o `.env.local` quando inicia).

> 💡 **Aqui o prefixo `VITE_` é de propósito.** Tudo que começa com `VITE_` vai para o JavaScript do navegador, e é exatamente onde a ESPN é chamada. Como **nada aqui é segredo** (é só o id de um time), não tem problema. Nunca use `VITE_` para chaves e tokens: veja o CanvasAPI e o SpotifyAPI, que guardam as chaves no servidor.

## 🌐 Endpoints da ESPN usados

Todos com `GET` e sem autenticação. Base: `https://site.api.espn.com`.

| O quê | Endereço |
| --- | --- |
| Calendário de um time (próximos jogos) | `/apis/site/v2/sports/soccer/all/teams/{id}/schedule?fixture=true` |
| Resultados de um time | `/apis/site/v2/sports/soccer/all/teams/{id}/schedule` |
| Times do Brasileirão | `/apis/site/v2/sports/soccer/bra.1/teams` |
| Classificação do Brasileirão | `/apis/v2/sports/soccer/bra.1/standings` |
| Jogos da NBA de um dia | `/apis/site/v2/sports/basketball/nba/scoreboard?dates=AAAAMMDD` |
| Calendário de um time da NBA | `/apis/site/v2/sports/basketball/nba/teams/{sigla}/schedule?seasontype=2` |
| Times da NBA | `/apis/site/v2/sports/basketball/nba/teams` |
| Classificação da NBA | `/apis/v2/sports/basketball/nba/standings` |

Os escudos vêm do CDN da ESPN: `https://a.espncdn.com/i/teamlogos/soccer/500/{id}.png` e `https://a.espncdn.com/i/teamlogos/nba/500/{sigla}.png`.

> ⚠️ A API da ESPN **não é documentada oficialmente**: são os mesmos endereços que o site e o app da ESPN usam. Funcionam muito bem para projetos didáticos, mas podem mudar sem aviso. Por isso toda a leitura das respostas fica num lugar só (`src/services/espnService.js`).

### Experimente no navegador

Cole no navegador e veja o JSON cru:

- Jogos do Galo: [site.api.espn.com/apis/site/v2/sports/soccer/all/teams/7632/schedule?fixture=true](https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/7632/schedule?fixture=true)
- Tabela do Brasileirão: [site.api.espn.com/apis/v2/sports/soccer/bra.1/standings](https://site.api.espn.com/apis/v2/sports/soccer/bra.1/standings)
- Jogos da NBA hoje: [site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard](https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard)

## ⚙️ Como funciona

```text
Navegador ──fetch──▶ site.api.espn.com (sem chave, CORS liberado)
    │
    ▼
espnService.js ── normaliza: de ~100 KB de JSON da ESPN para só o que a tela usa
    │               (o mesmo formato de jogo para futebol e basquete)
    ▼
Futebol.jsx / Basquete.jsx ── próximos jogos, resultados e classificação
```

- **Cache de 1 minuto** no navegador: trocar de aba ou de time e voltar não repete as chamadas.
- O **próximo jogo** tem uma contagem regressiva que anda sozinha; jogo **ao vivo** aparece primeiro, com placar, minuto (futebol) ou quarto e relógio (NBA).
- Futebol: calendário e resultados vêm de **dois endereços**, buscados em paralelo (`Promise.allSettled`). Se um falhar, o outro aparece do mesmo jeito.
- NBA: o placar da liga **não aceita intervalo de datas**. O painel lê o calendário que vem na resposta de hoje e busca os próximos dias com jogo, de 3 em 3, até juntar os jogos que vai mostrar.
- Nomes que a ESPN manda em inglês (campeonatos, fases, "7th in Brazilian Serie A", "2nd Leg"...) são traduzidos em `components/ESPN/translate.js`.
- Datas e horas no fuso de **Brasília** (`TIMEZONE` no config). Jogo sem horário confirmado aparece como "a definir".
- Clicar num time da **classificação** abre os jogos dele.

## 🧩 Usando no seu projeto

Copie para o seu projeto React + Vite:

```text
src/config/espnConfig.js        → time, liga, fuso, faixas da tabela
src/services/espnService.js     → fetch + normalização das respostas da ESPN
src/components/ESPN/            → componentes + CSS
```

E use:

```jsx
import EspnDashboard from "./components/ESPN/EspnDashboard";
import Futebol from "./components/ESPN/Futebol";
import Basquete from "./components/ESPN/Basquete";

<EspnDashboard />                          {/* as duas abas */}
<EspnDashboard initialSport="basquete" />
<Futebol initialTeam="2022" />             {/* só o futebol, abrindo no Cruzeiro */}
<Basquete initialTeam="lal" />             {/* só a NBA, abrindo nos Lakers */}
<Futebol showStandings={false} />          {/* sem a tabela */}
```

### Trocando o time

Pelo `.env.local` (veja acima) ou direto em `src/config/espnConfig.js`:

```js
SOCCER: {
  DEFAULT_TEAM_ID: env.VITE_SOCCER_TEAM_ID || "7632", // Atlético-MG
  LEAGUE,                                             // VITE_SOCCER_LEAGUE || "bra.1"
  ...
},
BASKETBALL: {
  DEFAULT_TEAM: (env.VITE_NBA_TEAM || "").toLowerCase(), // "" = a liga toda, ou "lal", "gs"...
},
```

O **id do time** está na URL da página dele na ESPN: `espn.com.br/futebol/time/_/id/`**`7632`**`/atletico-mg`. Alguns ids:

| Time | id | Time | id |
| --- | --- | --- | --- |
| Atlético-MG | 7632 | Cruzeiro | 2022 |
| Flamengo | 819 | Palmeiras | 2029 |
| Corinthians | 874 | São Paulo | 2026 |
| Fluminense | 3445 | Grêmio | 6273 |

| Opção | Padrão | O que faz |
| --- | --- | --- |
| `TIMEZONE` | `"America/Sao_Paulo"` | Fuso usado nas datas e horas |
| `CACHE_MS` | `60000` | Tempo que cada resposta fica guardada no navegador |
| `DEFAULT_SPORT` | `"futebol"` | Aba aberta ao carregar |
| `SOCCER.DEFAULT_TEAM_ID` | `"7632"` | Time aberto no futebol |
| `SOCCER.LEAGUE` | `"bra.1"` | Liga da tabela e da lista de times |
| `SOCCER.ZONES` | Libertadores, Sul-Americana, Z4 | Faixas coloridas da tabela |
| `BASKETBALL.DEFAULT_TEAM` | `""` | Liga toda ou a sigla de um time |
| `BASKETBALL.NEXT_GAMES` | `6` | Jogos antes do "Ver todos" |

## 📂 Estrutura do Projeto

```text
📁 ESPN_API
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/            └── Card da página com a faixa azul (logo PUC + ícone da API)
│   │   └── ESPN/
│   │       ├── EspnDashboard.jsx  └── Abas Futebol | Basquete
│   │       ├── Futebol.jsx        └── Time, próximos jogos, resultados e tabela
│   │       ├── Basquete.jsx       └── NBA: liga ou time, jogos e conferências
│   │       ├── Games.jsx          └── Card do jogo, próximo jogo (contagem regressiva) e resultados
│   │       ├── Standings.jsx      └── Tabela do Brasileirão e classificação da NBA
│   │       ├── Shared.jsx         └── Escudo, indicadores, erro e "carregando"
│   │       ├── useEspn.js         └── Hook de carregamento + relógio da contagem regressiva
│   │       ├── format.js          └── Datas, horas e "em 3 dias e 5 h" (pt-BR, fuso de Brasília)
│   │       ├── translate.js       └── Campeonatos, fases e situações em português
│   │       └── ESPN.css
│   │
│   ├── ⚙️ config/espnConfig.js
│   ├── 🛠️ services/espnService.js
│   ├── App.jsx
│   ├── index.css               └── Reset, variáveis de cor e fundo da página
│   └── main.jsx
│
├── 📄 .env.example      └── Opcional: time, liga e fuso (VITE_*, nada secreto)
├── 📄 vite.config.js
└── 📄 package.json
```

## 📦 Dependências

```json
"dependencies": {
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-icons": "^5.7.0"
}
```

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (inclusive as bolas de futebol e basquete na faixa azul)
- Nenhuma biblioteca para chamar a API: só `fetch`.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

> ☁️ **Deploy na Vercel**: importe o repositório em [vercel.com/new](https://vercel.com/new) (preset **Vite**) e clique em **Deploy**. As variáveis do `.env.example` são opcionais: se quiser outro time, cadastre-as em **Settings → Environment Variables** e faça o **Redeploy** (variáveis `VITE_` entram no build).

## 📄 Licença
Este projeto está licenciado sob a MIT License.
