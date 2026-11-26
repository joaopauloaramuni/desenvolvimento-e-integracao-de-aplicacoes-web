import { useId } from "react";
import { FiAlertCircle } from "react-icons/fi";
import "./Campo.css";

/**
 * Campos de formulário acessíveis (Aula 17 - formulários).
 *
 * - <label> SEMPRE visível e ACIMA do campo (Aula 18). Placeholder não é rótulo.
 * - Dica (hint) e erro ligados ao campo por aria-describedby.
 * - aria-invalid quando há erro; o erro tem ícone + texto (não só cor vermelha).
 * - Obrigatório marcado com * e com o atributo required.
 * - Contador de caracteres para campos com limite.
 */
function Moldura({ id, rotulo, dica, erro, obrigatorio, limite, tamanhoAtual, children }) {
  const idDica = dica ? `${id}-dica` : undefined;
  const idErro = erro ? `${id}-erro` : undefined;
  const idContador = limite ? `${id}-contador` : undefined;
  const perto = limite && tamanhoAtual >= limite * 0.9;

  return (
    <div className={`campo ${erro ? "campo-com-erro" : ""}`}>
      <label htmlFor={id} className="campo-rotulo">
        {rotulo}
        {obrigatorio && (
          <span className="campo-obrigatorio" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>

      {dica && (
        <p id={idDica} className="campo-dica">
          {dica}
        </p>
      )}

      {children({ describedBy: [idDica, idErro, idContador].filter(Boolean).join(" ") || undefined })}

      <div className="campo-rodape">
        {erro ? (
          <p id={idErro} className="campo-erro">
            <FiAlertCircle aria-hidden="true" />
            <span>
              <span className="sr-only">Erro: </span>
              {erro}
            </span>
          </p>
        ) : (
          <span />
        )}

        {limite && (
          <p id={idContador} className={`campo-contador ${perto ? "campo-contador-alerta" : ""}`}>
            {tamanhoAtual}/{limite}
            <span className="sr-only"> caracteres</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function CampoTexto({ rotulo, dica, erro, obrigatorio, limite, value = "", ...props }) {
  const id = useId();
  return (
    <Moldura id={id} rotulo={rotulo} dica={dica} erro={erro} obrigatorio={obrigatorio} limite={limite} tamanhoAtual={value.length}>
      {({ describedBy }) => (
        <input
          id={id}
          className="campo-controle"
          value={value}
          required={obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={describedBy}
          maxLength={limite}
          {...props}
        />
      )}
    </Moldura>
  );
}

export function CampoAreaTexto({ rotulo, dica, erro, obrigatorio, limite, value = "", ...props }) {
  const id = useId();
  return (
    <Moldura id={id} rotulo={rotulo} dica={dica} erro={erro} obrigatorio={obrigatorio} limite={limite} tamanhoAtual={value.length}>
      {({ describedBy }) => (
        <textarea
          id={id}
          className="campo-controle campo-area"
          value={value}
          rows={4}
          required={obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={describedBy}
          maxLength={limite}
          {...props}
        />
      )}
    </Moldura>
  );
}

export function CampoSelecao({ rotulo, dica, erro, obrigatorio, opcoes, textoVazio = "Selecione", ...props }) {
  const id = useId();
  return (
    <Moldura id={id} rotulo={rotulo} dica={dica} erro={erro} obrigatorio={obrigatorio}>
      {({ describedBy }) => (
        <select
          id={id}
          className="campo-controle campo-select"
          required={obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        >
          <option value="">{textoVazio}</option>
          {opcoes.map((o) => {
            const valor = typeof o === "string" ? o : o.valor;
            const texto = typeof o === "string" ? o : o.texto;
            return (
              <option key={valor} value={valor}>
                {texto}
              </option>
            );
          })}
        </select>
      )}
    </Moldura>
  );
}

// Legenda padrão dos formulários
export function LegendaObrigatorio() {
  return (
    <p className="campo-legenda">
      Campos marcados com <span aria-hidden="true" className="campo-obrigatorio">*</span>
      <span className="sr-only">asterisco</span> são obrigatórios.
    </p>
  );
}
