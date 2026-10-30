// texto.js
// Busca sem diferenciar acentos e nomes "bonitos" para os nomes do GTFS,
// que vêm em CAIXA ALTA (ex.: "CAETANO FURQUIM/NOVA CINTRA").

/** Minúsculas e sem acentos: "Coração" -> "coracao". */
export const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const MINUSCULAS = new Set(["a", "as", "o", "os", "e", "de", "da", "das", "do", "dos", "na", "no", "em", "via", "x"]);
// Siglas que devem continuar em maiúsculas
const SIGLAS = new Set(["BH", "PUC", "UFMG", "MOVE", "BRT", "CEFET", "UPA", "HC", "HPS", "JK", "BHTRANS", "II", "III", "IV", "SESC", "SENAI", "PBH", "TRT", "TJMG", "DER", "BR", "MG", "CEASA"]);

/** "CAETANO FURQUIM/NOVA CINTRA" -> "Caetano Furquim / Nova Cintra". */
export function titulo(texto) {
  const limpo = String(texto ?? "")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
  if (!limpo || limpo !== limpo.toUpperCase()) return limpo; // já está em formato misto
  return limpo
    .split(" ")
    .map((palavra, i) => {
      if (SIGLAS.has(palavra.replace(/[^A-Z]/g, ""))) return palavra;
      const minuscula = palavra.toLocaleLowerCase("pt-BR");
      if (i > 0 && MINUSCULAS.has(minuscula)) return minuscula;
      // Primeira letra maiúscula, inclusive depois de hífen e parêntese: "Sta.-luzia" não
      return minuscula.replace(/(^|[-(])(\p{L})/gu, (_, antes, letra) => antes + letra.toLocaleUpperCase("pt-BR"));
    })
    .join(" ");
}

/** Ordem "natural" dos números de linha: 30 < 101 < 9250 < 9250A. */
export const compararCodigo = (a, b) => a.localeCompare(b, "pt-BR", { numeric: true, sensitivity: "base" });
