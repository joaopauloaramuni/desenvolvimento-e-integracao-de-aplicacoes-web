import "./TypeBadge.css";

/** Selo de um tipo, com a cor do tipo e o nome em pt-BR. */
export default function TypeBadge({ type, size = "md" }) {
  return (
    <span
      className={`type-badge type-badge--${size}`}
      style={{ "--type-color": type.color, "--type-ink": type.ink }}
      title={type.name}
    >
      {type.label}
    </span>
  );
}
