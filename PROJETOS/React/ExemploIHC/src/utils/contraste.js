/**
 * Razão de contraste da WCAG 2.x entre duas cores hexadecimais.
 * Usado no Guia de Estilo para mostrar se cada par de cores passa
 * nos níveis AA (4.5:1) e AAA (7:1) para texto normal.
 */

function luminancia(hex) {
  const limpo = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => parseInt(limpo.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function razaoContraste(corA, corB) {
  const [l1, l2] = [luminancia(corA), luminancia(corB)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function nivelWCAG(razao) {
  if (razao >= 7) return "AAA";
  if (razao >= 4.5) return "AA";
  if (razao >= 3) return "AA texto grande";
  return "Reprovado";
}
