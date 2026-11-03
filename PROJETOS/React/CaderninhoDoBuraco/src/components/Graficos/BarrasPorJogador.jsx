import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumero } from "../../utils/format";
import { EIXO, TEMA, TOOLTIP } from "./tema";

/**
 * Uma barra por jogador, na cor dele. Serve para vitórias, média, batidas...
 * dados: [{ nome, cor, valor }]
 */
function BarrasPorJogador({ dados, nomeValor, formatar = formatNumero, altura = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={altura}>
      <BarChart data={dados} margin={{ top: 24, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={TEMA.grade} vertical={false} />
        <XAxis dataKey="nome" {...EIXO} interval={0} />
        <YAxis {...EIXO} allowDecimals={false} tickFormatter={formatar} />
        <Tooltip {...TOOLTIP} formatter={(v) => [formatar(v), nomeValor]} />
        <Bar dataKey="valor" name={nomeValor} radius={[6, 6, 0, 0]} maxBarSize={64}>
          {dados.map((d) => (
            <Cell key={d.nome} fill={d.cor} />
          ))}
          <LabelList dataKey="valor" position="top" fill="#f3ead3" fontSize={13} fontWeight={700} formatter={formatar} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarrasPorJogador;
