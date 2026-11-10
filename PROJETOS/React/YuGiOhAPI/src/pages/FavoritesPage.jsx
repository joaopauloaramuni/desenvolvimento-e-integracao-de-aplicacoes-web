import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { useFavoritos } from "../hooks/useFavoritos";
import { useLanguage } from "../hooks/useLanguage";
import { getCardsByIds } from "../services/ygoApiService";
import CardGrid from "../components/CardGrid/CardGrid";
import EmptyState from "../components/EmptyState/EmptyState";
import Icon from "../components/Icon/Icon";
import SupabaseNotice from "../components/SupabaseNotice/SupabaseNotice";

/** Cartas favoritas deste navegador (ids no Supabase, dados na YGOPRODeck). */
const FavoritesPage = () => {
  const { t } = useTranslation();
  const { ids, status } = useFavoritos();
  const { language } = useLanguage();
  const chave = ids.join(",");

  const { data: cards, loading, error, tentarDeNovo } = useAsync(
    () => (status === "pronto" ? getCardsByIds(ids, language) : Promise.resolve([])),
    [chave, status, language],
  );

  // Ao desfavoritar aqui, a carta some na hora (sem esperar a API).
  const visiveis = (cards ?? []).filter((c) => ids.includes(c.id));

  return (
    <div className="page">
      <header className="page-head">
        <h1>{t("favorites.title")}</h1>
        <p>
          {status === "pronto"
            ? ids.length
              ? t("favorites.count", { count: ids.length })
              : t("favorites.emptyHint")
            : t("favorites.subtitle")}
        </p>
      </header>

      <SupabaseNotice />

      {status === "desativado" || status === "erro" ? (
        <EmptyState
          title={t("favorites.unavailableTitle")}
          action={
            <Link to="/cartas" className="button button--primary">
              {t("favorites.seeCardsAnyway")}
            </Link>
          }
        >
          {t("favorites.unavailableText")}
        </EmptyState>
      ) : status === "carregando" ? (
        <CardGrid cards={[]} loading placeholders={6} />
      ) : ids.length === 0 ? (
        <EmptyState
          title={t("favorites.emptyTitle")}
          action={
            <Link to="/cartas" className="button button--primary">
              {t("favorites.chooseCards")}
            </Link>
          }
        >
          {t("favorites.emptyText")}
        </EmptyState>
      ) : error ? (
        <EmptyState
          title={t("favorites.loadError")}
          action={
            <button type="button" className="button button--primary" onClick={tentarDeNovo}>
              <Icon name="refresh" size={18} /> {t("common.retry")}
            </button>
          }
        >
          {error.message}
        </EmptyState>
      ) : (
        <CardGrid cards={visiveis} loading={loading} placeholders={Math.min(ids.length, 12)} />
      )}
    </div>
  );
};

export default FavoritesPage;
