import { useId } from "react";
import "./OptionGroup.css";

/**
 * Grupo de opções com <input type="radio"> de verdade (setas do teclado funcionam).
 *
 * <OptionGroup
 *   name="linha" title="Espessura do traço" options={LINE_WEIGHTS}
 *   value="fina" onChange={(id) => ...}
 *   renderVisual={(opcao) => <svg .../>}   // desenho opcional acima do nome
 *   renderHint={(opcao) => "texto menor"}  // linha opcional abaixo do nome
 * />
 */
function OptionGroup({ name, title, hint, options, value, onChange, renderVisual, renderHint, columns }) {
  const tituloId = useId();

  return (
    <div className="option-group">
      <h3 className="field-title" id={tituloId}>
        {title}
      </h3>
      {hint && <p className="field-hint">{hint}</p>}

      <div
        className="option-row"
        role="radiogroup"
        aria-labelledby={tituloId}
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {options.map((opcao) => {
          const ativo = opcao.id === value;
          return (
            <label key={opcao.id} className={`option${ativo ? " is-selected" : ""}`}>
              <input
                type="radio"
                name={name}
                value={opcao.id}
                checked={ativo}
                onChange={() => onChange(opcao.id)}
                className="sr-only"
              />
              {renderVisual && <span className="option-visual">{renderVisual(opcao)}</span>}
              <span className="option-name">{opcao.nome}</span>
              {renderHint && <span className="option-hint">{renderHint(opcao)}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default OptionGroup;
