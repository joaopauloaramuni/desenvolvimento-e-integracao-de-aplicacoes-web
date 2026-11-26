import { useEffect, useId, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "../Button/Button";
import "./DialogoConfirmacao.css";

/**
 * Diálogo de confirmação para ações destrutivas (Nielsen #5 - prevenção de erros).
 *
 * Usa o elemento nativo <dialog> com showModal(), que já entrega de graça:
 *  - foco preso dentro do diálogo;
 *  - fechar com a tecla Esc;
 *  - fundo inerte para leitores de tela.
 *
 * O foco começa no botão SEGURO (Cancelar), nunca no destrutivo.
 * O botão destrutivo diz exatamente o que acontece ("Rejeitar reserva"),
 * e não um genérico "OK" / "Sim".
 */
export default function DialogoConfirmacao({
  aberto,
  titulo,
  children,
  rotuloConfirmar,
  rotuloCancelar = "Cancelar",
  perigo = true,
  onConfirmar,
  onCancelar,
}) {
  const ref = useRef(null);
  const cancelarRef = useRef(null);
  const idTitulo = useId();
  const idDescricao = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) {
      dialogo.showModal();
      cancelarRef.current?.focus();
    } else if (!aberto && dialogo.open) {
      dialogo.close();
    }
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="dialogo"
      aria-labelledby={idTitulo}
      aria-describedby={idDescricao}
      onCancel={(e) => {
        e.preventDefault();
        onCancelar();
      }}
      onClick={(e) => {
        // clique no fundo escuro fecha (equivale a Cancelar)
        if (e.target === ref.current) onCancelar();
      }}
    >
      <div className="dialogo-conteudo">
        {perigo && <FiAlertTriangle className="dialogo-icone" aria-hidden="true" />}
        <h2 id={idTitulo} className="dialogo-titulo">
          {titulo}
        </h2>
        <div id={idDescricao} className="dialogo-texto">
          {children}
        </div>

        <div className="dialogo-acoes">
          <button ref={cancelarRef} type="button" className="btn btn-secundario btn-md" onClick={onCancelar}>
            {rotuloCancelar}
          </button>
          <Button variante={perigo ? "perigo-cheio" : "primario"} onClick={onConfirmar}>
            {rotuloConfirmar}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
