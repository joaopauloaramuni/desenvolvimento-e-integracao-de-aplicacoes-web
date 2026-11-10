import { useTranslation } from "react-i18next";
import { useFavoritos } from "../../hooks/useFavoritos";
import Icon from "../Icon/Icon";
import "./FavoriteButton.css";

/**
 * Estrela de favorito. Fica DESABILITADA quando o Supabase não está configurado,
 * quando a conexão falhou ou enquanto a carta está sendo salva.
 */
const FavoriteButton = ({ card, variant = "icon" }) => {
  const { t } = useTranslation();
  const { idsSet, habilitado, status, salvando, alternar } = useFavoritos();
  const favorita = idsSet.has(card.id);
  const ocupado = salvando.has(card.id);
  const desabilitado = !habilitado || ocupado;

  const rotulo = !habilitado
    ? t(`favButton.${status}`)
    : favorita
      ? t("favButton.remove", { name: card.name })
      : t("favButton.add", { name: card.name });

  return (
    <button
      type="button"
      className={`fav fav--${variant}${favorita ? " fav--on" : ""}${ocupado ? " fav--busy" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alternar(card.id);
      }}
      disabled={desabilitado}
      aria-pressed={favorita}
      aria-label={rotulo}
      title={rotulo}
    >
      <Icon name="star" filled={favorita} size={variant === "icon" ? 20 : 18} />
      {variant === "full" && <span>{favorita ? t("favButton.on") : t("favButton.off")}</span>}
    </button>
  );
};

export default FavoriteButton;
