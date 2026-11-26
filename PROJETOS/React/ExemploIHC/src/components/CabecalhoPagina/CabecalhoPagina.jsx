import { forwardRef } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import "./CabecalhoPagina.css";

/**
 * Topo padrão de toda página: trilha + título (h1 único) + descrição + ações.
 * Mesma estrutura em todas as telas = consistência e padrão reconhecível.
 * O ref vai no <h1>, que recebe o foco quando a página abre.
 */
const CabecalhoPagina = forwardRef(function CabecalhoPagina({ titulo, descricao, trilha, acoes }, ref) {
  return (
    <header className="cabecalho-pagina">
      {trilha && <Breadcrumb itens={trilha} />}
      <div className="cabecalho-pagina-linha">
        <div className="cabecalho-pagina-textos">
          <h1 ref={ref} tabIndex={-1}>
            {titulo}
          </h1>
          {descricao && <p className="cabecalho-pagina-descricao">{descricao}</p>}
        </div>
        {acoes && <div className="cabecalho-pagina-acoes no-print">{acoes}</div>}
      </div>
    </header>
  );
});

export default CabecalhoPagina;
