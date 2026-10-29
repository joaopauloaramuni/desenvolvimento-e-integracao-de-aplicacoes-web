import {
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandWhatsapp,
  TbMail,
} from "react-icons/tb";

/**
 * Dados do portfólio de exemplo.
 * No SEU portfólio, troque só este arquivo: os componentes continuam iguais.
 */

const REPO =
  "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React";

// Usado no HoverEffect (Card Hover Effect)
export const projects = [
  {
    title: "Pokédex",
    description: "Os 151 Pokémon da primeira geração, com busca, filtros e favoritos no Supabase.",
    link: `${REPO}/Pokedex`,
  },
  {
    title: "GitHub API",
    description: "Painel com o perfil, os repositórios e as linguagens de qualquer usuário do GitHub.",
    link: `${REPO}/GitHubAPI`,
  },
  {
    title: "Spotify API",
    description: "O que está tocando agora e as músicas e artistas mais ouvidos.",
    link: `${REPO}/SpotifyAPI`,
  },
  {
    title: "Mapbox",
    description: "Mapa interativo com marcadores, popups e busca de endereços.",
    link: `${REPO}/MapBoxAPI`,
  },
  {
    title: "Currículo em PDF",
    description: "O currículo aparece dentro da página, com texto selecionável e links.",
    link: `${REPO}/CurriculumPDF`,
  },
  {
    title: "Globo de habilidades",
    description: "Globo 3D com as suas tecnologias, feito só com canvas 2D.",
    link: `${REPO}/SkillsGlobe`,
  },
];

// Usado no InfiniteMovingCards
export const testimonials = [
  {
    quote: "A Ana organizou o front-end do nosso TCC inteiro. Os componentes ficaram tão limpos que reaproveitamos em outro projeto.",
    name: "Bruno Lima",
    title: "Colega de TCC",
  },
  {
    quote: "Entregou o painel antes do prazo e ainda escreveu a documentação para o próximo estagiário.",
    name: "Carla Mendes",
    title: "Tech lead no estágio",
  },
  {
    quote: "O site novo da loja ficou rápido no celular e as vendas pelo Pix aumentaram já no primeiro mês.",
    name: "Diego Rocha",
    title: "Cliente freelance",
  },
  {
    quote: "Sempre a primeira a ajudar a turma com React. Explica com paciência e com exemplo na tela.",
    name: "Elisa Prado",
    title: "Monitora de Desenvolvimento Web",
  },
];

// Usado no FloatingDock (troque pelos SEUS links)
export const socialLinks = [
  { title: "GitHub", icon: <TbBrandGithub className="h-full w-full text-neutral-300" />, href: "https://github.com/" },
  { title: "LinkedIn", icon: <TbBrandLinkedin className="h-full w-full text-neutral-300" />, href: "https://www.linkedin.com/" },
  { title: "Instagram", icon: <TbBrandInstagram className="h-full w-full text-neutral-300" />, href: "https://www.instagram.com/" },
  { title: "WhatsApp", icon: <TbBrandWhatsapp className="h-full w-full text-neutral-300" />, href: "https://wa.me/" },
  { title: "E-mail", icon: <TbMail className="h-full w-full text-neutral-300" />, href: "mailto:ana.souza@email.com" },
];
