# 🔴 Atividade 04 - Pokédex com Spring Boot + MongoDB

## 📊 Valor: 2,5 pts (Em dupla)

👥 A atividade deverá ser realizada **em dupla**, utilizando a metodologia de **Pair Programming**.

💻 Os dois integrantes deverão participar ativamente do desenvolvimento da solução.

📤 **Ambos os integrantes da dupla devem realizar a entrega no Canvas do link do repositório no GitHub.**

---

## 🎯 Objetivo

Dar continuidade à **Atividade 03 - Pokédex com React + Vite**, substituindo o arquivo `pokedex-data.json` por uma **API REST desenvolvida com Spring Boot**, utilizando **MongoDB** como banco de dados.

A aplicação deverá manter a Pokédex desenvolvida na atividade anterior, porém os dados deverão passar a ser obtidos através do backend.

### 🔄 Arquitetura esperada

```text
React + Vite
     ↓
Spring Boot REST API
     ↓
   MongoDB
```

---

# 🗄️ MongoDB

Os dados utilizados na Atividade 03 deverão ser armazenados no **MongoDB**.

A dupla deverá criar, no mínimo, uma coleção para os Pokémon:

```text
pokemons
```

Cada documento deverá armazenar as informações necessárias para a Pokédex, como:

```json
{
  "id": 25,
  "name": "Pikachu",
  "hp": 35,
  "attack": 55,
  "defense": 40,
  "specialAttack": 50,
  "specialDefense": 50,
  "speed": 90,
  "types": ["Electric"]
}
```

> 💡 A estrutura do documento poderá ser modificada pela dupla conforme a solução adotada.

Como referência para os dados, poderá ser utilizado o arquivo da atividade anterior:

📄 [**pokedex-data.json**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json)

---

# ☕ Spring Boot

A dupla deverá criar um **backend REST utilizando Spring Boot** para disponibilizar os dados armazenados no MongoDB.

O projeto deverá utilizar:

* ☕ Spring Boot
* 🌐 Spring Web
* 🗄️ Spring Data MongoDB
* 📄 JSON
* 🧩 Controller
* ⚙️ Service
* 📦 Repository
* 🗂️ Model/Entity

---

# 🌐 API REST

A API deverá possuir, no mínimo, os seguintes endpoints:

| Método   | Endpoint             | Descrição                |
| -------- | -------------------- | ------------------------ |
| `GET`    | `/api/pokemons`      | Lista todos os Pokémon   |
| `GET`    | `/api/pokemons/{id}` | Busca um Pokémon pelo ID |
| `POST`   | `/api/pokemons`      | Cadastra um Pokémon      |
| `PUT`    | `/api/pokemons/{id}` | Atualiza um Pokémon      |
| `DELETE` | `/api/pokemons/{id}` | Remove um Pokémon        |

> 💡 Os endpoints poderão ser testados utilizando Postman, Insomnia, Thunder Client ou outra ferramenta semelhante.

---

# ⚛️ Integração com React

A **Atividade 03 deverá ser modificada** para deixar de utilizar diretamente o arquivo `pokedex-data.json`.

A aplicação React deverá consumir os dados através da API desenvolvida em Spring Boot.

### Antes:

```text
React → pokedex-data.json
```

### Agora:

```text
React → Spring Boot → MongoDB
```

A interface desenvolvida na Atividade 03 deverá continuar funcionando, incluindo:

* 🔎 Pesquisa de Pokémon.
* 🧬 Filtro por tipo.
* 📄 Visualização dos detalhes.
* 📊 Exibição dos atributos.
* 🧩 Componentização.

> ⚠️ **Não é necessário refazer a interface da Atividade 03.** O objetivo é integrar o frontend já desenvolvido com o novo backend.

---

# 📝 Cadastro e edição

A aplicação deverá possuir uma forma de **cadastrar, editar e excluir Pokémon**, utilizando os endpoints da API.

A interface poderá utilizar:

* 📝 Formulário.
* 🪟 Modal.
* 📄 Página específica.
* 🃏 Outra solução desenvolvida pela dupla.

---

# 📁 Organização

A entrega poderá ser organizada em um único repositório:

```text
pokedex/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
└── README.md
```

> 💡 A organização poderá ser modificada conforme a solução adotada pela dupla.

---

# 🔐 Configuração do MongoDB

A aplicação deverá utilizar **MongoDB**, preferencialmente através do **MongoDB Atlas**.

As credenciais de acesso ao banco **não deverão ser publicadas no GitHub**.

Utilize variáveis de ambiente ou arquivos de configuração adequados.

---

# 📋 Requisitos

A aplicação deverá:

* ⚛️ Reutilizar a Pokédex desenvolvida na Atividade 03.
* ☕ Possuir um backend desenvolvido com Spring Boot.
* 🌐 Disponibilizar uma API REST.
* 🗄️ Utilizar MongoDB.
* 🔎 Buscar os Pokémon através da API.
* 📄 Consultar detalhes de um Pokémon.
* ➕ Cadastrar Pokémon.
* ✏️ Editar Pokémon.
* 🗑️ Excluir Pokémon.
* 🔗 Integrar React + Spring Boot + MongoDB.
* 📄 Possuir um `README.md` com instruções para execução.

---

# ⭐ Desafio opcional

Como funcionalidade adicional, a dupla poderá implementar:

* 🔎 Busca por nome através da API.
* 🧬 Filtro por tipo através da API.
* 🧑‍🚀 Persistência dos treinadores no MongoDB.
* 🔗 Relacionamento entre treinadores e Pokémon.
* 🌐 Integração com uma API externa de Pokémon.

---

# 📋 Entrega

O repositório deverá conter:

* ⚛️ Frontend React + Vite da Atividade 03 integrado ao backend.
* ☕ Backend Spring Boot.
* 🗄️ Configuração do MongoDB.
* 🌐 API REST funcionando.
* 📄 `README.md`.
* ▶️ Instruções para executar frontend e backend.
* 🔐 Instruções para configurar o MongoDB.

---

# 🏆 Resultado esperado

Ao final da atividade, a dupla deverá ter transformado a Pokédex desenvolvida na **Atividade 03** em uma aplicação **Full Stack**, utilizando:

```text
React + Vite
      ↓
Spring Boot REST API
      ↓
    MongoDB
```

A atividade deverá demonstrar conhecimentos de **integração frontend/backend, APIs REST, Spring Boot, MongoDB e persistência de dados**.
