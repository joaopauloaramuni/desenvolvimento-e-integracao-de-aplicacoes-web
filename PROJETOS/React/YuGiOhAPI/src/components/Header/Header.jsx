import { useTranslation } from "react-i18next";
import { NavLink, Link } from "react-router-dom";
import { useFavoritos } from "../../hooks/useFavoritos";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import { IDIOMAS } from "../../i18n";
import logo from "../../assets/images/logo-yugioh.webp";
import Icon from "../Icon/Icon";
import "./Header.css";

const Header = () => {
  const { t } = useTranslation();
  const { tema, alternar } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { status, ids } = useFavoritos();
  const textoStatus = t(`header.status.${status}`);

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" aria-label={t("header.homeAria")}>
          <img src={logo} alt="" width="120" height="42" />
          <span>{t("header.brand")}</span>
        </Link>

        <nav className="header__nav" aria-label={t("header.navAria")}>
          <NavLink to="/" end>
            {t("header.home")}
          </NavLink>
          <NavLink to="/cartas">{t("header.cards")}</NavLink>
          <NavLink to="/favoritos">
            {t("header.favorites")}
            {status === "pronto" && ids.length > 0 && <span className="header__count">{ids.length}</span>}
          </NavLink>
        </nav>

        <div className="header__tools">
          <span className={`header__status header__status--${status}`} title={textoStatus}>
            <span className="header__dot" aria-hidden="true" />
            <span className="header__status-text">{textoStatus}</span>
          </span>

          <label className="header__lang">
            <span className="visually-hidden">{t("language.label")}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {IDIOMAS.map((id) => (
                <option key={id} value={id} lang={id}>
                  {t(`language.${id}`)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="icon-button"
            onClick={alternar}
            aria-label={tema === "dark" ? t("header.themeToLight") : t("header.themeToDark")}
            title={tema === "dark" ? t("header.themeToLight") : t("header.themeToDark")}
          >
            <Icon name={tema === "dark" ? "sun" : "moon"} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
