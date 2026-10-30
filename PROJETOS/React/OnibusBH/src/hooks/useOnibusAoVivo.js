import { useEffect, useRef, useState } from "react";
import { TEMPO_REAL } from "../config/appConfig";
import { buscarOnibus, statusTempoReal } from "../services/tempoRealService";

/**
 * Posição ao vivo dos ônibus de uma ou mais linhas (route_id do GTFS).
 * Pergunta ao servidor a cada 20 s e pausa quando a aba fica escondida.
 *
 * situacao: "carregando" | "ao-vivo" | "desligado" | "erro"
 */
export default function useOnibusAoVivo(rotas) {
  const chave = rotas.join(",");
  const [estado, setEstado] = useState({ chave: null, situacao: "carregando", veiculos: [], atualizadoEm: null, erro: null });
  const temporizador = useRef(null);

  useEffect(() => {
    if (!chave) return undefined;
    let ativo = true;

    const agendar = () => {
      clearTimeout(temporizador.current);
      temporizador.current = setTimeout(atualizar, TEMPO_REAL.INTERVALO_MS);
    };

    async function atualizar() {
      if (document.hidden) return; // volta quando a aba aparecer
      try {
        const dados = await buscarOnibus(chave.split(","));
        if (!ativo) return;
        setEstado({ chave, situacao: "ao-vivo", veiculos: dados.veiculos, atualizadoEm: dados.atualizadoEm, erro: null });
        agendar();
      } catch (erro) {
        if (!ativo) return;
        const desligado = erro.codigo === "sem_url" || erro.codigo === "sem_api";
        setEstado((anterior) => ({
          ...anterior,
          chave,
          situacao: desligado ? "desligado" : "erro",
          erro: erro.message,
          // Num erro passageiro, os ônibus da última foto continuam no mapa
          veiculos: desligado ? [] : anterior.chave === chave ? anterior.veiculos : [],
        }));
        if (!desligado) agendar();
      }
    }

    // Primeiro confirma se o tempo real está ligado no servidor
    statusTempoReal()
      .then(({ tempoReal }) => {
        if (!ativo) return;
        if (tempoReal) atualizar();
        else setEstado({ chave, situacao: "desligado", veiculos: [], atualizadoEm: null, erro: null });
      })
      .catch((erro) => ativo && setEstado({ chave, situacao: "desligado", veiculos: [], atualizadoEm: null, erro: erro.message }));

    const aoVoltar = () => {
      if (!document.hidden) atualizar();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      ativo = false;
      clearTimeout(temporizador.current);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [chave]);

  if (estado.chave !== chave) return { situacao: "carregando", veiculos: [], atualizadoEm: null, erro: null };
  return estado;
}
