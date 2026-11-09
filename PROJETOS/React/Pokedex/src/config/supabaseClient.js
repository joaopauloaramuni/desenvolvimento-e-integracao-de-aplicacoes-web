import { createClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase, criado uma vez só e compartilhado pelo projeto.
 *
 * Não existe back-end: o navegador não consegue abrir uma conexão TCP com o
 * Postgres, então o supabase-js fala com a Data API do Supabase (HTTPS), usando a
 * chave PUBLICÁVEL. Quem protege a tabela é o RLS + as funções do
 * supabase_favorites.sql, e não a chave.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Valores do .env.example ("<project-ref>", "sb_publishable_xxx...") contam como
 * "não preenchido": sem isso, o createClient lança erro e a página fica em branco.
 */
function urlValida(valor) {
  try {
    return Boolean(valor) && !valor.includes("<") && new URL(valor).protocol.startsWith("http");
  } catch {
    return false;
  }
}

function chaveValida(valor) {
  return Boolean(valor) && !/x{8,}/i.test(valor);
}

/** false quando o .env.local não foi preenchido: a Pokédex funciona, os favoritos não. */
export const supabaseConfigurado = urlValida(url) && chaveValida(key);

export const supabase = supabaseConfigurado
  ? createClient(url, key, {
      // Não há login neste projeto: nada de sessão no localStorage.
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
