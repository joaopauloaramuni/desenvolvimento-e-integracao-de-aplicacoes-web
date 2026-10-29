import { useState } from "react";
import { TbClick, TbExternalLink, TbRefresh } from "react-icons/tb";
import CodeBlock from "../CodeBlock/CodeBlock";
import "./ComponentDetails.css";

/**
 * Tudo sobre o componente escolhido: o que faz, a demonstração ao vivo,
 * o código para copiar e a tabela de props.
 */
const ComponentDetails = ({ component }) => {
  const {
    icon: Icon,
    name,
    category,
    docs,
    description,
    tip,
    Demo,
    demoFile,
    demoCode,
    uiFile,
    uiCode,
    deps,
    props,
  } = component;

  // Mudar a key desmonta e monta a demonstração de novo = a animação recomeça
  const [replay, setReplay] = useState(0);

  return (
    <article className="component-details">
      <header className="component-details-header">
        <span className="component-details-icon">
          <Icon aria-hidden="true" />
        </span>

        <div className="component-details-title">
          <h2>{name}</h2>
          <p>Aceternity UI / {category}</p>
        </div>

        <a className="component-details-docs" href={docs} target="_blank" rel="noreferrer">
          Ver no ui.aceternity.com
          <TbExternalLink aria-hidden="true" />
        </a>
      </header>

      <p className="component-details-description">{description}</p>

      <p className="component-details-tip">
        <TbClick aria-hidden="true" />
        {tip}
      </p>

      <div className="component-details-heading">
        <h3>Demonstração</h3>
        <button
          type="button"
          className="component-details-replay"
          onClick={() => setReplay((count) => count + 1)}
        >
          <TbRefresh aria-hidden="true" />
          Reiniciar animação
        </button>
      </div>

      <div className="component-details-stage">
        <Demo key={replay} />
      </div>

      <h3>Como usar</h3>
      <CodeBlock title={`src/components/demos/${demoFile}`} code={demoCode} />

      {uiCode && (
        <details className="component-details-source">
          <summary>
            Código do componente <code>src/components/ui/{uiFile}</code>
          </summary>
          <CodeBlock title={`src/components/ui/${uiFile}`} code={uiCode} />
        </details>
      )}

      <p className="component-details-deps">
        Precisa de:{" "}
        {deps.map((dep) => (
          <code key={dep}>{dep}</code>
        ))}
      </p>

      {props.length > 0 && (
        <>
          <h3>Props</h3>
          <div className="component-details-table">
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Tipo</th>
                  <th>O que faz</th>
                </tr>
              </thead>
              <tbody>
                {props.map(([prop, type, info]) => (
                  <tr key={prop}>
                    <td>
                      <code>{prop}</code>
                    </td>
                    <td>
                      <code>{type}</code>
                    </td>
                    <td>{info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </article>
  );
};

export default ComponentDetails;
