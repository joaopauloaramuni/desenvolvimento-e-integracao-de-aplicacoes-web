// Peças reutilizadas pelos tutoriais: passos numerados, avisos, tabelas e links.
import { FiAlertTriangle, FiExternalLink, FiInfo, FiStar } from "react-icons/fi";

export function Link({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children ?? href.replace(/^https?:\/\//, "")}
      <FiExternalLink className="tut-link-icone" aria-label="(abre em nova aba)" />
    </a>
  );
}

// Link para outro tutorial desta mesma página
export function Ir({ para, children }) {
  return <a href={`#tutoriais-${para}`}>{children}</a>;
}

// Uma etapa do tutorial (ex.: "Parte 1, registrando o domínio")
export function Parte({ titulo, children }) {
  return (
    <section className="tut-parte">
      <h4 className="tut-parte-titulo">{titulo}</h4>
      {children}
    </section>
  );
}

// Lista numerada de passos. "inicio" continua a numeração da parte anterior.
export function Passos({ inicio = 1, children }) {
  return (
    <ol className="tut-passos" start={inicio} style={{ counterReset: `passo ${inicio - 1}` }}>
      {children}
    </ol>
  );
}

export function Passo({ titulo, children }) {
  return (
    <li className="tut-passo">
      {titulo && <p className="tut-passo-titulo">{titulo}</p>}
      {children}
    </li>
  );
}

const AVISOS = {
  atencao: { Icone: FiAlertTriangle, rotulo: "Atenção" },
  dica: { Icone: FiStar, rotulo: "Dica" },
  info: { Icone: FiInfo, rotulo: "Importante" },
};

export function Aviso({ tipo = "info", titulo, children }) {
  const { Icone, rotulo } = AVISOS[tipo];
  return (
    <aside className={`tut-aviso tut-aviso-${tipo}`}>
      <Icone aria-hidden="true" className="tut-aviso-icone" />
      <div>
        <p className="tut-aviso-titulo">{titulo ?? rotulo}</p>
        {children}
      </div>
    </aside>
  );
}

// Tabela simples: cabecalho = ["Tipo", "Host", ...], linhas = [["A", "@", ...], ...]
export function Tabela({ cabecalho, linhas, legenda }) {
  return (
    <div className="tut-tabela">
      <table>
        {legenda && <caption>{legenda}</caption>}
        <thead>
          <tr>
            {cabecalho.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i}>
              {linha.map((celula, j) => (
                <td key={j}>{celula}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Codigo({ children }) {
  return (
    <pre className="tut-codigo">
      <code>{children}</code>
    </pre>
  );
}
