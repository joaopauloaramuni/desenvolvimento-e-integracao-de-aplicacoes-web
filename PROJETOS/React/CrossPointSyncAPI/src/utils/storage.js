// storage.js
// Leitura e escrita no localStorage, sempre com try/catch
// (modo privado ou cota cheia não podem quebrar o app).
import CROSSPOINT_CONFIG from "../config/crosspointConfig";

const { THEME, SESSION } = CROSSPOINT_CONFIG.STORAGE_KEYS;

function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave, valor) {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    // sem localStorage: segue só em memória
  }
}

export function getSavedTheme() {
  const tema = ler(THEME);
  return tema === "light" || tema === "dark" ? tema : null;
}

export function saveTheme(tema) {
  gravar(THEME, tema);
}

/** Sessão salva: { server, user, key }. A key é o MD5 da senha, nunca a senha. */
export function getSavedSession() {
  try {
    const sessao = JSON.parse(ler(SESSION));
    if (sessao?.server && sessao?.user && /^[0-9a-f]{32}$/.test(sessao?.key)) return sessao;
  } catch {
    // JSON inválido: ignora
  }
  return null;
}

export function saveSession(sessao) {
  gravar(SESSION, sessao ? JSON.stringify(sessao) : null);
}
