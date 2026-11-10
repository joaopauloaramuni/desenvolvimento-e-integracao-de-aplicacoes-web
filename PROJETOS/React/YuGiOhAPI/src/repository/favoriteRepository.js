import { supabase } from "../config/supabaseClient";
import i18n from "../i18n";

/**
 * Acesso aos favoritos no Supabase.
 *
 * O visitante (papel "anon") não lê nem grava a tabela "favorite_cards" direto:
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
    throw new Error(i18n.t("errors.supabaseOff"));
  }
  return supabase;
}

/** select * from list_my_favorite_cards('<uuid>') -> [card_id, ...] (mais recente primeiro) */
export async function findAllByOwnerToken(ownerToken) {
  const { data, error } = await cliente().rpc("list_my_favorite_cards", {
    p_owner_token: ownerToken,
  });
  verificar(error);
  return (data ?? []).map((linha) => Number(linha.card_id));
}

/** select toggle_favorite_card('<uuid>', 46986414) -> true (agora é favorita) / false */
export async function toggleByOwnerToken(ownerToken, cardId) {
  const { data, error } = await cliente().rpc("toggle_favorite_card", {
    p_owner_token: ownerToken,
    p_card_id: cardId,
  });
  verificar(error);
  return data === true;
}
