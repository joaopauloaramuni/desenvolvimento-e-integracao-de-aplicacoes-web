// Funções pequenas usadas pelos cards, pela busca e pelo modal.

/** "https://www.bicalho.dev/" -> "bicalho.dev" */
export function dominio(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

export const githubUrl = (usuario) => `https://github.com/${usuario}`;
export const repoUrl = (usuario, repo) => `https://github.com/${usuario}/${repo}`;

/** Captura local (public/previews) gerada pelo npm run previews */
export const capturaLocal = (id) => `/previews/${id}.png`;

/** Tira acentos e caixa: "César" e "cesar" passam a ser iguais na busca */
export function normalizar(texto = "") {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function filtrarPorNome(lista, termo) {
  const t = normalizar(termo);
  if (!t) return lista;
  return lista.filter((p) => normalizar(p.nome).includes(t));
}
