import { API_BASE, PAGE_SIZE } from "../config/appConfig";
import i18n from "../i18n";
import { createCard } from "../model/Card";

/**
 * Acesso à API da YGOPRODeck (https://ygoprodeck.com/api-guide/).
 *
 * - Sem chave e sem back-end: o navegador chama a API direto.
 * - Quando nada é encontrado, a API responde HTTP 400 com { error: "No card matching..." }.
 *   Isso vira uma lista vazia, e não um erro.
 * - As respostas ficam num cache em memória (Map) para respeitar o limite
 *   de requisições da API (~20 por segundo) ao voltar de página ou trocar de aba.
 */

const cache = new Map();

async function getJson(caminho, params = {}) {
  const query = new URLSearchParams();
  for (const [chave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== null && valor !== "") query.set(chave, valor);
  }
  const url = `${API_BASE}/${caminho}${query.size ? `?${query}` : ""}`;

  if (cache.has(url)) return cache.get(url);

  const promessa = (async () => {
    let resposta;
    try {
      resposta = await fetch(url);
    } catch {
      throw new Error(i18n.t("errors.network"));
    }

    const corpo = await resposta.json().catch(() => null);

    if (resposta.status === 400 && corpo?.error) return { data: [], meta: { total_rows: 0 } };
    if (resposta.status === 429) throw new Error(i18n.t("errors.rateLimit"));
    if (!resposta.ok || !corpo) throw new Error(i18n.t("errors.http", { status: resposta.status }));

    return corpo;
  })();

  cache.set(url, promessa);
  promessa.catch(() => cache.delete(url)); // erros não ficam no cache
  return promessa;
}

function langParam(language) {
  return language && language !== "en" ? language : undefined;
}

/**
 * Lista paginada de cartas.
 * filtros: { q, type, attribute, archetype, sort, page, language }
 */
export async function searchCards({ q, type, attribute, archetype, sort = "name", page = 1, language } = {}) {
  const corpo = await getJson("cardinfo.php", {
    fname: q?.trim(),
    type,
    attribute,
    archetype,
    sort,
    num: PAGE_SIZE,
    offset: (Math.max(1, page) - 1) * PAGE_SIZE,
    language: langParam(language),
  });

  const total = corpo.meta?.total_rows ?? corpo.data.length;
  return {
    cards: corpo.data.map(createCard),
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Uma carta pelo id (passcode). Devolve null se não existir. */
export async function getCardById(id, language) {
  const corpo = await getJson("cardinfo.php", { id, language: langParam(language) });
  return corpo.data[0] ? createCard(corpo.data[0]) : null;
}

/**
 * Várias cartas pelos ids, na mesma ordem dos ids recebidos.
 * A API aceita ids separados por vírgula; mandamos em blocos de 50.
 */
export async function getCardsByIds(ids, language) {
  if (!ids.length) return [];
  const blocos = [];
  for (let i = 0; i < ids.length; i += 50) blocos.push(ids.slice(i, i + 50));

  const respostas = await Promise.all(
    blocos.map((bloco) => getJson("cardinfo.php", { id: bloco.join(","), language: langParam(language) })),
  );

  const porId = new Map(respostas.flatMap((r) => r.data).map((c) => [c.id, createCard(c)]));
  return ids.map((id) => porId.get(id)).filter(Boolean);
}

/** Nomes de todos os arquétipos, em ordem alfabética (para o filtro). */
export async function getArchetypes() {
  const corpo = await getJson("archetypes.php");
  return corpo.map((a) => a.archetype_name).sort((a, b) => a.localeCompare(b));
}

/** Embaralha e devolve n itens (Fisher-Yates), sem alterar a lista original. */
export function sortear(lista, n) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}
