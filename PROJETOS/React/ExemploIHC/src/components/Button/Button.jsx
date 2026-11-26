import { Link } from "react-router-dom";
import "./Button.css";

/**
 * Botão do Design System.
 *
 * variante:
 *  - "destaque"   cor de destaque (10%): só UMA ação principal por tela
 *  - "primario"   cor da marca: ações comuns
 *  - "secundario" contorno: ações alternativas (Cancelar, Voltar)
 *  - "fantasma"   sem fundo: ações de menor peso
 *  - "perigo"     ações destrutivas (Rejeitar, Excluir)
 *
 * carregando: mostra o andamento e evita duplo clique (Nielsen #1 e #5).
 * iconeFinal: ícone depois do texto (ex.: seta de "Continuar").
 * para: vira um <Link> com aparência de botão (navegação continua sendo link).
 */
export default function Button({
  children,
  variante = "primario",
  tamanho = "md",
  icone: Icone,
  iconeFinal: IconeFinal,
  carregando = false,
  textoCarregando,
  blocoInteiro = false,
  para,
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variante}`,
    `btn-${tamanho}`,
    blocoInteiro ? "btn-bloco" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const conteudo = (
    <>
      {carregando ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        Icone && <Icone className="btn-icone" aria-hidden="true" />
      )}
      <span>{carregando && textoCarregando ? textoCarregando : children}</span>
      {IconeFinal && !carregando && <IconeFinal className="btn-icone" aria-hidden="true" />}
    </>
  );

  if (para) {
    return (
      <Link to={para} className={classes} {...props}>
        {conteudo}
      </Link>
    );
  }

  const { onClick, ...resto } = props;

  return (
    <button
      type="button"
      className={classes}
      aria-busy={carregando || undefined}
      aria-disabled={carregando || undefined}
      {...resto}
      onClick={carregando ? (e) => e.preventDefault() : onClick}
    >
      {conteudo}
    </button>
  );
}
