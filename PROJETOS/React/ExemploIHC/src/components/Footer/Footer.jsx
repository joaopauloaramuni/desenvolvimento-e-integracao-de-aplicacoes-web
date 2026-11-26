import { useState } from "react";
import { Link } from "react-router-dom";
import { APP } from "../../config/appConfig";
import { restaurarRecursosIniciais } from "../../services/recursoService";
import { restaurarReservasIniciais } from "../../services/reservaService";
import DialogoConfirmacao from "../DialogoConfirmacao/DialogoConfirmacao";
import "./Footer.css";

export default function Footer() {
  const [confirmando, setConfirmando] = useState(false);

  function restaurar() {
    restaurarRecursosIniciais();
    restaurarReservasIniciais();
    window.location.assign("/");
  }

  return (
    <footer className="footer no-print">
      <div className="footer-interno">
        <div>
          <p className="footer-titulo">
            {APP.nome} - {APP.instituicao}
          </p>
          <p className="footer-texto">
            Projeto exemplo da disciplina de {APP.disciplina}. Os dados ficam só no seu navegador.
          </p>
        </div>

        <nav aria-label="Sobre o exemplo">
          <ul className="footer-links">
            <li>
              <Link to="/boas-praticas">Boas práticas aplicadas</Link>
            </li>
            <li>
              <Link to="/guia-de-estilo">Guia de estilo</Link>
            </li>
            <li>
              <button type="button" className="footer-botao" onClick={() => setConfirmando(true)}>
                Restaurar dados de exemplo
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <DialogoConfirmacao
        aberto={confirmando}
        titulo="Restaurar os dados de exemplo?"
        rotuloConfirmar="Restaurar dados"
        onConfirmar={restaurar}
        onCancelar={() => setConfirmando(false)}
      >
        <p>Os recursos e reservas que você criou ou alterou serão apagados deste navegador. Isso não pode ser desfeito.</p>
      </DialogoConfirmacao>
    </footer>
  );
}
