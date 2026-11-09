import { STAT_MAX } from "../../config/appConfig";
import "./StatBar.css";

/**
 * Um atributo: nome, valor e barra.
 * variant="compact" (card): rótulo curto (Atq) com o nome completo para leitores de tela.
 * variant="full" (detalhes): rótulo completo e barra maior, que cresce ao abrir.
 */
export default function StatBar({
  label,
  shortLabel,
  value,
  color,
  variant = "full",
  max = STAT_MAX,
}) {
  const porcentagem = Math.min(100, Math.round((value / max) * 100));

  return (
    <span
      className={`stat stat--${variant}`}
      style={{ "--stat-pct": `${porcentagem}%`, "--stat-color": color }}
    >
      <span className="stat__label">
        {variant === "compact" ? (
          <>
            <span aria-hidden="true">{shortLabel}</span>
            <span className="visually-hidden">{label}</span>
          </>
        ) : (
          label
        )}
      </span>
      <span className="stat__value">{value}</span>
      <span className="stat__track" aria-hidden="true">
        <span className="stat__fill" />
      </span>
    </span>
  );
}
