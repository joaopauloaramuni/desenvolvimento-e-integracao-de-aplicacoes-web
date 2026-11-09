import { useId } from "react";
import { SORT_OPTIONS } from "../../services/pokedexService";
import Icon from "../Icon/Icon";
import "./SortControl.css";

/** Ordenação por número, nome, atributo ou total, crescente ou decrescente. */
export default function SortControl({ ordem, onOrdenar, onInverter }) {
  const id = useId();
  const crescente = ordem.direcao === "asc";

  return (
    <div className="sort-control">
      <label htmlFor={id} className="sort-control__label">
        Ordenar por
      </label>
      <div className="sort-control__row">
        <select
          id={id}
          className="sort-control__select"
          value={ordem.campo}
          onChange={(e) => onOrdenar(e.target.value)}
        >
          {SORT_OPTIONS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="sort-control__direction"
          onClick={onInverter}
          aria-label={
            crescente
              ? "Ordem crescente. Inverter para decrescente"
              : "Ordem decrescente. Inverter para crescente"
          }
          title={crescente ? "Crescente" : "Decrescente"}
        >
          <Icon name={crescente ? "arrowUp" : "arrowDown"} size={18} />
        </button>
      </div>
    </div>
  );
}
