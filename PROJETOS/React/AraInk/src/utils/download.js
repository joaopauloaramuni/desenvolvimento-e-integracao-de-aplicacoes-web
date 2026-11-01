/** Extensão do arquivo a partir do mimeType do dataURL. */
function extensao(dataUrl) {
  const tipo = dataUrl.match(/^data:image\/([a-z0-9+]+);/i)?.[1] ?? "png";
  return tipo === "jpeg" ? "jpg" : tipo.replace("+xml", "");
}

/** Texto curto e seguro para nome de arquivo ("Lobo uivando!" -> "lobo-uivando"). */
export function slug(texto, max = 40) {
  return (
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max)
      .replace(/-+$/g, "") || "tatuagem"
  );
}

const ehDataUrl = (src) => src.startsWith("data:");

/** Texto do botão: baixar (data URL) ou abrir em nova aba (URL de outro site, ex.: imagens antigas). */
export const rotuloBaixar = (src) => (ehDataUrl(src) ? "Baixar imagem" : "Abrir imagem em nova aba para salvar");

/**
 * Baixa a imagem como araink-<estilo>-<ideia>.png
 * Imagem de outro site: o navegador não deixa baixar direto
 * com o nome escolhido, então ela abre em uma nova aba para salvar (botão direito).
 */
export function baixarImagem(src, { estilo = "", ideia = "" } = {}) {
  const link = document.createElement("a");
  link.href = src;
  if (ehDataUrl(src)) {
    link.download = `araink-${slug(estilo, 16)}-${slug(ideia)}.${extensao(src)}`;
  } else {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Copia texto (com plano B quando o navegador não libera o clipboard). */
export async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Identificador curto e único para cada imagem. */
export const novoId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
