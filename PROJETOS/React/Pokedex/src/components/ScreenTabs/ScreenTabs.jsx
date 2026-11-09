import { useRef } from "react";
import "./ScreenTabs.css";

/**
 * Abas da tela: Pokédex, Favoritos e Treinadores.
 * Segue o padrão de abas acessíveis: setas esquerda/direita trocam de aba.
 */
export default function ScreenTabs({ abas, ativa, onTrocar }) {
  const refs = useRef([]);

  function onKeyDown(e, indice) {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (e.key === "Home" || e.key === "End" || delta) {
      e.preventDefault();
      let proximo = indice + (delta ?? 0);
      if (e.key === "Home") proximo = 0;
      if (e.key === "End") proximo = abas.length - 1;
      proximo = (proximo + abas.length) % abas.length;
      onTrocar(abas[proximo].id);
      refs.current[proximo]?.focus();
    }
  }

  return (
    <div className="screen-tabs" role="tablist" aria-label="Seções da Pokédex">
      {abas.map((aba, indice) => {
        const selecionada = aba.id === ativa;
        return (
          <button
            key={aba.id}
            ref={(el) => (refs.current[indice] = el)}
            id={`aba-${aba.id}`}
            type="button"
            role="tab"
            className="screen-tabs__tab"
            aria-selected={selecionada}
            aria-controls={`painel-${aba.id}`}
            tabIndex={selecionada ? 0 : -1}
            onClick={() => onTrocar(aba.id)}
            onKeyDown={(e) => onKeyDown(e, indice)}
          >
            {aba.label}
            <span className="screen-tabs__count" data-fixo={aba.fixo || undefined}>
              {aba.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
