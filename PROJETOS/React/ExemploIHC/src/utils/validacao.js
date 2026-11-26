/**
 * Regras de validação dos formulários.
 *
 * Seguem a "Lista de Campos" da Aula 11 (Valores válidos, Formato e
 * Restrições). As mensagens dizem O QUE está errado e COMO corrigir
 * (Nielsen #9), sem culpar o usuário.
 */

export const LIMITES = {
  codigo: 12,
  nome: 35,
  observacoes: 255,
  motivo: 255,
};

const ALFANUMERICO = /^[A-Za-z0-9-]+$/;

export function validarRecurso(dados, codigosExistentes = []) {
  const erros = {};

  const codigo = dados.codigo.trim();
  if (!codigo) {
    erros.codigo = "Informe o código do recurso.";
  } else if (!ALFANUMERICO.test(codigo)) {
    erros.codigo = "Use só letras, números e hífen (ex.: DS-CE-003).";
  } else if (codigo.length > LIMITES.codigo) {
    erros.codigo = `O código pode ter até ${LIMITES.codigo} caracteres.`;
  } else if (codigosExistentes.includes(codigo.toUpperCase())) {
    erros.codigo = "Já existe um recurso com este código. Escolha outro.";
  }

  if (!dados.nome.trim()) erros.nome = "Informe o nome do recurso.";
  else if (dados.nome.length > LIMITES.nome) erros.nome = `O nome pode ter até ${LIMITES.nome} caracteres.`;

  if (!dados.unidade) erros.unidade = "Selecione a unidade a que o recurso pertence.";
  if (!dados.categoria) erros.categoria = "Selecione a categoria: Áudio ou Visual.";
  if (!dados.tipo) erros.tipo = "Selecione o tipo do recurso.";

  if (dados.observacoes.length > LIMITES.observacoes) {
    erros.observacoes = `As observações podem ter até ${LIMITES.observacoes} caracteres.`;
  }

  return erros;
}

// Cada etapa do formulário de reserva é validada antes de avançar
export function validarEtapaReserva(etapa, dados, hoje) {
  const erros = {};

  if (etapa === 0 && !dados.codigoRecurso) {
    erros.codigoRecurso = "Escolha um recurso para continuar.";
  }

  if (etapa === 1) {
    if (!dados.data) erros.data = "Informe a data da reserva.";
    else if (dados.data < hoje) erros.data = "A data não pode estar no passado.";

    if (!dados.inicio) erros.inicio = "Informe o horário de retirada.";
    if (!dados.fim) erros.fim = "Informe o horário de devolução.";
    else if (dados.inicio && dados.fim <= dados.inicio) {
      erros.fim = "A devolução precisa ser depois da retirada.";
    }
  }

  if (etapa === 2) {
    if (!dados.aluno.trim()) erros.aluno = "Informe seu nome completo.";
    if (!/^\d{6,8}$/.test(dados.matricula)) erros.matricula = "A matrícula tem de 6 a 8 números.";
    if (!dados.motivo.trim()) erros.motivo = "Conte em poucas palavras para que é a reserva.";
    else if (dados.motivo.length > LIMITES.motivo) erros.motivo = `Use até ${LIMITES.motivo} caracteres.`;
  }

  return erros;
}
