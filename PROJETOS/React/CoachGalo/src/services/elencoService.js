import dados from "../data/elenco.json";
import { POSICOES } from "../config/posicoes";
import { normalizar } from "../utils/texto";

// Prepara cada jogador para a tela uma vez só
const ANO = dados.meta.temporada;

const JOGADORES = dados.jogadores
  .map((j) => ({
    ...j,
    secundarias: j.secundarias ?? [],
    setor: POSICOES[j.posicao]?.setor ?? "meio",
    idade: j.idade ?? (j.nascimento ? ANO - j.nascimento : null),
    busca: normalizar(`${j.nome} ${j.nomeCompleto ?? ""} ${j.numero ?? ""}`),
  }))
  .sort((a, b) => b.overall - a.overall);

const POR_ID = new Map(JOGADORES.map((j) => [j.id, j]));

export const getMeta = () => dados.meta;
export const getJogadores = () => JOGADORES;
export const getJogador = (id) => POR_ID.get(id) ?? null;

// Pesquisa por nome ou número + filtro por setor
export const filtrarJogadores = (lista, { busca = "", setor = "todos" }) => {
  const termo = normalizar(busca);
  return lista.filter((j) => (setor === "todos" || j.setor === setor) && (!termo || j.busca.includes(termo)));
};

// Fotos, em ordem de preferência:
// 1. arquivo local public/jogadores/{id}.webp (ou .png), baixado do site oficial
// 2. foto oficial no site do Atlético (campo "foto" do elenco.json)
// Se nenhuma carregar, o componente FotoJogador mostra a silhueta.
export const fotosDe = (jogador) => {
  if (!jogador) return [];
  const pasta = `${import.meta.env.BASE_URL}jogadores/${jogador.id}`;
  const remota = jogador.foto
    ? /^https?:\/\//.test(jogador.foto) ? jogador.foto : `${import.meta.env.BASE_URL}${jogador.foto}`
    : null;
  return [`${pasta}.webp`, `${pasta}.png`, remota].filter((url, i, lista) => url && lista.indexOf(url) === i);
};
