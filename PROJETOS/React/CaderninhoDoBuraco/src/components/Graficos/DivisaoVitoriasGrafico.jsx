import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatPercentual } from "../../utils/format";
import { TOOLTIP } from "./tema";

/** Fatia de cada jogador nas rodadas ganhas do período. */
function DivisaoVitoriasGrafico({ ranking }) {
  const dados = ranking.filter((r) => r.vitorias > 0).map((r) => ({ nome: r.jogador.nome, valor: r.vitorias, cor: r.jogador.cor }));
  const total = dados.reduce((s, d) => s + d.valor, 0);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          innerRadius="52%"
          outerRadius="82%"
          paddingAngle={2}
          stroke="rgba(8, 30, 11, 0.9)"
          strokeWidth={2}
          label={({ name, value }) => `${name} ${formatPercentual(value / total)}`}
          labelLine={false}
          isAnimationActive
        >
          {dados.map((d) => (
            <Cell key={d.nome} fill={d.cor} />
          ))}
        </Pie>
        <Tooltip {...TOOLTIP} formatter={(v, nome) => [`${v} (${formatPercentual(v / total)})`, nome]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DivisaoVitoriasGrafico;
