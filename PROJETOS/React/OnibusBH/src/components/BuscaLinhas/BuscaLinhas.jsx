import { useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { normalizar } from "../../core/texto";
import { irPara } from "../../hooks/useRota";
import Letreiro from "../Letreiro/Letreiro";
import "./BuscaLinhas.css";

const LIMITE = 12;

// Número exato > número começando com o texto > nome ou destino contendo o texto
function buscar(linhas, consulta) {
  const q = normalizar(consulta);
  if (!q) return [];
  const pontuadas = [];
  for (const l of linhas) {
    const codigo = normalizar(l.codigo);
    const texto = normalizar(`${l.nome} ${l.sentidos.join(" ")}`);
    let nota = 0;
    if (codigo === q) nota = 3;
    else if (codigo.startsWith(q)) nota = 2;
    else if (q.split(/\s+/).every((parte) => texto.includes(parte))) nota = 1;
    if (nota) pontuadas.push([nota, l]);
  }
  return pontuadas.sort((a, b) => b[0] - a[0]).map(([, l]) => l);
}

export default function BuscaLinhas({ linhas }) {
  const [consulta, setConsulta] = useState("");
  const resultados = useMemo(() => buscar(linhas, consulta), [linhas, consulta]);

  const abrirPrimeira = (e) => {
    e.preventDefault();
    if (resultados[0]) irPara("linha", resultados[0].arquivo);
  };

  return (
    <section className="busca" aria-labelledby="busca-titulo">
      <h2 id="busca-titulo">Buscar linha</h2>
      <form className="busca-campo" role="search" onSubmit={abrirPrimeira}>
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Número ou nome: 9206, Savassi, Barreiro..."
          aria-label="Número ou nome da linha"
          autoComplete="off"
        />
        {consulta && (
          <button type="button" className="busca-limpar" onClick={() => setConsulta("")} aria-label="Limpar busca">
            <FiX aria-hidden="true" />
          </button>
        )}
      </form>

      {consulta && (
        <div className="busca-resultados" aria-live="polite">
          {resultados.length === 0 ? (
            <p className="busca-vazio">
              Nenhuma linha com “{consulta}”. Tente só o número (ex.: 4108) ou uma parte do nome do bairro.
            </p>
          ) : (
            <>
              <ul>
                {resultados.slice(0, LIMITE).map((l) => (
                  <li key={l.id}>
                    <button type="button" onClick={() => irPara("linha", l.arquivo)}>
                      <Letreiro codigo={l.codigo} tamanho="pequeno" />
                      <span className="busca-texto">
                        <strong>{l.nome || l.sentidos.join(" / ")}</strong>
                        <small>{l.sentidos.map((s) => `Para ${s}`).join(" e ")}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {resultados.length > LIMITE && (
                <p className="busca-mais">
                  Mostrando {LIMITE} de {resultados.length} linhas. Digite mais para refinar.
                </p>
              )}
            </>
          )}
        </div>
      )}
      {!consulta && (
        <p className="busca-dica">
          São {linhas.length.toLocaleString("pt-BR")} linhas do sistema municipal. Digite e aperte Enter para abrir a
          primeira.
        </p>
      )}
    </section>
  );
}
