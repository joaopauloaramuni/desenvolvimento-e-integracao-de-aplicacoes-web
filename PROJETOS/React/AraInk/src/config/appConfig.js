// appConfig.js
// Configurações gerais do AraInk.

const APP_CONFIG = {
  // Tamanho máximo da descrição da ideia
  MAX_IDEA: 400,

  // Tamanho máximo do pedido de ajuste ("deixe as linhas mais finas")
  MAX_REFINE: 200,

  // Quantas variações podem ser geradas de uma vez (cada uma é uma chamada à API)
  MIN_VARIATIONS: 1,
  MAX_VARIATIONS: 4,

  // Chaves do localStorage. A do tema também é usada no index.html.
  STORAGE_KEYS: {
    THEME: "araink:theme",
  },

  // Banco IndexedDB da coleção (as imagens são grandes demais para o localStorage)
  DB: {
    NAME: "araink",
    VERSION: 1,
    STORE: "colecao",
  },
};

export default APP_CONFIG;
