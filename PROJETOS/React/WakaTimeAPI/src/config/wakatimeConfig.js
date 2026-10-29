// wakatimeConfig.js
// Configurações do componente <WakaTimeStats />.
//
// O token do WakaTime NÃO fica aqui: ele é lido só no servidor (WAKATIME_ACCESS_TOKEN,
// token OAuth gerado pelo npm run wakatime:oauth), pelas Vercel Functions da
// pasta api/ e pelo vite.config.js no npm run dev.
// O navegador apenas chama API_PATH no próprio domínio.
const WAKATIME_CONFIG = {
  API_PATH: "/api/wakatime",

  // Período aberto ao carregar a página
  DEFAULT_RANGE: "last_7_days",

  // Botões de período (value = range aceito pela API do WakaTime)
  RANGES: [
    { value: "last_7_days", label: "7 dias" },
    { value: "last_30_days", label: "30 dias" },
    { value: "last_6_months", label: "6 meses" },
    { value: "last_year", label: "1 ano" },
    { value: "all_time", label: "Desde sempre" },
  ],

  // Link do seu perfil público (opcional: deixe "" para esconder o botão)
  PROFILE_URL: "https://wakatime.com/@aramuni",

  // Quantas linguagens aparecem na lista (o resto vira "+ N outras")
  MAX_LANGUAGES: 10,

  // Linguagens que você não quer mostrar, ex.: ["Text", "Other"]
  HIDDEN_LANGUAGES: [],

  // Bibliotecas: os pacotes que aparecem nos import dos arquivos que você
  // edita ("dependencies" do WakaTime). Só vêm com o WAKATIME_ACCESS_TOKEN.
  // Quantas aparecem na seção "Bibliotecas"
  MAX_LIBRARIES: 10,

  // Bibliotecas que você não quer mostrar. Entram também pacotes internos de
  // clientes (ex.: "@cliente-x/auth") e a biblioteca padrão das linguagens
  // (ex.: "os", "sys", "java.util"), que só fazem barulho.
  // Nome exato ou, terminando com "*", tudo que começa assim:
  //   HIDDEN_DEPENDENCIES: ["os", "sys", "@cliente-x/*", "java.*"],
  // Sem diferenciar maiúsculas. O filtro roda no servidor (api/_wakatime.js),
  // então o nome escondido não chega nem ao navegador.
  HIDDEN_DEPENDENCIES: [],

  // "Codando agora": em que projeto você está mexendo no editor NESTE momento.
  // Sai dos heartbeats do WakaTime, que são privados: só funciona com o
  // WAKATIME_ACCESS_TOKEN, escopo read_heartbeats (no modo perfil público o
  // cartão não aparece).
  // Este bloco também é lido pelo servidor (api/_codando.js).
  CODING_NOW: {
    API_PATH: "/api/codando",

    // Fuso da sua conta no WakaTime (wakatime.com/settings/preferences):
    // é por ele que a API separa os dias
    TIMEZONE: "America/Sao_Paulo",

    // Último heartbeat há até tantos minutos = "codando agora".
    // A extensão manda um a cada ~2 min enquanto você digita.
    ACTIVE_MINUTES: 10,

    // Pausa maior que isso encerra a sessão (mesmo timeout padrão do WakaTime)
    BREAK_MINUTES: 15,

    // De quanto em quanto tempo a página pergunta de novo
    REFRESH_SECONDS: 60,

    // Projetos que aparecem pelo nome (com a branch). "*" = todos.
    // Para esconder projetos de cliente, troque por uma lista, ex.:
    //   PUBLIC_PROJECTS: ["meu-portfolio", "WakaTimeAPI"],
    // O nome é o que o WakaTime mostra no dashboard (em geral, o nome da pasta).
    // Também dá para somar nomes pela variável WAKATIME_PUBLIC_PROJECTS.
    PUBLIC_PROJECTS: ["*"],

    // Projeto fora da lista: true = aparece como "projeto privado" (sem nome
    // e sem branch); false = o cartão nem aparece
    SHOW_PRIVATE: true,
  },
};

export default WAKATIME_CONFIG;
