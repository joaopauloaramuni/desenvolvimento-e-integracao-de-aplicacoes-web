import { useEffect, useState } from "react";
import { agoraEmBH } from "../core/horarios";

/** Hora de agora em BH, atualizada a cada 30 s (para "próximo ônibus em X min"). */
export default function useAgora() {
  const [agora, setAgora] = useState(() => agoraEmBH());
  useEffect(() => {
    const id = setInterval(() => setAgora(agoraEmBH()), 30_000);
    return () => clearInterval(id);
  }, []);
  return agora;
}
