# Projeto Yu-Gi-Oh! Cartas (React + Vite + Supabase) 🃏

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://yugioh-api.vercel.app/)

👉 **[yugioh-api.vercel.app](https://yugioh-api.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

O **Yu-Gi-Oh! Cartas** é uma aplicação web feita com **React** e **Vite** para pesquisar, filtrar e explorar as cartas de Yu-Gi-Oh! (TCG e OCG). Os dados e as imagens das cartas vêm da **[API da YGOPRODeck](https://ygoprodeck.com/api-guide/)**, e as **cartas favoritas** ficam **persistidas no PostgreSQL do [Supabase](https://supabase.com/)**, na tabela `favorite_cards`.

O site inteiro está em **português e inglês** com **[i18next](https://www.i18next.com/)** + **[react-i18next](https://react.i18next.com/)**: o seletor no topo traduz a interface **e** as cartas.

Não existe back-end: o navegador chama a API da YGOPRODeck direto (ela é pública e não pede chave) e fala com o Supabase pelo SDK **`@supabase/supabase-js`**, que usa a **Data API** (HTTPS) com a chave **publicável**, protegida por **RLS** e por **funções SQL**.

O visual é o de um **templo egípcio ao entardecer**: pedra queimada, bronze, ouro do Milênio e luz âmbar, com hieróglifos de verdade (Unicode) em frisos e **cartuchos** nos títulos. A home abre com uma **animação de cartas** (o verso das cartas cai girando, abre em leque e revela o logo) e tem o efeito **[Splash Cursor](https://reactbits.dev/animations/splash-cursor)** do **[React Bits](https://reactbits.dev/)**: uma **poeira de areia dourada** que segue o mouse.

## ✨ Funcionalidades

- 🎴 **Abertura com cartas**: ao abrir a home, sete cartas viradas caem empilhadas girando (como o redemoinho do verso), abrem em leque, o logo surge com um brilho dourado e as cartas voam para fora, revelando a página. Dura 3,4 s, aparece **uma vez por sessão** (`sessionStorage`) e pode ser pulada com clique, `Esc`, `Enter` ou o botão **Pular abertura**. Com **"reduzir movimento"** ligado no sistema, ela não aparece.
- 🎵 **Música de fundo**: o tema de Yu-Gi-Oh! toca em loop em todas as páginas, com fade-in suave. Se o navegador bloquear o autoplay, a música começa no primeiro clique, toque ou tecla (pular a abertura já conta), e um aviso mostra isso. O botão redondo no canto inferior esquerdo liga e desliga, e a escolha fica salva.
- 🏛️ **Visual de templo egípcio**: fundo do hero com ruínas de templo desfocadas, disco solar atrás do Yugi, vinheta, textura de pedra, frisos de hieróglifos (𓂀 𓋹 𓆣 𓁹), títulos em **cartuchos** (o oval com barra onde os egípcios escreviam o nome do faraó) e o banner "O cofre do Faraó" com o Anel do Milênio.
- 🏠 **Home**: logo, ilustração do Yugi, pesquisa rápida, atalhos para arquétipos clássicos (Dark Magician, Blue-Eyes, Red-Eyes, Kuriboh e Exodia), **o deck do Yugi** em destaque (6 cartas sorteadas entre 25 clássicas do Rei dos Jogos: Dark Magician, Dark Magician Girl, Kuriboh, Exodia, Celtic Guardian, Summoned Skull, Gaia, Black Luster Soldier, Slifer, Mirror Force, Swords of Revealing Light…, com o botão **Sortear outras**) e atalhos por tipo de carta.
- 💨 **Fumaça do React Bits na home**: o `SplashCursor` desenha uma simulação de fluido em WebGL, uma poeira âmbar que segue o mouse (e o dedo, no celular). Ele fica por cima da página com `pointer-events: none`, então não atrapalha os cliques. Só aparece na home e é baixado sob demanda (`React.lazy`). Com **"reduzir movimento"** ligado no sistema, a fumaça não é desenhada.
- 🔎 **Pesquisa por nome**: a lista atualiza 450 ms depois da última tecla (uma requisição por busca, não por tecla). `Esc` limpa o campo.
- 🧰 **Filtros**: **tipo** (Monstro Normal, de Efeito, Ritual, Fusão, Sincro, Xyz, Link, Pêndulo, Magia e Armadilha), **atributo** (Trevas, Luz, Terra, Água, Fogo, Vento e Divino), **arquétipo** (com sugestões vindas de `archetypes.php`) e **ordenação** (nome, mais recentes, ATK, DEF, nível/rank).
- 🔗 **Busca no endereço**: pesquisa, filtros e página ficam na URL (`#/cartas?q=mago&type=Spell+Card`), então dá para compartilhar o link de uma busca e o botão "Voltar" do navegador funciona.
- 📄 **Paginação**: 24 cartas por página, usando `num` e `offset` da API.
- 🃏 **Detalhes da carta**: imagem grande que **inclina e brilha** seguindo o ponteiro, tipo, atributo, nível/rank com estrelas, escala de Pêndulo, ATK/DEF ou LINK com as setas, texto completo (cartas de Pêndulo mostram os dois efeitos separados), código (passcode), arquétipo (com link para os outros do mesmo arquétipo), **preços de referência** (Cardmarket, TCGplayer, eBay, Amazon e CoolStuffInc) e **coleções** com código, raridade e preço.
- 🎨 **Cor da moldura**: cada carta usa a cor da moldura do tipo dela (laranja para Efeito, verde-água para Magia, rosa para Armadilha, roxo para Fusão…), na faixa do card e no selo.
- 🌐 **Site inteiro em Português ou English (i18next)**: o seletor no topo traduz **toda a interface** (menu, botões, filtros, avisos, mensagens de erro, abertura, rodapé, título da aba e o `<html lang>`), os **nomes de tipos, atributos, raças e setas Link**, a formatação de **números e preços** (`13.542` / `13,542`) e, pelo parâmetro `language` da API, os **nomes e textos das cartas**. Na primeira visita, segue o idioma do navegador; depois, a escolha fica salva.
- ⭐ **Favoritos no Supabase**: a estrela grava ou apaga a carta no banco. A página **Favoritas** mostra só as marcadas, da mais recente para a mais antiga, e o número aparece no menu.
- 🚫 **Sem Supabase, sem quebrar**: se o `.env.local` não existir (ou tiver os valores de exemplo do `.env.example`), **as estrelas ficam desabilitadas** e aparece o aviso "Favoritos desativados: o Supabase não está configurado". Se o Supabase estiver configurado mas **a conexão falhar** (rede, projeto pausado, SQL não executado), as estrelas também ficam desabilitadas e aparece "A conexão com o Supabase falhou", com o detalhe do erro e o botão **Tentar de novo**. Em todos os casos, pesquisar e ver as cartas continua funcionando.
- 💡 **Status do Supabase no topo**: verde (conectado), âmbar piscando (conectando), vermelho (falhou) ou cinza (não configurado).
- 🌙 **Dois temas**: **Tumba** (escuro, padrão) e **Papiro** (claro, cor de arenito). A escolha fica salva, e o tema é aplicado antes do React carregar, então a página não "pisca".
- 📱 **Responsivo**: desktop, tablet e celular.
- ⌨️ **Acessibilidade**: link "Pular para o conteúdo", foco visível, rótulos nos campos, `aria-pressed` na estrela e textos alternativos.
- 🖼️ **Imagem reserva**: se a imagem de uma carta não carregar, aparece uma moldura na cor do tipo com o nome da carta.

## 🖼️ Capturas de Tela

| Abertura com cartas | Home |
| :---: | :---: |
| ![Abertura](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Abertura.png) | ![Home](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Home.png) |

| Fumaça do React Bits (SplashCursor) | Home - Tema Papiro |
| :---: | :---: |
| ![Fumaca](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Fumaca.png) | ![HomePapiro](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/HomePapiro.png) |

| Home completa | Cartas |
| :---: | :---: |
| ![HomeCompleta](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/HomeCompleta.png) | ![Cartas](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Cartas.png) |

| Cartas - Tema Papiro | Pesquisa ("Mago") |
| :---: | :---: |
| ![CartasPapiro](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/CartasPapiro.png) | ![Pesquisa](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Pesquisa.png) |

| Filtro por tipo (Magia) | Filtro por arquétipo (Blue-Eyes) |
| :---: | :---: |
| ![FiltroTipo](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/FiltroTipo.png) | ![Arquetipo](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Arquetipo.png) |

| Nenhuma carta encontrada | Detalhes |
| :---: | :---: |
| ![NenhumaCarta](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/NenhumaCarta.png) | ![Detalhes](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Detalhes.png) |

| Detalhes - Tema Papiro | Detalhes - Monstro Link |
| :---: | :---: |
| ![DetalhesPapiro](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/DetalhesPapiro.png) | ![DetalhesLink](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/DetalhesLink.png) |

| Favoritas | Favoritas vazia |
| :---: | :---: |
| ![Favoritos](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Favoritos.png) | ![FavoritosVazio](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/FavoritosVazio.png) |

| Favoritos desativados (sem Supabase) | Cartas sem Supabase (estrelas desabilitadas) |
| :---: | :---: |
| ![FavoritosDesativados](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/FavoritosDesativados.png) | ![CartasSemSupabase](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/CartasSemSupabase.png) |

| Conexão com o Supabase falhou | Celular |
| :---: | :---: |
| ![ConexaoFalhou](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/ConexaoFalhou.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/Mobile.png) |

| Celular - Tema Papiro | Celular - Cartas |
| :---: | :---: |
| ![MobilePapiro](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/MobilePapiro.png) | ![MobileCartas](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/MobileCartas.png) |

| Celular - Detalhes |
| :---: |
| ![MobileDetalhes](https://joaopauloaramuni.github.io/react-imgs/YuGiOhAPI/imgs/MobileDetalhes.png) |

## 🚀 Como rodar

Pré-requisito: **Node.js 20.19+** (ou 22.12+), exigido pelo Vite 8.

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase (opcional)
npm run dev
```

Acesse **`http://localhost:5173`** no navegador.

O site funciona sem o `.env.local`: só os **favoritos** ficam desativados (estrelas desabilitadas e um aviso na tela). Para usar os favoritos, crie a tabela e as funções no Supabase (passo 2 abaixo).

## 🗄️ Configuração do Supabase (passo a passo)

### 1. Criar a conta e o projeto

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta (dá para entrar com o GitHub).
2. No dashboard, clique em **New project**.
3. Preencha:
   - **Name**: por exemplo, `yugioh`.
   - **Database Password**: crie uma senha e guarde-a. Neste projeto ela **não** vai para o `.env` (o React não conecta com usuário e senha do banco).
   - **Region**: escolha a mais próxima. No Brasil, **South America (São Paulo)** (`sa-east-1`). ⚠️ A região não pode ser alterada depois.
4. Clique em **Create new project** e aguarde o banco ficar pronto.

> 💡 Dá para usar o mesmo projeto Supabase de outro trabalho: a tabela deste projeto se chama `favorite_cards` e as funções têm nomes próprios, então não conflitam com uma tabela `favorites`.

### 2. Criar a tabela, o RLS e as funções (obrigatório)

Abra o **SQL Editor** no Supabase, cole o conteúdo de **`supabase_favorites.sql`** e clique em **Run**. O script pode ser executado de novo sem problema.

Ele cria:

| Objeto | O que faz |
|---|---|
| Tabela `favorite_cards` | `owner_token`, `card_id`, `created_at`, com chave primária `(owner_token, card_id)` |
| `check` no `card_id` | Só ids positivos (os passcodes das cartas) |
| RLS ligado + `revoke all` | O visitante **não** lê, insere, altera nem apaga a tabela direto |
| Função `list_my_favorite_cards` | Devolve os favoritos de **um** `owner_token`, do mais recente ao mais antigo |
| Função `toggle_favorite_card` | Se já é favorita, apaga e devolve `false`; senão, insere e devolve `true` |
| `grant execute` | Libera só as duas funções para os papéis `anon` e `authenticated` |
| `notify pgrst` | Atualiza o cache da Data API para ela enxergar as funções na hora |

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
```

| Variável | Para que serve |
|---|---|
| `VITE_SUPABASE_URL` | Endereço da Data API do seu projeto |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública usada pelo `supabase-js` (também aceita `VITE_SUPABASE_ANON_KEY`) |

Reinicie o `npm run dev` depois de alterar: o Vite só lê o `.env.local` quando inicia.

### 5. Rodar e verificar

1. Acesse `http://localhost:5173`. O indicador do topo deve ficar **verde** com "Supabase conectado".
2. Abra **Cartas** e clique na estrela (☆) de alguma carta. Ela fica preenchida (★) e o número aparece em **Favoritas** no menu.
3. No Supabase, abra o **Table Editor** e selecione a tabela `favorite_cards`: o `card_id` deve aparecer lá, com o `owner_token` do seu navegador.
4. Recarregue a página: a carta continua marcada e aparece em **Favoritas**.

> 💤 No plano gratuito, projetos sem atividade por cerca de uma semana são **pausados**. Se aparecer "A conexão com o Supabase falhou", entre no dashboard e clique em **Restore project**.

## 🚫 Quando o Supabase não está disponível

O hook `useFavoritos` guarda um **status** que todas as telas usam:

| Status | Quando acontece | Estrelas | O que aparece |
|---|---|---|---|
| `desativado` | Sem `.env.local`, ou com os valores de exemplo do `.env.example` | Desabilitadas | "Favoritos desativados: o Supabase não está configurado." com o passo a passo |
| `carregando` | Buscando os favoritos ao abrir o site | Desabilitadas | Indicador âmbar piscando no topo |
| `pronto` | Supabase respondeu | **Habilitadas** | Indicador verde |
| `erro` | A conexão com o Supabase falhou (rede, URL ou chave errada, projeto pausado, SQL não executado) | Desabilitadas | "A conexão com o Supabase falhou. Os favoritos estão desativados." + detalhe do erro + **Tentar de novo** |

- Com as estrelas desabilitadas, passar o mouse sobre elas mostra o motivo (`title`), e leitores de tela leem o mesmo texto (`aria-label`).
- O `supabaseClient.js` só chama o `createClient` quando a URL e a chave são válidas. Sem isso, o `createClient` lançaria erro e a página ficaria em branco.
- Se salvar um favorito falhar no meio do uso, o status vira `erro` na hora e as estrelas são desabilitadas.

## 🔐 Segurança: por que a chave pode ficar no navegador?

A **publishable key** foi feita para ser pública. Ela só identifica o projeto; o que cada visitante pode fazer é decidido pelo **banco**. Por isso o `supabase_favorites.sql` fecha a tabela e libera só as duas funções:

| O visitante tenta... | Resultado | Por quê |
|---|---|---|
| Listar todos os favoritos (`select * from favorite_cards`) | ❌ `permission denied` | `revoke all` na tabela para o `anon` |
| Inserir direto na tabela (`insert`) | ❌ `permission denied` | Idem |
| Apagar os favoritos dos outros (`delete`) | ❌ `permission denied` | Idem: só pela `toggle_favorite_card`, com o próprio `owner_token` |
| Favoritar a carta `-5` | ❌ `check constraint` | Só ids positivos |
| Ver os próprios favoritos | ✅ | Função `list_my_favorite_cards` com o seu `owner_token` |
| Favoritar / desfavoritar | ✅ | Função `toggle_favorite_card` com o seu `owner_token` |

As duas funções são `security definer`: rodam com a permissão de quem as criou e só tocam nas linhas do `owner_token` recebido. O `set search_path = public` impede que alguém troque as tabelas usadas por elas.

### O `owner_token`

Não há login. Na primeira visita, o navegador gera um **UUID aleatório** (`crypto.randomUUID()`) e guarda no `localStorage` (`yugioh:owner-token`). Ele vai junto em cada chamada e é a "chave" dos favoritos.

- Outro navegador (ou outro celular) tem **outro** `owner_token`, então tem outras favoritas.
- Se você limpar os dados do site, um novo token é gerado e a página Favoritas começa vazia. As linhas antigas continuam no banco.

> 🎓 **Próximo passo natural:** favoritos **por usuário**. Com o **Supabase Auth**, o `owner_token` vira `user_id uuid default auth.uid()`, as funções passam a usar `auth.uid()` no lugar do parâmetro e as favoritas acompanham a pessoa em qualquer aparelho.

## ⚙️ Como funciona

```text
                    ┌── fetch ─────────▶ db.ygoprodeck.com/api/v7/cardinfo.php     (cartas, filtros, paginação)
                    │                                       /archetypes.php    (sugestões do filtro)
Navegador (React) ──┤
                    ├── <img src> ─────▶ images.ygoprodeck.com/images/cards/{id}.jpg       (detalhes)
                    │                                        /cards_small/{id}.jpg (lista)
                    │
                    └── supabase-js ───▶ <project-ref>.supabase.co/rest/v1/rpc/list_my_favorite_cards
                         chave publicável                            /rpc/toggle_favorite_card
```

1. Ao abrir o site, o `FavoritosProvider` busca **todos** os favoritos deste navegador numa única chamada (`list_my_favorite_cards`) e guarda os ids num Context, compartilhado por todas as páginas.
2. A página **Cartas** lê pesquisa, filtros e página da URL (`useSearchParams`) e chama `searchCards()`, que monta `cardinfo.php?fname=...&type=...&num=24&offset=...`.
3. Cada resposta da API vira um objeto pronto para a tela (`createCard`): moldura e cor do tipo, nomes em pt-BR, ATK/DEF, imagem pequena e grande.
4. As respostas ficam num **cache em memória** (`Map` com a URL como chave): voltar de página ou reabrir uma carta não faz outra requisição.
5. A estrela chama `toggle_favorite_card(owner_token, card_id)`. O banco faz o "apaga ou insere" numa função só e devolve o novo estado.
6. A página **Favoritas** busca os dados das cartas favoritas em uma chamada (`cardinfo.php?id=1,2,3`, em blocos de 50) e mantém a ordem do banco.

## 🌍 Tradução com i18next (Português / English)

O site usa **[i18next](https://www.i18next.com/)** com **[react-i18next](https://react.i18next.com/)**. Todos os textos ficam em dois arquivos JSON, com as **mesmas chaves**:

```text
src/i18n/
├── index.js              └── Configuração do i18next (idioma inicial, localStorage, <html lang>, título da aba)
├── useCardLabels.js      └── Nomes traduzidos de uma carta (tipo, atributo, raça, typeline, setas Link)
└── locales/
    ├── pt.json           └── Português
    └── en.json           └── English
```

### O que o seletor de idioma traduz

| O quê | Como |
|---|---|
| Interface: menu, botões, filtros, avisos do Supabase, erros, abertura, rodapé | `t("chave")` do react-i18next, com textos em `pt.json` / `en.json` |
| Título da aba e `<html lang>` | `i18n.on("languageChanged")` em `src/i18n/index.js` |
| Tipos (Monstro de Efeito / Effect Monster), atributos (Trevas / DARK), raças (Mago / Spellcaster), Magia Rápida / Quick-Play, setas Link | Grupos `frame`, `cardTypes`, `attributes`, `races`, `spellTrapRaces`, `linkMarkers` e `typeline` dos JSONs |
| Números e preços | `Intl.NumberFormat` com `pt-BR` ou `en-US` (`13.542 cartas` / `13,542 cards`) |
| Plural | Chaves `_one` / `_other` do i18next (`1 carta encontrada` / `24 cartas encontradas`) |
| **Nomes e textos das cartas** | Parâmetro `language=pt` da API da YGOPRODeck (em English, a API é chamada sem o parâmetro) |

O que **não** muda: nomes de **arquétipos** e de **coleções** e as **raridades**, que a API só tem em inglês.

### Como funciona

```js
// src/i18n/index.js
i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en } },
  lng: idiomaInicial(),   // localStorage "yugioh:language" ou o idioma do navegador
  fallbackLng: "pt",
  interpolation: { escapeValue: false }, // o React já escapa o HTML
});
```

```jsx
// Em qualquer componente
const { t } = useTranslation();
<h1>{t("cards.title")}</h1>                                    // "Cartas" / "Cards"
<p>{t("favorites.count", { count: 3 })}</p>                    // plural automático
<Trans i18nKey="notice.offText" components={{ code: <code /> }} /> // texto com <code> dentro
```

- O `main.jsx` importa `./i18n` antes do `App`, então os textos já estão prontos na primeira renderização.
- O hook `useLanguage()` devolve o idioma atual do i18next, a função para trocar e o locale do `Intl`. As buscas na API têm o idioma nas dependências, então trocar o idioma busca as cartas de novo (o cache em memória guarda as duas versões).
- Textos com HTML (`<code>`, `<strong>`, links) usam o componente `<Trans>`, sem `dangerouslySetInnerHTML`.
- Mensagens de erro dos services usam `i18n.t()` direto, fora dos componentes.

### Adicionando um texto novo

1. Crie a chave nos **dois** arquivos, `pt.json` e `en.json` (ex.: `"home.novoTexto"`).
2. Use no componente: `const { t } = useTranslation();` e `{t("home.novoTexto")}`.

### Adicionando um idioma novo (ex.: espanhol)

1. Copie `en.json` para `es.json` e traduza os valores (as chaves ficam iguais).
2. Em `src/i18n/index.js`, importe o arquivo, adicione `es: { translation: es }` em `resources` e `"es"` em `IDIOMAS`.
3. Adicione `"es": "Español"` no grupo `language` de cada JSON e o locale em `localeDe()` (`"es-ES"`).
4. A API da YGOPRODeck aceita `language=fr`, `de`, `it` e `pt`. Para um idioma que ela não tem (como o espanhol), a interface fica traduzida e as cartas aparecem em inglês: ajuste `langParam()` em `ygoApiService.js` para não enviar o parâmetro.

## 🌐 API da YGOPRODeck

Documentação: **[ygoprodeck.com/api-guide](https://ygoprodeck.com/api-guide/)**. A API é gratuita e não pede chave.

| Uso no projeto | Endpoint |
|---|---|
| Lista paginada com pesquisa e filtros | `cardinfo.php?fname=Magician&type=Effect Monster&attribute=DARK&archetype=Dark Magician&sort=atk&num=24&offset=0` |
| Detalhes de uma carta | `cardinfo.php?id=46986414` |
| Várias cartas (Favoritas) | `cardinfo.php?id=46986414,89631139,38033121` |
| Deck do Yugi (destaques da home) | `cardinfo.php?id=46986414,38033121,40640057,...` (lista `YUGI_DECK` em `appConfig.js`) |
| Sugestões de arquétipo | `archetypes.php` |
| Textos em português | qualquer um acima com `&language=pt` |

Particularidades que a aplicação trata:

- Quando **nenhuma carta** é encontrada, a API responde **HTTP 400** com `{ "error": "No card matching your query..." }`. O `ygoApiService` transforma isso em lista vazia ("Nenhuma carta encontrada"), e não em erro.
- A paginação exige `num` **e** `offset` juntos; o total vem em `meta.total_rows`.
- Monstros **Link** não têm `def` nem `level`: têm `linkval` e `linkmarkers`. Monstros **Xyz** usam `level` como **Rank**.
- Cartas de **Pêndulo** trazem `pend_desc` e `monster_desc` separados, além de `scale`.
- ATK/DEF "?" aparecem como `-1` ou ausentes e são exibidos como `?`.
- Com `language=pt`, o filtro `fname` pesquisa pelo nome em português. Algumas cartas novas podem não ter tradução: troque para **English** no topo.

> ⚠️ **Limite de requisições:** cerca de **20 por segundo**. Quem passa disso pode ser bloqueado por um tempo. O debounce da pesquisa e o cache em memória evitam chegar perto disso.
>
> ⚠️ **Imagens:** a YGOPRODeck pede que projetos com muito acesso **baixem e hospedem as imagens** em vez de carregá-las sempre dos servidores deles. Para um projeto acadêmico isso não é um problema; para algo em produção, guarde as imagens no seu próprio storage (o Supabase Storage serve).

## 🎴 Abertura com cartas (`IntroSplash`)

Feita só com **CSS** (keyframes) e uma pitada de React para controlar quando aparece. Cada carta recebe a variável `--offset` (de -3 a 3), que define o ângulo dela no leque:

| Tempo | O que acontece | Animação |
|---|---|---|
| 0 – 0,9 s | As cartas caem do alto girando e empilham no centro (uma depois da outra) | `intro-cair` |
| 0,9 – 1,7 s | Abrem em leque, girando em torno de um ponto abaixo delas | `intro-leque` |
| 1,4 – 2,2 s | O logo surge com um flash dourado | `intro-logo` |
| 2,5 – 3,4 s | Cada carta voa na direção em que aponta e a tela se dissolve | `intro-espalhar` + `intro-sair` |

- Atrás das cartas gira um **redemoinho de luz** (`repeating-conic-gradient`), ecoando o verso das cartas.
- Aparece **uma vez por sessão**: a marca `yugioh:intro-seen` fica no `sessionStorage`. Feche a aba (ou abra uma aba anônima) para ver de novo.
- Pula com **clique**, **Esc**, **Enter**, **Espaço** ou o botão **Pular abertura**.
- Enquanto está na tela, a rolagem da página fica travada.
- Com **"reduzir movimento"** ligado no sistema, a abertura não aparece.

## 🎵 Música de fundo (`BackgroundMusic`)

O arquivo fica em `src/assets/audio/yugioh-theme.mp3` (3:22, ≈ 3,3 MB) e é importado pelo Vite, que gera um nome com hash no build. O componente fica no `App.jsx`, fora das rotas, então a música **não para** ao trocar de página.

| Situação | O que acontece |
|---|---|
| Navegador permite autoplay | A música começa sozinha ao abrir o site |
| Navegador bloqueia autoplay (o mais comum) | O botão pulsa, aparece "Toque em qualquer lugar para ativar a música" e ela começa no primeiro clique, toque ou tecla |
| Clique no botão com a música tocando | Silencia e salva a escolha (`localStorage`, chave `yugioh:music`) |
| Voltar ao site depois de silenciar | Continua em silêncio até a pessoa clicar no botão de novo |

- **Por que não toca sempre sozinha?** Chrome, Safari e Firefox bloqueiam áudio com som até a pessoa interagir com a página ([política de autoplay](https://developer.chrome.com/blog/autoplay/)). O `audio.play()` devolve uma Promise que falha nesse caso, e o componente então espera o primeiro `pointerdown`, `keydown` ou `touchstart`.
- **Fade-in:** o volume sobe de 0 a 35% em 1,5 s, calculado pelo relógio (`performance.now()`), então leva o mesmo tempo mesmo se o navegador atrasar os timers.
- **Volume:** `MUSIC_VOLUME` em `src/config/appConfig.js`. Para trocar a música, substitua o MP3 mantendo o nome.
- **Acessibilidade:** o botão tem `aria-pressed` e `aria-label` traduzidos, fica acima de tudo (inclusive da abertura) e, com "reduzir movimento", o equalizador animado fica parado.

> ⚠️ O tema de Yu-Gi-Oh! é uma música protegida por direitos autorais. Num projeto acadêmico, sem fins comerciais, o uso costuma ser tolerado, mas num site público a detentora dos direitos pode pedir a remoção.

## 🔤 Fontes

| Fonte | Uso |
|---|---|
| [Federant](https://fonts.google.com/specimen/Federant) | Títulos, menu e botões. Tem cara de cartaz de filme de múmia dos anos 30 |
| [Alegreya Sans](https://fonts.google.com/specimen/Alegreya+Sans) | Textos |
| [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) | ATK/DEF, preços e códigos |
| [Noto Sans Egyptian Hieroglyphs](https://fonts.google.com/noto/specimen/Noto+Sans+Egyptian+Hieroglyphs) | Hieróglifos dos frisos e cartuchos (𓂀 Olho de Hórus, 𓋹 ankh, 𓆣 escaravelho, 𓁹 Olho de Rá, 𓊽 pilar djed, 𓇳 sol) |

## 💨 Fumaça do React Bits (SplashCursor)

O componente **[Splash Cursor](https://reactbits.dev/animations/splash-cursor)** foi copiado do React Bits para `src/components/reactbits/SplashCursor/` (é assim que o React Bits funciona: o código fica no projeto, sem pacote npm). O `SmokeEffect` passa as props:

```jsx
<SplashCursor
  COLOR="#E39A2D"            // âmbar: poeira de areia na luz do templo
  RAINBOW_MODE={false}       // uma cor só (sem arco-íris)
  DENSITY_DISSIPATION={3}    // quanto maior, mais rápido a fumaça some
  VELOCITY_DISSIPATION={2.2} // quanto maior, mais rápido ela para de se espalhar
  PRESSURE={0.12}
  CURL={4}                   // redemoinhos
  SPLAT_RADIUS={0.22}        // tamanho do "jato" a cada movimento
  SPLAT_FORCE={5000}
  SHADING={true}             // relevo 3D na fumaça
/>
```

- Para trocar a cor, mude `SMOKE_COLOR` em `src/config/appConfig.js`. Outras cores que combinam: **`#FFD66B`** (ouro do Milênio), **`#B5441F`** (brasa) e **`#7A4BE0`** (violeta do Reino das Sombras).
- O componente usa `position: fixed` e `pointer-events: none`: fica por cima de tudo sem bloquear cliques.
- Ele só é montado na **home**: ao trocar de página, o `useEffect` de limpeza do componente cancela a animação e remove os eventos do `window`.
- O `SmokeEffect` é carregado com `React.lazy`, então o código da simulação (≈ 21 kB) só é baixado quando a home abre.
- Com **"reduzir movimento"** ligado no sistema (`prefers-reduced-motion`), o hook `useReducedMotion` não desenha a fumaça.

> O React Bits usa a licença **MIT + Commons Clause** (cópia em `src/components/reactbits/LICENSE-react-bits.md`): pode ser usado em aplicações, inclusive comerciais, mas os componentes não podem ser revendidos ou redistribuídos sozinhos.

## 🖼️ Imagens da home

| Arquivo | Onde aparece |
|---|---|
| `src/assets/images/logo-yugioh.webp` | Menu, hero e abertura |
| `src/assets/images/yugi-corpo-inteiro.webp` | Ilustração à direita do hero |
| `src/assets/images/verso-carta.webp` | Cartas da abertura |
| `src/assets/images/templo-ruinas.webp` | Fundo do hero (recorte das ruínas, desfocado e escurecido) |
| `src/assets/images/anel-do-milenio.webp` | Banner "O cofre do Faraó" |

> ⚠️ Yu-Gi-Oh!, o logo, os personagens e as imagens das cartas são marcas da Konami e de Kazuki Takahashi. Este é um projeto acadêmico, sem fins comerciais e sem ligação com a Konami.

## 🛠️ Services e repository

### `ygoApiService.js`

- `searchCards({ q, type, attribute, archetype, sort, page, language })`: lista paginada; devolve `{ cards, total, totalPages }`.
- `getCardById(id, language)`: uma carta, ou `null` se não existir.
- `getCardsByIds(ids, language)`: várias cartas, na mesma ordem dos ids (em blocos de 50).
- `getArchetypes()`: nomes dos arquétipos em ordem alfabética.
- `sortear(lista, n)`: embaralha (Fisher-Yates) e devolve `n` itens.

### `favoriteService.js`

- `favoritosDisponiveis`: `false` quando o Supabase não está configurado.
- `getFavoriteIds()`: todos os favoritos deste navegador numa **única consulta**.
- `toggle(cardId)`: valida o id e alterna o favorito. Devolve o novo estado (`true` = agora é favorita).

### `favoriteRepository.js`

```js
// select * from list_my_favorite_cards('<uuid>')  -> [{ card_id, created_at }, ...]
await supabase.rpc("list_my_favorite_cards", { p_owner_token: ownerToken });

// select toggle_favorite_card('<uuid>', 46986414)  -> true / false
await supabase.rpc("toggle_favorite_card", { p_owner_token: ownerToken, p_card_id: 46986414 });
```

### Tabela `favorite_cards`

| Coluna | Tipo | Descrição |
|---|---|---|
| `owner_token` | `uuid` | Navegador que favoritou. Parte da chave primária |
| `card_id` | `integer` | Id (passcode) da carta na YGOPRODeck. Parte da chave primária |
| `created_at` | `timestamptz` | Data/hora em que a carta foi favoritada (`default now()`) |

## ⚛️ Conceitos de React utilizados

| Conceito | Onde |
|---|---|
| Componentes funcionais e props | Todos os arquivos de `src/components/` e `src/pages/` |
| `useState` | Pesquisa digitada, sorteio dos destaques, "mostrar todas as coleções" |
| `useEffect` | Favoritos ao abrir, tema, debounce, rolar ao topo ao trocar de página |
| `useMemo` | Destaques sorteados, valor dos Contexts |
| `useCallback` + `memo` | `CardTile` com `memo`: favoritar redesenha só os cards que mudaram |
| `useRef` | Carta inclinável dos detalhes, canvas da fumaça |
| `useId` | Ligação entre `<label>`, `<input>` e `<datalist>` nos filtros |
| Context API | `FavoritosProvider` (favoritos compartilhados por todas as páginas) |
| i18next / react-i18next | `useTranslation`, `t()`, `<Trans>`, plural com `count`, `i18n.changeLanguage` |
| Hooks próprios | `useFavoritos`, `useLanguage`, `useCardLabels`, `useTheme`, `useAsync`, `useDebounce`, `useReducedMotion` |
| `<audio>` + `useRef` | Música de fundo: `play()` com Promise, eventos `onPlay`/`onPause`, fade-in |
| Variáveis CSS por elemento | `style={{ "--offset": ... }}` nas cartas da abertura e `--frame` nos cards |
| `React.lazy` + `Suspense` | Fumaça do React Bits baixada só na home |
| React Router | `HashRouter`, `Routes`, `NavLink`, `useParams`, `useSearchParams`, `useNavigate` |
| Renderização condicional | Estados vazios, avisos do Supabase, erros da API |

## 📂 Estrutura do Projeto

```text
📁 YuGiOhAPI
│
├── 📁 imgs                                └── Capturas de tela do README
├── 📁 public
│   ├── favicon-yugioh.svg                 └── Favicon (Olho do Milênio em ouro)
│   ├── favicon-32.png                     └── Favicon PNG (navegadores sem suporte a SVG)
│   └── apple-touch-icon.png               └── Ícone da tela inicial no iPhone/iPad
│
├── 📁 src
│   ├── 📁 assets/audio
│   │   └── yugioh-theme.mp3               └── Música de fundo (loop)
│   │
│   ├── 📁 assets/images
│   │   ├── logo-yugioh.webp               └── Logo (menu, hero e abertura)
│   │   ├── yugi-corpo-inteiro.webp        └── Ilustração do hero
│   │   ├── verso-carta.webp               └── Verso das cartas da abertura
│   │   ├── templo-ruinas.webp             └── Fundo do hero
│   │   └── anel-do-milenio.webp           └── Banner "O cofre do Faraó"
│   │
│   ├── ⚙️ config
│   │   ├── appConfig.js                   └── URL da API, cartas por página, deck do Yugi, cor da fumaça, chaves do localStorage
│   │   └── supabaseClient.js              └── createClient com a URL e a chave publicável (ignora os valores de exemplo)
│   │
│   ├── 🌍 i18n
│   │   ├── index.js                       └── Configuração do i18next
│   │   ├── useCardLabels.js               └── Nomes traduzidos de tipo, atributo, raça...
│   │   └── locales/pt.json, en.json       └── Todos os textos do site
│   │
│   ├── 🧩 model
│   │   ├── Card.js                        └── Carta pronta para a tela (createCard)
│   │   └── FrameType.js                   └── Cores das molduras e valores aceitos pelos filtros
│   │
│   ├── 🗄️ repository
│   │   └── favoriteRepository.js          └── Chamadas rpc() das duas funções do Supabase
│   │
│   ├── 🔎 services
│   │   ├── ygoApiService.js               └── API da YGOPRODeck + cache em memória
│   │   └── favoriteService.js             └── Regras dos favoritos (validação + owner_token)
│   │
│   ├── 🪝 hooks
│   │   ├── useFavoritos.js                └── Context dos favoritos: status, ids, alternar, tentar de novo
│   │   ├── useLanguage.js                 └── Idioma atual do i18next + locale do Intl
│   │   ├── useTheme.js                    └── Tema claro/escuro
│   │   ├── useAsync.js                    └── Executa uma busca e ignora respostas antigas
│   │   ├── useDebounce.js                 └── Espera o usuário parar de digitar
│   │   └── useReducedMotion.js            └── Respeita o "reduzir movimento" do sistema
│   │
│   ├── 🧰 utils
│   │   ├── storage.js                     └── localStorage com try/catch e o owner_token
│   │   └── format.js                      └── Passcode, números e preços (US$/€) no locale do idioma, ATK/DEF "?"
│   │
│   ├── 🎨 components
│   │   ├── reactbits/SplashCursor/        └── Fumaça do React Bits (+ LICENSE-react-bits.md)
│   │   ├── BackgroundMusic/               └── Música de fundo + botão de ligar/desligar
│   │   ├── IntroSplash/                   └── Abertura com cartas (uma vez por sessão)
│   │   ├── SmokeEffect/                   └── SplashCursor com as cores do projeto (só na home)
│   │   ├── Header/                        └── Logo, menu, status do Supabase, idioma e tema
│   │   ├── SupabaseNotice/                └── Avisos "não configurado" e "conexão falhou"
│   │   ├── FavoriteButton/                └── Estrela (desabilitada sem Supabase)
│   │   ├── FilterBar/                     └── Pesquisa, tipo, atributo, arquétipo e ordenação
│   │   ├── CardGrid/                      └── Grade de cartas (com "cartas viradas" carregando)
│   │   ├── CardTile/                      └── Uma carta na grade
│   │   ├── CardImage/                     └── <img> com imagem reserva
│   │   ├── Pagination/                    └── Anterior / Próxima
│   │   ├── EmptyState/                    └── Telas vazias com o próximo passo
│   │   ├── Footer/                        └── Créditos (YGOPRODeck, Supabase, React Bits)
│   │   └── Icon/                          └── Ícones SVG desenhados à mão
│   │
│   ├── 📄 pages
│   │   ├── HomePage.jsx                   └── Abertura, hero, deck do Yugi, tipos, banner e fumaça
│   │   ├── CardsPage.jsx                  └── Lista com filtros na URL e paginação
│   │   ├── CardPage.jsx                   └── Detalhes, preços e coleções
│   │   ├── FavoritesPage.jsx              └── Favoritas do Supabase
│   │   └── NotFoundPage.jsx               └── Endereço inexistente
│   │
│   ├── App.jsx                            └── Provider dos favoritos + HashRouter + rotas + música
│   ├── index.css                          └── Tokens de cor (Tumba/Papiro), fontes, botões, friso e cartucho
│   └── main.jsx
│
├── 🗃️ supabase_favorites.sql              └── Tabela + RLS + funções (rode no SQL Editor)
├── 📄 .env.example                        └── Modelo do .env.local
├── 📄 index.html                          └── Fontes (Google Fonts) + script do tema (sem "piscar")
├── 📄 vite.config.js                      └── base "./" (funciona na Vercel e no GitHub Pages)
└── 📄 package.json
```

Rotas (`HashRouter`):

| Rota | Página |
|---|---|
| `#/` | Home |
| `#/cartas` | Lista (aceita `?q=`, `type=`, `attribute=`, `archetype=`, `sort=`, `page=`) |
| `#/cartas/:id` | Detalhes da carta (ex.: `#/cartas/46986414`) |
| `#/favoritos` | Favoritas |

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

> 💡 Como as rotas usam `HashRouter` (`#/cartas`) e o `vite.config.js` usa `base: "./"`, não precisa de `vercel.json`, e a pasta `dist/` também funciona no **GitHub Pages**, numa subpasta como `https://seu-usuario.github.io/yugioh/`.

## 🧯 Problemas comuns

| Sintoma / erro | Causa provável | Solução |
|---|---|---|
| "Favoritos desativados: o Supabase não está configurado" | `.env.local` ausente ou servidor não reiniciado | Criar o `.env.local` (passo 4) e reiniciar o `npm run dev` |
| "A conexão com o Supabase falhou" + `Invalid API key` | Chave copiada errada ou de outro projeto | Copiar de novo em **Project Settings → API Keys** |
| "A conexão com o Supabase falhou" + `Could not find the function public.list_my_favorite_cards` | Script não executado ou cache da Data API desatualizado | Rodar o `supabase_favorites.sql` inteiro (ele termina com `notify pgrst, 'reload schema'`) |
| "A conexão com o Supabase falhou" + `Failed to fetch` | Projeto pausado (plano free), URL errada ou sem internet | **Restore project** no dashboard / conferir `VITE_SUPABASE_URL` |
| "Muitas requisições seguidas" | Limite da YGOPRODeck (~20/s) | Esperar alguns segundos e clicar em **Tentar de novo** |
| Pesquisa não encontra uma carta conhecida | Em português, a pesquisa usa o nome traduzido | Trocar para **English** no topo |
| Favoritas somem em outro navegador | Os favoritos são por navegador (`owner_token`) | Comportamento esperado; veja **Segurança** |
| Fumaça ou abertura não aparecem na home | "Reduzir movimento" ligado no sistema, ou WebGL desativado no navegador | Comportamento esperado / ativar a aceleração por hardware |
| A abertura não aparece de novo | Ela só aparece uma vez por sessão | Fechar a aba ou abrir uma aba anônima |
| A música não começa sozinha | O navegador bloqueia autoplay com som | Clicar em qualquer lugar da página (comportamento esperado) |
| A música não toca nem com clique | Ela foi silenciada antes (a escolha fica salva) | Clicar no botão redondo do canto inferior esquerdo |
| A aba mostra o favicon de outro projeto | O navegador guarda o favicon por endereço (`localhost:5173`) | Recarregar com `Ctrl+Shift+R` (`Cmd+Shift+R` no Mac). O projeto usa o nome `favicon-yugioh.svg` (e não `favicon.svg`) para evitar isso |
| Algum texto ficou com a chave aparecendo (ex.: `home.title`) | A chave não existe no JSON do idioma | Adicionar a chave em `pt.json` **e** `en.json` |

## 📦 Dependências

```json
"dependencies": {
  "@supabase/supabase-js": "^2.119.0",
  "i18next": "^27.1.1",
  "react": "^19.3.1",
  "react-dom": "^19.3.1",
  "react-i18next": "^18.0.1",
  "react-router-dom": "^7.18.5"
},
"devDependencies": {
  "@types/react": "^19.3.0",
  "@types/react-dom": "^19.3.0",
  "@vitejs/plugin-react": "^6.3.0",
  "oxlint": "^1.93.0",
  "vite": "^8.3.7"
}
```

- [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction): cliente oficial do Supabase.
- [`react`](https://react.dev/) e [`react-dom`](https://react.dev/): a interface.
- [`react-router-dom`](https://reactrouter.com/): rotas com `HashRouter`.
- [`i18next`](https://www.i18next.com/) e [`react-i18next`](https://react.i18next.com/): tradução do site (pt/en).
- [React Bits](https://reactbits.dev/): o `SplashCursor` é copiado para o projeto (sem pacote npm).
- Fontes: Federant, Alegreya Sans, Barlow Condensed e Noto Sans Egyptian Hieroglyphs, pelo Google Fonts (veja **Fontes**).

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente (`http://localhost:4173`) |
| `npm run lint` | Lint com o oxlint |

## 🔗 Urls do projeto

https://yugioh-api.vercel.app/ (online)

http://localhost:5173/

http://localhost:4173/ (depois de `npm run build` + `npm run preview`)

## 📚 Documentação e Links Úteis

**YGOPRODeck**

- [API Guide](https://ygoprodeck.com/api-guide/)
- [Exemplo: Dark Magician](https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician)
- [Exemplo: Dark Magician em português](https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician&language=pt)
- [Arquétipos](https://db.ygoprodeck.com/api/v7/archetypes.php)

**React Bits**

- [React Bits](https://reactbits.dev/)
- [Splash Cursor](https://reactbits.dev/animations/splash-cursor)
- [Repositório no GitHub](https://github.com/DavidHDev/react-bits)

**Supabase**

- [Supabase: Dashboard](https://supabase.com/dashboard)
- [supabase-js: Referência](https://supabase.com/docs/reference/javascript/introduction)
- [supabase-js: rpc()](https://supabase.com/docs/reference/javascript/rpc)
- [Supabase: API Keys (publishable e secret)](https://supabase.com/docs/guides/api/api-keys)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions)

**i18next**

- [i18next: Documentação](https://www.i18next.com/)
- [react-i18next: useTranslation](https://react.i18next.com/latest/usetranslation-hook)
- [react-i18next: Trans](https://react.i18next.com/latest/trans-component)
- [i18next: Plural](https://www.i18next.com/translation-function/plurals)

**React, Vite e deploy**

- [Documentação do React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Documentação do Vite](https://vite.dev/)
- [Variáveis de ambiente no Vite](https://vite.dev/guide/env-and-mode)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)

## 📄 Licença
Este projeto está licenciado sob a MIT License. O componente `SplashCursor` segue a licença do React Bits (MIT + Commons Clause).
