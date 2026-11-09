import { useEffect, useState } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

/** true quando o sistema pede "reduzir movimento": as animações dos Pokémon ficam paradas. */
export default function useReducedMotion() {
  const [reduzido, setReduzido] = useState(() => window.matchMedia(CONSULTA).matches);

  useEffect(() => {
    const mq = window.matchMedia(CONSULTA);
    const aoMudar = () => setReduzido(mq.matches);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, []);

  return reduzido;
}
