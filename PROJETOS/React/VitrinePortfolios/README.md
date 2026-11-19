# Projeto VitrinePortfolios (React + Vite) 🎓

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vitrine-portfolios.vercel.app/)

👉 **[vitrine-portfolios.vercel.app](https://vitrine-portfolios.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Vitrine dos **portfólios pessoais** desenvolvidos pelos alunos da **PUC Minas** no **2º semestre de 2026**, feita com **React** e **Vite**.

Estes trabalhos foram realizados durante as disciplinas de **Desenvolvimento de Interfaces Web (DIW)** do curso de **Ciência da Computação** e **Desenvolvimento e Integração de Aplicações Web (DIAW)** do curso de **Engenharia de Software** da **PUC Minas**, nos campi **Lourdes** e **Coração Eucarístico**, no segundo semestre de 2026, sob orientação do **Prof. Dr. João Paulo Aramuni** ([aramuni.dev](https://aramuni.dev)).

Este projeto **não tem back-end nem banco de dados** e **não precisa de chave de API**: não tem `.env.local` nem variável na Vercel. A lista de alunos fica em um arquivo JavaScript (`src/data/portfolios.js`).

- 🖼️ **Preview de cada portfólio**: captura da página inicial no card e, ao clicar, um **preview grande** com o **site ao vivo** (`iframe`) ou a **captura**;
- 🌐 **Domínio próprio por escrito e clicável** (`.dev`, `.me`...) na barra de endereço de cada card;
- :octocat: **GitHub do aluno** e **repositório do portfólio**, ambos clicáveis;
- 🔎 **Busca pelo nome** do aluno, sem diferenciar acentos nem maiúsculas (atalho **`/`**, como no GitHub);
- 🎓 **Professor orientador** em uma faixa compacta no cabeçalho, com o [aramuni.dev](https://aramuni.dev), sem tirar o espaço da turma;
- 🏛️ **Logo da PUC Minas**, **logos dos cursos** de Ciência da Computação e Engenharia de Software e cores do brasão (azul, dourado, vermelho e verde);
- 🌗 Botão **Tema claro / Tema escuro** na barra de busca: a escolha fica salva no navegador e, sem escolha, a página segue o tema do sistema;
- ⌨️ Fonte [**JetBrains Mono**](https://www.jetbrains.com/lp/mono/) (Google Fonts), com cara de editor de código;
- 📱 Layout **responsivo**.

| Componente | O que mostra |
| --- | --- |
| `<Header />` | Logo da PUC Minas, logos dos cursos, título, texto das disciplinas (justificado) e a faixa do professor |
| `<ProfessorCard />` | Faixa compacta do professor: miniatura, aramuni.dev, GitHub, repositório e a logo Aramuni |
| `<SearchBar />` | Campo de busca pelo nome, contagem de resultados e o botão de tema |
| `<ThemeToggle />` | Botão **Tema claro / Tema escuro**, salvo no `localStorage` |
| `<PortfolioGrid />` | Grade de cards da turma (ou a mensagem de busca sem resultado) |
| `<PortfolioCard />` | Barra de endereço com o domínio, captura, nome, GitHub e repositório |
| `<PreviewImage />` | Captura de `public/previews` ou, se não existir, cartão com o domínio |
| `<PreviewModal />` | Preview grande: **Site ao vivo** ou **Captura**, com links para GitHub, repositório e site |
| `<Footer />` | Agradecimento ao Ryan e link para o código desta vitrine |

## 🙏 Agradecimento

Um agradecimento especial ao **Ryan Ferreira**, aluno de **Ciência da Computação**, pela iniciativa de criar uma **vitrine de portfólios** durante a **oficina de DIW**. Este projeto nasceu inspirado no trabalho dele. Valeu, Ryan! 👏

### 🔗 Referências

**Ryan Ferreira**

- 🌐 Portfólio: [ryanferreira.dev](https://www.ryanferreira.dev/)
- :octocat: GitHub: [@ferreiraryan](https://github.com/ferreiraryan)

**Projeto que inspirou esta vitrine**

- :octocat: Repositório: [ferreiraryan/portifolios-DIW](https://github.com/ferreiraryan/portifolios-DIW)
- ☁️ Site: [portifolios-diw.vercel.app](https://portifolios-diw.vercel.app/)

Esta versão foi reescrita em React com JavaScript e ganhou a busca por nome, os links de GitHub e de repositório de cada aluno e a faixa do professor orientador.

### 🎓 Orientador

- Prof. Dr. João Paulo Aramuni: [aramuni.dev](https://aramuni.dev) · [GitHub](https://github.com/joaopauloaramuni) · [joaopauloaramuni-portfolio](https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio)

## 👥 Portfólios dos alunos

| Aluno | Portfólio | GitHub | Repositório |
| --- | --- | --- | --- |
| Abner Almeida | [abneralmeida.dev](https://abneralmeida.dev) | [abneralmeidacord](https://github.com/abneralmeidacord) | [abneralmeida-portfolio](https://github.com/abneralmeidacord/abneralmeida-portfolio) |
| Armando Moreira | [armandosmoreira.dev](https://armandosmoreira.dev) | [Armando-Schoenstatt](https://github.com/Armando-Schoenstatt) | [PortifolioDiaw](https://github.com/Armando-Schoenstatt/PortifolioDiaw) |
| Arthur Bicalho Angelo | [bicalho.dev](https://bicalho.dev) | [Arthur-Bicalho](https://github.com/Arthur-Bicalho) | [bicalho-portfolio](https://github.com/Arthur-Bicalho/bicalho-portfolio) |
| Arthur Domingos | [arthurdomingos.dev](https://arthurdomingos.dev) | [thuzada](https://github.com/thuzada) | [LAB1-DIW](https://github.com/thuzada/LAB1-DIW) |
| Arthur Gabriel | [arthurgabriel.dev](https://arthurgabriel.dev) | [arturity7](https://github.com/arturity7) | [arthur-portifolio](https://github.com/arturity7/arthur-portifolio) |
| Arthur Moraes | [arthurmoraes.dev](https://arthurmoraes.dev) | [ArthurMoraesBraga](https://github.com/ArthurMoraesBraga) | [Portfolio](https://github.com/ArthurMoraesBraga/Portfolio) |
| Artur Bomtempo | [arturbomtempo.dev](https://arturbomtempo.dev) | [arturbomtempo-dev](https://github.com/arturbomtempo-dev) | [portfolio](https://github.com/arturbomtempo-dev/portfolio) |
| Bernardo Guedes | [bernardoguedes.dev](https://bernardoguedes.dev) | [Bernardo-Guedes](https://github.com/Bernardo-Guedes) | [portfolio](https://github.com/Bernardo-Guedes/portfolio) |
| Carolina Souza | [carolinasouza.dev](https://carolinasouza.dev) | [Carolinasouza456](https://github.com/Carolinasouza456) | [portf-lio-profissional](https://github.com/Carolinasouza456/portf-lio-profissional) |
| Daniel Oliveira | [danielolv.dev](https://danielolv.dev) | [Danielolv14](https://github.com/Danielolv14) | [portfolio-3d](https://github.com/Danielolv14/portfolio-3d) |
| Davi Campolina Rocha | [davirocha.dev](https://www.davirocha.dev) | [davicampolina](https://github.com/davicampolina) | [DIW-LAB1](https://github.com/davicampolina/DIW-LAB1) |
| Davi Sollar | [davisollar.me](https://davisollar.me) | [HyperSonic3608](https://github.com/HyperSonic3608) | [portfolio](https://github.com/HyperSonic3608/portfolio) |
| David Aurélio | [dvdaurelio.dev](https://dvdaurelio.dev) | [DavidAurelio07](https://github.com/DavidAurelio07) | [Portfolio](https://github.com/DavidAurelio07/Portfolio) |
| Diego Portella | [diegoportella.dev](https://diegoportella.dev) | [diegovitorportella](https://github.com/diegovitorportella) | [portifolio-profissional-dportella](https://github.com/diegovitorportella/portifolio-profissional-dportella) |
| Eli Dias | [elidias.dev](https://elidias.dev) | [elijuniordd](https://github.com/elijuniordd) | [portfolio](https://github.com/elijuniordd/portfolio) |
| Emanuel Phillipe | [space.emanuelphillipe.com](https://space.emanuelphillipe.com) | [emanuel-phillipe](https://github.com/emanuel-phillipe) | [space-emanuel](https://github.com/emanuel-phillipe/space-emanuel) |
| Enzo Fernandes | [enzofernandesnz.dev](https://enzofernandesnz.dev) | [enzofernandesnz](https://github.com/enzofernandesnz) | [portfolio-nz](https://github.com/enzofernandesnz/portfolio-nz) |
| Evelyn Costa | [evelyncosta.dev](https://evelyncosta.dev) | [Evycostzocn](https://github.com/Evycostzocn) | [PortfolioProfissional](https://github.com/Evycostzocn/PortfolioProfissional) |
| Fernando Leite Pagani | [fernandoleitepagani.dev](https://fernandoleitepagani.dev) | [fernandoleitepagani](https://github.com/fernandoleitepagani) | [fernandoleitepagani-portfolio](https://github.com/fernandoleitepagani/fernandoleitepagani-portfolio) |
| Francisco Filipe | [franciscofilipeee.dev](https://franciscofilipeee.dev) | [franciscofilipeee](https://github.com/franciscofilipeee) | [portfolio](https://github.com/franciscofilipeee/portfolio) |
| Guilherme Presot | [presot.dev](https://presot.dev) | [gpresot](https://github.com/gpresot) | [Portif-lio](https://github.com/gpresot/Portif-lio) |
| Gustavo Ryan Gomes Guedes | [gustavoryan.me](https://www.gustavoryan.me) | [gustavoryandev](https://github.com/gustavoryandev) | [Portfolio-Profissional-Interativo](https://github.com/gustavoryandev/Portfolio-Profissional-Interativo) |
| João Mário | [joaomario.dev](https://joaomario.dev) | [joaomariofm](https://github.com/joaomariofm) | [portfolio-website](https://github.com/joaomariofm/portfolio-website) |
| João Paulo Rodrigues | [jprodrigues.me](https://jprodrigues.me) | [joaopauloferreirarodrigues](https://github.com/joaopauloferreirarodrigues) | [jprodrigues.me](https://github.com/joaopauloferreirarodrigues/jprodrigues.me) |
| João Pedro Dantas | [joaodantas.dev](https://joaodantas.dev) | [joaodantas-eng](https://github.com/joaodantas-eng) | [portfolio](https://github.com/joaodantas-eng/portfolio) |
| Kelvin Mendes | [md101.dev](https://md101.dev) | [Md1o1](https://github.com/Md1o1) | [portfolio](https://github.com/Md1o1/portfolio) |
| Keven Lino | [kevenlino.me](https://kevenlino.me) | [Tuzfi](https://github.com/Tuzfi) | [Portfolio](https://github.com/Tuzfi/Portfolio) |
| Larissa Cravo | [l4r1ss4cr4v0.dev](https://l4r1ss4cr4v0.dev) | [L4r1ss4Cr4v0](https://github.com/L4r1ss4Cr4v0) | [Portifolio-Dev](https://github.com/L4r1ss4Cr4v0/Portifolio-Dev) |
| Leonardo Martins | [leomartinsdev.me](https://leomartinsdev.me) | [leomartinsdev](https://github.com/leomartinsdev) | [leomartinsdev.github.io](https://github.com/leomartinsdev/leomartinsdev.github.io) |
| Leonardo Pettersen | [leopettersen.dev](https://leopettersen.dev) | [leopettersen](https://github.com/leopettersen) | [portfolio](https://github.com/leopettersen/portfolio) |
| Leticia Abreu | [leticias.dev](https://leticias.dev) | [xabreuleticia](https://github.com/xabreuleticia) | [portfolio-profissional](https://github.com/xabreuleticia/portfolio-profissional) |
| Lucas Dias Melo | [lucasdiasm.dev](https://lucasdiasm.dev) | [lucasdiasmz](https://github.com/lucasdiasmz) | [lucas-portfolio](https://github.com/lucasdiasmz/lucas-portfolio) |
| Lucas Gomes | [lukasgomes.dev](https://lukasgomes.dev) | [LukasGom3s](https://github.com/LukasGom3s) | [LukasGomesPortfolio](https://github.com/LukasGom3s/LukasGomesPortfolio) |
| Lucas Mafia | [lucasmaf.ia.br](https://lucasmaf.ia.br) | [lucasomafia](https://github.com/lucasomafia) | [Meu-Portfolio](https://github.com/lucasomafia/Meu-Portfolio) |
| Marcelo Gomes | [engsoftmarcelo.dev](https://engsoftmarcelo.dev) | [engsoftmarcelo](https://github.com/engsoftmarcelo) | [engsoftmarcelo](https://github.com/engsoftmarcelo/engsoftmarcelo) |
| Matheus Campos | [matheuscamp.dev](https://matheuscamp.dev) | [Matheuscamp](https://github.com/Matheuscamp) | [MyPortfolio](https://github.com/Matheuscamp/MyPortfolio) |
| Nicolas de Almeida | [nicolasdealmeida.dev](https://nicolasdealmeida.dev) | [Nicolas-De-Almeida](https://github.com/Nicolas-De-Almeida) | [portfolio](https://github.com/Nicolas-De-Almeida/portfolio) |
| Paulo César | [paulo-cesar.dev](https://paulo-cesar.dev) | [PauloCesar0709](https://github.com/PauloCesar0709) | [portfolio-paulocesar](https://github.com/PauloCesar0709/portfolio-paulocesar) |
| Pedro Felipe Bastos | [pedrobastos.dev](https://pedrobastos.dev) | [pedrobastosdev](https://github.com/pedrobastosdev) | [pedrobastosdev.github.io](https://github.com/pedrobastosdev/pedrobastosdev.github.io) |
| Pedro Flausino | [flausino.dev](https://flausino.dev) | [PedroFlau](https://github.com/PedroFlau) | [pedroflausino-portifolio](https://github.com/PedroFlau/pedroflausino-portifolio) |
| Ryan Ferreira | [ryanferreira.dev](https://ryanferreira.dev) | [ferreiraryan](https://github.com/ferreiraryan) | [portfolio](https://github.com/ferreiraryan/portfolio) |
| Samuel Ferreira | [sferreira.dev](https://sferreira.dev) | [SamuelFerr0](https://github.com/SamuelFerr0) | [SamuelFerreira_Portifolio](https://github.com/SamuelFerr0/SamuelFerreira_Portifolio) |
| Samuel Matos | [samuelmatos.dev](https://samuelmatos.dev) | [SamuelMatos78](https://github.com/SamuelMatos78) | [portfolio](https://github.com/SamuelMatos78/portfolio) |
| Sophia Fernandes | [sophiafernandes.dev](https://sophiafernandes.dev) | [sophiafernandesc](https://github.com/sophiafernandesc) | [sophiafernandes-portfolio](https://github.com/sophiafernandesc/sophiafernandes-portfolio) |
| Victor Cândido Leite | [victorcandido.dev](https://victorcandido.dev) | [thevictorcandido](https://github.com/thevictorcandido) | [portfolio-victor](https://github.com/thevictorcandido/portfolio-victor) |
| Warlley Silva | [warlleys.dev](https://warlleys.dev) | [warlleyz](https://github.com/warlleyz) | [portfolio-warlley](https://github.com/warlleyz/portfolio-warlley) |

## 📚 Página de tutoriais

A aba **Tutoriais** (endereço `#tutoriais`) reúne quatro passo a passos para os alunos:

1. **GitHub Student Developer Pack**: selo GitHub Pro e benefícios gratuitos;
2. **Domínios .dev e .me**: registro no Name.com (`.dev`) ou na Namecheap (`.me`) e configuração do DNS na Vercel;
3. **GitHub Pages**: publicação de sites HTML, CSS e JS (projetos React/Vite vão na Vercel);
4. **Deploy na Vercel**: importação pelo GitHub, template Vite e troca de domínio.

Cada tutorial tem link próprio, como `#tutoriais-dominios`. A navegação usa só o hash da URL, sem biblioteca de rotas. Os textos ficam em `src/pages/Tutoriais/conteudo/`.

## 🖼️ Capturas de Tela

| Tema claro | Tema escuro |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/Home.png?v=4) | ![HomeEscuro](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/HomeEscuro.png?v=4) |

| Busca pelo nome | Busca sem resultado |
| :---: | :---: |
| ![Busca](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/Busca.png?v=4) | ![BuscaVazia](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/BuscaVazia.png?v=4) |

| Preview do portfólio |
| :---: |
| ![Preview](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/Preview.png?v=4) |

| Página inteira | Celular |
| :---: | :---: |
| ![HomeCompleta](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/HomeCompleta.png?v=4) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/VitrinePortfolios/imgs/Mobile.png?v=4) |

> 📸 As capturas são geradas pelo `npm run screenshots` (veja abaixo) e ficam em `imgs/`.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Não precisa configurar nada.

## ➕ Como adicionar ou editar um portfólio

Todos os alunos ficam em `src/data/portfolios.js`. Cada aluno é um objeto:

```js
{
  id: "fulano",                     // nome da captura: public/previews/fulano.png
  nome: "Fulano de Tal",            // a busca usa este campo
  site: "https://fulano.dev",
  vercel: "https://fulano-portfolio.vercel.app", // endereço .vercel.app (ou "")
  github: "fulano",                 // usuário do GitHub (ou null)
  repo: "fulano-portfolio",         // repositório do portfólio (ou null)
  embeddable: true,                 // false se o site bloqueia iframe
},
```

1. Adicione ou edite o objeto no arquivo.
2. Gere as capturas de novo: `npm run previews` (tira a foto de **todos**, inclusive do aluno novo).
3. Faça o commit: a Vercel publica sozinha.

A turma aparece em **ordem alfabética**, então a posição no arquivo não importa. Os textos do topo (disciplinas, semestre, campi e professor) ficam em `src/config/vitrineConfig.js`.

> 🔒 **`embeddable: false`**: alguns sites mandam o cabeçalho `X-Frame-Options: DENY` (ou `SAMEORIGIN`), ou uma CSP com `frame-ancestors`, e o navegador se recusa a mostrá-los dentro de um `iframe`. Para esses, o preview já abre na aba **Captura**.

## 📸 Atualizando as capturas dos portfólios (`npm run previews`)

```bash
npx playwright install chromium   # só na primeira vez
npm run previews
```

O script `scripts/previews.mjs` abre o site de **todos** os alunos (e o do professor) num Chromium sem janela (1280×800), espera as animações de entrada e salva em `public/previews/<id>.png`.

Ele sempre captura todos de novo, no mesmo tamanho e no mesmo momento: quando você inclui um aluno novo, os outros também são atualizados, caso tenham mudado o layout. Se um site não abrir, a captura antiga dele (se existir) é mantida e o script avisa no final quais falharam.

Aluno sem captura aparece com um cartão com o domínio até você rodar o script. Depois de rodar, faça o commit da pasta `public/previews`.

## 📸 Gerando as capturas de tela (`npm run screenshots`)

```bash
npx playwright install chromium   # só na primeira vez
npm run screenshots
```

O script `scripts/screenshots.mjs` sobe o próprio servidor do Vite, abre a vitrine num Chromium sem janela e salva em `imgs/`: `Home`, `HomeCompleta`, `HomeEscuro`, `Busca`, `BuscaVazia`, `Preview` e `Mobile`.

Depois é só copiar a pasta para o repositório das imagens do GitHub Pages, em `react-imgs/VitrinePortfolios/imgs/`, que é de onde este README carrega as capturas.

> 💡 `CHROMIUM_PATH` (opcional) aponta para um Chrome/Chromium já instalado, nos dois scripts.

## ☁️ Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Em **Project Name**, use `vitrine-portfolios` (vira `vitrine-portfolios.vercel.app`).
4. Clique em **Deploy**.

Não há variáveis de ambiente para cadastrar.

## ⚙️ Como funciona

### 1. Os dados (`src/data/portfolios.js` + `src/config/vitrineConfig.js`)

A lista da turma é um array JavaScript importado direto pelo `App.jsx`: não há `fetch` nem carregamento. O professor fica separado, em `vitrineConfig.js`, para aparecer no cabeçalho e não na grade.

### 2. A busca (`src/utils/portfolio.js`)

O texto digitado e o nome de cada aluno passam pela mesma função, que tira os acentos (`normalize("NFD")`) e as maiúsculas. Assim, `cesar` acha **Paulo César** e `CANDIDO` acha **Victor Cândido Leite**. O filtro roda num `useMemo` a cada letra.

### 3. As capturas (`src/components/PreviewImage`)

Cada card mostra `public/previews/<id>.png`, gerada pelo `npm run previews`. Se o arquivo não existir, o `onError` da `<img>` troca a imagem por um cartão com o domínio do aluno.

### 4. O preview (`src/components/PreviewModal`)

- **Site ao vivo**: `iframe` com `sandbox` (scripts, popups e formulários liberados) e `referrerPolicy="no-referrer"`;
- **Captura**: a mesma imagem do card, em tamanho grande, com rolagem;
- fecha com **Esc**, com o **X** ou clicando fora; o foco volta para o card que abriu o preview.

### 5. O tema (`src/components/ThemeToggle` + `src/index.css`)

As cores ficam em variáveis CSS no `:root`. O tema escuro troca essas variáveis de dois jeitos:

| Situação | O que vale |
| --- | --- |
| Sem escolha salva | Segue o sistema (`prefers-color-scheme`) |
| Clicou em **Tema escuro** | `<html data-theme="dark">`, salvo no `localStorage` (`vitrine-tema`) |
| Clicou em **Tema claro** | `<html data-theme="light">`, mesmo com o sistema escuro |

Um script pequeno no `index.html` aplica o tema salvo **antes** de a página aparecer, para ela não piscar no tema errado ao abrir.

## 📂 Estrutura do Projeto

```text
📁 VitrinePortfolios
│
├── 📁 imgs                        └── Capturas de tela usadas neste README
├── 📁 public
│   ├── 📁 previews                └── Captura de cada portfólio (<id>.png)
│   └── favicon.png                └── Ícone ".DEV" da aba do navegador
│
├── 📁 scripts
│   ├── previews.mjs               └── npm run previews: captura os portfólios
│   └── screenshots.mjs            └── npm run screenshots: capturas do README
│
├── 📁 src
│   ├── 📁 assets/images
│   │   ├── aramuni-logo.svg       └── Logo do professor (faixa do cabeçalho)
│   │   ├── pucminas-logo.png      └── Logo da PUC Minas (versão 2025)
│   │   ├── logo-ciencia-computacao.png  └── Logo do curso de Ciência da Computação
│   │   └── logo-engenharia-software.png └── Logo do curso de Engenharia de Software
│   │
│   ├── 🧩 components
│   │   ├── Header/                └── Logos, título e texto das disciplinas
│   │   ├── ProfessorCard/         └── Faixa compacta do professor no cabeçalho
│   │   ├── SearchBar/             └── Busca pelo nome + contagem
│   │   ├── ThemeToggle/           └── Botão Tema claro / Tema escuro
│   │   ├── PortfolioGrid/         └── Grade da turma e busca sem resultado
│   │   ├── PortfolioCard/         └── Card: domínio, captura, GitHub e repositório
│   │   ├── PreviewImage/          └── Captura local ou cartão com o domínio
│   │   ├── PreviewModal/          └── Site ao vivo (iframe) ou captura
│   │   └── Footer/                └── Agradecimento ao Ryan
│   │
│   ├── ⚙️ config/vitrineConfig.js  └── Disciplinas, semestre, campi, professor e créditos
│   ├── 📋 data/portfolios.js       └── Lista da turma
│   ├── 🛠️ utils/portfolio.js       └── Domínio, links, capturas e busca sem acento
│   ├── App.jsx                    └── Junta tudo: busca, grade e preview
│   ├── index.css                  └── Cores do brasão, tema claro/escuro
│   └── main.jsx
│
├── 📄 index.html
├── 📄 vite.config.js
└── 📄 package.json
```

## 📦 Dependências

```json
"dependencies": {
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-icons": "^5.5.0"
}
```

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones da interface (GitHub, repositório, busca, fechar, sol e lua)
- [`playwright`](https://playwright.dev/) (dev): navegador sem janela para os scripts de captura

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run previews` | Captura a página inicial de cada portfólio em `public/previews/` |
| `npm run screenshots` | Gera as capturas deste README em `imgs/` |

## 📄 Licença
Este projeto está licenciado sob a MIT License.
