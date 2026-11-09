import { useEffect, useReducer } from "react";
import { APP } from "../config/appConfig";
import { FORMACAO_PADRAO, getFormacao } from "../config/formacoes";
import { POSICOES } from "../config/posicoes";
import { getJogador } from "../services/elencoService";
import { distribuir, escalarMelhores } from "../services/escalacaoService";
import { gravarJSON, lerJSON } from "../utils/storage";

const vazio = (n) => Array(n).fill(null);

// Começa com a escalação salva ou com o melhor time no esquema padrão
function inicial() {
  const salvo = lerJSON(APP.CHAVE_STORAGE);
  const valido = (id) => (getJogador(id) ? id : null);
  if (salvo?.titulares?.length === APP.TITULARES) {
    return {
      formacao: getFormacao(salvo.formacao).id,
      titulares: salvo.titulares.map(valido),
      reservas: [...(salvo.reservas ?? []).map(valido), ...vazio(APP.RESERVAS)].slice(0, APP.RESERVAS),
      historico: [],
      ultima: null,
    };
  }
  return { formacao: FORMACAO_PADRAO, ...escalarMelhores(FORMACAO_PADRAO), historico: [], ultima: null };
}

/** Onde o jogador está: { tipo: "titular" | "reserva", i } ou { tipo: "elenco" } */
export function localizar(estado, id) {
  const t = estado.titulares.indexOf(id);
  if (t >= 0) return { tipo: "titular", i: t };
  const r = estado.reservas.indexOf(id);
  if (r >= 0) return { tipo: "reserva", i: r };
  return { tipo: "elenco" };
}

const foto = ({ formacao, titulares, reservas }) => ({ formacao, titulares, reservas });

function guardar(estado, novo, ultima) {
  return {
    ...novo,
    historico: [...estado.historico, foto(estado)].slice(-APP.HISTORICO_MAX),
    ultima,
  };
}

function mover(estado, id, destino) {
  const origem = localizar(estado, id);
  if (origem.tipo === destino.tipo && origem.i === destino.i) return estado;

  const titulares = [...estado.titulares];
  const reservas = [...estado.reservas];
  const lista = (tipo) => (tipo === "titular" ? titulares : reservas);

  const ocupante = destino.tipo === "elenco" ? null : lista(destino.tipo)[destino.i];
  if (origem.tipo !== "elenco") lista(origem.tipo)[origem.i] = null;
  if (destino.tipo !== "elenco") lista(destino.tipo)[destino.i] = id;
  // Troca: quem estava na vaga vai para o lugar de onde o outro saiu
  if (ocupante && origem.tipo !== "elenco") lista(origem.tipo)[origem.i] = ocupante;

  const jogador = getJogador(id);
  const vagas = getFormacao(estado.formacao).vagas;
  const texto =
    destino.tipo === "titular"
      ? `${jogador.nome} entrou de ${POSICOES[vagas[destino.i].pos].nome.toLowerCase()}`
      : destino.tipo === "reserva"
        ? `${jogador.nome} foi para o banco`
        : `${jogador.nome} saiu da escalação`;

  return guardar(estado, { formacao: estado.formacao, titulares, reservas }, texto);
}

function reducer(estado, acao) {
  switch (acao.tipo) {
    case "mover":
      return mover(estado, acao.id, acao.destino);

    case "formacao": {
      if (acao.id === estado.formacao) return estado;
      // Os mesmos 11 são redistribuídos nas vagas do esquema novo
      const { vagas } = getFormacao(acao.id);
      const { titulares } = distribuir(vagas, estado.titulares.filter(Boolean));
      return guardar(estado, { ...estado, formacao: acao.id, titulares }, `Esquema trocado para ${acao.id}`);
    }

    case "melhores":
      return guardar(estado, { formacao: estado.formacao, ...escalarMelhores(estado.formacao) }, "Escalados os melhores do elenco");

    case "limpar":
      return guardar(
        estado,
        { formacao: estado.formacao, titulares: vazio(APP.TITULARES), reservas: vazio(APP.RESERVAS) },
        "Escalação zerada"
      );

    case "desfazer": {
      const anterior = estado.historico.at(-1);
      if (!anterior) return estado;
      return { ...anterior, historico: estado.historico.slice(0, -1), ultima: "Última mudança desfeita" };
    }

    default:
      return estado;
  }
}

export default function useEscalacao() {
  const [estado, despachar] = useReducer(reducer, undefined, inicial);

  useEffect(() => {
    gravarJSON(APP.CHAVE_STORAGE, foto(estado));
  }, [estado]);

  return {
    estado,
    anterior: estado.historico.at(-1) ?? null,
    mover: (id, destino) => despachar({ tipo: "mover", id, destino }),
    trocarFormacao: (id) => despachar({ tipo: "formacao", id }),
    escalarMelhores: () => despachar({ tipo: "melhores" }),
    limpar: () => despachar({ tipo: "limpar" }),
    desfazer: () => despachar({ tipo: "desfazer" }),
  };
}
