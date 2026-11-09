import { useEffect } from "react";
import TrainerCard from "./TrainerCard";
import "./TrainerList.css";

/**
 * Treinadores do pokedex-data.json.
 * destaqueId: treinador escolhido nos detalhes de um Pokémon; a lista rola até ele.
 */
export default function TrainerList({ treinadores, destaqueId, onOpen }) {
  useEffect(() => {
    if (destaqueId == null) return;
    const el = document.getElementById(`treinador-${destaqueId}`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus({ preventScroll: true });
  }, [destaqueId]);

  return (
    <ul className="trainer-list">
      {treinadores.map((treinador) => (
        <TrainerCard
          key={treinador.id}
          treinador={treinador}
          destacado={treinador.id === destaqueId}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );
}
