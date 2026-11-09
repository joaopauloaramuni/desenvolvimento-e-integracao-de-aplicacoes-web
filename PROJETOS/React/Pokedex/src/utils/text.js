/**
 * Deixa o texto comparável: sem acento, minúsculo e só com letras e números.
 * "Mr. Mime" -> "mrmime", "Farfetch'd" -> "farfetchd", "Pokémon" -> "pokemon".
 */
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** 25 -> "#025" */
export function formatarNumero(id) {
  return `#${String(id).padStart(3, "0")}`;
}
