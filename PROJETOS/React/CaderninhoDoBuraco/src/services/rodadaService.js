import { DadosInvalidosException } from "../core/exceptions";
import Pontuacao from "../model/Pontuacao";
import { PG } from "../repository/base";
import * as rodadaRepository from "../repository/rodadaRepository";
import { contarPontuacao, definirVencedores } from "./contagemService";

/**
 * Regras das rodadas: transforma o que foi digitado no formulário em
 * pontuações (com a contagem das cartas) e decide quem ganhou.
 */

/** Estado inicial do formulário de um jogador (rodada nova ou edição). */
export function formularioInicial(pontuacao) {
  if (!pontuacao) {
    return { modo: "cartas", jogosTexto: "", maoTexto: "", bateu: false, ajuste: "", totalManual: "" };
  }
  return {
    modo: pontuacao.modo,
    jogosTexto: pontuacao.jogosTexto,
    maoTexto: pontuacao.maoTexto,
    bateu: pontuacao.bateu,
    ajuste: pontuacao.ajuste ? String(pontuacao.ajuste) : "",
    totalManual: pontuacao.modo === "total" ? String(pontuacao.total) : "",
  };
}

/**
 * Conta todos os jogadores. Recebe { [jogadorId]: formulario } e devolve
 * { contagens: { [jogadorId]: contagem }, vencedores: Set, erros: [] }.
 */
export function contarRodada(jogadorIds, formularios) {
  const contagens = {};
  for (const id of jogadorIds) contagens[id] = contarPontuacao(formularios[id]);

  const vencedores = definirVencedores(
    jogadorIds.map((id) => ({ jogadorId: id, total: contagens[id].total, bateu: contagens[id].bateu }))
  );

  return { contagens, vencedores };
}

/** Salva a rodada nova (rodadaId = null) ou a editada. Devolve o id da rodada. */
export async function salvarRodada({ partidaId, rodadaId = null, jogadores, formularios }) {
  const ids = jogadores.map((j) => j.id);
  const { contagens, vencedores } = contarRodada(ids, formularios);

  for (const j of jogadores) {
    const c = contagens[j.id];
    if (c.erros.length) throw new DadosInvalidosException(`${j.nome}: ${c.erros[0]}`);
  }
  const bateram = ids.filter((id) => contagens[id].bateu);
  if (bateram.length > 1) throw new DadosInvalidosException("Só uma pessoa bate por rodada.");

  const pontuacoes = jogadores.map((j) => {
    const c = contagens[j.id];
    const f = formularios[j.id];
    return new Pontuacao({
      jogadorId: j.id,
      modo: c.modo,
      jogosTexto: c.modo === "cartas" ? f.jogosTexto.trim() : "",
      maoTexto: c.modo === "cartas" ? f.maoTexto.trim() : "",
      // Guarda os jogos já lidos (cartas, curingas e tipo da canastra)
      jogos: c.jogos.map((jogo) => ({
        naipe: jogo.naipe,
        tipo: jogo.tipo,
        pontos: jogo.pontos,
        bonus: jogo.bonus,
        cartas: jogo.cartas,
      })),
      pontosCartas: c.pontosCartas,
      canastrasLimpas: c.canastrasLimpas,
      canastrasSujas: c.canastrasSujas,
      canastrasReais: c.canastrasReais,
      pontosCanastras: c.pontosCanastras,
      bateu: c.bateu,
      pontosBatida: c.pontosBatida,
      pontosMao: c.pontosMao,
      ajuste: c.ajuste,
      total: c.total,
      venceu: vencedores.has(j.id),
    });
  });

  try {
    return await rodadaRepository.save(partidaId, rodadaId, pontuacoes);
  } catch (e) {
    if (e.code === PG.UNIQUE_VIOLATION) {
      throw new DadosInvalidosException("Alguém lançou uma rodada ao mesmo tempo. Recarregue a partida e tente de novo.");
    }
    throw e;
  }
}

export function excluirRodada(rodadaId) {
  return rodadaRepository.deleteById(rodadaId);
}
