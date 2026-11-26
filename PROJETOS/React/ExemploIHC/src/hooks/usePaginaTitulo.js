import { useEffect, useRef } from "react";
import { APP } from "../config/appConfig";

let primeiraPagina = true;

/**
 * Em uma SPA a página não recarrega, então o leitor de tela não percebe a
 * troca de tela. Este hook resolve isso:
 *
 * 1. Atualiza o <title> da aba (WCAG 2.4.2 - página com título).
 * 2. Move o foco para o <h1> da nova página, que é anunciado pelo leitor
 *    de tela. Na primeira carga não move, para não "pular" a página.
 *
 *   const tituloRef = usePaginaTitulo("Cadastrar recurso");
 *   <h1 ref={tituloRef} tabIndex={-1}>Cadastrar recurso</h1>
 */
export default function usePaginaTitulo(titulo) {
  const ref = useRef(null);

  useEffect(() => {
    document.title = `${titulo} | ${APP.nome} - ${APP.instituicao}`;

    if (primeiraPagina) {
      primeiraPagina = false;
      return;
    }
    ref.current?.focus({ preventScroll: false });
  }, [titulo]);

  return ref;
}
