// Fonte única dos tokens do design system para DOCUMENTAÇÃO (página /guia-de-estilo).
// Os mesmos valores estão como variáveis CSS em src/index.css: mudou aqui, mude lá também.
// (Mesmo padrão dos projetos DronesDTI, PalpiteDTI e AraCoffee.)

export const CORES = [
  { nome: "Azul PUC", variavel: "--brand", hex: "#005380", papel: "30%", uso: "Cabeçalho, botões primários, links e item de menu ativo. A cor da marca." },
  { nome: "Azul profundo", variavel: "--brand-deep", hex: "#00334F", papel: "30%", uso: "Hover dos botões primários e degradê do cabeçalho." },
  { nome: "Azul claro", variavel: "--brand-tint", hex: "#E6F0F6", papel: "30%", uso: "Fundo de item selecionado, hover de linhas e caixas informativas." },
  { nome: "Âmbar", variavel: "--accent", hex: "#F2A900", papel: "10%", uso: "Só a ação principal da tela (ex.: Reservar, Enviar). Se tudo é âmbar, nada se destaca." },
  { nome: "Fundo", variavel: "--background", hex: "#F5F7F9", papel: "60%", uso: "Fundo das páginas." },
  { nome: "Superfície", variavel: "--surface", hex: "#FFFFFF", papel: "60%", uso: "Cartões, formulários e tabelas sobre o fundo." },
  { nome: "Tinta", variavel: "--foreground", hex: "#14202B", papel: "60%", uso: "Texto principal. Não é preto puro: menos cansativo na leitura." },
  { nome: "Cinza de apoio", variavel: "--muted", hex: "#4B5B6B", papel: "60%", uso: "Dicas, rótulos secundários e metadados." },
  { nome: "Borda", variavel: "--border", hex: "#D3DBE3", papel: "60%", uso: "Divisórias e contorno de cartões." },
];

// Cores com significado fixo (convenção cultural: verde = ok, vermelho = erro...).
// Sempre usadas JUNTO com ícone e texto, nunca sozinhas (WCAG 1.4.1).
export const CORES_SEMANTICAS = [
  { nome: "Sucesso", tipo: "sucesso", texto: "#1E7A3C", fundo: "#E8F5EC", uso: "Ação concluída, reserva confirmada." },
  { nome: "Erro", tipo: "erro", texto: "#B42318", fundo: "#FDECEA", uso: "Campo inválido, falha, ação destrutiva." },
  { nome: "Atenção", tipo: "aviso", texto: "#7A5000", fundo: "#FFF4D6", uso: "Pendências e limites próximos." },
  { nome: "Informação", tipo: "info", texto: "#005380", fundo: "#E6F0F6", uso: "Dicas e avisos neutros." },
];

export const PARES_CONTRASTE = [
  { texto: "#14202B", fundo: "#F5F7F9", onde: "Texto principal no fundo" },
  { texto: "#4B5B6B", fundo: "#FFFFFF", onde: "Texto de apoio no cartão" },
  { texto: "#FFFFFF", fundo: "#005380", onde: "Texto no cabeçalho e botão primário" },
  { texto: "#1B1B1B", fundo: "#F2A900", onde: "Botão de destaque (âmbar)" },
  { texto: "#005380", fundo: "#FFFFFF", onde: "Links e botão secundário" },
  { texto: "#B42318", fundo: "#FDECEA", onde: "Mensagem de erro" },
  { texto: "#7A5000", fundo: "#FFF4D6", onde: "Selo Pendente" },
  // Exemplo NEGATIVO de propósito, para a turma ver o que não fazer:
  { texto: "#F2A900", fundo: "#FFFFFF", onde: "Âmbar como texto no branco (NÃO usar)" },
];

// Escala modular 1.25 (Major Third), base 16px (Aula 12)
export const ESCALA_TIPO = [
  { nome: "Destaque", variavel: "--text-3xl", tamanho: "2.441rem", px: 39, peso: 700, exemplo: "Reserve seu recurso" },
  { nome: "Título 1 (h1)", variavel: "--text-2xl", tamanho: "1.953rem", px: 31, peso: 700, exemplo: "Confirmar reservas" },
  { nome: "Título 2 (h2)", variavel: "--text-xl", tamanho: "1.563rem", px: 25, peso: 700, exemplo: "Quando você vai usar?" },
  { nome: "Título 3 (h3)", variavel: "--text-lg", tamanho: "1.25rem", px: 20, peso: 600, exemplo: "Data Show Epson PowerLite" },
  { nome: "Corpo", variavel: "--text-base", tamanho: "1rem", px: 16, peso: 400, exemplo: "O setor audiovisual responde em até 1 dia útil." },
  { nome: "Apoio", variavel: "--text-sm", tamanho: "0.875rem", px: 14, peso: 400, exemplo: "Letras, números e hífen. Ex.: DS-CE-003" },
  { nome: "Legenda", variavel: "--text-xs", tamanho: "0.8rem", px: 12.8, peso: 600, exemplo: "Rascunho salvo automaticamente" },
];

// Grid de 8 pontos
export const ESPACOS = [
  { variavel: "--space-1", valor: "0.25rem", px: 4, uso: "Ícone e texto, rótulo e valor" },
  { variavel: "--space-2", valor: "0.5rem", px: 8, uso: "Entre botões, entre campos de uma linha" },
  { variavel: "--space-3", valor: "1rem", px: 16, uso: "Padding de cartões pequenos e entre itens" },
  { variavel: "--space-4", valor: "1.5rem", px: 24, uso: "Padding de painéis e entre grupos" },
  { variavel: "--space-5", valor: "2rem", px: 32, uso: "Entre seções" },
  { variavel: "--space-6", valor: "3rem", px: 48, uso: "Respiro de áreas grandes" },
  { variavel: "--space-7", valor: "4rem", px: 64, uso: "Antes do rodapé" },
];

export const RAIOS = [
  { nome: "Controle", variavel: "--radius-sm", valor: "6px", uso: "Botões, campos e selects" },
  { nome: "Painel", variavel: "--radius-md", valor: "12px", uso: "Cartões, formulários e diálogos" },
  { nome: "Pílula", variavel: "--radius-pill", valor: "999px", uso: "Selos de situação e contadores" },
];

// Voz e tom: como o sistema "fala" (Nielsen #2 - linguagem do usuário)
export const VOZ = [
  { faca: "Reservar recurso", evite: "Submit / Enviar formulário", porque: "O botão diz o que acontece, não como funciona." },
  { faca: "Informe a data da reserva.", evite: "Campo inválido!", porque: "O erro diz o que fazer, sem culpar a pessoa." },
  { faca: "Rejeitar reserva", evite: "OK", porque: "Em diálogos, o botão repete a ação. \"OK\" não diz nada." },
  { faca: "Nenhum recurso com esses filtros", evite: "0 results", porque: "Português, frase completa e com saída (Limpar filtros)." },
  { faca: "Solicitação enviada", evite: "Operação realizada com sucesso", porque: "Curto, concreto e no vocabulário do domínio." },
];

export const DECISOES = [
  { versao: "1.0", decisao: "Azul PUC como 30% e âmbar como 10%", porque: "Regra 60-30-10 (Aula 13). O âmbar marca só a ação principal de cada tela." },
  { versao: "1.0", decisao: "Montserrat em toda a UI, com fallback do sistema", porque: "Sem serifa, boa leitura em tela e a mesma família dos outros projetos PUC." },
  { versao: "1.0", decisao: "Tudo em rem, base 16px", porque: "O controle A- / A+ e o zoom do navegador escalam a página inteira (Aula 12)." },
  { versao: "1.0", decisao: "Nenhuma informação só por cor", porque: "Status, erros e seleção sempre têm ícone ou texto junto (WCAG 1.4.1, daltonismo)." },
  { versao: "1.0", decisao: "Navegação inferior no celular", porque: "Ações frequentes na zona do polegar (Aula 18)." },
  { versao: "1.0", decisao: "Tema escuro com azul clareado", porque: "O azul PUC original some no fundo escuro; o tom #4FA8D8 mantém contraste AA." },
];
