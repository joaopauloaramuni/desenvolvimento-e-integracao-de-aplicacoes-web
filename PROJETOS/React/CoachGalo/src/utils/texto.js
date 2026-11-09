// Tira acentos e deixa minúsculo, para a pesquisa ("ivan" encontra "Iván")
export const normalizar = (texto = "") =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const sinal = (n) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`);
