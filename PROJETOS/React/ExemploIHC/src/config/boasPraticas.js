/**
 * Mapa "conteúdo da disciplina → onde está no projeto".
 * Cada prática aponta para a TELA (rota) e para o ARQUIVO que a implementa.
 * A página /boas-praticas é gerada a partir desta lista.
 */

export const BOAS_PRATICAS = [
  {
    id: "design-thinking",
    aula: "Aula 8",
    titulo: "Design Thinking",
    resumo: "Imersão, ideação e prototipagem antes do código.",
    itens: [
      {
        titulo: "Desafio, mapa de empatia e ponto de vista",
        texto: "O problema foi redefinido a partir de quem usa: alunos que perdem tempo reservando equipamento por e-mail e um setor que não sabe o que está pendente.",
        onde: [{ rotulo: "docs/01-design-thinking.md", arquivo: true }],
      },
      {
        titulo: "Protótipo antes da tela final",
        texto: "Os requisitos de interface (lista de campos e comandos) vieram antes do desenho, como protótipo de baixa fidelidade.",
        onde: [{ rotulo: "docs/03-requisitos-de-interface.md", arquivo: true }],
      },
    ],
  },
  {
    id: "tarefas",
    aula: "Aula 9",
    titulo: "Análise e modelagem de tarefas",
    resumo: "As telas seguem a decomposição da tarefa (HTA) e os métodos do GOMS.",
    itens: [
      {
        titulo: "HTA de “Reservar recurso”",
        texto: "Os 4 subobjetivos sequenciais (1>2>3>4) viraram as 4 etapas do formulário de reserva.",
        onde: [{ rotulo: "Reservar", para: "/reservar" }, { rotulo: "docs/02-analise-de-tarefas.md", arquivo: true }],
      },
      {
        titulo: "GOMS: mais de um método para o mesmo objetivo",
        texto: "Para chegar a um recurso, o usuário pode buscar pelo nome ou filtrar por categoria e unidade (regras de seleção diferentes, mesmo objetivo).",
        onde: [{ rotulo: "Recursos", para: "/recursos" }],
      },
      {
        titulo: "Início orientado a tarefas",
        texto: "A página inicial leva direto à tarefa de cada perfil, em vez de listar funções do sistema.",
        onde: [{ rotulo: "Início", para: "/" }],
      },
    ],
  },
  {
    id: "requisitos",
    aula: "Aula 11",
    titulo: "Requisitos de interface",
    resumo: "Lista de campos e comandos implementada fielmente.",
    itens: [
      {
        titulo: "Cadastro de Recursos Audiovisuais",
        texto: "Campos Código, Nome, Unidade, Categoria, Tipo e Observações, com valores válidos, formato, tipo de componente e restrições do slide. Comandos Cadastrar e Cancelar.",
        onde: [{ rotulo: "Cadastrar recurso", para: "/recursos/novo" }],
      },
      {
        titulo: "Caso de uso Confirmar Reserva de Alunos",
        texto: "Duas telas para o mesmo caso de uso: a lista (Visualizar, Confirmar, Rejeitar) e os detalhes (Imprimir, Voltar).",
        onde: [{ rotulo: "Confirmar reservas", para: "/reservas" }, { rotulo: "Detalhes", para: "/reservas/R-1024" }],
      },
    ],
  },
  {
    id: "fontes",
    aula: "Aula 12",
    titulo: "Tipografia",
    resumo: "Legibilidade antes de estilo.",
    itens: [
      {
        titulo: "Uma família sem serifa, corpo de 16px",
        texto: "Montserrat com fallback de fontes do sistema, entrelinha 1,5 e cerca de 70 caracteres por linha.",
        onde: [{ rotulo: "Guia: Tipografia", para: "/guia-de-estilo#tipografia" }, { rotulo: "src/index.css", arquivo: true }],
      },
      {
        titulo: "O usuário escolhe o tamanho do texto",
        texto: "Controle A- / A+ no cabeçalho. Funciona porque todo o CSS está em rem.",
        onde: [{ rotulo: "Cabeçalho", para: "/" }, { rotulo: "ControleFonte.jsx", arquivo: true }],
      },
      {
        titulo: "Hierarquia clara",
        texto: "Um h1 por página, depois h2 e h3 em ordem, com escala modular 1,25.",
        onde: [{ rotulo: "Guia: Tipografia", para: "/guia-de-estilo#tipografia" }],
      },
    ],
  },
  {
    id: "cores",
    aula: "Aula 13",
    titulo: "Cores",
    resumo: "Paleta da marca, harmonia e significado.",
    itens: [
      {
        titulo: "Regra 60-30-10",
        texto: "60% neutras, 30% azul PUC, 10% âmbar só para a ação principal.",
        onde: [{ rotulo: "Guia: Cores", para: "/guia-de-estilo#cores" }],
      },
      {
        titulo: "Contraste medido, não estimado",
        texto: "Todos os pares de texto e fundo passam no nível AA. O guia calcula a razão de cada par.",
        onde: [{ rotulo: "Guia: Contraste", para: "/guia-de-estilo#contraste" }, { rotulo: "src/utils/contraste.js", arquivo: true }],
      },
      {
        titulo: "Tema claro e escuro",
        texto: "Segue o sistema operacional ou a escolha da pessoa, que fica salva.",
        onde: [{ rotulo: "Botão Tema escuro", para: "/" }, { rotulo: "ThemeToggle.jsx", arquivo: true }],
      },
    ],
  },
  {
    id: "design-system",
    aula: "Aula 16",
    titulo: "Design System, Style Guide e Handoff",
    resumo: "Tokens, componentes e documentação em um só lugar.",
    itens: [
      {
        titulo: "Tokens como variáveis CSS",
        texto: "Nenhum componente usa cor ou tamanho solto: tudo vem de src/index.css.",
        onde: [{ rotulo: "src/index.css", arquivo: true }],
      },
      {
        titulo: "Componentes reutilizáveis",
        texto: "Button, Campo, Alerta, StatusBadge, DialogoConfirmacao e outros, usados por todas as telas.",
        onde: [{ rotulo: "Guia: Componentes", para: "/guia-de-estilo#componentes" }, { rotulo: "src/components/", arquivo: true }],
      },
      {
        titulo: "Guia de estilo vivo (handoff)",
        texto: "A página mostra os mesmos componentes do sistema, com regra de uso, voz e tom e registro de decisões.",
        onde: [{ rotulo: "Guia de estilo", para: "/guia-de-estilo" }, { rotulo: "src/config/designSystem.js", arquivo: true }],
      },
    ],
  },
  {
    id: "acessibilidade",
    aula: "Aula 17",
    titulo: "Acessibilidade (WCAG 2.2, princípios POUR)",
    resumo: "Perceptível, Operável, Compreensível e Robusto.",
    itens: [
      {
        titulo: "Perceptível: nada só por cor",
        texto: "Status, erros e seleções têm ícone e texto. Imagens têm alt; ícones decorativos têm aria-hidden.",
        onde: [{ rotulo: "Confirmar reservas", para: "/reservas" }, { rotulo: "StatusBadge.jsx", arquivo: true }],
      },
      {
        titulo: "Operável: tudo pelo teclado",
        texto: "Link “Pular para o conteúdo”, foco sempre visível, diálogo nativo com Esc e foco preso, alvos de 44px.",
        onde: [{ rotulo: "Aperte Tab nesta página", para: "/boas-praticas" }, { rotulo: "Layout.jsx", arquivo: true }],
      },
      {
        titulo: "Compreensível: formulários que ajudam",
        texto: "Rótulos visíveis, dicas, mensagens de erro que dizem como corrigir e resumo de erros com links para os campos.",
        onde: [{ rotulo: "Cadastrar recurso", para: "/recursos/novo" }, { rotulo: "Campo.jsx", arquivo: true }],
      },
      {
        titulo: "Robusto: HTML semântico e ARIA só quando precisa",
        texto: "header, nav, main, footer, tabela com th e caption, aria-current, aria-live para avisos e contagens.",
        onde: [{ rotulo: "Recursos", para: "/recursos" }],
      },
      {
        titulo: "SPA acessível",
        texto: "A cada troca de página, o título da aba muda e o foco vai para o h1, que o leitor de tela anuncia.",
        onde: [{ rotulo: "usePaginaTitulo.js", arquivo: true }],
      },
    ],
  },
  {
    id: "mobile",
    aula: "Aula 18",
    titulo: "Dispositivos móveis",
    resumo: "Mobile first, polegar e conexão instável.",
    itens: [
      {
        titulo: "Navegação na zona do polegar",
        texto: "No celular o menu vai para a barra inferior, com ícone e texto. Os botões da reserva ficam fixos embaixo.",
        onde: [{ rotulo: "Abra no celular", para: "/reservar" }, { rotulo: "MenuMobile.jsx", arquivo: true }],
      },
      {
        titulo: "Formulário em etapas, com padrões sensatos",
        texto: "Data de hoje e horário comum já preenchidos, teclado numérico na matrícula, seletores nativos de data e hora.",
        onde: [{ rotulo: "Reservar", para: "/reservar" }],
      },
      {
        titulo: "Rascunho salvo",
        texto: "Se a conexão cair ou a aba fechar, o que foi digitado continua lá.",
        onde: [{ rotulo: "useRascunho.js", arquivo: true }],
      },
      {
        titulo: "Skeleton screens",
        texto: "Enquanto carrega, a forma do conteúdo aparece no lugar de uma tela em branco.",
        onde: [{ rotulo: "Recursos", para: "/recursos" }, { rotulo: "Skeleton.jsx", arquivo: true }],
      },
    ],
  },
  {
    id: "nielsen",
    aula: "Extra",
    titulo: "As 10 heurísticas de Nielsen",
    resumo: "Use como checklist de avaliação heurística.",
    itens: [
      { titulo: "1. Visibilidade do status do sistema", texto: "Etapa X de Y, “Cadastrando…”, contagem de resultados, avisos de ação concluída.", onde: [{ rotulo: "Reservar", para: "/reservar" }] },
      { titulo: "2. Correspondência com o mundo real", texto: "Vocabulário do domínio (protocolo, retirada, devolução), datas dd/mm/aaaa.", onde: [{ rotulo: "Detalhes", para: "/reservas/R-1024" }] },
      { titulo: "3. Controle e liberdade", texto: "Desfazer depois de confirmar ou rejeitar; Voltar e Cancelar em todo formulário.", onde: [{ rotulo: "Confirmar reservas", para: "/reservas" }] },
      { titulo: "4. Consistência e padrões", texto: "Mesmo cabeçalho de página, mesmos botões e mesmo menu em todas as telas.", onde: [{ rotulo: "Guia de estilo", para: "/guia-de-estilo" }] },
      { titulo: "5. Prevenção de erros", texto: "Tipo filtrado pela categoria, data mínima de hoje, confirmação antes de rejeitar ou descartar.", onde: [{ rotulo: "Cadastrar recurso", para: "/recursos/novo" }] },
      { titulo: "6. Reconhecer em vez de lembrar", texto: "Revisão final com todos os dados e atalho “Alterar” para cada parte.", onde: [{ rotulo: "Reservar", para: "/reservar" }] },
      { titulo: "7. Flexibilidade e eficiência", texto: "Botão Reservar no cartão do recurso pula a primeira etapa; filtros na URL podem ser compartilhados.", onde: [{ rotulo: "Recursos", para: "/recursos" }] },
      { titulo: "8. Estética e design minimalista", texto: "Uma ação de destaque por tela; só os campos necessários.", onde: [{ rotulo: "Início", para: "/" }] },
      { titulo: "9. Ajudar a reconhecer e corrigir erros", texto: "Mensagens dizem o que fazer; página 404 oferece caminhos.", onde: [{ rotulo: "Página 404", para: "/pagina-que-nao-existe" }] },
      { titulo: "10. Ajuda e documentação", texto: "Dicas nos campos, “Como funciona” no início e esta página.", onde: [{ rotulo: "Início", para: "/" }] },
    ],
  },
];
