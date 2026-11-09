// Posições usadas no campo e no elenco, com o setor de cada uma e as
// posições "vizinhas" (onde o jogador ainda rende, com uma pequena perda).

export const POSICOES = {
  GOL: { nome: "Goleiro", setor: "goleiro", vizinhas: [] },
  LD: { nome: "Lateral-direito", setor: "defesa", vizinhas: ["ALD", "ZAG", "MD"] },
  LE: { nome: "Lateral-esquerdo", setor: "defesa", vizinhas: ["ALE", "ZAG", "ME"] },
  ZAG: { nome: "Zagueiro", setor: "defesa", vizinhas: ["VOL", "LD", "LE"] },
  ALD: { nome: "Ala direito", setor: "defesa", vizinhas: ["LD", "MD"] },
  ALE: { nome: "Ala esquerdo", setor: "defesa", vizinhas: ["LE", "ME"] },
  VOL: { nome: "Volante", setor: "meio", vizinhas: ["MC", "ZAG"] },
  MC: { nome: "Meio-campista", setor: "meio", vizinhas: ["VOL", "MEI", "MD", "ME"] },
  MD: { nome: "Meia direita", setor: "meio", vizinhas: ["PD", "ALD", "MC"] },
  ME: { nome: "Meia esquerda", setor: "meio", vizinhas: ["PE", "ALE", "MC"] },
  MEI: { nome: "Meia ofensivo", setor: "meio", vizinhas: ["MC", "PD", "PE", "ATA"] },
  PD: { nome: "Ponta direita", setor: "ataque", vizinhas: ["PE", "MD", "ATA", "MEI"] },
  PE: { nome: "Ponta esquerda", setor: "ataque", vizinhas: ["PD", "ME", "ATA", "MEI"] },
  ATA: { nome: "Centroavante", setor: "ataque", vizinhas: ["PD", "PE", "MEI"] },
};

// Filtros do elenco (setor "base" de cada posição natural)
export const SETORES = [
  { id: "todos", nome: "Todos" },
  { id: "goleiro", nome: "Goleiros" },
  { id: "defesa", nome: "Defensores" },
  { id: "meio", nome: "Meio-campo" },
  { id: "ataque", nome: "Atacantes" },
];

// Perda de overall fora da posição natural
export const PENALIDADE = {
  natural: 0,
  secundaria: 2,
  vizinha: 6,
  improvisado: 15,
  goleiro: 45, // goleiro na linha ou jogador de linha no gol
};

// Quanto cada posição em campo pesa em cada setor (ataque, meio, defesa, goleiro).
// Um lateral também ajuda o meio; um meia ofensivo também ataca; e assim por diante.
export const PESOS = {
  GOL: { goleiro: 1, defesa: 0.2 },
  ZAG: { defesa: 1 },
  LD: { defesa: 0.8, meio: 0.2, ataque: 0.1 },
  LE: { defesa: 0.8, meio: 0.2, ataque: 0.1 },
  ALD: { defesa: 0.55, meio: 0.4, ataque: 0.3 },
  ALE: { defesa: 0.55, meio: 0.4, ataque: 0.3 },
  VOL: { defesa: 0.45, meio: 1 },
  MC: { meio: 1, defesa: 0.2, ataque: 0.2 },
  MD: { meio: 0.8, ataque: 0.4, defesa: 0.2 },
  ME: { meio: 0.8, ataque: 0.4, defesa: 0.2 },
  MEI: { meio: 0.7, ataque: 0.6 },
  PD: { ataque: 1, meio: 0.3 },
  PE: { ataque: 1, meio: 0.3 },
  ATA: { ataque: 1 },
};

// Atributos estilo FIFA. Goleiros têm os seus próprios.
export const ATRIBUTOS_LINHA = [
  { id: "ritmo", sigla: "RIT", nome: "Ritmo" },
  { id: "finalizacao", sigla: "FIN", nome: "Finalização" },
  { id: "passe", sigla: "PAS", nome: "Passe" },
  { id: "drible", sigla: "DRI", nome: "Drible" },
  { id: "defesa", sigla: "DEF", nome: "Defesa" },
  { id: "fisico", sigla: "FIS", nome: "Físico" },
];

export const ATRIBUTOS_GOLEIRO = [
  { id: "elasticidade", sigla: "ELA", nome: "Elasticidade" },
  { id: "manejo", sigla: "MAN", nome: "Manejo" },
  { id: "chute", sigla: "CHU", nome: "Chute" },
  { id: "reflexos", sigla: "REF", nome: "Reflexos" },
  { id: "velocidade", sigla: "VEL", nome: "Velocidade" },
  { id: "posicionamento", sigla: "POS", nome: "Posicionamento" },
];
