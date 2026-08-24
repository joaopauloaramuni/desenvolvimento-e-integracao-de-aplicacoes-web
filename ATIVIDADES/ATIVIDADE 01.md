# Atividade: API REST de Clima com Spring Boot

## Objetivo

Desenvolver uma **API REST** utilizando **Spring Boot** que consulte e retorne informações climáticas atuais da cidade de **Belo Horizonte - MG**.

## Descrição

A aplicação deverá consumir uma API pública de meteorologia (ver sugestões abaixo) e expor um ou mais endpoints REST que retornem, no mínimo, as seguintes informações:

- Temperatura atual (°C)
- Sensação térmica
- Umidade do ar (%)
- Velocidade do vento (km/h ou m/s)
- Condição do tempo (ex: ensolarado, nublado, chuvoso)

## Requisitos técnicos

1. Utilizar **Java** com **Spring Boot**.
2. Criar um endpoint REST, por exemplo:
   ```
   GET /clima/belo-horizonte
   ```
3. O endpoint deve retornar os dados em formato **JSON**.
4. Utilizar `RestTemplate` ou `WebClient` para consumir a API externa de clima.
5. Tratar possíveis erros de comunicação com a API externa (ex: timeout, resposta inválida, chave de API inválida).
6. Organizar o projeto em camadas (Controller, Service e, se necessário, DTOs/Models).

## Sugestões de APIs gratuitas de clima

O aluno pode escolher uma das opções abaixo para obter os dados meteorológicos:

- **OpenWeatherMap** — https://openweathermap.org/api
- **WeatherAPI** — https://www.weatherapi.com/
- **Open-Meteo** — https://open-meteo.com/ (não exige chave de API)
- **Visual Crossing Weather** — https://www.visualcrossing.com/weather-api

> ⚠️ **Atenção:** Algumas dessas APIs (como OpenWeatherMap, WeatherAPI e Visual Crossing) exigem o cadastro de uma conta gratuita para gerar uma **API Key**, que deverá ser enviada nas requisições feitas pela aplicação Spring Boot. Caso o aluno não queira lidar com autenticação por chave, a **Open-Meteo** é uma alternativa gratuita que não exige API Key.

## Entrega

- Código-fonte do projeto Spring Boot.
- Arquivo `README.md` explicando como executar a aplicação e, se aplicável, onde inserir a API Key.
- Print ou exemplo de retorno do endpoint em formato JSON.

## Critérios de avaliação

| Critério | Peso |
|---|---|
| Funcionamento correto do endpoint | 40% |
| Organização do código (camadas) | 20% |
| Tratamento de erros | 20% |
| Clareza do README e documentação | 20% |
