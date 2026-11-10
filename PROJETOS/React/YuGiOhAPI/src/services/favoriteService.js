import { supabaseConfigurado } from "../config/supabaseClient";
import { findAllByOwnerToken, toggleByOwnerToken } from "../repository/favoriteRepository";
import i18n from "../i18n";
import { getOwnerToken } from "../utils/storage";

/** Regras dos favoritos: validação do id e owner_token deste navegador. */

export const favoritosDisponiveis = supabaseConfigurado;

/** Ids favoritados por este navegador, do mais recente ao mais antigo. */
export async function getFavoriteIds() {
  return findAllByOwnerToken(getOwnerToken());
}

/** Alterna o favorito. Devolve true se a carta agora é favorita. */
export async function toggle(cardId) {
  const id = Number(cardId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(i18n.t("errors.invalidId", { id: cardId }));
  }
  return toggleByOwnerToken(getOwnerToken(), id);
}
