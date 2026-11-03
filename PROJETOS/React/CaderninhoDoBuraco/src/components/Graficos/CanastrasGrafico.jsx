import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EIXO, TEMA, TOOLTIP } from "./tema";

/** Canastras de cada jogador, empilhadas por tipo. */
function CanastrasGrafico({ ranking }) {
  const dados = ranking.map((r) => ({ nome: r.jogador.nome, limpas: r.limpas, sujas: r.sujas, reais: r.reais }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={dados} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={TEMA.grade} vertical={false} />
        <XAxis dataKey="nome" {...EIXO} interval={0} />
        <YAxis {...EIXO} allowDecimals={false} />
        <Tooltip {...TOOLTIP} />
        <Legend wrapperStyle={{ color: TEMA.eixo, fontSize: 13, paddingTop: 8 }} />
        <Bar dataKey="limpas" name="Limpas" stackId="c" fill={TEMA.limpa} maxBarSize={64} />
        <Bar dataKey="sujas" name="Sujas" stackId="c" fill={TEMA.suja} maxBarSize={64} />
        <Bar dataKey="reais" name="Reais (Ás a Ás)" stackId="c" fill={TEMA.real} radius={[6, 6, 0, 0]} maxBarSize={64} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CanastrasGrafico;
