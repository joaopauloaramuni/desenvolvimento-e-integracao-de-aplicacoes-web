import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { useDebounce } from "../hooks/useDebounce";
import { useLanguage } from "../hooks/useLanguage";
import { getArchetypes, searchCards } from "../services/ygoApiService";
import { formatarNumero } from "../utils/format";
import CardGrid from "../components/CardGrid/CardGrid";
import EmptyState from "../components/EmptyState/EmptyState";
import FilterBar from "../components/FilterBar/FilterBar";
import Icon from "../components/Icon/Icon";
import Pagination from "../components/Pagination/Pagination";
import SupabaseNotice from "../components/SupabaseNotice/SupabaseNotice";
import "./CardsPage.css";

const FILTROS = ["type", "attribute", "archetype"];

/** Lista de cartas com pesquisa, filtros, ordenação e paginação (tudo guardado na URL). */
const CardsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { language, locale } = useLanguage();
  const [archetypes, setArchetypes] = useState([]);

  const q = params.get("q") ?? "";
  const filtros = {
    type: params.get("type") ?? "",
    attribute: params.get("attribute") ?? "",
    archetype: params.get("archetype") ?? "",
    sort: params.get("sort") ?? "name",
  };
  const page = Math.max(1, Number(params.get("page")) || 1);

  // A pesquisa digitada atualiza a URL só depois de uma pausa (uma requisição por busca, não por tecla).
  const [busca, setBusca] = useState(q);
  const buscaAtrasada = useDebounce(busca, 450);
  const archetypeAtrasado = useDebounce(filtros.archetype, 450);

  useEffect(() => {
    setBusca(q);
  }, [q]);

  useEffect(() => {
    if (buscaAtrasada.trim() === q.trim()) return;
    atualizar({ q: buscaAtrasada.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscaAtrasada]);

  useEffect(() => {
    getArchetypes().then(setArchetypes).catch(() => setArchetypes([]));
  }, []);

  function atualizar(mudancas, { manterPagina = false } = {}) {
    setParams(
      (atual) => {
        const novo = new URLSearchParams(atual);
        for (const [chave, valor] of Object.entries(mudancas)) {
          if (valor === "" || valor === null || valor === undefined || (chave === "sort" && valor === "name")) novo.delete(chave);
          else novo.set(chave, String(valor));
        }
        if (!manterPagina) novo.delete("page");
        return novo;
      },
      { replace: true },
    );
  }

  const { data, loading, error, tentarDeNovo } = useAsync(
    () => searchCards({ q, ...filtros, archetype: archetypeAtrasado, page, language }),
    [q, filtros.type, filtros.attribute, archetypeAtrasado, filtros.sort, page, language],
  );

  const temFiltro = Boolean(q || FILTROS.some((f) => filtros[f]) || filtros.sort !== "name");

  const mudarPagina = (nova) => {
    atualizar({ page: nova }, { manterPagina: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1>{t("cards.title")}</h1>
        <p>
          {data && !loading
            ? data.total
              ? t("cards.found", { count: data.total, formatted: formatarNumero(data.total, locale) })
              : t("cards.none")
            : t("cards.loading")}
        </p>
        <p className="page-head__hint">{t("cards.hint")}</p>
      </header>

      <SupabaseNotice />

      <FilterBar
        busca={busca}
        onBusca={setBusca}
        filtros={filtros}
        onFiltro={(chave, valor) => atualizar({ [chave]: valor })}
        archetypes={archetypes}
        temFiltro={temFiltro}
        onLimpar={() => {
          setBusca("");
          setParams({}, { replace: true });
        }}
      />

      {error ? (
        <div className="cards-error" role="alert">
          <Icon name="alert" />
          <div>
            <strong>{t("cards.loadErrorTitle")}</strong>
            <p>{error.message}</p>
          </div>
          <button type="button" className="button button--ghost" onClick={tentarDeNovo}>
            <Icon name="refresh" size={18} /> {t("common.retry")}
          </button>
        </div>
      ) : data && !loading && data.cards.length === 0 ? (
        <EmptyState
          title={t("cards.emptyTitle")}
          action={
            <button
              type="button"
              className="button button--primary"
              onClick={() => {
                setBusca("");
                setParams({}, { replace: true });
              }}
            >
              {t("cards.clearAll")}
            </button>
          }
        >
          {t("cards.emptyText")}
        </EmptyState>
      ) : (
        <>
          <CardGrid cards={data?.cards ?? []} loading={loading} />
          {data && <Pagination page={page} totalPages={data.totalPages} onChange={mudarPagina} />}
        </>
      )}
    </div>
  );
};

export default CardsPage;
