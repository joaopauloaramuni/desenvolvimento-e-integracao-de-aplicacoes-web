import Icon from "../Icon/Icon";
import "./DeviceShell.css";
import "./DeviceShellHolo.css";

const LED_TEXTO = {
  off: "Favoritos desligados (Supabase não configurado)",
  loading: "Carregando favoritos",
  saving: "Salvando favorito",
  ok: "Favoritos sincronizados",
  error: "Erro ao falar com o Supabase",
};

/**
 * O aparelho da Pokédex, desenhado só com CSS: carcaça de plástico, sensor,
 * LED de sincronização, botões físicos, tela de vidro, alto-falante e parafusos.
 *
 * - O LED mostra o estado dos favoritos no Supabase.
 * - "Noturno" troca a luz da tela (tema claro/escuro).
 * - "Tema" troca o visual do aparelho: Clássico (CSS) ou Holo (holo-fundo.webp).
 *   No Holo, a lente azul do canto superior esquerdo faz a mesma varredura do sensor.
 * - "Sortear" abre um Pokémon aleatório (o sensor faz uma varredura).
 * - "Fechar" fecha a tampa (a capa PokedexCover volta). bootKey muda a cada vez que
 *   a Pokédex liga, e a tela faz a animação de "ligar" de novo.
 */
export default function DeviceShell({
  theme,
  onToggleTheme,
  skinLabel,
  proximoSkinLabel,
  onToggleSkin,
  onRandom,
  onPowerOff,
  ledStatus,
  bootKey = 0,
  scanKey,
  children,
}) {
  const noturno = theme === "dark";

  return (
    <div className="desk">
      <div className="device">
        <span className="device__grip device__grip--left" aria-hidden="true" />
        <span className="device__grip device__grip--right" aria-hidden="true" />

        <header className="device__top">
          <div className="device__sensor" aria-hidden="true">
            <span key={scanKey} className="device__sweep" />
          </div>

          {/* Lente azul (tema Holo): mesma varredura do sensor, a cada Pokémon sorteado */}
          <div className="device__lens" aria-hidden="true">
            <span key={`brilho-${scanKey}`} className="device__lens-glow" />
            <span className="device__lens-glass">
              <span key={`varredura-${scanKey}`} className="device__lens-sweep" />
            </span>
          </div>

          <h1 className="device__brand">Pokédex</h1>

          <span className="device__led" title={LED_TEXTO[ledStatus]} aria-hidden="true">
            <span className="led" data-status={ledStatus} />
          </span>

          <div className="device__controls">
            {/* Botões da tela (aparência) e do aparelho (ações): no tema Holo cada grupo
                fica num trecho da barra vermelha da imagem */}
            <div className="device__group device__group--tela">
              <button
                type="button"
                className="hw-button hw-button--rubber"
                aria-pressed={noturno}
                aria-label="Modo noturno"
                title="Modo noturno"
                onClick={onToggleTheme}
              >
                <Icon name={noturno ? "moon" : "sun"} />
                <span className="hw-button__label">Noturno</span>
              </button>
              <button
                type="button"
                className="hw-button hw-button--rubber"
                aria-label={`Trocar o tema do aparelho (atual: ${skinLabel})`}
                title={`Tema: ${skinLabel}. Clique para usar o ${proximoSkinLabel}`}
                onClick={onToggleSkin}
              >
                <Icon name="palette" />
                <span className="hw-button__label">Tema</span>
              </button>
            </div>
            <div className="device__group device__group--acao">
              <button
                type="button"
                className="hw-button hw-button--rubber"
                aria-label="Fechar a Pokédex"
                title="Fechar a Pokédex"
                onClick={onPowerOff}
              >
                <Icon name="power" />
                <span className="hw-button__label">Fechar</span>
              </button>
              <button
                type="button"
                className="hw-button hw-button--accent"
                aria-label="Sortear um Pokémon"
                title="Sortear um Pokémon"
                onClick={onRandom}
              >
                <Icon name="dice" />
                <span className="hw-button__label">Sortear</span>
              </button>
            </div>
          </div>
        </header>

        <div className="device__bezel">
          <div
            className="device__screen"
            data-boot={bootKey > 0 ? (bootKey % 2 ? "a" : "b") : undefined}
          >
            {children}
          </div>
        </div>

        <footer className="device__bottom" aria-hidden="true">
          <span className="screw" />
          <span className="device__speaker" />
          <span className="device__engraving">Kanto 151</span>
          <span className="screw" />
        </footer>
      </div>
    </div>
  );
}
