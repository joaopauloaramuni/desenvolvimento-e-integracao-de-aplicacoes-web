import { Suspense, lazy, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { FEATURED_COUNT, FRISO, YUGI_DECK } from "../config/appConfig";
import { useAsync } from "../hooks/useAsync";
import { useFavoritos } from "../hooks/useFavoritos";
import { useLanguage } from "../hooks/useLanguage";
import { CARD_TYPES, getFrame } from "../model/FrameType";
import { getCardsByIds, sortear } from "../services/ygoApiService";
import CardGrid from "../components/CardGrid/CardGrid";
import Icon from "../components/Icon/Icon";
import IntroSplash from "../components/IntroSplash/IntroSplash";
import logo from "../assets/images/logo-yugioh.webp";
import yugiCorpo from "../assets/images/yugi-corpo-inteiro.webp";
import templo from "../assets/images/templo-ruinas.webp";
import anel from "../assets/images/anel-do-milenio.webp";
import "./HomePage.css";

// A fumaça (WebGL) só é baixada quando a home abre.
const SmokeEffect = lazy(() => import("../components/SmokeEffect/SmokeEffect"));

/** Atalhos da home: filtram por arquétipo (o nome do arquétipo é igual em todos os idiomas). */
const ATALHOS = [
  { label: "Dark Magician", archetype: "Dark Magician" },
  { label: "Blue-Eyes", archetype: "Blue-Eyes" },
  { label: "Red-Eyes", archetype: "Red-Eyes" },
  { label: "Kuriboh", archetype: "Kuriboh" },
  { label: "Exodia", archetype: "Forbidden One" },
];

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { status, ids } = useFavoritos();
  const [busca, setBusca] = useState("");
  const [rodada, setRodada] = useState(0);

  // Busca as cartas clássicas do deck do Yugi numa única chamada (cardinfo.php?id=1,2,3...).
  const { data: deck, loading, error, tentarDeNovo } = useAsync(() => getCardsByIds(YUGI_DECK, language), [language]);

  // Sorteia FEATURED_COUNT cartas do deck. "rodada" refaz o sorteio.
  const destaques = useMemo(() => (deck ? sortear(deck, FEATURED_COUNT) : []), [deck, rodada]); // eslint-disable-line react-hooks/exhaustive-deps

  const pesquisar = (e) => {
    e.preventDefault();
    const q = busca.trim();
    navigate(q ? `/cartas?q=${encodeURIComponent(q)}` : "/cartas");
  };

  return (
    <>
      <IntroSplash />
      <Suspense fallback={null}>
        <SmokeEffect />
      </Suspense>

      <section className="hero" style={{ "--temple-img": `url(${templo})` }}>
        <div className="hero__inner">
          <div className="hero__text">
            <h1>
              <img src={logo} alt="Yu-Gi-Oh!" className="hero__logo" width="1274" height="446" />
              <span className="hero__title">{t("home.title")}</span>
            </h1>
            <p className="hero__lead">{t("home.lead")}</p>

            <form className="hero__search" onSubmit={pesquisar} role="search">
              <label htmlFor="hero-q" className="visually-hidden">
                {t("home.searchLabel")}
              </label>
              <Icon name="search" />
              <input
                id="hero-q"
                type="search"
                placeholder={t("home.searchPlaceholder")}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="button button--gold">
                {t("home.searchButton")}
              </button>
            </form>

            <div className="hero__shortcuts">
              <span>{t("home.shortcuts")}</span>
              {ATALHOS.map((a) => (
                <Link key={a.label} to={`/cartas?archetype=${encodeURIComponent(a.archetype)}`}>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hero__figure">
            <span className="hero__sun" aria-hidden="true" />
            <img src={yugiCorpo} alt="" className="hero__art" width="900" height="1309" />
          </div>
        </div>
      </section>

      <div className="frieze" aria-hidden="true">
        {FRISO}
      </div>

      <div className="page">
        <section className="home-section">
          <header className="home-section__head">
            <div>
              <h2 className="cartouche">
                <span className="cartouche__glyph" aria-hidden="true">𓂀</span> {t("home.featuredTitle")}
              </h2>
              <p>{t("home.featuredText")}</p>
            </div>
            <button type="button" className="button button--ghost" onClick={() => setRodada((r) => r + 1)} disabled={!deck}>
              <Icon name="shuffle" size={18} /> {t("home.shuffle")}
            </button>
          </header>

          {error ? (
            <div className="home-error">
              <p>{error.message}</p>
              <button type="button" className="button button--ghost" onClick={tentarDeNovo}>
                <Icon name="refresh" size={18} /> {t("common.retry")}
              </button>
            </div>
          ) : (
            <CardGrid cards={destaques} loading={loading} placeholders={FEATURED_COUNT} />
          )}
        </section>

        <section className="home-section">
          <header className="home-section__head">
            <div>
              <h2 className="cartouche">
                <span className="cartouche__glyph" aria-hidden="true">𓋹</span> {t("home.typesTitle")}
              </h2>
              <p>{t("home.typesText")}</p>
            </div>
          </header>
          <ul className="types">
            {CARD_TYPES.map((tipo) => {
              const frame = getFrame(tipo.frame);
              return (
                <li key={tipo.value}>
                  <Link
                    to={`/cartas?type=${encodeURIComponent(tipo.value)}`}
                    className="types__item"
                    style={{ "--frame": frame.color, "--frame-text": frame.text }}
                  >
                    {t(`cardTypes.${tipo.value}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="banner" style={{ "--ring-img": `url(${anel})` }}>
          <div className="banner__text">
            <p className="banner__eyebrow" aria-hidden="true">
              𓂀 𓋹 𓆣
            </p>
            <h2>{t("home.vaultTitle")}</h2>
            <p>{t("home.vaultText")}</p>
            {status === "pronto" && (
              <Link to="/favoritos" className="button button--gold">
                {ids.length ? t("home.vaultButtonCount", { count: ids.length }) : t("home.vaultButton")}
              </Link>
            )}
            {status === "carregando" && <p className="banner__status">{t("home.vaultConnecting")}</p>}
            {status === "desativado" && (
              <p className="banner__status banner__status--off">
                <Trans i18nKey="home.vaultOff" components={{ code: <code /> }} />
              </p>
            )}
            {status === "erro" && (
              <p className="banner__status banner__status--error">
                {t("home.vaultError")}
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
