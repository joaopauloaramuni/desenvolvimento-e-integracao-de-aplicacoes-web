import { useState } from "react";
import {
  LuBookmark,
  LuBookmarkCheck,
  LuDownload,
  LuTriangleAlert,
  LuUndo2,
  LuWandSparkles,
  LuX,
} from "react-icons/lu";
import APP_CONFIG from "../../config/appConfig";
import { FORMATS, STYLES, findById } from "../../config/tattooOptions";
import { baixarImagem, rotuloBaixar } from "../../utils/download";
import NeedleLoader from "../NeedleLoader/NeedleLoader";

const AJUSTES_PRONTOS = ["Linhas mais finas", "Sem sombreamento", "Mais detalhes", "Mais simples", "Mais simétrico"];

/** Uma variação na bancada: imagem, baixar, guardar e ajustar. */
function ResultCard({ card, total, sessao, guardado, onGuardar, onRefinar, onDesfazer }) {
  const [ajustando, setAjustando] = useState(false);
  const [instrucao, setInstrucao] = useState("");

  const { settings } = sessao;
  const estilo = findById(STYLES, settings.estilo);
  const formato = findById(FORMATS, settings.formato);
  const versao = card.versoes.at(-1);
  const ajustes = card.versoes.length - 1;

  const enviarAjuste = async (texto) => {
    const pedido = (texto ?? instrucao).trim();
    if (!pedido || card.refinando) return;
    setInstrucao(pedido);
    const ok = await onRefinar(card.id, pedido);
    if (ok) setInstrucao("");
  };

  const guardar = () =>
    onGuardar({
      id: versao.id,
      criadoEm: Date.now(),
      src: versao.src,
      prompt: versao.prompt,
      ...settings,
    });

  return (
    <article className={`result-card is-${card.status}`}>
      <div className="result-paper" style={{ aspectRatio: `${formato.w} / ${formato.h}` }}>
        {card.status === "loading" && (
          <NeedleLoader
            texto={
              card.naFila
                  ? `Na fila: variação ${card.numero} de ${total}`
                  : `Desenhando variação ${card.numero} de ${total}`
            }
          />
        )}

        {card.status === "error" && (
          <div className="result-error" role="alert">
            <LuTriangleAlert aria-hidden="true" />
            <p>{card.erro}</p>
          </div>
        )}

        {versao && (
          <img
            src={versao.src}
            alt={`Tatuagem gerada: ${settings.ideia}, estilo ${estilo.nome}`}
            className="result-image"
          />
        )}

        {card.refinando && (
          <div className="result-overlay">
            <NeedleLoader
              texto="Ajustando o desenho"
            />
          </div>
        )}
      </div>

      {card.status === "done" && (
        <>
          <div className="result-bar">
            <span className="result-tag">
              Variação {card.numero}
              {ajustes > 0 && <em>, {ajustes === 1 ? "1 ajuste" : `${ajustes} ajustes`}</em>}
            </span>

            <div className="result-actions">
              <button
                type="button"
                className="btn-icon"
                onClick={() => baixarImagem(versao.src, { estilo: estilo.id, ideia: settings.ideia })}
                aria-label={rotuloBaixar(versao.src)}
                title={rotuloBaixar(versao.src)}
              >
                <LuDownload />
              </button>
              <button
                type="button"
                className={`btn-icon${guardado ? " is-saved" : ""}`}
                onClick={guardar}
                disabled={guardado}
                aria-label={guardado ? "Guardada na coleção" : "Guardar na coleção"}
                title={guardado ? "Guardada na coleção" : "Guardar na coleção"}
              >
                {guardado ? <LuBookmarkCheck /> : <LuBookmark />}
              </button>
              <button
                type="button"
                className={`btn-icon${ajustando ? " is-active" : ""}`}
                onClick={() => setAjustando((aberto) => !aberto)}
                aria-expanded={ajustando}
                aria-label="Ajustar este desenho"
                title="Ajustar este desenho"
              >
                {ajustando ? <LuX /> : <LuWandSparkles />}
              </button>
            </div>
          </div>

          {ajustando && (
            <div className="refine-panel">
              <div className="refine-chips">
                {AJUSTES_PRONTOS.map((texto) => (
                  <button
                    key={texto}
                    type="button"
                    className="chip chip-soft"
                    onClick={() => enviarAjuste(texto)}
                    disabled={card.refinando}
                  >
                    {texto}
                  </button>
                ))}
              </div>

              <form
                className="refine-form"
                onSubmit={(evento) => {
                  evento.preventDefault();
                  enviarAjuste();
                }}
              >
                <label className="sr-only" htmlFor={`ajuste-${card.id}`}>
                  O que mudar neste desenho?
                </label>
                <input
                  id={`ajuste-${card.id}`}
                  type="text"
                  maxLength={APP_CONFIG.MAX_REFINE}
                  placeholder="O que mudar? Ex.: tire as estrelas"
                  value={instrucao}
                  onChange={(evento) => setInstrucao(evento.target.value)}
                  disabled={card.refinando}
                />
                <button type="submit" className="btn btn-sm btn-primary" disabled={!instrucao.trim() || card.refinando}>
                  Ajustar
                </button>
              </form>

              {card.erroAjuste && <p className="refine-error">{card.erroAjuste}</p>}

              {ajustes > 0 && (
                <button type="button" className="btn btn-sm" onClick={() => onDesfazer(card.id)} disabled={card.refinando}>
                  <LuUndo2 aria-hidden="true" /> Desfazer ajuste
                </button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export default ResultCard;
