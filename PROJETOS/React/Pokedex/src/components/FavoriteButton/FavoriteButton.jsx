import Icon from "../Icon/Icon";
import "./FavoriteButton.css";

/** Estrela de favorito. Fica desativada sem Supabase e enquanto o banco responde. */
export default function FavoriteButton({
  pokemon,
  isFavorite,
  isSaving,
  enabled,
  onToggle,
  className = "",
}) {
  const dica = !enabled
    ? "Configure o Supabase para usar os favoritos"
    : isFavorite
      ? "Remover dos favoritos"
      : "Adicionar aos favoritos";

  return (
    <button
      type="button"
      className={`favorite-button ${className}`.trim()}
      aria-pressed={isFavorite}
      aria-label={`Favorito: ${pokemon.name}`}
      title={dica}
      disabled={!enabled || isSaving}
      data-saving={isSaving || undefined}
      onClick={() => onToggle(pokemon.id)}
    >
      <Icon name="star" filled={isFavorite} size={22} />
    </button>
  );
}
