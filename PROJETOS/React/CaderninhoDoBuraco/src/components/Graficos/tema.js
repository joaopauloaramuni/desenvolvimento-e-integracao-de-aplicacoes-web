// Cores e estilos dos gráficos sobre o feltro verde.

export const TEMA = {
  eixo: "rgba(243, 234, 211, 0.7)",
  grade: "rgba(243, 234, 211, 0.1)",
  fonte: 12,
  limpa: "#6fd38a",
  suja: "#c9a27a",
  real: "#ef5a5f",
};

/** O tooltip é uma cartinha de marfim. */
export const TOOLTIP = {
  contentStyle: {
    background: "#fbf7ec",
    border: "0",
    borderRadius: 8,
    boxShadow: "0 10px 24px -10px rgba(0,0,0,.7)",
    color: "#22252d",
    fontFamily: "'Figtree Variable', Figtree, system-ui, sans-serif",
    fontSize: 13,
  },
  labelStyle: { color: "#22252d", fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: "#22252d", padding: 0 },
  cursor: { fill: "rgba(243, 234, 211, 0.06)" },
};

export const EIXO = {
  stroke: TEMA.grade,
  tick: { fill: TEMA.eixo, fontSize: TEMA.fonte },
  tickLine: false,
};
