import { useCallback, useEffect, useState } from "react";
import { SKINS, STORAGE_KEYS } from "../config/appConfig";
import { aplicarAparencia } from "../utils/aparencia";
import { gravarStorage } from "../utils/storage";

const IDS = SKINS.map((s) => s.id);

/**
 * Tema do aparelho: "classico" (carcaça em CSS) ou "holo" (fundo holo-fundo.webp).
 * Funciona como o useTheme: o index.html aplica a escolha salva antes do React
 * carregar, e o botão "Tema" alterna e salva no localStorage (pokedex:skin).
 */
export default function useSkin() {
  const [skin, setSkin] = useState(() => {
    const atual = document.documentElement.dataset.skin;
    return IDS.includes(atual) ? atual : IDS[0];
  });

  useEffect(() => {
    aplicarAparencia({ skin });
  }, [skin]);

  const toggleSkin = useCallback(() => {
    const proximo = IDS[(IDS.indexOf(skin) + 1) % IDS.length];
    gravarStorage(STORAGE_KEYS.skin, proximo);
    setSkin(proximo);
  }, [skin]);

  const skinLabel = SKINS.find((s) => s.id === skin)?.label ?? skin;
  const proximoLabel = SKINS[(IDS.indexOf(skin) + 1) % IDS.length].label;

  return { skin, skinLabel, proximoLabel, toggleSkin };
}
