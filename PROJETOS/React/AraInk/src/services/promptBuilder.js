import {
  DETAIL_LEVELS,
  FINISHES,
  FORMATS,
  LINE_WEIGHTS,
  STYLES,
  findById,
} from "../config/tattooOptions.js";

/**
 * Monta o prompt a partir das escolhas do estúdio.
 * Fica separado do service para dar para ver (e ensinar) o prompt na tela,
 * e não depende do Vite: o script npm run exemplos (Node) também usa.
 *
 * O GPT Image e o Gemini seguem bem instruções longas e regras ("não faça X"),
 * e entendem a ideia em português, então o mesmo prompt serve para os dois.
 *
 * buildTattooPrompt({ ideia, estilo, linha, acabamento, detalhe, formato })
 */
export function buildTattooPrompt(settings) {
  const estilo = findById(STYLES, settings.estilo);
  const linha = findById(LINE_WEIGHTS, settings.linha);
  const acabamento = findById(FINISHES, settings.acabamento);
  const detalhe = findById(DETAIL_LEVELS, settings.detalhe);
  const formato = findById(FORMATS, settings.formato);

  return [
    `Create an original, never-before-seen tattoo design (tattoo flash artwork) of: ${settings.ideia.trim()}.`,
    `Style: ${estilo.prompt}.`,
    `Linework: ${linha.prompt}.`,
    `Finish: ${acabamento.prompt}.`,
    `Detail: ${detalhe.prompt}.`,
    `Composition: ${formato.prompt}.`,
    "Rules: one finished tattoo design, centered, on a plain pure white background, with clean edges that a tattoo artist can turn into a stencil.",
    "Do not show skin, a body, a mockup or a photo. No watermark, signature or frame.",
    "Only include lettering if the idea explicitly asks for words.",
    "Do not copy existing characters, logos, brands or famous artworks.",
  ].join("\n");
}

/** Pede uma composição diferente para cada variação gerada ao mesmo tempo. */
export function withVariation(prompt, numero, total) {
  if (total <= 1) return prompt;
  return `${prompt}\nVariation ${numero} of ${total}: explore a composition clearly different from the other variations.`;
}

/** Prompt de ajuste: vai junto com a imagem atual. */
export function buildRefinePrompt(instrucao) {
  return [
    `Edit this tattoo design: ${instrucao.trim()}.`,
    "Keep the same subject, tattoo style and plain pure white background unless the request says otherwise.",
    "Return the full edited design, centered, with no mockup, skin or text added.",
  ].join("\n");
}
