import { useState } from "react";
import { FiCalendar, FiCheck, FiPrinter, FiSave, FiX } from "react-icons/fi";
import Alerta from "../../components/Alerta/Alerta";
import Button from "../../components/Button/Button";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina";
import { CampoSelecao, CampoTexto } from "../../components/Campo/Campo";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import {
  CORES,
  CORES_SEMANTICAS,
  DECISOES,
  ESCALA_TIPO,
  ESPACOS,
  PARES_CONTRASTE,
  RAIOS,
  VOZ,
} from "../../config/designSystem";
import usePaginaTitulo from "../../hooks/usePaginaTitulo";
import { nivelWCAG, razaoContraste } from "../../utils/contraste";
import "./GuiaEstilo.css";

const SECOES = [
  ["cores", "Cores"],
  ["contraste", "Contraste"],
  ["tipografia", "Tipografia"],
  ["espacamento", "Espaçamento"],
  ["formas", "Formas"],
  ["componentes", "Componentes"],
  ["voz", "Voz e tom"],
  ["decisoes", "Decisões"],
];

/**
 * Guia de estilo / Design System (Aula 16).
 *
 * Documenta os tokens (cores, tipografia, espaçamento, formas), os
 * componentes com seus estados, a voz e tom e o PORQUÊ de cada decisão.
 * Serve de "handoff": quem desenvolve consulta aqui, e não no Figma.
 * Os componentes mostrados são os mesmos usados nas telas (fonte única).
 */
export default function GuiaEstilo() {
  const tituloRef = usePaginaTitulo("Guia de estilo");
  const [carregando, setCarregando] = useState(false);

  function simularCarregamento() {
    setCarregando(true);
    setTimeout(() => setCarregando(false), 1800);
  }

  return (
    <>
      <CabecalhoPagina
        ref={tituloRef}
        titulo="Guia de estilo"
        descricao="Os tokens e componentes do sistema, com a regra de uso e o motivo de cada escolha."
        trilha={[{ rotulo: "Guia de estilo" }]}
        acoes={
          <Button variante="secundario" icone={FiPrinter} onClick={() => window.print()}>
            Salvar em PDF
          </Button>
        }
      />

      <div className="guia">
        <nav className="guia-indice no-print" aria-label="Seções do guia">
          <p className="guia-indice-titulo">Nesta página</p>
          <ul>
            {SECOES.map(([id, rotulo]) => (
              <li key={id}>
                <a href={`#${id}`}>{rotulo}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="guia-conteudo">
          {/* ------------------------------------------------------------ CORES */}
          <section id="cores" aria-labelledby="t-cores" className="guia-secao">
            <h2 id="t-cores">Cores</h2>
            <p>
              Regra <strong>60-30-10</strong> (Aula 13): 60% neutras, 30% azul PUC e 10% âmbar, reservado à ação
              principal de cada tela.
            </p>

            <div className="guia-6030" role="img" aria-label="Proporção: 60% neutras, 30% azul PUC, 10% âmbar">
              <span style={{ flex: 60 }}>60% neutras</span>
              <span style={{ flex: 30 }}>30% azul</span>
              <span style={{ flex: 10 }}>10%</span>
            </div>

            <ul className="guia-cores">
              {CORES.map((c) => (
                <li key={c.variavel} className="guia-cor">
                  <span className="guia-cor-amostra" style={{ background: `var(${c.variavel})` }} />
                  <div>
                    <p className="guia-cor-nome">
                      {c.nome} <span className="guia-papel">{c.papel}</span>
                    </p>
                    <p className="guia-codigo">
                      {c.hex} · <code>{c.variavel}</code>
                    </p>
                    <p className="guia-uso">{c.uso}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h3>Cores semânticas</h3>
            <p>Sempre acompanhadas de ícone e texto. A cor reforça, mas nunca é a única pista.</p>
            <div className="guia-semanticas">
              {CORES_SEMANTICAS.map((c) => (
                <Alerta key={c.tipo} tipo={c.tipo} titulo={c.nome}>
                  <p>
                    {c.uso} <span className="guia-codigo">{c.texto} sobre {c.fundo}</span>
                  </p>
                </Alerta>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------------- CONTRASTE */}
          <section id="contraste" aria-labelledby="t-contraste" className="guia-secao">
            <h2 id="t-contraste">Contraste (WCAG 2.2)</h2>
            <p>
              Texto normal precisa de pelo menos <strong>4,5:1</strong> (nível AA) e texto grande, de 3:1. As razões
              abaixo são calculadas pelo código em <code>src/utils/contraste.js</code>.
            </p>
            <div className="guia-rolagem">
              <table className="guia-tabela">
                <caption className="sr-only">Pares de cores e razão de contraste</caption>
                <thead>
                  <tr>
                    <th scope="col">Amostra</th>
                    <th scope="col">Onde</th>
                    <th scope="col">Razão</th>
                    <th scope="col">Nível</th>
                  </tr>
                </thead>
                <tbody>
                  {PARES_CONTRASTE.map((p) => {
                    const razao = razaoContraste(p.texto, p.fundo);
                    const nivel = nivelWCAG(razao);
                    const reprovado = razao < 4.5;
                    return (
                      <tr key={p.onde}>
                        <td>
                          <span className="guia-contraste-amostra" style={{ color: p.texto, background: p.fundo }}>
                            Aa
                          </span>
                        </td>
                        <td>
                          {p.onde}
                          <span className="guia-codigo guia-bloco">
                            {p.texto} sobre {p.fundo}
                          </span>
                        </td>
                        <td className="guia-numero">{razao.toFixed(2).replace(".", ",")}:1</td>
                        <td>
                          <span className={`guia-nivel ${reprovado ? "guia-nivel-ruim" : "guia-nivel-bom"}`}>
                            {reprovado ? <FiX aria-hidden="true" /> : <FiCheck aria-hidden="true" />}
                            {nivel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ------------------------------------------------------- TIPOGRAFIA */}
          <section id="tipografia" aria-labelledby="t-tipografia" className="guia-secao">
            <h2 id="t-tipografia">Tipografia</h2>
            <p>
              Uma família, <strong>Montserrat</strong>, com fallback para as fontes do sistema. Corpo com 16px e
              entrelinha 1,5; até cerca de 70 caracteres por linha. Escala modular 1,25 em <code>rem</code>, para
              acompanhar o zoom e o controle A- / A+.
            </p>
            <ul className="guia-tipos">
              {ESCALA_TIPO.map((t) => (
                <li key={t.variavel} className="guia-tipo">
                  <p className="guia-tipo-meta">
                    <strong>{t.nome}</strong>
                    <span className="guia-codigo">
                      {t.tamanho} ({t.px}px) · peso {t.peso} · <code>{t.variavel}</code>
                    </span>
                  </p>
                  <p
                    className="guia-tipo-exemplo"
                    style={{ fontSize: `var(${t.variavel})`, fontWeight: t.peso }}
                    aria-hidden="true"
                  >
                    {t.exemplo}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* ------------------------------------------------------ ESPAÇAMENTO */}
          <section id="espacamento" aria-labelledby="t-espacamento" className="guia-secao">
            <h2 id="t-espacamento">Espaçamento</h2>
            <p>
              Grid de <strong>8 pontos</strong>. Elementos relacionados ficam mais próximos que elementos de grupos
              diferentes (Gestalt: proximidade).
            </p>
            <ul className="guia-espacos">
              {ESPACOS.map((e) => (
                <li key={e.variavel}>
                  <span className="guia-espaco-barra" style={{ width: `var(${e.variavel})` }} aria-hidden="true" />
                  <code>{e.variavel}</code>
                  <span className="guia-numero">{e.px}px</span>
                  <span className="guia-uso">{e.uso}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ----------------------------------------------------------- FORMAS */}
          <section id="formas" aria-labelledby="t-formas" className="guia-secao">
            <h2 id="t-formas">Formas</h2>
            <ul className="guia-raios">
              {RAIOS.map((r) => (
                <li key={r.variavel}>
                  <span className="guia-raio-amostra" style={{ borderRadius: `var(${r.variavel})` }} aria-hidden="true" />
                  <strong>{r.nome}</strong>
                  <span className="guia-codigo">
                    {r.valor} · <code>{r.variavel}</code>
                  </span>
                  <span className="guia-uso">{r.uso}</span>
                </li>
              ))}
            </ul>
            <p className="guia-nota">
              Alvos de toque têm no mínimo <strong>44 × 44px</strong> (<code>--touch-target</code>).
            </p>
          </section>

          {/* ------------------------------------------------------ COMPONENTES */}
          <section id="componentes" aria-labelledby="t-componentes" className="guia-secao">
            <h2 id="t-componentes">Componentes</h2>

            <h3>Botões</h3>
            <p>Uma ação de destaque por tela. Rótulos com verbo que dizem o que acontece.</p>
            <div className="guia-demo">
              <Button variante="destaque" icone={FiCalendar}>Destaque</Button>
              <Button variante="primario" icone={FiSave}>Primário</Button>
              <Button variante="secundario">Secundário</Button>
              <Button variante="fantasma">Fantasma</Button>
              <Button variante="perigo" icone={FiX}>Perigo</Button>
            </div>
            <div className="guia-demo">
              <Button variante="primario" disabled>Desabilitado</Button>
              <Button variante="primario" carregando={carregando} textoCarregando="Salvando…" onClick={simularCarregamento}>
                Clique para ver o carregamento
              </Button>
            </div>

            <h3>Campos</h3>
            <p>Rótulo sempre visível acima, dica abaixo do rótulo, erro com ícone e texto.</p>
            <div className="guia-demo guia-demo-campos">
              <CampoTexto rotulo="Nome" value="Data Show Epson" onChange={() => {}} dica="Como aparece para quem reserva." />
              <CampoTexto rotulo="Código" value="DS CE 1" onChange={() => {}} erro="Use só letras, números e hífen." obrigatorio />
              <CampoSelecao rotulo="Categoria" opcoes={["Áudio", "Visual"]} value="" onChange={() => {}} />
            </div>

            <h3>Selos de situação</h3>
            <div className="guia-demo">
              <StatusBadge status="pendente" />
              <StatusBadge status="confirmada" />
              <StatusBadge status="rejeitada" />
            </div>

            <h3>Ícones</h3>
            <p>
              Biblioteca única (<a href="https://react-icons.github.io/react-icons/icons/fi/">Feather, via react-icons</a>
              ), traço uniforme. Ícone sempre com texto ao lado ou com <code>aria-label</code>; ícone decorativo leva{" "}
              <code>aria-hidden</code>.
            </p>
          </section>

          {/* -------------------------------------------------------- VOZ E TOM */}
          <section id="voz" aria-labelledby="t-voz" className="guia-secao">
            <h2 id="t-voz">Voz e tom</h2>
            <ul className="guia-voz">
              {VOZ.map((v) => (
                <li key={v.faca}>
                  <p className="guia-faca">
                    <FiCheck aria-hidden="true" /> <span className="sr-only">Faça: </span>
                    {v.faca}
                  </p>
                  <p className="guia-evite">
                    <FiX aria-hidden="true" /> <span className="sr-only">Evite: </span>
                    {v.evite}
                  </p>
                  <p className="guia-uso">{v.porque}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* --------------------------------------------------------- DECISÕES */}
          <section id="decisoes" aria-labelledby="t-decisoes" className="guia-secao">
            <h2 id="t-decisoes">Decisões de design</h2>
            <div className="guia-rolagem">
              <table className="guia-tabela">
                <caption className="sr-only">Registro de decisões de design</caption>
                <thead>
                  <tr>
                    <th scope="col">Versão</th>
                    <th scope="col">Decisão</th>
                    <th scope="col">Por quê</th>
                  </tr>
                </thead>
                <tbody>
                  {DECISOES.map((d) => (
                    <tr key={d.decisao}>
                      <td>{d.versao}</td>
                      <td><strong>{d.decisao}</strong></td>
                      <td>{d.porque}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
