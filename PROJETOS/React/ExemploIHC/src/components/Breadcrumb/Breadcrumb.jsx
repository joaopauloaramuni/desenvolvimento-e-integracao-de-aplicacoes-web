import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

/**
 * Trilha de navegação: "onde estou e como volto?" (Aula 18 - o usuário
 * não deve se perder). O último item é a página atual (aria-current).
 *
 *   <Breadcrumb itens={[{ rotulo: "Recursos", para: "/recursos" }, { rotulo: "Cadastrar" }]} />
 */
export default function Breadcrumb({ itens }) {
  const todos = [{ rotulo: "Início", para: "/" }, ...itens];
  return (
    <nav aria-label="Você está em" className="breadcrumb no-print">
      <ol>
        {todos.map((item, i) => {
          const ultimo = i === todos.length - 1;
          return (
            <li key={item.rotulo}>
              {ultimo ? (
                <span aria-current="page">{item.rotulo}</span>
              ) : (
                <>
                  <Link to={item.para}>{item.rotulo}</Link>
                  <FiChevronRight aria-hidden="true" className="breadcrumb-seta" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
