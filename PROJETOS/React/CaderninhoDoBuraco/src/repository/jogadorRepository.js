import Jogador from "../model/Jogador";
import { buscarTudo, cliente, verificar } from "./base";

/**
 * Acesso à tabela "jogadores".
 *
 * select * from jogadores order by nome
 */
const TABELA = "jogadores";
const COLUNAS = "id, nome, carta, cor, ativo, created_at";

export async function findAll() {
  const linhas = await buscarTudo(() =>
    cliente().from(TABELA).select(COLUNAS).order("nome", { ascending: true }).order("id")
  );
  return linhas.map(Jogador.fromRow);
}

/** insert into jogadores (nome, carta, cor) values (...) returning * */
export async function save({ nome, carta, cor }) {
  const { data, error } = await cliente()
    .from(TABELA)
    .insert({ nome, carta, cor })
    .select(COLUNAS)
    .single();
  verificar(error);
  return Jogador.fromRow(data);
}

/** update jogadores set ... where id = ? returning * */
export async function update(id, campos) {
  const { data, error } = await cliente()
    .from(TABELA)
    .update(campos)
    .eq("id", id)
    .select(COLUNAS)
    .single();
  verificar(error);
  return Jogador.fromRow(data);
}

/** delete from jogadores where id = ? (falha se o jogador tiver pontos) */
export async function deleteById(id) {
  const { error } = await cliente().from(TABELA).delete().eq("id", id);
  verificar(error);
}
