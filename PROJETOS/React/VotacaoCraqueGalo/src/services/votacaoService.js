import jogadores from '../data/jogadores';

// Chave usada para guardar os votos no localStorage do navegador.
const CHAVE_VOTOS = 'galo2026:craque-do-jogo';

// Retorna todos os jogadores do elenco.
export function listarJogadores() {
  return jogadores;
}

// Retorna os jogadores com a situação informada: 'indicado', 'suspenso' ou 'elenco'.
export function listarPorSituacao(situacao) {
  return jogadores.filter((j) => j.situacao === situacao);
}

// Retorna o jogador suspenso neste jogo (um único objeto) ou null, se não houver.
export function obterSuspenso() {
  return jogadores.find((j) => j.situacao === 'suspenso') ?? null;
}

// Lê os votos salvos no localStorage.
// Formato: um ARRAY com o id de cada voto, na ordem em que foram dados.
// Ex.: ['everson', 'gustavo-scarpa', 'everson', 'mateo-cassierra']
// O total de votos é simplesmente o tamanho desse array.
export function obterVotos() {
  try {
    const salvo = localStorage.getItem(CHAVE_VOTOS);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
}

function salvarVotos(votos) {
  localStorage.setItem(CHAVE_VOTOS, JSON.stringify(votos));
}

// Registra 1 voto para o jogador ser o CRAQUE DO JOGO e devolve o array de votos atualizado.
// Lança um erro se o jogador não estiver entre os indicados.
export function registrarVoto(idJogador) {
  const jogador = jogadores.find((j) => j.id === idJogador);
  if (!jogador || jogador.situacao !== 'indicado') {
    throw new Error('Só é possível votar em jogadores indicados ao Craque do Jogo.');
  }
  const votos = [...obterVotos(), idJogador];
  salvarVotos(votos);
  return votos;
}

// Remove o último voto registrado e devolve o array de votos atualizado.
// Se não houver votos, devolve um array vazio.
export function desfazerUltimoVoto() {
  const votos = obterVotos().slice(0, -1);
  salvarVotos(votos);
  return votos;
}

// Conta quantos votos cada jogador recebeu. Formato: { [idDoJogador]: quantidade }
// Ex.: { everson: 2, 'gustavo-scarpa': 1, 'mateo-cassierra': 1 }
export function contarVotos(votos) {
  return votos.reduce((contagem, id) => {
    contagem[id] = (contagem[id] || 0) + 1;
    return contagem;
  }, {});
}

// Monta o resultado da votação: cada jogador indicado com seus votos e percentual,
// ordenado do MAIS votado para o MENOS votado.
// O PRIMEIRO da lista é o Craque do Jogo e o SEGUNDO é o vice.
export function calcularResultado(votos) {
  const total = votos.length;
  const contagem = contarVotos(votos);
  return listarPorSituacao('indicado')
    .map((j) => {
      const qtd = contagem[j.id] || 0;
      return {
        ...j,
        votos: qtd,
        percentual: total === 0 ? 0 : (qtd / total) * 100,
      };
    })
    .sort((a, b) => b.votos - a.votos);
}

// Apaga todos os votos (reinicia a votação).
export function zerarVotos() {
  localStorage.removeItem(CHAVE_VOTOS);
}
