import {
  TbBorderOuter,
  TbBulb,
  TbCube3dSphere,
  TbCursorText,
  TbInfinity,
  TbKeyboard,
  TbLayoutBottombar,
  TbLayoutGrid,
  TbUserCircle,
} from "react-icons/tb";

// Demonstrações (o que aparece na tela)
import SpotlightDemo from "@/components/demos/SpotlightDemo";
import TextGenerateDemo from "@/components/demos/TextGenerateDemo";
import TypewriterDemo from "@/components/demos/TypewriterDemo";
import ThreeDCardDemo from "@/components/demos/ThreeDCardDemo";
import HoverEffectDemo from "@/components/demos/HoverEffectDemo";
import InfiniteCardsDemo from "@/components/demos/InfiniteCardsDemo";
import FloatingDockDemo from "@/components/demos/FloatingDockDemo";
import MovingBorderDemo from "@/components/demos/MovingBorderDemo";
import PortfolioDemo from "@/components/demos/PortfolioDemo";

// "?raw" = o Vite entrega o CONTEÚDO do arquivo como texto.
// Assim o código mostrado na página é sempre o mesmo que está rodando.
import spotlightDemoCode from "@/components/demos/SpotlightDemo.jsx?raw";
import textGenerateDemoCode from "@/components/demos/TextGenerateDemo.jsx?raw";
import typewriterDemoCode from "@/components/demos/TypewriterDemo.jsx?raw";
import threeDCardDemoCode from "@/components/demos/ThreeDCardDemo.jsx?raw";
import hoverEffectDemoCode from "@/components/demos/HoverEffectDemo.jsx?raw";
import infiniteCardsDemoCode from "@/components/demos/InfiniteCardsDemo.jsx?raw";
import floatingDockDemoCode from "@/components/demos/FloatingDockDemo.jsx?raw";
import movingBorderDemoCode from "@/components/demos/MovingBorderDemo.jsx?raw";
import portfolioDemoCode from "@/components/demos/PortfolioDemo.jsx?raw";

import spotlightCode from "@/components/ui/spotlight.jsx?raw";
import textGenerateCode from "@/components/ui/text-generate-effect.jsx?raw";
import typewriterCode from "@/components/ui/typewriter-effect.jsx?raw";
import threeDCardCode from "@/components/ui/3d-card.jsx?raw";
import hoverEffectCode from "@/components/ui/card-hover-effect.jsx?raw";
import infiniteCardsCode from "@/components/ui/infinite-moving-cards.jsx?raw";
import floatingDockCode from "@/components/ui/floating-dock.jsx?raw";
import movingBorderCode from "@/components/ui/moving-border.jsx?raw";

const DOCS = "https://ui.aceternity.com/components";

const COMPONENTS = [
  {
    id: "spotlight",
    label: "Spotlight",
    icon: TbBulb,
    name: "Spotlight",
    category: "Fundo",
    docs: `${DOCS}/spotlight`,
    description:
      "Um feixe de luz que entra na diagonal quando a página abre. Fica ótimo atrás do seu nome, no topo do portfólio.",
    tip: "Clique em Reiniciar animação para ver o feixe entrar de novo. O elemento pai precisa de relative e overflow-hidden.",
    Demo: SpotlightDemo,
    demoFile: "SpotlightDemo.jsx",
    demoCode: spotlightDemoCode,
    uiFile: "spotlight.jsx",
    uiCode: spotlightCode,
    deps: ["clsx", "tailwind-merge"],
    props: [
      ["className", "string", "Posição e tamanho do feixe, ex.: \"-top-40 left-0 md:left-60\""],
      ["fill", "string", "Cor da luz (padrão: \"white\")"],
    ],
  },
  {
    id: "texto",
    label: "Texto que surge",
    icon: TbCursorText,
    name: "TextGenerateEffect",
    category: "Texto",
    docs: `${DOCS}/text-generate-effect`,
    description:
      "As palavras aparecem uma de cada vez, saindo do desfoque. Bom para a frase \"sobre mim\" ou o subtítulo da página.",
    tip: "O texto vem de uma string comum: troque a frase e o efeito continua igual.",
    Demo: TextGenerateDemo,
    demoFile: "TextGenerateDemo.jsx",
    demoCode: textGenerateDemoCode,
    uiFile: "text-generate-effect.jsx",
    uiCode: textGenerateCode,
    deps: ["motion", "clsx", "tailwind-merge"],
    props: [
      ["words", "string", "O texto completo; cada palavra anima separada"],
      ["className", "string", "Classes do bloco (peso da fonte, alinhamento...)"],
      ["filter", "boolean", "true = sai do desfoque; false = só aparece (padrão: true)"],
      ["duration", "number", "Duração de cada palavra, em segundos (padrão: 0.5)"],
    ],
  },
  {
    id: "digitacao",
    label: "Digitação",
    icon: TbKeyboard,
    name: "TypewriterEffect",
    category: "Texto",
    docs: `${DOCS}/typewriter-effect`,
    description:
      "Texto digitado letra por letra, com cursor piscando. Cada palavra pode ter a sua própria cor.",
    tip: "A digitação só começa quando o texto aparece na tela (useInView). O mesmo arquivo também exporta o TypewriterEffectSmooth, que revela a frase inteira deslizando.",
    Demo: TypewriterDemo,
    demoFile: "TypewriterDemo.jsx",
    demoCode: typewriterDemoCode,
    uiFile: "typewriter-effect.jsx",
    uiCode: typewriterCode,
    deps: ["motion", "clsx", "tailwind-merge"],
    props: [
      ["words", "{ text, className? }[]", "Lista de palavras; className muda a cor (use também dark:, ex.: \"text-puc-soft dark:text-puc-soft\")"],
      ["className", "string", "Classes do bloco (tamanho do texto, alinhamento)"],
      ["cursorClassName", "string", "Classes do cursor (cor, altura)"],
    ],
  },
  {
    id: "card-3d",
    label: "Card 3D",
    icon: TbCube3dSphere,
    name: "CardContainer / CardBody / CardItem",
    category: "Card",
    docs: `${DOCS}/3d-card-effect`,
    description:
      "O card inclina seguindo o mouse e cada parte salta para fora numa altura diferente. Perfeito para destacar o seu melhor projeto.",
    tip: "Passe o mouse devagar sobre o card. Quanto maior o translateZ de um CardItem, mais ele salta.",
    Demo: ThreeDCardDemo,
    demoFile: "ThreeDCardDemo.jsx",
    demoCode: threeDCardDemoCode,
    uiFile: "3d-card.jsx",
    uiCode: threeDCardCode,
    deps: ["clsx", "tailwind-merge"],
    props: [
      ["CardContainer › containerClassName", "string", "Classes da área em volta (padrão tem py-20)"],
      ["CardBody › className", "string", "Tamanho e visual do card (padrão: h-96 w-96)"],
      ["CardItem › translateZ", "number | string", "Quanto a peça salta para fora, em px"],
      ["CardItem › rotateX / rotateY / rotateZ", "number | string", "Giro extra da peça, em graus"],
      ["CardItem › as", "string", "Tag HTML da peça: \"div\", \"p\", \"a\", \"button\"..."],
    ],
  },
  {
    id: "projetos",
    label: "Grade de projetos",
    icon: TbLayoutGrid,
    name: "HoverEffect",
    category: "Card",
    docs: `${DOCS}/card-hover-effect`,
    description:
      "Grade de cards em que um fundo desliza de um card para o outro seguindo o mouse. Os cards aqui apontam para outros projetos deste repositório.",
    tip: "Passe o mouse de um card para o vizinho e veja o fundo deslizar (layoutId do Motion).",
    Demo: HoverEffectDemo,
    demoFile: "HoverEffectDemo.jsx",
    demoCode: hoverEffectDemoCode,
    uiFile: "card-hover-effect.jsx",
    uiCode: hoverEffectCode,
    deps: ["motion", "clsx", "tailwind-merge"],
    props: [
      ["items", "{ title, description, link }[]", "Os cards (dados em src/data/portfolio.jsx); link também é a key, então não repita"],
      ["className", "string", "Classes da grade (colunas, espaçamento)"],
    ],
  },
  {
    id: "depoimentos",
    label: "Faixa infinita",
    icon: TbInfinity,
    name: "InfiniteMovingCards",
    category: "Card",
    docs: `${DOCS}/infinite-moving-cards`,
    description:
      "Uma faixa de cards que anda sem parar. Use para depoimentos, tecnologias que você domina ou logos de empresas.",
    tip: "Pare o mouse em cima de um card: a faixa pausa para dar tempo de ler.",
    Demo: InfiniteCardsDemo,
    demoFile: "InfiniteCardsDemo.jsx",
    demoCode: infiniteCardsDemoCode,
    uiFile: "infinite-moving-cards.jsx",
    uiCode: infiniteCardsCode,
    deps: ["clsx", "tailwind-merge", "animação \"scroll\" no index.css"],
    props: [
      ["items", "{ quote, name, title }[]", "Os cards da faixa"],
      ["direction", "\"left\" | \"right\"", "Para onde a faixa anda (padrão: \"left\")"],
      ["speed", "\"fast\" | \"normal\" | \"slow\"", "Velocidade: 20s, 40s ou 80s por volta"],
      ["pauseOnHover", "boolean", "Pausa com o mouse em cima (padrão: true)"],
    ],
  },
  {
    id: "dock",
    label: "Dock de links",
    icon: TbLayoutBottombar,
    name: "FloatingDock",
    category: "Navegação",
    docs: `${DOCS}/floating-dock`,
    description:
      "Barra de ícones no estilo do Dock do macOS: o ícone perto do mouse cresce. No celular vira um botão que abre a lista.",
    tip: "Passe o mouse da esquerda para a direita. Diminua a janela para menos de 768px e veja a versão de celular.",
    Demo: FloatingDockDemo,
    demoFile: "FloatingDockDemo.jsx",
    demoCode: floatingDockDemoCode,
    uiFile: "floating-dock.jsx",
    uiCode: floatingDockCode,
    deps: ["motion", "@tabler/icons-react", "clsx", "tailwind-merge"],
    props: [
      ["items", "{ title, icon, href }[]", "Os links; title aparece no balão ao passar o mouse"],
      ["desktopClassName", "string", "Classes da barra no computador (aqui: \"dark:bg-puc-deep\")"],
      ["mobileClassName", "string", "Classes do botão no celular"],
    ],
  },
  {
    id: "borda",
    label: "Borda animada",
    icon: TbBorderOuter,
    name: "Button (Moving Border)",
    category: "Botão",
    docs: `${DOCS}/moving-border`,
    description:
      "Um ponto de luz corre pela borda do botão sem parar. Chama atenção para a ação principal: baixar o currículo ou entrar em contato.",
    tip: "O componente se chama Button. Importe com outro nome (MovingBorderButton) para não brigar com outros botões do projeto.",
    Demo: MovingBorderDemo,
    demoFile: "MovingBorderDemo.jsx",
    demoCode: movingBorderDemoCode,
    uiFile: "moving-border.jsx",
    uiCode: movingBorderCode,
    deps: ["motion", "clsx", "tailwind-merge"],
    props: [
      ["borderRadius", "string", "Arredondamento (padrão: \"1.75rem\")"],
      ["duration", "number", "Tempo de uma volta da luz, em ms (padrão: 3000)"],
      ["as", "string", "Tag HTML: \"button\" (padrão) ou \"a\" para link"],
      ["containerClassName", "string", "Tamanho do botão (padrão: h-16 w-40)"],
      ["borderClassName", "string", "Cor e tamanho do ponto de luz (aqui, azul PUC)"],
      ["className", "string", "Visual do miolo do botão (aqui, fundo azul PUC)"],
    ],
  },
  {
    id: "portfolio",
    label: "Portfólio completo",
    icon: TbUserCircle,
    name: "Exemplo de portfólio",
    category: "Tudo junto",
    docs: "https://ui.aceternity.com/components",
    description:
      "Sete componentes juntos numa página de portfólio: Spotlight, Digitação e Texto que surge na apresentação, Borda animada no botão, Grade de projetos, Faixa infinita de depoimentos e Dock de links no rodapé.",
    tip: "Os textos e links vêm de src/data/portfolio.jsx. No seu portfólio, troque só esse arquivo.",
    Demo: PortfolioDemo,
    demoFile: "PortfolioDemo.jsx",
    demoCode: portfolioDemoCode,
    deps: ["motion", "@tabler/icons-react", "react-icons", "clsx", "tailwind-merge"],
    props: [],
  },
];

export default COMPONENTS;
