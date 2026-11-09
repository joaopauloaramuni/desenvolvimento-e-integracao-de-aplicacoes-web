import { useState } from "react";
import semImagem from "../../assets/images/sem-imagem.svg";

/**
 * Imagem do Pokémon (PokéAPI). Se a imagem não carregar (sem internet, URL fora do ar),
 * mostra a imagem local sem-imagem.svg: a Pokédex continua funcionando só com o JSON.
 */
export default function PokemonImage({
  src,
  alt,
  className = "",
  pixelated = false,
  eager = false,
  size,
}) {
  const [srcComErro, setSrcComErro] = useState(null);
  const falhou = srcComErro === src;

  return (
    <img
      className={`${className} ${pixelated && !falhou ? "is-pixelated" : ""}`.trim()}
      src={falhou ? semImagem : src}
      alt={alt}
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      onError={() => {
        if (!falhou) setSrcComErro(src);
      }}
    />
  );
}
