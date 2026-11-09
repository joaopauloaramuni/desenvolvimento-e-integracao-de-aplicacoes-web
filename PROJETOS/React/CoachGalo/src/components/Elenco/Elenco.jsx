import { useId, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { nivelDaCarta } from "../../config/appConfig";
import { POSICOES, SETORES } from "../../config/posicoes";
import { filtrarJogadores, getJogadores, getMeta } from "../../services/elencoService";
import FotoJogador from "../FotoJogador/FotoJogador";
import "./Elenco.css";

const STATUS = { titular: "Titular", reserva: "Banco" };

/**
 * Lista do elenco inteiro. Arraste um jogador para o campo ou para o banco,
 * ou clique para selecionar e depois clique numa vaga.
 * A própria lista é um alvo (data-alvo="elenco"): soltar aqui tira o jogador da escalação.
 */
export default function Elenco({ ondeEsta, selecionado, arrasto, onIniciar, onSelecionar }) {
  const [busca, setBusca] = useState("");
  const [setor, setSetor] = useState("todos");
  const idBusca = useId();
  const meta = getMeta();
  const todos = getJogadores();

  const lista = useMemo(() => filtrarJogadores(todos, { busca, setor }), [todos, busca, setor]);

  return (
    <aside className={`elenco ${arrasto?.alvo?.chave === "elenco" ? "is-alvo" : ""}`} data-alvo="elenco" aria-labelledby="elenco-titulo">
      <header className="elenco-topo">
        <h2 id="elenco-titulo" className="secao-titulo">
          Elenco {meta.temporada} <small>{todos.length} jogadores</small>
        </h2>

        <label htmlFor={idBusca} className="elenco-busca">
          <FiSearch aria-hidden="true" />
          <input
            id={idBusca}
            type="search"
            placeholder="Nome ou número"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setBusca("")}
          />
        </label>

        <div className="elenco-setores" role="group" aria-label="Filtrar por setor">
          {SETORES.map((s) => (
            <button
              type="button"
              key={s.id}
              className={`chip ${setor === s.id ? "is-ativo" : ""}`}
              aria-pressed={setor === s.id}
              onClick={() => setSetor(s.id)}
            >
              {s.nome}
            </button>
          ))}
        </div>
      </header>

      {lista.length === 0 ? (
        <p className="elenco-vazio">
          Nenhum jogador com “{busca}”. Confira o nome ou limpe a pesquisa.
        </p>
      ) : (
        <ul className="elenco-lista">
          {lista.map((j) => {
            const onde = ondeEsta(j.id);
            return (
              <li key={j.id}>
                <button
                  type="button"
                  className={`elenco-item nivel--${nivelDaCarta(j.overall)} ${selecionado === j.id ? "is-selecionado" : ""} ${arrasto?.id === j.id ? "is-origem" : ""}`}
                  onPointerDown={(e) => onIniciar(e, j.id)}
                  onClick={() => onSelecionar(j.id)}
                  aria-pressed={selecionado === j.id}
                >
                  <FotoJogador jogador={j} className="elenco-foto" />
                  <span className="elenco-nome">
                    {j.nome}
                    <small>
                      {POSICOES[j.posicao].nome}
                      {j.numero != null && ` · ${j.numero}`}
                    </small>
                  </span>
                  {STATUS[onde.tipo] && <span className={`elenco-status status--${onde.tipo}`}>{STATUS[onde.tipo]}</span>}
                  <span className="elenco-ovr">
                    {j.overall}
                    <small>{j.posicao}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="elenco-fonte">
        Fonte: {meta.fonte}, {new Date(`${meta.atualizadoEm}T12:00`).toLocaleDateString("pt-BR")}
      </p>
    </aside>
  );
}
