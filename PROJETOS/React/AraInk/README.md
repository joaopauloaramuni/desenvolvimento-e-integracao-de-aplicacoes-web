# Projeto AraInk (React + Vite + IA) 🖋️

## 📖 Descrição

O **AraInk** é um estúdio de tatuagem com IA feito com **React** e **Vite**. A pessoa descreve uma ideia ("lobo uivando para a lua cheia"), escolhe o **estilo**, a **espessura do traço**, o **acabamento** e o **formato**, e o AraInk gera **desenhos de tatuagem inéditos**.

As imagens podem vir de **dois provedores**, escolhidos no `.env.local`:

| Provedor | Empresa | Modelo padrão | Ajustar um desenho | Custo |
|---|---|---|---|---|
| **GPT Image** (padrão) | [OpenAI](https://platform.openai.com/docs/guides/image-generation) | `gpt-image-1` | Edita a imagem de verdade (`/v1/images/edits`) | 💳 **Pago** |
| **Gemini** | [Google](https://ai.google.dev/gemini-api/docs/image-generation) | `gemini-2.5-flash-image` | Edita a imagem de verdade (imagem + pedido) | 💳 **Pago** |

> 💳 **Os dois provedores são pagos.** Nenhuma das duas APIs tem plano gratuito para gerar imagens: cada imagem gerada **ou ajustada** é cobrada. O app gratuito do Gemini e o ChatGPT geram imagens de graça, mas eles **não** dão acesso à API. Veja **💰 Quanto custa**.

O projeto é **100% front-end**: não existe servidor nem pasta `api/`. O navegador chama a API direto, com a chave lida do `.env.local`. Isso deixa o projeto simples de rodar, mas a chave fica no navegador (veja **🔐 Segurança**).

O visual remete ao universo da tatuagem: a faixa do topo usa o **roxo da tinta de stencil** (o decalque que o tatuador transfere para a pele), o título usa letra **gótica** (Pirata One), os desenhos aparecem em "papel de flash" e o estilo escolhido ganha um **contorno tracejado**, como um decalque.

## ✨ Funcionalidades

- **Dois provedores de imagem**: GPT Image (OpenAI) ou Gemini (Google), trocados no `.env.local` sem mexer no código. A bancada mostra qual está em uso.
- **Seletor de estilos em "folha de flash"**: 12 técnicas, cada uma desenhando **o mesmo coração** em SVG, para comparar o traço e não o tema. Filtros **Só traço**, **Preto e sombra** e **Com cor**, e um painel com a descrição, **"bom para"** e o **traço sugerido** do estilo.
- **Sugestão automática**: ao escolher um estilo, a espessura e o acabamento mudam para o que combina com ele (fineline → linha fina e só linhas; old school → linha grossa e colorido). Dá para trocar depois.
- **Controles de linha e acabamento**: espessura **fina, média ou grossa** (com o desenho do traço), acabamento **só linhas** (pronto para stencil), **preto e cinza** ou **colorido**, e nível de detalhe.
- **Formato por local do corpo**: quadrado (ombro, mão, nuca), vertical (antebraço, panturrilha), retrato (costas, coxa) e horizontal (clavícula, peito). O formato vira o tamanho da imagem em cada provedor.
- **Ideias prontas** para começar com um clique e atalho **Ctrl + Enter** para gerar.
- **De 1 a 4 variações**, cada uma pedindo uma composição diferente. Saem em paralelo (2 por vez no GPT Image, 4 no Gemini); as outras mostram "Na fila".
- **Bancada**: animação de "agulha" contornando um coração enquanto a IA desenha, botão **Parar**, resumo das escolhas e o **prompt enviado** (com botão de copiar), ótimo para estudar engenharia de prompt.
- **Ajustar um desenho**: manda a imagem atual de volta com um pedido ("linhas mais finas", "tire as estrelas"). Os dois provedores **editam a imagem**. Cada ajuste vira uma nova versão, com **Desfazer ajuste**.
- **Baixar** em PNG (`araink-fineline-lua-crescente....png`).
- **Sua coleção**: guarda as variações favoritas no **IndexedDB** do navegador (o `localStorage` só aguenta duas ou três imagens).
- **Exemplos de flash**: seis desenhos em estilos diferentes; **Usar esta ideia** leva a ideia e as escolhas para o estúdio.
- **Tema light e dark**: segue o sistema e tem botão (☀️/🌙) que salva a escolha. Os desenhos ficam sempre em papel claro, como folhas de flash presas na parede do estúdio.
- **Mensagens de erro claras**: chave ausente ou inválida, sem crédito, organização não verificada (OpenAI), Gemini sem faturamento, limite por minuto, pedido bloqueado e tempo esgotado.
- **Responsivo e acessível**: opções são `<input type="radio">` de verdade (setas do teclado funcionam), foco visível e `prefers-reduced-motion` respeitado.

## 🖼️ Capturas de Tela

| Home | Home - Tema escuro |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Home.png) | ![HomeDark](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/HomeDark.png) |

| Tatuagens geradas | Tatuagens geradas - Tema escuro |
| :---: | :---: |
| ![Resultado](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Resultado.png) | ![ResultadoDark](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/ResultadoDark.png) |

| Seletor de estilos | Seletor de estilos - Filtro "Com cor" |
| :---: | :---: |
| ![Estilos](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Estilos.png) | ![EstilosFiltro](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/EstilosFiltro.png) |

| Ajustar um desenho | Sua coleção |
| :---: | :---: |
| ![Ajuste](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Ajuste.png) | ![Colecao](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Colecao.png) |

| Exemplos de flash |
| :---: |
| ![Exemplos](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Exemplos.png) |

| Celular | Celular - Tema escuro | Celular - Bancada |
| :---: | :---: | :---: |
| ![Mobile](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/Mobile.png) | ![MobileDark](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/MobileDark.png) | ![MobileResultado](https://joaopauloaramuni.github.io/react-imgs/AraInk/imgs/MobileResultado.png) |

> 🖌️ As imagens da bancada e dos exemplos nas capturas são **ilustrações de referência desenhadas em SVG** para o projeto, e não gerações do GPT Image ou do Gemini (as capturas foram feitas com as respostas da API simuladas). Para trocar os exemplos por gerações reais, rode `npm run exemplos` (veja **🖼️ Gerando os exemplos**).

## 🚀 Como rodar

```bash
npm install
# escolha o provedor e cole a chave no .env.local (passo a passo abaixo)
npm run dev
```

Acesse `http://localhost:5173`.

> Sem a chave do provedor escolhido, a página abre normalmente, mostra o aviso **"Falta a chave do ..."** e o botão **Gerar** fica desativado.

## 🔑 Criando a chave da OpenAI (GPT Image), passo a passo

> A conta da **API** da OpenAI é separada do **ChatGPT**: assinar o ChatGPT Plus não dá crédito na API.

1. **Crie a conta da API.** Acesse [platform.openai.com](https://platform.openai.com) e entre (ou crie uma conta). É o mesmo login do ChatGPT, mas o painel e a cobrança são outros.
2. **Adicione crédito.** Vá em **Settings → Billing** ([platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing)), clique em **Add payment details**, cadastre um cartão e compre crédito. A API funciona no modelo **pré-pago**: sem saldo, toda chamada falha.
   > 💡 Deixe a **recarga automática desligada** enquanto testa: assim o gasto máximo é o crédito que você comprou.
3. **Verifique a organização.** O `gpt-image-1` só funciona para **organizações verificadas**. Vá em **Settings → Organization → General** ([platform.openai.com/settings/organization/general](https://platform.openai.com/settings/organization/general)) e clique em **Verify Organization**. A verificação pede um **documento de identidade** e uma selfie. Depois de aprovada, pode levar alguns minutos para o acesso liberar.
   > Sem isso, o AraInk mostra: *"Sua organização na OpenAI precisa ser verificada para usar o GPT Image"*.
4. **Crie um projeto para o AraInk** (recomendado). Em **Settings → Projects**, clique em **Create project** e dê o nome `AraInk`. Dentro dele, em **Limits**, defina um **limite de gastos mensal** (por exemplo, US$ 5). Se a chave vazar, o estrago fica limitado a esse valor.
5. **Crie a chave.** Vá em **API keys** ([platform.openai.com/api-keys](https://platform.openai.com/api-keys)) e clique em **Create new secret key**:
   - **Owned by**: You
   - **Project**: AraInk
   - **Permissions**: **Restricted**, liberando só **Images** (*Write*). Assim a chave não serve para mais nada.
6. **Copie a chave** (começa com `sk-proj-`). Ela aparece **uma vez só**: se perder, crie outra.
7. **Cole no `.env.local`:**

   ```properties
   VITE_IMAGE_PROVIDER=openai
   VITE_OPENAI_API_KEY=sk-proj-...sua-chave...
   ```

8. Reinicie o `npm run dev`. A bancada passa a mostrar **GPT Image**.

## 🔑 Criando a chave do Gemini, passo a passo

> O **app** do Gemini ([gemini.google.com](https://gemini.google.com)) gera imagens de graça, mas a **API** não: no plano gratuito da API, o limite para os modelos de imagem é **zero**. Sem faturamento ativo, o erro é este:
>
> ```text
> HTTP 429: ... generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image
> ```
>
> Esperar o "retry in 15h" não resolve: é preciso **ativar o faturamento**.

1. **Entre no Google AI Studio.** Acesse [aistudio.google.com/apikey](https://aistudio.google.com/apikey) com uma conta Google e aceite os termos, se for o primeiro acesso.
   > Se a sua conta institucional não tiver acesso ao AI Studio, use uma conta Gmail pessoal.
2. **Crie a chave.** Clique em **Create API key** e escolha um projeto do Google Cloud (ou deixe o AI Studio criar um).
3. **Copie a chave** (começa com `AIza`).
4. **Ative o faturamento.** Na lista de chaves, ao lado do projeto, clique em **Set up billing**, crie (ou escolha) uma conta de faturamento do Google Cloud e cadastre um cartão. O projeto passa do plano gratuito para o **pago**.
5. **Crie um alerta de orçamento** (recomendado). No [Google Cloud Console](https://console.cloud.google.com/billing), em **Billing → Budgets & alerts**, crie um orçamento (por exemplo, US$ 5) com alerta por e-mail.
6. **Restrinja a chave** (recomendado). Em [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials), no mesmo projeto, clique na chave:
   - **Application restrictions** → **Websites (HTTP referrers)**: cadastre `http://localhost:5173/*` (e o domínio publicado, se houver);
   - **API restrictions** → **Restrict key**: marque só a **Generative Language API**.
7. **Cole no `.env.local`:**

   ```properties
   VITE_IMAGE_PROVIDER=gemini
   VITE_GEMINI_API_KEY=AIzaSy...sua-chave...
   ```

8. Reinicie o `npm run dev`. A bancada passa a mostrar **Gemini**.

## ⚙️ Configurando o `.env.local`

O `.env.local` **já vem no projeto** e está no `.gitignore` (regra `*.local`), então **não vai para o GitHub**. O `.env.example` é o modelo que vai para o repositório.

```properties
# openai = GPT Image (padrão) | gemini = Google Gemini (os dois são pagos)
VITE_IMAGE_PROVIDER=openai

# OpenAI (GPT Image): https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=
# VITE_OPENAI_IMAGE_MODEL=gpt-image-1
# VITE_OPENAI_IMAGE_QUALITY=medium

# Google Gemini: https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=
# VITE_GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
```

| Variável | Para que serve |
|---|---|
| `VITE_IMAGE_PROVIDER` | `openai` (GPT Image, padrão) ou `gemini` |
| `VITE_OPENAI_API_KEY` | Chave da API da OpenAI (`sk-proj-...`) |
| `VITE_OPENAI_IMAGE_MODEL` | Modelo de imagem da OpenAI (opcional). Padrão: `gpt-image-1` |
| `VITE_OPENAI_IMAGE_QUALITY` | `low`, `medium` (padrão) ou `high`: muda o custo e o detalhe de cada imagem |
| `VITE_GEMINI_API_KEY` | Chave do Google AI Studio (`AIza...`) |
| `VITE_GEMINI_IMAGE_MODEL` | Modelo de imagem do Gemini (opcional). Padrão: `gemini-2.5-flash-image` |

Dá para deixar as **duas chaves** preenchidas e trocar só o `VITE_IMAGE_PROVIDER` para comparar os resultados.

Se apagar o `.env.local` por engano, crie de novo a partir do modelo:

```bash
cp .env.example .env.local
```

Reinicie o `npm run dev` depois de alterar: o Vite só lê o `.env.local` quando inicia.

> 🤖 **Modelos novos.** As duas empresas lançam versões novas com frequência. Confira as listas em [platform.openai.com/docs/models](https://platform.openai.com/docs/models) e [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) e troque o modelo no `.env.local`, sem mexer no código.

## 💰 Quanto custa

Cada **variação** e cada **ajuste** é uma imagem cobrada. Valores **aproximados** para uma imagem quadrada (1024 × 1024), segundo as tabelas de preço que eu conhecia em meados de 2026. **Confira os valores atuais** antes de usar:

| Provedor | Configuração | Por imagem (aprox.) | Preços atuais |
|---|---|---|---|
| GPT Image | `low` | ~ US$ 0,01 | [openai.com/api/pricing](https://openai.com/api/pricing) |
| GPT Image | `medium` (padrão) | ~ US$ 0,04 | |
| GPT Image | `high` | ~ US$ 0,17 | |
| Gemini | `gemini-2.5-flash-image` | ~ US$ 0,04 | [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing) |

Exemplos de conta:

- **Gerar 2 variações e ajustar uma**: 3 imagens.
- **`npm run exemplos`**: 6 imagens.
- Imagens verticais e horizontais (1024 × 1536) do GPT Image custam um pouco mais que as quadradas.

> 💡 Para testar sem gastar muito: use **1 variação** e `VITE_OPENAI_IMAGE_QUALITY=low`.

## 🔐 Segurança: a chave fica no navegador

Este projeto foi feito **sem back-end** de propósito. O custo disso:

> ⚠️ **Tudo que começa com `VITE_` entra no JavaScript do site na hora do build.** No `npm run dev` isso não importa (só você acessa), mas **no site publicado qualquer visitante consegue ler a chave** no DevTools (aba **Network**, cabeçalho `Authorization` ou `x-goog-api-key`) e **gastar o seu crédito**.

| | OpenAI | Gemini |
|---|---|---|
| Restringir a chave por **site** | ❌ Não existe | ✅ HTTP referrers (proteção fraca: dá para forjar fora do navegador) |
| Restringir a chave por **API** | ✅ Chave **Restricted** só com **Images** | ✅ Só a **Generative Language API** |
| Limitar o gasto | ✅ **Limite mensal do projeto** + crédito pré-pago sem recarga automática | ⚠️ **Alerta de orçamento** (avisa, mas não bloqueia) |

**Recomendação:** use o AraInk **localmente** (`npm run dev`) e siga os passos de proteção da sua chave acima. Para publicar para outras pessoas, a chave precisa sair do navegador: o caminho é o mesmo do projeto [GeminiAPI](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/GeminiAPI), com uma **Vercel Function** (`api/imagem.js`) guardando a chave (sem `VITE_`) e o React chamando `/api/imagem`. Só o `src/services/imageService.js` muda.

## 🖼️ Gerando os exemplos

O script `scripts/gerar-exemplos.mjs` gera as 6 imagens de `public/exemplos/` com o **provedor do `.env.local`** e os **mesmos prompts do app** (ele importa o `promptBuilder.js` e o `tattooOptions.js`). Cada exemplo usa a ideia, o estilo, o traço, o acabamento e o formato definidos em `EXAMPLES`.

```bash
npm run exemplos                                   # gera os 6 (substitui os arquivos atuais)
npm run exemplos -- aquarela-pena                  # gera só um
npm run exemplos -- fineline-lua dotwork-mandala   # gera alguns
```

```text
🖋️  Gerando 6 exemplo(s) com o GPT Image...

✅ oldschool-coracao -> public/exemplos/oldschool-coracao.png
✅ blackwork-mariposa -> public/exemplos/blackwork-mariposa.png
...
Pronto! Os novos exemplos já aparecem no npm run dev.
```

- Roda no **Node** (18 ou mais novo), fora do navegador.
- **Custa 6 imagens** (veja **💰 Quanto custa**).
- Espera 3 segundos entre uma imagem e outra, para não estourar o limite por minuto.
- Se uma falhar, as outras continuam; rode de novo só o `id` que faltou. Erros que valem para todas (chave, crédito, organização não verificada, Gemini sem faturamento) param o script na hora.
- Não gostou de um resultado? Rode o mesmo `id` de novo: cada geração sai diferente. Para mudar a ideia de um exemplo, edite `EXAMPLES` em `src/config/tattooOptions.js`.
- Os arquivos antigos são **substituídos**. Se quiser guardar os desenhos em SVG originais, copie a pasta antes.

## 🎨 Estilos disponíveis

| Estilo | Categoria | Traço sugerido | Bom para |
|---|---|---|---|
| Fineline | Só traço | Fina, só linhas | Pulso, costela, flores e frases curtas |
| Old school | Com cor | Grossa, colorido | Braço e perna, peças que precisam durar décadas |
| Neo-tradicional | Com cor | Média, colorido | Retratos de animais, flores e peças médias |
| Blackwork | Preto e sombra | Grossa, preto e cinza | Peças gráficas, cobertura de tatuagens antigas |
| Dotwork | Preto e sombra | Fina, preto e cinza | Mandalas, geometria e texturas suaves |
| Geométrico | Só traço | Média, só linhas | Antebraço, costas e composições simétricas |
| Aquarela | Com cor | Fina, colorido | Animais, penas e flores com movimento |
| Japonês | Com cor | Grossa, colorido | Fechamentos grandes: braço, costas e perna |
| Realismo P&B | Preto e sombra | Fina, preto e cinza | Retratos, animais e estátuas |
| Minimalista | Só traço | Fina, só linhas | Primeira tatuagem, dedo, tornozelo e nuca |
| Sketch | Só traço | Fina, só linhas | Quem quer um ar artístico e inacabado |
| Ornamental | Preto e sombra | Média, preto e cinza | Coxa, esterno, mãos e peças tipo joia |

Para **criar um estilo novo**, adicione um item em `STYLES` (`src/config/tattooOptions.js`) e um desenho do coração em `ARTS` (`src/components/StyleSelector/StyleArt.jsx`), com o mesmo `id`.

## 🧠 Como funciona

```text
                          ┌─ VITE_IMAGE_PROVIDER=openai ─▶ POST api.openai.com/v1/images/generations
TattooForm ─▶ imageService ┤                                 (ajuste: /v1/images/edits, multipart)
 (escolhas)  promptBuilder └─ VITE_IMAGE_PROVIDER=gemini ─▶ POST .../models/{modelo}:generateContent
                                                            (ajuste: mesma rota, com a imagem junto)
```

**Gerar**

1. O `TattooForm` junta as escolhas em `settings` (ideia, estilo, linha, acabamento, detalhe, formato, variações).
2. O `promptBuilder.js` monta o prompt (o mesmo para os dois provedores).
3. O `useTattooGenerator` cria um cartão por variação e chama o `imageService.gerar`, que manda para o provedor escolhido. Cada variação recebe a frase *"Variation 2 of 3: explore a composition clearly different..."*.
4. As variações saem em paralelo, até o limite do provedor (`simultaneos` em `providerConfig.js`: 2 no GPT Image, 4 no Gemini); as outras mostram **"Na fila"**.
5. A imagem volta em **base64** e vira um `data:image/png;base64,...`, para dar para baixar e guardar na coleção. Se uma variação falhar, só aquele cartão mostra o erro; erros que valem para todas (chave, crédito) param a fila.

**Ajustar**

| Provedor | Como o ajuste funciona |
|---|---|
| GPT Image | `POST /v1/images/edits` em **multipart**, com a imagem atual (arquivo PNG) + o pedido |
| Gemini | `generateContent` com a imagem atual (`inlineData`, base64) + o pedido, na mesma mensagem |

### O prompt

Os trechos técnicos ficam **em inglês** (os modelos seguem melhor as instruções assim) e a ideia vai **do jeito que a pessoa escreveu**: os dois entendem português. Exemplo para fineline, linha fina, só linhas, formato quadrado:

```text
Create an original, never-before-seen tattoo design (tattoo flash artwork) of: Lua crescente com ramo de oliveira e pequenas estrelas.
Style: fineline tattoo, single-needle delicate thin lines, minimal shading, elegant and airy composition.
Linework: thin delicate lines (3RL needle).
Finish: linework only, no shading and no color, crisp black outlines ready to become a stencil.
Detail: simple design with few elements, readable at small size.
Composition: compact square composition.
Rules: one finished tattoo design, centered, on a plain pure white background, with clean edges that a tattoo artist can turn into a stencil.
Do not show skin, a body, a mockup or a photo. No watermark, signature or frame.
Only include lettering if the idea explicitly asks for words.
Do not copy existing characters, logos, brands or famous artworks.
```

O prompt completo de cada geração aparece na bancada, em **Ver o prompt enviado**.

### As requisições

```js
// GPT Image (src/services/openaiService.js)
await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
  body: JSON.stringify({ model: "gpt-image-1", prompt, n: 1, size: "1024x1536", quality: "medium", output_format: "png" }),
});
// A imagem volta em data[0].b64_json

// Gemini (src/services/geminiService.js)
await fetch(`${BASE_URL}/gemini-2.5-flash-image:generateContent`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "2:3" } },
  }),
});
// A imagem volta em candidates[0].content.parts[].inlineData { mimeType, data (base64) }
```

### Formatos

| Formato | Locais | GPT Image (`size`) | Gemini (`aspectRatio`) |
|---|---|---|---|
| Quadrado | Ombro, mão, nuca | `1024x1024` | `1:1` |
| Vertical | Antebraço, panturrilha | `1024x1536` | `2:3` |
| Retrato | Costas, coxa | `1024x1536` | `2:3` |
| Horizontal | Clavícula, peito | `1536x1024` | `3:2` |

> O GPT Image só aceita três tamanhos, por isso **vertical** e **retrato** saem na mesma proporção; o que muda entre eles é a composição pedida no prompt.

### Erros tratados

Os erros dos dois provedores passam pelo `src/services/imageErrors.js`.

| Código | Provedor | Quando | Mensagem na tela |
|---|---|---|---|
| `missing_key` | Ambos | `.env.local` sem a chave do provedor | A chave do {provedor} não está configurada... |
| `invalid_key` | Ambos | `401` / `400 API key not valid` | A {empresa} recusou a chave... |
| `org_not_verified` | GPT Image | `403` pedindo verificação | Sua organização na OpenAI precisa ser verificada... |
| `permission` | Ambos | `403` (chave restrita sem Images / restrição de site no Google) | A chave não tem permissão... |
| `no_credit` | Ambos | `insufficient_quota` / faturamento inativo | Sem crédito na conta da OpenAI... / O faturamento não está ativo... |
| `no_free_tier` | Gemini | `429` com `free_tier ... limit: 0` | Este modelo de imagem do Gemini não tem cota no plano gratuito... |
| `quota` | Ambos | `429` | Limite de imagens por minuto atingido... |
| `model_not_found` | Ambos | `404` | O modelo de imagem não foi encontrado... |
| `blocked` | Ambos | `moderation_blocked` / `blockReason` de segurança | O {provedor} recusou este pedido... |
| `no_image` | Ambos | Resposta sem imagem | O {provedor} respondeu sem imagem... |
| `timeout` | Ambos | Mais de 180 s (GPT Image) / 90 s (Gemini) | O {provedor} demorou demais... |
| `network` | Ambos | Sem internet / CORS | Sem conexão com a API do {provedor}... |

## 📂 Estrutura do Projeto

```text
📁 AraInk
│
├── 📁 imgs                              └── Capturas de tela usadas neste README
├── 📁 public
│   ├── favicon.svg                      └── Gota de tinta com o "A" (roxa, com variante para tema escuro)
│   └── 📁 exemplos                      └── 6 desenhos de referência (fineline, old school, dotwork...)
│
├── 📁 scripts
│   └── gerar-exemplos.mjs               └── npm run exemplos: gera public/exemplos/ (GPT Image ou Gemini)
│
├── 📁 src
│   ├── 📁 assets/images
│   │   └── pucminas-logo.png            └── Logo da PUC Minas (branca, para a faixa roxa)
│   │
│   ├── ⚙️ config
│   │   ├── appConfig.js                 └── Limites (ideia, ajuste, variações), chave do tema, IndexedDB
│   │   ├── providerConfig.js            └── Provedor escolhido (VITE_IMAGE_PROVIDER) e dados de cada um
│   │   ├── openaiConfig.js              └── Chave, modelo, qualidade e tempo limite do GPT Image
│   │   ├── geminiConfig.js              └── Chave, modelo e tempo limite do Gemini
│   │   └── tattooOptions.js             └── Estilos, traços, acabamentos, formatos, ideias e exemplos (+ prompts)
│   │
│   ├── 🔎 services
│   │   ├── imageService.js              └── Ponto único do app: gerar e editar (escolhe o provedor)
│   │   ├── openaiService.js             └── /v1/images/generations e /v1/images/edits
│   │   ├── geminiService.js             └── generateContent (gerar e editar)
│   │   ├── imageErrors.js               └── ImageError e as mensagens de erro dos dois provedores
│   │   └── promptBuilder.js             └── buildTattooPrompt, withVariation e buildRefinePrompt
│   │
│   ├── 🪝 hooks
│   │   ├── useTattooGenerator.js        └── Bancada: variações em paralelo, parar, ajustar e desfazer
│   │   ├── useCollection.js             └── Coleção: listar, guardar e excluir (IndexedDB)
│   │   └── useTheme.js                  └── Tema light/dark (sistema + escolha salva)
│   │
│   ├── 🧰 utils
│   │   ├── download.js                  └── Baixar PNG, copiar texto, slug e ids
│   │   ├── imageDb.js                   └── IndexedDB com Promises (sem biblioteca)
│   │   └── storage.js                   └── localStorage com try/catch (tema)
│   │
│   ├── 🎨 components
│   │   ├── PageLayout/                  └── Card com a faixa roxa (logo PUC + AraInk), título e rodapé
│   │   ├── AraInkLogo/                  └── Logo SVG do AraInk (usa currentColor)
│   │   ├── ThemeToggle/                 └── Botão ☀️/🌙
│   │   ├── TattooForm/                  └── Estúdio: ideia, estilo, traço, acabamento, formato, variações
│   │   ├── StyleSelector/               └── Folha de flash com filtros + StyleArt (12 corações em SVG)
│   │   ├── OptionGroup/                 └── Grupo de opções com radios de verdade (reutilizável)
│   │   ├── ResultStage/                 └── Bancada (ResultStage) + cartão de variação (ResultCard)
│   │   ├── NeedleLoader/                └── Animação da "agulha" contornando o coração
│   │   ├── ExampleGallery/              └── Exemplos de flash com "Usar esta ideia"
│   │   └── Collection/                  └── Sua coleção (baixar e excluir)
│   │
│   ├── App.jsx                          └── Estado das escolhas e montagem da página
│   ├── index.css                        └── Tokens de cor (light e dark), reset, botões, chips e mensagens
│   └── main.jsx
│
├── 📄 .env.local                        └── Provedor e chaves (fica só na sua máquina)
├── 📄 .env.example                      └── Modelo do .env.local (vai para o GitHub)
├── 📄 index.html                        └── Fontes Montserrat + Pirata One e script do tema (sem "piscar")
├── 📄 vite.config.js
└── 📄 package.json
```

## ☁️ Deploy na Vercel

> ⚠️ Antes de publicar, leia **🔐 Segurança**: no site publicado, a chave fica visível para qualquer visitante. Com a OpenAI, não há como restringir a chave por site.

1. Suba o projeto para um repositório no GitHub (o `.env.local` **não** vai junto).
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório (preset **Vite**).
3. Em **Project Name**, use **`araink`** (vira `https://araink.vercel.app`, se o nome estiver livre).
4. Abra **Environment Variables** e cadastre:

   | Key | Value |
   | --- | --- |
   | `VITE_IMAGE_PROVIDER` | `openai` ou `gemini` |
   | `VITE_OPENAI_API_KEY` | `sk-proj-...` (se usar o GPT Image) |
   | `VITE_GEMINI_API_KEY` | `AIza...` (se usar o Gemini) |

5. Clique em **Deploy**.
6. Com o Gemini, adicione o endereço publicado nas **restrições de site** da chave.

> As variáveis `VITE_*` entram no JavaScript **na hora do build**: se trocar alguma, faça um **Redeploy**.

Como o AraInk tem uma página só (sem React Router), não precisa de `vercel.json`. O mesmo build (`npm run build` → `dist/`) também funciona no **GitHub Pages** ou no **Netlify**.

## 🚧 Limitações de um gerador sem back-end

| Limitação | Por quê | Como resolveria |
|---|---|---|
| A chave fica visível no site publicado | `VITE_*` vai para o navegador | Vercel Function guardando a chave (veja **Segurança**) |
| Sem limite de uso por visitante | Não há servidor para contar pedidos | Back-end com rate limit (como no projeto GeminiAPI) |
| Os dois provedores são pagos | Nenhuma API tem cota gratuita para imagens | Qualidade `low` e 1 variação para testar |
| A coleção é por navegador | Fica no IndexedDB local | Supabase Storage + Auth |
| As imagens não são vetoriais | As APIs devolvem PNG | Vetorizar depois (ex.: Inkscape → Trace Bitmap) |
| O resultado varia a cada geração | Modelos de imagem não são determinísticos | Gerar mais variações e usar **Ajustar** |

## 🧯 Problemas comuns

| Sintoma / erro | Causa provável | Solução |
|---|---|---|
| Aviso "Falta a chave do ..." | Chave do provedor escolhido vazia, ou servidor não reiniciado | Colar a chave no `.env.local` e reiniciar o `npm run dev` |
| "A OpenAI recusou a chave" (`401`) | Chave copiada errada ou apagada | Criar outra em [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| "Sua organização na OpenAI precisa ser verificada" (`403`) | O `gpt-image-1` exige organização verificada | Fazer o passo 3 da chave da OpenAI e esperar alguns minutos |
| "A chave não tem permissão" (`403`) | Chave **Restricted** sem a permissão de **Images** (OpenAI) ou restrição de site sem o endereço atual (Gemini) | Liberar **Images** na chave / incluir `http://localhost:5173/*` |
| "Sem crédito na conta da OpenAI" | Saldo zerado ou limite do projeto atingido | Adicionar crédito em **Settings → Billing** ou aumentar o limite do projeto |
| Gemini: `429` com `limit: 0` | Faturamento não ativado (a API não tem imagens grátis) | Clicar em **Set up billing** no AI Studio |
| "Limite de imagens por minuto atingido" (`429`) | Contas novas têm limite baixo por minuto | Esperar um minuto e gerar menos variações |
| "O modelo de imagem não foi encontrado" (`404`) | Nome do modelo errado ou descontinuado | Conferir o nome no `.env.local` |
| "Recusou este pedido pelas regras de segurança" | Filtro de moderação | Reescrever a ideia |
| "Demorou demais" | Qualidade alta ou serviço lento | Tentar de novo ou usar `VITE_OPENAI_IMAGE_QUALITY=low` |
| Coleção não salva | Aba anônima ou armazenamento cheio | Usar uma aba normal / excluir itens antigos |
| Mudei o `.env.local` e nada mudou | O Vite só lê o arquivo ao iniciar | Reiniciar o `npm run dev` (ou Redeploy na Vercel) |

## 📦 Dependências

```json
"dependencies": {
  "react": "^19.3.0",
  "react-dom": "^19.3.0",
  "react-icons": "^5.7.0"
}
```

- Nenhum SDK da OpenAI nem do Gemini: as chamadas são `fetch` para as APIs REST, para ficar claro o que vai e o que volta.
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones do [Lucide](https://lucide.dev/) (`react-icons/lu`).
- IndexedDB, `FormData` e download de imagens com APIs nativas do navegador, sem bibliotecas.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |
| `npm run exemplos` | Gera as imagens de `public/exemplos/` com o provedor do `.env.local` (aceita ids: `npm run exemplos -- aquarela-pena`) |

## 🔗 Urls do projeto

http://localhost:5173/

https://araink.vercel.app/

## 📚 Documentação e Links Úteis

**OpenAI (GPT Image)**

- [Chaves de API](https://platform.openai.com/api-keys)
- [Guia de geração de imagens](https://platform.openai.com/docs/guides/image-generation)
- [Referência da API de imagens](https://platform.openai.com/docs/api-reference/images)
- [Preços](https://openai.com/api/pricing)
- [Verificação da organização](https://help.openai.com/en/articles/10910291-api-organization-verification)
- [Limites de uso](https://platform.openai.com/docs/guides/rate-limits)

**Google Gemini**

- [Google AI Studio: chaves de API](https://aistudio.google.com/apikey)
- [Gemini API: geração de imagens](https://ai.google.dev/gemini-api/docs/image-generation)
- [Gemini API: modelos](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API: preços](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API: limites de uso](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Google Cloud: restringir chaves de API](https://cloud.google.com/docs/authentication/api-keys#adding-api-restrictions)

**React, Vite e navegador**

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vite.dev/)
- [Variáveis de ambiente no Vite](https://vite.dev/guide/env-and-mode)
- [MDN: IndexedDB](https://developer.mozilla.org/pt-BR/docs/Web/API/IndexedDB_API)
- [MDN: FormData](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData)
- [MDN: AbortController](https://developer.mozilla.org/pt-BR/docs/Web/API/AbortController)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)

**Projetos relacionados**

- [GeminiAPI (React + Vercel Function)](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/GeminiAPI)
- [AraUrlShortener (React + Supabase)](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/AraUrlShortener)

## 📄 Licença
Este projeto está licenciado sob a MIT License.
