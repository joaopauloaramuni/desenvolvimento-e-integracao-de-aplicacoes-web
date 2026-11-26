import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import EstadoVazio from "../../components/EstadoVazio/EstadoVazio";
import Skeleton from "../../components/Skeleton/Skeleton";
import { CATEGORIAS, UNIDADES } from "../../data/seed";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import { listarRecursos } from "../../services/recursoService";
import { iconeDoTipo } from "../../utils/icones";
import "./Recursos.css";

// Busca sem diferenciar maiúsculas nem acentos ("televisao" acha "Televisão")
const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/**
 * Lista de recursos com busca e filtros.
 *
 * - Os filtros ficam na URL (?q=&categoria=&unidade=): o botão Voltar do
 *   navegador funciona e o link pode ser compartilhado.
 * - Quantidade de resultados anunciada ao leitor de tela (aria-live).
 * - Skeleton enquanto carrega; estado vazio com saída ("Limpar filtros").
 */
export default function Recursos() {
  const tituloRef = usePaginaTitulo("Recursos");
  const [params, setParams] = useSearchParams();
  const [recursos, setRecursos] = useState(null);

  const busca = params.get("q") ?? "";
  const categoria = params.get("categoria") ?? "";
  const unidade = params.get("unidade") ?? "";
  const temFiltro = Boolean(busca || categoria || unidade);

  useEffect(() => {
    let ativo = true;
    listarRecursos().then((lista) => ativo && setRecursos(lista));
    return () => {
      ativo = false;
    };
  }, []);

  function alterarFiltro(nome, valor) {
    const novos = new URLSearchParams(params);
    if (valor) novos.set(nome, valor);
    else novos.delete(nome);
    // replace: digitar na busca não enche o histórico do navegador
    setParams(novos, { replace: nome === "q" });
  }

  const filtrados = useMemo(() => {
    if (!recursos) return [];
    const termo = normalizar(busca.trim());
    return recursos.filter(
      (r) =>
        (!categoria || r.categoria === categoria) &&
        (!unidade || r.unidade === unidade) &&
        (!termo || normalizar(`${r.nome} ${r.tipo} ${r.codigo}`).includes(termo))
    );
  }, [recursos, busca, categoria, unidade]);

  // O anúncio espera a pessoa parar de digitar, para o leitor de tela não "falar" a cada letra
  const [anuncio, setAnuncio] = useState("");
  useEffect(() => {
    if (!recursos) return undefined;
    const t = setTimeout(() => {
      const n = filtrados.length;
      setAnuncio(n === 0 ? "Nenhum recurso encontrado" : `${n} ${n === 1 ? "recurso encontrado" : "recursos encontrados"}`);
    }, 500);
    return () => clearTimeout(t);
  }, [filtrados.length, recursos]);

  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo="Recursos audiovisuais"
        descricao="Equipamentos disponíveis para reserva nas unidades da PUC Minas."
        trilha={[{ rotulo: "Recursos" }]}
        acoes={
          <Button para="/recursos/novo" variante="secundario" icone={FiPlus}>
            Cadastrar recurso
          </Button>
        }
      />

      <form role="search" className="recursos-filtros" aria-label="Filtrar recursos" onSubmit={(e) => e.preventDefault()}>
        <div className="recursos-busca">
          <label htmlFor="busca" className="recursos-rotulo">
            Buscar
          </label>
          <div className="recursos-busca-campo">
            <FiSearch aria-hidden="true" className="recursos-busca-icone" />
            <input
              id="busca"
              type="search"
              className="campo-controle"
              placeholder="Nome, tipo ou código"
              value={busca}
              onChange={(e) => alterarFiltro("q", e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
        </div>

        <fieldset className="recursos-segmentado">
          <legend className="recursos-rotulo">Categoria</legend>
          <div className="segmentado">
            {["", ...CATEGORIAS].map((c) => (
              <label key={c || "todas"} className="segmentado-opcao">
                <input
                  type="radio"
                  name="categoria"
                  value={c}
                  checked={categoria === c}
                  onChange={() => alterarFiltro("categoria", c)}
                />
                <span>{c || "Todas"}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="recursos-unidade">
          <label htmlFor="unidade" className="recursos-rotulo">
            Unidade
          </label>
          <select
            id="unidade"
            className="campo-controle campo-select"
            value={unidade}
            onChange={(e) => alterarFiltro("unidade", e.target.value)}
          >
            <option value="">Todas as unidades</option>
            {UNIDADES.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="recursos-status">
        <p className="muted" aria-hidden="true">
          {recursos && (filtrados.length === 1 ? "1 recurso" : `${filtrados.length} recursos`)}
        </p>
        <p className="sr-only" aria-live="polite">
          {anuncio}
        </p>
        {temFiltro && (
          <Button variante="fantasma" tamanho="sm" icone={FiX} onClick={() => setParams({})}>
            Limpar filtros
          </Button>
        )}
      </div>

      <h2 className="sr-only">Resultados</h2>

      {recursos === null && <Skeleton rotulo="Carregando recursos…" />}

      {recursos && filtrados.length === 0 && (
        <EstadoVazio
          icone={FiSearch}
          titulo="Nenhum recurso com esses filtros"
          acao={
            <Button variante="secundario" onClick={() => setParams({})}>
              Limpar filtros
            </Button>
          }
        >
          <p>Tente outra palavra na busca ou escolha “Todas” as categorias e unidades.</p>
        </EstadoVazio>
      )}

      {filtrados.length > 0 && (
        <ul className="recursos-grade">
          {filtrados.map((r) => {
            const Icone = iconeDoTipo(r.tipo);
            return (
              <li key={r.codigo}>
                <article className="recurso">
                  <div className="recurso-topo">
                    <span className="recurso-icone" aria-hidden="true">
                      <Icone />
                    </span>
                    <span className="recurso-tipo">
                      {r.tipo} <span className="recurso-categoria">({r.categoria})</span>
                    </span>
                  </div>

                  <h3 className="recurso-nome">{r.nome}</h3>

                  <dl className="recurso-dados">
                    <div>
                      <dt>Código</dt>
                      <dd>{r.codigo}</dd>
                    </div>
                    <div>
                      <dt>Unidade</dt>
                      <dd>{r.unidade}</dd>
                    </div>
                  </dl>

                  {r.observacoes && <p className="recurso-obs">{r.observacoes}</p>}

                  <Link to={`/reservar?recurso=${encodeURIComponent(r.codigo)}`} className="btn btn-primario btn-sm recurso-acao">
                    Reservar<span className="sr-only"> {r.nome}</span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
