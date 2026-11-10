import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { useLanguage } from "../hooks/useLanguage";
import { useCardLabels } from "../i18n/useCardLabels";
import { getCardById } from "../services/ygoApiService";
import { formatarDolar, formatarEuro, formatarPasscode, formatarStat } from "../utils/format";
import CardImage from "../components/CardImage/CardImage";
import EmptyState from "../components/EmptyState/EmptyState";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";
import Icon from "../components/Icon/Icon";
import SupabaseNotice from "../components/SupabaseNotice/SupabaseNotice";
import "./CardPage.css";

const LOJAS = [
  { campo: "cardmarket_price", nome: "Cardmarket", formatar: formatarEuro },
  { campo: "tcgplayer_price", nome: "TCGplayer", formatar: formatarDolar },
  { campo: "ebay_price", nome: "eBay", formatar: formatarDolar },
  { campo: "amazon_price", nome: "Amazon", formatar: formatarDolar },
  { campo: "coolstuffinc_price", nome: "CoolStuffInc", formatar: formatarDolar },
];

const SETS_VISIVEIS = 8;

/** Carta inclinável: segue o ponteiro, com um brilho holográfico. Volta ao lugar ao sair. */
const TiltCard = ({ card }) => {
  const ref = useRef(null);

  const mover = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.style.setProperty("--shine", "1");
  };

  const sair = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--shine", "0");
  };

  return (
    <div className="tilt" ref={ref} onPointerMove={mover} onPointerLeave={sair}>
      <CardImage card={card} size="large" loading="eager" />
      <span className="tilt__shine" aria-hidden="true" />
    </div>
  );
};

const CardPage = () => {
  const { t } = useTranslation();
  const labels = useCardLabels();
  const { id } = useParams();
  const { language, locale } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [todosSets, setTodosSets] = useState(false);

  const { data: card, loading, error, tentarDeNovo } = useAsync(() => getCardById(id, language), [id, language]);

  const voltar = () => (location.key !== "default" ? navigate(-1) : navigate("/cartas"));

  if (loading && !card) {
    return (
      <div className="page">
        <div className="card-page card-page--loading" aria-busy="true">
          <div className="grid__placeholder" />
          <p>{t("card.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <EmptyState
          title={t("card.loadError")}
          action={
            <button type="button" className="button button--primary" onClick={tentarDeNovo}>
              <Icon name="refresh" size={18} /> {t("common.retry")}
            </button>
          }
        >
          {error.message}
        </EmptyState>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="page">
        <EmptyState
          title={t("card.notFound")}
          action={
            <Link to="/cartas" className="button button--primary">
              {t("card.seeAll")}
            </Link>
          }
        >
          {language === "pt" ? t("card.notFoundTextPt", { id }) : t("card.notFoundText", { id })}
        </EmptyState>
      </div>
    );
  }

  const precos = LOJAS.map((l) => ({ ...l, valor: l.formatar(card.prices?.[l.campo], locale) })).filter((l) => l.valor);
  const sets = todosSets ? card.sets : card.sets.slice(0, SETS_VISIVEIS);

  return (
    <div className="page">
      <button type="button" className="back" onClick={voltar}>
        <Icon name="left" size={18} /> {t("card.back")}
      </button>

      <SupabaseNotice />

      <article className="card-page" style={{ "--frame": card.frame.color, "--frame-text": card.frame.text }}>
        <div className="card-page__art">
          <TiltCard card={card} />
        </div>

        <div className="card-page__info">
          <p className="card-page__frame">{labels.frame(card)}</p>
          <h1 className="card-page__name">{card.name}</h1>

          <dl className="facts">
            {card.attribute && (
              <div>
                <dt>{t("card.attribute")}</dt>
                <dd>{labels.attribute(card)}</dd>
              </div>
            )}
            {card.race && (
              <div>
                <dt>{card.isMonster ? t("card.monsterType") : t("card.property")}</dt>
                <dd>{labels.race(card)}</dd>
              </div>
            )}
            {card.level !== null && !card.isLink && (
              <div>
                <dt>{labels.levelLabel(card)}</dt>
                <dd className="facts__stars">
                  {card.level}
                  <span aria-hidden="true">{"★".repeat(Math.min(card.level, 13))}</span>
                </dd>
              </div>
            )}
            {card.scale !== null && (
              <div>
                <dt>{t("card.scale")}</dt>
                <dd>{card.scale}</dd>
              </div>
            )}
            {card.isMonster && (
              <div>
                <dt>ATK</dt>
                <dd className="facts__stat">{formatarStat(card.atk)}</dd>
              </div>
            )}
            {card.isMonster && !card.isLink && (
              <div>
                <dt>DEF</dt>
                <dd className="facts__stat">{formatarStat(card.def)}</dd>
              </div>
            )}
            {card.isLink && (
              <div>
                <dt>LINK</dt>
                <dd className="facts__stat">{card.linkval}</dd>
              </div>
            )}
          </dl>

          {card.typeline.length > 0 && <p className="card-page__typeline">[{labels.typeline(card).join(" / ")}]</p>}

          <div className="card-page__text">
            {card.pendDesc ? (
              <>
                <h2>{t("card.pendulumEffect")}</h2>
                <p>{card.pendDesc}</p>
                <h2>{t("card.monsterEffect")}</h2>
                <p>{card.monsterDesc}</p>
              </>
            ) : (
              <p>{card.desc}</p>
            )}
          </div>

          <div className="card-page__actions">
            <FavoriteButton card={card} variant="full" />
            <a className="button button--ghost" href={card.url} target="_blank" rel="noreferrer">
              {t("card.viewOn")} <Icon name="external" size={16} />
            </a>
          </div>

          <dl className="card-page__extra">
            <div>
              <dt>{t("card.passcode")}</dt>
              <dd>{formatarPasscode(card.id)}</dd>
            </div>
            {card.archetype && (
              <div>
                <dt>{t("card.archetype")}</dt>
                <dd>
                  <Link to={`/cartas?archetype=${encodeURIComponent(card.archetype)}`}>{card.archetype}</Link>
                </dd>
              </div>
            )}
            {card.isLink && card.linkmarkers.length > 0 && (
              <div>
                <dt>{t("card.linkArrows")}</dt>
                <dd>{card.linkmarkers.map(labels.linkMarker).join(", ")}</dd>
              </div>
            )}
          </dl>

          {precos.length > 0 && (
            <section className="card-page__section">
              <h2 className="cartouche">{t("card.prices")}</h2>
              <ul className="prices">
                {precos.map((p) => (
                  <li key={p.campo}>
                    <span>{p.nome}</span>
                    <strong>{p.valor}</strong>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {card.sets.length > 0 && (
            <section className="card-page__section">
              <h2 className="cartouche">{t("card.sets", { count: card.sets.length })}</h2>
              <div className="table-scroll">
                <table className="sets">
                  <thead>
                    <tr>
                      <th scope="col">{t("card.setName")}</th>
                      <th scope="col">{t("card.setCode")}</th>
                      <th scope="col">{t("card.setRarity")}</th>
                      <th scope="col">{t("card.setPrice")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sets.map((s, i) => (
                      <tr key={`${s.set_code}-${s.set_rarity}-${i}`}>
                        <td>{s.set_name}</td>
                        <td className="sets__code">{s.set_code}</td>
                        <td>{s.set_rarity}</td>
                        <td className="sets__price">{formatarDolar(s.set_price, locale) ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {card.sets.length > SETS_VISIVEIS && (
                <button type="button" className="button button--ghost sets__more" onClick={() => setTodosSets((v) => !v)}>
                  {todosSets ? t("card.showLess") : t("card.showAllSets", { count: card.sets.length })}
                </button>
              )}
            </section>
          )}
        </div>
      </article>
    </div>
  );
};

export default CardPage;
