# 🐓 Projeto Votação A Fazenda 2026 2: Voto para Ficar

Aplicação React + Vite para a votação da roça de **A Fazenda 2026**. Nesta semana, **quatro peões** estão na roça e o público vota para **salvar** quem deve **ficar** no programa: o **menos votado** é eliminado. O usuário seleciona um peão, confirma o voto, acompanha o histórico dos votos da sessão e vê a parcial com o total de votos, o percentual de cada participante e quantos votos faltam para quem está na zona de eliminação escapar. Os votos ficam salvos no `localStorage` do navegador.

---

### Captura de Tela

- **Home**: Exibe o cabeçalho com a logo de A Fazenda e o menu (Início, Votar, Resultado). Logo abaixo aparece o fazendeiro (de chapéu, claro) com um balão de fala e os botões **Salvar um peão** e **Ver parcial**. No fim da página, uma faixa mostra os 4 participantes que estão na roça e o nome do **Fazendeiro da semana**, que está imune.
- **Votação**: Os 4 participantes da roça aparecem em 4 colunas, com borda vermelha e o selo **Na roça**, cada um com o botão **Selecionar**. O card selecionado ganha contorno verde, "sobe" um pouco e o botão muda para **✓ Selecionado**. A barra de confirmação mostra quem vai receber o voto e o botão **Confirmar voto** só fica habilitado quando há alguém selecionado. Após confirmar, a seleção é limpa e o **histórico da sessão** lista, em ordem, todos os votos dados. Abaixo, aparecem o **Fazendeiro da semana** (selo amarelo) e a grade com os demais peões, sem botão.
- **Resultado**: Mostra o total de votos computados, uma faixa com a situação da **zona de eliminação** (quantos votos faltam para o último escapar, ou aviso de empate) e o placar dos 4 participantes da roça com posição, barra de progresso, percentual e quantidade de votos. O mais votado recebe o selo **Mais salvo** (verde) e o último, o selo **Sairia hoje** (vermelho). Os botões **Desfazer último voto** e **Zerar votação** alteram a contagem. Quando não há votos, uma mensagem convida o usuário a votar.
- **Tela estreita**: Em telas de até 900px, a grade da roça passa para 2 colunas; em até 520px, para 1 coluna.

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoFazenda_2/imgs/01_home.png" alt="Home" width="1000"/> |
|:----------------------------------------------------:|
|                        Home                          |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoFazenda_2/imgs/03_votacao.png" alt="Votação" width="1000"/> |
|:----------------------------------------------------:|
|                       Votação                        |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoFazenda_2/imgs/04_voto_registrado.png" alt="Voto registrado" width="1000"/> |
|:----------------------------------------------------:|
|          Peão selecionado e histórico da sessão      |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoFazenda_2/imgs/05_resultado.png" alt="Resultado" width="1000"/> |
|:----------------------------------------------------:|
|                      Resultado                       |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoFazenda_2/imgs/02_resultado_vazio.png" alt="Resultado sem votos" width="1000"/> |
|:----------------------------------------------------:|
|                 Resultado sem votos                  |

| <img src="https://joaopauloaramuni.github.io/react-imgs/VotacaoFazenda_2/imgs/06_votacao_tablet.png" alt="Votação em tela estreita" width="600"/> |
|:----------------------------------------------------:|
|           Votação em tela estreita (2 colunas)       |

---

## 📁 Estrutura do projeto

```
📁 VotacaoFazenda_2
│
├── 📁 public
│   ├── 🖼️ logo-fazenda.jpg
│   │   └── Logo de A Fazenda usada no cabeçalho
│   ├── 🤠 fazendeiro.jpg
│   │   └── Foto do fazendeiro exibida na Home
│   ├── 🔤 fonts
│   │   └── Fontes Rye e Nunito (funcionam sem internet)
│   └── 📁 participantes
│       └── Fotos dos 26 participantes (ex.: fran-almeida.jpg, igor-monteiro.jpg, lucas-bissoli.jpg)
│
├── 📁 src
│   │
│   ├── 📊 data
│   │   └── participantes.js
│   │       └── Lista de participantes (id, nome, foto, situacao)
│   │
│   ├── ⚙️ services
│   │   └── votacaoService.js
│   │       └── Serviço responsável por listar participantes, registrar, desfazer e contabilizar votos
│   │
│   ├── 🧩 components
│   │   ├── Header.jsx
│   │   │   └── Cabeçalho com logo e menu de navegação (NavLink)
│   │   └── ParticipanteCard.jsx
│   │       └── Card de um participante, com selo por situação e estado de selecionado
│   │
│   ├── 📄 pages
│   │   ├── Home.jsx
│   │   │   └── Página inicial com o fazendeiro, quem está na roça e o Fazendeiro da semana
│   │   ├── Votacao.jsx
│   │   │   └── Seleção + confirmação do voto para ficar e histórico da sessão
│   │   └── Resultado.jsx
│   │       └── Placar, zona de eliminação, desfazer último voto e zerar votação
│   │
│   ├── 🚀 App.jsx
│   │   └── Componente raiz com o BrowserRouter, o Header, as rotas e o redirecionamento (*)
│   ├── 🎨 App.css
│   │   └── Estilização dos cards, grades responsivas, seleção, barra fixa e placar
│   ├── 🎨 index.css
│   │   └── Estilos globais: fontes, cores, fundo de madeira, botões, cabeçalho e Home
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
npm create vite@latest VotacaoFazenda_2 -- --template react
cd VotacaoFazenda_2
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

Responsável por ler os participantes e registrar, desfazer, guardar e contabilizar os votos no `localStorage` (chave `fazenda2026:votos-ficar`).

> **Atenção:** diferente da votação anterior, os votos são guardados como um **array de ids**, na ordem em que foram dados (ex.: `[9, 12, 9, 22]`). Por isso o **total de votos é `votos.length`** e não existe uma função para somar o total.

| Função | O que faz |
|---|---|
| `listarParticipantes()` | Retorna todos os participantes da temporada. |
| `listarPorSituacao(situacao)` | Retorna os participantes com a situação informada: `'roca'`, `'fazendeiro'` ou `'peao'`. |
| `obterFazendeiro()` | Retorna o Fazendeiro da semana (um único objeto) ou `null`. |
| `obterVotos()` | Lê os votos salvos no `localStorage` e devolve um array de ids. Se não houver nada salvo, devolve `[]`. |
| `registrarVoto(id)` | Acrescenta 1 voto (o id) ao final do array, salva no `localStorage` e devolve o array atualizado. Lança erro se o participante não estiver na roça. |
| `desfazerUltimoVoto()` | Remove o último voto do array, salva no `localStorage` e devolve o array atualizado. |
| `contarVotos(votos)` | Converte o array de votos em um objeto no formato `{ [id]: quantidade }`. |
| `calcularResultado(votos)` | Devolve a lista dos participantes da roça com os campos extras `votos` e `percentual`, ordenada do **mais votado** para o **menos votado**. Como o voto é para **ficar**, quem sai é o **último** da lista. |
| `zerarVotos()` | Remove todos os votos do `localStorage`. |

---

## 🧭 Rotas (`App.jsx`)

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home` | Página inicial com o fazendeiro, o balão de boas-vindas, quem está na roça e o Fazendeiro da semana. |
| `/votacao` | `Votacao` | Lista os 4 participantes da roça com o botão **Selecionar**, a barra com o botão **Confirmar voto**, o histórico de votos da sessão, o Fazendeiro da semana e os demais peões. |
| `/resultado` | `Resultado` | Mostra o total de votos, a zona de eliminação e o placar ordenado com posição, barra, percentual e quantidade de votos. Permite desfazer o último voto e zerar a votação. |
| `*` | `Navigate` | Qualquer outro endereço redireciona para `/` (com `replace`). |

---

## 🧩 `ParticipanteCard` (componente)

Recebe por **props** o objeto `participante`, o booleano `selecionado` (padrão `false`) e, opcionalmente, a função `onSelecionar`. Exibe a foto e o nome. A classe do card é montada com template string a partir da situação (`card-roca`, `card-fazendeiro` ou `card-peao`), acrescentando `card-selecionado` quando `selecionado` é `true`. O selo vem de um objeto de mapeamento (`roca` → **Na roça**, `fazendeiro` → **Fazendeiro**; peões comuns não têm selo). O botão só aparece quando `onSelecionar` é passado, alterna o texto entre **Selecionar** e **✓ Selecionado** e, ao ser clicado, chama `onSelecionar(participante)`. É o mesmo componente usado para a roça, o Fazendeiro da semana e os demais peões.

---

## 📊 `participantes.js` (dados)

Array exportado por padrão com um objeto por participante:

```js
{ id: 9, nome: 'Fran Almeida', foto: '/participantes/fran-almeida.jpg', situacao: 'roca' }
```

| `situacao` | Significado |
|---|---|
| `'roca'` | Está na roça e pode receber votos para ficar (Fran Almeida, Igor Monteiro, Mônica Fonseca e Ricardo Negro). |
| `'fazendeiro'` | Fazendeiro da semana, imune (Lucas Bissoli). |
| `'peao'` | Fora da roça, não pode receber votos. |

O caminho da foto começa com `/` porque os arquivos da pasta `public` são servidos na raiz da aplicação pelo Vite.

---

## 🔗 Documentação e links úteis

- [React: documentação oficial](https://react.dev/learn)
- [Vite: guia](https://vite.dev/guide/)
- [React Router: documentação](https://reactrouter.com/home)
- [MDN: localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- [MDN: position sticky](https://developer.mozilla.org/pt-BR/docs/Web/CSS/position)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
