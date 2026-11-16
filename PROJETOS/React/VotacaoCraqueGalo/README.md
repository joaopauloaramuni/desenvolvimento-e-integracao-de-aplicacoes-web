# 🐓 Projeto Votação Craque do Jogo: Galo 2026

Aplicação React + Vite para a votação do **Craque do Jogo** do **Atlético Mineiro**. Depois da vitória por **3 x 1 sobre o Cruzeiro na Arena MRV**, **quatro jogadores** foram indicados ao prêmio e o torcedor vota em quem jogou mais: o **mais votado** é o Craque do Jogo. O usuário seleciona um indicado, confirma o voto, acompanha o histórico dos votos da sessão e vê a parcial com o total de votos, o percentual de cada jogador e a vantagem de quem lidera sobre o segundo colocado. Os votos ficam salvos no `localStorage` do navegador.

---

### Captura de Tela

- **Home**: Exibe o cabeçalho com o escudo do Galo e o menu (Início, Votar, Resultado). Logo abaixo aparece o escudo dentro de um círculo listrado, com um balão de fala trazendo o placar do jogo e os botões **Votar no craque** e **Ver parcial**. No fim da página, uma faixa mostra os 4 indicados (foto, número e nome) e o nome do jogador **suspenso**, que não entrou em campo.
- **Votação**: Os 4 indicados aparecem em 4 colunas, com borda dourada e o selo **Indicado**, cada um com foto vertical, número da camisa, nome, posição e o botão **Selecionar**. O card selecionado ganha contorno verde, "sobe" um pouco e o botão muda para **✓ Selecionado**. A barra de confirmação mostra quem vai receber o voto e o botão **Confirmar voto** só fica habilitado quando há alguém selecionado. Após confirmar, a seleção é limpa e o **histórico da sessão** lista, em ordem, todos os votos dados. Abaixo, aparecem o jogador **suspenso** (selo amarelo) e a grade com os demais jogadores do elenco, em preto e branco e sem botão.
- **Resultado**: Mostra o total de votos computados, uma faixa com a situação da **disputa pela liderança** (quantos votos de vantagem o 1º tem sobre o 2º, ou aviso de empate) e o placar dos 4 indicados com posição, foto, barra de progresso, percentual e quantidade de votos. O mais votado recebe o selo **Craque do jogo** (dourado) e o segundo, o selo **Vice** (prata). Os botões **Desfazer último voto** e **Zerar votação** alteram a contagem. Quando não há votos, uma mensagem convida o usuário a votar.
- **Tela estreita**: Em telas de até 900px, a grade dos indicados passa para 2 colunas; em até 520px, para 1 coluna.

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoCraqueGalo/imgs/01_home.png" alt="Home" width="1000"/> |
|:----------------------------------------------------:|
|                        Home                          |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoCraqueGalo/imgs/03_votacao.png" alt="Votação" width="1000"/> |
|:----------------------------------------------------:|
|                       Votação                        |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoCraqueGalo/imgs/04_voto_registrado.png" alt="Voto registrado" width="1000"/> |
|:----------------------------------------------------:|
|        Jogador selecionado e histórico da sessão     |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoCraqueGalo/imgs/05_resultado.png" alt="Resultado" width="1000"/> |
|:----------------------------------------------------:|
|                      Resultado                       |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoCraqueGalo/imgs/02_resultado_vazio.png" alt="Resultado sem votos" width="1000"/> |
|:----------------------------------------------------:|
|                 Resultado sem votos                  |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoCraqueGalo/imgs/06_votacao_tablet.png" alt="Votação em tela estreita" width="600"/> |
|:----------------------------------------------------:|
|           Votação em tela estreita (2 colunas)       |

---

## 📁 Estrutura do projeto

```
📁 VotacaoCraqueGalo
│
├── 📁 public
│   ├── 🛡️ escudo-galo.svg
│   │   └── Escudo do Atlético usado no cabeçalho, na Home e como favicon
│   ├── 🔤 fonts
│   │   └── Fontes Saira e Saira Condensed (funcionam sem internet)
│   └── 📁 jogadores
│       └── Fotos dos 32 jogadores do elenco (ex.: everson.webp, gustavo-scarpa.webp, renan-lodi.webp)
│
├── 📁 src
│   │
│   ├── 📊 data
│   │   └── jogadores.js
│   │       └── Lista de jogadores (id, nome, numero, posicao, foto, situacao)
│   │
│   ├── ⚙️ services
│   │   └── votacaoService.js
│   │       └── Serviço responsável por listar jogadores, registrar, desfazer e contabilizar votos
│   │
│   ├── 🧩 components
│   │   ├── Header.jsx
│   │   │   └── Cabeçalho com escudo e menu de navegação (NavLink)
│   │   └── JogadorCard.jsx
│   │       └── Card de um jogador, com selo por situação e estado de selecionado
│   │
│   ├── 📄 pages
│   │   ├── Home.jsx
│   │   │   └── Página inicial com o escudo, o placar do jogo, os indicados e o suspenso
│   │   ├── Votacao.jsx
│   │   │   └── Seleção + confirmação do voto no craque e histórico da sessão
│   │   └── Resultado.jsx
│   │       └── Placar, disputa pela liderança, desfazer último voto e zerar votação
│   │
│   ├── 🚀 App.jsx
│   │   └── Componente raiz com o BrowserRouter, o Header, as rotas e o redirecionamento (*)
│   ├── 🎨 App.css
│   │   └── Estilização dos cards, grades responsivas, seleção, barra fixa e placar
│   ├── 🎨 index.css
│   │   └── Estilos globais: fontes, cores alvinegras, fundo listrado, botões, cabeçalho e Home
│   └── main.jsx
│       └── Ponto de entrada da aplicação (renderiza o App)
│
├── 🌐 index.html
├── 📄 package.json
│   └── Dependências e scripts do npm
└── ⚡ vite.config.js
```

---

## 📦 Dependências

```bash
npm create vite@latest VotacaoCraqueGalo -- --template react
cd VotacaoCraqueGalo
npm install
npm install react-router-dom react-icons
npm run dev
```

- **react / react-dom**: biblioteca de componentes e renderização no navegador
- **vite**: servidor de desenvolvimento e build (`http://localhost:5173/`)
- **react-router-dom**: rotas da aplicação (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `Link`, `NavLink`)
- **react-icons**: ícones (opcional)

---

## ⚙️ `votacaoService.js`

Responsável por ler os jogadores e registrar, desfazer, guardar e contabilizar os votos no `localStorage` (chave `galo2026:craque-do-jogo`).

> **Atenção:** os votos são guardados como um **array de ids**, na ordem em que foram dados. Desta vez o **id de cada jogador é um texto** (ex.: `['everson', 'gustavo-scarpa', 'everson']`), e não um número. O **total de votos é `votos.length`** e não existe uma função para somar o total.

| Função | O que faz |
|---|---|
| `listarJogadores()` | Retorna todos os jogadores do elenco. |
| `listarPorSituacao(situacao)` | Retorna os jogadores com a situação informada: `'indicado'`, `'suspenso'` ou `'elenco'`. |
| `obterSuspenso()` | Retorna o jogador suspenso neste jogo (um único objeto) ou `null`. |
| `obterVotos()` | Lê os votos salvos no `localStorage` e devolve um array de ids. Se não houver nada salvo, devolve `[]`. |
| `registrarVoto(id)` | Acrescenta 1 voto (o id) ao final do array, salva no `localStorage` e devolve o array atualizado. Lança erro se o jogador não estiver entre os indicados. |
| `desfazerUltimoVoto()` | Remove o último voto do array, salva no `localStorage` e devolve o array atualizado. |
| `contarVotos(votos)` | Converte o array de votos em um objeto no formato `{ [id]: quantidade }`. |
| `calcularResultado(votos)` | Devolve a lista dos jogadores indicados com os campos extras `votos` e `percentual`, ordenada do **mais votado** para o **menos votado**. O **primeiro** da lista é o **Craque do Jogo** e o **segundo** é o **vice**. |
| `zerarVotos()` | Remove todos os votos do `localStorage`. |

---

## 🧭 Rotas (`App.jsx`)

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home` | Página inicial com o escudo, o balão com o placar do jogo, os indicados e o jogador suspenso. |
| `/votacao` | `Votacao` | Lista os 4 indicados com o botão **Selecionar**, a barra com o botão **Confirmar voto**, o histórico de votos da sessão, o suspenso e os demais jogadores do elenco. |
| `/resultado` | `Resultado` | Mostra o total de votos, a disputa pela liderança e o placar ordenado com posição, barra, percentual e quantidade de votos. Permite desfazer o último voto e zerar a votação. |
| `*` | `Navigate` | Qualquer outro endereço redireciona para `/` (com `replace`). |

---

## 🧩 `JogadorCard` (componente)

Recebe por **props** o objeto `jogador`, o booleano `selecionado` (padrão `false`) e, opcionalmente, a função `onSelecionar`. Exibe a foto, o número da camisa, o nome e a posição. A classe do card é montada com template string a partir da situação (`card-indicado`, `card-suspenso` ou `card-elenco`), acrescentando `card-selecionado` quando `selecionado` é `true`. O selo vem de um objeto de mapeamento (`indicado` → **Indicado**, `suspenso` → **Suspenso**; jogadores do elenco não têm selo). O botão só aparece quando `onSelecionar` é passado, alterna o texto entre **Selecionar** e **✓ Selecionado** e, ao ser clicado, chama `onSelecionar(jogador)`. É o mesmo componente usado para os indicados, o suspenso e os demais jogadores.

---

## 📊 `jogadores.js` (dados)

Array exportado por padrão com um objeto por jogador:

```js
{ id: 'gustavo-scarpa', nome: 'Gustavo Scarpa', numero: 10, posicao: 'MEI', foto: '/jogadores/gustavo-scarpa.webp', situacao: 'indicado' }
```

| `situacao` | Significado |
|---|---|
| `'indicado'` | Foi indicado ao Craque do Jogo e pode receber votos (Everson, Renan Lodi, Gustavo Scarpa e Mateo Cassierra). |
| `'suspenso'` | Cumpriu suspensão e não entrou em campo (Lyanco). |
| `'elenco'` | Demais jogadores do elenco, não podem receber votos. |

O caminho da foto começa com `/` porque os arquivos da pasta `public` são servidos na raiz da aplicação pelo Vite. As fotos são **verticais** (retrato), por isso o card usa `aspect-ratio: 3 / 4`.

---

## 🔗 Documentação e links úteis

- [React: documentação oficial](https://react.dev/learn)
- [Vite: guia](https://vite.dev/guide/)
- [React Router: documentação](https://reactrouter.com/home)
- [MDN: localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- [MDN: position sticky](https://developer.mozilla.org/pt-BR/docs/Web/CSS/position)
- [MDN: object-position](https://developer.mozilla.org/pt-BR/docs/Web/CSS/object-position)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
