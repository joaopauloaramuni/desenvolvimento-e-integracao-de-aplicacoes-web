import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMesAno, formatMesCurto } from "../../utils/format";
import { EIXO, TEMA, TOOLTIP } from "./tema";

/** Rodadas ganhas por mês, empilhadas por jogador. */
function VitoriasPorMesGrafico({ vitoriasPorMes, jogadores }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={vitoriasPorMes} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={TEMA.grade} vertical={false} />
        <XAxis dataKey="mes" {...EIXO} tickFormatter={formatMesCurto} />
        <YAxis {...EIXO} allowDecimals={false} />
        <Tooltip {...TOOLTIP} labelFormatter={formatMesAno} />
        <Legend wrapperStyle={{ color: TEMA.eixo, fontSize: 13, paddingTop: 8 }} />
        {jogadores.map((j, i) => (
          <Bar
            key={j.id}
            dataKey={j.id}
            name={j.nome}
            stackId="v"
            fill={j.cor}
            maxBarSize={56}
            radius={i === jogadores.length - 1 ? [6, 6, 0, 0] : 0}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default VitoriasPorMesGrafico;
