import { forwardRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./SearchBar.css";

const SearchBar = forwardRef(function SearchBar({ valor, onChange, total, encontrados }, ref) {
  return (
    <div className="busca" role="search">
      <label className="busca-campo">
        <FiSearch aria-hidden="true" className="busca-icone" />
        <span className="visualmente-oculto">Buscar aluno pelo nome</span>
        <input
          ref={ref}
          type="search"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar pelo nome do aluno"
          autoComplete="off"
          spellCheck="false"
        />
        {valor ? (
          <button type="button" className="busca-limpar" onClick={() => onChange("")} aria-label="Limpar busca">
            <FiX />
          </button>
        ) : (
          <kbd className="busca-atalho" aria-hidden="true">/</kbd>
        )}
      </label>
      <p className="busca-contagem" aria-live="polite">
        {valor ? `${encontrados} de ${total} portfólios` : `${total} portfólios`}
      </p>
      <ThemeToggle />
    </div>
  );
});

export default SearchBar;
