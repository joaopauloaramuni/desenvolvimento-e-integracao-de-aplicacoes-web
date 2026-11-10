import { memo } from "react";
import { Link } from "react-router-dom";
import { useCardLabels } from "../../i18n/useCardLabels";
import { formatarStat } from "../../utils/format";
import CardImage from "../CardImage/CardImage";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import "./CardTile.css";

/** Uma carta na grade: imagem, nome, tipo (na cor da moldura) e ATK/DEF ou tipo de Magia/Armadilha. */
const CardTile = memo(({ card }) => {
  const labels = useCardLabels();

  return (
    <li className="tile" style={{ "--frame": card.frame.color, "--frame-text": card.frame.text }}>
      <Link to={`/cartas/${card.id}`} className="tile__link">
        <div className="tile__art">
          <CardImage card={card} />
        </div>
        <div className="tile__body">
          <h3 className="tile__name">{card.name}</h3>
          <p className="tile__meta">
            <span className="tile__frame" title={labels.frame(card)}>
              {labels.frameShort(card)}
            </span>
            {card.isMonster ? (
              <span className="tile__stats">
                {formatarStat(card.atk)}
                <span aria-hidden="true">/</span>
                {card.isLink ? `LINK-${card.linkval}` : formatarStat(card.def)}
              </span>
            ) : (
              <span className="tile__stats">{labels.race(card)}</span>
            )}
          </p>
        </div>
      </Link>
      <div className="tile__fav">
        <FavoriteButton card={card} />
      </div>
    </li>
  );
});

CardTile.displayName = "CardTile";
export default CardTile;
