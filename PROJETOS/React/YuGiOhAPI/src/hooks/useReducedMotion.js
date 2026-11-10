import { useEffect, useState } from "react";

/** true quando o sistema pede "reduzir movimento": a fumaça da home não é desenhada. */
export function useReducedMotion() {
  const consulta = "(prefers-reduced-motion: reduce)";
  const [reduzir, setReduzir] = useState(() => window.matchMedia?.(consulta).matches ?? false);

  useEffect(() => {
    const mq = window.matchMedia?.(consulta);
    if (!mq) return undefined;
    const aoMudar = (e) => setReduzir(e.matches);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, []);

  return reduzir;
}
