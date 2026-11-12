import capaCobrinha from "../assets/images/cobrinha-capa.webp";

// Cada item é um jogo Pygame já convertido pelo pygbag.
//
// pasta    -> nome da pasta em public/games/ (e em game/), a mesma do `npm run game:build`
// largura / altura -> o tamanho usado no pygame.display.set_mode((largura, altura));
//                     define a proporção da tela do jogo na página
// capa     -> imagem mostrada antes de clicar em "Jogar" (um print do seu jogo)
// controles -> aparecem ao lado do jogo
//
// Para colocar o SEU jogo: gere o build (veja o README), copie este objeto,
// troque os campos e pronto. Com mais de um jogo, a página mostra um abaixo do outro.
export const GAMES = [
  {
    pasta: "cobrinha",
    titulo: "Cobrinha",
    descricao:
      "O clássico Snake: coma as maçãs para crescer e não bata nas paredes nem no próprio corpo. A cada 5 maçãs a cobrinha fica mais rápida.",
    autor: "Seu nome aqui",
    disciplina: "Trabalho de Programação com Pygame",
    largura: 640,
    altura: 480,
    capa: capaCobrinha,
    tecnologias: ["Python", "Pygame", "pygbag"],
    codigoFonte:
      "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/PygbagReact/game/cobrinha",
    controles: [
      { teclas: ["←", "↑", "→", "↓"], acao: "Mudar a direção (ou W, A, S, D)" },
      { teclas: ["Deslizar"], acao: "No celular, deslize o dedo para virar" },
      { teclas: ["Espaço"], acao: "Começar e jogar de novo (ou toque)" },
      { teclas: ["P"], acao: "Pausar e continuar (ou Esc)" },
    ],
  },
];
