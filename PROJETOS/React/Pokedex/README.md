# Projeto Pokédex (React + Vite + Supabase) 🐾

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aramuni-pokedex.vercel.app/)

👉 **[aramuni-podekex.vercel.app](https://aramuni-pokedex.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

A **Pokédex** é uma aplicação web feita com **React** e **Vite** para exibir, pesquisar e explorar os 151 Pokémon da primeira geração. Ela resolve a [Atividade 03 - Pokédex com React + Vite](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003.md).

Todos os dados (Pokémon, atributos, tipos e treinadores) vêm do arquivo **`src/data/pokedex-data.json`**, fornecido na atividade. As imagens dos Pokémon são carregadas do repositório público da **[PokéAPI](https://pokeapi.co/)**, as imagens dos **treinadores** vêm do **[Pokémon Showdown](https://play.pokemonshowdown.com/)**, e os **favoritos** ficam **persistidos no PostgreSQL do [Supabase](https://supabase.com/)**, na tabela `favorites`.

Não existe back-end: o navegador lê o JSON (empacotado no build pelo Vite) e fala com o Supabase direto pelo SDK **`@supabase/supabase-js`**, que usa a **Data API** (HTTPS) com a chave **publicável**, protegida por **RLS** e por **funções SQL**.

A interface roda dentro de um **aparelho desenhado só com CSS**: carcaça de plástico **vermelho Pokédex**, sensor de vidro, LED de sincronização, botões físicos, tela com reflexo, alto-falante e parafusos. Nenhuma imagem é usada para o aparelho. Antes dele, a página abre com uma **capa**: a Pokédex fechada, que abre a tampa com um clique.

O aparelho tem **dois temas**, trocados pelo botão **Tema**: o **Clássico** (o aparelho em CSS descrito acima) e o **Holo**, que usa uma ilustração da Pokédex (moldura vermelha + tela azul holográfica com uma Pokébola ao fundo) e deixa os cards transparentes por cima da arte. Os dois temas têm luz do dia e **modo noturno**.

## ✨ Funcionalidades

- **Pokédex**: os 151 Pokémon do `pokedex-data.json`, cada card com **número**, **nome**, **tipos** e os seis atributos (**HP**, **Ataque**, **Defesa**, **Ataque Especial**, **Defesa Especial** e **Velocidade**) em barras.
- **Pesquisa por nome ou ID**: a lista atualiza a cada tecla. `Bulba`, `BULBA`, `25`, `#025` e `025` funcionam. Acentos e pontuação são ignorados (`mr mime` encontra o `Mr. Mime`, `farfetchd` encontra o `Farfetch'd`). `Esc` limpa o campo.
- **Filtro por tipo**: um botão por tipo presente no JSON, com o nome em pt-BR, a cor do tipo e a quantidade. Clicar de novo no tipo tira o filtro.
- **Detalhes do Pokémon**: arte grande, número, nome, tipos, atributos com barras animadas, **total** e os **treinadores** que têm aquele Pokémon. Botões **Anterior/Próximo** seguem a ordem da lista na tela.
- **Ponto forte**: nos detalhes, o melhor atributo do Pokémon e a posição dele entre os 151 (ex.: "Velocidade 90: 32º maior valor entre os 151 Pokémon").
- **Outros do mesmo tipo**: nos detalhes, até 8 Pokémon do mesmo tipo principal, que abrem com um clique, e o botão "Ver os N do tipo X na Pokédex", que fecha os detalhes e aplica o filtro.
- 🖥️ **Detalhes sem rolagem**: o aparelho usa a largura da tela (até 1760 px) e os detalhes ficam lado a lado: **arte | Pokédex clássica | atributos | treinadores e outros do tipo**. Em notebooks e desktops (testado de 1280 x 650 a 1920 x 1080, inclusive com o Dock do macOS ocupando altura) tudo cabe sem rolagem vertical. O layout usa *container queries* de **largura e altura** (`container: details / size`): em janelas baixas, a carcaça fica mais fina, as barras de atributos ficam mais compactas e "Outros do tipo" mostra menos Pokémon (o botão "Ver os N do tipo" leva aos demais). A página não rola nem faz o efeito "elástico" do trackpad (`overscroll-behavior: none`), e a área dos detalhes só liga a rolagem quando o conteúdo realmente não cabe (o `PokemonDetails` mede com um `ResizeObserver`), como no celular.
- 📟 **Pokédex clássica**: nos detalhes, à direita da arte do Pokémon, a Pokédex clássica aparece com o sprite do Pokémon escolhido na telinha dela, com luz de fundo na cor do tipo e linhas de varredura. No painel direito, o visor preto mostra o número e o nome em estilo LCD, e os dois retângulos de baixo mostram os tipos. Ao trocar de Pokémon, as telas "piscam" e mostram o novo.
- 📕 **Capa: Pokédex fechada e aberta**: ao carregar a página, aparece a Pokédex fechada (`pokedex-fechada.webp`). Um clique (ou `Enter`) gira a tampa na dobradiça, a lente e o LED acendem, a tela mostra "INICIANDO..." (`pokedex-aberta.webp`) e o aparelho liga.
- 🧢 **Treinadores com imagem**: os 12 treinadores do JSON, com **imagem (sprite do Pokémon Showdown)**, **insígnias** e **time**. Cada Pokémon do time abre os detalhes, e cada treinador nos detalhes (com a imagem dele no botão) leva até o card dele. Se a imagem não carregar, aparecem as iniciais.
- ⭐ **Favoritos no Supabase**: a estrela grava ou apaga o favorito no banco. A aba **Favoritos** mostra só os marcados, com a mesma pesquisa, filtro e ordenação. Cada navegador tem os próprios favoritos.
- 📊 **Ordenação**: por número, nome, qualquer um dos seis atributos ou pelo total, crescente ou decrescente.
- 🔌 **Fechar**: o botão **Fechar** do aparelho volta para a capa (Pokédex fechada) sem perder a aba, os filtros nem o Pokémon aberto. Ao abrir de novo, a tela faz a animação de "ligar".
- 🎲 **Pokémon aleatório**: o botão **Sortear** do aparelho abre um Pokémon ao acaso (o sensor faz uma varredura; no tema Holo, a lente azul).
- 🌙 **Modo noturno**: o botão **Noturno** troca a luz da tela. Segue o tema do sistema na primeira visita e salva a escolha. O tema é aplicado antes do React carregar, então a página não "pisca".
- 🎨 **Dois temas (Clássico e Holo)**: o botão **Tema** troca o visual do aparelho e salva a escolha (`pokedex:skin`). No **Holo**, a ilustração `holo-fundo.webp` vira o aparelho: os cards de Pokémon e de treinador ficam **transparentes**, deixando a Pokébola e as demais artes da tela à mostra, o LED de sincronização fica em cima do LED verde da imagem e a **lente azul** do canto superior esquerdo faz a mesma varredura do sensor do Clássico (com um brilho) a cada Pokémon sorteado. O modo noturno funciona nos dois temas; no Holo ele escurece a tela sem esconder a arte. Detalhes na seção [Temas](#-temas-clássico-e-holo).
- 💡 **LED de sincronização**: verde quando os favoritos estão salvos, âmbar piscando enquanto o Supabase responde, vermelho em caso de erro e apagado quando o Supabase não está configurado. A barra de status da tela mostra a mesma informação em texto.
- 📱 **Responsivo**: desktop, tablet e celular. No celular, o aparelho ocupa a tela toda, os botões viram só ícones e os tipos viram uma faixa com rolagem lateral.
- ⌨️ **Teclado e leitores de tela**: abas com setas, `Esc` fecha os detalhes, setas esquerda/direita navegam entre Pokémon e o foco volta para o card que abriu os detalhes.
- **Estados vazios**: "Nenhum Pokémon encontrado", "Você ainda não tem favoritos" e "Favoritos desativados", sempre com o próximo passo.
- **Funciona sem Supabase e sem internet para imagens**: sem o `.env.local` (ou com os valores de exemplo do `.env.example`), a Pokédex funciona e as estrelas ficam desativadas. Se uma imagem da PokéAPI não carregar, aparece a imagem local `sem-imagem.svg`.

## 🖼️ Capturas de Tela

| Home | Home - Tema escuro |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Home.png) | ![HomeDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HomeDark.png) |

| Detalhes | Detalhes - Tema escuro |
| :---: | :---: |
| ![Detalhes](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Detalhes.png) | ![DetalhesDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/DetalhesDark.png) |

| Pokédex clássica | Pokédex clássica - Tema escuro |
| :---: | :---: |
| ![PokedexClassica](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/PokedexClassica.png) | ![PokedexClassicaDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/PokedexClassicaDark.png) |

| Pesquisa ("Bulba") | Filtro por tipo (Fogo) |
| :---: | :---: |
| ![Pesquisa](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Pesquisa.png) | ![FiltroTipo](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/FiltroTipo.png) |

| Ordenação (Ataque) | Nenhum Pokémon encontrado |
| :---: | :---: |
| ![Ordenacao](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Ordenacao.png) | ![NenhumEncontrado](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/NenhumEncontrado.png) |

| Favoritos | Treinadores |
| :---: | :---: |
| ![Favoritos](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Favoritos.png) | ![Treinadores](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Treinadores.png) |

| Favoritos desativados (sem Supabase) |
| :---: |
| ![FavoritosDesativados](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/FavoritosDesativados.png) |

| Celular | Celular - Tema escuro |
| :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/Mobile.png) | ![MobileDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/MobileDark.png) |

| Capa (Pokédex fechada) | Capa (Pokédex aberta) |
| :---: | :---: |
| ![PokedexFechada](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/PokedexFechada.png) | ![PokedexAberta](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/PokedexAberta.png) |

| Celular - Detalhes | Celular - Pokédex clássica |
| :---: | :---: |
| ![MobileDetalhes](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/MobileDetalhes.png) | ![MobileClassica](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/MobileClassica.png) |

### Tema Holo

| Home - Holo | Home - Holo, tema escuro |
| :---: | :---: |
| ![HoloHome](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloHome.png) | ![HoloHomeDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloHomeDark.png) |

| Detalhes - Holo | Detalhes - Holo, tema escuro |
| :---: | :---: |
| ![HoloDetalhes](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloDetalhes.png) | ![HoloDetalhesDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloDetalhesDark.png) |

| Favoritos - Holo | Sortear - Holo (lente azul acesa) |
| :---: | :---: |
| ![HoloFavoritos](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloFavoritos.png) | ![HoloSortear](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloSortear.png) |

| Celular - Holo | Celular - Holo, tema escuro | Celular - Holo, detalhes |
| :---: | :---: | :---: |
| ![HoloMobile](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloMobile.png) | ![HoloMobileDark](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloMobileDark.png) | ![HoloMobileDetalhes](https://joaopauloaramuni.github.io/react-imgs/Pokedex/imgs/HoloMobileDetalhes.png) |

## 🚀 Como rodar

Pré-requisito: **Node.js 20.19+** (ou 22.12+), exigido pelo Vite 8.

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase (opcional)
npm run dev
```

Acesse **`http://localhost:5173`** no navegador.

A Pokédex funciona sem o `.env.local`. Ele só é necessário para os **favoritos**: antes de favoritar, crie a tabela e as funções no Supabase (passo 2 abaixo).

## 🗄️ Configuração do Supabase (passo a passo)

### 1. Criar a conta e o projeto

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta (dá para entrar com o GitHub).
2. No dashboard, clique em **New project**.
3. Preencha:
   - **Name**: por exemplo, `pokedex`.
   - **Database Password**: crie uma senha e guarde-a. Neste projeto ela **não** vai para o `.env` (o React não conecta com usuário e senha do banco).
   - **Region**: escolha a mais próxima. No Brasil, **South America (São Paulo)** (`sa-east-1`). ⚠️ A região não pode ser alterada depois.
4. Clique em **Create new project** e aguarde o banco ficar pronto.

### 2. Criar a tabela, o RLS e as funções (obrigatório)

Não existe servidor para criar a tabela, então abra o **SQL Editor** no Supabase, cole o conteúdo de **`supabase_favorites.sql`** e clique em **Run**. O script pode ser executado de novo sem problema.

Ele cria:

| Objeto | O que faz |
|---|---|
| Tabela `favorites` | `owner_token`, `pokemon_id`, `created_at`, com chave primária `(owner_token, pokemon_id)` |
| `check` no `pokemon_id` | Só IDs de **1 a 151** |
| RLS ligado + `revoke all` | O visitante **não** lê, insere, altera nem apaga a tabela direto |
| Função `list_my_favorites` | Devolve os favoritos de **um** `owner_token` |
| Função `toggle_favorite` | Se já é favorito, apaga e devolve `false`; senão, insere e devolve `true` |
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

1. Acesse `http://localhost:5173`. O LED do aparelho deve ficar **verde** e a barra de status deve mostrar "Favoritos salvos no Supabase".
2. Clique na estrela (☆) de algum Pokémon. O LED pisca em âmbar e a estrela fica preenchida (★).
3. No Supabase, abra o **Table Editor** e selecione a tabela `favorites`: o `pokemon_id` deve aparecer lá, com o `owner_token` do seu navegador.
4. Recarregue a página: o Pokémon continua marcado e aparece na aba **Favoritos**.

> 💤 No plano gratuito, projetos sem atividade por cerca de uma semana são **pausados**. Se os favoritos pararem de carregar (LED vermelho), entre no dashboard e clique em **Restore project**.

## 🔐 Segurança: por que a chave pode ficar no navegador?

A **publishable key** foi feita para ser pública. Ela só identifica o projeto; o que cada visitante pode fazer é decidido pelo **banco**. Como ela fica no navegador, qualquer pessoa pode chamar a Data API com o papel `anon`. Por isso o `supabase_favorites.sql` fecha a tabela e libera só as duas funções:

| O visitante tenta... | Resultado | Por quê |
|---|---|---|
| Listar todos os favoritos (`select * from favorites`) | ❌ `permission denied` | `revoke all` na tabela para o `anon` |
| Inserir direto na tabela (`insert`) | ❌ `permission denied` | Idem |
| Apagar os favoritos dos outros (`delete`) | ❌ `permission denied` | Idem: só pela `toggle_favorite`, com o próprio `owner_token` |
| Favoritar o Pokémon `999` | ❌ `check constraint` | Só IDs de 1 a 151 |
| Ver os próprios favoritos | ✅ | Função `list_my_favorites` com o seu `owner_token` |
| Favoritar / desfavoritar | ✅ | Função `toggle_favorite` com o seu `owner_token` |

As duas funções são `security definer`: rodam com a permissão de quem as criou e só tocam nas linhas do `owner_token` recebido. O `set search_path = public` impede que alguém troque as tabelas usadas por elas.

### O `owner_token`

Não há login. Na primeira visita, o navegador gera um **UUID aleatório** (`crypto.randomUUID()`) e guarda no `localStorage` (`pokedex:owner-token`). Ele vai junto em cada chamada e é a "chave" dos favoritos.

- Outro navegador (ou outro celular) tem **outro** `owner_token`, então tem outros favoritos.
- Se você limpar os dados do site, um novo token é gerado e a aba Favoritos começa vazia. As linhas antigas continuam no banco.
- Um UUID tem 122 bits aleatórios: não dá para adivinhar o token de outra pessoa.

> 🎓 **Próximo passo natural:** favoritos **por usuário**. Com o **Supabase Auth**, o `owner_token` vira `user_id uuid default auth.uid()`, as funções passam a usar `auth.uid()` no lugar do parâmetro e os favoritos acompanham a pessoa em qualquer aparelho.

## ⚙️ Como funciona

```text
                    ┌── import ────────▶ src/data/pokedex-data.json      (empacotado no build)
                    │
Navegador (React) ──┼── <img src> ─────▶ raw.githubusercontent.com/PokeAPI/sprites    (Pokémon)
                    │
                    ├── <img src> ─────▶ play.pokemonshowdown.com/sprites/trainers (treinadores)
                    │
                    └── supabase-js ───▶ <project-ref>.supabase.co/rest/v1/rpc/list_my_favorites
                         chave publicável                            /rpc/toggle_favorite
```

1. Ao carregar, o `pokedexService.js` transforma o JSON em objetos prontos para a tela (`createPokemon`, `createTrainer`): número formatado (`#025`), soma dos atributos, nome normalizado para a pesquisa e URLs das imagens. Isso acontece **uma vez só**.
2. Ao mesmo tempo, o hook `useFavoritos` busca **todos** os favoritos deste navegador numa única chamada (`list_my_favorites`).
3. A lista exibida é um **estado derivado**: o hook `usePokedexFilters` guarda só a pesquisa, o tipo e a ordem, e recalcula a lista com `useMemo` (`filterPokemon` + `sortPokemon`) sempre que um deles muda.
4. A estrela chama `toggle_favorite(owner_token, pokemon_id)`. O banco faz o "apaga ou insere" numa função só e devolve o novo estado. Enquanto o Supabase responde, a estrela fica desativada e o LED pisca.
5. Clicar num card abre os detalhes com a **ordem da lista na tela**: Anterior/Próximo seguem a pesquisa, o filtro e a ordenação atuais (ou o time do treinador, quando aberto pela aba Treinadores).

## 🧬 Dados da aplicação

Os dados ficam em **`src/data/pokedex-data.json`**, o mesmo arquivo da atividade, sem alterações:

| Chave | Conteúdo |
|---|---|
| `types` | 18 tipos (`id`, `name`), de `Typeless` a `Steel` |
| `pokemon` | 151 Pokémon com `id`, `name`, `stats` (`hp`, `attack`, `defense`, `specialAttack`, `specialDefense`, `speed`) e `types` |
| `trainers` | 12 treinadores com `id`, `name`, `badges` e `pokemonIds` |

Particularidades do arquivo que a aplicação trata:

- O **Mew (#151)** vem com `types: []`. Ele recebe o tipo `Typeless` ("Sem tipo"), que também aparece no filtro.
- Os tipos `Dark` e `Typeless` existem em `types`, mas só os tipos usados por algum Pokémon aparecem no filtro (`Dark` não aparece; `Typeless` aparece por causa do Mew).
- Alguns times repetem Pokémon (o **Koga** tem três Venonat e o **Lance** tem dois Dragonite). A ordem e as repetições são mantidas, e a chave de cada item da lista usa a posição.
- O maior atributo do arquivo é **250** (HP do Chansey). As barras usam a escala de **255**, o maior valor possível de um atributo base.

## 🖼️ Imagens dos Pokémon (PokéAPI)

As imagens vêm do repositório público **[PokeAPI/sprites](https://github.com/PokeAPI/sprites)**, o mesmo que a [PokéAPI](https://pokeapi.co/) usa nas respostas. As URLs são montadas pelo ID, sem chamar a API (uma requisição por Pokémon seria desnecessária):

| Onde | URL | Campo equivalente na PokéAPI |
|---|---|---|
| Cards e times (pixel art) | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` | `sprites.front_default` |
| Detalhes (arte grande) | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` | `sprites.other["official-artwork"].front_default` |

- As imagens dos cards usam `loading="lazy"`: só baixam quando aparecem na tela.
- Os sprites usam `image-rendering: pixelated`, para a pixel art não ficar borrada.
- A **Pokédex clássica** é a imagem local `src/assets/images/pokedex-classica.webp` (684 x 523 px). O componente `ClassicPokedex` coloca o sprite por cima da tela dela e escreve no painel direito. As posições foram medidas na imagem e convertidas em porcentagem no CSS:

  | Área | Posição na imagem (px) | O que mostra |
  |---|---|---|
  | Tela (esquerda) | x 105-269, y 202-318 | Sprite do Pokémon |
  | Visor preto (direita) | x 406-615, y 169-228 | Número e nome |
  | Retângulos de baixo (direita) | x 405-493 e 520-619, y 407-438 | Tipo 1 e tipo 2 (`---` quando não há) |

  As fontes do visor usam `cqw` (*container query units*), então o texto cresce e diminui junto com a imagem.
- Se uma imagem falhar, o componente `PokemonImage` mostra `src/assets/images/sem-imagem.svg`. A Pokédex continua funcionando só com o JSON, como pede a atividade.

## 🧢 Imagens dos treinadores (Pokémon Showdown)

A PokéAPI não tem imagens de treinadores. Elas vêm do **[Pokémon Showdown](https://play.pokemonshowdown.com/)**, que publica os sprites (80 x 80 px) em:

```text
https://play.pokemonshowdown.com/sprites/trainers/{nome}.png
```

O `pokedex-data.json` só traz o nome do treinador, então o `appConfig.js` tem o mapa **`TRAINER_SPRITES`**: nome no JSON → arquivos do Showdown, em ordem de preferência.

| Treinador (JSON) | Arquivos tentados |
|---|---|
| Ash | `ash`, `ash-capbackward`, `red` |
| Brock, Misty, Lt. Surge, Erika, Koga, Sabrina, Blaine, Giovanni, Lance | `{nome}`, `{nome}-gen3`, `{nome}-gen1` (Lt. Surge = `ltsurge`) |
| Gary | `blue`, `blue-gen3`, `blue-gen1` (o Gary é o "Blue" dos jogos) |
| Team Rocket | `teamrocket`, `rocketgrunt`, `rocketgrunt-gen3` |

- O componente **`TrainerAvatar`** tenta cada URL em ordem; se nenhuma carregar, mostra as **iniciais** do treinador.
- Para trocar a imagem de um treinador, procure o arquivo na [lista de sprites do Showdown](https://play.pokemonshowdown.com/sprites/trainers/) e coloque o nome (sem `.png`) no começo da lista dele em `TRAINER_SPRITES`.

## 🎨 Temas: Clássico e Holo

O tema fica no atributo `data-skin` do `<html>` (`classico` ou `holo`), ao lado do `data-theme` (`light` ou `dark`) do modo noturno. Os dois são independentes, então existem quatro combinações. O script do `index.html` aplica os dois antes do React carregar, e os hooks `useTheme` e `useSkin` alternam e salvam no `localStorage` (`pokedex:theme` e `pokedex:skin`).

| | Clássico | Holo |
|---|---|---|
| Aparelho | Desenhado só com CSS | Imagem `holo-fundo.webp` (1672 x 941 px) |
| Tela | Clara (dia) ou verde-escura (noturno) | A arte azul da imagem; no noturno, escurecida por uma camada translúcida |
| Cards | Fundo sólido | **Transparentes** (`--card-bg: transparent`): a Pokébola e as artes aparecem por trás |
| Sensor do canto superior esquerdo | Visor com varredura | **Lente azul** com a mesma varredura + brilho |
| Cores | `:root` e `[data-theme="dark"]` no `index.css` | `[data-skin="holo"]` e `[data-skin="holo"][data-theme="dark"]` no `index.css` |

### Como a imagem vira o aparelho (telas largas)

Em janelas com pelo menos **1000 px** de largura e mais largas que **4:3**, a imagem inteira é o aparelho, **sem distorcer**: ele ocupa a maior largura que cabe na janela mantendo a proporção da imagem. Tudo é posicionado em "pixels da imagem" com a variável `--u` (1 px da imagem original na tela):

```css
--u: calc(min(1760px, 100vw - 2 * var(--desk-pad), (100dvh - 2 * var(--desk-pad)) * 1672 / 941) / 1672);
left: calc(82 * var(--u)); /* = x 82 da imagem */
```

As posições foram medidas na imagem original:

| Área | Posição na imagem (px) | O que fica ali |
|---|---|---|
| Lente azul | centro 84, 77 (raio 38) | Varredura e brilho ao sortear |
| LED verde | centro 358, 34 | LED de sincronização do Supabase |
| Barra de cima, à esquerda | x 410-710, y 9-57 | Botões **Noturno** e **Tema** |
| Barra de cima, à direita | x 960-1438, y 9-57 | Botões **Fechar** e **Sortear** |
| Tela azul | x 82-1598, y 88-840 | Conteúdo, recortado nos cantos chanfrados com `clip-path` |
| Barra de baixo, à esquerda | x 96, y 874-928 | Nome "Pokédex" |

O conteúdo da tela se afasta dos chanfros: as abas e o "Voltar" dos detalhes começam depois do canto cortado de cima, e a barra de status depois do canto de baixo. Com os detalhes abertos, a lista de baixo fica oculta (a tela é transparente e ela apareceria por trás). O texto da tela é claro nos dois modos e tem uma sombra leve, para continuar legível sobre as linhas da arte.

### Celular, tablet em pé e janelas estreitas

Uma imagem 16:9 ficaria pequena demais numa tela em pé. Nesses casos o aparelho volta ao layout do Clássico (que já é responsivo), com as cores da moldura da ilustração (vermelho com contorno escuro, borda azul na tela, empunhaduras cinza), a lente azul no lugar do sensor e, na tela, só o miolo da arte (`holo-tela.webp`, um recorte de 1280 x 624 px centralizado na Pokébola) com `background-size: cover`.

### Arquivos

| Arquivo | O que faz |
|---|---|
| `src/assets/images/holo-fundo.webp` | A ilustração inteira (aparelho do Holo em telas largas) |
| `src/assets/images/holo-tela.webp` | Só a tela azul, centralizada na Pokébola (celular e telas em pé) |
| `src/hooks/useSkin.js` | Tema atual, troca e gravação no `localStorage` |
| `src/utils/aparencia.js` | Aplica `data-theme`, `data-skin` e o `color-scheme` (sempre escuro no Holo, para o `<select>` combinar com a tela) |
| `src/components/DeviceShell/DeviceShellHolo.css` | Aparelho do Holo: imagem, lente, LED, botões, recorte da tela e o layout para celular |
| `SKINS` em `src/config/appConfig.js` | Lista dos temas (`id` e nome exibido) |

Para trocar a ilustração, mantenha 1672 x 941 px (ou a mesma proporção) e, se os elementos mudarem de lugar, ajuste as medidas acima no `DeviceShellHolo.css`.

## 📕 Capa: Pokédex fechada e aberta

O componente **`PokedexCover`** usa duas imagens locais do mesmo tamanho (originais de 1638 x 2058 px, salvas em `.webp`):

| Imagem | Quando aparece |
|---|---|
| `src/assets/images/pokedex-fechada.webp` | Ao carregar a página e depois do botão **Fechar** |
| `src/assets/images/pokedex-aberta.webp` | Embaixo da tampa: aparece quando ela gira, com "INICIANDO..." |

A **tampa** é a própria imagem fechada recortada com `clip-path` no retângulo da tampa e girada (`rotateY`) na dobradiça da direita. As posições foram medidas nas imagens e estão em porcentagem no CSS:

| Área | Posição na imagem original (px) |
|---|---|
| Tampa | x 204-1398, y 492-1770 (dobradiça em x 1398) |
| Lente azul (brilho ao ligar) | centro 336, 264 |
| LED verde (pisca ao ligar) | centro 747, 201 |
| Tela verde (varredura ao ligar) | x 336-1266, y 618-1140 |

Fases: `fechada` → `abrindo` (tampa gira) → `iniciando` (luzes e "INICIANDO...") → aparelho ligado. O botão **Fechar** faz `fechando` → `fechada`. O aparelho continua montado por baixo da capa (com `inert`), então nada se perde. Com **movimento reduzido** no sistema, as animações ficam quase instantâneas.

## 🔖 Favicon

O favicon foi gerado a partir da imagem enviada (1200 x 1200 px) e fica em `public/`: `favicon.ico` (16, 32, 48 e 64 px), `favicon-32.png`, `favicon-192.png` e `apple-touch-icon.png` (180 px). O `index.html` aponta para os quatro e define `theme-color` com o vermelho da carcaça.

> ⚠️ Pokémon, a Pokédex, os treinadores, o favicon e suas imagens são marcas da Nintendo, Game Freak e The Pokémon Company. Os sprites dos treinadores são do Pokémon Showdown. Este é um projeto acadêmico, sem fins comerciais.

## 🛠️ Services e repository

### `pokedexService.js`

- `getAllPokemon()`: os 151 Pokémon, ordenados por número.
- `getPokemonById(id)`: um Pokémon pelo ID (busca num `Map`).
- `getTrainers()` e `getTrainersOf(pokemonId)`: todos os treinadores e os que têm um Pokémon.
- `getAvailableTypes()`: tipos do filtro (só os usados), na ordem do JSON.
- `countByType(lista)`: quantos Pokémon da lista têm cada tipo.
- `filterPokemon(lista, { busca, tipo })`: pesquisa por nome (contém, sem acento e pontuação) ou por ID (exato), e filtro por tipo.
- `sortPokemon(lista, { campo, direcao })`: ordena sem alterar a lista original; empates desempatam pelo número.
- `getStatRank(pokemon, campo)`: posição de um atributo entre os 151 (1 = o maior; empates dividem a posição).
- `getBestStat(pokemon)`: o melhor atributo do Pokémon e a posição dele (o "Ponto forte" dos detalhes).
- `getSameTypePokemon(pokemon)`: outros Pokémon com o mesmo tipo principal.
- `SORT_OPTIONS`: as opções de ordenação, cada uma com a direção padrão (atributos começam do maior).

### `favoriteService.js`

- `getFavoriteIds()`: todos os favoritos deste navegador numa **única consulta**, como `Set` de IDs.
- `toggle(pokemonId)`: valida o ID (1 a 151) e alterna o favorito. Devolve o novo estado (`true` = agora é favorito).

### `favoriteRepository.js`

```js
// select * from list_my_favorites('<uuid>')  -> [{ pokemon_id, created_at }, ...]
await supabase.rpc("list_my_favorites", { p_owner_token: ownerToken });

// select toggle_favorite('<uuid>', 25)  -> true / false
await supabase.rpc("toggle_favorite", { p_owner_token: ownerToken, p_pokemon_id: 25 });
```

Cada função confere o `error` devolvido pelo Supabase e lança uma exceção com a mensagem, para o hook `useFavoritos` exibir na barra de status.

### Tabela `favorites`

| Coluna | Tipo | Descrição |
|---|---|---|
| `owner_token` | `uuid` | Navegador que favoritou. Parte da chave primária |
| `pokemon_id` | `smallint` | ID do Pokémon (1 a 151). Parte da chave primária |
| `created_at` | `timestamptz` | Data/hora em que o Pokémon foi favoritado (`default now()`) |

## ⚛️ Conceitos de React utilizados

| Conceito | Onde |
|---|---|
| Componentes funcionais | Todos os arquivos de `src/components/` |
| Props | `PokemonCard` recebe `pokemon`, `isFavorite`, `onOpen`...; `TypeBadge` recebe `type` |
| `useState` | Aba ativa e Pokémon aberto (`App.jsx`), pesquisa/tipo/ordem (`usePokedexFilters`), favoritos (`useFavoritos`) |
| `useEffect` | Carregar favoritos, aplicar o tema, teclado nos detalhes, devolver o foco ao fechar |
| `useMemo` (estado derivado) | Lista filtrada e ordenada, lista de favoritos, contagem por tipo |
| `useCallback` + `memo` | `PokemonCard` com `memo`: favoritar redesenha só o card que mudou |
| `useRef` | Foco do botão Voltar, rolagem da tela, elemento que abriu os detalhes |
| `useId` | Ligação entre `<label>` e `<input>` na pesquisa e na ordenação |
| Hooks próprios | `useFavoritos`, `usePokedexFilters`, `useTheme`, `useSkin` |
| Listas com `map()` | Cards, tipos, atributos, treinadores, times, abas |
| Eventos | `onClick`, `onChange`, `onKeyDown`, `onError` (imagem reserva) |
| Renderização condicional | Estados vazios, detalhes abertos, filtros escondidos sem favoritos |

## 📂 Estrutura do Projeto

```text
📁 Pokedex
│
├── 📁 imgs                                └── Capturas de tela usadas neste README
├── 📁 public
│   ├── favicon.ico                        └── Favicon (16, 32, 48 e 64 px)
│   ├── favicon-32.png / favicon-192.png   └── Favicon em PNG
│   └── apple-touch-icon.png               └── Ícone da tela inicial (iPhone/iPad)
│
├── 📁 src
│   ├── 📁 assets/images
│   │   ├── pokedex-classica.webp          └── Pokédex clássica (o sprite aparece na tela dela)
│   │   ├── pokedex-fechada.webp           └── Capa: Pokédex fechada
│   │   ├── pokedex-aberta.webp            └── Capa: Pokédex aberta ("INICIANDO...")
│   │   ├── holo-fundo.webp                └── Tema Holo: a ilustração inteira (aparelho em telas largas)
│   │   ├── holo-tela.webp                 └── Tema Holo: só a tela azul, centralizada na Pokébola (celular)
│   │   └── sem-imagem.svg                 └── Imagem reserva quando a PokéAPI não responde
│   │
│   ├── ⚙️ config
│   │   ├── appConfig.js                   └── Total de Pokémon, escala das barras, URLs das imagens (PokéAPI e Showdown), chaves do localStorage, temas (SKINS)
│   │   └── supabaseClient.js              └── createClient com a URL e a chave publicável (ignora os valores de exemplo)
│   │
│   ├── 📊 data
│   │   └── pokedex-data.json              └── Dados da atividade (Pokémon, tipos e treinadores)
│   │
│   ├── 🧩 model
│   │   ├── Pokemon.js                     └── Pokémon pronto para a tela + lista dos seis atributos (STATS)
│   │   ├── PokemonType.js                 └── Nome em pt-BR, cor e cor do texto de cada tipo
│   │   └── Trainer.js                     └── Treinador com os Pokémon do time já resolvidos e as URLs da imagem
│   │
│   ├── 🗄️ repository
│   │   └── favoriteRepository.js          └── Chamadas rpc() das duas funções do Supabase
│   │
│   ├── 🔎 services
│   │   ├── pokedexService.js              └── Dados, pesquisa, filtro por tipo e ordenação
│   │   └── favoriteService.js             └── Regras dos favoritos (validação + owner_token)
│   │
│   ├── 🪝 hooks
│   │   ├── useFavoritos.js                └── Carrega e alterna favoritos; status do LED
│   │   ├── usePokedexFilters.js           └── Pesquisa, tipo, ordem e a lista derivada
│   │   ├── useTheme.js                    └── Modo noturno (sistema + escolha salva)
│   │   └── useSkin.js                     └── Tema do aparelho: Clássico ou Holo (escolha salva)
│   │
│   ├── 🧰 utils
│   │   ├── aparencia.js                   └── Aplica data-theme, data-skin e color-scheme no <html>
│   │   ├── storage.js                     └── localStorage com try/catch e o owner_token
│   │   └── text.js                        └── normalizar() para a pesquisa e formatarNumero() (#025)
│   │
│   ├── 🎨 components
│   │   ├── PokedexCover/                  └── Capa: Pokédex fechada/aberta com a tampa que gira
│   │   ├── DeviceShell/                   └── O aparelho: carcaça, sensor/lente, LED, botões (Noturno, Tema, Fechar, Sortear), tela e alto-falante (DeviceShellHolo.css: tema Holo)
│   │   ├── ScreenTabs/                    └── Abas Pokédex, Favoritos e Treinadores
│   │   ├── SearchBar/                     └── Pesquisa por nome ou número
│   │   ├── SortControl/                   └── Ordenar por + crescente/decrescente
│   │   ├── TypeFilter/                    └── Botões de tipo com contagem
│   │   ├── PokemonList/                   └── Grade de cards (ou estado vazio)
│   │   ├── PokemonCard/                   └── Um Pokémon: sprite, número, nome, tipos e atributos
│   │   ├── PokemonDetails/                └── Detalhes por cima da lista, com Anterior/Próximo
│   │   ├── ClassicPokedex/                └── Pokédex clássica: sprite na tela, nome no visor e tipos
│   │   ├── TrainerList/                   └── TrainerList + TrainerCard (imagem, insígnias e time)
│   │   ├── TrainerAvatar/                 └── Imagem do treinador (Showdown), com as iniciais como plano B
│   │   ├── StatBar/                       └── Barra de atributo (compacta no card, completa nos detalhes)
│   │   ├── TypeBadge/                     └── Selo colorido de um tipo
│   │   ├── FavoriteButton/                └── Estrela de favorito
│   │   ├── PokemonImage/                  └── <img> com imagem reserva
│   │   ├── StatusBar/                     └── Barra de status da tela (favoritos)
│   │   ├── EmptyState/                    └── Telas vazias com o próximo passo
│   │   └── Icon/                          └── Ícones SVG desenhados à mão
│   │
│   ├── App.jsx                            └── Capa, abas, detalhes, sorteio e ligação entre os componentes
│   ├── App.css                            └── Layout da área útil da tela
│   ├── index.css                          └── Tokens de cor (aparelho, mesa e tela clara/escura, Clássico e Holo), reset e botões
│   └── main.jsx
│
├── 🗃️ supabase_favorites.sql              └── Tabela + RLS + funções (rode no SQL Editor)
├── 📄 .env.example                        └── Modelo do .env.local
├── 📄 index.html                          └── Favicon, fontes (Google Fonts) + script do tema e do modo noturno (sem "piscar")
├── 📄 vite.config.js                      └── base "./" (funciona na Vercel e no GitHub Pages)
└── 📄 package.json
```

Hierarquia dos componentes:

```text
App
 ├── PokedexCover        (capa, por cima de tudo enquanto a Pokédex está fechada)
 └── DeviceShell
      ├── ScreenTabs
      ├── SearchBar
      ├── SortControl
      ├── TypeFilter
      ├── PokemonList
      │    ├── PokemonCard ── TypeBadge, StatBar, FavoriteButton, PokemonImage
      │    └── EmptyState
      ├── TrainerList
      │    └── TrainerCard ── TrainerAvatar, PokemonImage
      ├── PokemonDetails ── TypeBadge, StatBar, FavoriteButton, PokemonImage, ClassicPokedex, TrainerAvatar
      └── StatusBar
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

> 💡 Não há rotas (as seções são abas), então não precisa de `vercel.json`. Como o `vite.config.js` usa `base: "./"`, a pasta `dist/` também funciona no **GitHub Pages**, numa subpasta como `https://seu-usuario.github.io/pokedex/`.

## 🧯 Problemas comuns

| Sintoma / erro | Causa provável | Solução |
|---|---|---|
| LED apagado e "Favoritos desativados" | `.env.local` ausente ou servidor não reiniciado | Criar o `.env.local` (passo 4) e reiniciar o `npm run dev` |
| `Invalid API key` | Chave copiada errada ou de outro projeto | Copiar de novo em **Project Settings → API Keys** |
| `Could not find the function public.list_my_favorites` | Script não executado ou cache da Data API desatualizado | Rodar o `supabase_favorites.sql` inteiro (ele termina com `notify pgrst, 'reload schema'`) |
| `permission denied for function toggle_favorite` | Faltou o `grant execute` | Rodar o `supabase_favorites.sql` inteiro |
| `Failed to fetch` e LED vermelho | Projeto pausado (plano free) ou URL errada | **Restore project** no dashboard / conferir `VITE_SUPABASE_URL` |
| Favoritos somem em outro navegador | Os favoritos são por navegador (`owner_token`) | Comportamento esperado; veja **Segurança** |
| Imagens com um ponto de interrogação | Sem internet ou GitHub fora do ar | A Pokédex continua funcionando; as imagens voltam quando a conexão voltar |
| Treinador só com as iniciais | Sem internet, Showdown fora do ar ou nome de arquivo diferente | Conferir o nome na [lista de sprites](https://play.pokemonshowdown.com/sprites/trainers/) e ajustar `TRAINER_SPRITES` no `appConfig.js` |
| Favicon antigo continua aparecendo | Cache do navegador | Recarregar com `Ctrl + Shift + R` (ou abrir numa aba anônima) |

## 📦 Dependências

```json
"dependencies": {
  "@supabase/supabase-js": "^2.118.0",
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

- [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction): cliente oficial do Supabase. Monta as requisições para a Data API a partir de `rpc(...)`.
- [`react`](https://react.dev/) e [`react-dom`](https://react.dev/): a interface.
- Ícones, aparelho, tampa da capa e gráficos de atributos são feitos com SVG e CSS, sem biblioteca.
- Fontes: [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (interface) e [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) (textos), pelo Google Fonts.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente (`http://localhost:4173`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 🔗 Urls do projeto

http://localhost:5173/

http://localhost:4173/ (depois de `npm run build` + `npm run preview`)

## 📚 Documentação e Links Úteis

**Atividade**

- [Atividade 03 - Pokédex com React + Vite](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003.md)
- [pokedex-data.json](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json)

**PokéAPI**

- [PokéAPI: Documentação](https://pokeapi.co/docs/v2)
- [PokéAPI: Pikachu](https://pokeapi.co/api/v2/pokemon/pikachu)
- [PokeAPI/sprites (repositório das imagens)](https://github.com/PokeAPI/sprites)

**Pokémon Showdown (treinadores)**

- [Pokémon Showdown](https://play.pokemonshowdown.com/)
- [Sprites dos treinadores](https://play.pokemonshowdown.com/sprites/trainers/)

**Supabase**

- [Supabase: Dashboard](https://supabase.com/dashboard)
- [supabase-js: Referência](https://supabase.com/docs/reference/javascript/introduction)
- [supabase-js: rpc()](https://supabase.com/docs/reference/javascript/rpc)
- [Supabase: Usando com React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase: API Keys (publishable e secret)](https://supabase.com/docs/guides/api/api-keys)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions)

**React, Vite e deploy**

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Variáveis de ambiente no Vite](https://vite.dev/guide/env-and-mode)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [GitHub Pages: publicando a partir de uma branch](https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
