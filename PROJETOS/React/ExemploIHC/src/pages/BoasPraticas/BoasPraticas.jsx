import { FiArrowRight, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import { BOAS_PRATICAS } from "../../config/boasPraticas";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import "../GuiaEstilo/GuiaEstilo.css";
import "./BoasPraticas.css";

/**
 * Mapa das boas práticas: cada conteúdo da disciplina aponta para a tela
 * onde está aplicado e para o arquivo que o implementa.
 * Gerada a partir de src/config/boasPraticas.js.
 */
export default function BoasPraticas() {
  const tituloRef = usePaginaTitulo("Boas práticas");
  const total = BOAS_PRATICAS.reduce((soma, s) => soma + s.itens.length, 0);

  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo="Boas práticas aplicadas"
        descricao={`${total} práticas de IHC, organizadas por aula, com o lugar exato onde cada uma aparece no projeto.`}
        trilha={[{ rotulo: "Boas práticas" }]}
      />

      <div className="guia">
        <nav className="guia-indice" aria-label="Aulas">
          <p className="guia-indice-titulo">Por aula</p>
          <ul>
            {BOAS_PRATICAS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.titulo}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="guia-conteudo">
          {BOAS_PRATICAS.map((secao) => (
            <section key={secao.id} id={secao.id} aria-labelledby={`t-${secao.id}`} className="guia-secao">
              <p className="bp-aula">{secao.aula}</p>
              <h2 id={`t-${secao.id}`}>{secao.titulo}</h2>
              <p className="muted">{secao.resumo}</p>

              <ul className="bp-lista">
                {secao.itens.map((item) => (
                  <li key={item.titulo} className="bp-item">
                    <h3 className="bp-titulo">{item.titulo}</h3>
                    <p>{item.texto}</p>
                    <ul className="bp-onde" aria-label="Onde ver">
                      {item.onde.map((o) => (
                        <li key={o.rotulo}>
                          {o.arquivo ? (
                            <span className="bp-arquivo">
                              <FiFileText aria-hidden="true" />
                              <code>{o.rotulo}</code>
                            </span>
                          ) : (
                            <Link to={o.para} className="bp-link">
                              {o.rotulo}
                              <FiArrowRight aria-hidden="true" />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
