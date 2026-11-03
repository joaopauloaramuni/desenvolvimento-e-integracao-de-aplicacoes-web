import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatData, formatDiaMes, formatNumero } from "../../utils/format";
import { EIXO, TEMA, TOOLTIP } from "./tema";

/** Pontos acumulados de cada jogador, dia de jogo a dia de jogo. */
function EvolucaoGrafico({ evolucao, jogadores }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={evolucao} margin={{ top: 12, right: 16, left: -4, bottom: 0 }}>
        <CartesianGrid stroke={TEMA.grade} vertical={false} />
        <XAxis dataKey="data" {...EIXO} tickFormatter={formatDiaMes} minTickGap={16} />
        <YAxis {...EIXO} tickFormatter={formatNumero} width={56} />
        <Tooltip {...TOOLTIP} cursor={{ stroke: TEMA.eixo, strokeDasharray: "3 3" }} labelFormatter={formatData} formatter={(v, nome) => [formatNumero(v), nome]} />
        <Legend wrapperStyle={{ color: TEMA.eixo, fontSize: 13, paddingTop: 8 }} />
        {jogadores.map((j) => (
          <Line
            key={j.id}
            type="monotone"
            dataKey={j.id}
            name={j.nome}
            stroke={j.cor}
            strokeWidth={2.5}
            dot={{ r: 3, fill: j.cor, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default EvolucaoGrafico;
