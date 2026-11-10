import { useState } from "react";
import "./CardImage.css";

/**
 * <img> da carta com reserva: se a imagem da YGOPRODeck não carregar,
 * aparece uma moldura na cor do tipo com o nome da carta.
 */
const CardImage = ({ card, size = "small", ...rest }) => {
  const [falhou, setFalhou] = useState(false);

  if (falhou) {
    return (
      <div className="card-image card-image--fallback" style={{ "--frame": card.frame.color, "--frame-text": card.frame.text }} role="img" aria-label={card.name}>
        <span>{card.name}</span>
      </div>
    );
  }

  return (
    <img
      className="card-image"
      src={size === "large" ? card.image : card.imageSmall}
      alt={card.name}
      loading="lazy"
      decoding="async"
      width={size === "large" ? 421 : 168}
      height={size === "large" ? 614 : 246}
      onError={() => setFalhou(true)}
      {...rest}
    />
  );
};

export default CardImage;
