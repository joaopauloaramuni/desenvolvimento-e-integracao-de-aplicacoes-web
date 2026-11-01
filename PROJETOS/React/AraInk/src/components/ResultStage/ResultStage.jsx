import { useState } from "react";
import { LuCheck, LuCopy, LuEraser, LuTriangleAlert } from "react-icons/lu";
import {
  DETAIL_LEVELS,
  FINISHES,
  FORMATS,
  LINE_WEIGHTS,
  STYLES,
  findById,
} from "../../config/tattooOptions";
import { PROVIDER, PROVIDERS } from "../../config/providerConfig";
import { copiarTexto } from "../../utils/download";
import { heartPath } from "../StyleSelector/StyleArt";
import ResultCard from "./ResultCard";
import "./ResultStage.css";

const CONTORNO_VAZIO = heartPath(0.92, 50, 48, 120);

/**
 * A "bancada": onde as variações aparecem.
 * Mostra o resumo das escolhas, o prompt enviado e um cartão por variação.
 */
function ResultStage({ cards, sessao, erro, estaGuardado, onGuardar, onRefinar, onDesfazer, onLimpar }) {
  const [copiado, setCopiado] = useState(false);

  const copiarPrompt = async () => {
    if (await copiarTexto(sessao.prompt)) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    }
  };

  const resumo = sessao
    ? [
        findById(STYLES, sessao.settings.estilo).nome,
        `Linha ${findById(LINE_WEIGHTS, sessao.settings.linha).nome.toLowerCase()}`,
        findById(FINISHES, sessao.settings.acabamento).nome,
        findById(DETAIL_LEVELS, sessao.settings.detalhe).nome,
        findById(FORMATS, sessao.settings.formato).nome,
      ]
    : [];

  return (
    <section className="stage" aria-labelledby="bancada-titulo">
      <div className="stage-head">
        <h2 className="section-title" id="bancada-titulo">
          Bancada
          <span className="provider-badge" title={`Modelo ${PROVIDER.modelo}. Troque o provedor em VITE_IMAGE_PROVIDER no .env.local`}>
            {PROVIDER.nome}
            {PROVIDER.detalhe && `, ${PROVIDER.detalhe}`}
          </span>
        </h2>
        {cards.length > 0 && (
          <button type="button" className="btn btn-sm" onClick={onLimpar}>
            <LuEraser aria-hidden="true" /> Limpar
          </button>
        )}
      </div>

      {erro && (
        <div className="form-message error" role="alert">
          <LuTriangleAlert aria-hidden="true" />
          <span>{erro}</span>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="stage-empty">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path d={CONTORNO_VAZIO} />
          </svg>
          <p className="stage-empty-title">Sua tatuagem aparece aqui</p>
          <p>
            Descreva a ideia, escolha o estilo e clique em <strong>Gerar tatuagem</strong>. Cada variação leva
            alguns segundos.
          </p>
        </div>
      ) : (
        <>
          <div className="stage-summary">
            <p className="stage-idea">“{sessao.settings.ideia.trim()}”</p>
            <ul className="stage-tags" aria-label="Escolhas usadas">
              {resumo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={`stage-grid${cards.length > 1 ? " is-multi" : ""}`}>
            {cards.map((card) => (
              <ResultCard
                key={card.id}
                card={card}
                total={cards.length}
                sessao={sessao}
                guardado={card.versoes.length > 0 && estaGuardado(card.versoes.at(-1).id)}
                onGuardar={onGuardar}
                onRefinar={onRefinar}
                onDesfazer={onDesfazer}
              />
            ))}
          </div>

          <details className="stage-prompt">
            <summary>Ver o prompt enviado ao {(PROVIDERS[sessao.provedor] ?? PROVIDER).nome}</summary>
            <pre>{sessao.prompt}</pre>
            <button type="button" className={`btn btn-sm${copiado ? " is-copied" : ""}`} onClick={copiarPrompt}>
              {copiado ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
              {copiado ? "Copiado" : "Copiar prompt"}
            </button>
          </details>
        </>
      )}
    </section>
  );
}

export default ResultStage;
