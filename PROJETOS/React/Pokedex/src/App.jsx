import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DeviceShell from "./components/DeviceShell/DeviceShell";
import EmptyState from "./components/EmptyState/EmptyState";
import PokedexCover from "./components/PokedexCover/PokedexCover";
import PokemonDetails from "./components/PokemonDetails/PokemonDetails";
import PokemonList from "./components/PokemonList/PokemonList";
import ScreenTabs from "./components/ScreenTabs/ScreenTabs";
import SearchBar from "./components/SearchBar/SearchBar";
import SortControl from "./components/SortControl/SortControl";
import StatusBar from "./components/StatusBar/StatusBar";
import TrainerList from "./components/TrainerList/TrainerList";
import TypeFilter from "./components/TypeFilter/TypeFilter";
import useFavoritos from "./hooks/useFavoritos";
import usePokedexFilters from "./hooks/usePokedexFilters";
import useSkin from "./hooks/useSkin";
import useTheme from "./hooks/useTheme";
import {
  countByType,
  getAllPokemon,
  getAvailableTypes,
  getPokemonById,
  getTrainers,
  getTrainersOf,
} from "./services/pokedexService";
import "./App.css";

// Dados estáticos do pokedex-data.json: preparados uma vez só.
const TODOS = getAllPokemon();
const TODOS_IDS = TODOS.map((p) => p.id);
const TIPOS = getAvailableTypes();
const TREINADORES = getTrainers();

function plural(n, singular, pluralTexto) {
  return n === 1 ? singular : pluralTexto;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { skinLabel, proximoLabel, toggleSkin } = useSkin();
  const favoritos = useFavoritos();

  const [aba, setAba] = useState("pokedex");
  const [selecao, setSelecao] = useState(null); // { ids, indice } ou null
  const [scanKey, setScanKey] = useState(0);
  const [treinadorDestaque, setTreinadorDestaque] = useState(null);

  // Capa (Pokédex fechada/aberta): "fechada" ao carregar, "abrindo" quando a tampa começa a abrir,
  // "fechando" pelo botão Fechar e null quando a Pokédex está ligada.
  // capaKey remonta a capa a cada Fechar; bootKey refaz a animação da tela a cada vez que liga.
  const [capa, setCapa] = useState("fechada");
  const [capaKey, setCapaKey] = useState(0);
  const [bootKey, setBootKey] = useState(0);

  const conteudoRef = useRef(null);
  const quemAbriuRef = useRef(null);

  // Lista base: a Pokédex inteira ou só os favoritos. Filtros e ordenação valem para as duas.
  const listaBase = useMemo(
    () => (aba === "favoritos" ? TODOS.filter((p) => favoritos.favoriteIds.has(p.id)) : TODOS),
    [aba, favoritos.favoriteIds],
  );
  const filtros = usePokedexFilters(listaBase);
  const contagemPorTipo = useMemo(() => countByType(listaBase), [listaBase]);

  // ---------- Detalhes ----------
  const abrirDetalhes = useCallback((id, ids = TODOS_IDS, indice) => {
    if (!quemAbriuRef.current) quemAbriuRef.current = document.activeElement;
    const posicao = indice ?? ids.indexOf(id);
    setSelecao({ ids, indice: posicao >= 0 ? posicao : 0 });
  }, []);

  const fecharDetalhes = useCallback(() => setSelecao(null), []);

  const irPara = useCallback((delta) => {
    setSelecao((atual) => {
      if (!atual) return atual;
      const indice = atual.indice + delta;
      return indice >= 0 && indice < atual.ids.length ? { ...atual, indice } : atual;
    });
  }, []);
  const irAnterior = useCallback(() => irPara(-1), [irPara]);
  const irProximo = useCallback(() => irPara(1), [irPara]);

  // Ao fechar, o foco volta para o card (ou botão) que abriu os detalhes.
  useEffect(() => {
    if (selecao === null && quemAbriuRef.current) {
      const el = quemAbriuRef.current;
      quemAbriuRef.current = null;
      if (el.isConnected) el.focus({ preventScroll: true });
    }
  }, [selecao]);

  const sortear = useCallback(() => {
    const atualId = selecao ? selecao.ids[selecao.indice] : null;
    let sorteado;
    do {
      sorteado = TODOS[Math.floor(Math.random() * TODOS.length)];
    } while (sorteado.id === atualId && TODOS.length > 1);
    setScanKey((k) => k + 1);
    abrirDetalhes(sorteado.id, TODOS_IDS);
  }, [selecao, abrirDetalhes]);

  // ---------- Capa ----------
  const ligar = useCallback(() => {
    setCapa(null);
    setBootKey((k) => k + 1);
  }, []);
  const abrindoCapa = useCallback(() => setCapa("abrindo"), []);
  const desligar = useCallback(() => {
    setCapaKey((k) => k + 1);
    setCapa("fechando");
  }, []);

  // ---------- Abas ----------
  const trocarAba = useCallback((nova) => {
    setAba(nova);
    setTreinadorDestaque(null);
    conteudoRef.current?.scrollTo({ top: 0 });
  }, []);

  // "Outros do tipo": abre o Pokémon na ordem da Pokédex inteira.
  const abrirRelacionado = useCallback((id) => {
    setSelecao({ ids: TODOS_IDS, indice: TODOS_IDS.indexOf(id) });
  }, []);

  // "Ver os N do tipo X na Pokédex": fecha os detalhes e aplica o filtro.
  const { limpar: limparFiltros, setTipo: aplicarTipo } = filtros;
  const filtrarTipo = useCallback(
    (nomeTipo) => {
      quemAbriuRef.current = null;
      setSelecao(null);
      setAba("pokedex");
      limparFiltros();
      aplicarTipo(nomeTipo);
      conteudoRef.current?.scrollTo({ top: 0 });
    },
    [limparFiltros, aplicarTipo],
  );

  const verTreinador = useCallback((treinadorId) => {
    quemAbriuRef.current = null;
    setSelecao(null);
    setAba("treinadores");
    setTreinadorDestaque(treinadorId);
  }, []);

  const abas = [
    { id: "pokedex", label: "Pokédex", count: TODOS.length, fixo: true },
    { id: "favoritos", label: "Favoritos", count: favoritos.favoriteIds.size },
    { id: "treinadores", label: "Treinadores", count: TREINADORES.length, fixo: true },
  ];

  // ---------- Pokémon aberto nos detalhes ----------
  const idAberto = selecao ? selecao.ids[selecao.indice] : null;
  const pokemonAberto = idAberto != null ? getPokemonById(idAberto) : null;
  const anterior =
    selecao && selecao.indice > 0 ? getPokemonById(selecao.ids[selecao.indice - 1]) : null;
  const proximo =
    selecao && selecao.indice < selecao.ids.length - 1
      ? getPokemonById(selecao.ids[selecao.indice + 1])
      : null;

  // ---------- Texto da contagem e estados vazios ----------
  const n = filtros.resultado.length;
  const nomeTipo = TIPOS.find((t) => t.name === filtros.tipo)?.label;
  let contagem;
  if (aba === "favoritos") {
    contagem = filtros.filtrando
      ? `${n} de ${listaBase.length} ${plural(listaBase.length, "favorito", "favoritos")}`
      : `${n} ${plural(n, "favorito", "favoritos")}`;
  } else {
    contagem = filtros.filtrando ? `${n} de ${TODOS.length} Pokémon` : `${n} Pokémon`;
  }

  // Sem favoritos (ou sem Supabase), os filtros não têm o que filtrar.
  const mostrarFiltros = aba === "pokedex" || listaBase.length > 0;

  function estadoVazio() {
    if (aba === "favoritos" && !favoritos.habilitado) {
      return (
        <EmptyState
          icone="star"
          titulo="Favoritos desativados"
          texto={
            <>
              Preencha <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>{" "}
              no <code>.env.local</code> e reinicie o <code>npm run dev</code>. O passo a passo está
              no README.
            </>
          }
        />
      );
    }
    if (aba === "favoritos" && favoritos.carregando) {
      return <EmptyState icone="star" titulo="Carregando favoritos..." />;
    }
    if (aba === "favoritos" && listaBase.length === 0) {
      return (
        <EmptyState
          icone="star"
          titulo="Você ainda não tem favoritos"
          texto="Toque na estrela de um Pokémon para guardá-lo aqui. Os favoritos ficam salvos no Supabase."
          acao={{ label: "Ver a Pokédex", onClick: () => trocarAba("pokedex") }}
        />
      );
    }

    const busca = filtros.busca.trim();
    let texto = "Confira a grafia ou pesquise pelo número, de 1 a 151.";
    if (!busca && nomeTipo && aba === "favoritos") {
      texto = `Nenhum dos seus favoritos é do tipo ${nomeTipo}.`;
    }
    return (
      <EmptyState
        titulo={busca ? `Nenhum Pokémon encontrado para “${busca}”` : "Nenhum Pokémon encontrado"}
        texto={
          busca && nomeTipo ? `Nada com esse nome ou número no tipo ${nomeTipo}. ${texto}` : texto
        }
        acao={{ label: "Limpar pesquisa e filtro", onClick: filtros.limpar }}
      />
    );
  }

  return (
    <>
      <div className="app-root" inert={capa !== null} data-capa={capa ?? undefined}>
        <DeviceShell
          theme={theme}
          onToggleTheme={toggleTheme}
          skinLabel={skinLabel}
          proximoSkinLabel={proximoLabel}
          onToggleSkin={toggleSkin}
          onRandom={sortear}
          onPowerOff={desligar}
          ledStatus={favoritos.status}
          scanKey={scanKey}
          bootKey={bootKey}
        >
          <div className="screen-viewport">
            <div className="screen-content" ref={conteudoRef} inert={selecao !== null}>
              <ScreenTabs abas={abas} ativa={aba} onTrocar={trocarAba} />

              <div id={`painel-${aba}`} role="tabpanel" aria-labelledby={`aba-${aba}`}>
                {aba === "treinadores" ? (
                  <>
                    <p className="result-count">{TREINADORES.length} treinadores</p>
                    <TrainerList
                      treinadores={TREINADORES}
                      destaqueId={treinadorDestaque}
                      onOpen={abrirDetalhes}
                    />
                  </>
                ) : (
                  <>
                    {mostrarFiltros && (
                      <div className="toolbar">
                        <SearchBar value={filtros.busca} onChange={filtros.setBusca} />
                        <SortControl
                          ordem={filtros.ordem}
                          onOrdenar={filtros.ordenarPor}
                          onInverter={filtros.inverterDirecao}
                        />
                        <TypeFilter
                          tipos={TIPOS}
                          contagem={contagemPorTipo}
                          total={listaBase.length}
                          selecionado={filtros.tipo}
                          onAlternar={filtros.alternarTipo}
                          onLimpar={() => filtros.setTipo(null)}
                        />
                      </div>
                    )}

                    {mostrarFiltros && (
                      <p className="result-count" aria-live="polite">
                        {contagem}
                      </p>
                    )}

                    <PokemonList
                      pokemons={filtros.resultado}
                      favoriteIds={favoritos.favoriteIds}
                      salvando={favoritos.salvando}
                      favoritesEnabled={favoritos.habilitado}
                      onOpen={abrirDetalhes}
                      onToggleFavorite={favoritos.alternarFavorito}
                      vazio={estadoVazio()}
                    />
                  </>
                )}
              </div>
            </div>

            {pokemonAberto && (
              <PokemonDetails
                pokemon={pokemonAberto}
                treinadores={getTrainersOf(pokemonAberto.id)}
                anterior={anterior}
                proximo={proximo}
                posicao={selecao.indice + 1}
                total={selecao.ids.length}
                isFavorite={favoritos.favoriteIds.has(pokemonAberto.id)}
                isSaving={favoritos.salvando.has(pokemonAberto.id)}
                favoritesEnabled={favoritos.habilitado}
                onToggleFavorite={favoritos.alternarFavorito}
                onAnterior={irAnterior}
                onProximo={irProximo}
                onClose={fecharDetalhes}
                onVerTreinador={verTreinador}
                onAbrirPokemon={abrirRelacionado}
                onFiltrarTipo={filtrarTipo}
                tecladoAtivo={capa === null}
              />
            )}
          </div>

          <StatusBar
            status={favoritos.status}
            erro={favoritos.erro}
            totalFavoritos={favoritos.favoriteIds.size}
          />
        </DeviceShell>
      </div>

      {capa && (
        <PokedexCover
          key={capaKey}
          inicio={capa === "fechando" ? "fechando" : "fechada"}
          onAbrindo={abrindoCapa}
          onLigar={ligar}
        />
      )}
    </>
  );
}
