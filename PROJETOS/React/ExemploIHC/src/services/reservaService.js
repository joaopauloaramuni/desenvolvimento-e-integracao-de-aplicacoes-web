import { LATENCIA_SIMULADA_MS } from "../config/appConfig";
import { RESERVAS } from "../data/seed";
import { lerJSON, salvarJSON } from "../utils/storage";
import { hojeISO } from "../utils/datas";

const CHAVE = "reservas";
const esperar = () => new Promise((r) => setTimeout(r, LATENCIA_SIMULADA_MS));

function todas() {
  return lerJSON(CHAVE, RESERVAS);
}

export async function listarReservas() {
  await esperar();
  return todas();
}

export function buscarReserva(id) {
  return todas().find((r) => r.id === id) ?? null;
}

export async function criarReserva(dados) {
  await esperar();
  const lista = todas();
  const maiorNumero = Math.max(1000, ...lista.map((r) => Number(r.id.split("-")[1])));
  const reserva = {
    ...dados,
    aluno: dados.aluno.trim(),
    motivo: dados.motivo.trim(),
    id: `R-${maiorNumero + 1}`,
    status: "pendente",
    solicitadaEm: hojeISO(),
  };
  salvarJSON(CHAVE, [reserva, ...lista]);
  return reserva;
}

// Retorna o status anterior, para permitir "Desfazer" (Nielsen #3)
export function alterarStatus(id, status) {
  const lista = todas();
  const anterior = lista.find((r) => r.id === id)?.status;
  salvarJSON(CHAVE, lista.map((r) => (r.id === id ? { ...r, status } : r)));
  return anterior;
}

export function restaurarReservasIniciais() {
  salvarJSON(CHAVE, RESERVAS);
}
