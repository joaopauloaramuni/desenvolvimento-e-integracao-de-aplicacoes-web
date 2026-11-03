# Projeto CaderninhoDoBuraco (React + Vite + Supabase) 🃏

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://caderninhodoburaco.vercel.app/)

👉 **[caderninhodoburaco.vercel.app](https://caderninhodoburaco.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

O **Caderninho do Buraco** é o placar das nossas partidas de **buraco**, o jogo de baralho. Ele substitui o caderninho de papel que fica em cima da mesa: cadastre os jogadores, crie a partida do dia e lance cada rodada. Em vez de somar as cartas na mão, digite os jogos que cada um baixou (`Ás, 2, 3`, `8, coringa joker, 10`...) e a conta sai sozinha: pontos das cartas, canastras limpas e sujas, **canastra real de Ás a Ás**, batida e o desconto das cartas que sobraram na mão.

O jogo é **individual** (sem duplas). Cada rodada ganha conta uma **vitória**, e o placar geral pode ser filtrado por **mês**, **ano**, **entre datas** ou **todo o tempo**. O dashboard compara os jogadores com gráficos do **[Recharts](https://recharts.org/)**.

Os dados ficam no PostgreSQL do **[Supabase](https://supabase.com/)**. Não existe servidor: o navegador fala com o Supabase pelo SDK **`@supabase/supabase-js`**, que usa a **Data API** (HTTPS) com a chave **publicável**, protegida por **RLS**. O site é estático e pode ser hospedado na **[Vercel](https://vercel.com/)**.

## ✨ Funcionalidades

- **Jogadores**: cadastro com nome, uma **figura** (dama, valete ou coringa) como avatar e uma **cor** para os gráficos. Dá para editar, **desativar** (some das partidas novas, mas continua no histórico) e excluir quem ainda não tem pontos.
- **Partidas**: a **data** do jogo, quem está na mesa (2 ou mais), local e observação opcionais. A lista agrupa por mês e mostra vitórias e pontos de cada um no dia.
- **Rodadas**: rodada 1, rodada 2... dentro de cada partida, como no caderninho:

  ```text
  dia 02/11 - rodada 1
  Mariana    - 1.510 pontos - bateu e ganhou a rodada
  João Paulo -    95 pontos
  Lara       -    50 pontos
  ```

- **Contagem automática das mãos**: um jogo por linha, escrito do jeito que se fala, ou tocando no **teclado de cartas** (bom no celular). A prévia mostra as cartas lidas, os curingas e o tipo de cada jogo enquanto você digita.
- **Canastras detectadas sozinhas**: 7 cartas ou mais viram canastra. Sem curinga é **limpa** (+200), com curinga é **suja** (+100). De **Ás a Ás do mesmo naipe**, limpa, é a **canastra real** (+1.000, no lugar dos 200).
- **Batida** (+100) e **cartas que sobraram na mão** (desconto). A mão aceita o número (`30`) ou as cartas (`K, 7, coringa`).
- **Outros acertos** (ex.: −100 do morto) e o modo **"Só o total"**, para quando vocês só anotaram o resultado.
- **Quem ganha a rodada**: o maior total. Empate? Ganha quem bateu. Só uma pessoa bate por rodada (o banco confere).
- **Placar geral**: vitórias, rodadas, aproveitamento, pontos, média, batidas, canastras limpas/sujas/reais e pontos perdidos na mão, com filtro por **mês**, **ano**, **entre datas** ou **todo o tempo**. O filtro fica na URL (`/placar?periodo=mes&mes=2026-11`), então dá para salvar e mandar o link.
- **Dashboard com Recharts**: vitórias, divisão das vitórias, pontos acumulados, média por rodada, batidas, canastras por tipo, pontos perdidos na mão e vitórias por mês.
- **Legenda na Home**: quanto vale cada carta e cada jogada, sempre à vista. Os valores vêm de `src/config/appConfig.js`; mudou a regra, mudou a legenda.
- **Abertura com a canastra real**: ao entrar na Home, um monte de copas se abre em leque, de Ás a Ás, e aparece "1.000 pontos". O botão **Abrir de novo** repete a animação. Quem desativa animações no sistema vê o leque já aberto.
- **Visual de mesa de buraco**: feltro verde, borda de madeira, cartas desenhadas em CSS, letreiro em **Cinzel Decorative** e o placar em **folhas de caderninho** pautado, com espiral e margem vermelha.
- **Responsivo**: no celular, a barra do placar da rodada fica presa no pé da tela, com o botão de salvar.

## 🃏 Regras de pontuação

| Carta | Pontos |
| :--- | ---: |
| Ás (A) | 15 |
| 2 (curinga) | 10 |
| 3 a 7 | 5 |
| 8 a Rei (K) | 10 |
| Coringa (Joker) | 20 |

| Jogada | Pontos |
| :--- | ---: |
| Batida | +100 |
| Canastra limpa (7+ cartas, sem curinga) | +200 |
| Canastra suja (7+ cartas, com curinga) | +100 |
| Canastra real: limpa de **Ás a Ás** do mesmo naipe (A, 2, 3 ... K, A) | **+1.000** (no lugar dos 200) |
| Cartas que sobraram na mão | −valor (terminou com 30 pontos na mão: −30) |

**Total da rodada** = cartas baixadas na mesa + canastras + batida − cartas na mão ± outros acertos.

### Como escrever os jogos

| Você escreve | O app entende |
| --- | --- |
| `A`, `As`, `Ás`, `1` | Ás |
| `2` ... `10` | a carta |
| `J` / `valete`, `Q` / `dama`, `K` / `rei` | as figuras |
| `coringa`, `joker`, `coringa joker`, `jk` | Coringa (Joker) |
| `2*`, `2 curinga`, `curinga` | um 2 fazendo papel de curinga |
| `copas: A, 2, 3` | o naipe é opcional, só muda o desenho das cartas |

Separe as cartas por vírgula (ou espaço) e os jogos por **linha**. O **2 no lugar dele** (logo antes do 3, ou logo depois do Ás que abre a sequência) é natural e não suja a canastra; fora disso, vira curinga sozinho.

Exemplo, a mão do João Paulo na rodada 1:

```text
2, 3, 4                 -> 20
7, 8, 9, 10             -> 35
Ás, 2, 3                -> 30   (o 2 está no lugar: natural)
8, coringa joker, 10    -> 40   (o Coringa é curinga)
                        = 125 na mesa
Cartas na mão: 30       -> −30
                        = 95 pontos
```

## 🖼️ Capturas de Tela

| Home | Canastra real se abrindo |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Home.png) | ![CanastraAbrindo](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/CanastraAbrindo.png) |

| Home completa (legenda de pontos) | Lançar rodada |
| :---: | :---: |
| ![HomeCompleta](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/HomeCompleta.png) | ![LancarRodada](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/LancarRodada.png) |

| Partida (rodadas no caderninho) | Partidas |
| :---: | :---: |
| ![Partida](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Partida.png) | ![Partidas](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Partidas.png) |

| Nova partida | Jogadores |
| :---: | :---: |
| ![NovaPartida](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/NovaPartida.png) | ![Jogadores](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Jogadores.png) |

| Placar geral (todo o tempo) | Placar do mês |
| :---: | :---: |
| ![Placar](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Placar.png) | ![PlacarMes](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/PlacarMes.png) |

| Estatísticas | Estatísticas do ano |
| :---: | :---: |
| ![Estatisticas](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Estatisticas.png) | ![EstatisticasAno](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/EstatisticasAno.png) |

| Celular | Celular - Lançar rodada |
| :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/Mobile.png) | ![MobileRodada](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/MobileRodada.png) |

| Página não encontrada |
| :---: |
| ![NaoEncontrada](https://joaopauloaramuni.github.io/react-imgs/CaderninhoDoBuraco/imgs/NaoEncontrada.png) |

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu projeto Supabase
npm run dev
```

Acesse `http://localhost:5173`. Antes de cadastrar jogadores, crie as tabelas no Supabase (passo 2 abaixo).

## 🗄️ Configuração do Supabase (passo a passo)

### 1. Criar a conta e o projeto

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta (dá para entrar com o GitHub).
2. No dashboard, clique em **New project**.
3. Preencha:
   - **Name**: por exemplo, `caderninho-do-buraco`.
   - **Database Password**: crie uma senha e guarde-a. Neste projeto ela **não** vai para o `.env` (o React não conecta com usuário e senha do banco).
   - **Region**: escolha a mais próxima. No Brasil, **South America (São Paulo)** (`sa-east-1`). ⚠️ A região não pode ser alterada depois.
4. Clique em **Create new project** e aguarde o banco ficar pronto.

### 2. Criar as tabelas, o RLS e as funções (obrigatório)

Abra o **SQL Editor** no Supabase, cole o conteúdo de **`supabase_buraco.sql`** e clique em **Run**. O script pode ser executado de novo sem problema.

Ele cria:

| Objeto | O que faz |
|---|---|
| Tabela `jogadores` | `nome` (único, sem diferenciar maiúsculas), `carta` (avatar), `cor`, `ativo` |
| Tabela `partidas` | `data`, `local`, `observacao` |
| Tabela `partida_jogadores` | Quem jogou em cada partida (e a ordem das folhas) |
| Tabela `rodadas` | `numero` da rodada dentro da partida (único por partida) |
| Tabela `pontuacoes` | O resultado de cada jogador em cada rodada: texto digitado, jogos lidos (`jsonb`), parcelas, `total`, `bateu`, `venceu` |
| `check` da soma | No modo "cartas", o banco recusa `total` diferente de mesa + canastras + batida + mão + acertos |
| Índice parcial | Só **uma** pessoa bate por rodada |
| View `v_pontuacoes` | Cada pontuação já com a data da partida (placar e gráficos), com `security_invoker` |
| RLS + policies | Liberam ler e gravar para a turma (veja **Segurança**) |
| Função `criar_partida` | Cria a partida e os jogadores dela numa transação só |
| Função `atualizar_partida` | Muda data, local e jogadores (não deixa tirar quem já tem pontos) |
| Função `salvar_rodada` | Cria ou substitui a rodada com a pontuação de todos, numa transação só |
| Função `excluir_rodada` | Apaga a rodada e renumera as seguintes (a 3 vira 2) |

### 3. (Opcional) Dados de exemplo

Quer ver o app cheio antes de jogar? Rode também o **`supabase_exemplo.sql`**. Ele cria **Mariana**, **João Paulo** e **Lara** e 10 partidas entre dezembro de 2025 e novembro de 2026 (são os dados das capturas de tela, incluindo a mão do João Paulo do exemplo acima). Para apagar depois:

```sql
delete from public.partidas;
delete from public.jogadores;
```

### 4. Pegar a URL e a chave publicável

1. **Project Settings → Data API**: copie a **Project URL** (`https://<project-ref>.supabase.co`).
2. **Project Settings → API Keys**: copie a **Publishable key** (`sb_publishable_...`).

Os dois também aparecem no botão **Connect**, na barra superior do projeto. A chave **`anon`** (legacy) funciona do mesmo jeito.

> ⛔ **Nunca use a `secret key` (`sb_secret_...`) nem a `service_role`** neste projeto. Elas **ignoram o RLS** e dão acesso total ao banco, e tudo que começa com `VITE_` vai para o JavaScript do navegador, onde qualquer visitante consegue ler.

### 5. Configurar o `.env.local`

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

### 6. Rodar e verificar

1. Acesse `http://localhost:5173/jogadores` e cadastre pelo menos dois jogadores.
2. Em **Partidas → Nova partida**, escolha a data e quem está na mesa.
3. Clique em **Lançar rodada 1**, digite os jogos de cada um e marque quem bateu.
4. No Supabase, abra o **Table Editor**: a rodada aparece em `rodadas` e as pontuações em `pontuacoes`.

> 💤 No plano gratuito, projetos sem atividade por cerca de uma semana são **pausados**. Se o placar parar de carregar, entre no dashboard e clique em **Restore project**.

## 🔐 Segurança

A **publishable key** foi feita para ser pública: ela só identifica o projeto, e quem decide o que cada visitante pode fazer é o **banco** (RLS). Como o placar é da turma, o `supabase_buraco.sql` libera ler e lançar pontos para quem abrir o site, como um caderninho em cima da mesa:

| O visitante tenta... | Resultado | Por quê |
|---|---|---|
| Ver o placar, partidas e jogadores | ✅ | Policy `..._turma` (`using (true)`) |
| Lançar ou editar rodadas | ✅ | Idem, pelas funções `salvar_rodada` / `excluir_rodada` |
| Salvar um total que não bate com as parcelas | ❌ `check constraint` | `pontuacoes_soma_confere` |
| Marcar duas batidas na mesma rodada | ❌ `unique` | `pontuacoes_uma_batida_por_rodada` |
| Excluir um jogador que tem pontos | ❌ `foreign key` | `on delete restrict` (o app sugere desativar) |
| Tirar da partida quem já pontuou | ❌ | A função `atualizar_partida` recusa |

### ⚠️ Quem tiver o link pode lançar pontos

Para uso entre amigos e família isso costuma bastar. Se quiser que **só vocês** lancem pontos, mantendo o placar público para leitura:

1. Em **Authentication → Users**, crie os usuários (e desligue o cadastro aberto em **Authentication → Sign In / Providers**).
2. Troque as policies para exigir login na escrita:

   ```sql
   -- repita para jogadores, partidas, partida_jogadores, rodadas e pontuacoes
   drop policy if exists "pontuacoes_turma" on public.pontuacoes;
   create policy "pontuacoes_leitura" on public.pontuacoes for select to anon, authenticated using (true);
   create policy "pontuacoes_escrita" on public.pontuacoes for all to authenticated using (true) with check (true);
   ```

3. Adicione uma tela de login com `supabase.auth.signInWithPassword` e ligue `persistSession: true` no `src/config/supabaseClient.js` (veja [Supabase Auth: senha](https://supabase.com/docs/guides/auth/passwords)).

## ⚙️ Como funciona

```text
                       ┌─ select ──────────▶ /rest/v1/jogadores, /partidas (+ rodadas, pontuacoes)
Navegador (React) ─────┤─ select ──────────▶ /rest/v1/v_pontuacoes            (placar e gráficos)
  supabase-js +        ├─ rpc ─────────────▶ /rest/v1/rpc/criar_partida
  chave publicável     ├─ rpc ─────────────▶ /rest/v1/rpc/salvar_rodada      (rodada + pontuações)
                       └─ rpc ─────────────▶ /rest/v1/rpc/excluir_rodada
                                             <project-ref>.supabase.co
```

**Lançar uma rodada**

1. Para cada jogador, o `MaoEditor` guarda o texto dos jogos (`jogosTexto`) e o `PontuacaoForm` guarda a mão, a batida e os acertos.
2. A cada tecla, o `contagemService.contarPontuacao` lê as cartas, decide quais 2 são curinga, classifica cada jogo (`jogo`, `limpa`, `suja` ou `real`) e soma as parcelas. A tela mostra a conta na hora.
3. O `definirVencedores` escolhe quem ganhou a rodada (maior total; empate fica com quem bateu).
4. Ao salvar, o `rodadaService` monta as `Pontuacao` e chama a função `salvar_rodada`, que grava a rodada e todas as pontuações numa transação só. O banco confere a soma e a batida única.

**Placar e dashboard**

1. O hook `usePeriodo` lê o filtro da URL e o `intervaloDoPeriodo` vira `{ inicio, fim }`.
2. O `estatisticaRepository` lê a view `v_pontuacoes` entre as datas (de 1000 em 1000 linhas, o limite da Data API).
3. O `estatisticaService.calcularEstatisticas` (uma função pura, sem banco) agrupa por jogador: ranking, totais, pontos acumulados por dia e vitórias por mês.

> 💡 A contagem não depende de React nem do Supabase. Dá para testar no Node: `import { contarPontuacao } from "./src/services/contagemService.js"`.

## 🧭 Rotas

| Rota | Página |
|---|---|
| `/` | Home: canastra real se abrindo, legenda de pontos, placar do mês e últimas partidas |
| `/jogadores` | Cadastrar, editar, desativar e excluir jogadores |
| `/partidas` | Partidas agrupadas por mês |
| `/partidas/nova` | Nova partida |
| `/partidas/:id` | A partida: placar do dia e as rodadas |
| `/partidas/:id/editar` | Editar data, local e jogadores |
| `/partidas/:id/rodadas/nova` | Lançar a próxima rodada |
| `/partidas/:id/rodadas/:rodadaId` | Editar uma rodada |
| `/placar` | Placar geral, com filtro de período (`?periodo=tudo`, `?periodo=mes&mes=2026-11`, `?periodo=ano&ano=2026`, `?periodo=intervalo&inicio=...&fim=...`) |
| `/estatisticas` | Dashboard com Recharts (mesmo filtro) |
| `*` | Página não encontrada |

## 🛠️ Services e repositories

### `contagemService.js`

- `lerCartas(texto)`: `"8, coringa joker, 10"` → `[{ valor: "8" }, { valor: "JOKER" }, { valor: "10" }]`.
- `classificarJogo(cartas, naipe)`: marca os curingas e devolve `{ cartas, pontos, curingas, tipo, bonus, avisos }`.
- `lerJogos(texto)`: um jogo por linha, devolve `{ jogos, erros }` (sem lançar: os erros aparecem no formulário).
- `lerMao(texto)`: `"30"` ou `"K, 7, coringa"` → pontos a descontar.
- `contarPontuacao(formulario)`: todas as parcelas e o total de um jogador.
- `definirVencedores(resultados)`: quem ganhou a rodada.

### `rodadaService.js`, `partidaService.js`, `jogadorService.js`, `estatisticaService.js`

Validam os dados, traduzem os códigos de erro do Postgres (`23505`, `23503`, `P0002`) para as exceções de `src/core/exceptions.js` e chamam os repositories.

### Repositories

```js
// select * from jogadores order by nome
await supabase.from("jogadores").select("id, nome, carta, cor, ativo, created_at").order("nome");

// partida com rodadas e pontuações (embedding da Data API)
await supabase.from("partidas").select("id, data, partida_jogadores(jogador_id, ordem), rodadas(id, numero, pontuacoes(*))").eq("id", id);

// select salvar_rodada(partida, rodada ou null, '[{...}, {...}]')
await supabase.rpc("salvar_rodada", { p_partida_id, p_rodada_id, p_pontuacoes });

// placar do período
await supabase.from("v_pontuacoes").select("...").gte("data", inicio).lte("data", fim);
```

### Tabela `pontuacoes`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` | Chave primária |
| `rodada_id` | `uuid` | A rodada (apaga junto com ela) |
| `jogador_id` | `uuid` | O jogador |
| `modo` | `text` | `cartas` (contado pelo app) ou `total` (só o total) |
| `jogos_texto` | `text` | O que foi digitado, um jogo por linha |
| `mao_texto` | `text` | As cartas que sobraram na mão (ou o número) |
| `jogos` | `jsonb` | Os jogos lidos: cartas, curingas, tipo, pontos e bônus |
| `pontos_cartas` | `int` | Soma das cartas baixadas na mesa |
| `canastras_limpas` / `_sujas` / `_reais` | `int` | Quantas de cada tipo |
| `pontos_canastras` | `int` | Bônus das canastras |
| `bateu` / `pontos_batida` | `boolean` / `int` | Se bateu, e os +100 |
| `pontos_mao` | `int` | Desconto da mão (sempre ≤ 0) |
| `ajuste` | `int` | Outros acertos (+ ou −) |
| `total` | `int` | O total da rodada |
| `venceu` | `boolean` | Ganhou a rodada |

## 📂 Estrutura do Projeto

```text
📁 CaderninhoDoBuraco
│
├── 📁 imgs                              └── Capturas de tela usadas neste README
├── 📁 public
│   └── favicon.svg                      └── Ás de copas sobre o feltro
│
├── 📁 src
│   ├── 📁 assets/images                 └── Mesa (sem os elementos de poker), Coringas, Damas, Valetes e o leque de Ases
│   │
│   ├── ⚙️ config
│   │   ├── appConfig.js                 └── REGRAS de pontuação, figuras de avatar e cores dos jogadores
│   │   └── supabaseClient.js            └── createClient com a URL e a chave publicável
│   │
│   ├── 🧱 core
│   │   └── exceptions.js                └── JogadorJaExisteException, JogadorComPontosException, ...
│   │
│   ├── 🧩 model
│   │   ├── Jogador.js                   └── Um jogador, com fromRow()
│   │   ├── Partida.js                   └── Um dia de jogo, com totais e vitórias do dia
│   │   ├── Rodada.js                    └── Uma rodada e as pontuações
│   │   └── Pontuacao.js                 └── Resultado de um jogador numa rodada (fromRow / toRow)
│   │
│   ├── 🗄️ repository
│   │   ├── base.js                      └── cliente(), erros do Postgres e paginação de 1000 em 1000
│   │   ├── jogadorRepository.js
│   │   ├── partidaRepository.js         └── select com embedding + rpc criar/atualizar_partida
│   │   ├── rodadaRepository.js          └── rpc salvar_rodada e excluir_rodada
│   │   └── estatisticaRepository.js     └── view v_pontuacoes no período
│   │
│   ├── 🔎 services
│   │   ├── contagemService.js           └── Lê as cartas, curingas, canastras, mão e total (sem React)
│   │   ├── rodadaService.js             └── Formulários -> pontuações, vencedores e salvar
│   │   ├── partidaService.js
│   │   ├── jogadorService.js            └── Validação, próxima figura e cor livres
│   │   └── estatisticaService.js        └── Ranking, totais, evolução e vitórias por mês
│   │
│   ├── 🪝 hooks
│   │   ├── useCarregar.js               └── { dados, carregando, erro, recarregar } sem respostas atrasadas
│   │   ├── useJogadores.js              └── Lista + cadastrar / atualizar / excluir
│   │   ├── usePartidas.js / usePartida.js
│   │   ├── usePeriodo.js                └── Filtro de período guardado na URL
│   │   └── useEstatisticas.js
│   │
│   ├── 🧰 utils
│   │   ├── format.js                    └── Datas, números e pontos em pt-BR
│   │   └── periodo.js                   └── Mês / ano / entre datas / todo o tempo -> { inicio, fim }
│   │
│   ├── 🎨 components
│   │   ├── Layout/                      └── Topo com a marca e o menu, rodapé
│   │   ├── Carta/                       └── Carta de baralho em CSS (A a K, naipes, curinga, Coringa)
│   │   ├── CanastraLeque/               └── A canastra real se abrindo em leque (animação CSS)
│   │   ├── LegendaPontos/               └── Quanto vale cada coisa
│   │   ├── MaoEditor/                   └── Jogos digitados + teclado de cartas + prévia
│   │   ├── PontuacaoForm/               └── A folha de um jogador no lançamento da rodada
│   │   ├── RodadaFolha/                 └── Uma rodada como folha do caderninho
│   │   ├── RankingTabela/               └── O total geral
│   │   ├── FiltroPeriodo/               └── Todo o tempo / Mês / Ano / Entre datas
│   │   ├── Graficos/                    └── Gráficos do Recharts (tema do feltro)
│   │   ├── JogadorAvatar/               └── A figura do jogador com a cor dele
│   │   ├── Aviso/                       └── Erro, aviso, sucesso e "Supabase não configurado"
│   │   └── EstadoVazio/                 └── O Coringa saltando e o que fazer a seguir
│   │
│   ├── 📄 pages
│   │   ├── Home.jsx                     └── "/"
│   │   ├── Jogadores.jsx                └── "/jogadores"
│   │   ├── Partidas.jsx                 └── "/partidas"
│   │   ├── PartidaForm.jsx              └── "/partidas/nova" e "/partidas/:id/editar"
│   │   ├── PartidaDetalhe.jsx           └── "/partidas/:id"
│   │   ├── RodadaEditor.jsx             └── "/partidas/:id/rodadas/nova" e "/:rodadaId"
│   │   ├── Placar.jsx                   └── "/placar"
│   │   ├── Estatisticas.jsx             └── "/estatisticas" (carregada sob demanda)
│   │   └── NotFound.jsx                 └── "*"
│   │
│   ├── App.jsx                          └── Rotas (React Router)
│   ├── index.css                        └── Tokens: feltro, marfim, papel, latão; botões, formulários, selos
│   └── main.jsx                         └── Fontes (Fontsource) + BrowserRouter
│
├── 🗃️ supabase_buraco.sql               └── Tabelas + RLS + funções (rode no SQL Editor)
├── 🗃️ supabase_exemplo.sql              └── Dados de exemplo (opcional)
├── 📄 vercel.json                       └── Qualquer caminho -> index.html (rotas do React)
├── 📄 .env.example                      └── Modelo do .env.local
├── 📄 index.html
├── 📄 vite.config.js
└── 📄 package.json
```

## 🎨 Visual

| Elemento | Escolha |
|---|---|
| Fundo | Feltro verde (gradiente + textura SVG) e borda de madeira no topo |
| Abertura | A mesa das imagens de referência, **sem fichas, logotipo e textos de poker**, com o Coringa e o Ás de espadas |
| Letreiro | **[Cinzel Decorative](https://fonts.google.com/specimen/Cinzel+Decorative)**: capitulares de cassino clássico, só no nome do site |
| Títulos, cartas e placares | **[Cinzel](https://fonts.google.com/specimen/Cinzel)** |
| Textos e botões | **[Figtree](https://fonts.google.com/specimen/Figtree)** |
| O que é "escrito à mão" | **[Caveat](https://fonts.google.com/specimen/Caveat)**, em tinta azul nas folhas pautadas |
| Cartas | Desenhadas em CSS (só o Coringa usa a ilustração) |

As fontes vêm do **[Fontsource](https://fontsource.org/)** e são empacotadas pelo Vite: o site não faz nenhuma requisição ao Google Fonts.

## ☁️ Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Em **Project Name**, use, por exemplo, **`caderninho-do-buraco`** (vira `https://caderninho-do-buraco.vercel.app`, se o nome estiver livre).
4. Abra **Environment Variables** e cadastre:

   | Key | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |

5. Clique em **Deploy**.

> As variáveis `VITE_*` entram no JavaScript **na hora do build**: se trocar alguma, faça um **Redeploy**.

O `vercel.json` manda qualquer caminho (`/partidas/...`, `/placar`) para o `index.html`, onde o React Router decide:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🧯 Problemas comuns

| Sintoma / erro | Causa provável | Solução |
|---|---|---|
| Aviso "Supabase não configurado" | `.env.local` ausente ou servidor não reiniciado | Criar o `.env.local` (passo 5) e reiniciar o `npm run dev` |
| `Invalid API key` | Chave copiada errada ou de outro projeto | Copiar de novo em **Project Settings → API Keys** |
| `relation "public.jogadores" does not exist` | Tabelas não criadas | Rodar o `supabase_buraco.sql` (passo 2) |
| `Could not find the function public.salvar_rodada` | Funções não criadas ou cache da Data API desatualizado | Rodar o `supabase_buraco.sql` inteiro (ele termina com `notify pgrst, 'reload schema'`) |
| `new row violates row-level security policy` | Faltaram as policies | Rodar o script inteiro |
| "Já existe um jogador chamado..." | Nome repetido (maiúsculas não contam) | Usar outro nome ou editar o existente |
| "... já tem pontos lançados" ao excluir jogador | Ele aparece em alguma rodada | Use **Desativar** |
| Botão **Salvar rodada** desabilitado | Alguma carta não foi entendida | Corrigir a linha indicada em vermelho na folha do jogador |
| `Failed to fetch` | Projeto pausado (plano free) ou URL errada | **Restore project** no dashboard / conferir `VITE_SUPABASE_URL` |
| `404` da Vercel ao recarregar `/placar` | Faltou o `vercel.json` | Conferir se o `vercel.json` está na raiz do repositório |

## 📦 Dependências

```json
"dependencies": {
  "@fontsource-variable/caveat": "^5.3.0",
  "@fontsource-variable/cinzel": "^5.3.0",
  "@fontsource-variable/figtree": "^5.3.0",
  "@fontsource/cinzel-decorative": "^5.3.0",
  "@supabase/supabase-js": "^2.118.0",
  "react": "^19.3.1",
  "react-dom": "^19.3.1",
  "react-icons": "^5.7.0",
  "react-router-dom": "^7.18.5",
  "recharts": "^3.10.1"
}
```

- [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction): cliente oficial do Supabase. Monta as requisições para a Data API a partir de `from(...).select()` e `rpc(...)`.
- [`recharts`](https://recharts.org/): os gráficos do dashboard (`BarChart`, `LineChart`, `PieChart`).
- [`react-router-dom`](https://reactrouter.com/): rotas e o filtro de período na URL (`useSearchParams`).
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones do [Lucide](https://lucide.dev/) (`react-icons/lu`).
- [`@fontsource`](https://fontsource.org/): Cinzel, Cinzel Decorative, Figtree e Caveat, sem depender do Google Fonts.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 🔗 Urls do projeto

http://localhost:5173/

http://localhost:5173/placar?periodo=mes&mes=2026-11

http://localhost:5173/estatisticas?periodo=tudo

## 🖌️ Créditos das imagens

As ilustrações das cartas e da mesa vêm de bancos de imagens vetoriais (Freepik). Na mesa, as fichas, o logotipo e os textos de poker foram removidos; das outras imagens, as cartas foram recortadas com fundo transparente. Confira a licença de cada imagem antes de publicar (a licença gratuita do Freepik pede atribuição).

## 📚 Documentação e Links Úteis

**Supabase**

- [Supabase: Dashboard](https://supabase.com/dashboard)
- [supabase-js: Referência](https://supabase.com/docs/reference/javascript/introduction)
- [supabase-js: rpc()](https://supabase.com/docs/reference/javascript/rpc)
- [Supabase: Usando com React](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase: API Keys (publishable e secret)](https://supabase.com/docs/guides/api/api-keys)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions)

**React, Vite, Recharts e Vercel**

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Variáveis de ambiente no Vite](https://vite.dev/guide/env-and-mode)
- [React Router](https://reactrouter.com/)
- [Recharts: exemplos](https://recharts.org/en-US/examples)
- [Fontsource](https://fontsource.org/)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)

**O jogo**

- [Buraco (jogo de cartas) na Wikipédia](https://pt.wikipedia.org/wiki/Buraco_(jogo_de_cartas))

## 📄 Licença
Este projeto está licenciado sob a MIT License. 
