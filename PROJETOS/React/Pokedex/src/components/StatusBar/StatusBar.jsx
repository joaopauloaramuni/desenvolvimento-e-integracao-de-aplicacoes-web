import Icon from "../Icon/Icon";
import "./StatusBar.css";

const MENSAGENS = {
  off: "Favoritos desativados. Configure o Supabase no .env.local.",
  loading: "Carregando favoritos do Supabase...",
  saving: "Salvando favorito no Supabase...",
  ok: "Favoritos salvos no Supabase",
};

/** Barra de status no rodapé da tela: situação dos favoritos e quantos existem. */
export default function StatusBar({ status, erro, totalFavoritos }) {
  const mensagem = status === "error" ? erro : MENSAGENS[status];

  return (
    <div className="status-bar" data-status={status}>
      <span className="status-bar__dot" aria-hidden="true" />
      <p className="status-bar__message" role="status" aria-live="polite">
        {mensagem}
      </p>
      <span className="status-bar__count" title="Favoritos">
        <Icon name="star" filled size={14} />
        <span className="visually-hidden">Favoritos: </span>
        {totalFavoritos}
      </span>
    </div>
  );
}
