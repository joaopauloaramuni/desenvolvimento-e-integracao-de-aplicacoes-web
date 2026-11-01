import APP_CONFIG from "../config/appConfig";

/**
 * Coleção de tatuagens salvas no IndexedDB do navegador.
 * src é o data URL da imagem (PNG em base64).
 * O localStorage guarda só uns 5 MB de texto (duas ou três imagens);
 * o IndexedDB aguenta centenas de megabytes.
 *
 * Cada item: { id, criadoEm, src, ideia, estilo, linha, acabamento, detalhe, formato, prompt }
 */

const { NAME, VERSION, STORE } = APP_CONFIG.DB;

let conexao = null;

function abrir() {
  if (conexao) return conexao;
  conexao = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Este navegador não tem IndexedDB."));
      return;
    }
    const pedido = window.indexedDB.open(NAME, VERSION);
    pedido.onupgradeneeded = () => {
      const db = pedido.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" }).createIndex("criadoEm", "criadoEm");
      }
    };
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
  conexao.catch(() => {
    conexao = null;
  });
  return conexao;
}

/** Abre uma transação e devolve uma Promise com o resultado do pedido. */
async function executar(modo, acao) {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const transacao = db.transaction(STORE, modo);
    const pedido = acao(transacao.objectStore(STORE));
    transacao.oncomplete = () => resolve(pedido?.result);
    transacao.onerror = () => reject(transacao.error);
    transacao.onabort = () => reject(transacao.error ?? new Error("Transação cancelada."));
  });
}

/** Itens da coleção, do mais novo para o mais antigo. */
export async function listarColecao() {
  const itens = (await executar("readonly", (store) => store.getAll())) ?? [];
  return itens.sort((a, b) => b.criadoEm - a.criadoEm);
}

export function salvarNaColecao(item) {
  return executar("readwrite", (store) => store.put(item));
}

export function removerDaColecao(id) {
  return executar("readwrite", (store) => store.delete(id));
}
