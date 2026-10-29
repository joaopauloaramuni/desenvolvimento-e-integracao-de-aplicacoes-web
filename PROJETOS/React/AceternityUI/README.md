# Projeto AceternityUI (React + Vite + Tailwind) ✨

## 📖 Descrição

Oito **componentes animados da [Aceternity UI](https://ui.aceternity.com/)** prontos para levar para o **seu portfólio**: um feixe de luz atrás do seu nome, texto digitado, card 3D, grade de projetos, faixa de depoimentos, dock de links e botão com borda animada. Escolha um componente, teste na demonstração e copie o código.

Este projeto **não usa API externa nem chave**: não precisa de `.env.local` nem de variável na Vercel.

Recursos:

- **8 componentes** da Aceternity UI, cada um com demonstração ao vivo
- **Código original** da Aceternity, convertido para JavaScript (só os tipos do TypeScript foram removidos)
- Aba **Portfólio completo**: sete componentes juntos numa página de portfólio de exemplo
- **Código pronto para copiar**: o código mostrado na tela é o próprio arquivo que está rodando (importado com `?raw` do Vite)
- **Código do componente** e **tabela de props** explicadas em português
- Botão **Reiniciar animação** para ver o efeito de novo
- O componente escolhido fica no endereço (`/#card-3d`, `/#dock`...), para compartilhar o link
- Cores no **azul PUC Minas** (`#005380`), também disponíveis como classes do Tailwind (`bg-puc`, `text-puc-soft`...) e aplicadas nos componentes **pelas props**, sem editar o código original

## ✨ O que é a Aceternity UI?

A [Aceternity UI](https://ui.aceternity.com/) é uma coleção de componentes animados para React, criada pelo desenvolvedor **Manu Arora**. É conhecida pelos efeitos chamativos: feixes de luz, cards 3D, fundos com brilho, textos que se revelam.

O jeito de usar é parecido com o [React Bits](https://reactbits.dev/) (veja o projeto [ReactBits](../ReactBits) deste repositório):

- **Não é um pacote npm.** Você **copia o código do componente** para dentro do seu projeto (ou usa a CLI do [shadcn](https://ui.shadcn.com/), que faz a cópia para você).
- Os componentes são escritos com **[Tailwind CSS](https://tailwindcss.com/)** (as classes ficam direto no JSX) e **[Motion](https://motion.dev/)** (o antigo Framer Motion) para as animações.
- Todos usam uma função pequena chamada **`cn`**, que fica em `src/lib/utils.js` e junta classes do Tailwind sem conflito.
- Como o código fica no seu projeto, você pode **ler e alterar** tudo: cores, tamanhos, velocidade.

Há componentes **gratuitos** e uma parte **paga** (Aceternity UI Pro). Os oito usados aqui estão na parte gratuita do site.

> **Sobre o código deste projeto:** os arquivos em `src/components/ui/` são o **código original** da Aceternity UI, baixado do registro oficial do site (`https://ui.aceternity.com/registry/<nome>.json`, o mesmo que a CLI usa). O site entrega os componentes em **TypeScript** (`.tsx`); aqui eles foram convertidos para **JavaScript** removendo **apenas os tipos** (com [ts-blank-space](https://github.com/bloomberg/ts-blank-space) + [Prettier](https://prettier.io/)). A lógica e as classes são exatamente as do site. A única linha retirada fora os tipos foi o import de `MotionValue` no `floating-dock.jsx`, que só era usado como tipo. Confira os termos de uso no próprio site antes de usar num projeto comercial.

## 🖼️ Capturas de Tela

| Visão geral | Spotlight |
| :---: | :---: |
| ![Início](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Inicio.png) | ![Spotlight](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Spotlight.png) |

| Texto que surge (TextGenerateEffect) | Digitação (TypewriterEffect) |
| :---: | :---: |
| ![Texto que surge](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/TextoQueSurge.png) | ![Digitação](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Digitacao.png) |

| Card 3D (3D Card Effect) | Grade de projetos (HoverEffect) |
| :---: | :---: |
| ![Card 3D](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Card3D.png) | ![Grade de projetos](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/GradeProjetos.png) |

| Faixa infinita (InfiniteMovingCards) | Dock de links (FloatingDock) |
| :---: | :---: |
| ![Faixa infinita](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/FaixaInfinita.png) | ![Dock de links](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/DockLinks.png) |

| Borda animada (Moving Border) | Portfólio completo |
| :---: | :---: |
| ![Borda animada](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/BordaAnimada.png) | ![Portfólio](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Portfolio.png) |

| Código e props | Celular |
| :---: | :---: |
| ![Código](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Codigo.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/AceternityUI/imgs/Mobile.png) |

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## 🧱 Os 8 componentes

| Aba | Componente | Arquivo em `src/components/ui/` | Bom para | Precisa de Motion? |
| --- | --- | --- | --- | :---: |
| Spotlight | [`Spotlight`](https://ui.aceternity.com/components/spotlight) | `spotlight.jsx` | Topo do portfólio, atrás do seu nome | Não |
| Texto que surge | [`TextGenerateEffect`](https://ui.aceternity.com/components/text-generate-effect) | `text-generate-effect.jsx` | Frase "sobre mim", subtítulo | Sim |
| Digitação | [`TypewriterEffect`](https://ui.aceternity.com/components/typewriter-effect) | `typewriter-effect.jsx` | Seu nome ou cargo | Sim |
| Card 3D | [`CardContainer`, `CardBody`, `CardItem`](https://ui.aceternity.com/components/3d-card-effect) | `3d-card.jsx` | Destacar o melhor projeto | Não |
| Grade de projetos | [`HoverEffect`](https://ui.aceternity.com/components/card-hover-effect) | `card-hover-effect.jsx` | Lista de projetos | Sim |
| Faixa infinita | [`InfiniteMovingCards`](https://ui.aceternity.com/components/infinite-moving-cards) | `infinite-moving-cards.jsx` | Depoimentos, tecnologias, logos | Não |
| Dock de links | [`FloatingDock`](https://ui.aceternity.com/components/floating-dock) | `floating-dock.jsx` | GitHub, LinkedIn, e-mail | Sim |
| Borda animada | [`Button` (Moving Border)](https://ui.aceternity.com/components/moving-border) | `moving-border.jsx` | Botão "Baixar currículo" | Sim |

Todos precisam de **Tailwind CSS**, `clsx` e `tailwind-merge` (por causa do `cn`). O `FloatingDock` também usa o pacote **`@tabler/icons-react`** (ícone do botão no celular).

## 🧩 Usando no seu portfólio (passo a passo)

O exemplo abaixo leva os componentes para o **site de portfólio** que você já tem (React + Vite). Se o seu portfólio já usa Tailwind, pule o passo 1.

### 1. Instale o Tailwind CSS (v4)

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Adicione o plugin no `vite.config.js`:

```js
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

E coloque esta linha **no topo** do seu `src/index.css`:

```css
@import "tailwindcss";
```

### 2. Instale as dependências dos componentes

```bash
npm install motion clsx tailwind-merge @tabler/icons-react react-icons
```

> `@tabler/icons-react` é usado dentro do `FloatingDock`. O `react-icons` é só para os ícones dos **seus** links (GitHub, LinkedIn...); se preferir, use os ícones do próprio Tabler.

### 3. Crie o atalho `@` (o código da Aceternity importa assim: `@/lib/utils`)

No `vite.config.js`:

```js
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
```

E crie um `jsconfig.json` na raiz (para o VS Code entender o `@` e completar os caminhos):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

### 4. Copie a função `cn`

Copie `src/lib/utils.js` deste projeto para o mesmo lugar no seu:

```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

### 5. Copie os componentes que quiser

Copie os arquivos de `src/components/ui/` para `src/components/ui/` do seu portfólio. Só os que você for usar: cada arquivo é independente.

### 6. Copie o modo escuro, as animações e as cores do tema

Copie estes dois trechos do `src/index.css` deste projeto para o seu, logo abaixo do `@import "tailwindcss";`:

**a) A linha do modo escuro:**

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Os componentes originais têm duas aparências: clara (`text-black`, `bg-gray-50`) e escura (`dark:text-white`, `dark:bg-neutral-900`). Com essa linha, a aparência escura vale para tudo que estiver dentro de um elemento com **`className="dark"`**. Num portfólio de fundo escuro, coloque `dark` no `<main>` (ou no `<html>`) e pronto. Sem essa linha, o Tailwind decide pelo tema do sistema operacional: quem usa o computador no modo claro veria texto preto sobre o seu fundo escuro.

**b) O bloco `@theme { ... }` inteiro.** O `Spotlight` e o `InfiniteMovingCards` usam as classes `animate-spotlight` e `animate-scroll`, criadas ali (os valores são os da documentação da Aceternity). No mesmo bloco ficam as cores `--color-puc`, `--color-puc-deep`, `--color-puc-soft`... É por causa delas que existem as classes `bg-puc`, `text-puc-soft` e `border-puc`. Quer as **suas** cores? Troque os valores ali.

### 7. Coloque os dados num arquivo só

Crie um `src/data/portfolio.jsx` com os seus projetos, depoimentos e links (use o deste projeto como modelo). Assim os componentes continuam iguais e você só mexe nos dados:

```jsx
import { TbBrandGithub, TbBrandLinkedin, TbMail } from "react-icons/tb";

export const projects = [
  {
    title: "Meu TCC",
    description: "Sistema de agendamento para a clínica escola.",
    link: "https://github.com/seu-usuario/tcc",
  },
];

export const socialLinks = [
  { title: "GitHub", icon: <TbBrandGithub className="h-full w-full" />, href: "https://github.com/seu-usuario" },
  { title: "LinkedIn", icon: <TbBrandLinkedin className="h-full w-full" />, href: "https://www.linkedin.com/in/seu-usuario" },
  { title: "E-mail", icon: <TbMail className="h-full w-full" />, href: "mailto:voce@email.com" },
];
```

### 8. Monte as seções do portfólio

```jsx
import { Spotlight } from "@/components/ui/spotlight";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FloatingDock } from "@/components/ui/floating-dock";
import { projects, socialLinks } from "@/data/portfolio";

function App() {
  return (
    // "dark" liga a aparência escura dos componentes
    <main className="dark min-h-screen bg-puc-ink text-white">
      {/* Apresentação */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        <TypewriterEffect
          words={[{ text: "Seu" }, { text: "Nome", className: "text-puc-soft dark:text-puc-soft" }]}
          cursorClassName="bg-puc-soft"
        />
        <MovingBorderButton as="a" href="/curriculo.pdf" containerClassName="mt-10">
          Baixar currículo
        </MovingBorderButton>
      </section>

      {/* Projetos */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-3xl font-bold">Projetos</h2>
        <HoverEffect items={projects} />
      </section>

      {/* Contato */}
      <footer className="flex justify-center pb-10">
        <FloatingDock items={socialLinks} desktopClassName="dark:bg-puc-deep" />
      </footer>
    </main>
  );
}
```

O arquivo `src/components/demos/PortfolioDemo.jsx` tem a versão completa, com o Texto que surge e a faixa de depoimentos.

### Personalize pelas props, não editando o arquivo

Repare que as cores da PUC entram pelas props (`className`, `cursorClassName`, `desktopClassName`, `borderClassName`...). Isso funciona porque o `cn` usa o `tailwind-merge`: quando duas classes brigam (`bg-slate-900/[0.8]` do componente e `bg-puc-deep/80` que você passou), **a sua vence**. Assim o arquivo original fica intacto e você pode atualizá-lo pelo site sem perder a personalização.

Duas pegadinhas:

- Se o componente usa `dark:`, passe a sua cor **também com `dark:`**. Ex.: no `TypewriterEffect`, `className: "text-puc-soft"` sozinho perde para o `dark:text-white` do componente; use `"text-puc-soft dark:text-puc-soft"`.
- Nem tudo tem prop. O tamanho do texto do `TextGenerateEffect` (`text-2xl`) e a cor dos cards do `HoverEffect` (`bg-black`) ficam fixos dentro do arquivo. Para mudar, aí sim edite o componente.

> **Dica:** combine com os outros projetos deste repositório. O globo do [SkillsGlobe](../SkillsGlobe), o painel do [GitHubAPI](../GitHubAPI) e o leitor do [CurriculumPDF](../CurriculumPDF) também foram feitos para entrar no portfólio.

## 📋 Pegando outros componentes direto do site

O site tem dezenas de outros componentes. Na página de cada um, copie o código e confira estes pontos:

| No código do site | O que fazer |
| --- | --- |
| Arquivo em **TypeScript** (`.tsx`) | Pode salvar como `.tsx` mesmo: o Vite entende e remove os tipos sozinho, sem instalar nada. Ou apague os tipos (`: string`, `type Props = ...`) e salve como `.jsx` |
| `"use client";` na primeira linha | É coisa do Next.js. No Vite não faz nada: pode apagar ou deixar |
| `import ... from "framer-motion"` | Troque por `import ... from "motion/react"` (é a mesma biblioteca, com o nome novo) |
| `import { IconBrandGithub } from "@tabler/icons-react"` | Instale o pacote (`npm install @tabler/icons-react`), como este projeto faz. Ou troque pelo mesmo ícone do `react-icons/tb` (também é Tabler): `import { TbBrandGithub } from "react-icons/tb"` |
| `import Image from "next/image"` / `import Link from "next/link"` | Troque por `<img>` e `<a>` comuns |
| Classe `animate-alguma-coisa` que não funciona | A animação precisa ser criada no `@theme` do `index.css`. A página do componente mostra o trecho de configuração |
| Classes `dark:...` | Ligue a aparência escura com a classe `dark` num elemento pai (veja o passo 6) |

Também dá para instalar pela CLI do shadcn com o comando que aparece em cada página (`npx shadcn@latest add ...`). Ela cria o `components.json` e copia o arquivo para `src/components/ui/`, no mesmo lugar deste projeto.

## 🎨 Tailwind junto com CSS próprio

Este projeto mistura os dois jeitos: a **página** (card, botões, tabela) usa **CSS próprio**, como os outros projetos do repositório, e os **componentes da Aceternity** usam **Tailwind**. Isso funciona bem no seu portfólio também, com um cuidado:

**No Tailwind v4, todo CSS que está fora de um `@layer` vence as classes do Tailwind.** Se o seu `index.css` tiver o reset clássico:

```css
* {
  margin: 0;
  padding: 0;
}
```

ele apaga o `p-4`, `mt-6`, `gap-4`... de todos os componentes, e eles ficam "grudados". A solução é apagar esse reset (o `@import "tailwindcss"` já faz um) ou colocar os estilos gerais dentro de `@layer base`:

```css
@import "tailwindcss";

@layer base {
  body {
    font-family: "Montserrat", sans-serif;
  }
}
```

Os estilos com **classes próprias** (`.page-container`, `.meu-card`) podem continuar fora do layer: eles não brigam com as classes do Tailwind.

Neste projeto, cada demonstração tem `className="dark"` no elemento de fora, por causa da linha `@custom-variant dark` do `index.css` (passo 6). A página em volta continua clara.

> **Atenção:** o reset do Tailwind também tira o tamanho padrão dos títulos (`h1`, `h2`) e as bolinhas das listas. Se o seu portfólio dependia disso, defina esses estilos no seu CSS.

## 🐞 Pontos de atenção no código original

O código em `src/components/ui/` **não foi corrigido**, para continuar igual ao do site. Mas vale conhecer quatro detalhes, porque são boas lições para os seus projetos:

**InfiniteMovingCards e o StrictMode.** O componente duplica os cards clonando os elementos do DOM (`cloneNode` + `appendChild`) dentro de um `useEffect`. No `npm run dev`, o `<StrictMode>` roda o efeito duas vezes e a lista fica com **4 cópias** em vez de 2. Na tela não aparece diferença (a animação anda metade da faixa e recomeça), e no `npm run build` não acontece. O jeito "React" seria renderizar a lista duas vezes direto no JSX. Regra geral: no React, crie elementos no JSX, não com `appendChild`.

**FloatingDock e a rolagem horizontal.** O componente compara `event.pageX` (posição na **página**) com `getBoundingClientRect()` (posição na **tela**). As duas só batem enquanto a página não está rolada para o lado; com rolagem horizontal, o ícone errado cresce. A correção seria usar `event.clientX`. Regra geral: compare medidas do mesmo "sistema" (tela com tela, página com página).

**Spotlight e HoverEffect: um por página.** O filtro do `Spotlight` usa `id="filter"` fixo e o `HoverEffect` usa `layoutId="hoverBackground"` fixo. Com dois na mesma página, um interfere no outro. Se precisar de dois, gere ids únicos com o `useId()` do React.

**Avisos do lint.** O `npm run lint` mostra 3 avisos (`no-unused-vars`), todos dentro do código original: parâmetros `e` sem uso no `3d-card.jsx` e `idx` sem uso no `infinite-moving-cards.jsx`. Não quebram nada e foram mantidos para o arquivo continuar igual ao do site.

## ⚡ Desempenho e acessibilidade

- O `App` fica dentro de `<MotionConfig reducedMotion="user">`: quem ativou **"reduzir movimento"** no sistema vê as animações do Motion desligadas. As animações em CSS (`animate-spotlight` e `animate-scroll`) também param, por um `@media (prefers-reduced-motion: reduce)` no `index.css`.
- Use **poucos efeitos por tela**. Um Spotlight no topo, uma grade de projetos e um dock no rodapé já fazem um portfólio parecer profissional; dez efeitos ao mesmo tempo cansam e pesam no celular.
- No código original, os links do `FloatingDock` só têm ícone, sem texto. Quem usa leitor de tela ouve só "link". No seu portfólio, vale acrescentar `aria-label={item.title}` no `<a>` do componente.
- Efeitos de "passar o mouse" (Card 3D, dock) não existem no celular. O dock já troca para um botão abaixo de 768px; o card 3D simplesmente fica parado, o que é aceitável.

## 📂 Estrutura do Projeto

```text
📁 AceternityUI
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/        └── Card da página com a faixa azul (logo PUC + ícone do projeto)
│   │   ├── ComponentPicker/   └── Botões para escolher o componente
│   │   ├── ComponentDetails/  └── Descrição, demonstração, código, dependências e props
│   │   ├── CodeBlock/         └── Bloco de código com botão Copiar
│   │   │
│   │   ├── 📁 ui              └── Código ORIGINAL da Aceternity UI, convertido para JS
│   │   │   ├── spotlight.jsx
│   │   │   ├── text-generate-effect.jsx
│   │   │   ├── typewriter-effect.jsx
│   │   │   ├── 3d-card.jsx
│   │   │   ├── card-hover-effect.jsx
│   │   │   ├── infinite-moving-cards.jsx
│   │   │   ├── floating-dock.jsx
│   │   │   └── moving-border.jsx
│   │   │
│   │   └── 📁 demos           └── Um exemplo de uso para cada componente + PortfolioDemo
│   │
│   ├── 📊 data
│   │   ├── components.js      └── Os 8 componentes: textos, props e links
│   │   └── portfolio.jsx      └── Projetos, depoimentos e links do portfólio de exemplo
│   │
│   ├── 📁 lib
│   │   └── utils.js           └── Função cn (clsx + tailwind-merge)
│   │
│   ├── App.jsx
│   ├── index.css              └── Tailwind, modo escuro por classe, tema (cores PUC + animações)
│   └── main.jsx
│
├── 📄 jsconfig.json           └── Atalho @ para o VS Code
├── 📄 vite.config.js          └── Plugins React e Tailwind + atalho @
└── 📄 package.json
```

## ➕ Adicionando um 9º componente

1. Copie o componente do [ui.aceternity.com](https://ui.aceternity.com/components) para `src/components/ui/` (veja a tabela "Pegando outros componentes direto do site"). Pode salvar como `.tsx` mesmo.
2. Crie a demonstração em `src/components/demos/NomeDemo.jsx`.
3. Em `src/data/components.js`, importe a demonstração (e o código com `?raw`) e adicione um item na lista:

```js
{
  id: "lampada",                     // aparece no endereço: /#lampada
  label: "Lâmpada",                  // texto do botão
  icon: TbLamp,                      // ícone do react-icons
  name: "LampContainer",
  category: "Fundo",
  docs: `${DOCS}/nome-do-componente`,
  description: "...",
  tip: "...",
  Demo: LampDemo,
  demoFile: "LampDemo.jsx",
  demoCode: lampDemoCode,
  uiFile: "lamp.jsx",
  uiCode: lampCode,
  deps: ["motion", "clsx", "tailwind-merge"],
  props: [["className", "string", "Classes do container"]],
},
```

Outros componentes legais para testar: `Lamp Effect`, `Background Beams`, `Aurora Background`, `Timeline`, `Sparkles` e `Glowing Effect`.

## ☁️ Deploy na Vercel

Importe o repositório em [vercel.com/new](https://vercel.com/new) (preset **Vite**) e clique em **Deploy**. Não há variáveis de ambiente para configurar.

## 📦 Dependências

```json
"dependencies": {
  "@tabler/icons-react": "^3.49.0",
  "clsx": "^2.1.1",
  "motion": "^14.2.0",
  "react": "^19.3.1",
  "react-dom": "^19.3.1",
  "react-icons": "^5.7.0",
  "tailwind-merge": "^3.7.0"
},
"devDependencies": {
  "@tailwindcss/vite": "^4.3.3",
  "tailwindcss": "^4.3.3"
}
```

- [`motion`](https://motion.dev/): animações (o antigo Framer Motion)
- [`clsx`](https://github.com/lukeed/clsx) + [`tailwind-merge`](https://github.com/dcastil/tailwind-merge): usadas pela função `cn`
- [`tailwindcss`](https://tailwindcss.com/) + [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite): as classes usadas nos componentes
- [`@tabler/icons-react`](https://tabler.io/icons): ícone usado dentro do `FloatingDock` original
- [`react-icons`](https://react-icons.github.io/react-icons/): ícones dos links e da página (o conjunto `tb` também é Tabler)
- Os componentes da Aceternity **não entram no `package.json`**: o código deles fica em `src/components/ui/`.

## 🔗 Links

- [ui.aceternity.com](https://ui.aceternity.com/): site com todos os componentes
- [ui.aceternity.com/components](https://ui.aceternity.com/components): lista completa, com demonstração e código
- [motion.dev](https://motion.dev/): documentação do Motion
- [tailwindcss.com/docs](https://tailwindcss.com/docs): documentação do Tailwind CSS

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📄 Licença
Este projeto está licenciado sob a MIT License. A Aceternity UI é um projeto de Manu Arora: consulte os termos de uso em [ui.aceternity.com](https://ui.aceternity.com/) antes de usar os componentes originais em projetos comerciais.
