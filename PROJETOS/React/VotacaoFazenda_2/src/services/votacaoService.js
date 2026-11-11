import participantes from '../data/participantes';

// Chave usada para guardar os votos no localStorage do navegador.
const CHAVE_VOTOS = 'fazenda2026:votos-ficar';

// Retorna todos os participantes da temporada.
export function listarParticipantes() {
  return participantes;
}

// Retorna os participantes com a situação informada: 'roca', 'fazendeiro' ou 'peao'.
export function listarPorSituacao(situacao) {
  return participantes.filter((p) => p.situacao === situacao);
}

// Retorna o Fazendeiro da semana (um único objeto) ou null, se não houver.
export function obterFazendeiro() {
  return participantes.find((p) => p.situacao === 'fazendeiro') ?? null;
}

// Lê os votos salvos no localStorage.
// Formato: um ARRAY com o id de cada voto, na ordem em que foram dados. Ex.: [9, 12, 9, 22]
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

// Registra 1 voto para o participante FICAR na fazenda e devolve o array de votos atualizado.
// Lança um erro se o participante não estiver na roça.
export function registrarVoto(idParticipante) {
  const participante = participantes.find((p) => p.id === idParticipante);
  if (!participante || participante.situacao !== 'roca') {
    throw new Error('Só é possível votar em participantes que estão na roça.');
  }
  const votos = [...obterVotos(), idParticipante];
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

// Conta quantos votos cada participante recebeu. Formato: { [idDoParticipante]: quantidade }
export function contarVotos(votos) {
  return votos.reduce((contagem, id) => {
    contagem[id] = (contagem[id] || 0) + 1;
    return contagem;
  }, {});
}

// Monta o resultado da votação: cada participante da roça com seus votos e percentual,
// ordenado do MAIS votado (mais salvo) para o MENOS votado.
// Atenção: nesta votação o público vota para FICAR, então quem sai é o ÚLTIMO da lista.
export function calcularResultado(votos) {
  const total = votos.length;
  const contagem = contarVotos(votos);
  return listarPorSituacao('roca')
    .map((p) => {
      const qtd = contagem[p.id] || 0;
      return {
        ...p,
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
