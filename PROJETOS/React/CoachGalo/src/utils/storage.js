// localStorage com try/catch: em aba anônima ou sem permissão, o app segue sem salvar

export const lerJSON = (chave) => {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : null;
  } catch {
    return null;
  }
};

export const gravarJSON = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem armazenamento: ignora */
  }
};
