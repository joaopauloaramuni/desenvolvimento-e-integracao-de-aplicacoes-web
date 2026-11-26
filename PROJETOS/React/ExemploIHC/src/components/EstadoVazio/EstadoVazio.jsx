import "./EstadoVazio.css";

/**
 * Estado vazio: em vez de uma tela em branco, explica o que aconteceu e
 * oferece o próximo passo (uma tela vazia é um convite para agir).
 */
export default function EstadoVazio({ icone: Icone, titulo, children, acao }) {
  return (
    <div className="estado-vazio">
      {Icone && <Icone className="estado-vazio-icone" aria-hidden="true" />}
      <h2 className="estado-vazio-titulo">{titulo}</h2>
      {children && <div className="estado-vazio-texto">{children}</div>}
      {acao && <div className="estado-vazio-acao">{acao}</div>}
    </div>
  );
}
