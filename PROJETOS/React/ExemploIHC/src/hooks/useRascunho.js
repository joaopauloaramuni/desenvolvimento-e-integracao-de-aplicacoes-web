import { useEffect, useState } from "react";
import { lerJSON, remover, salvarJSON } from "../utils/storage";

/**
 * Estado de formulário salvo automaticamente no navegador.
 *
 * Se a conexão cair, a aba fechar ou o celular travar no meio do
 * preenchimento, o usuário não perde o que já digitou (Aula 18:
 * "reter os dados em caso de falha na conexão").
 */
export default function useRascunho(chave, inicial) {
  const [valor, setValor] = useState(() => ({ ...inicial, ...lerJSON(chave, {}) }));

  useEffect(() => {
    salvarJSON(chave, valor);
  }, [chave, valor]);

  const descartar = () => {
    remover(chave);
    setValor(inicial);
  };

  return [valor, setValor, descartar];
}
