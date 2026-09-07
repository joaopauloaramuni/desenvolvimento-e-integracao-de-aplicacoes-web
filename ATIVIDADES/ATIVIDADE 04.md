# 💾 Atividade 04 - Pokédex com Spring Boot + MongoDB

## 📊 Valor: 2,5 pts (Em dupla)

👥 A atividade deverá ser realizada **em dupla**, utilizando a metodologia **Pair Programming**.

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

Para esta atividade, será disponibilizado o arquivo:

📄 **`Script_Pokedex.sql`**

O script contém os dados utilizados na Pokédex, incluindo:

* 🐾 Pokémon e seus atributos.
* 🧬 Tipos dos Pokémon.
* 🧑‍🚀 Treinadores.
* 🏅 Insígnias.
* 🔗 Relações entre Pokémon e tipos.
* 🔗 Relações entre treinadores e Pokémon.

O script deverá ser utilizado como **fonte de dados para popular o MongoDB**.

> ⚠️ **Não é necessário utilizar MySQL ou outro banco relacional.** O objetivo é utilizar as informações presentes no `Script_Pokedex.sql` e adaptá-las para o modelo de documentos do MongoDB.

A dupla deverá criar, no mínimo, uma coleção:

```text
pokemons
```

Podendo criar outras coleções, como:

```text
types
trainers
```

### Exemplo de documento:

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

> 💡 A estrutura dos documentos poderá ser definida pela dupla, desde que contenha as informações necessárias para a aplicação.

---

# ☕ Spring Boot

A dupla deverá criar um **backend REST utilizando Spring Boot** para disponibilizar os dados armazenados no MongoDB.

O projeto deverá utilizar:

* ☕ Spring Boot
* 🌐 Spring Web
* 🗄️ Spring Data MongoDB
* 🧩 Controller
* ⚙️ Service
* 📦 Repository
* 🗂️ Model

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

A **Atividade 03 deverá ser modificada** para deixar de utilizar diretamente o `pokedex-data.json`.

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

> ⚠️ **Não é necessário refazer a interface da Atividade 03.** O objetivo é integrar o frontend já desenvolvido com o novo backend.

---

# 📝 Cadastro, edição e exclusão

A aplicação deverá possuir uma forma de:

* ➕ Cadastrar Pokémon.
* ✏️ Editar Pokémon.
* 🗑️ Excluir Pokémon.

As operações deverão ser realizadas através da **API REST**, persistindo as alterações no MongoDB.

A interface poderá utilizar formulário, modal, página específica ou outra solução desenvolvida pela dupla.

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
├── Script_Pokedex.sql
└── README.md
```

> 💡 A estrutura poderá ser modificada conforme a arquitetura adotada pela dupla.

---

# 🔐 Configuração do MongoDB

A aplicação deverá utilizar **MongoDB**, preferencialmente através do **MongoDB Atlas**.

As credenciais de acesso ao banco **não deverão ser publicadas no GitHub**.

Utilize variáveis de ambiente ou arquivos de configuração adequados.

---

# 📋 Requisitos

A aplicação deverá:

* ⚛️ Reutilizar a Pokédex desenvolvida na Atividade 03.
* 📄 Utilizar o `Script_Pokedex.sql` como fonte dos dados.
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

* 🧬 Consultas de Pokémon por tipo.
* 🧑‍🚀 Persistência dos treinadores no MongoDB.
* 🔗 Relação entre treinadores e Pokémon.
* 🔎 Busca por nome através da API.

---

# 📋 Entrega

O repositório deverá conter:

* ⚛️ Frontend React + Vite da Atividade 03 integrado ao backend.
* ☕ Backend Spring Boot.
* 🗄️ Banco MongoDB funcionando.
* 🌐 API REST funcionando.
* 📄 `Script_Pokedex.sql`.
* 📄 `README.md`.
* ▶️ Instruções para executar frontend e backend.
* 🔐 Instruções para configurar o MongoDB.

---

# 🏆 Resultado esperado

Ao final da atividade, a dupla deverá ter transformado a Pokédex desenvolvida na **Atividade 03** em uma aplicação **Full Stack**, utilizando os dados do `Script_Pokedex.sql` em um banco **MongoDB**:

```text
Script_Pokedex.sql
        ↓
     MongoDB
        ↓
Spring Boot REST API
        ↓
   React + Vite
```

A atividade deverá demonstrar conhecimentos de **modelagem de dados, MongoDB, APIs REST, Spring Boot, integração frontend/backend e persistência de dados**.
