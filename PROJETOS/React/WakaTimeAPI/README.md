# Projeto WakaTimeAPI (React + Vite) ⏱️

## 📖 Descrição

Painel com as estatísticas do **WakaTime**, feito com **React** e **Vite**: quanto tempo você passou programando, em quais **linguagens**, **editores**, **sistemas operacionais**, **categorias**, **projetos** e **bibliotecas**. Tem botões de período (7 dias, 30 dias, 6 meses, 1 ano e desde sempre), o tempo programado **hoje** e o cartão **🟢 Codando agora**, que mostra em qual projeto você está mexendo no editor **neste momento**.

A ideia é que você copie o componente `<WakaTimeStats />` para o **seu portfólio** ou para qualquer outro projeto React.

O que o projeto mostra:

- **🟢 Codando agora**: projeto, branch, linguagem, editor e duração da sessão que está acontecendo agora (atualiza sozinho a cada minuto)
- **Indicadores**: tempo total, média diária, dias ativos, tempo de hoje e melhor dia
- **Barra de linguagens** (parte do todo) e **ranking** com tempo e porcentagem
- **Editores**, **sistemas operacionais** e **categorias** (programando, documentação, testes...)
- **Projetos** em que você mais trabalhou (pode ser escondido)
- **📚 Bibliotecas** que você mais importou nos arquivos que editou (React, Express, pandas...), com tempo e porcentagem
- Estados de **carregando**, **erro** e "WakaTime ainda calculando"

## 🖼️ Capturas de Tela

| Desktop | Celular |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/WakaTimeAPI/imgs/Home_v2.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/WakaTimeAPI/imgs/Mobile_v2.png) |

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # preencha WAKATIME_APP_ID e WAKATIME_APP_SECRET
npm run wakatime:oauth       # gera o WAKATIME_ACCESS_TOKEN (veja o passo a passo abaixo)
npm run dev
```

Acesse `http://localhost:5173`.

> Sem o `.env.local` o projeto abre normalmente, mas o painel mostra o aviso **"Configure WAKATIME_ACCESS_TOKEN..."**.

> ⚠️ **Mudança no WakaTime (1º de novembro de 2026):** a API key do WakaTime não serve mais para **ler** dados. Este projeto usa um **token OAuth** (`WAKATIME_ACCESS_TOKEN`): veja [🔐 Token OAuth do WakaTime](#-token-oauth-do-wakatime).

> 🏫 **No laboratório da PUC Minas:** se o `npm run wakatime:oauth` mostrar `Erro ao trocar o code pelo token`, veja [🏫 Rodando no laboratório da PUC Minas](#-rodando-no-laboratório-da-puc-minas-proxy--certificado-tls).

## 🔑 Conta e plugin do WakaTime

1. Crie uma conta gratuita em [wakatime.com/signup](https://wakatime.com/signup) (dá para entrar com o GitHub).
2. Instale o plugin do WakaTime no seu editor. No **VS Code**: aba **Extensions** → procure **WakaTime** → **Install**.
3. O VS Code vai pedir a **API key** na primeira vez. Ela está em [wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).
4. Programe um pouco: o plugin manda os dados para o WakaTime enquanto você digita. As primeiras estatísticas aparecem no [dashboard](https://wakatime.com/dashboard) depois de alguns minutos.

> 💡 A **API key** continua existindo, mas agora ela é só do **plugin** (para **enviar** a atividade). Para o projeto **ler** os seus dados, você vai gerar um **token OAuth**, explicado logo abaixo. A API key **não** vai mais no `.env.local`.

## 🔐 Token OAuth do WakaTime

O painel lê as estatísticas da sua conta (`GET /users/current/stats/:range`), o tempo de hoje (`/status_bar/today`), os heartbeats (`/heartbeats`) e os editores (`/user_agents`). Esses dados são **privados**, então precisam de autenticação. Quem chama o WakaTime são as rotas `/api/wakatime` e `/api/codando` (Vercel Functions `api/wakatime.js` e `api/codando.js`; no `npm run dev`, o `vite.config.js`), com um token que fica só no servidor.

### 🤔 Por que OAuth e não a API key?

O jeito mais simples de ler dados privados era mandar a API key no cabeçalho da requisição (`Authorization: Basic <api key em base64>`), e era assim que este projeto funcionava. Isso vai acabar. O WakaTime avisou por e-mail:

> 📧 *"Starting November 1, 2026, WakaTime API keys will become write-only. They will only work in the WakaTime plugins for sending data and will no longer work for other API endpoints. Please transition your app, script, or integration to using OAuth tokens instead of API keys before November 1."*

Ou seja: **a partir de 1º de novembro de 2026**, a API key só serve para os plugins (VS Code, JetBrains etc.) enviarem a atividade de código. Qualquer leitura feita com ela responde erro, e o painel e o "Codando agora" parariam de funcionar. A saída indicada na [documentação de autenticação](https://wakatime.com/developers#authentication) é o **OAuth**.

E a troca também é mais segura. Pense assim:

- 🔑 **API key** é a chave da sua casa: abre todas as portas (lê e escreve tudo na conta) e, se vazar, a única saída é trocar a fechadura.
- 🪪 **Token OAuth** é um crachá de visitante que você mesmo emite: só abre as portas que você autorizou (os **escopos**; aqui, só leitura: `read_stats`, `read_summaries` e `read_heartbeats`) e pode ser revogado sem mexer na sua chave.

### 🔄 Como o OAuth funciona aqui

O projeto usa o fluxo *authorization code*, e o `scripts/wakatime-oauth.mjs` faz tudo sozinho:

1. Abre no navegador `wakatime.com/oauth/authorize` com o **App ID** e os escopos `read_stats`, `read_summaries` e `read_heartbeats`.
2. Você faz login e clica em **Authorize**.
3. O WakaTime redireciona para `http://localhost:8787/callback?code=...`, onde o script está escutando.
4. O script troca esse `code` (junto com o **App Secret**) em `wakatime.com/oauth/token` por dois tokens: o **access token** e o **refresh token**.
5. Daí em diante, o `api/_oauth.js` manda `Authorization: Bearer <access token>` em cada chamada (usado por `api/_wakatime.js` e `api/_codando.js`).

| Escopo | Endpoint | Onde aparece |
| --- | --- | --- |
| `read_stats` | `GET /users/current/stats/:range` | Indicadores (inclusive o melhor dia), linguagens, editores, sistemas, categorias, projetos e bibliotecas |
| `read_summaries` | `GET /users/current/status_bar/today` | Indicador **Hoje** |
| `read_heartbeats` | `GET /users/current/heartbeats` e `/user_agents` | Cartão **🟢 Codando agora** |

### 🛠️ Passo a passo (uma vez só)

1. **Crie o app no WakaTime.** Em [wakatime.com/apps](https://wakatime.com/apps), crie um novo app e preencha:

   | Campo | O que colocar | Exemplo |
   |:--|:--|:--|
   | **Name** | Um nome para o app | `wakatime-api` |
   | **Redirect URI** | Exatamente este endereço, onde o script recebe a autorização | `http://localhost:8787/callback` |
   | **Install URL** | O endereço do seu projeto publicado. Se ainda não tiver domínio, use o da Vercel | `https://seu-projeto.vercel.app` |
   | **Publisher Website** | O seu site | `https://seu-site.dev` ou `https://seu-projeto.vercel.app` |

   Ao salvar, a página do app mostra o **App ID** e o **App Secret**.

2. **Preencha o `.env.local`.** Se ainda não tiver, rode `cp .env.example .env.local` e cole os valores:

   ```env
   WAKATIME_APP_ID=seu-app-id
   WAKATIME_APP_SECRET=seu-app-secret
   ```

3. **Gere os tokens.** Na raiz do projeto, rode:

   ```bash
   npm run wakatime:oauth
   ```

   O navegador abre a tela de autorização. Depois de clicar em **Authorize**, a aba mostra "Pronto!" e o terminal imprime as duas linhas:

   ```text
   Cole no .env.local (e nas variáveis da Vercel):

   WAKATIME_ACCESS_TOKEN=...
   WAKATIME_REFRESH_TOKEN=...

   Escopo: read_stats,read_summaries,read_heartbeats  |  expira em: ...
   ```

4. **Cole as duas linhas no `.env.local`**, rode `npm run dev` e abra `http://localhost:5173`: o painel carrega as estatísticas e, se você estiver programando, o cartão **Codando agora** fica verde.

5. **Configure a Vercel.** Em *Settings → Environment Variables*, crie as variáveis da tabela da seção **☁️ Deploy na Vercel** (mais abaixo) e faça o redeploy.

6. **Confira.** Abra `https://<seu-dominio>/api/wakatime` (JSON com `mode: "oauth"`, `languages`...) e `https://<seu-dominio>/api/codando` (JSON com `active`, `todaySeconds` e `last`).

> 💡 Se o navegador não abrir sozinho, o terminal imprime o link da autorização para você abrir na mão. Se aparecer erro de `redirect_uri`, confira se a URI do app é **exatamente** `http://localhost:8787/callback` (sem barra no final, `http` e não `https`).

> 💡 Se alguma rota responder **403**, o token não tem o escopo daquele endpoint (veja a tabela de escopos acima). Rode `npm run wakatime:oauth` de novo e autorize todos os escopos.

### 🏫 Rodando no laboratório da PUC Minas (proxy / certificado TLS)

Na rede do laboratório existe um **proxy que intercepta as conexões HTTPS** usando um certificado próprio. O Node.js não reconhece esse certificado e bloqueia a requisição, então a troca do `code` pelo `access_token` falha e aparece no terminal:

```text
Erro ao trocar o code pelo token: fetch failed
```

Às vezes também aparecem mensagens como `self-signed certificate in certificate chain` ou `unable to get local issuer certificate`.

#### Opção 1 (recomendada): usar os certificados do sistema

Faz o Node.js confiar nos certificados instalados no sistema operacional, onde o certificado do proxy da PUC já está cadastrado. **Não desativa nenhuma verificação de segurança.**

Requer **Node.js 22.15+ ou 23.8+**. Para conferir sua versão, rode `node -v`.

**PowerShell (Windows):**
```powershell
$env:NODE_OPTIONS="--use-system-ca"; npm run wakatime:oauth
```

**Bash (Git Bash, Linux ou macOS):**
```bash
NODE_OPTIONS=--use-system-ca npm run wakatime:oauth
```

#### Opção 2: ignorar a verificação do certificado

Use esta opção se a versão do seu Node.js for mais antiga ou se a Opção 1 não funcionar.

**PowerShell (Windows):**
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run wakatime:oauth
```

**Bash (Git Bash, Linux ou macOS):**
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run wakatime:oauth
```

#### Sobre os comandos

Os comandos das duas opções **não precisam de permissão de administrador** e não alteram nada no sistema:

- No **PowerShell**, a configuração vale apenas para a janela atual do terminal e é descartada ao fechá-la.
- No **Bash**, a configuração vale apenas para aquela execução do comando.

> 💡 Se depois o painel também der erro ao buscar os dados no `npm run dev`, use o mesmo prefixo na frente do `npm run dev`.

#### ⚠️ Atenção

- A Opção 2 faz o Node.js **ignorar a verificação do certificado TLS**. Use **apenas no laboratório** ou em redes com proxy institucional.
- **Não use em produção** e não deixe essas configurações fixas no `package.json` ou no `.env.local`.
- Em casa ou em uma rede comum, rode normalmente com `npm run wakatime:oauth`.

### ⏳ Validade

O access token gerado vale **100 anos** (a data aparece em "expira em", no terminal), então na prática o passo a passo é feito uma vez só. Se um dia a API responder `401` (por exemplo, se você revogar o acesso do app), a função usa o refresh token para pedir outro. Esse token novo fica só na memória da função: para valer de vez, rode `npm run wakatime:oauth` de novo e atualize as variáveis no `.env.local` e na Vercel.

A renovação automática só funciona com as três opcionais juntas (`WAKATIME_APP_ID`, `WAKATIME_APP_SECRET` e `WAKATIME_REFRESH_TOKEN`).

> ⚠️ Nunca faça commit do `.env.local`, do App Secret nem dos tokens. O `.gitignore` do projeto já ignora o `.env.local`.

### Alternativa sem token: perfil público

Se preferir não usar o token, deixe o seu perfil público em [wakatime.com/settings/profile](https://wakatime.com/settings/profile) (tempo de código, linguagens, editores e sistemas operacionais públicos) e preencha só o `WAKATIME_USERNAME`. Nesse modo o indicador **Hoje** e o cartão **Codando agora** não aparecem (os dois usam dados privados). O perfil público não usa API key nem token, então não é afetado pela mudança de 1º de novembro.

## 🔐 Configurando o `.env.local`

O `.env.local` guarda as variáveis de ambiente **só na sua máquina**: ele está no `.gitignore` e **não vai para o GitHub**.

1. Copie o modelo:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha:

   ```properties
   # Gerado pelo npm run wakatime:oauth
   WAKATIME_ACCESS_TOKEN=seu-access-token

   # Opcionais: renovação automática do token
   WAKATIME_APP_ID=seu-app-id
   WAKATIME_APP_SECRET=seu-app-secret
   WAKATIME_REFRESH_TOKEN=seu-refresh-token

   # Opcional (só é usado quando NÃO há token): perfil público
   WAKATIME_USERNAME=seu_usuario

   # Opcional: projetos que aparecem pelo nome no "Codando agora"
   # (soma com o CODING_NOW.PUBLIC_PROJECTS do wakatimeConfig.js)
   WAKATIME_PUBLIC_PROJECTS=meu-portfolio,WakaTimeAPI
   ```

3. **Reinicie** o `npm run dev` (o Vite só lê o `.env.local` quando inicia).

> 💡 **Por que as variáveis não começam com `VITE_`?** Tudo que começa com `VITE_` é colocado **dentro do JavaScript** que vai para o navegador, e qualquer visitante consegue ler. Por isso o token, o App Secret e o refresh token ficam sem o prefixo e são lidos **só no servidor**: pelo `vite.config.js` no `npm run dev` e pelas **Vercel Functions** `api/wakatime.js` e `api/codando.js` em produção.

## ☁️ Deploy na Vercel (variáveis de ambiente)

1. Suba o projeto para um repositório no GitHub (o `.env.local` **não** vai junto, e é isso mesmo).
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório. O preset **Vite** é detectado sozinho.
3. Antes de clicar em **Deploy**, abra a seção **Environment Variables** e cadastre as variáveis da tabela abaixo.
4. Clique em **Deploy**.

Nenhuma delas tem o prefixo `VITE_`, de propósito: ficam só no servidor e nunca vão para o build.

| Variável | Obrigatória? | Para que serve | *Sensitive* |
|:--|:--:|:--|:--:|
| `WAKATIME_ACCESS_TOKEN` | ✅ | Token que as funções mandam no `Authorization: Bearer` | ✅ |
| `WAKATIME_REFRESH_TOKEN` | Opcional | Pede um novo access token se o atual expirar ou for revogado | ✅ |
| `WAKATIME_APP_ID` | Opcional | Usado na renovação, junto com o secret e o refresh token | — |
| `WAKATIME_APP_SECRET` | Opcional | Usado na renovação | ✅ |
| `WAKATIME_PUBLIC_PROJECTS` | Opcional | Projetos que aparecem pelo nome no "Codando agora", separados por vírgula (ex.: `meu-portfolio,WakaTimeAPI`) | — |
| `WAKATIME_USERNAME` | Opcional | Perfil público, usado só quando **não** há token | — |

Se o projeto já estiver publicado:

1. Abra o projeto na Vercel → **Settings** → **Environment Variables**.
2. Para cada variável da tabela, coloque o nome em **Key** e o valor em **Value**, deixe marcados **Production**, **Preview** e **Development** e clique em **Save**. Marque **Sensitive** nas que a tabela indica.
3. Vá em **Deployments**, clique nos **três pontinhos** do último deploy → **Redeploy**. As variáveis só valem para deploys feitos **depois** de cadastradas.

> A pasta `api/` vira **Serverless Functions** automaticamente na Vercel: `api/wakatime.js` responde em `https://seu-projeto.vercel.app/api/wakatime` e `api/codando.js` em `https://seu-projeto.vercel.app/api/codando`. Arquivos que começam com `_` (como `api/_wakatime.js`) **não** viram rota.

## ⚙️ Como funciona

```text
Navegador ──GET /api/wakatime?range=last_7_days──▶  vite.config.js (npm run dev)
                                                     ou api/wakatime.js (Vercel)
                                                            │  + Bearer WAKATIME_ACCESS_TOKEN
                                                            ▼
                                       https://wakatime.com/api/v1/users/current/stats/last_7_days

Navegador ──GET /api/codando (a cada 1 min)──────▶  vite.config.js (npm run dev)
                                                     ou api/codando.js (Vercel)
                                                            │  + Bearer WAKATIME_ACCESS_TOKEN
                                                            ▼
                                       https://wakatime.com/api/v1/users/current/heartbeats?date=hoje
```

- O WakaTime **não libera CORS** e o token **não pode ir para o navegador**: por isso existem as rotas `/api/wakatime` e `/api/codando` no próprio site.
- O token vai no cabeçalho `Authorization: Bearer <token>`, como pede a [documentação de autenticação do WakaTime](https://wakatime.com/developers#authentication). Quem monta o cabeçalho (e renova o token quando a API responde `401`) é o `api/_oauth.js`.
- O servidor devolve só os campos que a tela usa (resposta bem menor) e a Vercel guarda a resposta por **10 minutos** no cache da CDN.
- Endpoints usados: `GET /users/current/stats/:range`, `GET /users/current/status_bar/today` (tempo de hoje), `GET /users/current/heartbeats?date=` e `GET /users/current/user_agents` (codando agora).

## 🟢 Codando agora (projeto em construção no momento)

Acima dos botões de período aparece um cartão dizendo **em qual projeto você está programando agora**, com a branch, a linguagem, o editor, há quanto tempo a sessão começou e quanto tempo você já passou nesse projeto hoje. Parado, ele vira uma linha discreta: *"Parado agora · Última atividade há 3 h em WakaTimeAPI"*.

```text
● CODANDO AGORA                                         último sinal há 1 min
📁 desenvolvimento-e-integracao-de-aplicacoes-web   ⎇ main
● JavaScript   🖥 VS Code   🕒 sessão de 45 min (desde 14:32)   ☀ 2 h 10 min hoje neste projeto
```

### De onde vem essa informação

A extensão do WakaTime no editor manda um **heartbeat** (um "sinal de vida") a cada ~2 minutos enquanto você digita. Cada heartbeat diz o **projeto** (em geral, o nome da pasta aberta), a **branch** do Git, a **linguagem**, o **editor** e o arquivo.

A rota `/api/codando` (arquivo `api/_codando.js`) faz o seguinte:

1. Busca os heartbeats de hoje em `GET /users/current/heartbeats?date=AAAA-MM-DD` (no fuso da sua conta).
2. Descarta os heartbeats que não são de arquivo (os de navegador trazem domínios visitados).
3. Olha o **último**: se chegou há até `ACTIVE_MINUTES` (10 min), você está **codando agora**.
4. Volta pelos heartbeats até achar uma pausa maior que `BREAK_MINUTES` (15 min, o mesmo timeout do WakaTime): ali começou a **sessão**.
5. Soma os intervalos entre heartbeats seguidos para calcular o tempo de hoje no projeto (é aproximado: o dashboard do WakaTime pode diferir em alguns minutos).
6. Troca o id do editor pelo nome (`GET /users/current/user_agents`, guardado por 1 hora).

O componente pergunta de novo **a cada minuto** enquanto a aba está aberta (e na hora em que você volta para ela).

> 🔒 Heartbeats são **privados**: o cartão só funciona com o `WAKATIME_ACCESS_TOKEN` (escopo `read_heartbeats`). No modo perfil público (só `WAKATIME_USERNAME`) a rota responde `503` e o cartão simplesmente não aparece.

### Privacidade

- O **caminho do arquivo** que você está editando **nunca sai do servidor**: a resposta só leva projeto, branch, linguagem e editor.
- Por padrão todos os projetos aparecem pelo nome (`PUBLIC_PROJECTS: ["*"]`). Para esconder **projetos de cliente**, troque por uma lista com os projetos que podem aparecer. Os outros viram **"projeto privado"** (sem nome e sem branch), ou somem de vez com `SHOW_PRIVATE: false`.
- Também dá para somar nomes pela variável `WAKATIME_PUBLIC_PROJECTS` (separados por vírgula), sem mexer no código.
- `<WakaTimeStats showProjects={false} />` também esconde o nome do projeto no cartão.

### Configuração (`src/config/wakatimeConfig.js`)

```js
CODING_NOW: {
  API_PATH: "/api/codando",
  TIMEZONE: "America/Sao_Paulo", // fuso da sua conta: é por ele que o WakaTime separa os dias
  ACTIVE_MINUTES: 10,            // último heartbeat há até 10 min = "codando agora"
  BREAK_MINUTES: 15,             // pausa maior que isso encerra a sessão
  REFRESH_SECONDS: 60,           // de quanto em quanto tempo a página pergunta de novo
  PUBLIC_PROJECTS: ["*"],        // ou ["meu-portfolio", "WakaTimeAPI"]
  SHOW_PRIVATE: true,            // false: projeto fora da lista não aparece
},
```

> 💡 **Custo:** a resposta é igual para todos os visitantes, então fica **60 s** no cache da CDN da Vercel e 60 s na memória da função. O token é usado no máximo uma vez por minuto, não importa quantas pessoas estejam com a página aberta.

### Testando

Rode `npm run dev`, abra qualquer projeto no VS Code (com a extensão do WakaTime) e digite por 1 ou 2 minutos. Em até um minuto o cartão fica verde com o nome do projeto. Para ver a resposta crua, acesse `http://localhost:5173/api/codando`:

```json
{
  "active": true,
  "todaySeconds": 15600,
  "last": {
    "isPublic": true,
    "project": "WakaTimeAPI",
    "branch": "main",
    "language": "JavaScript",
    "editor": "VS Code",
    "at": 1791714685882,
    "sessionStart": 1791711985882,
    "projectTodaySeconds": 7800
  }
}
```

## 📚 Bibliotecas (dependências)

A seção **Bibliotecas** mostra os pacotes que você mais usou no período. A extensão do WakaTime lê os `import` (e `require`, `using`, `#include`...) dos arquivos que você edita e soma o tempo que você passou em cada arquivo para cada biblioteca importada nele. Na API, isso vem no campo `dependencies` de `GET /users/current/stats/:range`.

```json
"libraries": [
  { "name": "react", "seconds": 300000, "percent": 60 },
  { "name": "express", "seconds": 200000, "percent": 40 }
]
```

- **Só com o token:** o perfil público não manda as `dependencies`. Sem o `WAKATIME_ACCESS_TOKEN`, a seção não aparece.
- **Porcentagem:** um arquivo importa várias bibliotecas ao mesmo tempo, então o tempo delas se sobrepõe (a soma passa do tempo total). Por isso a porcentagem de cada uma é recalculada entre as bibliotecas que aparecem: é a fatia entre as bibliotecas, não do tempo total.
- **Barulho e privacidade:** entram também a biblioteca padrão das linguagens (`os`, `sys`, `java.util`...) e pacotes internos de clientes (`@cliente-x/auth`). Esconda com `HIDDEN_DEPENDENCIES`, no `src/config/wakatimeConfig.js`. O filtro roda no servidor, antes do corte, então o nome escondido não chega nem ao navegador e a lista continua com `MAX_LIBRARIES` itens.

```js
// src/config/wakatimeConfig.js
MAX_LIBRARIES: 10,                                         // quantas aparecem
HIDDEN_DEPENDENCIES: ["os", "sys", "@cliente-x/*", "java.*"], // nome exato ou prefixo com "*"
```

> 💡 Antes de publicar, abra `http://localhost:5173/api/wakatime?range=all_time` e confira o campo `libraries`: é o jeito mais rápido de ver o que precisa ir para o `HIDDEN_DEPENDENCIES`.

Para tirar a seção da tela, use `<WakaTimeStats showLibraries={false} />`.

## 🧩 Usando no seu projeto

Copie para o seu projeto React + Vite:

```text
api/_oauth.js                            → token OAuth (Bearer) e renovação automática
api/_wakatime.js                         → lógica das estatísticas (servidor)
api/wakatime.js                          → Vercel Function /api/wakatime
api/_codando.js                          → lógica do "codando agora" (servidor)
api/codando.js                           → Vercel Function /api/codando
src/config/wakatimeConfig.js             → períodos, link do perfil, limites, bibliotecas escondidas, CODING_NOW
src/services/wakatimeService.js          → fetch para /api/wakatime e /api/codando
src/components/WakaTimeStats/            → componentes + CSS
scripts/wakatime-oauth.mjs               → gera os tokens (npm run wakatime:oauth)
```

Junte o plugin `wakatimeApi(env)` ao seu `vite.config.js` (veja o deste projeto), acrescente `"wakatime:oauth": "node scripts/wakatime-oauth.mjs"` aos `scripts` do seu `package.json` e use:

```jsx
import WakaTimeStats from "./components/WakaTimeStats/WakaTimeStats";

<WakaTimeStats />
<WakaTimeStats initialRange="all_time" />
<WakaTimeStats showRangePicker={false} showProjects={false} />
<WakaTimeStats showCodingNow={false} />
<WakaTimeStats showLibraries={false} />
```

Quer só o cartão "Codando agora" (ex.: no topo do portfólio)? Ele também funciona sozinho:

```jsx
import CodingNow from "./components/WakaTimeStats/CodingNow";

<CodingNow />
```

| Prop | Padrão | O que faz |
| --- | --- | --- |
| `initialRange` | `"last_7_days"` | Período inicial (`last_7_days`, `last_30_days`, `last_6_months`, `last_year`, `all_time`) |
| `showRangePicker` | `true` | Mostra os botões de período |
| `showProjects` | `true` | Mostra os nomes dos projetos (use `false` para esconder projetos de cliente). Vale também para o cartão "Codando agora" |
| `showCodingNow` | `true` | Mostra o cartão "Codando agora" (projeto em que você está mexendo neste momento) |
| `showLibraries` | `true` | Mostra a seção "Bibliotecas" (só aparece com o token, que é quem traz as dependências) |

O CSS usa as variáveis do `index.css` (`--brand`, `--muted`...) com valores padrão: o componente fica igual mesmo se o seu projeto não tiver essas variáveis.

## 📂 Estrutura do Projeto

```text
📁 WakaTimeAPI
│
├── 📁 api
│   ├── _oauth.js        └── Token OAuth (Bearer) e renovação automática com o refresh token
│   ├── _wakatime.js     └── Chama o WakaTime com o token, normaliza a resposta e filtra as bibliotecas
│   ├── wakatime.js      └── Vercel Function: GET /api/wakatime
│   ├── _codando.js      └── Lê os heartbeats de hoje e monta o "codando agora"
│   └── codando.js       └── Vercel Function: GET /api/codando
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
├── 📁 scripts
│   └── wakatime-oauth.mjs  └── Gera o access token e o refresh token (npm run wakatime:oauth)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/          └── Card da página com a faixa azul (logo PUC + logo da API)
│   │   └── WakaTimeStats/
│   │       ├── WakaTimeStats.jsx / .css  └── Painel de estatísticas (indicadores, linguagens, projetos e bibliotecas)
│   │       ├── CodingNow.jsx             └── Cartão "Codando agora" (atualiza a cada minuto)
│   │       ├── format.js                 └── Formata horas, porcentagens, datas e "há 3 min" (pt-BR)
│   │       └── languageColors.js         └── Cor de cada linguagem (GitHub Linguist)
│   │
│   ├── ⚙️ config
│   │   └── wakatimeConfig.js   └── Períodos, link do perfil, linguagens e bibliotecas escondidas, CODING_NOW
│   │
│   ├── 🛠️ services
│   │   └── wakatimeService.js  └── fetch para /api/wakatime (cache por período) e /api/codando
│   │
│   ├── App.jsx
│   ├── index.css               └── Reset, variáveis de cor e fundo da página
│   └── main.jsx
│
├── 📄 .env.example
├── 📄 .gitignore               └── Ignora .env.local, node_modules e dist
├── 📄 vite.config.js           └── Atende /api/wakatime e /api/codando no npm run dev
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

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (inclusive o logo do WakaTime na faixa azul)
- Nenhuma biblioteca para chamar a API: só `fetch`. O `npm run wakatime:oauth` também não usa pacote nenhum, só o próprio Node.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (com as rotas `/api/wakatime` e `/api/codando`) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente (também atende `/api/wakatime` e `/api/codando`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run wakatime:oauth` | Abre a autorização do WakaTime e imprime o `WAKATIME_ACCESS_TOKEN` e o `WAKATIME_REFRESH_TOKEN` |

## 📄 Licença
Este projeto está licenciado sob a MIT License.
