import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

/**
 * Hook para mostrar avisos (feedback das ações).
 *
 *   const { mostrarToast } = useToast();
 *   mostrarToast({ tipo: "sucesso", mensagem: "Recurso cadastrado." });
 *   mostrarToast({ tipo: "info", mensagem: "Reserva rejeitada.", acao: { rotulo: "Desfazer", onClick } });
 */
export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return contexto;
}
