import { useMemo, useState } from "react";
import { LuLogOut, LuRefreshCw, LuSearch } from "react-icons/lu";
import CROSSPOINT_CONFIG from "../../config/crosspointConfig";
import { formatarNumero, tituloDe, veioDoKindle } from "../../utils/format";
import BookCard from "../BookCard/BookCard";
import BookDetails from "../BookDetails/BookDetails";
import "./Bookshelf.css";

const { TABS } = CROSSPOINT_CONFIG;

const semAcento = (texto) =>
  (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const plural = (n, um, varios) => `${formatarNumero(n)} ${n === 1 ? um : varios}`;

/** Resumo em uma frase, com os números em destaque. */
function Resumo({ livros, atividade }) {
  const lendo = livros.filter((l) => l.status === "reading").length;
  const concluidos = livros.filter((l) => l.status === "finished").length;
  const doKindle = livros.filter(veioDoKindle).length;
  const paginas = atividade?.pages_total;

  return (
    <p className="shelf-summary">
      Você está lendo <b>{plural(lendo, "livro", "livros")}</b> e já terminou <b>{formatarNumero(concluidos)}</b>
      {paginas ? (
        <>
          , com <b>{formatarNumero(paginas)}</b> páginas lidas
        </>
      ) : null}
      .{" "}
      {doKindle > 0 && (
        <>
          Em <b>{plural(doKindle, "livro", "livros")}</b>, a leitura mais recente veio do Kindle.
        </>
      )}
    </p>
  );
}

function Bookshelf({ sessao, biblioteca, onSair }) {
  const { livros, atividade, carregando, erro, atualizar, aparelhosDe } = biblioteca;
  const [aba, setAba] = useState("reading");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(null);

  const contagem = useMemo(() => {
    const c = { all: livros.length };
    for (const l of livros) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [livros]);

  const visiveis = useMemo(() => {
    const termo = semAcento(busca.trim());
    return livros.filter((l) => {
      if (aba !== "all" && l.status !== aba) return false;
      if (!termo) return true;
      return semAcento(`${tituloDe(l)} ${l.author ?? ""}`).includes(termo);
    });
  }, [livros, aba, busca]);

  const abaAtual = TABS.find((t) => t.id === aba);
  const primeiraCarga = carregando && livros.length === 0;

  return (
    <section className="shelf" aria-labelledby="shelf-titulo">
      {/* =====================================================
          BARRA: CONTA + AÇÕES
          ===================================================== */}
      <div className="shelf-bar">
        <div className="shelf-account">
          <h2 className="section-title" id="shelf-titulo">
            Estante de {sessao.user}
          </h2>
          <span className="shelf-server">{sessao.demo ? "Modo demonstração" : sessao.server}</span>
        </div>
        <div className="shelf-actions">
          <button type="button" className="btn btn-ghost" onClick={atualizar} disabled={carregando}>
            <LuRefreshCw aria-hidden="true" className={carregando ? "spin" : ""} />
            {carregando ? "Atualizando…" : "Atualizar"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onSair}>
            <LuLogOut aria-hidden="true" />
            Sair
          </button>
        </div>
      </div>

      {erro && (
        <p className="alert alert-error" role="alert">
          {erro}
        </p>
      )}

      {!primeiraCarga && livros.length > 0 && <Resumo livros={livros} atividade={atividade} />}

      {/* =====================================================
          ABAS + BUSCA
          ===================================================== */}
      <div className="shelf-controls">
        <div className="tabs" role="tablist" aria-label="Filtrar por situação">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={aba === t.id}
              className="tab"
              onClick={() => setAba(t.id)}
            >
              {t.label}
              <span className="tab-count">{contagem[t.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <label className="search">
          <LuSearch aria-hidden="true" />
          <span className="sr-only">Buscar por título ou autor</span>
          <input
            type="search"
            placeholder="Buscar título ou autor"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
      </div>

      {/* =====================================================
          LIVROS
          ===================================================== */}
      {primeiraCarga && (
        <ul className="shelf-grid" aria-label="Carregando livros">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="skeleton" aria-hidden="true" />
          ))}
        </ul>
      )}

      {!primeiraCarga && visiveis.length > 0 && (
        <ul className="shelf-grid" role="tabpanel" aria-label={abaAtual?.label}>
          {visiveis.map((livro) => (
            <BookCard key={livro.document} livro={livro} onAbrir={setAberto} />
          ))}
        </ul>
      )}

      {!primeiraCarga && !erro && visiveis.length === 0 && (
        <div className="shelf-empty">
          {livros.length === 0 ? (
            <>
              <p className="shelf-empty-title">Nenhum livro sincronizado nesta conta ainda.</p>
              <p>
                Abra um livro no CrossPoint ou no KOReader com a sincronização ligada, ou vincule o Kindle em{" "}
                <em>Connected services</em> no site do servidor. Depois, clique em Atualizar.
              </p>
            </>
          ) : busca ? (
            <p className="shelf-empty-title">Nenhum livro com “{busca}” em {abaAtual?.label.toLowerCase()}.</p>
          ) : (
            <p className="shelf-empty-title">Nenhum livro em {abaAtual?.label.toLowerCase()}.</p>
          )}
        </div>
      )}

      {aberto && <BookDetails livro={aberto} carregarAparelhos={aparelhosDe} onFechar={() => setAberto(null)} />}
    </section>
  );
}

export default Bookshelf;
