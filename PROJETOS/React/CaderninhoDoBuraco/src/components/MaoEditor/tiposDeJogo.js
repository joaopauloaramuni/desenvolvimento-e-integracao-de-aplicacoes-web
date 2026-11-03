import APP_CONFIG from "../../config/appConfig";
import { formatNumero } from "../../utils/format";

const { REGRAS } = APP_CONFIG;

/** Nome e bônus de cada tipo de jogo, para os selos. */
export const TIPOS_DE_JOGO = {
  jogo: { nome: "Jogo", bonus: 0 },
  limpa: { nome: "Canastra limpa", bonus: REGRAS.CANASTRA_LIMPA },
  suja: { nome: "Canastra suja", bonus: REGRAS.CANASTRA_SUJA },
  real: { nome: "Canastra real", bonus: REGRAS.CANASTRA_REAL },
};

export function textoDoSelo(tipo) {
  const t = TIPOS_DE_JOGO[tipo];
  return t.bonus ? `${t.nome} +${formatNumero(t.bonus)}` : t.nome;
}
