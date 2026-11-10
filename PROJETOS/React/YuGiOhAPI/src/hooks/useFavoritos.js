import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { favoritosDisponiveis, getFavoriteIds, toggle } from "../services/favoriteService";

/**
 * Estado dos favoritos, compartilhado por todas as páginas (Context).
 *
 * status:
 *  - "desativado": Supabase não configurado (.env.local ausente) → estrelas desabilitadas
 *  - "carregando": buscando os favoritos
 *  - "pronto":     tudo certo, dá para favoritar
 *  - "erro":       a conexão com o Supabase falhou → estrelas desabilitadas + "Tentar de novo"
 */
const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [status, setStatus] = useState(favoritosDisponiveis ? "carregando" : "desativado");
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(() => new Set());

  // Busca os favoritos no Supabase e atualiza o status (sem setState síncrono: só no .then/.catch).
  const buscar = useCallback(
    () =>
      getFavoriteIds()
        .then((lista) => {
          setIds(lista);
          setStatus("pronto");
        })
        .catch((e) => {
          setErro(e.message);
          setStatus("erro");
        }),
    [],
  );

  useEffect(() => {
    if (favoritosDisponiveis) buscar();
  }, [buscar]);

  /** Botão "Tentar de novo" do aviso de erro. */
  const carregar = useCallback(() => {
    if (!favoritosDisponiveis) return;
    setStatus("carregando");
    setErro(null);
    buscar();
  }, [buscar]);

  const alternar = useCallback(
    async (cardId) => {
      if (status !== "pronto") return;
      setSalvando((s) => new Set(s).add(cardId));
      try {
        const agoraFavorita = await toggle(cardId);
        setIds((atual) => (agoraFavorita ? [cardId, ...atual.filter((id) => id !== cardId)] : atual.filter((id) => id !== cardId)));
      } catch (e) {
        setErro(e.message);
        setStatus("erro");
      } finally {
        setSalvando((s) => {
          const novo = new Set(s);
          novo.delete(cardId);
          return novo;
        });
      }
    },
    [status],
  );

  const valor = useMemo(
    () => ({
      ids,
      idsSet: new Set(ids),
      status,
      erro,
      habilitado: status === "pronto",
      salvando,
      alternar,
      recarregar: carregar,
    }),
    [ids, status, erro, salvando, alternar, carregar],
  );

  return createElement(FavoritosContext.Provider, { value: valor }, children);
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos precisa estar dentro do <FavoritosProvider>.");
  return ctx;
}
