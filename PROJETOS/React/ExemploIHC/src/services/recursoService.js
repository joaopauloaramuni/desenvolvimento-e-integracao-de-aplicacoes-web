import { LATENCIA_SIMULADA_MS } from "../config/appConfig";
import { RECURSOS } from "../data/seed";
import { lerJSON, salvarJSON } from "../utils/storage";

/**
 * "Back-end" simulado dos recursos audiovisuais.
 * Os dados ficam no localStorage; a latência existe só para o exemplo
 * mostrar os estados de carregamento (skeleton screens - Aula 18).
 */

const CHAVE = "recursos";
const esperar = () => new Promise((r) => setTimeout(r, LATENCIA_SIMULADA_MS));

function todos() {
  return lerJSON(CHAVE, RECURSOS);
}

export async function listarRecursos() {
  await esperar();
  return todos();
}

export function buscarRecurso(codigo) {
  return todos().find((r) => r.codigo === codigo) ?? null;
}

export function codigosCadastrados() {
  return todos().map((r) => r.codigo.toUpperCase());
}

export async function cadastrarRecurso(dados) {
  await esperar();
  const recurso = {
    ...dados,
    codigo: dados.codigo.trim().toUpperCase(),
    nome: dados.nome.trim(),
    observacoes: dados.observacoes.trim(),
  };
  salvarJSON(CHAVE, [recurso, ...todos()]);
  return recurso;
}

export function restaurarRecursosIniciais() {
  salvarJSON(CHAVE, RECURSOS);
}
