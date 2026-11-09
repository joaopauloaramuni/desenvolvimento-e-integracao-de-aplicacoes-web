import { getJogador } from "../../services/elencoService";
import CartaJogador from "../CartaJogador/CartaJogador";
import "./Banco.css";

/** Banco de reservas: vagas data-alvo="reserva:i" */
export default function Banco({ reservas, selecionado, arrasto, onIniciar, onClicarVaga }) {
  const ocupadas = reservas.filter(Boolean).length;

  return (
    <section className="banco" aria-labelledby="banco-titulo">
      <h2 id="banco-titulo" className="secao-titulo">
        Banco <small>{ocupadas} de {reservas.length}</small>
      </h2>
      <div className="banco-vagas">
        {reservas.map((id, i) => {
          const jogador = getJogador(id);
          const chave = `reserva:${i}`;
          return (
            <button
              type="button"
              key={chave}
              className={`banco-vaga ${arrasto?.alvo?.chave === chave ? "is-alvo" : ""} ${arrasto?.id && arrasto.id === id ? "is-origem" : ""}`}
              data-alvo={chave}
              aria-label={jogador ? `Reserva: ${jogador.nome}` : "Vaga livre no banco"}
              onPointerDown={jogador ? (e) => onIniciar(e, jogador.id) : undefined}
              onClick={() => onClicarVaga({ tipo: "reserva", i }, id)}
            >
              {jogador ? (
                <CartaJogador jogador={jogador} tamanho="banco" selecionada={selecionado === id} />
              ) : (
                <span className="banco-livre" aria-hidden="true">+</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
