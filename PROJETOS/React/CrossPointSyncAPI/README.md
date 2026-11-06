# Projeto CrossPointSyncAPI (React + Vite) 📚

## 📖 Descrição

Estante **"O que estou lendo"** feita com **React** e **Vite** a partir da API do **[crosspoint-sync](https://github.com/crosspoint-reader/crosspoint-sync)**, um servidor de sincronização de leitura compatível com o **KOReader** (protocolo KOSync) e com os leitores **CrossPoint / CrossInk**.

O app mostra, em um lugar só, o progresso de cada livro em todos os seus aparelhos: o leitor CrossPoint, o KOReader (Kobo, Boox, celular...) e o **Kindle**, quando o conector do Kindle está vinculado no servidor.

Recursos:

- Entrada com a **mesma conta do leitor** (servidor hospedado ou self-hosted)
- **Modo demonstração** com dados de exemplo, sem precisar de conta
- Abas **Lendo agora**, **Pausados**, **Concluídos**, **Abandonados** e **Todos**, com contagem
- **Busca** por título ou autor (ignora acentos)
- Capas do servidor (iTunes / Open Library) e, quando não há capa, uma **capa de tecido** gerada com o título
- Selo **Kindle** nos livros cuja leitura mais recente veio do Kindle
- Painel do livro com **onde você parou em cada aparelho**
- Resumo da leitura com **páginas lidas** (`/api/v1/stats/activity`)
- Tema **claro / escuro**, responsivo, e **100% front-end**: funciona no **GitHub Pages**

## 🖼️ Capturas de Tela

| Entrada | Estante |
| :---: | :---: |
| ![Login](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/Login.png) | ![Home](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/Home.png) |

| Livro (aparelhos) | Concluídos |
| :---: | :---: |
| ![Detalhes](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/Detalhes.png) | ![Concluidos](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/Concluidos.png) |

| Estante (tema escuro) | Livro (tema escuro) |
| :---: | :---: |
| ![HomeDark](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/HomeDark.png) | ![DetalhesDark](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/DetalhesDark.png) |

| Celular | Celular (livro) | Celular (entrada, escuro) |
| :---: | :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/Mobile.png) | ![MobileDetalhes](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/MobileDetalhes.png) | ![MobileLoginDark](https://joaopauloaramuni.github.io/react-imgs/CrossPointSyncAPI/imgs/MobileLoginDark.png) |

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` e clique em **Ver demonstração**, ou entre com a sua conta.

> Não há `.env`: o app não tem chave de API. Cada pessoa entra com a própria conta do crosspoint-sync.

## 🔑 Conta no crosspoint-sync

O app usa a **mesma conta** que o seu leitor usa para sincronizar:

- **Servidor hospedado:** `https://sync.crosspointreader.com` (já vem preenchido).
- **Servidor próprio:** rode o crosspoint-sync com Docker, Railway, NixOS ou Node (veja o [README do servidor](https://github.com/crosspoint-reader/crosspoint-sync#run-it)) e digite o endereço dele, por exemplo `http://192.168.0.10:8080`.

No leitor (CrossPoint ou KOReader), configure a sincronização de progresso com esse servidor, usuário e senha. Assim que você abrir um livro com a sincronização ligada, ele aparece na estante.

> 💡 Ative no leitor a opção de **enviar metadados** (título, autor, arquivo). Sem ela, o servidor só conhece o hash do livro e o app mostra o nome do arquivo ou "Documento a1b2c3d4".

## 📱 E o Kindle?

O crosspoint-sync **não** foi feito para o Kindle, mas tem um **conector Amazon Kindle** (beta e **só leitura**):

1. Entre no site do seu servidor (por exemplo `https://sync.crosspointreader.com/app/`).
2. Em **Connected services** (serviços conectados), vincule o **Amazon Kindle**.
3. O servidor passa a buscar a sua posição no **Whispersync** e a gravá-la como mais um "aparelho", com `device_id: "kindle"` e `device: "Amazon Kindle (Whispersync)"`.

Importante:

- O conector **atualiza livros que o servidor já conhece**, ou seja, que também estão no seu CrossPoint/KOReader e foram casados com o livro do Kindle. Ele **não importa a sua biblioteca inteira** da Amazon.
- No **self-hosted**, os conectores só funcionam com a variável `TOKEN_ENC_KEY` definida (veja o README do servidor).
- É uma API privada da Amazon, por isso o selo **beta**: ela pode mudar sem aviso.

No app, quando a leitura mais recente de um livro veio do Kindle, ele ganha o selo **Kindle**, e o painel do livro mostra a posição do Kindle ao lado dos outros aparelhos.

## ☁️ Deploy no GitHub Pages

O `vite.config.js` usa `base: "./"`, então a pasta `dist/` funciona numa subpasta, como `https://seu-usuario.github.io/CrossPointSyncAPI/`.

**Opção 1: script `deploy` (branch `gh-pages`)**

```bash
npm run deploy
```

Depois, no GitHub: **Settings** → **Pages** → **Source: Deploy from a branch** → branch **`gh-pages`**, pasta **`/ (root)`** → **Save**.

**Opção 2: subir a pasta `dist/` em um repositório de páginas**

```bash
npm run build
# copie o conteúdo de dist/ para a pasta CrossPointSyncAPI/ do seu repositório *.github.io
```

> Funciona porque o crosspoint-sync libera **CORS** para `/users/*` e `/api/v1/*` (padrão `CORS_ORIGINS=*`). No self-hosted, se você mudou `CORS_ORIGINS`, inclua `https://seu-usuario.github.io`.
>
> ⚠️ Uma página em **HTTPS** (GitHub Pages) não consegue chamar um servidor em **HTTP** (mixed content). Para usar um self-hosted pelo GitHub Pages, coloque-o atrás de HTTPS (Caddy, nginx...). Pelo `npm run dev` (`http://localhost`), servidores HTTP funcionam normalmente.

## ⚙️ Como funciona

```text
Navegador (React) ──GET + x-auth-user / x-auth-key──▶ crosspoint-sync
     │                                                   │  ▲
     │  /users/auth               confere a conta        │  │ Whispersync (conector Kindle)
     │  /api/v1/progress          livros + progresso     │  │ CrossPoint / KOReader (PUT)
     │  /api/v1/progress/{doc}    posição por aparelho   ▼  │
     │  /api/v1/stats/activity    páginas lidas        SQLite
     ▼
  Estante (abas, busca, capas, painel do livro)
```

- **Autenticação:** igual ao KOReader. `x-auth-user` é o usuário e `x-auth-key` é o **MD5** (hex) da senha. O Web Crypto do navegador não tem MD5, então ele está em `src/utils/md5.js`, em JavaScript puro.
- **`GET /api/v1/progress`** devolve cada livro com a linha **mais recente** entre os aparelhos, já com `title`, `author`, `status`, `cover_url` e `page_count`. O app segue o cursor `next` até a última página.
- **`status`** vem pronto do servidor: o que você marcou à mão, senão `finished` a partir de 98%, senão `reading`.
- **`GET /api/v1/progress/{document}`** devolve **uma linha por aparelho**. É ela que alimenta o painel do livro.
- A página aproximada é `porcentagem × page_count` (páginas da edição impressa).
- Erros tratados: usuário/senha errados (401), muitas tentativas (429), servidor sem a API estendida (404), servidor fora do ar ou CORS bloqueado, e tempo esgotado (15 s).

> 🔐 **Sobre a senha:** para essa API, o MD5 da senha funciona como a própria senha, e é isso que o protocolo KOSync usa. O app nunca guarda a senha. Com **"Lembrar neste navegador"**, ele guarda o MD5 no `localStorage`; sem essa opção, a sessão fica só em memória e acaba ao recarregar a página. Use uma senha exclusiva para a sincronização.

## 🧩 Usando no seu projeto

Copie para o seu projeto React + Vite:

```text
src/config/crosspointConfig.js        → servidor padrão, rotas, abas
src/services/crosspointService.js     → fetch + autenticação KOSync
src/utils/md5.js                      → MD5 para o x-auth-key
src/utils/format.js                   → datas relativas, %, nome do aparelho
src/hooks/useSession.js               → login / demonstração / sair
src/hooks/useLibrary.js               → estante + estatísticas
src/components/Bookshelf/             → estante (abas, busca, grade)
src/components/BookCard/              → livro na estante
src/components/BookCover/             → capa real ou capa de tecido
src/components/BookDetails/           → painel com os aparelhos
```

E use:

```jsx
import Bookshelf from "./components/Bookshelf/Bookshelf";
import useLibrary from "./hooks/useLibrary";
import useSession from "./hooks/useSession";

const conta = useSession();
const biblioteca = useLibrary(conta.sessao);

{conta.sessao && <Bookshelf sessao={conta.sessao} biblioteca={biblioteca} onSair={conta.sair} />}
```

## 📂 Estrutura do Projeto

```text
📁 CrossPointSyncAPI
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/          └── Card da página com a faixa verde (logo PUC + logo da API)
│   │   ├── ThemeToggle/         └── Botão de tema claro/escuro
│   │   ├── LoginForm/           └── Entrada (servidor, usuário, senha) + quadro sobre o Kindle
│   │   ├── Bookshelf/           └── Estante: resumo, abas, busca e grade
│   │   ├── BookCard/            └── Livro: capa, progresso, aparelho, selo Kindle
│   │   ├── BookCover/           └── Capa real ou capa de tecido gerada
│   │   └── BookDetails/         └── Painel (<dialog>) com a posição em cada aparelho
│   │
│   ├── ⚙️ config/crosspointConfig.js
│   ├── 📁 data/demoLibrary.js   └── Estante de demonstração (mesmo formato da API)
│   ├── 🪝 hooks
│   │   ├── useSession.js        └── Login, demonstração e sair
│   │   ├── useLibrary.js        └── Carrega livros, estatísticas e aparelhos
│   │   └── useTheme.js          └── Tema claro/escuro
│   ├── 🛠️ services/crosspointService.js
│   ├── 🔧 utils
│   │   ├── md5.js               └── MD5 em JavaScript puro (x-auth-key)
│   │   ├── format.js            └── "há 2 horas", "62%", nome do aparelho
│   │   └── storage.js           └── localStorage com try/catch
│   ├── App.jsx
│   ├── index.css                └── Variáveis dos temas + botões, campos, barra de progresso
│   └── main.jsx
│
├── 📄 index.html        └── Aplica o tema antes do React (sem piscar) + fontes
├── 📄 vite.config.js    └── base: "./" para o GitHub Pages
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

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (livro, Amazon, aparelho, tema)
- [`gh-pages`](https://www.npmjs.com/package/gh-pages) (dev): publica a pasta `dist/` na branch `gh-pages`
- Sem SDK: a API do crosspoint-sync é chamada com `fetch`.
- Fontes do Google Fonts: **Montserrat** (interface) e **Literata** (títulos dos livros, feita para leitura em tela).

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run deploy` | Build + publica no GitHub Pages (branch `gh-pages`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 🔗 Links

- [crosspoint-sync (GitHub)](https://github.com/crosspoint-reader/crosspoint-sync)
- [API do crosspoint-sync (docs/API.md)](https://github.com/crosspoint-reader/crosspoint-sync/blob/main/docs/API.md)
- [KOReader](https://koreader.rocks/)
- [Vite: deploy no GitHub Pages](https://vite.dev/guide/static-deploy#github-pages)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
