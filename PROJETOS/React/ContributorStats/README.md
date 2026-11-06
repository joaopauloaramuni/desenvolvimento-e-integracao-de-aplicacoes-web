# Projeto ContributorStats (React + Vite) 🏆 

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://contributorstats.vercel.app/)

👉 **[contributorstats.vercel.app](https://contributorstats.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Versão em **React** e **Vite** do [Projeto GitHubAPI ContributorStats 2](https://github.com/joaopauloaramuni/python/tree/main/PROJETOS/Projeto%20GitHubAPI%20ContributorStats_2) (Python). Analisa um repositório do GitHub (público ou **privado**) e gera um **ranking dos colaboradores** com base em métricas reais de código: **commits**, **linhas inseridas**, **linhas deletadas** e **impacto líquido** (inseridas − deletadas).

A regra de negócio é a mesma do projeto Python, só que portada para JavaScript:

- 🌿 **Todas as branches** (padrão), e não só o que já foi mergeado na `main`;
- 🧹 commits **deduplicados**: pelo SHA (mesmo commit em várias branches) e por "impressão digital" (cópias de *rebase*/*cherry-pick*);
- 🔀 commits de *merge* ignorados (opção para contá-los);
- 📍 coluna **Fora da padrão**: quantos commits de cada pessoa ainda não estão na branch padrão, e em quais branches (passe o mouse no **?** do cabeçalho para ver a explicação);
- 📅 coluna **Dias sem commit**: quantos dias se passaram do último commit de cada pessoa até hoje (ex.: *aluno1: 5 dias*);
- 📘 **título do trabalho** no topo do resultado, lido da primeira linha do `README.md` do repositório analisado;
- 🖨️ botão **Exportar PDF**: a análise completa (Ranking, Produtividade e as duas abas de Tipos de arquivo; o log fica de fora) em um único relatório;
- ⏳ modo **só a branch padrão** via `/stats/contributors`, com *polling* do `202 Accepted` e busca em paralelo da data exata do último commit;
- 🧑‍🏫 aba **Produtividade**, pensada para o professor avaliar o **trabalho em grupo**: equilíbrio entre os integrantes, constância semanal, horários, reta final, prazo de entrega, commits grandes, mensagens genéricas, quem não commitou e uma **ficha de cada aluno**;
- 🗂️ aba **Tipos de arquivo por aluno**: em que tipo de arquivo cada pessoa trabalhou, sobre o total **dela mesma** (ex.: *70% CSS · 30% JavaScript*);
- 👥 aba **Tipos de arquivo por grupo**: quanto cada pessoa fez de cada tipo, sobre o total **do grupo** (ex.: o grupo alterou 1.000 linhas e fulano, 100 de JSON → *fulano fez 10% do código do grupo em JSON*).

| Componente | O que mostra |
| --- | --- |
| `<AnalysisForm />` | Repositório (campo na largura toda), critério do ranking e opções (todas as branches, merges, data exata) |
| `<AnalysisHeader />` | Título do trabalho (primeira linha do `README.md` do repositório) e botão **Exportar PDF** |
| `<ContributorStatCards />` | Colaboradores, commits, linhas inseridas e deletadas (com impacto líquido) |
| `<RankingTable />` | Ranking com Top 3 em destaque, ordenação pelo cabeçalho, filtro, dias sem commit, branches não mergeadas (com **?** explicativo), copiar usuário e exportar CSV |
| `<TopContributorsChart />` | Gráfico de barras Top 10 por commits, inseridas, deletadas ou impacto líquido |
| `<ProductivityPanel />` | Aba **Produtividade**: período, prazo, integrantes, indicadores do grupo e exportação CSV |
| `<AttentionList />` | Pontos de atenção gerados automaticamente (crítico · verificar · contexto) |
| `<ParticipationChart />` | % de commits e de linhas de cada integrante × parte esperada |
| `<WeeklyHeatmap />` | Mapa de calor integrante × semana (destaca a semana do prazo) |
| `<WorkHoursHeatmap />` | Mapa de calor dia da semana × hora, do grupo ou de um aluno |
| `<ProductivityTable />` | Indicadores por integrante + ficha do aluno (commits recentes e maiores commits) |
| `<FileTypesPanel />` | Abas **Tipos de arquivo por aluno** (% sobre o total do aluno) e **Tipos de arquivo por grupo** (% sobre o total do grupo + quem fez cada tipo) |
| `<ExecutionLog />` | Log de execução com cada etapa da análise |
| `<ContributorStats />` | Todos os anteriores + barra de status/progresso + abas + relatório para o PDF |

## 🖼️ Capturas de Tela

| Ranking | Branches não mergeadas e "?" de Fora da padrão |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/Home.png?v=4) | ![Branches](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/Branches.png?v=4) |

| Produtividade (avaliação do grupo) | Exportar PDF (análise completa) |
| :---: | :---: |
| ![Produtividade](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/Produtividade.png?v=4) | ![Exportar PDF](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/ExportarPDF.png?v=4) |

| Tipos de arquivo por aluno | Tipos de arquivo por grupo |
| :---: | :---: |
| ![Tipos de arquivo por aluno](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/TiposDeArquivoPorAluno.png?v=4) | ![Tipos de arquivo por grupo](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/TiposDeArquivoPorGrupo.png?v=4) |

| Log de execução | Celular |
| :---: | :---: |
| ![Log](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/Log.png?v=4) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/ContributorStats/imgs/Mobile.png?v=4) |

> As capturas usam dados de exemplo (`aluno1`…`aluno8`), como no projeto Python.

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # preencha o GITHUB_TOKEN
npm run dev
```

Acesse `http://localhost:5173`, cole a URL do repositório e clique em **Analisar repositório**.

> 🔑 O token é **obrigatório** para analisar **todas as branches** (a API GraphQL do GitHub não aceita acesso anônimo) e para repositórios **privados**. Sem token, só funciona o modo **só a branch padrão** em repositórios públicos (60 chamadas por hora por IP).

O repositório que aparece ao abrir a página fica em `src/config/contributorStatsConfig.js`:

```js
DEFAULT_REPO_URL: "https://github.com/dono/repositorio",
```

A URL aceita `https://github.com/dono/repo`, `.git`, links com `/tree/...`, SSH (`git@github.com:dono/repo.git`) ou só `dono/repo`.

## 🔑 Como criar o token do GitHub

**Opção 1: fine-grained (recomendado)**

1. Abra [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens) (**Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**) e clique em **Generate new token**.
2. **Resource owner**: você ou a organização dona dos repositórios (a organização pode precisar aprovar o token).
3. **Repository access**: **Only select repositories** (ou **All repositories**).
4. **Permissions** → **Repository permissions**: **Contents: Read-only** (o **Metadata: Read-only** entra automaticamente).
5. Clique em **Generate token** e **copie o token agora** (começa com `github_pat_`).

**Opção 2: classic**

Em [github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token (classic)** → marque o escopo **`repo`** (necessário para privados; para públicos, nenhum escopo basta).

> ⚠️ O token é **secreto**: nunca coloque no código nem no GitHub. O GitHub detecta tokens publicados e os revoga automaticamente.

## 🔐 Configurando o `.env.local`

O `.env.local` guarda as variáveis de ambiente **só na sua máquina**: ele está no `.gitignore` e **não vai para o GitHub**.

1. Copie o modelo:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha:

   ```properties
   GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxxx

   # Opcional: donos permitidos (usuários/organizações), separados por vírgula
   GITHUB_ALLOWED_OWNERS=
   ```

3. **Reinicie** o `npm run dev`.

> 💡 **Por que não `VITE_GITHUB_TOKEN`?** Tudo que começa com `VITE_` vai **dentro do JavaScript** do navegador, e qualquer visitante consegue ler. Sem o prefixo, o token é lido **só no servidor**: pelo `vite.config.js` no `npm run dev` e pela **Vercel Function** `api/github.js` em produção. A página só pergunta ao servidor **se** há token, para mostrar o aviso abaixo do formulário.

> 🛡️ **`GITHUB_ALLOWED_OWNERS`**: se o seu token enxerga repositórios privados e o site for publicado, **qualquer visitante** consegue analisá-los pela página. Preencha essa variável (ex.: `ICEI-PUC-Minas-CC-TI,seu-usuario`) para limitar os donos aceitos pelo servidor.

## ☁️ Deploy na Vercel (variáveis de ambiente)

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Abra **Environment Variables** e cadastre:

   | Key | Value |
   | --- | --- |
   | `GITHUB_TOKEN` | `github_pat_...` |
   | `GITHUB_ALLOWED_OWNERS` | (opcional) `org1,usuario2` |

4. Clique em **Deploy**.

Se o projeto já estiver publicado: **Settings** → **Environment Variables** → adicione as variáveis (marque **Production**, **Preview** e **Development**) → **Save** → **Deployments** → três pontinhos do último deploy → **Redeploy**.

## ⚙️ Como funciona

A regra de negócio (polling, deduplicação, ranking, CSV) roda **no navegador**, em `src/core`. O servidor só faz as chamadas ao GitHub com o token, e aceita apenas os recursos abaixo, com parâmetros validados: a rota não vira uma "porta aberta" para gastar o token.

```text
Navegador ──GET /api/github?resource=...──▶ vite.config.js (dev) ou api/github.js (Vercel)
 (src/core)                                         │ + GITHUB_TOKEN
                                                    ▼
          status       → { hasToken }  (o token nunca sai do servidor)
          branches     → GraphQL repository.refs            (uma página de branches)
          history      → GraphQL object(oid).history        (uma página de commits)
          stats        → GET /repos/:owner/:repo/stats/contributors  (ready | computing | empty)
          last-commit  → GET /repos/:owner/:repo/commits?author=...&per_page=1
          commits      → GET /repos/:owner/:repo/commits?per_page=100&page=N  (abas Tipos de arquivo)
          commit       → GET /repos/:owner/:repo/commits/:sha   (arquivos alterados no commit)
          readme       → GET /repos/:owner/:repo/readme  → { title }  (só o título do trabalho)
```

**Todas as branches (padrão)**

1. Lista as branches (a padrão primeiro) via GraphQL;
2. percorre o histórico de cada branch, página a página (se o GitHub der *timeout*, o tamanho da página cai pela metade e tenta de novo);
3. conta cada commit **uma vez só** (SHA e impressão digital: autor + data de autoria + mensagem + linhas);
4. ignora *merges* (a menos que **Contar commits de merge** esteja marcado);
5. agrega por autor: commits, linhas, data exata do último commit e commits fora da branch padrão.

**Só a branch padrão** (desmarque **Considerar todas as branches**)

1. `/stats/contributors` com *polling* enquanto o GitHub responde `202` (até 6 tentativas, 10 s entre elas, cancelável);
2. data do último commit aproximada pela semana (`~`) e, opcionalmente, exata (até 8 requisições em paralelo).

**Na página**

- A análise não trava a tela: barra de progresso e botão **Cancelar** (ou `Esc`), com `AbortController`;
- Trocar o critério do ranking **reordena sem nova consulta à API**;
- **Título do trabalho**: depois do ranking, o servidor lê o `README.md` do repositório e devolve **só a primeira linha com texto** (sem `#`, badges, imagens, links e tags HTML). Ex.: `# 📚 BiblioTech: sistema de empréstimo de livros` → **📚 BiblioTech: sistema de empréstimo de livros**. Sem README, aparece o nome do repositório;
- **Dias sem commit**: dias corridos entre o último commit da pessoa e a data de hoje (no fuso de quem usa). A partir de `INACTIVE_DAYS` (14) dias o valor fica em destaque; com `~`, a data do último commit é aproximada (modo só a branch padrão sem data exata);
- **Fora da padrão**: o **?** no cabeçalho explica a coluna ao passar o mouse (ou focar com `Tab`): são commits que estão só em outras branches e ainda não chegaram à branch padrão;
- **Exportar CSV** (`Ctrl+E` / `Cmd+E`): separado por `;`, UTF-8 com BOM (acentos corretos no Excel), no formato do projeto Python mais a coluna **Dias sem Commit (até hoje)**:

```text
Posição;Nome de Usuário;URL Perfil;Commits Totais;Linhas Inseridas;Linhas Deletadas;Impacto Líquido (Ins - Del);Último Commit;Dias sem Commit (até hoje);Commits Fora da Branch Padrão;Branches (não mergeadas)
1;aluno1;https://github.com/aluno1;77;39;34;5;30/09/2025;5;4;feature/login, fix/menu
```

**Exportar PDF (análise completa)**

O botão **Exportar PDF**, ao lado do título do trabalho, monta um relatório com **todas as abas, menos o log**: Ranking (tabela + Top 10), Produtividade, Tipos de arquivo por aluno e Tipos de arquivo por grupo, cada uma começando em uma nova página (A4 paisagem).

1. Se os tipos de arquivo ainda não foram buscados, o botão busca antes (**Preparando PDF…**, 1 requisição por commit);
2. abre a janela de impressão do navegador: escolha **Salvar como PDF** (o nome sugerido é `analise_completa_<repositório>.pdf`);
3. no PDF saem só os resultados: formulário, abas, botões e filtros ficam de fora. Os filtros da aba Produtividade (período, prazo, integrantes) e a métrica dos tipos de arquivo entram como estão na tela.

> 💡 A geração usa a impressão do próprio navegador (`window.print()` + CSS `@media print`): nenhuma biblioteca extra e o texto do PDF continua selecionável.

**Aba "Produtividade" (avaliação do trabalho em grupo)**

Feita para o professor que avalia o repositório de um grupo. Tudo é calculado **no navegador** a partir da análise já feita: trocar o período, o prazo ou os integrantes **não gasta chamadas à API**.

1. Informe (opcional) o **início do trabalho**, o **prazo de entrega** e os **integrantes do grupo** (logins do GitHub ou e-mails, separados por vírgula). Commits antes do início são ignorados; commits **depois do prazo** não entram nas métricas e aparecem na coluna **Após prazo**;
2. com a lista de integrantes, quem **não fez nenhum commit** também aparece (com alerta crítico), e autores fora da lista ficam de fora do equilíbrio do grupo. Contas `[bot]` (ex.: `github-classroom[bot]`) são ignoradas por padrão.

| Bloco | O que mostra |
| --- | --- |
| Indicadores do grupo | **Equilíbrio** (1 − coeficiente de Gini) por commits e por linhas — *Equilibrado* (≥ 75%), *Moderado* (≥ 55%) ou *Concentrado*; semanas com commits; % dos commits na **reta final**; nº de pontos de atenção |
| Pontos de atenção | Alertas automáticos: integrante sem commits, participação baixa (< metade da parte esperada), quem concentra o trabalho, sem commits há 14+ dias, deixou para a reta final (≥ 50% dos commits nos últimos 3 dias), commits muito grandes (1.000+ linhas), mensagens genéricas, *Add files via upload* (arquivos enviados pelo navegador, sem git), commits após o prazo, commits não mergeados e e-mail sem conta do GitHub |
| Participação no grupo | % dos commits e % das linhas alteradas de cada integrante, com a **parte esperada** (100% ÷ nº de integrantes) tracejada |
| Quando trabalham | Mapa de calor **dia da semana × hora** (horário de quem fez o commit), do grupo ou de um aluno: pico, % de madrugada e % de fim de semana |
| Atividade semanal | Mapa de calor **integrante × semana**: mostra quem trabalhou com constância e quem sumiu ou só apareceu no fim (contorno vermelho = semana do prazo) |
| Indicadores por integrante | Commits e linhas (% do grupo), dias ativos, mediana de linhas por commit, commits grandes, mensagens genéricas, reta final, após o prazo e último commit (há quantos dias). A **ficha do aluno** traz semanas ativas, maior sequência de dias, horário mais frequente, branches não mergeadas, commits mais recentes e maiores commits (com link para o commit no GitHub) |

Os limites ficam em `src/config/contributorStatsConfig.js` (`LARGE_COMMIT_LINES`, `FINAL_STRETCH_DAYS`, `INACTIVE_DAYS`, `MIN_MESSAGE_LENGTH`), assim como os valores que aparecem preenchidos ao abrir a aba (`DEFAULT_PERIOD_START`, `DEFAULT_DEADLINE`, `DEFAULT_MEMBERS`, `DEFAULT_IGNORE_BOTS`).

> ℹ️ No modo **só a branch padrão** o GitHub informa apenas totais **por semana**: participação, equilíbrio e atividade semanal funcionam, mas dias ativos, horários, mensagens e commits grandes ficam indisponíveis.

> 💡 Os indicadores servem para **direcionar a conversa** com o grupo, não para substituir a avaliação: quantidade de commits e de linhas não mede qualidade, e programação em par (duas pessoas, um commit) não aparece aqui.

O botão **Exportar CSV** da aba gera uma linha por integrante:

```text
Nome de Usuário;Commits;% dos Commits;Linhas Alteradas (Ins + Del);% das Linhas;Dias Ativos;Semanas Ativas;Maior Sequência (dias);Mediana Linhas/Commit;Commits Grandes;Mensagens Genéricas;Commits na Reta Final;Commits Após o Prazo;Commits Fora da Branch Padrão;Primeiro Commit;Último Commit;Dias sem Commit (fim do período);Pontos de Atenção
aluno4;17;14,7;2785;15,4;6;4;3;144;0;0;14;1;3;07/08/2026;16/10/2026;0;Deixou para a reta final | 1 commit(s) após o prazo | 3 commit(s) fora da branch padrão
```

**Abas "Tipos de arquivo por aluno" e "Tipos de arquivo por grupo"**

As duas abas usam a **mesma busca** (feita uma vez só) e as mesmas opções; muda só a base do percentual:

| Aba | 100% é… | Exemplo |
| --- | --- | --- |
| **Por aluno** | o total do **próprio aluno** | fulano alterou 1.000 linhas: *70% CSS (700 linhas) · 30% JavaScript (300 linhas)* |
| **Por grupo** | o total do **grupo** (todos os colaboradores) | o grupo alterou 1.000 linhas e fulano, 100 de JSON: *fulano fez 10% do código do grupo em JSON* |

1. Depois da análise principal, abra uma das abas e clique em **Analisar tipos de arquivo** (a busca é sob demanda porque custa **1 requisição por commit**);
2. no modo "todas as branches" são usados os mesmos commits do ranking (já deduplicados); no modo "só a branch padrão" os commits são listados via REST;
3. para cada commit, o servidor devolve os arquivos alterados (`caminho`, linhas inseridas e deletadas) — essa resposta fica no cache da CDN, pois um commit nunca muda;
4. cada arquivo é classificado pela extensão (CSS, JavaScript, JSX, HTML, Java, Python, SQL, Markdown…) e as linhas são somadas por colaborador e por tipo;
5. o percentual pode ser calculado sobre **linhas alteradas** (inseridas + deletadas, padrão), **inseridas** ou **deletadas**, sem nova consulta à API;
6. a opção **Ignorar arquivos gerados e dependências** (marcada por padrão) descarta `package-lock.json`, `yarn.lock`, `node_modules/`, `dist/`, `build/`, `*.min.js`, `*.map` etc., que não foram escritos pelo aluno e distorcem a análise.

Na aba **por grupo**, a barra de cada colaborador representa o **grupo inteiro**: a parte colorida é o que ele fez (cada cor é um tipo) e o resto fica vazio, então dá para comparar os colaboradores pelo tamanho da barra. Somando todos os colaboradores e tipos, o total é 100%. Ao abrir a linha, a tabela mostra três percentuais por tipo:

- **% do aluno**: sobre o total do próprio aluno (o mesmo da aba por aluno);
- **% do tipo no grupo**: quanto daquele tipo, no grupo todo, foi feito por ele (ex.: *62% de todo o CSS do grupo*);
- **% do grupo**: sobre o total do grupo (o que a barra mostra).

O bloco **Quem fez cada tipo de arquivo** lista cada tipo com a sua parte no código do grupo e quem o fez (ex.: *CSS 19,4% · aluno2 62,4% · aluno4 31,9% · aluno6 5,7%*).

Commits de merge nunca entram nestas abas (o diff do merge repete o que já foi contado). Acima de `FILE_TYPES_MAX_COMMITS` (3.000) só os commits mais recentes são lidos; se o limite da API acabar no meio, o resultado parcial é exibido. O botão **Exportar CSV** da aba **por aluno** gera um arquivo com uma linha por colaborador × tipo:

```text
Posição;Nome de Usuário;Tipo de Arquivo;Linhas Inseridas;Linhas Deletadas;Linhas Alteradas (Ins + Del);Arquivos;Percentual (%)
1;fulano;CSS;700;0;700;1;70,0
1;fulano;JavaScript;300;0;300;1;30,0
```

Na aba **por grupo**, o CSV (`tipos_de_arquivo_grupo_<repositório>.csv`) traz os três percentuais (exemplo de um grupo com 1.000 linhas alteradas):

```text
Posição;Nome de Usuário;Tipo de Arquivo;Linhas Inseridas;Linhas Deletadas;Linhas Alteradas (Ins + Del);Arquivos;% do Código do Grupo;% do Tipo no Grupo;% do Total do Aluno
1;fulano;CSS;200;0;200;1;20,0;100,0;66,7
1;fulano;JSON;100;0;100;1;10,0;50,0;33,3
2;ciclano;JavaScript;600;0;600;1;60,0;100,0;85,7
2;ciclano;JSON;100;0;100;1;10,0;50,0;14,3
```

> ⚠️ **Squash merge:** quando uma branch é mergeada com *squash* e **não é apagada**, o trabalho aparece duas vezes (nos commits da branch e no commit "squash" da `main`). Apague as branches após o merge.

> ⚠️ **Limitação da API:** em repositórios com mais de 10.000 commits, o `/stats/contributors` (modo só a branch padrão) retorna `0` em inserções e deleções.

> ℹ️ Autores cujo e-mail do commit não está vinculado a uma conta do GitHub aparecem como `Nome <email>`, sem link de perfil. Datas com `~` são aproximadas.

## 🧩 Do Python para o React

| Python | React + Vite |
| --- | --- |
| `core/config.py` | `src/config/contributorStatsConfig.js` (o token vai para o `.env.local`) |
| `core/exceptions.py` | `src/core/exceptions.js` |
| `core/models.py` | `src/core/models.js` |
| `core/repo_url.py` | `src/core/repoUrl.js` |
| `core/ranking.py` | `src/core/ranking.js` |
| `core/exporter.py` | `src/core/exporter.js` (download pelo navegador) |
| `core/service.py` | `src/core/service.js` (`analyzeRepository`) |
| `core/github_client.py` | `src/services/githubClient.js` (navegador) + `api/_github.js` (servidor, com o token) |
| `threading.Event` / `ThreadPoolExecutor` | `AbortController` / `Promise.all` com até 8 tarefas |
| `gui/app.py` (Tkinter) | `src/components/ContributorStats/` |

## 📂 Estrutura do Projeto

```text
📁 ContributorStats
│
├── 📁 api
│   ├── _github.js       └── Chama a GitHub API (REST + GraphQL) com o token (inclui o título do README)
│   └── github.js        └── Vercel Function: GET /api/github
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/                    └── Card da página com a faixa azul (logo PUC + logo da API)
│   │   └── ContributorStats/
│   │       ├── ContributorStats.jsx       └── Painel completo (formulário + abas)
│   │       ├── AnalysisForm.jsx           └── Repositório, critério e opções
│   │       ├── AnalysisHeader.jsx         └── Título do trabalho (README.md) + Exportar PDF
│   │       ├── ContributorStatCards.jsx   └── Indicadores
│   │       ├── RankingTable.jsx           └── Tabela do ranking
│   │       ├── TopContributorsChart.jsx   └── Gráfico Top 10
│   │       ├── ProductivityPanel.jsx      └── Aba "Produtividade" (avaliação do grupo)
│   │       ├── AttentionList.jsx          └── Pontos de atenção
│   │       ├── ParticipationChart.jsx     └── % de commits e linhas × parte esperada
│   │       ├── WeeklyHeatmap.jsx          └── Mapa de calor integrante × semana
│   │       ├── WorkHoursHeatmap.jsx       └── Mapa de calor dia × hora
│   │       ├── ProductivityTable.jsx      └── Indicadores por integrante + ficha do aluno
│   │       ├── FileTypesPanel.jsx         └── Abas "Tipos de arquivo por aluno" e "por grupo"
│   │       ├── ExecutionLog.jsx           └── Log de execução
│   │       ├── useContributorStats.js     └── Hook: executa a análise, progresso e cancelamento
│   │       ├── format.js                  └── Formatação pt-BR
│   │       └── ContributorStats.css
│   │
│   ├── 🧠 core                            └── Regra de negócio (sem React)
│   │   ├── exceptions.js · models.js · repoUrl.js
│   │   ├── ranking.js · exporter.js · service.js
│   │   ├── fileTypes.js                   └── Classificação por extensão, agregação por aluno e por grupo
│   │   ├── productivity.js                └── Indicadores do grupo, alertas e CSV da aba Produtividade
│   │   └── index.js
│   │
│   ├── ⚙️ config/contributorStatsConfig.js
│   ├── 🛠️ services/githubClient.js        └── fetch para /api/github
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── 📄 .env.example      └── Modelo do .env.local (GITHUB_TOKEN, GITHUB_ALLOWED_OWNERS)
├── 📄 .gitignore        └── Ignora node_modules, dist e .env.local
├── 📄 vite.config.js    └── Atende /api/github no npm run dev
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

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (inclusive o logo do GitHub na faixa azul)
- Nenhuma biblioteca para chamar a API nem para os gráficos e mapas de calor: só `fetch` e CSS.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (com a rota `/api/github`) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente (também atende `/api/github`) |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📚 Documentação e Links Úteis

- 🔑 [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- 🧩 [REST API: Repository Statistics](https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28)
- 🧬 [GraphQL API do GitHub](https://docs.github.com/en/graphql)
- ⚡ [Vite](https://vite.dev/) · ⚛️ [React](https://react.dev/)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
