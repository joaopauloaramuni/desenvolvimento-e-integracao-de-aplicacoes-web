import { listarPartidas } from "../services/partidaService";
import useCarregar from "./useCarregar";

/** Todas as partidas, da mais nova para a mais antiga. */
export default function usePartidas() {
  const { dados: partidas, carregando, erro, recarregar } = useCarregar(listarPartidas, []);
  return { partidas, carregando, erro, recarregar };
}
