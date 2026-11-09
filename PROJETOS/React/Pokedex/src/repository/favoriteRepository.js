import { supabase } from "../config/supabaseClient";

/**
 * Acesso aos favoritos no Supabase.
 *
 * O visitante (papel "anon") não lê nem grava a tabela "favorites" direto:
 * ele só chama as duas funções do supabase_favorites.sql, sempre passando o
 * owner_token deste navegador. Assim ninguém consegue listar os favoritos dos outros.
 */

function verificar(error) {
  if (error) {
    throw new Error(`Supabase: ${error.message}`);
  }
}

function cliente() {
  if (!supabase) {
    throw new Error("Supabase não configurado: preencha o .env.local (veja o README).");
  }
  return supabase;
}

/** select * from list_my_favorites('<uuid>') -> [{ pokemon_id, created_at }, ...] */
export async function findAllByOwnerToken(ownerToken) {
  const { data, error } = await cliente().rpc("list_my_favorites", {
    p_owner_token: ownerToken,
  });
  verificar(error);
  return (data ?? []).map((linha) => Number(linha.pokemon_id));
}

/**
 * select toggle_favorite('<uuid>', 25) -> true (agora é favorito) / false (deixou de ser)
 * O banco faz o delete-ou-insert numa função só, sem janela entre consultar e gravar.
 */
export async function toggleByOwnerToken(ownerToken, pokemonId) {
  const { data, error } = await cliente().rpc("toggle_favorite", {
    p_owner_token: ownerToken,
    p_pokemon_id: pokemonId,
  });
  verificar(error);
  return data === true;
}
