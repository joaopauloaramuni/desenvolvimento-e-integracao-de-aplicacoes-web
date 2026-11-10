import { SMOKE_COLOR } from "../../config/appConfig";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import SplashCursor from "../reactbits/SplashCursor/SplashCursor";

/**
 * Fumaça do React Bits (SplashCursor) que segue o mouse na home.
 * O componente já usa position: fixed + pointer-events: none, então fica
 * por cima da página sem bloquear cliques.
 * Com "reduzir movimento" ligado no sistema, a fumaça não é desenhada.
 */
const SmokeEffect = () => {
  const reduzir = useReducedMotion();
  if (reduzir) return null;

  return (
    <SplashCursor
      COLOR={SMOKE_COLOR}
      RAINBOW_MODE={false}
      DENSITY_DISSIPATION={3}
      VELOCITY_DISSIPATION={2.2}
      PRESSURE={0.12}
      CURL={4}
      SPLAT_RADIUS={0.22}
      SPLAT_FORCE={5000}
      SHADING={true}
    />
  );
};

export default SmokeEffect;
