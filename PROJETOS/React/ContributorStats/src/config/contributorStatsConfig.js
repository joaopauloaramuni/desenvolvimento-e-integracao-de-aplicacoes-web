// contributorStatsConfig.js
// Configurações centrais do projeto (equivalente ao core/config.py do Python).
//
// O token do GitHub NÃO fica aqui: ele é lido só no servidor (GITHUB_TOKEN no
// .env.local), pela Vercel Function api/github.js e pelo vite.config.js no npm run dev.
const CONTRIBUTOR_STATS_CONFIG = {
  // Rota do próprio site que fala com o GitHub (ver api/_github.js)
  API_PATH: "/api/github",

  // Repositório usado como exemplo quando a página abre
  DEFAULT_REPO_URL:
    "https://github.com/ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-8",

  // Commits por página no GraphQL (máx. 100). Em caso de timeout, o valor é reduzido.
  GRAPHQL_PAGE_SIZE: 100,

  // Polling do endpoint /stats/contributors (a API responde 202 enquanto calcula)
  MAX_TRIES: 6,
  WAIT_TIME: 10, // segundos entre tentativas

  // Nº de requisições simultâneas ao buscar a data do último commit de cada usuário
  MAX_WORKERS: 8,

  // Abas "Tipos de arquivo" (por aluno e por grupo): cada commit custa 1 requisição à API REST do GitHub.
  // Acima deste limite, só os commits mais recentes são analisados.
  FILE_TYPES_MAX_COMMITS: 3000,
  // Ignorar arquivos gerados (package-lock.json, node_modules/, dist/, *.min.js...) ao abrir
  DEFAULT_IGNORE_GENERATED: true,

  // Opções marcadas quando a página abre
  DEFAULT_ALL_BRANCHES: true, // considerar todas as branches (não só a padrão)
  DEFAULT_INCLUDE_MERGES: false, // contar também os commits de merge
  DEFAULT_EXACT_DATES: true, // só no modo "branch padrão": data exata do último commit

  // Aba "Produtividade" (tudo é calculado no navegador, sem novas chamadas à API)
  // Período e integrantes que aparecem preenchidos ao abrir a aba ("" = sem filtro)
  DEFAULT_PERIOD_START: "", // "AAAA-MM-DD": início do trabalho
  DEFAULT_DEADLINE: "", // "AAAA-MM-DD": prazo de entrega
  DEFAULT_MEMBERS: "", // logins dos integrantes, separados por vírgula
  DEFAULT_IGNORE_BOTS: true, // ignorar contas [bot] (ex.: github-classroom[bot])
  LARGE_COMMIT_LINES: 1000, // commit com pelo menos esse nº de linhas alteradas é "grande"
  FINAL_STRETCH_DAYS: 3, // dias antes do prazo considerados "reta final"
  INACTIVE_DAYS: 14, // dias sem commit (até o fim do período) para gerar alerta
  MIN_MESSAGE_LENGTH: 8, // mensagens de commit mais curtas que isso são "genéricas"
};

export default CONTRIBUTOR_STATS_CONFIG;
