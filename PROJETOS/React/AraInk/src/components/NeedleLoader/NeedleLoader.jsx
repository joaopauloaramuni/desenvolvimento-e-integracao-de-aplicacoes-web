import { heartPath } from "../StyleSelector/StyleArt";
import "./NeedleLoader.css";

const CAMINHO = heartPath(0.9, 50, 48, 120);

/** Enquanto a IA trabalha: a "agulha" contorna o coração, como no decalque. */
function NeedleLoader({ texto }) {
  return (
    <div className="needle-loader" role="status">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d={CAMINHO} className="needle-guide" />
        <path d={CAMINHO} className="needle-ink" pathLength="100" />
      </svg>
      <span>{texto}</span>
    </div>
  );
}

export default NeedleLoader;
