import { useCallback, useMemo, useState } from "react";
import { filterPokemon, SORT_OPTIONS, sortPokemon } from "../services/pokedexService";

/**
 * Estado da pesquisa, do filtro por tipo e da ordenação.
 * A lista exibida é um estado DERIVADO (useMemo): ela não fica guardada,
 * é recalculada a partir da lista base sempre que um filtro muda.
 */
export default function usePokedexFilters(listaBase) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState(null);
  const [ordem, setOrdem] = useState({ campo: "id", direcao: "asc" });

  const resultado = useMemo(
    () => sortPokemon(filterPokemon(listaBase, { busca, tipo }), ordem),
    [listaBase, busca, tipo, ordem]
  );

  /** Trocar o campo usa a direção mais natural dele (números/nome: crescente; atributos: decrescente). */
  const ordenarPor = useCallback((campo) => {
    const opcao = SORT_OPTIONS.find((o) => o.value === campo);
    setOrdem({ campo, direcao: opcao?.direcaoPadrao ?? "asc" });
  }, []);

  const inverterDirecao = useCallback(() => {
    setOrdem((atual) => ({ ...atual, direcao: atual.direcao === "asc" ? "desc" : "asc" }));
  }, []);

  /** Clicar no tipo já selecionado tira o filtro. */
  const alternarTipo = useCallback((nome) => {
    setTipo((atual) => (atual === nome ? null : nome));
  }, []);

  const limpar = useCallback(() => {
    setBusca("");
    setTipo(null);
  }, []);

  return {
    busca,
    setBusca,
    tipo,
    setTipo,
    alternarTipo,
    ordem,
    ordenarPor,
    inverterDirecao,
    limpar,
    resultado,
    filtrando: busca.trim() !== "" || tipo !== null,
  };
}
