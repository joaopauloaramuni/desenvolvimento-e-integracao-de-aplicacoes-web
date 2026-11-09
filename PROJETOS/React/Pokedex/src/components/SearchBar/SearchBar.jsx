import { useId } from "react";
import Icon from "../Icon/Icon";
import "./SearchBar.css";

/** Campo de pesquisa por nome ou número. A lista atualiza a cada tecla. */
export default function SearchBar({ value, onChange }) {
  const id = useId();

  return (
    <div className="search-bar" role="search">
      <label htmlFor={id} className="visually-hidden">
        Pesquisar Pokémon por nome ou número
      </label>
      <div className="search-bar__field">
        <Icon name="search" className="search-bar__icon" />
        <input
          id={id}
          className="search-bar__input"
          type="search"
          value={value}
          placeholder="Pesquisar Pokémon..."
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby={`${id}-dica`}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && value) {
              e.preventDefault();
              onChange("");
            }
          }}
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            aria-label="Limpar pesquisa"
            onClick={() => onChange("")}
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>
      <p id={`${id}-dica`} className="search-bar__hint">
        Nome ou número, como Bulba ou 25
      </p>
    </div>
  );
}
