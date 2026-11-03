import { useCallback } from "react";
import { buscarPartida } from "../services/partidaService";
import useCarregar from "./useCarregar";

/** Uma partida com todas as rodadas e pontuações. */
export default function usePartida(id) {
  const buscar = useCallback(() => (id ? buscarPartida(id) : Promise.resolve(null)), [id]);
  const { dados: partida, carregando, erro, recarregar } = useCarregar(buscar, null);
  return { partida, carregando, erro, recarregar };
}
