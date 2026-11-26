/**
 * Leitura / escrita no localStorage com try/catch.
 * Em navegação privada (ou com o armazenamento cheio/bloqueado) o
 * localStorage pode lançar erro: o sistema continua funcionando, só não
 * guarda os dados entre visitas.
 */

const PREFIXO = "ihc-";

export function lerJSON(chave, padrao) {
  try {
    const valor = localStorage.getItem(PREFIXO + chave);
    return valor === null ? padrao : JSON.parse(valor);
  } catch {
    return padrao;
  }
}

export function salvarJSON(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
    // sem armazenamento: o dado vale só nesta visita
  }
}

export function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    // ignora
  }
}

export function lerTexto(chave) {
  try {
    return localStorage.getItem(PREFIXO + chave);
  } catch {
    return null;
  }
}

export function salvarTexto(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, valor);
  } catch {
    // ignora
  }
}
