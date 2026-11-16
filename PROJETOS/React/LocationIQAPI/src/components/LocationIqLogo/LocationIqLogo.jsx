/**
 * Logo do projeto (feito para este exemplo, não é a marca oficial do LocationIQ):
 * um pino de localização com um alvo dentro e o "anel" no chão, que lembra
 * a precisão de um ponto geocodificado.
 *
 * Usa currentColor: fica branco na faixa azul do <PageLayout />.
 * Tem a mesma "assinatura" dos ícones do react-icons, então entra direto em icon={...}.
 */
const LocationIqLogo = ({ className, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="LocationIQ" fill="currentColor" {...props}>
    {/* Anel no chão (precisão do ponto) */}
    <ellipse cx="32" cy="57" rx="15" ry="4.2" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.55" />

    {/* Pino com o alvo vazado (evenodd: pino, furo, ponto central) */}
    <path
      fillRule="evenodd"
      d="M32 57C24.5 47.5 13 37.5 13 25.5a19 19 0 0 1 38 0C51 37.5 39.5 47.5 32 57Z
         M32 15a10.5 10.5 0 1 0 0 21a10.5 10.5 0 1 0 0-21Z
         M32 21a4.5 4.5 0 1 1 0 9a4.5 4.5 0 1 1 0-9Z"
    />

    {/* Marquinhas de mira no furo */}
    <rect x="31" y="15" width="2" height="3.5" rx="1" />
    <rect x="31" y="32.5" width="2" height="3.5" rx="1" />
    <rect x="21.5" y="24.5" width="3.5" height="2" rx="1" />
    <rect x="39" y="24.5" width="3.5" height="2" rx="1" />
  </svg>
);

export default LocationIqLogo;
