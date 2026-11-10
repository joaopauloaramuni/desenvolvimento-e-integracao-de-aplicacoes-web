import { useCallback, useEffect, useState } from "react";

/**
 * Executa uma função assíncrona sempre que as dependências mudam.
 * Ignora respostas antigas (se o usuário digitar rápido, só vale a última busca).
 */
export function useAsync(funcao, deps) {
  const [estado, setEstado] = useState({ data: null, error: null, loading: true });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    setEstado((s) => ({ data: s.data, error: null, loading: true }));
    funcao()
      .then((data) => ativo && setEstado({ data, error: null, loading: false }))
      .catch((error) => ativo && setEstado({ data: null, error, loading: false }));
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tentativa]);

  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), []);
  return { ...estado, tentarDeNovo };
}
