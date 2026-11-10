import { Trans, useTranslation } from "react-i18next";
import Icon from "../Icon/Icon";
import "./Pagination.css";

const Pagination = ({ page, totalPages, onChange }) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label={t("pagination.aria")}>
      <button type="button" className="button button--ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <Icon name="left" size={18} /> {t("pagination.previous")}
      </button>
      <span className="pagination__label">
        <Trans i18nKey="pagination.label" values={{ page, total: totalPages }} components={{ strong: <strong /> }} />
      </span>
      <button type="button" className="button button--ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        {t("pagination.next")} <Icon name="right" size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
