import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ATTRIBUTES, CARD_TYPES, SORT_OPTIONS } from "../../model/FrameType";
import Icon from "../Icon/Icon";
import "./FilterBar.css";

/**
 * Pesquisa + filtros da lista de cartas.
 * Todos os valores vêm da URL (?q=&type=&attribute=&archetype=&sort=), então dá
 * para compartilhar o link de uma busca.
 */
const FilterBar = ({ busca, onBusca, filtros, onFiltro, archetypes, onLimpar, temFiltro }) => {
  const { t } = useTranslation();
  const id = useId();

  return (
    <div className="filters">
      <label className="filters__search" htmlFor={`${id}-q`}>
        <Icon name="search" />
        <span className="visually-hidden">{t("filters.searchLabel")}</span>
        <input
          id={`${id}-q`}
          type="search"
          placeholder={t("filters.searchPlaceholder")}
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onBusca("")}
          autoComplete="off"
        />
      </label>

      <div className="filters__row">
        <label className="field">
          <span>{t("filters.type")}</span>
          <select value={filtros.type} onChange={(e) => onFiltro("type", e.target.value)}>
            <option value="">{t("filters.all")}</option>
            {CARD_TYPES.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {t(`cardTypes.${tipo.value}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{t("filters.attribute")}</span>
          <select value={filtros.attribute} onChange={(e) => onFiltro("attribute", e.target.value)}>
            <option value="">{t("filters.all")}</option>
            {ATTRIBUTES.map((valor) => (
              <option key={valor} value={valor}>
                {t(`attributes.${valor}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--wide">
          <span>{t("filters.archetype")}</span>
          <input
            list={`${id}-arch`}
            value={filtros.archetype}
            onChange={(e) => onFiltro("archetype", e.target.value)}
            placeholder={t("filters.archetypePlaceholder")}
          />
          <datalist id={`${id}-arch`}>
            {archetypes.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </label>

        <label className="field">
          <span>{t("filters.sort")}</span>
          <select value={filtros.sort} onChange={(e) => onFiltro("sort", e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {t(`sort.${o}`)}
              </option>
            ))}
          </select>
        </label>

        {temFiltro && (
          <button type="button" className="button button--ghost filters__clear" onClick={onLimpar}>
            {t("filters.clear")}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
