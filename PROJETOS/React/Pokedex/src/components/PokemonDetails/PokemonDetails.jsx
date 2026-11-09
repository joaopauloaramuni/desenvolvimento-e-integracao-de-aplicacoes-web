import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { STATS } from "../../model/Pokemon";
import { getBestStat, getSameTypePokemon } from "../../services/pokedexService";
import ClassicPokedex from "../ClassicPokedex/ClassicPokedex";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import Icon from "../Icon/Icon";
import PokemonArt from "../PokemonArt/PokemonArt";
import PokemonImage from "../PokemonImage/PokemonImage";
import StatBar from "../StatBar/StatBar";
import TrainerAvatar from "../TrainerAvatar/TrainerAvatar";
import TypeBadge from "../TypeBadge/TypeBadge";
import "./PokemonDetails.css";

/**
 * Detalhes de um Pokémon, abertos por cima da lista, dentro da tela do aparelho.
 * Teclado: Esc fecha, setas esquerda/direita vão para o anterior/próximo.
 */
export default function PokemonDetails({
  pokemon,
  treinadores,
  anterior,
  proximo,
  posicao,
  total,
  isFavorite,
  isSaving,
  favoritesEnabled,
  onToggleFavorite,
  onAnterior,
  onProximo,
  onClose,
  onVerTreinador,
  onAbrirPokemon,
  onFiltrarTipo,
  tecladoAtivo = true,
}) {
  const tituloId = useId();
  const voltarRef = useRef(null);
  const corpoRef = useRef(null);

  // Ao abrir, o foco vai para "Voltar" (quem usa teclado sabe onde está).
  useEffect(() => {
    voltarRef.current?.focus();
  }, []);

  /*
   * A área dos detalhes só rola quando o conteúdo não cabe de verdade (celular, janela pequena).
   * Se cabe (folga de 4 px para arredondamentos), a rolagem fica desligada: sem isso, 1 px a
   * mais já deixa o trackpad "balançar" a área para cima e para baixo (efeito elástico).
   */
  const [precisaRolar, setPrecisaRolar] = useState(false);
  useLayoutEffect(() => {
    const corpo = corpoRef.current;
    if (!corpo) return undefined;
    const medir = () => setPrecisaRolar(corpo.scrollHeight - corpo.clientHeight > 4);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(corpo);
    if (corpo.firstElementChild) observador.observe(corpo.firstElementChild);
    return () => observador.disconnect();
  }, [pokemon.id]);

  // Ao trocar de Pokémon, volta o conteúdo para o topo.
  useEffect(() => {
    corpoRef.current?.scrollTo({ top: 0 });
  }, [pokemon.id]);

  useEffect(() => {
    // Com a capa (Pokédex fechada) na frente, o teclado não mexe nos detalhes.
    if (!tecladoAtivo) return undefined;
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.target.closest?.("input, select, textarea")) return;
      if (e.key === "ArrowLeft" && anterior) onAnterior();
      if (e.key === "ArrowRight" && proximo) onProximo();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [anterior, proximo, onAnterior, onProximo, onClose, tecladoAtivo]);

  const cor = pokemon.types[0].color;
  const tipoPrincipal = pokemon.types[0];
  const melhor = getBestStat(pokemon);
  const mesmoTipo = getSameTypePokemon(pokemon);
  const mostrados = mesmoTipo.slice(0, 8);

  return (
    <section
      className="details"
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      style={{ "--type-color": cor }}
    >
      <div className="details__bar">
        <button ref={voltarRef} type="button" className="screen-button" onClick={onClose}>
          <Icon name="chevronLeft" size={18} />
          Voltar
        </button>
        <span className="details__position">
          {posicao} de {total}
        </span>
        <FavoriteButton
          pokemon={pokemon}
          isFavorite={isFavorite}
          isSaving={isSaving}
          enabled={favoritesEnabled}
          onToggle={onToggleFavorite}
        />
      </div>

      <div className="details__body" ref={corpoRef} data-rola={precisaRolar || undefined}>
        <div className="details__layout" key={pokemon.id}>
          <figure className="details__visual">
            <span className="details__watermark" aria-hidden="true">
              {pokemon.number}
            </span>
            <PokemonArt pokemon={pokemon} size={475} />
          </figure>

          <ClassicPokedex pokemon={pokemon} />

          <div className="details__info">
            <p className="details__number">{pokemon.number}</p>
            <h2 id={tituloId} className="details__name">
              {pokemon.name}
            </h2>
            <div className="details__types">
              {pokemon.types.map((tipo) => (
                <TypeBadge key={tipo.id} type={tipo} />
              ))}
            </div>

            <h3 className="details__heading">Atributos base</h3>
            <div className="details__stats">
              {STATS.map((stat) => (
                <StatBar
                  key={stat.key}
                  label={stat.label}
                  value={pokemon.stats[stat.key]}
                  color={cor}
                />
              ))}
            </div>
            <p className="details__total">
              <span>Total</span>
              <strong>{pokemon.total}</strong>
            </p>
            <p className="details__highlight">
              <span className="details__highlight-label">Ponto forte</span>
              {melhor.label} {melhor.valor}:{" "}
              {melhor.posicao === 1 ? "o maior valor" : `${melhor.posicao}º maior valor`} entre os
              151 Pokémon.
            </p>
          </div>

          <div className="details__extra">
            <h3 className="details__heading details__heading--first">Treinadores</h3>
            {treinadores.length > 0 ? (
              <ul className="details__trainers">
                {treinadores.map((treinador) => (
                  <li key={treinador.id}>
                    <button
                      type="button"
                      className="details__trainer"
                      onClick={() => onVerTreinador(treinador.id)}
                    >
                      <TrainerAvatar key={treinador.id} treinador={treinador} size="sm" />
                      {treinador.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="details__muted">Nenhum treinador do arquivo tem este Pokémon.</p>
            )}

            {mostrados.length > 0 && (
              <>
                <h3 className="details__heading">Outros do tipo {tipoPrincipal.label}</h3>
                <ul className="details__related">
                  {mostrados.map((outro) => (
                    <li key={outro.id}>
                      <button
                        type="button"
                        className="details__related-item"
                        style={{ "--type-color": outro.types[0].color }}
                        onClick={() => onAbrirPokemon(outro.id)}
                      >
                        <PokemonImage src={outro.sprite} alt="" pixelated size={64} />
                        <span className="details__related-name">{outro.name}</span>
                        <span className="details__related-number">{outro.number}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="screen-button details__related-all"
                  onClick={() => onFiltrarTipo(tipoPrincipal.name)}
                >
                  Ver os {mesmoTipo.length + 1} do tipo {tipoPrincipal.label} na Pokédex
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="details__nav" aria-label="Navegar entre Pokémon">
        <button type="button" className="details__step" disabled={!anterior} onClick={onAnterior}>
          <Icon name="chevronLeft" size={18} />
          <span className="details__step-text">
            {anterior ? (
              <>
                <span className="details__step-number">{anterior.number}</span> {anterior.name}
              </>
            ) : (
              "Início da lista"
            )}
          </span>
        </button>
        <button
          type="button"
          className="details__step details__step--next"
          disabled={!proximo}
          onClick={onProximo}
        >
          <span className="details__step-text">
            {proximo ? (
              <>
                <span className="details__step-number">{proximo.number}</span> {proximo.name}
              </>
            ) : (
              "Fim da lista"
            )}
          </span>
          <Icon name="chevronRight" size={18} />
        </button>
      </nav>
    </section>
  );
}
