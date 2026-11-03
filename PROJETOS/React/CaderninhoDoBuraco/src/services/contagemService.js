import APP_CONFIG from "../config/appConfig.js";

/**
 * Contagem de pontos de uma rodada de buraco.
 *
 * Vocês digitam os jogos baixados na mesa, um por linha, do jeito que falam:
 *
 *   2, 3, 4
 *   7, 8, 9, 10
 *   Ás, 2, 3
 *   8, coringa joker, 10
 *
 * e este arquivo lê as cartas, soma os pontos, descobre quais jogos são
 * canastras (limpa, suja ou real, de Ás a Ás) e desconta as cartas da mão.
 * Não depende de React nem do Supabase: dá para testar no Node.
 */

const { REGRAS } = APP_CONFIG;

/** A ordem de uma sequência de buraco (o Ás pode fechar depois do K). */
export const ORDEM_VALORES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/** Os naipes, com o símbolo e a cor. */
export const NAIPES = {
  copas: { simbolo: "♥", nome: "copas", vermelho: true },
  ouros: { simbolo: "♦", nome: "ouros", vermelho: true },
  espadas: { simbolo: "♠", nome: "espadas", vermelho: false },
  paus: { simbolo: "♣", nome: "paus", vermelho: false },
};

const PALAVRAS_NAIPE = {
  copas: "copas",
  copa: "copas",
  "♥": "copas",
  ouros: "ouros",
  ouro: "ouros",
  "♦": "ouros",
  espadas: "espadas",
  espada: "espadas",
  "♠": "espadas",
  paus: "paus",
  pau: "paus",
  "♣": "paus",
};

// Como cada carta pode ser escrita (sem acento e em minúsculas)
const PALAVRAS_CARTA = {
  a: "A",
  as: "A",
  ace: "A",
  1: "A",
  j: "J",
  valete: "J",
  q: "Q",
  dama: "Q",
  k: "K",
  rei: "K",
  joker: "JOKER",
  coringa: "JOKER",
  jk: "JOKER",
};
for (const n of ["2", "3", "4", "5", "6", "7", "8", "9", "10"]) PALAVRAS_CARTA[n] = n;

export class ErroDeLeitura extends Error {
  constructor(message) {
    super(message);
    this.name = "ErroDeLeitura";
  }
}

/** "Ás" -> "as", "  JOKER " -> "joker" */
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Pontos de uma carta ("A" -> 15, "JOKER" -> 20). */
export function valorDaCarta(valor) {
  return REGRAS.VALOR_CARTA[valor] ?? 0;
}

/**
 * Lê uma lista de cartas escrita à mão: "8, coringa joker, 10" ou "A 2 3".
 * O 2 pode ser marcado como curinga escrevendo "2*" ou "2 curinga".
 * Devolve [{ valor, forcarCuringa }].
 */
export function lerCartas(texto) {
  const limpo = normalizar(texto)
    .replace(/[()[\]]/g, " ")
    .replace(/\b(coringa\s+joker|joker\s+coringa)\b/g, "joker")
    .replace(/\b2\s*(\*|curinga)/g, "2*")
    .replace(/\bcuringa\b/g, "2*");

  const tokens = limpo.split(/[,;\s]+/).filter(Boolean);

  return tokens.map((token) => {
    if (token === "2*") return { valor: "2", forcarCuringa: true };
    const valor = PALAVRAS_CARTA[token];
    if (!valor) {
      throw new ErroDeLeitura(`Não entendi a carta "${token}".`);
    }
    return { valor, forcarCuringa: false };
  });
}

/**
 * Decide quais cartas estão como curinga dentro de um jogo:
 * - o Joker é sempre curinga;
 * - o 2 é natural quando está no lugar dele (logo antes do 3, ou logo depois
 *   do Ás que abre a sequência). Fora disso, está fazendo papel de curinga.
 *   Só um 2 natural por jogo.
 */
function marcarCuringas(cartas) {
  let temDoisNatural = false;

  return cartas.map((carta, i) => {
    if (carta.valor === "JOKER") return { valor: carta.valor, curinga: true };
    if (carta.valor !== "2") return { valor: carta.valor, curinga: false };
    if (carta.forcarCuringa) return { valor: "2", curinga: true };

    const anterior = cartas[i - 1]?.valor;
    const proxima = cartas[i + 1]?.valor;
    const noLugar = proxima === "3" || (anterior === "A" && i === 1);

    if (noLugar && !temDoisNatural) {
      temDoisNatural = true;
      return { valor: "2", curinga: false };
    }
    return { valor: "2", curinga: true };
  });
}

/** true se as 14 cartas são A, 2, 3 ... K, A, todas naturais. */
function ehDeAsAAs(cartas) {
  if (cartas.length !== ORDEM_VALORES.length + 1) return false;
  if (cartas.some((c) => c.curinga)) return false;

  const contagem = {};
  for (const c of cartas) contagem[c.valor] = (contagem[c.valor] ?? 0) + 1;
  return ORDEM_VALORES.every((v) => contagem[v] === (v === "A" ? 2 : 1));
}

/**
 * Classifica um jogo (uma linha):
 *   tipo "jogo"  -> menos de 7 cartas, sem bônus
 *   tipo "suja"  -> canastra com curinga       (+100)
 *   tipo "limpa" -> canastra sem curinga       (+200)
 *   tipo "real"  -> limpa de Ás a Ás           (+1000, no lugar dos 200)
 */
export function classificarJogo(cartasLidas, naipe = null) {
  const cartas = marcarCuringas(cartasLidas);
  const curingas = cartas.filter((c) => c.curinga).length;
  const pontos = cartas.reduce((soma, c) => soma + valorDaCarta(c.valor), 0);

  let tipo = "jogo";
  let bonus = 0;
  if (cartas.length >= REGRAS.TAMANHO_CANASTRA) {
    if (curingas > 0) {
      tipo = "suja";
      bonus = REGRAS.CANASTRA_SUJA;
    } else if (ehDeAsAAs(cartas)) {
      tipo = "real";
      bonus = REGRAS.CANASTRA_REAL;
    } else {
      tipo = "limpa";
      bonus = REGRAS.CANASTRA_LIMPA;
    }
  }

  const avisos = [];
  if (cartas.length < REGRAS.TAMANHO_MINIMO_JOGO) {
    avisos.push(`Jogo com ${cartas.length} carta${cartas.length === 1 ? "" : "s"}: no buraco o mínimo é ${REGRAS.TAMANHO_MINIMO_JOGO}.`);
  }
  if (curingas > 1) {
    avisos.push("Mais de um curinga no mesmo jogo.");
  }

  return { naipe, cartas, pontos, curingas, tipo, bonus, avisos };
}

/**
 * Lê o texto dos jogos baixados (um jogo por linha). A linha pode começar
 * com o naipe, só para enfeitar a visualização: "copas: A, 2, 3".
 * Devolve { jogos, erros }, sem lançar: o formulário mostra os erros na hora.
 */
export function lerJogos(texto) {
  const jogos = [];
  const erros = [];

  const linhas = (texto ?? "").split(/\r?\n|\|/);
  linhas.forEach((linhaOriginal, indice) => {
    let linha = linhaOriginal.trim();
    if (!linha) return;

    let naipe = null;
    const prefixo = normalizar(linha).match(/^(copas?|ouros?|espadas?|paus?|♥|♦|♠|♣)\s*[:\-–]?\s*/);
    if (prefixo) {
      naipe = PALAVRAS_NAIPE[prefixo[1]];
      linha = linha.slice(prefixo[0].length);
    }

    try {
      const cartas = lerCartas(linha);
      if (cartas.length > 0) jogos.push(classificarJogo(cartas, naipe));
    } catch (e) {
      erros.push(`Linha ${indice + 1}: ${e.message}`);
    }
  });

  return { jogos, erros };
}

/**
 * Cartas que sobraram na mão. Aceita o número ("30") ou as cartas ("K, 7, coringa").
 * Devolve { pontos, cartas, erro } com pontos sempre positivos (o desconto é -pontos).
 */
export function lerMao(texto) {
  const limpo = (texto ?? "").trim();
  if (!limpo) return { pontos: 0, cartas: [], erro: null };

  if (/^[-−]?\s*\d+$/.test(limpo)) {
    return { pontos: Math.abs(parseInt(limpo.replace(/[−\s]/g, ""), 10)), cartas: [], erro: null };
  }

  try {
    const cartas = lerCartas(limpo).map((c) => ({ valor: c.valor, curinga: c.valor === "JOKER" || c.forcarCuringa }));
    return { pontos: cartas.reduce((s, c) => s + valorDaCarta(c.valor), 0), cartas, erro: null };
  } catch (e) {
    return { pontos: 0, cartas: [], erro: `Cartas na mão: ${e.message}` };
  }
}

/** "", "-", "+" viram 0; "25" e "-25" viram número. */
function inteiro(valor) {
  const n = parseInt(String(valor ?? "").replace("−", "-"), 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Conta a rodada de um jogador. Recebe o que foi digitado no formulário:
 *   { modo: "cartas" | "total", jogosTexto, maoTexto, bateu, ajuste, totalManual }
 * e devolve todas as parcelas, prontas para salvar.
 */
export function contarPontuacao({ modo = "cartas", jogosTexto = "", maoTexto = "", bateu = false, ajuste = 0, totalManual = "" }) {
  if (modo === "total") {
    const total = inteiro(totalManual);
    return {
      modo,
      jogos: [],
      erros: String(totalManual).trim() === "" ? ["Digite o total da rodada."] : [],
      avisos: [],
      pontosCartas: 0,
      canastrasLimpas: 0,
      canastrasSujas: 0,
      canastrasReais: 0,
      pontosCanastras: 0,
      bateu,
      pontosBatida: 0,
      maoCartas: [],
      pontosMao: 0,
      ajuste: 0,
      total,
    };
  }

  const { jogos, erros } = lerJogos(jogosTexto);
  const mao = lerMao(maoTexto);
  if (mao.erro) erros.push(mao.erro);

  const pontosCartas = jogos.reduce((s, j) => s + j.pontos, 0);
  const contar = (tipo) => jogos.filter((j) => j.tipo === tipo).length;
  const pontosCanastras = jogos.reduce((s, j) => s + j.bonus, 0);
  const pontosBatida = bateu ? REGRAS.BATIDA : 0;
  const pontosMao = -mao.pontos;
  const ajusteNumero = inteiro(ajuste);

  return {
    modo,
    jogos,
    erros,
    avisos: jogos.flatMap((j, i) => j.avisos.map((a) => `Jogo ${i + 1}: ${a}`)),
    pontosCartas,
    canastrasLimpas: contar("limpa"),
    canastrasSujas: contar("suja"),
    canastrasReais: contar("real"),
    pontosCanastras,
    bateu,
    pontosBatida,
    maoCartas: mao.cartas,
    pontosMao,
    ajuste: ajusteNumero,
    total: pontosCartas + pontosCanastras + pontosBatida + pontosMao + ajusteNumero,
  };
}

/**
 * Quem ganhou a rodada: o maior total. Empate? Ganha quem bateu.
 * Se nenhum dos empatados bateu, todos levam a vitória.
 * Recebe [{ jogadorId, total, bateu }] e devolve um Set de jogadorId.
 */
export function definirVencedores(resultados) {
  if (resultados.length === 0) return new Set();
  const maior = Math.max(...resultados.map((r) => r.total));
  const empatados = resultados.filter((r) => r.total === maior);
  const quemBateu = empatados.filter((r) => r.bateu);
  return new Set((quemBateu.length ? quemBateu : empatados).map((r) => r.jogadorId));
}
