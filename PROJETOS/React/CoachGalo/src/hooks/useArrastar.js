import { useCallback, useEffect, useRef, useState } from "react";

const DISTANCIA_MIN = 6; // px antes de virar "arrasto" (abaixo disso é clique)

// Lê o alvo embaixo do ponteiro: elementos com data-alvo="titular:3", "reserva:0" ou "elenco"
function alvoEm(x, y) {
  const el = document.elementFromPoint(x, y)?.closest("[data-alvo]");
  if (!el) return null;
  const [tipo, i] = el.dataset.alvo.split(":");
  return { tipo, i: i === undefined ? undefined : Number(i), chave: el.dataset.alvo };
}

/**
 * Arrastar e soltar com Pointer Events (mouse, caneta e toque), sem biblioteca.
 *   const { iniciar, arrasto } = useArrastar(onSoltar);
 *   <div onPointerDown={(e) => iniciar(e, jogadorId)} />
 * arrasto = { id, x, y, alvo } enquanto o jogador está sendo arrastado.
 */
export default function useArrastar(onSoltar) {
  const [arrasto, setArrasto] = useState(null);
  const inicio = useRef(null);
  const soltar = useRef(onSoltar);
  const acabouDeArrastar = useRef(false);

  useEffect(() => {
    soltar.current = onSoltar;
  }, [onSoltar]);

  const iniciar = useCallback((evento, id) => {
    if (evento.button !== 0) return;
    inicio.current = { id, x: evento.clientX, y: evento.clientY, ativo: false, ponteiro: evento.pointerId };
  }, []);

  useEffect(() => {
    const mover = (e) => {
      const ini = inicio.current;
      if (!ini || e.pointerId !== ini.ponteiro) return;
      if (!ini.ativo && Math.hypot(e.clientX - ini.x, e.clientY - ini.y) < DISTANCIA_MIN) return;
      ini.ativo = true;
      e.preventDefault();
      setArrasto({ id: ini.id, x: e.clientX, y: e.clientY, alvo: alvoEm(e.clientX, e.clientY) });
    };

    const terminar = (e) => {
      const ini = inicio.current;
      inicio.current = null;
      if (!ini?.ativo) return;
      const alvo = e.type === "pointerup" ? alvoEm(e.clientX, e.clientY) : null;
      setArrasto(null);
      acabouDeArrastar.current = true;
      setTimeout(() => (acabouDeArrastar.current = false), 0);
      if (alvo) soltar.current(ini.id, alvo);
    };

    const cancelarComEsc = (e) => {
      if (e.key === "Escape" && inicio.current?.ativo) {
        inicio.current = null;
        setArrasto(null);
      }
    };

    window.addEventListener("pointermove", mover, { passive: false });
    window.addEventListener("pointerup", terminar);
    window.addEventListener("pointercancel", terminar);
    window.addEventListener("keydown", cancelarComEsc);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", terminar);
      window.removeEventListener("pointercancel", terminar);
      window.removeEventListener("keydown", cancelarComEsc);
    };
  }, []);

  // O clique que vem logo depois de soltar não deve selecionar o card
  const foiArrasto = useCallback(() => acabouDeArrastar.current, []);

  return { iniciar, arrasto, foiArrasto };
}
