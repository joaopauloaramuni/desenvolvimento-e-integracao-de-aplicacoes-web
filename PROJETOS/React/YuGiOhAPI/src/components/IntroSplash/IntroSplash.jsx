import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import logo from "../../assets/images/logo-yugioh.webp";
import verso from "../../assets/images/verso-carta.webp";
import "./IntroSplash.css";

/** Marca no sessionStorage: a abertura aparece uma vez por sessão (aba). */
const CHAVE = "yugioh:intro-seen";
const DURACAO_MS = 3400;
const CARTAS = 7;

function jaViu() {
  try {
    return window.sessionStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

function marcarVisto() {
  try {
    window.sessionStorage.setItem(CHAVE, "1");
  } catch {
    // sem storage: a abertura volta a aparecer ao recarregar
  }
}

/**
 * Abertura da home:
 *  1. as cartas caem empilhadas girando (como o redemoinho do verso)
 *  2. abrem em leque
 *  3. o logo surge com brilho dourado
 *  4. as cartas se espalham e a tela se dissolve, revelando a home
 *
 * Pula com clique, Enter, Esc ou o botão "Pular". Não roda com "reduzir movimento".
 */
const IntroSplash = () => {
  const { t } = useTranslation();
  const reduzir = useReducedMotion();
  const [visivel, setVisivel] = useState(() => !jaViu());
  const [saindo, setSaindo] = useState(false);

  const fechar = useCallback(() => {
    marcarVisto();
    setSaindo(true);
    window.setTimeout(() => setVisivel(false), 450);
  }, []);

  useEffect(() => {
    if (!visivel || reduzir) return undefined;

    // Trava a rolagem enquanto a abertura está na tela.
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const fim = window.setTimeout(() => {
      marcarVisto();
      setVisivel(false);
    }, DURACAO_MS);
    const tecla = (e) => (e.key === "Escape" || e.key === "Enter" || e.key === " ") && fechar();
    window.addEventListener("keydown", tecla);

    return () => {
      window.clearTimeout(fim);
      window.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = overflow;
    };
  }, [visivel, reduzir, fechar]);

  if (!visivel || reduzir) return null;

  const meio = (CARTAS - 1) / 2;

  return (
    <div className={`intro${saindo ? " intro--saindo" : ""}`} onClick={fechar} role="presentation">
      <div className="intro__vortex" aria-hidden="true" />

      <div className="intro__deck" aria-hidden="true">
        {Array.from({ length: CARTAS }, (_, i) => (
          <img
            key={i}
            src={verso}
            alt=""
            className="intro__card"
            width="260"
            height="380"
            style={{
              "--i": i,
              "--offset": i - meio, // -3 … 3: posição no leque
            }}
          />
        ))}
      </div>

      <img src={logo} alt="Yu-Gi-Oh!" className="intro__logo" width="1274" height="446" />

      <p className="intro__hieroglyphs" aria-hidden="true">
        𓂀 𓋹 𓆣 𓁹 𓋹 𓂀
      </p>

      <button
        type="button"
        className="intro__skip"
        onClick={(e) => {
          e.stopPropagation();
          fechar();
        }}
      >
        {t("intro.skip")}
      </button>
    </div>
  );
};

export default IntroSplash;
