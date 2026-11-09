import { useCallback, useEffect, useState } from "react";
import { supabaseConfigurado } from "../config/supabaseClient";
import { getFavoriteIds, toggle } from "../services/favoriteService";

const AVISO_DESATIVADO =
  "Favoritos desativados: preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.local.";

/**
 * Favoritos guardados no Supabase.
 * - carrega todos os IDs deste navegador numa única consulta ao abrir a Pokédex;
 * - alternarFavorito(id) grava no banco e atualiza a tela com a resposta dele;
 * - status alimenta o LED do aparelho: off | loading | saving | ok | error.
 */
export default function useFavoritos() {
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [salvando, setSalvando] = useState(() => new Set()); // estrelas aguardando o banco
  const [carregando, setCarregando] = useState(supabaseConfigurado);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    let ativo = true;

    getFavoriteIds()
      .then((ids) => ativo && setFavoriteIds(ids))
      .catch((e) => ativo && setErro(`Não foi possível carregar os favoritos. ${e.message}`))
      .finally(() => ativo && setCarregando(false));

    return () => {
      ativo = false;
    };
  }, []);

  const alternarFavorito = useCallback(async (pokemonId) => {
    if (!supabaseConfigurado) return;

    setSalvando((atual) => new Set(atual).add(pokemonId));
    try {
      const agoraEFavorito = await toggle(pokemonId);
      setFavoriteIds((atual) => {
        const novo = new Set(atual);
        if (agoraEFavorito) novo.add(pokemonId);
        else novo.delete(pokemonId);
        return novo;
      });
      setErro(null);
    } catch (e) {
      setErro(`Não foi possível salvar o favorito. ${e.message}`);
    } finally {
      setSalvando((atual) => {
        const novo = new Set(atual);
        novo.delete(pokemonId);
        return novo;
      });
    }
  }, []);

  let status = "ok";
  if (!supabaseConfigurado) status = "off";
  else if (erro) status = "error";
  else if (carregando) status = "loading";
  else if (salvando.size > 0) status = "saving";

  return {
    favoriteIds,
    salvando,
    carregando,
    erro: supabaseConfigurado ? erro : AVISO_DESATIVADO,
    status,
    habilitado: supabaseConfigurado,
    alternarFavorito,
  };
}
