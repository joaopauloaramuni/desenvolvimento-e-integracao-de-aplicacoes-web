# 🎮 Atividade 03 - Pokédex com React + Vite

## 📊 Valor: 2,5 pts (Em dupla)

👥 A atividade deverá ser realizada **em dupla**, utilizando a metodologia de **Pair Programming**.

💻 Os dois integrantes deverão participar ativamente do desenvolvimento da solução.

📤 **Ambos os integrantes da dupla devem realizar a entrega no Canvas do link do repositório no GitHub.**

---

<div align="center">
 <img width="640" height="360" alt="pokedex" src="https://github.com/user-attachments/assets/45d31593-b935-4edd-8f47-92b4a685b096" />
</div>

## 🎯 Objetivo

Desenvolva uma aplicação web utilizando **React + Vite**, criando uma **Pokédex interativa** para exibição, consulta e exploração de Pokémon.

A aplicação deverá possuir uma interface gráfica desenvolvida com **React**, utilizando componentes, estados e eventos para permitir que o usuário navegue pela lista de Pokémon, pesquise criaturas e visualize suas informações.

A atividade tem como objetivo praticar conceitos de:

* ⚛️ React
* ⚡ Vite
* 🧩 Componentização
* 📦 Props
* 🔄 Estado e ciclo de renderização
* 🎯 Eventos
* 🔎 Filtros e pesquisa
* 📊 Renderização de listas
* 🌐 Consumo de dados
* 🎨 CSS e interface responsiva
* 🗂️ Organização de projetos frontend

---

# 📚 Dados da aplicação

Para auxiliar no desenvolvimento, será disponibilizado um arquivo:

📄 [**pokedex-data.json**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json)

O arquivo contém dados incluindo:

* 🐾 Pokémon.
* ❤️ HP.
* ⚔️ Attack.
* 🛡️ Defense.
* ✨ Special Attack.
* 🛡️ Special Defense.
* 💨 Speed.
* 🧬 Tipos dos Pokémon.
* 🧑‍🚀 Treinadores.
* 🏅 Quantidade de insígnias.
* 🔗 Relações entre treinadores e Pokémon.

Os dados deverão ser utilizados como fonte para a aplicação, podendo ser importados pelo projeto ou copiados para uma estrutura equivalente dentro de `src\data`.

> 💡 O arquivo auxiliar contém os dados necessários para a Pokédex e não exige a criação de um banco de dados para a atividade.

---

# ⚛️ Projeto React + Vite

A aplicação deverá ser criada utilizando **React com Vite**.

Uma estrutura inicial sugerida:

```text
src/
├── assets/
│   ├── images/
│   └── ...
│
├── components/
│   ├── PokemonCard.jsx
│   ├── PokemonList.jsx
│   ├── SearchBar.jsx
│   ├── PokemonDetails.jsx
│   └── ...
│
├── data/
│   └── pokedex-data.json
│
├── App.jsx
├── main.jsx
└── index.css
```

> 💡 A estrutura poderá ser modificada conforme a arquitetura adotada pela dupla.

---

# 🐾 Pokédex

A aplicação deverá possuir uma tela principal de Pokédex.

A tela deverá apresentar os Pokémon disponíveis nos dados fornecidos.

### 🔴 Cada Pokémon deverá apresentar, no mínimo:

* 🔢 Número/ID.
* 🐾 Nome.
* 🧬 Tipo ou tipos.
* ❤️ HP.
* ⚔️ Ataque.
* 🛡️ Defesa.
* ✨ Ataque Especial.
* 🛡️ Defesa Especial.
* 💨 Velocidade.

A dupla deverá utilizar **componentes React** para organizar a interface.

Por exemplo:

```text
App
 ├── Header
 ├── SearchBar
 ├── Filters
 ├── PokemonList
 │    ├── PokemonCard
 │    ├── PokemonCard
 │    └── PokemonCard
 └── PokemonDetails
```

---

# 🔎 Pesquisa de Pokémon

A aplicação deverá possuir um campo de pesquisa.

O usuário deverá conseguir pesquisar Pokémon pelo menos pelo:

* 🔢 ID.
* 🐾 Nome.

A pesquisa deverá atualizar a lista exibida conforme o usuário digita.

Exemplo:

```text
Pesquisar Pokémon...
```

Ao digitar:

```text
Bulba
```

a aplicação deverá apresentar o Pokémon correspondente, quando disponível nos dados.

---

# 🧬 Filtro por tipo

A Pokédex deverá permitir filtrar os Pokémon por tipo.

Exemplos:

* 🔥 Fire
* 💧 Water
* 🌱 Grass
* ⚡ Electric
* 🧠 Psychic
* 👻 Ghost
* 🐉 Dragon
* 🪨 Rock

O filtro deverá utilizar os tipos presentes no arquivo `pokedex-data.json`.

> 💡 É permitido criar botões, select, dropdown ou outro componente visual para realizar o filtro.

---

# 📄 Detalhes do Pokémon

Ao selecionar um Pokémon, a aplicação deverá apresentar uma visualização com informações mais detalhadas.

A visualização poderá ser realizada:

* 🪟 Em um modal.
* 📄 Em uma página/seção de detalhes.
* 🃏 Em um card expandido.
* 🔀 Por meio de outra solução criada pela dupla.

### O detalhe deverá apresentar, no mínimo:

* 🔢 ID.
* 🐾 Nome.
* 🧬 Tipos.
* ❤️ HP.
* ⚔️ Attack.
* 🛡️ Defense.
* ✨ Special Attack.
* 🛡️ Special Defense.
* 💨 Speed.

> 💡 A dupla poderá representar os atributos utilizando barras de progresso, gráficos, ícones ou outros elementos visuais.

---

# 🧑‍🚀 Treinadores

Como funcionalidade adicional da Pokédex, a aplicação deverá disponibilizar uma área para consultar os treinadores presentes nos dados.

A interface poderá apresentar:

* 🧑‍🚀 Nome do treinador.
* 🏅 Quantidade de insígnias.
* 🐾 Pokémon relacionados ao treinador.

Os treinadores disponíveis nos dados incluem:

* Ash.
* Brock.
* Misty.
* Lt. Surge.
* Erika.
* Koga.
* Sabrina.
* Blaine.
* Giovanni.
* Gary.
* Team Rocket.
* Lance.

> 💡 A dupla poderá criar uma tela, modal ou seção específica para os treinadores.

---

# 🎨 Interface

A dupla deverá desenvolver uma identidade visual própria para a Pokédex.

É permitido utilizar:

* 🎨 Gradientes.
* ✨ Animações.
* 🃏 Cards.
* 🌈 Cores associadas aos tipos.
* 🖼️ Imagens dos Pokémon.
* 🔘 Botões personalizados.
* 📱 Layout responsivo.
* 🌙 Tema escuro.
* 💫 Efeitos de hover.
* 📊 Barras de atributos.
* 🎭 Ícones.
* 🪄 Transições.

> 💡 **Use a criatividade!** O objetivo não é apenas apresentar uma lista de Pokémon, mas desenvolver uma interface interativa e visualmente interessante utilizando React.

---

# 🖼️ Imagens dos Pokémon

A aplicação poderá utilizar imagens para representar os Pokémon.

A dupla poderá:

* 🖼️ Utilizar imagens locais.
* 🌐 Utilizar imagens hospedadas externamente.
* 🔗 Utilizar uma API pública de Pokémon para complementar as informações visuais.

Caso a dupla utilize uma API externa, deverá documentar a fonte utilizada no `README.md`.

> 💡 A atividade principal deverá continuar funcionando utilizando os dados fornecidos no arquivo `pokedex-data.json`.

---

## 🖼️ Exemplos de fontes de imagens

Para encontrar imagens dos Pokémon para utilizar na construção da Pokédex, a dupla pode consultar os seguintes sites:

* 🐾 [**PNG Wing**](https://www.pngwing.com/pt/search?q=pokemon) — Banco de imagens PNG com diversos Pokémon.
* 🎮 [**StickPNG**](https://www.stickpng.com/pt-br/cat/jogos/pokemon) — Imagens de Pokémon com fundo transparente.
* 🖼️ [**CleanPNG**](https://www.cleanpng.com/free/pokemon.html) — Banco de imagens PNG de Pokémon.
* ✨ [**PNGEgg**](https://www.pngegg.com/en/search?q=pokemon) — Outra opção para encontrar imagens PNG de Pokémon.

> 💡 **Dica:** dê preferência a imagens com **fundo transparente (PNG)** para facilitar a criação dos cards e deixar a interface da Pokédex mais bonita.

> ⚠️ **Atenção:** verifique as condições de uso e os direitos das imagens antes de utilizá-las em projetos publicados ou distribuídos.

---

# ⚛️ Requisitos de React

A aplicação deverá demonstrar a utilização dos principais conceitos trabalhados em React.

A solução deverá utilizar, no mínimo:

* ⚛️ Componentes funcionais.
* 📦 Props.
* 🔄 `useState`.
* 📋 Renderização de listas com `map()`.
* 🎯 Eventos.
* 🔎 Filtragem de dados.
* 🧩 Componentização adequada.

É recomendado utilizar também:

* 🔄 `useEffect`.
* 🪝 Hooks.
* 📁 Organização dos componentes.
* 🧠 Estados derivados.
* ♻️ Reutilização de componentes.

---

# 📋 Requisitos funcionais

A aplicação deverá:

* ⚛️ Ser desenvolvida com React + Vite.
* 🐾 Exibir os Pokémon disponíveis no arquivo de dados.
* 🔎 Possuir pesquisa por nome ou ID.
* 🧬 Possuir filtro por tipo.
* 📄 Permitir visualizar os detalhes de um Pokémon.
* 📊 Exibir os atributos dos Pokémon.
* 🧩 Utilizar componentes React.
* 🎯 Utilizar estados e eventos.
* 📱 Possuir uma interface responsiva.
* ⚠️ Tratar situações em que nenhum Pokémon seja encontrado.
* 🎨 Possuir identidade visual própria.

---

# 🏆 Desafios opcionais

Para deixar a aplicação mais completa, a dupla poderá implementar funcionalidades adicionais.

### ⭐ Favoritos

Permitir que o usuário marque Pokémon como favoritos.

### ⚔️ Comparação

Permitir selecionar dois Pokémon e comparar seus atributos.

### 📊 Ordenação

Permitir ordenar os Pokémon por:

* HP.
* Attack.
* Defense.
* Special Attack.
* Special Defense.
* Speed.
* Nome.
* ID.

### 🎲 Pokémon aleatório

Criar um botão para selecionar um Pokémon aleatoriamente.

### 🌙 Dark Mode

Adicionar alternância entre tema claro e escuro.

### 📱 Responsividade avançada

Criar uma interface adaptada para:

* Desktop.
* Tablet.
* Smartphone.

### 🌐 API externa

Complementar os dados fornecidos com informações de uma API pública de Pokémon.

---

# 📁 Organização do projeto

O projeto deverá possuir uma organização adequada.

Uma sugestão:

```text
pokedex-react/
├── public/
│
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── pokemon-001.png
│   │       ├── pokemon-002.png
│   │       ├── pokemon-003.png
│   │       └── ...
│   │
│   ├── components/
│   │   ├── PokemonCard.jsx
│   │   ├── PokemonList.jsx
│   │   ├── SearchBar.jsx
│   │   ├── PokemonDetails.jsx
│   │   └── ...
│   │
│   ├── css/
│   │   ├── App.css
│   │   ├── PokemonCard.css
│   │   ├── PokemonList.css
│   │   ├── SearchBar.css
│   │   └── ...
│   │
│   ├── data/
│   │   └── pokedex-data.json
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

> 💡 **Obs:** a pasta `assets/images/` pode ser utilizada para armazenar as imagens dos Pokémon, enquanto a pasta `css/` deve concentrar os arquivos de estilização dos componentes e da aplicação.

> 💡 A estrutura não precisa ser exatamente essa. A dupla poderá organizar o projeto de acordo com a solução desenvolvida.

---

# ▶️ Execução

O projeto deverá possuir instruções claras para execução no `README.md`.

Exemplo:

```bash
npm install
npm run dev
```

O README deverá explicar:

* 📦 Como instalar as dependências.
* ▶️ Como executar o projeto.
* 🌐 Qual endereço utilizar no navegador.
* 📁 Onde estão os dados utilizados pela aplicação.
* 🧩 Como o projeto está organizado.

---

# 🔑 Dependências

A dupla poderá utilizar bibliotecas adicionais para melhorar a aplicação.

Exemplos:

* 🎨 Bibliotecas de ícones.
* 🧭 Bibliotecas de roteamento.
* 📊 Bibliotecas para gráficos.
* 🎞️ Bibliotecas de animação.
* 🎨 Frameworks CSS.

> ⚠️ Todas as bibliotecas adicionais utilizadas deverão estar registradas no `package.json`.

---

# 📋 Entrega

O projeto deverá ser disponibilizado em um repositório do **GitHub** contendo:

* ⚛️ Código-fonte completo da aplicação React.
* ⚡ Configuração do Vite.
* 🐾 Pokédex funcional.
* 🔎 Sistema de pesquisa.
* 🧬 Filtro por tipo.
* 📄 Visualização dos detalhes dos Pokémon.
* 📊 Exibição dos atributos.
* 📦 Arquivo `pokedex-data.json`.
* 📄 `README.md` com documentação do projeto.
* ▶️ Instruções para executar a aplicação.
* 📦 `package.json`.
* 🖼️ Imagens da aplicação no `README.md`, se desejado.

---

# 🏆 Resultado esperado

Ao final da atividade, a dupla deverá ter desenvolvido uma **Pokédex interativa utilizando React + Vite**, capaz de apresentar os Pokémon e seus atributos a partir dos dados fornecidos.

A atividade deverá demonstrar conhecimentos de **React, Vite, componentes, props, estados, eventos, renderização de listas, filtros, pesquisa, organização de projetos frontend e desenvolvimento de interfaces web**.

⭐ Funcionalidades adicionais, como favoritos, comparação de Pokémon, ordenação, modo escuro e integração com APIs externas, poderão ser utilizadas para enriquecer a aplicação.
