import { useCallback, useMemo, useRef, useState } from "react";
import Toast from "../components/Toast/Toast";
import { DURACAO_TOAST_MS } from "../config/appConfig";
import { ToastContext } from "./toastContext";

/**
 * Guarda a fila de avisos e os mostra numa região aria-live.
 *
 * - aria-live="polite": o leitor de tela anuncia o aviso sem interromper.
 * - O aviso some sozinho, mas o tempo PAUSA com o mouse em cima ou com
 *   foco dentro dele (WCAG 2.2.1 - tempo suficiente).
 * - Avisos com ação ("Desfazer") dão controle e liberdade (Nielsen #3).
 */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const proximoId = useRef(1);

  const fecharToast = useCallback((id) => {
    setToasts((lista) => lista.filter((t) => t.id !== id));
  }, []);

  const mostrarToast = useCallback(({ tipo = "info", mensagem, acao, duracao = DURACAO_TOAST_MS }) => {
    const id = proximoId.current++;
    // No máximo 3 avisos ao mesmo tempo: evita poluir a tela
    setToasts((lista) => [...lista.slice(-2), { id, tipo, mensagem, acao, duracao }]);
    return id;
  }, []);

  const valor = useMemo(() => ({ mostrarToast, fecharToast }), [mostrarToast, fecharToast]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toast-regiao no-print" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onFechar={() => fecharToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
