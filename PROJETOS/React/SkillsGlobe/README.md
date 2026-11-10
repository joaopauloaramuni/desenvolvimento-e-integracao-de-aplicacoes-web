# Projeto SkillsGlobe (React + Vite) 🌐

## 🌐 Acesse o projeto

[![Deploy na Vercel](https://img.shields.io/badge/Vercel-online-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://skills-globe.vercel.app/)

👉 **[skills-globe.vercel.app](https://skills-globe.vercel.app/)**

Abra no navegador do celular ou do computador e acesse direto, sem instalar nada.

## 📖 Descrição

Um **globo 3D de habilidades** que gira sozinho, pode ser arrastado com o mouse ou com o dedo e abre um link ao clicar em cada ícone. Feito **só com React, CSS e `<canvas>` 2D**: sem three.js e sem nenhuma biblioteca de 3D.

Este projeto **não usa API externa nem chave**: não precisa de `.env.local` nem de variável na Vercel.

Recursos:

- Ícones distribuídos numa esfera com a **espiral de Fibonacci**
- **Perspectiva**: ícones do fundo ficam menores e mais apagados
- **Arrastar para girar**, com **inércia**; o giro desacelera com o mouse em cima
- **Filtro por categoria** (Front-end, Back-end, Mobile, Dados, Ferramentas)
- Alternância **Globo / Lista** (a lista é mais acessível e boa para celular)
- Nome da skill ao passar o mouse ou navegar com **Tab**
- Para de animar fora da tela e respeita `prefers-reduced-motion`

## 🖼️ Capturas de Tela

| Globo | Filtro por categoria |
| :---: | :---: |
| ![Home](https://joaopauloaramuni.github.io/react-imgs/SkillsGlobe/imgs/Home.png) | ![Filtro](https://joaopauloaramuni.github.io/react-imgs/SkillsGlobe/imgs/Filtro.png) |

| Lista | Celular |
| :---: | :---: |
| ![Lista](https://joaopauloaramuni.github.io/react-imgs/SkillsGlobe/imgs/Lista.png) | ![Mobile](https://joaopauloaramuni.github.io/react-imgs/SkillsGlobe/imgs/Mobile.png) |

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## ✏️ Colocando as SUAS habilidades

Edite `src/data/skills.js`:

```js
import { SiReact } from "react-icons/si";

{
  name: "React",                 // nome no globo e na lista
  icon: SiReact,                 // ícone do react-icons
  color: "#149ECA",              // cor do ícone
  category: "Front-end",         // uma das CATEGORIES
  link: "https://react.dev/",    // para onde o clique leva
},
```

- Procure ícones em [react-icons.github.io/react-icons](https://react-icons.github.io/react-icons/) (o pacote `si` tem os logos de tecnologias).
- As categorias ficam em `CATEGORIES`, no mesmo arquivo.
- O `link` pode ser a documentação, um repositório seu, um certificado...

## ⚙️ Como funciona (sem biblioteca de 3D)

1. **Espiral de Fibonacci**: `fibonacciSphere(n)` gera `n` pontos `{x, y, z}` bem espalhados numa esfera de raio 1.
2. **Rotação**: a cada quadro, cada ponto é girado no eixo Y (giro) e no eixo X (inclinação) com seno e cosseno.
3. **Projeção com perspectiva**: `escala = câmera / (câmera - z × raio)`. Quanto mais perto (`z` maior), maior o ícone.
4. **Sem re-render**: o loop com `requestAnimationFrame` move os ícones direto no DOM (`style.transform`, `opacity`, `zIndex`). O React só monta a lista uma vez, e a animação roda a 60 FPS sem custo.
5. **Grade da esfera**: 6 meridianos e 5 paralelos desenhados num `<canvas>` 2D, mais fortes na frente e fracos atrás.
6. **Arrasto**: `pointerdown` / `pointermove` / `pointerup` (mouse, caneta e toque). Acima de 6 px o clique vira arrasto e o link não abre.

## 🧩 Usando no seu projeto

Copie a pasta `src/components/SkillsGlobe/` (e, se quiser o filtro e a lista, `src/components/SkillsSection/`) e o arquivo `src/data/skills.js`:

```jsx
import SkillsGlobe from "./components/SkillsGlobe/SkillsGlobe";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import SKILLS, { CATEGORIES } from "./data/skills";

<SkillsGlobe skills={SKILLS} />                                  {/* só o globo */}
<SkillsGlobe skills={SKILLS} speed={0.25} color="#0a6ea6" />     {/* mais rápido, outra cor */}
<SkillsSection skills={SKILLS} categories={CATEGORIES} />        {/* globo + filtro + lista */}
```

| Prop do `<SkillsGlobe />` | Padrão | O que faz |
| --- | --- | --- |
| `skills` | — | Lista de skills (formato de `data/skills.js`) |
| `speed` | `0.15` | Velocidade do giro automático (radianos por segundo) |
| `color` | `"#005380"` | Cor da grade e do nome da skill (hexadecimal `#RRGGBB`) |

A altura do globo fica no CSS (`.skills-globe { height: ... }`).

## 📂 Estrutura do Projeto

```text
📁 SkillsGlobe
│
├── 📁 imgs              └── Capturas de tela usadas neste README
├── 📁 public            └── pucminas-logo.png (favicon)
│
├── 📁 src
│   ├── 📁 assets/images └── pucminas-logo.png
│   │
│   ├── 🧩 components
│   │   ├── PageLayout/       └── Card da página com a faixa azul (logo PUC + ícone do projeto)
│   │   ├── SkillsGlobe/
│   │   │   ├── SkillsGlobe.jsx   └── Globo 3D (Fibonacci + rotação + projeção + canvas)
│   │   │   └── SkillsGlobe.css
│   │   └── SkillsSection/
│   │       ├── SkillsSection.jsx └── Filtro por categoria + Globo / Lista
│   │       └── SkillsSection.css
│   │
│   ├── 📊 data
│   │   └── skills.js         └── SUAS habilidades e categorias
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
└── 📄 package.json
```

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

- [`react-icons`](https://react-icons.github.io/react-icons/): ícones das tecnologias
- Nada de three.js: o 3D é feito na mão, com matemática simples.

## 🧪 Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Testa o build localmente |
| `npm run lint` | Lint com o oxlint (padrão do template atual do Vite) |

## 📄 Licença
Este projeto está licenciado sob a MIT License.
