# Projeto ReactBits (React + Vite) 🖱️

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://react-bits.vercel.app/)

👉 **[react-bits.vercel.app](https://react-bits.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Cinco **efeitos que seguem o mouse pelo fundo do site**, feitos com componentes do [React Bits](https://reactbits.dev/). Escolha um efeito, mova o mouse pelas laterais da página e copie o código pronto para o seu projeto.

Este projeto **não usa API externa nem chave**: não precisa de `.env.local` nem de variável na Vercel.

Recursos:

- **5 efeitos** do React Bits: Fumaça, Fitas, Grade de pontos, Rastro de pixels e Enxame
- O efeito ocupa **a tela inteira, atrás do conteúdo**, e não bloqueia cliques
- **Código pronto para copiar**, gerado a partir das mesmas props que estão rodando na tela
- **Tabela das props** usadas em cada exemplo, explicadas em português
- Botão **Ver só o fundo** (esconde o card; `Esc` mostra de novo)
- O efeito escolhido fica no endereço (`/#fitas`, `/#pontos`...), para compartilhar o link
- Cores no **azul PUC Minas** (`#005380`)

## ⚛️ O que é o React Bits?

O [React Bits](https://reactbits.dev/) é uma coleção **gratuita e open source** com mais de 200 componentes animados para React: animações de texto, fundos animados, efeitos de cursor, menus, cards e micro interações.

Foi criado pelo desenvolvedor **David Haz** ([DavidHDev](https://github.com/DavidHDev) no GitHub) e o código está em [github.com/DavidHDev/react-bits](https://github.com/DavidHDev/react-bits).

O jeito de usar é diferente de uma biblioteca comum:

- **Não é um pacote npm.** Você **copia o código do componente** para dentro do seu projeto (ou usa a CLI do [shadcn](https://ui.shadcn.com/) / [jsrepo](https://jsrepo.dev), que faz a cópia para você).
- Cada componente tem **4 variantes**: JavaScript ou TypeScript, com CSS puro ou com Tailwind. Este projeto usa a variante **JS + CSS**.
- Como o código fica no seu projeto, você pode **ler e alterar** tudo, não só as props.
- No site, cada componente tem uma **área de testes**: você mexe nas props e vê o resultado na hora antes de copiar.

> **Licença:** MIT + Commons Clause. Você pode usar os componentes em qualquer site ou aplicação (inclusive comercial), mas **não pode vender ou redistribuir os componentes em si** como biblioteca. O texto completo está em `src/components/reactbits/LICENSE-react-bits.md`.

## 🖼️ Capturas de Tela

| Fumaça (SplashCursor) | Fitas (Ribbons) |
| :---: | :---: |
| ![Fumaça](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Fumaca.png) | ![Fitas](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Fitas.png) |

| Grade de pontos (DotGrid) | Rastro de pixels (PixelTrail) |
| :---: | :---: |
| ![Pontos](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Pontos.png) | ![Pixels](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Pixels.png) |

| Enxame (SwarmCursor) | Ver só o fundo |
| :---: | :---: |
| ![Enxame](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Enxame.png) | ![Fundo](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Fundo.png) |

| Código e props | Celular |
| :---: | :---: |
| ![Código](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Codigo.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/ReactBits/imgs/Mobile.png) |

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## ✨ Os 5 efeitos

| Efeito | Componente | Categoria no site | Camada | O que faz |
| --- | --- | --- | --- | --- |
| Fumaça | [`SplashCursor`](https://reactbits.dev/animations/splash-cursor) | Animations | Por cima | Simulação de fluido: o mouse solta uma fumaça que se espalha e some |
| Fitas | [`Ribbons`](https://reactbits.dev/animations/ribbons) | Animations | Atrás | Fitas que perseguem o cursor com efeito de mola |
| Grade de pontos | [`DotGrid`](https://reactbits.dev/backgrounds/dot-grid) | Backgrounds | Atrás | Pontos fogem do cursor e acendem; clique solta uma onda de choque |
| Rastro de pixels | [`PixelTrail`](https://reactbits.dev/animations/pixel-trail) | Animations | Atrás | Pixels acendem por onde o mouse passa e derretem uns nos outros |
| Enxame | [`SwarmCursor`](https://reactbits.dev/animations/swarm-cursor) | Animations | Atrás | Centenas de partículas giram em volta do cursor como um cardume |

Os cinco são feitos em **WebGL** (desenho pela placa de vídeo) e **não precisam de nenhuma dependência extra**: só React.

## 🧩 Usando no seu projeto

### 1. Copie o componente

Copie a pasta do efeito que você quer, por exemplo `src/components/reactbits/Ribbons/`, para o seu projeto. Ou pegue o código direto no site: abra a página do componente, escolha **JS + CSS** e clique em copiar.

### 2. Efeito ATRÁS do conteúdo (Ribbons, DotGrid, PixelTrail, SwarmCursor)

Coloque o componente numa `div` fixa que ocupa a tela inteira:

```jsx
import Ribbons from "./components/reactbits/Ribbons/Ribbons";

function App() {
  return (
    <>
      <div className="background-effect" aria-hidden="true">
        <Ribbons colors={["#00334f", "#005380", "#4fa8d8"]} />
      </div>

      <main className="conteudo">{/* ...seu site... */}</main>
    </>
  );
}
```

```css
.background-effect {
  position: fixed;      /* fica parado mesmo rolando a página */
  inset: 0;             /* ocupa a tela inteira */
  z-index: 0;           /* atrás do conteúdo */
  pointer-events: none; /* não rouba os cliques */
}

.conteudo {
  position: relative;
  z-index: 1;           /* na frente do efeito */
}
```

> **Por que funciona com `pointer-events: none`?** Os componentes escutam o mouse no `window` (`window.addEventListener("pointermove", ...)`), não no próprio canvas. Por isso eles seguem o mouse mesmo sem receber cliques.

### 3. Efeito POR CIMA do conteúdo (SplashCursor)

O `SplashCursor` já vem com `position: fixed`, `z-index: 50` e `pointer-events: none`. Basta colocá-lo em qualquer lugar do `App`:

```jsx
import SplashCursor from "./components/reactbits/SplashCursor/SplashCursor";

<SplashCursor COLOR="#005380" RAINBOW_MODE={false} />
```

> **Dica:** num fundo **claro**, a fumaça aparece em azul suave, porque o componente soma a cor da fumaça com o fundo. Num fundo **escuro** (por exemplo `background: #00334f`) ela fica bem mais forte. Com `RAINBOW_MODE={true}` (o padrão) ela muda de cor o tempo todo.

### 4. Ajuste as props

Cada efeito tem uma tabela de props no próprio site deste projeto e no [reactbits.dev](https://reactbits.dev/). As props usadas aqui estão em `src/data/effects.js`. Mude um valor lá e o efeito **e** o código de exemplo mudam juntos.

## ➕ Adicionando um 6º efeito

1. Copie o componente do [reactbits.dev](https://reactbits.dev/) (variante **JS + CSS**) para `src/components/reactbits/NomeDoComponente/`.
2. Em `src/data/effects.js`, importe o componente e adicione um item na lista:

```js
{
  id: "fantasma",                 // aparece no endereço: /#fantasma
  label: "Fantasma",              // texto do botão
  icon: TbGhost,                  // ícone do react-icons
  name: "GhostCursor",            // nome do componente
  category: "Animations",
  Component: GhostCursor,
  layer: "fundo",                 // "fundo" (atrás) ou "frente" (por cima)
  docs: "https://reactbits.dev/animations/ghost-cursor",
  description: "...",
  tip: "...",
  props: { color: "#005380", theme: "light" },
  propsInfo: { color: "Cor da fumaça", theme: "light para fundo claro" },
},
```

Outros efeitos de mouse legais para testar: `GhostCursor`, `GlowCursor`, `BlobCursor`, `LiquidEther`, `MagnetLines`, `Threads` e `GridDistortion`.

## 📂 Estrutura do Projeto

```text
📁 ReactBits
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/        └── Card da página com a faixa azul (logo PUC + ícone do projeto)
│   │   ├── BackgroundEffect/  └── Camada fixa que coloca o efeito atrás do conteúdo
│   │   ├── EffectPicker/      └── Botões para escolher o efeito
│   │   ├── EffectDetails/
│   │   │   ├── EffectDetails.jsx └── Descrição, dica, código e tabela de props
│   │   │   └── buildCode.js      └── Gera o código JSX a partir das props
│   │   ├── CodeBlock/         └── Bloco de código com botão Copiar
│   │   │
│   │   └── 📁 reactbits       └── Componentes do React Bits (JS + CSS), sem alterações
│   │                              exceto 1 linha no SwarmCursor (ver abaixo)
│   │       ├── SplashCursor/
│   │       ├── Ribbons/
│   │       ├── DotGrid/
│   │       ├── PixelTrail/
│   │       ├── SwarmCursor/
│   │       └── LICENSE-react-bits.md
│   │
│   ├── 📊 data
│   │   └── effects.js         └── Os 5 efeitos: props, textos e links
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
└── 📄 package.json
```

## 🐞 Ajuste no SwarmCursor (StrictMode)

Os componentes em `src/components/reactbits/` são os originais do React Bits, com **uma única alteração** no `SwarmCursor.jsx`.

**O problema:** no `npm run dev`, o `<StrictMode>` (em `main.jsx`) monta o componente, desmonta e monta de novo, de propósito, para achar bugs. O `SwarmCursor` original chamava `loseContext()` ao desmontar, o que desliga o WebGL daquele `<canvas>`. Na segunda montagem o canvas era o mesmo, já "morto", e o enxame não aparecia. No `npm run build` não acontecia, porque o StrictMode só faz isso em desenvolvimento.

**A correção:** só liberar o WebGL quando o canvas saiu da página de verdade:

```js
if (!canvas.isConnected) gl.getExtension('WEBGL_lose_context')?.loseContext();
```

> **Lição para os seus projetos:** se um efeito do React Bits (ou qualquer código com WebGL/canvas) funciona no build e não funciona no `npm run dev`, desconfie do StrictMode e olhe a função de limpeza do `useEffect`.

## ⚡ Desempenho e acessibilidade

- Os efeitos usam a placa de vídeo (WebGL). Use **um efeito por página**; vários ao mesmo tempo pesam no notebook dos usuários.
- Ao trocar de efeito, o antigo é **desmontado** (`key={effect.id}`), e cada componente libera o seu WebGL no `return` do `useEffect`.
- `DotGrid`, `SwarmCursor` e outros respeitam `prefers-reduced-motion` (usuários que pediram menos animação no sistema).
- Em celular não existe "passar o mouse": os efeitos reagem ao **arrastar o dedo**. Se quiser mostrar o efeito só em computador, use `window.matchMedia("(hover: hover)").matches` antes de renderizar.

## ☁️ Deploy na Vercel

Importe o repositório em [vercel.com/new](https://vercel.com/new) (preset **Vite**) e clique em **Deploy**. Não há variáveis de ambiente para configurar.

## 📦 Dependências

```json
"dependencies": {
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-icons": "^5.7.0"
}
```

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones dos botões e da faixa azul
- Os componentes do React Bits **não entram no `package.json`**: o código deles fica em `src/components/reactbits/`.

## 🔗 Links

- [reactbits.dev](https://reactbits.dev/): site com todos os componentes e a área de testes de props
- [github.com/DavidHDev/react-bits](https://github.com/DavidHDev/react-bits): código-fonte do React Bits
- [Instalação via CLI](https://reactbits.dev/get-started/installation): como instalar com shadcn ou jsrepo

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📄 Licença
Este projeto está licenciado sob a MIT License. Os componentes em `src/components/reactbits/` são do React Bits (David Haz) e seguem a licença MIT + Commons Clause.
