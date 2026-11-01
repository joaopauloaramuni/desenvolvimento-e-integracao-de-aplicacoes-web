import { useId } from "react";

/**
 * Logo do AraInk: uma gota de tinta com o "A" vazado.
 * Usa currentColor, então pega a cor do texto em volta (branco na faixa roxa).
 */
function AraInkLogo({ className = "", title = "Logo AraInk" }) {
  const maskId = `araink-a-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
      <defs>
        <mask id={maskId}>
          <rect width="64" height="64" fill="#fff" />
          <path
            d="M32 25 L24.5 48 M32 25 L39.5 48 M27.4 40 H36.6"
            fill="none"
            stroke="#000"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <path
        d="M32 3 C32 3 11 27 11 40 a21 21 0 0 0 42 0 C53 27 32 3 32 3 Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}

export default AraInkLogo;
