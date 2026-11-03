import APP_CONFIG from "../config/appConfig";
import { supabase } from "../config/supabaseClient";
import { SupabaseNaoConfiguradoException } from "../core/exceptions";

/** Códigos do Postgres que as telas tratam. */
export const PG = {
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  NO_DATA_FOUND: "P0002",
  INVALID_PARAMETER: "22023",
};

/** O cliente do Supabase, ou um erro claro se o .env.local não foi preenchido. */
export function cliente() {
  if (!supabase) throw new SupabaseNaoConfiguradoException();
  return supabase;
}

/** Erro do Supabase com o código do Postgres (error.code) preservado. */
export class ErroSupabase extends Error {
  constructor(error) {
    super(error.message);
    this.name = "ErroSupabase";
    this.code = error.code;
  }
}

export function verificar(error) {
  if (error) throw new ErroSupabase(error);
}

/**
 * A Data API devolve no máximo 1000 linhas por chamada. Esta função pede
 * de 1000 em 1000 (com .range) até acabar.
 * montarConsulta() precisa devolver uma consulta nova a cada chamada.
 */
export async function buscarTudo(montarConsulta) {
  const tamanho = APP_CONFIG.TAMANHO_PAGINA;
  const linhas = [];
  for (let inicio = 0; ; inicio += tamanho) {
    const { data, error } = await montarConsulta().range(inicio, inicio + tamanho - 1);
    verificar(error);
    linhas.push(...data);
    if (data.length < tamanho) return linhas;
  }
}
