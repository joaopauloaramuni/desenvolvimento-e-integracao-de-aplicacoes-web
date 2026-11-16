// Textos fixos da vitrine: disciplinas, semestre e professor orientador.

const VITRINE_CONFIG = {
  TITULO: "Vitrine de Portfólios",
  SEMESTRE: "2º semestre de 2026",
  CAMPI: ["Lourdes", "Coração Eucarístico"],

  DISCIPLINAS: [
    {
      nome: "Desenvolvimento de Interfaces Web",
      sigla: "DIW",
      curso: "Ciência da Computação",
    },
    {
      nome: "Desenvolvimento e Integração de Aplicações Web",
      sigla: "DIAW",
      curso: "Engenharia de Software",
    },
  ],

  // Card em destaque no topo da página
  PROFESSOR: {
    id: "aramuni",
    nome: "Prof. Dr. João Paulo Aramuni",
    site: "https://aramuni.dev",
    github: "joaopauloaramuni",
    repo: "joaopauloaramuni-portfolio",
    embeddable: true,
  },

  // Repositório que inspirou esta vitrine
  INSPIRACAO: {
    autor: "Ryan Ferreira",
    github: "ferreiraryan",
    repo: "portifolios-DIW",
    site: "https://portifolios-diw.vercel.app/",
  },

  REPO_VITRINE: "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/VitrinePortfolios",
};

export default VITRINE_CONFIG;
