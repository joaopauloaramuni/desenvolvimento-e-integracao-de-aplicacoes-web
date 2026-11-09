/**
 * Aplica no <html> o modo (claro/escuro) e o tema do aparelho (classico/holo).
 * O CSS usa os atributos data-theme e data-skin para escolher as cores.
 *
 * color-scheme (cor dos controles nativos, como a lista do <select>):
 * no tema Holo a tela é azul escura nos dois modos, então ele fica sempre "dark".
 */
export function aplicarAparencia({ theme, skin }) {
  const raiz = document.documentElement;
  if (theme) raiz.dataset.theme = theme;
  if (skin) raiz.dataset.skin = skin;
  raiz.style.colorScheme = raiz.dataset.skin === "holo" ? "dark" : raiz.dataset.theme;
}
