# Projeto ExemploIHC (React + Vite) 🧭

## 📖 Descrição

Projeto **exemplo** da disciplina de **Interação Humano-Computador (IHC)**, feito com **React** e **Vite**. É um template com boas práticas de IHC aplicadas em telas reais, para servir de ponto de partida nos trabalhos da turma.

O domínio é o estudo de caso da Aula 11, o **Sistema de Controle de Recursos Audiovisuais** da PUC Minas: alunos reservam data show, microfone e caixa de som; o setor audiovisual confirma ou rejeita; a coordenação cadastra os equipamentos. Não há back-end: os dados ficam no `localStorage` do navegador.

Telas:

- **Início** orientado a tarefas, com a ação principal em destaque
- **Recursos**, com busca, filtros na URL, skeleton e estado vazio
- **Cadastrar recurso**, que implementa a lista de campos e comandos do slide, com validação acessível
- **Reservar recurso**, formulário em 4 etapas com rascunho salvo automaticamente
- **Confirmar reservas**, tabela que vira cartões no celular, com diálogo de confirmação e **Desfazer**
- **Detalhes da reserva**, com **Imprimir** e CSS de impressão
- **Guia de estilo**, o design system documentado (cores, contraste, tipografia, componentes, voz e tom, decisões)
- **Boas práticas**, que liga cada conteúdo das aulas à tela e ao arquivo onde ele está aplicado
- **Página não encontrada**, que oferece caminhos em vez de “Error 404”

## 🖼️ Capturas de Tela

| Início | Recursos |
| :---: | :---: |
| ![Início](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/Home.png) | ![Recursos](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/Recursos.png) |

| Cadastrar recurso | Resumo de erros |
| :---: | :---: |
| ![Cadastrar recurso](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/CadastroRecurso.png) | ![Resumo de erros](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/CadastroRecursoErros.png) |

| Reservar (etapa 2) | Reservar (revisão) |
| :---: | :---: |
| ![Reservar](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/NovaReserva.png) | ![Revisão](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/NovaReservaRevisao.png) |

| Confirmar reservas | Diálogo de confirmação |
| :---: | :---: |
| ![Confirmar reservas](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/ConfirmarReservas.png) | ![Diálogo](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/DialogoRejeitar.png) |

| Detalhes da reserva | Tema escuro |
| :---: | :---: |
| ![Detalhes](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/DetalhesReserva.png) | ![Tema escuro](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/TemaEscuro.png) |

| Guia de estilo (`/guia-de-estilo`) | Boas práticas (`/boas-praticas`) |
| :---: | :---: |
| ![Guia de estilo](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/GuiaEstilo.png) | ![Boas práticas](https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/BoasPraticas.png) |

| Mobile: início | Mobile: reserva | Mobile: confirmar |
| :---: | :---: | :---: |
| <img src="https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/Mobile.png" alt="Mobile início" width="260"/> | <img src="https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/MobileReserva.png" alt="Mobile reserva" width="260"/> | <img src="https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs/MobileReservas.png" alt="Mobile confirmar" width="260"/> |

> As imagens ficam na pasta [`imgs/`](imgs) deste projeto e são servidas pelo GitHub Pages. Para usar no seu fork, publique a pasta no seu GitHub Pages e troque a URL base `https://joaopauloaramuni.github.io/react-imgs/ExemploIHC/imgs` (um “localizar e substituir” no README resolve). Para gerar as capturas de novo, veja [Scripts](#-scripts).

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Para voltar aos dados iniciais, use **Restaurar dados de exemplo** no rodapé.

## 🧭 Rotas

| Rota | Tela | Conteúdo da disciplina em destaque |
| --- | --- | --- |
| `/` | Início | Tarefas (Aula 9), 60-30-10 (Aula 13) |
| `/recursos` | Lista de recursos | GOMS: dois métodos para o mesmo objetivo (Aula 9), skeleton (Aula 18) |
| `/recursos/novo` | Cadastrar recurso | Lista de campos e comandos (Aula 11), formulários acessíveis (Aula 17) |
| `/reservar` | Reservar recurso | HTA → etapas (Aula 9), formulário mobile (Aula 18) |
| `/reservas` | Confirmar reservas | Caso de uso (Aula 11), prevenção de erros e Desfazer (Nielsen) |
| `/reservas/:id` | Detalhes da reserva | Tela 2 do caso de uso (Aula 11) |
| `/guia-de-estilo` | Guia de estilo | Design system, style guide e handoff (Aula 16), cores (13), fontes (12) |
| `/boas-praticas` | Boas práticas | Mapa de todo o conteúdo |
| `*` | Página não encontrada | Nielsen #9 |

## 🎓 Boas práticas de IHC aplicadas

A lista completa, com link para cada tela, está na página **`/boas-praticas`** (gerada a partir de [`src/config/boasPraticas.js`](src/config/boasPraticas.js)). Resumo:

| Aula | Prática | Onde |
| --- | --- | --- |
| 8 · Design Thinking | Desafio, mapa de empatia, ponto de vista, ideação, roteiro de teste | [`docs/01-design-thinking.md`](docs/01-design-thinking.md) |
| 9 · Tarefas | HTA e GOMS das tarefas principais; telas seguem a decomposição | [`docs/02-analise-de-tarefas.md`](docs/02-analise-de-tarefas.md), `NovaReserva.jsx` |
| 11 · Requisitos de interface | Lista de campos (nome, descrição, valores válidos, formato, tipo, restrições) e de comandos | [`docs/03-requisitos-de-interface.md`](docs/03-requisitos-de-interface.md), `CadastroRecurso.jsx` |
| 12 · Fontes | Uma família sem serifa, 16px, entrelinha 1,5, escala modular em `rem`, controle **A- / A+** | `index.css`, `ControleFonte.jsx` |
| 13 · Cores | 60-30-10, contraste AA calculado, cores semânticas com ícone, tema escuro | `index.css`, `/guia-de-estilo` |
| 16 · Design system | Tokens em variáveis CSS, componentes reutilizáveis, guia vivo com decisões | `src/components/`, `designSystem.js` |
| 17 · Acessibilidade | POUR, teclado, foco visível, pular conteúdo, `aria-live`, `<dialog>`, foco no `h1` a cada rota | [`docs/04-acessibilidade.md`](docs/04-acessibilidade.md) |
| 18 · Mobile | Navegação inferior na zona do polegar, alvos de 44px, etapas, teclados certos, rascunho salvo | `MenuMobile.jsx`, `useRascunho.js` |
| Extra · Nielsen | As 10 heurísticas, cada uma com um exemplo no sistema | `/boas-praticas#nielsen` |

### Para usar como template

1. Troque o domínio em `src/data/seed.js` e os textos em `src/config/appConfig.js`.
2. Ajuste as cores e fontes em `src/index.css` **e** em `src/config/designSystem.js` (mudou num, mude no outro).
3. Reescreva os arquivos de `docs/` com a pesquisa, a análise de tarefas e os requisitos do seu projeto.
4. Mantenha os componentes de `src/components/`: eles já trazem acessibilidade e estados prontos.
5. Atualize `src/config/boasPraticas.js` para a página `/boas-praticas` refletir o seu projeto.

## 📂 Estrutura do Projeto

```
📁 ExemploIHC
├── 📁 docs                              ← 📝 artefatos de IHC (modelos para o seu trabalho)
│   ├── 01-design-thinking.md            ← desafio, mapa de empatia, ponto de vista, roteiro de teste
│   ├── 02-analise-de-tarefas.md         ← HTA (Mermaid) e GOMS das tarefas principais
│   ├── 03-requisitos-de-interface.md    ← lista de campos e comandos de cada tela + esboço
│   └── 04-acessibilidade.md             ← checklist WCAG 2.2 (POUR) e como testar
├── 📁 imgs                              ← 🖼️ capturas de tela do README (GitHub Pages)
├── 📁 public
│   └── 🖼️ favicon.png                   ← logo PUC sobre azul (aba e atalho no celular)
├── 📁 scripts
│   └── screenshots.mjs                  ← gera as capturas de imgs/ com o Playwright
├── 📁 src
│   ├── 📁 assets/images
│   │   └── 🖼️ pucminas-logo.png          ← logo branca do cabeçalho
│   ├── 📁 components                    ← 🧱 componentes do design system
│   │   ├── Alerta/                      ← mensagens de sucesso, erro, atenção e informação
│   │   ├── Breadcrumb/                  ← trilha "Você está em"
│   │   ├── Button/                      ← variantes destaque, primário, secundário, fantasma, perigo; estado carregando
│   │   ├── CabecalhoPagina/             ← trilha + h1 + descrição + ações (igual em toda página)
│   │   ├── Campo/                       ← CampoTexto, CampoSelecao, CampoAreaTexto + layout de formulário
│   │   ├── ControleFonte/               ← A- / 100% / A+
│   │   ├── DialogoConfirmacao/          ← <dialog> nativo para ações destrutivas
│   │   ├── EstadoVazio/                 ← tela vazia com explicação e próximo passo
│   │   ├── Footer/                      ← rodapé + "Restaurar dados de exemplo"
│   │   ├── Header/                      ← faixa azul PUC + navegação desktop
│   │   ├── Layout/                      ← pular para o conteúdo, header, main, footer
│   │   ├── MenuMobile/                  ← barra inferior do celular
│   │   ├── ResumoErros/                 ← resumo de erros com links para os campos
│   │   ├── Skeleton/                    ← carregamento com a forma do conteúdo
│   │   ├── StatusBadge/                 ← Pendente / Confirmada / Rejeitada (cor + ícone + texto)
│   │   ├── Stepper/                     ← etapas do formulário
│   │   ├── ThemeToggle/                 ← tema claro / escuro
│   │   └── Toast/                       ← avisos com "Desfazer"
│   ├── 📁 config
│   │   ├── appConfig.js                 ← nome do sistema e menu (usado no desktop e no celular)
│   │   ├── boasPraticas.js              ← conteúdo da página /boas-praticas
│   │   └── designSystem.js              ← tokens documentados para a página /guia-de-estilo
│   ├── 📁 context
│   │   ├── ToastProvider.jsx            ← fila de avisos numa região aria-live
│   │   └── toastContext.js              ← hook useToast()
│   ├── 📁 data
│   │   └── seed.js                      ← unidades, categorias, tipos, recursos e reservas iniciais
│   ├── 📁 hooks
│   │   ├── useAvisoAoSair.js            ← pergunta antes de fechar a aba com dados não salvos
│   │   ├── usePaginaTitulo.js           ← título da aba + foco no h1 a cada rota
│   │   └── useRascunho.js               ← formulário salvo automaticamente
│   ├── 📁 pages                         ← 📄 uma página por rota
│   │   ├── BoasPraticas/
│   │   ├── CadastroRecurso/
│   │   ├── ConfirmarReservas/
│   │   ├── DetalhesReserva/
│   │   ├── GuiaEstilo/
│   │   ├── Home/
│   │   ├── NaoEncontrada/
│   │   ├── NovaReserva/
│   │   └── Recursos/
│   ├── 📁 services                      ← "back-end" simulado no localStorage
│   │   ├── recursoService.js
│   │   └── reservaService.js
│   ├── 📁 utils
│   │   ├── contraste.js                 ← razão de contraste WCAG
│   │   ├── datas.js                     ← datas em dd/mm/aaaa
│   │   ├── icones.js                    ← ícone de cada tipo de recurso
│   │   ├── storage.js                   ← localStorage com try/catch
│   │   └── validacao.js                 ← regras e mensagens de erro dos formulários
│   ├── App.jsx                          ← rotas
│   ├── index.css                        ← 🎨 tokens do design system (cores, fontes, espaços) e estilos base
│   └── main.jsx                         ← BrowserRouter + ToastProvider
├── index.html                           ← lang="pt-BR", fonte Montserrat, tema salvo aplicado antes de desenhar
├── package.json
├── vercel.json                          ← rewrite para as rotas do React Router
└── vite.config.js
```

## 🎨 Design system

A página **`/guia-de-estilo`** (link no menu e no rodapé) documenta a identidade visual e o porquê de cada decisão, no mesmo espírito das páginas de design dos projetos DronesDTI, PalpiteDTI e AraCoffee. Tem botão **Salvar em PDF** (impressão do navegador com CSS de impressão).

| Token | Valor | Uso |
| --- | --- | --- |
| `--brand` | `#005380` | Azul PUC (30%): cabeçalho, botões primários, links |
| `--accent` | `#F2A900` | Âmbar (10%): só a ação principal da tela |
| `--background` / `--surface` | `#F5F7F9` / `#FFFFFF` | Neutras (60%) |
| `--foreground` / `--muted` | `#14202B` / `#4B5B6B` | Texto principal e de apoio |
| `--font-family` | Montserrat + fontes do sistema | Toda a interface |
| `--text-base` | `1rem` (16px) | Corpo; escala 1,25 até `--text-3xl` |
| `--space-1` … `--space-7` | 4px … 64px | Grid de 8 pontos |
| `--touch-target` | `44px` | Altura mínima de botões e campos |

Os valores ficam em [`src/index.css`](src/index.css) (variáveis CSS usadas pelos componentes) e em [`src/config/designSystem.js`](src/config/designSystem.js) (documentação exibida na página).

## ♿ Testando a acessibilidade

1. Navegue só com o teclado: o primeiro **Tab** mostra “Pular para o conteúdo”.
2. Rode o **Lighthouse** (DevTools › Lighthouse › Acessibilidade).
3. Teste com um leitor de tela (NVDA, VoiceOver ou TalkBack): a cada página, o título é anunciado.
4. Use **A+** até 150% e o zoom do navegador em 200%.
5. Simule daltonismo em DevTools › Rendering › *Emulate vision deficiencies*.

O checklist completo está em [`docs/04-acessibilidade.md`](docs/04-acessibilidade.md).

## ☁️ Deploy no Vercel

O `vercel.json` já redireciona todas as rotas para o `index.html`, então os links diretos (ex.: `/reservas/R-1024`) funcionam. Basta importar o repositório no Vercel com o preset **Vite**.

## 📦 Dependências

| Pacote | Para quê |
| --- | --- |
| `react`, `react-dom` | Interface |
| `react-router-dom` | Rotas e filtros na URL |
| `react-icons` | Ícones Feather (uma só biblioteca, traço uniforme) |
| `vite`, `@vitejs/plugin-react` | Build e servidor de desenvolvimento |
| `oxlint` | Lint (padrão do template atual do Vite) |
| `playwright` | Só para o script de capturas de tela |

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint |
| `npm run screenshots` | Gera as capturas em `imgs/` (com o `npm run dev` rodando; na 1ª vez rode `npx playwright install chromium`) |

## 📚 Referências

- Barbosa, S. D. J. et al. *Interação humano-computador e experiência do usuário*. Rio de Janeiro, 2021.
- Material didático das aulas de IHC da Profa. Joana Souza (PUC Minas).
- W3C. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) e [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/).
- Nielsen, J. [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/).
- [GOV.UK Design System](https://design-system.service.gov.uk/) (padrão de resumo de erros).

## 📄 Licença

Este projeto é de uso livre para fins educacionais (MIT).
