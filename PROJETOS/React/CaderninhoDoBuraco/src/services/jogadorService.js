import APP_CONFIG from "../config/appConfig";
import { DadosInvalidosException, JogadorComPontosException, JogadorJaExisteException } from "../core/exceptions";
import * as jogadorRepository from "../repository/jogadorRepository";
import { PG } from "../repository/base";

/**
 * Regras do cadastro de jogadores.
 */

function normalizarNome(nome) {
  const limpo = (nome ?? "").replace(/\s+/g, " ").trim();
  if (!limpo) throw new DadosInvalidosException("Digite o nome do jogador.");
  if (limpo.length > 40) throw new DadosInvalidosException("Use até 40 letras no nome.");
  return limpo;
}

/** A primeira cor da paleta que ninguém está usando (ou a que repete menos). */
export function proximaCor(jogadores) {
  const uso = new Map(APP_CONFIG.CORES_JOGADOR.map((c) => [c, 0]));
  for (const j of jogadores) if (uso.has(j.cor)) uso.set(j.cor, uso.get(j.cor) + 1);
  return [...uso.entries()].sort((a, b) => a[1] - b[1])[0][0];
}

/** A primeira figura que ninguém está usando. */
export function proximaCarta(jogadores) {
  const usadas = new Set(jogadores.map((j) => j.carta));
  return (APP_CONFIG.CARTAS_AVATAR.find((c) => !usadas.has(c.id)) ?? APP_CONFIG.CARTAS_AVATAR[0]).id;
}

export function listarJogadores() {
  return jogadorRepository.findAll();
}

export async function cadastrarJogador({ nome, carta, cor }) {
  const limpo = normalizarNome(nome);
  try {
    return await jogadorRepository.save({ nome: limpo, carta, cor });
  } catch (e) {
    if (e.code === PG.UNIQUE_VIOLATION) throw new JogadorJaExisteException(limpo);
    throw e;
  }
}

export async function atualizarJogador(id, { nome, carta, cor, ativo }) {
  const campos = { carta, cor, ativo };
  if (nome !== undefined) campos.nome = normalizarNome(nome);
  try {
    return await jogadorRepository.update(id, campos);
  } catch (e) {
    if (e.code === PG.UNIQUE_VIOLATION) throw new JogadorJaExisteException(campos.nome);
    throw e;
  }
}

export async function excluirJogador(jogador) {
  try {
    await jogadorRepository.deleteById(jogador.id);
  } catch (e) {
    if (e.code === PG.FOREIGN_KEY_VIOLATION) throw new JogadorComPontosException(jogador.nome);
    throw e;
  }
}
