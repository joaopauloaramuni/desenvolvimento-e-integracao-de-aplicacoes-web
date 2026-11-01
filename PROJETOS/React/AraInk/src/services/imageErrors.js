/**
 * Erros dos provedores de imagem (GPT Image e Gemini).
 * O código (code) decide a mensagem mostrada na tela.
 * Mensagens que dependem do provedor são funções: (provedor) => texto.
 */

const MENSAGENS = {
  missing_key: (p) =>
    `A chave do ${p.nome} não está configurada. Coloque ${p.variavelChave} no .env.local e reinicie o npm run dev.`,
  invalid_key: (p) => `A ${p.empresa} recusou a chave. Confira a ${p.variavelChave} no .env.local.`,
  org_not_verified:
    "Sua organização na OpenAI precisa ser verificada para usar o GPT Image. Faça a verificação em platform.openai.com (Settings > Organization > General) e tente de novo em alguns minutos.",
  permission: (p) =>
    p.id === "openai"
      ? "A chave não tem permissão para gerar imagens. Se for uma chave restrita, libere a permissão de imagens no painel da OpenAI."
      : "A chave não tem permissão para este modelo. Confira as restrições da chave no Google Cloud (API e sites liberados).",
  no_credit: (p) =>
    p.id === "openai"
      ? "Sem crédito na conta da OpenAI. Adicione saldo em platform.openai.com (Settings > Billing) ou aumente o limite de gastos do projeto."
      : "O faturamento não está ativo no projeto da chave do Gemini. Ative em aistudio.google.com (Set up billing).",
  no_free_tier:
    "Este modelo de imagem do Gemini não tem cota no plano gratuito (limite 0). Ative o faturamento no AI Studio (Set up billing) e tente de novo.",
  quota: (p) => `Limite de imagens por minuto atingido no ${p.nome}. Espere um minuto e gere menos variações.`,
  model_not_found: (p) => `O modelo de imagem não foi encontrado no ${p.nome}. Confira o nome do modelo no .env.local.`,
  blocked: (p) => `O ${p.nome} recusou este pedido pelas regras de segurança. Reescreva a ideia de outro jeito.`,
  no_image: (p) => `O ${p.nome} respondeu sem imagem. Tente de novo ou detalhe mais a ideia.`,
  timeout: (p) => `O ${p.nome} demorou demais para responder. Tente de novo.`,
  network: (p) => `Sem conexão com a API do ${p.nome}. Confira a internet e tente de novo.`,
  server: (p) => `A API do ${p.nome} está instável agora. Tente de novo em alguns segundos.`,
  bad_request: (p) => `O ${p.nome} não aceitou o pedido.`,
};

export class ImageError extends Error {
  /** new ImageError("quota", provedor, "detalhe da API") */
  constructor(code, provedor, detalhe = "") {
    const mensagem = MENSAGENS[code];
    super(typeof mensagem === "function" ? mensagem(provedor) : (mensagem ?? (detalhe || "Erro ao gerar a imagem.")));
    this.code = code;
    this.detail = detalhe;
  }
}

/** Erros que valem para todas as variações (não adianta tentar as outras). */
export const ERROS_GERAIS = ["missing_key", "invalid_key", "org_not_verified", "permission", "no_credit", "no_free_tier"];
