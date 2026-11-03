// appConfig.js
// As regras de pontuação da nossa mesa e as opções do app.
// Mudou a regra? É só mexer aqui: a legenda da Home e a contagem usam estes valores.

const APP_CONFIG = {
  REGRAS: {
    // Quanto vale cada carta baixada na mesa (e quanto custa se sobrar na mão)
    VALOR_CARTA: {
      A: 15,
      2: 10,
      3: 5,
      4: 5,
      5: 5,
      6: 5,
      7: 5,
      8: 10,
      9: 10,
      10: 10,
      J: 10,
      Q: 10,
      K: 10,
      JOKER: 20,
    },

    BATIDA: 100,
    CANASTRA_LIMPA: 200,
    CANASTRA_SUJA: 100,

    // Canastra limpa de Ás até Ás do mesmo naipe (A, 2, 3 ... K, A): vale isto
    // NO LUGAR dos 200 da canastra limpa.
    CANASTRA_REAL: 1000,

    // Cartas para um jogo virar canastra
    TAMANHO_CANASTRA: 7,
    // Menor jogo que pode ser baixado
    TAMANHO_MINIMO_JOGO: 3,
  },

  // Figuras que podem ser o "avatar" do jogador (arquivos em src/assets/images)
  CARTAS_AVATAR: [
    { id: "dama-copas", nome: "Dama de copas" },
    { id: "dama-ouros", nome: "Dama de ouros" },
    { id: "dama-espadas", nome: "Dama de espadas" },
    { id: "dama-paus", nome: "Dama de paus" },
    { id: "valete-copas", nome: "Valete de copas" },
    { id: "valete-ouros", nome: "Valete de ouros" },
    { id: "valete-espadas", nome: "Valete de espadas" },
    { id: "valete-paus", nome: "Valete de paus" },
    { id: "joker-carta", nome: "Coringa" },
    { id: "joker-bobo", nome: "Bobo da corte" },
  ],

  // Cores dos jogadores nos gráficos (contrastam com o feltro verde)
  CORES_JOGADOR: [
    "#e2b544",
    "#ef6b5e",
    "#7cc3ef",
    "#f3ead3",
    "#b9a2ee",
    "#f39a4a",
    "#6fd3b8",
    "#f29bc0",
  ],

  // A Data API do Supabase devolve no máximo 1000 linhas por chamada
  TAMANHO_PAGINA: 1000,
};

export default APP_CONFIG;
