import { useEffect } from "react";

/**
 * Prevenção de erros (Nielsen #5): se o formulário tem alterações não
 * salvas, o navegador pergunta antes de fechar ou recarregar a aba.
 */
export default function useAvisoAoSair(ativo) {
  useEffect(() => {
    if (!ativo) return undefined;
    const aoSair = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", aoSair);
    return () => window.removeEventListener("beforeunload", aoSair);
  }, [ativo]);
}
