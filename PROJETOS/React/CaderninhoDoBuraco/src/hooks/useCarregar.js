import { useCallback, useEffect, useRef, useState } from "react";
import { supabaseConfigurado } from "../config/supabaseClient";

/**
 * Carrega dados assíncronos com { dados, carregando, erro, recarregar }.
 * Ignora respostas que chegam depois de a tela mudar (ou de outra busca começar).
 * buscar precisa ser estável (useCallback) e muda quando os filtros mudam.
 */
export default function useCarregar(buscar, valorInicial) {
  const [estado, setEstado] = useState({
    dados: valorInicial,
    carregando: supabaseConfigurado,
    erro: null,
  });
  const contador = useRef(0);

  const executar = useCallback(async () => {
    if (!supabaseConfigurado) return;
    const minha = ++contador.current;
    setEstado((e) => ({ ...e, carregando: true }));
    try {
      const dados = await buscar();
      if (minha === contador.current) setEstado({ dados, carregando: false, erro: null });
    } catch (erro) {
      if (minha === contador.current) setEstado((e) => ({ ...e, carregando: false, erro }));
    }
  }, [buscar]);

  useEffect(() => {
    executar();
    return () => {
      contador.current++;
    };
  }, [executar]);

  const setDados = useCallback((atualizar) => {
    setEstado((e) => ({ ...e, dados: typeof atualizar === "function" ? atualizar(e.dados) : atualizar }));
  }, []);

  return { ...estado, recarregar: executar, setDados };
}
