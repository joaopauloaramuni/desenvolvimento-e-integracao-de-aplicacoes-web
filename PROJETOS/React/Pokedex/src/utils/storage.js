import { STORAGE_KEYS } from "../config/appConfig";

/**
 * localStorage com try/catch: em aba anônima ou com o armazenamento bloqueado,
 * o navegador lança exceção, e a Pokédex não pode quebrar por isso.
 */

export function lerStorage(chave) {
  try {
    return window.localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravarStorage(chave, valor) {
  try {
    window.localStorage.setItem(chave, valor);
  } catch {
    // Sem armazenamento: o valor vale só até recarregar a página.
  }
}

function gerarUuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();

  // Plano B (navegadores antigos ou página fora do HTTPS): UUID v4 com getRandomValues.
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let tokenEmMemoria = null;

/**
 * Identificador anônimo deste navegador (não há login).
 * Gerado na primeira visita e guardado no localStorage; é ele que separa
 * os favoritos de cada pessoa na tabela "favorites".
 */
export function getOwnerToken() {
  if (tokenEmMemoria) return tokenEmMemoria;

  const salvo = lerStorage(STORAGE_KEYS.ownerToken);
  if (salvo && UUID_REGEX.test(salvo)) {
    tokenEmMemoria = salvo;
    return salvo;
  }

  tokenEmMemoria = gerarUuid();
  gravarStorage(STORAGE_KEYS.ownerToken, tokenEmMemoria);
  return tokenEmMemoria;
}
