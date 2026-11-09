import { useCallback, useMemo, useState } from "react";
import { FiCheck, FiCopy, FiRotateCcw, FiTrash2, FiZap } from "react-icons/fi";
import Banco from "./components/Banco/Banco";
import Campo from "./components/Campo/Campo";
import CartaJogador from "./components/CartaJogador/CartaJogador";
import Elenco from "./components/Elenco/Elenco";
import FichaJogador from "./components/FichaJogador/FichaJogador";
import ForcaTime from "./components/ForcaTime/ForcaTime";
import PageLayout from "./components/PageLayout/PageLayout";
import SeletorEsquema from "./components/SeletorEsquema/SeletorEsquema";
import useArrastar from "./hooks/useArrastar";
import useEscalacao, { localizar } from "./hooks/useEscalacao";
import { getJogador } from "./services/elencoService";
import { calcularForca, escalacaoEmTexto } from "./services/escalacaoService";
import "./App.css";

function App() {
  const { estado, anterior, mover, trocarFormacao, escalarMelhores, limpar, desfazer } = useEscalacao();
  const [selecionado, setSelecionado] = useState(null);
  const [copiado, setCopiado] = useState(false);

  // Soltar o jogador arrastado numa vaga do campo, do banco ou de volta no elenco
  const aoSoltar = useCallback(
    (id, alvo) => {
      mover(id, alvo.tipo === "elenco" ? { tipo: "elenco" } : { tipo: alvo.tipo, i: alvo.i });
      setSelecionado(null);
    },
    [mover]
  );
  const { iniciar, arrasto, foiArrasto } = useArrastar(aoSoltar);

  const forca = useMemo(() => calcularForca(estado.formacao, estado.titulares), [estado.formacao, estado.titulares]);
  const forcaAntes = useMemo(
    () => (anterior ? calcularForca(anterior.formacao, anterior.titulares) : null),
    [anterior]
  );

  // Modo clique: seleciona um jogador e depois clica na vaga (funciona no celular e no teclado)
  const clicarVaga = (destino, ocupante) => {
    if (foiArrasto()) return;
    if (selecionado && selecionado !== ocupante) {
      mover(selecionado, destino);
      setSelecionado(null);
    } else if (ocupante) {
      setSelecionado(selecionado === ocupante ? null : ocupante);
    }
  };

  const selecionarDoElenco = (id) => {
    if (foiArrasto()) return;
    setSelecionado((atual) => (atual === id ? null : id));
  };

  const ondeEsta = (id) => localizar(estado, id);
  const jogadorSelecionado = getJogador(selecionado);

  const mandarParaBanco = () => {
    const livre = estado.reservas.indexOf(null);
    mover(selecionado, { tipo: "reserva", i: livre >= 0 ? livre : estado.reservas.length - 1 });
    setSelecionado(null);
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(escalacaoEmTexto(estado));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* sem permissão para a área de transferência */
    }
  };

  const fantasma = getJogador(arrasto?.id);

  return (
    <PageLayout
      titulo="Escale o Galo"
      descricao="Arraste os jogadores do elenco para o campo e para o banco, troque o esquema e veja na hora se o time ficou mais forte no ataque, no meio ou na defesa."
    >
      <div className={`prancheta ${arrasto ? "is-arrastando" : ""}`}>
        <Elenco
          ondeEsta={ondeEsta}
          selecionado={selecionado}
          arrasto={arrasto}
          onIniciar={iniciar}
          onSelecionar={selecionarDoElenco}
        />

        <section className="prancheta-campo" aria-label="Escalação">
          <div className="barra-acoes">
            <button type="button" className="botao botao--claro" onClick={escalarMelhores}>
              <FiZap aria-hidden="true" /> Escalar melhores
            </button>
            <button type="button" className="botao" onClick={desfazer} disabled={!anterior}>
              <FiRotateCcw aria-hidden="true" /> Desfazer
            </button>
            <button type="button" className="botao" onClick={copiar}>
              {copiado ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />} {copiado ? "Copiada" : "Copiar escalação"}
            </button>
            <button type="button" className="botao botao--perigo" onClick={limpar}>
              <FiTrash2 aria-hidden="true" /> Limpar
            </button>
          </div>

          <Campo
            formacao={estado.formacao}
            titulares={estado.titulares}
            forca={forca}
            antes={forcaAntes}
            selecionado={selecionado}
            arrasto={arrasto}
            onIniciar={iniciar}
            onClicarVaga={clicarVaga}
          />

          <Banco
            reservas={estado.reservas}
            selecionado={selecionado}
            arrasto={arrasto}
            onIniciar={iniciar}
            onClicarVaga={clicarVaga}
          />
        </section>

        <div className="prancheta-painel">
          <div className="painel">
            <SeletorEsquema atual={estado.formacao} onTrocar={trocarFormacao} />
          </div>
          <div className="painel">
            <ForcaTime forca={forca} antes={forcaAntes} ultima={estado.ultima} />
          </div>
          {jogadorSelecionado ? (
            <div className="painel">
              <FichaJogador
                jogador={jogadorSelecionado}
                onde={ondeEsta(selecionado)}
                onBanco={mandarParaBanco}
                onTirar={() => {
                  mover(selecionado, { tipo: "elenco" });
                  setSelecionado(null);
                }}
                onFechar={() => setSelecionado(null)}
              />
            </div>
          ) : (
            <p className="dica">
              Clique num jogador para ver a ficha. A bolinha na carta mostra o encaixe: verde na posição, amarela adaptado,
              vermelha improvisado.
            </p>
          )}
        </div>
      </div>

      {fantasma && (
        <div className="fantasma" style={{ left: arrasto.x, top: arrasto.y }} aria-hidden="true">
          <CartaJogador jogador={fantasma} tamanho="fantasma" />
        </div>
      )}
    </PageLayout>
  );
}

export default App;
