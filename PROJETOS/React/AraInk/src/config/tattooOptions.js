// tattooOptions.js
// Tudo o que o usuário pode escolher no estúdio, com o trecho de prompt de cada opção.
// Os prompts ficam em inglês porque os modelos de imagem seguem melhor as instruções
// técnicas assim; a ideia do usuário vai do jeito que ele escreveu (em português).

/* =========================================================
   ESTILOS
   categoria: "traco" (só linha), "sombra" (preto e cinza) ou "cor"
   sugestao: espessura e acabamento aplicados ao escolher o estilo
   ========================================================= */

export const STYLES = [
  {
    id: "fineline",
    nome: "Fineline",
    categoria: "traco",
    descricao: "Traços finos e delicados, feitos com uma agulha só.",
    bomPara: "pulso, costela, flores e frases curtas",
    sugestao: { linha: "fina", acabamento: "linhas" },
    prompt:
      "fineline tattoo, single-needle delicate thin lines, minimal shading, elegant and airy composition",
  },
  {
    id: "oldschool",
    nome: "Old school",
    categoria: "cor",
    descricao: "Contorno grosso, cores chapadas e símbolos clássicos.",
    bomPara: "braço e perna, peças que precisam durar décadas",
    sugestao: { linha: "grossa", acabamento: "colorido" },
    prompt:
      "American traditional (old school) tattoo flash, bold black outlines, limited flat palette of red, yellow, green and black, simple solid black shading",
  },
  {
    id: "neotrad",
    nome: "Neo-tradicional",
    categoria: "cor",
    descricao: "O old school com mais volume, detalhe e cores ricas.",
    bomPara: "retratos de animais, flores e peças médias",
    sugestao: { linha: "media", acabamento: "colorido" },
    prompt:
      "neo-traditional tattoo, bold outlines with varied line weight, rich jewel-tone colors, ornamental details, dimensional shading",
  },
  {
    id: "blackwork",
    nome: "Blackwork",
    categoria: "sombra",
    descricao: "Áreas de preto sólido e desenho feito com espaço negativo.",
    bomPara: "peças gráficas, cobertura de tatuagens antigas",
    sugestao: { linha: "grossa", acabamento: "preto" },
    prompt:
      "blackwork tattoo, large areas of solid black ink, strong negative space, high contrast, graphic and bold",
  },
  {
    id: "dotwork",
    nome: "Dotwork",
    categoria: "sombra",
    descricao: "Sombreado feito só com pontos, em degradê.",
    bomPara: "mandalas, geometria e texturas suaves",
    sugestao: { linha: "fina", acabamento: "preto" },
    prompt:
      "dotwork tattoo, shading built entirely from stippled dots of varying density, fine clean outlines",
  },
  {
    id: "geometrico",
    nome: "Geométrico",
    categoria: "traco",
    descricao: "Formas, simetria e linhas retas precisas.",
    bomPara: "antebraço, costas e composições simétricas",
    sugestao: { linha: "media", acabamento: "linhas" },
    prompt:
      "geometric tattoo, precise straight lines, sacred geometry, symmetry, circles and triangles, linework hatching",
  },
  {
    id: "aquarela",
    nome: "Aquarela",
    categoria: "cor",
    descricao: "Manchas de cor soltas por trás de um traço leve.",
    bomPara: "animais, penas e flores com movimento",
    sugestao: { linha: "fina", acabamento: "colorido" },
    prompt:
      "watercolor tattoo, soft paint splashes and bleeding color washes behind light black linework, drips and splatters",
  },
  {
    id: "japones",
    nome: "Japonês",
    categoria: "cor",
    descricao: "Ondas, nuvens e vento em volta do motivo principal.",
    bomPara: "fechamentos grandes: braço, costas e perna",
    sugestao: { linha: "grossa", acabamento: "colorido" },
    prompt:
      "Japanese irezumi style tattoo, bold outlines, wind bars, waves and clouds as background elements, traditional Japanese motifs and palette",
  },
  {
    id: "realismo",
    nome: "Realismo P&B",
    categoria: "sombra",
    descricao: "Luz e volume em tons de cinza, como uma fotografia.",
    bomPara: "retratos, animais e estátuas",
    sugestao: { linha: "fina", acabamento: "preto" },
    prompt:
      "black and grey realism tattoo, smooth gradients, soft whip shading, realistic lighting and textures, no hard outlines",
  },
  {
    id: "minimalista",
    nome: "Minimalista",
    categoria: "traco",
    descricao: "Poucos traços, muito respiro e tamanho pequeno.",
    bomPara: "primeira tatuagem, dedo, tornozelo e nuca",
    sugestao: { linha: "fina", acabamento: "linhas" },
    prompt:
      "minimalist tattoo, very few clean lines, simple iconic shapes, lots of empty space, small and subtle",
  },
  {
    id: "sketch",
    nome: "Sketch",
    categoria: "traco",
    descricao: "Cara de rascunho, com linhas soltas e repetidas.",
    bomPara: "quem quer um ar artístico e inacabado",
    sugestao: { linha: "fina", acabamento: "linhas" },
    prompt:
      "sketch style tattoo, loose overlapping pencil-like construction lines, cross hatching, unfinished drawing look",
  },
  {
    id: "ornamental",
    nome: "Ornamental",
    categoria: "sombra",
    descricao: "Filigranas, rendas e padrões simétricos.",
    bomPara: "coxa, esterno, mãos e peças tipo joia",
    sugestao: { linha: "media", acabamento: "preto" },
    prompt:
      "ornamental tattoo, lace and filigree patterns, symmetrical decorative motifs, jewelry-like details",
  },
];

export const STYLE_FILTERS = [
  { id: "todos", nome: "Todos" },
  { id: "traco", nome: "Só traço" },
  { id: "sombra", nome: "Preto e sombra" },
  { id: "cor", nome: "Com cor" },
];

/* =========================================================
   TRAÇO, ACABAMENTO, DETALHE E FORMATO
   ========================================================= */

export const LINE_WEIGHTS = [
  { id: "fina", nome: "Fina", espessura: 1.5, prompt: "thin delicate lines (3RL needle)" },
  { id: "media", nome: "Média", espessura: 3.5, prompt: "medium line weight (5RL to 7RL needle)" },
  { id: "grossa", nome: "Grossa", espessura: 6.5, prompt: "bold thick outlines (9RL to 14RL needle)" },
];

export const FINISHES = [
  {
    id: "linhas",
    nome: "Só linhas",
    dica: "Pronto para virar stencil",
    prompt: "linework only, no shading and no color, crisp black outlines ready to become a stencil",
  },
  {
    id: "preto",
    nome: "Preto e cinza",
    dica: "Sombreado sem cor",
    prompt: "black and grey ink only with shading, no color",
  },
  {
    id: "colorido",
    nome: "Colorido",
    dica: "Paleta do estilo",
    prompt: "full color, saturated tattoo ink colors that read well on skin",
  },
];

export const DETAIL_LEVELS = [
  { id: "simples", nome: "Simples", prompt: "simple design with few elements, readable at small size" },
  { id: "equilibrado", nome: "Equilibrado", prompt: "balanced level of detail" },
  { id: "detalhado", nome: "Detalhado", prompt: "highly detailed and intricate design for a large piece" },
];

// size: tamanhos aceitos pelo GPT Image (1024x1024, 1024x1536 ou 1536x1024)
// aspectRatio: proporções aceitas pelo imageConfig do Gemini
export const FORMATS = [
  { id: "quadrado", nome: "Quadrado", locais: "Ombro, mão, nuca", size: "1024x1024", aspectRatio: "1:1", w: 1, h: 1, prompt: "compact square composition" },
  { id: "vertical", nome: "Vertical", locais: "Antebraço, panturrilha", size: "1024x1536", aspectRatio: "2:3", w: 2, h: 3, prompt: "tall vertical composition that follows the length of a forearm or calf" },
  { id: "retrato", nome: "Retrato", locais: "Costas, coxa", size: "1024x1536", aspectRatio: "2:3", w: 2, h: 3, prompt: "large vertical composition for the back or thigh" },
  { id: "horizontal", nome: "Horizontal", locais: "Clavícula, peito", size: "1536x1024", aspectRatio: "3:2", w: 3, h: 2, prompt: "wide horizontal composition for the collarbone or chest" },
];

/* =========================================================
   IDEIAS PRONTAS E EXEMPLOS (public/exemplos)
   ========================================================= */

export const IDEA_SUGGESTIONS = [
  "Lobo uivando para a lua cheia",
  "Beija-flor com flores de ipê",
  "Farol no meio de ondas bravas",
  "Gato dormindo sobre uma lua crescente",
  "Cobra enrolada em uma adaga",
  "Baleia nadando entre constelações",
];

export const EXAMPLES = [
  {
    id: "oldschool-coracao",
    src: "/exemplos/oldschool-coracao.png",
    ideia: "Coração atravessado por uma adaga, com faixa escrita CORAGEM",
    estilo: "oldschool",
    linha: "grossa",
    acabamento: "colorido",
    detalhe: "equilibrado",
    formato: "vertical",
  },
  {
    id: "blackwork-mariposa",
    src: "/exemplos/blackwork-mariposa.png",
    ideia: "Mariposa simétrica com uma lua crescente acima",
    estilo: "blackwork",
    linha: "grossa",
    acabamento: "preto",
    detalhe: "equilibrado",
    formato: "quadrado",
  },
  {
    id: "fineline-lua",
    src: "/exemplos/fineline-lua.png",
    ideia: "Lua crescente com ramo de oliveira e pequenas estrelas",
    estilo: "fineline",
    linha: "fina",
    acabamento: "linhas",
    detalhe: "simples",
    formato: "quadrado",
  },
  {
    id: "dotwork-mandala",
    src: "/exemplos/dotwork-mandala.png",
    ideia: "Mandala circular com pétalas em camadas",
    estilo: "dotwork",
    linha: "fina",
    acabamento: "preto",
    detalhe: "detalhado",
    formato: "quadrado",
  },
  {
    id: "geometrico-montanhas",
    src: "/exemplos/geometrico-montanhas.png",
    ideia: "Cordilheira com sol dentro de um triângulo",
    estilo: "geometrico",
    linha: "media",
    acabamento: "linhas",
    detalhe: "equilibrado",
    formato: "vertical",
  },
  {
    id: "aquarela-pena",
    src: "/exemplos/aquarela-pena.png",
    ideia: "Pena com manchas de aquarela em verde-água, roxo e rosa",
    estilo: "aquarela",
    linha: "fina",
    acabamento: "colorido",
    detalhe: "equilibrado",
    formato: "vertical",
  },
];

export const DEFAULT_SETTINGS = {
  ideia: "",
  estilo: "fineline",
  linha: "fina",
  acabamento: "linhas",
  detalhe: "equilibrado",
  formato: "quadrado",
  variacoes: 2,
};

/** Procura uma opção pelo id (ou devolve a primeira). */
export const findById = (lista, id) => lista.find((item) => item.id === id) ?? lista[0];
