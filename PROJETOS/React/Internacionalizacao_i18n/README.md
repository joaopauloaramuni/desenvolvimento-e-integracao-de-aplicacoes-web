# Projeto Internacionalizacao_i18n (React + Vite) 🌎

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://demo-i18next.vercel.app/)

👉 **[demo-i18next.vercel.app](https://demo-i18next.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Exemplo de **internacionalização (i18n)** em **React** com **i18next** e **react-i18next**: o site inteiro é escrito em **português (pt-BR)** e traduzido para **inglês** e **espanhol**. A troca de idioma é feita por **botões com bandeiras** 🇧🇷 🇺🇸 🇪🇸 (componentes SVG do `country-flag-icons`) e acontece **na hora, sem recarregar a página**.

A página é uma vitrine dos recursos do i18next. Cada cartão mostra o recurso funcionando, o código que o usa e o texto que está no `translation.json` do idioma atual (botão **Ver código**):

| Recurso | Exemplo |
| --- | --- |
| **Texto simples** | `t("cards.simple.welcome")` → "Bem-vindo à PUC Minas!" / "Welcome to PUC Minas!" |
| **Interpolação** | `t("...greeting", { name })` → "Olá, Maria!" / "Hi, Maria!" / "¡Hola, Maria!" |
| **Plural** | `t("...items", { count })` → "Nenhuma disciplina" / "1 disciplina" / "3 disciplinas" |
| **Datas, números e moedas** | `{{date, datetime}}`, `{{value, number}}`, `{{price, currency(BRL)}}`, `{{days, relativetime(day)}}`, `{{items, list}}` |
| **`<Trans>`** | frase com **negrito**, *itálico* e link no meio, sem quebrar em pedaços |
| **Listas** | `t("...steps", { returnObjects: true })` devolve um array do JSON |

E mais:

- **Detecção automática**: na primeira visita, o site abre no idioma do navegador (`en-US` → inglês, `es-AR` → espanhol, qualquer outro → português)
- A escolha fica **salva no `localStorage`**: na próxima visita, o site já abre no idioma escolhido
- O **`<html lang>`** e o **título da aba** mudam junto com o idioma (acessibilidade, tradutor do navegador e SEO)

## 🖼️ Capturas de Tela

| Português 🇧🇷 | English 🇺🇸 |
| :---: | :---: |
| ![Português](https://joaopauloaramuni.github.io/react-imgs/Internacionalizacao_i18n/imgs/Portugues.png) | ![English](https://joaopauloaramuni.github.io/react-imgs/Internacionalizacao_i18n/imgs/English.png) |

| Español 🇪🇸 | Celular |
| :---: | :---: |
| ![Español](https://joaopauloaramuni.github.io/react-imgs/Internacionalizacao_i18n/imgs/Espanol.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/Internacionalizacao_i18n/imgs/Mobile.png) |

## 🚀 Como rodar

```bash
npm install
cp .env.example .env.local   # opcional: trocar o idioma padrão
npm run dev
```

Acesse `http://localhost:5173`. Não precisa de chave: sem o `.env.local`, o idioma padrão é o português.

## 🔧 Configurando o `.env.local` (opcional)

O `.env.local` fica **só na sua máquina** (está no `.gitignore`).

```bash
cp .env.example .env.local
```

```properties
# Idioma usado quando o do navegador não é pt-BR, en nem es
# (e quando ainda não há escolha salva). Opções: pt-BR | en | es
VITE_DEFAULT_LANGUAGE=pt-BR
```

Reinicie o `npm run dev` depois de alterar. A variável vira o `fallbackLng` do i18next (`I18N_CONFIG.FALLBACK` em `src/config/i18nConfig.js`).

> 💡 **Aqui o prefixo `VITE_` é de propósito:** o idioma padrão é usado no navegador e não é segredo. Nunca use `VITE_` para chaves e tokens.

> Para testar a detecção automática: apague a chave `i18nextLng` em **DevTools → Application → Local Storage** e troque o idioma do navegador (no Chrome: **Configurações → Idiomas**).

## ⚙️ Como funciona

```text
main.jsx ── import "./i18n" ──▶ i18n/index.js
                                   │  i18next.use(LanguageDetector).use(initReactI18next).init({...})
                                   │
                                   ├── locales/pt-BR/translation.json   { "layout": { "title": "Um site, três idiomas" } }
                                   ├── locales/en/translation.json      { "layout": { "title": "One website, three languages" } }
                                   └── locales/es/translation.json      { "layout": { "title": "Un sitio, tres idiomas" } }

Componente ── const { t } = useTranslation() ──▶ t("layout.title")
Bandeira  ── i18n.changeLanguage("en") ──▶ todos os componentes com useTranslation() renderizam de novo
```

### 1. Os arquivos de tradução

Um JSON por idioma, **com as mesmas chaves**. As chaves podem ser aninhadas (`"layout.title"`):

```json
// src/i18n/locales/pt-BR/translation.json
{
  "cards": {
    "interpolation": {
      "greeting": "Olá, {{name}}! Que bom ter você por aqui."
    },
    "plural": {
      "items_zero": "Nenhuma disciplina na grade",
      "items_one": "{{count}} disciplina na grade",
      "items_other": "{{count}} disciplinas na grade"
    }
  }
}
```

### 2. A configuração (`src/i18n/index.js`)

```js
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)      // descobre o idioma (localStorage → navegador)
  .use(initReactI18next)      // liga o i18next ao React
  .init({
    resources: { "pt-BR": { translation: ptBR }, en: { translation: en }, es: { translation: es } },
    supportedLngs: ["pt-BR", "en", "es"],
    fallbackLng: "pt-BR",     // idioma não suportado → português
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
    interpolation: { escapeValue: false }, // o React já protege contra XSS
  });
```

E no `main.jsx`, **antes** do `<App />`:

```jsx
import "./i18n";
```

### 3. Usando nos componentes

```jsx
import { Trans, useTranslation } from "react-i18next";

function Exemplo() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <h1>{t("layout.title")}</h1>
      <p>{t("cards.interpolation.greeting", { name: "Maria" })}</p>
      <p>{t("cards.plural.items", { count: 3 })}</p>
      <p>{t("cards.format.currency", { price: 1890.5 })}</p>

      <Trans
        i18nKey="cards.trans.text"
        components={{ b: <strong />, i: <em />, url: <a href="https://pucminas.instructure.com" /> }}
      />

      <button onClick={() => i18n.changeLanguage("es")}>Español</button>
    </>
  );
}
```

### 4. As bandeiras (`LanguageSwitcher`)

```jsx
import { BR, ES, US } from "country-flag-icons/react/3x2";

const LANGUAGES = [
  { code: "pt-BR", name: "Português", flag: BR },
  { code: "en", name: "English", flag: US },
  { code: "es", name: "Español", flag: ES },
];

{LANGUAGES.map(({ code, name, flag: Flag }) => (
  <button key={code} aria-pressed={i18n.resolvedLanguage === code} onClick={() => i18n.changeLanguage(code)}>
    <Flag aria-hidden="true" /> {name}
  </button>
))}
```

- As bandeiras são **componentes React em SVG** (pacote [`country-flag-icons`](https://www.npmjs.com/package/country-flag-icons)): nada de imagem externa nem emoji (emoji de bandeira não aparece no Windows).
- O botão ativo é o de `i18n.resolvedLanguage` (o idioma usado de fato: navegador em `en-US` → `en`).
- Cada idioma aparece com o nome **nele mesmo** ("English", "Español"): quem não lê português precisa achar o seu.

### Formatação (datas, números, moedas)

O i18next usa a **API `Intl` do navegador** direto no texto do JSON. O mesmo código gera resultados diferentes em cada idioma:

| JSON | pt-BR | en | es |
| --- | --- | --- | --- |
| `{{date, datetime(dateStyle: full)}}` | domingo, 11 de outubro de 2026 | Sunday, October 11, 2026 | domingo, 11 de octubre de 2026 |
| `{{value, number}}` | 1.234.567,891 | 1,234,567.891 | 1.234.567,891 |
| `{{price, currency(BRL)}}` · `(USD)` · `(EUR)` | R$ 1.890,50 | $1,890.50 | 1890,50 € |
| `{{rate, number(style: percent)}}` | 88% | 88% | 88 % |
| `{{days, relativetime(day)}}` | em 3 dias | in 3 days | dentro de 3 días |
| `{{items, list}}` | JavaScript, Python e Java | JavaScript, Python, and Java | JavaScript, Python y Java |

> A moeda é escolhida **no JSON de cada idioma** (`currency(BRL)`, `currency(USD)`, `currency(EUR)`): o tradutor decide, sem mexer no código. O valor **não é convertido**, só formatado.

### ⚠️ Pegadinhas

- **Nome das tags no `<Trans>`**: não use nomes de tags "vazias" do HTML, como `<link>`, `<img>`, `<br>` ou `<input>`: o `<Trans>` não coloca texto dentro delas. Por isso o link do Canvas se chama `<url>` no JSON.
- **`htmlTag` na detecção**: o `<html lang="pt-BR">` do `index.html` venceria o `en-US` do navegador (o i18next prefere um código exato a um parecido). Por isso a detecção usa só `localStorage` e `navigator`.
- **Chave faltando**: se uma chave não existir no `en`, o i18next mostra o texto do `fallbackLng` (português). Se não existir em nenhum, mostra a própria chave (`cards.simple.welcome`): fácil de achar na tela.

## ➕ Acrescentando um idioma

1. Copie `src/i18n/locales/pt-BR/translation.json` para `src/i18n/locales/fr/translation.json` e traduza os **valores** (as chaves ficam iguais).
2. Importe o JSON em `src/i18n/index.js` e coloque em `resources`: `fr: { translation: fr }`.
3. Acrescente o idioma em `src/config/i18nConfig.js`:

   ```js
   import { BR, ES, FR, US } from "country-flag-icons/react/3x2";
   // ...
   { code: "fr", name: "Français", short: "FR", flag: FR },
   ```

> 💡 Com muitos idiomas, em vez de colocar todos os JSON no bundle, dá para carregar só o idioma escolhido com o [`i18next-http-backend`](https://github.com/i18next/i18next-http-backend) (os arquivos ficam em `public/locales/`).

## 🧩 Usando no seu projeto

Copie para o seu projeto React + Vite:

```text
src/i18n/                          → configuração + um translation.json por idioma
src/config/i18nConfig.js           → idiomas, bandeiras e idioma padrão
src/components/LanguageSwitcher/   → botões com as bandeiras + CSS
```

Instale as dependências e importe a configuração no `main.jsx`:

```bash
npm install i18next react-i18next i18next-browser-languagedetector country-flag-icons
```

```jsx
import "./i18n";
```

## 📂 Estrutura do Projeto

```text
📁 Internacionalizacao_i18n
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/          └── Card da página com a faixa azul (logo PUC + i18next) e espaço para as bandeiras
│   │   ├── LanguageSwitcher/    └── Botões com as bandeiras (BR, US, ES)
│   │   └── I18nDemo/            └── Vitrine: texto, interpolação, plural, <Trans>, formatação e listas
│   │
│   ├── ⚙️ config
│   │   └── i18nConfig.js        └── Idiomas, bandeiras, idioma padrão e chave do localStorage
│   │
│   ├── 🌎 i18n
│   │   ├── index.js             └── Configuração do i18next (detector, idiomas, fallback)
│   │   └── 📁 locales
│   │       ├── pt-BR/translation.json
│   │       ├── en/translation.json
│   │       └── es/translation.json
│   │
│   ├── App.jsx
│   ├── index.css               └── Reset, variáveis de cor e fundo da página
│   └── main.jsx                └── Importa ./i18n antes de renderizar
│
├── 📄 .env.example      └── Opcional: idioma padrão (VITE_DEFAULT_LANGUAGE)
├── 📄 vite.config.js
└── 📄 package.json
```

## 📦 Dependências

```json
"dependencies": {
  "country-flag-icons": "^1.6.20",
  "i18next": "^26.4.3",
  "i18next-browser-languagedetector": "^8.2.1",
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-i18next": "^17.0.16",
  "react-icons": "^5.7.0"
}
```

- [`i18next`](https://www.i18next.com/): o motor de tradução (funciona em qualquer JavaScript)
- [`react-i18next`](https://react.i18next.com/): `useTranslation()`, `<Trans>` e o re-render ao trocar de idioma
- [`i18next-browser-languagedetector`](https://github.com/i18next/i18next-browser-languageDetector): descobre o idioma (escolha salva ou idioma do navegador) e salva a escolha
- [`country-flag-icons`](https://www.npmjs.com/package/country-flag-icons): bandeiras como componentes React em SVG
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones (inclusive o logo do i18next na faixa azul)

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

> ☁️ **Deploy na Vercel**: importe o repositório em [vercel.com/new](https://vercel.com/new) (preset **Vite**) e clique em **Deploy**. A `VITE_DEFAULT_LANGUAGE` é opcional: se quiser outro idioma padrão, cadastre em **Settings → Environment Variables** e faça o **Redeploy** (variáveis `VITE_` entram no build).

## 📄 Licença
Este projeto está licenciado sob a MIT License.
