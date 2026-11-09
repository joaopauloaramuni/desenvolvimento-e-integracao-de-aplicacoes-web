import { useLayoutEffect, useRef, useState } from "react";
import { animationVideoUrl } from "../../config/appConfig";
import animacoes from "../../data/animacoes.json";
import useReducedMotion from "../../hooks/useReducedMotion";
import semImagem from "../../assets/images/sem-imagem.svg";
import "./PokemonArt.css";

const COM_VIDEO = new Set(animacoes);

/** O GIF é pixel art pequena: cresce até 86% da moldura, no máximo 3x, sem borrar. */
const OCUPACAO = 0.86;
const ESCALA_MAX = 3;

/**
 * Arte animada dos detalhes, na ordem:
 * 1. vídeo próprio (Higgsfield) em public/animations/{id}.webm, se o id estiver em animacoes.json;
 * 2. GIF animado do Pokémon Showdown;
 * 3. arte oficial estática;
 * 4. sem-imagem.svg (sem internet).
 * Com "reduzir movimento" ligado no sistema, os passos 1 e 2 são pulados.
 */
export default function PokemonArt({ pokemon, size = 475 }) {
  const reduzido = useReducedMotion();
  const [falhas, setFalhas] = useState({ id: pokemon.id });
  const erros = falhas.id === pokemon.id ? falhas : { id: pokemon.id };
  const falhar = (qual) => setFalhas({ ...erros, [qual]: true });

  const animar = !reduzido;

  if (animar && COM_VIDEO.has(pokemon.id) && !erros.video) {
    return (
      <video
        key={`v${pokemon.id}`}
        className="details__art"
        src={animationVideoUrl(pokemon.id)}
        poster={pokemon.artwork}
        width={size}
        height={size}
        autoPlay
        loop
        muted
        playsInline
        aria-label={`Animação de ${pokemon.name}`}
        onError={() => falhar("video")}
      />
    );
  }

  if (animar && !erros.gif) {
    return (
      <AnimatedGif
        key={`g${pokemon.id}`}
        src={pokemon.animated}
        alt={`Animação de ${pokemon.name}`}
        onError={() => falhar("gif")}
      />
    );
  }

  if (!erros.arte) {
    return (
      <img
        key={`a${pokemon.id}`}
        className="details__art"
        src={pokemon.artwork}
        alt={`Arte de ${pokemon.name}`}
        width={size}
        height={size}
        decoding="async"
        draggable="false"
        onError={() => falhar("arte")}
      />
    );
  }

  return (
    <img
      className="details__art"
      src={semImagem}
      alt={`${pokemon.name} (imagem indisponível)`}
      width={size}
      height={size}
      draggable="false"
    />
  );
}

/**
 * O GIF do Showdown vem no tamanho natural (uns 40 a 100 px). Ele é ampliado com
 * a propriedade CSS "scale" conforme o tamanho da moldura, que muda com a tela.
 */
function AnimatedGif({ src, alt, onError }) {
  const imgRef = useRef(null);
  const [escala, setEscala] = useState(0);

  useLayoutEffect(() => {
    const img = imgRef.current;
    const moldura = img?.parentElement;
    if (!img || !moldura) return undefined;

    const medir = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;
      const s = Math.min(
        ESCALA_MAX,
        (moldura.clientWidth * OCUPACAO) / w,
        (moldura.clientHeight * OCUPACAO) / h
      );
      setEscala(Math.max(1, s));
    };

    medir();
    img.addEventListener("load", medir);
    const observador = new ResizeObserver(medir);
    observador.observe(moldura);
    return () => {
      img.removeEventListener("load", medir);
      observador.disconnect();
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      className="details__anim"
      src={src}
      alt={alt}
      draggable="false"
      style={{ scale: escala || 1, opacity: escala ? 1 : 0 }}
      onError={onError}
    />
  );
}
