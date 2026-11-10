import { useEffect, useState } from "react";

/** Devolve o valor só depois de "atraso" ms sem mudanças (evita uma requisição por tecla). */
export function useDebounce(valor, atraso = 400) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(t);
  }, [valor, atraso]);
  return atrasado;
}
