/**
 * Dados iniciais (seed) do exemplo.
 * Baseados no estudo de caso da Aula 11 - Requisitos de Interface:
 * "Sistema de Controle de Recursos Audiovisuais".
 */

export const UNIDADES = [
  "Coração Eucarístico",
  "Praça da Liberdade",
  "São Gabriel",
  "Barreiro",
  "Contagem",
  "Betim",
];

export const CATEGORIAS = ["Áudio", "Visual"];

// Tipo de recurso -> categoria (usado para filtrar o select "Tipo" pela categoria)
export const TIPOS = [
  { nome: "Data Show", categoria: "Visual" },
  { nome: "Retroprojetor", categoria: "Visual" },
  { nome: "Televisão", categoria: "Visual" },
  { nome: "Televisão e DVD", categoria: "Visual" },
  { nome: "Aparelho de Som", categoria: "Áudio" },
  { nome: "Caixa Amplificada", categoria: "Áudio" },
  { nome: "Microfone", categoria: "Áudio" },
];

export const RECURSOS = [
  { codigo: "DS-CE-001", nome: "Data Show Epson PowerLite", unidade: "Coração Eucarístico", categoria: "Visual", tipo: "Data Show", observacoes: "Acompanha cabo HDMI de 5 m." },
  { codigo: "DS-CE-002", nome: "Data Show BenQ MX550", unidade: "Coração Eucarístico", categoria: "Visual", tipo: "Data Show", observacoes: "" },
  { codigo: "TV-PL-001", nome: "Televisão 55\" com suporte", unidade: "Praça da Liberdade", categoria: "Visual", tipo: "Televisão", observacoes: "Suporte com rodinhas." },
  { codigo: "TD-BA-001", nome: "Televisão e DVD Philips", unidade: "Barreiro", categoria: "Visual", tipo: "Televisão e DVD", observacoes: "" },
  { codigo: "MC-CE-001", nome: "Microfone sem fio Shure", unidade: "Coração Eucarístico", categoria: "Áudio", tipo: "Microfone", observacoes: "Usa 2 pilhas AA." },
  { codigo: "MC-SG-001", nome: "Microfone de lapela", unidade: "São Gabriel", categoria: "Áudio", tipo: "Microfone", observacoes: "" },
  { codigo: "CX-CO-001", nome: "Caixa Amplificada JBL", unidade: "Contagem", categoria: "Áudio", tipo: "Caixa Amplificada", observacoes: "Bateria dura cerca de 6 h." },
  { codigo: "AS-BE-001", nome: "Aparelho de Som Sony", unidade: "Betim", categoria: "Áudio", tipo: "Aparelho de Som", observacoes: "" },
  { codigo: "RP-PL-001", nome: "Retroprojetor 3M", unidade: "Praça da Liberdade", categoria: "Visual", tipo: "Retroprojetor", observacoes: "Lâmpada reserva no estojo." },
];

// status: "pendente" | "confirmada" | "rejeitada"
export const RESERVAS = [
  { id: "R-1024", aluno: "Ismael Ferreira", matricula: "712345", codigoRecurso: "TV-PL-001", data: "2026-12-02", inicio: "19:00", fim: "20:40", motivo: "Apresentação do trabalho interdisciplinar de IHC.", status: "pendente", solicitadaEm: "2026-11-23" },
  { id: "R-1025", aluno: "Glívia Barbosa", matricula: "698211", codigoRecurso: "MC-CE-001", data: "2026-12-03", inicio: "10:00", fim: "11:40", motivo: "Seminário aberto da disciplina de Design de Interação.", status: "pendente", solicitadaEm: "2026-11-24" },
  { id: "R-1026", aluno: "Cezar Moura", matricula: "705532", codigoRecurso: "AS-BE-001", data: "2026-12-04", inicio: "14:00", fim: "15:40", motivo: "Teste de usabilidade com áudio gravado.", status: "pendente", solicitadaEm: "2026-11-24" },
  { id: "R-1027", aluno: "João Pedro Lima", matricula: "721004", codigoRecurso: "CX-CO-001", data: "2026-12-05", inicio: "08:00", fim: "09:40", motivo: "Evento de boas-vindas dos calouros.", status: "pendente", solicitadaEm: "2026-11-25" },
  { id: "R-1019", aluno: "Ana Clara Souza", matricula: "690117", codigoRecurso: "DS-CE-001", data: "2026-11-27", inicio: "19:00", fim: "22:30", motivo: "Defesa de TCC.", status: "confirmada", solicitadaEm: "2026-11-18" },
];
