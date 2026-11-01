import { LuKeyRound, LuLoaderCircle, LuMinus, LuPenLine, LuPlus, LuSquare } from "react-icons/lu";
import APP_CONFIG from "../../config/appConfig";
import { PROVIDER, providerPronto } from "../../config/providerConfig";
import {
  DETAIL_LEVELS,
  FINISHES,
  FORMATS,
  IDEA_SUGGESTIONS,
  LINE_WEIGHTS,
} from "../../config/tattooOptions";
import OptionGroup from "../OptionGroup/OptionGroup";
import StyleSelector from "../StyleSelector/StyleSelector";
import "./TattooForm.css";

/* Desenhos das opções */

const LineSwatch = ({ espessura }) => (
  <svg width="64" height="26" viewBox="0 0 64 26" aria-hidden="true">
    <path
      d="M4 18 C16 4 28 4 32 13 C36 22 48 22 60 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={espessura}
      strokeLinecap="round"
    />
  </svg>
);

const FinishSwatch = ({ id }) => (
  <svg width="56" height="26" viewBox="0 0 56 26" aria-hidden="true">
    {id === "linhas" && <circle cx="28" cy="13" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />}
    {id === "preto" && (
      <>
        <defs>
          <linearGradient id="sw-preto" x1="0" x2="1">
            <stop offset="0" stopColor="#d9d6de" />
            <stop offset="1" stopColor="#1b1622" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="13" r="10" fill="url(#sw-preto)" stroke="currentColor" strokeWidth="1.8" />
      </>
    )}
    {id === "colorido" && (
      <>
        <circle cx="20" cy="13" r="8" fill="#c8322b" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="13" r="8" fill="#e8b33a" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="40" cy="13" r="8" fill="#2c7a73" stroke="currentColor" strokeWidth="1.5" />
      </>
    )}
  </svg>
);

const FormatSwatch = ({ w, h }) => {
  const escala = 26 / Math.max(w, h);
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true">
      <rect
        x={(34 - w * escala) / 2}
        y={(30 - h * escala) / 2}
        width={w * escala}
        height={h * escala}
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="3 2.5"
      />
    </svg>
  );
};

/**
 * Formulário do estúdio: ideia, estilo, traço, acabamento, detalhe, formato
 * e quantidade de variações. O estado fica no App (os exemplos também mexem nele).
 */
function TattooForm({ settings, onChange, onSubmit, onStop, gerando, ideaRef }) {
  const semChave = !providerPronto();
  const ideiaVazia = settings.ideia.trim().length === 0;
  const atualizar = (campo) => (valor) => onChange({ [campo]: valor });

  const escolherEstilo = (estilo) =>
    onChange({ estilo: estilo.id, linha: estilo.sugestao.linha, acabamento: estilo.sugestao.acabamento });

  const enviar = (evento) => {
    evento.preventDefault();
    if (!ideiaVazia && !gerando && !semChave) onSubmit();
  };

  // Ctrl+Enter (ou Cmd+Enter) dentro da ideia também gera
  const atalho = (evento) => {
    if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) enviar(evento);
  };

  const { variacoes } = settings;

  const textoBotao = variacoes > 1 ? `Gerar ${variacoes} variações` : "Gerar tatuagem";

  return (
    <form className="tattoo-form" onSubmit={enviar} noValidate>
      {semChave && (
        <div className="form-message warning" role="status">
          <LuKeyRound aria-hidden="true" />
          <span>
            Falta a chave do {PROVIDER.nome}. Cole a sua em <code>{PROVIDER.variavelChave}</code> no{" "}
            <code>.env.local</code> e reinicie o <code>npm run dev</code>. O passo a passo está no README.
          </span>
        </div>
      )}

      {/* =====================================================
          IDEIA
          ===================================================== */}
      <div className="idea-field">
        <div className="field-head">
          <label className="field-title" htmlFor="ideia">
            Sua ideia
          </label>
          <span className="field-counter" aria-live="polite">
            {settings.ideia.length}/{APP_CONFIG.MAX_IDEA}
          </span>
        </div>

        <textarea
          id="ideia"
          ref={ideaRef}
          className="idea-input"
          rows={3}
          maxLength={APP_CONFIG.MAX_IDEA}
          placeholder="Ex.: uma raposa dormindo enrolada em galhos de café"
          value={settings.ideia}
          onChange={(evento) => onChange({ ideia: evento.target.value })}
          onKeyDown={atalho}
        />

        <div className="idea-suggestions" aria-label="Ideias prontas">
          {IDEA_SUGGESTIONS.map((ideia) => (
            <button key={ideia} type="button" className="chip chip-soft" onClick={() => onChange({ ideia })}>
              {ideia}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          ESTILO
          ===================================================== */}
      <StyleSelector value={settings.estilo} onChange={escolherEstilo} />

      {/* =====================================================
          TRAÇO E ACABAMENTO
          ===================================================== */}
      <div className="form-pair">
        <OptionGroup
          name="linha"
          title="Espessura do traço"
          options={LINE_WEIGHTS}
          value={settings.linha}
          onChange={atualizar("linha")}
          renderVisual={(opcao) => <LineSwatch espessura={opcao.espessura} />}
        />

        <OptionGroup
          name="acabamento"
          title="Acabamento"
          options={FINISHES}
          value={settings.acabamento}
          onChange={atualizar("acabamento")}
          renderVisual={(opcao) => <FinishSwatch id={opcao.id} />}
        />
      </div>

      <OptionGroup
        name="formato"
        title="Formato e local do corpo"
        options={FORMATS}
        value={settings.formato}
        onChange={atualizar("formato")}
        renderVisual={(opcao) => <FormatSwatch w={opcao.w} h={opcao.h} />}
        renderHint={(opcao) => opcao.locais}
      />

      <div className="form-pair form-pair-end">
        <OptionGroup
          name="detalhe"
          title="Nível de detalhe"
          options={DETAIL_LEVELS}
          value={settings.detalhe}
          onChange={atualizar("detalhe")}
        />

        {/* Variações */}
        <div className="option-group">
          <h3 className="field-title" id="variacoes-titulo">
            Variações
          </h3>
          <div className="stepper" role="group" aria-labelledby="variacoes-titulo">
            <button
              type="button"
              className="btn-icon"
              onClick={() => onChange({ variacoes: Math.max(APP_CONFIG.MIN_VARIATIONS, variacoes - 1) })}
              disabled={variacoes <= APP_CONFIG.MIN_VARIATIONS}
              aria-label="Menos variações"
            >
              <LuMinus />
            </button>
            <output aria-live="polite">{variacoes}</output>
            <button
              type="button"
              className="btn-icon"
              onClick={() => onChange({ variacoes: Math.min(APP_CONFIG.MAX_VARIATIONS, variacoes + 1) })}
              disabled={variacoes >= APP_CONFIG.MAX_VARIATIONS}
              aria-label="Mais variações"
            >
              <LuPlus />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          GERAR
          ===================================================== */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={ideiaVazia || gerando || semChave}
        >
          {gerando ? (
            <>
              <LuLoaderCircle className="spin" aria-hidden="true" /> Desenhando…
            </>
          ) : (
            <>
              <LuPenLine aria-hidden="true" /> {textoBotao}
            </>
          )}
        </button>

        {gerando && (
          <button type="button" className="btn btn-lg" onClick={onStop}>
            <LuSquare aria-hidden="true" /> Parar
          </button>
        )}
      </div>

      <p className="form-footnote">
        {ideiaVazia
          ? "Escreva a ideia para liberar o botão."
          : `Cada variação é uma imagem cobrada pela ${PROVIDER.empresa} (${PROVIDER.nome}). Atalho: Ctrl + Enter.`}
      </p>
    </form>
  );
}

export default TattooForm;
