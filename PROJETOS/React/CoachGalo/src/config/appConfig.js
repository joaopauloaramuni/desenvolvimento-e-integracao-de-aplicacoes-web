// Configurações gerais do CoachGalo

export const APP = {
  NOME: "CoachGalo",
  TITULARES: 11,
  RESERVAS: 12, // vagas no banco
  CHAVE_STORAGE: "coachgalo:escalacao",
  HISTORICO_MAX: 40, // passos guardados para o "Desfazer"
};

// Escala do gráfico de força (overall de 40 a 95)
export const ESCALA = { MIN: 40, MAX: 95 };

// Cor da carta, como no FIFA: ouro, prata e bronze
export const nivelDaCarta = (overall) => (overall >= 75 ? "ouro" : overall >= 65 ? "prata" : "bronze");

// Cor da força de cada setor no gráfico: verde (forte), amarelo (regular), vermelho (fraco)
export const NIVEIS_FORCA = [
  { id: "forte", nome: "Forte", min: 75 },
  { id: "regular", nome: "Regular", min: 70 },
  { id: "fraco", nome: "Fraco", min: 0 },
];
export const nivelDaForca = (valor) => NIVEIS_FORCA.find((n) => valor >= n.min).id;

// Setores mostrados no gráfico e no campo (de cima para baixo no campo)
export const SETORES_FORCA = [
  { id: "ataque", nome: "Ataque" },
  { id: "meio", nome: "Meio-campo" },
  { id: "defesa", nome: "Defesa" },
  { id: "goleiro", nome: "Goleiro" },
];
