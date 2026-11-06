import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeFileTypes,
  analyzeRepository,
  OperationCancelledError,
  rankContributors,
} from "../../core";
import { GitHubClient } from "../../services/githubClient";
import { formatTime } from "./format";

/**
 * Hook que executa a análise e guarda o estado da tela:
 *
 *   status:   "idle" | "running" | "done" | "error" | "cancelled"
 *   result:   AnalysisResult (ou null)
 *   log:      [{ id, time, message, level }]  — aba "Log de execução"
 *   message:  texto da barra de status
 *   progress: { current, total } | null       — null = barra indeterminada
 *   hasToken: o servidor tem GITHUB_TOKEN?      — null enquanto não sabe
 *
 *   fileTypes:       resultado das abas "Tipos de arquivo" (ou null)
 *   fileTypesStatus: "idle" | "running" | "done" | "error" | "cancelled"
 *
 * A análise roda com async/await, então a página não trava; o botão
 * Cancelar usa um AbortController (o threading.Event do Python).
 */
export default function useContributorStats() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);
  const [message, setMessage] = useState(
    "Pronto. Informe a URL do repositório e clique em Analisar."
  );
  const [progress, setProgress] = useState(null);
  const [hasToken, setHasToken] = useState(null);
  const [fileTypes, setFileTypes] = useState(null);
  const [fileTypesStatus, setFileTypesStatus] = useState("idle");
  const [fileTypesError, setFileTypesError] = useState(null);

  const controllerRef = useRef(null);
  const logId = useRef(0);

  const addLog = useCallback((text, level = "info") => {
    logId.current += 1;
    const entry = { id: logId.current, time: formatTime(), message: text, level };
    setLog((current) => [...current, entry]);
  }, []);

  // Descobre se há token no servidor (para a dica abaixo do formulário)
  useEffect(() => {
    const controller = new AbortController();
    new GitHubClient()
      .fetchStatus(controller.signal)
      .then((s) => setHasToken(s.hasToken))
      .catch(() => setHasToken(null));
    return () => controller.abort();
  }, []);

  // Cancela a análise se o componente sair da tela
  useEffect(() => () => controllerRef.current?.abort(), []);

  const finish = useCallback(
    (text, level, nextStatus) => {
      addLog(text, level);
      setMessage(text);
      setProgress(level === "success" ? { current: 1, total: 1 } : { current: 0, total: 1 });
      setStatus(nextStatus);
      controllerRef.current = null;
    },
    [addLog]
  );

  const start = useCallback(
    async ({ url, criterion, fetchExactDates, allBranches, includeMerges }) => {
      if (controllerRef.current) return; // já está rodando
      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus("running");
      setError(null);
      setProgress(null);
      // Nova análise: os tipos de arquivo da anterior deixam de valer
      setFileTypes(null);
      setFileTypesStatus("idle");
      setFileTypesError(null);
      addLog(`Iniciando análise de ${url.trim()}`);
      setMessage(`Iniciando análise de ${url.trim()}`);

      const onProgress = (event) => {
        addLog(event.message, event.level);
        setMessage(event.message);
        if (event.total) setProgress({ current: event.current ?? 0, total: event.total });
      };

      try {
        const analysis = await analyzeRepository(url, {
          criterion,
          fetchExactDates,
          allBranches,
          includeMerges,
          onProgress,
          signal: controller.signal,
        });
        setResult(analysis);
        finish(
          `Análise de ${analysis.fullName} concluída às ${formatTime()} · ` +
            `${analysis.contributors.length} colaborador(es).`,
          "success",
          "done"
        );
      } catch (err) {
        if (err instanceof OperationCancelledError || controller.signal.aborted) {
          finish("Análise cancelada.", "warning", "cancelled");
        } else {
          setError(err);
          finish(`Erro: ${err.message}`, "error", "error");
        }
      }
    },
    [addLog, finish]
  );

  // Abas "Tipos de arquivo" (por aluno e por grupo): busca os arquivos de cada commit do resultado atual
  const startFileTypes = useCallback(async () => {
    if (controllerRef.current || !result) return;
    const controller = new AbortController();
    controllerRef.current = controller;

    setFileTypesStatus("running");
    setFileTypesError(null);
    setProgress(null);
    addLog(`Iniciando análise de tipos de arquivo de ${result.fullName}`);
    setMessage(`Analisando os tipos de arquivo de ${result.fullName}…`);

    const onProgress = (event) => {
      addLog(event.message, event.level);
      setMessage(event.message);
      if (event.total) setProgress({ current: event.current ?? 0, total: event.total });
    };

    const done = (text, level, nextStatus) => {
      addLog(text, level);
      setMessage(text);
      setProgress(level === "success" ? { current: 1, total: 1 } : { current: 0, total: 1 });
      setFileTypesStatus(nextStatus);
      controllerRef.current = null;
    };

    try {
      const analysis = await analyzeFileTypes(result, { onProgress, signal: controller.signal });
      setFileTypes(analysis);
      done(
        `Tipos de arquivo de ${result.fullName} concluídos às ${formatTime()} · ` +
          `${analysis.analyzed} commit(s) lido(s)${analysis.partial ? " (parcial)" : ""}.`,
        analysis.partial ? "warning" : "success",
        "done"
      );
    } catch (err) {
      if (err instanceof OperationCancelledError || controller.signal.aborted) {
        done("Análise de tipos de arquivo cancelada.", "warning", "cancelled");
      } else {
        setFileTypesError(err);
        done(`Erro: ${err.message}`, "error", "error");
      }
    }
  }, [result, addLog]);

  const cancel = useCallback(() => {
    if (controllerRef.current && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort();
      setMessage("Cancelando…");
    }
  }, []);

  // Reordena localmente: não precisa consultar a API de novo
  const resort = useCallback((criterion) => {
    setResult((current) =>
      current ? current.withContributors(rankContributors(current.contributors, criterion)) : current
    );
  }, []);

  return {
    status,
    running: status === "running" || fileTypesStatus === "running",
    analyzing: status === "running",
    result,
    error,
    log,
    message,
    setMessage,
    progress,
    hasToken,
    addLog,
    start,
    cancel,
    resort,
    fileTypes,
    fileTypesStatus,
    fileTypesError,
    startFileTypes,
  };
}
