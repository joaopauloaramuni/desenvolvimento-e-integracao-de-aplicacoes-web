# Projeto ConsultaBrasil (React + Vite) 📮

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://consulta-brasil.vercel.app/)

👉 **[consulta-brasil.vercel.app](https://consulta-brasil.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Consultas de dados públicos do Brasil feitas com **React** e **Vite**, direto das APIs gratuitas [**ViaCEP**](https://viacep.com.br), [**BrasilAPI**](https://brasilapi.com.br) e [**IBGE**](https://servicodados.ibge.gov.br/api/docs/localidades). Você digita o CEP e o formulário de endereço se preenche sozinho; escolhe o estado e a lista de cidades aparece; consulta um CNPJ, os feriados do ano ou as cidades de um DDD.

O projeto foi pensado para ensinar o que todo `fetch` de verdade precisa: **debounce**, **cancelamento** de requisições antigas, **timeout**, **tratamento de erros** com mensagens úteis, **cache** e **API de reserva** (*fallback*) quando a principal falha.

Este projeto **não precisa de chave de API**: não tem `.env.local` nem variável na Vercel. As três APIs são gratuitas e liberam CORS, então o navegador chama direto, sem backend.

- 🏠 **Endereço pelo CEP**: máscara `00000-000`, busca 400 ms depois da última tecla, preenche rua, bairro, estado e cidade (destacados em azul) e leva o cursor para o **número**;
- 🗺️ **Estado → cidades**: os 27 estados agrupados por região; ao escolher um, as cidades dele são carregadas do IBGE. Trocar o estado limpa a cidade;
- 🔎 **Buscar CEP pelo endereço** ("Não sei meu CEP"): estado + cidade + parte do nome da rua, com filtro por bairro e botão **Usar** que devolve o endereço para o formulário;
- 💾 **Endereços salvos** no `localStorage`, com **Copiar** e **Ver no mapa**;
- 🏢 **CNPJ**: dígitos verificadores conferidos **antes** da requisição (inclusive o **CNPJ alfanumérico** de 2026), situação cadastral, porte, capital social, CNAEs, endereço, contato e quadro de sócios;
- 📅 **Feriados nacionais**: próximo feriado com contagem regressiva, feriadões de 3 dias, feriados que dá para "enforcar", dias úteis do ano e **Baixar para a agenda (.ics)**;
- ☎️ **DDD**: estado e todas as cidades atendidas, com atalhos para as capitais;
- 🧪 **Ver resposta da API** em todo resultado: a URL chamada, o tempo da requisição, se veio do cache ou da API de reserva, e o JSON cru.

| Aba | Componente | API |
| --- | --- | --- |
| Endereço | `<AddressForm />` | ViaCEP (reserva: BrasilAPI) + IBGE |
| Buscar CEP | `<CepSearch />` | ViaCEP + IBGE |
| CNPJ | `<CnpjLookup />` | BrasilAPI |
| Feriados | `<Holidays />` | BrasilAPI |
| DDD | `<DddLookup />` | BrasilAPI |

## 🖼️ Capturas de Tela

| Início | CEP preenchido |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/Home.png) | ![CepPreenchido](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/CepPreenchido.png) |

| Endereço salvo | Resposta da API |
| :---: | :---: |
| ![EnderecoSalvo](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/EnderecoSalvo.png) | ![RespostaAPI](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/RespostaAPI.png) |

| CEP não encontrado | Buscar CEP pelo endereço |
| :---: | :---: |
| ![CepNaoEncontrado](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/CepNaoEncontrado.png) | ![BuscarCep](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/BuscarCep.png) |

| CNPJ | CNPJ inválido |
| :---: | :---: |
| ![Cnpj](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/Cnpj.png) | ![CnpjInvalido](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/CnpjInvalido.png) |

| Feriados | DDD |
| :---: | :---: |
| ![Feriados](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/Feriados.png) | ![DDD](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/DDD.png) |

| Celular | Celular (formulário) | Celular (feriados) |
| :---: | :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/Mobile.png) | ![Mobile3](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/Mobile3.png) | ![Mobile2](https://joaopauloaramuni.github.io/react-imgs/ConsultaBrasil/imgs/Mobile2.png) |

> As capturas usam **respostas simuladas** das APIs: o CNPJ, a empresa e os sócios são **fictícios**, e a lista de CEPs da Av. Afonso Pena é só ilustrativa.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` e clique em **Usar exemplo** (CEP da PUC Minas, no Coração Eucarístico) ou digite o seu CEP.

## ⚙️ Como funciona

### O caminho de uma busca de CEP

```text
digita "30535901"
   │
   ├─ máscara ............ "30535-901"                          core/cep.js
   ├─ confere ............ 8 dígitos e não "00000-000"          core/cep.js
   ├─ debounce ........... espera 400 ms sem nenhuma tecla       hooks/useDebouncedValue.js
   ├─ requisição ......... cancela a anterior (AbortController) hooks/useRequest.js
   ├─ ViaCEP ............. GET /ws/30535901/json/               services/viaCepService.js
   │     └─ falhou? ...... BrasilAPI GET /cep/v2/30535901        services/locationService.js
   └─ preenche ........... rua, bairro, estado, cidade → foco no número
```

### Debounce

Sem debounce, digitar `Afonso Pena` faria **11 requisições**, uma por tecla. Com ele, sai **uma só**, quando você para de digitar:

```js
export default function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // mudou antes do tempo? cancela o timer
  }, [value, delay]);

  return debounced;
}
```

> 💡 Para ver na prática: abra o **DevTools → Network** e digite um nome de rua na aba **Buscar CEP**.

### Cancelamento (condição de corrida)

Digite um CEP e, rápido, troque por outro. Se a resposta do primeiro chegar **depois** da do segundo, a tela mostraria o endereço errado. O `useRequest` aborta a requisição antiga sempre que a chave muda:

```js
useEffect(() => {
  const controller = new AbortController();
  fetcher(controller.signal).then(setData).catch(ignoraSeFoiCancelada);
  return () => controller.abort(); // a chave mudou: cancela a anterior
}, [key]);
```

### Tratamento de erros

O `fetch()` só falha quando **não há rede**: um `404` ou `500` chega como resposta normal. O `core/http.js` confere `response.ok` e transforma cada situação num erro com nome próprio, que a tela usa para escolher o ícone, o texto e se mostra o botão **Tentar de novo**:

| Erro | Quando acontece | Tentar de novo? |
| --- | --- | --- |
| `NotFoundError` | 404, ou `{ "erro": "true" }` no ViaCEP | Não |
| `InvalidInputError` | 400 (dado inválido) | Não |
| `TimeoutError` | Mais de 8 s sem resposta | Sim |
| `NetworkError` | Sem internet, CORS bloqueado, servidor fora do ar | Sim |
| `RateLimitError` | 429 (consultas demais) | Sim |
| `ApiError` | Qualquer outro erro HTTP (500, 503...) | Sim |

> ⚠️ **Pegadinha do ViaCEP**: um CEP que não existe **não volta 404**. Volta **200** com `{ "erro": "true" }`. Por isso o `viaCepService.js` confere o campo `erro` depois do fetch.

> 💡 Para testar os erros: no **DevTools → Network**, escolha **Offline** (vira `NetworkError`) ou **Slow 3G** (pode virar `TimeoutError`). Para forçar a API de reserva, bloqueie `viacep.com.br` em **Network request blocking**: o resultado mostra "ViaCEP falhou, usei a reserva".

### Timeout

O `fetch()` espera para sempre. O `fetchJson` usa um `AbortController` próprio, abortado por um `setTimeout` (o tempo fica em `TIMING.REQUEST_TIMEOUT_MS`) **ou** pelo `signal` de quem chamou. Uma variável `timedOut` diferencia os dois casos: timeout vira `TimeoutError`; cancelamento é ignorado.

### Cache

O `fetchJson` guarda as respostas num `Map` (por URL) enquanto a página estiver aberta. Busque um CEP, troque e volte para ele: o selo vira **do cache, sem requisição**.

### Estado e cidades

- Os **27 estados** ficam fixos em `config/appConfig.js` (eles não mudam, então não precisam de API).
- As **cidades** vêm do IBGE (`/estados/MG/municipios?orderBy=nome`), com a BrasilAPI de reserva (`/ibge/municipios/v1/MG`, que volta em maiúsculas e passa pelo `titleCase`).
- Quando o CEP preenche o formulário, a cidade é escolhida pelo **código IBGE** que o ViaCEP devolve (`"ibge": "3106200"`), o que é mais seguro que comparar nomes. Se a resposta veio da BrasilAPI, que não traz o código, o `StateCitySelect` procura a cidade pelo nome, ignorando acentos.

### CNPJ

Os dígitos verificadores são conferidos **no navegador**, antes da requisição: um CNPJ digitado errado nem sai da página, e a mensagem já diz quais seriam os dígitos certos.

- Pesos de **2 a 9**, da direita para a esquerda, e **módulo 11**;
- **CNPJ alfanumérico** (Receita Federal, julho de 2026): cada caractere vale **código ASCII − 48**, então `"0"` a `"9"` continuam valendo 0 a 9 e `"A"` vale 17. Os dois últimos continuam sendo números.

### Feriados

A BrasilAPI devolve só `{ date, name, type }`. O `core/holidays.js` acrescenta o dia da semana, quantos dias faltam e o tipo de folga:

| Cai na | Selo |
| --- | --- |
| Segunda ou sexta | Feriadão de 3 dias |
| Terça ou quinta | Dá para enforcar a segunda / a sexta |
| Quarta | No meio da semana |
| Sábado ou domingo | Cai no fim de semana |

> ⚠️ `new Date("2026-11-02")` é meia-noite **UTC**, que no Brasil ainda é **1º de novembro** às 21h. O `parseIsoDate` cria a data ao meio-dia local para fugir desse bug clássico.

O botão **Baixar para a agenda** gera um arquivo **.ics** (iCalendar) com os feriados como eventos de dia inteiro, que pode ser importado no Google Agenda, no Outlook ou no celular.

> 💡 A regra de negócio fica em `src/core/` e as chamadas às APIs em `src/services/`, **sem React**: dá para usar `lookupCep`, `validateCnpj` ou `enrichHolidays` em qualquer projeto JavaScript.

## 🌐 As APIs

| API | Endpoint | O que devolve |
| --- | --- | --- |
| ViaCEP | `GET https://viacep.com.br/ws/30535901/json/` | Endereço do CEP (com código IBGE e DDD) |
| ViaCEP | `GET https://viacep.com.br/ws/MG/Belo Horizonte/Afonso/json/` | Até 50 CEPs da rua |
| BrasilAPI | `GET https://brasilapi.com.br/api/cep/v2/30535901` | Endereço do CEP (reserva) |
| BrasilAPI | `GET https://brasilapi.com.br/api/cnpj/v1/00000000000191` | Dados da empresa na Receita Federal |
| BrasilAPI | `GET https://brasilapi.com.br/api/feriados/v1/2026` | Feriados nacionais do ano |
| BrasilAPI | `GET https://brasilapi.com.br/api/ddd/v1/31` | Estado e cidades do DDD |
| BrasilAPI | `GET https://brasilapi.com.br/api/ibge/municipios/v1/MG` | Cidades do estado (reserva) |
| IBGE | `GET https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios?orderBy=nome` | Cidades do estado |

> As APIs são gratuitas e mantidas por terceiros: use com moderação (o debounce ajuda nisso) e não use em produção sem um plano B.

## 🛠️ Configurações

Tudo fica em `src/config/appConfig.js`:

```js
API: { VIACEP, BRASILAPI, IBGE },   // endereços base
TIMING: {
  CEP_DEBOUNCE_MS: 400,             // espera depois da última tecla
  STREET_DEBOUNCE_MS: 600,
  CNPJ_DEBOUNCE_MS: 500,
  DDD_DEBOUNCE_MS: 300,
  REQUEST_TIMEOUT_MS: 8000,         // desiste depois de 8 s
},
UFS: [ ... ],                       // os 27 estados com região
EXAMPLES: { ... },                  // dados dos botões "Usar exemplo"
```

## 🎨 Logos

- **PUC Minas**: `src/assets/images/pucminas-logo.png` (a mesma dos outros projetos).
- **BrasilAPI**: `src/assets/images/brasilapi-logo.png`, do [repositório oficial](https://github.com/BrasilAPI/BrasilAPI/tree/main/public).
- **ViaCEP**: salve a logo do [site do ViaCEP](https://viacep.com.br) em **`public/logos/viacep.png`**. Enquanto o arquivo não existir, a faixa azul mostra o nome "ViaCEP" em texto.

## ☁️ Deploy na Vercel

Importe o repositório em [vercel.com/new](https://vercel.com/new) (preset **Vite**) e clique em **Deploy**. Não há variáveis de ambiente para configurar.

> Por ser um site **só estático**, ele também funciona no **GitHub Pages** ou em qualquer hospedagem de arquivos.

## 📂 Estrutura do Projeto

```text
📁 ConsultaBrasil
│
├── 📁 imgs                   └── Capturas de tela usadas neste README
├── 📁 public
│   ├── pucminas-logo.png     └── Favicon
│   └── 📁 logos              └── viacep.png (coloque aqui a logo do ViaCEP)
│
├── 📁 src
│   ├── 📁 assets/images      └── pucminas-logo.png, brasilapi-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/                  └── Faixa azul (logo PUC + logos das APIs) e título
│   │   ├── AddressForm/
│   │   │   ├── AddressForm.jsx          └── Formulário com autocompletar pelo CEP
│   │   │   ├── CepDetails.jsx           └── DDD, código IBGE, região do CEP
│   │   │   ├── SavedAddresses.jsx       └── Endereços salvos (localStorage)
│   │   │   └── addressText.js           └── Endereço em texto e link do mapa
│   │   ├── StateCitySelect/             └── Selects ligados de estado e cidade
│   │   ├── CepSearch/                   └── Busca reversa (CEP pelo endereço)
│   │   ├── CnpjLookup/
│   │   │   ├── CnpjLookup.jsx           └── Campo, validação e consulta
│   │   │   └── CnpjResult.jsx           └── Ficha da empresa
│   │   ├── Holidays/                    └── Feriados, resumo do ano e .ics
│   │   ├── DddLookup/                   └── Estado e cidades do DDD
│   │   └── ui/
│   │       ├── Field.jsx                └── Campo com rótulo, mensagem e ícone
│   │       ├── StatusMessage.jsx        └── Mensagens de erro, aviso e sucesso (+ Tentar de novo)
│   │       ├── SourceInfo.jsx           └── Fonte, tempo, cache e JSON da resposta
│   │       ├── CopyButton.jsx
│   │       ├── Spinner.jsx
│   │       └── ui.css                   └── Estilos compartilhados
│   │
│   ├── 🧠 core                          └── Regra de negócio (sem React)
│   │   ├── http.js           └── fetchJson: timeout, cancelamento, cache, erros HTTP
│   │   ├── exceptions.js     └── ApiError, NotFoundError, TimeoutError, NetworkError...
│   │   ├── cep.js            └── Máscara e validação do CEP
│   │   ├── cnpj.js           └── Máscara e dígitos verificadores (inclusive alfanumérico)
│   │   ├── holidays.js       └── Feriadões, contagem, dias úteis, arquivo .ics
│   │   ├── format.js         └── Datas, dinheiro e telefone em pt-BR
│   │   └── text.js           └── Só dígitos, sem acento, titleCase
│   │
│   ├── 🌐 services
│   │   ├── viaCepService.js      └── CEP e busca reversa
│   │   ├── brasilApiService.js   └── CEP (reserva), CNPJ, feriados, DDD, cidades (reserva)
│   │   ├── ibgeService.js        └── Cidades do estado
│   │   └── locationService.js    └── Junta as APIs com a reserva (fallback)
│   │
│   ├── 🪝 hooks
│   │   ├── useDebouncedValue.js  └── Debounce
│   │   ├── useRequest.js         └── Requisição com cancelamento, status e retry
│   │   ├── useCities.js          └── Cidades do estado escolhido
│   │   ├── useSavedAddresses.js  └── Endereços no localStorage
│   │   └── useHashTab.js         └── Aba atual no endereço (#cnpj, #feriados...)
│   │
│   ├── ⚙️ config/appConfig.js    └── URLs, tempos, estados e exemplos
│   ├── 🛠️ utils
│   │   ├── clipboard.js          └── Copiar (com alternativa para http://)
│   │   └── download.js           └── Baixar texto como arquivo (.ics)
│   ├── App.jsx                   └── Abas e ponte entre Endereço e Buscar CEP
│   ├── index.css
│   └── main.jsx
│
├── 📄 index.html
├── 📄 vite.config.js
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

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (Feather, `react-icons/fi`)
- Sem Axios e sem biblioteca de máscara ou de CEP: o `fetch`, as máscaras e as validações são feitos à mão, para fins didáticos.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📚 Documentação e Links Úteis

- 📮 [ViaCEP](https://viacep.com.br)
- 🇧🇷 [BrasilAPI: documentação](https://brasilapi.com.br/docs) · [GitHub](https://github.com/BrasilAPI/BrasilAPI)
- 🗺️ [IBGE: API de localidades](https://servicodados.ibge.gov.br/api/docs/localidades)
- 🔢 [Receita Federal: CNPJ alfanumérico](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
- 🛑 [MDN: AbortController](https://developer.mozilla.org/pt-BR/docs/Web/API/AbortController)
- 🌐 [MDN: Usando o Fetch](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch)
- 📅 [RFC 5545: iCalendar (.ics)](https://datatracker.ietf.org/doc/html/rfc5545)
- ⚡ [Vite](https://vite.dev/) · ⚛️ [React](https://react.dev/)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
