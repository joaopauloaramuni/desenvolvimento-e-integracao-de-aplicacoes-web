# 🌦️ Atividade 01 - API REST de Clima com Spring Boot

## 📊 Valor: 2,5 pts (Em dupla)

👥 A atividade deverá ser realizada **em dupla**, utilizando a metodologia de **Pair Programming**.

💻 Os dois integrantes deverão participar ativamente do desenvolvimento da solução.

📤 **Ambos os integrantes da dupla devem realizar a entrega no Canvas do link do repositório no GitHub.**

## 🎯 Objetivo

Desenvolva uma **API REST utilizando Spring Boot** capaz de consultar e disponibilizar informações meteorológicas da cidade de **Belo Horizonte - MG**.

A aplicação deverá consumir uma **API externa de dados meteorológicos**, processar as informações recebidas e disponibilizá-las por meio de um endpoint REST desenvolvido em Spring Boot.

## 🌡️ Informações do clima

A API deverá ser capaz de obter, sempre que disponibilizadas pelo serviço escolhido, informações como:

- 🌡️ Temperatura atual
- 💧 Umidade do ar
- 💨 Velocidade do vento
- 🧭 Direção do vento
- 🌧️ Condição climática
- 🌡️ Temperatura máxima e mínima
- ☁️ Descrição das condições do tempo
- 📍 Localização da cidade
- 🕐 Data e horário da consulta

## 🌐 APIs gratuitas sugeridas

A dupla poderá escolher uma das seguintes APIs de clima:

1. 🌤️ **Open-Meteo** — API gratuita e sem necessidade de API Key para diversos usos  
   [Open-Meteo](https://open-meteo.com/?utm_source=chatgpt.com)

2. 🌎 **WeatherAPI** — possui plano gratuito e disponibiliza informações meteorológicas por cidade  
   [WeatherAPI](https://www.weatherapi.com/?utm_source=chatgpt.com)

3. 🌦️ **OpenWeather** — oferece acesso gratuito com limitações e disponibiliza diversos dados meteorológicos  
   [OpenWeather](https://openweathermap.org/?utm_source=chatgpt.com)

4. ☁️ **Tomorrow.io** — oferece um plano gratuito para acesso aos dados meteorológicos  
   [Tomorrow.io](https://www.tomorrow.io/?utm_source=chatgpt.com)

> 💡 **Atenção:** dependendo da API escolhida, poderá ser necessário criar uma conta e obter uma **API Key**. Quando exigida, a chave deverá ser configurada no projeto, preferencialmente por meio do arquivo `application.properties` ou de variáveis de ambiente, evitando deixar a chave diretamente exposta no código-fonte.

## 🌦️ Projeto de Exemplo

Para auxiliar na realização da atividade, consulte o projeto de exemplo desenvolvido com **Spring Boot**, que utiliza a **API do Climatempo** para obter informações meteorológicas e disponibiliza os dados por meio de uma API REST.

👉 [**Clima_RestAPI — GitHub**](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/SpringBoot/Clima_RestAPI)

> 💡 Utilize o projeto apenas como **referência** para compreender a integração entre uma aplicação Spring Boot e uma API externa de clima.

## ⚙️ Requisitos técnicos

A aplicação deverá:

- ☕ Utilizar **Java** e **Spring Boot**.
- 🌐 Implementar uma **API REST**.
- 🔗 Consumir uma API externa de previsão do tempo.
- 📍 Consultar os dados referentes a **Belo Horizonte - MG**.
- 📦 Processar a resposta recebida da API externa.
- 📤 Disponibilizar os dados por meio de um endpoint próprio.
- 🔑 Configurar a **API Key**, quando necessária, de forma adequada.
- 🧩 Organizar o projeto seguindo uma estrutura adequada de aplicação Spring Boot.
- ⚠️ Implementar tratamento básico de erros para situações como falha na comunicação com a API externa ou dados indisponíveis.

## 🚀 Endpoint esperado

A aplicação deverá disponibilizar pelo menos um endpoint responsável por retornar as informações climáticas de Belo Horizonte.

Por exemplo:

```text
GET /clima  
GET /clima/belo-horizonte
```

A resposta deverá ser apresentada em **JSON**, contendo as principais informações meteorológicas obtidas pela API externa.

## 📦 Organização sugerida

O projeto poderá ser organizado utilizando componentes como:

```text
src/
└── main/
    └── java/
        └── .../
            ├── controller/
            ├── service/
            └── ...
```

A separação de responsabilidades entre **Controller**, **Service** e classes responsáveis pelos dados deverá ser considerada durante o desenvolvimento.

## 🔐 Configuração da API Key

Caso o serviço escolhido exija uma API Key, ela deverá ser configurada de maneira adequada no projeto.

Uma possibilidade é utilizar o arquivo:

```text
application.properties
```

e definir a chave como uma propriedade da aplicação.

> ⚠️ **Importante:** não publique sua API Key em repositórios públicos do GitHub. Utilize boas práticas para proteger credenciais e informações sensíveis.

## 📋 Entrega

O projeto deverá ser disponibilizado em um repositório do **GitHub** contendo:

- 💻 Código-fonte completo da aplicação.
- 📄 `README.md` com instruções para execução.
- 🔑 Orientações para configuração da API Key, caso necessária.
- 🌐 Documentação dos endpoints disponíveis.
- 📦 Dependências utilizadas no projeto.
- ▶️ Instruções para executar a aplicação localmente.

## ⭐ Desafio extra

Como atividade adicional, implemente funcionalidades como:

- 🔎 Permitir consultar o clima de outras cidades.
- 📅 Consultar previsão para os próximos dias.
- 📊 Retornar informações meteorológicas organizadas em um objeto próprio da aplicação.
- ❌ Implementar tratamento mais completo dos erros da API externa.

---

### 🎓 Resultado esperado

Ao final da atividade, a dupla deverá ter desenvolvido uma **API REST com Spring Boot integrada a um serviço externo de clima**, praticando conceitos de **APIs REST, requisições HTTP, consumo de APIs externas, JSON, organização de projetos Spring Boot e configuração de credenciais**.
