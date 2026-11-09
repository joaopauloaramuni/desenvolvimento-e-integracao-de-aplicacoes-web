import Icon from "../Icon/Icon";
import "./EmptyState.css";

/** Tela vazia: diz o que aconteceu e oferece o próximo passo. */
export default function EmptyState({ titulo, texto, acao, icone = "signal" }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__glyph" aria-hidden="true">
        <Icon name={icone} size={40} />
      </span>
      <h2 className="empty-state__title">{titulo}</h2>
      {texto && <p className="empty-state__text">{texto}</p>}
      {acao && (
        <button
          type="button"
          className="screen-button screen-button--primary"
          onClick={acao.onClick}
        >
          {acao.label}
        </button>
      )}
    </div>
  );
}
