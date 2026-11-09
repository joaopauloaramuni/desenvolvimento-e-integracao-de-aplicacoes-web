import { useState } from "react";
import "./TrainerAvatar.css";

export function iniciais(nome) {
  return nome
    .replace(/[^A-Za-zÀ-ÿ ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Imagem do treinador (sprite do Pokémon Showdown) dentro de uma \"janelinha\".
 * Tenta cada URL de treinador.sprites em ordem; se nenhuma carregar
 * (sem internet, arquivo inexistente), mostra as iniciais, como antes.
 *
 * size: "lg" no card do treinador, "sm" nos botões dos detalhes.
 */
export default function TrainerAvatar({ treinador, size = "lg" }) {
  const urls = treinador.sprites ?? [];
  // Guarda as URLs que já falharam (o React reaproveita o componente entre treinadores).
  const [falhas, setFalhas] = useState(() => new Set());
  const atual = urls.find((url) => !falhas.has(url));

  return (
    <span className={`trainer-avatar trainer-avatar--${size}`} aria-hidden="true">
      {atual ? (
        <img
          key={atual}
          className="trainer-avatar__img is-pixelated"
          src={atual}
          alt=""
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={() => setFalhas((anterior) => new Set(anterior).add(atual))}
        />
      ) : (
        <span className="trainer-avatar__monogram">{iniciais(treinador.name)}</span>
      )}
    </span>
  );
}
