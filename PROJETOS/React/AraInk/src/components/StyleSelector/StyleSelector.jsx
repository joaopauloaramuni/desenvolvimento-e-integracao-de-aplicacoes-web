import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import {
  FINISHES,
  LINE_WEIGHTS,
  STYLE_FILTERS,
  STYLES,
  findById,
} from "../../config/tattooOptions";
import StyleArt from "./StyleArt";
import "./StyleSelector.css";

/**
 * Seletor de estilos em forma de "folha de flash": 12 técnicas desenhando
 * o mesmo coração, filtros por tipo de acabamento e um painel com os
 * detalhes do estilo escolhido.
 *
 * Os botões são <input type="radio"> de verdade (escondidos), então as
 * setas do teclado trocam de estilo como em qualquer grupo de opções.
 *
 * <StyleSelector value="fineline" onChange={(estilo) => ...} />
 */
function StyleSelector({ value, onChange }) {
  const [filtro, setFiltro] = useState("todos");

  const visiveis = filtro === "todos" ? STYLES : STYLES.filter((estilo) => estilo.categoria === filtro);
  const selecionado = findById(STYLES, value);
  const linhaSugerida = findById(LINE_WEIGHTS, selecionado.sugestao.linha);
  const acabamentoSugerido = findById(FINISHES, selecionado.sugestao.acabamento);
  const escondido = !visiveis.some((estilo) => estilo.id === value);

  return (
    <div className="style-selector">
      <div className="field-head">
        <h3 className="field-title" id="estilo-titulo">
          Estilo
        </h3>

        <div className="style-filters" role="group" aria-label="Filtrar estilos">
          {STYLE_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip"
              aria-pressed={filtro === item.id}
              onClick={() => setFiltro(item.id)}
            >
              {item.nome}
            </button>
          ))}
        </div>
      </div>

      <p className="field-hint">O mesmo coração em cada técnica, para você comparar o traço.</p>

      <div className="style-grid" role="radiogroup" aria-labelledby="estilo-titulo">
        {visiveis.map((estilo) => {
          const ativo = estilo.id === value;
          return (
            <label key={estilo.id} className={`style-tile${ativo ? " is-selected" : ""}`} title={estilo.descricao}>
              <input
                type="radio"
                name="estilo"
                value={estilo.id}
                checked={ativo}
                onChange={() => onChange(estilo)}
                className="sr-only"
              />
              <span className="style-tile-art">
                <StyleArt id={estilo.id} />
              </span>
              <span className="style-tile-name">{estilo.nome}</span>
              {ativo && (
                <span className="style-tile-stamp" aria-hidden="true">
                  <LuCheck />
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Painel do estilo escolhido */}
      <div className="style-detail" aria-live="polite">
        <span className="style-detail-art">
          <StyleArt id={selecionado.id} />
        </span>

        <div className="style-detail-text">
          <h4>
            {selecionado.nome}
            {escondido && <span className="style-detail-hidden"> (fora deste filtro)</span>}
          </h4>
          <p>{selecionado.descricao}</p>
          <dl>
            <div>
              <dt>Bom para</dt>
              <dd>{selecionado.bomPara}</dd>
            </div>
            <div>
              <dt>Traço sugerido</dt>
              <dd>
                linha {linhaSugerida.nome.toLowerCase()}, {acabamentoSugerido.nome.toLowerCase()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default StyleSelector;
