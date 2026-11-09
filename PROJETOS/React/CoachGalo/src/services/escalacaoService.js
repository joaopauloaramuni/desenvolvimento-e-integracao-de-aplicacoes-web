import { APP, ESCALA } from "../config/appConfig";
import { FORMACOES, getFormacao } from "../config/formacoes";
import { PENALIDADE, PESOS, POSICOES } from "../config/posicoes";
import { getJogador, getJogadores } from "./elencoService";

// ---------------------------------------------------------------
// Encaixe do jogador na vaga
// ---------------------------------------------------------------

/** Como o jogador se encaixa numa posição: natural, secundaria, vizinha, improvisado ou goleiro */
export function encaixe(jogador, pos) {
  if (!jogador) return null;
  if (jogador.posicao === pos) return "natural";
  if ((jogador.posicao === "GOL") !== (pos === "GOL")) return "goleiro";
  if (jogador.secundarias.includes(pos)) return "secundaria";
  if (POSICOES[jogador.posicao]?.vizinhas.includes(pos)) return "vizinha";
  return "improvisado";
}

/** Overall do jogador naquela posição (com a perda por jogar fora de posição) */
export const overallNaPosicao = (jogador, pos) =>
  jogador ? Math.max(20, jogador.overall - PENALIDADE[encaixe(jogador, pos)]) : 0;

// ---------------------------------------------------------------
// Força do time por setor
// ---------------------------------------------------------------

// Quanto "peso" cada setor tem, em média, nos esquemas. Serve de referência:
// um esquema com mais gente na defesa ganha força defensiva e perde no ataque.
const REFERENCIA = (() => {
  const soma = { ataque: 0, meio: 0, defesa: 0, goleiro: 0 };
  FORMACOES.forEach((f) =>
    f.vagas.forEach((v) => Object.entries(PESOS[v.pos]).forEach(([s, p]) => (soma[s] += p)))
  );
  return Object.fromEntries(Object.entries(soma).map(([s, v]) => [s, v / FORMACOES.length]));
})();

const VAGA_VAZIA = 35; // vaga sem ninguém conta como um jogador muito fraco
const BONUS_QUANTIDADE = 3; // pontos por "jogador a mais" no setor

const limitar = (n) => Math.round(Math.max(0, Math.min(99, n)));

/**
 * Calcula a força do time.
 * Setor = média ponderada do overall (na posição) de quem joga ali
 *       + bônus/penalidade pela quantidade de gente no setor no esquema.
 */
export function calcularForca(formacaoId, titulares) {
  const { vagas } = getFormacao(formacaoId);
  const soma = { ataque: 0, meio: 0, defesa: 0, goleiro: 0 };
  const peso = { ataque: 0, meio: 0, defesa: 0, goleiro: 0 };
  let somaOverall = 0;
  let entrosamento = 0;
  let escalados = 0;

  vagas.forEach((vaga, i) => {
    const jogador = getJogador(titulares[i]);
    const nota = jogador ? overallNaPosicao(jogador, vaga.pos) : VAGA_VAZIA;
    Object.entries(PESOS[vaga.pos]).forEach(([setor, p]) => {
      soma[setor] += nota * p;
      peso[setor] += p;
    });
    somaOverall += nota;
    if (jogador) {
      escalados += 1;
      entrosamento += { natural: 100, secundaria: 85, vizinha: 60, improvisado: 25, goleiro: 0 }[
        encaixe(jogador, vaga.pos)
      ];
    }
  });

  const setor = (s) => limitar(soma[s] / peso[s] + (peso[s] - REFERENCIA[s]) * BONUS_QUANTIDADE);

  return {
    ataque: setor("ataque"),
    meio: setor("meio"),
    defesa: setor("defesa"),
    goleiro: limitar(soma.goleiro / peso.goleiro),
    geral: limitar(somaOverall / vagas.length),
    entrosamento: Math.round((entrosamento / vagas.length)),
    escalados,
  };
}

// ---------------------------------------------------------------
// Distribuição automática (esquema novo e "Escalar melhores")
// ---------------------------------------------------------------

/**
 * Põe os jogadores nas vagas maximizando o overall na posição.
 * Guloso: ordena todos os pares (jogador, vaga) pela nota e vai preenchendo.
 * Vagas mais "difíceis" (goleiro, laterais) desempatam primeiro.
 */
export function distribuir(vagas, ids) {
  const pares = [];
  ids.forEach((id) => {
    const j = getJogador(id);
    if (!j) return;
    vagas.forEach((v, i) => pares.push({ id, i, nota: overallNaPosicao(j, v.pos), natural: j.posicao === v.pos }));
  });
  pares.sort((a, b) => b.nota - a.nota || Number(b.natural) - Number(a.natural));

  const resultado = Array(vagas.length).fill(null);
  const usados = new Set();
  pares.forEach(({ id, i }) => {
    if (resultado[i] || usados.has(id)) return;
    resultado[i] = id;
    usados.add(id);
  });
  return { titulares: resultado, sobra: ids.filter((id) => !usados.has(id)) };
}

/** Melhor time possível no esquema + banco com os melhores que sobraram (com um goleiro) */
export function escalarMelhores(formacaoId) {
  const { vagas } = getFormacao(formacaoId);
  const todos = getJogadores().map((j) => j.id);
  const { titulares, sobra } = distribuir(vagas, todos);

  const restantes = sobra.map(getJogador).sort((a, b) => b.overall - a.overall);
  const goleiro = restantes.find((j) => j.posicao === "GOL");
  const banco = [goleiro, ...restantes.filter((j) => j !== goleiro)]
    .filter(Boolean)
    .slice(0, APP.RESERVAS)
    .map((j) => j.id);

  return { titulares, reservas: [...banco, ...Array(APP.RESERVAS - banco.length).fill(null)] };
}

// ---------------------------------------------------------------
// Texto da escalação (botão "Copiar")
// ---------------------------------------------------------------

export function escalacaoEmTexto({ formacao, titulares, reservas }) {
  const { vagas } = getFormacao(formacao);
  const forca = calcularForca(formacao, titulares);
  const linhas = vagas.map((v, i) => `${v.pos.padEnd(3)}  ${getJogador(titulares[i])?.nome ?? "-"}`);
  const banco = reservas.map(getJogador).filter(Boolean).map((j) => j.nome);
  return [
    `Galo no ${formacao} (CoachGalo)`,
    "",
    ...linhas,
    "",
    `Banco: ${banco.join(", ") || "-"}`,
    "",
    `Geral ${forca.geral} | Ataque ${forca.ataque} | Meio ${forca.meio} | Defesa ${forca.defesa} | Goleiro ${forca.goleiro}`,
  ].join("\n");
}

export const percentual = (valor) => ((valor - ESCALA.MIN) / (ESCALA.MAX - ESCALA.MIN)) * 100;
