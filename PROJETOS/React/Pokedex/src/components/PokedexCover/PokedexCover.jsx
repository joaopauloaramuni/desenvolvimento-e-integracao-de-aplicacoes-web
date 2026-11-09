import { useEffect, useRef, useState } from "react";
import pokedexAberta from "../../assets/images/pokedex-aberta.webp";
import pokedexFechada from "../../assets/images/pokedex-fechada.webp";
import "./PokedexCover.css";

/**
 * Capa da Pokédex: o aparelho "de verdade", fechado e aberto
 * (src/assets/images/pokedex-fechada.webp e pokedex-aberta.webp).
 *
 * - Ao carregar a página, a Pokédex aparece fechada. Um clique (ou Enter) abre a tampa,
 *   a tela mostra "INICIANDO..." e o aparelho com a Pokédex liga.
 * - O botão "Fechar" do aparelho traz a capa de volta: a tampa fecha por cima da
 *   Pokédex aberta. A lista, os filtros e o Pokémon aberto continuam como estavam.
 *
 * A tampa é a própria imagem fechada recortada (clip-path) no retângulo da tampa e
 * girada na dobradiça da direita. As posições foram medidas nas imagens originais
 * (1638 x 2058 px) e estão em porcentagem no CSS.
 *
 * fase: "fechada" -> "abrindo" -> "iniciando" -> onLigar()
 *       "fechando" -> "fechada"
 */
const DURACAO = { abrir: 750, iniciar: 1100, fechar: 650 };

function semMovimento() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function PokedexCover({ inicio = "fechada", onAbrindo, onLigar }) {
  const [fase, setFase] = useState(inicio);
  const botaoRef = useRef(null);

  // Liga a sequência de fases com timers (com movimento reduzido, quase instantâneo).
  useEffect(() => {
    const fator = semMovimento() ? 0.05 : 1;
    let timer;
    if (fase === "abrindo") timer = setTimeout(() => setFase("iniciando"), DURACAO.abrir * fator);
    if (fase === "iniciando") timer = setTimeout(() => onLigar(), DURACAO.iniciar * fator);
    if (fase === "fechando") timer = setTimeout(() => setFase("fechada"), DURACAO.fechar * fator);
    return () => clearTimeout(timer);
  }, [fase, onLigar]);

  useEffect(() => {
    if (fase === "fechada") botaoRef.current?.focus({ preventScroll: true });
  }, [fase]);

  const fechada = fase === "fechada";

  function abrir() {
    if (!fechada) return;
    setFase("abrindo");
    // Avisa o App: o aparelho volta a ficar visível por baixo da tampa.
    onAbrindo?.();
  }

  const legenda = {
    fechada: "Toque na Pokédex para abrir",
    abrindo: "Abrindo...",
    iniciando: "Iniciando a Pokédex...",
    fechando: "Fechando...",
  }[fase];

  return (
    <div className="cover" data-fase={fase}>
      <button
        ref={botaoRef}
        type="button"
        className="cover__device"
        onClick={abrir}
        disabled={!fechada}
        aria-label="Abrir a Pokédex"
      >
        {/* Base: a Pokédex aberta (aparece quando a tampa gira) */}
        <img
          className="cover__img"
          src={pokedexAberta}
          alt=""
          width={1092}
          height={1372}
          draggable="false"
        />

        {/* Luzes que "acendem" quando a Pokédex liga */}
        <span className="cover__lens" aria-hidden="true" />
        <span className="cover__led" aria-hidden="true" />
        <span className="cover__scan" aria-hidden="true" />

        {/* Tampa: a imagem fechada recortada no retângulo da tampa */}
        <img
          className="cover__lid"
          src={pokedexFechada}
          alt=""
          width={1092}
          height={1372}
          draggable="false"
        />
      </button>

      <p className="cover__hint" role="status" aria-live="polite">
        {legenda}
        {fechada && <span className="cover__key"> (ou aperte Enter)</span>}
      </p>
    </div>
  );
}
