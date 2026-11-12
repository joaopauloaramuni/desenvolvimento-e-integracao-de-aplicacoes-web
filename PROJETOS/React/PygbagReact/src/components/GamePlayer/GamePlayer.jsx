import { useCallback, useEffect, useRef, useState } from "react";
import { gameUrl } from "../../utils/gameUrl.js";
import Icon from "../Icon/Icon.jsx";
import "./GamePlayer.css";

// Mostra um jogo Pygame convertido pelo pygbag.
//
// O pygbag gera um site completo (index.html + <nome>.apk) que roda Python em WebAssembly.
// O jeito mais simples e seguro de colocar isso dentro do React é um <iframe>:
// o jogo fica isolado (CSS, teclado, canvas) e o React só controla quando ele começa.
//
// O <iframe> só é criado depois do clique em "Jogar". Assim a página abre rápido
// (o Python + pygame têm alguns MB) e o clique conta como interação do usuário,
// que o navegador exige para liberar o som.
export default function GamePlayer({ game }) {
  const [ligado, setLigado] = useState(false);
  const [rodada, setRodada] = useState(0); // mudar a key recria o <iframe> = reiniciar
  const [tecladoNoJogo, setTecladoNoJogo] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);
  const molduraRef = useRef(null);
  const iframeRef = useRef(null);

  const src = gameUrl(game.pasta);
  const podeTelaCheia = typeof document !== "undefined" && document.fullscreenEnabled;

  // Dá o foco do teclado para o jogo assim que o index.html do pygbag carrega.
  const focarJogo = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.focus();
    try {
      // mesma origem (o jogo está em public/), então dá para focar o canvas do pygbag
      iframe.contentWindow?.focus();
      iframe.contentDocument?.getElementById("canvas")?.focus();
    } catch {
      // se um dia o jogo vier de outro domínio, o clique do usuário resolve
    }
  }, []);

  // A página perde o foco (blur) quando o usuário clica dentro do <iframe>.
  // Isso diz se as teclas estão indo para o jogo ou para a página.
  useEffect(() => {
    if (!ligado) return undefined;
    const aoSairDaPagina = () =>
      setTimeout(() => setTecladoNoJogo(document.activeElement === iframeRef.current), 0);
    const aoVoltarParaPagina = () => setTecladoNoJogo(false);
    window.addEventListener("blur", aoSairDaPagina);
    window.addEventListener("focus", aoVoltarParaPagina);
    return () => {
      window.removeEventListener("blur", aoSairDaPagina);
      window.removeEventListener("focus", aoVoltarParaPagina);
    };
  }, [ligado]);

  useEffect(() => {
    const atualizar = () => setTelaCheia(document.fullscreenElement === molduraRef.current);
    document.addEventListener("fullscreenchange", atualizar);
    return () => document.removeEventListener("fullscreenchange", atualizar);
  }, []);

  function alternarTelaCheia() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      molduraRef.current?.requestFullscreen().then(focarJogo).catch(() => {});
    }
  }

  function reiniciar() {
    setRodada((r) => r + 1);
  }

  function desligar() {
    if (document.fullscreenElement) document.exitFullscreen();
    setLigado(false);
    setTecladoNoJogo(false);
  }

  return (
    <div className="player">
      <div
        ref={molduraRef}
        className={`player-moldura${telaCheia ? " is-fullscreen" : ""}`}
        style={{ "--proporcao": `${game.largura} / ${game.altura}` }}
      >
        <div className="player-tela">
          {ligado ? (
            <iframe
              key={rodada}
              ref={iframeRef}
              src={src}
              title={`Jogo ${game.titulo}`}
              allow="autoplay; fullscreen; gamepad"
              onLoad={focarJogo}
            />
          ) : (
            <button type="button" className="player-capa" onClick={() => setLigado(true)}>
              <img src={game.capa} alt="" width={game.largura} height={game.altura} />
              <span className="player-jogar">
                <Icon name="play" />
                Jogar
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="player-barra" aria-live="polite">
        {ligado ? (
          <>
            <p className={`player-status${tecladoNoJogo ? " is-ativo" : ""}`}>
              <Icon name="teclado" />
              {tecladoNoJogo ? "Teclado no jogo" : "Clique no jogo para usar o teclado"}
            </p>
            <div className="player-acoes">
              {podeTelaCheia && (
                <button type="button" className="botao" onClick={alternarTelaCheia}>
                  <Icon name="telaCheia" />
                  Tela cheia
                </button>
              )}
              <button type="button" className="botao" onClick={reiniciar}>
                <Icon name="reiniciar" />
                Reiniciar
              </button>
              <button type="button" className="botao" onClick={desligar}>
                <Icon name="parar" />
                Fechar jogo
              </button>
            </div>
          </>
        ) : (
          <p className="player-status">
            O jogo roda no navegador, sem instalar nada. Na primeira vez ele baixa o Python (alguns MB).
          </p>
        )}
      </div>
    </div>
  );
}
