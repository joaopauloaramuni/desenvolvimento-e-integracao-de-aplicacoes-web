import { useCallback } from "react";
import { buscarEstatisticas, calcularEstatisticas } from "../services/estatisticaService";
import useCarregar from "./useCarregar";

const VAZIO = calcularEstatisticas([], []);

/**
 * Placar e números do dashboard no período escolhido.
 * Espera os jogadores carregarem (precisa do nome e da cor de cada um).
 */
export default function useEstatisticas(periodo, jogadores, jogadoresCarregando) {
  const { tipo, mes, ano, inicio, fim } = periodo;

  const buscar = useCallback(async () => {
    if (jogadoresCarregando) return VAZIO;
    return buscarEstatisticas({ tipo, mes, ano, inicio, fim }, jogadores);
  }, [tipo, mes, ano, inicio, fim, jogadores, jogadoresCarregando]);

  const { dados, carregando, erro, recarregar } = useCarregar(buscar, VAZIO);
  return { estatisticas: dados, carregando: carregando || jogadoresCarregando, erro, recarregar };
}
