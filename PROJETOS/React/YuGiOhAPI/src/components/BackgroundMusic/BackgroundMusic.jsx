import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MUSIC_VOLUME, STORAGE_KEYS } from "../../config/appConfig";
import { gravarStorage, lerStorage } from "../../utils/storage";
import tema from "../../assets/audio/yugioh-theme.mp3";
import Icon from "../Icon/Icon";
import "./BackgroundMusic.css";

const EVENTOS = ["pointerdown", "keydown", "touchstart"];

/**
 * Música de fundo, tocando em loop em todas as páginas.
 *
 * - Tenta tocar sozinha assim que o site abre.
 * - Os navegadores bloqueiam áudio com som antes de a pessoa interagir com a página.
 *   Quando isso acontece, a música começa no primeiro clique, toque ou tecla
 *   (pular a abertura com cartas, por exemplo, já conta).
 * - O botão no canto inferior esquerdo liga e desliga, e a escolha fica salva.
 * - A música entra com um fade-in suave para não assustar.
 */
const BackgroundMusic = () => {
  const { t } = useTranslation();
  const audioRef = useRef(null);
  const botaoRef = useRef(null);
  const fadeRef = useRef(null);
  const [ligada, setLigada] = useState(() => lerStorage(STORAGE_KEYS.music) !== "off");
  const [tocando, setTocando] = useState(false);
  const [bloqueada, setBloqueada] = useState(false);

  const fadeIn = useCallback((audio) => {
    window.clearInterval(fadeRef.current);
    audio.volume = 0;
    const inicio = performance.now();
    // Baseado no relógio (e não em "+x por tick"): leva 1,5 s mesmo se o navegador atrasar os timers.
    fadeRef.current = window.setInterval(() => {
      const progresso = Math.min(1, (performance.now() - inicio) / 1500);
      audio.volume = MUSIC_VOLUME * progresso;
      if (progresso >= 1) window.clearInterval(fadeRef.current);
    }, 50);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    if (!ligada) {
      window.clearInterval(fadeRef.current);
      audio.pause();
      return undefined;
    }

    let ativo = true;
    const tentarTocar = () => {
      if (!audio.paused) return;
      fadeIn(audio);
      audio
        .play()
        .then(() => ativo && setBloqueada(false))
        .catch(() => ativo && setBloqueada(true)); // autoplay bloqueado pelo navegador
    };

    tentarTocar();

    // Primeira interação com a página destrava o áudio.
    // O próprio botão de música é ignorado aqui: ele tem o seu onClick.
    const aoInteragir = (e) => {
      if (botaoRef.current?.contains(e.target)) return;
      tentarTocar();
    };
    EVENTOS.forEach((ev) => window.addEventListener(ev, aoInteragir, { capture: true }));

    return () => {
      ativo = false;
      EVENTOS.forEach((ev) => window.removeEventListener(ev, aoInteragir, { capture: true }));
    };
  }, [ligada, fadeIn]);

  useEffect(() => () => window.clearInterval(fadeRef.current), []);

  const alternar = () => {
    // Clique no botão com a música "ligada" mas bloqueada: toca agora.
    if (ligada && bloqueada) {
      const audio = audioRef.current;
      fadeIn(audio);
      audio.play().then(() => setBloqueada(false)).catch(() => {});
      return;
    }
    const nova = !ligada;
    if (!nova) setBloqueada(false);
    setLigada(nova);
    gravarStorage(STORAGE_KEYS.music, nova ? "on" : "off");
  };

  const rotulo = tocando ? t("music.on") : t("music.off");

  return (
    <div className="music">
      <audio
        ref={audioRef}
        src={tema}
        loop
        preload="auto"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
      />

      <button
        ref={botaoRef}
        type="button"
        className={`music__button${tocando ? " music__button--on" : ""}${bloqueada && ligada ? " music__button--waiting" : ""}`}
        onClick={alternar}
        aria-pressed={tocando}
        aria-label={`${t("music.title")}: ${rotulo}`}
        title={rotulo}
      >
        {tocando ? (
          <span className="music__bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        ) : (
          <Icon name={ligada ? "volume" : "volumeOff"} size={20} />
        )}
      </button>

      {bloqueada && ligada && (
        <p className="music__hint" role="status">
          {t("music.blocked")}
        </p>
      )}
    </div>
  );
};

export default BackgroundMusic;
