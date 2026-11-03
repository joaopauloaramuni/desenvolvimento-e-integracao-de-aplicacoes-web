import { DadosInvalidosException, NaoEncontradoException } from "../core/exceptions";
import { PG } from "../repository/base";
import * as partidaRepository from "../repository/partidaRepository";

/**
 * Regras das partidas (um dia de jogo com os jogadores daquele dia).
 */

function validar({ data, jogadorIds }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data ?? "")) {
    throw new DadosInvalidosException("Escolha a data do jogo.");
  }
  if (!jogadorIds || jogadorIds.length < 2) {
    throw new DadosInvalidosException("Escolha pelo menos 2 jogadores.");
  }
}

export function listarPartidas() {
  return partidaRepository.findAll();
}

export async function buscarPartida(id) {
  const partida = await partidaRepository.findById(id);
  if (!partida) throw new NaoEncontradoException("Essa partida não existe ou foi excluída.");
  return partida;
}

/** Cria a partida e devolve o id. */
export async function criarPartida(dados) {
  validar(dados);
  return partidaRepository.save(dados);
}

export async function atualizarPartida(id, dados) {
  validar(dados);
  try {
    await partidaRepository.update(id, dados);
  } catch (e) {
    if (e.code === PG.FOREIGN_KEY_VIOLATION || e.code === PG.NO_DATA_FOUND) {
      throw new DadosInvalidosException(e.message);
    }
    throw e;
  }
}

export function excluirPartida(id) {
  return partidaRepository.deleteById(id);
}
