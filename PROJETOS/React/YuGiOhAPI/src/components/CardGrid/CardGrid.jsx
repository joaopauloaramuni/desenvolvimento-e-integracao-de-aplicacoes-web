import { useTranslation } from "react-i18next";
import CardTile from "../CardTile/CardTile";
import "./CardGrid.css";

/** Grade de cartas. Enquanto carrega, mostra "cartas viradas" no lugar. */
const CardGrid = ({ cards, loading = false, placeholders = 12 }) => {
  const { t } = useTranslation();

  if (loading && !cards?.length) {
    return (
      <ul className="grid" aria-busy="true" aria-label={t("cards.loadingAria")}>
        {Array.from({ length: placeholders }, (_, i) => (
          <li key={i} className="grid__placeholder" />
        ))}
      </ul>
    );
  }

  return (
    <ul className={`grid${loading ? " grid--refreshing" : ""}`} aria-busy={loading}>
      {cards.map((card) => (
        <CardTile key={card.id} card={card} />
      ))}
    </ul>
  );
};

export default CardGrid;
